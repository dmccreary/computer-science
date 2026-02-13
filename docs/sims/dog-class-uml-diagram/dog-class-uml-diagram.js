/*
 * Dog Class UML-Style Diagram
 * Shows the complete Dog class structure in a UML three-section box format:
 * class name, attributes (instance + class), and methods.
 * Hover over items for descriptions. Toggle code panel with a button.
 *
 * Bloom Level: Understand (L2) — describe, summarize
 * Learning Objective: Read a class diagram showing the structure of a Python class.
 */

// ---- responsive canvas globals ----
let canvasWidth = 400;
let drawHeight = 500;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// ---- application state ----
let showCode = false;
let showCodeBtn;
let hoveredItem = null;

// ---- color palette ----
const HEADER_BG = '#1a3a6a';
const HEADER_TEXT = '#ffffff';
const ATTR_BG = '#dbe9ff';
const ATTR_STROKE = '#6e9fd6';
const METHOD_BG = '#d8f0d8';
const METHOD_STROKE = '#6bb86b';
const BOX_STROKE = '#2c5693';
const BG_COLOR = '#f7f9fc';
const HOVER_HIGHLIGHT = '#fff3cc';
const CLASS_ATTR_TAG = '#e07020';
const INSTANCE_TAG = '#2c7fb8';

// ---- data ----
const attributes = [
  { name: 'species: str', type: 'class', desc: 'Shared by all dogs. Value: "Canis familiaris"' },
  { name: 'name: str', type: 'instance', desc: 'The individual dog\'s name, unique per object.' },
  { name: 'breed: str', type: 'instance', desc: 'The dog\'s breed, unique per object.' },
  { name: 'age: int', type: 'instance', desc: 'The dog\'s age in years, unique per object.' }
];

const methods = [
  { name: '__init__(name, breed, age)', desc: 'Constructor: sets up a new Dog with name, breed, and age.' },
  { name: 'bark() -> str', desc: 'Returns a string like "Buddy says: Woof!"' },
  { name: 'describe() -> str', desc: 'Returns a description like "Buddy is a 3-year-old Golden Retriever."' },
  { name: 'birthday() -> str', desc: 'Increments age by 1 and returns a birthday message.' },
  { name: '__str__() -> str', desc: 'User-friendly string for print(). Example: "Buddy the Golden Retriever, age 3"' },
  { name: '__repr__() -> str', desc: 'Developer string for debugging. Example: Dog(\'Buddy\', \'Golden Retriever\', 3)' }
];

const codeLines = [
  'class Dog:',
  '    species = "Canis familiaris"',
  '',
  '    def __init__(self, name, breed, age):',
  '        self.name = name',
  '        self.breed = breed',
  '        self._age = age',
  '',
  '    def bark(self):',
  '        return f"{self.name} says: Woof!"',
  '',
  '    def describe(self):',
  '        return f"{self.name} is a ...',
  '',
  '    def birthday(self):',
  '        self._age += 1',
  '        return f"Happy birthday, ..."',
  '',
  '    def __str__(self):',
  '        return f"{self.name} the ..."',
  '',
  '    def __repr__(self):',
  '        return f"Dog(\'{self.name}\', ...)"'
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  showCodeBtn = createButton('Show Code');
  showCodeBtn.position(10, drawHeight + 12);
  showCodeBtn.mousePressed(toggleCode);

  describe(
    'A UML-style class diagram showing the Dog class with header, attributes section, ' +
    'and methods section. Hover over items for descriptions.',
    LABEL
  );
}

