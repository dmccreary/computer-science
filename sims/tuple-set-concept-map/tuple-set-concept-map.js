// Tuple Set Concept Map
let canvasWidth = 400;
let drawHeight = 500;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let defaultTextSize = 16;

let collectionNodes = [];
let propertyNodes = [];
let operationNodes = [];
let allNodes = [];
let compactLayout = false;

let hoveredNodeId = null;
let selectedCollectionId = null;
let pulseAngle = 0;

const propertyColors = {
  ordered: '#2563eb',
  unordered: '#ea580c',
  mutable: '#16a34a',
  immutable: '#9333ea',
  duplicates: '#d97706',
  unique: '#0f766e',
  dictkey: '#dc2626',
  operation: '#1f2937'
};

const collectionExamples = {
  list: [
    'numbers = [3, 7, 3, 1]',
    'numbers.append(9)',
    '# list is mutable and ordered'
  ],
  tuple: [
    'pair = (3, 7, 3, 1)',
    'first = pair[0]',
    '# tuple is immutable and ordered'
  ],
  set: [
    'values = {3, 7, 3, 1}',
    '# result: {1, 3, 7}',
    '# set keeps unique elements'
  ],
  frozenset: [
    'f = frozenset([3, 7, 3, 1])',
    'lookup = f',
    '# immutable set, can be dict key'
  ]
};

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  describe(
    'Concept map showing relationships among list, tuple, set, and frozenset with shared properties and set operations.',
    LABEL
  );
}

function draw() {
  updateCanvasSize();
  pulseAngle += 0.045;

  // draw the background and control region
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  updateNodeLayout();
  updateHoverState();

  drawTitle();
  drawConnections();
  drawNodeGroup(propertyNodes);
  drawNodeGroup(operationNodes);
  drawNodeGroup(collectionNodes);
  drawControlPanel();

  if (selectedCollectionId) {
    drawCodeTooltip(selectedCollectionId);
  }

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(24);
  text('Tuple and Set Concept Map', canvasWidth / 2, 10);

  fill('#334155');
  textSize(14);
  text('Understand: summarize and relate shared properties', canvasWidth / 2, 40);
}

function drawConnections() {
  const lineEntries = [];

  for (const node of [...propertyNodes, ...operationNodes]) {
    for (const targetId of node.links) {
      const target = findNode(targetId);
      if (!target) {
        continue;
      }

      const highlighted = isConnectionHighlighted(node.id, target.id);
      lineEntries.push({
        from: node,
        to: target,
        color: node.lineColor,
        highlighted
      });
    }
  }

  for (const entry of lineEntries) {
    const alpha = entry.highlighted ? floor(180 + 60 * sin(pulseAngle * 2)) : 90;
    const weight = entry.highlighted ? 3.5 + 1.2 * sin(pulseAngle * 2) : 1.4;

    stroke(red(entry.color), green(entry.color), blue(entry.color), alpha);
    strokeWeight(weight);
    line(entry.from.x, entry.from.y, entry.to.x, entry.to.y);
  }
}

function drawNodeGroup(nodes) {
  for (const node of nodes) {
    const connectedHighlight = isNodeHighlighted(node.id);

    let nodeScale = 1;
    if (connectedHighlight) {
      nodeScale = 1 + 0.03 * sin(pulseAngle * 2);
    }

    const w = node.w * nodeScale;
    const h = node.h * nodeScale;

    stroke('#334155');
    strokeWeight(connectedHighlight ? 2.6 : 1.2);

    if (connectedHighlight) {
      fill(lerpColor(node.color, color(255), 0.2));
    } else {
      fill(node.color);
    }

    if (node.shape === 'rect') {
      rectMode(CENTER);
      rect(node.x, node.y, w, h, 12);
      rectMode(CORNER);
    } else {
      ellipse(node.x, node.y, w, h);
    }

    noStroke();
    fill('#111827');
    textAlign(CENTER, CENTER);

    if (node.kind === 'collection') {
      textSize(compactLayout ? 15 : 17);
      textStyle(BOLD);
    } else if (node.kind === 'operation') {
      textSize(compactLayout ? 11 : 13);
      textStyle(NORMAL);
    } else {
      textSize(compactLayout ? 12 : 14);
      textStyle(NORMAL);
    }

    text(node.label, node.x, node.y);
    textStyle(NORMAL);
  }
}

