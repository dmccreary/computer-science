// Function Call Flow MicroSim
// Step-through animation of function call execution
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
let stepButton, autoButton, resetButton;
let speedSlider;

// State
let currentStep = 0;
let maxSteps = 6;
let autoPlay = false;
let autoTimer = 0;
let animProgress = 0;
let animating = false;

// Bubble animation
let bubbleX = 0;
let bubbleY = 0;
let bubbleTarget = { x: 0, y: 0 };
let bubbleStart = { x: 0, y: 0 };
let bubbleValue = '';
let bubbleColor = [];

let steps = [
  {
    callerHighlight: 0,
    funcHighlight: -1,
    narration: 'Python sees a function call: add(3, 5)',
    bubble: null,
  },
  {
    callerHighlight: 0,
    funcHighlight: 0,
    narration: 'Argument 3 is assigned to parameter a',
    bubble: { value: '3', color: [70, 130, 220], from: 'caller', to: 'paramA' },
  },
  {
    callerHighlight: 0,
    funcHighlight: 0,
    narration: 'Argument 5 is assigned to parameter b',
    bubble: { value: '5', color: [46, 160, 67], from: 'caller', to: 'paramB' },
  },
  {
    callerHighlight: 0,
    funcHighlight: 1,
    narration: 'Python evaluates a + b = 3 + 5 = 8',
    bubble: null,
  },
  {
    callerHighlight: 0,
    funcHighlight: 1,
    narration: 'The return value 8 is sent back and stored in x',
    bubble: { value: '8', color: [220, 60, 60], from: 'func', to: 'callerX' },
  },
  {
    callerHighlight: 1,
    funcHighlight: -1,
    narration: 'Python prints x, which is 8',
    bubble: null,
  },
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  stepButton = createButton('Step');
  stepButton.position(10, drawHeight + 12);
  stepButton.mousePressed(doStep);

  autoButton = createButton('Auto Play');
  autoButton.position(65, drawHeight + 12);
  autoButton.mousePressed(toggleAuto);

  resetButton = createButton('Reset');
  resetButton.position(145, drawHeight + 12);
  resetButton.mousePressed(doReset);

  speedSlider = createSlider(0.5, 3, 1.5, 0.1);
  speedSlider.position(230, drawHeight + 16);
  speedSlider.size(80);

  describe('Step-through animation showing how a function call works, with arguments flowing in and return value flowing back.', LABEL);
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
  text('Function Call Flow', canvasWidth / 2, 8);

  let halfW = canvasWidth / 2;

  // Draw panels
  drawCallerPanel(margin, 38, halfW - margin - 15);
  drawFunctionPanel(halfW + 10, 38, halfW - margin - 15);

  // Draw connecting arrows/bubbles
  drawConnections(halfW);

  // Draw narration bar
  drawNarration();

  // Draw step indicator
  drawStepIndicator();

  // Animate bubbles
  if (animating) {
    animProgress += 0.02 * speedSlider.value();
    if (animProgress >= 1) {
      animProgress = 1;
      animating = false;
    }
  }

  // Auto play
  if (autoPlay && !animating && currentStep < maxSteps) {
    autoTimer += deltaTime;
    let delay = 1500 / speedSlider.value();
    if (autoTimer > delay) {
      autoTimer = 0;
      doStep();
    }
  }

  // Control labels
  noStroke();
  fill(80);
  textAlign(LEFT, CENTER);
  textSize(11);
  text('Speed:', 200, drawHeight + 25);
}

