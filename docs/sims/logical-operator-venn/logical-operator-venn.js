// Logical Operator Venn Diagrams MicroSim
// Bloom Level: Understand (L2) - illustrate, interpret
// Students visualize the behavior of and, or, and not operators using Venn diagrams.

let canvasWidth = 400;
let drawHeight = 420;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// Venn diagram geometry
let circleRadius = 80;
let circleOffsetX = 65; // how far left/right from center each circle sits
let circlesCenterY = 175;

// Current operator selection: 'and', 'or', 'notA', or null
let selectedOp = null;

// Toggle values for A and B
let valueA = false;
let valueB = false;

// DOM elements
let btnAnd, btnOr, btnNotA;
let checkA, checkB;

// Hover region tracking
let hoverRegion = 'none'; // 'onlyA', 'onlyB', 'intersection', 'outside'

function updateCanvasSize() {
  let mainEl = document.querySelector('main');
  if (mainEl) {
    canvasWidth = Math.min(mainEl.offsetWidth, 580);
  }
  if (canvasWidth < 320) canvasWidth = 320;
  // Scale circle geometry with canvas width
  circleRadius = canvasWidth * 0.16;
  circleOffsetX = canvasWidth * 0.13;
  canvasHeight = drawHeight + controlHeight;
}

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  let mainEl = document.querySelector('main');
  if (mainEl) {
    canvas.parent(mainEl);
  }
  textFont('Arial');

  // Create operator buttons
  btnAnd = createButton('A and B');
  btnAnd.mousePressed(() => selectOperator('and'));
  btnAnd.parent(mainEl);

  btnOr = createButton('A or B');
  btnOr.mousePressed(() => selectOperator('or'));
  btnOr.parent(mainEl);

  btnNotA = createButton('not A');
  btnNotA.mousePressed(() => selectOperator('notA'));
  btnNotA.parent(mainEl);

  // Create toggle checkboxes for A and B
  checkA = createCheckbox(' A = True', false);
  checkA.changed(() => { valueA = checkA.checked(); });
  checkA.parent(mainEl);

  checkB = createCheckbox(' B = True', false);
  checkB.changed(() => { valueB = checkB.checked(); });
  checkB.parent(mainEl);

  positionControls();

  describe('Interactive Venn diagram showing logical operators AND, OR, and NOT with two overlapping circles A and B.');
}

function positionControls() {
  let mainEl = document.querySelector('main');
  if (!mainEl) return;
  let canvasEl = mainEl.querySelector('canvas');
  if (!canvasEl) return;

  let canvasRect = canvasEl.getBoundingClientRect();
  let mainRect = mainEl.getBoundingClientRect();
  let offsetX = canvasRect.left - mainRect.left;
  let offsetY = canvasRect.top - mainRect.top;

  // Position buttons in a row below the Venn circles but within draw area
  let btnY = offsetY + drawHeight + 10;
  let btnSpacing = canvasWidth / 4;

  btnAnd.position(offsetX + btnSpacing * 0.5 - 30, btnY);
  btnOr.position(offsetX + btnSpacing * 1.7 - 30, btnY);
  btnNotA.position(offsetX + btnSpacing * 2.9 - 25, btnY);

  // Position checkboxes to the right of buttons
  let checkY = offsetY + drawHeight + 32;
  checkA.position(offsetX + 10, checkY);
  checkB.position(offsetX + 120, checkY);

  // Style buttons based on selection
  styleButtons();
}

function styleButtons() {
  let defaultStyle = 'padding:6px 14px; border:2px solid #888; border-radius:6px; ' +
    'background:#f0f0f0; font-size:14px; cursor:pointer; font-family:Arial;';
  let activeStyle = 'padding:6px 14px; border:2px solid #2e7d32; border-radius:6px; ' +
    'background:#c8e6c9; font-size:14px; cursor:pointer; font-weight:bold; font-family:Arial;';

  btnAnd.attribute('style', selectedOp === 'and' ? activeStyle : defaultStyle);
  btnOr.attribute('style', selectedOp === 'or' ? activeStyle : defaultStyle);
  btnNotA.attribute('style', selectedOp === 'notA' ? activeStyle : defaultStyle);
}

function selectOperator(op) {
  // Toggle off if clicking same button again
  if (selectedOp === op) {
    selectedOp = null;
  } else {
    selectedOp = op;
  }
  styleButtons();
}

