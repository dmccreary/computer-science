let canvasWidth = 400;
let drawHeight = 460;
let controlHeight = 70;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;

let runMode = 'idle'; // idle | normal | error
let step = 0;
let auto = false;
let frameTicker = 0;

let manualOpen = false;
let withOpen = false;
let manualStuck = false;

let runNormalBtn;
let runErrorBtn;
let resetBtn;

const manualCode = [
  'f = open("data.txt", "r")',
  'data = f.read()',
  'process(data)',
  'f.close()'
];

const withCode = [
  'with open("data.txt", "r") as f:',
  '    data = f.read()',
  '    process(data)',
  '# file auto-closed'
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  runNormalBtn = createButton('Run Normal');
  runNormalBtn.mousePressed(() => startRun('normal'));

  runErrorBtn = createButton('Run With Error');
  runErrorBtn.mousePressed(() => startRun('error'));

  resetBtn = createButton('Reset');
  resetBtn.mousePressed(resetSim);

  positionControls();
  resetSim();

  describe('Side-by-side simulation comparing manual file close and with statement behavior during errors.', LABEL);
}

function draw() {
  updateCanvasSize();

  fill('aliceblue');
  stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);

  fill('white');
  stroke('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  runExecution();

  drawTitle();
  drawPanel(margin, 78, (canvasWidth - margin * 3) / 2, 'Manual Open/Close', manualCode, true);
  drawPanel(margin * 2 + (canvasWidth - margin * 3) / 2, 78, (canvasWidth - margin * 3) / 2, 'With Statement', withCode, false);
  drawLegend();
}

function drawTitle() {
  noStroke();
  fill('#0f172a');
  textAlign(CENTER, TOP);
  textSize(24);
  text('With Statement vs Manual Close', canvasWidth / 2, 10);

  fill('#334155');
  textSize(14);
  text('Error scenario highlights why context managers are safer', canvasWidth / 2, 40);
}

function drawPanel(x, y, w, title, codeLines, isManual) {
  fill('#f8fafc');
  stroke('#64748b');
  rect(x, y, w, 330, 10);

  noStroke();
  fill('#111827');
  textAlign(CENTER, TOP);
  textSize(16);
  text(title, x + w / 2, y + 8);

  drawStatusIcon(x + 40, y + 45, isManual);

  fill('#334155');
  textSize(12);
  text('File Status', x + 80, y + 38);

  textAlign(LEFT, CENTER);
  const statusText = getStatusText(isManual);
  text(statusText, x + 80, y + 57);

  fill(15, 23, 42, 235);
  stroke('#334155');
  rect(x + 12, y + 78, w - 24, 120, 8);

  for (let i = 0; i < codeLines.length; i++) {
    const ly = y + 90 + i * 26;

    if (isLineActive(i, isManual)) {
      fill(34, 197, 94, 55);
      if (runMode === 'error' && i === 2) {
        fill(239, 68, 68, 70);
      }
      noStroke();
      rect(x + 18, ly - 7, w - 36, 21, 5);
    }

    noStroke();
    fill('#e2e8f0');
    textAlign(LEFT, CENTER);
    textSize(12);
    text(codeLines[i], x + 24, ly + 3);
  }

  drawLog(x + 12, y + 210, w - 24, 110, isManual);
}

function drawStatusIcon(x, y, isManual) {
  const open = isManual ? manualOpen : withOpen;
  const stuck = isManual && manualStuck;

  if (stuck) {
    fill(239, 68, 68, 180 + 50 * sin(frameCount * 0.15));
  } else if (open) {
    fill('#facc15');
  } else {
    fill('#22c55e');
  }

  stroke('#334155');
  strokeWeight(2);
  circle(x, y, 28);

  noStroke();
  fill('#111827');
  textAlign(CENTER, CENTER);
  textSize(12);
  text(open ? '' : '', x, y + 1);
}

function drawLog(x, y, w, h, isManual) {
  fill('white');
  stroke('#cbd5e1');
  rect(x, y, w, h, 7);

  noStroke();
  fill('#334155');
  textAlign(LEFT, TOP);
  textSize(12);
  text('Execution Log', x + 8, y + 6);

  const lines = getLogLines(isManual);
  let yy = y + 24;
  for (const line of lines) {
    fill(line.startsWith('ERROR') ? '#dc2626' : '#1f2937');
    text(line, x + 8, yy, w - 16, 100);
    yy += 16;
  }
}

function drawLegend() {
  noStroke();
  fill('#334155');
  textAlign(LEFT, CENTER);
  textSize(13);
  text('Green=closed, Yellow=open, Red pulsing=stuck open after error', margin, 430);
}

function getStatusText(isManual) {
  if (isManual && manualStuck) return 'Open (stuck after error)';
  const open = isManual ? manualOpen : withOpen;
  return open ? 'Open' : 'Closed';
}

function isLineActive(i, isManual) {
  if (runMode === 'idle') return false;

  if (runMode === 'normal') {
    return i === step;
  }

  if (runMode === 'error') {
    if (step <= 2) {
      return i === step;
    }
    if (!isManual && step === 3) {
      return i === 3;
    }
  }

  return false;
}

function getLogLines(isManual) {
  if (runMode === 'idle') {
    return ['Ready to run scenario.'];
  }

  const lines = [];

  if (step >= 0) lines.push('Opened file');
  if (step >= 1) lines.push('Reading data...');

  if (runMode === 'error' && step >= 2) {
    lines.push('ERROR: processing failed');
    if (isManual) {
      lines.push('File still open!');
    } else if (step >= 3) {
      lines.push('File closed by context manager');
    }
    return lines;
  }

  if (step >= 3) lines.push('File closed successfully');
  return lines;
}

function startRun(mode) {
  runMode = mode;
  step = 0;
  auto = true;
  frameTicker = 0;
  manualOpen = true;
  withOpen = true;
  manualStuck = false;
}

function runExecution() {
  if (!auto) return;

  frameTicker += 1;
  if (frameTicker < 35) return;
  frameTicker = 0;

  step += 1;

  if (runMode === 'normal') {
    if (step >= 3) {
      manualOpen = false;
      withOpen = false;
      auto = false;
    }
    return;
  }

  if (runMode === 'error') {
    if (step === 2) {
      manualStuck = true;
      manualOpen = true;
      withOpen = true;
    }
    if (step >= 3) {
      withOpen = false;
      auto = false;
    }
  }
}

function resetSim() {
  runMode = 'idle';
  step = 0;
  auto = false;
  frameTicker = 0;
  manualOpen = false;
  withOpen = false;
  manualStuck = false;
}

function positionControls() {
  runNormalBtn.position(10, drawHeight + 10);
  runErrorBtn.position(95, drawHeight + 10);
  resetBtn.position(203, drawHeight + 10);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = max(680, container.offsetWidth);
  }
}
