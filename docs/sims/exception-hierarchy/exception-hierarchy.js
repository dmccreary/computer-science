// Python Exception Hierarchy - Interactive Tree Diagram
// Shows built-in exception class hierarchy
// Hover for descriptions, click to highlight inheritance chain
// MicroSim template version 2026.02

let canvasWidth = 400;
let drawHeight = 460;
let controlHeight = 0;
let canvasHeight = drawHeight + controlHeight;
let margin = 10;
let defaultTextSize = 16;

let selectedNode = null;
let hoveredNode = null;

// Exception hierarchy data
const NODES = [
  { id: 'BaseException', parent: null, desc: 'The root of all exceptions. Rarely caught directly.', example: 'Not typically raised by user code', color: [140, 140, 140], branch: 'base' },
  { id: 'Exception', parent: 'BaseException', desc: 'Base class for all "regular" exceptions. Most except blocks catch this or its children.', example: 'except Exception as e:', color: [65, 105, 225], branch: 'exception' },
  { id: 'KeyboardInterrupt', parent: 'BaseException', desc: 'Raised when user presses Ctrl+C. Not a subclass of Exception!', example: 'User presses Ctrl+C during input()', color: [140, 140, 140], branch: 'base' },
  { id: 'SystemExit', parent: 'BaseException', desc: 'Raised by sys.exit(). Not a subclass of Exception!', example: 'import sys; sys.exit(0)', color: [140, 140, 140], branch: 'base' },
  { id: 'ArithmeticError', parent: 'Exception', desc: 'Base for math-related errors.', example: 'Parent of ZeroDivisionError, OverflowError', color: [200, 60, 60], branch: 'arithmetic' },
  { id: 'LookupError', parent: 'Exception', desc: 'Base for errors when a key or index is not found.', example: 'Parent of IndexError, KeyError', color: [220, 140, 0], branch: 'lookup' },
  { id: 'TypeError', parent: 'Exception', desc: 'Wrong data type for an operation.', example: '"hello" + 5', color: [138, 43, 226], branch: 'type' },
  { id: 'ValueError', parent: 'Exception', desc: 'Right type but wrong value.', example: 'int("hello")', color: [138, 43, 226], branch: 'type' },
  { id: 'OSError', parent: 'Exception', desc: 'Base for operating system errors (files, network, etc.).', example: 'Parent of FileNotFoundError', color: [34, 139, 34], branch: 'os' },
  { id: 'NameError', parent: 'Exception', desc: 'Variable name not found in scope.', example: 'print(undefined_var)', color: [100, 100, 180], branch: 'name' },
  { id: 'AttributeError', parent: 'Exception', desc: 'Object doesn\'t have the requested attribute or method.', example: '"hello".append("!")', color: [100, 100, 180], branch: 'name' },
  { id: 'ZeroDivisionError', parent: 'ArithmeticError', desc: 'Division or modulo by zero.', example: '10 / 0', color: [200, 60, 60], branch: 'arithmetic' },
  { id: 'OverflowError', parent: 'ArithmeticError', desc: 'Result of arithmetic too large to represent.', example: 'math.exp(1000)', color: [200, 60, 60], branch: 'arithmetic' },
  { id: 'IndexError', parent: 'LookupError', desc: 'List index out of range.', example: '[1,2,3][10]', color: [220, 140, 0], branch: 'lookup' },
  { id: 'KeyError', parent: 'LookupError', desc: 'Dictionary key not found.', example: '{}["missing"]', color: [220, 140, 0], branch: 'lookup' },
  { id: 'FileNotFoundError', parent: 'OSError', desc: 'File or directory not found.', example: 'open("nonexistent.txt")', color: [34, 139, 34], branch: 'os' }
];

// Layout positions (calculated dynamically)
let nodePositions = {};
let nodeW = 0;
let nodeH = 24;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  describe('Interactive Python exception hierarchy tree. Hover over exception names to see descriptions and examples. Click to highlight the inheritance chain.', LABEL);
}

function draw() {
  updateCanvasSize();

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, canvasHeight);

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(18);
  text('Python Exception Hierarchy', canvasWidth / 2, 6);

  // Calculate layout
  calculatePositions();

  // Draw connections first
  hoveredNode = null;
  drawConnections();

  // Draw nodes
  for (let node of NODES) {
    drawNode(node);
  }

  // Draw tooltip
  if (hoveredNode) {
    drawTooltip(hoveredNode);
  }

  // Info text at bottom
  if (!hoveredNode && !selectedNode) {
    fill(120);
    noStroke();
    textAlign(CENTER, BOTTOM);
    textSize(12);
    text('Hover for details. Click to highlight inheritance chain.', canvasWidth / 2, canvasHeight - 8);
  }

  if (selectedNode) {
    fill(80);
    noStroke();
    textAlign(CENTER, BOTTOM);
    textSize(11);
    text('Catching a parent also catches all its children!', canvasWidth / 2, canvasHeight - 8);
  }
}

