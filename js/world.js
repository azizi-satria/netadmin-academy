// ════════════════════════════════════════════
// WORLD — Three.js 3D Engine (NetAdmin Academy)
// ════════════════════════════════════════════

const World = (() => {

  // ── Core ──────────────────────────────────
  let scene, camera, renderer, clock;

  // ── Player state ──────────────────────────
  const player = {
    mesh: null,
    pos:  new THREE.Vector3(0, 0, 7),
    rot:  Math.PI,   // facing -Z (toward door)
    moving: false
  };
  const SPEED      = 5.5;
  const PLAYER_H   = 0;   // mesh sits on floor
  const CAM_DIST   = 5;
  const CAM_HEIGHT = 3.5;

  // ── Camera orbit ──────────────────────────
  let camH = 0;          // horizontal orbit angle (locked to player.rot + offset)
  let camV = 0.35;       // vertical tilt (radians)
  let pointerLocked = false;

  // ── Input ─────────────────────────────────
  const keys = {};

  // ── Room ──────────────────────────────────
  let currentRoom   = null;
  let roomMeshes    = [];
  let interactables = [];
  let animFns       = [];

  // ── Callbacks (set by game.js) ────────────
  let onInteractCb  = null;
  let onDoorCb      = null;

  // ─────────────────────────────────────────
  // INIT
  // ─────────────────────────────────────────
  function init(interactCallback) {
    onInteractCb = interactCallback;

    const canvas = document.getElementById('c');

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x05050e);
    scene.fog = new THREE.FogExp2(0x05050e, 0.045);

    camera = new THREE.PerspectiveCamera(72, window.innerWidth / window.innerHeight, 0.05, 80);
    clock  = new THREE.Clock();

    // Global ambient
    scene.add(new THREE.AmbientLight(0x111133, 0.6));

    setupControls(canvas);
    window.addEventListener('resize', onResize);
    animate();
  }

  // ─────────────────────────────────────────
  // CONTROLS
  // ─────────────────────────────────────────
  function setupControls(canvas) {
    function requestLock() {
      if (isUIOpen()) return;
      canvas.requestPointerLock();
    }
    canvas.addEventListener('click', requestLock);

    // Also allow clicking the overlay to start
    const cts = document.getElementById('click-to-start');
    if (cts) cts.addEventListener('click', requestLock);

    document.addEventListener('pointerlockchange', () => {
      pointerLocked = document.pointerLockElement === canvas;
      const el = document.getElementById('click-to-start');
      if (el) el.style.display = pointerLocked ? 'none' : (gameActive() ? 'flex' : 'none');
      const ch = document.getElementById('crosshair');
      if (ch) ch.classList.toggle('hidden', !pointerLocked);
    });

    document.addEventListener('mousemove', e => {
      if (!pointerLocked) return;
      camH -= e.movementX * 0.003;
      camV  = Math.max(0.1, Math.min(0.7, camV - e.movementY * 0.002));
    });

    document.addEventListener('keydown', e => {
      keys[e.code] = true;
      if (e.code === 'KeyE') tryInteract();
      if (e.code === 'Escape') document.exitPointerLock();
    });
    document.addEventListener('keyup', e => { keys[e.code] = false; });
  }

  function isUIOpen() {
    return ['dialog-box','inspect-box','term-overlay'].some(id =>
      !document.getElementById(id).classList.contains('hidden')
    );
  }

  function gameActive() {
    return !document.getElementById('game-screen').classList.contains('hidden');
  }

  // ─────────────────────────────────────────
  // INTERACT
  // ─────────────────────────────────────────
  function tryInteract() {
    if (!pointerLocked) return;
    const near = getNearestInteractable();
    if (!near) return;
    if (near.itype === 'door' && near.doorFn) {
      near.doorFn();
    } else if (onInteractCb) {
      onInteractCb(near.itype, near.iid);
    }
  }

  function getNearestInteractable() {
    let best = null, bestD = 3.2;
    interactables.forEach(obj => {
      const d = player.pos.distanceTo(obj.worldPos);
      if (d < bestD) { bestD = d; best = obj; }
    });
    return best;
  }

  function updateInteractPrompt() {
    const el = document.getElementById('interact-prompt');
    if (!el) return;
    const near = pointerLocked ? getNearestInteractable() : null;
    if (near) {
      el.textContent = '[E]  ' + near.label;
      el.style.display = 'block';
    } else {
      el.style.display = 'none';
    }
  }

  // ─────────────────────────────────────────
  // PLAYER MOVEMENT (third-person)
  // ─────────────────────────────────────────
  function updatePlayer(dt) {
    if (!pointerLocked || !player.mesh) return;

    // Camera-relative movement directions
    const fwd   = new THREE.Vector3(-Math.sin(camH), 0, -Math.cos(camH));
    const right  = new THREE.Vector3( Math.cos(camH), 0, -Math.sin(camH));
    const dir    = new THREE.Vector3();

    if (keys['KeyW'] || keys['ArrowUp'])    dir.add(fwd);
    if (keys['KeyS'] || keys['ArrowDown'])  dir.sub(fwd);
    if (keys['KeyA'] || keys['ArrowLeft'])  dir.sub(right);
    if (keys['KeyD'] || keys['ArrowRight']) dir.add(right);

    player.moving = dir.lengthSq() > 0;

    if (player.moving) {
      dir.normalize();
      player.rot = Math.atan2(dir.x, dir.z);

      const next = player.pos.clone().addScaledVector(dir, SPEED * dt);
      if (currentRoom) {
        const b = currentRoom.bounds;
        next.x = Math.max(b.x0 + 0.5, Math.min(b.x1 - 0.5, next.x));
        next.z = Math.max(b.z0 + 0.5, Math.min(b.z1 - 0.5, next.z));
      }
      player.pos.copy(next);
    }

    player.mesh.position.set(player.pos.x, PLAYER_H, player.pos.z);
    player.mesh.rotation.y = player.rot;

    // Walk bob animation
    const t = clock.elapsedTime;
    if (player.moving) {
      player.mesh.position.y = Math.abs(Math.sin(t * 8)) * 0.04;
    }

    // Third-person camera
    const camX = player.pos.x + Math.sin(camH) * CAM_DIST * Math.cos(camV);
    const camY = PLAYER_H + CAM_HEIGHT + Math.sin(camV) * CAM_DIST;
    const camZ = player.pos.z + Math.cos(camH) * CAM_DIST * Math.cos(camV);
    camera.position.lerp(new THREE.Vector3(camX, camY, camZ), 0.12);
    camera.lookAt(player.pos.x, PLAYER_H + 1.5, player.pos.z);
  }

  // ─────────────────────────────────────────
  // ANIMATE
  // ─────────────────────────────────────────
  function animate() {
    requestAnimationFrame(animate);
    const dt = Math.min(clock.getDelta(), 0.05);
    const t  = clock.elapsedTime;

    updatePlayer(dt);
    updateInteractPrompt();
    animFns.forEach(fn => fn(t, dt));

    renderer.render(scene, camera);
  }

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // ─────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────
  function mkBox(w, h, d, color, emissive, emissInt) {
    const geo = new THREE.BoxGeometry(w, h, d);
    const mat = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.8, metalness: 0.15,
      emissive:          emissive  ? new THREE.Color(emissive)  : undefined,
      emissiveIntensity: emissInt  || 0
    });
    const m = new THREE.Mesh(geo, mat);
    m.castShadow    = true;
    m.receiveShadow = true;
    return m;
  }

  function addR(obj) { scene.add(obj); roomMeshes.push(obj); return obj; }

  function clearRoom() {
    roomMeshes.forEach(o => scene.remove(o));
    roomMeshes    = [];
    interactables = [];
    animFns       = [];
  }

  // ─────────────────────────────────────────
  // PLAYER CHARACTER (Roblox-like blocks)
  // ─────────────────────────────────────────
  function makePlayer() {
    if (player.mesh) scene.remove(player.mesh);
    const g = new THREE.Group();

    // Torso
    const torso = mkBox(0.55, 0.65, 0.32, 0x2563eb, 0x1a40a0, 0.1);
    torso.position.y = 1.15;
    g.add(torso);

    // Head
    const head = mkBox(0.5, 0.5, 0.5, 0xffcc99, null, 0);
    head.position.y = 1.7;
    g.add(head);

    // Eyes
    [-0.13, 0.13].forEach(x => {
      const eye = mkBox(0.08, 0.08, 0.06, 0x222266, 0x4444ff, 0.5);
      eye.position.set(x, 1.72, 0.24);
      g.add(eye);
    });

    // Arms
    [-0.42, 0.42].forEach((x, i) => {
      const arm = mkBox(0.22, 0.6, 0.28, i === 0 ? 0x1d4ed8 : 0x1d4ed8, null, 0);
      arm.position.set(x, 1.05, 0);
      g.add(arm);
    });

    // Legs
    [-0.17, 0.17].forEach((x, i) => {
      const leg = mkBox(0.24, 0.65, 0.3, i === 0 ? 0x1e3a5f : 0x1a3355, null, 0);
      leg.position.set(x, 0.32, 0);
      g.add(leg);
    });

    // Feet
    [-0.17, 0.17].forEach(x => {
      const foot = mkBox(0.26, 0.12, 0.36, 0x111111, null, 0);
      foot.position.set(x, 0, 0.04);
      g.add(foot);
    });

    scene.add(g);
    player.mesh = g;
    return g;
  }

  // ─────────────────────────────────────────
  // NPC CHARACTER
  // ─────────────────────────────────────────
  function makeNPC(x, z, color, name) {
    const g = new THREE.Group();
    g.position.set(x, 0, z);

    const torsoC = color || 0x7c3aed;
    const torso = mkBox(0.55, 0.65, 0.32, torsoC, torsoC, 0.15);
    torso.position.y = 1.15;
    g.add(torso);

    const head = mkBox(0.5, 0.5, 0.5, 0xffddaa, null, 0);
    head.position.y = 1.7;
    g.add(head);

    [-0.13, 0.13].forEach(x2 => {
      const eye = mkBox(0.08, 0.08, 0.06, 0x222244, 0x6644ff, 0.6);
      eye.position.set(x2, 1.72, 0.24);
      g.add(eye);
    });

    [-0.42, 0.42].forEach(x2 => {
      const arm = mkBox(0.22, 0.6, 0.28, torsoC, null, 0);
      arm.position.set(x2, 1.05, 0);
      g.add(arm);
    });

    [-0.17, 0.17].forEach(x2 => {
      const leg = mkBox(0.24, 0.65, 0.3, 0x333366, null, 0);
      leg.position.set(x2, 0.32, 0);
      g.add(leg);
    });

    // Bob animation
    const offset = Math.random() * Math.PI * 2;
    animFns.push(t => {
      g.position.y = Math.sin(t * 1.8 + offset) * 0.04;
    });

    addR(g);
    return g;
  }

  // ─────────────────────────────────────────
  // CORRIDOR ROOM
  // ─────────────────────────────────────────
  function loadCorridor(levelData, doorCallback) {
    clearRoom();
    onDoorCb = doorCallback;

    const W = 7, H = 4.5, L = 22;
    currentRoom = { type:'corridor', bounds:{ x0:-W/2, x1:W/2, z0:-L/2, z1:L/2 } };

    // Spawn player
    makePlayer();
    player.pos.set(0, 0, 8);
    player.rot = Math.PI;
    camH = Math.PI;

    // ── Floor ─────────────────────────────
    const floor = mkBox(W, 0.15, L, 0x0a0a18, null, 0);
    floor.position.set(0, -0.075, 0);
    floor.receiveShadow = true;
    addR(floor);

    // Floor grid
    const grid = new THREE.GridHelper(L, 30, 0x1a0a3a, 0x0f0820);
    grid.position.y = 0.01;
    addR(grid);

    // Ceiling
    const ceil = mkBox(W, 0.15, L, 0x060612, null, 0);
    ceil.position.set(0, H, 0);
    addR(ceil);

    // Left wall
    const wL = mkBox(0.2, H, L, 0x0e0e22, null, 0);
    wL.position.set(-W/2, H/2, 0);
    addR(wL);

    // Right wall
    const wR = mkBox(0.2, H, L, 0x0e0e22, null, 0);
    wR.position.set(W/2, H/2, 0);
    addR(wR);

    // Back wall (player enters from here)
    const wBack = mkBox(W, H, 0.2, 0x0e0e22, null, 0);
    wBack.position.set(0, H/2, L/2);
    addR(wBack);

    // Front wall (with door hole): two side pieces + top piece
    const doorW = 1.8, doorH = 3.2;
    const sideW = (W - doorW) / 2;
    const wFL = mkBox(sideW, H, 0.2, 0x0e0e22, null, 0);
    wFL.position.set(-W/2 + sideW/2, H/2, -L/2);
    addR(wFL);
    const wFR = mkBox(sideW, H, 0.2, 0x0e0e22, null, 0);
    wFR.position.set(W/2 - sideW/2, H/2, -L/2);
    addR(wFR);
    const wFTop = mkBox(doorW, H - doorH, 0.2, 0x0e0e22, null, 0);
    wFTop.position.set(0, doorH + (H - doorH) / 2, -L/2);
    addR(wFTop);

    // ── Ceiling lights ─────────────────────
    for (let z = -7; z <= 7; z += 3.5) {
      const strip = mkBox(0.25, 0.06, 1.0, 0xccccff, 0x9999ff, 2);
      strip.position.set(0, H - 0.04, z);
      addR(strip);
      const pl = new THREE.PointLight(0x8888ff, 1.8, 9);
      pl.position.set(0, H - 0.1, z);
      addR(pl);
    }

    // ── Wall accent strips ─────────────────
    for (let z = -6; z <= 6; z += 4) {
      [W/2 - 0.11, -W/2 + 0.11].forEach(x => {
        const strip = mkBox(0.05, 1.2, 0.05, 0x7c3aed, 0x7c3aed, 3);
        strip.position.set(x, 1.2, z);
        addR(strip);
      });
    }

    // ── Door ───────────────────────────────
    // Frame
    const fL = mkBox(0.12, doorH, 0.3, 0x1a1a3a, 0x2a1a5a, 0.2);
    fL.position.set(-doorW/2 - 0.06, doorH/2, -L/2);
    addR(fL);
    const fR = mkBox(0.12, doorH, 0.3, 0x1a1a3a, 0x2a1a5a, 0.2);
    fR.position.set(doorW/2 + 0.06, doorH/2, -L/2);
    addR(fR);
    const fT = mkBox(doorW + 0.24, 0.12, 0.3, 0x1a1a3a, 0x2a1a5a, 0.2);
    fT.position.set(0, doorH + 0.06, -L/2);
    addR(fT);

    // Door sign
    const sign = mkBox(1.5, 0.25, 0.06, 0x003322, 0x00aa66, 1.2);
    sign.position.set(0, doorH + 0.35, -L/2 + 0.12);
    addR(sign);

    // Door panel (will animate open)
    const doorPanel = mkBox(doorW, doorH, 0.1, 0x121230, 0x1a1040, 0.1);
    doorPanel.position.set(0, doorH/2, -L/2 + 0.05);
    scene.add(doorPanel);
    roomMeshes.push(doorPanel);

    // Door handle
    const handle = mkBox(0.06, 0.06, 0.3, 0x6060aa, 0x8888cc, 0.5);
    handle.position.set(doorW/2 - 0.2, doorH/2, -L/2 + 0.2);
    scene.add(handle);
    roomMeshes.push(handle);

    // Door glow light (turns on when open)
    const doorLight = new THREE.PointLight(0x0044ff, 0, 8);
    doorLight.position.set(0, 2, -L/2 - 1);
    scene.add(doorLight);
    roomMeshes.push(doorLight);

    // Door open animation
    let doorOpened = false;
    function openDoor() {
      if (doorOpened) return;
      doorOpened = true;
      let progress = 0;
      const pivot = new THREE.Group();
      pivot.position.set(-doorW/2, doorH/2, -L/2);
      doorPanel.position.set(doorW/2, 0, 0);
      handle.position.set(doorW/2 - 0.2, 0, 0.15);
      pivot.add(doorPanel);
      pivot.add(handle);
      scene.add(pivot);
      roomMeshes.push(pivot);

      animFns.push((t, dt) => {
        if (progress < 1) {
          progress = Math.min(1, progress + dt * 1.1);
          pivot.rotation.y = progress * Math.PI * 0.78;
          doorLight.intensity = progress * 2.5;
        } else if (doorCallback) {
          const cb = doorCallback;
          onDoorCb = null;
          doorCallback = null;
          cb();
        }
      });
    }

    // Register door interactable
    const doorWorldPos = new THREE.Vector3(0, 1.5, -L/2 + 1);
    interactables.push({
      worldPos: doorWorldPos,
      itype: 'door',
      iid: 'door',
      label: 'Buka Pintu Server Room',
      doorFn: openDoor
    });

    // ── NPCs in corridor ──────────────────
    const lobbyDef = levelData.scenes.lobby;
    if (lobbyDef.chars) {
      const npcColors = [0x2563eb, 0x7c3aed, 0x059669, 0xdc2626];
      lobbyDef.chars.forEach((ch, i) => {
        const npc = makeNPC(-1.5, 3 - i * 1.5, npcColors[i % npcColors.length], ch.name);
        npc.rotation.y = -0.4;
        interactables.push({
          worldPos: new THREE.Vector3(-1.5, 0, 3 - i * 1.5),
          itype: 'char',
          iid: ch.id,
          label: 'Bicara dengan ' + ch.name
        });
      });
    }

    showLocLabel(lobbyDef.label || 'Lobby');
  }

  // ─────────────────────────────────────────
  // SERVER ROOM
  // ─────────────────────────────────────────
  function loadServerRoom(levelData) {
    clearRoom();

    const W = 13, H = 4.5, L = 22;
    currentRoom = { type:'serverroom', bounds:{ x0:-W/2, x1:W/2, z0:-L/2, z1:L/2 } };

    makePlayer();
    player.pos.set(0, 0, 7);
    player.rot = Math.PI;
    camH = Math.PI;

    // ── Surfaces ──────────────────────────
    const floor = mkBox(W, 0.15, L, 0x080814, null, 0);
    floor.position.set(0, -0.075, 0);
    floor.receiveShadow = true;
    addR(floor);

    const grid = new THREE.GridHelper(L, 25, 0x100830, 0x080520);
    grid.position.y = 0.01;
    addR(grid);

    const ceil = mkBox(W, 0.15, L, 0x060610, null, 0);
    ceil.position.set(0, H, 0);
    addR(ceil);

    [-W/2, W/2].forEach(x => {
      const wall = mkBox(0.2, H, L, 0x0a0a1e, null, 0);
      wall.position.set(x, H/2, 0);
      addR(wall);
    });
    [L/2, -L/2].forEach(z => {
      const wall = mkBox(W, H, 0.2, 0x0a0a1e, null, 0);
      wall.position.set(0, H/2, z);
      addR(wall);
    });

    // ── Ceiling lights ─────────────────────
    for (let z = -7; z <= 7; z += 3.5) {
      [-2.5, 2.5].forEach(x => {
        const strip = mkBox(0.2, 0.05, 1.2, 0xaaaaff, 0x8888ff, 1.8);
        strip.position.set(x, H - 0.04, z);
        addR(strip);
      });
      const pl = new THREE.PointLight(0x6666ff, 1.4, 11);
      pl.position.set(0, H - 0.1, z);
      addR(pl);
    }

    // ── Server racks ───────────────────────
    for (let z = -7; z <= 7; z += 2.8) {
      buildRack(-W/2 + 1.5, z);
      buildRack( W/2 - 1.5, z);
    }

    // ── Interactive objects ────────────────
    const srDef = levelData.scenes.serverroom;
    const items = levelData.items;
    const objPositions = [
      {x:-1.5, z: 1}, {x: 1.5, z: 1},
      {x: 0,   z:-1}, {x:-2.5, z:-3},
      {x: 2.5, z:-3}, {x: 0,   z: 4}
    ];

    if (srDef.objects && items) {
      srDef.objects.forEach((obj, i) => {
        const pos = objPositions[i] || {x:(i%3-1)*2.5, z:i-3};
        buildInteractive(obj, pos.x, pos.z, items[obj.id]);
      });
    }

    // ── Room NPCs ─────────────────────────
    if (srDef.chars) {
      srDef.chars.forEach((ch, i) => {
        const npc = makeNPC(3, -1 + i * 2, 0x7c3aed, ch.name);
        npc.rotation.y = -Math.PI / 2;
        interactables.push({
          worldPos: new THREE.Vector3(3, 0, -1 + i * 2),
          itype: 'char',
          iid: ch.id,
          label: 'Bicara dengan ' + ch.name
        });
      });
    }

    // Blue ambient tint for server room
    const blueAmb = new THREE.AmbientLight(0x000833, 1.2);
    addR(blueAmb);

    showLocLabel(srDef.label || 'Server Room');
  }

  // ── Server rack builder ────────────────
  function buildRack(x, z) {
    const g = new THREE.Group();
    g.position.set(x, 0, z);

    // Rack body
    const body = mkBox(1.8, 3.6, 1.0, 0x0d0d20, 0x0a0a1a, 0.05);
    body.position.y = 1.8;
    g.add(body);

    // Unit slots with LEDs
    const ledColors = [0x00ff41, 0x06b6d4, 0x00ff41, 0x06b6d4, 0x10b981, 0x00ff41, 0x06b6d4, 0x00ff41];
    for (let i = 0; i < 8; i++) {
      const unit = mkBox(1.6, 0.35, 0.85, 0x111128, null, 0);
      unit.position.set(0, 0.3 + i * 0.42, 0);
      g.add(unit);

      const led = mkBox(0.07, 0.07, 0.07, ledColors[i], ledColors[i], 3);
      led.position.set(-0.72, 0.3 + i * 0.42, 0.46);
      g.add(led);

      const spd = 0.4 + Math.random() * 2.5;
      const off = Math.random() * Math.PI * 2;
      animFns.push(t => {
        led.material.emissiveIntensity = 1.5 + Math.sin(t * spd + off) * 1.5;
      });
    }

    addR(g);
  }

  // ── Interactive object builder ─────────
  function buildInteractive(obj, x, z, itemData) {
    const palette = [0x7c3aed, 0x06b6d4, 0x10b981, 0xa855f7, 0xf59e0b, 0xef4444];
    const col = palette[Object.keys(itemData || {}).length % palette.length]
      || palette[Math.floor(Math.random() * palette.length)];

    const g = new THREE.Group();
    g.position.set(x, 0, z);

    // Pedestal
    const ped = mkBox(0.6, 0.9, 0.6, 0x111125, null, 0);
    ped.position.y = 0.45;
    g.add(ped);

    // Object box (glowing)
    const obox = mkBox(0.65, 0.65, 0.65, col, col, 1.2);
    obox.position.y = 1.22;
    g.add(obox);

    // Glow light
    const gl = new THREE.PointLight(col, 1.8, 3.5);
    gl.position.set(x, 1.4, z);
    addR(gl);

    // Pulse animation
    animFns.push(t => {
      const s = 1 + Math.sin(t * 2.2) * 0.07;
      obox.scale.setScalar(s);
      gl.intensity = 1.2 + Math.sin(t * 2.2) * 0.8;
    });

    addR(g);

    interactables.push({
      worldPos: new THREE.Vector3(x, 0, z),
      itype: 'item',
      iid:   obj.id,
      label: itemData ? itemData.title : obj.label
    });
  }

  // ─────────────────────────────────────────
  // LOC LABEL
  // ─────────────────────────────────────────
  function showLocLabel(text) {
    const el = document.getElementById('loc-label');
    if (!el || !text) return;
    el.textContent = text;
    el.style.animation = 'none';
    el.classList.remove('hidden');
    void el.offsetHeight;
    el.style.animation = 'fadeLabel 3s forwards';
    setTimeout(() => el.classList.add('hidden'), 3100);
  }

  // ─────────────────────────────────────────
  // FADE + LOAD ROOM
  // ─────────────────────────────────────────
  function loadRoom(roomId, levelData, doorCb) {
    const overlay = document.getElementById('fade-overlay');
    overlay.style.opacity = 1;
    setTimeout(() => {
      if (roomId === 'lobby') loadCorridor(levelData, doorCb);
      else                    loadServerRoom(levelData);
      setTimeout(() => { overlay.style.opacity = 0; }, 80);
    }, 550);
  }

  function markItemFound(id) {
    // Remove interactable so prompt stops showing
    interactables = interactables.filter(i => !(i.itype === 'item' && i.iid === id));
  }

  function releasePointer() { document.exitPointerLock(); }

  return { init, loadRoom, markItemFound, releasePointer, showLocLabel };

})();
