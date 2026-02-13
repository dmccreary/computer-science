// Map Filter Reduce Pipeline MicroSim
// Step-through visualization of chaining map, filter, and reduce
// Bloom: Apply L3 - students predict then observe results
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;

// Controls
let mapSelect, filterSelect, reduceSelect;
let stepButton, runAllButton, resetButton;

// Pipeline data
let inputList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let mappedList = [];
let filteredList = [];
let reducedValue = null;
let rejectedList = [];

// Animation state
let stage = 0; // 0=input, 1=mapped, 2=filtered, 3=reduced
let animProgress = 0;
let animating = false;
let animSpeed = 0.03;
let autoRunning = false;
let autoTimer = 0;

// Ball animation positions
let ballPositions = [];

// Colors
let mapColor, filterColor, reduceColor, inputColor;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  mapColor = color(70, 130, 220);
  filterColor = color(46, 160, 67);
  reduceColor = color(230, 150, 50);
  inputColor = color(180, 180, 190);

  // Row 1: Buttons
  stepButton = createButton('Step');
  stepButton.position(10, drawHeight + 8);
  stepButton.mousePressed(doStep);

  runAllButton = createButton('Run All');
  runAllButton.position(65, drawHeight + 8);
  runAllButton.mousePressed(doRunAll);

  resetButton = createButton('Reset');
  resetButton.position(130, drawHeight + 8);
  resetButton.mousePressed(doReset);

  // Row 2: Selects
  mapSelect = createSelect();
  mapSelect.option('double');
  mapSelect.option('square');
  mapSelect.option('negate');
  mapSelect.option('add 10');
  mapSelect.position(50, drawHeight + 44);
  mapSelect.size(90);
  mapSelect.changed(doReset);

  filterSelect = createSelect();
  filterSelect.option('even');
  filterSelect.option('odd');
  filterSelect.option('greater than 5');
  filterSelect.option('positive');
  filterSelect.position(195, drawHeight + 44);
  filterSelect.size(105);
  filterSelect.changed(doReset);

  reduceSelect = createSelect();
  reduceSelect.option('sum');
  reduceSelect.option('product');
  reduceSelect.option('max');
  reduceSelect.option('min');
  reduceSelect.position(355, drawHeight + 44);
  reduceSelect.size(80);
  reduceSelect.changed(doReset);

  describe('Interactive pipeline visualization showing map, filter, and reduce operations on a list of numbers. Students step through each stage to see how data transforms.', LABEL);
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
  noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(18);
  text('Map \u2192 Filter \u2192 Reduce Pipeline', canvasWidth / 2, 6);

  // Draw pipeline
  drawInputSection();
  drawMapStation();
  drawFilterStation();
  drawReduceStation();
  drawArrows();
  drawPythonCode();

  // Animate
  if (animating) {
    animProgress += animSpeed;
    if (animProgress >= 1) {
      animProgress = 1;
      animating = false;
    }
  }

  // Auto run
  if (autoRunning && !animating && stage < 3) {
    autoTimer += deltaTime;
    if (autoTimer > 600) {
      autoTimer = 0;
      doStep();
    }
  }
  if (autoRunning && stage >= 3 && !animating) {
    autoRunning = false;
  }

  // Control labels row 2
  noStroke();
  fill(70, 130, 220);
  textAlign(LEFT, CENTER);
  textSize(11);
  textStyle(BOLD);
  text('Map:', 10, drawHeight + 56);
  fill(46, 160, 67);
  text('Filter:', 150, drawHeight + 56);
  fill(230, 150, 50);
  text('Reduce:', 305, drawHeight + 56);
  textStyle(NORMAL);
}

// ---- Apply operations ----

function applyMap(val) {
  let op = mapSelect.value();
  if (op === 'double') return val * 2;
  if (op === 'square') return val * val;
  if (op === 'negate') return -val;
  if (op === 'add 10') return val + 10;
  return val;
}

function applyFilter(val) {
  let cond = filterSelect.value();
  if (cond === 'even') return val % 2 === 0;
  if (cond === 'odd') return val % 2 !== 0;
  if (cond === 'greater than 5') return val > 5;
  if (cond === 'positive') return val > 0;
  return true;
}

