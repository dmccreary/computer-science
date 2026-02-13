// Three Types of Errors - Visual Comparison Infographic
// Three-column comparison chart for syntax, runtime, and logic errors
// Hover to see details and examples
// MicroSim template version 2026.02

let canvasWidth = 400;
let drawHeight = 460;
let controlHeight = 0;
let canvasHeight = drawHeight + controlHeight;
let margin = 15;
let defaultTextSize = 16;

let hoveredCell = null;
let selectedCol = null;

const COLUMNS = [
  {
    title: 'Syntax Error',
    color: [200, 60, 60],
    lightColor: [255, 220, 220],
    icon: '\u2717', // ✗
    rows: [
      {
        label: 'When',
        text: 'Before the program runs',
        detail: 'Python reads your entire file before executing it. If the grammar is wrong, it stops immediately.',
        example2: 'message = "Hello world\' — mismatched quotes'
      },
      {
        label: 'Python Says',
        text: 'Points to the line with the problem, won\'t run at all',
        detail: 'You get a SyntaxError with a caret (^) pointing to exactly where Python got confused.',
        example2: 'SyntaxError: expected \':\''
      },
      {
        label: 'Example',
        text: 'if x > 5\n  (missing colon)',
        detail: 'The colon after the condition is required syntax. Without it, Python can\'t parse the if statement.',
        example2: 'fro i in range(10): — misspelled "for"'
      },
      {
        label: 'How to Fix',
        text: 'Read the error message, check the indicated line',
        detail: 'Syntax errors are the easiest to fix. Python tells you the file, line number, and what it expected to see.',
        example2: 'Use your IDE\'s linting to catch these before running'
      }
    ]
  },
  {
    title: 'Runtime Error',
    color: [220, 140, 0],
    lightColor: [255, 235, 200],
    icon: '\u26A0', // ⚠
    rows: [
      {
        label: 'When',
        text: 'While the program is running',
        detail: 'The syntax is valid, but something unexpected happens during execution — like dividing by zero.',
        example2: 'May work with some inputs and crash with others'
      },
      {
        label: 'Python Says',
        text: 'Crashes with a traceback and exception name',
        detail: 'The traceback shows the exact chain of function calls that led to the error. Read from bottom up!',
        example2: 'Traceback → File → Line → ExceptionType: message'
      },
      {
        label: 'Example',
        text: '10 / 0\n  (ZeroDivisionError)',
        detail: 'Division by zero is mathematically undefined. Python can\'t compute a result, so it raises an exception.',
        example2: 'names[5] on a 3-item list → IndexError'
      },
      {
        label: 'How to Fix',
        text: 'Read the traceback, use try-except to handle it',
        detail: 'Identify what input or state caused the error, then add validation or exception handling.',
        example2: 'Wrap risky code in try-except blocks'
      }
    ]
  },
  {
    title: 'Logic Error',
    color: [160, 160, 0],
    lightColor: [255, 255, 210],
    icon: '\u2753', // ❓
    rows: [
      {
        label: 'When',
        text: 'Program runs fine but gives wrong results',
        detail: 'The code is syntactically valid AND runs without crashing, but the output isn\'t what you intended.',
        example2: 'Python has no way to know your intended result'
      },
      {
        label: 'Python Says',
        text: 'Nothing — no error message at all',
        detail: 'This is what makes logic errors so tricky. Python did exactly what you told it to do; you just told it the wrong thing.',
        example2: 'Your program happily prints the wrong answer'
      },
      {
        label: 'Example',
        text: 'Using / 2 instead of / 3\n  for an average',
        detail: 'average = (a + b + c) / 2 is valid Python, but the math is wrong if you\'re averaging 3 numbers.',
        example2: 'area = length + width (should be * not +)'
      },
      {
        label: 'How to Fix',
        text: 'Test with known inputs, trace through code manually',
        detail: 'Calculate expected results by hand, then compare with program output. Print intermediate values to find where logic diverges.',
        example2: 'Use print() statements to check intermediate values'
      }
    ]
  }
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  describe('Three-column comparison chart showing syntax errors, runtime errors, and logic errors side by side. Hover over cells to see additional details and examples.', LABEL);
}

