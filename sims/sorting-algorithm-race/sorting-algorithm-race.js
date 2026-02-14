let canvasWidth = 400;
let drawHeight = 520;
let controlHeight = 90;
let canvasHeight = drawHeight + controlHeight;

let baseArray = [];
let size = 20;
let speed = 25;
let running = false;
let arrangement = 'Random';

let racers = {};

let generateBtn;
let raceBtn;
let resetBtn;
let sizeSlider;
let speedSlider;
let arrangementSelect;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  generateBtn = createButton('Generate Array');
  generateBtn.mousePressed(generateAll);
  raceBtn = createButton('Start Race');
  raceBtn.mousePressed(() => { running = true; });
  resetBtn = createButton('Reset');
  resetBtn.mousePressed(resetRace);

  sizeSlider = createSlider(10, 60, size, 1);
  speedSlider = createSlider(5, 50, speed, 1);

  arrangementSelect = createSelect();
  arrangementSelect.option('Random');
  arrangementSelect.option('Nearly Sorted');
  arrangementSelect.option('Reverse Sorted');
  arrangementSelect.option('Few Unique Values');
  arrangementSelect.changed(() => {
    arrangement = arrangementSelect.value();
    generateAll();
  });

  generateAll();
  positionControls();

  describe('Side-by-side race of selection insertion and merge sort with counters.', LABEL);
}

function draw() {
  updateCanvasSize();
  size = sizeSlider.value();
  speed = speedSlider.value();

  fill('aliceblue');
  stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  if (running && frameCount % speed === 0) {
    stepSelection(racers.selection);
    stepInsertion(racers.insertion);
    stepMerge(racers.merge);

    if (racers.selection.done && racers.insertion.done && racers.merge.done) {
      running = false;
    }
  }

  drawTitle();
  drawRacer('Selection Sort', racers.selection, 0);
  drawRacer('Insertion Sort', racers.insertion, 1);
  drawRacer('Merge Sort', racers.merge, 2);
}

function drawTitle() {
  noStroke();
  fill('#0f172a');
  textAlign(CENTER, TOP);
  textSize(24);
  text('Sorting Algorithm Race', canvasWidth / 2, 10);
}

function drawRacer(name, r, col) {
  const colW = (canvasWidth - 40) / 3;
  const x = 20 + col * colW;
  const y = 72;
  const w = colW - 8;
  const h = 360;

  fill('#f8fafc');
  stroke('#94a3b8');
  rect(x, y, w, h, 8);

  noStroke();
  fill('#111827');
  textAlign(CENTER, TOP);
  textSize(14);
  text(name, x + w / 2, y + 8);

  const arr = r.arr;
  const n = arr.length;
  const bx = x + 8;
  const by = y + 36;
  const bw = max(2, (w - 16 - (n - 1) * 2) / n);
  const maxV = max(...arr, 1);

  for (let i = 0; i < n; i++) {
    const bh = map(arr[i], 0, maxV, 8, 220);
    const xx = bx + i * (bw + 2);
    const yy = by + 220 - bh;

    let c = '#60a5fa';
    if (r.done || i >= r.sortedFrom) c = '#22c55e';
    if (i === r.a || i === r.b) c = '#fde68a';

    fill(c);
    noStroke();
    rect(xx, yy, bw, bh);
  }

  fill('#334155');
  textAlign(LEFT, TOP);
  textSize(11);
  text(`comparisons: ${r.comparisons}`, x + 10, y + 272);
  text(`moves/swaps: ${r.moves}`, x + 10, y + 288);
  text(`steps: ${r.steps}`, x + 10, y + 304);
}

function generateArray() {
  const a = [];
  for (let i = 0; i < size; i++) a.push(floor(random(5, 100)));
  if (arrangement === 'Nearly Sorted') a.sort((x, y) => x - y), swapRandomFew(a, 3);
  if (arrangement === 'Reverse Sorted') a.sort((x, y) => y - x);
  if (arrangement === 'Few Unique Values') for (let i = 0; i < a.length; i++) a[i] = [10, 30, 50, 70][floor(random(4))];
  return a;
}

