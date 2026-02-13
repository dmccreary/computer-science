// Zip Function Visualizer MicroSim
// Animated visualization of how zip() pairs elements from multiple lists

let canvasWidth = 400;
let drawHeight = 430;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// List data
let list1 = ["Alice", "Bob", "Charlie"];
let list2 = [92, 85, 78];
let list3 = ["A", "B", "C+"];
let useThreeLists = false;

// Animation state
let animStep = -1; // -1 = not started, 0..n = pairing step
let animProgress = 0; // 0..1 within current step
let isAnimating = false;
let animSpeed = 0.03;
let pairedResults = [];

// Controls
let zipBtn, stepBtn, resetBtn, listToggle;
let list1Input, list2Input, list3Input;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  // Row 1: Buttons
  zipBtn = createButton('Zip!');
  zipBtn.position(10, drawHeight + 10);
  zipBtn.mousePressed(doZipAll);

  stepBtn = createButton('Step');
  stepBtn.position(55, drawHeight + 10);
  stepBtn.mousePressed(doStepZip);

  resetBtn = createButton('Reset');
  resetBtn.position(105, drawHeight + 10);
  resetBtn.mousePressed(doReset);

  listToggle = createButton('3 Lists');
  listToggle.position(170, drawHeight + 10);
  listToggle.mousePressed(toggleListCount);

  list1Input = createInput('Alice, Bob, Charlie');
  list1Input.position(240, drawHeight + 10);
  list1Input.size(canvasWidth - 250 - margin);
  list1Input.attribute('placeholder', 'List 1');
  list1Input.changed(updateLists);

  describe('Animated visualization of Python zip function pairing elements from multiple lists', LABEL);
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
  text('Zip Function Visualizer', canvasWidth / 2, 8);

  // Update animation
  if (isAnimating) {
    animProgress += animSpeed;
    if (animProgress >= 1) {
      animProgress = 1;
      isAnimating = false;
      // Add to paired results
      if (animStep >= 0 && animStep < getMinLen()) {
        addPairResult(animStep);
      }
    }
  }

  // Draw the lists and animation
  if (useThreeLists) {
    drawThreeListMode();
  } else {
    drawTwoListMode();
  }

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawTwoListMode() {
  let colW = canvasWidth / 3;

  // List 1 (left column)
  drawListColumn(list1, 'List 1', margin, 40, colW - margin, '#A8D8EA', '#3A86B5');

  // List 2 (right column, before zip)
  drawListColumn(list2, 'List 2', colW * 2, 40, colW - margin, '#B5EAD7', '#4A9B6E');

  // Center: Zipper zone / results
  drawZipperZone(colW, 40, colW);

  // Output tuples at bottom
  drawOutput(margin, 320, canvasWidth - 2 * margin);
}

function drawThreeListMode() {
  let colW = canvasWidth / 4;

  drawListColumn(list1, 'List 1', margin, 40, colW - 10, '#A8D8EA', '#3A86B5');
  drawListColumn(list2, 'List 2', colW + 5, 40, colW - 10, '#B5EAD7', '#4A9B6E');
  drawListColumn(list3, 'List 3', colW * 2 + 5, 40, colW - 10, '#F8C8A8', '#C47A3A');

  // Results in last column
  drawZipperZone(colW * 3, 40, colW - margin);
  drawOutput(margin, 330, canvasWidth - 2 * margin);
}

function drawListColumn(items, label, x, y, w, bgColor, textCol) {
  // Label
  noStroke();
  fill(textCol);
  textAlign(CENTER, TOP);
  textSize(14);
  text(label, x + w / 2, y);

  let boxH = 35;
  let gap = 5;
  let boxW = Math.min(100, w - 10);
  let startX = x + (w - boxW) / 2;

  let minLen = getMinLen();

  for (let i = 0; i < items.length; i++) {
    let by = y + 22 + i * (boxH + gap);
    let isPaired = (i < animStep) || (i === animStep && animProgress >= 1);
    let isCurrentlyAnimating = (i === animStep && isAnimating);
    let isSkipped = (i >= minLen);

    // Box
    if (isSkipped) {
      fill('#DDD');
      stroke('#BBB');
    } else if (isPaired) {
      fill('#D4EDDA');
      stroke('#999');
    } else if (isCurrentlyAnimating) {
      // Glow effect
      fill(lerpColor(color(bgColor), color('#FFD700'), animProgress));
      stroke('#B8860B');
    } else {
      fill(bgColor);
      stroke('#999');
    }
    strokeWeight(1);
    rect(startX, by, boxW, boxH, 6);

    // Value
    noStroke();
    fill(isSkipped ? '#999' : '#333');
    textAlign(CENTER, CENTER);
    textSize(13);
    let displayVal = typeof items[i] === 'string' ? '"' + items[i] + '"' : items[i];
    text(displayVal, startX + boxW / 2, by + boxH / 2);

    // Skipped label
    if (isSkipped) {
      fill('#CC0000');
      textSize(10);
      text('skipped', startX + boxW / 2, by + boxH + 2);
    }
  }
}

