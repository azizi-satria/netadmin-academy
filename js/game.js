// ════════════════════════════════════════════
// GAME CONTROLLER — NetAdmin Academy v4 (3D)
// ════════════════════════════════════════════

let currentLevelIdx = 0;
let currentLevel    = null;
let score           = 0;
let playerName      = 'Andi';
let playerSchool    = 'SMK TKJ';
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
  const cb = document.getElementById('continue-btn');
  if (cb) cb.style.display = saveExists() ? '' : 'none';
}

function goMenu() {
  stopTimer();
  World.releasePointer();
  ['game-screen','lvl-complete','pause-screen'].forEach(id => document.getElementById(id).classList.add('hidden'));
  document.getElementById('main-menu').classList.remove('hidden');
  document.getElementById('click-to-start').style.display = 'none';
  // Refresh continue button
  const cb = document.getElementById('continue-btn');
  if (cb) cb.style.display = saveExists() ? '' : 'none';
}

// ── Pause Menu ────────────────────────────
function showPauseMenu() {
  stopTimer();
  document.getElementById('pause-screen').classList.remove('hidden');
}

function resumeGame() {
  document.getElementById('pause-screen').classList.add('hidden');
  startTimer();
  setTimeout(() => { document.getElementById('c').requestPointerLock(); }, 150);
}

function exitToMenu() {
  document.getElementById('pause-screen').classList.add('hidden');
  goMenu();
}

// ── Save / Load ───────────────────────────
const SAVE_KEY = 'netadmin_v1_save';

function saveExists() { return !!localStorage.getItem(SAVE_KEY); }

function saveGame() {
  const data = {
    playerName, playerSchool, selectedLocation,
    currentLevelIdx, score, timerSec,
    savedAt: new Date().toLocaleString('id-ID')
  };
  localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  showNotif('💾 Progress tersimpan!');
  const cb = document.getElementById('continue-btn');
  if (cb) cb.style.display = '';
}

function continueSave() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return;
  const s = JSON.parse(raw);
  playerName        = s.playerName   || 'Andi';
  playerSchool      = s.playerSchool || 'SMK TKJ';
  selectedLocation  = s.selectedLocation || 'gov';
  currentLevelIdx   = s.currentLevelIdx  || 0;
  score             = s.score   || 0;
  timerSec          = s.timerSec || 0;
  document.getElementById('main-menu').classList.add('hidden');
  document.getElementById('game-screen').classList.remove('hidden');
  World.setLocationTheme(selectedLocation);
  loadLevel(currentLevelIdx);
}

// ── Name Input ────────────────────────────
const AVATARS = ['😊','😎','🤓','😄','🧑‍💻','👨‍🎓','👩‍🎓','🧑‍🎓'];
function showNameInput() {
  document.getElementById('main-menu').classList.add('hidden');
  document.getElementById('name-screen').classList.remove('hidden');
  setTimeout(() => document.getElementById('player-name-input').focus(), 100);
}
function hideNameInput() {
  document.getElementById('name-screen').classList.add('hidden');
  document.getElementById('main-menu').classList.remove('hidden');
  document.getElementById('player-name-input').value  = '';
  document.getElementById('player-school-input').value = '';
  document.getElementById('name-preview').classList.add('hidden');
  document.getElementById('name-confirm-btn').disabled = true;
  document.getElementById('name-confirm-btn').style.opacity = '.4';
}
function onNameType() {
  const name   = document.getElementById('player-name-input').value.trim();
  const school = document.getElementById('player-school-input').value.trim();
  const btn    = document.getElementById('name-confirm-btn');
  const preview = document.getElementById('name-preview');
  const nicName   = document.getElementById('nic-name');
  const nicSchool = document.getElementById('nic-school');
  const avatar    = document.getElementById('name-avatar');

  const valid = name.length >= 2;

  if (valid) {
    nicName.textContent   = name.toUpperCase();
    nicSchool.textContent = school || 'SMK TKJ';
    preview.classList.remove('hidden');
    btn.disabled = false;
    btn.style.opacity = '1';
    avatar.textContent = AVATARS[name.charCodeAt(0) % AVATARS.length];
  } else {
    preview.classList.add('hidden');
    btn.disabled = true;
    btn.style.opacity = '.4';
    avatar.textContent = '😊';
  }
}
function confirmName() {
  const name   = document.getElementById('player-name-input').value.trim();
  const school = document.getElementById('player-school-input').value.trim();
  if (name.length < 2) return;
  playerName   = name;
  playerSchool = school || 'SMK TKJ';
  document.getElementById('name-screen').classList.add('hidden');
  showLocationSelect();
}

