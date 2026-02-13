// Fibonacci Recursion Tree MicroSim
// Trace Fibonacci recursion, identify redundant calculations, compare call counts
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 400;
let drawHeight = 500;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;

// Controls
let nSlider, speedSlider;
let stepButton, autoButton, resetButton;
let redundancyCheckbox;

// Tree data
let treeRoot = null;
let allNodes = [];       // Flattened list in DFS (pre-order) traversal
let revealedCount = 0;   // How many nodes have been revealed so far
let autoPlay = false;
let autoTimer = 0;

// Animation
let nodeAnimations = [];  // Track pop-in progress per node index

// Colors
const COLOR_REGULAR = [70, 130, 220];
const COLOR_BASE = [46, 160, 67];
const COLOR_REDUNDANT = [220, 60, 60];
const COLOR_GOLD = [255, 215, 0];

// Layout cache
let layoutComputed = false;
let lastN = -1;
let lastCanvasWidth = -1;
let treeOffsetX = 0;
let treeOffsetY = 0;
let treeScale = 1;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  // Slider for n (1 to 8)
  nSlider = createSlider(1, 8, 5, 1);
  nSlider.position(10, drawHeight + 16);
  nSlider.size(80);
  nSlider.input(onNChanged);

  stepButton = createButton('Step');
  stepButton.position(130, drawHeight + 12);
  stepButton.mousePressed(doStep);

  autoButton = createButton('Auto Play');
  autoButton.position(182, drawHeight + 12);
  autoButton.mousePressed(toggleAuto);

  resetButton = createButton('Reset');
  resetButton.position(262, drawHeight + 12);
  resetButton.mousePressed(doReset);

  redundancyCheckbox = createCheckbox('Redundancy', false);
  redundancyCheckbox.position(320, drawHeight + 14);
  redundancyCheckbox.style('font-size', '12px');
  redundancyCheckbox.style('font-family', 'Arial, sans-serif');

  speedSlider = createSlider(0.5, 4, 1.5, 0.1);
  speedSlider.position(canvasWidth - 110, drawHeight + 16);
  speedSlider.size(70);

  buildTree(nSlider.value());

  describe('Interactive Fibonacci recursion tree showing all recursive calls with redundant calculations highlighted and step-through animation.', LABEL);
}

function draw() {
  updateCanvasSize();

  // Draw area background
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  // Control area background
  fill('white');
  noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(16);
  textStyle(BOLD);
  text('Fibonacci Recursion Tree', canvasWidth / 2, 6);
  textStyle(NORMAL);

  // Control labels
  noStroke();
  fill(80);
  textAlign(LEFT, CENTER);
  textSize(11);
  text('n=' + nSlider.value(), 92, drawHeight + 25);
  text('Speed:', canvasWidth - 150, drawHeight + 25);

  // Draw tree or prompt
  if (treeRoot && revealedCount > 0) {
    drawTree();
  } else {
    fill(150);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(13);
    text('Click "Step" or "Auto Play" to begin', canvasWidth / 2, 220);
  }

  // Draw statistics panel
  drawStats();

  // Update pop-in animations
  updateAnimations();

  // Auto play logic
  if (autoPlay && revealedCount < allNodes.length) {
    autoTimer += deltaTime;
    let delay = 800 / speedSlider.value();
    if (autoTimer > delay) {
      autoTimer = 0;
      doStep();
    }
  }
  if (autoPlay && revealedCount >= allNodes.length) {
    autoPlay = false;
    autoButton.html('Auto Play');
  }
}

// ===================== TREE BUILDING =====================

function buildTree(n) {
  allNodes = [];
  revealedCount = 0;
  nodeAnimations = [];
  layoutComputed = false;
  lastN = n;
  lastCanvasWidth = -1; // Force layout recompute
  treeRoot = buildFibNode(n, 0);
  assignDFSOrder(treeRoot);
  computeLayout();
}

