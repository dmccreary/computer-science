let canvasWidth = 400;
let drawHeight = 520;
let controlHeight = 90;
let canvasHeight = drawHeight + controlHeight;

let maxN = 1000;
let show = { O1: true, Olog: true, On: true, Onlogn: true, On2: true };
let zoomMode = false;

let nSlider;
let zoomBtn;
let checks = {};

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  nSlider = createSlider(10, 100000, maxN, 10);
  zoomBtn = createButton('Zoom In');
  zoomBtn.mousePressed(() => { zoomMode = !zoomMode; });

  checks.O1 = createCheckbox('O(1)', true);
  checks.Olog = createCheckbox('O(log n)', true);
  checks.On = createCheckbox('O(n)', true);
  checks.Onlogn = createCheckbox('O(n log n)', true);
  checks.On2 = createCheckbox('O(n^2)', true);

  positionControls();
  describe('Big-O growth chart with toggleable curves and adjustable maximum input size.', LABEL);
}

function draw() {
  updateCanvasSize();
  maxN = nSlider.value();
  show.O1 = checks.O1.checked();
  show.Olog = checks.Olog.checked();
  show.On = checks.On.checked();
  show.Onlogn = checks.Onlogn.checked();
  show.On2 = checks.On2.checked();

  fill('aliceblue');
  stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawTitle();
  drawAxesAndCurves();

  zoomBtn.html(zoomMode ? 'Zoom Out' : 'Zoom In');
}

function drawTitle() {
  noStroke();
  fill('#0f172a');
  textAlign(CENTER, TOP);
  textSize(24);
  text('Big-O Growth Rate Chart', canvasWidth / 2, 10);
}

function drawAxesAndCurves() {
  const x = 60, y = 70, w = canvasWidth - 220, h = 400;
  const nMax = zoomMode ? min(maxN, 500) : maxN;
  const yMax = computeYMax(nMax);

  fill('#ffffff');
  stroke('#cbd5e1');
  rect(x, y, w, h);

  stroke('#e5e7eb');
  for (let i = 1; i < 10; i++) {
    line(x, y + (h * i) / 10, x + w, y + (h * i) / 10);
    line(x + (w * i) / 10, y, x + (w * i) / 10, y + h);
  }

  stroke('#334155');
  line(x, y + h, x + w, y + h);
  line(x, y, x, y + h);

  drawCurve(show.O1, '#16a34a', (n) => 1, x, y, w, h, nMax, yMax);
  drawCurve(show.Olog, '#2563eb', (n) => Math.log2(Math.max(2, n)), x, y, w, h, nMax, yMax);
  drawCurve(show.On, '#f97316', (n) => n, x, y, w, h, nMax, yMax);
  drawCurve(show.Onlogn, '#9333ea', (n) => n * Math.log2(Math.max(2, n)), x, y, w, h, nMax, yMax);
  drawCurve(show.On2, '#dc2626', (n) => n * n, x, y, w, h, nMax, yMax);

  noStroke();
  fill('#334155');
  textAlign(CENTER, TOP);
  textSize(12);
  text(`n max = ${nMax.toLocaleString()}`, x + w / 2, y + h + 8);

  const hoverN = map(constrain(mouseX, x, x + w), x, x + w, 1, nMax);
  drawHoverInfo(hoverN, x + w + 15, y + 200);
}

function computeYMax(nMax) {
  return max(1, nMax * nMax, nMax * Math.log2(max(2, nMax)));
}

function drawCurve(enabled, c, f, x, y, w, h, nMax, yMax) {
  if (!enabled) return;
  noFill();
  stroke(c);
  strokeWeight(2);
  beginShape();
  for (let px = 0; px <= w; px += 2) {
    const n = map(px, 0, w, 1, nMax);
    const val = f(n);
    const py = map(val, 0, yMax, y + h, y);
    vertex(x + px, py);
  }
  endShape();
}

function drawHoverInfo(n, x, y) {
  const vals = {
    'O(1)': 1,
    'O(log n)': Math.log2(Math.max(2, n)),
    'O(n)': n,
    'O(n log n)': n * Math.log2(Math.max(2, n)),
    'O(n^2)': n * n
  };

  fill('#f8fafc');
  stroke('#94a3b8');
  rect(x, y - 80, 140, 140, 8);
  noStroke();
  fill('#111827');
  textAlign(LEFT, TOP);
  textSize(12);
  text(`n = ${Math.round(n).toLocaleString()}`, x + 8, y - 66);

  let yy = y - 46;
  for (const [k, v] of Object.entries(vals)) {
    text(`${k}: ${Math.round(v).toLocaleString()}`, x + 8, yy);
    yy += 18;
  }
}

function positionControls() {
  nSlider.position(10, drawHeight + 10);
  nSlider.size(240);
  zoomBtn.position(260, drawHeight + 8);

  checks.O1.position(canvasWidth - 140, 100);
  checks.Olog.position(canvasWidth - 140, 126);
  checks.On.position(canvasWidth - 140, 152);
  checks.Onlogn.position(canvasWidth - 140, 178);
  checks.On2.position(canvasWidth - 140, 204);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = max(960, container.offsetWidth);
}
