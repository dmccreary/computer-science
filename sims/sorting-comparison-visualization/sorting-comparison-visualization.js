let canvasWidth = 400;
let drawHeight = 450;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;

const seedArray = [8, 3, 6, 1, 7, 2, 5, 4];

let selectionFrames = [];
let insertionFrames = [];
let mergeFrames = [];

let frameIdx = 0;
let maxFrames = 0;
let autoPlay = false;
let lastMs = 0;

let stepBtn;
let autoBtn;
let resetBtn;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  buildAllFrames();

  stepBtn = createButton('Step');
  stepBtn.mousePressed(stepForward);

  autoBtn = createButton('Auto Play');
  autoBtn.mousePressed(() => {
    autoPlay = !autoPlay;
    autoBtn.html(autoPlay ? 'Pause' : 'Auto Play');
  });

  resetBtn = createButton('Reset');
  resetBtn.mousePressed(() => {
    frameIdx = 0;
    autoPlay = false;
    autoBtn.html('Auto Play');
  });

  positionControls();
  describe('Sorting comparison microsim showing selection insertion and merge sort progress side by side.', LABEL);
}

function draw() {
  updateCanvasSize();

  if (autoPlay && millis() - lastMs > 650) {
    stepForward();
    lastMs = millis();
  }

  fill('aliceblue');
  stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawTitle();
  drawPanels();
  drawFooter();
}

function drawTitle() {
  noStroke();
  fill('#0f172a');
  textAlign(CENTER, TOP);
  textSize(23);
  text('Sorting Comparison MicroSim', canvasWidth / 2, 10);

  fill('#475569');
  textSize(13);
  text(`same input: [${seedArray.join(', ')}]`, canvasWidth / 2, 40);
}

function drawPanels() {
  const margin = 20;
  const gap = 12;
  const panelW = (canvasWidth - margin * 2 - gap * 2) / 3;
  const y = 70;
  const h = 320;

  drawPanel(margin + 0 * (panelW + gap), y, panelW, h, '#dbeafe', 'Selection', selectionFrames[min(frameIdx, selectionFrames.length - 1)], '#1d4ed8');
  drawPanel(margin + 1 * (panelW + gap), y, panelW, h, '#dcfce7', 'Insertion', insertionFrames[min(frameIdx, insertionFrames.length - 1)], '#15803d');
  drawPanel(margin + 2 * (panelW + gap), y, panelW, h, '#fef3c7', 'Merge', mergeFrames[min(frameIdx, mergeFrames.length - 1)], '#b45309');
}

function drawPanel(x, y, w, h, bg, title, frame, accent) {
  fill(bg);
  stroke('#94a3b8');
  rect(x, y, w, h, 10);

  noStroke();
  fill('#0f172a');
  textAlign(CENTER, TOP);
  textSize(14);
  text(title, x + w / 2, y + 10);

  drawBars(frame.arr, x + 8, y + 38, w - 16, h - 78, accent);

  fill('#334155');
  textAlign(LEFT, TOP);
  textSize(11);
  text(frame.note, x + 8, y + h - 35, w - 16, 28);
}

function drawBars(arr, x, y, w, h, colorHex) {
  const n = arr.length;
  const barGap = 4;
  const barW = (w - (n - 1) * barGap) / n;
  const maxVal = max(...arr);

  for (let i = 0; i < n; i++) {
    const barH = map(arr[i], 0, maxVal, 8, h);
    const bx = x + i * (barW + barGap);
    const by = y + h - barH;

    fill(colorHex);
    noStroke();
    rect(bx, by, barW, barH, 2);

    fill('#0f172a');
    textAlign(CENTER, BOTTOM);
    textSize(10);
    text(arr[i], bx + barW / 2, by - 2);
  }
}

function drawFooter() {
  fill('#ecfeff');
  stroke('#94a3b8');
  rect(20, 398, canvasWidth - 40, 40, 8);

  noStroke();
  fill('#0f172a');
  textAlign(CENTER, CENTER);
  textSize(13);
  text(`Frame ${frameIdx + 1}/${maxFrames} | Selection: O(n^2) | Insertion: O(n^2) avg | Merge: O(n log n)`, canvasWidth / 2, 418);
}

function stepForward() {
  if (frameIdx < maxFrames - 1) {
    frameIdx += 1;
  } else {
    autoPlay = false;
    autoBtn.html('Auto Play');
  }
}

function positionControls() {
  stepBtn.position(10, drawHeight + 10);
  autoBtn.position(58, drawHeight + 10);
  resetBtn.position(132, drawHeight + 10);
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

function buildAllFrames() {
  selectionFrames = buildSelectionFrames(seedArray);
  insertionFrames = buildInsertionFrames(seedArray);
  mergeFrames = buildMergeFrames(seedArray);

  maxFrames = max(selectionFrames.length, insertionFrames.length, mergeFrames.length);
  selectionFrames = padFrames(selectionFrames, maxFrames);
  insertionFrames = padFrames(insertionFrames, maxFrames);
  mergeFrames = padFrames(mergeFrames, maxFrames);
}

function padFrames(frames, targetLen) {
  const out = frames.slice();
  while (out.length < targetLen) {
    out.push({ ...out[out.length - 1], arr: out[out.length - 1].arr.slice() });
  }
  return out;
}

function buildSelectionFrames(input) {
  const a = input.slice();
  const frames = [{ arr: a.slice(), note: 'Start array' }];

  for (let i = 0; i < a.length - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < a.length; j++) {
      if (a[j] < a[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      const t = a[i];
      a[i] = a[minIdx];
      a[minIdx] = t;
      frames.push({ arr: a.slice(), note: `Swap index ${i} with min index ${minIdx}` });
    } else {
      frames.push({ arr: a.slice(), note: `Position ${i} already minimum` });
    }
  }
  frames.push({ arr: a.slice(), note: 'Sorted' });
  return frames;
}

function buildInsertionFrames(input) {
  const a = input.slice();
  const frames = [{ arr: a.slice(), note: 'Start array' }];

  for (let i = 1; i < a.length; i++) {
    const key = a[i];
    let j = i - 1;
    while (j >= 0 && a[j] > key) {
      a[j + 1] = a[j];
      j--;
    }
    a[j + 1] = key;
    frames.push({ arr: a.slice(), note: `Insert ${key} into sorted prefix` });
  }
  frames.push({ arr: a.slice(), note: 'Sorted' });
  return frames;
}

function buildMergeFrames(input) {
  const a = input.slice();
  const frames = [{ arr: a.slice(), note: 'Start array' }];

  function mergeSortRange(lo, hi) {
    if (hi - lo <= 1) return;
    const mid = floor((lo + hi) / 2);
    mergeSortRange(lo, mid);
    mergeSortRange(mid, hi);

    const merged = [];
    let i = lo;
    let j = mid;
    while (i < mid && j < hi) {
      if (a[i] <= a[j]) {
        merged.push(a[i]);
        i++;
      } else {
        merged.push(a[j]);
        j++;
      }
    }
    while (i < mid) {
      merged.push(a[i]);
      i++;
    }
    while (j < hi) {
      merged.push(a[j]);
      j++;
    }

    for (let k = 0; k < merged.length; k++) {
      a[lo + k] = merged[k];
    }
    frames.push({ arr: a.slice(), note: `Merge range [${lo}, ${hi - 1}]` });
  }

  mergeSortRange(0, a.length);
  frames.push({ arr: a.slice(), note: 'Sorted' });
  return frames;
}
