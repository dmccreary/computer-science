// Queue Simulator MicroSim
// Interactive FIFO (First In, First Out) queue demonstration
// With compare mode to contrast queue (FIFO) vs stack (LIFO)

let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// Queue and stack state
let queue = [];
let stack = [];
let enqueueCounter = 0;
let statusMessage = 'Enqueue items to begin!';
let statusColor = '#336699';
let compareMode = false;

// Animation state
let animating = false;
let animType = ''; // 'enqueue', 'dequeue'
let animProgress = 0;
let animSpeed = 0.05;
let animItem = null;

// Color palette
let blockColors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
];

// Block dimensions
let blockW = 60;
let blockH = 50;
let blockGap = 6;

// Controls
let valueInput, enqueueBtn, dequeueBtn, compareCheck, clearBtn;

// Default items
let defaultItems = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank'];
let defaultIndex = 0;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  valueInput = createInput(defaultItems[0]);
  valueInput.position(10, drawHeight + 12);
  valueInput.size(80);
  valueInput.attribute('placeholder', 'name');

  enqueueBtn = createButton('Enqueue');
  enqueueBtn.position(100, drawHeight + 12);
  enqueueBtn.mousePressed(doEnqueue);

  dequeueBtn = createButton('Dequeue');
  dequeueBtn.position(175, drawHeight + 12);
  dequeueBtn.mousePressed(doDequeue);

  compareCheck = createCheckbox('Compare', false);
  compareCheck.position(255, drawHeight + 14);
  compareCheck.changed(() => {
    compareMode = compareCheck.checked();
    doClear();
  });

  clearBtn = createButton('Clear');
  clearBtn.position(340, drawHeight + 12);
  clearBtn.mousePressed(doClear);

  describe('Interactive queue simulator demonstrating FIFO (First In First Out) behavior with optional stack comparison mode.', LABEL);
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
  text('Queue Simulator', canvasWidth / 2, 10);

  // Update animation
  if (animating) {
    animProgress += animSpeed;
    if (animProgress >= 1) {
      animProgress = 1;
      finishAnimation();
    }
  }

  // Status message
  noStroke();
  fill(statusColor);
  textAlign(CENTER, TOP);
  textSize(13);
  text(statusMessage, canvasWidth / 2, 36);

  if (compareMode) {
    drawCompareMode();
  } else {
    drawQueueOnly();
  }
}

function drawQueueOnly() {
  // FIFO label
  noStroke();
  fill('#888');
  textAlign(CENTER, TOP);
  textSize(12);
  text('FIFO: First In, First Out', canvasWidth / 2, 54);

  let queueY = 120;
  let queueAreaH = 160;

  // Queue area background
  fill(255, 255, 255, 150);
  noStroke();
  rect(margin, queueY - 20, canvasWidth - margin * 2, queueAreaH, 8);

  // Draw queue label
  noStroke();
  fill('#555');
  textAlign(LEFT, TOP);
  textSize(14);
  textStyle(BOLD);
  text('Queue', margin + 8, queueY - 16);
  textStyle(NORMAL);

  // Draw front/back labels
  if (queue.length > 0) {
    drawFrontBackLabels(margin + 20, queueY + 10, queue);
  }

  // Draw queue blocks
  drawQueueBlocks(queue, margin + 20, queueY + 10, false);

  // Empty message
  if (queue.length === 0 && !animating) {
    fill('#999');
    textAlign(CENTER, CENTER);
    textSize(15);
    text('Queue is empty', canvasWidth / 2, queueY + queueAreaH / 2 - 20);
    textSize(12);
    fill('#AAA');
    text('Type a name and click Enqueue', canvasWidth / 2, queueY + queueAreaH / 2 + 5);
  }

  // Python code
  drawPythonCode(queue, 'queue', drawHeight - 50);
}

