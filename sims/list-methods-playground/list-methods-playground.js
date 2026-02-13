// List Methods Playground MicroSim
// Interactive sandbox for experimenting with Python list methods

let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// List state
let currentList = [64, 25, 12, 78, 36];
let history = [];
let hoveredIndex = -1;
let statusMessage = '';
let statusColor = '#006600';

// Animation state
let animating = false;
let animType = '';
let animProgress = 0;
let animSpeed = 0.04;
let animIndex = -1;
let animValue = null;
let prevList = [];

// Controls
let appendBtn, insertBtn, removeBtn, popBtn, sortBtn, reverseBtn, resetBtn;
let valueInput, indexInput;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  // Row 1: Method buttons
  appendBtn = createButton('append');
  appendBtn.position(10, drawHeight + 7);
  appendBtn.mousePressed(doAppend);

  insertBtn = createButton('insert');
  insertBtn.position(75, drawHeight + 7);
  insertBtn.mousePressed(doInsert);

  removeBtn = createButton('remove');
  removeBtn.position(130, drawHeight + 7);
  removeBtn.mousePressed(doRemove);

  popBtn = createButton('pop');
  popBtn.position(195, drawHeight + 7);
  popBtn.mousePressed(doPop);

  sortBtn = createButton('sort');
  sortBtn.position(238, drawHeight + 7);
  sortBtn.mousePressed(doSort);

  reverseBtn = createButton('reverse');
  reverseBtn.position(281, drawHeight + 7);
  reverseBtn.mousePressed(doReverse);

  resetBtn = createButton('Reset');
  resetBtn.position(348, drawHeight + 7);
  resetBtn.mousePressed(doReset);

  // Row 2: Value and Index inputs
  valueInput = createInput('42');
  valueInput.position(10, drawHeight + 45);
  valueInput.size(70);
  valueInput.attribute('placeholder', 'value');

  indexInput = createInput('0');
  indexInput.position(90, drawHeight + 45);
  indexInput.size(50);
  indexInput.attribute('placeholder', 'index');

  describe('Interactive playground for experimenting with Python list methods like append, insert, remove, pop, sort, and reverse', LABEL);
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
  textSize(24);
  text('List Methods Playground', canvasWidth / 2, 12);

  // Update animation
  if (animating) {
    animProgress += animSpeed;
    if (animProgress >= 1) {
      animProgress = 1;
      animating = false;
    }
  }

  // Draw the list boxes
  drawList();

  // Draw status message
  if (statusMessage !== '') {
    noStroke();
    fill(statusColor);
    textAlign(CENTER, TOP);
    textSize(14);
    text(statusMessage, canvasWidth / 2, 305);
  }

  // Draw history
  drawHistory();

  // Input labels
  noStroke();
  fill('#666');
  textAlign(LEFT, CENTER);
  textSize(12);
  text('Value:', 10, drawHeight + 40);
  text('Index:', 90, drawHeight + 40);

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawList() {
  if (currentList.length === 0) {
    fill('#666');
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(18);
    text('Empty list: []', canvasWidth / 2, 140);
    return;
  }

  let maxBoxWidth = 70;
  let gap = 6;
  let boxHeight = 50;
  let boxWidth = Math.min(maxBoxWidth, (canvasWidth - 2 * margin - gap * (currentList.length - 1)) / currentList.length);
  boxWidth = Math.max(40, boxWidth);
  let totalWidth = currentList.length * boxWidth + (currentList.length - 1) * gap;
  let startX = (canvasWidth - totalWidth) / 2;
  let boxY = 100;

  // Check hover
  hoveredIndex = -1;
  for (let i = 0; i < currentList.length; i++) {
    let bx = startX + i * (boxWidth + gap);
    if (mouseX >= bx && mouseX <= bx + boxWidth && mouseY >= boxY && mouseY <= boxY + boxHeight) {
      hoveredIndex = i;
    }
  }

  for (let i = 0; i < currentList.length; i++) {
    let bx = startX + i * (boxWidth + gap);
    let isHovered = (i === hoveredIndex);
    let alpha = 255;

    // Animation effects
    if (animating) {
      if (animType === 'append' && i === currentList.length - 1) {
        bx = lerp(canvasWidth, startX + i * (boxWidth + gap), easeOut(animProgress));
      } else if (animType === 'insert' && i === animIndex) {
        alpha = Math.floor(animProgress * 255);
      } else if (animType === 'remove' && i === animIndex && animProgress < 0.5) {
        // Flash red during removal (but item is already removed from array)
      } else if (animType === 'pop' && i === animIndex && animProgress < 0.5) {
        let yOffset = -animProgress * 60;
        boxY += yOffset;
      }
    }

    // Box color
    let boxColor;
    if (animating && animType === 'insert' && i === animIndex) {
      boxColor = lerpColor(color(255, 255, 200, alpha), color(168, 216, 234, alpha), animProgress);
    } else if (isHovered) {
      boxColor = color('#FFD700');
    } else {
      boxColor = i % 2 === 0 ? color('#A8D8EA') : color('#B5EAD7');
    }

    fill(boxColor);
    stroke(isHovered ? '#333' : '#999');
    strokeWeight(isHovered ? 2 : 1);
    rect(bx, boxY, boxWidth, boxHeight, 8);

    // Reset boxY for pop animation
    boxY = 100;

    // Index above
    noStroke();
    fill('#444');
    textAlign(CENTER, BOTTOM);
    textSize(12);
    text(i, bx + boxWidth / 2, boxY - 3);

    // Value inside
    fill('#222');
    textAlign(CENTER, CENTER);
    textSize(14);
    text(currentList[i], bx + boxWidth / 2, boxY + boxHeight / 2);
  }

  // Python code below boxes
  noStroke();
  fill('#333');
  textAlign(CENTER, TOP);
  textSize(14);
  let codeStr = '[' + currentList.join(', ') + ']';
  if (codeStr.length > 50) codeStr = codeStr.substring(0, 47) + '...]';
  text(codeStr, canvasWidth / 2, 170);

  // Hover info
  if (hoveredIndex >= 0) {
    fill('#555');
    textSize(13);
    text('list[' + hoveredIndex + '] = ' + currentList[hoveredIndex], canvasWidth / 2, 190);
  }
}

