// List Creation Visualizer MicroSim
// Shows how Python stores list elements in sequential indexed positions
// Students type comma-separated values and see them as labeled boxes

let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// List data
let listItems = ["apple", "banana", "cherry"];
let hoveredIndex = -1;

// Animation for new items
let animatingItem = false;
let animItemX = 0;
let animItemTargetX = 0;
let animProgress = 0;

// Controls
let inputField;
let createBtn;
let addBtn;
let addInput;
let presetFruitsBtn, presetNumbersBtn, presetMixedBtn, presetEmptyBtn;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  // Row 1: input field and Create List button
  inputField = createInput('apple, banana, cherry');
  inputField.position(10, drawHeight + 8);
  inputField.size(200);
  inputField.attribute('placeholder', 'Enter comma-separated values');

  createBtn = createButton('Create List');
  createBtn.position(220, drawHeight + 7);
  createBtn.mousePressed(createListFromInput);

  // Row 2: Preset buttons and Add Item
  presetFruitsBtn = createButton('Fruits');
  presetFruitsBtn.position(10, drawHeight + 42);
  presetFruitsBtn.mousePressed(() => loadPreset('fruits'));

  presetNumbersBtn = createButton('Numbers');
  presetNumbersBtn.position(70, drawHeight + 42);
  presetNumbersBtn.mousePressed(() => loadPreset('numbers'));

  presetMixedBtn = createButton('Mixed');
  presetMixedBtn.position(145, drawHeight + 42);
  presetMixedBtn.mousePressed(() => loadPreset('mixed'));

  presetEmptyBtn = createButton('Empty');
  presetEmptyBtn.position(205, drawHeight + 42);
  presetEmptyBtn.mousePressed(() => loadPreset('empty'));

  addInput = createInput('');
  addInput.position(270, drawHeight + 42);
  addInput.size(80);
  addInput.attribute('placeholder', 'new item');

  addBtn = createButton('Add Item');
  addBtn.position(360, drawHeight + 42);
  addBtn.mousePressed(addItem);

  describe('Interactive list creation visualizer showing Python list elements as indexed colored boxes', LABEL);
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
  textSize(24);
  text('List Creation Visualizer', canvasWidth / 2, 12);

  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);

  if (listItems.length === 0) {
    fill('#666');
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(18);
    text('Empty list: []', canvasWidth / 2, drawHeight / 2);
    textAlign(LEFT, CENTER);
    textSize(defaultTextSize);
    return;
  }

  // Calculate box dimensions
  let maxBoxWidth = 120;
  let minBoxWidth = 50;
  let totalItemCount = listItems.length;
  let availableWidth = canvasWidth - 2 * margin;
  let gap = 8;
  let boxWidth = Math.min(maxBoxWidth, (availableWidth - gap * (totalItemCount - 1)) / totalItemCount);
  boxWidth = Math.max(minBoxWidth, boxWidth);
  let boxHeight = 60;

  // Center the boxes
  let totalWidth = totalItemCount * boxWidth + (totalItemCount - 1) * gap;
  let startX = (canvasWidth - totalWidth) / 2;
  let boxY = drawHeight / 2 - 10;

  // Check hover
  hoveredIndex = -1;
  for (let i = 0; i < totalItemCount; i++) {
    let bx = startX + i * (boxWidth + gap);

    // Handle animation for last item
    if (animatingItem && i === totalItemCount - 1) {
      bx = lerp(animItemX, animItemTargetX, animProgress);
    }

    if (mouseX >= bx && mouseX <= bx + boxWidth &&
        mouseY >= boxY && mouseY <= boxY + boxHeight) {
      hoveredIndex = i;
    }
  }

  // Draw boxes
  for (let i = 0; i < totalItemCount; i++) {
    let bx = startX + i * (boxWidth + gap);

    // Handle animation for last item
    if (animatingItem && i === totalItemCount - 1) {
      bx = lerp(animItemX, animItemTargetX, animProgress);
      animProgress += 0.05;
      if (animProgress >= 1) {
        animProgress = 1;
        animatingItem = false;
      }
    }

    let isHovered = (i === hoveredIndex);

    // Box color alternating blue/green
    if (i % 2 === 0) {
      fill(isHovered ? '#7CB9E8' : '#A8D8EA');
    } else {
      fill(isHovered ? '#77DD77' : '#B5EAD7');
    }
    stroke(isHovered ? '#333' : '#999');
    strokeWeight(isHovered ? 2 : 1);
    rect(bx, boxY, boxWidth, boxHeight, 8);

    // Index label above box
    noStroke();
    fill('#444');
    textAlign(CENTER, BOTTOM);
    textSize(14);
    text(i, bx + boxWidth / 2, boxY - 4);

    // Item text inside box
    fill('#222');
    textAlign(CENTER, CENTER);
    textSize(Math.min(14, boxWidth / listItems[i].length * 1.5 + 2));
    // Truncate long text
    let displayText = listItems[i];
    if (displayText.length > 10) {
      displayText = displayText.substring(0, 8) + '..';
    }
    text(displayText, bx + boxWidth / 2, boxY + boxHeight / 2);
  }

  // Hover info
  if (hoveredIndex >= 0) {
    noStroke();
    fill('#333');
    textAlign(CENTER, TOP);
    textSize(16);
    text('Index ' + hoveredIndex + ': "' + listItems[hoveredIndex] + '"',
         canvasWidth / 2, boxY + boxHeight + 20);
  }

  // Python code representation below
  noStroke();
  fill('#333');
  textAlign(CENTER, TOP);
  textSize(14);
  let codeStr = buildPythonCode();
  // Truncate if too long
  if (codeStr.length > 60) {
    codeStr = codeStr.substring(0, 57) + '...]';
  }
  text(codeStr, canvasWidth / 2, boxY + boxHeight + 45);

  // Length indicator
  fill('#666');
  textSize(13);
  text('len() = ' + listItems.length, canvasWidth / 2, boxY + boxHeight + 65);

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function buildPythonCode() {
  let parts = listItems.map(item => {
    // Check if it looks like a number
    if (!isNaN(item) && item.trim() !== '') {
      return item.trim();
    }
    // Check if boolean
    if (item.trim() === 'True' || item.trim() === 'False') {
      return item.trim();
    }
    return '"' + item.trim() + '"';
  });
  return '[' + parts.join(', ') + ']';
}