function drawCallerPanel(x, y, w) {
  let h = 130;

  // Panel background
  fill(235, 245, 255);
  stroke(70, 130, 220);
  strokeWeight(2);
  rect(x, y, w, h, 8);

  // Header
  noStroke();
  fill(70, 130, 220);
  textAlign(CENTER, TOP);
  textSize(13);
  textStyle(BOLD);
  text('Caller Code', x + w / 2, y + 8);
  textStyle(NORMAL);

  // Code
  textFont('monospace');
  textAlign(LEFT, TOP);
  textSize(Math.min(14, canvasWidth * 0.03));

  let codeY = y + 32;
  let lineH = 30;
  let callerLines = ['x = add(3, 5)', 'print(x)'];

  for (let i = 0; i < callerLines.length; i++) {
    let ly = codeY + i * lineH;
    let step = steps[currentStep];

    // Highlight
    if (step && step.callerHighlight === i) {
      fill(255, 255, 150, 180);
      noStroke();
      rect(x + 8, ly - 2, w - 16, lineH - 4, 4);
    }

    noStroke();

    if (i === 0) {
      // x = add(3, 5) with coloring
      fill(200, 200, 220);
      text('x', x + 15, ly);
      fill(180);
      text(' = ', x + 15 + textWidth('x'), ly);
      fill(100, 200, 100);
      text('add', x + 15 + textWidth('x = '), ly);
      fill(180);
      text('(', x + 15 + textWidth('x = add'), ly);
      fill(70, 130, 220);
      text('3', x + 15 + textWidth('x = add('), ly);
      fill(180);
      text(', ', x + 15 + textWidth('x = add(3'), ly);
      fill(46, 160, 67);
      text('5', x + 15 + textWidth('x = add(3, '), ly);
      fill(180);
      text(')', x + 15 + textWidth('x = add(3, 5'), ly);
    } else {
      fill(100, 200, 100);
      text('print', x + 15, ly);
      fill(180);
      text('(x)', x + 15 + textWidth('print'), ly);
    }

    // Show x value after step 5
    if (i === 0 && currentStep >= 5) {
      fill(220, 60, 60);
      textSize(11);
      text('# x = 8', x + 15 + textWidth('x = add(3, 5)  '), ly + 2);
      textSize(Math.min(14, canvasWidth * 0.03));
    }
  }

  // Output at step 6
  if (currentStep >= 6) {
    fill(240, 255, 240);
    stroke(46, 160, 67);
    strokeWeight(1);
    rect(x + 8, codeY + lineH * 2 + 5, w - 16, 24, 4);
    noStroke();
    fill(30, 100, 30);
    textSize(12);
    text('Output: 8', x + 15, codeY + lineH * 2 + 10);
  }

  textFont('Arial');
}

function drawFunctionPanel(x, y, w) {
  let h = 130;

  // Panel background
  fill(235, 255, 235);
  stroke(46, 160, 67);
  strokeWeight(2);
  rect(x, y, w, h, 8);

  // Header
  noStroke();
  fill(46, 160, 67);
  textAlign(CENTER, TOP);
  textSize(13);
  textStyle(BOLD);
  text('Function Definition', x + w / 2, y + 8);
  textStyle(NORMAL);

  // Code
  textFont('monospace');
  textAlign(LEFT, TOP);
  textSize(Math.min(14, canvasWidth * 0.03));

  let codeY = y + 32;
  let lineH = 30;
  let funcLines = ['def add(a, b):', '    return a + b'];

  for (let i = 0; i < funcLines.length; i++) {
    let ly = codeY + i * lineH;
    let step = steps[currentStep];

    // Highlight
    if (step && step.funcHighlight === i) {
      fill(255, 255, 150, 180);
      noStroke();
      rect(x + 8, ly - 2, w - 16, lineH - 4, 4);
    }

    noStroke();

    if (i === 0) {
      fill(70, 130, 220);
      text('def', x + 15, ly);
      fill(100, 200, 100);
      text(' add', x + 15 + textWidth('def'), ly);
      fill(180);
      text('(', x + 15 + textWidth('def add'), ly);
      fill(70, 130, 220);
      text('a', x + 15 + textWidth('def add('), ly);
      fill(180);
      text(', ', x + 15 + textWidth('def add(a'), ly);
      fill(46, 160, 67);
      text('b', x + 15 + textWidth('def add(a, '), ly);
      fill(180);
      text('):', x + 15 + textWidth('def add(a, b'), ly);
    } else {
      fill(220, 60, 60);
      text('    return', x + 15, ly);
      fill(180);
      text(' a + b', x + 15 + textWidth('    return'), ly);
    }

    // Show param values at appropriate steps
    if (i === 0 && currentStep >= 2 && currentStep <= 5) {
      fill(100);
      textSize(10);
      let valStr = currentStep >= 3 ? '# a=3, b=5' : '# a=3';
      text(valStr, x + 15, ly + lineH - 8);
      textSize(Math.min(14, canvasWidth * 0.03));
    }

    // Show computation at step 4
    if (i === 1 && currentStep >= 4 && currentStep <= 5) {
      fill(220, 60, 60);
      textSize(11);
      text('# 3 + 5 = 8', x + 15 + textWidth('    return a + b  '), ly + 2);
      textSize(Math.min(14, canvasWidth * 0.03));
    }
  }

  textFont('Arial');
}

