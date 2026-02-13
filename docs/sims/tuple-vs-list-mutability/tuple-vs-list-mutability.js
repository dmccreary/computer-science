// Tuple vs List Mutability MicroSim
// Compare mutable list behavior with immutable tuple behavior side-by-side.

let canvasWidth = 400;
let drawHeight = 420;
let controlHeight = 60;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let defaultTextSize = 16;

const initialValues = [1, 2, 3];
let listValues = [];
let tupleValues = [];

let listMessage = 'Ready: list can be modified.';
let tupleMessage = 'Ready: tuple is immutable.';
let listMessageColor = '#1b5e20';
let tupleMessageColor = '#7f1d1d';

let listGlow = 0;
let tupleFlash = 0;
let tupleShake = 0;

let changeBtn;
let addBtn;
let removeBtn;
let resetBtn;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  changeBtn = createButton('Change Item');
  changeBtn.mousePressed(applyChangeItem);

  addBtn = createButton('Add Item');
  addBtn.mousePressed(applyAddItem);

  removeBtn = createButton('Remove Item');
  removeBtn.mousePressed(applyRemoveItem);

  resetBtn = createButton('Reset');
  resetBtn.mousePressed(resetState);

  resetState();
  positionControls();

  describe(
    'Interactive comparison of Python list mutability and tuple immutability. '
      + 'Changing, adding, and removing items succeeds for the list and produces errors for the tuple.',
    LABEL
  );
}

