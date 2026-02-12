// Function Pattern Gallery MicroSim
// Clickable card gallery of 4 common function patterns
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
let backButton;

// State
let selectedCard = -1;
let hoverCard = -1;
let animProgress = 0;
let expanding = false;

let patterns = [
  {
    name: 'Input Validation',
    icon: 'shield',
    color: [70, 130, 220],
    shortDesc: 'Check before you compute',
    code: [
      'def divide(a, b):',
      '    if b == 0:',
      '        return "Error: no /0"',
      '    return a / b',
    ],
    annotations: [
      'Define function with two parameters',
      'Check for invalid input FIRST',
      'Return early with error message',
      'Only compute if input is valid',
    ],
    whenToUse: [
      'User input that could be invalid',
      'Division (check for zero)',
      'Index access (check bounds)',
      'File operations (check exists)',
    ],
  },
  {
    name: 'Multiple Returns',
    icon: 'fork',
    color: [46, 160, 67],
    shortDesc: 'Different results for different cases',
    code: [
      'def grade(score):',
      '    if score >= 90: return "A"',
      '    if score >= 80: return "B"',
      '    if score >= 70: return "C"',
      '    return "F"',
    ],
    annotations: [
      'Take a score as input',
      'Check highest threshold first',
      'Each condition has its own return',
      'Work down through thresholds',
      'Default return for all other cases',
    ],
    whenToUse: [
      'Categorizing values into groups',
      'Converting between scales',
      'Mapping inputs to outputs',
      'Decision trees with clear rules',
    ],
  },
  {
    name: 'Accumulation',
    icon: 'stack',
    color: [230, 150, 50],
    shortDesc: 'Build up a result in a loop',
    code: [
      'def total(numbers):',
      '    result = 0',
      '    for n in numbers:',
      '        result += n',
      '    return result',
    ],
    annotations: [
      'Take a list as input',
      'Initialize accumulator to 0',
      'Loop through each item',
      'Add each item to accumulator',
      'Return the built-up result',
    ],
    whenToUse: [
      'Summing or averaging values',
      'Building strings piece by piece',
      'Counting items that match',
      'Collecting filtered results',
    ],
  },
  {
    name: 'Composition',
    icon: 'chain',
    color: [160, 80, 200],
    shortDesc: 'Functions calling functions',
    code: [
      'def clean(text):',
      '    return text.strip().lower()',
      '',
      'def greet(name):',
      '    return "Hi " + clean(name)',
    ],
    annotations: [
      'Helper function: clean input',
      'Strip whitespace, lowercase',
      '',
      'Main function uses the helper',
      'Calls clean() inside expression',
    ],
    whenToUse: [
      'Breaking complex tasks into steps',
      'Reusing logic in multiple places',
      'Making code easier to test',
      'Keeping functions short and focused',
    ],
  },
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  backButton = createButton('← Back to Gallery');
  backButton.position(10, drawHeight + 12);
  backButton.mousePressed(() => {
    selectedCard = -1;
    expanding = true;
    animProgress = 0;
  });
  backButton.hide();

  describe('Clickable gallery of four common function design patterns with code examples and annotations.', LABEL);
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
  text('Function Pattern Gallery', canvasWidth / 2, 8);

  if (selectedCard >= 0) {
    drawExpandedCard(selectedCard);
    backButton.show();
  } else {
    drawCardGrid();
    backButton.hide();

    // Subtitle
    fill(120);
    textSize(11);
    textAlign(CENTER, TOP);
    text('Click a card to explore the pattern', canvasWidth / 2, 28);
  }

  // Animation
  if (expanding) {
    animProgress += 0.06;
    if (animProgress >= 1) {
      animProgress = 1;
      expanding = false;
    }
  }
}