function drawZipperZone(x, y, w) {
  noStroke();
  fill('#666');
  textAlign(CENTER, TOP);
  textSize(13);
  text('Paired', x + w / 2, y);

  // Draw arrow animation for current step
  if (isAnimating && animStep >= 0) {
    stroke('#FF6600');
    strokeWeight(2);
    let arrowY = y + 22 + animStep * 40 + 17;

    // Arrows from sides converging to center
    let progress = easeOut(animProgress);
    let centerX = x + w / 2;

    // Left arrow
    let leftStartX = x - 20;
    let leftEndX = lerp(leftStartX, centerX - 10, progress);
    line(leftStartX, arrowY, leftEndX, arrowY);

    if (!useThreeLists) {
      // Right arrow
      let rightStartX = x + w + 20;
      let rightEndX = lerp(rightStartX, centerX + 10, progress);
      line(rightStartX, arrowY, rightEndX, arrowY);
    }
  }
}

function drawOutput(x, y, w) {
  noStroke();
  fill('#333');
  textAlign(LEFT, TOP);
  textSize(14);
  text('Result:', x, y);

  if (pairedResults.length === 0 && animStep === -1) {
    fill('#888');
    textSize(13);
    text('Click "Zip!" or "Step" to begin', x + 60, y);
    return;
  }

  // Show paired tuples
  fill('#663399');
  textSize(13);
  textFont('monospace');

  let resultStr = 'zip() = [';
  for (let i = 0; i < pairedResults.length; i++) {
    if (i > 0) resultStr += ', ';
    resultStr += pairedResults[i];
  }
  if (animStep >= getMinLen() - 1 && !isAnimating) {
    resultStr += ']';
  } else {
    resultStr += ' ...';
  }

  // Wrap long text
  textAlign(LEFT, TOP);
  let maxW = w - 10;
  if (textWidth(resultStr) > maxW) {
    // Simple word wrap
    let lines = wrapText(resultStr, maxW);
    for (let i = 0; i < lines.length; i++) {
      text(lines[i], x, y + 20 + i * 18);
    }
  } else {
    text(resultStr, x, y + 20);
  }
  textFont('sans-serif');
}

function wrapText(str, maxW) {
  let lines = [];
  let current = '';
  for (let i = 0; i < str.length; i++) {
    current += str[i];
    if (textWidth(current) > maxW) {
      lines.push(current);
      current = '';
    }
  }
  if (current.length > 0) lines.push(current);
  return lines;
}

function getMinLen() {
  if (useThreeLists) {
    return Math.min(list1.length, list2.length, list3.length);
  }
  return Math.min(list1.length, list2.length);
}

function addPairResult(idx) {
  let pair;
  if (useThreeLists) {
    pair = '(' + formatVal(list1[idx]) + ', ' + formatVal(list2[idx]) + ', ' + formatVal(list3[idx]) + ')';
  } else {
    pair = '(' + formatVal(list1[idx]) + ', ' + formatVal(list2[idx]) + ')';
  }
  if (!pairedResults.includes(pair)) {
    pairedResults.push(pair);
  }
}

function formatVal(v) {
  return typeof v === 'string' ? '"' + v + '"' : v;
}

function easeOut(t) {
  return 1 - Math.pow(1 - t, 3);
}

function doZipAll() {
  doReset();
  animStep = 0;
  isAnimating = true;
  // Chain all steps
  autoZipAll();
}

function autoZipAll() {
  let minLen = getMinLen();
  if (animStep >= minLen) return;

  isAnimating = true;
  animProgress = 0;

  let checkDone = setInterval(() => {
    if (!isAnimating) {
      animStep++;
      if (animStep < minLen) {
        animProgress = 0;
        isAnimating = true;
      } else {
        clearInterval(checkDone);
      }
    }
  }, 50);
}

function doStepZip() {
  if (animStep < 0) animStep = 0;
  else if (!isAnimating) {
    if (animStep < getMinLen() - 1) {
      animStep++;
    } else {
      return;
    }
  }
  animProgress = 0;
  isAnimating = true;
}

function doReset() {
  animStep = -1;
  animProgress = 0;
  isAnimating = false;
  pairedResults = [];
}

function toggleListCount() {
  useThreeLists = !useThreeLists;
  listToggle.html(useThreeLists ? '2 Lists' : '3 Lists');
  doReset();
}

function updateLists() {
  let val = list1Input.value().trim();
  if (val) {
    list1 = val.split(',').map(s => {
      s = s.trim();
      let n = Number(s);
      return isNaN(n) ? s : n;
    });
  }
  doReset();
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  list1Input.size(canvasWidth - 250 - margin);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  canvasWidth = Math.floor(container.width);
}
