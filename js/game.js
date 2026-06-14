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
let foundItemsData  = [];
let _sariIntroDone  = false;
let livesLeft       = 3;
let wrongCmdStreak  = 0;
let _tutorialDone   = false;
let _tutStep        = 0;

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
  livesLeft = 3;
  _tutorialDone = false;
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
  document.getElementById('hud-lives').textContent = livesLeft;

  objectives = currentLevel.objectives.map(o => ({ ...o, done: false }));
  foundItemsData = [];
  _sariIntroDone = false;
  wrongCmdStreak = 0;
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
  setTimeout(() => showMissionIntro(), 600);
}

// ── Character click ───────────────────────
let _lobbyGateDone = false;

function onCharClick(charId) {
  World.releasePointer();
  const key = 'char_' + charId.replace(/-/g, '_');
  const isPakHeri = charId.includes('pak-heri') || charId.includes('pak_heri');
  const isKakSari = charId.includes('kak-sari') || charId.includes('kak_sari');

  let dlg;
  if (isKakSari && _sariIntroDone) {
    // Sari sudah intro — tampilkan petunjuk, bukan dialog awal
    dlg = currentLevel.dialogs['char_kak_sari_followup']
       || buildSariHintDialog();
  } else {
    dlg = currentLevel.dialogs[key] || currentLevel.dialogs['intro'];
  }
  if (!dlg) return;

  const cb = isPakHeri ? () => {
    _lobbyGateDone = true;
    showNotif('✅ Sekarang kamu bisa masuk ke server room!');
    World.setDoorGate(null);
  } : isKakSari && !_sariIntroDone ? () => {
    _sariIntroDone = true;
    setTimeout(() => {
      if (gameActive() && !isAnyUIOpen()) document.getElementById('c').requestPointerLock();
    }, 200);
  } : null;

  showDialog(dlg, cb);
}

function buildSariHintDialog() {
  const undone = objectives.filter(o => !o.done);
  if (undone.length === 0) {
    return [{ avatar: '😎', name: 'Kak Sari', text: 'Sudah selesai semua! Kamu keren banget! 🎉' }];
  }
  const hints = (currentLevel.hints || []);
  const lines = [
    { avatar: '😎', name: 'Kak Sari', text: 'Butuh bantuan? Oke, ini petunjuknya untuk misi ini:' },
    ...hints.map(h => ({ avatar: '😎', name: 'Kak Sari', text: h })),
    { avatar: '😎', name: 'Kak Sari', text: `Sisa ${undone.length} tugas lagi. Kamu pasti bisa! 💪` }
  ];
  return lines;
}

// ── Item click ────────────────────────────
function onItemClick(itemId) {
  const item = currentLevel.items[itemId];
  if (!item) return;

  World.releasePointer();

  // Skor & tracking hanya saat pertama kali diperiksa
  if (!foundItemsData.find(f => f.id === itemId)) {
    addScore(50);
    foundItemsData.push({ id: itemId, icon: item.icon || '🔍', title: item.title, body: item.body, theory: item.theory });
  }

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
  return ['dialog-box','inspect-box','term-overlay','pause-screen','mission-intro','info-panel','tutorial-overlay','game-over'].some(
    id => { const el = document.getElementById(id); return el && !el.classList.contains('hidden'); });
}

function showMissionIntro() {
  const lv = currentLevel;
  if (!lv) return;
  World.releasePointer();
  document.getElementById('click-to-start').style.display = 'none';
  document.getElementById('mi-level').textContent = 'Level ' + (currentLevelIdx + 1);
  document.getElementById('mi-icon').textContent = lv.badge ? lv.badge.split(' ')[0] : '🎯';
  document.getElementById('mi-title').textContent = lv.title;
  document.getElementById('mi-mission').textContent = lv.mission;
  const ul = document.getElementById('mi-objectives');
  ul.innerHTML = '';
  (lv.objectives || []).forEach(o => {
    const li = document.createElement('li');
    li.textContent = o.text;
    ul.appendChild(li);
  });
  document.getElementById('mission-intro').classList.remove('hidden');
}
function closeMissionIntro() {
  document.getElementById('mission-intro').classList.add('hidden');
  // Tampilkan tutorial hanya di level pertama, pertama kali main
  if (currentLevelIdx === 0 && !_tutorialDone) {
    setTimeout(startTutorial, 300);
  } else {
    setTimeout(() => {
      if (gameActive() && !isAnyUIOpen()) document.getElementById('c').requestPointerLock();
    }, 300);
  }
}

