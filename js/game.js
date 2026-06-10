// ════════════════════════════════════════════
// GAME CONTROLLER — NetAdmin Academy v3
// ════════════════════════════════════════════

// ── State ─────────────────────────────────
let currentLevelIdx = 0;
let currentLevel    = null;
let score           = 0;
let hintsLeft       = 3;
let timerSec        = 0;
let timerHandle     = null;
let dialogQueue     = [];
let dialogIdx       = 0;
let dialogCallback  = null;
let objectives      = [];
let inServerRoom    = false;

// ── Boot ──────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  buildStars();
  bootLoader();
});

function bootLoader() {
  const fill = document.getElementById('ld-fill');
  const msg  = document.getElementById('ld-msg');
  const msgs = [
    'Menyalakan server...', 'Memuat modul jaringan...',
    'Inisialisasi terminal...', 'Mengkonfigurasi firewall...', 'Siap!'
  ];
  let pct = 0, mi = 0;
  const iv = setInterval(() => {
    pct += Math.random() * 22 + 8;
    if (pct >= 100) { pct = 100; clearInterval(iv); }
    fill.style.width = Math.min(pct, 100) + '%';
    mi = Math.min(mi + 1, msgs.length - 1);
    msg.textContent = msgs[mi];
    if (pct >= 100) setTimeout(showMenu, 500);
  }, 420);
}

