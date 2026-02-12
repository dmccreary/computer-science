// Arguments vs Parameters MicroSim
// Color-coded matching between arguments and parameters
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
let tab1Button, tab2Button, tab3Button;

// State
let currentTab = 0;
let hoveredParam = -1;
let animProgress = 0;
let switchingTab = false;

let paramColors = [
  [70, 130, 220],   // name - blue
  [46, 160, 67],    // age - green
  [230, 150, 50],   // city - orange
];

let tabLabels = ['Positional', 'Keyword', 'Default Used'];

let tabs = [
  {
    label: 'Positional',
    callCode: 'make_profile("Alice", 16, "Austin")',
    args: [
      { text: '"Alice"', paramIdx: 0, x: 0, w: 0 },
      { text: '16', paramIdx: 1, x: 0, w: 0 },
      { text: '"Austin"', paramIdx: 2, x: 0, w: 0 },
    ],
    output: '"Alice, age 16, from Austin"',
    note: 'Arguments are matched to parameters by position (left to right).',
  },
  {
    label: 'Keyword',
    callCode: 'make_profile(age=16, name="Alice", city="Austin")',
    args: [
      { text: 'age=16', paramIdx: 1, x: 0, w: 0 },
      { text: 'name="Alice"', paramIdx: 0, x: 0, w: 0 },
      { text: 'city="Austin"', paramIdx: 2, x: 0, w: 0 },
    ],
    output: '"Alice, age 16, from Austin"',
    note: 'Keyword arguments can be in any order — Python matches by name.',
  },
  {
    label: 'Default Used',
    callCode: 'make_profile("Alice", 16)',
    args: [
      { text: '"Alice"', paramIdx: 0, x: 0, w: 0 },
      { text: '16', paramIdx: 1, x: 0, w: 0 },
    ],
    output: '"Alice, age 16, from Unknown"',
    note: 'No city argument given — Python uses the default value "Unknown".',
  },
];

// Parameter positions (calculated in draw)
let paramPositions = [
  { x: 0, w: 0, y: 0 }, // name
  { x: 0, w: 0, y: 0 }, // age
  { x: 0, w: 0, y: 0 }, // city
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  tab1Button = createButton('Positional');
  tab1Button.position(10, drawHeight + 12);
  tab1Button.mousePressed(() => switchTab(0));

  tab2Button = createButton('Keyword');
  tab2Button.position(100, drawHeight + 12);
  tab2Button.mousePressed(() => switchTab(1));

  tab3Button = createButton('Default');
  tab3Button.position(180, drawHeight + 12);
  tab3Button.mousePressed(() => switchTab(2));

  describe('Interactive comparison of positional, keyword, and default arguments in Python functions.', LABEL);
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
  text('Arguments vs Parameters', canvasWidth / 2, 8);

  // Tab indicator
  drawTabIndicator();

  // Definition panel
  drawDefinition();

  // Connecting lines
  drawConnections();

  // Call panel
  drawCall();

  // Output
  drawOutput();

  // Animation
  if (switchingTab) {
    animProgress += 0.04;
    if (animProgress >= 1) {
      animProgress = 1;
      switchingTab = false;
    }
  }

  // Style active tab button
  styleTabButtons();
}

function drawTabIndicator() {
  let y = 30;

  noStroke();
  textSize(11);
  textAlign(CENTER, CENTER);

  for (let i = 0; i < 3; i++) {
    let tabW = (canvasWidth - margin * 2) / 3;
    let tx = margin + i * tabW;

    if (i === currentTab) {
      fill(70, 130, 220, 30);
      rect(tx, y, tabW, 20, 4);
      fill(70, 130, 220);
    } else {
      fill(180);
    }
    textStyle(i === currentTab ? BOLD : NORMAL);
    text(tabLabels[i], tx + tabW / 2, y + 10);
  }
  textStyle(NORMAL);
}

