// Split and Join Visualizer MicroSim
// Animated visualization of split() and join() operations
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 400;
let drawHeight = 430;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;

// Controls
let stringInput, sepInput, joinSepInput;
let splitButton, joinButton;

// State
let currentString = 'one,two,three';
let splitSep = ',';
let joinSep = ' - ';
let parts = [];
let mode = 'idle'; // 'idle', 'split-anim', 'split-done', 'join-anim', 'join-done'
let animProgress = 0;
let animSpeed = 0.025;
let joinedResult = '';

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  stringInput = createInput('one,two,three');
  stringInput.position(70, drawHeight + 12);
  stringInput.size(120);
  stringInput.input(() => {
    currentString = stringInput.value();
    mode = 'idle';
    parts = [];
  });

  sepInput = createInput(',');
  sepInput.position(240, drawHeight + 12);
  sepInput.size(30);
  sepInput.input(() => {
    splitSep = sepInput.value();
    mode = 'idle';
    parts = [];
  });

  splitButton = createButton('Split!');
  splitButton.position(285, drawHeight + 10);
  splitButton.mousePressed(doSplit);

  joinSepInput = createInput(' - ');
  joinSepInput.position(355, drawHeight + 12);
  joinSepInput.size(40);
  joinSepInput.input(() => {
    joinSep = joinSepInput.value();
  });

  joinButton = createButton('Join!');
  joinButton.position(canvasWidth - 55, drawHeight + 10);
  joinButton.mousePressed(doJoin);

  describe('Animated visualization of Python split() and join() string operations showing strings breaking apart and reassembling.', LABEL);
}

function draw() {
  updateCanvasSize();

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(18);
  text('Split & Join Visualizer', canvasWidth / 2, 8);

  // Dividing line
  stroke(220);
  strokeWeight(1);
  line(margin, drawHeight / 2, canvasWidth - margin, drawHeight / 2);

  noStroke();
  fill(100);
  textSize(12);
  textAlign(LEFT, CENTER);

  // Section labels
  fill(70, 130, 220);
  textStyle(BOLD);
  textSize(14);
  textAlign(LEFT, TOP);
  text('split()', margin, 32);

  fill(46, 160, 67);
  text('join()', margin, drawHeight / 2 + 10);
  textStyle(NORMAL);

  // Draw split section
  drawSplitSection();

  // Draw join section
  drawJoinSection();

  // Animate
  if (mode === 'split-anim' || mode === 'join-anim') {
    animProgress += animSpeed;
    if (animProgress >= 1) {
      animProgress = 1;
      if (mode === 'split-anim') mode = 'split-done';
      if (mode === 'join-anim') mode = 'join-done';
    }
  }

  // Control labels
  noStroke();
  fill(80);
  textAlign(LEFT, CENTER);
  textSize(11);
  text('String:', 10, drawHeight + 25);
  text('Sep:', 210, drawHeight + 25);
  text('Join:', 335, drawHeight + 25);
}

