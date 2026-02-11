// Inside a Computer - Interactive Diagram MicroSim
// Bloom Level: Remember (L1) - identify, label
// Students identify main hardware components and describe each role.

let canvasWidth = 400;
let drawHeight = 450;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let sliderLeftMargin = 140;
let defaultTextSize = 16;
let mouseOverCanvas = false;

// Component rectangles {x, y, w, h} - set in updatePositions()
let cpuBox, ramBox, storageBox, inputBox, outputBox;

// Hover / click state
let hoveredComponent = null;
let selectedComponent = null;

// Data-flow animation
let showDataFlow = false;
let dataFlowBtn;
let dots = []; // animated dots along arrows
let dotSpeed = 1.5;

// Arrow definitions: {from, to, pts[]} built in updatePositions()
let arrows = [];

// Component metadata
const compInfo = {
  cpu: {
    label: 'CPU',
    color: [255, 200, 50],
    desc: 'The brain \u2014 processes billions of instructions per second.',
    analogy: 'Like the chef in a kitchen, doing all the actual cooking.'
  },
  ram: {
    label: 'RAM',
    color: [100, 160, 255],
    desc: 'Fast, temporary workspace for active tasks.',
    analogy: 'Like a desk \u2014 whatever you are working on right now sits here.'
  },
  storage: {
    label: 'Storage',
    color: [80, 190, 120],
    desc: 'Permanent storage that survives power off.',
    analogy: 'Like a filing cabinet \u2014 keeps your files even when the computer sleeps.'
  },
  input: {
    label: 'Input Devices',
    color: [180, 140, 220],
    desc: 'How you talk to the computer \u2014 keyboard, mouse, mic.',
    analogy: 'Like your voice and hands \u2014 you send information in.'
  },
  output: {
    label: 'Output Devices',
    color: [240, 160, 80],
    desc: 'How the computer talks back \u2014 screen, speakers, printer.',
    analogy: 'Like a TV or speaker \u2014 information comes out to you.'
  }
};

// ── helpers ───────────────────────────────────────────────────────
function updateCanvasSize() {
  let mainEl = document.querySelector('main');
  if (mainEl) {
    canvasWidth = max(350, min(mainEl.clientWidth, 580));
  }
  canvasHeight = drawHeight + controlHeight;
}

function updatePositions() {
  let cx = canvasWidth / 2;
  let compW = canvasWidth * 0.24;
  let compH = 72;
  let smallH = 60;

  // CPU centred
  cpuBox = { x: cx - compW / 2, y: drawHeight * 0.42 - compH / 2, w: compW, h: compH };

  // RAM above CPU
  ramBox = { x: cx - compW / 2, y: drawHeight * 0.16 - smallH / 2, w: compW, h: smallH };

  // Storage below CPU
  storageBox = { x: cx - compW / 2, y: drawHeight * 0.70 - smallH / 2, w: compW, h: smallH };

  // Input group left
  let sideW = compW * 1.05;
  inputBox = { x: margin, y: drawHeight * 0.42 - compH / 2, w: sideW, h: compH };

  // Output group right
  outputBox = { x: canvasWidth - margin - sideW, y: drawHeight * 0.42 - compH / 2, w: sideW, h: compH };

  // Build arrow connection points (centre of relevant edge)
  arrows = [
    // RAM <-> CPU (bidirectional, drawn as two-headed)
    {
      from: 'ram', to: 'cpu',
      pts: [
        { x: cx, y: ramBox.y + ramBox.h },
        { x: cx, y: cpuBox.y }
      ]
    },
    // Storage <-> CPU
    {
      from: 'storage', to: 'cpu',
      pts: [
        { x: cx, y: storageBox.y },
        { x: cx, y: cpuBox.y + cpuBox.h }
      ]
    },
    // Input -> CPU
    {
      from: 'input', to: 'cpu',
      pts: [
        { x: inputBox.x + inputBox.w, y: inputBox.y + inputBox.h / 2 },
        { x: cpuBox.x, y: cpuBox.y + cpuBox.h / 2 }
      ]
    },
    // CPU -> Output
    {
      from: 'cpu', to: 'output',
      pts: [
        { x: cpuBox.x + cpuBox.w, y: cpuBox.y + cpuBox.h / 2 },
        { x: outputBox.x, y: outputBox.y + outputBox.h / 2 }
      ]
    }
  ];
}

