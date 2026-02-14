let canvasWidth = 400;
let drawHeight = 490;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;

let mode = 'direct'; // direct | import
let stepIndex = -1;
let consoleLines = [];

let toggleBtn;
let stepBtn;
let resetBtn;

const geometryLines = [
  'def area_of_circle(r):',
  '    return 3.14 * r * r',
  '',
  'print("module loaded")',
  'if __name__ == "__main__":',
  '    print("running tests")',
  '    print(area_of_circle(5))'
];

const mainLines = [
  'import geometry',
  'print("main program running")'
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  toggleBtn = createButton('Mode: Run Directly');
  toggleBtn.mousePressed(() => {
    mode = mode === 'direct' ? 'import' : 'direct';
    resetRun();
  });

  stepBtn = createButton('Step Through');
  stepBtn.mousePressed(stepRun);

  resetBtn = createButton('Reset');
  resetBtn.mousePressed(resetRun);

  positionControls();
  resetRun();

  describe('Simulation of if __name__ == __main__ behavior when running directly vs importing a module.', LABEL);
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
  drawPanels();
  drawConsole();

  toggleBtn.html(mode === 'direct' ? 'Mode: Run Directly' : 'Mode: Import from main.py');
}

function drawTitle() {
  noStroke();
  fill('#0f172a');
  textAlign(CENTER, TOP);
  textSize(24);
  text('Name Equals Main Simulator', canvasWidth / 2, 10);

  fill('#334155');
  textSize(14);
  text('__name__ = ' + (mode === 'direct' ? '"__main__"' : '"geometry"'), canvasWidth / 2, 40);
}

function drawPanels() {
  const w = (canvasWidth - margin * 3) / 2;
  drawCodePanel(margin, 72, w, 235, 'geometry.py', geometryLines, true);
  drawCodePanel(margin * 2 + w, 72, w, 235, 'main.py', mainLines, false);
}

function drawCodePanel(x, y, w, h, title, lines, isModule) {
  fill('#f8fafc');
  stroke('#94a3b8');
  rect(x, y, w, h, 8);

  noStroke();
  fill('#111827');
  textAlign(LEFT, TOP);
  textSize(14);
  text(title, x + 10, y + 8);

  fill(15, 23, 42, 240);
  stroke('#334155');
  rect(x + 8, y + 34, w - 16, h - 44, 6);

  for (let i = 0; i < lines.length; i++) {
    const ly = y + 48 + i * 24;
    const state = lineState(isModule, i);

    if (state === 'exec') {
      fill(34, 197, 94, 70);
      noStroke();
      rect(x + 12, ly - 6, w - 24, 19, 4);
    } else if (state === 'skip') {
      fill(148, 163, 184, 55);
      noStroke();
      rect(x + 12, ly - 6, w - 24, 19, 4);
    }

    noStroke();
    fill(state === 'skip' ? '#94a3b8' : '#e2e8f0');
    textAlign(LEFT, CENTER);
    textSize(12);
    text(`${i + 1}. ${lines[i]}`, x + 14, ly + 2, w - 26, 20);
  }
}

function lineState(isModule, i) {
  if (stepIndex < 0) return 'none';

  const executed = executedLines();
  const key = (isModule ? 'g:' : 'm:') + i;
  if (executed.exec.has(key)) return 'exec';
  if (executed.skip.has(key)) return 'skip';
  return 'none';
}

function executedLines() {
  const exec = new Set();
  const skip = new Set();

  if (mode === 'direct') {
    if (stepIndex >= 0) exec.add('g:3');
    if (stepIndex >= 1) exec.add('g:4');
    if (stepIndex >= 2) exec.add('g:5');
    if (stepIndex >= 3) exec.add('g:6');
  } else {
    if (stepIndex >= 0) exec.add('m:0');
    if (stepIndex >= 1) exec.add('g:3');
    if (stepIndex >= 2) exec.add('g:4');
    if (stepIndex >= 2) skip.add('g:5');
    if (stepIndex >= 2) skip.add('g:6');
    if (stepIndex >= 3) exec.add('m:1');
  }

  return { exec, skip };
}

function drawConsole() {
  const x = margin;
  const y = 322;
  const w = canvasWidth - margin * 2;
  const h = 150;

  fill(15, 23, 42, 245);
  stroke('#334155');
  rect(x, y, w, h, 8);

  noStroke();
  fill('#93c5fd');
  textAlign(LEFT, TOP);
  textSize(13);
  text('Console Output', x + 10, y + 8);

  fill('#f8fafc');
  textFont('monospace');
  textSize(12);
  for (let i = 0; i < consoleLines.length; i++) {
    text(consoleLines[i], x + 10, y + 32 + i * 18, w - 20, 18);
  }
  textFont('Arial, Helvetica, sans-serif');
}

function stepRun() {
  const maxSteps = mode === 'direct' ? 4 : 4;
  if (stepIndex >= maxSteps - 1) return;

  stepIndex += 1;

  if (mode === 'direct') {
    if (stepIndex === 0) consoleLines.push('module loaded');
    if (stepIndex === 2) consoleLines.push('running tests');
    if (stepIndex === 3) consoleLines.push('78.5');
  } else {
    if (stepIndex === 0) consoleLines.push('import geometry');
    if (stepIndex === 1) consoleLines.push('module loaded');
    if (stepIndex === 2) consoleLines.push('__name__ != "__main__", test block skipped');
    if (stepIndex === 3) consoleLines.push('main program running');
  }

  if (consoleLines.length > 6) consoleLines = consoleLines.slice(-6);
}

function resetRun() {
  stepIndex = -1;
  consoleLines = [];
}

function positionControls() {
  toggleBtn.position(10, drawHeight + 10);
  stepBtn.position(166, drawHeight + 10);
  resetBtn.position(250, drawHeight + 10);
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
