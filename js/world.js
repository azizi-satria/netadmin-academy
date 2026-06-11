// ════════════════════════════════════════════
// WORLD — FPS Engine · Roblox-style 3D (v5)
// ════════════════════════════════════════════

const World = (() => {

  let scene, camera, renderer, composer, clock;

  // ── FPS ──────────────────────────────────────
  let yaw = 0, pitch = 0, pointerLocked = false;
  const keys = {};
  const SPEED = 6, EYE_H = 1.65;

  // ── Room state ────────────────────────────────
  let currentRoom  = null;
  let roomObjects  = [];
  let interactables = [];
  let animFns      = [];

  let onInteractCb = null;

  // ══════════════════════════════════════════════
  // INIT
  // ══════════════════════════════════════════════
  function init(cb) {
    onInteractCb = cb;
    const canvas = document.getElementById('c');

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(innerWidth, innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type    = THREE.PCFSoftShadowMap;
    renderer.toneMapping       = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.outputEncoding    = THREE.sRGBEncoding;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x080818);
    scene.fog = new THREE.FogExp2(0x080818, 0.018);

    camera = new THREE.PerspectiveCamera(80, innerWidth / innerHeight, 0.05, 80);
    camera.position.set(0, EYE_H, 8);
    clock = new THREE.Clock();

    scene.add(new THREE.AmbientLight(0x2233aa, 3.5));

    // Bloom post-processing
    const rPass = new THREE.RenderPass(scene, camera);
    const bloom = new THREE.UnrealBloomPass(
      new THREE.Vector2(innerWidth, innerHeight), 0.7, 0.4, 0.35);
    composer = new THREE.EffectComposer(renderer);
    composer.addPass(rPass);
    composer.addPass(bloom);

    setupControls(canvas);
    window.addEventListener('resize', () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
      composer.setSize(innerWidth, innerHeight);
    });

    animate();
  }

  // ══════════════════════════════════════════════
  // CONTROLS
  // ══════════════════════════════════════════════
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

  // ══════════════════════════════════════════════
  // INTERACT
  // ══════════════════════════════════════════════
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
    else   { el.style.display = 'none'; }
  }

  // ══════════════════════════════════════════════
  // MOVEMENT
  // ══════════════════════════════════════════════
  function updateMovement(dt) {
    if (!pointerLocked) return;
    const fwd = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw));
    const rgt = new THREE.Vector3( Math.cos(yaw), 0, -Math.sin(yaw));
    const dir = new THREE.Vector3();
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

  // ══════════════════════════════════════════════
  // ANIMATE
  // ══════════════════════════════════════════════
  function animate() {
    requestAnimationFrame(animate);
    const dt = Math.min(clock.getDelta(), 0.05);
    updateMovement(dt);
    updatePrompt();
    animFns.forEach(fn => fn(clock.elapsedTime, dt));
    composer.render();
  }

  // ══════════════════════════════════════════════
  // HELPERS
  // ══════════════════════════════════════════════
  function addR(o) { scene.add(o); roomObjects.push(o); return o; }

  function clearRoom() {
    roomObjects.forEach(o => scene.remove(o));
    roomObjects = []; interactables = []; animFns = [];
  }

  function mkBox(w, h, d, col, rough, metal, emCol, emInt) {
    const m = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, d),
      new THREE.MeshStandardMaterial({
        color: col, roughness: rough ?? 0.85, metalness: metal ?? 0.1,
        emissive:          emCol ? new THREE.Color(emCol) : undefined,
        emissiveIntensity: emInt || 0
      })
    );
    m.castShadow = m.receiveShadow = true;
    return m;
  }

  function mkCyl(rt, rb, h, seg, col, emCol, emInt) {
    const m = new THREE.Mesh(
      new THREE.CylinderGeometry(rt, rb, h, seg),
      new THREE.MeshStandardMaterial({
        color: col, roughness: 0.7, metalness: 0.2,
        emissive:          emCol ? new THREE.Color(emCol) : undefined,
        emissiveIntensity: emInt || 0
      })
    );
    m.castShadow = true;
    return m;
  }

  function makeFloorTex() {
    const c = document.createElement('canvas'); c.width = c.height = 512;
    const x = c.getContext('2d');
    x.fillStyle = '#090910'; x.fillRect(0,0,512,512);
    x.strokeStyle = 'rgba(90,60,200,0.28)'; x.lineWidth = 1.5;
    for (let i = 0; i <= 512; i += 64) {
      x.beginPath(); x.moveTo(i,0); x.lineTo(i,512); x.stroke();
      x.beginPath(); x.moveTo(0,i); x.lineTo(512,i); x.stroke();
    }
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(6,12);
    return t;
  }

  function makeWallTex() {
    const c = document.createElement('canvas'); c.width = c.height = 512;
    const x = c.getContext('2d');
    x.fillStyle = '#0d0d20'; x.fillRect(0,0,512,512);
    x.strokeStyle = 'rgba(120,80,255,0.18)'; x.lineWidth = 1.5;
    for (let i = 0; i <= 512; i += 80) { x.beginPath(); x.moveTo(0,i); x.lineTo(512,i); x.stroke(); }
    x.fillStyle = 'rgba(150,100,255,0.12)';
    for (let r = 40; r < 512; r += 80) for (let cc = 30; cc < 512; cc += 120) {
      x.beginPath(); x.arc(cc,r,3,0,Math.PI*2); x.fill();
    }
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(3,1);
    return t;
  }

  function spot(col, intens, dist, x,y,z, tx,ty,tz) {
    const l = new THREE.SpotLight(col, intens, dist, Math.PI/6, 0.3);
    l.position.set(x,y,z); l.target.position.set(tx,ty,tz);
    l.castShadow = true; l.shadow.mapSize.set(512,512);
    scene.add(l.target); return addR(l);
  }

  function ptLight(col, intens, dist, x,y,z) {
    const l = new THREE.PointLight(col, intens, dist);
    l.position.set(x,y,z); return addR(l);
  }

  // ══════════════════════════════════════════════
  // ROBLOX NPC — detail tinggi
  // ══════════════════════════════════════════════
  function makeNPC(x, y, z, shirtCol, pantCol, skinCol, name) {
    const g = new THREE.Group();
    g.position.set(x, y, z);

    const add = (w,h,d, col, emCol, emInt, px,py,pz, ry) => {
      const mat = new THREE.MeshStandardMaterial({
        color: col, roughness: 0.82,
        emissive: emCol ? new THREE.Color(emCol) : undefined,
        emissiveIntensity: emInt || 0
      });
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), mat);
      mesh.position.set(px||0, py||0, pz||0);
      if (ry) mesh.rotation.y = ry;
      mesh.castShadow = true;
      g.add(mesh); return mesh;
    };

    skinCol = skinCol || 0xffcc99;

    // Torso
    add(0.52, 0.68, 0.32, shirtCol, null, 0,   0, 1.08, 0);
    // Collar stripe
    add(0.54, 0.06, 0.34, 0xffffff, null, 0,   0, 1.39, 0);
    // Head
    add(0.48, 0.48, 0.48, skinCol,  null, 0,   0, 1.68, 0);
    // Eyes
    add(0.10, 0.09, 0.05, 0x222255, 0x4488ff, 0.9,  -0.13, 1.70, 0.24);
    add(0.10, 0.09, 0.05, 0x222255, 0x4488ff, 0.9,   0.13, 1.70, 0.24);
    // Nose
    add(0.05, 0.04, 0.05, skinCol,  null, 0,   0,   1.63, 0.25);
    // Smile
    add(0.18, 0.03, 0.04, 0x995533, null, 0,   0,   1.56, 0.24);
    // Hair
    add(0.50, 0.10, 0.50, 0x331100, null, 0,   0,   1.92, 0);
    // Left arm
    add(0.22, 0.60, 0.28, shirtCol, null, 0,  -0.40, 1.05, 0);
    // Left hand
    add(0.20, 0.18, 0.20, skinCol,  null, 0,  -0.40, 0.71, 0);
    // Right arm
    add(0.22, 0.60, 0.28, shirtCol, null, 0,   0.40, 1.05, 0);
    // Right hand
    add(0.20, 0.18, 0.20, skinCol,  null, 0,   0.40, 0.71, 0);
    // Left leg
    add(0.23, 0.64, 0.29, pantCol,  null, 0,  -0.14, 0.30, 0);
    // Left shoe
    add(0.23, 0.10, 0.32, 0x222222, null, 0,  -0.14, -0.03, 0.03);
    // Right leg
    add(0.23, 0.64, 0.29, pantCol,  null, 0,   0.14, 0.30, 0);
    // Right shoe
    add(0.23, 0.10, 0.32, 0x222222, null, 0,   0.14, -0.03, 0.03);

    // Name tag floating above head
    if (name) {
      const tag = mkBox(name.length * 0.09 + 0.1, 0.18, 0.04, 0x1a1a2e, 0.9, 0, 0x7c3aed, 1.2);
      tag.position.set(0, 2.08, 0);
      g.add(tag);
      ptLight(0x7c3aed, 0.6, 1.2, x, y+2.1, z);
    }

    // Idle bob animation
    const off = Math.random() * Math.PI * 2;
    animFns.push(t => {
      g.position.y = y + Math.sin(t * 1.6 + off) * 0.04;
      g.rotation.y = Math.sin(t * 0.4 + off) * 0.1;
    });

    addR(g);
    return g;
  }

  // ══════════════════════════════════════════════
  // SERVER RACK — Roblox-style detail tinggi
  // ══════════════════════════════════════════════
  function buildRack(x, z, rotY) {
    const g = new THREE.Group();
    g.position.set(x, 0, z);
    g.rotation.y = rotY || 0;

    // Chassis utama
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.8, 3.8, 1.0),
      new THREE.MeshStandardMaterial({ color: 0x0c0c1e, roughness: 0.35, metalness: 0.85 }));
    body.position.y = 1.9; body.castShadow = true;
    g.add(body);

    // Frame kiri kanan
    [-0.88, 0.88].forEach(xf => {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.05, 3.8, 1.05),
        new THREE.MeshStandardMaterial({ color: 0x1a1a3a, roughness: 0.5, metalness: 0.9 }));
      rail.position.set(xf, 1.9, 0); g.add(rail);
    });

    // Kaki
    [[-0.6,0.6],[0.6,0.6],[-0.6,-0.4],[0.6,-0.4]].forEach(([fx,fz]) => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.12),
        new THREE.MeshStandardMaterial({ color: 0x333355, roughness: 0.5, metalness: 0.8 }));
      leg.position.set(fx, 0.06, fz); g.add(leg);
    });

    // Server units + LED + blinkbox
    const unitCols = [0x00ff41,0x06b6d4,0x00ff41,0xf59e0b,0x10b981,0xff4444,0x06b6d4,0x00ff41,0xa855f7,0x00ff41];
    for (let i = 0; i < 10; i++) {
      const yy = 0.22 + i * 0.36;
      const lc = unitCols[i];

      // Unit plate
      const unit = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.30, 0.88),
        new THREE.MeshStandardMaterial({ color: i%2===0?0x111128:0x0e0e22, roughness: 0.6, metalness: 0.5 }));
      unit.position.set(0, yy, 0); g.add(unit);

      // LED dot
      const led = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.065, 0.065),
        new THREE.MeshStandardMaterial({ color: lc, emissive: new THREE.Color(lc), emissiveIntensity: 3.5 }));
      led.position.set(-0.74, yy, 0.45); g.add(led);

      // Activity bar strip
      const bar = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.04, 0.03),
        new THREE.MeshStandardMaterial({ color: lc, emissive: new THREE.Color(lc), emissiveIntensity: 2 }));
      bar.position.set(-0.55, yy, 0.45); g.add(bar);

      // Slot garis dekoratif
      const slot = new THREE.Mesh(new THREE.BoxGeometry(0.80, 0.04, 0.03),
        new THREE.MeshStandardMaterial({ color: 0x333355, roughness: 0.8 }));
      slot.position.set(0.18, yy, 0.45); g.add(slot);

      // Point light per LED
      const lgl = new THREE.PointLight(lc, 0.5, 0.9);
      lgl.position.set(x - 0.74 * Math.cos(rotY||0), yy, z + 0.45); addR(lgl);

      const spd = 0.5 + Math.random() * 2.5, off = Math.random() * Math.PI * 2;
      animFns.push(t => {
        const v = 1.5 + Math.sin(t * spd + off) * 1.5;
        led.material.emissiveIntensity = v;
        bar.material.emissiveIntensity = v * 0.5;
        lgl.intensity = 0.25 + Math.sin(t * spd + off) * 0.25;
      });
    }

    // Top panel glow strip
    const topStrip = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.04, 0.9),
      new THREE.MeshStandardMaterial({ color: 0x7c3aed, emissive: new THREE.Color(0x7c3aed), emissiveIntensity: 2 }));
    topStrip.position.set(0, 3.83, 0); g.add(topStrip);
    ptLight(0x7c3aed, 1.5, 2.5, x, 3.9, z);

    addR(g);
  }

  // ══════════════════════════════════════════════
  // INTERACTIVE ITEM (PC / Monitor / Router dll)
  // ══════════════════════════════════════════════
  function buildItem(obj, x, z, itemData) {
    const id = obj.id || '';
    const isMonitor = /monitor|browser|display/i.test(id);
    const isRouter  = /router|switch|firewall/i.test(id);
    const isServer  = /server|rack|nas/i.test(id);

    const cols = [0x7c3aed,0x06b6d4,0x10b981,0xa855f7,0xf59e0b,0xef4444];
    const col  = cols[Math.abs((id.charCodeAt(0)||0) * 3) % cols.length];

    const g = new THREE.Group();
    g.position.set(x, 0, z);

    if (isMonitor) {
      // Monitor Roblox-style
      const stand = new THREE.Mesh(new THREE.BoxGeometry(0.12,0.5,0.12),
        new THREE.MeshStandardMaterial({ color: 0x222233, roughness: 0.5, metalness: 0.8 }));
      stand.position.set(0, 0.85, 0); g.add(stand);

      const base = new THREE.Mesh(new THREE.BoxGeometry(0.55,0.06,0.35),
        new THREE.MeshStandardMaterial({ color: 0x1a1a2e, roughness: 0.5, metalness: 0.7 }));
      base.position.set(0, 0.6, 0); g.add(base);

      const screen = new THREE.Mesh(new THREE.BoxGeometry(1.1,0.75,0.10),
        new THREE.MeshStandardMaterial({ color: 0x001122, roughness: 0.1, metalness: 0.4,
          emissive: new THREE.Color(col), emissiveIntensity: 0.7 }));
      screen.position.set(0, 1.35, 0); g.add(screen);

      // Screen content lines (pixel art style)
      for (let li = 0; li < 5; li++) {
        const line = new THREE.Mesh(new THREE.BoxGeometry(0.7+Math.random()*0.25, 0.04, 0.02),
          new THREE.MeshStandardMaterial({ color: col, emissive: new THREE.Color(col), emissiveIntensity: 2.5 }));
        line.position.set(-0.05+Math.random()*0.1, 1.16+li*0.12, 0.06); g.add(line);
      }

      const frame = new THREE.Mesh(new THREE.BoxGeometry(1.18,0.83,0.06),
        new THREE.MeshStandardMaterial({ color: 0x1a1a2e, roughness: 0.5, metalness: 0.7 }));
      frame.position.set(0, 1.35, -0.04); g.add(frame);

      ptLight(col, 2, 2.5, x, 1.4, z+0.3);
      animFns.push(t => { screen.material.emissiveIntensity = 0.5+Math.sin(t*0.7)*0.2; });

    } else if (isRouter) {
      // Router / Switch
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.9,0.12,0.55),
        new THREE.MeshStandardMaterial({ color: 0x111120, roughness: 0.5, metalness: 0.7 }));
      body.position.set(0, 0.8, 0); g.add(body);

      // Antena
      [-0.3,0,0.3].forEach(xo => {
        const ant = new THREE.Mesh(new THREE.BoxGeometry(0.04,0.45,0.04),
          new THREE.MeshStandardMaterial({ color: 0x222233, roughness: 0.5, metalness: 0.8 }));
        ant.position.set(xo, 1.1, 0); g.add(ant);
        const tip = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 6),
          new THREE.MeshStandardMaterial({ color: col, emissive: new THREE.Color(col), emissiveIntensity: 3 }));
        tip.position.set(xo, 1.35, 0); g.add(tip);
      });

      // LEDs on body
      for (let li = 0; li < 6; li++) {
        const led = new THREE.Mesh(new THREE.BoxGeometry(0.05,0.05,0.03),
          new THREE.MeshStandardMaterial({ color: 0x00ff41, emissive: new THREE.Color(0x00ff41), emissiveIntensity: 3 }));
        led.position.set(-0.3+li*0.12, 0.8, 0.28); g.add(led);
        const spd = 1+Math.random()*3, off = Math.random()*Math.PI*2;
        animFns.push(t => { led.material.emissiveIntensity = 1+Math.sin(t*spd+off)*2; });
      }

      // Stand
      const ped = new THREE.Mesh(new THREE.BoxGeometry(0.55,0.78,0.38),
        new THREE.MeshStandardMaterial({ color: 0x0a0a18, roughness: 0.7, metalness: 0.4 }));
      ped.position.set(0, 0.39, 0); g.add(ped);

      ptLight(col, 1.5, 2.2, x, 1.0, z);

    } else if (isServer) {
      // Mini server on pedestal
      const ped = new THREE.Mesh(new THREE.BoxGeometry(0.6,0.8,0.6),
        new THREE.MeshStandardMaterial({ color: 0x0a0a18, roughness: 0.7, metalness: 0.4 }));
      ped.position.set(0, 0.4, 0); g.add(ped);

      const srv = new THREE.Mesh(new THREE.BoxGeometry(0.85,0.38,0.6),
        new THREE.MeshStandardMaterial({ color: 0x111128, roughness: 0.4, metalness: 0.8 }));
      srv.position.set(0, 0.99, 0); g.add(srv);

      for (let li = 0; li < 4; li++) {
        const led = new THREE.Mesh(new THREE.BoxGeometry(0.06,0.06,0.04),
          new THREE.MeshStandardMaterial({ color: col, emissive: new THREE.Color(col), emissiveIntensity: 3 }));
        led.position.set(-0.3+li*0.2, 0.99, 0.31); g.add(led);
        const spd=0.5+Math.random()*3, off=Math.random()*Math.PI*2;
        animFns.push(t => { led.material.emissiveIntensity = 1+Math.sin(t*spd+off)*2.5; });
      }
      ptLight(col, 2, 2.5, x, 1.1, z);

    } else {
      // Generic PC tower
      const tower = new THREE.Mesh(new THREE.BoxGeometry(0.5,1.0,0.55),
        new THREE.MeshStandardMaterial({ color: 0x101024, roughness: 0.5, metalness: 0.7 }));
      tower.position.set(0, 0.5, 0); g.add(tower);

      // PC stripe
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.52,0.06,0.56),
        new THREE.MeshStandardMaterial({ color: col, emissive: new THREE.Color(col), emissiveIntensity: 2 }));
      stripe.position.set(0, 0.72, 0); g.add(stripe);

      // Power button
      const btn = new THREE.Mesh(new THREE.CylinderGeometry(0.04,0.04,0.03,8),
        new THREE.MeshStandardMaterial({ color: col, emissive: new THREE.Color(col), emissiveIntensity: 3 }));
      btn.position.set(0.22, 0.9, 0.28); btn.rotation.x = Math.PI/2; g.add(btn);

      // Disk drive slot
      const slot = new THREE.Mesh(new THREE.BoxGeometry(0.3,0.04,0.02),
        new THREE.MeshStandardMaterial({ color: 0x333355, roughness: 0.8 }));
      slot.position.set(0, 0.6, 0.27); g.add(slot);

      ptLight(col, 2, 2.5, x, 1.1, z+0.4);
      animFns.push(t => { stripe.material.emissiveIntensity = 1.5+Math.sin(t*1.8)*0.5; });
    }

    // Glowing base platform
    const platform = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.06, 0.8),
      new THREE.MeshStandardMaterial({ color: col, roughness: 0.4, metalness: 0.6,
        emissive: new THREE.Color(col), emissiveIntensity: 0.6 }));
    platform.position.set(0, 0.03, 0); g.add(platform);

    addR(g);

    // Register interactable
    interactables.push({
      pos: new THREE.Vector3(x, EYE_H, z),
      itype: 'item', iid: obj.id,
      label: itemData ? itemData.title : (obj.label || obj.id)
    });
  }

  // ══════════════════════════════════════════════
  // CORRIDOR (LOBBY)
  // ══════════════════════════════════════════════
  function loadCorridor(levelData, doorCb) {
    clearRoom();
    const W=6, H=4.2, L=24;
    currentRoom = { bounds: { x0:-W/2, x1:W/2, z0:-L/2, z1:L/2 } };
    camera.position.set(0, EYE_H, 8); yaw = Math.PI; pitch = 0;

    const flTex = makeFloorTex();
    const wlTex = makeWallTex();

    // Floor
    const fl = new THREE.Mesh(new THREE.BoxGeometry(W, 0.08, L),
      new THREE.MeshStandardMaterial({ map: flTex, roughness: 0.22, metalness: 0.6, color: 0x8888aa }));
    fl.position.set(0,-0.04,0); fl.receiveShadow=true; addR(fl);

    // Ceiling
    const ce = mkBox(W,0.08,L, 0x060612, 0.9,0);
    ce.position.set(0,H,0); addR(ce);

    // Walls
    const wl = new THREE.MeshStandardMaterial({ map: wlTex, roughness: 0.85, metalness: 0.1 });
    [[0.12,H,L, -W/2,H/2,0],[0.12,H,L, W/2,H/2,0],[W,H,0.12, 0,H/2,L/2]].forEach(([w,h,d,x,y,z])=>{
      const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),wl);
      m.position.set(x,y,z); m.receiveShadow=true; addR(m);
    });

    // Front wall + door hole
    const DW=1.7, DH=3.1, sw=(W-DW)/2;
    [[sw,H,0.12,-W/2+sw/2,H/2,-L/2],[sw,H,0.12,W/2-sw/2,H/2,-L/2],
     [DW,H-DH,0.12,0,DH+(H-DH)/2,-L/2]].forEach(([w,h,d,x,y,z])=>{
      const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),wl); m.position.set(x,y,z); addR(m);
    });

    // Ceiling lights
    [-7.5,-3.5,0,3.5,7.5].forEach(z => {
      const s=mkBox(0.2,0.05,1.1, 0xffffff,0.1,0, 0xccddff,5);
      s.position.set(0,H-0.03,z); addR(s);
      spot(0xaabbff,12,18, 0,H-0.1,z, 0,0,z);
      ptLight(0x6677cc,1.2,8, 0,0.5,z);
    });

    // Wall accent strips
    [-7,-3.5,0,3.5,7].forEach(z => {
      [-W/2+0.08,W/2-0.08].forEach(x => {
        const s=mkBox(0.03,1.6,0.03, 0x7c3aed,0.1,0, 0x7c3aed,5);
        s.position.set(x,1.1,z); addR(s);
      });
    });

    // Baseboard glow
    [-W/2+0.04,W/2-0.04].forEach(x => {
      const b=mkBox(0.03,0.06,L, 0x06b6d4,0.1,0, 0x06b6d4,3.5);
      b.position.set(x,0.03,0); addR(b);
    });

    // NPCs
    const lobby = levelData.scenes.lobby;
    const npcColors = [
      { shirt: 0x2563eb, pant: 0x1e3a5f, skin: 0xffcc99 },
      { shirt: 0x7c3aed, pant: 0x2d1b69, skin: 0xd4a574 },
      { shirt: 0x059669, pant: 0x064e3b, skin: 0xffcc99 },
    ];
    if (lobby.chars) {
      lobby.chars.forEach((ch, i) => {
        const nc = npcColors[i % npcColors.length];
        const cx = -1.5 + i * 1.5, cz = 4 - i * 1.5;
        makeNPC(cx, 0, cz, nc.shirt, nc.pant, nc.skin, ch.name);
        interactables.push({
          pos: new THREE.Vector3(cx, EYE_H, cz),
          itype: 'char', iid: ch.id,
          label: 'Bicara dengan ' + ch.name
        });
      });
    }

    // Decorative planters / benches
    buildLobbyProps();

    buildDoor(DW, DH, L, doorCb);
    showLoc(lobby.label || 'Lobby Netville');
  }

  function buildLobbyProps() {
    // Bench kiri kanan
    [-2, 2].forEach(x => {
      const bench = mkBox(0.45, 0.22, 1.4, 0x3a2010, 0.8, 0.1);
      bench.position.set(x, 0.11, 2); addR(bench);
      const leg1 = mkBox(0.08, 0.22, 0.08, 0x2a1808, 0.9, 0.1);
      leg1.position.set(x-0.17, 0.11, 1.4); addR(leg1);
      const leg2 = leg1.clone(); leg2.position.set(x+0.17, 0.11, 1.4); addR(leg2);
      const leg3 = leg1.clone(); leg3.position.set(x-0.17, 0.11, 2.6); addR(leg3);
      const leg4 = leg1.clone(); leg4.position.set(x+0.17, 0.11, 2.6); addR(leg4);
    });

    // Tanda arah
    const sign = mkBox(0.7, 0.25, 0.06, 0x0a1122, 0.5, 0.2, 0x06b6d4, 1.5);
    sign.position.set(0, 2.8, 11.93); addR(sign);
    ptLight(0x06b6d4, 1, 1.5, 0, 2.9, 11.5);
  }

  // ══════════════════════════════════════════════
  // DOOR
  // ══════════════════════════════════════════════
  function buildDoor(DW, DH, L, doorCb) {
    const wl = new THREE.MeshStandardMaterial({ color: 0x0d0d20, roughness: 0.85, metalness: 0.1 });

    // Door frame
    [[-DW/2-0.06,DH/2],[DW/2+0.06,DH/2]].forEach(([x,y]) => {
      const f=mkBox(0.12,DH,0.28, 0x1a1a3a,0.6,0.4, 0x3a1a7a,0.5);
      f.position.set(x,y,-L/2); addR(f);
    });
    const ft=mkBox(DW+0.24,0.12,0.28, 0x1a1a3a,0.6,0.4, 0x3a1a7a,0.5);
    ft.position.set(0,DH+0.06,-L/2); addR(ft);

    // Sign "SERVER ROOM"
    const sgn = mkBox(1.4,0.24,0.07, 0x002211,0.5,0, 0x00ff88,2.5);
    sgn.position.set(0,DH+0.36,-L/2+0.12); addR(sgn);
    ptLight(0x00ff88, 2, 2, 0, DH+0.36, -L/2+0.5);

    // Security panel beside door
    const panel = mkBox(0.22,0.45,0.07, 0x111128,0.4,0.5, 0x06b6d4,0.3);
    panel.position.set(DW/2+0.32, 1.3, -L/2+0.1); addR(panel);
    const scan = mkBox(0.14,0.06,0.03, 0x00ff88,0.2,0, 0x00ff88,4);
    scan.position.set(DW/2+0.32, 1.18, -L/2+0.13); addR(scan);
    animFns.push(t => { scan.material.emissiveIntensity = 2+Math.sin(t*3)*2; });

    // Door panel
    const door = new THREE.Mesh(new THREE.BoxGeometry(DW,DH,0.09),
      new THREE.MeshStandardMaterial({ color: 0x0e0e28, roughness: 0.4, metalness: 0.8,
        emissive: new THREE.Color(0x080820), emissiveIntensity: 0.3 }));
    door.position.set(0, DH/2, -L/2+0.05);
    scene.add(door); roomObjects.push(door);

    // Door stripe
    const dstripe = mkBox(0.05, DH-0.2, 0.04, 0x7c3aed, 0.1,0, 0x7c3aed, 2);
    dstripe.position.set(DW/2-0.08, DH/2, -L/2+0.09); scene.add(dstripe); roomObjects.push(dstripe);

    const handle = mkBox(0.07,0.07,0.30, 0x7070cc,0.2,0.9, 0x9090ee,0.5);
    handle.position.set(DW/2-0.20, DH/2, -L/2+0.20);
    scene.add(handle); roomObjects.push(handle);

    const dgl = new THREE.PointLight(0x0033ff, 0, 10);
    dgl.position.set(0, DH/2, -L/2-1); scene.add(dgl); roomObjects.push(dgl);

    let opened = false;
    function openDoor() {
      if (opened) return; opened = true;
      const pivot = new THREE.Group();
      pivot.position.set(-DW/2, DH/2, -L/2);
      door.position.set(DW/2, 0, 0);
      dstripe.position.set(DW-0.08, 0, 0.04);
      handle.position.set(DW/2-0.20, 0, 0.15);
      pivot.add(door); pivot.add(dstripe); pivot.add(handle);
      scene.add(pivot); roomObjects.push(pivot);
      let p = 0;
      animFns.push((_t, dt) => {
        if (p < 1) {
          p = Math.min(1, p + dt * 0.9);
          pivot.rotation.y = p * Math.PI * 0.78;
          dgl.intensity = p * 4;
          if (p >= 1 && doorCb) { const cb = doorCb; doorCb = null; setTimeout(cb, 400); }
        }
      });
    }

    interactables.push({
      pos: new THREE.Vector3(0, EYE_H, -L/2+1.5),
      itype: 'door', iid: 'door',
      label: 'Buka Pintu Server Room',
      doorFn: openDoor
    });
  }

  // ══════════════════════════════════════════════
  // SERVER ROOM
  // ══════════════════════════════════════════════
  function loadServerRoom(levelData) {
    clearRoom();
    const W=14, H=4.2, L=28;
    currentRoom = { bounds: { x0:-W/2, x1:W/2, z0:-L/2, z1:L/2 } };
    camera.position.set(0, EYE_H, 9); yaw = Math.PI; pitch = 0;

    const flTex = makeFloorTex(), wlTex = makeWallTex();

    // Floor
    const fl = new THREE.Mesh(new THREE.BoxGeometry(W,0.08,L),
      new THREE.MeshStandardMaterial({ map:flTex, roughness:0.10, metalness:0.88, color:0x9999bb }));
    fl.position.set(0,-0.04,0); fl.receiveShadow=true; addR(fl);

    // Walls
    const wlMat = new THREE.MeshStandardMaterial({ map:wlTex, roughness:0.85, metalness:0.1 });
    [[-W/2,H/2,0, 0.12,H,L],[W/2,H/2,0, 0.12,H,L],
     [0,H/2,-L/2, W,H,0.12],[0,H/2,L/2, W,H,0.12]].forEach(([x,y,z,w,h,d])=>{
      const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),wlMat);
      m.position.set(x,y,z); m.receiveShadow=true; addR(m);
    });

    const ce=mkBox(W,0.08,L, 0x060610,0.9,0);
    ce.position.set(0,H,0); addR(ce);

    // Ceiling lights grid
    [-9,-5,-1,3,7].forEach(z => {
      [-3.5,3.5].forEach(xo => {
        const s=mkBox(0.16,0.04,1.3, 0xffffff,0.1,0, 0xccddff,5);
        s.position.set(xo,H-0.03,z); addR(s);
      });
      spot(0x8899ff,14,22, 0,H-0.05,z, 0,0,z);
      ptLight(0x4455bb,1.5,10, 0,0.8,z);
    });

    // Baseboard glow
    [-W/2+0.03,W/2-0.03].forEach(x=>{
      const b=mkBox(0.03,0.08,L, 0x06b6d4,0.1,0, 0x06b6d4,4.5);
      b.position.set(x,0.04,0); addR(b);
    });

    // Ambient
    addR(new THREE.AmbientLight(0x2244aa, 4));

    // Server racks — kiri dan kanan, 2 baris
    for (let z = -10; z <= 10; z += 3.5) {
      buildRack(-W/2+1.7, z, 0);
      buildRack( W/2-1.7, z, Math.PI);
    }

    // Overhead cable trays
    for (let z = -10; z <= 10; z += 7) {
      const tray = mkBox(W*0.55, 0.06, 0.20, 0x222244, 0.5, 0.7);
      tray.position.set(0, H-0.18, z); addR(tray);
    }

    // Floor cable runs (decorative)
    [-2,2].forEach(x=>{
      const cable = mkBox(0.06, 0.04, L*0.7, 0x333355, 0.9, 0, 0x4444aa, 0.3);
      cable.position.set(x, 0.02, 0); addR(cable);
    });

    // Interactive objects
    const srDef = levelData.scenes.serverroom, items = levelData.items;
    const itemPos = [[-1.5,2],[1.5,2],[0,-1],[-2.5,-4],[2.5,-4],[0,5],[0,-7]];
    if (srDef.objects && items) {
      srDef.objects.forEach((obj, i) => {
        const [ix, iz] = itemPos[i] || [0, i - 3];
        buildItem(obj, ix, iz, items[obj.id]);
      });
    }

    // NPCs in server room
    const srNPCCols = [
      { shirt: 0x7c3aed, pant: 0x2d1b69, skin: 0xffcc99 },
      { shirt: 0x059669, pant: 0x064e3b, skin: 0xd4a574 },
    ];
    if (srDef.chars) {
      srDef.chars.forEach((ch, i) => {
        const nc = srNPCCols[i % srNPCCols.length];
        const cx = W/2-2.8, cz = i * 2.5 - 1.5;
        makeNPC(cx, 0, cz, nc.shirt, nc.pant, nc.skin, ch.name);
        interactables.push({
          pos: new THREE.Vector3(cx, EYE_H, cz),
          itype: 'char', iid: ch.id,
          label: 'Bicara dengan ' + ch.name
        });
      });
    }

    showLoc(srDef.label || 'Server Room');
  }

  // ══════════════════════════════════════════════
  // LOC LABEL / LOAD
  // ══════════════════════════════════════════════
  function showLoc(text) {
    const el = document.getElementById('loc-label');
    if (!el || !text) return;
    el.textContent = text; el.style.animation = 'none';
    el.classList.remove('hidden'); void el.offsetHeight;
    el.style.animation = 'fadeLabel 3s forwards';
    setTimeout(() => el.classList.add('hidden'), 3100);
  }

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
    interactables = interactables.filter(o => !(o.itype === 'item' && o.iid === id));
  }

  function releasePointer() {
    document.exitPointerLock();
    setTimeout(refreshOverlay, 100);
  }

  return { init, loadRoom, markItemFound, releasePointer, showLoc };
})();