function drawConnections(halfW) {
  let step = steps[currentStep];
  if (!step || !step.bubble) return;

  let b = step.bubble;
  let callerPanelRight = halfW - 15;
  let funcPanelLeft = halfW + 10;
  let panelY = 38;

  let fromX, fromY, toX, toY;

  if (b.from === 'caller') {
    fromX = callerPanelRight;
    fromY = panelY + 55;
    toX = funcPanelLeft;
    toY = b.to === 'paramA' ? panelY + 55 : panelY + 60;
  } else {
    fromX = funcPanelLeft;
    fromY = panelY + 85;
    toX = callerPanelRight;
    toY = panelY + 55;
  }

  // Arrow line
  stroke(b.color[0], b.color[1], b.color[2], 100);
  strokeWeight(2);
  let dashLen = 8;
  let dx = toX - fromX;
  let dy = toY - fromY;
  let dist = Math.sqrt(dx * dx + dy * dy);
  let steps2 = Math.floor(dist / dashLen);
  for (let i = 0; i < steps2; i += 2) {
    let t1 = i / steps2;
    let t2 = Math.min((i + 1) / steps2, 1);
    line(
      fromX + dx * t1, fromY + dy * t1,
      fromX + dx * t2, fromY + dy * t2
    );
  }

  // Animated bubble
  let t = animating ? animProgress : 1;
  let bx = lerp(fromX, toX, t);
  let by = lerp(fromY, toY, t);

  // Bubble
  fill(b.color[0], b.color[1], b.color[2]);
  noStroke();
  circle(bx, by, 32);

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(14);
  textStyle(BOLD);
  text(b.value, bx, by);
  textStyle(NORMAL);

  // Arrowhead at target
  if (!animating || animProgress > 0.8) {
    let angle = atan2(toY - fromY, toX - fromX);
    fill(b.color[0], b.color[1], b.color[2], 150);
    noStroke();
    push();
    translate(toX, toY);
    rotate(angle);
    triangle(-12, -6, -12, 6, 0, 0);
    pop();
  }
}

function drawNarration() {
  let y = 190;
  let step = steps[currentStep];

  fill(248, 248, 252);
  stroke(200);
  strokeWeight(1);
  rect(margin, y, canvasWidth - margin * 2, 40, 8);

  if (step) {
    noStroke();
    fill(60);
    textAlign(CENTER, CENTER);
    textSize(13);
    text(step.narration, canvasWidth / 2, y + 20);
  } else {
    noStroke();
    fill(150);
    textAlign(CENTER, CENTER);
    textSize(13);
    text('Click "Step" or "Auto Play" to begin', canvasWidth / 2, y + 20);
  }
}

function drawStepIndicator() {
  let y = 245;

  noStroke();
  fill(120);
  textAlign(CENTER, TOP);
  textSize(11);
  text('Step ' + currentStep + ' of ' + maxSteps, canvasWidth / 2, y);

  // Progress dots
  let dotR = 8;
  let totalW = maxSteps * (dotR * 2 + 8);
  let startX = canvasWidth / 2 - totalW / 2;

  for (let i = 1; i <= maxSteps; i++) {
    let dx = startX + (i - 1) * (dotR * 2 + 8) + dotR;
    let dy = y + 22;

    if (i < currentStep) {
      fill(46, 160, 67);
    } else if (i === currentStep) {
      fill(70, 130, 220);
    } else {
      fill(220);
    }
    noStroke();
    circle(dx, dy, dotR * 2);

    fill(i <= currentStep ? 255 : 150);
    textAlign(CENTER, CENTER);
    textSize(9);
    text(i, dx, dy);
  }

  // Summary diagram below progress
  drawSummaryDiagram(y + 48);
}