function drawDefinition() {
  let y = 58;
  let h = 75;

  // Panel
  fill(30, 30, 42);
  stroke(80);
  strokeWeight(1);
  rect(margin, y, canvasWidth - margin * 2, h, 8);

  // Label
  noStroke();
  fill(200);
  textAlign(LEFT, TOP);
  textSize(10);
  text('Function Definition (parameters):', margin + 10, y + 6);

  // Code with colored parameters
  textFont('monospace');
  textSize(Math.min(13, canvasWidth * 0.028));
  let tx = margin + 10;
  let ty = y + 26;

  fill(70, 130, 220);
  text('def', tx, ty);
  tx += textWidth('def');
  fill(200);
  text(' make_profile(', tx, ty);
  tx += textWidth(' make_profile(');

  // name parameter
  let nameX = tx;
  fill(paramColors[0]);
  text('name', tx, ty);
  let nameW = textWidth('name');
  paramPositions[0] = { x: nameX, w: nameW, y: ty + 10 };
  tx += nameW;

  fill(200);
  text(', ', tx, ty);
  tx += textWidth(', ');

  // age parameter
  let ageX = tx;
  fill(paramColors[1]);
  text('age', tx, ty);
  let ageW = textWidth('age');
  paramPositions[1] = { x: ageX, w: ageW, y: ty + 10 };
  tx += ageW;

  fill(200);
  text(', ', tx, ty);
  tx += textWidth(', ');

  // city parameter with default
  let cityX = tx;
  fill(paramColors[2]);
  text('city', tx, ty);
  let cityW = textWidth('city');
  paramPositions[2] = { x: cityX, w: cityW, y: ty + 10 };
  tx += cityW;

  fill(200);
  text('=', tx, ty);
  tx += textWidth('=');
  fill(180, 220, 180);
  text('"Unknown"', tx, ty);
  tx += textWidth('"Unknown"');
  fill(200);
  text('):', tx, ty);

  // Default value indicator
  if (currentTab === 2) {
    // Highlight default value
    noFill();
    stroke(paramColors[2][0], paramColors[2][1], paramColors[2][2]);
    strokeWeight(2);
    let dw = textWidth('city="Unknown"');
    setLineDash([4, 4]);
    rect(cityX - 3, ty - 3, dw + 6, 20, 3);
    setLineDash([]);

    // Glow effect
    let glowAlpha = 100 + sin(frameCount * 0.08) * 60;
    fill(paramColors[2][0], paramColors[2][1], paramColors[2][2], glowAlpha);
    noStroke();
    rect(cityX - 3, ty - 3, dw + 6, 20, 3);
  }

  // Return line
  let ry = ty + 22;
  noStroke();
  fill(220, 60, 60);
  text('    return', margin + 10, ry);
  fill(200);
  text(' f"{name}, age {age}, from {city}"', margin + 10 + textWidth('    return'), ry);

  textFont('Arial');

  // Check hover on parameters
  hoveredParam = -1;
  for (let i = 0; i < 3; i++) {
    let p = paramPositions[i];
    if (mouseX > p.x - 3 && mouseX < p.x + p.w + 3 && mouseY > p.y - 12 && mouseY < p.y + 12) {
      hoveredParam = i;
    }
  }
}

function drawCall() {
  let y = 240;
  let h = 65;
  let tab = tabs[currentTab];

  // Panel
  fill(30, 30, 42);
  stroke(80);
  strokeWeight(1);
  rect(margin, y, canvasWidth - margin * 2, h, 8);

  // Label
  noStroke();
  fill(200);
  textAlign(LEFT, TOP);
  textSize(10);
  text('Function Call (arguments):', margin + 10, y + 6);

  // Code
  textFont('monospace');
  textSize(Math.min(13, canvasWidth * 0.028));
  let tx = margin + 10;
  let ty = y + 26;

  // Parse and draw call with colored args
  fill(200);
  text('make_profile(', tx, ty);
  tx += textWidth('make_profile(');

  let t = switchingTab ? animProgress : 1;

  for (let i = 0; i < tab.args.length; i++) {
    let arg = tab.args[i];
    arg.x = tx;
    let col = paramColors[arg.paramIdx];
    fill(col[0], col[1], col[2], 50 + 205 * t);
    text(arg.text, tx, ty);
    arg.w = textWidth(arg.text);
    tx += arg.w;

    if (i < tab.args.length - 1) {
      fill(200);
      text(', ', tx, ty);
      tx += textWidth(', ');
    }
  }
  fill(200);
  text(')', tx, ty);

  // Store arg Y for connections
  for (let arg of tab.args) {
    arg.y = ty;
  }

  // Note
  noStroke();
  fill(180);
  textFont('Arial');
  textSize(10);
  textAlign(LEFT, TOP);
  text(tab.note, margin + 10, y + h - 18);

  textFont('Arial');
}

