// Try-Except-Finally Flow Chart - Animated Execution Path
// Trace execution through try-except-else-finally blocks
// Understand (L2): trace, explain
// MicroSim template version 2026.02

let canvasWidth = 400;
let drawHeight = 520;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 15;
let defaultTextSize = 16;

// Flowchart nodes
const NODE_DEFS = [
  { id: 'start',     label: 'Start',             type: 'terminal', color: [100, 100, 100] },
  { id: 'try',       label: 'try block',         type: 'process',  color: [70, 130, 220] },
  { id: 'decision',  label: 'Exception?',        type: 'diamond',  color: [180, 130, 0] },
  { id: 'except',    label: 'except block',      type: 'process',  color: [200, 60, 60] },
  { id: 'else',      label: 'else block',        type: 'process',  color: [34, 139, 34] },
  { id: 'finally',   label: 'finally block',     type: 'process',  color: [138, 43, 226] },
  { id: 'end',       label: 'End',               type: 'terminal', color: [100, 100, 100] }
];

// Paths
const PATH_SUCCESS = ['start', 'try', 'decision', 'else', 'finally', 'end'];
const PATH_ERROR   = ['start', 'try', 'decision', 'except', 'finally', 'end'];

// Step descriptions
const STEP_DESC = {
  success: {
    start:    'Program begins execution.',
    try:      'Python enters the try block and runs the code inside.',
    decision: 'No exception was raised! Python skips except.',
    else:     'Since no exception occurred, the else block runs.',
    finally:  'The finally block ALWAYS runs, regardless of what happened.',
    end:      'Program continues normally after the try-except structure.'
  },
  error: {
    start:    'Program begins execution.',
    try:      'Python enters the try block... an exception is raised!',
    decision: 'An exception occurred! Python looks for a matching except.',
    except:   'The matching except block handles the error.',
    finally:  'The finally block ALWAYS runs, even after an exception.',
    end:      'Program continues after handling the exception.'
  }
};

// Code panel
const CODE_LINES = [
  { text: 'try:',                       block: 'try' },
  { text: '    x = int(input_val)',      block: 'try' },
  { text: '    print(f"Got {x}")',       block: 'try' },
  { text: 'except ValueError:',         block: 'except' },
  { text: '    print("Bad value")',      block: 'except' },
  { text: 'else:',                       block: 'else' },
  { text: '    print("No errors!")',     block: 'else' },
  { text: 'finally:',                    block: 'finally' },
  { text: '    print("Done")',           block: 'finally' }
];

const CODE_HIGHLIGHT = {
  success: {
    start: [],
    try: [0, 1, 2],
    decision: [],
    else: [5, 6],
    finally: [7, 8],
    end: []
  },
  error: {
    start: [],
    try: [0, 1],
    decision: [],
    except: [3, 4],
    finally: [7, 8],
    end: []
  }
};

let nodePositions = {};
let currentPath = null; // 'success' or 'error'
let currentStep = -1;
let animating = false;

// Dot animation
let dotX = 0, dotY = 0;
let dotTargetX = 0, dotTargetY = 0;
let dotSpeed = 0.08;

// Buttons
let successBtn, errorBtn, stepBtn, resetBtn;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  successBtn = createButton('Simulate Success');
  successBtn.mousePressed(() => startSimulation('success'));

  errorBtn = createButton('Simulate Error');
  errorBtn.mousePressed(() => startSimulation('error'));

  stepBtn = createButton('Next Step');
  stepBtn.mousePressed(advanceStep);
  stepBtn.hide();

  resetBtn = createButton('Reset');
  resetBtn.mousePressed(resetSim);
  resetBtn.hide();

  describe('Try-Except-Finally flowchart. Click Simulate Success or Simulate Error to see how Python executes through try-except-else-finally blocks.', LABEL);
}

function startSimulation(mode) {
  currentPath = mode;
  currentStep = 0;
  animating = false;
  let path = (mode === 'success') ? PATH_SUCCESS : PATH_ERROR;
  let pos = nodePositions[path[0]];
  if (pos) { dotX = pos.x; dotY = pos.y; }
  successBtn.hide();
  errorBtn.hide();
  stepBtn.show();
  resetBtn.show();
}

function advanceStep() {
  let path = (currentPath === 'success') ? PATH_SUCCESS : PATH_ERROR;
  if (currentStep < path.length - 1) {
    currentStep++;
    let pos = nodePositions[path[currentStep]];
    if (pos) {
      dotTargetX = pos.x;
      dotTargetY = pos.y;
      animating = true;
    }
  }
}

