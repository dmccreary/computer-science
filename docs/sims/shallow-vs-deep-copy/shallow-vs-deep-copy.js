// Shallow vs Deep Copy Visualizer MicroSim
// Side-by-side comparison of shallow copy vs deep copy for nested lists

let canvasWidth = 400;
let drawHeight = 420;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// State
let phase = 'initial'; // 'initial', 'copied', 'modified'
let origData = [[1, 2], [3, 4]];
let shallowData = null;
let deepData = null;
let shallowAffected = false;

// Animation
let animating = false;
let animProgress = 0;
let flashColor = null;

// Controls
let copyBtn, modifyBtn, resetBtn;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  copyBtn = createButton('1. Make Copies');
  copyBtn.position(10, drawHeight + 12);
  copyBtn.mousePressed(doCopy);

  modifyBtn = createButton('2. Modify copy[0][0] = 99');
  modifyBtn.position(130, drawHeight + 12);
  modifyBtn.mousePressed(doModify);

  resetBtn = createButton('Reset');
  resetBtn.position(340, drawHeight + 12);
  resetBtn.mousePressed(doReset);

  describe('Side-by-side visualization comparing shallow copy and deep copy behavior with nested lists', LABEL);
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
  text('Shallow vs Deep Copy', canvasWidth / 2, 8);

  // Animation
  if (animating) {
    animProgress += 0.03;
    if (animProgress >= 1) {
      animProgress = 1;
      animating = false;
    }
  }

  let halfW = canvasWidth / 2;

  // Original at top center
  drawOriginal(canvasWidth / 2 - 90, 42);

  // Dividing line
  stroke('#DDD');
  strokeWeight(1);
  line(halfW, 125, halfW, drawHeight - 10);

  // Left panel: Shallow Copy
  drawPanelLabel('Shallow Copy', halfW / 2, 130, '#E67E22');
  if (phase !== 'initial') {
    drawNestedList(shallowData, margin + 10, 155, '#FDEBD0', '#E67E22', phase === 'modified' && shallowAffected);
    drawSharedArrows(margin + 10, 155, true);
  } else {
    noStroke();
    fill('#999');
    textAlign(CENTER, CENTER);
    textSize(13);
    text('Click "Make Copies"', halfW / 2, 200);
  }

  // Right panel: Deep Copy
  drawPanelLabel('Deep Copy', halfW + halfW / 2, 130, '#27AE60');
  if (phase !== 'initial') {
    drawNestedList(deepData, halfW + 10, 155, '#D5F5E3', '#27AE60', false);
    drawSharedArrows(halfW + 10, 155, false);
  } else {
    noStroke();
    fill('#999');
    textAlign(CENTER, CENTER);
    textSize(13);
    text('Click "Make Copies"', halfW + halfW / 2, 200);
  }

  // Explanation text
  drawExplanation();

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawOriginal(x, y) {
  noStroke();
  fill('#555');
  textAlign(CENTER, BOTTOM);
  textSize(13);
  text('Original: matrix = [[' + origData[0].join(', ') + '], [' + origData[1].join(', ') + ']]', canvasWidth / 2, y);

  // Draw outer list
  let cellW = 36;
  let cellH = 28;
  let startX = x;

  // Outer list box
  stroke('#888');
  strokeWeight(1);
  fill('#E8E8F0');
  rect(startX, y + 2, cellW * 2 + 12, cellH + 8, 5);

  // Inner list references
  for (let i = 0; i < origData.length; i++) {
    let cx = startX + 4 + i * (cellW + 4);
    fill('#D0D0E0');
    stroke('#AAA');
    rect(cx, y + 6, cellW, cellH - 2, 3);

    noStroke();
    fill('#555');
    textAlign(CENTER, CENTER);
    textSize(11);
    text('[' + origData[i].join(',') + ']', cx + cellW / 2, y + 5 + (cellH - 2) / 2);
  }
}

function drawPanelLabel(label, centerX, y, col) {
  noStroke();
  fill(col);
  textAlign(CENTER, TOP);
  textSize(15);
  text(label, centerX, y);
}

