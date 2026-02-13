// Stack Simulator MicroSim
// Interactive LIFO (Last In, First Out) stack demonstration
// Bloom Level: Apply (L3) - demonstrate, use

let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// Stack state
let stack = [];
let pushCounter = 0;
let statusMessage = 'Push items onto the stack to begin!';
let statusColor = '#336699';

// Animation state
let animating = false;
let animType = '';       // 'push' or 'pop'
let animProgress = 0;
let animSpeed = 0.05;
let animItem = null;     // the item being animated
let animTargetY = 0;     // where the block should end up (push) or start from (pop)

// Color palette for blocks
let blockColors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
];

// Block dimensions
let blockHeight = 36;
let blockWidth = 180;

// Controls
let valueInput, pushBtn, popBtn, clearBtn;

// Default items to suggest
let defaultItems = ['pancake', 'waffle', 'toast', 'egg', 'bacon', 'syrup'];
let defaultIndex = 0;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  // Text input
  valueInput = createInput(defaultItems[0]);
  valueInput.position(10, drawHeight + 12);
  valueInput.size(110);
  valueInput.attribute('placeholder', 'item name');

  // Push button
  pushBtn = createButton('Push');
  pushBtn.position(130, drawHeight + 12);
  pushBtn.mousePressed(doPush);

  // Pop button
  popBtn = createButton('Pop');
  popBtn.position(185, drawHeight + 12);
  popBtn.mousePressed(doPop);

  // Clear button
  clearBtn = createButton('Clear');
  clearBtn.position(238, drawHeight + 12);
  clearBtn.mousePressed(doClear);

  describe('Interactive stack simulator demonstrating LIFO (Last In First Out) behavior. Push and pop items on a visual stack of colorful blocks.', LABEL);
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
  stroke('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(22);
  text('Stack Simulator', canvasWidth / 2, 10);

  // LIFO label
  textSize(13);
  fill('#666');
  text('LIFO: Last In, First Out', canvasWidth / 2, 36);

  // Update animation
  if (animating) {
    animProgress += animSpeed;
    if (animProgress >= 1) {
      animProgress = 1;
      finishAnimation();
    }
  }

  // Draw status message
  drawStatusMessage();

  // Draw base platform
  drawBasePlatform();

  // Draw stack blocks
  drawStack();

  // Draw Python code representation
  drawPythonCode();
}

function drawStatusMessage() {
  noStroke();
  fill(statusColor);
  textAlign(CENTER, TOP);
  textSize(13);
  text(statusMessage, canvasWidth / 2, 56);
}

function drawBasePlatform() {
  let platformY = drawHeight - 40;
  let platformW = blockWidth + 40;
  let platformX = canvasWidth / 2 - platformW / 2;

  // Platform shadow
  noStroke();
  fill(200);
  rect(platformX + 3, platformY + 3, platformW, 12, 4);

  // Platform
  fill('#556B7B');
  stroke('#3D4F5F');
  strokeWeight(2);
  rect(platformX, platformY, platformW, 12, 4);

  // Platform label
  noStroke();
  fill('#8899AA');
  textAlign(CENTER, TOP);
  textSize(10);
  text('BOTTOM OF STACK', canvasWidth / 2, platformY + 16);
}

function drawStack() {
  let platformY = drawHeight - 40;
  let baseY = platformY - 4; // just above the platform

  for (let i = 0; i < stack.length; i++) {
    let item = stack[i];
    let blockX = canvasWidth / 2 - blockWidth / 2;
    let blockY = baseY - (i + 1) * (blockHeight + 4);
    let isTop = (i === stack.length - 1) && !animating;

    // Skip drawing the animating item in its stack position during pop
    if (animating && animType === 'pop' && i === stack.length - 1) {
      // Draw the popping item with animation
      let startY = blockY;
      let endY = -blockHeight - 10; // off screen above
      let currentY = lerp(startY, endY, easeIn(animProgress));
      let alpha = lerp(255, 0, animProgress);
      drawBlock(blockX, currentY, item, true, alpha);
      continue;
    }

    drawBlock(blockX, blockY, item, isTop, 255);
  }

  // Draw pushing item animation
  if (animating && animType === 'push') {
    let blockX = canvasWidth / 2 - blockWidth / 2;
    let targetY = baseY - stack.length * (blockHeight + 4);
    let startY = -blockHeight - 10; // start off screen above
    let currentY = lerp(startY, targetY, easeOut(animProgress));
    drawBlock(blockX, currentY, animItem, true, 255);
  }

  // Empty stack message
  if (stack.length === 0 && !animating) {
    fill('#999');
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(16);
    text('Stack is empty', canvasWidth / 2, drawHeight / 2 - 20);
    textSize(13);
    fill('#AAA');
    text('Type a value and click Push', canvasWidth / 2, drawHeight / 2 + 5);
  }
}

