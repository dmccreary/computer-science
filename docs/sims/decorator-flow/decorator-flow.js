let canvasWidth = 400;
let drawHeight = 470;
let controlHeight = 90;
let canvasHeight = drawHeight + controlHeight;

const stages = [
  'Original function exists',
  'Decorator receives function',
  'Wrapper created inside decorator',
  'Wrapper returned and replaces original'
];

const traceLines = [
  '@timer',
  'def greet(name):',
  '    return f"Hi {name}"',
  '',
  'def timer(fn):',
  '    def wrapper(*args, **kwargs):',
  '        start()',
  '        out = fn(*args, **kwargs)',
  '        stop()',
  '        return out',
  '    return wrapper'
];

let stageIdx = 0;
let callAnim = 0;
let calling = false;

let stepBtn;
let callBtn;
let resetBtn;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  stepBtn = createButton('Step Through');
  stepBtn.mousePressed(() => {
    if (stageIdx < stages.length - 1) stageIdx += 1;
  });

  callBtn = createButton('Call Function');
  callBtn.mousePressed(() => {
    if (stageIdx === stages.length - 1) {
      calling = true;
      callAnim = 0;
    }
  });

  resetBtn = createButton('Reset');
  resetBtn.mousePressed(() => {
    stageIdx = 0;
    calling = false;
    callAnim = 0;
  });

  positionControls();
  describe('Step-through flow for how a Python decorator wraps and intercepts function calls.', LABEL);
}

function draw() {
  updateCanvasSize();

  if (calling) {
    callAnim += 0.02;
    if (callAnim >= 1.0) {
      callAnim = 1.0;
      calling = false;
    }
  }

  fill('aliceblue');
  stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawTitle();
  drawFlow();
  drawCode();
  drawStatus();
}

function drawTitle() {
  noStroke();
  fill('#0f172a');
  textAlign(CENTER, TOP);
  textSize(24);
  text('How Decorators Work', canvasWidth / 2, 10);
}

function drawFlow() {
  const y = 75;
  const h = 110;
  const gap = 18;
  const boxW = (canvasWidth - 80 - gap * 2) / 3;

  drawBox(20, y, boxW, h, 'Original\nFunction', '#dbeafe', stageIdx >= 0);
  drawBox(20 + boxW + gap, y, boxW, h, 'Decorator', '#fef3c7', stageIdx >= 1);
  drawBox(20 + 2 * (boxW + gap), y, boxW, h, 'Wrapped\nFunction', '#dcfce7', stageIdx >= 3);

  drawArrow(20 + boxW, y + h / 2, 20 + boxW + gap, y + h / 2, stageIdx >= 1 ? '#2563eb' : '#94a3b8');
  drawArrow(20 + boxW + gap + boxW, y + h / 2, 20 + 2 * (boxW + gap), y + h / 2, stageIdx >= 3 ? '#16a34a' : '#94a3b8');

  if (stageIdx >= 2) {
    noFill();
    stroke('#f59e0b');
    strokeWeight(3);
    rect(20 + 2 * (boxW + gap) - 8, y - 8, boxW + 16, h + 16, 14);
    noStroke();
    fill('#92400e');
    textAlign(CENTER, TOP);
    textSize(12);
    text('decorator layer', 20 + 2 * (boxW + gap) + boxW / 2, y + h + 12);
  }

  drawCallPath(20 + 2 * (boxW + gap), y + h + 45, boxW);
}

function drawCallPath(x, y, boxW) {
  if (stageIdx < 3) return;

  stroke('#64748b');
  strokeWeight(1.8);
  noFill();
  rect(x - 8, y - 4, boxW + 16, 88, 10);
  noStroke();
  fill('#334155');
  textAlign(CENTER, TOP);
  textSize(12);
  text('Call flow: wrapper -> original -> wrapper', x + boxW / 2, y + 6);

  const startX = x + 18;
  const endX = x + boxW - 18;
  const midY = y + 58;

  stroke('#0ea5e9');
  strokeWeight(2);
  line(startX, midY, endX, midY);
  line(endX, midY, endX - 26, midY - 16);
  line(endX, midY, endX - 26, midY + 16);

  if (calling || callAnim >= 1) {
    const t = constrain(callAnim, 0, 1);
    const px = lerp(startX, endX, t);
    noStroke();
    fill('#0ea5e9');
    circle(px, midY, 10);
  }
}

function drawCode() {
  const x = 20;
  const y = 240;
  const w = canvasWidth - 40;
  const h = 190;

  fill('#0f172a');
  stroke('#334155');
  rect(x, y, w, h, 10);

  const hi = highlightedLine();
  for (let i = 0; i < traceLines.length; i++) {
    if (i === hi) {
      fill(30, 64, 175, 180);
      noStroke();
      rect(x + 8, y + 10 + i * 15, w - 16, 15, 3);
    }
  }

  fill('#e2e8f0');
  noStroke();
  textAlign(LEFT, TOP);
  textSize(12);
  textFont('monospace');
  for (let i = 0; i < traceLines.length; i++) {
    text(traceLines[i], x + 12, y + 12 + i * 15);
  }
  textFont('Arial, Helvetica, sans-serif');
}

function highlightedLine() {
  if (stageIdx === 0) return 1;
  if (stageIdx === 1) return 4;
  if (stageIdx === 2) return 5;
  if (stageIdx >= 3 && !calling) return 10;
  if (calling) {
    if (callAnim < 0.33) return 5;
    if (callAnim < 0.66) return 7;
    return 9;
  }
  return -1;
}

function drawStatus() {
  fill('#ecfeff');
  stroke('#94a3b8');
  rect(20, 438, canvasWidth - 40, 24, 6);
  noStroke();
  fill('#0f172a');
  textAlign(CENTER, CENTER);
  textSize(13);
  text(`Stage ${stageIdx + 1}/${stages.length}: ${stages[stageIdx]}`, canvasWidth / 2, 450);
}

function drawBox(x, y, w, h, label, bg, active) {
  fill(bg);
  stroke(active ? '#1d4ed8' : '#94a3b8');
  strokeWeight(active ? 2.4 : 1.2);
  rect(x, y, w, h, 10);
  noStroke();
  fill('#0f172a');
  textAlign(CENTER, CENTER);
  textSize(15);
  text(label, x + w / 2, y + h / 2);
}

function drawArrow(x1, y1, x2, y2, c) {
  stroke(c);
  strokeWeight(2);
  line(x1, y1, x2, y2);
  const a = atan2(y2 - y1, x2 - x1);
  const s = 7;
  line(x2, y2, x2 - s * cos(a - PI / 6), y2 - s * sin(a - PI / 6));
  line(x2, y2, x2 - s * cos(a + PI / 6), y2 - s * sin(a + PI / 6));
}

function positionControls() {
  stepBtn.position(10, drawHeight + 10);
  callBtn.position(102, drawHeight + 10);
  resetBtn.position(188, drawHeight + 10);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = max(900, container.offsetWidth);
}
