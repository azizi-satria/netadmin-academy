// ════════════════════════════════════════════
// WORLD — FPS 3D Engine + Enhanced Graphics
// ════════════════════════════════════════════

const World = (() => {

  let scene, camera, renderer, composer, clock;

  // ── FPS ───────────────────────────────────
  let yaw = 0, pitch = 0, pointerLocked = false;
  const keys = {};
  const SPEED = 6, EYE_H = 1.65;

  // ── Room ──────────────────────────────────
  let currentRoom = null, roomObjects = [], interactables = [], animFns = [];
  let onInteractCb = null;

  // ══════════════════════════════════════════
  // INIT
  // ══════════════════════════════════════════
  function init(cb) {
    onInteractCb = cb;
    const canvas = document.getElementById('c');

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(innerWidth, innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.outputEncoding = THREE.sRGBEncoding;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x05050e);
    scene.fog = new THREE.FogExp2(0x05050e, 0.038);

    camera = new THREE.PerspectiveCamera(80, innerWidth / innerHeight, 0.05, 60);
    camera.position.set(0, EYE_H, 8);

    clock = new THREE.Clock();
    scene.add(new THREE.AmbientLight(0x0a0a22, 1.2));

    // ── Bloom post-processing ─────────────
    const renderPass  = new THREE.RenderPass(scene, camera);
    const bloomPass   = new THREE.UnrealBloomPass(
      new THREE.Vector2(innerWidth, innerHeight),
      1.4,   // strength
      0.5,   // radius
      0.25   // threshold
    );
    composer = new THREE.EffectComposer(renderer);
    composer.addPass(renderPass);
    composer.addPass(bloomPass);

    setupControls(canvas);
    window.addEventListener('resize', () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
      composer.setSize(innerWidth, innerHeight);
    });

    animate();
  }

  // ══════════════════════════════════════════
  // CONTROLS
  // ══════════════════════════════════════════
  function setupControls(canvas) {
    document.addEventListener('click', () => {
      if (isUIOpen() || !gameActive()) return;
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
      pitch  = Math.max(-1.1, Math.min(1.1, pitch - e.movementY * 0.0022));
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
    if (el) el.style.display = (!pointerLocked && gameActive() && !isUIOpen()) ? 'flex' : 'none';
  }
  function isUIOpen() {
    return ['dialog-box','inspect-box','term-overlay'].some(
      id => !document.getElementById(id).classList.contains('hidden'));
  }
  function gameActive() {
    return !document.getElementById('game-screen').classList.contains('hidden');
  }

  // ══════════════════════════════════════════
  // INTERACT
  // ══════════════════════════════════════════
  function tryInteract() {
    const n = getNear();
    if (!n) return;
    if (n.doorFn) { n.doorFn(); return; }
    if (onInteractCb) onInteractCb(n.itype, n.iid);
  }
  function getNear() {
    let best = null, d = 3.5;
    interactables.forEach(o => {
      const dd = camera.position.distanceTo(o.pos);
      if (dd < d) { d = dd; best = o; }
    });
    return best;
  }
  function updatePrompt() {
    const el = document.getElementById('interact-prompt');
    if (!el) return;
    const n = pointerLocked ? getNear() : null;
    if (n) { el.textContent = '[E]  ' + n.label; el.style.display = 'block'; }
    else el.style.display = 'none';
  }

  // ══════════════════════════════════════════
  // MOVEMENT
  // ══════════════════════════════════════════
  function updateMovement(dt) {
    if (!pointerLocked) return;
    const fwd  = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw));
    const rgt  = new THREE.Vector3( Math.cos(yaw), 0, -Math.sin(yaw));
    const dir  = new THREE.Vector3();
    if (keys['KeyW']||keys['ArrowUp'])    dir.add(fwd);
    if (keys['KeyS']||keys['ArrowDown'])  dir.sub(fwd);
    if (keys['KeyA']||keys['ArrowLeft'])  dir.sub(rgt);
    if (keys['KeyD']||keys['ArrowRight']) dir.add(rgt);
    if (dir.lengthSq() > 0) {
      dir.normalize().multiplyScalar(SPEED * dt);
      const nx = camera.position.clone().add(dir);
      if (currentRoom) {
        const b = currentRoom.bounds;
        nx.x = Math.max(b.x0+0.3, Math.min(b.x1-0.3, nx.x));
        nx.z = Math.max(b.z0+0.3, Math.min(b.z1-0.3, nx.z));
      }
      nx.y = EYE_H;
      camera.position.copy(nx);
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
    composer.render();
  }

  // ══════════════════════════════════════════
  // TEXTURES
  // ══════════════════════════════════════════
  function makeFloorTex() {
    const c = document.createElement('canvas'); c.width = c.height = 512;
    const x = c.getContext('2d');
    x.fillStyle = '#090910'; x.fillRect(0,0,512,512);
    // Tile grid
    x.strokeStyle = 'rgba(90,60,200,0.25)'; x.lineWidth = 1.5;
    for (let i = 0; i <= 512; i += 64) {
      x.beginPath(); x.moveTo(i,0); x.lineTo(i,512); x.stroke();
      x.beginPath(); x.moveTo(0,i); x.lineTo(512,i); x.stroke();
    }
    // Tile sheen
    x.fillStyle = 'rgba(80,60,180,0.04)';
    for (let r = 0; r < 8; r++) for (let cc = 0; cc < 8; cc++) {
      if ((r+cc)%2===0) x.fillRect(cc*64, r*64, 64, 64);
    }
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(6,12);
    return t;
  }

  function makeWallTex() {
    const c = document.createElement('canvas'); c.width = c.height = 512;
    const x = c.getContext('2d');
    x.fillStyle = '#0d0d20'; x.fillRect(0,0,512,512);
    // Horizontal panel lines
    x.strokeStyle = 'rgba(120,80,255,0.18)'; x.lineWidth = 1.5;
    for (let i = 0; i <= 512; i += 80) {
      x.beginPath(); x.moveTo(0,i); x.lineTo(512,i); x.stroke();
    }
    // Subtle rivets
    x.fillStyle = 'rgba(150,100,255,0.12)';
    for (let r = 40; r < 512; r += 80) for (let cc = 30; cc < 512; cc += 120) {
      x.beginPath(); x.arc(cc, r, 3, 0, Math.PI*2); x.fill();
    }
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(3,1);
    return t;
  }

  function makeCeilTex() {
    const c = document.createElement('canvas'); c.width = c.height = 256;
    const x = c.getContext('2d');
    x.fillStyle = '#060612'; x.fillRect(0,0,256,256);
    x.strokeStyle = 'rgba(80,60,160,0.2)'; x.lineWidth = 1;
    for (let i = 0; i <= 256; i += 32) {
      x.beginPath(); x.moveTo(i,0); x.lineTo(i,256); x.stroke();
      x.beginPath(); x.moveTo(0,i); x.lineTo(256,i); x.stroke();
    }
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(4,8);
    return t;
  }

  // ══════════════════════════════════════════
  // HELPERS
  // ══════════════════════════════════════════
  function addR(o) { scene.add(o); roomObjects.push(o); return o; }

  function clearRoom() {
    roomObjects.forEach(o => scene.remove(o));
    roomObjects=[]; interactables=[]; animFns=[];
  }

  function mkMesh(geo, mat) {
    const m = new THREE.Mesh(geo, mat);
    m.receiveShadow = m.castShadow = true;
    return m;
  }

  function box(w,h,d, col, rough, metal, emCol, emInt) {
    return mkMesh(
      new THREE.BoxGeometry(w,h,d),
      new THREE.MeshStandardMaterial({
        color: col, roughness: rough??0.85, metalness: metal??0.1,
        emissive: emCol ? new THREE.Color(emCol) : undefined,
        emissiveIntensity: emInt||0
      })
    );
  }

  function texBox(w,h,d, tex, rough, metal) {
    return mkMesh(
      new THREE.BoxGeometry(w,h,d),
      new THREE.MeshStandardMaterial({ map: tex, roughness: rough??0.9, metalness: metal??0.05 })
    );
  }

  function spot(col, intensity, dist, x,y,z, tx,ty,tz, angle, pen) {
    const l = new THREE.SpotLight(col, intensity, dist, angle||Math.PI/7, pen||0.3);
    l.position.set(x,y,z); l.target.position.set(tx,ty,tz);
    l.castShadow = true;
    l.shadow.mapSize.set(512,512);
    scene.add(l.target); addR(l); return l;
  }

  function ptLight(col, intensity, dist, x,y,z) {
    const l = new THREE.PointLight(col, intensity, dist);
    l.position.set(x,y,z); return addR(l);
  }

  // ══════════════════════════════════════════
  // CORRIDOR
  // ══════════════════════════════════════════
  function loadCorridor(levelData, doorCb) {
    clearRoom();
    const W=6, H=4.2, L=24;
    currentRoom = { bounds:{x0:-W/2,x1:W/2,z0:-L/2,z1:L/2} };
    camera.position.set(0,EYE_H,8); yaw=Math.PI; pitch=0;

    const flTex = makeFloorTex();
    const wlTex = makeWallTex();
    const ceTex = makeCeilTex();

    // Floor (reflective)
    const fl = mkMesh(new THREE.BoxGeometry(W,0.08,L),
      new THREE.MeshStandardMaterial({ map:flTex, roughness:0.3, metalness:0.6, color:0x888899 }));
    fl.position.set(0,-0.04,0); addR(fl);

    // Ceiling
    const ce = texBox(W,0.08,L, ceTex, 0.9, 0.0); ce.position.set(0,H,0); addR(ce);

    // Walls
    const wL = texBox(0.12,H,L, wlTex, 0.85, 0.1); wL.position.set(-W/2,H/2,0); addR(wL);
    const wR = texBox(0.12,H,L, wlTex, 0.85, 0.1); wR.position.set( W/2,H/2,0); addR(wR);
    const wBk= texBox(W,H,0.12, wlTex, 0.85, 0.1); wBk.position.set(0,H/2, L/2); addR(wBk);

    // Front wall with door
    const DW=1.7, DH=3.1, sw=(W-DW)/2;
    const wFL=texBox(sw,H,0.12,wlTex); wFL.position.set(-W/2+sw/2,H/2,-L/2); addR(wFL);
    const wFR=texBox(sw,H,0.12,wlTex); wFR.position.set( W/2-sw/2,H/2,-L/2); addR(wFR);
    const wFT=texBox(DW,H-DH,0.12,wlTex); wFT.position.set(0,DH+(H-DH)/2,-L/2); addR(wFT);

    // Ceiling light strips + spots
    [-7.5,-3.5,0,3.5,7.5].forEach(z => {
      const strip=box(0.2,0.05,1.1, 0xffffff, 0.1,0, 0xaaaaff, 3.5);
      strip.position.set(0,H-0.03,z); addR(strip);
      spot(0x9999ff, 4, 12, 0, H-0.1, z, 0,0,z, Math.PI/6, 0.25);
      // Subtle floor reflection glow
      ptLight(0x4444aa, 0.4, 5, 0, 0.1, z);
    });

    // Purple accent strips on walls
    [-7,-3.5,0,3.5,7].forEach(z => {
      [-W/2+0.08, W/2-0.08].forEach(x => {
        const s=box(0.03,1.6,0.03, 0x7c3aed, 0.1,0, 0x7c3aed, 5);
        s.position.set(x,1.1,z); addR(s);
      });
    });

    // Baseboard glow
    const baseL=box(0.04,0.06,L, 0x06b6d4,0.1,0, 0x06b6d4, 3);
    baseL.position.set(-W/2+0.04, 0.03, 0); addR(baseL);
    const baseR=box(0.04,0.06,L, 0x06b6d4,0.1,0, 0x06b6d4, 3);
    baseR.position.set( W/2-0.04, 0.03, 0); addR(baseR);

    // Door frame
    const dfL=box(0.1,DH,0.25, 0x1a1a3a,0.6,0.4, 0x3a1a7a,0.5);
    dfL.position.set(-DW/2-0.05,DH/2,-L/2); addR(dfL);
    const dfR=box(0.1,DH,0.25, 0x1a1a3a,0.6,0.4, 0x3a1a7a,0.5);
    dfR.position.set( DW/2+0.05,DH/2,-L/2); addR(dfR);
    const dfT=box(DW+0.2,0.1,0.25, 0x1a1a3a,0.6,0.4, 0x3a1a7a,0.5);
    dfT.position.set(0,DH+0.05,-L/2); addR(dfT);

    // Door sign
    const sgn=box(1.35,0.22,0.06, 0x002211,0.5,0, 0x00ff88, 2);
    sgn.position.set(0,DH+0.33,-L/2+0.1); addR(sgn);
    ptLight(0x00ff88, 1.5, 2, 0, DH+0.33, -L/2+0.3);

    // Door panel
    const door=mkMesh(new THREE.BoxGeometry(DW,DH,0.08),
      new THREE.MeshStandardMaterial({ color:0x0e0e28, roughness:0.5, metalness:0.6,
        emissive:new THREE.Color(0x0a0820), emissiveIntensity:0.3 }));
    door.position.set(0,DH/2,-L/2+0.05);
    scene.add(door); roomObjects.push(door);

    // Handle
    const handle=box(0.06,0.06,0.28, 0x7070bb,0.2,0.9, 0x9090dd,0.4);
    handle.position.set(DW/2-0.18,DH/2,-L/2+0.18);
    scene.add(handle); roomObjects.push(handle);

    // Door glow
    const dgl=new THREE.PointLight(0x0033ff,0,10);
    dgl.position.set(0,DH/2,-L/2-1); scene.add(dgl); roomObjects.push(dgl);

    // Door open animation
    let opened=false;
    function openDoor() {
      if (opened) return; opened=true;
      const pivot=new THREE.Group();
      pivot.position.set(-DW/2,DH/2,-L/2);
      door.position.set(DW/2,0,0);
      handle.position.set(DW/2-0.18,0,0.13);
      pivot.add(door); pivot.add(handle);
      scene.add(pivot); roomObjects.push(pivot);
      let p=0;
      animFns.push((t,dt) => {
        if (p<1) {
          p=Math.min(1,p+dt*0.9);
          pivot.rotation.y=p*Math.PI*0.78;
          dgl.intensity=p*4;
          if (p>=1 && doorCb) { const cb=doorCb; doorCb=null; setTimeout(cb,400); }
        }
      });
    }

    interactables.push({ pos:new THREE.Vector3(0,EYE_H,-L/2+1.5), itype:'door',iid:'door',
      label:'Buka Pintu Server Room', doorFn:openDoor });

    // NPCs
    const lobby=levelData.scenes.lobby;
    if (lobby.chars) {
      const npcCols=[0x2563eb,0x7c3aed,0x059669];
      lobby.chars.forEach((ch,i) => {
        makeNPC(-1.5+i*1.5, 0, 4-i*1.5, npcCols[i%3]);
        interactables.push({ pos:new THREE.Vector3(-1.5+i*1.5,EYE_H,4-i*1.5),
          itype:'char', iid:ch.id, label:'Bicara dengan '+ch.name });
      });
    }

    showLoc(lobby.label||'Lobby');
  }

  // ══════════════════════════════════════════
  // SERVER ROOM
  // ══════════════════════════════════════════
  function loadServerRoom(levelData) {
    clearRoom();
    const W=13, H=4.2, L=26;
    currentRoom = { bounds:{x0:-W/2,x1:W/2,z0:-L/2,z1:L/2} };
    camera.position.set(0,EYE_H,9); yaw=Math.PI; pitch=0;

    const flTex=makeFloorTex(); const wlTex=makeWallTex(); const ceTex=makeCeilTex();

    // Floor (more reflective in server room)
    const fl=mkMesh(new THREE.BoxGeometry(W,0.08,L),
      new THREE.MeshStandardMaterial({ map:flTex, roughness:0.15, metalness:0.8, color:0x9999aa }));
    fl.position.set(0,-0.04,0); addR(fl);

    const ce=texBox(W,0.08,L,ceTex,0.9,0); ce.position.set(0,H,0); addR(ce);
    [-W/2,W/2].forEach(x => { const w=texBox(0.12,H,L,wlTex); w.position.set(x,H/2,0); addR(w); });
    [-L/2,L/2].forEach(z => { const w=texBox(W,H,0.12,wlTex); w.position.set(0,H/2,z); addR(w); });

    // Ceiling lights
    [-8,-4,0,4,8].forEach(z => {
      [-2.8,2.8].forEach(x => {
        const s=box(0.16,0.04,1.2, 0xffffff,0.1,0, 0xaaaaff,4);
        s.position.set(x,H-0.03,z); addR(s);
      });
      spot(0x7777ff, 3.5, 14, 0, H-0.05, z, 0,0,z, Math.PI/5, 0.3);
      ptLight(0x3333aa, 0.5, 6, 0, 0.05, z);
    });

    // Cyan baseboard
    [-W/2+0.04, W/2-0.04].forEach(x => {
      const b=box(0.03,0.08,L, 0x06b6d4,0.1,0, 0x06b6d4,4);
      b.position.set(x,0.04,0); addR(b);
    });

    // Server racks
    for (let z=-9; z<=9; z+=3) {
      buildRack(-W/2+1.6, z);
      buildRack( W/2-1.6, z);
    }

    addR(new THREE.AmbientLight(0x000a22, 2));

    // Interactive objects
    const srDef=levelData.scenes.serverroom, items=levelData.items;
    const pos=[[-1.5,2],[1.5,2],[0,-1],[-2.5,-3],[2.5,-3],[0,4]];
    if (srDef.objects && items) {
      srDef.objects.forEach((obj,i) => {
        const [x,z]=pos[i]||[0,i-2];
        buildItem(obj,x,z,items[obj.id]);
      });
    }

    if (srDef.chars) {
      srDef.chars.forEach((ch,i) => {
        makeNPC(3.8,0,i*2.5-1,0x7c3aed);
        interactables.push({ pos:new THREE.Vector3(3.8,EYE_H,i*2.5-1),
          itype:'char', iid:ch.id, label:'Bicara dengan '+ch.name });
      });
    }

    showLoc(srDef.label||'Server Room');
  }

  // ══════════════════════════════════════════
  // SERVER RACK (detailed)
  // ══════════════════════════════════════════
  function buildRack(x, z) {
    const g=new THREE.Group(); g.position.set(x,0,z);
    // Main chassis
    const chassis=mkMesh(new THREE.BoxGeometry(1.75,3.6,1.0),
      new THREE.MeshStandardMaterial({ color:0x0c0c1e, roughness:0.4, metalness:0.8 }));
    chassis.position.y=1.8; g.add(chassis);

    // Front bezel
    const bezel=mkMesh(new THREE.BoxGeometry(1.65,3.5,0.06),
      new THREE.MeshStandardMaterial({ color:0x0f0f28, roughness:0.5, metalness:0.7 }));
    bezel.position.set(0,1.8,0.53); g.add(bezel);

    // Rack units
    const ledCols=[0x00ff41,0x06b6d4,0x00ff41,0x06b6d4,0x10b981,0xffffff,0x06b6d4,0x00ff41];
    for (let i=0;i<8;i++) {
      const yy=0.28+i*0.43;
      // Unit body
      const unit=mkMesh(new THREE.BoxGeometry(1.55,0.38,0.85),
        new THREE.MeshStandardMaterial({ color:0x111130, roughness:0.6, metalness:0.5 }));
      unit.position.set(0,yy,0); g.add(unit);

      // LED strip
      const ledC=ledCols[i];
      const led=mkMesh(new THREE.BoxGeometry(0.08,0.08,0.08),
        new THREE.MeshStandardMaterial({ color:ledC, emissive:new THREE.Color(ledC), emissiveIntensity:3, roughness:0.1 }));
      led.position.set(-0.72,yy,0.47); g.add(led);

      // Small LED glow light
      const lgl=new THREE.PointLight(ledC, 0.6, 0.8);
      lgl.position.set(x-0.72, yy, z+0.47);
      addR(lgl);

      // Port holes (decorative)
      for (let p=0;p<3;p++) {
        const port=mkMesh(new THREE.BoxGeometry(0.12,0.06,0.04),
          new THREE.MeshStandardMaterial({ color:0x050515, roughness:0.8, metalness:0.2 }));
        port.position.set(-0.35+p*0.3, yy, 0.48); g.add(port);
      }

      // Blinking animation
      const spd=0.4+Math.random()*3, off=Math.random()*Math.PI*2;
      animFns.push(t => {
        led.material.emissiveIntensity=1.5+Math.sin(t*spd+off)*1.5;
        lgl.intensity=0.3+Math.sin(t*spd+off)*0.3;
      });
    }

    // Rack edges (metallic trim)
    [[-0.88,1.8],[ 0.88,1.8]].forEach(([ex,ey]) => {
      const edge=mkMesh(new THREE.BoxGeometry(0.04,3.6,1.05),
        new THREE.MeshStandardMaterial({ color:0x222244, roughness:0.3, metalness:0.9 }));
      edge.position.set(ex,ey,0); g.add(edge);
    });

    addR(g);
  }

  // ══════════════════════════════════════════
  // INTERACTIVE ITEM (glowing pedestal)
  // ══════════════════════════════════════════
  function buildItem(obj, x, z, itemData) {
    const palette=[0x7c3aed,0x06b6d4,0x10b981,0xa855f7,0xf59e0b,0xef4444];
    const col=palette[Math.abs(obj.id.length*3) % palette.length];
    const g=new THREE.Group(); g.position.set(x,0,z);

    // Pedestal with texture
    const ped=mkMesh(new THREE.BoxGeometry(0.55,0.85,0.55),
      new THREE.MeshStandardMaterial({ color:0x111125, roughness:0.7, metalness:0.5 }));
    ped.position.y=0.42; g.add(ped);

    // Glowing trim ring on pedestal
    const ring=mkMesh(new THREE.BoxGeometry(0.58,0.04,0.58),
      new THREE.MeshStandardMaterial({ color:col, emissive:new THREE.Color(col), emissiveIntensity:2.5, roughness:0.1 }));
    ring.position.y=0.85; g.add(ring);

    // Floating object
    const ob=mkMesh(new THREE.BoxGeometry(0.55,0.55,0.55),
      new THREE.MeshStandardMaterial({ color:col, roughness:0.2, metalness:0.7,
        emissive:new THREE.Color(col), emissiveIntensity:0.8 }));
    ob.position.y=1.22; g.add(ob);

    // Glow light
    const gl=new THREE.PointLight(col, 2.5, 4);
    gl.position.set(x,1.3,z); addR(gl);

    // Float + rotate + pulse
    animFns.push(t => {
      ob.position.y=1.22+Math.sin(t*1.8)*0.08;
      ob.rotation.y=t*0.8;
      const s=1+Math.sin(t*2.2)*0.06; ob.scale.setScalar(s);
      gl.intensity=1.8+Math.sin(t*2.2)*1.2;
      ring.material.emissiveIntensity=2+Math.sin(t*3)*1;
    });

    addR(g);
    interactables.push({ pos:new THREE.Vector3(x,EYE_H,z), itype:'item', iid:obj.id,
      label:itemData?itemData.title:obj.label });
  }

  // ══════════════════════════════════════════
  // NPC
  // ══════════════════════════════════════════
  function makeNPC(x,y,z,col) {
    const g=new THREE.Group(); g.position.set(x,y,z);
    const add=(w,h,d,c,ec,ei,px,py,pz) => {
      const m=mkMesh(new THREE.BoxGeometry(w,h,d),
        new THREE.MeshStandardMaterial({ color:c, roughness:0.85,
          emissive:ec?new THREE.Color(ec):undefined, emissiveIntensity:ei||0 }));
      m.position.set(px||0,py||0,pz||0); g.add(m); return m;
    };
    add(0.5,0.65,0.3, col,col,0.15,     0,1.1,0);    // torso
    add(0.46,0.46,0.46, 0xffcc99,null,0, 0,1.65,0);  // head
    add(0.1,0.1,0.06, 0x111144,0x4466ff,0.8, -0.13,1.67,0.23); // eye L
    add(0.1,0.1,0.06, 0x111144,0x4466ff,0.8,  0.13,1.67,0.23); // eye R
    add(0.22,0.6,0.28, col,null,0, -0.38,1.05,0); // arm L
    add(0.22,0.6,0.28, col,null,0,  0.38,1.05,0); // arm R
    add(0.23,0.62,0.28, 0x1e3a5f,null,0, -0.15,0.3,0); // leg L
    add(0.23,0.62,0.28, 0x1a3355,null,0,  0.15,0.3,0); // leg R
    // Name hover light
    ptLight(col, 0.8, 1.5, x, 2.2, z);
    const off=Math.random()*Math.PI*2;
    animFns.push(t => { g.position.y=y+Math.sin(t*1.8+off)*0.04; });
    addR(g); return g;
  }

  // ══════════════════════════════════════════
  // LOC LABEL / LOAD ROOM
  // ══════════════════════════════════════════
  function showLoc(text) {
    const el=document.getElementById('loc-label');
    if (!el||!text) return;
    el.textContent=text; el.style.animation='none';
    el.classList.remove('hidden'); void el.offsetHeight;
    el.style.animation='fadeLabel 3s forwards';
    setTimeout(()=>el.classList.add('hidden'),3100);
  }

  function loadRoom(roomId, levelData, doorCb) {
    const ov=document.getElementById('fade-overlay');
    ov.style.opacity=1;
    setTimeout(()=>{
      if (roomId==='lobby') loadCorridor(levelData,doorCb);
      else loadServerRoom(levelData);
      setTimeout(()=>{ ov.style.opacity=0; },80);
    },500);
  }

  function markItemFound(id) {
    interactables=interactables.filter(o=>!(o.itype==='item'&&o.iid===id));
  }

  function releasePointer() {
    document.exitPointerLock();
    setTimeout(refreshOverlay,100);
  }

  return { init, loadRoom, markItemFound, releasePointer, showLoc };
})();
