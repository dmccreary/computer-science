let canvasWidth = 400;
let drawHeight = 470;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;

let headers = ['name', 'grade', 'city'];
let rows = [
  ['Ava', '9', 'Boston'],
  ['Noah', '10', 'Denver'],
  ['Mia', '11', 'Austin'],
  ['Leo', '9', 'Seattle']
];

let hoveredCell = { r: -1, c: -1 };
let showQuotes = false;
let editCell = { r: -1, c: -1 };
let editInput;

let addRowBtn;
let toggleQuotesBtn;
let applyEditBtn;
let cancelEditBtn;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  addRowBtn = createButton('Add Row');
  addRowBtn.mousePressed(addRow);

  toggleQuotesBtn = createButton('Toggle Quotes');
  toggleQuotesBtn.mousePressed(() => {
    showQuotes = !showQuotes;
  });

  applyEditBtn = createButton('Apply Edit');
  applyEditBtn.mousePressed(applyEdit);

  cancelEditBtn = createButton('Cancel Edit');
  cancelEditBtn.mousePressed(cancelEdit);

  editInput = createInput('');
  editInput.attribute('placeholder', 'Edit selected cell value');

  positionControls();
  describe('Dual view of CSV raw text and table structure with cell mapping highlights.', LABEL);
}

function draw() {
  updateCanvasSize();

  fill('aliceblue');
  stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);

  fill('white');
  stroke('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  hoveredCell = findHoveredTableCell();

  drawTitle();
  drawRawPanel();
  drawTablePanel();
  drawHint();

  toggleQuotesBtn.html(showQuotes ? 'Quotes: ON' : 'Quotes: OFF');
}

function drawTitle() {
  noStroke();
  fill('#0f172a');
  textAlign(CENTER, TOP);
  textSize(24);
  text('CSV File Structure Explorer', canvasWidth / 2, 10);

  fill('#334155');
  textSize(14);
  text('Map comma-separated text to table cells', canvasWidth / 2, 40);
}

function drawRawPanel() {
  const x = margin;
  const y = 72;
  const w = (canvasWidth - margin * 3) / 2;
  const h = 340;

  fill('#f8fafc');
  stroke('#94a3b8');
  rect(x, y, w, h, 8);

  noStroke();
  fill('#111827');
  textAlign(LEFT, TOP);
  textSize(14);
  text('Raw CSV Text', x + 10, y + 8);

  const allRows = [headers, ...rows];
  let yy = y + 34;
  textSize(12);
  textFont('monospace');

  for (let r = 0; r < allRows.length; r++) {
    let xx = x + 10;

    for (let c = 0; c < allRows[r].length; c++) {
      const isHovered = hoveredCell.r === r && hoveredCell.c === c;
      const token = rawToken(allRows[r][c]);

      if (isHovered) {
        fill(250, 204, 21, 140);
        noStroke();
        rect(xx - 2, yy - 1, textWidth(token) + 4, 14, 3);
      }

      noStroke();
      fill('#1f2937');
      text(token, xx, yy);
      xx += textWidth(token);

      if (c < allRows[r].length - 1) {
        fill('#9ca3af');
        text(',', xx, yy);
        xx += textWidth(',');
      }
    }

    fill('#9ca3af');
    text('  \u21b5', xx + 4, yy);
    yy += 20;
  }

  textFont('Arial, Helvetica, sans-serif');
}

function drawTablePanel() {
  const x = margin * 2 + (canvasWidth - margin * 3) / 2;
  const y = 72;
  const w = (canvasWidth - margin * 3) / 2;
  const h = 340;

  fill('#f8fafc');
  stroke('#94a3b8');
  rect(x, y, w, h, 8);

  noStroke();
  fill('#111827');
  textAlign(LEFT, TOP);
  textSize(14);
  text('Table View', x + 10, y + 8);

  const allRows = [headers, ...rows];
  const cols = headers.length;
  const cellW = (w - 20) / cols;
  const cellH = 34;

  for (let r = 0; r < allRows.length; r++) {
    for (let c = 0; c < cols; c++) {
      const cx = x + 10 + c * cellW;
      const cy = y + 34 + r * cellH;

      const isHeader = r === 0;
      const isHovered = hoveredCell.r === r && hoveredCell.c === c;

      if (isHeader) {
        fill('#bfdbfe');
      } else {
        fill(r % 2 === 0 ? '#ffffff' : '#f8fafc');
      }

      if (isHovered) {
        fill('#fde68a');
      }

      stroke('#cbd5e1');
      rect(cx, cy, cellW, cellH);

      noStroke();
      fill('#1f2937');
      textAlign(CENTER, CENTER);
      textSize(12);
      text(allRows[r][c], cx + cellW / 2, cy + cellH / 2);
    }
  }
}

function drawHint() {
  noStroke();
  fill('#334155');
  textAlign(LEFT, CENTER);
  textSize(13);
  text('Hover table cells to see matching CSV text. Click a data cell to edit.', margin, 430);
}

function rawToken(value) {
  const hasComma = value.includes(',');
  if (showQuotes && hasComma) {
    return '"' + value + '"';
  }
  return value;
}

function findHoveredTableCell() {
  const x = margin * 2 + (canvasWidth - margin * 3) / 2;
  const y = 72;
  const w = (canvasWidth - margin * 3) / 2;

  const cols = headers.length;
  const rowsCount = rows.length + 1;
  const cellW = (w - 20) / cols;
  const cellH = 34;

  for (let r = 0; r < rowsCount; r++) {
    for (let c = 0; c < cols; c++) {
      const cx = x + 10 + c * cellW;
      const cy = y + 34 + r * cellH;
      if (mouseX >= cx && mouseX <= cx + cellW && mouseY >= cy && mouseY <= cy + cellH) {
        return { r, c };
      }
    }
  }

  return { r: -1, c: -1 };
}

function mousePressed() {
  if (hoveredCell.r > 0 && hoveredCell.c >= 0) {
    editCell = { r: hoveredCell.r - 1, c: hoveredCell.c };
    editInput.value(rows[editCell.r][editCell.c]);
    editInput.elt.focus();
  }
}

function addRow() {
  rows.push(['New Name', '9', 'City']);
}

function applyEdit() {
  if (editCell.r < 0 || editCell.c < 0) return;
  rows[editCell.r][editCell.c] = editInput.value();
}

function cancelEdit() {
  editCell = { r: -1, c: -1 };
  editInput.value('');
}

function positionControls() {
  addRowBtn.position(10, drawHeight + 8);
  toggleQuotesBtn.position(80, drawHeight + 8);
  editInput.position(190, drawHeight + 8);
  editInput.size(max(150, canvasWidth - 370), 24);
  applyEditBtn.position(canvasWidth - 170, drawHeight + 8);
  cancelEditBtn.position(canvasWidth - 92, drawHeight + 8);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = max(700, container.offsetWidth);
    if (editInput) {
      editInput.size(max(150, canvasWidth - 370), 24);
    }
  }
}
