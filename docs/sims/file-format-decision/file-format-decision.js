let canvasWidth = 400;
let drawHeight = 500;
let controlHeight = 70;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;

const tree = {
  q1: {
    text: 'Is your data structured in rows and columns?',
    answers: [
      { label: 'Yes', next: 'q2' },
      { label: 'No', next: 'q3' }
    ]
  },
  q2: {
    text: 'Does your data have nested or hierarchical structure?',
    answers: [
      { label: 'Yes', next: 'json' },
      { label: 'No', next: 'csv' }
    ]
  },
  q3: {
    text: 'Is your data just plain text (logs or notes)?',
    answers: [
      { label: 'Yes', next: 'txt' },
      { label: 'No', next: 'q4' }
    ]
  },
  q4: {
    text: 'Is your data key-value pairs or nested objects?',
    answers: [
      { label: 'Yes', next: 'json' },
      { label: 'No', next: 'txt' }
    ]
  }
};

const recommendations = {
  csv: {
    name: 'CSV (.csv)',
    color: '#16a34a',
    why: 'Best for tabular data with consistent columns.',
    code: 'import csv\nwith open("data.csv") as f:\n    rows = list(csv.reader(f))'
  },
  json: {
    name: 'JSON (.json)',
    color: '#f97316',
    why: 'Best for nested structures and key-value data.',
    code: 'import json\nwith open("data.json") as f:\n    obj = json.load(f)'
  },
  txt: {
    name: 'Plain Text (.txt)',
    color: '#7c3aed',
    why: 'Best for free-form text, notes, and logs.',
    code: 'with open("notes.txt") as f:\n    text = f.read()'
  }
};

const scenarios = [
  { name: 'Game save data', tip: 'Nested player stats and inventory', path: 'json' },
  { name: 'Student roster', tip: 'Rows of names, IDs, grades', path: 'csv' },
  { name: 'Error log', tip: 'Timestamped plain-text lines', path: 'txt' },
  { name: 'App config', tip: 'Key-value settings with nesting', path: 'json' }
];

let currentNode = 'q1';
let pathHistory = ['q1'];
let chosenScenario = null;

let scenarioBtn;
let startOverBtn;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  scenarioBtn = createButton('Try a Scenario');
  scenarioBtn.mousePressed(pickScenario);

  startOverBtn = createButton('Start Over');
  startOverBtn.mousePressed(resetTree);

  positionControls();
  describe('Interactive decision tree for choosing TXT, CSV, or JSON file formats.', LABEL);
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
  drawScenarioBanner();
  drawDecisionTree();
}

function drawTitle() {
  noStroke();
  fill('#0f172a');
  textAlign(CENTER, TOP);
  textSize(24);
  text('File Format Decision Tree', canvasWidth / 2, 10);

  fill('#334155');
  textSize(14);
  text('Evaluate data needs and justify format choice', canvasWidth / 2, 40);
}

function drawScenarioBanner() {
  if (!chosenScenario) return;

  fill('#e2e8f0');
  stroke('#94a3b8');
  rect(margin, 66, canvasWidth - margin * 2, 40, 8);

  noStroke();
  fill('#1f2937');
  textAlign(LEFT, CENTER);
  textSize(13);
  text('Scenario: ' + chosenScenario.name + ' - ' + chosenScenario.tip, margin + 10, 86);
}

function drawDecisionTree() {
  const y = chosenScenario ? 130 : 100;

  if (isRecommendation(currentNode)) {
    drawRecommendation(currentNode, y);
    return;
  }

  const node = tree[currentNode];
  const cardW = min(560, canvasWidth - 2 * margin);
  const cardX = (canvasWidth - cardW) / 2;

  fill('#dbeafe');
  stroke('#2563eb');
  strokeWeight(2);
  rect(cardX, y, cardW, 110, 12);

  noStroke();
  fill('#1e3a8a');
  textAlign(CENTER, TOP);
  textSize(16);
  text(node.text, cardX + cardW / 2, y + 16, cardW - 30, 60);

  drawAnswers(node.answers, cardX, y + 130, cardW);
  drawPathSummary(y + 250);
}

function drawAnswers(answers, x, y, w) {
  const btnW = min(220, (w - 20) / answers.length);
  const totalW = answers.length * btnW + (answers.length - 1) * 12;
  let xx = x + (w - totalW) / 2;

  for (const ans of answers) {
    const hovered = mouseX >= xx && mouseX <= xx + btnW && mouseY >= y && mouseY <= y + 48;

    fill(hovered ? '#bfdbfe' : '#f8fafc');
    stroke('#64748b');
    rect(xx, y, btnW, 48, 10);

    noStroke();
    fill('#1f2937');
    textAlign(CENTER, CENTER);
    textSize(14);
    text(ans.label, xx + btnW / 2, y + 24);

    ans._x = xx;
    ans._y = y;
    ans._w = btnW;
    ans._h = 48;

    xx += btnW + 12;
  }

  const node = tree[currentNode];
  node.answers = answers;
}

function drawPathSummary(y) {
  noStroke();
  fill('#334155');
  textAlign(LEFT, TOP);
  textSize(13);
  const path = pathHistory.join(' -> ');
  text('Visited path: ' + path, margin, y, canvasWidth - margin * 2, 60);
}

function drawRecommendation(id, y) {
  const rec = recommendations[id];
  const w = min(620, canvasWidth - margin * 2);
  const x = (canvasWidth - w) / 2;

  fill(red(rec.color), green(rec.color), blue(rec.color), 35);
  stroke(rec.color);
  strokeWeight(2.5);
  rect(x, y, w, 260, 12);

  noStroke();
  fill(rec.color);
  textAlign(CENTER, TOP);
  textSize(22);
  text(rec.name, x + w / 2, y + 16);

  fill('#1f2937');
  textSize(15);
  text(rec.why, x + w / 2, y + 58, w - 24, 50);

  fill(15, 23, 42, 240);
  stroke('#334155');
  rect(x + 18, y + 108, w - 36, 128, 8);

  noStroke();
  fill('#e2e8f0');
  textAlign(LEFT, TOP);
  textSize(13);
  text('Example', x + 28, y + 116);

  fill('#f8fafc');
  textFont('monospace');
  textSize(12);
  text(rec.code, x + 28, y + 138, w - 56, 90);
  textFont('Arial, Helvetica, sans-serif');
}

function isRecommendation(id) {
  return id === 'csv' || id === 'json' || id === 'txt';
}

function mousePressed() {
  if (isRecommendation(currentNode)) {
    return;
  }

  const node = tree[currentNode];
  for (const ans of node.answers) {
    if (mouseX >= ans._x && mouseX <= ans._x + ans._w && mouseY >= ans._y && mouseY <= ans._y + ans._h) {
      currentNode = ans.next;
      pathHistory.push(currentNode);
      break;
    }
  }
}

function pickScenario() {
  chosenScenario = random(scenarios);
}

function resetTree() {
  currentNode = 'q1';
  pathHistory = ['q1'];
  chosenScenario = null;
}

function positionControls() {
  scenarioBtn.position(10, drawHeight + 10);
  startOverBtn.position(110, drawHeight + 10);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = max(650, container.offsetWidth);
  }
}
