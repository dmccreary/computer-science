let canvasWidth = 400;
let drawHeight = 490;
let controlHeight = 70;
let canvasHeight = drawHeight + controlHeight;

let currentNode = 'start';
let history = ['start'];

let startOverBtn;

const nodes = {
  start: {
    type: 'start',
    text: 'I have a bug!',
    options: [
      { label: 'Start', next: 'know_where' }
    ]
  },
  know_where: {
    type: 'decision',
    text: 'Do you know roughly where the bug is?',
    options: [
      { label: 'Yes', next: 'breakpoints' },
      { label: 'No', next: 'crash_logic' }
    ]
  },
  crash_logic: {
    type: 'decision',
    text: 'Is it a crash or a logic error?',
    options: [
      { label: 'Crash', next: 'print_debug' },
      { label: 'Logic', next: 'trace_short' }
    ]
  },
  trace_short: {
    type: 'decision',
    text: 'Is the code short enough to trace by hand?',
    options: [
      { label: 'Yes', next: 'code_tracing' },
      { label: 'No', next: 'rubber_duck' }
    ]
  },
  breakpoints: {
    type: 'leaf',
    title: 'Breakpoint + Step Through',
    tip: 'Set breakpoints near suspect lines and inspect variable changes line-by-line.'
  },
  print_debug: {
    type: 'leaf',
    title: 'Print Debugging',
    tip: 'Add focused print statements to isolate where the crash begins.'
  },
  code_tracing: {
    type: 'leaf',
    title: 'Code Tracing',
    tip: 'Trace variable values manually in a table to verify logic flow.'
  },
  rubber_duck: {
    type: 'leaf',
    title: 'Rubber Duck + Debugger',
    tip: 'Explain code aloud first, then confirm with debugger tools.'
  }
};

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  startOverBtn = createButton('Start Over');
  startOverBtn.mousePressed(resetFlow);

  positionControls();
  describe('Debugging strategy decision flowchart for selecting the right debugging method.', LABEL);
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
  drawFlowCard();
  drawPath();
}

function drawTitle() {
  noStroke();
  fill('#0f172a');
  textAlign(CENTER, TOP);
  textSize(24);
  text('Debugging Decision Flowchart', canvasWidth / 2, 10);
}

function drawFlowCard() {
  const node = nodes[currentNode];
  const w = min(620, canvasWidth - 40);
  const x = (canvasWidth - w) / 2;
  const y = 78;
  const h = 320;

  if (node.type === 'decision') {
    fill('#dbeafe');
    stroke('#2563eb');
  } else if (node.type === 'leaf') {
    fill('#dcfce7');
    stroke('#16a34a');
  } else {
    fill('#ede9fe');
    stroke('#7c3aed');
  }
  strokeWeight(2);
  rect(x, y, w, h, 12);

  noStroke();
  fill('#111827');
  textAlign(CENTER, TOP);
  textSize(18);
  if (node.type === 'leaf') text(node.title, x + w / 2, y + 16);
  else text(node.text, x + 20, y + 16, w - 40, 50);

  if (node.type === 'leaf') {
    fill('#334155');
    textSize(14);
    text(node.tip, x + 30, y + 70, w - 60, 90);

    fill(15, 23, 42, 240);
    stroke('#334155');
    rect(x + 30, y + 170, w - 60, 110, 8);
    noStroke();
    fill('#e2e8f0');
    textAlign(LEFT, TOP);
    textSize(13);
    text('Mini tutorial:\n1) Reproduce the bug\n2) Isolate suspect code\n3) Apply this strategy\n4) Verify with tests', x + 44, y + 186, w - 88, 90);
    return;
  }

  drawOptions(node.options, x, y + 150, w);
}

function drawOptions(options, x, y, w) {
  const btnW = min(240, (w - 30) / options.length);
  const totalW = options.length * btnW + (options.length - 1) * 14;
  let xx = x + (w - totalW) / 2;

  for (const op of options) {
    const hovered = mouseX >= xx && mouseX <= xx + btnW && mouseY >= y && mouseY <= y + 52;
    fill(hovered ? '#bfdbfe' : '#ffffff');
    stroke('#64748b');
    rect(xx, y, btnW, 52, 10);

    noStroke();
    fill('#1f2937');
    textAlign(CENTER, CENTER);
    textSize(14);
    text(op.label, xx + btnW / 2, y + 26);

    op._x = xx; op._y = y; op._w = btnW; op._h = 52;
    xx += btnW + 14;
  }
}

function drawPath() {
  noStroke();
  fill('#334155');
  textAlign(LEFT, TOP);
  textSize(13);
  text('Path: ' + history.join(' -> '), 20, 414, canvasWidth - 40, 50);
}

function mousePressed() {
  const node = nodes[currentNode];
  if (!node.options) return;

  for (const op of node.options) {
    if (mouseX >= op._x && mouseX <= op._x + op._w && mouseY >= op._y && mouseY <= op._y + op._h) {
      currentNode = op.next;
      history.push(currentNode);
      return;
    }
  }
}

function resetFlow() {
  currentNode = 'start';
  history = ['start'];
}

function positionControls() {
  startOverBtn.position(10, drawHeight + 10);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = max(760, container.offsetWidth);
}
