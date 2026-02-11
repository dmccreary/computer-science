// Code Readability Comparison MicroSim
// Bloom Level: Evaluate (L5) - critique, improve
// Students evaluate Python code for readability and identify specific improvements.

let canvasWidth = 400;
let drawHeight = 450;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// Controls
let nextExampleBtn;
let showDiffCheckbox;
let showDifferences = false;

// Current example index (0-3)
let currentExampleIndex = 0;

// Tooltip state
let tooltipText = '';
let tooltipX = 0;
let tooltipY = 0;
let showTooltip = false;

// ---------------------------------------------------------------
// Example data: 4 before/after pairs
// Each example has: title, before lines, after lines,
//   diffRanges (which lines to highlight), tooltip per diff line,
//   and a checklist of improvements demonstrated.
// ---------------------------------------------------------------

let examples = [
  {
    title: 'Variable Naming',
    before: [
      'x = 16',
      'y = "Maria"',
      'z = 95.5',
      'a = True',
    ],
    after: [
      'student_age = 16',
      'student_name = "Maria"',
      'test_score = 95.5',
      'is_enrolled = True',
    ],
    // Which lines (0-indexed) have differences
    diffLines: [0, 1, 2, 3],
    tooltips: [
      '"x" tells you nothing. "student_age" tells you exactly what it stores.',
      '"y" is mysterious. "student_name" is instantly clear.',
      '"z" could be anything. "test_score" explains the data.',
      '"a" is vague. "is_enrolled" uses the is_ prefix for booleans.',
    ],
    checklist: [
      { label: 'Descriptive variable names', active: true },
      { label: 'Proper spacing', active: false },
      { label: 'Helpful comments', active: false },
      { label: 'Logical structure', active: false },
    ],
  },
  {
    title: 'Spacing & Formatting',
    before: [
      'result=a*b+c',
      'if x>10 and y<5:',
      'name="Jo"+"Smith"',
      'scores=[90,85,77,92]',
    ],
    after: [
      'result = a * b + c',
      'if x > 10 and y < 5:',
      'name = "Jo" + "Smith"',
      'scores = [90, 85, 77, 92]',
    ],
    diffLines: [0, 1, 2, 3],
    tooltips: [
      'Spaces around operators make math expressions much easier to read.',
      'Spaces around comparison operators help you see conditions clearly.',
      'Spacing around = and + separates the pieces visually.',
      'Spaces after commas in lists follow Python style guidelines (PEP 8).',
    ],
    checklist: [
      { label: 'Descriptive variable names', active: false },
      { label: 'Proper spacing', active: true },
      { label: 'Helpful comments', active: false },
      { label: 'Logical structure', active: false },
    ],
  },
  {
    title: 'Adding Comments',
    before: [
      'def calc(p, r, t):',
      '    a = p * (1 + r) ** t',
      '    return a',
      '',
    ],
    after: [
      '# Calculate compound interest',
      'def calc(p, r, t):',
      '    a = p * (1 + r) ** t',
      '    return a  # final amount',
    ],
    diffLines: [0, 3],
    tooltips: [
      'A comment above a function explains its purpose at a glance.',
      'An inline comment clarifies what the return value represents.',
    ],
    checklist: [
      { label: 'Descriptive variable names', active: false },
      { label: 'Proper spacing', active: false },
      { label: 'Helpful comments', active: true },
      { label: 'Logical structure', active: false },
    ],
  },
  {
    title: 'Code Structure',
    before: [
      'n=input("Name?")',
      'a=int(input("Age?"))',
      's=int(input("Score?"))',
      'if s>=90:g="A"',
      'elif s>=80:g="B"',
      'elif s>=70:g="C"',
      'else:g="F"',
      'print(n,a,g)',
    ],
    after: [
      '# --- Get user input ---',
      'n = input("Name?")',
      'a = int(input("Age?"))',
      's = int(input("Score?"))',
      '',
      '# --- Determine grade ---',
      'if s >= 90:',
      '    g = "A"',
      'elif s >= 80:',
      '    g = "B"',
      'elif s >= 70:',
      '    g = "C"',
      'else:',
      '    g = "F"',
      '',
      '# --- Display results ---',
      'print(n, a, g)',
    ],
    diffLines: [0, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15],
    tooltips: [
      'Section comments act like chapter headings for your code.',
      'A comment separates the grading logic from the input section.',
      'Each branch on its own line is easier to scan and debug.',
      'Indented body makes the if/elif structure visually obvious.',
      'Each branch on its own line is easier to scan and debug.',
      'Indented body makes the if/elif structure visually obvious.',
      'Each branch on its own line is easier to scan and debug.',
      'Indented body makes the if/elif structure visually obvious.',
      'The else clause is clearly separated.',
      'Indented body makes the structure visually obvious.',
      'A comment introduces the output section.',
    ],
    checklist: [
      { label: 'Descriptive variable names', active: false },
      { label: 'Proper spacing', active: true },
      { label: 'Helpful comments', active: true },
      { label: 'Logical structure', active: true },
    ],
  },
];

