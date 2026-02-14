let canvasWidth = 400;
let drawHeight = 500;
let controlHeight = 90;
let canvasHeight = drawHeight + controlHeight;

let sizes = [100, 1000, 10000, 100000];
let sizeIndex = 1;
let searchValue = 777;
let listSteps = 0;
let dictSteps = 0;
let racing = false;
let listDone = false;
let dictDone = false;

let sizeSlider;
let searchInput;
let raceBtn;
let resetBtn;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  sizeSlider = createSlider(0, sizes.length - 1, sizeIndex, 1);
  searchInput = createInput(String(searchValue));

  raceBtn = createButton('Race!');
  raceBtn.mousePressed(startRace);

  resetBtn = createButton('Reset');
  resetBtn.mousePressed(resetRace);

  positionControls();
  describe('Dictionary versus list lookup race showing step count growth differences.', LABEL);
}

function draw() {
  updateCanvasSize();
  sizeIndex = sizeSlider.value();
  const n = sizes[sizeIndex];

  fill('aliceblue');
  stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);

  fill('white');
  stroke('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  if (racing) updateRace(n);

  drawTitle(n);
  drawLanes(n);
  drawStepChart();
}

function drawTitle(n) {
  noStroke();
  fill('#0f172a');
  textAlign(CENTER, TOP);
  textSize(24);
  text('Dict vs List Lookup Performance', canvasWidth / 2, 10);
  fill('#334155');
  textSize(14);
  text(`Collection size: ${n.toLocaleString()} | search: ${searchValue}`, canvasWidth / 2, 40);
}

function drawLanes(n) {
  const x = 30;
  const w = canvasWidth - 60;

  drawLane(x, 90, w, 'List Search', '#dbeafe', listSteps, n, listDone);
  drawLane(x, 220, w, 'Dict Search', '#dcfce7', dictSteps, n, dictDone);
}

function drawLane(x, y, w, label, laneColor, steps, n, done) {
  fill(laneColor);
  stroke('#94a3b8');
  rect(x, y, w, 100, 10);

  noStroke();
  fill('#1f2937');
  textAlign(LEFT, TOP);
  textSize(14);
  text(label, x + 10, y + 8);

  const t = min(1, steps / max(1, n));
  const cx = x + 20 + (w - 40) * t;

  fill(done ? '#22c55e' : '#f59e0b');
  stroke('#1f2937');
  circle(cx, y + 60, 18);

  noStroke();
  fill('#334155');
  textSize(12);
  text(`steps: ${steps.toLocaleString()}`, x + 10, y + 80);
}

function drawStepChart() {
  const x = 30;
  const y = 350;
  const w = canvasWidth - 60;
  const h = 130;

  fill('#f8fafc');
  stroke('#94a3b8');
  rect(x, y, w, h, 8);

  const maxSteps = max(1, listSteps, dictSteps);
  const listBar = map(listSteps, 0, maxSteps, 0, w - 180);
  const dictBar = map(dictSteps, 0, maxSteps, 0, w - 180);

  noStroke();
  fill('#2563eb');
  textAlign(LEFT, CENTER);
  textSize(12);
  text('List', x + 14, y + 38);
  rect(x + 70, y + 28, listBar, 16, 4);

  fill('#16a34a');
  text('Dict', x + 14, y + 74);
  rect(x + 70, y + 64, dictBar, 16, 4);

  fill('#334155');
  textSize(12);
  text(`List: ${listSteps.toLocaleString()} steps`, x + 14, y + 104);
  text(`Dict: ${dictSteps.toLocaleString()} steps`, x + 220, y + 104);
}

function startRace() {
  const parsed = Number(searchInput.value().trim());
  if (!Number.isNaN(parsed)) searchValue = parsed;
  resetRace();
  racing = true;
}

function updateRace(n) {
  if (!listDone) {
    listSteps += max(1, floor(n / 1500));
    if (listSteps >= min(n, max(1, abs(searchValue) % n + 1))) {
      listDone = true;
      listSteps = min(n, max(1, abs(searchValue) % n + 1));
    }
  }

  if (!dictDone) {
    dictSteps += 1;
    if (dictSteps >= 3) {
      dictDone = true;
      dictSteps = 3;
    }
  }

  if (listDone && dictDone) racing = false;
}

function resetRace() {
  listSteps = 0;
  dictSteps = 0;
  listDone = false;
  dictDone = false;
  racing = false;
}

function positionControls() {
  sizeSlider.position(10, drawHeight + 10);
  sizeSlider.size(150);
  searchInput.position(170, drawHeight + 10);
  searchInput.size(120, 24);
  raceBtn.position(300, drawHeight + 10);
  resetBtn.position(350, drawHeight + 10);
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