function drawHistory() {
  noStroke();
  fill('#333');
  textAlign(LEFT, TOP);
  textSize(14);
  text('History:', margin, 220);

  fill('#555');
  textSize(12);
  let startIdx = Math.max(0, history.length - 5);
  for (let i = startIdx; i < history.length; i++) {
    let y = 240 + (i - startIdx) * 18;
    text(history[i], margin + 10, y);
  }
}

function easeOut(t) {
  return 1 - Math.pow(1 - t, 3);
}

function doAppend() {
  let val = parseValue(valueInput.value());
  if (val === null) return;
  currentList.push(val);
  animType = 'append';
  animProgress = 0;
  animating = true;
  history.push('list.append(' + val + ')');
  statusMessage = 'Appended ' + val + ' to end of list';
  statusColor = '#006600';
}

function doInsert() {
  let val = parseValue(valueInput.value());
  let idx = parseInt(indexInput.value());
  if (val === null || isNaN(idx)) {
    statusMessage = 'Enter valid value and index';
    statusColor = '#CC0000';
    return;
  }
  idx = Math.max(0, Math.min(idx, currentList.length));
  currentList.splice(idx, 0, val);
  animType = 'insert';
  animIndex = idx;
  animProgress = 0;
  animating = true;
  history.push('list.insert(' + idx + ', ' + val + ')');
  statusMessage = 'Inserted ' + val + ' at index ' + idx;
  statusColor = '#006600';
}

function doRemove() {
  let val = parseValue(valueInput.value());
  if (val === null) return;
  let idx = currentList.indexOf(val);
  if (idx === -1) {
    statusMessage = 'ValueError: ' + val + ' not in list';
    statusColor = '#CC0000';
    return;
  }
  currentList.splice(idx, 1);
  history.push('list.remove(' + val + ')');
  statusMessage = 'Removed first occurrence of ' + val;
  statusColor = '#006600';
}

function doPop() {
  if (currentList.length === 0) {
    statusMessage = 'IndexError: pop from empty list';
    statusColor = '#CC0000';
    return;
  }
  let idxStr = indexInput.value().trim();
  let idx;
  if (idxStr === '' || idxStr === '-1') {
    idx = currentList.length - 1;
  } else {
    idx = parseInt(idxStr);
  }
  if (isNaN(idx) || idx < 0 || idx >= currentList.length) {
    statusMessage = 'IndexError: pop index out of range';
    statusColor = '#CC0000';
    return;
  }
  let removed = currentList.splice(idx, 1)[0];
  animType = 'pop';
  animIndex = Math.min(idx, currentList.length - 1);
  animProgress = 0;
  animating = true;
  history.push('list.pop(' + (idxStr === '' ? '' : idx) + ') -> ' + removed);
  statusMessage = 'Popped ' + removed + ' from index ' + idx;
  statusColor = '#006600';
}

function doSort() {
  currentList.sort((a, b) => a - b);
  history.push('list.sort()');
  statusMessage = 'List sorted in ascending order';
  statusColor = '#006600';
}

function doReverse() {
  currentList.reverse();
  history.push('list.reverse()');
  statusMessage = 'List reversed';
  statusColor = '#006600';
}

function doReset() {
  currentList = [64, 25, 12, 78, 36];
  history = [];
  statusMessage = 'List reset to default';
  statusColor = '#666';
  animating = false;
}

function parseValue(str) {
  str = str.trim();
  if (str === '') {
    statusMessage = 'Enter a value';
    statusColor = '#CC0000';
    return null;
  }
  let num = Number(str);
  if (!isNaN(num)) return num;
  return str;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  canvasWidth = Math.floor(container.width);
}
