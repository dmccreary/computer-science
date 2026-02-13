// Higher-Order Functions Flow MicroSim
// Step-through visualization of map, filter, and reduce
// Students click lanes to step through data transformations
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 400;
let drawHeight = 450;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;

// Controls
let resetButton;
let modeCheckbox;

// State
let selectedLane = -1; // 0=map, 1=filter, 2=reduce
let currentStep = 0;
let maxSteps = 5;

// Input data for all lanes
let inputData = [1, 2, 3, 4, 5];

// Map lane state
let mapOutputs = [];
let mapProcessed = 0;

// Filter lane state
let filterResults = []; // { val, passed } for each processed item
let filterProcessed = 0;

// Reduce lane state
let reduceAccValues = []; // accumulator after each step
let reduceProcessed = 0;

// Animation
let animProgress = 0;
let animating = false;
let animSpeed = 0.035;

// Lane color schemes
let mapCol, filterCol, reduceCol;

// Lane layout cache (recalculated each frame for responsiveness)
let laneTop = 140;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  mapCol = color(60, 120, 216);
  filterCol = color(46, 160, 80);
  reduceCol = color(220, 140, 40);

  resetButton = createButton('Reset');
  resetButton.position(10, drawHeight + 12);
  resetButton.mousePressed(doReset);

  modeCheckbox = createCheckbox('Code Mode', false);
  modeCheckbox.position(80, drawHeight + 14);

  describe(
    'Interactive step-through visualization of three higher-order functions: ' +
    'map transforms each item, filter keeps items passing a test, and reduce ' +
    'combines items into one value. Click a lane then click again to step through.',
    LABEL
  );
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
  noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  noStroke();
  fill(40);
  textAlign(CENTER, TOP);
  textSize(18);
  textStyle(BOLD);
  text('Higher-Order Functions', canvasWidth / 2, 8);
  textStyle(NORMAL);

  // Subtitle
  textSize(11);
  fill(100);
  text('A higher-order function takes another function as input', canvasWidth / 2, 30);

  // Top concept diagram
  drawConceptDiagram();

  // Three lanes
  let laneH = (drawHeight - laneTop - 10) / 3;
  for (let i = 0; i < 3; i++) {
    drawLane(i, margin, laneTop + i * laneH, canvasWidth - margin * 2, laneH - 6);
  }

  // Advance animation
  if (animating) {
    animProgress += animSpeed;
    if (animProgress >= 1) {
      animProgress = 1;
      animating = false;
    }
  }

  // Control area help text
  noStroke();
  fill(100);
  textAlign(RIGHT, CENTER);
  textSize(11);
  if (selectedLane < 0) {
    text('Click a lane to begin stepping through', canvasWidth - 15, drawHeight + 25);
  } else {
    let label = currentStep >= maxSteps ? 'Done!' : 'Click lane to step';
    text('Step ' + currentStep + '/' + maxSteps + '  |  ' + label, canvasWidth - 15, drawHeight + 25);
  }
}

// ── Top concept diagram ─────────────────────────────────────────────

function drawConceptDiagram() {
  let cx = canvasWidth / 2;
  let cy = 82;
  let boxW = Math.min(150, canvasWidth * 0.24);
  let boxH = 42;

  // Central "machine" box
  fill(240, 240, 250);
  stroke(120, 120, 180);
  strokeWeight(2);
  rect(cx - boxW / 2, cy - boxH / 2, boxW, boxH, 8);

  noStroke();
  fill(90, 90, 150);
  textAlign(CENTER, CENTER);
  textSize(12);
  textStyle(BOLD);
  text('Higher-Order', cx, cy - 7);
  text('Function', cx, cy + 9);
  textStyle(NORMAL);

  // Left inputs
  let leftX = cx - boxW / 2 - 55;

  // Value ball
  drawBall(leftX, cy - 13, 16, [180, 180, 210], '5');
  // Gear (function icon)
  drawGear(leftX, cy + 15, 9, [100, 150, 220]);

  // Arrows into box
  stroke(160);
  strokeWeight(1.5);
  line(leftX + 18, cy - 13, cx - boxW / 2 - 3, cy - 5);
  line(leftX + 12, cy + 15, cx - boxW / 2 - 3, cy + 5);
  drawArrowHead(cx - boxW / 2 - 3, cy - 5, 1, 0.4, [160, 160, 160]);
  drawArrowHead(cx - boxW / 2 - 3, cy + 5, 1, -0.4, [160, 160, 160]);

  // Right output
  let rightX = cx + boxW / 2 + 55;
  stroke(160);
  strokeWeight(1.5);
  line(cx + boxW / 2 + 3, cy, rightX - 18, cy);
  drawArrowHead(rightX - 18, cy, 1, 0, [160, 160, 160]);
  drawBall(rightX, cy, 16, [100, 190, 100], '10');

  // Labels
  noStroke();
  fill(140);
  textSize(9);
  textAlign(CENTER, TOP);
  text('value', leftX, cy - 30);
  text('function', leftX, cy + 27);
  text('result', rightX, cy + 14);
}

