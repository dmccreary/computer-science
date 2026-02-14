let canvasWidth = 400;
let drawHeight = 450;
let controlHeight = 70;
let canvasHeight = drawHeight + controlHeight;

const data = [2, 1, 5, 1, 3, 2];
let k = 3;
let startIdx = 0;
let maxSum = -Infinity;
let maxStart = 0;

let stepBtn;
let resetBtn;
let autoBtn;
let autoPlay = false;
let lastStepMs = 0;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  stepBtn = createButton('Step');
  stepBtn.mousePressed(stepForward);

  autoBtn = createButton('Auto Play');
  autoBtn.mousePressed(() => {
    autoPlay = !autoPlay;
    autoBtn.html(autoPlay ? 'Pause' : 'Auto Play');
  });

  resetBtn = createButton('Reset');
  resetBtn.mousePressed(resetSim);

  positionControls();
  recomputeMax();
  describe('Sliding window visualization that steps a fixed-size window across a list and tracks sums.', LABEL);
}

function draw() {
  updateCanvasSize();

  if (autoPlay && millis() - lastStepMs > 900) {
    stepForward();
    lastStepMs = millis();
  }

  fill('aliceblue');
  stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawTitle();
  drawArrayRow();
  drawWindowMath();
  drawSummary();
}

function drawTitle() {
  noStroke();
  fill('#0f172a');
  textAlign(CENTER, TOP);
  textSize(24);
  text('Sliding Window Visualization', canvasWidth / 2, 10);
}

function drawArrayRow() {
  const cellW = min(90, (canvasWidth - 100) / data.length);
  const totalW = cellW * data.length;
  const x0 = (canvasWidth - totalW) / 2;
  const y = 110;
  const h = 70;

  const currentEnd = startIdx + k - 1;

  for (let i = 0; i < data.length; i++) {
    const x = x0 + i * cellW;
    const inWindow = i >= startIdx && i <= currentEnd;

    fill(inWindow ? '#bfdbfe' : '#ffffff');
    stroke(inWindow ? '#1d4ed8' : '#94a3b8');
    strokeWeight(inWindow ? 2.5 : 1.2);
    rect(x, y, cellW, h, 8);

    noStroke();
    fill('#111827');
    textAlign(CENTER, CENTER);
    textSize(20);
    text(String(data[i]), x + cellW / 2, y + h / 2 - 2);

    fill('#475569');
    textSize(12);
    text(i, x + cellW / 2, y + h + 14);
  }

  const wx = x0 + startIdx * cellW;
  noFill();
  stroke('#0f172a');
  strokeWeight(3);
  rect(wx - 4, y - 4, cellW * k + 8, h + 8, 10);

  noStroke();
  fill('#0f172a');
  textSize(13);
  textAlign(CENTER, TOP);
  text(`window size k = ${k}`, canvasWidth / 2, y + h + 26);
}

function drawWindowMath() {
  const y = 245;
  const currentVals = data.slice(startIdx, startIdx + k);
  const currentSum = currentVals.reduce((a, b) => a + b, 0);

  fill('#ecfeff');
  stroke('#94a3b8');
  rect(40, y, canvasWidth - 80, 120, 10);

  noStroke();
  fill('#0f172a');
  textAlign(LEFT, TOP);
  textSize(14);
  text(`Current window: [${currentVals.join(', ')}]`, 56, y + 16);
  text(`Current sum: ${currentVals.join(' + ')} = ${currentSum}`, 56, y + 44);

  if (startIdx > 0) {
    const leaving = data[startIdx - 1];
    const entering = data[startIdx + k - 1];
    const prevVals = data.slice(startIdx - 1, startIdx - 1 + k);
    const prevSum = prevVals.reduce((a, b) => a + b, 0);
    text(`Slide update: ${prevSum} - ${leaving} + ${entering} = ${currentSum}`, 56, y + 72);
  } else {
    text('First window uses direct sum of first k elements.', 56, y + 72);
  }
}

function drawSummary() {
  const currentVals = data.slice(startIdx, startIdx + k);
  const currentSum = currentVals.reduce((a, b) => a + b, 0);
  const done = startIdx >= data.length - k;

  fill('#f8fafc');
  stroke('#94a3b8');
  rect(40, 377, canvasWidth - 80, 52, 8);

  noStroke();
  fill('#0f172a');
  textSize(13);
  textAlign(CENTER, CENTER);
  let msg = `Step ${startIdx + 1}/${data.length - k + 1} | max sum so far: ${maxSum} at window [${maxStart}..${maxStart + k - 1}]`;
  if (done) msg += ' | complete';
  if (currentSum === maxSum) msg += ' | current is maximum';
  text(msg, canvasWidth / 2, 403);
}

function recomputeMax() {
  maxSum = -Infinity;
  maxStart = 0;
  for (let i = 0; i <= data.length - k; i++) {
    const s = data.slice(i, i + k).reduce((a, b) => a + b, 0);
    if (s > maxSum) {
      maxSum = s;
      maxStart = i;
    }
  }
}

function stepForward() {
  if (startIdx < data.length - k) {
    startIdx += 1;
  } else {
    autoPlay = false;
    autoBtn.html('Auto Play');
  }
}

function resetSim() {
  startIdx = 0;
  autoPlay = false;
  autoBtn.html('Auto Play');
  recomputeMax();
}

function positionControls() {
  stepBtn.position(10, drawHeight + 10);
  autoBtn.position(58, drawHeight + 10);
  resetBtn.position(132, drawHeight + 10);
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
