// If-Elif-Else Flowchart MicroSim
// Students enter a score and trace the decision path through a grading flowchart
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 400;
let drawHeight = 480;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;

// Controls
let scoreInput;
let traceButton;
let stepButton;
let resetButton;

// Flowchart data
let decisions = [];
let gradeBoxes = [];
let printBox = null;

// Animation state
let currentStep = -1;  // -1 means not started
let traceScore = 85;
let resultGrade = '';
let stepResults = [];  // stores True/False for each decision
let animMode = 'idle'; // 'idle', 'stepping', 'done'

// Node dimensions
const boxW = 90;
const boxH = 36;
const diaW = 42;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  scoreInput = createInput('85', 'number');
  scoreInput.position(10, drawHeight + 12);
  scoreInput.size(50);

  traceButton = createButton('Trace');
  traceButton.position(75, drawHeight + 10);
  traceButton.mousePressed(startTrace);

  stepButton = createButton('Step');
  stepButton.position(130, drawHeight + 10);
  stepButton.mousePressed(nextStep);

  resetButton = createButton('Reset');
  resetButton.position(185, drawHeight + 10);
  resetButton.mousePressed(resetTrace);

  describe('Interactive flowchart for tracing an if-elif-else grading chain. Enter a score and step through decisions.', LABEL);
}

function buildFlowchart() {
  let cx = canvasWidth * 0.38;
  let startY = 70;
  let gapY = 80;

  decisions = [
    { x: cx, y: startY, cond: 'score >= 90', threshold: 90 },
    { x: cx, y: startY + gapY, cond: 'score >= 80', threshold: 80 },
    { x: cx, y: startY + gapY * 2, cond: 'score >= 70', threshold: 70 },
    { x: cx, y: startY + gapY * 3, cond: 'score >= 60', threshold: 60 },
  ];

  let gradeX = cx + 140;
  gradeBoxes = [
    { x: gradeX, y: startY, grade: 'A', color: [46, 160, 67] },
    { x: gradeX, y: startY + gapY, grade: 'B', color: [100, 180, 80] },
    { x: gradeX, y: startY + gapY * 2, grade: 'C', color: [220, 180, 50] },
    { x: gradeX, y: startY + gapY * 3, grade: 'D', color: [220, 130, 50] },
  ];

  // F box is below the last decision
  gradeBoxes.push({ x: cx, y: startY + gapY * 4, grade: 'F', color: [200, 60, 60] });

  // Print box at the bottom
  printBox = { x: cx + 70, y: startY + gapY * 4 + 70 };
}

function draw() {
  updateCanvasSize();

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  buildFlowchart();

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(18);
  text('If-Elif-Else Flowchart', canvasWidth / 2, 8);

  // Score display
  textSize(14);
  textAlign(LEFT, TOP);
  fill(80);
  text('Score: ' + traceScore, canvasWidth * 0.38 - 45, 42);

  // Draw edges first
  drawFlowchartEdges();

  // Draw decision diamonds
  for (let i = 0; i < decisions.length; i++) {
    let d = decisions[i];
    let state = getNodeState(i);
    drawDiamond(d.x, d.y, d.cond, state);
  }

  // Draw grade boxes
  for (let i = 0; i < gradeBoxes.length; i++) {
    let g = gradeBoxes[i];
    let isWinner = (animMode === 'done' && resultGrade === g.grade);
    drawGradeBox(g.x, g.y, g.grade, g.color, isWinner);
  }

  // Draw print box
  if (printBox) {
    let showResult = animMode === 'done';
    stroke(100);
    strokeWeight(2);
    fill(showResult ? [220, 240, 255] : 255);
    rectMode(CENTER);
    rect(printBox.x, printBox.y, 140, boxH, 8);
    rectMode(CORNER);
    noStroke();
    fill(40);
    textAlign(CENTER, CENTER);
    textSize(12);
    if (showResult) {
      text('Grade: ' + resultGrade, printBox.x, printBox.y);
    } else {
      text('print(grade)', printBox.x, printBox.y);
    }
  }

  // Python code panel on right
  drawCodePanel();

  // Control area labels
  noStroke();
  fill(80);
  textAlign(LEFT, CENTER);
  textSize(12);
  text('Score:', 10, drawHeight + 8);
}