function drawControlPanel() {
  noStroke();
  fill('#334155');
  textAlign(LEFT, TOP);
  textSize(14);
  text('Hover nodes to reveal shared relationships. Click collection nodes for code examples.', 12, drawHeight + 6, canvasWidth - 24, 18);

  fill('#64748b');
  textSize(13);
  text('Pattern: immutable collections (tuple, frozenset) can be dictionary keys.', 12, drawHeight + 25, canvasWidth - 24, 18);
}

function drawCodeTooltip(collectionId) {
  const lines = collectionExamples[collectionId];
  if (!lines) {
    return;
  }

  const tooltipW = min(compactLayout ? 280 : 340, canvasWidth * 0.45);
  const tooltipH = 114;
  const x = canvasWidth - tooltipW - 14;
  const y = 62;

  fill(15, 23, 42, 245);
  stroke('#334155');
  strokeWeight(1);
  rect(x, y, tooltipW, tooltipH, 9);

  noStroke();
  fill('#e2e8f0');
  textAlign(LEFT, TOP);
  textSize(13);
  text('Code Example: ' + formatCollectionName(collectionId), x + 10, y + 8);

  fill('#93c5fd');
  textSize(12);
  text('click outside collection nodes to close', x + 10, y + 26);

  fill('#f8fafc');
  textSize(13);
  textFont('monospace');

  let lineY = y + 47;
  for (const lineText of lines) {
    text(lineText, x + 10, lineY);
    lineY += 18;
  }

  textFont('Arial, Helvetica, sans-serif');
}

function updateNodeLayout() {
  compactLayout = canvasWidth < 860;
  const centerX = canvasWidth * 0.5;
  const rowTop = compactLayout ? 102 : 110;
  const rowGap = compactLayout ? 76 : 86;

  const leftX = max(72, canvasWidth * 0.18);
  const rightX = min(canvasWidth - 72, canvasWidth * 0.82);
  const collectionW = compactLayout ? 114 : 132;
  const collectionH = compactLayout ? 48 : 54;
  const propertyW = compactLayout ? 104 : 122;
  const propertyH = compactLayout ? 38 : 42;

  const duplicatesLabel = compactLayout ? 'Allows\nDuplicates' : 'Allows Duplicates';
  const uniqueLabel = compactLayout ? 'Unique\nElements' : 'Unique Elements';
  const dictKeyLabel = compactLayout ? 'Can Be\nDict Key' : 'Can Be Dict Key';
  const symDiffLabel = compactLayout ? 'Symmetric\nDiff' : 'Symmetric Diff';

  collectionNodes = [
    makeNode('list', 'List', 'collection', centerX, rowTop, collectionW, collectionH, '#bfdbfe', 'rect', []),
    makeNode('tuple', 'Tuple', 'collection', centerX, rowTop + rowGap, collectionW, collectionH, '#fde68a', 'rect', []),
    makeNode('set', 'Set', 'collection', centerX, rowTop + rowGap * 2, collectionW, collectionH, '#bbf7d0', 'rect', []),
    makeNode('frozenset', 'Frozenset', 'collection', centerX, rowTop + rowGap * 3, collectionW, collectionH, '#ddd6fe', 'rect', [])
  ];

  propertyNodes = [
    makeNode('ordered', 'Ordered', 'property', leftX, rowTop + 8, propertyW, propertyH, '#dbeafe', 'oval', ['list', 'tuple']),
    makeNode('mutable', 'Mutable', 'property', leftX, rowTop + rowGap + 8, propertyW, propertyH, '#dcfce7', 'oval', ['list', 'set']),
    makeNode('duplicates', duplicatesLabel, 'property', leftX, rowTop + rowGap * 2 + 8, compactLayout ? 110 : 150, propertyH, '#fef3c7', 'oval', ['list', 'tuple']),

    makeNode('unordered', 'Unordered', 'property', rightX, rowTop + 8, propertyW, propertyH, '#ffedd5', 'oval', ['set', 'frozenset']),
    makeNode('immutable', 'Immutable', 'property', rightX, rowTop + rowGap + 8, propertyW, propertyH, '#f3e8ff', 'oval', ['tuple', 'frozenset']),
    makeNode('unique', uniqueLabel, 'property', rightX, rowTop + rowGap * 2 + 8, compactLayout ? 108 : 142, propertyH, '#ccfbf1', 'oval', ['set', 'frozenset']),
    makeNode('dictkey', dictKeyLabel, 'property', rightX, rowTop + rowGap * 3 + 8, compactLayout ? 112 : 150, propertyH, '#fee2e2', 'oval', ['tuple', 'frozenset'])
  ];

  operationNodes = [
    makeNode('union', 'Union', 'operation', rightX, drawHeight - 160, compactLayout ? 82 : 92, compactLayout ? 32 : 36, '#e2e8f0', 'oval', ['set', 'frozenset']),
    makeNode('intersection', 'Intersection', 'operation', rightX, drawHeight - 126, compactLayout ? 102 : 116, compactLayout ? 32 : 36, '#e2e8f0', 'oval', ['set', 'frozenset']),
    makeNode('difference', 'Difference', 'operation', rightX, drawHeight - 92, compactLayout ? 96 : 108, compactLayout ? 32 : 36, '#e2e8f0', 'oval', ['set', 'frozenset']),
    makeNode('symdiff', symDiffLabel, 'operation', rightX, drawHeight - 58, compactLayout ? 104 : 130, compactLayout ? 32 : 36, '#e2e8f0', 'oval', ['set', 'frozenset'])
  ];

  for (const node of propertyNodes) {
    node.lineColor = colorForProperty(node.id);
  }
  for (const node of operationNodes) {
    node.lineColor = color(propertyColors.operation);
  }

  allNodes = [...collectionNodes, ...propertyNodes, ...operationNodes];
}

