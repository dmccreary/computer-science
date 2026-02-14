let canvasWidth = 400;
let drawHeight = 500;
let controlHeight = 90;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;

let arr = [7, 3, 9, 2, 5, 8];
let target = 5;
let indexPtr = 0;
let result = null;
let stage = 'start';
let autoPlay = false;
let frameTick = 0;

let targetInput;
let arrayInput;
let stepBtn;
let autoBtn;
let resetBtn;

const nodes = {
  start: { label: 'Start', type: 'oval', x: 170, y: 80, w: 120, h: 38 },
  init: { label: 'Set index = 0', type: 'proc', x: 170, y: 132, w: 150, h: 44 },
  condLen: { label: 'index < length?', type: 'decision', x: 170, y: 196, w: 170, h: 66 },
  condMatch: { label: 'list[index] == target?', type: 'decision', x: 170, y: 286, w: 200, h: 66 },
  inc: { label: 'index = index + 1', type: 'proc', x: 170, y: 372, w: 170, h: 44 },
  retFound: { label: 'Return index', type: 'proc', x: 400, y: 286, w: 130, h: 44 },
  retNot: { label: 'Return -1', type: 'proc', x: 400, y: 196, w: 130, h: 44 },
  end: { label: 'End', type: 'oval', x: 400, y: 116, w: 100, h: 38 }
};

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  targetInput = createInput(String(target));
  arrayInput = createInput(arr.join(','));

  stepBtn = createButton('Step');
  stepBtn.mousePressed(stepFlow);

  autoBtn = createButton('Auto Run');
  autoBtn.mousePressed(() => {
    autoPlay = !autoPlay;
    frameTick = 0;
  });

  resetBtn = createButton('Reset');
  resetBtn.mousePressed(resetFlow);

  positionControls();
  describe('Linear search flowchart with step and auto run controls and editable array.', LABEL);
}

function draw() {
  updateCanvasSize();

  fill('aliceblue');
  stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  if (autoPlay) {
    frameTick += 1;
    if (frameTick > 24) {
      frameTick = 0;
      stepFlow();
    }
  }

  drawTitle();
  drawFlowchart();
  drawArrayPanel();
  drawStatus();

  autoBtn.html(autoPlay ? 'Pause' : 'Auto Run');
}

function drawTitle() {
  noStroke();
  fill('#0f172a');
  textAlign(CENTER, TOP);
  textSize(22);
  text('Linear Search Flowchart', canvasWidth / 2, 8);
}

function drawFlowchart() {
  for (const [k, n] of Object.entries(nodes)) {
    const active = stage === k;
    drawNode(n, active);
  }

  drawArrow(170, 99, 170, 110);
  drawArrow(170, 154, 170, 163);
  drawArrow(170, 229, 170, 253);
  drawArrow(170, 319, 170, 350);
  drawArrow(170, 394, 170, 403);

  drawArrow(255, 196, 335, 196); // no branch
  drawArrow(255, 286, 335, 286); // yes branch
  drawArrow(400, 264, 400, 135); // found to end
  drawArrow(400, 174, 400, 135); // not found to end

  noStroke();
  fill('#334155');
  textSize(11);
  textAlign(LEFT, CENTER);
  text('No', 274, 186);
  text('Yes', 274, 276);
}

function drawNode(n, active) {
  stroke(active ? '#f59e0b' : '#64748b');
  strokeWeight(active ? 3 : 1.5);
  fill(active ? '#fde68a' : '#f8fafc');

  if (n.type === 'oval') {
    ellipse(n.x, n.y, n.w, n.h);
  } else if (n.type === 'proc') {
    rectMode(CENTER);
    rect(n.x, n.y, n.w, n.h, 8);
    rectMode(CORNER);
  } else {
    beginShape();
    vertex(n.x, n.y - n.h / 2);
    vertex(n.x + n.w / 2, n.y);
    vertex(n.x, n.y + n.h / 2);
    vertex(n.x - n.w / 2, n.y);
    endShape(CLOSE);
  }

  noStroke();
  fill('#111827');
  textAlign(CENTER, CENTER);
  textSize(12);
  text(n.label, n.x, n.y, n.w - 12, n.h - 8);
}

