// ════════════════════════════════════════════
// SCENE ENGINE — First-Person Walking System
// ════════════════════════════════════════════

const Engine = (() => {

  let currentScene = null;
  let transitioning = false;

  // ── Build scene HTML ─────────────────────

  function buildScene(sceneId, levelData) {
    const def = levelData.scenes[sceneId];
    if (!def) return;

    const wrap = document.getElementById('scene-wrap');
    const div  = document.createElement('div');
    div.id    = 'active-scene';
    div.className = `scene scene-${def.type}`;
    div.innerHTML = renderEnv(def);
    wrap.innerHTML = '';
    wrap.appendChild(div);
    currentScene = sceneId;

    // Show/hide nav arrows
    document.getElementById('nav-left') .classList.toggle('hidden', !def.navLeft);
    document.getElementById('nav-right').classList.toggle('hidden', !def.navRight);
    document.getElementById('nav-back') .classList.toggle('hidden', !def.navBack);

    // Location label
    showLocLabel(def.label || '');

    return div;
  }

  // ── Render environment HTML ──────────────

  function renderEnv(def) {
    let html = '';

    if (def.type === 'corridor') {
      html = buildCorridor(def);
    } else if (def.type === 'serverroom') {
      html = buildServerRoom(def);
    }

    return html;
  }

  // ── Corridor scene ───────────────────────

  function buildCorridor(def) {
    let html = `
      <div class="sc-ceil"></div>
      <div class="sc-lights">${'<div class="sc-light"></div>'.repeat(5)}</div>
      <div class="sc-wall-l"></div>
      <div class="sc-wall-r"></div>
      <div class="sc-floor"></div>
      <div class="sc-back">
        <div class="sc-door-wrap" id="door-wrap">
          <div class="sc-door-sign">${def.doorSign || 'SERVER ROOM'}</div>
          <div class="sc-door" id="scene-door">
            <div class="sc-door-panel"></div>
            <div class="sc-door-handle"></div>
          </div>
          <div class="sc-door-glow"></div>
          <div class="sc-door-hint" id="door-hint">Klik untuk membuka</div>
        </div>
        <div class="sc-door-light" id="door-light"></div>
      </div>
    `;

    // Ambient orbs
    html += `<div class="ambient-orb" style="width:300px;height:300px;top:10%;left:-5%;background:radial-gradient(circle,rgba(124,58,237,.06),transparent);--af:6s"></div>`;
    html += `<div class="ambient-orb" style="width:200px;height:200px;bottom:15%;right:-3%;background:radial-gradient(circle,rgba(6,182,212,.05),transparent);--af:8s"></div>`;

    // Characters in corridor
    if (def.chars) {
      def.chars.forEach(ch => {
        html += `
          <div class="sc-char" id="char-${ch.id}"
               style="left:${ch.x};bottom:${ch.y}"
               onclick="onCharClick('${ch.id}')">
            <div class="sc-bubble" id="bubble-${ch.id}">${ch.bubble || '...'}</div>
            <div class="sc-char-body">${ch.emoji}</div>
            <div class="sc-char-name">${ch.name}</div>
          </div>
        `;
      });
    }

    return html;
  }

  // ── Server Room scene ────────────────────

  function buildServerRoom(def) {
    let rackUnitsL = '';
    let rackUnitsR = '';
    for (let i = 0; i < 6; i++) {
      const cls = i % 3 === 0 ? 'fast' : i % 4 === 0 ? 'off' : '';
      const del  = `--bdl:${i * 0.3}s`;
      rackUnitsL += `<div class="sr-rack-unit ${cls}" style="${del}"></div>`;
      rackUnitsR += `<div class="sr-rack-unit ${cls === 'fast' ? '' : 'fast'}" style="${del}"></div>`;
    }

    let html = `
      <div class="sr-ceiling">
        <div class="sr-ceiling-lights">${'<div class="sr-light"></div>'.repeat(6)}</div>
      </div>
      <div class="sr-racks-l">${rackUnitsL}</div>
      <div class="sr-racks-r">${rackUnitsR}</div>
      <div class="sr-center"></div>
      <div class="sr-floor"></div>
    `;

    // Ambient
    html += `<div class="ambient-orb" style="width:400px;height:400px;top:0;left:20%;background:radial-gradient(circle,rgba(0,80,200,.06),transparent);--af:7s"></div>`;

    // Characters
    if (def.chars) {
      def.chars.forEach(ch => {
        html += `
          <div class="sc-char" id="char-${ch.id}"
               style="left:${ch.x};bottom:${ch.y}"
               onclick="onCharClick('${ch.id}')">
            <div class="sc-bubble" id="bubble-${ch.id}">${ch.bubble || ''}</div>
            <div class="sc-char-body">${ch.emoji}</div>
            <div class="sc-char-name">${ch.name}</div>
          </div>
        `;
      });
    }

    // Interactive objects
    if (def.objects) {
      def.objects.forEach(obj => {
        html += `
          <div class="room-item pulse" id="item-${obj.id}"
               style="left:${obj.x};top:${obj.y}"
               onclick="onItemClick('${obj.id}')">
            <span class="room-item-emoji">${obj.emoji}</span>
            <span class="room-item-lbl">${obj.label}</span>
          </div>
        `;
      });
    }

    return html;
  }

  // ── Walk to scene with animation ─────────

  function walkTo(targetSceneId, levelData, callback) {
    if (transitioning) return;
    transitioning = true;

    const current = document.getElementById('active-scene');

    if (current) {
      current.classList.add('anim-out');
      setTimeout(() => {
        const newScene = buildScene(targetSceneId, levelData);
        if (newScene) {
          newScene.classList.add('anim-in');
          setTimeout(() => {
            newScene.classList.remove('anim-in');
            transitioning = false;
            if (callback) callback();
          }, 560);
        } else {
          transitioning = false;
        }
      }, 500);
    } else {
      const newScene = buildScene(targetSceneId, levelData);
      if (newScene) {
        newScene.classList.add('anim-in');
        setTimeout(() => {
          newScene.classList.remove('anim-in');
          transitioning = false;
          if (callback) callback();
        }, 560);
      } else {
        transitioning = false;
      }
    }
  }

  // ── Open door animation then walk in ─────

  function openDoorAndEnter(targetSceneId, levelData, callback) {
    if (transitioning) return;

    const door  = document.getElementById('scene-door');
    const hint  = document.getElementById('door-hint');
    const light = document.getElementById('door-light');

    if (!door) { walkTo(targetSceneId, levelData, callback); return; }

    // 1. Open door
    door.classList.add('open');
    if (hint)  hint.style.display = 'none';
    if (light) { light.classList.add('visible'); }

    // 2. After door opens, walk forward
    setTimeout(() => {
      walkTo(targetSceneId, levelData, callback);
    }, 850);
  }

  // ── Mark item as found ───────────────────

  function markItemFound(id) {
    const el = document.getElementById('item-' + id);
    if (el) {
      el.classList.remove('pulse');
      el.classList.add('found');
    }
  }

  // ── Update char bubble ───────────────────

  function setCharBubble(charId, text) {
    const el = document.getElementById('bubble-' + charId);
    if (el) {
      el.textContent = text;
      el.style.display = text ? '' : 'none';
    }
  }

  // ── Loc label ────────────────────────────

  function showLocLabel(text) {
    if (!text) return;
    const el = document.getElementById('loc-label');
    el.textContent  = text;
    el.style.animation = 'none';
    el.classList.remove('hidden');
    void el.offsetHeight;
    el.style.animation = 'fadeLabel 3s forwards';
    setTimeout(() => el.classList.add('hidden'), 3100);
  }

  function getCurrentScene() { return currentScene; }
  function isTransitioning()  { return transitioning; }

  return { buildScene, walkTo, openDoorAndEnter, markItemFound, setCharBubble, showLocLabel, getCurrentScene, isTransitioning };

})();