// ── Lane drawing ────────────────────────────────────────────────────

function drawLane(laneIdx, x, y, w, h) {
  let col, name, desc, pyCode, funcLabel, funcDesc;

  if (laneIdx === 0) {
    col = [60, 120, 216];
    name = 'map()';
    desc = 'Transforms each item using a function';
    pyCode = 'list(map(double, [1,2,3,4,5]))';
    funcLabel = 'double(x)';
    funcDesc = 'x * 2';
  } else if (laneIdx === 1) {
    col = [46, 160, 80];
    name = 'filter()';
    desc = 'Keeps items that pass a test function';
    pyCode = 'list(filter(is_even, [1,2,3,4,5]))';
    funcLabel = 'is_even(x)';
    funcDesc = 'x % 2 == 0';
  } else {
    col = [220, 140, 40];
    name = 'reduce()';
    desc = 'Combines all items into a single value';
    pyCode = 'reduce(add, [1,2,3,4,5])';
    funcLabel = 'add(acc, x)';
    funcDesc = 'acc + x';
  }

  let isSelected = selectedLane === laneIdx;
  let isHovered = mouseY >= y && mouseY < y + h && mouseX >= x && mouseX < x + w && mouseY < drawHeight;

  // Lane background
  if (isSelected) {
    fill(col[0], col[1], col[2], 22);
    stroke(col[0], col[1], col[2]);
    strokeWeight(2);
  } else if (isHovered) {
    fill(col[0], col[1], col[2], 12);
    stroke(col[0], col[1], col[2], 120);
    strokeWeight(1.5);
    cursor(HAND);
  } else {
    fill(255, 255, 255, 80);
    stroke(200);
    strokeWeight(1);
  }
  rect(x, y, w, h, 8);

  // Lane label
  noStroke();
  fill(col[0], col[1], col[2]);
  textAlign(LEFT, TOP);
  textSize(14);
  textStyle(BOLD);
  text(name, x + 10, y + 5);
  textStyle(NORMAL);

  // Description or code below label
  textSize(10);
  fill(110);
  if (modeCheckbox.checked()) {
    textFont('monospace');
    text(pyCode, x + 10, y + 21);
    textFont('Arial');
  } else {
    text(desc, x + 10, y + 21);
  }

  // Layout: input balls | arrow | function box | arrow | output area
  let ballR = constrain(h * 0.07, 8, 14);
  let headerH = 36;
  let innerH = h - headerH - 8;
  let innerY = y + headerH;

  let inputX = x + w * 0.10;
  let fbX = x + w * 0.32;
  let fbW = w * 0.22;
  let fbH = Math.max(innerH, 28);
  let fbY = innerY;
  let fbMidY = fbY + fbH / 2;
  let outputX = x + w * 0.78;

  let ballSpacing = inputData.length > 1
    ? Math.min((fbH - ballR * 2) / (inputData.length - 1), ballR * 2.6)
    : 0;
  let ballTopY = fbMidY - (inputData.length - 1) * ballSpacing / 2;

  // Function box
  fill(col[0], col[1], col[2], 25);
  stroke(col[0], col[1], col[2], 90);
  strokeWeight(1);
  rect(fbX, fbY, fbW, fbH, 6);

  noStroke();
  fill(col[0], col[1], col[2]);
  textAlign(CENTER, CENTER);
  if (modeCheckbox.checked()) {
    textFont('monospace');
    textSize(9);
    textStyle(BOLD);
    text(funcDesc, fbX + fbW / 2, fbMidY);
    textStyle(NORMAL);
    textFont('Arial');
  } else {
    drawGear(fbX + fbW / 2, fbMidY - 9, 7, col);
    textSize(9);
    textStyle(BOLD);
    text(funcLabel, fbX + fbW / 2, fbMidY + 9);
    textStyle(NORMAL);
  }

  // ── Input balls ───────────────────────────────────────────────
  let processed = getProcessed(laneIdx);
  let animIdx = processed; // the item currently animating (0-based)

  for (let i = 0; i < inputData.length; i++) {
    let by = ballTopY + i * ballSpacing;
    let val = inputData[i];

    if (isSelected && i < processed && !(i === animIdx && animating)) {
      // Already processed: dim
      drawBall(inputX, by, ballR, [180, 180, 200], str(val), 90);
    } else if (isSelected && i === animIdx - 1 && animating) {
      // Currently animating this ball toward function box
      let t = animProgress;
      let bx = lerp(inputX, fbX + 4, easeInOut(Math.min(t * 2, 1)));
      let aby = lerp(by, fbMidY, easeInOut(Math.min(t * 2, 1)) * 0.4);
      drawBall(bx, aby, ballR, [180, 180, 200], str(val));
    } else {
      drawBall(inputX, by, ballR, [180, 180, 200], str(val));
    }
  }

  // ── Static arrows (shown when lane not stepped) ───────────────
  if (!isSelected || currentStep === 0) {
    stroke(180);
    strokeWeight(1);
    line(inputX + ballR + 6, fbMidY, fbX - 4, fbMidY);
    drawArrowHead(fbX - 4, fbMidY, 1, 0, [180, 180, 180]);

    line(fbX + fbW + 4, fbMidY, outputX - ballR - 6, fbMidY);
    drawArrowHead(outputX - ballR - 6, fbMidY, 1, 0, [180, 180, 180]);
  }

  // ── Output area ───────────────────────────────────────────────
  if (isSelected && currentStep > 0) {
    // Arrow from function box to output
    stroke(col[0], col[1], col[2], 80);
    strokeWeight(1);
    line(fbX + fbW + 4, fbMidY, outputX - ballR - 6, fbMidY);
    drawArrowHead(outputX - ballR - 6, fbMidY, 1, 0, col);

    drawOutputArea(laneIdx, outputX, ballTopY, ballSpacing, ballR, fbMidY,
                   fbX, fbW, col);
  }

  // Narration text for completed steps
  if (isSelected && currentStep > 0) {
    drawNarration(laneIdx, x, y + h - 16, w);
  }

  // Hover hint
  if (isHovered && !isSelected) {
    noStroke();
    fill(col[0], col[1], col[2], 200);
    textAlign(CENTER, BOTTOM);
    textSize(11);
    text('Click to step through', x + w / 2, y + h - 3);
  }
}

