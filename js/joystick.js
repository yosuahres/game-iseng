/**
 * Virtual Joystick – uses Pointer Events so Phaser's touch capture
 * doesn't block joystick/button input.
 */
class VirtualJoystick {
  constructor() {
    this.container = document.getElementById('joystick-container');
    this.thumb     = document.getElementById('joystick-thumb');

    this.isActive        = false;
    this.activePointerId = null;
    this.centerX         = 0;
    this.centerY         = 0;

    this.cursorKeys = {
      up:    { isDown: false },
      down:  { isDown: false },
      left:  { isDown: false },
      right: { isDown: false }
    };

    this.buttonStates = {
      produce:      false,
      speed:        false,
      instructions: false
    };

    this._prevButtonStates = {
      speed:        false,
      instructions: false
    };

    this.deadzone    = 15;
    this.maxDistance = 42;

    this._init();
  }

  // ── Init ────────────────────────────────────────────────────────────────

  _init() {
    if (!this.container) return;
    this._setupJoystick();
    this._setupButtons();
  }

  _setupJoystick() {
    // Use pointer events – these are not blocked by Phaser's input manager
    this.container.addEventListener('pointerdown',   e => this._onDown(e),   { passive: false });
    this.container.addEventListener('pointermove',   e => this._onMove(e),   { passive: false });
    this.container.addEventListener('pointerup',     e => this._onUp(e),     { passive: false });
    this.container.addEventListener('pointercancel', e => this._onUp(e),     { passive: false });

    // Capture so moves/ups outside the element still register
    this.container.setPointerCapture && null; // setPointerCapture called per-event below
  }

  _setupButtons() {
    this._bindButton('btn-produce',      'produce');
    this._bindButton('btn-speed',        'speed');
    this._bindButton('btn-instructions', 'instructions');
  }

  _bindButton(id, name) {
    const el = document.getElementById(id);
    if (!el) return;

    const down = e => { e.preventDefault(); e.stopPropagation(); this.buttonStates[name] = true;  };
    const up   = e => { e.preventDefault(); e.stopPropagation(); this.buttonStates[name] = false; };

    el.addEventListener('pointerdown',   down, { passive: false });
    el.addEventListener('pointerup',     up,   { passive: false });
    el.addEventListener('pointercancel', up,   { passive: false });
    el.addEventListener('pointerleave',  up,   { passive: false });
  }

  // ── Joystick pointer handlers ────────────────────────────────────────────

  _onDown(e) {
    if (this.isActive) return;
    e.preventDefault();

    // Capture pointer so pointermove/up fire even outside the element
    try { this.container.setPointerCapture(e.pointerId); } catch(_) {}

    const rect   = this.container.getBoundingClientRect();
    this.centerX = rect.left + rect.width  / 2;
    this.centerY = rect.top  + rect.height / 2;
    this.activePointerId = e.pointerId;
    this.isActive = true;

    this._update(e.clientX, e.clientY);
  }

  _onMove(e) {
    if (!this.isActive || e.pointerId !== this.activePointerId) return;
    e.preventDefault();
    this._update(e.clientX, e.clientY);
  }

  _onUp(e) {
    if (!this.isActive || e.pointerId !== this.activePointerId) return;
    try { this.container.releasePointerCapture(e.pointerId); } catch(_) {}
    this.isActive        = false;
    this.activePointerId = null;
    this._resetThumb();
    this._resetKeys();
  }

  _update(x, y) {
    const dx   = x - this.centerX;
    const dy   = y - this.centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const ang  = Math.atan2(dy, dx);

    // Move thumb visually (clamped)
    const r  = Math.min(dist, this.maxDistance);
    const tx = Math.cos(ang) * r;
    const ty = Math.sin(ang) * r;
    this.thumb.style.transform =
        `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px))`;

    // Update cursor keys
    this._resetKeys();
    if (dist > this.deadzone) {
      const deg = ang * 180 / Math.PI;
      if      (deg > -45  && deg <=  45)  this.cursorKeys.right.isDown = true;
      else if (deg >  45  && deg <= 135)  this.cursorKeys.down.isDown  = true;
      else if (deg >  135 || deg <= -135) this.cursorKeys.left.isDown  = true;
      else                                this.cursorKeys.up.isDown    = true;
    }
  }

  _resetThumb() {
    this.thumb.style.transform = 'translate(-50%, -50%)';
  }

  _resetKeys() {
    this.cursorKeys.up.isDown    = false;
    this.cursorKeys.down.isDown  = false;
    this.cursorKeys.left.isDown  = false;
    this.cursorKeys.right.isDown = false;
  }

  // ── Public API ───────────────────────────────────────────────────────────

  getCursorKeys() { return this.cursorKeys; }

  /** True while button is held – use for Produce (Space analogue). */
  getButtonState(name) { return this.buttonStates[name] || false; }

  /** True on the single frame the button transitions down – use for toggles. */
  checkButtonPress(name) {
    const cur  = this.buttonStates[name] || false;
    const prev = this._prevButtonStates[name] || false;
    this._prevButtonStates[name] = cur;
    return cur && !prev;
  }
}

// ── Singleton ────────────────────────────────────────────────────────────────
let virtualJoystick = null;
function initVirtualJoystick() {
  virtualJoystick = new VirtualJoystick();
  return virtualJoystick;
}