function updateCanvasSize() {
  let mainEl = document.querySelector('main');
  if (mainEl) {
    canvasWidth = Math.min(mainEl.clientWidth, 900);
    canvasWidth = Math.max(canvasWidth, 400);
  }
  // For structure example (example 4) we need more vertical space
  drawHeight = 450;
  canvasHeight = drawHeight + controlHeight;
}

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  // "Next Example" button
  nextExampleBtn = createButton('Next Example');
  nextExampleBtn.parent(document.querySelector('main'));
  nextExampleBtn.mousePressed(nextExample);
  nextExampleBtn.style('font-size', '14px');
  nextExampleBtn.style('padding', '6px 16px');
  nextExampleBtn.style('cursor', 'pointer');

  // "Show Differences" checkbox
  showDiffCheckbox = createCheckbox('Show Differences', false);
  showDiffCheckbox.parent(document.querySelector('main'));
  showDiffCheckbox.changed(onDiffToggle);
  showDiffCheckbox.style('font-size', '14px');
  showDiffCheckbox.style('cursor', 'pointer');

  positionControls();

  describe(
    'A split-screen comparison of poorly written Python code on the left and improved code on the right. ' +
    'Students cycle through four examples covering variable naming, spacing, comments, and structure. ' +
    'A Show Differences toggle highlights changes in yellow with hover tooltips.'
  );
}

function positionControls() {
  let btnY = drawHeight + 12;
  nextExampleBtn.position(margin, btnY);
  showDiffCheckbox.position(margin + 140, btnY + 4);
}

function draw() {
  // --- Draw area background ---
  noStroke();
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  stroke('silver');
  strokeWeight(1);
  noFill();
  rect(0, 0, canvasWidth, drawHeight);

  // --- Control area background ---
  noStroke();
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  let ex = examples[currentExampleIndex];

  // --- Title ---
  noStroke();
  fill(40);
  textSize(Math.max(18, canvasWidth * 0.032));
  textAlign(CENTER, TOP);
  textFont('Arial');
  text('Code Readability: ' + ex.title, canvasWidth / 2, 10);

  // --- Example counter ---
  fill(120);
  textSize(14);
  textAlign(CENTER, TOP);
  text('Example ' + (currentExampleIndex + 1) + ' of ' + examples.length, canvasWidth / 2, 36);

  // --- Split panels ---
  let panelTop = 56;
  let halfW = canvasWidth / 2;
  let panelW = halfW - margin - 5;
  let codeTopY = panelTop + 28;

  // Determine code line height and panel height based on the example
  let codeLineH = 18;
  let maxLines = Math.max(ex.before.length, ex.after.length);
  let codePanelH = maxLines * codeLineH + 20;

  // --- Left panel: "Before" ---
  drawPanel(margin, panelTop, panelW, codePanelH, 'Before', false);
  drawCodeLines(margin + 8, codeTopY, panelW - 16, ex.before, null, null);

  // --- Right panel: "After" ---
  drawPanel(halfW + 5, panelTop, panelW, codePanelH, 'After', true);
  let diffSet = showDifferences ? new Set(ex.diffLines) : null;
  drawCodeLines(halfW + 5 + 8, codeTopY, panelW - 16, ex.after, diffSet, ex);

  // --- Checklist ---
  let checklistY = panelTop + codePanelH + 16;
  drawChecklist(margin, checklistY, ex.checklist);

  // --- Tooltip (drawn last so it's on top) ---
  if (showTooltip && showDifferences) {
    drawTooltipBox(tooltipX, tooltipY, tooltipText);
  }

  // Reset tooltip for next frame (recalculated during drawCodeLines)
  showTooltip = false;
}

// ---------------------------------------------------------------
// Draw a panel with a header label and tinted background
// ---------------------------------------------------------------
function drawPanel(x, y, w, h, label, isAfter) {
  // Background tint
  noStroke();
  if (isAfter) {
    fill(230, 250, 230); // slight green tint
  } else {
    fill(255, 235, 235); // slight red/pink tint
  }
  rect(x, y, w, h, 6);

  // Border
  stroke(isAfter ? color(100, 180, 100) : color(200, 120, 120));
  strokeWeight(1);
  noFill();
  rect(x, y, w, h, 6);

  // Header text
  noStroke();
  textFont('Arial');
  textSize(Math.max(14, canvasWidth * 0.024));
  textAlign(CENTER, TOP);

  if (isAfter) {
    fill(30, 130, 30);
    text('After  \u2713', x + w / 2, y + 4);
  } else {
    fill(180, 40, 40);
    text('Before  \u2717', x + w / 2, y + 4);
  }
}

