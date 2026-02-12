// Modular Design Builder MicroSim
// Drag-and-drop code grouping into functions
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 400;
let drawHeight = 550;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;

// Controls
let checkButton, showSolutionButton, resetButton;

// State
let codeBlocks = [];
let functionBoxes = [];
let draggingBlock = null;
let dragOffsetX = 0;
let dragOffsetY = 0;
let showSolution = false;
let feedback = [];
let checked = false;

// Code lines
let codeLines = [
  { id: 0, text: 'name = input("Name: ")', correctFn: 0 },
  { id: 1, text: 'age = int(input("Age: "))', correctFn: 0 },
  { id: 2, text: 'greeting = "Hello, " + name', correctFn: -1 },
  { id: 3, text: 'print(greeting)', correctFn: -1 },
  { id: 4, text: 'birth_year = 2026 - age', correctFn: -1 },
  { id: 5, text: 'print("Born: " + str(birth_year))', correctFn: -1 },
  { id: 6, text: 'if age >= 16:', correctFn: 1 },
  { id: 7, text: '    print("You can drive!")', correctFn: 1 },
  { id: 8, text: 'else:', correctFn: 1 },
  { id: 9, text: '    print("Not old enough.")', correctFn: 1 },
  { id: 10, text: 'print("Thanks for visiting!")', correctFn: 2 },
  { id: 11, text: 'print("Goodbye, " + name)', correctFn: 2 },
];

// Function containers
let fnDefs = [
  { name: 'get_info()', color: [70, 130, 220], correctIds: [0, 1] },
  { name: 'check_driving()', color: [46, 160, 67], correctIds: [6, 7, 8, 9] },
  { name: 'show_farewell()', color: [230, 150, 50], correctIds: [10, 11] },
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  checkButton = createButton('Check Answer');
  checkButton.position(10, drawHeight + 12);
  checkButton.mousePressed(checkAnswer);

  showSolutionButton = createButton('Show Solution');
  showSolutionButton.position(120, drawHeight + 12);
  showSolutionButton.mousePressed(toggleSolution);

  resetButton = createButton('Reset');
  resetButton.position(230, drawHeight + 12);
  resetButton.mousePressed(doReset);

  initBlocks();

  describe('Drag-and-drop exercise: group code lines into functions to practice modular design.', LABEL);
}

function initBlocks() {
  codeBlocks = [];
  let blockH = 24;
  let startY = 52;

  for (let i = 0; i < codeLines.length; i++) {
    codeBlocks.push({
      id: codeLines[i].id,
      text: codeLines[i].text,
      correctFn: codeLines[i].correctFn,
      x: margin + 5,
      y: startY + i * (blockH + 3),
      w: 0, // calculated in draw
      h: blockH,
      assignedFn: -1, // which function box (-1 = unassigned)
      isDragging: false,
    });
  }

  // Function boxes
  functionBoxes = [];
  let fnY = 52;
  let fnH = 110;
  let fnGap = 10;

  for (let i = 0; i < fnDefs.length; i++) {
    functionBoxes.push({
      name: fnDefs[i].name,
      color: fnDefs[i].color,
      correctIds: fnDefs[i].correctIds,
      x: 0, // calculated in draw
      y: fnY + i * (fnH + fnGap),
      w: 0,
      h: fnH,
      blocks: [],
    });
  }

  feedback = [];
  checked = false;
  showSolution = false;
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
  text('Modular Design Builder', canvasWidth / 2, 8);

  // Subtitle
  fill(120);
  textSize(11);
  text('Drag code lines into the correct function boxes', canvasWidth / 2, 28);

  let halfW = canvasWidth / 2;
  let leftW = halfW - margin - 5;
  let rightX = halfW + 5;
  let rightW = halfW - margin - 5;

  // Left panel label
  noStroke();
  fill(80);
  textAlign(LEFT, TOP);
  textSize(11);
  textStyle(BOLD);
  text('Original Code:', margin, 42);
  textStyle(NORMAL);

  // Right panel label
  fill(80);
  textAlign(LEFT, TOP);
  text('Functions:', rightX, 42);

  // Divider
  stroke(220);
  strokeWeight(1);
  line(halfW, 40, halfW, drawHeight - 10);

  // Draw function boxes
  for (let i = 0; i < functionBoxes.length; i++) {
    let fb = functionBoxes[i];
    fb.x = rightX;
    fb.w = rightW;
    drawFunctionBox(fb, i);
  }

  // Draw unassigned code blocks (left panel)
  textFont('monospace');
  textSize(Math.min(10, canvasWidth * 0.022));

  for (let block of codeBlocks) {
    if (block.assignedFn === -1 && !block.isDragging) {
      block.w = leftW - 10;
      drawCodeBlock(block, false);
    }
  }

  // Draw dragging block on top
  if (draggingBlock) {
    draggingBlock.w = leftW - 10;
    drawCodeBlock(draggingBlock, true);
  }

  textFont('Arial');

  // Feedback panel
  if (checked) {
    drawFeedback();
  }
}

