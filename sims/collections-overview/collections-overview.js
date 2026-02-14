let canvasWidth = 400;
let drawHeight = 500;
let controlHeight = 90;
let canvasHeight = drawHeight + controlHeight;

const cards = [
  {
    key: 'Counter',
    color: '#fb923c',
    oneLine: 'Counts item frequency',
    tip: 'Use for tallies, histograms, and top-k frequency.',
    code: "from collections import Counter\\nCounter('banana')"
  },
  {
    key: 'defaultdict',
    color: '#60a5fa',
    oneLine: 'Auto-creates default values',
    tip: 'Use for grouping and counting without key checks.',
    code: "from collections import defaultdict\\nd = defaultdict(list)"
  },
  {
    key: 'OrderedDict',
    color: '#4ade80',
    oneLine: 'Dictionary with order features',
    tip: 'Useful for move_to_end and explicit ordered behavior.',
    code: "from collections import OrderedDict\\nod = OrderedDict()"
  },
  {
    key: 'namedtuple',
    color: '#c084fc',
    oneLine: 'Lightweight immutable record',
    tip: 'Use when tuple needs named fields.',
    code: "from collections import namedtuple\\nPoint = namedtuple('Point', 'x y')"
  }
];

let expanded = new Set();
let showAll = false;
let quizMode = false;
let quizPrompt = '';
let quizAnswer = '';
let quizFeedback = '';

let showAllBtn;
let quizBtn;
let answerBtns = [];

const quizBank = [
  { q: 'I need to count word frequency in a document.', a: 'Counter' },
  { q: 'I want a dictionary where missing keys start with []', a: 'defaultdict' },
  { q: 'I need immutable points with x/y field names.', a: 'namedtuple' },
  { q: 'I need to move old keys to end in cache logic.', a: 'OrderedDict' }
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  showAllBtn = createButton('Show All');
  showAllBtn.mousePressed(() => {
    showAll = !showAll;
    expanded = showAll ? new Set(cards.map((c) => c.key)) : new Set();
    showAllBtn.html(showAll ? 'Collapse All' : 'Show All');
  });

  quizBtn = createButton('Quiz Me');
  quizBtn.mousePressed(startQuiz);

  answerBtns = cards.map((c) => {
    const b = createButton(c.key);
    b.mousePressed(() => checkQuiz(c.key));
    return b;
  });

  positionControls();
  describe('Interactive concept cards for Python collections module classes with quiz mode.', LABEL);
}

function draw() {
  updateCanvasSize();

  fill('aliceblue');
  stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  noStroke();
  fill('#0f172a');
  textAlign(CENTER, TOP);
  textSize(24);
  text('Collections Module Overview', canvasWidth / 2, 10);

  drawCards();
  drawQuizPanel();
}

function drawCards() {
  const margin = 20;
  const gap = 14;
  const cardW = (canvasWidth - margin * 2 - gap) / 2;
  const cardH = 180;

  for (let i = 0; i < cards.length; i++) {
    const c = cards[i];
    const col = i % 2;
    const row = floor(i / 2);
    const x = margin + col * (cardW + gap);
    const y = 58 + row * (cardH + 14);

    fill(c.color);
    stroke('#334155');
    strokeWeight(expanded.has(c.key) ? 2.5 : 1.2);
    rect(x, y, cardW, cardH, 12);

    noStroke();
    fill('#0f172a');
    textAlign(LEFT, TOP);
    textSize(18);
    text(c.key, x + 12, y + 10);

    textSize(13);
    fill('#1f2937');
    text(c.oneLine, x + 12, y + 40, cardW - 24, 34);

    if (expanded.has(c.key)) {
      fill('#111827');
      textSize(12);
      text(c.tip, x + 12, y + 76, cardW - 24, 36);
      fill(255, 255, 255, 220);
      rect(x + 10, y + 116, cardW - 20, 54, 6);
      fill('#0f172a');
      textFont('monospace');
      textSize(11);
      text(c.code, x + 16, y + 124, cardW - 32, 44);
      textFont('Arial, Helvetica, sans-serif');
    } else {
      fill('#334155');
      textSize(12);
      text('click card to expand', x + 12, y + cardH - 22);
    }
  }
}

function drawQuizPanel() {
  fill('#f8fafc');
  stroke('#94a3b8');
  rect(20, 442, canvasWidth - 40, 50, 8);
  noStroke();
  fill('#0f172a');
  textAlign(LEFT, TOP);
  textSize(12);
  if (quizMode) {
    text(`Quiz: ${quizPrompt}`, 30, 450, canvasWidth - 60, 20);
    fill(quizFeedback.includes('Correct') ? '#15803d' : '#b91c1c');
    text(quizFeedback, 30, 470, canvasWidth - 60, 18);
  } else {
    text('Click cards to explore each class. Use Quiz Me to test recognition.', 30, 458);
  }
}

function mousePressed() {
  const margin = 20;
  const gap = 14;
  const cardW = (canvasWidth - margin * 2 - gap) / 2;
  const cardH = 180;

  for (let i = 0; i < cards.length; i++) {
    const col = i % 2;
    const row = floor(i / 2);
    const x = margin + col * (cardW + gap);
    const y = 58 + row * (cardH + 14);
    if (mouseX >= x && mouseX <= x + cardW && mouseY >= y && mouseY <= y + cardH) {
      if (expanded.has(cards[i].key)) expanded.delete(cards[i].key);
      else expanded.add(cards[i].key);
      return;
    }
  }
}

function startQuiz() {
  quizMode = true;
  const q = random(quizBank);
  quizPrompt = q.q;
  quizAnswer = q.a;
  quizFeedback = 'Choose the best class.';
}

function checkQuiz(choice) {
  if (!quizMode) return;
  quizFeedback = choice === quizAnswer ? `Correct: ${choice}` : `Not quite. Correct answer: ${quizAnswer}`;
}

function positionControls() {
  showAllBtn.position(10, drawHeight + 10);
  quizBtn.position(86, drawHeight + 10);

  let x = 160;
  answerBtns.forEach((b) => {
    b.position(x, drawHeight + 10);
    x += b.width + 6;
  });
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = max(920, container.offsetWidth);
}