function draw() {
  updateCanvasSize();
  background(BG_COLOR);

  // control area
  fill('white');
  noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);
  stroke('silver');
  strokeWeight(1);
  line(0, drawHeight, canvasWidth, drawHeight);

  hoveredItem = null;

  // determine layout
  let boxW, boxX, codeX, codeW;
  if (showCode && canvasWidth > 500) {
    boxW = canvasWidth * 0.48;
    boxX = margin;
    codeX = boxX + boxW + 20;
    codeW = canvasWidth - codeX - margin;
  } else {
    boxW = min(canvasWidth - margin * 2, 420);
    boxX = (canvasWidth - boxW) / 2;
    codeX = boxX;
    codeW = boxW;
  }

  // ---- Title ----
  noStroke();
  fill('#3c5a8a');
  textAlign(CENTER, TOP);
  textSize(18);
  text('UML Class Diagram', canvasWidth / 2, 12);
  textSize(13);
  fill('#7a8ea8');
  text('Hover over any item for details', canvasWidth / 2, 34);

  // ---- Draw the UML box ----
  let boxY = 58;
  let headerH = 44;
  let lineH = 28;
  let attrSectionH = attributes.length * lineH + 16;
  let methodSectionH = methods.length * lineH + 16;
  let boxH = headerH + attrSectionH + methodSectionH;

  // outer border
  stroke(BOX_STROKE);
  strokeWeight(2);
  noFill();
  rect(boxX, boxY, boxW, boxH, 6);

  // --- Header section ---
  fill(HEADER_BG);
  noStroke();
  rect(boxX + 1, boxY + 1, boxW - 2, headerH, 5, 5, 0, 0);
  fill(HEADER_TEXT);
  textAlign(CENTER, CENTER);
  textSize(20);
  textStyle(BOLD);
  text('Dog', boxX + boxW / 2, boxY + headerH / 2);
  textStyle(NORMAL);

  // --- Attributes section ---
  let attrY = boxY + headerH;
  fill(ATTR_BG);
  noStroke();
  rect(boxX + 1, attrY, boxW - 2, attrSectionH);

  // divider line
  stroke(BOX_STROKE);
  strokeWeight(1.5);
  line(boxX, attrY, boxX + boxW, attrY);

  // section label
  noStroke();
  fill('#4a6a9a');
  textAlign(LEFT, TOP);
  textSize(11);
  text('ATTRIBUTES', boxX + 10, attrY + 3);

  for (let i = 0; i < attributes.length; i++) {
    let itemY = attrY + 16 + i * lineH;
    let isHovered = mouseX > boxX && mouseX < boxX + boxW &&
                    mouseY > itemY && mouseY < itemY + lineH;

    if (isHovered) {
      fill(HOVER_HIGHLIGHT);
      noStroke();
      rect(boxX + 2, itemY, boxW - 4, lineH);
      hoveredItem = attributes[i];
    }

    noStroke();
    textAlign(LEFT, CENTER);
    textSize(15);
    fill('#2a3d55');
    text(attributes[i].name, boxX + 14, itemY + lineH / 2);

    // type tag
    let tagLabel = attributes[i].type === 'class' ? 'class' : 'instance';
    let tagColor = attributes[i].type === 'class' ? CLASS_ATTR_TAG : INSTANCE_TAG;
    let tagX = boxX + boxW - 80;
    fill(tagColor);
    textSize(10);
    textAlign(CENTER, CENTER);
    let tw = textWidth(tagLabel) + 12;
    rect(tagX, itemY + 5, tw, 18, 9);
    fill('white');
    text(tagLabel, tagX + tw / 2, itemY + 14);
  }

  // --- Methods section ---
  let methodY = attrY + attrSectionH;
  fill(METHOD_BG);
  noStroke();
  rect(boxX + 1, methodY, boxW - 2, methodSectionH, 0, 0, 5, 5);

  // divider line
  stroke(BOX_STROKE);
  strokeWeight(1.5);
  line(boxX, methodY, boxX + boxW, methodY);

  // section label
  noStroke();
  fill('#3a7a3a');
  textAlign(LEFT, TOP);
  textSize(11);
  text('METHODS', boxX + 10, methodY + 3);

  for (let i = 0; i < methods.length; i++) {
    let itemY = methodY + 16 + i * lineH;
    let isHovered = mouseX > boxX && mouseX < boxX + boxW &&
                    mouseY > itemY && mouseY < itemY + lineH;

    if (isHovered) {
      fill(HOVER_HIGHLIGHT);
      noStroke();
      rect(boxX + 2, itemY, boxW - 4, lineH);
      hoveredItem = methods[i];
    }

    noStroke();
    textAlign(LEFT, CENTER);
    textSize(14);
    fill('#2a4030');
    text(methods[i].name, boxX + 14, itemY + lineH / 2);
  }

  // ---- Code panel ----
  if (showCode) {
    let codePanelY = showCode && canvasWidth > 500 ? boxY : boxY + boxH + 20;
    let codePanelX = showCode && canvasWidth > 500 ? codeX : codeX;
    let codePanelW = codeW;
    let codeLineH = 17;
    let codePanelH = codeLines.length * codeLineH + 24;

    fill('#1e1e2e');
    stroke('#4a5568');
    strokeWeight(1);
    rect(codePanelX, codePanelY, codePanelW, codePanelH, 6);

    // title bar
    fill('#2d2d44');
    noStroke();
    rect(codePanelX + 1, codePanelY + 1, codePanelW - 2, 20, 5, 5, 0, 0);
    fill('#a0a8b8');
    textSize(11);
    textAlign(LEFT, CENTER);
    text('dog.py', codePanelX + 10, codePanelY + 11);

    // code text
    textSize(12);
    textAlign(LEFT, TOP);
    for (let i = 0; i < codeLines.length; i++) {
      let ly = codePanelY + 26 + i * codeLineH;
      // syntax coloring
      let line = codeLines[i];
      if (line.startsWith('class ') || line.includes('def ')) {
        fill('#7eb8ff');
      } else if (line.includes('return ') || line.includes('self.')) {
        fill('#c0d8a0');
      } else if (line.includes('#')) {
        fill('#6a7a6a');
      } else {
        fill('#d4d8e0');
      }
      text(line, codePanelX + 10, ly);
    }
  }

  // ---- Tooltip ----
  if (hoveredItem) {
    drawTooltip(hoveredItem);
  }
}