function resetSim() {
  currentPath = null;
  currentStep = -1;
  animating = false;
  stepBtn.hide();
  resetBtn.hide();
  successBtn.show();
  errorBtn.show();
}

function draw() {
  updateCanvasSize();

  // Drawing area
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  // Control area
  fill('white');
  noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(18);
  text('Try-Except-Finally Flow', canvasWidth / 2, 6);

  // Calculate positions
  calculatePositions();

  // Flowchart area (left side)
  let flowW = canvasWidth * 0.55;

  // Draw edges
  drawEdges(flowW);

  // Draw nodes
  for (let nd of NODE_DEFS) {
    drawNode(nd, flowW);
  }

  // Animate dot
  if (animating) {
    dotX = lerp(dotX, dotTargetX, dotSpeed);
    dotY = lerp(dotY, dotTargetY, dotSpeed);
    if (dist(dotX, dotY, dotTargetX, dotTargetY) < 2) {
      dotX = dotTargetX;
      dotY = dotTargetY;
      animating = false;
    }
  }

  // Draw dot
  if (currentPath && currentStep >= 0) {
    fill(255, 200, 0);
    stroke(200, 150, 0);
    strokeWeight(2);
    ellipse(dotX, dotY, 16, 16);
  }

  // Code panel (right side)
  drawCodePanel(flowW);

  // Step description
  if (currentPath && currentStep >= 0) {
    drawStepDescription();
  }

  // Instruction text
  if (!currentPath) {
    fill(100);
    noStroke();
    textAlign(CENTER, BOTTOM);
    textSize(12);
    text('Choose a simulation to trace the execution path.', canvasWidth / 2, drawHeight - 8);
  }

  // Position buttons
  let btnY = drawHeight + 14;
  if (!currentPath) {
    successBtn.position(canvasWidth * 0.2 - 55, btnY);
    errorBtn.position(canvasWidth * 0.7 - 50, btnY);
  } else {
    stepBtn.position(canvasWidth * 0.35 - 35, btnY);
    resetBtn.position(canvasWidth * 0.65 - 25, btnY);
  }
}

function calculatePositions() {
  let flowW = canvasWidth * 0.55;
  let cx = flowW / 2;
  let startY = 45;
  let gap = 62;

  nodePositions['start']    = { x: cx, y: startY };
  nodePositions['try']      = { x: cx, y: startY + gap };
  nodePositions['decision'] = { x: cx, y: startY + gap * 2 };
  nodePositions['except']   = { x: cx - flowW * 0.28, y: startY + gap * 3 };
  nodePositions['else']     = { x: cx + flowW * 0.28, y: startY + gap * 3 };
  nodePositions['finally']  = { x: cx, y: startY + gap * 4 };
  nodePositions['end']      = { x: cx, y: startY + gap * 5 };
}

function drawEdges(flowW) {
  let activeNodes = getActiveNodes();

  // Define edges
  let edges = [
    { from: 'start', to: 'try', label: '' },
    { from: 'try', to: 'decision', label: '' },
    { from: 'decision', to: 'except', label: 'Yes' },
    { from: 'decision', to: 'else', label: 'No' },
    { from: 'except', to: 'finally', label: '' },
    { from: 'else', to: 'finally', label: '' },
    { from: 'finally', to: 'end', label: '' }
  ];

  for (let e of edges) {
    let from = nodePositions[e.from];
    let to = nodePositions[e.to];
    if (!from || !to) continue;

    let isActive = activeNodes.has(e.from) && activeNodes.has(e.to) &&
                   isEdgeInPath(e.from, e.to);

    if (isActive) {
      stroke(255, 180, 0);
      strokeWeight(3);
    } else if (currentPath) {
      stroke(210);
      strokeWeight(1);
    } else {
      stroke(160);
      strokeWeight(1.5);
    }

    line(from.x, from.y + 14, to.x, to.y - 14);

    // Arrow head
    let angle = atan2(to.y - from.y, to.x - from.x);
    let ax = to.x - 14 * cos(angle);
    let ay = to.y - 14 * sin(angle);
    push();
    translate(ax, ay);
    rotate(angle);
    if (isActive) {
      fill(255, 180, 0);
    } else if (currentPath) {
      fill(210);
    } else {
      fill(160);
    }
    noStroke();
    triangle(0, 0, -8, -4, -8, 4);
    pop();

    // Edge label
    if (e.label) {
      noStroke();
      let isActiveLabel = isActive;
      fill(isActiveLabel ? color(180, 120, 0) : color(140));
      textAlign(CENTER, CENTER);
      textSize(10);
      textStyle(BOLD);
      let mx = (from.x + to.x) / 2;
      let my = (from.y + to.y) / 2;
      let offsetX = (e.label === 'Yes') ? -14 : 14;
      text(e.label, mx + offsetX, my);
      textStyle(NORMAL);
    }
  }
}