function showHowTo()   { document.getElementById('howto-screen').classList.remove('hidden'); }
function hideHowTo()   { document.getElementById('howto-screen').classList.add('hidden'); }
function showCredits() { document.getElementById('credits-screen').classList.remove('hidden'); }
function hideCredits() { document.getElementById('credits-screen').classList.add('hidden'); }

// ── Location Select ───────────────────────
const LOCATIONS = {
  gov:    { name: 'Dinas Pemerintahan',   icon: '🏛️', place: 'Kota Netville',           color: '#7c3aed' },
  campus: { name: 'Kampus Teknik',        icon: '🏫', place: 'Universitas Netville',    color: '#0891b2' },
  corp:   { name: 'PT Netville Teknologi',icon: '🏢', place: 'Kawasan Industri Netville',color: '#059669' },
  isp:    { name: 'Netville Fiber ISP',   icon: '📡', place: 'NOC Pusat Netville',      color: '#d97706' },
};
let selectedLocation = 'gov';

function showLocationSelect() {
  document.getElementById('main-menu').classList.add('hidden');
  document.getElementById('location-screen').classList.remove('hidden');
}

function hideLocationSelect() {
  document.getElementById('location-screen').classList.add('hidden');
  document.getElementById('main-menu').classList.remove('hidden');
}

function selectLocation(locId) {
  selectedLocation = locId;
  const loc = LOCATIONS[locId];
  World.setLocationTheme(locId);
  document.getElementById('location-screen').classList.add('hidden');
  showLocationBrief(loc);
}

function showLocationBrief(loc) {
  document.getElementById('game-screen').classList.remove('hidden');
  // Gunakan playerName & playerSchool langsung (sudah tersimpan di confirmName)
  const n = playerName, s = playerSchool;
  showDialog([
    { avatar: '📋', name: 'Surat Pengantar PKL',
      text: `Dengan ini dinyatakan bahwa ${n} dari ${s}, diterima sebagai siswa PKL di ${loc.name} — ${loc.place}.` },
    { avatar: loc.icon, name: loc.name,
      text: `Selamat datang, ${n}! Kami harap kamu siap bekerja keras. Tempat ini tidak pernah sepi tantangan!` },
    { avatar: '😅', name: `${n} (Kamu)`,
      text: `Bismillah... siap! Nama saya ${n} dari ${s}. Saya akan buktikan kemampuan saya! 💪` }
  ], startGame);
}

// ── Start / Load level ────────────────────
function startGame() {
  currentLevelIdx = 0;
  score = 0;
  document.getElementById('hud-score').textContent = score;
  document.getElementById('main-menu').classList.add('hidden');
  document.getElementById('game-screen').classList.remove('hidden');
  // Tampilkan badge lokasi di HUD
  const loc = LOCATIONS[selectedLocation];
  if (loc) {
    const ms = document.getElementById('hud-ms');
    if (ms) ms.title = `${loc.icon} ${loc.name}`;
  }
  loadLevel(0);
}

function loadLevel(idx) {
  currentLevel = LEVELS[idx];
  hintsLeft    = 3;
  timerSec     = 0;

  document.getElementById('game-screen').classList.remove('hidden');
  document.getElementById('lvl-complete').classList.add('hidden');
  document.getElementById('hud-lv').textContent    = 'Level ' + (idx + 1);
  document.getElementById('hud-ms').textContent    = applyPlayerVars(currentLevel.mission);
  document.getElementById('hud-score').textContent = score;
  document.getElementById('hint-left').textContent = hintsLeft;

  objectives = currentLevel.objectives.map(o => ({ ...o, done: false }));
  renderObjectives();
  Terminal.reset();

  // Pintu dikunci sampai player bicara dengan Pak Heri
  _lobbyGateDone = false;
  World.setDoorGate(() => {
    if (!_lobbyGateDone) {
      showNotif('💬 Bicara dulu dengan Pak Heri sebelum masuk server room!');
      return false;
    }
    return true;
  });

  // Load 3D corridor, door opens → enter server room
  World.loadRoom('lobby', currentLevel, () => {
    World.releasePointer();
    World.loadRoom('serverroom', currentLevel, null);
    setTimeout(() => showNotif('🔍 Temukan Kak Sari! Dekati lalu tekan E untuk bicara.'), 900);
  });

  // Show click-to-start overlay
  document.getElementById('click-to-start').style.display = 'flex';
  setTimeout(() => showNotif('👋 Dekati NPC dan tekan E untuk memulai cerita!'), 1500);

  // Dialog hanya muncul saat berinteraksi dengan NPC (tekan E)

  startTimer();
}

