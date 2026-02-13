let canvasWidth = 400;
let drawHeight = 470;
let controlHeight = 70;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;

let exampleIndex = 0;
let pulse = 0;
let locAnim = 0;

let nextBtn;

const examples = [
  {
    title: 'Area Calculation',
    wet: [
      'circle_area = 3.14 * r * r',
      'print(circle_area)',
      'square_area = s * s',
      'print(square_area)',
      'triangle_area = 0.5 * b * h',
      'print(triangle_area)'
    ],
    dry: [
      'def print_area(name, value):',
      '    print(name, value)',
      'print_area("circle", 3.14*r*r)',
      'print_area("square", s*s)',
      'print_area("triangle", 0.5*b*h)'
    ],
    wetDupRows: [1, 3, 5],
    wetLoc: 6,
    dryLoc: 5,
    dupCount: 3
  },
  {
    title: 'Validation',
    wet: [
      'if len(name)==0: print("error")',
      'if len(email)==0: print("error")',
      'if len(phone)==0: print("error")',
      'if len(city)==0: print("error")'
    ],
    dry: [
      'def require(field):',
      '    if len(field)==0:',
      '        print("error")',
      'for f in [name, email, phone, city]:',
      '    require(f)'
    ],
    wetDupRows: [0, 1, 2, 3],
    wetLoc: 4,
    dryLoc: 5,
    dupCount: 4
  },
  {
    title: 'Menu Rendering',
    wet: [
      'print("1. Start")',
      'print("2. Settings")',
      'print("3. Help")',
      'print("4. Quit")'
    ],
    dry: [
      'items = ["Start", "Settings", "Help", "Quit"]',
      'for i, item in enumerate(items, 1):',
      '    print(f"{i}. {item}")'
    ],
    wetDupRows: [0, 1, 2, 3],
    wetLoc: 4,
    dryLoc: 3,
    dupCount: 4
  }
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  nextBtn = createButton('Next Example');
  nextBtn.mousePressed(() => {
    exampleIndex = (exampleIndex + 1) % examples.length;
    locAnim = 0;
  });

  positionControls();
  describe('Side by side DRY vs WET code comparison with duplicate highlighting and metrics.', LABEL);
}

function draw() {
  updateCanvasSize();
  pulse += 0.08;
  locAnim = min(1, locAnim + 0.02);

  fill('aliceblue');
  stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);

  fill('white');
  stroke('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawTitle();
  drawPanels();
  drawMetricsBar();
}

function drawTitle() {
  const ex = examples[exampleIndex];
  noStroke();
  fill('#0f172a');
  textAlign(CENTER, TOP);
  textSize(24);
  text('DRY vs WET Code Comparison', canvasWidth / 2, 10);

  fill('#334155');
  textSize(14);
  text('Example: ' + ex.title, canvasWidth / 2, 40);
}

function drawPanels() {
  const ex = examples[exampleIndex];
  const w = (canvasWidth - margin * 3) / 2;
  drawCodeBlock(margin, 72, w, 300, 'WET Code (repetitive)', ex.wet, ex.wetDupRows, '#fee2e2', true);
  drawCodeBlock(margin * 2 + w, 72, w, 300, 'DRY Code (refactored)', ex.dry, [], '#dcfce7', false);
}

function drawCodeBlock(x, y, w, h, title, lines, dupRows, bgColor, isWet) {
  fill(bgColor);
  stroke('#94a3b8');
  rect(x, y, w, h, 8);

  noStroke();
  fill('#111827');
  textAlign(CENTER, TOP);
  textSize(14);
  text(title, x + w / 2, y + 8);

  fill(15, 23, 42, 240);
  stroke('#334155');
  rect(x + 8, y + 34, w - 16, h - 44, 6);

  for (let i = 0; i < lines.length; i++) {
    const ly = y + 48 + i * 26;

    if (dupRows.includes(i)) {
      const a = 90 + 80 * abs(sin(pulse));
      fill(239, 68, 68, a);
      noStroke();
      rect(x + 12, ly - 6, w - 24, 19, 4);
    }

    if (!isWet && i === 0) {
      fill(34, 197, 94, 70);
      noStroke();
      rect(x + 12, ly - 6, w - 24, 19, 4);
    }

    noStroke();
    fill('#e2e8f0');
    textAlign(LEFT, CENTER);
    textSize(12);
    text(lines[i], x + 16, ly + 2, w - 28, 20);
  }
}

function drawMetricsBar() {
  const ex = examples[exampleIndex];
  const x = margin;
  const y = 392;
  const w = canvasWidth - margin * 2;
  const h = 56;

  fill('#f8fafc');
  stroke('#94a3b8');
  rect(x, y, w, h, 8);

  const wetLocNow = floor(lerp(0, ex.wetLoc, locAnim));
  const dryLocNow = floor(lerp(0, ex.dryLoc, locAnim));

  noStroke();
  fill('#b91c1c');
  textAlign(LEFT, CENTER);
  textSize(13);
  text(`WET: LOC ${wetLocNow}, duplicate blocks ${ex.dupCount}`, x + 12, y + 18);

  fill('#166534');
  text(`DRY: LOC ${dryLocNow}, duplicate blocks 0`, x + 12, y + 38);
}

function positionControls() {
  nextBtn.position(10, drawHeight + 12);
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