function isEdgeInPath(from, to) {
  if (!currentPath) return false;
  let path = (currentPath === 'success') ? PATH_SUCCESS : PATH_ERROR;
  for (let i = 0; i < path.length - 1; i++) {
    if (path[i] === from && path[i + 1] === to && i + 1 <= currentStep) return true;
  }
  return false;
}

function getActiveNodes() {
  let active = new Set();
  if (!currentPath || currentStep < 0) return active;
  let path = (currentPath === 'success') ? PATH_SUCCESS : PATH_ERROR;
  for (let i = 0; i <= currentStep && i < path.length; i++) {
    active.add(path[i]);
  }
  return active;
}

function drawNode(nd, flowW) {
  let pos = nodePositions[nd.id];
  if (!pos) return;

  let activeNodes = getActiveNodes();
  let isActive = activeNodes.has(nd.id);
  let isCurrent = currentPath && currentStep >= 0 &&
                  ((currentPath === 'success' ? PATH_SUCCESS : PATH_ERROR)[currentStep] === nd.id);

  let w = 100;
  let h = 28;

  // Node shape
  if (isCurrent) {
    fill(nd.color[0], nd.color[1], nd.color[2]);
    stroke(nd.color[0] - 30, nd.color[1] - 30, nd.color[2] - 30);
    strokeWeight(3);
  } else if (isActive) {
    fill(nd.color[0] + 30, nd.color[1] + 30, nd.color[2] + 30);
    stroke(nd.color[0], nd.color[1], nd.color[2]);
    strokeWeight(2);
  } else if (currentPath) {
    fill(230);
    stroke(190);
    strokeWeight(1);
  } else {
    fill(255);
    stroke(nd.color[0], nd.color[1], nd.color[2]);
    strokeWeight(1.5);
  }

  if (nd.type === 'diamond') {
    w = 90;
    h = 36;
    push();
    translate(pos.x, pos.y);
    beginShape();
    vertex(0, -h / 2);
    vertex(w / 2, 0);
    vertex(0, h / 2);
    vertex(-w / 2, 0);
    endShape(CLOSE);
    pop();
  } else if (nd.type === 'terminal') {
    rect(pos.x - w / 2, pos.y - h / 2, w, h, h / 2);
  } else {
    rect(pos.x - w / 2, pos.y - h / 2, w, h, 6);
  }

  // Label
  noStroke();
  if (isCurrent || isActive) {
    fill(255);
  } else if (currentPath) {
    fill(160);
  } else {
    fill(nd.color[0], nd.color[1], nd.color[2]);
  }
  textAlign(CENTER, CENTER);
  textSize(12);
  textStyle(BOLD);
  text(nd.label, pos.x, pos.y);
  textStyle(NORMAL);
}

