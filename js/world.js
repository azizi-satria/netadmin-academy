// ════════════════════════════════════════════
// WORLD — First-Person 3D Engine (Three.js)
// ════════════════════════════════════════════

const World = (() => {

  let scene, camera, renderer, clock;

  // ── FPS state ─────────────────────────────
  let yaw = 0, pitch = 0;
  let pointerLocked = false;
  const keys = {};
  const SPEED  = 6;
  const EYE_H  = 1.65;

  // ── Room ──────────────────────────────────
  let currentRoom = null;
  let roomObjects = [];
  let interactables = [];
  let animFns = [];

  // ── Callback ──────────────────────────────
  let onInteractCb = null;

  // ══════════════════════════════════════════
  // INIT
  // ══════════════════════════════════════════
  function init(interactCb) {
    onInteractCb = interactCb;

    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('c'), antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(innerWidth, innerHeight);
    renderer.shadowMap.enabled = true;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x05050e);
    scene.fog = new THREE.FogExp2(0x05050e, 0.04);

    camera = new THREE.PerspectiveCamera(80, innerWidth / innerHeight, 0.05, 60);
    camera.position.set(0, EYE_H, 8);

    clock = new THREE.Clock();
    scene.add(new THREE.AmbientLight(0x111133, 0.8));

    setupControls();
    window.addEventListener('resize', () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
    });

    animate();
  }

  // ══════════════════════════════════════════
  // CONTROLS
  // ══════════════════════════════════════════
  function setupControls() {
    const canvas = document.getElementById('c');

    // Click anywhere on game to lock pointer
    document.addEventListener('click', e => {
      if (isUIOpen()) return;
      if (!gameActive()) return;
      canvas.requestPointerLock();
    });

    document.addEventListener('pointerlockchange', () => {
      pointerLocked = document.pointerLockElement === canvas;
      refreshOverlay();
      const ch = document.getElementById('crosshair');
      if (ch) ch.classList.toggle('hidden', !pointerLocked);
    });

    document.addEventListener('mousemove', e => {
      if (!pointerLocked) return;
      yaw   -= e.movementX * 0.0022;
      pitch  = Math.max(-1.2, Math.min(1.2, pitch - e.movementY * 0.0022));
    });

    document.addEventListener('keydown', e => {
      keys[e.code] = true;
      if (e.code === 'KeyE') tryInteract();
      if (e.code === 'Escape') document.exitPointerLock();
    });
    document.addEventListener('keyup', e => { keys[e.code] = false; });
  }

  function refreshOverlay() {
    const el = document.getElementById('click-to-start');
    if (!el) return;
    el.style.display = (!pointerLocked && gameActive() && !isUIOpen()) ? 'flex' : 'none';
  }

  function isUIOpen() {
    return ['dialog-box','inspect-box','term-overlay'].some(
      id => !document.getElementById(id).classList.contains('hidden')
    );
  }

  function gameActive() {
    return !document.getElementById('game-screen').classList.contains('hidden');
  }

  // ══════════════════════════════════════════
  // INTERACT
  // ══════════════════════════════════════════
  function tryInteract() {
    const near = getNearestInteractable();
    if (!near) return;
    if (near.doorFn) { near.doorFn(); return; }
    if (onInteractCb) onInteractCb(near.itype, near.iid);
  }

  function getNearestInteractable() {
    let best = null, bestD = 3.5;
    interactables.forEach(o => {
      const d = camera.position.distanceTo(o.pos);
      if (d < bestD) { bestD = d; best = o; }
    });
    return best;
  }

  function updatePrompt() {
    const el = document.getElementById('interact-prompt');
    if (!el) return;
    const near = pointerLocked ? getNearestInteractable() : null;
    if (near) { el.textContent = '[E]  ' + near.label; el.style.display = 'block'; }
    else el.style.display = 'none';
  }

  // ══════════════════════════════════════════
  // MOVEMENT
  // ══════════════════════════════════════════
  function updateMovement(dt) {
    if (!pointerLocked) return;

    const fwd   = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw));
    const right  = new THREE.Vector3( Math.cos(yaw), 0, -Math.sin(yaw));
    const move   = new THREE.Vector3();

    if (keys['KeyW'] || keys['ArrowUp'])    move.add(fwd);
    if (keys['KeyS'] || keys['ArrowDown'])  move.sub(fwd);
    if (keys['KeyA'] || keys['ArrowLeft'])  move.sub(right);
    if (keys['KeyD'] || keys['ArrowRight']) move.add(right);

    if (move.lengthSq() > 0) {
      move.normalize().multiplyScalar(SPEED * dt);
      const next = camera.position.clone().add(move);
      if (currentRoom) {
        const b = currentRoom.bounds;
        next.x = Math.max(b.x0 + 0.3, Math.min(b.x1 - 0.3, next.x));
        next.z = Math.max(b.z0 + 0.3, Math.min(b.z1 - 0.3, next.z));
      }
      next.y = EYE_H;
      camera.position.copy(next);
    }

    camera.rotation.order = 'YXZ';
    camera.rotation.y = yaw;
    camera.rotation.x = pitch;
  }

  // ══════════════════════════════════════════
  // ANIMATE
  // ══════════════════════════════════════════
  function animate() {
    requestAnimationFrame(animate);
    const dt = Math.min(clock.getDelta(), 0.05);
    updateMovement(dt);
    updatePrompt();
    animFns.forEach(fn => fn(clock.elapsedTime, dt));
    renderer.render(scene, camera);
  }

  // ══════════════════════════════════════════
  // HELPERS
  // ══════════════════════════════════════════
  function addR(obj) { scene.add(obj); roomObjects.push(obj); return obj; }

  function clearRoom() {
    roomObjects.forEach(o => scene.remove(o));
    roomObjects = []; interactables = []; animFns = [];
  }

  function box(w, h, d, col, emCol, emInt) {
    const m = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, d),
      new THREE.MeshStandardMaterial({
        color: col,
        roughness: 0.85, metalness: 0.1,
        emissive:          emCol ? new THREE.Color(emCol) : undefined,
        emissiveIntensity: emInt || 0
      })
    );
    m.receiveShadow = true; m.castShadow = true;
    return m;
  }

  function light(col, intensity, dist, x, y, z) {
    const l = new THREE.PointLight(col, intensity, dist);
    l.position.set(x, y, z);
    return addR(l);
  }

  // ══════════════════════════════════════════
  // CORRIDOR
  // ══════════════════════════════════════════
  function loadCorridor(levelData, doorCb) {
    clearRoom();
    const W = 6, H = 4, L = 24;
    currentRoom = { bounds: { x0:-W/2, x1:W/2, z0:-L/2, z1:L/2 } };

    camera.position.set(0, EYE_H, 8);
    yaw = Math.PI; pitch = 0;

    // Floor / ceiling / walls
    const fl = box(W, 0.1, L, 0x0a0a18); fl.position.set(0, -0.05, 0); addR(fl);
    const ce = box(W, 0.1, L, 0x060610); ce.position.set(0, H, 0);     addR(ce);
    const wL = box(0.15, H, L, 0x0d0d22); wL.position.set(-W/2, H/2, 0); addR(wL);
    const wR = box(0.15, H, L, 0x0d0d22); wR.position.set( W/2, H/2, 0); addR(wR);
    const wB = box(W, H, 0.15, 0x0d0d22); wB.position.set(0, H/2, L/2); addR(wB);

    // Front wall with door hole
    const DW = 1.7, DH = 3.0;
    const sw = (W - DW) / 2;
    const wFL = box(sw, H, 0.15, 0x0d0d22); wFL.position.set(-W/2+sw/2, H/2, -L/2); addR(wFL);
    const wFR = box(sw, H, 0.15, 0x0d0d22); wFR.position.set( W/2-sw/2, H/2, -L/2); addR(wFR);
    const wFT = box(DW, H-DH, 0.15, 0x0d0d22); wFT.position.set(0, DH+(H-DH)/2, -L/2); addR(wFT);

    // Floor grid
    const g = new THREE.GridHelper(L, 28, 0x1a0a3a, 0x0f0820);
    g.position.y = 0.01; addR(g);

    // Ceiling lights
    [-7,-3.5,0,3.5,7].forEach(z => {
      const strip = box(0.22, 0.05, 0.9, 0xccccff, 0x9999ff, 2.5);
      strip.position.set(0, H-0.03, z); addR(strip);
      light(0x8888ff, 2.5, 10, 0, H-0.1, z);
    });

    // Purple wall accents
    [-6,-2,2,6].forEach(z => {
      [-W/2+0.1, W/2-0.1].forEach(x => {
        const s = box(0.04, 1.4, 0.04, 0x7c3aed, 0x7c3aed, 4);
        s.position.set(x, 1.2, z); addR(s);
      });
    });

    // Door frame
    const dfL = box(0.1, DH, 0.25, 0x1a1a3a, 0x3a1a7a, 0.3);
    dfL.position.set(-DW/2-0.05, DH/2, -L/2); addR(dfL);
    const dfR = box(0.1, DH, 0.25, 0x1a1a3a, 0x3a1a7a, 0.3);
    dfR.position.set( DW/2+0.05, DH/2, -L/2); addR(dfR);
    const dfT = box(DW+0.2, 0.1, 0.25, 0x1a1a3a, 0x3a1a7a, 0.3);
    dfT.position.set(0, DH+0.05, -L/2); addR(dfT);

    // Door sign
    const sgn = box(1.4, 0.22, 0.06, 0x002211, 0x00aa55, 1.5);
    sgn.position.set(0, DH+0.32, -L/2+0.1); addR(sgn);

    // Door panel
    const door = box(DW, DH, 0.09, 0x121230, 0x18104a, 0.15);
    door.position.set(0, DH/2, -L/2+0.05);
    scene.add(door); roomObjects.push(door);

    // Handle
    const handle = box(0.06, 0.06, 0.28, 0x5050aa, 0x8888cc, 0.6);
    handle.position.set(DW/2-0.18, DH/2, -L/2+0.18);
    scene.add(handle); roomObjects.push(handle);

    // Door glow
    const dgl = new THREE.PointLight(0x0033ff, 0, 8);
    dgl.position.set(0, DH/2, -L/2-0.5); scene.add(dgl); roomObjects.push(dgl);

    // Door open animation
    let opened = false;
    function openDoor() {
      if (opened) return;
      opened = true;
      const pivot = new THREE.Group();
      pivot.position.set(-DW/2, DH/2, -L/2);
      door.position.set(DW/2, 0, 0);
      handle.position.set(DW/2-0.18, 0, 0.13);
      pivot.add(door); pivot.add(handle);
      scene.add(pivot); roomObjects.push(pivot);
      let p = 0;
      animFns.push((t, dt) => {
        if (p < 1) {
          p = Math.min(1, p + dt * 1.0);
          pivot.rotation.y = p * Math.PI * 0.78;
          dgl.intensity = p * 3;
          if (p >= 1 && doorCb) { const cb = doorCb; doorCb = null; setTimeout(cb, 300); }
        }
      });
    }

    interactables.push({
      pos: new THREE.Vector3(0, EYE_H, -L/2+1),
      itype: 'door', iid: 'door',
      label: 'Buka Pintu Server Room',
      doorFn: openDoor
    });

    // NPCs
    const lobby = levelData.scenes.lobby;
    if (lobby.chars) {
      const npcCols = [0x2563eb, 0x7c3aed, 0x059669];
      lobby.chars.forEach((ch, i) => {
        const npc = makeNPC(-1.5 + i*1.5, 0, 4-i, npcCols[i%3]);
        npc.rotation.y = 0.5;
        interactables.push({
          pos: new THREE.Vector3(-1.5+i*1.5, EYE_H, 4-i),
          itype: 'char', iid: ch.id,
          label: 'Bicara dengan ' + ch.name
        });
      });
    }

    showLoc(lobby.label || 'Lobby');
  }

  // ══════════════════════════════════════════
  // SERVER ROOM
  // ══════════════════════════════════════════
  function loadServerRoom(levelData) {
    clearRoom();
    const W = 12, H = 4, L = 24;
    currentRoom = { bounds: { x0:-W/2, x1:W/2, z0:-L/2, z1:L/2 } };

    camera.position.set(0, EYE_H, 8);
    yaw = Math.PI; pitch = 0;

    // Surfaces
    const fl = box(W, 0.1, L, 0x08080f); fl.position.set(0,-0.05,0); addR(fl);
    const ce = box(W, 0.1, L, 0x060610); ce.position.set(0, H, 0);   addR(ce);
    [-W/2, W/2].forEach(x => { const w=box(0.15,H,L,0x0a0a1e); w.position.set(x,H/2,0); addR(w); });
    [-L/2, L/2].forEach(z => { const w=box(W,H,0.15,0x0a0a1e); w.position.set(0,H/2,z); addR(w); });

    // Grid
    const g = new THREE.GridHelper(L, 25, 0x100830, 0x080520);
    g.position.y = 0.01; addR(g);

    // Ceiling lights
    [-7,-3.5,0,3.5,7].forEach(z => {
      [-2.5,2.5].forEach(x => {
        const s = box(0.18,0.04,1.1,0xaaaaff,0x8888ff,2); s.position.set(x,H-0.03,z); addR(s);
      });
      light(0x5555ff, 1.8, 12, 0, H-0.1, z);
    });

    // Server racks
    for (let z = -8; z <= 8; z += 3) {
      buildRack(-W/2+1.4, z);
      buildRack( W/2-1.4, z);
    }

    // Blue ambient
    addR(new THREE.AmbientLight(0x000833, 1.5));

    // Interactive objects
    const srDef = levelData.scenes.serverroom;
    const items = levelData.items;
    const positions = [
      [-1.5,2],[1.5,2],[0,-1],[-2.5,-3],[2.5,-3],[0,4]
    ];
    if (srDef.objects && items) {
      srDef.objects.forEach((obj, i) => {
        const [x, z] = positions[i] || [0, i-2];
        buildItem(obj, x, z, items[obj.id]);
      });
    }

    // Room NPCs
    if (srDef.chars) {
      srDef.chars.forEach((ch, i) => {
        const npc = makeNPC(3.5, 0, i*2-1, 0x7c3aed);
        npc.rotation.y = -Math.PI/2;
        interactables.push({
          pos: new THREE.Vector3(3.5, EYE_H, i*2-1),
          itype: 'char', iid: ch.id,
          label: 'Bicara dengan ' + ch.name
        });
      });
    }

    showLoc(srDef.label || 'Server Room');
  }

  // ══════════════════════════════════════════
  // SERVER RACK
  // ══════════════════════════════════════════
  function buildRack(x, z) {
    const g = new THREE.Group();
    g.position.set(x, 0, z);
    const body = box(1.7, 3.5, 0.95, 0x0d0d20); body.position.y = 1.75; g.add(body);
    const ledCols = [0x00ff41, 0x06b6d4, 0x00ff41, 0x06b6d4, 0x10b981, 0x00ff41, 0x06b6d4, 0x00ff41];
    for (let i = 0; i < 8; i++) {
      const unit = box(1.55, 0.32, 0.88, 0x111128); unit.position.set(0, 0.3+i*0.41, 0); g.add(unit);
      const led  = box(0.07,0.07,0.07, ledCols[i], ledCols[i], 3);
      led.position.set(-0.7, 0.3+i*0.41, 0.46); g.add(led);
      const spd = 0.5+Math.random()*2.5, off = Math.random()*Math.PI*2;
      animFns.push(t => { led.material.emissiveIntensity = 1.5+Math.sin(t*spd+off)*1.5; });
    }
    addR(g);
  }

  // ══════════════════════════════════════════
  // INTERACTIVE ITEM
  // ══════════════════════════════════════════
  function buildItem(obj, x, z, itemData) {
    const cols = [0x7c3aed,0x06b6d4,0x10b981,0xa855f7,0xf59e0b,0xef4444];
    const col  = cols[Object.keys(itemData||{}).length % cols.length] || cols[0];
    const g    = new THREE.Group(); g.position.set(x, 0, z);
    const ped  = box(0.55, 0.8, 0.55, 0x111125); ped.position.y = 0.4; g.add(ped);
    const ob   = box(0.6, 0.6, 0.6, col, col, 1.2); ob.position.y = 1.1; g.add(ob);
    const gl   = new THREE.PointLight(col, 2, 3.5); gl.position.set(x, 1.3, z); addR(gl);
    animFns.push(t => { const s=1+Math.sin(t*2.2)*0.07; ob.scale.setScalar(s); gl.intensity=1.2+Math.sin(t*2.2)*0.9; });
    addR(g);
    interactables.push({
      pos: new THREE.Vector3(x, EYE_H, z),
      itype: 'item', iid: obj.id,
      label: itemData ? itemData.title : obj.label
    });
  }

  // ══════════════════════════════════════════
  // NPC (visible character in world)
  // ══════════════════════════════════════════
  function makeNPC(x, y, z, col) {
    const g = new THREE.Group(); g.position.set(x, y, z);
    const mk = (w,h,d,c,ec,ei) => { const m=box(w,h,d,c,ec,ei); g.add(m); return m; };
    mk(0.5,0.65,0.3,col,col,0.15).position.y=1.1;   // torso
    mk(0.46,0.46,0.46,0xffcc99).position.y=1.65;      // head
    mk(0.09,0.09,0.06,0x333366,0x4466ff,0.7).position.set(-0.12,1.67,0.23); // eye L
    mk(0.09,0.09,0.06,0x333366,0x4466ff,0.7).position.set( 0.12,1.67,0.23); // eye R
    mk(0.22,0.58,0.27,col).position.set(-0.38,1.05,0); // arm L
    mk(0.22,0.58,0.27,col).position.set( 0.38,1.05,0); // arm R
    mk(0.23,0.62,0.28,0x1e3a5f).position.set(-0.15,0.3,0); // leg L
    mk(0.23,0.62,0.28,0x1a3355).position.set( 0.15,0.3,0); // leg R
    const off = Math.random()*Math.PI*2;
    animFns.push(t => { g.position.y = y + Math.sin(t*1.8+off)*0.04; });
    addR(g); return g;
  }

  // ══════════════════════════════════════════
  // LOC LABEL
  // ══════════════════════════════════════════
  function showLoc(text) {
    const el = document.getElementById('loc-label');
    if (!el || !text) return;
    el.textContent = text;
    el.style.animation = 'none';
    el.classList.remove('hidden');
    void el.offsetHeight;
    el.style.animation = 'fadeLabel 3s forwards';
    setTimeout(() => el.classList.add('hidden'), 3100);
  }

  // ══════════════════════════════════════════
  // PUBLIC
  // ══════════════════════════════════════════
  function loadRoom(roomId, levelData, doorCb) {
    const ov = document.getElementById('fade-overlay');
    ov.style.opacity = 1;
    setTimeout(() => {
      if (roomId === 'lobby') loadCorridor(levelData, doorCb);
      else loadServerRoom(levelData);
      setTimeout(() => { ov.style.opacity = 0; }, 80);
    }, 500);
  }

  function markItemFound(id) {
    interactables = interactables.filter(o => !(o.itype==='item' && o.iid===id));
  }

  function releasePointer() {
    document.exitPointerLock();
    // Show click-to-start so user can re-enter after dialog closes
    setTimeout(refreshOverlay, 100);
  }

  function refreshOverlay() {
    const el = document.getElementById('click-to-start');
    if (!el) return;
    el.style.display = (!pointerLocked && gameActive() && !isUIOpen()) ? 'flex' : 'none';
  }

  return { init, loadRoom, markItemFound, releasePointer, showLoc };

})();