function buildFibNode(n, depth) {
  let node = {
    n: n,
    depth: depth,
    left: null,
    right: null,
    value: null,
    x: 0,
    y: 0,
    subtreeWidth: 0,
    dfsIndex: -1,
  };

  if (n <= 1) {
    node.value = n;
    node.subtreeWidth = 1;
  } else {
    node.left = buildFibNode(n - 1, depth + 1);
    node.right = buildFibNode(n - 2, depth + 1);
    node.value = node.left.value + node.right.value;
    node.subtreeWidth = node.left.subtreeWidth + node.right.subtreeWidth;
  }

  return node;
}

function assignDFSOrder(node) {
  if (!node) return;
  node.dfsIndex = allNodes.length;
  allNodes.push(node);
  assignDFSOrder(node.left);
  assignDFSOrder(node.right);
}

// ===================== LAYOUT =====================

function computeLayout() {
  if (!treeRoot) return;

  let maxDepth = getMaxDepth(treeRoot);
  let totalLeaves = treeRoot.subtreeWidth;

  // Available drawing region for the tree
  let treeAreaTop = 28;
  let treeAreaBottom = drawHeight - 90;
  let treeAreaHeight = treeAreaBottom - treeAreaTop;
  let treeAreaWidth = canvasWidth - margin * 2;

  // Horizontal spacing between leaf positions
  let hSpacing = treeAreaWidth / Math.max(totalLeaves, 1);

  // Vertical spacing between depth levels
  let vSpacing = treeAreaHeight / Math.max(maxDepth + 1, 1);
  vSpacing = Math.min(vSpacing, 70);

  // Assign positions using leaf-counter approach (prevents overlap)
  let leafCounter = { count: 0 };
  assignPositions(treeRoot, leafCounter, hSpacing, vSpacing);

  // Center the tree horizontally in the canvas
  let bounds = getTreeBounds(treeRoot);
  let treeCenterX = (bounds.minX + bounds.maxX) / 2;
  treeOffsetX = canvasWidth / 2 - treeCenterX;
  treeOffsetY = treeAreaTop + 20;

  // Scale down if tree is wider than canvas
  let treeW = bounds.maxX - bounds.minX;
  treeScale = 1;
  if (treeW + 60 > canvasWidth) {
    treeScale = (canvasWidth - 60) / treeW;
    treeOffsetX = canvasWidth / 2 - treeCenterX * treeScale;
  }

  lastCanvasWidth = canvasWidth;
  layoutComputed = true;
}

function assignPositions(node, leafCounter, hSpacing, vSpacing) {
  if (!node) return;

  if (!node.left && !node.right) {
    // Leaf: place at next available horizontal slot
    node.x = leafCounter.count * hSpacing;
    node.y = node.depth * vSpacing;
    leafCounter.count++;
  } else {
    // Internal node: position children first, then center above them
    assignPositions(node.left, leafCounter, hSpacing, vSpacing);
    assignPositions(node.right, leafCounter, hSpacing, vSpacing);

    let leftX = node.left ? node.left.x : 0;
    let rightX = node.right ? node.right.x : leftX;
    node.x = (leftX + rightX) / 2;
    node.y = node.depth * vSpacing;
  }
}

function getMaxDepth(node) {
  if (!node) return -1;
  return Math.max(getMaxDepth(node.left), getMaxDepth(node.right)) + 1;
}

function getTreeBounds(node) {
  if (!node) return { minX: Infinity, maxX: -Infinity };
  let left = getTreeBounds(node.left);
  let right = getTreeBounds(node.right);
  return {
    minX: Math.min(node.x, left.minX, right.minX),
    maxX: Math.max(node.x, left.maxX, right.maxX),
  };
}

// ===================== DRAWING =====================

function drawTree() {
  push();
  translate(treeOffsetX, treeOffsetY);
  scale(treeScale);

  // Count calls per fib(n) value for redundancy detection
  let callCounts = {};
  let showRedundancy = redundancyCheckbox.checked();
  for (let i = 0; i < revealedCount; i++) {
    let key = allNodes[i].n;
    callCounts[key] = (callCounts[key] || 0) + 1;
  }

  let nodeRadius = getNodeRadius();

  // First pass: draw edges (behind nodes)
  for (let i = 0; i < revealedCount; i++) {
    drawEdges(allNodes[i]);
  }

  // Second pass: draw nodes (on top of edges)
  for (let i = 0; i < revealedCount; i++) {
    let node = allNodes[i];
    let isRedundant = showRedundancy && callCounts[node.n] > 1;
    let animScale = getAnimScale(i);
    drawNode(node, isRedundant, nodeRadius, animScale);
  }

  pop();
}

