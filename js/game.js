// ============================================
// GAME ENGINE UTAMA — NetAdmin Academy
// ============================================

let currentLevel    = 0;
let currentDialog   = 0;
let completedObj    = new Set();
let timerInterval   = null;
let timerSeconds    = 0;
let score           = 0;

// ── Boot ──────────────────────────────────────

window.addEventListener('load', () => {
  simulateLoading();
});

function simulateLoading() {
  const fill = document.getElementById('loading-fill');
  const text = document.getElementById('loading-text');
  const steps = [
    [15,  'Memuat aset game...'],
    [35,  'Menyiapkan server virtual...'],
    [55,  'Mengkonfigurasi terminal...'],
    [75,  'Memuat skenario misi...'],
    [90,  'Menginisialisasi karakter...'],
    [100, 'Siap! Selamat bermain!']
  ];

  let i = 0;
  const run = () => {
    if (i >= steps.length) { setTimeout(showMainMenu, 400); return; }
    const [pct, msg] = steps[i++];
    fill.style.width = pct + '%';
    text.textContent = msg;
    setTimeout(run, 350 + Math.random() * 200);
  };
  setTimeout(run, 300);
}

function showMainMenu() {
  document.getElementById('loading-screen').classList.add('hidden');
  document.getElementById('main-menu').classList.remove('hidden');
}

// ── Game Start ───────────────────────────────

function startGame() {
  document.getElementById('main-menu').classList.add('hidden');
  document.getElementById('game-screen').classList.remove('hidden');
  currentLevel = 0;
  score = 0;
  document.getElementById('score').textContent = '0';
  initTerminal();
  loadLevel(0);
}

function loadLevel(idx) {
  const level = LEVELS[idx];
  if (!level) return;

  completedObj  = new Set();
  currentDialog = 0;
  timerSeconds  = 0;

  // Reset UI
  document.getElementById('terminal-output').innerHTML = '';
  document.getElementById('terminal-area').classList.add('hidden');
  document.getElementById('inspect-popup').classList.add('hidden');
  document.getElementById('dialog-box').classList.add('hidden');
  document.getElementById('level-complete').classList.add('hidden');

  // HUD
  document.getElementById('hud-level').textContent   = `Level ${level.id}`;
  document.getElementById('hud-mission').textContent = `Misi: ${level.mission}`;
  document.getElementById('timer').textContent        = '00:00';

  // Scene
  document.getElementById('scene-bg').style.background = level.scene.bg;
  renderObjects(level.scene.objects);
  renderObjectives(level.objectives);
  startTimer();

  // Mulai dialog setelah sebentar
  setTimeout(() => showDialog(), 700);
}

// ── Scene Objects (Point & Click) ────────────

function renderObjects(objects) {
  const container = document.getElementById('scene-objects');
  container.innerHTML = '';

  objects.forEach(obj => {
    const el = document.createElement('div');
    el.className = 'scene-object';
    el.style.left = obj.x;
    el.style.top  = obj.y;
    el.innerHTML  = `
      <span class="obj-emoji">${obj.emoji}</span>
      <div class="obj-label">${obj.label}</div>
    `;
    el.addEventListener('click', () => {
      closeTerminal();
      showInspect(obj.inspect);
    });
    container.appendChild(el);
  });
}

function showInspect(data) {
  document.getElementById('inspect-title').textContent = data.title;
  document.getElementById('inspect-body').innerHTML = `
    <p>${data.body.replace(/\n/g, '<br/>')}</p>
    <span class="inspect-status status-${data.status}">${data.statusText}</span>
  `;
  document.getElementById('inspect-popup').classList.remove('hidden');
}

function closeInspect() {
  document.getElementById('inspect-popup').classList.add('hidden');
}

// ── Dialog System (Visual Novel) ─────────────

function showDialog() {
  const level   = LEVELS[currentLevel];
  const dialogs = level.dialogs;
  if (!dialogs || currentDialog >= dialogs.length) return;

  const d = dialogs[currentDialog];
  document.getElementById('char-avatar').textContent = d.avatar;
  document.getElementById('char-name').textContent   = d.name;
  document.getElementById('dialog-box').classList.remove('hidden');

  // Typewriter
  const textEl = document.getElementById('dialog-text');
  textEl.textContent = '';
  let i = 0;
  const type = setInterval(() => {
    textEl.textContent += d.text[i++];
    if (i >= d.text.length) clearInterval(type);
  }, 22);
}