function drawCodePanel(flowW) {
  let panelX = flowW + 8;
  let panelW = canvasWidth - flowW - margin;
  let panelY = 35;
  let panelH = 190;

  // Panel background
  fill(40, 44, 52);
  stroke(60);
  strokeWeight(1);
  rect(panelX, panelY, panelW, panelH, 6);

  // Title
  noStroke();
  fill(160);
  textAlign(LEFT, TOP);
  textSize(10);
  textStyle(BOLD);
  text('Python Code', panelX + 8, panelY + 5);
  textStyle(NORMAL);

  // Code lines
  let lineH = 16;
  let codeY = panelY + 22;
  let activeLines = [];

  if (currentPath && currentStep >= 0) {
    let path = (currentPath === 'success') ? PATH_SUCCESS : PATH_ERROR;
    let nodeId = path[currentStep];
    activeLines = CODE_HIGHLIGHT[currentPath][nodeId] || [];
  }

  for (let i = 0; i < CODE_LINES.length; i++) {
    let ly = codeY + i * lineH;
    let cl = CODE_LINES[i];

    // Highlight background
    if (activeLines.includes(i)) {
      fill(80, 80, 40);
      noStroke();
      rect(panelX + 2, ly - 1, panelW - 4, lineH, 2);
    }

    // Get color for block
    noStroke();
    if (activeLines.includes(i)) {
      fill(255, 230, 100);
    } else {
      let blockNode = NODE_DEFS.find(n => n.id === cl.block);
      if (blockNode) {
        fill(blockNode.color[0] + 80, blockNode.color[1] + 80, blockNode.color[2] + 80, 160);
      } else {
        fill(180);
      }
    }

    textAlign(LEFT, TOP);
    textSize(10);
    textFont('monospace');
    text(cl.text, panelX + 8, ly);
    textFont('sans-serif');
  }

  // Input value indicator
  let inputY = panelY + panelH + 8;
  noStroke();
  fill(80);
  textAlign(LEFT, TOP);
  textSize(10);
  if (currentPath === 'success') {
    fill(34, 139, 34);
    text('input_val = "42"', panelX + 4, inputY);
  } else if (currentPath === 'error') {
    fill(200, 60, 60);
    text('input_val = "hello"', panelX + 4, inputY);
  } else {
    fill(120);
    text('Select a simulation', panelX + 4, inputY);
  }

  // Output panel
  let outY = inputY + 20;
  let outH = 80;
  fill(30, 34, 42);
  stroke(60);
  strokeWeight(1);
  rect(panelX, outY, panelW, outH, 6);

  noStroke();
  fill(140);
  textAlign(LEFT, TOP);
  textSize(10);
  textStyle(BOLD);
  text('Output:', panelX + 8, outY + 4);
  textStyle(NORMAL);

  // Show output so far
  if (currentPath && currentStep >= 0) {
    let path = (currentPath === 'success') ? PATH_SUCCESS : PATH_ERROR;
    let outputLines = [];
    for (let s = 0; s <= currentStep; s++) {
      let nodeId = path[s];
      let lines = getOutputForNode(nodeId);
      outputLines.push(...lines);
    }
    fill(180, 220, 180);
    textFont('monospace');
    textSize(10);
    for (let i = 0; i < outputLines.length; i++) {
      text(outputLines[i], panelX + 8, outY + 18 + i * 13);
    }
    textFont('sans-serif');
  }
}

function getOutputForNode(nodeId) {
  if (currentPath === 'success') {
    if (nodeId === 'try') return ['Got 42'];
    if (nodeId === 'else') return ['No errors!'];
    if (nodeId === 'finally') return ['Done'];
  } else {
    if (nodeId === 'except') return ['Bad value'];
    if (nodeId === 'finally') return ['Done'];
  }
  return [];
}

function drawStepDescription() {
  let path = (currentPath === 'success') ? PATH_SUCCESS : PATH_ERROR;
  let nodeId = path[currentStep];
  let descMap = STEP_DESC[currentPath];
  let desc = descMap[nodeId] || '';

  let boxY = drawHeight - 60;
  let boxW = canvasWidth - 2 * margin;
  let boxH = 50;

  // Background
  let nd = NODE_DEFS.find(n => n.id === nodeId);
  let bgColor = nd ? nd.color : [100, 100, 100];

  fill(bgColor[0], bgColor[1], bgColor[2], 30);
  stroke(bgColor[0], bgColor[1], bgColor[2]);
  strokeWeight(2);
  rect(margin, boxY, boxW, boxH, 6);

  noStroke();
  fill(bgColor[0], bgColor[1], bgColor[2]);
  textAlign(LEFT, TOP);
  textSize(12);
  textStyle(BOLD);
  let stepLabel = 'Step ' + (currentStep + 1) + ': ' + (nd ? nd.label : '');
  text(stepLabel, margin + 10, boxY + 6);
  textStyle(NORMAL);

  fill(50);
  textSize(11);
  text(desc, margin + 10, boxY + 24);

  // Progress dots
  let dotY2 = boxY + 42;
  for (let i = 0; i < path.length; i++) {
    if (i <= currentStep) {
      fill(bgColor[0], bgColor[1], bgColor[2]);
    } else {
      fill(200);
    }
    noStroke();
    ellipse(margin + boxW / 2 - (path.length * 10) / 2 + i * 10 + 5, dotY2, 6, 6);
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  canvasWidth = Math.floor(container.width);
}
