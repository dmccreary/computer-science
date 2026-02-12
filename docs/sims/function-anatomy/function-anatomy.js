// Function Anatomy MicroSim
// Hover-to-reveal labeled diagram of a Python function
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 400;
let drawHeight = 450;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;

// Controls
let showAllButton;

// State
let hoveredZone = -1;
let lockedZone = -1;
let showAll = false;

// Code lines
let codeLines = [
  'def greet(name):',
  '    """Say hello to someone."""',
  '    message = "Hello, " + name + "!"',
  '    return message',
];

// Hover zones: each zone is { x, y, w, h, label, color, description }
let zones = [];

// Zone definitions
let zoneData = [
  {
    label: 'def keyword',
    color: [70, 130, 220],
    description: 'The def keyword tells Python\nyou\'re defining a new function.',
  },
  {
    label: 'Function name',
    color: [46, 160, 67],
    description: 'The function\'s name. You\'ll use\nthis name to call the function later.',
  },
  {
    label: 'Parameter',
    color: [230, 150, 50],
    description: 'Parameters are placeholders for\ndata the function will receive.\nThey go inside parentheses.',
  },
  {
    label: 'Colon',
    color: [140, 140, 140],
    description: 'The colon marks the beginning\nof the function body. Everything\nindented below is part of the function.',
  },
  {
    label: 'Docstring',
    color: [160, 80, 200],
    description: 'A docstring describes what the\nfunction does. It\'s the first line\ninside, wrapped in triple quotes.',
  },
  {
    label: 'Function body',
    color: [100, 100, 100],
    description: 'The body is where the function\ndoes its work. All body lines\nmust be indented.',
  },
  {
    label: 'Return statement',
    color: [220, 60, 60],
    description: 'The return statement sends a\nvalue back to whoever called\nthe function.',
  },
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  showAllButton = createButton('Show All Labels');
  showAllButton.position(canvasWidth / 2 - 55, drawHeight + 12);
  showAllButton.mousePressed(() => {
    showAll = !showAll;
    lockedZone = -1;
    showAllButton.html(showAll ? 'Hide Labels' : 'Show All Labels');
  });

  describe('Interactive labeled diagram of a Python function. Hover over parts to see descriptions.', LABEL);
}

function draw() {
  updateCanvasSize();

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(18);
  text('Function Anatomy', canvasWidth / 2, 8);

  // Subtitle
  fill(120);
  textSize(12);
  text('Hover over each part to learn what it does', canvasWidth / 2, 30);

  // Draw the code
  drawCode();

  // Draw tooltip
  drawTooltip();

  // Draw show-all labels
  if (showAll) drawAllLabels();
}

function drawCode() {
  let codeX = margin + 10;
  let codeY = 60;
  let lineH = 42;
  let fontSize = Math.min(18, canvasWidth * 0.038);

  textFont('monospace');
  textSize(fontSize);
  textAlign(LEFT, TOP);

  // Recalculate zones based on current font size
  zones = [];

  // Line 1: def greet(name):
  let y = codeY;
  let x = codeX;

  // def
  let defW = textWidth('def');
  zones.push({ x: x, y: y, w: defW, h: lineH - 4, idx: 0 });
  x += defW;

  // space
  let spW = textWidth(' ');
  x += spW;

  // greet
  let nameW = textWidth('greet');
  zones.push({ x: x, y: y, w: nameW, h: lineH - 4, idx: 1 });
  x += nameW;

  // (name)
  let paramW = textWidth('(name)');
  zones.push({ x: x, y: y, w: paramW, h: lineH - 4, idx: 2 });
  x += paramW;

  // :
  let colonW = textWidth(':');
  zones.push({ x: x, y: y, w: colonW + 4, h: lineH - 4, idx: 3 });

  // Line 2: docstring
  y += lineH;
  let docStr = '    """Say hello to someone."""';
  let docW = textWidth(docStr);
  zones.push({ x: codeX, y: y, w: docW, h: lineH - 4, idx: 4 });

  // Line 3: body
  y += lineH;
  let bodyStr = '    message = "Hello, " + name + "!"';
  let bodyW = textWidth(bodyStr);
  zones.push({ x: codeX, y: y, w: bodyW, h: lineH - 4, idx: 5 });

  // Line 4: return
  y += lineH;
  let retStr = '    return message';
  let retW = textWidth(retStr);
  zones.push({ x: codeX, y: y, w: retW, h: lineH - 4, idx: 6 });

  // Check hover
  hoveredZone = -1;
  for (let z of zones) {
    if (mouseX > z.x && mouseX < z.x + z.w && mouseY > z.y && mouseY < z.y + z.h) {
      hoveredZone = z.idx;
    }
  }

  let activeZone = lockedZone >= 0 ? lockedZone : hoveredZone;

  // Draw background code box
  fill(30, 30, 42);
  stroke(80);
  strokeWeight(1);
  rect(margin, codeY - 10, canvasWidth - margin * 2, lineH * 4 + 20, 8);

  // Draw hover highlights
  noStroke();
  for (let z of zones) {
    let isActive = (activeZone === z.idx) || showAll;
    if (isActive) {
      let col = zoneData[z.idx].color;
      fill(col[0], col[1], col[2], 40);
      rect(z.x - 2, z.y - 2, z.w + 4, z.h + 4, 4);

      // Border
      noFill();
      stroke(col[0], col[1], col[2], 180);
      strokeWeight(2);
      rect(z.x - 2, z.y - 2, z.w + 4, z.h + 4, 4);
      noStroke();
    }
  }

  // Draw code text with syntax coloring
  textFont('monospace');
  textSize(fontSize);
  textAlign(LEFT, TOP);

  y = codeY;
  let tx = codeX;

  // Line 1: def greet(name):
  fill(zoneData[0].color); // def in blue
  text('def', tx, y);
  tx += textWidth('def');

  fill(220); // space
  text(' ', tx, y);
  tx += spW;

  fill(zoneData[1].color); // greet in green
  text('greet', tx, y);
  tx += textWidth('greet');

  fill(220); // (
  text('(', tx, y);
  fill(zoneData[2].color); // name in orange
  text('name', tx + textWidth('('), y);
  fill(220);
  text(')', tx + textWidth('(name'), y);
  tx += textWidth('(name)');

  fill(zoneData[3].color); // colon
  text(':', tx, y);

  // Line 2: docstring
  y += lineH;
  fill(zoneData[4].color);
  text('    """Say hello to someone."""', codeX, y);

  // Line 3: body
  y += lineH;
  fill(220);
  text('    ', codeX, y);
  tx = codeX + textWidth('    ');
  fill(220);
  text('message', tx, y);
  tx += textWidth('message');
  fill(180);
  text(' = ', tx, y);
  tx += textWidth(' = ');
  fill(180, 220, 180);
  text('"Hello, "', tx, y);
  tx += textWidth('"Hello, "');
  fill(180);
  text(' + ', tx, y);
  tx += textWidth(' + ');
  fill(zoneData[2].color);
  text('name', tx, y);
  tx += textWidth('name');
  fill(180);
  text(' + ', tx, y);
  tx += textWidth(' + ');
  fill(180, 220, 180);
  text('"!"', tx, y);

  // Line 4: return
  y += lineH;
  fill(zoneData[6].color);
  text('    return', codeX, y);
  fill(220);
  text(' message', codeX + textWidth('    return'), y);

  textFont('Arial');
}