function getNodeRadius() {
  let n = nSlider.value();
  if (n <= 3) return 22;
  if (n <= 5) return 18;
  if (n <= 6) return 15;
  if (n <= 7) return 13;
  return 11;
}

function drawEdges(node) {
  stroke(170);
  strokeWeight(Math.max(1, 1.5 / treeScale));
  if (node.left && node.left.dfsIndex < revealedCount) {
    line(node.x, node.y, node.left.x, node.left.y);
  }
  if (node.right && node.right.dfsIndex < revealedCount) {
    line(node.x, node.y, node.right.x, node.right.y);
  }
}

function drawNode(node, isRedundant, radius, animScale) {
  if (animScale <= 0.01) return;

  push();
  translate(node.x, node.y);
  scale(animScale);

  let isBase = (node.n <= 1);

  // Pick color
  let col;
  if (isRedundant) {
    col = COLOR_REDUNDANT;
  } else if (isBase) {
    col = COLOR_BASE;
  } else {
    col = COLOR_REGULAR;
  }

  // Draw circle
  fill(col[0], col[1], col[2]);
  stroke(255);
  strokeWeight(2);
  circle(0, 0, radius * 2);

  // Label: fib(n)
  fill(255);
  noStroke();
  textAlign(CENTER, CENTER);
  let labelSize = Math.max(8, Math.min(12, radius * 0.65));
  textSize(labelSize);
  textStyle(BOLD);
  text('fib(' + node.n + ')', 0, -3);

  // Show return value once all descendants are revealed
  if (isSubtreeFullyRevealed(node)) {
    fill(COLOR_GOLD[0], COLOR_GOLD[1], COLOR_GOLD[2]);
    textSize(Math.max(7, labelSize - 1));
    text('= ' + node.value, 0, labelSize - 2);
  }

  textStyle(NORMAL);
  pop();
}

function isSubtreeFullyRevealed(node) {
  // Base cases always show their value once revealed
  if (node.n <= 1) return true;
  if (!node.left || !node.right) return true;

  // Both children must be revealed
  if (node.left.dfsIndex >= revealedCount) return false;
  if (node.right.dfsIndex >= revealedCount) return false;

  // Recursively check descendants
  return isSubtreeFullyRevealed(node.left) && isSubtreeFullyRevealed(node.right);
}

// ===================== STATISTICS PANEL =====================