function draw() {
  // Drawing area background
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  // Control area background
  fill('white');
  stroke('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  noStroke();
  fill('#333');
  textAlign(CENTER, TOP);
  textSize(Math.max(18, canvasWidth * 0.045));
  textStyle(BOLD);
  text('Logical Operators as Venn Diagrams', canvasWidth / 2, 12);
  textStyle(NORMAL);

  // Calculate circle centers
  let cx = canvasWidth / 2;
  let aX = cx - circleOffsetX;
  let bX = cx + circleOffsetX;
  let cY = circlesCenterY;

  // Detect which hover region the mouse is in
  detectHoverRegion(aX, bX, cY);

  // Draw the highlighted region FIRST (behind the circle outlines)
  drawHighlightedRegion(aX, bX, cY);

  // Draw circle A (semi-transparent blue)
  stroke(50, 100, 200);
  strokeWeight(2.5);
  fill(50, 100, 200, 50);
  ellipse(aX, cY, circleRadius * 2, circleRadius * 2);

  // Draw circle B (semi-transparent orange)
  stroke(220, 130, 30);
  strokeWeight(2.5);
  fill(220, 130, 30, 50);
  ellipse(bX, cY, circleRadius * 2, circleRadius * 2);

  // Label A and B
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(Math.max(20, canvasWidth * 0.05));
  textStyle(BOLD);
  fill(30, 70, 160);
  text('A', aX - circleRadius * 0.55, cY - circleRadius * 0.6);
  fill(180, 100, 10);
  text('B', bX + circleRadius * 0.55, cY - circleRadius * 0.6);
  textStyle(NORMAL);

  // Draw hover tooltip near the mouse
  drawHoverTooltip();

  // Draw the expression display below the circles
  drawExpressionPanel(cY);

  // Draw the results panel (truth table for current A, B values)
  drawResultsPanel(cY);
}

function detectHoverRegion(aX, bX, cY) {
  let dA = dist(mouseX, mouseY, aX, cY);
  let dB = dist(mouseX, mouseY, bX, cY);
  let inA = dA < circleRadius;
  let inB = dB < circleRadius;

  if (inA && inB) {
    hoverRegion = 'intersection';
  } else if (inA && !inB) {
    hoverRegion = 'onlyA';
  } else if (!inA && inB) {
    hoverRegion = 'onlyB';
  } else {
    hoverRegion = 'outside';
  }
}

function drawHighlightedRegion(aX, bX, cY) {
  if (selectedOp === null) return;

  let d = circleRadius * 2;

  // Use a graphics buffer to composite the highlight shape
  // We draw the highlight using p5's clipping approach with beginShape/endShape
  // For simplicity, we use a pixel-approximate approach by scanning arcs

  // Instead of complex clipping, we draw green-filled regions using the
  // drawingContext (native Canvas2D) for clip-based compositing
  let ctx = drawingContext;
  ctx.save();

  if (selectedOp === 'and') {
    // Intersection: clip to circle A, then fill circle B
    ctx.beginPath();
    ctx.arc(aX, cY, circleRadius, 0, TWO_PI);
    ctx.clip();
    // Fill circle B within the clipped region
    noStroke();
    fill(60, 200, 80, 120);
    ellipse(bX, cY, d, d);
  } else if (selectedOp === 'or') {
    // Union: fill both circles
    noStroke();
    fill(60, 200, 80, 120);
    ellipse(aX, cY, d, d);
    ellipse(bX, cY, d, d);
  } else if (selectedOp === 'notA') {
    // Everything outside A: fill the entire draw area, then "cut out" circle A
    // We use even-odd fill rule to create a "hole"
    ctx.beginPath();
    // Outer rectangle (the canvas area)
    ctx.rect(0, 0, canvasWidth, drawHeight);
    // Inner circle A (drawn counter-clockwise to create a hole with even-odd)
    ctx.arc(aX, cY, circleRadius, 0, TWO_PI, true);
    ctx.fillStyle = 'rgba(60, 200, 80, 0.18)';
    ctx.fill('evenodd');
  }

  ctx.restore();
}

function drawHoverTooltip() {
  if (mouseX < 0 || mouseX > canvasWidth || mouseY < 0 || mouseY > drawHeight) return;

  let label = '';
  if (hoverRegion === 'intersection') {
    label = 'A is True, B is True';
  } else if (hoverRegion === 'onlyA') {
    label = 'A is True, B is False';
  } else if (hoverRegion === 'onlyB') {
    label = 'A is False, B is True';
  } else {
    label = 'A is False, B is False';
  }

  // Only show tooltip when hovering within or near the circles
  let cx = canvasWidth / 2;
  let aX = cx - circleOffsetX;
  let bX = cx + circleOffsetX;
  let dA = dist(mouseX, mouseY, aX, circlesCenterY);
  let dB = dist(mouseX, mouseY, bX, circlesCenterY);
  // Show tooltip if within a bit beyond the circles
  if (dA > circleRadius * 1.6 && dB > circleRadius * 1.6) return;

  noStroke();
  textSize(Math.max(13, canvasWidth * 0.03));
  let tw = textWidth(label) + 16;
  let th = 26;
  let tx = mouseX + 15;
  let ty = mouseY - 20;

  // Keep tooltip on screen
  if (tx + tw > canvasWidth - 5) tx = mouseX - tw - 10;
  if (ty < 5) ty = mouseY + 20;

  // Tooltip background
  fill(255, 255, 255, 230);
  stroke('#888');
  strokeWeight(1);
  rect(tx, ty, tw, th, 5);

  // Tooltip text
  noStroke();
  fill('#333');
  textAlign(LEFT, CENTER);
  text(label, tx + 8, ty + th / 2);
}

function drawExpressionPanel(cY) {
  let panelY = cY + circleRadius + 25;

  noStroke();
  textAlign(CENTER, TOP);

  if (selectedOp === null) {
    fill('#777');
    textSize(Math.max(15, canvasWidth * 0.035));
    textStyle(ITALIC);
    text('Click a button below to highlight a region', canvasWidth / 2, panelY);
    textStyle(NORMAL);
    return;
  }

  // Show the boolean expression and what is highlighted
  let expression = '';
  let description = '';

  if (selectedOp === 'and') {
    expression = 'A and B';
    description = 'Highlighted: where both A and B are True (intersection)';
  } else if (selectedOp === 'or') {
    expression = 'A or B';
    description = 'Highlighted: where A is True, B is True, or both (union)';
  } else if (selectedOp === 'notA') {
    expression = 'not A';
    description = 'Highlighted: everything outside of A';
  }

  // Expression in bold green
  fill('#2e7d32');
  textSize(Math.max(18, canvasWidth * 0.045));
  textStyle(BOLD);
  text(expression, canvasWidth / 2, panelY);
  textStyle(NORMAL);

  // Description below
  fill('#555');
  textSize(Math.max(13, canvasWidth * 0.03));
  text(description, canvasWidth / 2, panelY + 26);
}

function drawResultsPanel(cY) {
  // Draw a small results table showing the computed truth values
  let panelX = margin;
  let panelY = cY + circleRadius + 75;
  let panelW = canvasWidth - margin * 2;
  let panelH = 95;

  // Panel background
  fill(255, 255, 255, 200);
  stroke('#ccc');
  strokeWeight(1);
  rect(panelX, panelY, panelW, panelH, 8);

  // Title for the results panel
  noStroke();
  fill('#333');
  textAlign(LEFT, TOP);
  textSize(Math.max(14, canvasWidth * 0.032));
  textStyle(BOLD);
  text('Results (use checkboxes to toggle A and B):', panelX + 10, panelY + 8);
  textStyle(NORMAL);

  // Compute results
  let aAndB = valueA && valueB;
  let aOrB = valueA || valueB;
  let notA = !valueA;
  let notB = !valueB;

  // Display results in two columns
  let col1X = panelX + 15;
  let col2X = panelX + panelW / 2 + 10;
  let lineY = panelY + 32;
  let lineSpacing = 20;

  textSize(Math.max(14, canvasWidth * 0.032));

  // A value
  noStroke();
  fill('#555');
  textAlign(LEFT, TOP);
  text('A = ' + boolStr(valueA), col1X, lineY);

  // B value
  text('B = ' + boolStr(valueB), col2X, lineY);
  lineY += lineSpacing;

  // A and B
  fill(aAndB ? '#2e7d32' : '#b71c1c');
  text('A and B = ' + boolStr(aAndB), col1X, lineY);

  // A or B
  fill(aOrB ? '#2e7d32' : '#b71c1c');
  text('A or B = ' + boolStr(aOrB), col2X, lineY);
  lineY += lineSpacing;

  // not A
  fill(notA ? '#2e7d32' : '#b71c1c');
  text('not A = ' + boolStr(notA), col1X, lineY);

  // not B
  fill(notB ? '#2e7d32' : '#b71c1c');
  text('not B = ' + boolStr(notB), col2X, lineY);
}

// Helper: convert boolean to "True" / "False" string
function boolStr(val) {
  return val ? 'True' : 'False';
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}
