// Factorial Recursion Tree MicroSim
// Step-through visualization of recursive factorial calls
// Students trace calls going down and return values cascading back up
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 400;
let drawHeight = 450;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 120;
let defaultTextSize = 16;

// Controls
let nSlider, speedSlider;
let stepFwdButton, stepReturnButton, autoButton, resetButton;

// State
let n = 5;
let nodes = [];          // array of node objects for each call level
let revealedDown = 0;    // how many call nodes are revealed (going down)
let revealedUp = 0;      // how many return values are revealed (going back up)
let phase = 'down';      // 'down', 'up', or 'done'
let autoPlay = false;
let autoTimer = 0;
let pulseTimer = 0;

function buildNodes(val) {
  nodes = [];
  for (let i = val; i >= 0; i--) {
    let isBase = (i === 0);
    let callText = 'factorial(' + i + ')';
    let computeText;
    if (isBase) {
      computeText = 'Base case! Return 1';
    } else {
      computeText = i + ' \u00D7 factorial(' + (i - 1) + ')';
    }
    let returnVal = factorial(i);
    let returnText;
    if (isBase) {
      returnText = '= 1';
    } else {
      returnText = i + ' \u00D7 ' + factorial(i - 1) + ' = ' + returnVal;
    }
    nodes.push({
      level: val - i,
      n: i,
      callText: callText,
      computeText: computeText,
      returnVal: returnVal,
      returnText: returnText,
      isBase: isBase,
    });
  }
}

function factorial(x) {
  if (x <= 0) return 1;
  return x * factorial(x - 1);
}

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  // N slider
  nSlider = createSlider(1, 8, 5, 1);
  nSlider.position(sliderLeftMargin, drawHeight + 15);
  nSlider.size(100);
  nSlider.input(onNChange);

  stepFwdButton = createButton('Step Forward');
  stepFwdButton.mousePressed(doStepForward);

  stepReturnButton = createButton('Step Return');
  stepReturnButton.mousePressed(doStepReturn);

  autoButton = createButton('Auto Play');
  autoButton.mousePressed(toggleAuto);

  resetButton = createButton('Reset');
  resetButton.mousePressed(doReset);

  speedSlider = createSlider(0.5, 3, 1.5, 0.1);
  speedSlider.size(70);

  buildNodes(5);

  describe('Step-through visualization of recursive factorial calls. Nodes appear going down showing each recursive call, then return values cascade back up.', LABEL);
}

function draw() {
  updateCanvasSize();
  positionControls();
  pulseTimer += deltaTime * 0.003;

  // Drawing area
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  // Control area
  fill('white');
  noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Check if n changed
  let newN = nSlider.value();
  if (newN !== n) {
    n = newN;
    buildNodes(n);
    revealedDown = 0;
    revealedUp = 0;
    phase = 'down';
    autoPlay = false;
    autoTimer = 0;
    autoButton.html('Auto Play');
  }

  // Title
  noStroke();
  fill(0);
  textAlign(CENTER, TOP);
  textSize(18);
  textStyle(BOLD);
  text('Factorial Recursion Tree', canvasWidth / 2, 8);
  textStyle(NORMAL);

  // Draw the chain of nodes
  drawNodeChain();

  // Draw final result
  drawFinalResult();

  // Draw control labels
  drawControlLabels();

  // Auto play logic
  if (autoPlay) {
    autoTimer += deltaTime;
    let delay = 1200 / speedSlider.value();
    if (autoTimer > delay) {
      autoTimer = 0;
      if (phase === 'down') {
        doStepForward();
      } else if (phase === 'up') {
        doStepReturn();
      } else {
        autoPlay = false;
        autoButton.html('Auto Play');
      }
    }
  }
}

function positionControls() {
  nSlider.position(sliderLeftMargin, drawHeight + 15);

  let btnX = sliderLeftMargin + 110;
  let btnY = drawHeight + 12;
  let gap = 6;

  stepFwdButton.position(btnX, btnY);
  btnX += stepFwdButton.size().width + gap;

  stepReturnButton.position(btnX, btnY);
  btnX += stepReturnButton.size().width + gap;

  autoButton.position(btnX, btnY);
  btnX += autoButton.size().width + gap;

  resetButton.position(btnX, btnY);
  btnX += resetButton.size().width + gap + 10;

  speedSlider.position(btnX + 42, drawHeight + 15);
}

