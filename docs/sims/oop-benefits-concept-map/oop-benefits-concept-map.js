/*
 * OOP Benefits Concept Map
 * Central "OOP" node with five benefit nodes in a star pattern.
 * Hover for expanded explanations, click to highlight relevant code.
 *
 * Bloom Level: Understand (L2) — summarize, explain
 * Learning Objective: Summarize key OOP benefits and explain why OOP is preferred.
 */

// ---- responsive canvas globals ----
let canvasWidth = 400;
let drawHeight = 550;
let controlHeight = 0;
let canvasHeight = drawHeight;
let margin = 20;
let defaultTextSize = 14;

// ---- application state ----
let hoveredNode = -1;
let selectedNode = -1;
let layoutVertical = false;

// ---- data ----
const benefits = [
  {
    label: 'Organization',
    short: 'All Dog data + behavior\nin one class',
    detail: 'OOP bundles related data (attributes) and behavior (methods) together. ' +
            'Instead of scattered variables and functions, everything about a Dog lives in one place.',
    codeHighlight: [0, 1, 3, 4, 5, 6, 8, 9],
    color: '#e53935',
    lightColor: '#ffcdd2'
  },
  {
    label: 'Reusability',
    short: 'Create unlimited Dog\nobjects from one class',
    detail: 'Write the class once, then create as many objects as you need. ' +
            'Each Dog object gets its own data but shares the same structure and methods.',
    codeHighlight: [0, 3],
    color: '#fb8c00',
    lightColor: '#ffe0b2'
  },
  {
    label: 'Encapsulation',
    short: 'Property decorators\nprotect age from\ninvalid values',
    detail: 'Encapsulation hides internal data behind controlled access. ' +
            'The @property decorator validates age so no one can set it to -5.',
    codeHighlight: [6, 11, 12, 13],
    color: '#7b1fa2',
    lightColor: '#e1bee7'
  },
  {
    label: 'Real-world\nModeling',
    short: 'Dogs in code match\ndogs in real life',
    detail: 'OOP lets you model real-world things naturally. A Dog has a name, breed, and age ' +
            '(attributes) and can bark and have birthdays (methods) — just like a real dog.',
    codeHighlight: [0, 4, 5, 6, 8, 9],
    color: '#2e7d32',
    lightColor: '#c8e6c9'
  },
  {
    label: 'Teamwork',
    short: 'Each teammate builds\na different class',
    detail: 'In team projects, each person can build a different class (Dog, Cat, Bird). ' +
            'Classes connect through well-defined methods, making collaboration clean.',
    codeHighlight: [0, 8, 9],
    color: '#1565c0',
    lightColor: '#bbdefb'
  }
];

const codeSnippet = [
  'class Dog:',                               // 0
  '    species = "Canis familiaris"',          // 1
  '',                                          // 2
  '    def __init__(self, name, breed, age):', // 3
  '        self.name = name',                  // 4
  '        self.breed = breed',                // 5
  '        self._age = age',                   // 6
  '',                                          // 7
  '    def bark(self):',                       // 8
  '        return f"{self.name} says: Woof!"', // 9
  '',                                          // 10
  '    @property',                             // 11
  '    def age(self):',                        // 12
  '        return self._age',                  // 13
];

// ---- layout positions (computed each frame) ----
let centerX, centerY, centerR;
let nodePositions = [];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  describe(
    'A concept map with OOP at the center and five benefit nodes arranged in a star: ' +
    'Organization, Reusability, Encapsulation, Real-world Modeling, and Teamwork. ' +
    'Hover for details, click to highlight relevant code.',
    LABEL
  );
}

function draw() {
  updateCanvasSize();
  background('#f8f9fc');

  layoutVertical = canvasWidth < 480;

  if (layoutVertical) {
    drawVerticalLayout();
  } else {
    drawStarLayout();
  }
}