function drawArrow(x1, y1, x2, y2) {
  stroke('#94a3b8');
  strokeWeight(1.5);
  line(x1, y1, x2, y2);
  const a = atan2(y2 - y1, x2 - x1);
  push();
  translate(x2, y2);
  rotate(a);
  noStroke();
  fill('#94a3b8');
  triangle(0, 0, -8, 4, -8, -4);
  pop();
}

function drawArrayPanel() {
  const x = 480;
  const y = 120;
  const w = canvasWidth - x - 20;
  const h = 290;
  fill('#eef2ff');
  stroke('#94a3b8');
  rect(x, y, w, h, 8);

  noStroke();
  fill('#1e3a8a');
  textAlign(LEFT, TOP);
  textSize(13);
  text('Array', x + 10, y + 8);

  const bx = x + 10;
  const by = y + 36;
  const bw = max(24, min(46, (w - 20) / max(1, arr.length) - 4));
  for (let i = 0; i < arr.length; i++) {
    const xx = bx + i * (bw + 4);
    let c = '#ffffff';
    if (i < indexPtr) c = '#e5e7eb';
    if (i === indexPtr && stage !== 'end') c = '#fde68a';
    if (result !== null && i === result) c = '#86efac';

    fill(c);
    stroke('#64748b');
    rect(xx, by, bw, 38, 6);
    noStroke();
    fill('#111827');
    textAlign(CENTER, CENTER);
    textSize(12);
    text(arr[i], xx + bw / 2, by + 19);

    fill('#475569');
    textSize(10);
    text(i, xx + bw / 2, by + 50);
  }
}

function drawStatus() {
  const msg = result === null
    ? `index=${indexPtr}, target=${target}`
    : result >= 0 ? `Found target at index ${result}` : 'Target not found';
  noStroke();
  fill('#334155');
  textAlign(LEFT, CENTER);
  textSize(13);
  text(msg, 22, 462);
}

function stepFlow() {
  parseInputs();

  if (stage === 'end') {
    autoPlay = false;
    return;
  }

  if (stage === 'start') stage = 'init';
  else if (stage === 'init') stage = 'condLen';
  else if (stage === 'condLen') {
    if (indexPtr < arr.length) stage = 'condMatch';
    else {
      result = -1;
      stage = 'retNot';
    }
  } else if (stage === 'condMatch') {
    if (arr[indexPtr] === target) {
      result = indexPtr;
      stage = 'retFound';
    } else stage = 'inc';
  } else if (stage === 'inc') {
    indexPtr += 1;
    stage = 'condLen';
  } else if (stage === 'retFound' || stage === 'retNot') {
    stage = 'end';
    autoPlay = false;
  }
}

function resetFlow() {
  parseInputs();
  indexPtr = 0;
  result = null;
  stage = 'start';
  autoPlay = false;
}

function parseInputs() {
  const t = Number(targetInput.value().trim());
  if (!Number.isNaN(t)) target = t;
  const vals = arrayInput.value().split(',').map((s) => Number(s.trim())).filter((n) => !Number.isNaN(n));
  if (vals.length > 0) arr = vals;
  if (indexPtr > arr.length) indexPtr = arr.length;
}

function positionControls() {
  targetInput.position(10, drawHeight + 8);
  targetInput.size(80, 24);
  arrayInput.position(98, drawHeight + 8);
  arrayInput.size(max(250, canvasWidth - 430), 24);
  stepBtn.position(canvasWidth - 320, drawHeight + 8);
  autoBtn.position(canvasWidth - 270, drawHeight + 8);
  resetBtn.position(canvasWidth - 198, drawHeight + 8);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = max(980, container.offsetWidth);
}
