// Error Type Identifier - Classification Quiz MicroSim
// Students classify code snippets as syntax, runtime, or logic errors
// Immediate feedback with explanations
// MicroSim template version 2026.02

let canvasWidth = 400;
let drawHeight = 420;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 15;
let defaultTextSize = 16;

// Quiz data
const SNIPPETS = [
  {
    code: 'print("hello"',
    answer: 'syntax',
    explanation: 'Missing closing parenthesis. Python can\'t parse this, so it fails before running.'
  },
  {
    code: 'x = 10 / 0',
    answer: 'runtime',
    explanation: 'ZeroDivisionError happens while the program is running. The syntax is fine.'
  },
  {
    code: 'average = (a + b + c) / 2\n# (should divide by 3)',
    answer: 'logic',
    explanation: 'Program runs without errors, but dividing by 2 instead of 3 gives the wrong average.'
  },
  {
    code: 'for i in range(10)\n    print(i)',
    answer: 'syntax',
    explanation: 'Missing colon after the for statement. Python catches this before running.'
  },
  {
    code: 'names = ["Alice"]\nprint(names[5])',
    answer: 'runtime',
    explanation: 'IndexError: list only has index 0, but we try to access index 5.'
  },
  {
    code: 'area = length + width\n# (should be length * width)',
    answer: 'logic',
    explanation: 'Using + instead of * calculates a sum, not an area. No error message — just wrong results.'
  },
  {
    code: 'x = int("hello")',
    answer: 'runtime',
    explanation: 'ValueError: the string "hello" can\'t be converted to an integer.'
  },
  {
    code: 'if x = 5:\n    print("five")',
    answer: 'syntax',
    explanation: 'Using = (assignment) instead of == (comparison). Python catches this before running.'
  },
  {
    code: 'celsius = (fahr - 32) * 9/5\n# (should be * 5/9)',
    answer: 'logic',
    explanation: 'The formula is inverted (multiplies by 9/5 instead of 5/9). Runs fine but gives wrong temperature.'
  },
  {
    code: 'scores = {}\nprint(scores["math"])',
    answer: 'runtime',
    explanation: 'KeyError: the dictionary is empty, so the key "math" doesn\'t exist.'
  }
];

let currentIndex = 0;
let shuffledSnippets = [];
let correct = 0;
let total = 0;
let feedback = null; // { correct: bool, text: string }
let answered = false;
let nextBtn;

// Button positions
let btnData = [
  { label: 'Syntax Error', type: 'syntax', color: [200, 60, 60], x: 0, y: 0, w: 0, h: 36 },
  { label: 'Runtime Error', type: 'runtime', color: [220, 140, 0], x: 0, y: 0, w: 0, h: 36 },
  { label: 'Logic Error', type: 'logic', color: [180, 180, 0], x: 0, y: 0, w: 0, h: 36 }
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  // Shuffle snippets
  shuffledSnippets = [...SNIPPETS];
  shuffleArray(shuffledSnippets);

  nextBtn = createButton('Next Question');
  nextBtn.position(canvasWidth / 2 - 60, drawHeight + 10);
  nextBtn.mousePressed(nextQuestion);
  nextBtn.hide();

  describe('Error Type Identifier quiz. Read code snippets and classify them as syntax errors, runtime errors, or logic errors.', LABEL);
}

