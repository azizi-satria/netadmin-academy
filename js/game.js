// ════════════════════════════════════════════
// GAME ENGINE — NetAdmin Academy v2
// ════════════════════════════════════════════

let curLevel    = 0;
let curDialog   = 0;
let doneObj     = new Set();
let timerSec    = 0;
let timerTick   = null;
let score       = 0;
let hintsLeft   = 3;
let hintsUsed   = 0;
let objPanelOpen = true;
let minimapOpen = false;

// ── Boot ──────────────────────────────────

window.addEventListener('load', () => {
  spawnStars();
  bootLoad();
});

function bootLoad() {
  const fill = document.getElementById('load-fill');
  const msg  = document.getElementById('load-msg');
  const steps = [
    [12,  'Memuat ruang server...'],
    [28,  'Menyiapkan peralatan jaringan...'],
    [45,  'Mengkonfigurasi terminal virtual...'],
    [62,  'Memuat skenario misi...'],
    [78,  'Menginisialisasi engine 360°...'],
    [92,  'Menyalakan lampu ruangan...'],
    [100, 'Siap! Selamat berpetualang! ⚡']
  ];
  let i = 0;
  const run = () => {
    if (i >= steps.length) { setTimeout(showMenu, 450); return; }
    const [p, m] = steps[i++];
    fill.style.width = p + '%';
    msg.textContent  = m;
    setTimeout(run, 300 + Math.random() * 250);
  };
  setTimeout(run, 200);
}

function showMenu() {
  document.getElementById('loading-screen').classList.add('hidden');
  document.getElementById('main-menu').classList.remove('hidden');
}

// ── Stars (menu background) ───────────────