function buildStars() {
  const c = document.getElementById('mm-stars');
  if (!c) return;
  for (let i = 0; i < 80; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    s.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;` +
      `width:${Math.random()*2+1}px;height:${Math.random()*2+1}px;` +
      `animation-delay:${Math.random()*3}s;animation-duration:${Math.random()*2+2}s`;
    c.appendChild(s);
  }
}

// ── Screen transitions ────────────────────
function showMenu() {
  document.getElementById('loading-screen').classList.add('hidden');
  document.getElementById('main-menu').classList.remove('hidden');
}

function goMenu() {
  stopTimer();
  ['game-screen','lvl-complete'].forEach(id => document.getElementById(id).classList.add('hidden'));
  document.getElementById('main-menu').classList.remove('hidden');
}

function showHowTo()   { document.getElementById('howto-screen').classList.remove('hidden'); }
function hideHowTo()   { document.getElementById('howto-screen').classList.add('hidden'); }
function showCredits() { document.getElementById('credits-screen').classList.remove('hidden'); }
function hideCredits() { document.getElementById('credits-screen').classList.add('hidden'); }

// ── Start / Load level ────────────────────
function startGame() {
  currentLevelIdx = 0;
  score = 0;
  document.getElementById('hud-score').textContent = score;
  document.getElementById('main-menu').classList.add('hidden');
  loadLevel(0);
}

function loadLevel(idx) {
  currentLevel = LEVELS[idx];
  inServerRoom = false;
  hintsLeft    = 3;
  timerSec     = 0;

  document.getElementById('game-screen').classList.remove('hidden');
  document.getElementById('lvl-complete').classList.add('hidden');

  // HUD
  document.getElementById('hud-lv').textContent    = 'Level ' + (idx + 1);
  document.getElementById('hud-ms').textContent    = currentLevel.mission;
  document.getElementById('hud-score').textContent = score;
  document.getElementById('hint-left').textContent = hintsLeft;

  // Objectives
  objectives = currentLevel.objectives.map(o => ({ ...o, done: false }));
  renderObjectives();

  // Reset terminal
  Terminal.reset();

  // Build lobby (corridor)
  Engine.buildScene('lobby', currentLevel);
  wireDoor();
  wireLobbyChars();

  // Auto-show intro dialog if defined
  const lobby = currentLevel.scenes.lobby;
  if (lobby && lobby.dialogOnEnter) {
    const dlg = currentLevel.dialogs[lobby.dialogOnEnter];
    if (dlg) setTimeout(() => showDialog(dlg), 600);
  }

  startTimer();
}

function wireLobbyChars() {
  const lobby = currentLevel.scenes && currentLevel.scenes.lobby;
  if (!lobby || !lobby.chars) return;
  lobby.chars.forEach(ch => {
    setTimeout(() => {
      const el = document.getElementById('char-' + ch.id);
      if (el) el.onclick = () => onCharClick(ch.id);
    }, 120);
  });
}

// ── Door wiring ───────────────────────────
function wireDoor() {
  setTimeout(() => {
    const wrap = document.getElementById('door-wrap');
    if (wrap) wrap.onclick = () => {
      if (Engine.isTransitioning()) return;
      Engine.openDoorAndEnter('serverroom', currentLevel, onEnterServerRoom);
    };
  }, 120);
}

function onEnterServerRoom() {
  inServerRoom = true;
  wireItems();
  wireRoomChars();
}

function wireItems() {
  if (!currentLevel.items) return;
  Object.keys(currentLevel.items).forEach(id => {
    const el = document.getElementById('item-' + id);
    if (el) el.onclick = () => onItemClick(id);
  });
}

function wireRoomChars() {
  const def = currentLevel.scenes && currentLevel.scenes.serverroom;
  if (!def || !def.chars) return;
  def.chars.forEach(ch => {
    const el = document.getElementById('char-' + ch.id);
    if (el) el.onclick = () => onCharClick(ch.id);
  });
}

// ── Navigation ────────────────────────────
function navLeft() {
  if (Engine.isTransitioning()) return;
  const sid   = Engine.getCurrentScene();
  const scene = currentLevel.scenes[sid];
  if (scene && scene.navLeft) Engine.walkTo(scene.navLeft, currentLevel, wireItems);
}

function navRight() {
  if (Engine.isTransitioning()) return;
  const sid   = Engine.getCurrentScene();
  const scene = currentLevel.scenes[sid];
  if (scene && scene.navRight) Engine.walkTo(scene.navRight, currentLevel, wireItems);
}

function navBack() {
  if (Engine.isTransitioning()) return;
  const sid   = Engine.getCurrentScene();
  const scene = currentLevel.scenes[sid];
  if (scene && scene.navBack) {
    Engine.walkTo(scene.navBack, currentLevel, () => {
      inServerRoom = false;
      wireDoor();
    });
  }
}

// ── Character click ───────────────────────
function onCharClick(charId) {
  // Try char-specific key first, then sari_greet for sari, fallback intro
  const dlg = currentLevel.dialogs['char_' + charId]
    || (charId === 'sari' ? currentLevel.dialogs['sari_greet'] : null)
    || currentLevel.dialogs['intro'];
  if (!dlg) return;

  showDialog(dlg, () => {
    // After dialog, highlight the door as next step
    const hint = document.getElementById('door-hint');
    if (hint) { hint.style.display = ''; hint.textContent = 'Klik pintu untuk masuk →'; }
  });
}

// ── Item click (server room) ──────────────
function onItemClick(itemId) {
  const item = currentLevel.items[itemId];
  if (!item) return;

  Engine.markItemFound(itemId);
  addScore(50);

  document.getElementById('ins-ico').textContent   = item.icon || item.emoji || '🔍';
  document.getElementById('ins-title').textContent = item.title;
  document.getElementById('ins-badge').textContent = item.statusText || item.status || '';
  document.getElementById('ins-body').textContent  = item.body;

  const theory = document.getElementById('ins-theory');
  if (item.theory) {
    theory.classList.remove('hidden');
    document.getElementById('th-txt').textContent = item.theory;
  } else {
    theory.classList.add('hidden');
  }

  const actBtn = document.getElementById('ins-action');
  if (item.triggerTerm) {
    actBtn.classList.remove('hidden');
    actBtn.onclick = () => { closeInspect(); openTerm(); };
  } else {
    actBtn.classList.add('hidden');
  }

  document.getElementById('inspect-box').classList.remove('hidden');
}

function closeInspect() {
  document.getElementById('inspect-box').classList.add('hidden');
}

// ── Dialog system ─────────────────────────
function showDialog(lines, callback) {
  dialogQueue    = lines;
  dialogIdx      = 0;
  dialogCallback = callback || null;
  document.getElementById('dialog-box').classList.remove('hidden');
  renderDialogLine();
}

function renderDialogLine() {
  if (dialogIdx >= dialogQueue.length) {
    document.getElementById('dialog-box').classList.add('hidden');
    if (dialogCallback) { const cb = dialogCallback; dialogCallback = null; cb(); }
    return;
  }
  const line = dialogQueue[dialogIdx];
  document.getElementById('dlg-ava').textContent = line.avatar || line.who || '👤';
  document.getElementById('dlg-who').textContent = line.name   || '';
  typeWriter('dlg-txt', line.text);
}

function advanceDialog() {
  dialogIdx++;
  renderDialogLine();
}

function typeWriter(elId, text) {
  const el = document.getElementById(elId);
  el.textContent = '';
  let i = 0;
  if (el._tw) clearInterval(el._tw);
  el._tw = setInterval(() => {
    el.textContent += text[i++];
    if (i >= text.length) clearInterval(el._tw);
  }, 20);
}

// ── Terminal ──────────────────────────────
function openTerm() {
  Terminal.boot();
  document.getElementById('term-overlay').classList.remove('hidden');
  setTimeout(() => document.getElementById('trm-in').focus(), 80);
}

function closeTerm() {
  document.getElementById('term-overlay').classList.add('hidden');
}

// ── Objectives ────────────────────────────
function renderObjectives() {
  const ul = document.getElementById('obj-ul');
  ul.innerHTML = '';
  objectives.forEach(o => {
    const li = document.createElement('li');
    li.className = 'obj-item' + (o.done ? ' done' : '');
    li.id = 'obj-' + o.id;
    li.textContent = o.text;
    ul.appendChild(li);
  });
}

function completeObjective(id) {
  const obj = objectives.find(o => o.id === id);
  if (!obj || obj.done) return;
  obj.done = true;
  renderObjectives();
  addScore(200);
  showNotif('✓ ' + obj.text);

  if (objectives.every(o => o.done)) setTimeout(levelComplete, 900);
}

function toggleObj() {
  const inner = document.getElementById('obj-inner');
  const tog   = document.getElementById('obj-tog');
  const closed = inner.style.display === 'none';
  inner.style.display = closed ? '' : 'none';
  tog.textContent     = closed ? '▾' : '▸';
}

// ── Hints ─────────────────────────────────
function useHint() {
  if (hintsLeft <= 0) { showNotif('Hint sudah habis!'); return; }
  const hint = currentLevel.hints[3 - hintsLeft];
  hintsLeft--;
  document.getElementById('hint-left').textContent = hintsLeft;
  showDialog([{ avatar: '💡', name: 'Petunjuk', text: hint || 'Periksa semua objek di server room.' }]);
}

// ── Score & notif ─────────────────────────
function addScore(pts) {
  score += pts;
  document.getElementById('hud-score').textContent = score;
}

function showNotif(msg) {
  const el = document.getElementById('notif');
  el.textContent = msg;
  el.classList.remove('hidden');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.add('hidden'), 2800);
}

// ── Timer ─────────────────────────────────
function startTimer() {
  stopTimer();
  timerHandle = setInterval(() => {
    timerSec++;
    const m = String(Math.floor(timerSec / 60)).padStart(2, '0');
    const s = String(timerSec % 60).padStart(2, '0');
    document.getElementById('hud-time').textContent = m + ':' + s;
  }, 1000);
}

function stopTimer() { clearInterval(timerHandle); timerHandle = null; }

// ── Level complete ─────────────────────────
function levelComplete() {
  stopTimer();

  const timeBonus = Math.max(0, 600 - timerSec) * 2;
  addScore(timeBonus);

  const m = String(Math.floor(timerSec / 60)).padStart(2, '0');
  const s = String(timerSec % 60).padStart(2, '0');

  const badges = [
    '🥉 Teknisi Pemula', '🥈 Sysadmin Muda', '🥇 Network Engineer',
    '🏅 Senior SysAdmin', '🏆 Master NetAdmin'
  ];
  document.getElementById('lc-badge-txt').textContent = badges[currentLevelIdx] || '🌟 Selesai';
  document.getElementById('lc-sc').textContent = score;
  document.getElementById('lc-tm').textContent = m + ':' + s;
  document.getElementById('lc-ht').textContent = (3 - hintsLeft) + 'x';

  // Reset burst animation
  const burst = document.getElementById('lc-burst');
  burst.style.animation = 'none';
  void burst.offsetHeight;
  burst.style.animation = '';

  document.getElementById('lvl-complete').classList.remove('hidden');
}

function nextLevel() {
  currentLevelIdx++;
  if (currentLevelIdx >= LEVELS.length) {
    document.getElementById('lvl-complete').classList.add('hidden');
    showDialog([
      { avatar: '🏆', name: 'Selamat!',     text: 'Kamu telah menyelesaikan semua 5 level! Kamu adalah Master NetAdmin Netville City!' },
      { avatar: '🎓', name: 'Pak Kepala',    text: 'Luar biasa! Kamu sudah menguasai administrasi server Linux dari dasar sampai advanced. Terima kasih!' }
    ], goMenu);
    return;
  }
  document.getElementById('lvl-complete').classList.add('hidden');
  loadLevel(currentLevelIdx);
}