function getNodeState(decisionIndex) {
  if (animMode === 'idle') return 'neutral';
  if (decisionIndex < currentStep) return stepResults[decisionIndex] ? 'true' : 'false';
  if (decisionIndex === currentStep) {
    if (animMode === 'stepping') return 'active';
    return stepResults[decisionIndex] ? 'true' : 'false';
  }
  return 'neutral';
}

function drawDiamond(x, y, label, state) {
  let col;
  if (state === 'true') col = [46, 180, 67, 200];
  else if (state === 'false') col = [220, 60, 60, 200];
  else if (state === 'active') col = [255, 220, 50, 220];
  else col = [255, 255, 255, 230];

  stroke(state === 'active' ? [200, 180, 0] : 120);
  strokeWeight(state === 'active' ? 3 : 2);
  fill(col);
  push();
  translate(x, y);
  beginShape();
  vertex(0, -diaW / 2);
  vertex(diaW / 2, 0);
  vertex(0, diaW / 2);
  vertex(-diaW / 2, 0);
  endShape(CLOSE);
  pop();

  noStroke();
  fill(40);
  textAlign(CENTER, CENTER);
  textSize(10);
  text(label, x, y);
}

function drawGradeBox(x, y, grade, col, isWinner) {
  stroke(col[0], col[1], col[2]);
  strokeWeight(isWinner ? 4 : 2);
  fill(isWinner ? [col[0], col[1], col[2], 60] : [255, 255, 255, 230]);
  rectMode(CENTER);
  rect(x, y, 60, boxH, 8);
  rectMode(CORNER);

  noStroke();
  fill(isWinner ? col : [80, 80, 80]);
  textAlign(CENTER, CENTER);
  textSize(isWinner ? 18 : 14);
  textStyle(isWinner ? BOLD : NORMAL);
  text('grade = "' + grade + '"', x, y);
  textStyle(NORMAL);
}

function drawFlowchartEdges() {
  stroke(150);
  strokeWeight(1.5);

  for (let i = 0; i < decisions.length; i++) {
    let d = decisions[i];
    let g = gradeBoxes[i];

    // Yes arrow -> grade box (right)
    let edgeState = getEdgeState(i, true);
    stroke(edgeState === 'active' ? [46, 180, 67] : 150);
    strokeWeight(edgeState === 'active' ? 3 : 1.5);
    line(d.x + diaW / 2, d.y, g.x - 30, g.y);
    // T label
    noStroke();
    fill(edgeState === 'active' ? [46, 180, 67] : [100, 100, 100]);
    textSize(10);
    textAlign(CENTER, CENTER);
    text('T', d.x + diaW / 2 + 12, d.y - 10);

    // No arrow -> next decision (down)
    if (i < decisions.length - 1) {
      let edgeStateF = getEdgeState(i, false);
      stroke(edgeStateF === 'active' ? [220, 60, 60] : 150);
      strokeWeight(edgeStateF === 'active' ? 3 : 1.5);
      line(d.x, d.y + diaW / 2, decisions[i + 1].x, decisions[i + 1].y - diaW / 2);
      noStroke();
      fill(edgeStateF === 'active' ? [220, 60, 60] : [100, 100, 100]);
      textSize(10);
      text('F', d.x - 14, d.y + diaW / 2 + 10);
    } else {
      // Last decision False -> F grade
      let edgeStateF = getEdgeState(i, false);
      stroke(edgeStateF === 'active' ? [220, 60, 60] : 150);
      strokeWeight(edgeStateF === 'active' ? 3 : 1.5);
      let fBox = gradeBoxes[4];
      line(d.x, d.y + diaW / 2, fBox.x, fBox.y - boxH / 2);
      noStroke();
      fill(edgeStateF === 'active' ? [220, 60, 60] : [100, 100, 100]);
      textSize(10);
      text('F', d.x - 14, d.y + diaW / 2 + 10);
    }
  }

  // Grade boxes to print box
  stroke(150);
  strokeWeight(1);
  for (let i = 0; i < gradeBoxes.length; i++) {
    let g = gradeBoxes[i];
    if (animMode === 'done' && resultGrade === g.grade) {
      stroke(g.color[0], g.color[1], g.color[2]);
      strokeWeight(2);
    } else {
      stroke(200);
      strokeWeight(1);
    }
    line(g.x, g.y + boxH / 2, printBox.x, printBox.y - boxH / 2);
  }
}