function drawControlLabels() {
  noStroke();
  fill(80);
  textAlign(LEFT, CENTER);
  textSize(12);
  text('n = ' + n, margin, drawHeight + 25);

  // Speed label
  let speedX = speedSlider.x;
  fill(80);
  textSize(11);
  textAlign(LEFT, CENTER);
  text('Speed:', speedX - 42, drawHeight + 25);
}

function drawNodeChain() {
  let totalNodes = nodes.length;
  if (totalNodes === 0) return;

  // Layout calculations
  let topY = 38;
  let bottomPadding = 60;
  let availableH = drawHeight - topY - bottomPadding;
  let nodeH = 42;
  let badgeSpace = 60;
  let nodeW = Math.min(260, canvasWidth - margin * 2 - badgeSpace);
  let centerX = (canvasWidth - badgeSpace / 2) / 2;

  // Calculate vertical spacing
  let spacing;
  if (totalNodes > 1) {
    spacing = Math.min(52, (availableH - nodeH) / (totalNodes - 1));
  } else {
    spacing = 0;
  }
  let totalChainH = nodeH + (totalNodes - 1) * spacing;

  let startY = topY + (availableH - totalChainH) / 2;

  for (let i = 0; i < totalNodes; i++) {
    let node = nodes[i];
    let nx = centerX - nodeW / 2;
    let ny = startY + i * spacing;
    let isRevealed = i < revealedDown;
    let isActive = false;

    if (!isRevealed) continue;

    // Determine if this node is active (pulsing)
    if (phase === 'down' && i === revealedDown - 1) {
      isActive = true;
    } else if (phase === 'up') {
      let returnIndex = totalNodes - 1 - revealedUp;
      if (i === returnIndex) {
        isActive = true;
      }
    }

    // Determine if return value is shown
    let showReturn = false;
    if (phase === 'up' || phase === 'done') {
      let nodeFromBottom = totalNodes - 1 - i;
      if (nodeFromBottom < revealedUp) {
        showReturn = true;
      }
    }

    // Draw arrow from previous node to this one
    if (i > 0) {
      let prevY = startY + (i - 1) * spacing + nodeH;
      let arrowX = centerX;

      // Down arrow (call)
      stroke(100, 140, 200);
      strokeWeight(2);
      line(arrowX - 15, prevY + 2, arrowX - 15, ny - 2);
      // Arrowhead down
      noStroke();
      fill(100, 140, 200);
      triangle(arrowX - 15, ny - 1, arrowX - 20, ny - 8, arrowX - 10, ny - 8);

      // Up arrow (return) -- only show if return value revealed for this pair
      let thisNodeFromBottom = totalNodes - 1 - i;
      if (showReturn && (phase === 'up' || phase === 'done')) {
        if (thisNodeFromBottom < revealedUp) {
          stroke(200, 170, 50);
          strokeWeight(2);
          line(arrowX + 15, ny - 2, arrowX + 15, prevY + 2);
          // Arrowhead up
          noStroke();
          fill(200, 170, 50);
          triangle(arrowX + 15, prevY + 1, arrowX + 10, prevY + 8, arrowX + 20, prevY + 8);
        }
      }
    }

    // Node background
    let bgColor, borderColor;
    if (node.isBase) {
      bgColor = showReturn ? color(220, 245, 220) : color(200, 235, 200);
      borderColor = color(40, 160, 60);
    } else if (showReturn) {
      bgColor = color(255, 248, 220);
      borderColor = color(200, 170, 50);
    } else {
      bgColor = color(220, 235, 255);
      borderColor = color(70, 130, 220);
    }

    // Pulsing border for active node
    if (isActive) {
      let pulseAlpha = map(sin(pulseTimer * 4), -1, 1, 150, 255);
      strokeWeight(3);
      stroke(red(borderColor), green(borderColor), blue(borderColor), pulseAlpha);
    } else {
      strokeWeight(2);
      stroke(borderColor);
    }

    fill(bgColor);
    rect(nx, ny, nodeW, nodeH, 10);

    // Node content
    noStroke();
    textAlign(LEFT, CENTER);
    let textXLeft = nx + 12;
    let midY = ny + nodeH / 2;

    // Call text
    textSize(Math.min(14, canvasWidth * 0.028));
    textStyle(BOLD);
    fill(node.isBase ? color(30, 120, 40) : color(50, 90, 170));
    text(node.callText, textXLeft, midY - 8);
    textStyle(NORMAL);

    // Compute text (smaller, underneath)
    textSize(Math.min(11, canvasWidth * 0.023));
    fill(100);
    text(node.computeText, textXLeft, midY + 10);

    // Base case star
    if (node.isBase) {
      textSize(16);
      textAlign(RIGHT, CENTER);
      fill(40, 160, 60);
      text('\u2605', nx + nodeW - 10, midY - 8);
    }

    // Return value (shown on right side of node)
    if (showReturn) {
      textAlign(RIGHT, CENTER);
      textSize(Math.min(13, canvasWidth * 0.026));
      textStyle(BOLD);
      fill(180, 140, 20);
      text(node.returnText, nx + nodeW - 10, midY + 10);

      // Return value badge
      let badgeX = nx + nodeW + 4;
      let badgeY = midY;
      let badgeW = Math.min(50, canvasWidth * 0.1);

      fill(255, 215, 0);
      stroke(200, 170, 50);
      strokeWeight(1);
      rect(badgeX, badgeY - 12, badgeW, 24, 12);

      noStroke();
      fill(80, 60, 0);
      textAlign(CENTER, CENTER);
      textSize(Math.min(13, canvasWidth * 0.026));
      textStyle(BOLD);
      text(node.returnVal, badgeX + badgeW / 2, badgeY);
      textStyle(NORMAL);
    }
  }

  // Step indicator
  drawStepIndicator();
}