function drawNestedList(data, x, y, bgColor, borderColor, showFlash) {
  if (!data) return;

  let cellW = 36;
  let cellH = 28;
  let innerY = y + 55;

  // Outer list
  noStroke();
  fill('#555');
  textAlign(LEFT, TOP);
  textSize(12);
  text('copy', x, y);

  // Outer box
  stroke(borderColor);
  strokeWeight(1.5);
  fill(bgColor);
  rect(x, y + 16, cellW * 2 + 16, cellH + 6, 5);

  // Slots in outer list
  for (let i = 0; i < data.length; i++) {
    let sx = x + 4 + i * (cellW + 6);
    fill('white');
    stroke('#CCC');
    strokeWeight(1);
    rect(sx, y + 20, cellW, cellH - 4, 3);

    noStroke();
    fill('#888');
    textAlign(CENTER, CENTER);
    textSize(10);
    text('ref ' + i, sx + cellW / 2, y + 18 + (cellH - 4) / 2);
  }

  // Inner lists
  for (let i = 0; i < data.length; i++) {
    let ix = x + i * (cellW * 2 + 20);
    let iy = innerY;

    // Flash effect on modification
    let bg = bgColor;
    if (showFlash && i === 0 && phase === 'modified') {
      bg = '#FFCCCC';
    }

    stroke(borderColor);
    strokeWeight(1);
    fill(bg);
    rect(ix, iy, cellW * 2 + 8, cellH + 4, 4);

    for (let j = 0; j < data[i].length; j++) {
      let cx = ix + 3 + j * (cellW + 2);

      let isModified = (i === 0 && j === 0 && phase === 'modified');
      fill(isModified ? (showFlash ? '#FF6666' : '#66CC66') : 'white');
      stroke('#CCC');
      strokeWeight(1);
      rect(cx, iy + 3, cellW - 2, cellH - 2, 3);

      noStroke();
      fill(isModified ? 'white' : '#333');
      textAlign(CENTER, CENTER);
      textSize(14);
      text(data[i][j], cx + (cellW - 2) / 2, iy + 2 + (cellH - 2) / 2);
    }
  }
}

function drawSharedArrows(x, y, isShallow) {
  if (phase === 'initial') return;

  let cellW = 36;
  let cellH = 28;

  // Arrows from outer slots to inner lists
  for (let i = 0; i < 2; i++) {
    let sx = x + 4 + i * (cellW + 6) + cellW / 2;
    let sy = y + 20 + cellH - 4;
    let ex = x + i * (cellW * 2 + 20) + cellW + 4;
    let ey = y + 55;

    stroke(isShallow ? '#E67E22' : '#27AE60');
    strokeWeight(1.5);
    line(sx, sy, ex, ey);

    // Small arrowhead
    fill(isShallow ? '#E67E22' : '#27AE60');
    noStroke();
    let angle = atan2(ey - sy, ex - sx);
    triangle(
      ex, ey,
      ex - 6 * cos(angle - 0.4), ey - 6 * sin(angle - 0.4),
      ex - 6 * cos(angle + 0.4), ey - 6 * sin(angle + 0.4)
    );
  }

  // Shared indicator for shallow copy
  if (isShallow && phase !== 'initial') {
    noStroke();
    fill('#E67E22');
    textAlign(CENTER, TOP);
    textSize(10);
    text('shared with original', x + cellW * 2, y + 92);
  } else if (!isShallow && phase !== 'initial') {
    noStroke();
    fill('#27AE60');
    textAlign(CENTER, TOP);
    textSize(10);
    text('independent copies', x + cellW * 2, y + 92);
  }
}

function drawExplanation() {
  let y = 310;
  noStroke();
  textAlign(CENTER, TOP);
  textSize(13);

  if (phase === 'initial') {
    fill('#666');
    text('Original nested list: [[1, 2], [3, 4]]', canvasWidth / 2, y);
    fill('#888');
    textSize(12);
    text('Click "Make Copies" to create a shallow copy and a deep copy.', canvasWidth / 2, y + 20);
  } else if (phase === 'copied') {
    fill('#333');
    text('Both copies created. They look identical right now.', canvasWidth / 2, y);
    fill('#888');
    textSize(12);
    text('Click "Modify" to change copy[0][0] to 99 in both copies.', canvasWidth / 2, y + 20);
  } else if (phase === 'modified') {
    fill('#E74C3C');
    text('Shallow copy: changing copy[0][0] also changed the original!', canvasWidth / 2, y);
    fill('#27AE60');
    text('Deep copy: the original is completely unaffected.', canvasWidth / 2, y + 22);
    fill('#555');
    textSize(12);
    text('Original is now: [[' + origData[0].join(', ') + '], [' + origData[1].join(', ') + ']]', canvasWidth / 2, y + 48);
  }
}

function doCopy() {
  if (phase !== 'initial') return;
  // Shallow copy - inner lists are shared references
  shallowData = [origData[0], origData[1]];
  // Deep copy - completely independent
  deepData = [origData[0].slice(), origData[1].slice()];
  phase = 'copied';
  animating = true;
  animProgress = 0;
}

function doModify() {
  if (phase !== 'copied') return;

  // Modify shallow copy's inner element
  shallowData[0][0] = 99;
  // Since shallow copy shares inner lists with original, origData is now affected
  shallowAffected = true;

  // Modify deep copy's inner element
  deepData[0][0] = 99;
  // origData already changed from shallow copy mutation above

  phase = 'modified';
  animating = true;
  animProgress = 0;
}

function doReset() {
  origData = [[1, 2], [3, 4]];
  shallowData = null;
  deepData = null;
  phase = 'initial';
  shallowAffected = false;
  animating = false;
  animProgress = 0;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  canvasWidth = Math.floor(container.width);
}
