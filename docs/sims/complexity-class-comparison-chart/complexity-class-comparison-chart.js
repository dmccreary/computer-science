let canvasWidth = 400;
let drawHeight = 450;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;

let n = 1000;
let nSlider;

const rows = [
  { cls: 'O(1)', name: 'Constant', ex: 'Dictionary lookup', f: (x) => 1 },
  { cls: 'O(log n)', name: 'Logarithmic', ex: 'Binary search', f: (x) => Math.log2(Math.max(2, x)) },
  { cls: 'O(n)', name: 'Linear', ex: 'Linear search', f: (x) => x },
  { cls: 'O(n log n)', name: 'Linearithmic', ex: 'Merge sort', f: (x) => x * Math.log2(Math.max(2, x)) },
  { cls: 'O(n^2)', name: 'Quadratic', ex: 'Selection sort', f: (x) => x * x },
  { cls: 'O(2^n)', name: 'Exponential', ex: 'All subsets', f: (x) => Math.pow(2, Math.min(60, x)) }
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  nSlider = createSlider(10, 100000, n, 10);
  nSlider.input(() => {
    n = nSlider.value();
  });

  positionControls();
  describe('Complexity class comparison table with dynamic operation estimates by input size.', LABEL);
}

function draw() {
  updateCanvasSize();
  n = nSlider.value();

  fill('aliceblue');
  stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawTitle();
  drawTable();
}

function drawTitle() {
  noStroke();
  fill('#0f172a');
  textAlign(CENTER, TOP);
  textSize(24);
  text('Complexity Class Comparison', canvasWidth / 2, 10);
}

function drawTable() {
  const x = 20;
  const y = 62;
  const w = canvasWidth - 40;
  const rowH = 50;

  const col = [0, 130, 250, 430, w];

  fill('#dbeafe');
  stroke('#94a3b8');
  rect(x, y, w, rowH, 6);
  drawHeaderText(x, y, col, ['Complexity', 'Name', 'Example', `Ops for n=${n.toLocaleString()}`]);

  for (let i = 0; i < rows.length; i++) {
    const ry = y + rowH + i * rowH;
    fill(i % 2 === 0 ? '#ffffff' : '#f8fafc');
    stroke('#cbd5e1');
    rect(x, ry, w, rowH);

    const r = rows[i];
    const val = formatOps(r.f(n));

    fill('#111827');
    noStroke();
    textAlign(LEFT, CENTER);
    textSize(13);
    text(r.cls, x + 8, ry + rowH / 2);
    text(r.name, x + col[1] + 8, ry + rowH / 2);
    text(r.ex, x + col[2] + 8, ry + rowH / 2);
    textAlign(RIGHT, CENTER);
    text(val, x + w - 10, ry + rowH / 2);

    stroke('#e5e7eb');
    line(x + col[1], ry, x + col[1], ry + rowH);
    line(x + col[2], ry, x + col[2], ry + rowH);
    line(x + col[3], ry, x + col[3], ry + rowH);
  }
}

function drawHeaderText(x, y, col, labels) {
  noStroke();
  fill('#1e3a8a');
  textAlign(LEFT, CENTER);
  textSize(13);
  text(labels[0], x + 8, y + 25);
  text(labels[1], x + col[1] + 8, y + 25);
  text(labels[2], x + col[2] + 8, y + 25);
  text(labels[3], x + col[3] + 8, y + 25);

  stroke('#93c5fd');
  line(x + col[1], y, x + col[1], y + 50);
  line(x + col[2], y, x + col[2], y + 50);
  line(x + col[3], y, x + col[3], y + 50);
}

function formatOps(v) {
  if (!Number.isFinite(v)) return '∞';
  if (v > 1e12) return v.toExponential(2);
  return Math.round(v).toLocaleString();
}

function positionControls() {
  nSlider.position(12, drawHeight + 12);
  nSlider.size(260);
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