function drawTooltip(item) {
  let pad = 10;
  textSize(13);
  let lines = wrapText(item.desc, 220);
  let tw = 240;
  let th = lines.length * 18 + pad * 2 + 22;

  let tx = mouseX + 16;
  let ty = mouseY - th / 2;

  // keep on screen
  if (tx + tw > canvasWidth - 10) tx = mouseX - tw - 16;
  if (ty < 10) ty = 10;
  if (ty + th > drawHeight - 10) ty = drawHeight - th - 10;

  fill(255, 255, 255, 240);
  stroke('#6699cc');
  strokeWeight(1.5);
  rect(tx, ty, tw, th, 8);

  noStroke();
  fill('#2a3d55');
  textAlign(LEFT, TOP);
  textSize(14);
  textStyle(BOLD);
  text(item.name, tx + pad, ty + pad);
  textStyle(NORMAL);

  fill('#4a5a6a');
  textSize(13);
  for (let i = 0; i < lines.length; i++) {
    text(lines[i], tx + pad, ty + pad + 22 + i * 18);
  }
}

function wrapText(str, maxW) {
  let words = str.split(' ');
  let lines = [];
  let current = '';
  textSize(13);
  for (let w of words) {
    let test = current === '' ? w : current + ' ' + w;
    if (textWidth(test) > maxW && current !== '') {
      lines.push(current);
      current = w;
    } else {
      current = test;
    }
  }
  if (current !== '') lines.push(current);
  return lines;
}

function toggleCode() {
  showCode = !showCode;
  showCodeBtn.html(showCode ? 'Hide Code' : 'Show Code');
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const mainEl = document.querySelector('main');
  if (mainEl) {
    canvasWidth = mainEl.clientWidth;
  }
}