function drawFunctionBox(fb, idx) {
  let isDropTarget = draggingBlock && mouseX > fb.x && mouseX < fb.x + fb.w &&
                     mouseY > fb.y && mouseY < fb.y + fb.h;

  // Background
  fill(isDropTarget ? [fb.color[0], fb.color[1], fb.color[2], 30] : [250, 250, 255]);
  stroke(fb.color);
  strokeWeight(isDropTarget ? 3 : 2);
  rect(fb.x, fb.y, fb.w, fb.h, 8);

  // Header
  noStroke();
  fill(fb.color);
  textAlign(LEFT, TOP);
  textSize(11);
  textStyle(BOLD);
  text('def ' + fb.name, fb.x + 8, fb.y + 6);
  textStyle(NORMAL);

  // Draw assigned blocks inside
  let blockY = fb.y + 24;
  textFont('monospace');
  textSize(Math.min(9, canvasWidth * 0.02));

  let assignedBlocks = codeBlocks.filter(b => b.assignedFn === idx && !b.isDragging);
  for (let block of assignedBlocks) {
    block.x = fb.x + 8;
    block.y = blockY;
    block.w = fb.w - 16;
    drawCodeBlock(block, false, fb.color);
    blockY += block.h + 2;
  }

  textFont('Arial');

  // Empty hint
  if (assignedBlocks.length === 0 && !isDropTarget) {
    fill(200);
    textSize(10);
    textAlign(CENTER, CENTER);
    text('Drop code here', fb.x + fb.w / 2, fb.y + fb.h / 2 + 5);
  }

  // Show solution overlay
  if (showSolution) {
    let solutionBlocks = codeLines.filter(cl => fb.correctIds.includes(cl.id));
    fill(fb.color[0], fb.color[1], fb.color[2], 20);
    noStroke();
    rect(fb.x + 2, fb.y + 22, fb.w - 4, fb.h - 24, 4);

    fill(fb.color);
    textFont('monospace');
    textSize(Math.min(9, canvasWidth * 0.02));
    textAlign(LEFT, TOP);
    let sy = fb.y + 26;
    for (let sb of solutionBlocks) {
      text('    ' + sb.text, fb.x + 8, sy);
      sy += 16;
    }
    textFont('Arial');
  }
}

function drawCodeBlock(block, isDragging, boxColor) {
  let bgColor, borderColor;

  if (checked && block.assignedFn >= 0) {
    let fb = functionBoxes[block.assignedFn];
    let isCorrect = fb.correctIds.includes(block.id);
    bgColor = isCorrect ? [220, 255, 220] : [255, 220, 220];
    borderColor = isCorrect ? [46, 160, 67] : [220, 60, 60];
  } else if (boxColor) {
    bgColor = [boxColor[0], boxColor[1], boxColor[2], 20];
    borderColor = [boxColor[0], boxColor[1], boxColor[2], 100];
  } else {
    bgColor = isDragging ? [255, 255, 200] : [248, 248, 252];
    borderColor = isDragging ? [180, 180, 0] : [200];
  }

  fill(bgColor);
  stroke(borderColor);
  strokeWeight(isDragging ? 2 : 1);
  rect(block.x, block.y, block.w, block.h, 4);

  noStroke();
  fill(isDragging ? [40] : [80]);
  textAlign(LEFT, CENTER);
  textFont('monospace');
  textSize(Math.min(10, canvasWidth * 0.022));

  let displayText = block.text;
  let maxW = block.w - 10;
  if (textWidth(displayText) > maxW) {
    while (textWidth(displayText + '...') > maxW && displayText.length > 5) {
      displayText = displayText.slice(0, -1);
    }
    displayText += '...';
  }
  text(displayText, block.x + 5, block.y + block.h / 2);
  textFont('Arial');

  // Line number badge
  fill(180);
  textSize(8);
  textAlign(RIGHT, CENTER);
  text(block.id + 1, block.x + block.w - 4, block.y + block.h / 2);
}