function drawCardGrid() {
  let cols = 2;
  let rows = 2;
  let gap = 12;
  let gridW = canvasWidth - margin * 2;
  let gridH = drawHeight - 55;
  let cardW = (gridW - gap) / cols;
  let cardH = (gridH - gap) / rows;
  let startY = 42;

  hoverCard = -1;

  for (let i = 0; i < patterns.length; i++) {
    let col = i % cols;
    let row = Math.floor(i / cols);
    let cx = margin + col * (cardW + gap);
    let cy = startY + row * (cardH + gap);

    let p = patterns[i];
    let isHover = mouseX > cx && mouseX < cx + cardW && mouseY > cy && mouseY < cy + cardH;
    if (isHover) hoverCard = i;

    // Card shadow
    if (isHover) {
      fill(0, 0, 0, 15);
      noStroke();
      rect(cx + 3, cy + 3, cardW, cardH, 12);
    }

    // Card background
    fill(isHover ? 255 : 250);
    stroke(isHover ? p.color : [220]);
    strokeWeight(isHover ? 2.5 : 1.5);
    rect(cx, cy, cardW, cardH, 12);

    // Icon
    drawIcon(p.icon, cx + cardW / 2, cy + 35, p.color, isHover ? 1.1 : 1);

    // Name
    noStroke();
    fill(p.color);
    textAlign(CENTER, TOP);
    textSize(14);
    textStyle(BOLD);
    text(p.name, cx + cardW / 2, cy + 60);
    textStyle(NORMAL);

    // Short description
    fill(120);
    textSize(11);
    text(p.shortDesc, cx + cardW / 2, cy + 80);

    // Code preview
    textFont('monospace');
    textSize(Math.min(9, canvasWidth * 0.018));
    textAlign(LEFT, TOP);
    fill(80);
    let previewY = cy + 100;
    let maxLines = Math.min(p.code.length, 4);
    for (let j = 0; j < maxLines; j++) {
      let codeLine = p.code[j];
      if (textWidth(codeLine) > cardW - 20) {
        codeLine = codeLine.substring(0, Math.floor((cardW - 30) / textWidth('a'))) + '...';
      }
      text(codeLine, cx + 10, previewY + j * 14);
    }
    textFont('Arial');

    // "Click to explore" hint on hover
    if (isHover) {
      fill(p.color[0], p.color[1], p.color[2], 180);
      textAlign(CENTER, BOTTOM);
      textSize(10);
      text('Click to explore →', cx + cardW / 2, cy + cardH - 8);
    }
  }
}

function drawExpandedCard(idx) {
  let p = patterns[idx];
  let x = margin;
  let y = 38;
  let w = canvasWidth - margin * 2;

  // Card background
  fill(255);
  stroke(p.color);
  strokeWeight(2);
  rect(x, y, w, drawHeight - y - 10, 12);

  // Header with icon and name
  let headerH = 50;
  fill(p.color[0], p.color[1], p.color[2], 15);
  noStroke();
  rect(x + 1, y + 1, w - 2, headerH, 12, 12, 0, 0);

  drawIcon(p.icon, x + 30, y + 25, p.color, 1);

  fill(p.color);
  textAlign(LEFT, CENTER);
  textSize(16);
  textStyle(BOLD);
  text(p.name, x + 50, y + 25);
  textStyle(NORMAL);

  fill(120);
  textSize(11);
  text(p.shortDesc, x + 50 + textWidth(p.name) + 10, y + 25);

  // Code panel with annotations
  let codeY = y + headerH + 10;
  let codeH = p.code.length * 26 + 20;

  fill(30, 30, 42);
  stroke(80);
  strokeWeight(1);
  rect(x + 10, codeY, w - 20, codeH, 8);

  textFont('monospace');
  textSize(Math.min(12, canvasWidth * 0.026));

  for (let i = 0; i < p.code.length; i++) {
    let ly = codeY + 12 + i * 26;
    let line = p.code[i];

    // Syntax coloring
    if (line.startsWith('def ')) {
      fill(70, 130, 220);
      text('def', x + 20, ly);
      fill(200);
      text(line.substring(3), x + 20 + textWidth('def'), ly);
    } else if (line.trimStart().startsWith('return')) {
      let indent = line.length - line.trimStart().length;
      fill(200);
      text(line.substring(0, indent), x + 20, ly);
      fill(220, 60, 60);
      text('return', x + 20 + textWidth(line.substring(0, indent)), ly);
      fill(200);
      text(line.substring(indent + 6), x + 20 + textWidth(line.substring(0, indent) + 'return'), ly);
    } else if (line.trimStart().startsWith('if ') || line.trimStart().startsWith('for ') || line.trimStart().startsWith('else')) {
      let indent = line.length - line.trimStart().length;
      fill(200);
      text(line.substring(0, indent), x + 20, ly);
      let keyword = line.trimStart().split(' ')[0].replace(':', '');
      fill(200, 150, 255);
      text(keyword, x + 20 + textWidth(line.substring(0, indent)), ly);
      fill(200);
      text(line.substring(indent + keyword.length), x + 20 + textWidth(line.substring(0, indent) + keyword), ly);
    } else {
      fill(200);
      text(line, x + 20, ly);
    }

    // Annotation arrow and text
    if (p.annotations[i] && p.annotations[i].length > 0) {
      let annoX = x + w / 2 + 20;
      let annoMaxW = w / 2 - 40;

      // Arrow
      stroke(p.color[0], p.color[1], p.color[2], 80);
      strokeWeight(1);
      line(annoX - 15, ly + 6, annoX - 5, ly + 6);

      noStroke();
      fill(p.color[0], p.color[1], p.color[2], 200);
      textFont('Arial');
      textSize(Math.min(10, canvasWidth * 0.022));
      textAlign(LEFT, TOP);

      let annoText = p.annotations[i];
      text(annoText, annoX, ly);
      textFont('monospace');
      textSize(Math.min(12, canvasWidth * 0.026));
    }
  }

  textFont('Arial');

  // "When to Use" section
  let whenY = codeY + codeH + 15;

  fill(p.color);
  textAlign(LEFT, TOP);
  textSize(13);
  textStyle(BOLD);
  text('When to Use This Pattern:', x + 15, whenY);
  textStyle(NORMAL);

  fill(80);
  textSize(11);
  for (let i = 0; i < p.whenToUse.length; i++) {
    let bulletY = whenY + 20 + i * 18;

    // Bullet dot
    fill(p.color);
    noStroke();
    circle(x + 25, bulletY + 5, 6);

    fill(80);
    text(p.whenToUse[i], x + 35, bulletY);
  }

  // Pattern tip
  let tipY = whenY + 20 + p.whenToUse.length * 18 + 10;
  fill(p.color[0], p.color[1], p.color[2], 15);
  noStroke();
  rect(x + 10, tipY, w - 20, 35, 6);

  fill(p.color);
  textAlign(CENTER, CENTER);
  textSize(11);
  textStyle(ITALIC);

  let tips = [
    'Always validate input before doing expensive work!',
    'Each return path should be clearly distinct.',
    'Initialize your accumulator BEFORE the loop starts.',
    'Small, focused functions are easier to debug and test.',
  ];
  text(tips[idx], x + w / 2, tipY + 17);
  textStyle(NORMAL);
}

