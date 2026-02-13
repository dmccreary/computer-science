// Shape Hierarchy with Abstract Base Class MicroSim
// Shows Shape ABC with concrete subclasses Circle, Rectangle, Triangle
// Students can try to instantiate the abstract class and see the error
// Click concrete shapes to enter dimensions and calculate area/perimeter
// MicroSim template version 2026.02

let canvasWidth = 400;
let drawHeight = 440;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

let selectedClass = null;
let mouseOverCanvas = false;
let pulsePhase = 0;

// Input controls
let input1, input1Label;
let input2, input2Label;
let createBtn;

// State
let resultMessage = '';
let resultColor;
let areaResult = '';
let perimResult = '';
let errorMessage = '';

// Class data
const classData = {
  'Shape': {
    color: [140, 140, 140],
    fill: [220, 220, 220],
    isAbstract: true,
    methods: [
      { name: 'area(self)', abstract: true },
      { name: 'perimeter(self)', abstract: true }
    ],
    inputs: []
  },
  'Circle': {
    color: [65, 105, 225],
    fill: [173, 198, 255],
    isAbstract: false,
    methods: [
      { name: '__init__(self, radius)', abstract: false },
      { name: 'area(self)', abstract: false },
      { name: 'perimeter(self)', abstract: false }
    ],
    inputs: [{ label: 'Radius:', default: '5' }]
  },
  'Rectangle': {
    color: [34, 139, 34],
    fill: [144, 238, 144],
    isAbstract: false,
    methods: [
      { name: '__init__(self, width, height)', abstract: false },
      { name: 'area(self)', abstract: false },
      { name: 'perimeter(self)', abstract: false }
    ],
    inputs: [{ label: 'Width:', default: '3' }, { label: 'Height:', default: '4' }]
  },
  'Triangle': {
    color: [220, 130, 0],
    fill: [255, 200, 130],
    isAbstract: false,
    methods: [
      { name: '__init__(self, base, height)', abstract: false },
      { name: 'area(self)', abstract: false },
      { name: 'perimeter(self)', abstract: false }
    ],
    inputs: [{ label: 'Base:', default: '6' }, { label: 'Height:', default: '4' }]
  }
};

const classNames = ['Shape', 'Circle', 'Rectangle', 'Triangle'];
let nodePositions = {};

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  canvas.mouseOver(() => mouseOverCanvas = true);
  canvas.mouseOut(() => mouseOverCanvas = false);

  // Control area inputs
  input1Label = createSpan('');
  input1Label.position(10, drawHeight + 15);
  input1Label.style('font-size', '14px');
  input1Label.style('font-family', 'Arial, sans-serif');

  input1 = createInput('5', 'number');
  input1.position(70, drawHeight + 10);
  input1.size(50);
  input1.input(calculate);

  input2Label = createSpan('');
  input2Label.position(140, drawHeight + 15);
  input2Label.style('font-size', '14px');
  input2Label.style('font-family', 'Arial, sans-serif');

  input2 = createInput('4', 'number');
  input2.position(200, drawHeight + 10);
  input2.size(50);
  input2.input(calculate);

  createBtn = createButton('Create Instance');
  createBtn.position(270, drawHeight + 10);
  createBtn.mousePressed(tryCreate);

  // Hide inputs initially
  hideInputs();

  describe('Interactive shape hierarchy diagram with abstract Shape class and concrete Circle, Rectangle, Triangle subclasses. Click classes to explore methods and create instances.', LABEL);
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
  rect(0, drawHeight, canvasWidth, controlHeight);

  if (mouseOverCanvas) {
    pulsePhase += 0.05;
  }

  // Calculate positions
  let treeX = canvasWidth * 0.3;
  let topY = 60;
  let childY = topY + 110;
  let spacing = canvasWidth * 0.2;

  nodePositions['Shape'] = { x: treeX, y: topY };
  nodePositions['Circle'] = { x: treeX - spacing, y: childY };
  nodePositions['Rectangle'] = { x: treeX, y: childY };
  nodePositions['Triangle'] = { x: treeX + spacing, y: childY };

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(20);
  text('Shape Hierarchy (Abstract Base Class)', canvasWidth * 0.38, 10);

  // Draw arrows
  drawArrows();

  // Draw nodes
  for (let name of classNames) {
    drawNode(name);
  }

  // Draw detail panel
  if (selectedClass) {
    drawDetailPanel();
  } else {
    fill(120);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(14);
    text('Click a class node to explore it', canvasWidth * 0.35, drawHeight - 80);
  }

  // Draw result/error messages
  if (errorMessage) {
    drawErrorBubble();
  }
  if (areaResult || perimResult) {
    drawResultBubble();
  }
}

