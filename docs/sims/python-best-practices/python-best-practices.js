let canvasWidth = 400;
let drawHeight = 500;
let controlHeight = 110;
let canvasHeight = drawHeight + controlHeight;

const practices = [
  'Type hints used',
  'Docstring present',
  'Meaningful names',
  'Use dataclass where appropriate',
  'Use generator for huge streams',
  'Use with for file handling',
  'Keep function focused',
  'Avoid duplicated logic'
];

const snippets = [
  {
    title: 'Snippet 1',
    code: 'def area(radius: float) -> float:\n    """Return circle area."""\n    pi = 3.14159\n    return pi * radius * radius',
    good: [0, 1, 2, 6]
  },
  {
    title: 'Snippet 2',
    code: 'def f(x,y):\n    z=x+y\n    return z',
    good: [6]
  },
  {
    title: 'Snippet 3',
    code: 'class Point:\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y',
    good: [2, 6]
  },
  {
    title: 'Snippet 4',
    code: 'lines = [line for line in open("big.txt")]\nfor line in lines:\n    process(line)',
    good: [6]
  },
  {
    title: 'Snippet 5',
    code: 'f = open("data.txt")\ntext = f.read()\nf.close()',
    good: [6]
  }
];

let idx = 0;
let checks = [];
let checkboxes = [];
let nextBtn;
let gradeBtn;
let feedbackDiv;
let totalScore = 0;
let gradedCount = 0;
let alreadyGraded = false;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  checkboxes = practices.map((p) => {
    const c = createCheckbox(p, false);
    c.changed(syncChecks);
    return c;
  });

  nextBtn = createButton('Next Snippet');
  nextBtn.mousePressed(() => {
    idx = (idx + 1) % snippets.length;
    loadSnippet();
  });

  gradeBtn = createButton('Check Answers');
  gradeBtn.mousePressed(gradeCurrent);

  feedbackDiv = createDiv('');

  loadSnippet();
  positionControls();
  describe('Evaluate code snippets against Python best-practice checklist with scoring.', LABEL);
}

function draw() {
  updateCanvasSize();

  fill('aliceblue');
  stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawTitle();
  drawPanels();
  drawCode();
  drawScore();
}

function drawTitle() {
  noStroke();
  fill('#0f172a');
  textAlign(CENTER, TOP);
  textSize(24);
  text('Python Best Practices Checklist', canvasWidth / 2, 10);
}

function drawPanels() {
  const leftW = (canvasWidth - 50) * 0.56;
  fill('#0f172a');
  stroke('#334155');
  rect(20, 56, leftW, 390, 10);

  fill('#f8fafc');
  stroke('#94a3b8');
  rect(30 + leftW, 56, canvasWidth - leftW - 50, 390, 10);

  noStroke();
  fill('#e2e8f0');
  textAlign(LEFT, TOP);
  textSize(14);
  text(`${snippets[idx].title}`, 30, 66);

  fill('#0f172a');
  text('Checklist', 40 + leftW, 66);
}

function drawCode() {
  const leftW = (canvasWidth - 50) * 0.56;
  noStroke();
  fill('#cbd5e1');
  textAlign(LEFT, TOP);
  textSize(12);
  textFont('monospace');
  text(snippets[idx].code, 30, 90, leftW - 20, 340);
  textFont('Arial, Helvetica, sans-serif');
}

function drawScore() {
  fill('#ecfeff');
  stroke('#94a3b8');
  rect(20, 454, canvasWidth - 40, 36, 8);
  noStroke();
  fill('#0f172a');
  textAlign(CENTER, CENTER);
  textSize(13);
  text(`Score: ${totalScore} / ${max(gradedCount,1) * practices.length} across ${gradedCount} graded snippet(s)`, canvasWidth / 2, 472);
}

function syncChecks() {
  checks = checkboxes.map((c) => c.checked());
}

function loadSnippet() {
  alreadyGraded = false;
  checkboxes.forEach((c) => c.checked(false));
  checks = Array(practices.length).fill(false);
  feedbackDiv.html('');
}

function gradeCurrent() {
  syncChecks();
  const good = new Set(snippets[idx].good);
  let points = 0;
  for (let i = 0; i < practices.length; i++) {
    const selected = checks[i];
    const correct = good.has(i);
    if (selected === correct) points += 1;
  }

  if (!alreadyGraded) {
    totalScore += points;
    gradedCount += 1;
    alreadyGraded = true;
  }

  feedbackDiv.html(`Current snippet: ${points}/${practices.length}. Suggested flags: ${[...good].map((i) => practices[i]).join(', ')}`);
}

function positionControls() {
  const leftW = (canvasWidth - 50) * 0.56;
  const cx = 40 + leftW;

  for (let i = 0; i < checkboxes.length; i++) {
    checkboxes[i].position(cx, 92 + i * 36);
    checkboxes[i].style('width', `${canvasWidth - leftW - 70}px`);
  }

  nextBtn.position(10, drawHeight + 10);
  gradeBtn.position(98, drawHeight + 10);
  feedbackDiv.position(220, drawHeight + 12);
  feedbackDiv.size(canvasWidth - 230, 80);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = max(980, container.offsetWidth);
}