function drawCompareMode() {
  // Top: Stack (LIFO)
  let stackY = 60;
  let sectionH = 130;

  // Stack section
  fill(255, 240, 240, 180);
  noStroke();
  rect(margin, stackY, canvasWidth - margin * 2, sectionH, 8);

  noStroke();
  fill('#E74C3C');
  textAlign(LEFT, TOP);
  textSize(13);
  textStyle(BOLD);
  text('Stack (LIFO: Last In, First Out)', margin + 8, stackY + 4);
  textStyle(NORMAL);

  drawStackBlocksHorizontal(stack, margin + 20, stackY + 25);

  if (stack.length === 0 && !animating) {
    fill('#CCC');
    textAlign(CENTER, CENTER);
    textSize(12);
    text('Empty', canvasWidth / 2, stackY + sectionH / 2 + 10);
  }

  // Divider
  stroke('#DDD');
  strokeWeight(1);
  let midY = stackY + sectionH + 8;
  line(margin + 20, midY, canvasWidth - margin - 20, midY);

  // Bottom: Queue (FIFO)
  let queueY = midY + 8;

  fill(240, 248, 255, 180);
  noStroke();
  rect(margin, queueY, canvasWidth - margin * 2, sectionH, 8);

  noStroke();
  fill('#3498DB');
  textAlign(LEFT, TOP);
  textSize(13);
  textStyle(BOLD);
  text('Queue (FIFO: First In, First Out)', margin + 8, queueY + 4);
  textStyle(NORMAL);

  if (queue.length > 0) {
    drawFrontBackLabels(margin + 20, queueY + 25, queue);
  }
  drawQueueBlocks(queue, margin + 20, queueY + 25, false);

  if (queue.length === 0 && !animating) {
    fill('#CCC');
    textAlign(CENTER, CENTER);
    textSize(12);
    text('Empty', canvasWidth / 2, queueY + sectionH / 2 + 10);
  }

  // Comparison result area
  let resultY = drawHeight - 60;
  if (stack.length > 0 || queue.length > 0) {
    noStroke();
    fill('#555');
    textFont('monospace');
    textAlign(CENTER, TOP);
    textSize(11);
    let stackItems = stack.map(s => "'" + s.value + "'");
    let queueItems = queue.map(s => "'" + s.value + "'");
    text('stack = [' + stackItems.join(', ') + ']', canvasWidth / 2, resultY);
    text('queue = [' + queueItems.join(', ') + ']', canvasWidth / 2, resultY + 16);
    textFont('Arial');
  }
}

function drawQueueBlocks(items, startX, startY, isAnimPop) {
  for (let i = 0; i < items.length; i++) {
    let item = items[i];
    let x = startX + i * (blockW + blockGap);

    // Animate dequeue (first item slides left)
    if (animating && animType === 'dequeue' && i === 0 && !compareMode) {
      let slideX = lerp(x, x - blockW - 20, easeIn(animProgress));
      let alpha = lerp(255, 0, animProgress);
      drawSingleBlock(slideX, startY, item, alpha);
      continue;
    }

    // Shift remaining items left during dequeue animation
    let drawX = x;
    if (animating && animType === 'dequeue' && i > 0 && !compareMode) {
      // Items shift left as front is removed
    }

    drawSingleBlock(drawX, startY, item, 255);
  }

  // Animate enqueue (new item slides in from right)
  if (animating && animType === 'enqueue') {
    let targetX = startX + items.length * (blockW + blockGap);
    let startAnimX = canvasWidth + blockW;
    let currentX = lerp(startAnimX, targetX, easeOut(animProgress));
    drawSingleBlock(currentX, startY, animItem, 255);
  }
}

function drawStackBlocksHorizontal(items, startX, startY) {
  for (let i = 0; i < items.length; i++) {
    let item = items[i];
    let x = startX + i * (blockW + blockGap);
    let isTop = (i === items.length - 1);
    drawSingleBlock(x, startY, item, 255);

    // TOP label on last item
    if (isTop) {
      noStroke();
      fill('#E74C3C');
      textAlign(CENTER, TOP);
      textSize(10);
      textStyle(BOLD);
      text('TOP', x + blockW / 2, startY + blockH + 4);
      textStyle(NORMAL);
    }
  }

  // Animate enqueue for stack too
  if (animating && animType === 'enqueue') {
    let targetX = startX + items.length * (blockW + blockGap);
    let startAnimX = canvasWidth + blockW;
    let currentX = lerp(startAnimX, targetX, easeOut(animProgress));
    drawSingleBlock(currentX, startY, animItem, 255);
  }
}

function drawSingleBlock(x, y, item, alpha) {
  let colorIndex = (item.order - 1) % blockColors.length;
  let col = color(blockColors[colorIndex]);

  // Shadow
  noStroke();
  let shadowCol = color(150);
  shadowCol.setAlpha(alpha * 0.3);
  fill(shadowCol);
  rect(x + 2, y + 2, blockW, blockH, 6);

  // Block
  col.setAlpha(alpha);
  fill(col);
  stroke(0, 0, 0, alpha * 0.2);
  strokeWeight(1);
  rect(x, y, blockW, blockH, 6);

  // Order number
  noStroke();
  let textC = color(255);
  textC.setAlpha(alpha);
  fill(textC);
  textAlign(CENTER, CENTER);
  textSize(10);
  text('#' + item.order, x + blockW / 2, y + 12);

  // Value
  let valC = color(30);
  valC.setAlpha(alpha);
  fill(valC);
  textSize(12);
  textStyle(BOLD);
  text(item.value, x + blockW / 2, y + 32);
  textStyle(NORMAL);
}