function draw() {
  updateCanvasSize();

  // Fade animations.
  listGlow = max(0, listGlow - 0.04);
  tupleFlash = max(0, tupleFlash - 0.04);
  tupleShake = max(0, tupleShake - 0.06);

  // Base regions.
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  fill('white');
  stroke('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title.
  noStroke();
  fill('#111827');
  textAlign(CENTER, TOP);
  textSize(24);
  noStroke();
  text('Tuple vs List Mutability', canvasWidth / 2, 10);

  drawPanels();

  // Control help text.
  noStroke();
  fill('#475569');
  textAlign(LEFT, CENTER);
  textSize(13);
  noStroke();
  text('Try the same operation on both structures and compare outcomes.', margin, drawHeight + 45);

  textSize(defaultTextSize);
}

function drawPanels() {
  const panelY = 50;
  const panelH = 330;
  const gap = 18;
  const panelW = (canvasWidth - margin * 2 - gap) / 2;
  const leftX = margin;
  const rightX = leftX + panelW + gap;

  const tupleOffset = sin(frameCount * 0.9) * 8 * tupleShake;

  // List panel background and glow.
  const glowAlpha = floor(75 * listGlow);
  if (glowAlpha > 0) {
    noStroke();
    fill(34, 197, 94, glowAlpha);
    rect(leftX - 4, panelY - 4, panelW + 8, panelH + 8, 12);
  }

  fill(249, 250, 251);
  stroke('#16a34a');
  strokeWeight(2);
  rect(leftX, panelY, panelW, panelH, 10);

  // Tuple panel background and failure flash.
  if (tupleFlash > 0) {
    noStroke();
    fill(239, 68, 68, floor(85 * tupleFlash));
    rect(rightX - 4 + tupleOffset, panelY - 4, panelW + 8, panelH + 8, 12);
  }

  fill(255, 251, 235);
  stroke('#d4a017');
  strokeWeight(2);
  rect(rightX + tupleOffset, panelY, panelW, panelH, 10);

  drawListPanel(leftX, panelY, panelW, panelH);
  drawTuplePanel(rightX + tupleOffset, panelY, panelW, panelH);
}

function drawListPanel(x, y, w, h) {
  noStroke();
  fill('#14532d');
  textSize(20);
  textAlign(CENTER, TOP);
  noStroke();
  text('List', x + w / 2, y + 10);

  fill('#166534');
  textSize(14);
  noStroke();
  text('[ ' + listValues.join(', ') + ' ]', x + w / 2, y + 42);

  drawValueBoxes(listValues, x, y + 90, w, '#16a34a', '#dcfce7', false);

  noStroke();
  fill(listMessageColor);
  textSize(13);
  textAlign(LEFT, TOP);
  noStroke();
  text(wrapText(listMessage, 34), x + 12, y + h - 72);
}

function drawTuplePanel(x, y, w, h) {
  noStroke();
  fill('#92400e');
  textSize(20);
  textAlign(CENTER, TOP);
  noStroke();
  text('Tuple', x + w / 2, y + 10);
  drawLockIcon(x + w - 24, y + 18);

  fill('#a16207');
  textSize(14);
  noStroke();
  text('( ' + tupleValues.join(', ') + ' )', x + w / 2, y + 42);

  drawValueBoxes(tupleValues, x, y + 90, w, '#d4a017', '#fef3c7', true);

  noStroke();
  fill(tupleMessageColor);
  textSize(13);
  textAlign(LEFT, TOP);
  noStroke();
  text(wrapText(tupleMessage, 34), x + 12, y + h - 94);
}

function drawLockIcon(x, y) {
  stroke('#92400e');
  strokeWeight(2);
  noFill();
  arc(x, y - 4, 10, 10, PI, TWO_PI);
  fill('#f59e0b');
  rect(x - 6, y - 4, 12, 10, 2);
}

function drawValueBoxes(values, panelX, boxY, panelW, borderColor, fillColor, locked) {
  const count = max(1, values.length);
  const gap = 8;
  const totalGap = gap * (count - 1);
  const available = panelW - 24 - totalGap;
  const boxW = constrain(available / count, 34, 52);
  const totalW = boxW * count + totalGap;
  const startX = panelX + (panelW - totalW) / 2;
  const boxH = 52;

  for (let i = 0; i < values.length; i += 1) {
    const bx = startX + i * (boxW + gap);

    fill(fillColor);
    stroke(borderColor);
    strokeWeight(2);
    rect(bx, boxY, boxW, boxH, 8);

    noStroke();
    fill('#1f2937');
    textAlign(CENTER, CENTER);
    textSize(16);
    noStroke();
    text(String(values[i]), bx + boxW / 2, boxY + boxH / 2);

    if (locked) {
      noStroke();
      fill('#92400e');
      textSize(10);
      noStroke();
      text('lock', bx + boxW / 2, boxY + boxH - 9);
    }
  }
}

function applyChangeItem() {
  listValues[0] = 99;
  listMessage = 'Success: list[0] = 99';
  listMessageColor = '#166534';
  listGlow = 1;

  tupleMessage = "TypeError: 'tuple' object does not support item assignment";
  tupleMessageColor = '#991b1b';
  tupleFlash = 1;
  tupleShake = 1;
}

function applyAddItem() {
  listValues.push(7);
  listMessage = 'Success: list.append(7)';
  listMessageColor = '#166534';
  listGlow = 1;

  tupleMessage = "AttributeError: 'tuple' object has no attribute 'append'";
  tupleMessageColor = '#991b1b';
  tupleFlash = 1;
  tupleShake = 1;
}

function applyRemoveItem() {
  if (listValues.length > 0) {
    listValues.pop();
    listMessage = 'Success: list.pop() removed last item';
    listMessageColor = '#166534';
  } else {
    listMessage = 'List is already empty.';
    listMessageColor = '#92400e';
  }
  listGlow = 1;

  tupleMessage = "AttributeError: 'tuple' object has no attribute 'pop'";
  tupleMessageColor = '#991b1b';
  tupleFlash = 1;
  tupleShake = 1;
}

function resetState() {
  listValues = initialValues.slice();
  tupleValues = initialValues.slice();

  listMessage = 'Ready: list can be modified.';
  tupleMessage = 'Ready: tuple is immutable.';
  listMessageColor = '#1b5e20';
  tupleMessageColor = '#7f1d1d';

  listGlow = 0;
  tupleFlash = 0;
  tupleShake = 0;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = max(400, container.offsetWidth);
    positionControls();
  }
}

function positionControls() {
  if (!changeBtn || !addBtn || !removeBtn || !resetBtn) {
    return;
  }

  const buttonY = drawHeight + 10;
  const gap = 8;
  const totalGap = gap * 3;
  const usable = canvasWidth - margin * 2 - totalGap;
  const buttonWidth = max(74, floor(usable / 4));

  changeBtn.position(margin, buttonY);
  changeBtn.size(buttonWidth, 28);

  addBtn.position(margin + (buttonWidth + gap), buttonY);
  addBtn.size(buttonWidth, 28);

  removeBtn.position(margin + (buttonWidth + gap) * 2, buttonY);
  removeBtn.size(buttonWidth, 28);

  resetBtn.position(margin + (buttonWidth + gap) * 3, buttonY);
  resetBtn.size(buttonWidth, 28);
}

function wrapText(value, maxChars) {
  if (value.length <= maxChars) {
    return value;
  }

  const words = value.split(' ');
  let line = '';
  let out = '';

  for (let i = 0; i < words.length; i += 1) {
    const next = line.length === 0 ? words[i] : line + ' ' + words[i];
    if (next.length <= maxChars) {
      line = next;
    } else {
      out += line + '\n';
      line = words[i];
    }
  }

  if (line.length > 0) {
    out += line;
  }

  return out;
}
