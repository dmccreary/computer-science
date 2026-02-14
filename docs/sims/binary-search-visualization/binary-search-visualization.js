let canvasWidth = 400;
let drawHeight = 500;
let controlHeight = 90;
let canvasHeight = drawHeight + controlHeight;

let arr = [4, 8, 13, 19, 25, 31, 42, 56, 63, 75, 88, 94];
let target = 56;
let low = 0;
let high = arr.length - 1;
let mid = -1;
let found = -1;
let autoPlay = false;
let speed = 30;
let tick = 0;
let logs = [];

let targetInput;
let stepBtn;
let autoBtn;
let resetBtn;
let speedSlider;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  targetInput = createInput(String(target));
  stepBtn = createButton('Step');
  stepBtn.mousePressed(stepOnce);
  autoBtn = createButton('Auto Search');
  autoBtn.mousePressed(() => { autoPlay = !autoPlay; });
  resetBtn = createButton('Reset');
  resetBtn.mousePressed(resetSearch);
  speedSlider = createSlider(10, 60, speed, 1);

  positionControls();
  resetSearch();
  describe('Binary search visualization with low mid high pointers and shrinking search range.', LABEL);
}

function draw() {
  updateCanvasSize();
  speed = speedSlider.value();
  const parsed = Number(targetInput.value().trim());
  if (!Number.isNaN(parsed)) target = parsed;

  fill('aliceblue');
  stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  if (autoPlay) {
    tick++;
    if (tick >= speed) {
      tick = 0;
      stepOnce();
    }
  }

  drawTitle();
  drawArray();
  drawLog();

  autoBtn.html(autoPlay ? 'Pause' : 'Auto Search');
}

function drawTitle() {
  noStroke();
  fill('#0f172a');
  textAlign(CENTER, TOP);
  textSize(24);
  text('Binary Search Visualization', canvasWidth / 2, 10);
}

function drawArray() {
  const x = 28;
  const y = 95;
  const w = canvasWidth - 56;
  const h = 220;
  const n = arr.length;
  const bw = (w - (n - 1) * 5) / n;
  const maxV = max(...arr);

  for (let i = 0; i < n; i++) {
    const bh = map(arr[i], 0, maxV, 20, h);
    const bx = x + i * (bw + 5);
    const by = y + h - bh;

    let c = '#60a5fa';
    if (i < low || i > high) c = '#d1d5db';
    if (i === mid) c = '#fde68a';
    if (i === found) c = '#22c55e';

    fill(c);
    stroke('#334155');
    rect(bx, by, bw, bh, 5);

    noStroke();
    fill('#111827');
    textAlign(CENTER, TOP);
    textSize(10);
    text(arr[i], bx + bw / 2, by - 14);
  }

  drawPointerLabel('low', low, '#2563eb', x, y + h + 14, bw, n);
  drawPointerLabel('mid', mid, '#eab308', x, y + h + 34, bw, n);
  drawPointerLabel('high', high, '#dc2626', x, y + h + 54, bw, n);
}

function drawPointerLabel(label, idx, c, x, py, bw, n) {
  if (idx < 0 || idx >= n) return;
  const px = x + idx * (bw + 5) + bw / 2;
  stroke(c);
  line(px, py - 10, px, py - 2);
  noStroke();
  fill(c);
  textAlign(CENTER, TOP);
  textSize(11);
  text(label, px, py);
}

function drawLog() {
  const x = 26;
  const y = 355;
  const w = canvasWidth - 52;
  const h = 120;

  fill(15, 23, 42, 240);
  stroke('#334155');
  rect(x, y, w, h, 8);

  noStroke();
  fill('#93c5fd');
  textAlign(LEFT, TOP);
  textSize(13);
  text('Step Log', x + 10, y + 8);

  fill('#e2e8f0');
  textFont('monospace');
  textSize(12);
  let yy = y + 32;
  for (const line of logs.slice(-4)) {
    text(line, x + 10, yy, w - 20, 18);
    yy += 18;
  }
  textFont('Arial, Helvetica, sans-serif');
}

function stepOnce() {
  if (found >= 0 || low > high) {
    autoPlay = false;
    return;
  }

  mid = floor((low + high) / 2);
  const v = arr[mid];

  if (v === target) {
    found = mid;
    logs.push(`Found at index ${mid}: value ${v}`);
    autoPlay = false;
    return;
  }

  if (target < v) {
    logs.push(`mid=${mid}, ${target} < ${v}, search left`);
    high = mid - 1;
  } else {
    logs.push(`mid=${mid}, ${target} > ${v}, search right`);
    low = mid + 1;
  }

  if (low > high) {
    logs.push('Not found');
    autoPlay = false;
  }
}

function resetSearch() {
  low = 0;
  high = arr.length - 1;
  mid = -1;
  found = -1;
  autoPlay = false;
  tick = 0;
  logs = ['Ready'];
}

function positionControls() {
  targetInput.position(10, drawHeight + 8);
  targetInput.size(90, 24);
  stepBtn.position(108, drawHeight + 8);
  autoBtn.position(154, drawHeight + 8);
  resetBtn.position(245, drawHeight + 8);
  speedSlider.position(300, drawHeight + 12);
  speedSlider.size(140);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = max(760, container.offsetWidth);
}