function drawStats() {
  let panelY = drawHeight - 82;
  let panelH = 70;
  let panelW = canvasWidth - margin * 2;

  // Background
  fill(248, 248, 252);
  stroke(200);
  strokeWeight(1);
  rect(margin, panelY, panelW, panelH, 8);

  if (revealedCount === 0) {
    noStroke();
    fill(150);
    textAlign(CENTER, CENTER);
    textSize(12);
    text('Statistics will appear as you step through the tree', canvasWidth / 2, panelY + panelH / 2);
    return;
  }

  // Compute statistics
  let callCounts = {};
  for (let i = 0; i < revealedCount; i++) {
    let key = allNodes[i].n;
    callCounts[key] = (callCounts[key] || 0) + 1;
  }

  let totalCalls = revealedCount;
  let uniqueSubproblems = Object.keys(callCounts).length;
  let redundantCalls = totalCalls - uniqueSubproblems;
  let redundantPercent = totalCalls > 0 ? Math.round((redundantCalls / totalCalls) * 100) : 0;

  noStroke();
  textSize(12);

  // Use thirds for layout columns
  let third = panelW / 3;
  let x1 = margin + 12;
  let x2 = margin + third + 8;
  let x3 = margin + third * 2 + 4;
  let rowY = panelY + 12;
  let row2Y = panelY + 32;

  // Total function calls
  fill(80);
  textAlign(LEFT, TOP);
  textStyle(NORMAL);
  text('Total calls:', x1, rowY);
  fill(COLOR_REGULAR[0], COLOR_REGULAR[1], COLOR_REGULAR[2]);
  textStyle(BOLD);
  text(totalCalls + ' / ' + allNodes.length, x1, row2Y);

  // Unique subproblems
  fill(80);
  textStyle(NORMAL);
  text('Unique subproblems:', x2, rowY);
  fill(COLOR_BASE[0], COLOR_BASE[1], COLOR_BASE[2]);
  textStyle(BOLD);
  text('' + uniqueSubproblems, x2, row2Y);

  // Redundant calls
  fill(80);
  textStyle(NORMAL);
  text('Redundant calls:', x3, rowY);
  fill(COLOR_REDUNDANT[0], COLOR_REDUNDANT[1], COLOR_REDUNDANT[2]);
  textStyle(BOLD);
  text(redundantCalls + ' (' + redundantPercent + '%)', x3, row2Y);

  // Bottom row: result and progress bar
  let bottomY = panelY + 52;
  fill(80);
  textStyle(NORMAL);
  textSize(11);
  textAlign(LEFT, TOP);
  text('fib(' + nSlider.value() + ') = ' + treeRoot.value, x1, bottomY);

  // Progress bar
  let barX = x2;
  let barW = panelW - (barX - margin) - 12;
  let barH = 10;
  fill(225);
  noStroke();
  rect(barX, bottomY + 2, barW, barH, 4);
  let progress = revealedCount / allNodes.length;
  fill(70, 130, 220);
  rect(barX, bottomY + 2, barW * progress, barH, 4);

  // Progress text on bar
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(8);
  textStyle(BOLD);
  if (barW * progress > 30) {
    text(Math.round(progress * 100) + '%', barX + barW * progress / 2, bottomY + 7);
  }

  textStyle(NORMAL);
}

// ===================== ANIMATION =====================

function getAnimScale(nodeIndex) {
  if (nodeIndex >= nodeAnimations.length) return 1;
  let t = nodeAnimations[nodeIndex];
  if (t >= 1) return 1;
  if (t <= 0) return 0.01;

  // Smooth elastic ease-out for a gentle pop-in
  let p = 0.5;
  return pow(2, -8 * t) * sin((t - p / 4) * (TWO_PI) / p) + 1;
}

function updateAnimations() {
  let speed = 0.04 * speedSlider.value();
  for (let i = 0; i < nodeAnimations.length; i++) {
    if (nodeAnimations[i] < 1) {
      nodeAnimations[i] += speed;
      if (nodeAnimations[i] > 1) nodeAnimations[i] = 1;
    }
  }
}

// ===================== CONTROLS =====================

function onNChanged() {
  let n = nSlider.value();
  if (n !== lastN) {
    buildTree(n);
    autoPlay = false;
    autoButton.html('Auto Play');
  }
}

function doStep() {
  if (revealedCount < allNodes.length) {
    // Ensure animation array is sized
    while (nodeAnimations.length <= revealedCount) {
      nodeAnimations.push(-0.1);
    }
    nodeAnimations[revealedCount] = 0;
    revealedCount++;
  }
}

function toggleAuto() {
  autoPlay = !autoPlay;
  autoTimer = 0;
  autoButton.html(autoPlay ? 'Pause' : 'Auto Play');
  if (autoPlay && revealedCount >= allNodes.length) {
    doReset();
  }
}

function doReset() {
  revealedCount = 0;
  nodeAnimations = [];
  autoPlay = false;
  autoTimer = 0;
  autoButton.html('Auto Play');
}

// ===================== RESIZE =====================

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  computeLayout();
  speedSlider.position(canvasWidth - 110, drawHeight + 16);
}

function updateCanvasSize() {
  const mainEl = document.querySelector('main');
  canvasWidth = mainEl.clientWidth;
  canvasHeight = drawHeight + controlHeight;

  // Only recompute layout when width actually changes
  if (canvasWidth !== lastCanvasWidth && layoutComputed && treeRoot) {
    computeLayout();
  }
}
