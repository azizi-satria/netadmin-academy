// ════════════════════════════════════════════
// PANORAMA ENGINE — 360° Room Navigator
// ════════════════════════════════════════════

const Panorama = (() => {

  // Config
  const SCENE_WIDTH    = 300;   // vw units (3× screen)
  const PAN_SPEED      = 1.2;
  const SMOOTH         = 0.12;
  const MIN_OFFSET     = 0;
  // max offset = SCENE_WIDTH vw - 100vw = 200vw

  // Parallax multipliers per layer (0 = fixed, 1 = full)
  const PARALLAX = {
    ceiling: 0.15,
    bg:      0.25,
    mid:     0.55,
    front:   1.0,
    floor:   0.3,
  };

  // State
  let targetX   = 0;   // target camera offset in px
  let currentX  = 0;   // smoothed camera offset
  let isDragging = false;
  let dragStartX = 0;
  let dragStartOffset = 0;
  let maxOffset  = 0;
  let animFrame  = null;

  function init() {
    maxOffset = (window.innerWidth * 2); // 200vw in px

    const wrap = document.getElementById('panorama-wrap');

    // Mouse
    wrap.addEventListener('mousedown',  onDragStart);
    window.addEventListener('mousemove', onDragMove);
    window.addEventListener('mouseup',   onDragEnd);

    // Touch
    wrap.addEventListener('touchstart', onTouchStart, { passive:true });
    window.addEventListener('touchmove', onTouchMove,  { passive:false });
    window.addEventListener('touchend',  onDragEnd);

    // Keyboard
    window.addEventListener('keydown', onKey);

    // Resize
    window.addEventListener('resize', () => {
      maxOffset = window.innerWidth * 2;
      clampOffset();
    });

    loop();
  }

  // ── Drag ─────────────────────────────────
  function onDragStart(e) {
    isDragging = true;
    dragStartX = e.clientX;
    dragStartOffset = targetX;
    document.getElementById('panorama-wrap').classList.add('dragging');
    document.getElementById('drag-hint').style.display = 'none';
  }

  function onTouchStart(e) {
    isDragging = true;
    dragStartX = e.touches[0].clientX;
    dragStartOffset = targetX;
    document.getElementById('drag-hint').style.display = 'none';
  }

  function onDragMove(e) {
    if (!isDragging) return;
    const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX);
    if (clientX === undefined) return;
    const delta = (dragStartX - clientX) * PAN_SPEED;
    targetX = clamp(dragStartOffset + delta, MIN_OFFSET, maxOffset);
    updateEdgeIndicators();
  }

  function onTouchMove(e) {
    if (!isDragging) return;
    e.preventDefault();
    const delta = (dragStartX - e.touches[0].clientX) * PAN_SPEED;
    targetX = clamp(dragStartOffset + delta, MIN_OFFSET, maxOffset);
    updateEdgeIndicators();
  }

  function onDragEnd() {
    isDragging = false;
    document.getElementById('panorama-wrap').classList.remove('dragging');
  }

  // ── Keyboard ─────────────────────────────
  function onKey(e) {
    const gameScreen = document.getElementById('game-screen');
    if (gameScreen.classList.contains('hidden')) return;
    const termInput = document.getElementById('term-input');
    if (document.activeElement === termInput) return;

    const step = window.innerWidth * 0.15;
    if (e.key === 'ArrowLeft')  targetX = clamp(targetX - step, MIN_OFFSET, maxOffset);
    if (e.key === 'ArrowRight') targetX = clamp(targetX + step, MIN_OFFSET, maxOffset);
    updateEdgeIndicators();
  }

  // ── Smooth loop ───────────────────────────
  function loop() {
    currentX += (targetX - currentX) * SMOOTH;

    // Apply parallax to each layer
    applyLayer('layer-ceiling', PARALLAX.ceiling);
    applyLayer('layer-bg',      PARALLAX.bg);
    applyLayer('layer-mid',     PARALLAX.mid);
    applyLayer('layer-front',   PARALLAX.front);
    applyLayer('layer-floor',   PARALLAX.floor);

    // Compass needle
    updateCompass();

    // Minimap camera
    updateMinimap();

    animFrame = requestAnimationFrame(loop);
  }

  function applyLayer(id, factor) {
    const el = document.getElementById(id);
    if (!el) return;
    const offset = -(currentX * factor);
    el.style.transform = `translateX(${offset}px)`;
  }

  // ── Compass ──────────────────────────────
  function updateCompass() {
    const pct = currentX / maxOffset; // 0→1
    const needle = document.getElementById('compass-needle');
    if (needle) needle.style.left = (pct * 100) + '%';

    const dirs = document.querySelectorAll('.compass-dir');
    dirs.forEach((d,i) => d.classList.remove('active'));
    if (pct < 0.33) dirs[0] && dirs[0].classList.add('active');
    else if (pct < 0.66) dirs[1] && dirs[1].classList.add('active');
    else dirs[2] && dirs[2].classList.add('active');
  }

  // ── Minimap ──────────────────────────────
  function updateMinimap() {
    const cam = document.getElementById('minimap-cam');
    if (!cam) return;
    const pct = currentX / maxOffset;
    cam.style.left = (pct * 80) + '%';
  }

  // ── Edge indicators ───────────────────────
  function updateEdgeIndicators() {
    const el = document.getElementById('edge-left');
    const er = document.getElementById('edge-right');
    if (el) el.classList.toggle('active', targetX > 50);
    if (er) er.classList.toggle('active', targetX < maxOffset - 50);
  }

  // ── Pan to position ───────────────────────
  function panTo(px) {
    targetX = clamp(px, MIN_OFFSET, maxOffset);
  }

  function panToPercent(pct) {
    targetX = clamp(maxOffset * pct, MIN_OFFSET, maxOffset);
  }

  function getCurrentPercent() {
    return maxOffset > 0 ? currentX / maxOffset : 0;
  }

  function clamp(v, min, max) { return Math.min(Math.max(v, min), max); }
  function clampOffset() { targetX = clamp(targetX, MIN_OFFSET, maxOffset); }

  function destroy() {
    if (animFrame) cancelAnimationFrame(animFrame);
  }

  return { init, panTo, panToPercent, getCurrentPercent, destroy };
})();