function drawSplitSection() {
  let sectionTop = 50;
  let sectionH = drawHeight / 2 - sectionTop - 10;
  let centerY = sectionTop + sectionH / 2;

  // Original string display
  let origY = sectionTop + 10;
  drawStringBox(currentString, canvasWidth / 2, origY, 'blue');

  // Show separator highlighting
  if (splitSep && splitSep.length > 0) {
    let positions = [];
    let idx = 0;
    while ((idx = currentString.indexOf(splitSep, idx)) !== -1) {
      positions.push(idx);
      idx += splitSep.length;
    }

    // Draw character-level view with separators highlighted
    let charY = origY + 40;
    drawCharBoxes(currentString, canvasWidth / 2, charY, positions, splitSep.length);
  }

  // If animating or done, show the parts
  if (mode === 'split-anim' || mode === 'split-done' || mode === 'join-anim' || mode === 'join-done') {
    let partsY = origY + 90;
    let t = mode === 'split-anim' ? animProgress : 1;

    // Parts spread out
    let totalPartsW = 0;
    let partWidths = [];
    textSize(14);
    for (let p of parts) {
      let w = textWidth("'" + p + "'") + 20;
      partWidths.push(w);
      totalPartsW += w;
    }
    totalPartsW += (parts.length - 1) * 10;

    let px = canvasWidth / 2 - totalPartsW / 2;
    for (let i = 0; i < parts.length; i++) {
      let cardX = lerp(canvasWidth / 2, px + partWidths[i] / 2, t);
      let alpha = lerp(0, 255, t);

      fill(230, 255, 230, alpha);
      stroke(46, 160, 67, alpha);
      strokeWeight(2);
      rectMode(CENTER);
      rect(cardX, partsY, partWidths[i], 30, 6);
      rectMode(CORNER);

      noStroke();
      fill(40, 120, 40, alpha);
      textAlign(CENTER, CENTER);
      textSize(13);
      textStyle(BOLD);
      text("'" + parts[i] + "'", cardX, partsY);
      textStyle(NORMAL);

      px += partWidths[i] + 10;
    }

    // List notation
    if (t > 0.5) {
      let listAlpha = (t - 0.5) * 2 * 255;
      noStroke();
      fill(80, 80, 80, listAlpha);
      textFont('monospace');
      textSize(12);
      textAlign(CENTER, TOP);
      let listStr = '[' + parts.map(p => "'" + p + "'").join(', ') + ']';
      text(listStr, canvasWidth / 2, partsY + 22);
      textFont('Arial');
    }

    // Code display
    noStroke();
    fill(100);
    textFont('monospace');
    textSize(11);
    textAlign(CENTER, TOP);
    let codeStr = '"' + currentString + '".split("' + splitSep + '")';
    text(codeStr, canvasWidth / 2, partsY + 42);
    textFont('Arial');
  }
}

function drawJoinSection() {
  let sectionTop = drawHeight / 2 + 25;

  if (parts.length === 0) {
    noStroke();
    fill(180);
    textAlign(CENTER, CENTER);
    textSize(13);
    text('Click "Split!" first to create parts', canvasWidth / 2, sectionTop + 60);
    return;
  }

  // Show parts as cards
  let partsY = sectionTop + 15;
  let totalPartsW = 0;
  let partWidths = [];
  textSize(14);
  for (let p of parts) {
    let w = textWidth("'" + p + "'") + 20;
    partWidths.push(w);
    totalPartsW += w;
  }
  totalPartsW += (parts.length - 1) * 10;

  let px = canvasWidth / 2 - totalPartsW / 2;
  for (let i = 0; i < parts.length; i++) {
    fill(230, 255, 230);
    stroke(46, 160, 67);
    strokeWeight(1.5);
    rectMode(CENTER);
    rect(px + partWidths[i] / 2, partsY, partWidths[i], 28, 6);
    rectMode(CORNER);

    noStroke();
    fill(40, 120, 40);
    textAlign(CENTER, CENTER);
    textSize(12);
    text("'" + parts[i] + "'", px + partWidths[i] / 2, partsY);

    px += partWidths[i] + 10;
  }

  // If join animating/done
  if (mode === 'join-anim' || mode === 'join-done') {
    let joinY = partsY + 50;
    let t = mode === 'join-anim' ? animProgress : 1;

    // Show parts sliding together with separator
    let joinedChars = [];
    for (let i = 0; i < parts.length; i++) {
      for (let ch of parts[i]) joinedChars.push({ ch: ch, type: 'part' });
      if (i < parts.length - 1) {
        for (let ch of joinSep) joinedChars.push({ ch: ch, type: 'sep' });
      }
    }

    let charW = Math.min(28, (canvasWidth - margin * 2) / joinedChars.length - 2);
    let totalChW = joinedChars.length * (charW + 2);
    let cx = canvasWidth / 2 - totalChW / 2;

    for (let i = 0; i < joinedChars.length; i++) {
      let jc = joinedChars[i];
      let targetX = cx + i * (charW + 2);

      // Animate from spread to together
      let startSpread = canvasWidth / 2 + (i - joinedChars.length / 2) * (charW + 15);
      let bx = lerp(startSpread, targetX, t);

      fill(jc.type === 'sep' ? [255, 230, 230] : [240, 248, 255]);
      stroke(jc.type === 'sep' ? [200, 100, 100] : [100, 150, 200]);
      strokeWeight(1);
      rect(bx, joinY, charW, charW, 3);

      noStroke();
      fill(jc.type === 'sep' ? [180, 40, 40] : [40]);
      textAlign(CENTER, CENTER);
      textSize(charW > 20 ? 14 : 10);
      text(jc.ch, bx + charW / 2, joinY + charW / 2);
    }

    // Result string
    if (t > 0.6) {
      let resAlpha = (t - 0.6) * 2.5 * 255;
      let resY = joinY + charW + 20;

      fill(248, 248, 252, resAlpha);
      stroke(200, 200, 200, resAlpha);
      strokeWeight(1);
      rectMode(CENTER);
      rect(canvasWidth / 2, resY, textWidth('"' + joinedResult + '"') + 30, 30, 6);
      rectMode(CORNER);

      noStroke();
      fill(40, 40, 140, resAlpha);
      textFont('monospace');
      textAlign(CENTER, CENTER);
      textSize(14);
      text('"' + joinedResult + '"', canvasWidth / 2, resY);

      // Code
      fill(100, 100, 100, resAlpha);
      textSize(11);
      textAlign(CENTER, TOP);
      text('"' + joinSep + '".join([...])', canvasWidth / 2, resY + 20);
      textFont('Arial');
    }
  }
}