// ── setup ─────────────────────────────────────────────────────────
function setup() {
  updateCanvasSize();
  updatePositions();

  let canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  canvas.mouseOver(function () { mouseOverCanvas = true; });
  canvas.mouseOut(function () { mouseOverCanvas = false; });

  textFont('Arial');
  textSize(defaultTextSize);

  dataFlowBtn = createButton('Show Data Flow');
  dataFlowBtn.parent(document.querySelector('main'));
  dataFlowBtn.position(10, drawHeight + 12);
  dataFlowBtn.mousePressed(toggleDataFlow);
  dataFlowBtn.style('font-size', '14px');
  dataFlowBtn.style('padding', '6px 14px');
  dataFlowBtn.style('cursor', 'pointer');
  dataFlowBtn.style('border-radius', '6px');
  dataFlowBtn.style('border', '1px solid #888');

  describe('Interactive diagram showing the main components inside a computer: CPU, RAM, Storage, Input Devices, and Output Devices, with animated data-flow arrows.');
}

// ── draw ──────────────────────────────────────────────────────────
function draw() {
  // Drawing area background
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  // Control area background
  fill('white');
  noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  noStroke();
  fill(30);
  textSize(20);
  textAlign(CENTER, TOP);
  text('Inside a Computer', canvasWidth / 2, 10);
  textSize(defaultTextSize);

  // Detect hover
  hoveredComponent = getHoveredComponent();

  // Draw arrows first (behind components)
  drawArrows();

  // Draw components
  drawComponent(cpuBox, 'cpu');
  drawComponent(ramBox, 'ram');
  drawComponent(storageBox, 'storage');
  drawComponent(inputBox, 'input');
  drawComponent(outputBox, 'output');

  // Draw icons inside components
  drawCPUIcon(cpuBox);
  drawRAMIcon(ramBox);
  drawStorageIcon(storageBox);
  drawInputIcons(inputBox);
  drawOutputIcons(outputBox);

  // Animate dots
  if (showDataFlow) {
    updateAndDrawDots();
  }

  // Hover tooltip
  if (hoveredComponent) {
    drawTooltip(hoveredComponent);
  }
}

// ── component drawing ─────────────────────────────────────────────
function drawComponent(box, id) {
  let info = compInfo[id];
  let isHovered = (hoveredComponent === id);
  let isSelected = (selectedComponent === id);

  // Glow on hover / select
  if (isHovered || isSelected) {
    noFill();
    stroke(info.color[0], info.color[1], info.color[2], 100);
    strokeWeight(6);
    rect(box.x - 3, box.y - 3, box.w + 6, box.h + 6, 14);
  }

  // Box
  fill(info.color[0], info.color[1], info.color[2]);
  stroke(60);
  strokeWeight(1.5);
  rect(box.x, box.y, box.w, box.h, 10);

  // Label
  noStroke();
  fill(30);
  textAlign(CENTER, BOTTOM);
  textSize(14);
  text(info.label, box.x + box.w / 2, box.y + box.h - 5);
  textSize(defaultTextSize);
}

// ── simplified component icons ────────────────────────────────────
function drawCPUIcon(b) {
  let cx = b.x + b.w / 2;
  let cy = b.y + b.h / 2 - 6;
  let s = 22;

  // Chip body
  fill(200, 170, 30);
  stroke(80);
  strokeWeight(1);
  rect(cx - s / 2, cy - s / 2, s, s, 3);

  // Pins
  let pinLen = 6;
  strokeWeight(2);
  stroke(80);
  for (let i = -1; i <= 1; i++) {
    let px = cx + i * 7;
    line(px, cy - s / 2, px, cy - s / 2 - pinLen);
    line(px, cy + s / 2, px, cy + s / 2 + pinLen);
  }
  for (let i = -1; i <= 1; i++) {
    let py = cy + i * 7;
    line(cx - s / 2, py, cx - s / 2 - pinLen, py);
    line(cx + s / 2, py, cx + s / 2 + pinLen, py);
  }
}

