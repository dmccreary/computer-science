let canvasWidth = 400;
let drawHeight = 500;
let controlHeight = 90;
let canvasHeight = drawHeight + controlHeight;

let arr = [12, 5, 18, 9, 3, 15, 7, 20];
let target = 9;
let idx = -1;
let found = -1;
let autoPlay = false;
let speed = 30;
let tick = 0;

let targetInput;
let stepBtn;
let autoBtn;
let shuffleBtn;
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
  shuffleBtn = createButton('Shuffle');
  shuffleBtn.mousePressed(shuffleArray);
  resetBtn = createButton('Reset');
  resetBtn.mousePressed(resetSearch);
  speedSlider = createSlider(10, 60, speed, 1);

  positionControls();
  describe('Linear search visualization with highlighted bars and step-by-step comparisons.', LABEL);
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
  drawBars();
  drawStatus();

  autoBtn.html(autoPlay ? 'Pause' : 'Auto Search');
}

function drawTitle() {
  noStroke();
  fill('#0f172a');
  textAlign(CENTER, TOP);
  textSize(24);
  text('Linear Search', canvasWidth / 2, 10);
}

function drawBars() {
  const x = 30;
  const y = 90;
  const w = canvasWidth - 60;
  const h = 340;
  const n = arr.length;
  const bw = (w - (n - 1) * 6) / n;
  const maxV = max(...arr, 1);

  for (let i = 0; i < n; i++) {
    const bh = map(arr[i], 0, maxV, 18, h);
    const bx = x + i * (bw + 6);
    const by = y + h - bh;

    let c = '#60a5fa';
    if (i < idx) c = '#d1d5db';
    if (i === idx) c = '#fde68a';
    if (found === i) c = '#22c55e';

    fill(c);
    stroke('#334155');
    rect(bx, by, bw, bh, 6);

    noStroke();
    fill('#111827');
    textAlign(CENTER, TOP);
    textSize(11);
    text(arr[i], bx + bw / 2, by - 16);
    text(i, bx + bw / 2, y + h + 6);
  }
}

function drawStatus() {
  noStroke();
  fill('#334155');
  textAlign(LEFT, TOP);
  textSize(13);

  let msg = 'Press Step to begin search.';
  if (idx >= 0 && found < 0) msg = `Checking index ${idx}... ${arr[idx] === target ? 'Match!' : 'Not a match'}`;
  if (found >= 0) msg = `Found target ${target} at index ${found}.`;
  if (idx >= arr.length && found < 0) msg = `Target ${target} not found.`;

  text(msg, 30, 448);
}

function stepOnce() {
  if (found >= 0 || idx >= arr.length) {
    autoPlay = false;
    return;
  }
  idx += 1;
  if (idx < arr.length && arr[idx] === target) {
    found = idx;
    autoPlay = false;
  }
  if (idx >= arr.length) autoPlay = false;
}

function shuffleArray() {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = floor(random(i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  resetSearch();
}

function resetSearch() {
  idx = -1;
  found = -1;
  autoPlay = false;
  tick = 0;
}

function positionControls() {
  targetInput.position(10, drawHeight + 8);
  targetInput.size(90, 24);
  stepBtn.position(108, drawHeight + 8);
  autoBtn.position(154, drawHeight + 8);
  shuffleBtn.position(245, drawHeight + 8);
  resetBtn.position(307, drawHeight + 8);
  speedSlider.position(360, drawHeight + 12);
  speedSlider.size(120);
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
