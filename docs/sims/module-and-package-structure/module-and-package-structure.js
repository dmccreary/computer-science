let canvasWidth = 400;
let drawHeight = 470;
let controlHeight = 70;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;

let viewMode = 'package';
let selectedImport = 0;
let selectedFile = 'main.py';

let toggleBtn;
let nextImportBtn;

const packageTree = [
  { id: 'main.py', label: 'main.py', level: 0 },
  { id: 'shapes', label: 'shapes/', level: 0 },
  { id: '__init__.py', label: '__init__.py', level: 1 },
  { id: 'circles.py', label: 'circles.py', level: 1 },
  { id: 'rectangles.py', label: 'rectangles.py', level: 1 },
  { id: 'triangles.py', label: 'triangles.py', level: 1 }
];

const flatTree = [
  { id: 'main.py', label: 'main.py', level: 0 },
  { id: 'circles.py', label: 'circles.py', level: 0 },
  { id: 'rectangles.py', label: 'rectangles.py', level: 0 },
  { id: 'triangles.py', label: 'triangles.py', level: 0 }
];

const importsPackage = [
  { text: 'from shapes.circles import area_of_circle', target: 'circles.py' },
  { text: 'from shapes.rectangles import area_of_rectangle', target: 'rectangles.py' },
  { text: 'from shapes.triangles import area_of_triangle', target: 'triangles.py' }
];

const importsFlat = [
  { text: 'import circles', target: 'circles.py' },
  { text: 'import rectangles', target: 'rectangles.py' },
  { text: 'import triangles', target: 'triangles.py' }
];

const fileContents = {
  'main.py': 'from shapes.circles import area_of_circle\nprint(area_of_circle(3))',
  'circles.py': 'import math\ndef area_of_circle(r):\n    return math.pi * r * r',
  'rectangles.py': 'def area_of_rectangle(w, h):\n    return w * h',
  'triangles.py': 'def area_of_triangle(b, h):\n    return 0.5 * b * h',
  '__init__.py': '# package marker\n# optional exports here',
  'shapes': '# package folder'
};

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  toggleBtn = createButton('View: Package');
  toggleBtn.mousePressed(toggleView);

  nextImportBtn = createButton('Next Import');
  nextImportBtn.mousePressed(() => {
    const imports = currentImports();
    selectedImport = (selectedImport + 1) % imports.length;
    selectedFile = imports[selectedImport].target;
  });

  positionControls();
  describe('Interactive module and package structure explorer for Python imports.', LABEL);
}

function draw() {
  updateCanvasSize();

  fill('aliceblue');
  stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);

  fill('white');
  stroke('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawTitle();
  drawTreePanel();
  drawCodePanel();
  drawImportArrow();

  toggleBtn.html(viewMode === 'package' ? 'View: Package' : 'View: Flat Module');
}

function drawTitle() {
  noStroke();
  fill('#0f172a');
  textAlign(CENTER, TOP);
  textSize(24);
  text('Module and Package Structure', canvasWidth / 2, 10);

  fill('#334155');
  textSize(14);
  text('Click files in the tree or cycle imports to see resolution', canvasWidth / 2, 40);
}

function drawTreePanel() {
  const x = margin;
  const y = 72;
  const w = (canvasWidth - margin * 3) / 2;
  const h = 360;

  fill('#f8fafc');
  stroke('#94a3b8');
  rect(x, y, w, h, 8);

  noStroke();
  fill('#111827');
  textAlign(LEFT, TOP);
  textSize(14);
  text('Project File Tree', x + 10, y + 8);

  const tree = currentTree();
  for (let i = 0; i < tree.length; i++) {
    const rowY = y + 36 + i * 26;
    const item = tree[i];
    const isSelected = selectedFile === item.id;

    if (isSelected) {
      fill('#fde68a');
      noStroke();
      rect(x + 8, rowY - 2, w - 16, 21, 5);
    }

    noStroke();
    fill('#1f2937');
    textSize(13);
    text('  '.repeat(item.level) + item.label, x + 12, rowY);

    item._x = x + 8;
    item._y = rowY - 2;
    item._w = w - 16;
    item._h = 21;
  }
}

function drawCodePanel() {
  const x = margin * 2 + (canvasWidth - margin * 3) / 2;
  const y = 72;
  const w = (canvasWidth - margin * 3) / 2;
  const h = 360;

  fill('#0f172a');
  stroke('#334155');
  rect(x, y, w, h, 8);

  const imports = currentImports();

  noStroke();
  fill('#93c5fd');
  textAlign(LEFT, TOP);
  textSize(14);
  text('Imports and Resolved Target', x + 10, y + 8);

  for (let i = 0; i < imports.length; i++) {
    const ly = y + 36 + i * 24;
    if (i === selectedImport) {
      fill(59, 130, 246, 70);
      noStroke();
      rect(x + 8, ly - 3, w - 16, 20, 5);
    }
    noStroke();
    fill('#e2e8f0');
    textSize(12);
    text(imports[i].text, x + 12, ly);
  }

  fill('#cbd5e1');
  textSize(12);
  text('File: ' + selectedFile, x + 12, y + 122);

  fill('#111827');
  stroke('#475569');
  rect(x + 10, y + 142, w - 20, h - 152, 6);

  noStroke();
  fill('#f8fafc');
  textFont('monospace');
  textSize(12);
  text(fileContents[selectedFile] || '# no preview', x + 16, y + 150, w - 32, h - 164);
  textFont('Arial, Helvetica, sans-serif');
}

function drawImportArrow() {
  const leftX = margin + (canvasWidth - margin * 3) / 2;
  const rightX = leftX + margin;
  const y = 250;

  stroke('#f59e0b');
  strokeWeight(3);
  line(leftX + 4, y, rightX - 4, y);
  noStroke();
  fill('#f59e0b');
  triangle(rightX - 4, y, rightX - 14, y - 6, rightX - 14, y + 6);
}

function currentTree() {
  return viewMode === 'package' ? packageTree : flatTree;
}

function currentImports() {
  return viewMode === 'package' ? importsPackage : importsFlat;
}

function toggleView() {
  viewMode = viewMode === 'package' ? 'flat' : 'package';
  selectedImport = 0;
  selectedFile = currentImports()[0].target;
}

function mousePressed() {
  const tree = currentTree();
  for (const item of tree) {
    if (mouseX >= item._x && mouseX <= item._x + item._w && mouseY >= item._y && mouseY <= item._y + item._h) {
      selectedFile = item.id;
      return;
    }
  }

  const imports = currentImports();
  const x = margin * 2 + (canvasWidth - margin * 3) / 2;
  const y = 72;
  const w = (canvasWidth - margin * 3) / 2;
  for (let i = 0; i < imports.length; i++) {
    const ly = y + 36 + i * 24;
    if (mouseX >= x + 8 && mouseX <= x + w - 8 && mouseY >= ly - 3 && mouseY <= ly + 17) {
      selectedImport = i;
      selectedFile = imports[i].target;
      return;
    }
  }
}

function positionControls() {
  toggleBtn.position(10, drawHeight + 12);
  nextImportBtn.position(110, drawHeight + 12);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = max(760, container.offsetWidth);
  }
}
