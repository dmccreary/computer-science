let canvasWidth = 400;
let drawHeight = 520;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let sliderLeftMargin = 140;
let defaultTextSize = 16;

const defaultValues = [3, 7, 3, 1, 7, 9, 1, 3, 5];
let baselineValues = [...defaultValues];
let inputValues = [...defaultValues];
let customInputValue = defaultValues.join(', ');

let seenSet = new Set();
let uniqueValues = [];
let outputValues = [];
let processed = [];
let currentIndex = 0;
let converted = false;
let operationText = 'Press Step to begin processing the input list.';
let statusMessage = '';
let statusColor = '#1f2937';

let stepButton;
let autoButton;
let resetButton;
let applyButton;
let convertButton;
let inputField;

let autoPlay = false;
let autoPlayDelayFrames = 28;
let nextAutoFrame = 0;

let activeAnim = null;
let glowTimer = 0;
let glowType = 'none';
let poofParticles = [];

const palette = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
  '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#14b8a6'
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  stepButton = createButton('Step');
  stepButton.mousePressed(handleStep);

  autoButton = createButton('Auto Play');
  autoButton.mousePressed(toggleAutoPlay);

  resetButton = createButton('Reset');
  resetButton.mousePressed(handleReset);

  convertButton = createButton('Convert to List');
  convertButton.mousePressed(convertToList);

  inputField = createInput(customInputValue, 'text');
  inputField.attribute('aria-label', 'Custom comma-separated list input');

  applyButton = createButton('Apply Input');
  applyButton.mousePressed(applyCustomInput);

  resetSimulation();
  positionControls();

  describe(
    'Step-by-step simulation of removing duplicate numbers by converting a list to a set and then back to a unique output list.',
    LABEL
  );
}