function getEdgeState(decisionIndex, isTrueBranch) {
  if (animMode === 'idle') return 'neutral';
  if (decisionIndex >= stepResults.length) return 'neutral';

  let result = stepResults[decisionIndex];
  if (isTrueBranch && result) return 'active';
  if (!isTrueBranch && !result) return 'active';
  return 'neutral';
}

function drawCodePanel() {
  let panelX = canvasWidth - 185;
  let panelY = 55;
  let panelW = 170;
  let panelH = 165;

  fill(248, 248, 252);
  stroke(200);
  strokeWeight(1);
  rect(panelX, panelY, panelW, panelH, 6);

  noStroke();
  fill(80);
  textAlign(LEFT, TOP);
  textSize(10);
  textStyle(BOLD);
  text('Python Code:', panelX + 8, panelY + 6);
  textStyle(NORMAL);

  let lines = [
    'score = ' + traceScore,
    '',
    'if score >= 90:',
    '    grade = "A"',
    'elif score >= 80:',
    '    grade = "B"',
    'elif score >= 70:',
    '    grade = "C"',
    'elif score >= 60:',
    '    grade = "D"',
    'else:',
    '    grade = "F"',
    '',
    'print(grade)',
  ];

  let highlightLine = getHighlightLine();

  textFont('monospace');
  textSize(10);
  let ly = panelY + 22;
  for (let i = 0; i < lines.length; i++) {
    if (i === highlightLine) {
      fill(255, 255, 100, 180);
      noStroke();
      rect(panelX + 4, ly - 2, panelW - 8, 13, 2);
      fill(0, 0, 150);
    } else {
      fill(60);
    }
    noStroke();
    text(lines[i], panelX + 8, ly);
    ly += 12;
  }
  textFont('Arial');
}

function getHighlightLine() {
  if (animMode === 'idle') return -1;
  if (animMode === 'done') return 13; // print line

  // Map currentStep to code line
  if (currentStep === 0) return 2;  // if score >= 90
  if (currentStep === 1) return 4;  // elif score >= 80
  if (currentStep === 2) return 6;  // elif score >= 70
  if (currentStep === 3) return 8;  // elif score >= 60

  return -1;
}

function startTrace() {
  let val = parseInt(scoreInput.value());
  if (isNaN(val)) val = 0;
  if (val < 0) val = 0;
  if (val > 100) val = 100;
  traceScore = val;
  currentStep = 0;
  stepResults = [];
  resultGrade = '';
  animMode = 'stepping';
  evaluateStep();
}

function evaluateStep() {
  if (currentStep >= decisions.length) {
    // All false -> F
    resultGrade = 'F';
    animMode = 'done';
    return;
  }

  let passed = traceScore >= decisions[currentStep].threshold;
  stepResults.push(passed);

  if (passed) {
    resultGrade = gradeBoxes[currentStep].grade;
    animMode = 'done';
  }
}

function nextStep() {
  if (animMode === 'idle') {
    startTrace();
    return;
  }
  if (animMode === 'done') return;

  currentStep++;
  evaluateStep();
}

function resetTrace() {
  currentStep = -1;
  stepResults = [];
  resultGrade = '';
  animMode = 'idle';
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