function calculatePositions() {
  nodeW = Math.min(130, canvasWidth * 0.17);
  let smallNodeW = Math.min(120, canvasWidth * 0.15);

  // Level 0: BaseException
  nodePositions['BaseException'] = { x: canvasWidth / 2, y: 35 };

  // Level 1: Exception, KeyboardInterrupt, SystemExit
  let l1y = 85;
  nodePositions['Exception'] = { x: canvasWidth * 0.42, y: l1y };
  nodePositions['KeyboardInterrupt'] = { x: canvasWidth * 0.78, y: l1y };
  nodePositions['SystemExit'] = { x: canvasWidth * 0.92, y: l1y + 40 };

  // Level 2: Under Exception
  let l2y = 165;
  let l2Nodes = ['ArithmeticError', 'LookupError', 'TypeError', 'ValueError', 'OSError', 'NameError', 'AttributeError'];
  let l2Count = l2Nodes.length;
  let l2Spacing = (canvasWidth - 2 * margin) / (l2Count + 1);
  for (let i = 0; i < l2Count; i++) {
    nodePositions[l2Nodes[i]] = { x: margin + (i + 1) * l2Spacing, y: l2y };
  }

  // Level 3: Leaf exceptions
  let l3y = 260;
  // Under ArithmeticError
  let arithX = nodePositions['ArithmeticError'].x;
  nodePositions['ZeroDivisionError'] = { x: arithX - 35, y: l3y };
  nodePositions['OverflowError'] = { x: arithX + 35, y: l3y };

  // Under LookupError
  let lookupX = nodePositions['LookupError'].x;
  nodePositions['IndexError'] = { x: lookupX - 30, y: l3y };
  nodePositions['KeyError'] = { x: lookupX + 30, y: l3y };

  // Under OSError
  let osX = nodePositions['OSError'].x;
  nodePositions['FileNotFoundError'] = { x: osX, y: l3y };
}

function drawConnections() {
  for (let node of NODES) {
    if (!node.parent) continue;
    let child = nodePositions[node.id];
    let parent = nodePositions[node.parent];
    if (!child || !parent) continue;

    let isHighlighted = selectedNode && isInChain(node.id);

    if (isHighlighted) {
      stroke(node.color[0], node.color[1], node.color[2]);
      strokeWeight(3);
    } else {
      stroke(180);
      strokeWeight(1);
    }

    line(child.x, child.y - nodeH / 2, parent.x, parent.y + nodeH / 2);
  }
}

function drawNode(node) {
  let pos = nodePositions[node.id];
  if (!pos) return;

  let w = node.id.length * 7.5 + 16;
  w = Math.max(w, 60);
  let h = nodeH;

  // Check hover
  let isHovered = mouseX > pos.x - w / 2 && mouseX < pos.x + w / 2 &&
                  mouseY > pos.y - h / 2 && mouseY < pos.y + h / 2;
  let isHighlighted = selectedNode && isInChain(node.id);

  if (isHovered) {
    hoveredNode = node;
    cursor(HAND);
  }

  // Node style
  if (isHighlighted) {
    fill(node.color[0], node.color[1], node.color[2]);
    stroke(node.color[0] - 30, node.color[1] - 30, node.color[2] - 30);
    strokeWeight(2);
  } else if (isHovered) {
    fill(node.color[0] + 40, node.color[1] + 40, node.color[2] + 40);
    stroke(node.color[0], node.color[1], node.color[2]);
    strokeWeight(2);
  } else {
    fill(255);
    stroke(node.color[0], node.color[1], node.color[2]);
    strokeWeight(1.5);
  }

  rect(pos.x - w / 2, pos.y - h / 2, w, h, 12);

  // Text
  noStroke();
  if (isHighlighted) {
    fill(255);
  } else {
    fill(node.color[0] - 20, node.color[1] - 20, node.color[2] - 20);
  }
  textAlign(CENTER, CENTER);
  textSize(10);
  textStyle(BOLD);
  text(node.id, pos.x, pos.y);
  textStyle(NORMAL);
}

function drawTooltip(node) {
  let tw = Math.min(260, canvasWidth * 0.5);
  let th = 85;

  // Position tooltip below the tree
  let tx = canvasWidth / 2 - tw / 2;
  let ty = 300;

  // Shadow
  fill(0, 0, 0, 20);
  noStroke();
  rect(tx + 2, ty + 2, tw, th, 8);

  // Background
  fill(255, 255, 255, 248);
  stroke(node.color[0], node.color[1], node.color[2]);
  strokeWeight(2);
  rect(tx, ty, tw, th, 8);

  noStroke();
  textAlign(LEFT, TOP);

  // Exception name
  fill(node.color[0], node.color[1], node.color[2]);
  textSize(14);
  textStyle(BOLD);
  text(node.id, tx + 10, ty + 8);
  textStyle(NORMAL);

  // Description
  fill(50);
  textSize(11);
  drawWrappedText(node.desc, tx + 10, ty + 28, tw - 20);

  // Example
  fill(100);
  textSize(10);
  textStyle(ITALIC);
  text('Example: ' + node.example, tx + 10, ty + 65);
  textStyle(NORMAL);
}

function drawWrappedText(txt, x, y, maxW) {
  let words = txt.split(' ');
  let line = '';
  for (let w of words) {
    let test = line + (line ? ' ' : '') + w;
    if (textWidth(test) > maxW && line) {
      text(line, x, y);
      line = w;
      y += 15;
    } else {
      line = test;
    }
  }
  if (line) text(line, x, y);
}

function isInChain(nodeId) {
  // Check if nodeId is in the inheritance chain of selectedNode
  // Walk up from selectedNode to BaseException
  let current = selectedNode;
  while (current) {
    if (current === nodeId) return true;
    let nodeData = NODES.find(n => n.id === current);
    current = nodeData ? nodeData.parent : null;
  }
  return false;
}

function mousePressed() {
  for (let node of NODES) {
    let pos = nodePositions[node.id];
    if (!pos) continue;
    let w = node.id.length * 7.5 + 16;
    w = Math.max(w, 60);
    let h = nodeH;

    if (mouseX > pos.x - w / 2 && mouseX < pos.x + w / 2 &&
        mouseY > pos.y - h / 2 && mouseY < pos.y + h / 2) {
      selectedNode = (selectedNode === node.id) ? null : node.id;
      return;
    }
  }
  selectedNode = null;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  canvasWidth = Math.floor(container.width);
}