function drawConnections() {
  let tab = tabs[currentTab];
  let t = switchingTab ? animProgress : 1;

  if (t < 0.2) return;
  let lineAlpha = Math.min(255, (t - 0.2) * 1.25 * 255);

  for (let i = 0; i < tab.args.length; i++) {
    let arg = tab.args[i];
    let param = paramPositions[arg.paramIdx];
    let col = paramColors[arg.paramIdx];

    let isHovered = (hoveredParam === arg.paramIdx);
    let sw = isHovered ? 3 : 2;
    let alpha = isHovered ? 255 : lineAlpha * 0.6;

    // Curved line from param bottom to arg top
    let fromX = param.x + param.w / 2;
    let fromY = param.y + 12;
    let toX = arg.x + arg.w / 2;
    let toY = arg.y - 4;

    stroke(col[0], col[1], col[2], alpha);
    strokeWeight(sw);
    noFill();

    let midY = (fromY + toY) / 2;
    bezier(fromX, fromY, fromX, midY + 20, toX, midY - 20, toX, toY);

    // Arrowhead
    fill(col[0], col[1], col[2], alpha);
    noStroke();
    triangle(toX, toY, toX - 4, toY - 8, toX + 4, toY - 8);

    // Highlight param and arg on hover
    if (isHovered) {
      noFill();
      stroke(col[0], col[1], col[2], 150);
      strokeWeight(2);
      rect(param.x - 3, param.y - 12, param.w + 6, 20, 3);
      rect(arg.x - 3, arg.y - 3, arg.w + 6, 20, 3);
    }
  }

  // For default tab, draw dashed line to city parameter
  if (currentTab === 2) {
    let param = paramPositions[2];
    let col = paramColors[2];

    stroke(col[0], col[1], col[2], lineAlpha * 0.4);
    strokeWeight(2);
    setLineDash([5, 5]);

    let fromX = param.x + param.w / 2;
    let fromY = param.y + 12;
    let toY = 264;

    // Draw a label instead of connection
    noStroke();
    setLineDash([]);
    fill(col[0], col[1], col[2], lineAlpha * 0.8);
    textAlign(CENTER, CENTER);
    textSize(11);
    textStyle(ITALIC);
    text('uses default: "Unknown"', canvasWidth - margin - 80, 210);
    textStyle(NORMAL);
  }
}

function drawOutput() {
  let y = 325;
  let tab = tabs[currentTab];
  let t = switchingTab ? Math.max(0, (animProgress - 0.5) * 2) : 1;

  // Output box
  fill(240, 255, 240, 50 + 205 * t);
  stroke(46, 160, 67, 50 + 205 * t);
  strokeWeight(2);
  rect(margin, y, canvasWidth - margin * 2, 40, 8);

  noStroke();
  fill(80, 80, 80, 50 + 205 * t);
  textAlign(CENTER, TOP);
  textSize(11);
  text('Output:', canvasWidth / 2, y - 16);

  fill(30, 100, 30, 50 + 205 * t);
  textFont('monospace');
  textAlign(CENTER, CENTER);
  textSize(14);
  textStyle(BOLD);
  text(tab.output, canvasWidth / 2, y + 20);
  textStyle(NORMAL);
  textFont('Arial');

  // Key concepts
  let keyY = y + 55;
  noStroke();
  fill(80);
  textAlign(CENTER, TOP);
  textSize(12);
  textStyle(BOLD);
  text('Key Concept', canvasWidth / 2, keyY);
  textStyle(NORMAL);

  fill(100);
  textSize(11);
  if (currentTab === 0) {
    text('Parameters are in the definition. Arguments are in the call.', canvasWidth / 2, keyY + 18);
    text('Positional: matched left-to-right by position.', canvasWidth / 2, keyY + 34);
  } else if (currentTab === 1) {
    text('Keyword arguments use name=value syntax.', canvasWidth / 2, keyY + 18);
    text('Order doesn\'t matter when you use keywords!', canvasWidth / 2, keyY + 34);
  } else {
    text('Default parameters have a fallback value.', canvasWidth / 2, keyY + 18);
    text('If no argument is passed, the default is used.', canvasWidth / 2, keyY + 34);
  }
}

function switchTab(idx) {
  if (idx === currentTab) return;
  currentTab = idx;
  switchingTab = true;
  animProgress = 0;
}

function styleTabButtons() {
  let buttons = [tab1Button, tab2Button, tab3Button];
  for (let i = 0; i < buttons.length; i++) {
    if (i === currentTab) {
      buttons[i].style('font-weight', 'bold');
      buttons[i].style('background-color', '#e8f0fe');
    } else {
      buttons[i].style('font-weight', 'normal');
      buttons[i].style('background-color', '#ffffff');
    }
  }
}

function setLineDash(pattern) {
  drawingContext.setLineDash(pattern);
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