function nextDialog() {
  currentDialog++;
  const level = LEVELS[currentLevel];

  if (currentDialog < level.dialogs.length) {
    showDialog();
  } else {
    document.getElementById('dialog-box').classList.add('hidden');
    showNotification('💡 Klik objek untuk investigasi, lalu gunakan terminal!');
  }
}

// ── Objectives ───────────────────────────────

function renderObjectives(objectives) {
  const list = document.getElementById('objective-list');
  list.innerHTML = '';
  objectives.forEach(obj => {
    const li = document.createElement('li');
    li.id = 'obj-' + obj.id;
    li.textContent = obj.text;
    list.appendChild(li);
  });
}

function completeObjective(id) {
  if (completedObj.has(id)) return;

  const level = LEVELS[currentLevel];
  const found = level.objectives.find(o => o.id === id);
  if (!found) return;

  completedObj.add(id);
  const li = document.getElementById('obj-' + id);
  if (li) li.classList.add('done');

  score += 20;
  document.getElementById('score').textContent = score;
  showNotification(`✓ Selesai: ${found.text}`);

  if (level.objectives.every(o => completedObj.has(o.id))) {
    stopTimer();
    setTimeout(showLevelComplete, 900);
  }
}

// ── Timer ────────────────────────────────────

function startTimer() {
  stopTimer();
  timerSeconds = 0;
  timerInterval = setInterval(() => {
    timerSeconds++;
    const m = String(Math.floor(timerSeconds / 60)).padStart(2, '0');
    const s = String(timerSeconds % 60).padStart(2, '0');
    document.getElementById('timer').textContent = `${m}:${s}`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

// ── Level Complete ───────────────────────────

function showLevelComplete() {
  const level = LEVELS[currentLevel];
  const m = String(Math.floor(timerSeconds / 60)).padStart(2, '0');
  const s = String(timerSeconds % 60).padStart(2, '0');

  let bonus = 0;
  if (timerSeconds < 90)  bonus = 100;
  else if (timerSeconds < 180) bonus = 60;
  else if (timerSeconds < 300) bonus = 30;
  score += bonus;

  document.getElementById('complete-badge').textContent = level.badge;
  document.getElementById('complete-score').textContent =
    `⭐ Skor: ${score} poin${bonus > 0 ? ` (+${bonus} bonus kecepatan!)` : ''}`;
  document.getElementById('complete-time').textContent =
    `⏱️ Waktu: ${m}:${s}`;
  document.getElementById('level-complete').classList.remove('hidden');
}

function nextLevel() {
  document.getElementById('level-complete').classList.add('hidden');
  currentLevel++;

  if (currentLevel < LEVELS.length) {
    loadLevel(currentLevel);
  } else {
    showGameComplete();
  }
}

function showGameComplete() {
  document.getElementById('game-screen').classList.add('hidden');
  document.getElementById('main-menu').classList.remove('hidden');

  document.querySelector('.menu-content').innerHTML = `
    <div class="menu-icon">🏆</div>
    <h1 style="color:var(--yellow);font-size:1.8rem">SELAMAT!</h1>
    <p style="color:var(--text);margin:1rem 0;font-size:0.95rem;line-height:1.8">
      Kamu telah menyelesaikan semua misi!<br/>
      Berkat keahlianmu, Kota Netville kembali normal.<br/>
      Kamu resmi menjadi <strong style="color:var(--accent-light)">
      NetAdmin Hero Termuda!</strong> 🔥
    </p>
    <div style="font-size:1.4rem;margin:0.5rem 0;color:var(--yellow)">
      ⭐ Total Skor: ${score} poin
    </div>
    <div style="display:flex;flex-direction:column;gap:0.75rem;margin-top:1.5rem">
      <button class="btn-primary" onclick="location.reload()">🔄 Main Lagi</button>
    </div>
    <div class="menu-footer" style="margin-top:1.5rem">
      SMK TKJ · Netville City · v1.0
    </div>
  `;
}

// ── Notification ─────────────────────────────

function showNotification(msg) {
  const el = document.getElementById('notification');
  el.textContent = msg;
  el.classList.remove('hidden');
  el.style.animation = 'none';
  void el.offsetHeight;
  el.style.animation = 'fadeInOut 3s forwards';
  setTimeout(() => el.classList.add('hidden'), 3100);
}

// ── Credits ──────────────────────────────────

function showCredits() {
  document.getElementById('main-menu').classList.add('hidden');
  document.getElementById('credits-screen').classList.remove('hidden');
}

function hideCredits() {
  document.getElementById('credits-screen').classList.add('hidden');
  document.getElementById('main-menu').classList.remove('hidden');
}