// ── Character click ───────────────────────
let _lobbyGateDone = false;

function onCharClick(charId) {
  World.releasePointer();
  const key = 'char_' + charId.replace(/-/g, '_');
  const dlg = currentLevel.dialogs[key] || currentLevel.dialogs['intro'];
  if (!dlg) return;

  // Pak Heri = gate keeper — setelah dialog selesai, pintu server room terbuka
  const isPakHeri = charId.includes('pak-heri') || charId.includes('pak_heri');
  const cb = isPakHeri ? () => {
    _lobbyGateDone = true;
    showNotif('✅ Sekarang kamu bisa masuk ke server room!');
    World.setDoorGate(null);   // hapus gate setelah terpenuhi
  } : null;

  showDialog(dlg, cb);
}

// ── Item click ────────────────────────────
function onItemClick(itemId) {
  const item = currentLevel.items[itemId];
  if (!item) return;

  World.releasePointer();
  World.markItemFound(itemId);
  addScore(50);

  document.getElementById('ins-ico').textContent   = item.icon || item.emoji || '🔍';
  document.getElementById('ins-title').textContent = applyPlayerVars(item.title);
  document.getElementById('ins-badge').textContent = item.statusText || item.status || '';
  document.getElementById('ins-body').textContent  = applyPlayerVars(item.body);

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

function applyPlayerVars(str) {
  if (!str) return str;
  // Ganti semua variasi nama dan sekolah di teks dialog
  return str
    .replace(/\bAndi\b/gi, playerName)
    .replace(/\bAndi \(Kamu\)/gi, `${playerName} (Kamu)`)
    .replace(/SMK TKJ Netville/gi, playerSchool)
    .replace(/SMK TKJ/gi, playerSchool)
    .replace(/SMKN 1 Netville/gi, playerSchool);
}

function gameActive()  { return !document.getElementById('game-screen').classList.contains('hidden'); }
function isAnyUIOpen() {
  return ['dialog-box','inspect-box','term-overlay','pause-screen'].some(
    id => { const el = document.getElementById(id); return el && !el.classList.contains('hidden'); });
}

function renderDialogLine() {
  if (dialogIdx >= dialogQueue.length) {
    document.getElementById('dialog-box').classList.add('hidden');
    if (dialogCallback) {
      const cb = dialogCallback; dialogCallback = null; cb();
    } else {
      // Dialog NPC selesai — otomatis kembali ke mode jalan (re-lock pointer)
      setTimeout(() => {
        if (gameActive() && !isAnyUIOpen()) document.getElementById('c').requestPointerLock();
      }, 200);
    }
    return;
  }
  const line = dialogQueue[dialogIdx];
  document.getElementById('dlg-ava').textContent = line.avatar || line.who || '👤';
  document.getElementById('dlg-who').textContent = applyPlayerVars(line.name || '');
  typeWriter('dlg-txt', applyPlayerVars(line.text || ''));
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

  document.getElementById('lc-badge-txt').textContent = `${badges[currentLevelIdx] || '🌟 Selesai'} — ${playerName}`;
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
      { avatar: '🏆', name: 'Selamat!', text: `${playerName} telah menyelesaikan semua 5 level PKL! Kamu adalah Master NetAdmin Netville City!` },
      { avatar: '🎓', name: 'Pak Heri', text: `Luar biasa, ${playerName}! Dari siswa PKL hari pertama sampai jadi pahlawan kota — kami bangga punya kamu!` },
      { avatar: '😎', name: 'Kak Sari', text: `Jujur, aku hampir tidak percaya ada siswa PKL sehandal ${playerName}. Kalau sudah lulus, langsung lamar kerja di sini ya! 😄` }
    ], goMenu);
    return;
  }
  document.getElementById('lvl-complete').classList.add('hidden');
  loadLevel(currentLevelIdx);
}