function draw() {
  updateCanvasSize();

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  fill('white');
  stroke('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  updateAnimation();
  updateAutoPlay();
  updateConvertButtonState();

  drawTitle();
  drawInstructionPanel();
  drawInputRegion();
  drawSetRegion();
  drawOutputRegion();
  drawAnimationToken();
  drawPoof();
  drawControlLabels();

  if (glowTimer > 0) {
    glowTimer -= 1;
  }

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawTitle() {
  noStroke();
  fill('#0f172a');
  textAlign(CENTER, TOP);
  textSize(24);
  text('Removing Duplicates with a Set', canvasWidth / 2, 10);
}

function drawInstructionPanel() {
  const panelX = margin;
  const panelY = 52;
  const panelW = getPanelWidth();
  const panelH = drawHeight - 70;

  fill('#f8fafc');
  stroke('#cbd5e1');
  rect(panelX, panelY, panelW, panelH, 10);

  noStroke();
  fill('#0f172a');
  textAlign(LEFT, TOP);
  textSize(16);
  text('Step Counter', panelX + 12, panelY + 12);

  textSize(22);
  text(`${currentIndex} / ${inputValues.length}`, panelX + 12, panelY + 34);

  textSize(15);
  fill('#334155');
  text('Current Operation', panelX + 12, panelY + 72);

  textSize(14);
  fill('#0f172a');
  text(operationText, panelX + 12, panelY + 96, panelW - 24, 120);

  fill(statusColor);
  textSize(14);
  text(statusMessage, panelX + 12, panelY + panelH - 60, panelW - 24, 50);
}

function drawInputRegion() {
  const region = getMainRegion();
  const box = getInputLayout(region);

  noStroke();
  fill('#0f172a');
  textAlign(LEFT, TOP);
  textSize(18);
  text('Input List', box.startX, 72);

  for (let i = 0; i < inputValues.length; i++) {
    const x = box.startX + i * (box.w + box.gap);
    const y = box.y;
    const value = inputValues[i];
    const isCurrent = i === currentIndex && !converted;
    const alreadyProcessed = i < currentIndex;

    stroke('#64748b');
    strokeWeight(isCurrent ? 2.5 : 1);

    let c = colorForValue(value);
    if (alreadyProcessed) {
      c = color(220, 225, 232);
    }

    fill(c);
    rect(x, y, box.w, box.h, 8);

    noStroke();
    fill(isCurrent ? '#111827' : '#1f2937');
    textAlign(CENTER, CENTER);
    textSize(16);
    text(String(value), x + box.w / 2, y + box.h / 2);
  }
}

function drawSetRegion() {
  const region = getMainRegion();
  const centerX = region.centerX;
  const centerY = 280;
  const radius = 85 + uniqueValues.length * 5;

  noFill();
  stroke('#334155');
  strokeWeight(2);
  ellipse(centerX, centerY, radius * 2.2, radius * 1.5);

  if (glowTimer > 0) {
    if (glowType === 'new') {
      noFill();
      stroke(16, 185, 129, 120);
      strokeWeight(6);
      ellipse(centerX, centerY, radius * 2.35, radius * 1.65);
    } else if (glowType === 'dup') {
      noFill();
      stroke(239, 68, 68, 120);
      strokeWeight(6);
      ellipse(centerX, centerY, radius * 2.35, radius * 1.65);
    }
  }

  noStroke();
  fill('#0f172a');
  textAlign(CENTER, CENTER);
  textSize(17);
  text('Set (unique only)', centerX, centerY - radius * 0.9);

  const slots = max(1, uniqueValues.length);
  for (let i = 0; i < uniqueValues.length; i++) {
    const angle = -PI / 2 + (TWO_PI * i) / slots;
    const rx = centerX + cos(angle) * (radius * 0.52);
    const ry = centerY + sin(angle) * (radius * 0.4);

    fill(colorForValue(uniqueValues[i]));
    stroke('#334155');
    strokeWeight(1);
    ellipse(rx, ry, 38, 38);

    noStroke();
    fill('#111827');
    textAlign(CENTER, CENTER);
    textSize(16);
    text(String(uniqueValues[i]), rx, ry + 1);
  }
}

function drawOutputRegion() {
  const region = getMainRegion();
  const y = 430;

  noStroke();
  fill('#0f172a');
  textAlign(LEFT, TOP);
  textSize(18);
  text('Output List (after Convert to List)', region.left, y - 32);

  const list = converted ? outputValues : [];
  const gap = 10;
  const w = max(22, min(54, (region.width - gap * 8) / 9));
  const h = 44;
  for (let i = 0; i < list.length; i++) {
    const x = region.left + i * (w + gap);
    stroke('#64748b');
    strokeWeight(1);
    fill(colorForValue(list[i]));
    rect(x, y, w, h, 8);

    noStroke();
    fill('#111827');
    textAlign(CENTER, CENTER);
    textSize(16);
    text(String(list[i]), x + w / 2, y + h / 2);
  }

  if (!converted && currentIndex >= inputValues.length) {
    noStroke();
    fill('#475569');
    textAlign(LEFT, CENTER);
    textSize(14);
    text('All items processed. Click Convert to List.', region.left, y + h + 18);
  }
}

function drawAnimationToken() {
  if (!activeAnim) {
    return;
  }

  const pos = getAnimatedPosition(activeAnim);
  const r = 20;
  fill(colorForValue(activeAnim.value));
  stroke('#1f2937');
  strokeWeight(2);
  ellipse(pos.x, pos.y, r * 2, r * 2);

  noStroke();
  fill('#111827');
  textAlign(CENTER, CENTER);
  textSize(15);
  text(String(activeAnim.value), pos.x, pos.y + 1);

  stroke(51, 65, 85, 160);
  strokeWeight(2);
  line(activeAnim.from.x, activeAnim.from.y, pos.x, pos.y);
}

function drawPoof() {
  for (let i = poofParticles.length - 1; i >= 0; i--) {
    const p = poofParticles[i];
    p.life -= 1;
    p.r += p.grow;

    noFill();
    stroke(239, 68, 68, map(p.life, 0, p.maxLife, 0, 170));
    strokeWeight(2);
    ellipse(p.x, p.y, p.r, p.r);

    if (p.life <= 0) {
      poofParticles.splice(i, 1);
    }
  }
}

function drawControlLabels() {
  noStroke();
  fill('#334155');
  textAlign(LEFT, CENTER);
  textSize(14);
  text('Custom Input:', 10, drawHeight + 58);
}

function handleStep() {
  if (activeAnim) {
    return;
  }
  if (currentIndex >= inputValues.length) {
    operationText = 'All input elements have been checked. Convert the set to a list.';
    return;
  }
  autoPlay = false;
  autoButton.html('Auto Play');
  beginStep();
}

function toggleAutoPlay() {
  if (autoPlay) {
    autoPlay = false;
    autoButton.html('Auto Play');
    return;
  }

  if (currentIndex >= inputValues.length) {
    statusMessage = 'All steps are complete.';
    statusColor = '#334155';
    return;
  }

  autoPlay = true;
  autoButton.html('Pause');
  nextAutoFrame = frameCount;
}

function handleReset() {
  autoPlay = false;
  autoButton.html('Auto Play');
  inputValues = [...baselineValues];
  customInputValue = baselineValues.join(', ');
  inputField.value(customInputValue);
  resetSimulation();
}

function applyCustomInput() {
  const parsed = parseInputValues(inputField.value());
  if (!parsed.ok) {
    statusMessage = parsed.error;
    statusColor = '#dc2626';
    return;
  }

  baselineValues = parsed.values;
  inputValues = [...baselineValues];
  customInputValue = baselineValues.join(', ');
  inputField.value(customInputValue);

  autoPlay = false;
  autoButton.html('Auto Play');
  resetSimulation();
  statusMessage = `Loaded ${inputValues.length} items.`;
  statusColor = '#0f766e';
}

function convertToList() {
  if (activeAnim) {
    return;
  }
  if (currentIndex < inputValues.length) {
    statusMessage = 'Process all input values before converting.';
    statusColor = '#dc2626';
    return;
  }

  outputValues = [...uniqueValues];
  converted = true;
  operationText = 'Converted set back to list. Output contains unique values only.';
  statusMessage = 'Conversion complete.';
  statusColor = '#0f766e';
}

function beginStep() {
  const region = getMainRegion();
  const inputLayout = getInputLayout(region);
  const setCenter = { x: region.centerX, y: 280 };
  const setBoundaryX = setCenter.x - (85 + uniqueValues.length * 5) * 1.1;

  const value = inputValues[currentIndex];
  const fromX = inputLayout.startX + currentIndex * (inputLayout.w + inputLayout.gap) + inputLayout.w / 2;
  const fromY = inputLayout.y + inputLayout.h / 2;
  const isNew = !seenSet.has(value);

  if (isNew) {
    operationText = `Step ${currentIndex + 1}: Add ${value} to the set (new value).`;
  } else {
    operationText = `Step ${currentIndex + 1}: ${value} is a duplicate. Already in set!`;
  }

  activeAnim = {
    value,
    from: { x: fromX, y: fromY },
    to: isNew ? { x: setCenter.x, y: setCenter.y } : { x: setBoundaryX, y: setCenter.y },
    duration: isNew ? 34 : 30,
    frame: 0,
    isNew,
    bounceBack: !isNew
  };
}

function updateAnimation() {
  if (!activeAnim) {
    return;
  }

  activeAnim.frame += 1;

  if (activeAnim.frame >= activeAnim.duration) {
    const value = activeAnim.value;

    if (activeAnim.isNew) {
      seenSet.add(value);
      uniqueValues.push(value);
      processed[currentIndex] = 'new';
      glowType = 'new';
      glowTimer = 14;
      statusMessage = `${value} entered the set.`;
      statusColor = '#0f766e';
    } else {
      processed[currentIndex] = 'duplicate';
      glowType = 'dup';
      glowTimer = 14;
      spawnPoof(activeAnim.to.x, activeAnim.to.y);
      statusMessage = 'Already in set! Duplicate discarded.';
      statusColor = '#b91c1c';
    }

    currentIndex += 1;
    activeAnim = null;

    if (currentIndex >= inputValues.length) {
      operationText = 'All input elements processed. Click Convert to List.';
      autoPlay = false;
      autoButton.html('Auto Play');
    }
  }
}

function updateAutoPlay() {
  if (!autoPlay || activeAnim) {
    return;
  }

  if (currentIndex >= inputValues.length) {
    autoPlay = false;
    autoButton.html('Auto Play');
    return;
  }

  if (frameCount >= nextAutoFrame) {
    beginStep();
    nextAutoFrame = frameCount + autoPlayDelayFrames;
  }
}

function updateConvertButtonState() {
  if (currentIndex >= inputValues.length && !activeAnim) {
    convertButton.removeAttribute('disabled');
  } else {
    convertButton.attribute('disabled', true);
  }
}

function spawnPoof(x, y) {
  for (let i = 0; i < 5; i++) {
    poofParticles.push({
      x: x + random(-10, 10),
      y: y + random(-10, 10),
      r: random(6, 10),
      grow: random(1.2, 2.4),
      life: 16,
      maxLife: 16
    });
  }
}

function getAnimatedPosition(anim) {
  const t = constrain(anim.frame / anim.duration, 0, 1);
  const smooth = t * t * (3 - 2 * t);
  let x = lerp(anim.from.x, anim.to.x, smooth);
  let y = lerp(anim.from.y, anim.to.y, smooth);

  if (anim.bounceBack) {
    const bounce = sin(smooth * PI);
    x -= bounce * 26;
    y -= bounce * 14;
  }

  return { x, y };
}

function colorForValue(v) {
  const idx = valueColorIndex(v);
  return palette[idx % palette.length];
}

function valueColorIndex(value) {
  const ordered = [...new Set(inputValues.map(String))].sort((a, b) => Number(a) - Number(b));
  const key = String(value);
  const idx = ordered.indexOf(key);
  return idx >= 0 ? idx : 0;
}

function getMainRegion() {
  const panelW = getPanelWidth();
  const left = margin + panelW + 14;
  const right = canvasWidth - margin;
  return {
    left,
    right,
    width: right - left,
    centerX: left + (right - left) / 2
  };
}

function getInputLayout(region) {
  const n = max(1, inputValues.length);
  const gap = n > 10 ? 4 : 8;
  const maxW = 48;
  const minW = 18;
  const w = constrain((region.width - gap * (n - 1)) / n, minW, maxW);
  const totalW = n * w + (n - 1) * gap;
  const startX = region.left + max(0, (region.width - totalW) / 2);
  return {
    startX,
    y: 110,
    w,
    h: 44,
    gap
  };
}

function parseInputValues(raw) {
  const cleaned = raw.trim();
  if (!cleaned) {
    return { ok: false, error: 'Enter at least one number.' };
  }

  const tokens = cleaned.split(',').map((t) => t.trim()).filter((t) => t.length > 0);
  if (tokens.length === 0) {
    return { ok: false, error: 'Use comma-separated numbers, e.g. 3, 7, 3, 1.' };
  }

  const values = [];
  for (const token of tokens) {
    if (!/^[-+]?\d+(\.\d+)?$/.test(token)) {
      return { ok: false, error: `Invalid value: "${token}".` };
    }
    values.push(Number(token));
  }

  if (values.length > 14) {
    return { ok: false, error: 'Limit input to 14 numbers for readability.' };
  }

  return { ok: true, values };
}

function resetSimulation() {
  seenSet = new Set();
  uniqueValues = [];
  outputValues = [];
  processed = new Array(inputValues.length).fill('pending');
  currentIndex = 0;
  converted = false;
  activeAnim = null;
  poofParticles = [];
  glowTimer = 0;
  glowType = 'none';
  statusMessage = 'Ready to process input values.';
  statusColor = '#334155';
  operationText = 'Press Step to process the first input value.';
}

function positionControls() {
  stepButton.position(10, drawHeight + 8);
  autoButton.position(62, drawHeight + 8);
  resetButton.position(138, drawHeight + 8);
  convertButton.position(198, drawHeight + 8);

  inputField.position(102, drawHeight + 43);
  inputField.size(max(120, canvasWidth - 210), 24);

  applyButton.position(canvasWidth - 96, drawHeight + 43);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = max(360, container.offsetWidth);
    if (inputField) {
      inputField.size(max(120, canvasWidth - 210), 24);
    }
  }
}

function getPanelWidth() {
  return constrain(canvasWidth * 0.24, 110, 220);
}