function applyReduce(arr) {
  let op = reduceSelect.value();
  if (arr.length === 0) return op === 'sum' ? 0 : op === 'product' ? 1 : 'N/A';
  if (op === 'sum') return arr.reduce((a, b) => a + b, 0);
  if (op === 'product') return arr.reduce((a, b) => a * b, 1);
  if (op === 'max') return arr.reduce((a, b) => Math.max(a, b));
  if (op === 'min') return arr.reduce((a, b) => Math.min(a, b));
  return 0;
}

function getMapCode() {
  let op = mapSelect.value();
  if (op === 'double') return 'map(lambda x: x * 2, nums)';
  if (op === 'square') return 'map(lambda x: x ** 2, nums)';
  if (op === 'negate') return 'map(lambda x: -x, nums)';
  if (op === 'add 10') return 'map(lambda x: x + 10, nums)';
  return '';
}

function getFilterCode() {
  let cond = filterSelect.value();
  if (cond === 'even') return 'filter(lambda x: x % 2 == 0, mapped)';
  if (cond === 'odd') return 'filter(lambda x: x % 2 != 0, mapped)';
  if (cond === 'greater than 5') return 'filter(lambda x: x > 5, mapped)';
  if (cond === 'positive') return 'filter(lambda x: x > 0, mapped)';
  return '';
}

function getReduceCode() {
  let op = reduceSelect.value();
  if (op === 'sum') return 'reduce(lambda a, b: a + b, filtered)';
  if (op === 'product') return 'reduce(lambda a, b: a * b, filtered)';
  if (op === 'max') return 'reduce(lambda a, b: max(a, b), filtered)';
  if (op === 'min') return 'reduce(lambda a, b: min(a, b), filtered)';
  return '';
}

// ---- Drawing helpers ----

function drawBall(cx, cy, val, col, r) {
  if (!r) r = 20;
  fill(col);
  noStroke();
  ellipse(cx, cy, r * 2, r * 2);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(r > 16 ? 12 : 10);
  textStyle(BOLD);
  text(val, cx, cy);
  textStyle(NORMAL);
}

function drawRejectedBall(cx, cy, val, r) {
  if (!r) r = 16;
  fill(220, 220, 220, 120);
  noStroke();
  ellipse(cx, cy, r * 2, r * 2);
  fill(180, 180, 180);
  textAlign(CENTER, CENTER);
  textSize(10);
  text(val, cx, cy);
  // X mark
  stroke(200, 80, 80, 160);
  strokeWeight(2);
  line(cx - r * 0.5, cy - r * 0.5, cx + r * 0.5, cy + r * 0.5);
  line(cx + r * 0.5, cy - r * 0.5, cx - r * 0.5, cy + r * 0.5);
  noStroke();
}

function drawStationBox(x, y, w, h, label, col, active) {
  let a = active ? 255 : 80;
  stroke(red(col), green(col), blue(col), a);
  strokeWeight(active ? 2.5 : 1);
  fill(red(col), green(col), blue(col), active ? 30 : 10);
  rect(x, y, w, h, 10);

  noStroke();
  fill(red(col), green(col), blue(col), a);
  textAlign(CENTER, TOP);
  textSize(14);
  textStyle(BOLD);
  text(label, x + w / 2, y + 5);
  textStyle(NORMAL);
}

// ---- Section drawing ----

function drawInputSection() {
  let sectionX = margin;
  let sectionY = 30;
  let sectionW = canvasWidth - margin * 2;

  noStroke();
  fill(120);
  textAlign(LEFT, TOP);
  textSize(12);
  text('Input: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]', sectionX, sectionY);

  // Draw input balls
  let ballR = Math.min(16, (sectionW - 20) / (inputList.length * 2.5));
  let totalW = inputList.length * (ballR * 2 + 4) - 4;
  let startX = canvasWidth / 2 - totalW / 2 + ballR;
  let ballY = sectionY + 30;

  for (let i = 0; i < inputList.length; i++) {
    let bx = startX + i * (ballR * 2 + 4);
    drawBall(bx, ballY, inputList[i], inputColor, ballR);
  }
}

