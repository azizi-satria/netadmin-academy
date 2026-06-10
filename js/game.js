// ════════════════════════════════════════════
// GAME CONTROLLER — NetAdmin Academy v4 (3D)
// ════════════════════════════════════════════

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

// ── Boot ──────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  buildStars();
  bootLoader();
  // Init Three.js world immediately (renders in background)
  World.init(onWorldInteract);
});

function bootLoader() {
  const fill = document.getElementById('ld-fill');
  const msg  = document.getElementById('ld-msg');
  const msgs = ['Menyalakan server...','Memuat 3D engine...','Inisialisasi terminal...','Siap!'];
  let pct = 0, mi = 0;
  const iv = setInterval(() => {
    pct += Math.random() * 25 + 10;
    if (pct >= 100) { pct = 100; clearInterval(iv); }
    fill.style.width = Math.min(pct, 100) + '%';
    mi = Math.min(mi + 1, msgs.length - 1);
    msg.textContent = msgs[mi];
    if (pct >= 100) setTimeout(showMenu, 500);
  }, 400);
}

function buildStars() {
  const c = document.getElementById('mm-stars');
  if (!c) return;
  for (let i = 0; i < 80; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    s.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;`
      + `width:${Math.random()*2+1}px;height:${Math.random()*2+1}px;`
      + `animation-delay:${Math.random()*3}s;animation-duration:${Math.random()*2+2}s`;
    c.appendChild(s);
  }
}

// ── World interaction callback ─────────────
function onWorldInteract(type, id) {
  if (type === 'char') onCharClick(id);
  if (type === 'item') onItemClick(id);
}

// ── Screens ───────────────────────────────
function showMenu() {
  document.getElementById('loading-screen').classList.add('hidden');
  document.getElementById('main-menu').classList.remove('hidden');
}

function goMenu() {
  stopTimer();
  World.releasePointer();
  ['game-screen','lvl-complete'].forEach(id => document.getElementById(id).classList.add('hidden'));
  document.getElementById('main-menu').classList.remove('hidden');
  document.getElementById('click-to-start').style.display = 'none';
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
  hintsLeft    = 3;
  timerSec     = 0;

  document.getElementById('game-screen').classList.remove('hidden');
  document.getElementById('lvl-complete').classList.add('hidden');
  document.getElementById('hud-lv').textContent    = 'Level ' + (idx + 1);
  document.getElementById('hud-ms').textContent    = currentLevel.mission;
  document.getElementById('hud-score').textContent = score;
  document.getElementById('hint-left').textContent = hintsLeft;

  objectives = currentLevel.objectives.map(o => ({ ...o, done: false }));
  renderObjectives();
  Terminal.reset();

  // Load 3D corridor, door opens → enter server room
  World.loadRoom('lobby', currentLevel, () => {
    // Door opened! Transition to server room
    World.loadRoom('serverroom', currentLevel, null);
    // Show intro dialog if any after entering
    const srDef = currentLevel.scenes.serverroom;
    if (srDef && srDef.dialogOnEnter) {
      const dlg = currentLevel.dialogs[srDef.dialogOnEnter];
      if (dlg) setTimeout(() => showDialog(dlg), 800);
    }
  });

  // Show click-to-start overlay
  document.getElementById('click-to-start').style.display = 'flex';

  // Auto-show intro dialog (lobby)
  const lobbyDef = currentLevel.scenes.lobby;
  if (lobbyDef && lobbyDef.dialogOnEnter) {
    const dlg = currentLevel.dialogs[lobbyDef.dialogOnEnter];
    if (dlg) setTimeout(() => showDialog(dlg), 1200);
  }

  startTimer();
}

// ── Character click ───────────────────────
function onCharClick(charId) {
  World.releasePointer();
  const dlg = currentLevel.dialogs['char_' + charId]
    || (charId === 'sari' ? currentLevel.dialogs['sari_greet'] : null)
    || currentLevel.dialogs['intro'];
  if (dlg) showDialog(dlg);
}

// ── Item click ────────────────────────────
function onItemClick(itemId) {
  const item = currentLevel.items[itemId];
  if (!item) return;

  World.releasePointer();
  World.markItemFound(itemId);
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
  document.getElementById('dlg-who').textContent = line.name || '';
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
    li.className = o.done ? 'done' : '';
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
  World.releasePointer();
  showDialog([{ avatar: '💡', name: 'Petunjuk', text: hint || 'Dekati semua objek di server room dan tekan E.' }]);
}

// ── Score / Notif ─────────────────────────
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
  World.releasePointer();
  addScore(Math.max(0, 600 - timerSec) * 2);

  const m = String(Math.floor(timerSec / 60)).padStart(2, '0');
  const s = String(timerSec % 60).padStart(2, '0');
  const badges = ['🥉 Teknisi Pemula','🥈 Sysadmin Muda','🥇 Network Engineer','🏅 Senior SysAdmin','🏆 Master NetAdmin'];

  document.getElementById('lc-badge-txt').textContent = badges[currentLevelIdx] || '🌟 Selesai';
  document.getElementById('lc-sc').textContent = score;
  document.getElementById('lc-tm').textContent = m + ':' + s;
  document.getElementById('lc-ht').textContent = (3 - hintsLeft) + 'x';

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
      { avatar: '🏆', name: 'Selamat!', text: 'Kamu telah menyelesaikan semua 5 level! Kamu adalah Master NetAdmin Netville City!' },
      { avatar: '🎓', name: 'Pak Kepala', text: 'Luar biasa! Terima kasih sudah menyelamatkan sistem kami berkali-kali!' }
    ], goMenu);
    return;
  }
  document.getElementById('lvl-complete').classList.add('hidden');
  loadLevel(currentLevelIdx);
}
