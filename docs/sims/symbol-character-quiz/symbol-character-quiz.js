// Symbol Character Quiz MicroSim
// Bloom Level: Apply (L3) - Students identify symbols by name
// A quiz where students click the correct symbol given its name.

let canvasWidth = 400;
let drawHeight = 460;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;

// Symbol codes (all printable ASCII symbols, no letters/digits/space)
let symbolCodes = [
    33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47,
    58, 59, 60, 61, 62, 63, 64,
    91, 92, 93, 94, 95, 96,
    123, 124, 125, 126
];

// Symbol names dictionary
let symbolNames = {
    33: 'Exclamation Mark',
    34: 'Double Quote',
    35: 'Hash / Number Sign',
    36: 'Dollar Sign',
    37: 'Percent Sign',
    38: 'Ampersand',
    39: 'Single Quote',
    40: 'Left Parenthesis',
    41: 'Right Parenthesis',
    42: 'Asterisk',
    43: 'Plus Sign',
    44: 'Comma',
    45: 'Hyphen / Minus',
    46: 'Period',
    47: 'Forward Slash',
    58: 'Colon',
    59: 'Semicolon',
    60: 'Less-Than Sign',
    61: 'Equals Sign',
    62: 'Greater-Than Sign',
    63: 'Question Mark',
    64: 'At Sign',
    91: 'Left Square Bracket',
    92: 'Backslash',
    93: 'Right Square Bracket',
    94: 'Caret',
    95: 'Underscore',
    96: 'Backtick',
    123: 'Left Curly Brace',
    124: 'Pipe',
    125: 'Right Curly Brace',
    126: 'Tilde'
};

// Grid layout: 8 columns x 4 rows = 32 cells for 31 symbols
let gridCols = 8;
let gridRows = 4;

// Grid positioning
let gridX, gridY, gridW, gridH, cellW, cellH;

// Quiz state
let quizActive = false;
let quizQuestions = [];   // shuffled list of codes to ask
let currentQuestion = 0;
let score = 0;
let feedbackMsg = '';
let feedbackColor;
let feedbackTimer = 0;
let quizComplete = false;

// UI controls
let startButton;
let numQuestionsSlider;
let sliderLabel;

// Celebration particles
let confettiParticles = [];
let celebrationActive = false;

// Colors
let symbolColor;
let hoverColor;

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(document.querySelector('main'));

    textFont('Arial');

    symbolColor = color(210, 180, 240);  // light purple
    hoverColor = color(230, 210, 255);   // lighter purple

    // Slider for number of questions
    sliderLabel = createSpan('Questions: 6');
    sliderLabel.style('font-size', '14px');
    sliderLabel.style('font-family', 'Arial, Helvetica, sans-serif');
    sliderLabel.position(10, drawHeight + 15);
    sliderLabel.parent(document.querySelector('main'));

    numQuestionsSlider = createSlider(1, symbolCodes.length, 6, 1);
    numQuestionsSlider.position(120, drawHeight + 15);
    numQuestionsSlider.style('width', '120px');
    numQuestionsSlider.parent(document.querySelector('main'));

    // Start Quiz button
    startButton = createButton('Start Quiz');
    startButton.position(260, drawHeight + 12);
    startButton.style('font-size', '14px');
    startButton.style('padding', '4px 16px');
    startButton.mousePressed(startQuiz);
    startButton.parent(document.querySelector('main'));

    describe('Interactive symbol character quiz. Click the correct symbol when given its name.');
}