// ── Output area per lane ────────────────────────────────────────────

function drawOutputArea(laneIdx, outputX, ballTopY, ballSpacing, ballR, fbMidY,
                        fbX, fbW, col) {

  if (laneIdx === 0) {
    // Map: show transformed balls
    for (let i = 0; i < mapOutputs.length; i++) {
      let by = ballTopY + i * ballSpacing;
      let isLatest = (i === mapOutputs.length - 1) && animating;
      if (isLatest) {
        // Animate from function box to output position
        let t = Math.max(0, (animProgress - 0.5) * 2);
        let bx = lerp(fbX + fbW, outputX, easeInOut(t));
        let aby = lerp(fbMidY, by, easeInOut(t));
        let alpha = Math.floor(t * 255);
        drawBall(bx, aby, ballR, col, str(mapOutputs[i]), alpha);
      } else {
        drawBall(outputX, by, ballR, col, str(mapOutputs[i]));
      }
    }
  } else if (laneIdx === 1) {
    // Filter: show passed balls, X marks for rejected
    let outSlot = 0;
    for (let i = 0; i < filterResults.length; i++) {
      let isLatest = (i === filterResults.length - 1) && animating;
      if (filterResults[i].passed) {
        let by = ballTopY + outSlot * ballSpacing;
        if (isLatest) {
          let t = Math.max(0, (animProgress - 0.5) * 2);
          let bx = lerp(fbX + fbW, outputX, easeInOut(t));
          let aby = lerp(fbMidY, by, easeInOut(t));
          let alpha = Math.floor(t * 255);
          drawBall(bx, aby, ballR, col, str(filterResults[i].val), alpha);
        } else {
          drawBall(outputX, by, ballR, col, str(filterResults[i].val));
        }
        outSlot++;
      } else {
        // Rejected: show X near function box output
        if (isLatest) {
          let t = Math.max(0, (animProgress - 0.5) * 2);
          let alpha = Math.floor(t * 255);
          noStroke();
          fill(220, 70, 70, alpha);
          textAlign(CENTER, CENTER);
          textSize(16);
          textStyle(BOLD);
          text('X', fbX + fbW + 18, fbMidY);
          textStyle(NORMAL);
        } else {
          let by = ballTopY + i * ballSpacing;
          noStroke();
          fill(220, 70, 70, 140);
          textAlign(CENTER, CENTER);
          textSize(11);
          text('X', fbX + fbW + 18, by);
        }
      }
    }
  } else if (laneIdx === 2) {
    // Reduce: show growing accumulator ball
    if (reduceAccValues.length > 0) {
      let displayVal = reduceAccValues[reduceAccValues.length - 1];
      let accR = ballR * 1.3 + reduceAccValues.length * 1.5;
      accR = Math.min(accR, ballR * 2.5);

      if (animating) {
        // Animate size/value change
        let prevVal = reduceAccValues.length > 1
          ? reduceAccValues[reduceAccValues.length - 2]
          : 0;
        let t = Math.max(0, (animProgress - 0.4) / 0.6);
        t = easeInOut(Math.min(t, 1));
        let showVal = Math.round(lerp(prevVal, displayVal, t));
        let prevR = ballR * 1.3 + (reduceAccValues.length - 1) * 1.5;
        prevR = Math.min(prevR, ballR * 2.5);
        let curR = lerp(prevR, accR, t);
        drawBall(outputX, fbMidY, curR, col, str(showVal));
      } else {
        drawBall(outputX, fbMidY, accR, col, str(displayVal));
      }

      noStroke();
      fill(col[0], col[1], col[2]);
      textAlign(CENTER, TOP);
      textSize(9);
      text('acc = ' + displayVal, outputX, fbMidY + accR + 4);
    }
  }
}

