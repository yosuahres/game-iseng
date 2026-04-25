class Instructions {
  constructor(scene) {
    this.scene_ = scene;
    this.instructionTexts_ = [];

    // Use actual game canvas dimensions so instructions scale with the canvas
    // whether it's desktop, tablet, or phone.
    this.W = scene.scale ? scene.scale.width  : Config.WORLD_WIDTH_PX;
    this.H = scene.scale ? scene.scale.height : Config.WORLD_HEIGHT_PX;

    this.addAllInstructions_();

    // Full-screen dimming backdrop drawn in canvas-space (0,0 to W,H)
    this.backdrop_ = scene.add.graphics();
    this.backdrop_.fillStyle(0x000000);
    this.backdrop_.fillRect(0, 0, this.W, this.H);
    this.backdrop_.alpha = 0.72;
    this.backdrop_.depth = Depths.INSTRUCTIONS_BACKDROP;
    this.backdrop_.visible = false;
  }

  toggleVisibility() {
    this.backdrop_.visible = !this.backdrop_.visible;
    this.instructionTexts_.forEach(t => { t.visible = !t.visible; });
  }

  addAllInstructions_() {
    const f = this.addText_.bind(this);
    const W = this.W;
    const H = this.H;

    const normalColor  = 'white';
    const pattyColor   = '#d07b4c';
    const pattyStroke  = '#071b09';
    const keyColor     = 'orange';
    const giftColor    = 'yellow';
    const santaColor   = '#ec0000';
    const grinchColor  = '#6bef08';

    // ── Font size: scales between 11px (320px wide) and 20px (650px wide) ──
    const baseFontSize = Math.max(11, Math.min(20, Math.round(W * 20 / 650)));
    const lineH        = Math.round(baseFontSize * 1.55);

    // ── Layout: centre the instruction block horizontally ───────────────────
    // The widest line is roughly 540px at font-size 20, so scale proportionally
    const blockW = Math.round(540 * baseFontSize / 20);
    const left   = Math.round((W - blockW) / 2);

    // Vertical start: sit a bit below the vertical centre
    let top = Math.round(H * 0.30);

    // Helper: column offset scaled to font size
    const col = px => left + Math.round(px * baseFontSize / 20);

    // ── Line 1: "Help Patty get her gift from Santa!" ────────────────────────
    f('Pencet produce',   col(0),   top, normalColor, baseFontSize);
    top += lineH;

    // ── Line 2: "Don't let the Grinch steal it." ────────────────────────────
    f('Tunggu santa tarok kado', col(0),   top, normalColor, baseFontSize);
    top += lineH * 2;

    // ── Line 3: "- Move Patty with the arrow keys." ──────────────────────────
    f('Mendekat ke pohon',      col(0),   top, normalColor, baseFontSize);
    top += lineH;

    // ── Line 4: "- Press G to make Santa bring the gift!" ───────────────────
    f('Lalu tekan tombol plis',  col(0),   top, normalColor, baseFontSize);
    top += lineH;

    const hintSize = Math.max(10, Math.round(baseFontSize * 0.85));
    const hintY = H - Math.round(hintSize * 2.2);
    f('Hello',            14,                        hintY, normalColor, hintSize, true);
    f('Natalia',                14 + Math.round(68 * hintSize / 20), hintY, keyColor,    hintSize, true);
  }

  addText_(s, x, y, color, fontSize, initiallyVisible) {
    const text = this.scene_.add.text(x, y, s);
    text.depth = Depths.INSTRUCTIONS_TEXT;
    text.setColor(color);
    text.setFontSize(fontSize || 20);
    text.visible = !!initiallyVisible;
    this.instructionTexts_.push(text);
    return text;
  }
}