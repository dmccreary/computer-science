// Binary Number Explorer MicroSim
// Bloom Level: Apply (L3) - calculate, demonstrate
// Students toggle individual bits and observe the resulting decimal value.

let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// 8 bits, index 0 = MSB (128), index 7 = LSB (1)
let bits = [0, 0, 0, 0, 0, 0, 0, 0];
let placeValues = [128, 64, 32, 16, 8, 4, 2, 1];

// Bit circle properties
let bitRadius = 22; // radius of each bit circle
let bitDiameter = 44;

// Challenge mode
let challengeMode = false;
let targetDecimal = 0;
let challengeSolved = false;

// Buttons
let randomBtn, resetBtn, challengeBtn;

function updateCanvasSize() {
  // Calculate the available width from the parent container
  let mainEl = document.querySelector('main');
  if (mainEl) {
    canvasWidth = mainEl.offsetWidth;
  }
  if (canvasWidth < 300) canvasWidth = 300;
  canvasHeight = drawHeight + controlHeight;
}

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  let mainEl = document.querySelector('main');
  if (mainEl) {
    canvas.parent(mainEl);
  }
  textFont('Arial');

  // Create buttons
  randomBtn = createButton('Random');
  randomBtn.mousePressed(setRandomBits);
  randomBtn.parent(mainEl);

  resetBtn = createButton('Reset');
  resetBtn.mousePressed(resetAllBits);
  resetBtn.parent(mainEl);

  challengeBtn = createButton('Challenge Mode');
  challengeBtn.mousePressed(toggleChallengeMode);
  challengeBtn.parent(mainEl);

  positionButtons();

  describe('An interactive binary number explorer where students toggle 8 bits and see the decimal result.');
}

function positionButtons() {
  let btnY = drawHeight + 12;
  let btnSpacing = canvasWidth / 4;

  randomBtn.position(btnSpacing * 0.5, btnY);
  resetBtn.position(btnSpacing * 1.5, btnY);
  challengeBtn.position(btnSpacing * 2.5, btnY);

  // Reparent buttons relative to canvas
  let mainEl = document.querySelector('main');
  if (mainEl) {
    let canvasEl = mainEl.querySelector('canvas');
    if (canvasEl) {
      let canvasRect = canvasEl.getBoundingClientRect();
      let mainRect = mainEl.getBoundingClientRect();
      let offsetX = canvasRect.left - mainRect.left;
      let offsetY = canvasRect.top - mainRect.top;

      randomBtn.position(offsetX + btnSpacing * 0.5 - 30, offsetY + btnY);
      resetBtn.position(offsetX + btnSpacing * 1.5 - 25, offsetY + btnY);
      challengeBtn.position(offsetX + btnSpacing * 2.5 - 55, offsetY + btnY);
    }
  }
}

function draw() {
  // Drawing area background
  fill('aliceblue');
  stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);

  // Control area background
  fill('white');
  stroke('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  noStroke();
  fill(30);
  textAlign(CENTER, TOP);
  textSize(20);
  text('Binary Number Explorer', canvasWidth / 2, 15);

  // Calculate layout for 8 bits
  let totalBitWidth = canvasWidth - margin * 2;
  let bitSpacing = totalBitWidth / 8;
  let bitStartX = margin + bitSpacing / 2;
  let bitCenterY = 130;

  // Draw place value labels above bits
  textSize(defaultTextSize);
  fill(120);
  textAlign(CENTER, BOTTOM);
  for (let i = 0; i < 8; i++) {
    let bx = bitStartX + i * bitSpacing;
    text(placeValues[i], bx, bitCenterY - bitRadius - 10);
  }

  // Draw bit circles
  for (let i = 0; i < 8; i++) {
    let bx = bitStartX + i * bitSpacing;
    drawBitCircle(bx, bitCenterY, i);
  }

  // Binary string display
  let binaryStr = bits.join('');
  noStroke();
  fill(50);
  textAlign(CENTER, TOP);
  textSize(24);
  text(binaryStr, canvasWidth / 2, bitCenterY + bitRadius + 20);

  // Decimal value
  let decimalVal = calculateDecimal();
  textSize(32);
  fill(30, 100, 200);
  text('= ' + decimalVal, canvasWidth / 2, bitCenterY + bitRadius + 55);

  // Calculation breakdown
  textSize(14);
  fill(80);
  let breakdown = buildBreakdown(decimalVal);
  text(breakdown, canvasWidth / 2, bitCenterY + bitRadius + 100);

  // Challenge mode display
  if (challengeMode) {
    drawChallengeDisplay(decimalVal);
  }
}