function draw() {
  updateCanvasSize();

  // Drawing area
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(20);
  text('Three Types of Errors', canvasWidth / 2, 8);

  // Calculate column layout
  let colGap = 8;
  let colW = (canvasWidth - 2 * margin - 2 * colGap) / 3;
  let startY = 38;
  let headerH = 40;
  let rowH = 80;

  hoveredCell = null;

  for (let c = 0; c < COLUMNS.length; c++) {
    let col = COLUMNS[c];
    let colX = margin + c * (colW + colGap);
    let isSelectedCol = selectedCol === c;

    // Column header
    if (isSelectedCol) {
      fill(col.color[0], col.color[1], col.color[2]);
      stroke(col.color[0] - 40, col.color[1] - 40, col.color[2] - 40);
      strokeWeight(3);
    } else {
      fill(col.color[0], col.color[1], col.color[2]);
      stroke(col.color[0] - 20, col.color[1] - 20, col.color[2] - 20);
      strokeWeight(1);
    }
    rect(colX, startY, colW, headerH, 8, 8, 0, 0);

    noStroke();
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(14);
    textStyle(BOLD);
    text(col.title, colX + colW / 2, startY + headerH / 2);
    textStyle(NORMAL);

    // Rows
    for (let r = 0; r < col.rows.length; r++) {
      let row = col.rows[r];
      let cellX = colX;
      let cellY = startY + headerH + r * rowH;
      let cellH = rowH;

      let isHovered = mouseX > cellX && mouseX < cellX + colW &&
                      mouseY > cellY && mouseY < cellY + cellH;

      if (isHovered) {
        hoveredCell = { col: c, row: r };
        fill(col.lightColor[0], col.lightColor[1], col.lightColor[2]);
        stroke(col.color[0], col.color[1], col.color[2]);
        strokeWeight(2);
        cursor(HAND);
      } else {
        fill(255);
        stroke(220);
        strokeWeight(1);
      }

      let cornerR = (r === col.rows.length - 1) ? [0, 0, 8, 8] : [0, 0, 0, 0];
      if (r === col.rows.length - 1) {
        rect(cellX, cellY, colW, cellH, 0, 0, 8, 8);
      } else {
        rect(cellX, cellY, colW, cellH);
      }

      // Row label
      noStroke();
      fill(col.color[0], col.color[1], col.color[2]);
      textAlign(LEFT, TOP);
      textSize(11);
      textStyle(BOLD);
      text(row.label, cellX + 8, cellY + 6);
      textStyle(NORMAL);

      // Row text
      fill(50);
      textSize(11);
      drawWrappedTextInBox(row.text, cellX + 8, cellY + 22, colW - 16);
    }
  }

  // Tooltip for hovered cell
  if (hoveredCell) {
    drawTooltip(hoveredCell.col, hoveredCell.row);
  }
}

function drawTooltip(c, r) {
  let col = COLUMNS[c];
  let row = col.rows[r];

  let tw = Math.min(280, canvasWidth * 0.55);
  let th = 95;
  let tx = mouseX + 15;
  let ty = mouseY - 10;

  if (tx + tw > canvasWidth - 5) tx = mouseX - tw - 15;
  if (ty + th > drawHeight - 5) ty = drawHeight - th - 5;
  if (ty < 5) ty = 5;

  // Shadow
  fill(0, 0, 0, 25);
  noStroke();
  rect(tx + 3, ty + 3, tw, th, 8);

  // Background
  fill(255, 255, 255, 248);
  stroke(col.color[0], col.color[1], col.color[2]);
  strokeWeight(2);
  rect(tx, ty, tw, th, 8);

  noStroke();
  textAlign(LEFT, TOP);

  // Detail text
  fill(40);
  textSize(11);
  drawWrappedTextInBox(row.detail, tx + 10, ty + 8, tw - 20);

  // Second example
  fill(col.color[0], col.color[1], col.color[2]);
  textSize(10);
  textStyle(ITALIC);
  drawWrappedTextInBox('Also: ' + row.example2, tx + 10, ty + 60, tw - 20);
  textStyle(NORMAL);
}

function drawWrappedTextInBox(txt, x, y, maxW) {
  let words = txt.split(' ');
  let line = '';
  for (let w of words) {
    // Handle newlines
    if (w.includes('\n')) {
      let parts = w.split('\n');
      for (let pi = 0; pi < parts.length; pi++) {
        if (pi > 0) {
          if (line) { text(line, x, y); y += 14; }
          line = parts[pi];
        } else {
          let test = line + (line ? ' ' : '') + parts[pi];
          if (textWidth(test) > maxW && line) {
            text(line, x, y);
            line = parts[pi];
            y += 14;
          } else {
            line = test;
          }
        }
      }
    } else {
      let test = line + (line ? ' ' : '') + w;
      if (textWidth(test) > maxW && line) {
        text(line, x, y);
        line = w;
        y += 14;
      } else {
        line = test;
      }
    }
  }
  if (line) text(line, x, y);
}

function mousePressed() {
  // Click column header to select/deselect
  let colGap = 8;
  let colW = (canvasWidth - 2 * margin - 2 * colGap) / 3;
  let startY = 38;
  let headerH = 40;

  for (let c = 0; c < COLUMNS.length; c++) {
    let colX = margin + c * (colW + colGap);
    if (mouseX > colX && mouseX < colX + colW &&
        mouseY > startY && mouseY < startY + headerH) {
      selectedCol = (selectedCol === c) ? null : c;
      return;
    }
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  canvasWidth = Math.floor(container.width);
}