// ── Narration line under each lane ──────────────────────────────────

function drawNarration(laneIdx, x, y, w) {
  let msg = '';

  if (laneIdx === 0 && mapOutputs.length > 0) {
    let i = mapOutputs.length - 1;
    let inp = inputData[i];
    let out = mapOutputs[i];
    msg = 'double(' + inp + ') = ' + out;
    if (currentStep >= maxSteps) msg += '   Result: [' + mapOutputs.join(', ') + ']';
  } else if (laneIdx === 1 && filterResults.length > 0) {
    let last = filterResults[filterResults.length - 1];
    if (last.passed) {
      msg = 'is_even(' + last.val + ') = True  -> keep';
    } else {
      msg = 'is_even(' + last.val + ') = False -> remove';
    }
    if (currentStep >= maxSteps) {
      let kept = filterResults.filter(r => r.passed).map(r => r.val);
      msg += '   Result: [' + kept.join(', ') + ']';
    }
  } else if (laneIdx === 2 && reduceAccValues.length > 0) {
    let i = reduceAccValues.length - 1;
    let prev = i > 0 ? reduceAccValues[i - 1] : 0;
    let inp = inputData[i];
    msg = 'add(' + prev + ', ' + inp + ') = ' + reduceAccValues[i];
    if (currentStep >= maxSteps) msg += '   Result: ' + reduceAccValues[reduceAccValues.length - 1];
  }

  if (msg) {
    noStroke();
    fill(80);
    textAlign(LEFT, TOP);
    textFont('monospace');
    textSize(9);
    text(msg, x + 10, y);
    textFont('Arial');
  }
}