function drawMapStation() {
  let stationW = (canvasWidth - margin * 4) / 3;
  let stationH = 110;
  let stationX = margin;
  let stationY = 80;
  let active = stage >= 1;

  drawStationBox(stationX, stationY, stationW, stationH, 'MAP', mapColor, active);

  if (stage >= 1) {
    let items = mappedList;
    let ballR = Math.min(13, (stationW - 20) / (items.length * 2.5));
    let cols = Math.min(items.length, 5);
    let rows = Math.ceil(items.length / cols);
    let innerW = cols * (ballR * 2 + 3) - 3;
    let startX = stationX + stationW / 2 - innerW / 2 + ballR;
    let startY = stationY + 28;

    for (let i = 0; i < items.length; i++) {
      let row = Math.floor(i / cols);
      let col = i % cols;
      let bx = startX + col * (ballR * 2 + 3);
      let by = startY + row * (ballR * 2 + 3);

      let t = (stage === 1 && animating) ? constrain(animProgress * items.length - i, 0, 1) : 1;
      let a = t * 255;
      let c = color(red(mapColor), green(mapColor), blue(mapColor), a);
      if (t > 0) drawBall(bx, by, items[i], c, ballR);
    }

    // Label showing operation
    noStroke();
    fill(red(mapColor), green(mapColor), blue(mapColor));
    textAlign(CENTER, BOTTOM);
    textSize(10);
    text('x \u2192 ' + describeMap(), stationX + stationW / 2, stationY + stationH - 4);
  }
}

function drawFilterStation() {
  let stationW = (canvasWidth - margin * 4) / 3;
  let stationH = 110;
  let stationX = margin + stationW + margin;
  let stationY = 80;
  let active = stage >= 2;

  drawStationBox(stationX, stationY, stationW, stationH, 'FILTER', filterColor, active);

  if (stage >= 2) {
    // Accepted items
    let items = filteredList;
    let ballR = Math.min(13, (stationW - 20) / (Math.max(items.length, 1) * 2.5));
    let cols = Math.min(items.length, 5);
    let rows = Math.ceil(Math.max(items.length, 1) / Math.max(cols, 1));
    let innerW = cols * (ballR * 2 + 3) - 3;
    let startX = stationX + stationW / 2 - innerW / 2 + ballR;
    let startY = stationY + 28;

    for (let i = 0; i < items.length; i++) {
      let row = Math.floor(i / cols);
      let col = i % cols;
      let bx = startX + col * (ballR * 2 + 3);
      let by = startY + row * (ballR * 2 + 3);

      let t = (stage === 2 && animating) ? constrain(animProgress * (items.length + rejectedList.length) - i, 0, 1) : 1;
      let a = t * 255;
      let c = color(red(filterColor), green(filterColor), blue(filterColor), a);
      if (t > 0) drawBall(bx, by, items[i], c, ballR);
    }

    // Rejected items below
    let rejY = stationY + stationH - 26;
    let rejR = Math.min(10, (stationW - 20) / (Math.max(rejectedList.length, 1) * 2.5));
    let rejW = rejectedList.length * (rejR * 2 + 2) - 2;
    let rejStartX = stationX + stationW / 2 - rejW / 2 + rejR;

    for (let i = 0; i < rejectedList.length; i++) {
      let bx = rejStartX + i * (rejR * 2 + 2);
      let t = (stage === 2 && animating) ? constrain(animProgress * (filteredList.length + rejectedList.length) - (filteredList.length + i), 0, 1) : 1;
      if (t > 0) drawRejectedBall(bx, rejY, rejectedList[i], rejR);
    }

    // Filter label
    noStroke();
    fill(red(filterColor), green(filterColor), blue(filterColor));
    textAlign(CENTER, BOTTOM);
    textSize(10);
    text('keep if ' + describeFilter(), stationX + stationW / 2, stationY + stationH - 4);
  }
}