function draw() {
    // Draw area background
    fill('aliceblue');
    stroke('silver');
    rect(0, 0, canvasWidth, drawHeight);

    // Control area background
    fill('white');
    stroke('silver');
    rect(0, drawHeight, canvasWidth, controlHeight);

    // Update slider label
    sliderLabel.html('Questions: ' + numQuestionsSlider.value());

    // Calculate grid dimensions
    let titleH = 30;
    let topPad = margin + titleH + 4;
    gridX = margin;
    gridY = topPad;
    gridW = canvasWidth - margin * 2;
    gridH = 280;
    cellW = gridW / gridCols;
    cellH = gridH / gridRows;

    // Title
    noStroke();
    fill(30);
    textSize(18);
    textAlign(CENTER, TOP);
    text('Symbol Character Quiz', canvasWidth / 2, margin - 4);

    // Draw grid cells
    for (let i = 0; i < symbolCodes.length; i++) {
        let code = symbolCodes[i];
        let col = i % gridCols;
        let r = Math.floor(i / gridCols);
        let cx = gridX + col * cellW;
        let cy = gridY + r * cellH;

        // Check hover
        let isHovered = (mouseX >= cx && mouseX < cx + cellW &&
                         mouseY >= cy && mouseY < cy + cellH);

        // Draw cell background
        stroke(180);
        strokeWeight(0.5);
        if (isHovered && quizActive && !quizComplete) {
            fill(hoverColor);
            strokeWeight(2);
            stroke(80);
            cursor(HAND);
        } else {
            fill(symbolColor);
        }
        rect(cx, cy, cellW, cellH, 3);

        // Draw character
        noStroke();
        fill(30);
        textSize(constrain(cellW * 0.5, 14, 22));
        textAlign(CENTER, CENTER);
        text(String.fromCharCode(code), cx + cellW / 2, cy + cellH / 2);
    }

    // Quiz status area (below the grid)
    let statusY = gridY + gridH + 20;

    noStroke();
    fill(30);
    textAlign(CENTER, TOP);

    if (!quizActive && !quizComplete) {
        // Idle state
        textSize(16);
        fill(100);
        text('Set the number of questions and click "Start Quiz"', canvasWidth / 2, statusY);
    } else if (quizActive && !quizComplete) {
        // Show current question
        let code = quizQuestions[currentQuestion];
        let name = symbolNames[code];

        // Score display
        textSize(14);
        fill(80);
        textAlign(LEFT, TOP);
        text('Score: ' + score + ' / ' + quizQuestions.length, margin, statusY);
        textAlign(RIGHT, TOP);
        text('Question ' + (currentQuestion + 1) + ' of ' + quizQuestions.length, canvasWidth - margin, statusY);

        // Question prompt
        textAlign(CENTER, TOP);
        textSize(20);
        fill(30);
        text('Click the: ' + name, canvasWidth / 2, statusY + 30);

        // Feedback message
        if (feedbackMsg !== '' && feedbackTimer > 0) {
            textSize(18);
            fill(feedbackColor);
            text(feedbackMsg, canvasWidth / 2, statusY + 65);
            feedbackTimer--;
        }
    } else if (quizComplete && !celebrationActive) {
        // Quiz finished, no celebration (all particles faded)
        textSize(20);
        fill(30);
        text('Quiz Complete!', canvasWidth / 2, statusY);
        textSize(16);
        fill(80);
        text('Score: ' + score + ' / ' + quizQuestions.length, canvasWidth / 2, statusY + 30);
        textSize(14);
        fill(100);
        text('Change settings and click "Start Quiz" to play again.', canvasWidth / 2, statusY + 60);
    }

    // Draw celebration on top of everything
    if (celebrationActive) {
        updateAndDrawConfetti();

        // Show score during celebration
        let celebY = gridY + gridH + 20;
        noStroke();
        textAlign(CENTER, TOP);
        textSize(24);
        fill(30);
        text('Congratulations!', canvasWidth / 2, celebY);
        textSize(18);
        fill(80);
        text('Score: ' + score + ' / ' + quizQuestions.length, canvasWidth / 2, celebY + 32);

        if (!isConfettiActive()) {
            celebrationActive = false;
        }
    }
}

function startQuiz() {
    // Shuffle symbol codes and pick the requested number
    let shuffled = shuffle([...symbolCodes]);
    let numQ = numQuestionsSlider.value();
    quizQuestions = shuffled.slice(0, numQ);
    currentQuestion = 0;
    score = 0;
    feedbackMsg = '';
    feedbackTimer = 0;
    quizActive = true;
    quizComplete = false;
    celebrationActive = false;
    confettiParticles = [];
}