function createListFromInput() {
  let val = inputField.value().trim();
  if (val === '') {
    listItems = [];
    return;
  }
  listItems = val.split(',').map(s => s.trim()).filter(s => s.length > 0);
  animatingItem = false;
}

function addItem() {
  let val = addInput.value().trim();
  if (val === '') return;

  // Set up animation
  let totalItemCount = listItems.length;
  let availableWidth = canvasWidth - 2 * margin;
  let gap = 8;
  let boxWidth = Math.min(120, (availableWidth - gap * totalItemCount) / (totalItemCount + 1));
  boxWidth = Math.max(50, boxWidth);
  let totalWidth = (totalItemCount + 1) * boxWidth + totalItemCount * gap;
  let startX = (canvasWidth - totalWidth) / 2;

  animItemX = canvasWidth; // start from right edge
  animItemTargetX = startX + totalItemCount * (boxWidth + gap);
  animProgress = 0;
  animatingItem = true;

  listItems.push(val);
  addInput.value('');
}

function loadPreset(type) {
  animatingItem = false;
  switch (type) {
    case 'fruits':
      listItems = ["apple", "banana", "cherry"];
      inputField.value('apple, banana, cherry');
      break;
    case 'numbers':
      listItems = ["95", "87", "92", "78", "100"];
      inputField.value('95, 87, 92, 78, 100');
      break;
    case 'mixed':
      listItems = ["Alice", "16", "True", "3.14"];
      inputField.value('Alice, 16, True, 3.14');
      break;
    case 'empty':
      listItems = [];
      inputField.value('');
      break;
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  inputField.size(Math.min(200, canvasWidth / 2 - 20));
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  canvasWidth = Math.floor(container.width);
}