function drawBitCircle(x, y, index) {
  let isOn = bits[index] === 1;

  // Shadow / glow for ON bits
  if (isOn) {
    noStroke();
    fill(0, 200, 80, 60);
    ellipse(x, y, bitDiameter + 10, bitDiameter + 10);
  }

  // Circle
  stroke(100);
  strokeWeight(2);
  if (isOn) {
    fill(0, 200, 80); // green for ON
  } else {
    fill(180); // gray for OFF
  }
  ellipse(x, y, bitDiameter, bitDiameter);

  // Label
  noStroke();
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(20);
  text(isOn ? '1' : '0', x, y);
}

function drawChallengeDisplay(currentDecimal) {
  noStroke();
  textAlign(CENTER, TOP);

  if (challengeSolved) {
    // Congratulations
    fill(0, 180, 60);
    textSize(20);
    text('Correct! ' + targetDecimal + ' in binary is ' + bits.join(''), canvasWidth / 2, drawHeight - 60);
    textSize(16);
    text('Click Challenge Mode for a new number!', canvasWidth / 2, drawHeight - 35);
  } else {
    // Show target
    fill(200, 60, 30);
    textSize(20);
    text('Target: ' + targetDecimal, canvasWidth / 2, drawHeight - 55);
    textSize(16);
    fill(100);
    text('Set the bits to match this decimal number!', canvasWidth / 2, drawHeight - 32);
  }

  // Check if solved
  if (currentDecimal === targetDecimal && !challengeSolved) {
    challengeSolved = true;
  }
}

function calculateDecimal() {
  let val = 0;
  for (let i = 0; i < 8; i++) {
    val += bits[i] * placeValues[i];
  }
  return val;
}

function buildBreakdown(decimalVal) {
  let parts = [];
  for (let i = 0; i < 8; i++) {
    parts.push(bits[i] + '\u00D7' + placeValues[i]);
  }
  return parts.join(' + ') + ' = ' + decimalVal;
}

function mousePressed() {
  // Check if a bit circle was clicked
  let totalBitWidth = canvasWidth - margin * 2;
  let bitSpacing = totalBitWidth / 8;
  let bitStartX = margin + bitSpacing / 2;
  let bitCenterY = 130;

  for (let i = 0; i < 8; i++) {
    let bx = bitStartX + i * bitSpacing;
    let d = dist(mouseX, mouseY, bx, bitCenterY);
    if (d < bitRadius + 4) {
      bits[i] = bits[i] === 0 ? 1 : 0;
      if (challengeMode) {
        challengeSolved = false; // re-check on next draw
      }
      break;
    }
  }
}

function setRandomBits() {
  for (let i = 0; i < 8; i++) {
    bits[i] = floor(random(2));
  }
  if (challengeMode) {
    challengeSolved = false;
  }
}

function resetAllBits() {
  for (let i = 0; i < 8; i++) {
    bits[i] = 0;
  }
  challengeMode = false;
  challengeSolved = false;
}

function toggleChallengeMode() {
  challengeMode = !challengeMode;
  if (challengeMode) {
    // Generate a new target and reset bits
    targetDecimal = floor(random(1, 256));
    for (let i = 0; i < 8; i++) {
      bits[i] = 0;
    }
    challengeSolved = false;
    challengeBtn.html('New Challenge');
  } else {
    challengeBtn.html('Challenge Mode');
    challengeSolved = false;
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionButtons();
}