function drawFeedback() {
  let y = drawHeight - 65;
  let correctCount = 0;
  let totalAssigned = 0;

  for (let block of codeBlocks) {
    if (block.assignedFn >= 0) {
      totalAssigned++;
      let fb = functionBoxes[block.assignedFn];
      if (fb.correctIds.includes(block.id)) {
        correctCount++;
      }
    }
  }

  let totalExpected = fnDefs.reduce((sum, fn) => sum + fn.correctIds.length, 0);
  let allCorrect = correctCount === totalExpected && totalAssigned === totalExpected;

  fill(allCorrect ? [220, 255, 220] : [255, 248, 230]);
  stroke(allCorrect ? [46, 160, 67] : [230, 150, 50]);
  strokeWeight(2);
  rect(margin, y, canvasWidth - margin * 2, 55, 8);

  noStroke();
  fill(allCorrect ? [30, 120, 40] : [180, 100, 20]);
  textAlign(CENTER, CENTER);
  textSize(14);
  textStyle(BOLD);

  if (allCorrect) {
    text('Perfect! All code is correctly organized!', canvasWidth / 2, y + 16);
  } else {
    text(correctCount + ' of ' + totalExpected + ' lines correctly placed', canvasWidth / 2, y + 16);
  }
  textStyle(NORMAL);

  fill(100);
  textSize(11);
  if (!allCorrect) {
    if (totalAssigned < totalExpected) {
      text('Some lines still need to be placed. Lines 3-6 can stay in main.', canvasWidth / 2, y + 38);
    } else {
      text('Check the red highlights — those lines belong elsewhere.', canvasWidth / 2, y + 38);
    }
  } else {
    text('Each function has a single clear purpose — that\'s modular design!', canvasWidth / 2, y + 38);
  }
}

function checkAnswer() {
  checked = true;
}

function toggleSolution() {
  showSolution = !showSolution;
  showSolutionButton.html(showSolution ? 'Hide Solution' : 'Show Solution');
}

function doReset() {
  initBlocks();
}

function mousePressed() {
  // Check if clicking on a code block
  for (let i = codeBlocks.length - 1; i >= 0; i--) {
    let block = codeBlocks[i];
    if (mouseX > block.x && mouseX < block.x + block.w &&
        mouseY > block.y && mouseY < block.y + block.h) {
      draggingBlock = block;
      block.isDragging = true;
      dragOffsetX = mouseX - block.x;
      dragOffsetY = mouseY - block.y;

      // Remove from current function box
      if (block.assignedFn >= 0) {
        block.assignedFn = -1;
      }
      checked = false;
      return;
    }
  }
}

function mouseDragged() {
  if (draggingBlock) {
    draggingBlock.x = mouseX - dragOffsetX;
    draggingBlock.y = mouseY - dragOffsetY;
  }
}

function mouseReleased() {
  if (!draggingBlock) return;

  // Check if dropped on a function box
  for (let i = 0; i < functionBoxes.length; i++) {
    let fb = functionBoxes[i];
    if (mouseX > fb.x && mouseX < fb.x + fb.w &&
        mouseY > fb.y && mouseY < fb.y + fb.h) {
      // Count current blocks in this box
      let currentCount = codeBlocks.filter(b => b.assignedFn === i).length;
      if (currentCount < 4) {
        draggingBlock.assignedFn = i;
      }
      break;
    }
  }

  // Reset position for unassigned blocks
  if (draggingBlock.assignedFn === -1) {
    let idx = codeBlocks.indexOf(draggingBlock);
    draggingBlock.x = margin + 5;
    draggingBlock.y = 52 + idx * 27;
  }

  draggingBlock.isDragging = false;
  draggingBlock = null;
  checked = false;
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
