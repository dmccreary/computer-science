let canvasWidth = 400;
let drawHeight = 450;
let controlHeight = 60;
let canvasHeight = drawHeight + controlHeight;

const steps = [
  { step: 1, i: '-', op: 'total = 0', total: 0 },
  { step: 2, i: 0, op: 'total += 0*0', total: 0 },
  { step: 3, i: 1, op: 'total += 1*1', total: 1 },
  { step: 4, i: 2, op: 'total += 2*2', total: 5 },
  { step: 5, i: 3, op: 'total += 3*3', total: 14 },
  { step: 6, i: '-', op: 'return 14', total: 14 }
];

let idx = -1;
let stepBtn;
let resetBtn;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  stepBtn = createButton('Step');
  stepBtn.mousePressed(() => {
    if (idx < steps.length - 1) idx++;
  });

  resetBtn = createButton('Reset');
  resetBtn.mousePressed(() => {
    idx = -1;
  });

  positionControls();
  describe('Operation counting walkthrough table for sum_of_squares with step-by-step trace.', LABEL);
}

function draw() {
  updateCanvasSize();

  fill('aliceblue');
  stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawTitle();
  drawCode();
  drawTable();
  drawSummary();
}

function drawTitle() {
  noStroke();
  fill('#0f172a');
  textSize(24);
  textAlign(CENTER, TOP);
  text('Operation Counting Walkthrough', canvasWidth / 2, 10);
}

function drawCode() {
  const x = 20, y = 62, w = canvasWidth - 40;
  fill(15, 23, 42, 245);
  stroke('#334155');
  rect(x, y, w, 88, 8);

  noStroke();
  fill('#e2e8f0');
  textFont('monospace');
  textSize(12);
  text('def sum_of_squares(n):\n  total = 0\n  for i in range(n):\n    total += i*i\n  return total', x + 10, y + 14);
  textFont('Arial, Helvetica, sans-serif');
}

function drawTable() {
  const x = 20, y = 162, w = canvasWidth - 40, rowH = 36;

  fill('#dbeafe');
  stroke('#94a3b8');
  rect(x, y, w, rowH, 6);

  noStroke();
  fill('#1e3a8a');
  textSize(12);
  textAlign(LEFT, CENTER);
  text('Step', x + 10, y + rowH / 2);
  text('i', x + 70, y + rowH / 2);
  text('Operation', x + 110, y + rowH / 2);
  text('total', x + w - 60, y + rowH / 2);

  for (let i = 0; i < steps.length; i++) {
    const ry = y + rowH + i * rowH;
    fill(i <= idx ? '#fef3c7' : (i % 2 ? '#f8fafc' : '#ffffff'));
    stroke('#cbd5e1');
    rect(x, ry, w, rowH);

    noStroke();
    fill('#111827');
    textAlign(LEFT, CENTER);
    text(String(steps[i].step), x + 10, ry + rowH / 2);
    text(String(steps[i].i), x + 70, ry + rowH / 2);
    text(steps[i].op, x + 110, ry + rowH / 2);
    textAlign(RIGHT, CENTER);
    text(String(steps[i].total), x + w - 12, ry + rowH / 2);
  }
}

function drawSummary() {
  const x = 20, y = 392, w = canvasWidth - 40;
  fill('#ecfeff');
  stroke('#94a3b8');
  rect(x, y, w, 48, 8);

  noStroke();
  fill('#0f172a');
  textAlign(LEFT, CENTER);
  textSize(13);
  text(`Current step: ${idx + 1}/${steps.length}  |  Loop executions: ${min(max(idx,0),4)}  |  Big-O: O(n)`, x + 10, y + 24);
}

function positionControls() {
  stepBtn.position(10, drawHeight + 10);
  resetBtn.position(58, drawHeight + 10);
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