function makeNode(id, label, kind, x, y, w, h, fillColor, shape, links) {
  return {
    id,
    label,
    kind,
    x,
    y,
    w,
    h,
    color: color(fillColor),
    shape,
    links,
    lineColor: color('#64748b')
  };
}

function colorForProperty(propertyId) {
  if (propertyId === 'ordered') return color(propertyColors.ordered);
  if (propertyId === 'unordered') return color(propertyColors.unordered);
  if (propertyId === 'mutable') return color(propertyColors.mutable);
  if (propertyId === 'immutable') return color(propertyColors.immutable);
  if (propertyId === 'duplicates') return color(propertyColors.duplicates);
  if (propertyId === 'unique') return color(propertyColors.unique);
  if (propertyId === 'dictkey') return color(propertyColors.dictkey);
  return color('#64748b');
}

function updateHoverState() {
  hoveredNodeId = null;

  for (const node of allNodes) {
    if (isMouseInsideNode(node)) {
      hoveredNodeId = node.id;
      break;
    }
  }
}

function isMouseInsideNode(node) {
  if (node.shape === 'rect') {
    return mouseX >= node.x - node.w / 2
      && mouseX <= node.x + node.w / 2
      && mouseY >= node.y - node.h / 2
      && mouseY <= node.y + node.h / 2;
  }

  const nx = (mouseX - node.x) / (node.w / 2);
  const ny = (mouseY - node.y) / (node.h / 2);
  return nx * nx + ny * ny <= 1;
}

function isConnectionHighlighted(nodeAId, nodeBId) {
  if (!hoveredNodeId) {
    return false;
  }

  if (hoveredNodeId === nodeAId || hoveredNodeId === nodeBId) {
    return true;
  }

  const hovered = findNode(hoveredNodeId);
  if (!hovered) {
    return false;
  }

  if (hovered.kind === 'collection') {
    return isLinked(hovered.id, nodeAId) || isLinked(hovered.id, nodeBId);
  }

  return hovered.links.includes(nodeAId) || hovered.links.includes(nodeBId);
}

function isNodeHighlighted(nodeId) {
  if (!hoveredNodeId) {
    return false;
  }

  if (nodeId === hoveredNodeId) {
    return true;
  }

  const hovered = findNode(hoveredNodeId);
  if (!hovered) {
    return false;
  }

  if (hovered.kind === 'collection') {
    return isLinked(hovered.id, nodeId);
  }

  return hovered.links.includes(nodeId);
}

function isLinked(collectionId, nodeId) {
  const node = findNode(nodeId);
  if (!node || !node.links) {
    return false;
  }
  return node.links.includes(collectionId);
}

function findNode(id) {
  for (const node of allNodes) {
    if (node.id === id) {
      return node;
    }
  }
  return null;
}

function formatCollectionName(collectionId) {
  if (collectionId === 'list') return 'List';
  if (collectionId === 'tuple') return 'Tuple';
  if (collectionId === 'set') return 'Set';
  if (collectionId === 'frozenset') return 'Frozenset';
  return collectionId;
}

function mousePressed() {
  let clickedCollection = null;
  for (const node of collectionNodes) {
    if (isMouseInsideNode(node)) {
      clickedCollection = node.id;
      break;
    }
  }

  if (clickedCollection) {
    selectedCollectionId = clickedCollection;
  } else {
    selectedCollectionId = null;
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = max(360, container.offsetWidth);
  }
}