function draw() {
  updateCanvasSize();

  // Drawing area
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  // Control area
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(20);
  text('Error Type Identifier', canvasWidth / 2, 8);

  // Score
  textAlign(RIGHT, TOP);
  textSize(14);
  fill(80);
  text('Score: ' + correct + ' / ' + total, canvasWidth - 15, 12);

  if (currentIndex >= shuffledSnippets.length) {
    drawEndScreen();
    return;
  }

  let snippet = shuffledSnippets[currentIndex];

  // Progress
  textAlign(LEFT, TOP);
  textSize(12);
  fill(120);
  text('Question ' + (currentIndex + 1) + ' of ' + shuffledSnippets.length, 15, 12);

  // Code box
  let codeX = 20;
  let codeY = 45;
  let codeW = canvasWidth - 40;
  let codeH = 90;

  fill(40, 44, 52);
  stroke(60);
  strokeWeight(1);
  rect(codeX, codeY, codeW, codeH, 8);

  // Code text
  noStroke();
  fill(200, 220, 255);
  textAlign(LEFT, TOP);
  textSize(14);
  textFont('monospace');
  let lines = snippet.code.split('\n');
  let ly = codeY + 12;
  for (let line of lines) {
    // Color comments differently
    if (line.trim().startsWith('#')) {
      fill(120, 160, 120);
    } else {
      fill(200, 220, 255);
    }
    text(line, codeX + 15, ly);
    ly += 20;
  }
  textFont('sans-serif');

  // Question prompt
  fill(60);
  textSize(16);
  textStyle(BOLD);
  textAlign(CENTER, TOP);
  text('What type of error is this?', canvasWidth / 2, 150);
  textStyle(NORMAL);

  // Answer buttons
  let btnY = 180;
  let btnW = canvasWidth * 0.28;
  let btnGap = 15;
  let totalW = btnW * 3 + btnGap * 2;
  let startX = (canvasWidth - totalW) / 2;

  for (let i = 0; i < btnData.length; i++) {
    let b = btnData[i];
    b.x = startX + i * (btnW + btnGap);
    b.y = btnY;
    b.w = btnW;

    let isHovered = mouseX > b.x && mouseX < b.x + b.w &&
                    mouseY > b.y && mouseY < b.y + b.h && !answered;

    if (answered && b.type === snippet.answer) {
      // Correct answer highlight
      fill(100, 200, 100);
      stroke(0, 150, 0);
      strokeWeight(2);
    } else if (answered) {
      fill(200, 200, 200);
      stroke(160);
      strokeWeight(1);
    } else if (isHovered) {
      fill(b.color[0], b.color[1], b.color[2]);
      stroke(b.color[0] - 30, b.color[1] - 30, b.color[2] - 30);
      strokeWeight(2);
      cursor(HAND);
    } else {
      fill(b.color[0] + 40, b.color[1] + 40, b.color[2] + 40);
      stroke(b.color[0], b.color[1], b.color[2]);
      strokeWeight(1);
    }

    rect(b.x, b.y, b.w, b.h, 8);

    noStroke();
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(13);
    textStyle(BOLD);
    text(b.label, b.x + b.w / 2, b.y + b.h / 2);
    textStyle(NORMAL);
  }

  // Feedback area
  if (feedback) {
    let fbY = 235;
    let fbW = canvasWidth - 40;
    let fbH = 155;

    if (feedback.correct) {
      fill(220, 255, 220, 240);
      stroke(0, 150, 0);
    } else {
      fill(255, 220, 220, 240);
      stroke(200, 0, 0);
    }
    strokeWeight(2);
    rect(20, fbY, fbW, fbH, 8);

    noStroke();
    textAlign(LEFT, TOP);

    if (feedback.correct) {
      fill(0, 130, 0);
      textSize(16);
      textStyle(BOLD);
      text('Correct!', 35, fbY + 10);
    } else {
      fill(180, 0, 0);
      textSize(16);
      textStyle(BOLD);
      text('Not quite. The answer is: ' + capitalize(snippet.answer) + ' Error', 35, fbY + 10);
    }
    textStyle(NORMAL);

    fill(60);
    textSize(13);
    drawWrappedText(feedback.text, 35, fbY + 35, fbW - 30);
  }

  // Reposition next button
  nextBtn.position(canvasWidth / 2 - 60, drawHeight + 10);
}

function drawEndScreen() {
  let pct = total > 0 ? Math.round((correct / total) * 100) : 0;

  fill(60);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(24);
  textStyle(BOLD);
  text('Quiz Complete!', canvasWidth / 2, 100);
  textStyle(NORMAL);

  textSize(20);
  text('Score: ' + correct + ' / ' + total + ' (' + pct + '%)', canvasWidth / 2, 150);

  textSize(16);
  fill(100);
  if (pct >= 80) {
    text('Excellent! You can identify error types like a pro.', canvasWidth / 2, 200);
  } else if (pct >= 60) {
    text('Good job! Review the ones you missed.', canvasWidth / 2, 200);
  } else {
    text('Keep practicing! Re-read the error types section.', canvasWidth / 2, 200);
  }

  // Restart button in control area
  nextBtn.html('Restart Quiz');
  nextBtn.show();
}

function mousePressed() {
  if (answered || currentIndex >= shuffledSnippets.length) return;

  let snippet = shuffledSnippets[currentIndex];

  for (let b of btnData) {
    if (mouseX > b.x && mouseX < b.x + b.w &&
        mouseY > b.y && mouseY < b.y + b.h) {
      answered = true;
      total++;
      let isCorrect = b.type === snippet.answer;
      if (isCorrect) correct++;

      feedback = {
        correct: isCorrect,
        text: snippet.explanation
      };
      nextBtn.show();
      return;
    }
  }
}

function nextQuestion() {
  if (currentIndex >= shuffledSnippets.length) {
    // Restart
    shuffleArray(shuffledSnippets);
    currentIndex = 0;
    correct = 0;
    total = 0;
    feedback = null;
    answered = false;
    nextBtn.html('Next Question');
    nextBtn.hide();
    return;
  }

  currentIndex++;
  feedback = null;
  answered = false;
  nextBtn.hide();

  if (currentIndex >= shuffledSnippets.length) {
    nextBtn.show();
  }
}

function drawWrappedText(txt, x, y, maxW) {
  let words = txt.split(' ');
  let line = '';
  for (let w of words) {
    let test = line + (line ? ' ' : '') + w;
    if (textWidth(test) > maxW && line) {
      text(line, x, y);
      line = w;
      y += 18;
    } else {
      line = test;
    }
  }
  if (line) text(line, x, y);
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  canvasWidth = Math.floor(container.width);
}
