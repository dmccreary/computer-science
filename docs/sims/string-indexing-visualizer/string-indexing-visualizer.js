// String Indexing Visualizer MicroSim
// Type a string, click character boxes to see positive/negative indices
// Enter an index to highlight the corresponding character
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 400;
let drawHeight = 350;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;

// Controls
let stringInput;
let indexInput;

// State
let currentString = 'PYTHON';
let selectedIndex = 0;
let errorMessage = '';
let errorTimer = 0;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  stringInput = createInput('PYTHON');
  stringInput.position(70, drawHeight + 12);
  stringInput.size(150);
  stringInput.input(() => {
    currentString = stringInput.value();
    selectedIndex = -999;
    errorMessage = '';
  });

  indexInput = createInput('0', 'number');
  indexInput.position(310, drawHeight + 12);
  indexInput.size(50);
  indexInput.input(onIndexInput);

  describe('Interactive string indexing visualizer showing positive and negative indices for each character. Click boxes or enter an index.', LABEL);
}

function onIndexInput() {
  let val = parseInt(indexInput.value());
  if (isNaN(val)) {
    selectedIndex = -999;
    errorMessage = '';
    return;
  }
  let len = currentString.length;
  // Check bounds for both positive and negative
  if (val >= len || val < -len) {
    selectedIndex = -999;
    errorMessage = 'IndexError! Index ' + val + ' out of range';
    errorTimer = 120;
  } else {
    // Convert negative to positive for display
    selectedIndex = val >= 0 ? val : len + val;
    errorMessage = '';
  }
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
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(20);
  text('String Indexing Visualizer', canvasWidth / 2, 10);

  let len = currentString.length;
  if (len === 0) {
    fill(150);
    textSize(14);
    textAlign(CENTER, CENTER);
    text('Type a string above to visualize', canvasWidth / 2, drawHeight / 2);
    drawControlLabels();
    return;
  }

  // Calculate box dimensions
  let maxBoxW = 55;
  let gap = 4;
  let totalW = len * maxBoxW + (len - 1) * gap;
  let boxW = maxBoxW;

  if (totalW > canvasWidth - margin * 2) {
    boxW = Math.floor((canvasWidth - margin * 2 - (len - 1) * gap) / len);
    totalW = len * boxW + (len - 1) * gap;
  }

  let startX = (canvasWidth - totalW) / 2;
  let boxY = 130;
  let boxH = 50;

  // Draw "string[index]" label
  noStroke();
  fill(80);
  textAlign(CENTER, TOP);
  textSize(13);
  textFont('monospace');
  text('string = "' + currentString + '"', canvasWidth / 2, 40);
  textFont('Arial');

  // Draw positive index label
  fill(70, 130, 220);
  textSize(11);
  textAlign(LEFT, BOTTOM);
  text('Positive Index', startX, boxY - 22);

  // Draw character boxes
  for (let i = 0; i < len; i++) {
    let bx = startX + i * (boxW + gap);
    let isSelected = (i === selectedIndex);
    let altColor = i % 2 === 0;

    // Positive index above
    noStroke();
    fill(70, 130, 220);
    textAlign(CENTER, BOTTOM);
    textSize(13);
    textStyle(isSelected ? BOLD : NORMAL);
    text(i, bx + boxW / 2, boxY - 5);

    // Box
    if (isSelected) {
      stroke(218, 165, 32);
      strokeWeight(3);
      fill(255, 248, 220);
    } else {
      stroke(180);
      strokeWeight(1);
      fill(altColor ? [230, 242, 255] : [230, 255, 230]);
    }
    rect(bx, boxY, boxW, boxH, 6);

    // Character
    noStroke();
    fill(isSelected ? [180, 120, 0] : 40);
    textAlign(CENTER, CENTER);
    textSize(boxW > 35 ? 24 : 18);
    textStyle(BOLD);
    text(currentString[i], bx + boxW / 2, boxY + boxH / 2);
    textStyle(NORMAL);

    // Negative index below
    fill(200, 60, 60);
    textAlign(CENTER, TOP);
    textSize(13);
    textStyle(isSelected ? BOLD : NORMAL);
    text(i - len, bx + boxW / 2, boxY + boxH + 5);
    textStyle(NORMAL);
  }

  // Negative index label
  fill(200, 60, 60);
  textSize(11);
  textAlign(LEFT, TOP);
  text('Negative Index', startX - 5, boxY + boxH + 22);

  // Display selected character info
  if (selectedIndex >= 0 && selectedIndex < len) {
    let infoY = boxY + boxH + 55;

    fill(248, 248, 252);
    stroke(200);
    strokeWeight(1);
    rectMode(CENTER);
    rect(canvasWidth / 2, infoY + 20, 340, 55, 8);
    rectMode(CORNER);

    noStroke();
    textFont('monospace');
    textAlign(CENTER, CENTER);
    textSize(16);

    // Positive index line
    fill(70, 130, 220);
    text('string[' + selectedIndex + '] = "' + currentString[selectedIndex] + '"', canvasWidth / 2, infoY + 8);

    // Negative index line
    fill(200, 60, 60);
    text('string[' + (selectedIndex - len) + '] = "' + currentString[selectedIndex] + '"', canvasWidth / 2, infoY + 32);
    textFont('Arial');
  }

  // Error message
  if (errorMessage !== '') {
    let errY = boxY + boxH + 60;

    // Shake animation
    let shakeX = 0;
    if (errorTimer > 100) {
      shakeX = sin(errorTimer * 0.8) * 5;
    }

    fill(255, 230, 230);
    stroke(220, 80, 80);
    strokeWeight(1);
    rectMode(CENTER);
    rect(canvasWidth / 2 + shakeX, errY + 15, 300, 35, 6);
    rectMode(CORNER);

    noStroke();
    fill(200, 40, 40);
    textAlign(CENTER, CENTER);
    textSize(14);
    textStyle(BOLD);
    text(errorMessage, canvasWidth / 2 + shakeX, errY + 15);
    textStyle(NORMAL);

    if (errorTimer > 0) errorTimer--;
  }

  // Instruction text
  noStroke();
  fill(150);
  textAlign(CENTER, BOTTOM);
  textSize(12);
  text('Click index to move the selected character', canvasWidth / 2, drawHeight - 8);

  drawControlLabels();
}

function drawControlLabels() {
  noStroke();
  fill(80);
  textAlign(LEFT, CENTER);
  textSize(13);
  text('String:', 10, drawHeight + 25);
  text('Index:', 265, drawHeight + 25);
}

function mousePressed() {
  if (mouseY > drawHeight) return;

  let len = currentString.length;
  if (len === 0) return;

  let maxBoxW = 55;
  let gap = 4;
  let boxW = maxBoxW;
  let totalW = len * boxW + (len - 1) * gap;

  if (totalW > canvasWidth - margin * 2) {
    boxW = Math.floor((canvasWidth - margin * 2 - (len - 1) * gap) / len);
    totalW = len * boxW + (len - 1) * gap;
  }

  let startX = (canvasWidth - totalW) / 2;
  let boxY = 130;
  let boxH = 50;

  for (let i = 0; i < len; i++) {
    let bx = startX + i * (boxW + gap);
    if (mouseX >= bx && mouseX <= bx + boxW && mouseY >= boxY && mouseY <= boxY + boxH) {
      selectedIndex = i;
      errorMessage = '';
      indexInput.value(String(i));
      break;
    }
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
