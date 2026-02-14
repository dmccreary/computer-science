let canvasWidth = 400;
let drawHeight = 500;
let controlHeight = 70;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;

let bugFixed = false;
let running = false;
let runAll = false;
let currentTest = -1;
let tick = 0;

let tests = [];
let codeLines = [];

let runAllBtn;
let stepBtn;
let fixBtn;
let resetBtn;

const testCases = [
  { name: 'test_normal_list', input: [3, 1, 4, 1], expected: 4 },
  { name: 'test_single', input: [42], expected: 42 },
  { name: 'test_duplicates', input: [7, 7, 7], expected: 7 },
  { name: 'test_negatives', input: [-5, -2, -9], expected: -2 },
  { name: 'test_mixed', input: [10, -3, 2], expected: 10 }
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  runAllBtn = createButton('Run All Tests');
  runAllBtn.mousePressed(() => {
    if (running) return;
    resetStatuses();
    currentTest = -1;
    runAll = true;
    running = true;
    tick = 0;
  });

  stepBtn = createButton('Step');
  stepBtn.mousePressed(() => {
    if (running && runAll) return;
    if (currentTest === -1) resetStatuses();
    runSingleStep();
  });

  fixBtn = createButton('Fix Bug');
  fixBtn.mousePressed(() => {
    bugFixed = true;
    buildCodeLines();
  });

  resetBtn = createButton('Reset');
  resetBtn.mousePressed(resetSim);

  resetSim();
  positionControls();

  describe('Unit test runner simulation with pass fail statuses and a fix bug action.', LABEL);
}

function draw() {
  updateCanvasSize();

  fill('aliceblue');
  stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);

  fill('white');
  stroke('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  if (running && runAll) {
    tick += 1;
    if (tick > 36) {
      tick = 0;
      runSingleStep();
    }
  }

  drawTitle();
  drawCodePanel();
  drawTestsPanel();
  drawSummaryBar();
}

function drawTitle() {
  noStroke();
  fill('#0f172a');
  textAlign(CENTER, TOP);
  textSize(24);
  text('Unit Test Runner Visualization', canvasWidth / 2, 10);

  fill('#334155');
  textSize(13);
  text(bugFixed ? 'Bug status: fixed' : 'Bug status: subtle bug present', canvasWidth / 2, 40);
}

function drawCodePanel() {
  const x = margin;
  const y = 70;
  const w = (canvasWidth - margin * 3) / 2;
  const h = 350;

  fill('#f8fafc');
  stroke('#94a3b8');
  rect(x, y, w, h, 8);

  noStroke();
  fill('#111827');
  textAlign(LEFT, TOP);
  textSize(14);
  text('Source Code: find_max()', x + 10, y + 10);

  fill(15, 23, 42, 245);
  stroke('#334155');
  rect(x + 10, y + 36, w - 20, h - 48, 6);

  textFont('monospace');
  textSize(12);
  for (let i = 0; i < codeLines.length; i++) {
    const ly = y + 54 + i * 22;
    if (!bugFixed && i === 1) {
      fill(239, 68, 68, 70);
      noStroke();
      rect(x + 14, ly - 6, w - 28, 18, 4);
    }

    noStroke();
    fill('#e2e8f0');
    text(`${i + 1}. ${codeLines[i]}`, x + 16, ly);
  }
  textFont('Arial, Helvetica, sans-serif');
}

function drawTestsPanel() {
  const x = margin * 2 + (canvasWidth - margin * 3) / 2;
  const y = 70;
  const w = (canvasWidth - margin * 3) / 2;
  const h = 350;

  fill('#f8fafc');
  stroke('#94a3b8');
  rect(x, y, w, h, 8);

  noStroke();
  fill('#111827');
  textAlign(LEFT, TOP);
  textSize(14);
  text('Unit Tests', x + 10, y + 10);

  for (let i = 0; i < tests.length; i++) {
    const ty = y + 42 + i * 56;
    const t = tests[i];

    fill('#ffffff');
    stroke('#cbd5e1');
    rect(x + 10, ty, w - 20, 48, 6);

    let c = '#94a3b8';
    if (t.status === 'running') c = '#f59e0b';
    if (t.status === 'pass') c = '#22c55e';
    if (t.status === 'fail') c = '#ef4444';

    noStroke();
    fill(c);
    circle(x + 24, ty + 24, 14);

    fill('#1f2937');
    textAlign(LEFT, CENTER);
    textSize(12);
    text(t.name, x + 36, ty + 18);
    text(`expected ${t.expected}, got ${t.actual === null ? '?' : t.actual}`, x + 36, ty + 34);
  }
}

function drawSummaryBar() {
  const passed = tests.filter((t) => t.status === 'pass').length;
  const failed = tests.filter((t) => t.status === 'fail').length;

  const x = margin;
  const y = 432;
  const w = canvasWidth - margin * 2;
  const h = 54;

  fill('#eef2ff');
  stroke('#94a3b8');
  rect(x, y, w, h, 8);

  noStroke();
  fill('#166534');
  textAlign(LEFT, CENTER);
  textSize(14);
  text(`Passed: ${passed}`, x + 12, y + 19);

  fill('#b91c1c');
  text(`Failed: ${failed}`, x + 120, y + 19);

  fill('#334155');
  text(`Total: ${tests.length}`, x + 228, y + 19);

  fill('#1e3a8a');
  textSize(12);
  text('Run tests, inspect failures, then click Fix Bug and re-run.', x + 12, y + 38);
}

function runSingleStep() {
  if (currentTest >= tests.length - 1) {
    running = false;
    runAll = false;
    return;
  }

  if (currentTest >= 0) {
    if (tests[currentTest].status === 'running') {
      evaluateTest(currentTest);
    }
  }

  currentTest += 1;
  if (currentTest < tests.length) {
    tests[currentTest].status = 'running';
  }
}

function evaluateTest(idx) {
  const t = tests[idx];
  const actual = findMax(t.input);
  t.actual = actual;
  t.status = actual === t.expected ? 'pass' : 'fail';
}

function findMax(arr) {
  let biggest = bugFixed ? arr[0] : 0; // bug when all values are negative
  for (const n of arr) {
    if (n > biggest) biggest = n;
  }
  return biggest;
}

function buildCodeLines() {
  codeLines = [
    'def find_max(numbers):',
    bugFixed ? '    biggest = numbers[0]' : '    biggest = 0  # bug',
    '    for n in numbers:',
    '        if n > biggest:',
    '            biggest = n',
    '    return biggest'
  ];
}

function resetStatuses() {
  tests = testCases.map((t) => ({ ...t, status: 'pending', actual: null }));
}

function resetSim() {
  bugFixed = false;
  running = false;
  runAll = false;
  currentTest = -1;
  tick = 0;
  buildCodeLines();
  resetStatuses();
}

function positionControls() {
  runAllBtn.position(10, drawHeight + 10);
  stepBtn.position(108, drawHeight + 10);
  fixBtn.position(154, drawHeight + 10);
  resetBtn.position(215, drawHeight + 10);
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