function drawRAMIcon(b) {
  let cx = b.x + b.w / 2;
  let cy = b.y + b.h / 2 - 6;
  let w = 36, h = 14;

  // Stick
  fill(80, 140, 220);
  stroke(50);
  strokeWeight(1);
  rect(cx - w / 2, cy - h / 2, w, h, 2);

  // Chips on stick
  fill(60, 100, 180);
  noStroke();
  for (let i = 0; i < 4; i++) {
    rect(cx - w / 2 + 4 + i * 8, cy - h / 2 + 3, 5, 8, 1);
  }
}

function drawStorageIcon(b) {
  let cx = b.x + b.w / 2;
  let cy = b.y + b.h / 2 - 6;
  let s = 24;

  // SSD rectangle
  fill(60, 160, 100);
  stroke(40);
  strokeWeight(1);
  rect(cx - s / 2, cy - s / 2 + 2, s, s - 4, 4);

  // Label line
  noStroke();
  fill(200, 255, 200);
  textSize(9);
  textAlign(CENTER, CENTER);
  text('SSD', cx, cy);
  textSize(defaultTextSize);
}

function drawInputIcons(b) {
  let cx = b.x + b.w / 2;
  let cy = b.y + b.h / 2 - 8;
  let spacing = b.w / 4;

  // Keyboard icon (small rectangle with lines)
  let kx = cx - spacing;
  fill(160, 130, 200);
  stroke(80);
  strokeWeight(1);
  rect(kx - 10, cy - 6, 20, 12, 2);
  stroke(220);
  strokeWeight(0.7);
  for (let r = 0; r < 3; r++) {
    line(kx - 7, cy - 3 + r * 4, kx + 7, cy - 3 + r * 4);
  }

  // Mouse icon (small oval)
  let mx = cx;
  fill(160, 130, 200);
  stroke(80);
  strokeWeight(1);
  ellipse(mx, cy, 12, 18);
  stroke(200);
  strokeWeight(0.7);
  line(mx, cy - 9, mx, cy - 3);

  // Mic icon (small rounded rect + stand)
  let micX = cx + spacing;
  fill(160, 130, 200);
  stroke(80);
  strokeWeight(1);
  rect(micX - 4, cy - 8, 8, 12, 4);
  noFill();
  arc(micX, cy + 2, 16, 10, 0, PI);
  stroke(80);
  line(micX, cy + 7, micX, cy + 10);
}

function drawOutputIcons(b) {
  let cx = b.x + b.w / 2;
  let cy = b.y + b.h / 2 - 8;
  let spacing = b.w / 4;

  // Monitor icon
  let monX = cx - spacing;
  fill(220, 150, 60);
  stroke(80);
  strokeWeight(1);
  rect(monX - 10, cy - 8, 20, 14, 2);
  // Screen
  fill(180, 220, 255);
  noStroke();
  rect(monX - 8, cy - 6, 16, 10, 1);
  // Stand
  stroke(80);
  strokeWeight(1);
  line(monX, cy + 6, monX, cy + 10);
  line(monX - 5, cy + 10, monX + 5, cy + 10);

  // Speaker icon
  let spX = cx;
  fill(220, 150, 60);
  stroke(80);
  strokeWeight(1);
  rect(spX - 5, cy - 6, 10, 12, 2);
  // Sound waves
  noFill();
  stroke(220, 150, 60);
  strokeWeight(1.2);
  arc(spX + 7, cy, 8, 10, -PI / 4, PI / 4);
  arc(spX + 9, cy, 14, 16, -PI / 4, PI / 4);

  // Printer icon
  let prX = cx + spacing;
  fill(220, 150, 60);
  stroke(80);
  strokeWeight(1);
  rect(prX - 10, cy - 4, 20, 12, 2);
  // Paper
  fill(255);
  noStroke();
  rect(prX - 6, cy - 8, 12, 8, 1);
  // Feed slot
  stroke(80);
  strokeWeight(0.7);
  line(prX - 8, cy + 2, prX + 8, cy + 2);
}

// ── arrows & data-flow ───────────────────────────────────────────
function drawArrows() {
  for (let a of arrows) {
    let highlighted = (selectedComponent === a.from || selectedComponent === a.to);
    let p0 = a.pts[0];
    let p1 = a.pts[1];

    stroke(highlighted ? color(220, 60, 60) : color(160));
    strokeWeight(highlighted ? 3 : 2);
    line(p0.x, p0.y, p1.x, p1.y);

    // Arrowhead pointing from p0 -> p1
    drawArrowhead(p0.x, p0.y, p1.x, p1.y, highlighted);

    // For RAM<->CPU and Storage<->CPU, draw reverse arrowhead too
    if (a.from === 'ram' || a.from === 'storage') {
      drawArrowhead(p1.x, p1.y, p0.x, p0.y, highlighted);
    }
  }
}