function drawArrows() {
  let parent = nodePositions['Shape'];
  let nodeH = 44;

  stroke(100);
  strokeWeight(2);

  for (let name of ['Circle', 'Rectangle', 'Triangle']) {
    let child = nodePositions[name];
    line(child.x, child.y - nodeH / 2, parent.x, parent.y + nodeH / 2);

    // Hollow triangle arrowhead
    let angle = atan2(parent.y + nodeH / 2 - (child.y - nodeH / 2), parent.x - child.x);
    push();
    translate(parent.x, parent.y + nodeH / 2);
    rotate(angle);
    fill('white');
    stroke(100);
    strokeWeight(2);
    triangle(0, 0, -10, -5, -10, 5);
    pop();
  }
}

function drawNode(name) {
  let data = classData[name];
  let pos = nodePositions[name];
  let nodeW = 110;
  let nodeH = 44;

  let isHovered = mouseX > pos.x - nodeW / 2 && mouseX < pos.x + nodeW / 2 &&
                  mouseY > pos.y - nodeH / 2 && mouseY < pos.y + nodeH / 2;
  let isSelected = selectedClass === name;

  // Draw node
  if (data.isAbstract) {
    drawingContext.setLineDash([6, 4]);
  }

  if (isHovered) {
    let pulse = sin(pulsePhase) * 15;
    fill(data.fill[0] + pulse, data.fill[1] + pulse, data.fill[2] + pulse);
    stroke(data.color[0], data.color[1], data.color[2]);
    strokeWeight(3);
    cursor(HAND);
  } else if (isSelected) {
    fill(data.fill[0], data.fill[1], data.fill[2]);
    stroke(data.color[0], data.color[1], data.color[2]);
    strokeWeight(3);
  } else {
    fill(data.fill[0], data.fill[1], data.fill[2]);
    stroke(data.color[0], data.color[1], data.color[2]);
    strokeWeight(2);
  }

  rect(pos.x - nodeW / 2, pos.y - nodeH / 2, nodeW, nodeH, 8);
  drawingContext.setLineDash([]);

  // Label
  noStroke();
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(16);
  textStyle(BOLD);
  text(name, pos.x, pos.y - 6);
  textStyle(NORMAL);

  if (data.isAbstract) {
    textSize(11);
    fill(100);
    text('(abstract)', pos.x, pos.y + 12);
  }
}

function drawDetailPanel() {
  let data = classData[selectedClass];
  let panelX = canvasWidth * 0.58;
  let panelY = 180;
  let panelW = canvasWidth * 0.38;
  let panelH = 180;

  fill(255, 255, 255, 240);
  stroke(data.color[0], data.color[1], data.color[2]);
  strokeWeight(2);
  rect(panelX, panelY, panelW, panelH, 10);

  // Title
  noStroke();
  fill(data.color[0], data.color[1], data.color[2]);
  textAlign(CENTER, TOP);
  textSize(16);
  textStyle(BOLD);
  text(selectedClass, panelX + panelW / 2, panelY + 10);
  textStyle(NORMAL);

  // Separator
  stroke(200);
  strokeWeight(1);
  line(panelX + 10, panelY + 32, panelX + panelW - 10, panelY + 32);

  // Methods
  noStroke();
  fill(80);
  textAlign(LEFT, TOP);
  textSize(13);
  textStyle(BOLD);
  text('Methods:', panelX + 10, panelY + 38);
  textStyle(NORMAL);

  let yOff = panelY + 56;
  textSize(12);
  for (let m of data.methods) {
    if (m.abstract) {
      textStyle(ITALIC);
      fill(180, 0, 0);
      text(m.name + ' [abstract]', panelX + 15, yOff);
    } else {
      textStyle(NORMAL);
      fill(34, 100, 34);
      text(m.name, panelX + 15, yOff);
    }
    yOff += 18;
  }
  textStyle(NORMAL);

  // Type note
  yOff += 10;
  fill(100);
  textSize(11);
  if (data.isAbstract) {
    text('Cannot be instantiated directly', panelX + 15, yOff);
  } else {
    text('Concrete class - can create instances', panelX + 15, yOff);
  }
}