function drawReduceStation() {
  let stationW = (canvasWidth - margin * 4) / 3;
  let stationH = 110;
  let stationX = margin + (stationW + margin) * 2;
  let stationY = 80;
  let active = stage >= 3;

  drawStationBox(stationX, stationY, stationW, stationH, 'REDUCE', reduceColor, active);

  if (stage >= 3) {
    let t = animating ? animProgress : 1;
    let ballR = 28;

    // Shrinking balls merge into one
    if (t < 0.6) {
      // Show filtered balls converging
      let numBalls = filteredList.length;
      let progress = t / 0.6;
      for (let i = 0; i < numBalls; i++) {
        let angle = (TWO_PI / numBalls) * i - HALF_PI;
        let spreadR = lerp(35, 0, progress);
        let bx = stationX + stationW / 2 + cos(angle) * spreadR;
        let by = stationY + stationH / 2 + 5 + sin(angle) * spreadR;
        let r = lerp(10, 0, progress);
        if (r > 1) {
          let c = lerpColor(filterColor, reduceColor, progress);
          drawBall(bx, by, filteredList[i], c, r);
        }
      }
    }

    // Final result ball
    if (t >= 0.5) {
      let appear = constrain((t - 0.5) / 0.5, 0, 1);
      let r = lerp(5, ballR, appear);
      let cx = stationX + stationW / 2;
      let cy = stationY + stationH / 2 + 5;
      let c = color(red(reduceColor), green(reduceColor), blue(reduceColor), appear * 255);
      drawBall(cx, cy, reducedValue, c, r);
    }

    // Reduce label
    noStroke();
    fill(red(reduceColor), green(reduceColor), blue(reduceColor));
    textAlign(CENTER, BOTTOM);
    textSize(10);
    text(reduceSelect.value(), stationX + stationW / 2, stationY + stationH - 4);
  }
}

function drawArrows() {
  let stationW = (canvasWidth - margin * 4) / 3;
  let arrowY = 135;
  let gapSize = margin;

  // Arrow from MAP to FILTER
  let ax1 = margin + stationW;
  let ax2 = margin + stationW + gapSize;
  drawArrow(ax1, arrowY, ax2, arrowY, stage >= 2 ? mapColor : color(200));

  // Arrow from FILTER to REDUCE
  let ax3 = margin + (stationW + margin) * 2 - margin;
  let ax4 = margin + (stationW + margin) * 2;
  drawArrow(ax3, arrowY, ax4, arrowY, stage >= 3 ? filterColor : color(200));

  // Intermediate results between stations
  if (stage >= 1) {
    // Show mapped list count above MAP->FILTER arrow
    noStroke();
    fill(100);
    textAlign(CENTER, BOTTOM);
    textSize(9);
    text(mappedList.length + ' items', (ax1 + ax2) / 2, arrowY - 5);
  }

  if (stage >= 2) {
    // Show filtered list count above FILTER->REDUCE arrow
    noStroke();
    fill(100);
    textAlign(CENTER, BOTTOM);
    textSize(9);
    text(filteredList.length + ' items', (ax3 + ax4) / 2, arrowY - 5);
  }
}

function drawArrow(x1, y1, x2, y2, col) {
  stroke(col);
  strokeWeight(2);
  line(x1 + 4, y1, x2 - 6, y2);
  // Arrowhead
  noStroke();
  fill(col);
  let angle = atan2(y2 - y1, x2 - x1);
  push();
  translate(x2 - 2, y2);
  rotate(angle);
  triangle(-10, -5, -10, 5, 0, 0);
  pop();
}

function drawPythonCode() {
  let codeY = 200;
  let codeH = 80;
  let codeX = margin;
  let codeW = canvasWidth - margin * 2;

  // Dark code box
  fill(30, 30, 42);
  stroke(80);
  strokeWeight(1);
  rect(codeX, codeY, codeW, codeH, 8);

  textFont('monospace');
  textAlign(LEFT, TOP);
  noStroke();
  let ly = codeY + 8;
  let lineH = 16;
  let codeSize = Math.min(12, canvasWidth * 0.022);
  textSize(codeSize);

  // Line 1: input
  fill(180, 200, 220);
  text('nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]', codeX + 10, ly);
  if (stage === 0) drawHighlightBar(codeX + 6, ly - 2, codeW - 12, lineH);

  // Line 2: map
  ly += lineH;
  let mapActive = stage === 1;
  if (mapActive) drawHighlightBar(codeX + 6, ly - 2, codeW - 12, lineH);
  fill(130, 180, 255);
  text('mapped  = list(' + getMapCode() + ')', codeX + 10, ly);

  // Line 3: filter
  ly += lineH;
  let filterActive = stage === 2;
  if (filterActive) drawHighlightBar(codeX + 6, ly - 2, codeW - 12, lineH);
  fill(120, 220, 140);
  text('filtered = list(' + getFilterCode() + ')', codeX + 10, ly);

  // Line 4: reduce
  ly += lineH;
  let reduceActive = stage === 3;
  if (reduceActive) drawHighlightBar(codeX + 6, ly - 2, codeW - 12, lineH);
  fill(250, 200, 120);
  text('result   = ' + getReduceCode(), codeX + 10, ly);

  textFont('Arial');

  // Results display below code
  let resY = codeY + codeH + 10;

  if (stage >= 1) {
    drawResultLine(margin, resY, 'mapped', formatList(mappedList), mapColor);
  }
  if (stage >= 2) {
    drawResultLine(margin, resY + 20, 'filtered', formatList(filteredList), filterColor);
  }
  if (stage >= 3) {
    drawResultLine(margin, resY + 40, 'result', String(reducedValue), reduceColor);
  }

  // Step indicator
  drawStepIndicator(resY + 68);
}