function drawArrowhead(x1, y1, x2, y2, highlighted) {
  let angle = atan2(y2 - y1, x2 - x1);
  let sz = 8;
  push();
  translate(x2, y2);
  rotate(angle);
  fill(highlighted ? color(220, 60, 60) : color(160));
  noStroke();
  triangle(0, 0, -sz, -sz / 2.5, -sz, sz / 2.5);
  pop();
}

function toggleDataFlow() {
  showDataFlow = !showDataFlow;
  dataFlowBtn.html(showDataFlow ? 'Hide Data Flow' : 'Show Data Flow');
  if (showDataFlow) {
    spawnDots();
  } else {
    dots = [];
  }
}

function spawnDots() {
  dots = [];
  for (let a of arrows) {
    // Forward dot
    dots.push({ arrow: a, t: 0, dir: 1 });
    // Reverse dot for bidirectional arrows
    if (a.from === 'ram' || a.from === 'storage') {
      dots.push({ arrow: a, t: 1, dir: -1 });
    }
  }
}

function updateAndDrawDots() {
  noStroke();
  fill(220, 50, 50);
  for (let d of dots) {
    let p0 = d.arrow.pts[0];
    let p1 = d.arrow.pts[1];
    let segLen = dist(p0.x, p0.y, p1.x, p1.y);
    let step = dotSpeed / segLen;

    d.t += step * d.dir;
    if (d.t > 1) d.t = 0;
    if (d.t < 0) d.t = 1;

    let dx = lerp(p0.x, p1.x, d.t);
    let dy = lerp(p0.y, p1.y, d.t);
    ellipse(dx, dy, 8, 8);
  }
}

// ── hover detection ──────────────────────────────────────────────
function getHoveredComponent() {
  if (!mouseOverCanvas) return null;
  if (mouseY > drawHeight) return null;
  if (insideBox(cpuBox)) return 'cpu';
  if (insideBox(ramBox)) return 'ram';
  if (insideBox(storageBox)) return 'storage';
  if (insideBox(inputBox)) return 'input';
  if (insideBox(outputBox)) return 'output';
  return null;
}

function insideBox(b) {
  return mouseX >= b.x && mouseX <= b.x + b.w && mouseY >= b.y && mouseY <= b.y + b.h;
}

// ── tooltip ──────────────────────────────────────────────────────
function drawTooltip(id) {
  let info = compInfo[id];
  let tw = canvasWidth - margin * 2;
  let lineH = 18;
  let th = lineH * 3 + 12;
  let tx = margin;
  let ty = drawHeight - th - 10;

  // Background
  fill(255, 255, 255, 235);
  stroke(info.color[0], info.color[1], info.color[2]);
  strokeWeight(2);
  rect(tx, ty, tw, th, 8);

  // Text
  noStroke();
  textAlign(LEFT, TOP);
  fill(30);
  textSize(15);
  text(info.label, tx + 10, ty + 6);
  textSize(13);
  fill(60);
  text(info.desc, tx + 10, ty + 6 + lineH, tw - 20);
  fill(100);
  textStyle(ITALIC);
  text(info.analogy, tx + 10, ty + 6 + lineH * 2, tw - 20);
  textStyle(NORMAL);
  textSize(defaultTextSize);
}

// ── click to select ──────────────────────────────────────────────
function mousePressed() {
  if (!mouseOverCanvas) return;
  let clicked = getHoveredComponent();
  if (clicked) {
    selectedComponent = (selectedComponent === clicked) ? null : clicked;
  } else {
    selectedComponent = null;
  }
}

// ── responsive resize ────────────────────────────────────────────
function windowResized() {
  updateCanvasSize();
  updatePositions();
  resizeCanvas(canvasWidth, canvasHeight);

  // Reposition button
  if (dataFlowBtn) {
    dataFlowBtn.position(10, drawHeight + 12);
  }
}