function drawFrontBackLabels(startX, startY, items) {
  if (items.length === 0) return;

  noStroke();
  textAlign(CENTER, TOP);
  textSize(10);
  textStyle(BOLD);

  // Front label
  fill('#27AE60');
  let frontX = startX + blockW / 2;
  text('FRONT', frontX, startY + blockH + 4);

  // Arrow
  stroke('#27AE60');
  strokeWeight(1.5);
  line(frontX, startY + blockH + 16, frontX, startY + blockH + 2);

  // Back label
  if (items.length > 1) {
    noStroke();
    fill('#3498DB');
    let backX = startX + (items.length - 1) * (blockW + blockGap) + blockW / 2;
    text('BACK', backX, startY + blockH + 4);

    stroke('#3498DB');
    strokeWeight(1.5);
    line(backX, startY + blockH + 16, backX, startY + blockH + 2);
  }

  textStyle(NORMAL);
  noStroke();
}

function drawPythonCode(items, varName, y) {
  noStroke();
  fill('#555');
  textAlign(CENTER, CENTER);
  textFont('monospace');
  textSize(11);

  let vals = items.map(s => "'" + s.value + "'");
  let codeStr = varName + ' = [' + vals.join(', ') + ']';
  if (codeStr.length > 55) {
    codeStr = codeStr.substring(0, 52) + '...]';
  }
  text(codeStr, canvasWidth / 2, y);
  textFont('Arial');
}

function doEnqueue() {
  if (animating) return;

  let val = valueInput.value().trim();
  if (val === '') {
    statusMessage = 'Enter a value to enqueue!';
    statusColor = '#CC0000';
    return;
  }

  if (queue.length >= 8) {
    statusMessage = 'Queue is full! (max 8 items for display)';
    statusColor = '#CC0000';
    return;
  }

  enqueueCounter++;
  animItem = { value: val, order: enqueueCounter };
  animType = 'enqueue';
  animProgress = 0;
  animating = true;

  statusMessage = 'Enqueuing "' + val + '" to the back...';
  statusColor = '#006600';

  defaultIndex = enqueueCounter % defaultItems.length;
  valueInput.value(defaultItems[defaultIndex]);
}

function doDequeue() {
  if (animating) return;

  if (queue.length === 0) {
    statusMessage = 'Queue is empty! Nothing to dequeue.';
    statusColor = '#CC0000';
    return;
  }

  if (compareMode) {
    // Dequeue from queue (front) and pop from stack (top)
    let qFront = queue[0];
    let sTop = stack.length > 0 ? stack[stack.length - 1] : null;

    queue.shift();
    if (stack.length > 0) stack.pop();

    let msg = 'Queue removed "' + qFront.value + '" (front)';
    if (sTop) {
      msg += ' | Stack removed "' + sTop.value + '" (top)';
    }
    statusMessage = msg;
    statusColor = '#CC6600';
    return;
  }

  animType = 'dequeue';
  animProgress = 0;
  animating = true;

  let frontItem = queue[0];
  statusMessage = 'Dequeuing "' + frontItem.value + '" from the front...';
  statusColor = '#CC6600';
}

function doClear() {
  if (animating) return;
  queue = [];
  stack = [];
  enqueueCounter = 0;
  defaultIndex = 0;
  valueInput.value(defaultItems[0]);
  statusMessage = compareMode ? 'Compare mode: see FIFO vs LIFO!' : 'Queue cleared! Start fresh.';
  statusColor = '#336699';
}

function finishAnimation() {
  animating = false;

  if (animType === 'enqueue') {
    queue.push(animItem);
    if (compareMode) {
      stack.push({ value: animItem.value, order: animItem.order });
    }
    statusMessage = 'Enqueued "' + animItem.value + '". Queue size: ' + queue.length;
    statusColor = '#006600';
  } else if (animType === 'dequeue') {
    let removed = queue.shift();
    statusMessage = 'Dequeued "' + removed.value + '" (was first in line). Queue size: ' + queue.length;
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