function showInfoPanel() {
  World.releasePointer();
  const list = document.getElementById('info-list');
  const empty = document.getElementById('info-empty');
  list.innerHTML = '';
  if (foundItemsData.length === 0) {
    empty.style.display = '';
  } else {
    empty.style.display = 'none';
    foundItemsData.forEach(item => {
      const div = document.createElement('div');
      div.style.cssText = 'border:1px solid rgba(124,58,237,.25);border-radius:10px;padding:.75rem;margin-bottom:.6rem;background:rgba(124,58,237,.06)';
      div.innerHTML = `<div style="font-weight:700;color:#fff;margin-bottom:.25rem">${item.icon} ${item.title}</div>`
        + `<p style="color:#aaa;font-size:.8rem;white-space:pre-line;margin:0 0 .35rem">${item.body}</p>`
        + (item.theory ? `<p style="color:#a855f7;font-size:.75rem;margin:0"><strong>📚</strong> ${item.theory}</p>` : '');
      list.appendChild(div);
    });
  }
  document.getElementById('info-panel').classList.remove('hidden');
}
function closeInfoPanel() {
  document.getElementById('info-panel').classList.add('hidden');
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
  if (line.camYaw !== undefined) World.setCamTarget(line.camYaw, line.camPitch ?? 0);
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
  const sum = currentLevel.summary;
  const sumEl = document.getElementById('lc-summary');
  if (sum && sumEl) {
    sumEl.classList.remove('hidden');
    document.getElementById('lc-sum-problem').textContent = sum.problem;
    document.getElementById('lc-sum-action').textContent  = sum.action;
    document.getElementById('lc-sum-lesson').textContent  = sum.lesson;
  } else if (sumEl) {
    sumEl.classList.add('hidden');
  }
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

// ── Lives System ──────────────────────────
function loseLife(reason) {
  livesLeft--;
  document.getElementById('hud-lives').textContent = livesLeft;
  wrongCmdStreak = 0;

  const el = document.getElementById('hud-lives-chip');
  if (el) {
    el.style.transform = 'scale(1.4)';
    el.style.color = '#ff2222';
    setTimeout(() => { el.style.transform = ''; el.style.color = '#ef4444'; }, 400);
  }

  if (livesLeft <= 0) {
    showGameOver(reason);
  } else {
    showNotif(`❤️ Nyawa tersisa ${livesLeft} — ${reason}`);
  }
}

function showGameOver(reason) {
  stopTimer();
  World.releasePointer();
  document.getElementById('go-msg').textContent =
    `${reason}\n\nKamu kehabisan nyawa di Level ${currentLevelIdx + 1}. Jangan menyerah — coba lagi!`;
  document.getElementById('game-over').classList.remove('hidden');
}

function retryLevel() {
  livesLeft = 3;
  document.getElementById('game-over').classList.add('hidden');
  loadLevel(currentLevelIdx);
}

// Panggil dari terminal.js ketika command salah
function onWrongCommand() {
  wrongCmdStreak++;
  if (wrongCmdStreak >= 3) {
    loseLife('3 command salah berturut-turut — baca petunjuk Kak Sari!');
  }
}

// Reset streak saat command benar
function onCorrectCommand() {
  wrongCmdStreak = 0;
}

// ── Tutorial System ───────────────────────
const TUTORIAL_STEPS = [
  { icon: '🎮', text: 'Selamat datang di NetAdmin Academy! Ini tutorial singkat untuk pemain baru. Kamu bisa lewati kapan saja.', pos: 'center' },
  { icon: '🖱️', text: 'Klik area game lalu gerakkan mouse untuk melihat sekeliling. Pointer akan terkunci — tekan ESC untuk melepasnya.', pos: 'center', arrow: 'canvas' },
  { icon: '⌨️', text: 'Gunakan W A S D untuk berjalan. Dekati NPC (orang) atau item di server room.', pos: 'bottom-left' },
  { icon: '🔑', text: 'Saat dekat NPC atau peralatan, tekan tombol E untuk berinteraksi. Lihat petunjuk [E] yang muncul di tengah layar.', pos: 'bottom-left', arrow: 'interact-prompt' },
  { icon: '💻', text: 'Buka terminal dari tombol di panel Misi (kanan atas). Ketik command Linux untuk menyelesaikan tugas. Salah 3× = kehilangan nyawa!', pos: 'top-right', arrow: 'obj-panel' },
  { icon: '❤️', text: 'Kamu punya 3 nyawa per level. Jika habis, kamu bisa coba ulang level tersebut. Gunakan hint 💡 jika bingung. Selamat bermain!', pos: 'center' },
];

function startTutorial() {
  if (_tutorialDone) return;
  _tutStep = 0;
  renderTutStep();
  document.getElementById('tutorial-overlay').classList.remove('hidden');
}

function renderTutStep() {
  const step = TUTORIAL_STEPS[_tutStep];
  if (!step) { skipTutorial(); return; }

  document.getElementById('tut-step-badge').textContent = `TUTORIAL ${_tutStep + 1}/${TUTORIAL_STEPS.length}`;
  document.getElementById('tut-icon').textContent = step.icon;
  document.getElementById('tut-text').textContent = step.text;

  const box = document.getElementById('tut-box');
  const arrow = document.getElementById('tut-arrow');
  arrow.style.display = 'none';

  // Posisikan kotak tutorial
  if (step.pos === 'center') {
    box.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:linear-gradient(135deg,#0d0d2a,#1a1040);border:2px solid #7c3aed;border-radius:16px;padding:1.1rem 1.4rem;max-width:320px;box-shadow:0 0 40px rgba(124,58,237,.5);pointer-events:all';
  } else if (step.pos === 'bottom-left') {
    box.style.cssText = 'position:absolute;bottom:140px;left:20px;background:linear-gradient(135deg,#0d0d2a,#1a1040);border:2px solid #7c3aed;border-radius:16px;padding:1.1rem 1.4rem;max-width:300px;box-shadow:0 0 40px rgba(124,58,237,.5);pointer-events:all';
  } else if (step.pos === 'top-right') {
    box.style.cssText = 'position:absolute;top:80px;right:20px;background:linear-gradient(135deg,#0d0d2a,#1a1040);border:2px solid #7c3aed;border-radius:16px;padding:1.1rem 1.4rem;max-width:300px;box-shadow:0 0 40px rgba(124,58,237,.5);pointer-events:all';
  }

  // Tampilkan arrow jika ada target elemen
  if (step.arrow) {
    const target = document.getElementById(step.arrow);
    if (target) {
      const r = target.getBoundingClientRect();
      arrow.style.display = 'block';
      arrow.style.left = (r.left + r.width/2 - 16) + 'px';
      arrow.style.top  = (r.bottom + 4) + 'px';
    }
  }
}

function tutNext() {
  _tutStep++;
  if (_tutStep >= TUTORIAL_STEPS.length) { skipTutorial(); return; }
  renderTutStep();
}

function skipTutorial() {
  _tutorialDone = true;
  document.getElementById('tutorial-overlay').classList.add('hidden');
  document.getElementById('tut-arrow').style.display = 'none';
}