function drawBlock(x, y, item, isTop, alpha) {
  let colorIndex = (item.order - 1) % blockColors.length;
  let col = color(blockColors[colorIndex]);

  // Top block glow
  if (isTop && alpha > 200) {
    noStroke();
    let glowCol = color(blockColors[colorIndex]);
    glowCol.setAlpha(60);
    fill(glowCol);
    rect(x - 4, y - 4, blockWidth + 8, blockHeight + 8, 12);
  }

  // Block shadow
  noStroke();
  let shadowCol = color(100);
  shadowCol.setAlpha(alpha * 0.3);
  fill(shadowCol);
  rect(x + 2, y + 2, blockWidth, blockHeight, 8);

  // Block body
  col.setAlpha(alpha);
  fill(col);
  stroke(0, 0, 0, alpha * 0.3);
  strokeWeight(1.5);
  rect(x, y, blockWidth, blockHeight, 8);

  // Block text
  noStroke();
  let textCol = color(30);
  textCol.setAlpha(alpha);
  fill(textCol);
  textAlign(CENTER, CENTER);
  textSize(14);
  textStyle(BOLD);
  text('#' + item.order + ': ' + item.value, x + blockWidth / 2, y + blockHeight / 2);
  textStyle(NORMAL);

  // Top indicator arrow
  if (isTop && alpha > 200) {
    let arrowX = x + blockWidth + 12;
    let arrowY = y + blockHeight / 2;
    fill('#E74C3C');
    noStroke();
    textAlign(LEFT, CENTER);
    textSize(12);
    textStyle(BOLD);
    text('TOP', arrowX + 10, arrowY);
    textStyle(NORMAL);

    // Arrow pointing left
    stroke('#E74C3C');
    strokeWeight(2);
    line(arrowX, arrowY, arrowX + 8, arrowY);
    fill('#E74C3C');
    noStroke();
    triangle(arrowX, arrowY, arrowX + 6, arrowY - 4, arrowX + 6, arrowY + 4);
  }
}

function drawPythonCode() {
  let codeY = drawHeight - 22;
  noStroke();
  fill('#555');
  textAlign(CENTER, CENTER);
  textFont('monospace');
  textSize(11);

  let items = stack.map(s => "'" + s.value + "'");
  let codeStr = 'stack = [' + items.join(', ') + ']';

  // Truncate if too long
  if (codeStr.length > 55) {
    codeStr = codeStr.substring(0, 52) + '...]';
  }

  text(codeStr, canvasWidth / 2, codeY);
  textFont('Arial');
}

function doPush() {
  if (animating) return;

  let val = valueInput.value().trim();
  if (val === '') {
    statusMessage = 'Enter a value to push!';
    statusColor = '#CC0000';
    return;
  }

  // Check stack overflow (limit to 8 items to fit visually)
  if (stack.length >= 8) {
    statusMessage = 'Stack is full! (max 8 items for display)';
    statusColor = '#CC0000';
    return;
  }

  pushCounter++;
  animItem = { value: val, order: pushCounter };
  animType = 'push';
  animProgress = 0;
  animating = true;

  statusMessage = 'Pushing "' + val + '" onto the stack...';
  statusColor = '#006600';

  // Suggest next default item
  defaultIndex = pushCounter % defaultItems.length;
  valueInput.value(defaultItems[defaultIndex]);
}

function doPop() {
  if (animating) return;

  if (stack.length === 0) {
    statusMessage = 'Stack is empty! Nothing to pop.';
    statusColor = '#CC0000';
    return;
  }

  let topItem = stack[stack.length - 1];
  animType = 'pop';
  animProgress = 0;
  animating = true;

  statusMessage = 'Popping "' + topItem.value + '" from the stack...';
  statusColor = '#CC6600';
}

function doClear() {
  if (animating) return;
  stack = [];
  pushCounter = 0;
  defaultIndex = 0;
  valueInput.value(defaultItems[0]);
  statusMessage = 'Stack cleared! Start fresh.';
  statusColor = '#336699';
}

function finishAnimation() {
  animating = false;

  if (animType === 'push') {
    stack.push(animItem);
    statusMessage = 'Pushed "' + animItem.value + '" (item #' + animItem.order + '). Stack size: ' + stack.length;
    statusColor = '#006600';
  } else if (animType === 'pop') {
    let removed = stack.pop();
    statusMessage = 'Popped "' + removed.value + '" (item #' + removed.order + '). Stack size: ' + stack.length;
    statusColor = '#CC6600';
  }

  animItem = null;
  animType = '';
  animProgress = 0;
}

function easeOut(t) {
  return 1 - Math.pow(1 - t, 3);
}

function easeIn(t) {
  return Math.pow(t, 3);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const mainEl = document.querySelector('main');
  canvasWidth = mainEl.clientWidth;
}