function drawStepIndicator() {
  let totalSteps = nodes.length * 2;
  let currentStepNum = revealedDown + revealedUp;

  noStroke();
  fill(120);
  textAlign(CENTER, TOP);
  textSize(11);

  let indicatorY = drawHeight - 26;
  let phaseText;
  if (phase === 'down') {
    phaseText = 'Calling down... (' + revealedDown + '/' + nodes.length + ')';
  } else if (phase === 'up') {
    phaseText = 'Returning up... (' + revealedUp + '/' + nodes.length + ')';
  } else {
    phaseText = 'Complete!';
  }
  text(phaseText, canvasWidth / 2, indicatorY);

  // Progress dots
  let dotR = 5;
  let maxDotsVisible = Math.min(totalSteps, 20);
  let dotSpacing = dotR * 2 + 3;
  let totalDotsW = maxDotsVisible * dotSpacing;
  let startDotX = canvasWidth / 2 - totalDotsW / 2;
  let dotY = indicatorY + 16;

  for (let i = 0; i < maxDotsVisible; i++) {
    let dx = startDotX + i * dotSpacing + dotR;
    let isCallDot = i < nodes.length;

    if (i < currentStepNum) {
      if (isCallDot) {
        fill(70, 130, 220);
      } else {
        fill(200, 170, 50);
      }
    } else {
      fill(220);
    }
    noStroke();
    circle(dx, dotY, dotR * 2);
  }
}

function drawFinalResult() {
  if (phase !== 'done') return;

  let resultY = drawHeight - 52;
  let resultW = Math.min(300, canvasWidth - margin * 4);
  let resultX = canvasWidth / 2 - resultW / 2;

  fill(255, 248, 220);
  stroke(200, 170, 50);
  strokeWeight(2);
  rect(resultX, resultY, resultW, 28, 8);

  noStroke();
  fill(80, 60, 0);
  textAlign(CENTER, CENTER);
  textSize(15);
  textStyle(BOLD);
  text(n + '! = ' + factorial(n), canvasWidth / 2, resultY + 14);
  textStyle(NORMAL);
}

function doStepForward() {
  if (phase === 'down') {
    if (revealedDown < nodes.length) {
      revealedDown++;
      // If we just revealed the base case, switch to up phase
      if (revealedDown === nodes.length) {
        phase = 'up';
        // Auto-reveal the base case return (it is self-evident)
        revealedUp = 1;
      }
    }
  }
}

function doStepReturn() {
  if (phase === 'up') {
    if (revealedUp < nodes.length) {
      revealedUp++;
      if (revealedUp >= nodes.length) {
        phase = 'done';
        autoPlay = false;
        autoButton.html('Auto Play');
      }
    }
  }
}

function toggleAuto() {
  autoPlay = !autoPlay;
  autoTimer = 0;
  autoButton.html(autoPlay ? 'Pause' : 'Auto Play');
  if (autoPlay && phase === 'done') {
    doReset();
  }
}

function doReset() {
  revealedDown = 0;
  revealedUp = 0;
  phase = 'down';
  autoPlay = false;
  autoTimer = 0;
  autoButton.html('Auto Play');
}

function onNChange() {
  // Rebuild when slider moves — handled in draw() to stay reactive
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const mainEl = document.querySelector('main');
  canvasWidth = mainEl.clientWidth;
}