function drawIcon(type, cx, cy, col, scale) {
  push();
  translate(cx, cy);
  if (scale !== 1) {
    translate(0, 0);
  }

  noStroke();
  fill(col);

  if (type === 'shield') {
    // Shield icon
    beginShape();
    vertex(0 * scale, -12 * scale);
    vertex(10 * scale, -8 * scale);
    vertex(10 * scale, 2 * scale);
    vertex(0 * scale, 12 * scale);
    vertex(-10 * scale, 2 * scale);
    vertex(-10 * scale, -8 * scale);
    endShape(CLOSE);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(10 * scale);
    text('✓', 0, -1 * scale);
  } else if (type === 'fork') {
    // Fork/branch icon
    stroke(col);
    strokeWeight(2.5 * scale);
    noFill();
    line(0, -10 * scale, 0, -2 * scale);
    line(0, -2 * scale, -8 * scale, 8 * scale);
    line(0, -2 * scale, 8 * scale, 8 * scale);
    noStroke();
    fill(col);
    circle(0, -10 * scale, 5 * scale);
    circle(-8 * scale, 8 * scale, 5 * scale);
    circle(8 * scale, 8 * scale, 5 * scale);
  } else if (type === 'stack') {
    // Stack icon
    for (let i = 0; i < 3; i++) {
      let sy = -8 * scale + i * 8 * scale;
      fill(col[0], col[1], col[2], 200 - i * 40);
      rect(-10 * scale, sy, 20 * scale, 6 * scale, 2 * scale);
    }
    // Plus sign
    fill(255);
    rect(-1.5 * scale, -6 * scale, 3 * scale, 5 * scale);
    rect(-3 * scale, -5 * scale, 6 * scale, 3 * scale);
  } else if (type === 'chain') {
    // Chain links icon
    noFill();
    stroke(col);
    strokeWeight(2.5 * scale);
    // Link 1
    arc(-4 * scale, -3 * scale, 12 * scale, 12 * scale, -HALF_PI, HALF_PI);
    line(-4 * scale, -9 * scale, 2 * scale, -9 * scale);
    line(-4 * scale, 3 * scale, 2 * scale, 3 * scale);
    // Link 2
    arc(4 * scale, 3 * scale, 12 * scale, 12 * scale, HALF_PI, PI + HALF_PI);
    line(-2 * scale, -3 * scale, 4 * scale, -3 * scale);
    line(-2 * scale, 9 * scale, 4 * scale, 9 * scale);
    noStroke();
  }

  pop();
}

function mousePressed() {
  if (selectedCard >= 0) return; // already expanded

  if (hoverCard >= 0) {
    selectedCard = hoverCard;
    expanding = true;
    animProgress = 0;
  }
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