function spawnStars() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 80; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size = Math.random() * 2.5 + 0.5;
    star.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random()*100}%;
      top:${Math.random()*100}%;
      --dur:${2 + Math.random()*4}s;
      --delay:${Math.random()*3}s;
    `;
    container.appendChild(star);
  }
}

// ── Tutorial ──────────────────────────────

function showTutorial() {
  document.getElementById('tutorial-screen').classList.remove('hidden');
}
function hideTutorial() {
  document.getElementById('tutorial-screen').classList.add('hidden');
  startGame();
}

// ── Start ─────────────────────────────────

function startGame() {
  document.getElementById('main-menu').classList.add('hidden');
  document.getElementById('game-screen').classList.remove('hidden');

  curLevel = 0; score = 0; hintsLeft = 3; hintsUsed = 0;
  document.getElementById('score').textContent = '0';
  document.getElementById('hint-count').textContent = '(3)';

  Panorama.init();
  initTerminal();
  loadLevel(0);
}

function loadLevel(idx) {
  const lv = LEVELS[idx];
  if (!lv) return;

  doneObj  = new Set();
  curDialog = 0;
  timerSec  = 0;

  // Reset UI
  document.getElementById('term-output').innerHTML = '';
  document.getElementById('terminal-wrap').classList.add('hidden');
  document.getElementById('inspect-popup').classList.add('hidden');
  document.getElementById('dialog-box').classList.add('hidden');
  document.getElementById('level-complete').classList.add('hidden');
  document.getElementById('timer').textContent = '00:00';
  document.getElementById('score').textContent = score;

  // HUD
  document.getElementById('hud-level').textContent   = `Level ${lv.id} / ${LEVELS.length}`;
  document.getElementById('hud-mission').textContent = lv.mission;

  // Room
  document.getElementById('scene-bg').style.background = lv.bgColor || '';
  renderRoomObjects(lv.objects);
  renderObjectives(lv.objectives);

  // Reset camera
  Panorama.panTo(0);

  startTimer();
  setTimeout(() => showDialog(), 800);
}

// ── Room Objects (Point & Click) ──────────

function renderRoomObjects(objects) {
  const layer = document.getElementById('layer-front');
  layer.innerHTML = '';

  objects.forEach((obj, i) => {
    const el = document.createElement('div');
    el.className = 'room-obj ping';
    el.id = 'obj-room-' + obj.id;

    // Convert posX (0-1) to actual pixel position in 300vw scene
    const px = (obj.posX * 300) + 'vw';
    const py = (obj.posY * 100) + '%';

    el.style.cssText = `left:${px}; top:${py}; position:absolute;`;

    el.innerHTML = `
      <span class="room-obj-emoji">${obj.emoji}</span>
      <span class="room-obj-label">${obj.label}</span>
    `;

    el.addEventListener('click', () => {
      el.classList.remove('ping');
      el.classList.add('found');
      showInspect(obj.inspect, obj.id);
    });

    // Stagger entrance animation
    el.style.opacity = '0';
    setTimeout(() => {
      el.style.transition = 'opacity .5s ease';
      el.style.opacity = '1';
    }, 200 + i * 150);

    layer.appendChild(el);
  });
}

// ── Inspect ───────────────────────────────

function showInspect(data, objId) {
  document.getElementById('inspect-icon').textContent   = data.icon || '🖥️';
  document.getElementById('inspect-title').textContent  = data.title;
  document.getElementById('inspect-body').innerHTML     = data.body.replace(/\n/g,'<br/>');

  // Status badge
  const sw = document.getElementById('inspect-status-wrap');
  const sb = document.getElementById('inspect-status');
  sb.textContent  = data.statusText;
  sb.className    = 'istatus';
  const clsMap    = {ok:'istatus-ok', warn:'istatus-warn', err:'istatus-err'};
  sb.classList.add(clsMap[data.status] || 'istatus-warn');

  // Theory box
  const theoryEl = document.getElementById('inspect-theory');
  const theoryTxt = document.getElementById('theory-body');
  if (data.theory) {
    theoryTxt.textContent = data.theory;
    theoryEl.classList.remove('hidden');
  } else {
    theoryEl.classList.add('hidden');
  }

  // Terminal button
  const btn = document.getElementById('inspect-action');
  if (data.triggerTerminal) {
    btn.classList.remove('hidden');
    btn.onclick = () => { closeInspect(); openTerminal(); };
  } else {
    btn.classList.add('hidden');
  }

  document.getElementById('inspect-popup').classList.remove('hidden');
  document.getElementById('terminal-wrap').classList.add('hidden');
}

function closeInspect() {
  document.getElementById('inspect-popup').classList.add('hidden');
}

// ── Dialog ────────────────────────────────

function showDialog() {
  const lv = LEVELS[curLevel];
  if (!lv.dialogs || curDialog >= lv.dialogs.length) return;

  const d = lv.dialogs[curDialog];
  document.getElementById('dlg-avatar').textContent = d.avatar;
  document.getElementById('dlg-name').textContent   = d.name;
  document.getElementById('dialog-box').classList.remove('hidden');

  const textEl = document.getElementById('dlg-text');
  textEl.textContent = '';
  let i = 0;
  const t = setInterval(() => {
    textEl.textContent += d.text[i++];
    if (i >= d.text.length) clearInterval(t);
  }, 20);
}

function nextDialog() {
  curDialog++;
  const lv = LEVELS[curLevel];
  if (curDialog < lv.dialogs.length) {
    showDialog();
  } else {
    document.getElementById('dialog-box').classList.add('hidden');
    showNotif('💡 Geser kiri/kanan untuk jelajahi ruangan, klik objek!');
  }
}

// ── Objectives ────────────────────────────

function renderObjectives(objectives) {
  const ul = document.getElementById('obj-list');
  ul.innerHTML = '';
  objectives.forEach(obj => {
    const li = document.createElement('li');
    li.id = 'li-' + obj.id;
    li.textContent = obj.text;
    ul.appendChild(li);
  });
}

function completeObjective(id) {
  if (doneObj.has(id)) return;

  const lv  = LEVELS[curLevel];
  const obj = lv.objectives.find(o => o.id === id);
  if (!obj) return;

  doneObj.add(id);
  const li = document.getElementById('li-' + id);
  if (li) li.classList.add('done');

  score += 20;
  document.getElementById('score').textContent = score;
  showNotif(`✓ Selesai: ${obj.text}`);

  // Mark room object
  const roomObj = document.getElementById('obj-room-' + id);
  if (roomObj) roomObj.classList.add('found');

  if (lv.objectives.every(o => doneObj.has(o.id))) {
    stopTimer();
    setTimeout(showLevelComplete, 1000);
  }
}

// ── Hints ─────────────────────────────────

function useHint() {
  if (hintsLeft <= 0) {
    showNotif('⚠️ Hint sudah habis!', true);
    return;
  }
  const lv = LEVELS[curLevel];
  const hintIdx = hintsUsed % lv.hints.length;
  const hint = lv.hints[hintIdx];

  // Show hint in dialog
  document.getElementById('dlg-avatar').textContent = '💡';
  document.getElementById('dlg-name').textContent   = 'Hint';
  document.getElementById('dlg-text').textContent   = hint;
  document.getElementById('dialog-box').classList.remove('hidden');

  hintsLeft--;
  hintsUsed++;
  score = Math.max(0, score - 10);
  document.getElementById('score').textContent = score;
  document.getElementById('hint-count').textContent = `(${hintsLeft})`;

  if (hintsLeft === 0) {
    document.getElementById('hint-btn').disabled = true;
  }
}

// ── Timer ─────────────────────────────────

function startTimer() {
  stopTimer();
  timerSec  = 0;
  timerTick = setInterval(() => {
    timerSec++;
    const m = String(Math.floor(timerSec / 60)).padStart(2,'0');
    const s = String(timerSec % 60).padStart(2,'0');
    document.getElementById('timer').textContent = `${m}:${s}`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerTick);
  timerTick = null;
}

// ── Level Complete ────────────────────────

function showLevelComplete() {
  const lv = LEVELS[curLevel];
  const m  = String(Math.floor(timerSec / 60)).padStart(2,'0');
  const s  = String(timerSec % 60).padStart(2,'0');

  let bonus = 0;
  if (timerSec < 90)  bonus = 100;
  else if (timerSec < 180) bonus = 60;
  else if (timerSec < 300) bonus = 30;
  score += bonus;

  const stars = timerSec < 90 ? '⭐⭐⭐' : timerSec < 180 ? '⭐⭐' : '⭐';
  document.querySelector('.lc-stars').textContent = stars;
  document.getElementById('lc-icon').textContent  = lv.badge.split(' ')[0];
  document.getElementById('lc-badge').textContent = lv.badge;
  document.getElementById('lc-score').textContent = score + (bonus ? ` (+${bonus})` : '');
  document.getElementById('lc-time').textContent  = `${m}:${s}`;
  document.getElementById('lc-hints').textContent = `${hintsUsed}x`;

  document.getElementById('level-complete').classList.remove('hidden');
}

function nextLevel() {
  document.getElementById('level-complete').classList.add('hidden');
  curLevel++;

  if (curLevel < LEVELS.length) {
    loadLevel(curLevel);
  } else {
    showGameComplete();
  }
}

function showGameComplete() {
  Panorama.destroy();
  document.getElementById('game-screen').classList.add('hidden');
  document.getElementById('main-menu').classList.remove('hidden');

  document.querySelector('.menu-center').innerHTML = `
    <div class="menu-icon-big" style="animation:none">🏆</div>
    <h1 class="menu-title" style="font-size:2rem">
      SELAMAT!<br/><span>NetAdmin Hero!</span>
    </h1>
    <p class="menu-tagline">
      Semua misi selesai! Berkat keahlianmu,<br/>
      Kota Netville kembali normal.<br/>
      Kamu resmi menjadi <strong>Senior SysAdmin Termuda!</strong> 🔥
    </p>
    <div style="font-size:1.6rem;margin:.5rem 0;color:var(--yellow)">⭐ ${score} poin</div>
    <div class="menu-btns" style="margin-top:1.5rem">
      <button class="mbtn mbtn-play" onclick="location.reload()">🔄 Main Lagi</button>
    </div>
    <div class="menu-footer" style="margin-top:1.5rem">SMK TKJ · Netville City · v2.0</div>
  `;
}

// ── Notification ──────────────────────────

function showNotif(msg, warn = false) {
  const el = document.getElementById('notif');
  el.textContent = msg;
  el.className   = warn ? 'warn-notif' : '';
  el.classList.remove('hidden');
  el.style.animation = 'none';
  void el.offsetHeight;
  el.style.animation = 'notifAnim 3s forwards';
  setTimeout(() => el.classList.add('hidden'), 3200);
}

// ── UI Helpers ────────────────────────────

function toggleObjPanel() {
  const body   = document.getElementById('obj-body');
  const toggle = document.getElementById('obj-toggle');
  objPanelOpen = !objPanelOpen;
  body.style.display  = objPanelOpen ? '' : 'none';
  toggle.textContent  = objPanelOpen ? '▼' : '▲';
}

function toggleMinimap() {
  const mm = document.getElementById('minimap');
  minimapOpen = !minimapOpen;
  mm.classList.toggle('hidden', !minimapOpen);
}

function goMainMenu() {
  stopTimer();
  Panorama.destroy();
  document.getElementById('game-screen').classList.add('hidden');
  document.getElementById('main-menu').classList.remove('hidden');
}

// ── Credits ───────────────────────────────

function showCredits() {
  document.getElementById('main-menu').classList.add('hidden');
  document.getElementById('credits-screen').classList.remove('hidden');
}
function hideCredits() {
  document.getElementById('credits-screen').classList.add('hidden');
  document.getElementById('main-menu').classList.remove('hidden');
}