function drawSummaryDiagram(y) {
  let boxW = canvasWidth * 0.3;
  let boxH = 60;
  let gap = canvasWidth * 0.08;
  let callerX = canvasWidth / 2 - boxW - gap / 2;
  let funcX = canvasWidth / 2 + gap / 2;

  // Caller summary box
  let callerActive = currentStep >= 1;
  fill(callerActive ? [235, 245, 255] : [245]);
  stroke(callerActive ? [70, 130, 220] : [200]);
  strokeWeight(callerActive ? 2 : 1);
  rect(callerX, y, boxW, boxH, 8);

  noStroke();
  fill(callerActive ? [70, 130, 220] : [180]);
  textAlign(CENTER, CENTER);
  textSize(11);
  textStyle(BOLD);
  text('Caller', callerX + boxW / 2, y + 14);
  textStyle(NORMAL);
  textSize(10);
  fill(callerActive ? [60] : [180]);
  text('x = add(3, 5)', callerX + boxW / 2, y + 32);

  if (currentStep >= 5) {
    fill(220, 60, 60);
    textStyle(BOLD);
    text('x = 8', callerX + boxW / 2, y + 48);
    textStyle(NORMAL);
  }

  // Function summary box
  let funcActive = currentStep >= 2 && currentStep <= 5;
  fill(funcActive ? [235, 255, 235] : [245]);
  stroke(funcActive ? [46, 160, 67] : [200]);
  strokeWeight(funcActive ? 2 : 1);
  rect(funcX, y, boxW, boxH, 8);

  noStroke();
  fill(funcActive ? [46, 160, 67] : [180]);
  textAlign(CENTER, CENTER);
  textSize(11);
  textStyle(BOLD);
  text('Function: add', funcX + boxW / 2, y + 14);
  textStyle(NORMAL);
  textSize(10);
  fill(funcActive ? [60] : [180]);

  if (currentStep >= 2 && currentStep <= 5) {
    text('a=3, b=5', funcX + boxW / 2, y + 32);
    if (currentStep >= 4) {
      fill(220, 60, 60);
      textStyle(BOLD);
      text('returns 8', funcX + boxW / 2, y + 48);
      textStyle(NORMAL);
    }
  } else {
    text('def add(a, b)', funcX + boxW / 2, y + 32);
  }

  // Arrows between boxes
  if (currentStep >= 1 && currentStep <= 3) {
    // Arrow from caller to function
    stroke(70, 130, 220);
    strokeWeight(2);
    let arrowY = y + boxH / 2;
    line(callerX + boxW, arrowY - 5, funcX, arrowY - 5);
    // Arrowhead
    noStroke();
    fill(70, 130, 220);
    triangle(funcX, arrowY - 5, funcX - 8, arrowY - 10, funcX - 8, arrowY);
  }
  if (currentStep >= 4 && currentStep <= 5) {
    // Arrow from function back to caller
    stroke(220, 60, 60);
    strokeWeight(2);
    let arrowY = y + boxH / 2;
    line(funcX, arrowY + 5, callerX + boxW, arrowY + 5);
    // Arrowhead
    noStroke();
    fill(220, 60, 60);
    triangle(callerX + boxW, arrowY + 5, callerX + boxW + 8, arrowY, callerX + boxW + 8, arrowY + 10);
  }
}

function doStep() {
  if (currentStep < maxSteps) {
    currentStep++;
    let step = steps[currentStep];
    if (step && step.bubble) {
      animating = true;
      animProgress = 0;
    }
  } else {
    autoPlay = false;
    autoButton.html('Auto Play');
  }
}

function toggleAuto() {
  autoPlay = !autoPlay;
  autoTimer = 0;
  autoButton.html(autoPlay ? 'Pause' : 'Auto Play');
  if (autoPlay && currentStep >= maxSteps) {
    doReset();
  }
}

function doReset() {
  currentStep = 0;
  animating = false;
  animProgress = 0;
  autoPlay = false;
  autoTimer = 0;
  autoButton.html('Auto Play');
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
