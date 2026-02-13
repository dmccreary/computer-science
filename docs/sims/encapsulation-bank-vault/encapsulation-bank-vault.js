// Encapsulation Bank Vault Analogy MicroSim
// Demonstrates how encapsulation protects an object's internal data
// by restricting direct access and using getter/setter methods.
// MicroSim template version 2026.02

// ---- Layout globals ----
let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// ---- Buttons ----
let directAccessBtn, getterBtn, setterValidBtn, setterInvalidBtn;

// ---- Animation state ----
let animState = 'idle'; // idle, direct, getter, setterValid, setterInvalid
let animFrame = 0;
let animMaxFrames = 90;
let animMessage = '';
let animMessageColor;
let animFlashAlpha = 0;

// ---- Vault layout (computed in draw based on canvas width) ----
// These are proportional positions; recalculated every frame for responsiveness

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  // Row 1 buttons
  directAccessBtn = createButton('Try Direct Access');
  directAccessBtn.position(10, drawHeight + 5);
  directAccessBtn.mousePressed(() => startAnimation('direct'));

  getterBtn = createButton('Use Getter');
  getterBtn.position(170, drawHeight + 5);
  getterBtn.mousePressed(() => startAnimation('getter'));

  // Row 2 buttons
  setterValidBtn = createButton('Use Setter (valid)');
  setterValidBtn.position(10, drawHeight + 40);
  setterValidBtn.mousePressed(() => startAnimation('setterValid'));

  setterInvalidBtn = createButton('Use Setter (invalid)');
  setterInvalidBtn.position(190, drawHeight + 40);
  setterInvalidBtn.mousePressed(() => startAnimation('setterInvalid'));

  describe('Encapsulation bank vault analogy showing how getter and setter methods control access to private data inside a Dog object.', LABEL);
}