// ── Helper: how many items processed in current lane ────────────────

function getProcessed(laneIdx) {
  if (laneIdx === 0) return mapOutputs.length;
  if (laneIdx === 1) return filterResults.length;
  if (laneIdx === 2) return reduceAccValues.length;
  return 0;
}

// ── Drawing primitives ──────────────────────────────────────────────

function drawBall(x, y, r, col, label, alpha) {
  if (alpha === undefined) alpha = 255;
  if (alpha <= 0) return;

  fill(col[0], col[1], col[2], alpha);
  noStroke();
  circle(x, y, r * 2);

  // Specular highlight
  fill(255, 255, 255, alpha * 0.35);
  circle(x - r * 0.22, y - r * 0.22, r * 0.7);

  // Label
  fill(255, 255, 255, alpha);
  textAlign(CENTER, CENTER);
  textSize(constrain(r * 0.85, 8, 13));
  textStyle(BOLD);
  text(label, x, y);
  textStyle(NORMAL);
}

function drawGear(x, y, r, col) {
  push();
  translate(x, y);
  fill(col[0], col[1], col[2]);
  noStroke();
  circle(0, 0, r * 1.8);
  let teeth = 6;
  for (let i = 0; i < teeth; i++) {
    let a = (TWO_PI / teeth) * i;
    let tx = cos(a) * r * 1.1;
    let ty = sin(a) * r * 1.1;
    rectMode(CENTER);
    rect(tx, ty, r * 0.6, r * 0.6);
    rectMode(CORNER);
  }
  fill(min(col[0] + 50, 255), min(col[1] + 50, 255), min(col[2] + 50, 255));
  circle(0, 0, r * 0.7);
  pop();
}

function drawArrowHead(x, y, dx, dy, col) {
  fill(col[0], col[1], col[2]);
  noStroke();
  push();
  translate(x, y);
  let a = atan2(dy, dx);
  rotate(a);
  triangle(0, 0, -8, -4, -8, 4);
  pop();
}

function easeInOut(t) {
  return t < 0.5
    ? 2 * t * t
    : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

// ── Interaction ─────────────────────────────────────────────────────

function mousePressed() {
  if (mouseY > drawHeight || mouseY < laneTop) return;

  let laneH = (drawHeight - laneTop - 10) / 3;

  for (let i = 0; i < 3; i++) {
    let ly = laneTop + i * laneH;
    if (mouseY >= ly && mouseY < ly + laneH - 6) {
      if (selectedLane !== i) {
        selectLane(i);
      } else {
        doStep();
      }
      return;
    }
  }
}

function selectLane(idx) {
  selectedLane = idx;
  currentStep = 0;
  resetLaneStates();
}

function resetLaneStates() {
  mapOutputs = [];
  filterResults = [];
  reduceAccValues = [];
  animating = false;
  animProgress = 0;
}

function doStep() {
  if (animating) return;
  if (currentStep >= maxSteps) return;

  animating = true;
  animProgress = 0;
  currentStep++;

  let idx = currentStep - 1; // 0-based index into inputData

  if (selectedLane === 0) {
    mapOutputs.push(inputData[idx] * 2);
  } else if (selectedLane === 1) {
    let val = inputData[idx];
    let passed = val % 2 === 0;
    filterResults.push({ val: val, passed: passed });
  } else if (selectedLane === 2) {
    let prev = reduceAccValues.length > 0
      ? reduceAccValues[reduceAccValues.length - 1]
      : 0;
    reduceAccValues.push(prev + inputData[idx]);
  }
}

function doReset() {
  selectedLane = -1;
  currentStep = 0;
  resetLaneStates();
}

// ── Responsive sizing ───────────────────────────────────────────────

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const mainEl = document.querySelector('main');
  canvasWidth = mainEl.clientWidth;
  canvasHeight = drawHeight + controlHeight;
}