function mousePressed() {
    if (!quizActive || quizComplete) return;

    // Check if click is on a grid cell
    for (let i = 0; i < symbolCodes.length; i++) {
        let code = symbolCodes[i];
        let col = i % gridCols;
        let r = Math.floor(i / gridCols);
        let cx = gridX + col * cellW;
        let cy = gridY + r * cellH;

        if (mouseX >= cx && mouseX < cx + cellW &&
            mouseY >= cy && mouseY < cy + cellH) {

            let correctCode = quizQuestions[currentQuestion];

            if (code === correctCode) {
                // Correct answer
                score++;
                feedbackMsg = 'Correct!';
                feedbackColor = color(0, 150, 50);
                feedbackTimer = 40;

                currentQuestion++;
                if (currentQuestion >= quizQuestions.length) {
                    // Quiz finished
                    quizComplete = true;
                    quizActive = false;
                    createConfetti(canvasWidth / 2, drawHeight / 2, 1.0);
                    celebrationActive = true;
                }
            } else {
                // Wrong answer
                feedbackMsg = 'Try again!';
                feedbackColor = color(200, 50, 50);
                feedbackTimer = 40;
            }
            break;
        }
    }
}

// ---- Celebration Confetti System ----

function createConfetti(originX, originY, speedMultiplier) {
    confettiParticles = [];
    let colors = [
        [255, 100, 100], [100, 200, 255], [255, 220, 80],
        [100, 255, 150], [220, 130, 255], [255, 160, 80],
        [100, 180, 255], [255, 100, 200]
    ];

    for (let i = 0; i < 150; i++) {
        let angle = random(TWO_PI);
        let speed = random(2, 8) * speedMultiplier;
        let c = random(colors);
        confettiParticles.push({
            x: originX + random(-20, 20),
            y: originY + random(-20, 20),
            vx: cos(angle) * speed,
            vy: sin(angle) * speed - random(2, 5),
            size: random(6, 14),
            color: c,
            alpha: 255,
            fadeRate: random(1.0, 2.5),
            rotation: random(TWO_PI),
            rotSpeed: random(-0.15, 0.15),
            gravity: 0.12,
            wobble: random(0.02, 0.08),
            wobbleOffset: random(TWO_PI)
        });
    }
}

function updateAndDrawConfetti() {
    for (let i = confettiParticles.length - 1; i >= 0; i--) {
        let p = confettiParticles[i];

        // Update physics
        p.vy += p.gravity;
        p.x += p.vx + sin(frameCount * p.wobble + p.wobbleOffset) * 0.5;
        p.y += p.vy;
        p.rotation += p.rotSpeed;
        p.alpha -= p.fadeRate;

        // Draw confetti rectangle
        if (p.alpha > 0) {
            push();
            translate(p.x, p.y);
            rotate(p.rotation);
            noStroke();
            fill(p.color[0], p.color[1], p.color[2], p.alpha);
            rectMode(CENTER);
            rect(0, 0, p.size, p.size * 0.5, 1);
            pop();
        }

        // Remove faded particles
        if (p.alpha <= 0) {
            confettiParticles.splice(i, 1);
        }
    }
}

function isConfettiActive() {
    return confettiParticles.length > 0;
}

// ---- Resize handling ----

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);

    if (sliderLabel) sliderLabel.position(10, drawHeight + 15);
    if (numQuestionsSlider) numQuestionsSlider.position(120, drawHeight + 15);
    if (startButton) startButton.position(260, drawHeight + 12);
}

function updateCanvasSize() {
    let mainEl = document.querySelector('main');
    if (mainEl) {
        let containerW = mainEl.clientWidth;
        if (containerW > 0) {
            canvasWidth = containerW;
        }
    }
    canvasHeight = drawHeight + controlHeight;
}
