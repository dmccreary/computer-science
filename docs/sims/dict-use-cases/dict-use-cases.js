let canvasWidth = 400;
let drawHeight = 500;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;

let cards = [];
let expanded = -1;
let quizMode = false;
let quiz = null;
let quizFeedback = '';

let quizBtn;
let resetBtn;

const cases = [
  { title: 'Phone Book', desc: 'Map person name -> phone number.', code: 'phonebook = {"Ava": "555-1111"}' },
  { title: 'Word Counter', desc: 'Map word -> count.', code: 'counts[word] = counts.get(word, 0) + 1' },
  { title: 'Grade Book', desc: 'Map student -> grade.', code: 'grades = {"Bob": 92, "Mia": 88}' },
  { title: 'Shopping Cart', desc: 'Map item -> quantity.', code: 'cart["apple"] = 3' },
  { title: 'Game Inventory', desc: 'Map item -> stats/count.', code: 'inventory["potion"] = {"count": 2}' },
  { title: 'Translator', desc: 'Map source word -> target word.', code: 'es_to_en = {"hola": "hello"}' }
];

const quizScenarios = [
  { q: 'Store student ID -> student name', ans: 'dictionary' },
  { q: 'Store sequence of daily temperatures in order', ans: 'list' },
  { q: 'Store unique tags without duplicates', ans: 'set' },
  { q: 'Store immutable coordinates (x, y)', ans: 'tuple' }
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  quizBtn = createButton('Quiz Mode');
  quizBtn.mousePressed(toggleQuiz);

  resetBtn = createButton('Reset');
  resetBtn.mousePressed(() => {
    expanded = -1;
    quizFeedback = '';
    if (quizMode) newQuiz();
  });

  positionControls();
  buildCards();

  describe('Dictionary use-cases infographic with expandable cards and data-structure quiz mode.', LABEL);
}

function draw() {
  updateCanvasSize();
  buildCards();

  fill('aliceblue');
  stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);

  fill('white');
  stroke('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawTitle();
  drawCards();
  if (quizMode) drawQuiz();

  quizBtn.html(quizMode ? 'Exit Quiz' : 'Quiz Mode');
}

function drawTitle() {
  noStroke();
  fill('#0f172a');
  textAlign(CENTER, TOP);
  textSize(24);
  text('Dictionary Use Cases', canvasWidth / 2, 10);
}

function buildCards() {
  cards = [];
  const cols = canvasWidth < 860 ? 2 : 3;
  const rows = Math.ceil(cases.length / cols);
  const gx = 18;
  const gy = 16;
  const areaX = 20;
  const areaY = 70;
  const cardW = (canvasWidth - areaX * 2 - gx * (cols - 1)) / cols;
  const cardH = (quizMode ? 290 : 400 - gy * (rows - 1)) / rows;

  for (let i = 0; i < cases.length; i++) {
    const c = i % cols;
    const r = Math.floor(i / cols);
    cards.push({ x: areaX + c * (cardW + gx), y: areaY + r * (cardH + gy), w: cardW, h: cardH, ...cases[i] });
  }
}

function drawCards() {
  for (let i = 0; i < cards.length; i++) {
    const c = cards[i];
    const hover = inRect(mouseX, mouseY, c.x, c.y, c.w, c.h);
    const open = expanded === i || hover;

    fill(open ? '#dbeafe' : '#f8fafc');
    stroke('#94a3b8');
    rect(c.x, c.y, c.w, c.h, 10);

    noStroke();
    fill('#1f2937');
    textAlign(LEFT, TOP);
    textSize(15);
    text(c.title, c.x + 10, c.y + 10);

    fill('#334155');
    textSize(12);
    text(c.desc, c.x + 10, c.y + 36, c.w - 20, 42);

    if (open) {
      fill(15, 23, 42, 240);
      stroke('#334155');
      rect(c.x + 8, c.y + 84, c.w - 16, c.h - 94, 6);

      noStroke();
      fill('#e2e8f0');
      textFont('monospace');
      textSize(12);
      text(c.code, c.x + 14, c.y + 96, c.w - 28, c.h - 106);
      textFont('Arial, Helvetica, sans-serif');
    }

    c._idx = i;
  }
}

function drawQuiz() {
  const x = 20;
  const y = drawHeight - 120;
  const w = canvasWidth - 40;
  const h = 100;

  fill('#ecfeff');
  stroke('#06b6d4');
  rect(x, y, w, h, 8);

  noStroke();
  fill('#0c4a6e');
  textAlign(LEFT, TOP);
  textSize(13);
  text('Which data structure?', x + 10, y + 8);
  text(quiz.q, x + 10, y + 28, w - 20, 24);

  drawQuizOption('list', x + 10, y + 58, 80, 28);
  drawQuizOption('dictionary', x + 98, y + 58, 120, 28);
  drawQuizOption('tuple', x + 226, y + 58, 86, 28);
  drawQuizOption('set', x + 320, y + 58, 70, 28);

  fill('#1e3a8a');
  textSize(12);
  text(quizFeedback, x + 400, y + 64, w - 410, 26);
}

function drawQuizOption(label, x, y, w, h) {
  const hover = inRect(mouseX, mouseY, x, y, w, h);
  fill(hover ? '#bfdbfe' : '#ffffff');
  stroke('#64748b');
  rect(x, y, w, h, 7);

  noStroke();
  fill('#1f2937');
  textAlign(CENTER, CENTER);
  textSize(12);
  text(label, x + w / 2, y + h / 2);

  quiz._opts = quiz._opts || [];
  quiz._opts.push({ label, x, y, w, h });
}

function toggleQuiz() {
  quizMode = !quizMode;
  quizFeedback = '';
  if (quizMode) newQuiz();
}

function newQuiz() {
  quiz = { ...random(quizScenarios), _opts: [] };
}

function mousePressed() {
  if (quizMode && quiz && quiz._opts) {
    for (const o of quiz._opts) {
      if (inRect(mouseX, mouseY, o.x, o.y, o.w, o.h)) {
        if (o.label === quiz.ans) {
          quizFeedback = 'Correct';
          setTimeout(newQuiz, 300);
        } else {
          quizFeedback = `Try again (correct: ${quiz.ans})`;
        }
        return;
      }
    }
  }

  for (const c of cards) {
    if (inRect(mouseX, mouseY, c.x, c.y, c.w, c.h)) {
      expanded = expanded === c._idx ? -1 : c._idx;
      return;
    }
  }
}

function inRect(mx, my, x, y, w, h) {
  return mx >= x && mx <= x + w && my >= y && my <= y + h;
}

function positionControls() {
  quizBtn.position(10, drawHeight + 10);
  resetBtn.position(80, drawHeight + 10);
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