function drawStarLayout() {
  // Title
  noStroke();
  fill('#3a4a6a');
  textAlign(CENTER, TOP);
  textSize(16);
  text('Benefits of Object-Oriented Programming', canvasWidth / 2, 8);
  textSize(12);
  fill('#7a8a9a');
  text('Hover for details \u2022 Click to highlight code', canvasWidth / 2, 28);

  // Compute positions
  let codeH = selectedNode >= 0 ? 220 : 0;
  let mapH = drawHeight - 50 - codeH;
  centerX = canvasWidth / 2;
  centerY = 50 + mapH / 2;
  centerR = 36;

  let orbitR = min(canvasWidth * 0.33, mapH * 0.38);
  nodePositions = [];
  for (let i = 0; i < 5; i++) {
    let angle = -HALF_PI + (TWO_PI / 5) * i;
    nodePositions.push({
      x: centerX + cos(angle) * orbitR,
      y: centerY + sin(angle) * orbitR
    });
  }

  hoveredNode = -1;

  // Draw connecting lines
  for (let i = 0; i < 5; i++) {
    let np = nodePositions[i];
    let isActive = i === selectedNode;
    stroke(isActive ? benefits[i].color : '#c8d0dc');
    strokeWeight(isActive ? 3 : 2);
    line(centerX, centerY, np.x, np.y);
  }

  // Draw center node
  let centerHovered = dist(mouseX, mouseY, centerX, centerY) < centerR;
  fill(centerHovered ? '#3a8a3a' : '#43a047');
  stroke('#2e7d32');
  strokeWeight(2);
  ellipse(centerX, centerY, centerR * 2);
  noStroke();
  fill('white');
  textAlign(CENTER, CENTER);
  textSize(13);
  textStyle(BOLD);
  text('OOP', centerX, centerY);
  textStyle(NORMAL);

  // Draw benefit nodes
  for (let i = 0; i < 5; i++) {
    let np = nodePositions[i];
    let b = benefits[i];
    let nodeR = 50;
    let isHovered = dist(mouseX, mouseY, np.x, np.y) < nodeR;
    let isSelected = i === selectedNode;
    if (isHovered) hoveredNode = i;

    // node circle
    fill(isHovered || isSelected ? b.lightColor : '#ffffff');
    stroke(b.color);
    strokeWeight(isSelected ? 3 : 2);
    ellipse(np.x, np.y, nodeR * 2);

    // label
    noStroke();
    fill(b.color);
    textAlign(CENTER, CENTER);
    textSize(12);
    textStyle(BOLD);
    text(b.label, np.x, np.y - 10);
    textStyle(NORMAL);

    // short description
    fill('#555');
    textSize(9);
    text(b.short, np.x, np.y + 14);
  }

  // Hover tooltip
  if (hoveredNode >= 0) {
    drawBenefitTooltip(benefits[hoveredNode], nodePositions[hoveredNode]);
  }

  // Code panel at bottom
  if (selectedNode >= 0) {
    drawCodePanel(4, drawHeight - codeH, canvasWidth - 8, codeH - 8);
  }
}

function drawVerticalLayout() {
  // Title
  noStroke();
  fill('#3a4a6a');
  textAlign(CENTER, TOP);
  textSize(16);
  text('Benefits of OOP', canvasWidth / 2, 8);
  textSize(11);
  fill('#7a8a9a');
  text('Tap a benefit for details', canvasWidth / 2, 28);

  // Center node at top
  centerX = canvasWidth / 2;
  centerY = 65;
  centerR = 28;

  fill('#43a047');
  stroke('#2e7d32');
  strokeWeight(2);
  ellipse(centerX, centerY, centerR * 2);
  noStroke();
  fill('white');
  textAlign(CENTER, CENTER);
  textSize(13);
  textStyle(BOLD);
  text('OOP', centerX, centerY);
  textStyle(NORMAL);

  // Vertical list of benefit nodes
  hoveredNode = -1;
  let startY = 105;
  let nodeH = 55;
  let codeH = selectedNode >= 0 ? 200 : 0;
  nodePositions = [];

  for (let i = 0; i < 5; i++) {
    let b = benefits[i];
    let ny = startY + i * nodeH;
    let nx = canvasWidth / 2;
    nodePositions.push({ x: nx, y: ny });

    let isHovered = mouseY > ny - 20 && mouseY < ny + 20 && mouseX > 20 && mouseX < canvasWidth - 20;
    let isSelected = i === selectedNode;
    if (isHovered) hoveredNode = i;

    // connecting line
    stroke(isSelected ? b.color : '#d0d8e0');
    strokeWeight(isSelected ? 2 : 1);
    line(centerX, centerY + centerR, nx, ny - 20);

    // rounded rect node
    fill(isHovered || isSelected ? b.lightColor : '#ffffff');
    stroke(b.color);
    strokeWeight(isSelected ? 2.5 : 1.5);
    rect(30, ny - 20, canvasWidth - 60, 40, 12);

    noStroke();
    fill(b.color);
    textAlign(CENTER, CENTER);
    textSize(13);
    textStyle(BOLD);
    text(b.label.replace('\n', ' '), nx, ny - 4);
    textStyle(NORMAL);
    textSize(10);
    fill('#666');
    text(b.short.replace(/\n/g, ' '), nx, ny + 12);
  }

  // Code panel at bottom if selected
  if (selectedNode >= 0) {
    drawCodePanel(4, drawHeight - codeH, canvasWidth - 8, codeH - 8);
  }

  // Tooltip
  if (hoveredNode >= 0 && hoveredNode !== selectedNode) {
    drawBenefitTooltip(benefits[hoveredNode], nodePositions[hoveredNode]);
  }
}