// ---------------------------------------------------------------
// Draw code lines inside a panel
// diffSet: a Set of line indices that should be highlighted (or null)
// ex: the full example object (for tooltip lookup), or null
// ---------------------------------------------------------------
function drawCodeLines(x, y, maxW, lines, diffSet, ex) {
  textFont('monospace');
  let lineH = 18;
  let codeFontSize = Math.max(13, Math.min(15, canvasWidth * 0.022));
  textSize(codeFontSize);
  textAlign(LEFT, TOP);

  for (let i = 0; i < lines.length; i++) {
    let lineY = y + i * lineH;
    let lineText = lines[i];

    // If this line is in the diff set, draw a highlight background
    if (diffSet && diffSet.has(i)) {
      noStroke();
      fill(255, 255, 100, 180); // yellow highlight
      rect(x - 2, lineY - 1, maxW + 4, lineH, 3);

      // Check if mouse is hovering over this highlighted line
      if (
        mouseX >= x - 2 &&
        mouseX <= x + maxW + 2 &&
        mouseY >= lineY - 1 &&
        mouseY <= lineY + lineH - 1
      ) {
        // Find the tooltip index: which diff line is this?
        let diffArr = ex.diffLines;
        let tooltipIdx = diffArr.indexOf(i);
        if (tooltipIdx >= 0 && tooltipIdx < ex.tooltips.length) {
          showTooltip = true;
          tooltipText = ex.tooltips[tooltipIdx];
          tooltipX = mouseX;
          tooltipY = mouseY;
        }
      }
    }

    // Draw the code text
    noStroke();
    fill(40);
    text(lineText, x, lineY);
  }

  // Reset to default font for other drawing
  textFont('Arial');
}

// ---------------------------------------------------------------
// Draw the checklist of readability improvements
// ---------------------------------------------------------------
function drawChecklist(x, y, checklist) {
  noStroke();
  textFont('Arial');
  textSize(Math.max(14, canvasWidth * 0.024));
  textAlign(LEFT, TOP);

  fill(60);
  textSize(Math.max(15, canvasWidth * 0.026));
  text('Readability Improvements:', x, y);

  let itemY = y + 24;
  textSize(Math.max(14, canvasWidth * 0.022));

  for (let i = 0; i < checklist.length; i++) {
    let item = checklist[i];
    let icon, col;
    if (item.active) {
      icon = '\u2705 ';
      col = color(30, 120, 30);
    } else {
      icon = '\u2610 ';
      col = color(150);
    }

    noStroke();
    fill(col);
    text(icon + item.label, x + 10, itemY + i * 22);
  }
}

// ---------------------------------------------------------------
// Draw a tooltip box near the cursor
// ---------------------------------------------------------------
function drawTooltipBox(tx, ty, message) {
  textFont('Arial');
  textSize(13);
  textAlign(LEFT, TOP);

  // Measure text width for box sizing
  let tw = textWidth(message);
  let maxTipW = Math.min(280, canvasWidth - 40);

  // Word-wrap if needed
  let wrappedLines = wrapText(message, maxTipW - 16);
  let boxW = Math.min(tw + 16, maxTipW);
  let boxH = wrappedLines.length * 17 + 12;

  // Position: offset from cursor, keep on-screen
  let bx = tx + 14;
  let by = ty - boxH - 6;
  if (bx + boxW > canvasWidth - 5) {
    bx = tx - boxW - 14;
  }
  if (by < 5) {
    by = ty + 20;
  }

  // Shadow
  noStroke();
  fill(0, 0, 0, 40);
  rect(bx + 3, by + 3, boxW, boxH, 5);

  // Box background
  fill(50, 50, 70);
  rect(bx, by, boxW, boxH, 5);

  // Text
  fill(255);
  noStroke();
  for (let i = 0; i < wrappedLines.length; i++) {
    text(wrappedLines[i], bx + 8, by + 6 + i * 17);
  }
}

// ---------------------------------------------------------------
// Simple word-wrap helper
// ---------------------------------------------------------------
function wrapText(msg, maxW) {
  let words = msg.split(' ');
  let lines = [];
  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    let testLine = currentLine.length === 0 ? words[i] : currentLine + ' ' + words[i];
    if (textWidth(testLine) > maxW && currentLine.length > 0) {
      lines.push(currentLine);
      currentLine = words[i];
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine.length > 0) {
    lines.push(currentLine);
  }
  return lines;
}

// ---------------------------------------------------------------
// Button handler: cycle to the next example
// ---------------------------------------------------------------
function nextExample() {
  currentExampleIndex = (currentExampleIndex + 1) % examples.length;
}

// ---------------------------------------------------------------
// Checkbox handler: toggle difference highlighting
// ---------------------------------------------------------------
function onDiffToggle() {
  showDifferences = showDiffCheckbox.checked();
}

// ---------------------------------------------------------------
// Responsive resize
// ---------------------------------------------------------------
function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}
