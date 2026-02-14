let canvasWidth = 400;
let drawHeight = 470;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;

const fileLines = [
  'Roses are red,',
  'Violets are blue,',
  'Python is awesome,',
  'And so are you!'
];

let stepRead = 0;
let stepReadline = 0;
let stepReadlines = 0;
let runAll = false;
let autoFrame = 0;

let runAllBtn;
let stepReadBtn;
let stepReadlineBtn;
let stepReadlinesBtn;
let resetBtn;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  runAllBtn = createButton('Run All');
  runAllBtn.mousePressed(() => {
    runAll = true;
    autoFrame = 0;
  });

  stepReadBtn = createButton('Step read()');
  stepReadBtn.mousePressed(() => {
    stepRead = 1;
  });

  stepReadlineBtn = createButton('Step readline()');
  stepReadlineBtn.mousePressed(() => {
    stepReadline = min(fileLines.length, stepReadline + 1);
  });

  stepReadlinesBtn = createButton('Step readlines()');
  stepReadlinesBtn.mousePressed(() => {
    stepReadlines = min(fileLines.length, stepReadlines + 1);
  });

  resetBtn = createButton('Reset');
  resetBtn.mousePressed(resetSim);

  positionControls();
  describe('Comparison of read(), readline(), and readlines() behavior on the same text file.', LABEL);
}

function draw() {
  updateCanvasSize();

  fill('aliceblue');
  stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);

  fill('white');
  stroke('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  runAuto();

  drawTitle();
  drawFilePanel();
  drawColumns();
}

function drawTitle() {
  noStroke();
  fill('#0f172a');
  textAlign(CENTER, TOP);
  textSize(24);
  text('Read Methods Comparison', canvasWidth / 2, 10);

  fill('#334155');
  textSize(14);
  text('Compare: read(), readline(), readlines()', canvasWidth / 2, 40);
}

function drawFilePanel() {
  const x = margin;
  const y = 68;
  const w = canvasWidth - 2 * margin;
  const h = 95;

  fill('#f8fafc');
  stroke('#94a3b8');
  rect(x, y, w, h, 8);

  noStroke();
  fill('#111827');
  textAlign(LEFT, TOP);
  textSize(14);
  text('Source File (4 lines)', x + 10, y + 8);

  const highlighted = max(stepReadline, stepReadlines);
  for (let i = 0; i < fileLines.length; i++) {
    if (i < highlighted) {
      fill(250, 204, 21, 70);
      noStroke();
      rect(x + 8, y + 28 + i * 16, w - 16, 15, 4);
    }
    noStroke();
    fill('#1f2937');
    textSize(12);
    text(`${i + 1}. ${fileLines[i]}`, x + 14, y + 31 + i * 16);
  }
}

function drawColumns() {
  const top = 188;
  const w = (canvasWidth - margin * 2 - 20) / 3;

  drawMethodColumn(margin, top, w, '#dbeafe', 'read()', 'str', getReadOutput(), 0);
  drawMethodColumn(margin + w + 10, top, w, '#dcfce7', 'readline()', 'str', getReadlineOutput(), 1);
  drawMethodColumn(margin + (w + 10) * 2, top, w, '#ffedd5', 'readlines()', 'list[str]', getReadlinesOutput(), 2);
}

function drawMethodColumn(x, y, w, fillColor, title, returnType, output, idx) {
  const h = 250;

  fill(fillColor);
  stroke('#64748b');
  rect(x, y, w, h, 8);

  noStroke();
  fill('#111827');
  textAlign(CENTER, TOP);
  textSize(14);
  text(title, x + w / 2, y + 8);

  fill('#475569');
  textSize(12);
  text('return: ' + returnType, x + w / 2, y + 28);

  fill(15, 23, 42, 235);
  stroke('#334155');
  rect(x + 8, y + 48, w - 16, h - 58, 6);

  noStroke();
  fill('#e2e8f0');
  textAlign(LEFT, TOP);
  textSize(11);

  const lines = output.split('\n');
  let yy = y + 56;
  for (const line of lines) {
    text(line, x + 13, yy, w - 26, 200);
    yy += 14;
  }

  if (idx === 1) {
    fill('#22c55e');
    textSize(10);
    text('cursor: line ' + (stepReadline + 1), x + 12, y + h - 16);
  }
}

function getReadOutput() {
  if (stepRead === 0) {
    return 'content = (not read yet)';
  }
  const joined = fileLines.join('\\n');
  return 'content = "' + joined + '"';
}

function getReadlineOutput() {
  if (stepReadline === 0) {
    return 'line = (not read yet)';
  }
  let out = '';
  for (let i = 0; i < stepReadline; i++) {
    out += `step ${i + 1}: "${fileLines[i]}\\n"`;
    if (i < stepReadline - 1) out += '\n';
  }
  return out;
}

function getReadlinesOutput() {
  if (stepReadlines === 0) {
    return 'lines = []';
  }
  let out = 'lines = [\n';
  for (let i = 0; i < stepReadlines; i++) {
    out += `  "${fileLines[i]}\\n"`;
    if (i < stepReadlines - 1) out += ',';
    out += '\n';
  }
  out += ']';
  return out;
}

function runAuto() {
  if (!runAll) {
    return;
  }

  autoFrame += 1;
  if (autoFrame % 24 === 0) {
    stepRead = 1;
    stepReadline = min(fileLines.length, stepReadline + 1);
    stepReadlines = min(fileLines.length, stepReadlines + 1);

    if (stepReadline === fileLines.length && stepReadlines === fileLines.length) {
      runAll = false;
    }
  }
}

function resetSim() {
  stepRead = 0;
  stepReadline = 0;
  stepReadlines = 0;
  runAll = false;
  autoFrame = 0;
}

function positionControls() {
  runAllBtn.position(10, drawHeight + 8);
  stepReadBtn.position(70, drawHeight + 8);
  stepReadlineBtn.position(156, drawHeight + 8);
  stepReadlinesBtn.position(265, drawHeight + 8);
  resetBtn.position(377, drawHeight + 8);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = max(640, container.offsetWidth);
  }
}