function drawHighlightBar(x, y, w, h) {
  noStroke();
  fill(255, 255, 100, 30);
  rect(x, y, w, h, 3);
}

function drawResultLine(x, y, label, value, col) {
  noStroke();
  fill(red(col), green(col), blue(col));
  textAlign(LEFT, TOP);
  textSize(12);
  textStyle(BOLD);
  text(label + ':', x, y);
  textStyle(NORMAL);
  fill(60);
  textSize(11);
  text(value, x + textWidth(label + ': ') + 4, y + 1);
}

function drawStepIndicator(y) {
  let dotR = 10;
  let labels = ['Input', 'Map', 'Filter', 'Reduce'];
  let colors = [inputColor, mapColor, filterColor, reduceColor];
  let totalW = labels.length * 70;
  let startX = canvasWidth / 2 - totalW / 2;

  for (let i = 0; i < labels.length; i++) {
    let cx = startX + i * 70 + 10;
    let cy = y + dotR;

    if (i <= stage) {
      fill(colors[i]);
    } else {
      fill(220);
    }
    noStroke();
    ellipse(cx, cy, dotR * 2, dotR * 2);

    fill(i <= stage ? 255 : 160);
    textAlign(CENTER, CENTER);
    textSize(10);
    textStyle(BOLD);
    text(i + 1, cx, cy);
    textStyle(NORMAL);

    // Label
    noStroke();
    fill(i <= stage ? 60 : 180);
    textAlign(CENTER, TOP);
    textSize(9);
    text(labels[i], cx, cy + dotR + 3);

    // Connector line
    if (i < labels.length - 1) {
      stroke(i < stage ? colors[i + 1] : color(210));
      strokeWeight(1.5);
      line(cx + dotR + 2, cy, cx + 70 - dotR - 12, cy);
      noStroke();
    }
  }
}

function formatList(arr) {
  if (arr.length === 0) return '[]';
  return '[' + arr.join(', ') + ']';
}

function describeMap() {
  let op = mapSelect.value();
  if (op === 'double') return 'x * 2';
  if (op === 'square') return 'x\u00B2';
  if (op === 'negate') return '-x';
  if (op === 'add 10') return 'x + 10';
  return '';
}

function describeFilter() {
  let cond = filterSelect.value();
  if (cond === 'even') return 'x % 2 == 0';
  if (cond === 'odd') return 'x % 2 != 0';
  if (cond === 'greater than 5') return 'x > 5';
  if (cond === 'positive') return 'x > 0';
  return '';
}

// ---- Actions ----

function doStep() {
  if (animating) return;
  if (stage >= 3) return;

  stage++;
  animating = true;
  animProgress = 0;

  if (stage === 1) {
    mappedList = inputList.map(v => applyMap(v));
  } else if (stage === 2) {
    filteredList = [];
    rejectedList = [];
    for (let v of mappedList) {
      if (applyFilter(v)) {
        filteredList.push(v);
      } else {
        rejectedList.push(v);
      }
    }
  } else if (stage === 3) {
    reducedValue = applyReduce(filteredList);
  }
}

function doRunAll() {
  if (stage >= 3) doReset();
  autoRunning = true;
  autoTimer = 0;
  doStep();
}

function doReset() {
  stage = 0;
  mappedList = [];
  filteredList = [];
  rejectedList = [];
  reducedValue = null;
  animating = false;
  animProgress = 0;
  autoRunning = false;
  autoTimer = 0;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const mainEl = document.querySelector('main');
  canvasWidth = mainEl.clientWidth;
}