function swapRandomFew(a, k) {
  for (let i = 0; i < k; i++) {
    const i1 = floor(random(a.length));
    const i2 = floor(random(a.length));
    [a[i1], a[i2]] = [a[i2], a[i1]];
  }
}

function initRacer(arr) {
  return {
    arr: [...arr], i: 0, j: 0, k: 1,
    a: -1, b: -1, sortedFrom: arr.length,
    comparisons: 0, moves: 0, steps: 0, done: false,
    mergeSeg: 1, mergeStart: 0
  };
}

function generateAll() {
  baseArray = generateArray();
  racers = {
    selection: initRacer(baseArray),
    insertion: initRacer(baseArray),
    merge: initRacer(baseArray)
  };
  running = false;
}

function resetRace() {
  generateAll();
}

function stepSelection(r) {
  if (r.done) return;
  const n = r.arr.length;
  if (r.i >= n - 1) { r.done = true; r.sortedFrom = 0; return; }

  if (r.j === 0) { r.j = r.i + 1; r.k = r.i; }

  if (r.j < n) {
    r.a = r.k; r.b = r.j;
    r.comparisons++;
    if (r.arr[r.j] < r.arr[r.k]) r.k = r.j;
    r.j++;
  } else {
    if (r.k !== r.i) {
      [r.arr[r.i], r.arr[r.k]] = [r.arr[r.k], r.arr[r.i]];
      r.moves++;
    }
    r.i++; r.j = 0; r.sortedFrom = r.i;
  }
  r.steps++;
}

function stepInsertion(r) {
  if (r.done) return;
  const n = r.arr.length;
  if (r.i === 0) { r.i = 1; r.j = 1; }
  if (r.i >= n) { r.done = true; r.sortedFrom = 0; return; }

  if (r.j > 0) {
    r.a = r.j - 1; r.b = r.j;
    r.comparisons++;
    if (r.arr[r.j - 1] > r.arr[r.j]) {
      [r.arr[r.j - 1], r.arr[r.j]] = [r.arr[r.j], r.arr[r.j - 1]];
      r.moves++; r.j--;
    } else {
      r.i++; r.j = r.i;
    }
  } else {
    r.i++; r.j = r.i;
  }
  r.sortedFrom = r.i;
  r.steps++;
}

function stepMerge(r) {
  if (r.done) return;
  const n = r.arr.length;
  if (r.mergeSeg >= n) { r.done = true; r.sortedFrom = 0; return; }

  const left = r.mergeStart;
  const mid = min(left + r.mergeSeg, n);
  const right = min(left + 2 * r.mergeSeg, n);
  if (mid < right) {
    const merged = [];
    let i = left, j = mid;
    while (i < mid && j < right) {
      r.comparisons++;
      if (r.arr[i] <= r.arr[j]) merged.push(r.arr[i++]);
      else merged.push(r.arr[j++]);
      r.moves++;
    }
    while (i < mid) merged.push(r.arr[i++]), r.moves++;
    while (j < right) merged.push(r.arr[j++]), r.moves++;
    for (let k = 0; k < merged.length; k++) r.arr[left + k] = merged[k];
    r.a = left; r.b = right - 1;
  }

  r.mergeStart += 2 * r.mergeSeg;
  if (r.mergeStart >= n) {
    r.mergeStart = 0;
    r.mergeSeg *= 2;
  }
  r.sortedFrom = n; // merge does not have simple sorted prefix during run
  r.steps++;
}

function positionControls() {
  generateBtn.position(10, drawHeight + 8);
  raceBtn.position(112, drawHeight + 8);
  resetBtn.position(182, drawHeight + 8);
  arrangementSelect.position(236, drawHeight + 8);
  sizeSlider.position(380, drawHeight + 12);
  sizeSlider.size(120);
  speedSlider.position(510, drawHeight + 12);
  speedSlider.size(120);
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