function drawStringBox(str, cx, y, colorType) {
  textSize(14);
  let w = textWidth('"' + str + '"') + 24;

  let bgCol = colorType === 'blue' ? [230, 240, 255] : [230, 255, 230];
  let borderCol = colorType === 'blue' ? [70, 130, 220] : [46, 160, 67];

  fill(bgCol);
  stroke(borderCol);
  strokeWeight(2);
  rectMode(CENTER);
  rect(cx, y, w, 30, 6);
  rectMode(CORNER);

  noStroke();
  fill(colorType === 'blue' ? [40, 40, 140] : [40, 120, 40]);
  textFont('monospace');
  textAlign(CENTER, CENTER);
  text('"' + str + '"', cx, y);
  textFont('Arial');
}

function drawCharBoxes(str, cx, y, sepPositions, sepLen) {
  let charW = Math.min(24, (canvasWidth - margin * 2) / str.length - 2);
  let totalW = str.length * (charW + 2);
  let startX = cx - totalW / 2;

  for (let i = 0; i < str.length; i++) {
    let isSep = false;
    for (let sp of sepPositions) {
      if (i >= sp && i < sp + sepLen) {
        isSep = true;
        break;
      }
    }

    let bx = startX + i * (charW + 2);
    fill(isSep ? [255, 200, 200] : [240, 248, 255]);
    stroke(isSep ? [220, 80, 80] : [180]);
    strokeWeight(1);
    rect(bx, y, charW, charW, 3);

    noStroke();
    fill(isSep ? [200, 40, 40] : [60]);
    textAlign(CENTER, CENTER);
    textSize(charW > 18 ? 12 : 9);
    textStyle(isSep ? BOLD : NORMAL);
    text(str[i], bx + charW / 2, y + charW / 2);
    textStyle(NORMAL);
  }
}

function doSplit() {
  if (!splitSep || splitSep.length === 0) {
    parts = currentString.split(/\s+/);
  } else {
    parts = currentString.split(splitSep);
  }
  mode = 'split-anim';
  animProgress = 0;
}

function doJoin() {
  if (parts.length === 0) return;
  joinSep = joinSepInput.value();
  joinedResult = parts.join(joinSep);
  mode = 'join-anim';
  animProgress = 0;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  stringInput.size(canvasWidth - 330);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