function drawBenefitTooltip(b, pos) {
  textSize(12);
  let lines = wrapText(b.detail, 200);
  let pad = 10;
  let tw = 220;
  let th = lines.length * 16 + pad * 2 + 20;

  let tx = pos.x + 55;
  let ty = pos.y - th / 2;
  if (tx + tw > canvasWidth - 10) tx = pos.x - tw - 55;
  if (ty < 10) ty = 10;
  if (ty + th > drawHeight - 10) ty = drawHeight - th - 10;

  fill(255, 255, 255, 245);
  stroke(b.color);
  strokeWeight(1.5);
  rect(tx, ty, tw, th, 8);

  noStroke();
  fill(b.color);
  textAlign(LEFT, TOP);
  textSize(13);
  textStyle(BOLD);
  text(b.label.replace('\n', ' '), tx + pad, ty + pad);
  textStyle(NORMAL);

  fill('#444');
  textSize(12);
  for (let i = 0; i < lines.length; i++) {
    text(lines[i], tx + pad, ty + pad + 20 + i * 16);
  }
}

function drawCodePanel(px, py, pw, ph) {
  let b = benefits[selectedNode];

  fill('#1e1e2e');
  stroke(b.color);
  strokeWeight(1.5);
  rect(px, py, pw, ph, 6);

  // header
  fill('#2d2d44');
  noStroke();
  rect(px + 1, py + 1, pw - 2, 20, 5, 5, 0, 0);
  fill('#a0a8b8');
  textSize(11);
  textAlign(LEFT, CENTER);
  text('dog.py  \u2014  ' + b.label.replace('\n', ' ') + ' highlighted', px + 10, py + 11);

  // code lines
  textSize(12);
  textAlign(LEFT, TOP);
  let lineH = 15;
  for (let i = 0; i < codeSnippet.length; i++) {
    let ly = py + 28 + i * lineH;
    let highlighted = b.codeHighlight.includes(i);

    if (highlighted) {
      fill(b.color + '30');
      noStroke();
      rect(px + 4, ly - 1, pw - 8, lineH, 2);
    }

    let codeLine = codeSnippet[i];
    if (highlighted) {
      fill('#ffffff');
    } else if (codeLine.startsWith('class ') || codeLine.includes('def ')) {
      fill('#7eb8ff');
    } else if (codeLine.includes('@')) {
      fill('#c0a0e0');
    } else {
      fill('#6a6a8a');
    }
    noStroke();
    text(codeLine, px + 10, ly);
  }
}

function mousePressed() {
  // check if a benefit node was clicked
  for (let i = 0; i < nodePositions.length; i++) {
    let np = nodePositions[i];
    let clicked;
    if (layoutVertical) {
      clicked = mouseY > np.y - 20 && mouseY < np.y + 20 && mouseX > 30 && mouseX < canvasWidth - 30;
    } else {
      clicked = dist(mouseX, mouseY, np.x, np.y) < 50;
    }
    if (clicked) {
      selectedNode = selectedNode === i ? -1 : i;
      return;
    }
  }
}

function wrapText(str, maxW) {
  let words = str.split(' ');
  let lines = [];
  let current = '';
  textSize(12);
  for (let w of words) {
    let test = current === '' ? w : current + ' ' + w;
    if (textWidth(test) > maxW && current !== '') {
      lines.push(current);
      current = w;
    } else {
      current = test;
    }
  }
  if (current !== '') lines.push(current);
  return lines;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const mainEl = document.querySelector('main');
  if (mainEl) {
    canvasWidth = mainEl.clientWidth;
  }
}