function drawErrorBubble() {
  let bubbleX = canvasWidth * 0.15;
  let bubbleY = drawHeight - 80;
  let bubbleW = canvasWidth * 0.5;
  let bubbleH = 50;

  fill(255, 220, 220, 240);
  stroke(200, 0, 0);
  strokeWeight(2);
  rect(bubbleX, bubbleY, bubbleW, bubbleH, 8);

  noStroke();
  fill(180, 0, 0);
  textAlign(CENTER, CENTER);
  textSize(12);
  textStyle(BOLD);
  text('TypeError:', bubbleX + bubbleW / 2, bubbleY + 14);
  textStyle(NORMAL);
  textSize(11);
  text(errorMessage, bubbleX + bubbleW / 2, bubbleY + 34);
}

function drawResultBubble() {
  let bubbleX = canvasWidth * 0.1;
  let bubbleY = drawHeight - 85;
  let bubbleW = canvasWidth * 0.45;
  let bubbleH = 60;

  fill(220, 255, 220, 240);
  stroke(0, 150, 0);
  strokeWeight(2);
  rect(bubbleX, bubbleY, bubbleW, bubbleH, 8);

  noStroke();
  fill(0, 100, 0);
  textAlign(LEFT, TOP);
  textSize(13);
  textStyle(BOLD);
  text(resultMessage, bubbleX + 10, bubbleY + 8);
  textStyle(NORMAL);
  textSize(12);
  text('Area: ' + areaResult, bubbleX + 10, bubbleY + 26);
  text('Perimeter: ' + perimResult, bubbleX + 10, bubbleY + 42);
}

function tryCreate() {
  errorMessage = '';
  areaResult = '';
  perimResult = '';
  resultMessage = '';

  if (!selectedClass) return;

  if (selectedClass === 'Shape') {
    errorMessage = "Can't instantiate abstract class Shape";
    return;
  }

  calculate();
}

function calculate() {
  if (!selectedClass || selectedClass === 'Shape') return;

  errorMessage = '';
  let v1 = parseFloat(input1.value()) || 0;
  let v2 = parseFloat(input2.value()) || 0;

  if (selectedClass === 'Circle') {
    let area = Math.PI * v1 * v1;
    let perim = 2 * Math.PI * v1;
    resultMessage = 'Circle(radius=' + v1 + ')';
    areaResult = area.toFixed(2);
    perimResult = perim.toFixed(2);
  } else if (selectedClass === 'Rectangle') {
    let area = v1 * v2;
    let perim = 2 * (v1 + v2);
    resultMessage = 'Rectangle(' + v1 + ', ' + v2 + ')';
    areaResult = area.toFixed(2);
    perimResult = perim.toFixed(2);
  } else if (selectedClass === 'Triangle') {
    let area = 0.5 * v1 * v2;
    // Approximate perimeter for right triangle
    let hyp = Math.sqrt(v1 * v1 + v2 * v2);
    let perim = v1 + v2 + hyp;
    resultMessage = 'Triangle(' + v1 + ', ' + v2 + ')';
    areaResult = area.toFixed(2);
    perimResult = perim.toFixed(2) + ' (right triangle)';
  }
}

function updateInputsForClass(name) {
  errorMessage = '';
  areaResult = '';
  perimResult = '';
  resultMessage = '';

  let data = classData[name];
  if (data.inputs.length === 0) {
    hideInputs();
    return;
  }

  input1Label.html(data.inputs[0].label);
  input1Label.show();
  input1.value(data.inputs[0].default);
  input1.show();

  if (data.inputs.length > 1) {
    input2Label.html(data.inputs[1].label);
    input2Label.show();
    input2.value(data.inputs[1].default);
    input2.show();
  } else {
    input2Label.hide();
    input2.hide();
  }

  createBtn.show();
}

function hideInputs() {
  input1Label.hide();
  input1.hide();
  input2Label.hide();
  input2.hide();
  createBtn.show();
}

function mousePressed() {
  for (let name of classNames) {
    let pos = nodePositions[name];
    let nodeW = 110;
    let nodeH = 44;
    if (mouseX > pos.x - nodeW / 2 && mouseX < pos.x + nodeW / 2 &&
        mouseY > pos.y - nodeH / 2 && mouseY < pos.y + nodeH / 2) {
      if (selectedClass === name) {
        selectedClass = null;
        hideInputs();
      } else {
        selectedClass = name;
        updateInputsForClass(name);
      }
      return;
    }
  }
  if (mouseY < drawHeight) {
    selectedClass = null;
    hideInputs();
    errorMessage = '';
    areaResult = '';
    perimResult = '';
    resultMessage = '';
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
