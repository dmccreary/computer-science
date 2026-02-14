let canvasWidth = 400;
let drawHeight = 500;
let controlHeight = 70;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;

let scenarios = [];
let scenarioIndex = 0;
let picks = [];
let statusMessage = 'Select values, predict pass/fail, then run tests.';

let predictPassBtn;
let predictFailBtn;
let runBtn;
let newFnBtn;
let clearBtn;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  scenarios = [
    { name: 'Teen Discount', min: 13, max: 19, validText: 'Accept ages 13-19 inclusive', lo: -10, hi: 30 },
    { name: 'Valid Grade', min: 0, max: 100, validText: 'Accept grades 0-100 inclusive', lo: -20, hi: 120 },
    { name: 'Warehouse Temp', min: 2, max: 8, validText: 'Accept storage temp 2-8 C', lo: -5, hi: 15 }
  ];

  predictPassBtn = createButton('Predict Pass');
  predictPassBtn.mousePressed(() => setPrediction('pass'));

  predictFailBtn = createButton('Predict Fail');
  predictFailBtn.mousePressed(() => setPrediction('fail'));

  runBtn = createButton('Run Tests');
  runBtn.mousePressed(runTests);

  newFnBtn = createButton('New Function');
  newFnBtn.mousePressed(() => {
    scenarioIndex = (scenarioIndex + 1) % scenarios.length;
    picks = [];
    statusMessage = 'Loaded new specification.';
  });

  clearBtn = createButton('Clear');
  clearBtn.mousePressed(() => {
    picks = [];
    statusMessage = 'Selection cleared.';
  });

  positionControls();
  describe('Boundary testing playground with value selection, prediction, and pass fail feedback.', LABEL);
}

function draw() {
  updateCanvasSize();

  fill('aliceblue');
  stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);

  fill('white');
  stroke('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawTitle();
  drawSpecCard();
  drawNumberLine();
  drawResults();
}

function drawTitle() {
  noStroke();
  fill('#0f172a');
  textAlign(CENTER, TOP);
  textSize(24);
  text('Boundary Testing Playground', canvasWidth / 2, 10);
}

function currentScenario() {
  return scenarios[scenarioIndex];
}

function drawSpecCard() {
  const s = currentScenario();
  const x = margin;
  const y = 64;
  const w = canvasWidth - margin * 2;

  fill('#e0f2fe');
  stroke('#7dd3fc');
  rect(x, y, w, 58, 8);

  noStroke();
  fill('#0c4a6e');
  textAlign(LEFT, TOP);
  textSize(14);
  text(`Specification: ${s.name}`, x + 10, y + 10);
  textSize(13);
  text(s.validText, x + 10, y + 32);
}

function drawNumberLine() {
  const s = currentScenario();
  const x1 = margin + 30;
  const x2 = canvasWidth - margin - 30;
  const y = 210;

  stroke('#334155');
  strokeWeight(2);
  line(x1, y, x2, y);

  const step = (s.hi - s.lo) / 8;
  for (let v = s.lo; v <= s.hi + 0.01; v += step) {
    const x = map(v, s.lo, s.hi, x1, x2);
    stroke('#64748b');
    line(x, y - 8, x, y + 8);
    noStroke();
    fill('#334155');
    textAlign(CENTER, TOP);
    textSize(11);
    text(Math.round(v), x, y + 12);
  }

  const minX = map(s.min, s.lo, s.hi, x1, x2);
  const maxX = map(s.max, s.lo, s.hi, x1, x2);
  noStroke();
  fill(34, 197, 94, 80);
  rect(minX, y - 16, maxX - minX, 32);

  for (const p of picks) {
    const px = map(p.value, s.lo, s.hi, x1, x2);
    fill(p.prediction === 'pass' ? '#16a34a' : '#dc2626');
    stroke('#1f2937');
    circle(px, y, 14);
    noStroke();
    fill('#111827');
    textAlign(CENTER, TOP);
    textSize(11);
    text(p.value, px, y - 30);
  }

  noStroke();
  fill('#334155');
  textAlign(LEFT, TOP);
  textSize(13);
  text('Click on number line to add a test value. Then choose prediction.', margin, 248);
}

function drawResults() {
  const x = margin;
  const y = 286;
  const w = canvasWidth - margin * 2;
  const h = 194;

  fill('#f8fafc');
  stroke('#cbd5e1');
  rect(x, y, w, h, 8);

  noStroke();
  fill('#111827');
  textAlign(LEFT, TOP);
  textSize(14);
  text('Results', x + 10, y + 10);

  let yy = y + 36;
  for (const p of picks.slice(-7)) {
    const actual = p.actual || '?';
    const ok = p.correct === true;
    fill(ok ? '#166534' : p.correct === false ? '#b91c1c' : '#334155');
    textSize(12);
    text(`value ${p.value}: predicted ${p.prediction || '-'} | actual ${actual}`, x + 12, yy);
    yy += 20;
  }

  fill('#1e3a8a');
  textSize(12);
  text(statusMessage, x + 10, y + h - 20, w - 20, 20);
}

function mousePressed() {
  const s = currentScenario();
  const x1 = margin + 30;
  const x2 = canvasWidth - margin - 30;
  const y = 210;

  if (mouseY >= y - 20 && mouseY <= y + 20 && mouseX >= x1 && mouseX <= x2) {
    const v = round(map(mouseX, x1, x2, s.lo, s.hi));
    picks.push({ value: v, prediction: null, actual: null, correct: null });
    statusMessage = `Added value ${v}. Choose prediction.`;
  }
}

function setPrediction(pred) {
  if (picks.length === 0) return;
  const last = picks[picks.length - 1];
  last.prediction = pred;
  statusMessage = `Prediction set to ${pred.toUpperCase()} for ${last.value}.`;
}

function runTests() {
  const s = currentScenario();
  let correct = 0;
  let totalPredicted = 0;

  for (const p of picks) {
    const pass = p.value >= s.min && p.value <= s.max;
    p.actual = pass ? 'pass' : 'fail';
    if (p.prediction) {
      totalPredicted += 1;
      p.correct = p.prediction === p.actual;
      if (p.correct) correct += 1;
    }
  }

  statusMessage = `Ran ${picks.length} tests. Prediction accuracy: ${correct}/${totalPredicted}.`;
}

function positionControls() {
  predictPassBtn.position(10, drawHeight + 10);
  predictFailBtn.position(96, drawHeight + 10);
  runBtn.position(181, drawHeight + 10);
  newFnBtn.position(249, drawHeight + 10);
  clearBtn.position(341, drawHeight + 10);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = max(760, container.offsetWidth);
  }
}
