let canvasWidth = 400;
let drawHeight = 470;
let controlHeight = 170;
let canvasHeight = drawHeight + controlHeight;

let patternInput;
let textArea;
let matchInfo;
let errorInfo;
let outputDiv;
let presetButtons = [];
let exampleButtons = [];

const tokenPresets = ['\\d', '\\w', '\\s', '.', '+', '*', '?', '^', '$'];
const examples = [
  { name: 'Email Finder', pattern: '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}', text: 'Contact: ana@example.com and help@school.edu today.' },
  { name: 'Phone (US)', pattern: '\\(?\\d{3}\\)?[-. ]?\\d{3}[-. ]?\\d{4}', text: 'Call 555-123-4567 or (800) 555 0000.' },
  { name: 'Hashtags', pattern: '#\\w+', text: 'Topics: #python #regex #learning' }
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  patternInput = createInput('\\d+');
  patternInput.input(updateMatches);

  textArea = createElement('textarea', 'Room 101 has 24 students and room 102 has 30.');
  textArea.input(updateMatches);
  textArea.style('resize', 'none');

  matchInfo = createDiv('Matches: 0');
  errorInfo = createDiv('');
  outputDiv = createDiv('');

  tokenPresets.forEach((tok) => {
    const b = createButton(tok);
    b.mousePressed(() => {
      const cur = patternInput.value();
      patternInput.value(cur + tok);
      updateMatches();
    });
    presetButtons.push(b);
  });

  examples.forEach((ex) => {
    const b = createButton(`Try ${ex.name}`);
    b.mousePressed(() => {
      patternInput.value(ex.pattern);
      textArea.value(ex.text);
      updateMatches();
    });
    exampleButtons.push(b);
  });

  positionControls();
  updateMatches();
  describe('Regex pattern tester with live match highlighting and preset examples.', LABEL);
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
  text('Regex Pattern Tester', canvasWidth / 2, 10);

  fill('#334155');
  textSize(13);
  text('Pattern + text update in real time. Invalid patterns show errors.', canvasWidth / 2, 40);

  drawPanels();
}

function drawPanels() {
  fill('#f8fafc');
  stroke('#94a3b8');
  rect(20, 68, canvasWidth - 40, 60, 8);
  noStroke();
  fill('#0f172a');
  textAlign(LEFT, TOP);
  textSize(13);
  text('Pattern:', 30, 78);

  fill('#f8fafc');
  stroke('#94a3b8');
  rect(20, 136, canvasWidth - 40, 140, 8);
  noStroke();
  fill('#0f172a');
  text('Test Text:', 30, 146);

  fill('#f8fafc');
  stroke('#94a3b8');
  rect(20, 284, canvasWidth - 40, 170, 8);
  noStroke();
  fill('#0f172a');
  text('Results:', 30, 294);
}

function escapeHtml(s) {
  return s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function updateMatches() {
  const pattern = patternInput.value();
  const txt = textArea.value();

  try {
    const re = new RegExp(pattern, 'g');
    const matches = [...txt.matchAll(re)];

    let html = '';
    let idx = 0;
    for (const m of matches) {
      const start = m.index;
      const end = start + m[0].length;
      html += escapeHtml(txt.slice(idx, start));
      html += `<mark style="background:#fde047;padding:0 2px;">${escapeHtml(txt.slice(start, end))}</mark>`;
      idx = end;
    }
    html += escapeHtml(txt.slice(idx));

    outputDiv.html(`<div style="font-family:monospace;white-space:pre-wrap;line-height:1.35;">${html || escapeHtml(txt)}</div>`);
    matchInfo.html(`Matches: ${matches.length}`);

    const groupList = matches
      .filter((m) => m.length > 1)
      .map((m, i) => `#${i + 1} groups: [${m.slice(1).map((x) => x ?? '').join(', ')}]`)
      .join('<br/>');
    errorInfo.html(groupList ? `Captured Groups:<br/>${groupList}` : '');
    patternInput.style('border', '1px solid #94a3b8');
  } catch (e) {
    outputDiv.html('');
    matchInfo.html('Matches: 0');
    errorInfo.html(`Invalid pattern: ${escapeHtml(String(e.message))}`);
    patternInput.style('border', '2px solid #ef4444');
  }
}

function positionControls() {
  patternInput.position(95, 80);
  patternInput.size(canvasWidth - 130);

  let x = 30;
  tokenPresets.forEach((b) => {
    b.position(x, 108);
    x += b.width + 6;
  });

  textArea.position(30, 168);
  textArea.size(canvasWidth - 60, 96);

  matchInfo.position(30, 314);
  errorInfo.position(30, 338);
  outputDiv.position(30, 374);
  outputDiv.size(canvasWidth - 60, 72);
  outputDiv.style('overflow-y', 'auto');
  outputDiv.style('border', '1px solid #cbd5e1');
  outputDiv.style('background', '#ffffff');
  outputDiv.style('padding', '6px');

  let exx = 10;
  exampleButtons.forEach((b) => {
    b.position(exx, drawHeight + 10);
    exx += b.width + 8;
  });
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = max(900, container.offsetWidth);
}