function drawTooltip() {
  let activeZone = lockedZone >= 0 ? lockedZone : hoveredZone;
  if (activeZone < 0) return;

  let zd = zoneData[activeZone];
  let tipX = margin;
  let tipY = 245;
  let tipW = canvasWidth - margin * 2;
  let tipH = 85;

  // Background
  fill(248, 248, 252);
  stroke(zd.color[0], zd.color[1], zd.color[2]);
  strokeWeight(2);
  rect(tipX, tipY, tipW, tipH, 8);

  // Color dot
  noStroke();
  fill(zd.color);
  circle(tipX + 18, tipY + 20, 16);

  // Label
  fill(zd.color);
  textAlign(LEFT, TOP);
  textSize(14);
  textStyle(BOLD);
  text(zd.label, tipX + 32, tipY + 12);
  textStyle(NORMAL);

  // Description
  fill(60);
  textSize(12);
  let descLines = zd.description.split('\n');
  for (let i = 0; i < descLines.length; i++) {
    text(descLines[i], tipX + 15, tipY + 34 + i * 16);
  }

  // Lock indicator
  if (lockedZone >= 0) {
    fill(180);
    textSize(10);
    textAlign(RIGHT, TOP);
    text('(click elsewhere to unlock)', tipX + tipW - 10, tipY + 12);
    textAlign(LEFT, TOP);
  }
}

function drawAllLabels() {
  let labelY = 345;
  let labelX = margin + 10;
  let lineH = 22;

  noStroke();
  fill(248, 248, 252);
  stroke(200);
  strokeWeight(1);
  rect(margin, labelY - 10, canvasWidth - margin * 2, zoneData.length * lineH + 20, 8);

  noStroke();
  textSize(12);
  textAlign(LEFT, CENTER);

  for (let i = 0; i < zoneData.length; i++) {
    let y = labelY + i * lineH + 5;
    let zd = zoneData[i];

    // Color dot
    fill(zd.color);
    circle(labelX + 6, y, 10);

    // Label
    fill(60);
    text(zd.label, labelX + 18, y);

    // Short description
    fill(140);
    textSize(10);
    let shortDesc = zd.description.split('\n')[0];
    text('— ' + shortDesc, labelX + 18 + textWidth(zd.label) + 8, y);
    textSize(12);
  }
}

function mousePressed() {
  // Check if clicking on a zone
  for (let z of zones) {
    if (mouseX > z.x && mouseX < z.x + z.w && mouseY > z.y && mouseY < z.y + z.h) {
      if (lockedZone === z.idx) {
        lockedZone = -1; // unlock
      } else {
        lockedZone = z.idx;
      }
      return;
    }
  }
  // Click outside zones unlocks
  lockedZone = -1;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  showAllButton.position(canvasWidth / 2 - 55, drawHeight + 12);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
