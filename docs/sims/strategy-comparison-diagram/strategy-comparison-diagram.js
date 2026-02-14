let canvasWidth = 400;
let drawHeight = 450;
let controlHeight = 70;
let canvasHeight = drawHeight + controlHeight;

const cards = [
  {
    name: 'Brute Force',
    approach: 'Try all possibilities',
    when: 'Small inputs or baseline solution',
    guarantee: 'Always finds answer',
    color: '#dbeafe'
  },
  {
    name: 'Divide and Conquer',
    approach: 'Split, solve, combine',
    when: 'Independent subproblems',
    guarantee: 'Correct with valid combine step',
    color: '#dcfce7'
  },
  {
    name: 'Greedy',
    approach: 'Best local choice each step',
    when: 'When greedy-choice property holds',
    guarantee: 'Must be proven per problem',
    color: '#fef3c7'
  }
];

let selected = 0;
let nextBtn;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  nextBtn = createButton('Next Strategy');
  nextBtn.mousePressed(() => {
    selected = (selected + 1) % cards.length;
  });

  positionControls();
  describe('Strategy comparison diagram for brute force divide and conquer and greedy approaches.', LABEL);
}

function draw() {
  updateCanvasSize();

  fill('aliceblue');
  stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawTitle();
  drawCards();
  drawTagline();
}

function drawTitle() {
  noStroke();
  fill('#0f172a');
  textAlign(CENTER, TOP);
  textSize(24);
  text('Strategy Comparison Diagram', canvasWidth / 2, 10);
}

function drawCards() {
  const cardW = (canvasWidth - 60) / 3;
  for (let i = 0; i < cards.length; i++) {
    const c = cards[i];
    const x = 20 + i * (cardW + 10);
    const y = 70;
    const h = 300;

    fill(c.color);
    stroke(i === selected ? '#111827' : '#94a3b8');
    strokeWeight(i === selected ? 3 : 1.5);
    rect(x, y, cardW, h, 10);

    noStroke();
    fill('#1f2937');
    textAlign(CENTER, TOP);
    textSize(16);
    text(c.name, x + cardW / 2, y + 12);

    textAlign(LEFT, TOP);
    textSize(12);
    fill('#334155');
    text('Approach:', x + 10, y + 48);
    text(c.approach, x + 10, y + 66, cardW - 20, 42);
    text('When to use:', x + 10, y + 118);
    text(c.when, x + 10, y + 136, cardW - 20, 48);
    text('Guarantee:', x + 10, y + 196);
    text(c.guarantee, x + 10, y + 214, cardW - 20, 58);
  }
}

function drawTagline() {
  fill('#ecfeff');
  stroke('#94a3b8');
  rect(20, 382, canvasWidth - 40, 50, 8);
  noStroke();
  fill('#0f172a');
  textAlign(CENTER, CENTER);
  textSize(13);
  text('Brute force = safety net | Divide & Conquer = power tool | Greedy = shortcut (prove it!)', canvasWidth / 2, 407);
}

function mousePressed() {
  const cardW = (canvasWidth - 60) / 3;
  for (let i = 0; i < cards.length; i++) {
    const x = 20 + i * (cardW + 10);
    if (mouseX >= x && mouseX <= x + cardW && mouseY >= 70 && mouseY <= 370) {
      selected = i;
      return;
    }
  }
}

function positionControls() {
  nextBtn.position(10, drawHeight + 10);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = max(860, container.offsetWidth);
}