function draw() {
  updateCanvasSize();

  // Drawing area background
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  // Control area background
  fill('white');
  stroke('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // ---- Compute layout positions ----
  let vaultX = canvasWidth * 0.35;
  let vaultY = 70;
  let vaultW = canvasWidth * 0.55;
  let vaultH = 240;

  // Clamp vault dimensions for very narrow screens
  if (vaultW < 200) vaultW = 200;
  if (vaultX + vaultW > canvasWidth - 10) vaultX = canvasWidth - vaultW - 10;

  let figureX = 50;
  let figureY = 190;

  let getterWindowX = vaultX + 10;
  let getterWindowY = vaultY + 60;
  let getterWindowW = 70;
  let getterWindowH = 50;

  let setterWindowX = vaultX + 10;
  let setterWindowY = vaultY + 130;
  let setterWindowW = 70;
  let setterWindowH = 50;

  // ---- Title ----
  noStroke();
  fill(50);
  textAlign(CENTER, TOP);
  textSize(20);
  text('Encapsulation: Bank Vault Analogy', canvasWidth / 2, 10);

  // ---- Subtitle ----
  textSize(14);
  fill(100);
  text('Dog Object', canvasWidth / 2, 38);

  // ---- Draw the vault ----
  // Vault body (dark gray)
  stroke(60);
  strokeWeight(2);
  fill(80);
  rect(vaultX, vaultY, vaultW, vaultH, 8);

  // Vault label
  noStroke();
  fill(220);
  textAlign(CENTER, TOP);
  textSize(16);
  text('Private Vault', vaultX + vaultW / 2, vaultY + 6);

  // Private attributes inside vault
  textAlign(LEFT, TOP);
  textSize(15);
  fill(255, 220, 100);
  let attrX = vaultX + 100;
  let attrY = vaultY + 60;
  text('_age = 3', attrX, attrY);
  text('_breed = "Golden"', attrX, attrY + 28);

  // Gold coin icons to represent data
  fill(255, 200, 50);
  stroke(200, 160, 30);
  strokeWeight(1);
  ellipse(attrX - 15, attrY + 8, 18, 18);
  ellipse(attrX - 15, attrY + 36, 18, 18);
  noStroke();
  fill(180, 140, 20);
  textSize(11);
  textAlign(CENTER, CENTER);
  text('$', attrX - 15, attrY + 8);
  text('$', attrX - 15, attrY + 36);

  // ---- Draw Getter window (green) ----
  stroke(34, 139, 34);
  strokeWeight(2);
  fill(144, 238, 144);
  rect(getterWindowX, getterWindowY, getterWindowW, getterWindowH, 4);
  noStroke();
  fill(0, 100, 0);
  textAlign(CENTER, CENTER);
  textSize(12);
  text('Getter', getterWindowX + getterWindowW / 2, getterWindowY + 16);
  text('Window', getterWindowX + getterWindowW / 2, getterWindowY + 32);

  // ---- Draw Setter window (blue) ----
  stroke(30, 80, 180);
  strokeWeight(2);
  fill(135, 180, 250);
  rect(setterWindowX, setterWindowY, setterWindowW, setterWindowH, 4);
  noStroke();
  fill(0, 30, 120);
  textAlign(CENTER, CENTER);
  textSize(12);
  text('Setter', setterWindowX + setterWindowW / 2, setterWindowY + 16);
  text('Window', setterWindowX + setterWindowW / 2, setterWindowY + 32);

  // ---- Draw the outside code figure ----
  drawFigure(figureX, figureY);

  // ---- Draw animation paths and effects ----
  let progress = animFrame / animMaxFrames;
  if (progress > 1) progress = 1;

  if (animState === 'direct') {
    drawDirectAccessAnim(figureX, figureY, vaultX, vaultY, vaultW, vaultH, progress);
  } else if (animState === 'getter') {
    drawGetterAnim(figureX, figureY, getterWindowX, getterWindowY, getterWindowW, getterWindowH, progress);
  } else if (animState === 'setterValid') {
    drawSetterValidAnim(figureX, figureY, setterWindowX, setterWindowY, setterWindowW, setterWindowH, progress);
  } else if (animState === 'setterInvalid') {
    drawSetterInvalidAnim(figureX, figureY, setterWindowX, setterWindowY, setterWindowW, setterWindowH, progress);
  }

  // ---- Draw flash overlay for blocked attempts ----
  if (animFlashAlpha > 0) {
    noStroke();
    fill(255, 0, 0, animFlashAlpha);
    rect(0, 0, canvasWidth, drawHeight);
    animFlashAlpha -= 6;
    if (animFlashAlpha < 0) animFlashAlpha = 0;
  }

  // ---- Draw message box ----
  if (animMessage !== '') {
    drawMessageBox(animMessage, animMessageColor);
  }

  // ---- Advance animation ----
  if (animState !== 'idle') {
    animFrame++;
    if (animFrame > animMaxFrames + 40) {
      // Hold message for extra 40 frames then reset
      animState = 'idle';
      animFrame = 0;
      animMessage = '';
    }
  }

  // ---- Legend at bottom of draw area ----
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(12);
  fill(34, 139, 34);
  rect(10, drawHeight - 30, 12, 12, 2);
  fill(0);
  text('= Allowed path', 28, drawHeight - 24);

  fill(200, 30, 30);
  rect(130, drawHeight - 30, 12, 12, 2);
  fill(0);
  text('= Blocked path', 148, drawHeight - 24);

  fill(30, 80, 180);
  rect(270, drawHeight - 30, 12, 12, 2);
  fill(0);
  text('= Setter window', 288, drawHeight - 24);
}

// ---- Stick figure for "outside code" ----
function drawFigure(x, y) {
  stroke(50);
  strokeWeight(2);
  fill(255, 230, 180);
  // Head
  ellipse(x, y - 25, 24, 24);
  // Body
  line(x, y - 13, x, y + 20);
  // Arms
  line(x - 15, y, x + 15, y);
  // Legs
  line(x, y + 20, x - 12, y + 40);
  line(x, y + 20, x + 12, y + 40);

  noStroke();
  fill(50);
  textAlign(CENTER, TOP);
  textSize(11);
  text('Outside', x, y + 44);
  text('Code', x, y + 57);
}

// ---- Animation: Direct Access (blocked) ----
function drawDirectAccessAnim(fx, fy, vx, vy, vw, vh, progress) {
  let startX = fx + 20;
  let startY = fy;
  let endX = vx + vw / 2;
  let endY = vy + vh / 2;

  // Draw the arm reaching toward vault
  let reachX = lerp(startX, endX, min(progress * 2, 1));
  let reachY = lerp(startY, endY, min(progress * 2, 1));

  stroke(200, 30, 30);
  strokeWeight(3);
  drawingContext.setLineDash([8, 6]);
  line(startX, startY, reachX, reachY);
  drawingContext.setLineDash([]);

  // Big red X when progress > 0.5
  if (progress > 0.4) {
    let xSize = 30 * min((progress - 0.4) * 3, 1);
    let xPosX = lerp(startX, endX, 0.65);
    let xPosY = lerp(startY, endY, 0.65);
    stroke(220, 20, 20);
    strokeWeight(5);
    line(xPosX - xSize, xPosY - xSize, xPosX + xSize, xPosY + xSize);
    line(xPosX + xSize, xPosY - xSize, xPosX - xSize, xPosY + xSize);
  }

  // Flash and message
  if (progress > 0.5 && animMessage === '') {
    animFlashAlpha = 80;
    animMessage = 'BLOCKED! Cannot access _age directly';
    animMessageColor = color(200, 30, 30);
  }
}

// ---- Animation: Getter (allowed) ----
function drawGetterAnim(fx, fy, gwx, gwy, gww, gwh, progress) {
  let startX = fx + 20;
  let startY = fy - 5;
  let windowCenterX = gwx + gww / 2;
  let windowCenterY = gwy + gwh / 2;

  if (progress < 0.5) {
    // Arrow from figure to getter window
    let t = progress * 2;
    let arrowX = lerp(startX, windowCenterX, t);
    let arrowY = lerp(startY, windowCenterY, t);
    stroke(34, 139, 34);
    strokeWeight(3);
    line(startX, startY, arrowX, arrowY);
    drawArrowhead(arrowX, arrowY, atan2(windowCenterY - startY, windowCenterX - startX), color(34, 139, 34));
  } else {
    // Arrow to window (complete)
    stroke(34, 139, 34);
    strokeWeight(3);
    line(startX, startY, windowCenterX, windowCenterY);
    drawArrowhead(windowCenterX, windowCenterY, atan2(windowCenterY - startY, windowCenterX - startX), color(34, 139, 34));

    // Return arrow from window back with value
    let t2 = (progress - 0.5) * 2;
    let retX = lerp(windowCenterX, startX, t2);
    let retY = lerp(windowCenterY - 20, startY - 20, t2);
    stroke(34, 139, 34);
    strokeWeight(2);
    drawingContext.setLineDash([4, 4]);
    line(windowCenterX, windowCenterY - 10, retX, retY);
    drawingContext.setLineDash([]);

    // Value bubble
    noStroke();
    fill(34, 139, 34);
    textSize(14);
    textAlign(CENTER, CENTER);
    text('age = 3', retX, retY - 12);
  }

  if (progress > 0.8 && animMessage === '') {
    animMessage = 'get_age() returned 3';
    animMessageColor = color(34, 139, 34);
  }
}

// ---- Animation: Setter Valid (allowed) ----
function drawSetterValidAnim(fx, fy, swx, swy, sww, swh, progress) {
  let startX = fx + 20;
  let startY = fy + 10;
  let windowCenterX = swx + sww / 2;
  let windowCenterY = swy + swh / 2;

  if (progress < 0.4) {
    // Arrow from figure to setter window with value
    let t = progress / 0.4;
    let arrowX = lerp(startX, windowCenterX, t);
    let arrowY = lerp(startY, windowCenterY, t);
    stroke(30, 80, 180);
    strokeWeight(3);
    line(startX, startY, arrowX, arrowY);
    drawArrowhead(arrowX, arrowY, atan2(windowCenterY - startY, windowCenterX - startX), color(30, 80, 180));

    // Label showing value being sent
    noStroke();
    fill(30, 80, 180);
    textSize(13);
    textAlign(CENTER, CENTER);
    text('set_age(4)', (startX + arrowX) / 2, (startY + arrowY) / 2 - 14);
  } else if (progress < 0.7) {
    // Validation check at setter window
    stroke(30, 80, 180);
    strokeWeight(3);
    line(startX, startY, windowCenterX, windowCenterY);

    // Validation spinner / check
    let t2 = (progress - 0.4) / 0.3;
    noStroke();
    fill(30, 80, 180);
    textSize(13);
    textAlign(CENTER, CENTER);
    text('Validating: 0 <= 4 <= 30', windowCenterX + 50, windowCenterY - 15);

    if (t2 > 0.5) {
      // Green checkmark
      stroke(34, 139, 34);
      strokeWeight(4);
      let ckX = windowCenterX + 50;
      let ckY = windowCenterY + 10;
      line(ckX - 8, ckY, ckX - 2, ckY + 8);
      line(ckX - 2, ckY + 8, ckX + 10, ckY - 6);
    }
  } else {
    // Value stored in vault
    stroke(30, 80, 180);
    strokeWeight(3);
    line(startX, startY, windowCenterX, windowCenterY);

    noStroke();
    fill(34, 139, 34);
    textSize(14);
    textAlign(CENTER, CENTER);
    let t3 = (progress - 0.7) / 0.3;

    // Green checkmark
    stroke(34, 139, 34);
    strokeWeight(4);
    let ckX = windowCenterX + 50;
    let ckY = windowCenterY + 5;
    line(ckX - 8, ckY, ckX - 2, ckY + 8);
    line(ckX - 2, ckY + 8, ckX + 10, ckY - 6);

    noStroke();
    fill(34, 139, 34);
    textSize(13);
    text('_age updated to 4', windowCenterX + 80, windowCenterY + 28);
  }

  if (progress > 0.8 && animMessage === '') {
    animMessage = 'set_age(4) validated and stored!';
    animMessageColor = color(34, 139, 34);
  }
}

// ---- Animation: Setter Invalid (blocked) ----
function drawSetterInvalidAnim(fx, fy, swx, swy, sww, swh, progress) {
  let startX = fx + 20;
  let startY = fy + 10;
  let windowCenterX = swx + sww / 2;
  let windowCenterY = swy + swh / 2;

  if (progress < 0.4) {
    // Arrow from figure to setter window
    let t = progress / 0.4;
    let arrowX = lerp(startX, windowCenterX, t);
    let arrowY = lerp(startY, windowCenterY, t);
    stroke(30, 80, 180);
    strokeWeight(3);
    line(startX, startY, arrowX, arrowY);
    drawArrowhead(arrowX, arrowY, atan2(windowCenterY - startY, windowCenterX - startX), color(30, 80, 180));

    noStroke();
    fill(30, 80, 180);
    textSize(13);
    textAlign(CENTER, CENTER);
    text('set_age(-5)', (startX + arrowX) / 2, (startY + arrowY) / 2 - 14);
  } else if (progress < 0.7) {
    // Validation fails
    stroke(30, 80, 180);
    strokeWeight(3);
    line(startX, startY, windowCenterX, windowCenterY);

    noStroke();
    fill(200, 30, 30);
    textSize(13);
    textAlign(CENTER, CENTER);
    text('Validating: -5 < 0', windowCenterX + 50, windowCenterY - 15);

    let t2 = (progress - 0.4) / 0.3;
    if (t2 > 0.5) {
      // Red X
      stroke(200, 30, 30);
      strokeWeight(4);
      let xPos = windowCenterX + 50;
      let yPos = windowCenterY + 10;
      line(xPos - 8, yPos - 8, xPos + 8, yPos + 8);
      line(xPos + 8, yPos - 8, xPos - 8, yPos + 8);
    }
  } else {
    // Rejection
    stroke(200, 30, 30);
    strokeWeight(3);
    drawingContext.setLineDash([8, 6]);
    line(startX, startY, windowCenterX, windowCenterY);
    drawingContext.setLineDash([]);

    // Red X stays
    stroke(200, 30, 30);
    strokeWeight(4);
    let xPos = windowCenterX + 50;
    let yPos = windowCenterY + 5;
    line(xPos - 8, yPos - 8, xPos + 8, yPos + 8);
    line(xPos + 8, yPos - 8, xPos - 8, yPos + 8);

    noStroke();
    fill(200, 30, 30);
    textSize(13);
    textAlign(CENTER, CENTER);
    text('REJECTED!', windowCenterX + 50, windowCenterY + 28);
    textSize(11);
    text('Age cannot be negative', windowCenterX + 50, windowCenterY + 44);
  }

  if (progress > 0.6 && animFlashAlpha === 0 && animMessage === '') {
    animFlashAlpha = 60;
    animMessage = 'ValueError: Age can\'t be negative!';
    animMessageColor = color(200, 30, 30);
  }
}

// ---- Arrowhead helper ----
function drawArrowhead(x, y, angle, col) {
  push();
  translate(x, y);
  rotate(angle);
  fill(col);
  noStroke();
  triangle(0, 0, -12, -5, -12, 5);
  pop();
}

// ---- Message box at bottom of drawing area ----
function drawMessageBox(msg, col) {
  let boxW = canvasWidth - 40;
  let boxH = 36;
  let boxX = 20;
  let boxY = drawHeight - 70;

  noStroke();
  fill(255, 255, 255, 220);
  rect(boxX, boxY, boxW, boxH, 8);
  stroke(col);
  strokeWeight(2);
  noFill();
  rect(boxX, boxY, boxW, boxH, 8);

  noStroke();
  fill(col);
  textAlign(CENTER, CENTER);
  textSize(15);
  text(msg, boxX + boxW / 2, boxY + boxH / 2);
}

// ---- Start an animation ----
function startAnimation(type) {
  animState = type;
  animFrame = 0;
  animMessage = '';
  animFlashAlpha = 0;
}

// ---- Responsive functions ----
function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  redraw();
}

function updateCanvasSize() {
  const mainEl = document.querySelector('main');
  if (mainEl) {
    canvasWidth = mainEl.clientWidth;
  }
}
