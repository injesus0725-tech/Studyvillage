const titleScreen = document.querySelector('#title-screen');
const gameScreen = document.querySelector('#game-screen');
const startButton = document.querySelector('#start-button');
const world = document.querySelector('#world');
const player = document.querySelector('#player');
const npc = document.querySelector('#guide-npc');
const quizHall = document.querySelector('#quiz-hall');
const interactionHint = document.querySelector('#interaction-hint');
const dialogue = document.querySelector('#dialogue');
const dialogueName = document.querySelector('#dialogue-name');
const dialogueText = document.querySelector('#dialogue-text');
const dialogueNext = document.querySelector('#dialogue-next');
const talkButton = document.querySelector('#talk-button');
const quizPanel = document.querySelector('#quiz-panel');
const quizClose = document.querySelector('#quiz-close');
const quizProgress = document.querySelector('#quiz-progress');
const quizScore = document.querySelector('#quiz-score');
const quizQuestion = document.querySelector('#quiz-question');
const quizOptions = document.querySelector('#quiz-options');
const quizFeedback = document.querySelector('#quiz-feedback');
const quizNext = document.querySelector('#quiz-next');

const state = {
  x: 50,
  y: 68,
  speed: 0.48,
  keys: new Set(),
  running: false,
  dialogueOpen: false,
  dialogueIndex: 0,
  quizOpen: false,
  quizIndex: 0,
  quizScore: 0,
  quizAnswered: false
};

const dialogueLines = [
  '안녕! 우리 학습마을에 온 걸 환영해.',
  '마을 곳곳에는 배움터와 책마루, 그리고 도전관이 있단다.',
  '도전관에 가까이 가면 문제를 풀고 점수도 얻을 수 있어!',
  '우선 마을을 천천히 둘러보렴. 다음에 또 이야기하자!'
];

const quizQuestions = [
  {
    question: '먹을수록 커지고, 물을 마시면 죽는 것은?',
    options: ['불', '구름', '나무', '그림자'],
    answer: 0,
    explanation: '정답은 불! 불은 연료를 먹으며 커지고 물을 만나면 꺼져요.'
  },
  {
    question: '항상 내 앞에 있지만 볼 수 없는 것은?',
    options: ['뒤통수', '미래', '거울', '발자국'],
    answer: 1,
    explanation: '정답은 미래! 미래는 늘 앞에 있지만 아직 볼 수 없어요.'
  },
  {
    question: '다리는 네 개인데 걷지 못하는 것은?',
    options: ['의자', '강아지', '말', '고양이'],
    answer: 0,
    explanation: '정답은 의자! 다리가 네 개지만 스스로 걷지는 못해요.'
  }
];

const movementKeys = new Set([
  'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
  'w', 'a', 's', 'd', 'W', 'A', 'S', 'D'
]);

startButton.addEventListener('click', () => {
  titleScreen.classList.remove('active');
  gameScreen.classList.add('active');
  state.running = true;
  requestAnimationFrame(gameLoop);
});

window.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    event.preventDefault();
    handleInteraction();
    return;
  }

  if (event.key === 'Escape') {
    if (state.quizOpen) closeQuiz();
    else if (state.dialogueOpen) closeDialogue();
    return;
  }

  if (movementKeys.has(event.key) && !state.dialogueOpen && !state.quizOpen) {
    event.preventDefault();
    state.keys.add(event.key.toLowerCase());
  }
});

window.addEventListener('keyup', (event) => {
  state.keys.delete(event.key.toLowerCase());
});

window.addEventListener('blur', () => state.keys.clear());

document.querySelectorAll('.mobile-controls button[data-key]').forEach((button) => {
  const key = button.dataset.key.toLowerCase();
  const press = (event) => {
    event.preventDefault();
    if (!state.dialogueOpen && !state.quizOpen) state.keys.add(key);
  };
  const release = (event) => {
    event.preventDefault();
    state.keys.delete(key);
  };

  button.addEventListener('pointerdown', press);
  button.addEventListener('pointerup', release);
  button.addEventListener('pointercancel', release);
  button.addEventListener('pointerleave', release);
});

talkButton.addEventListener('click', handleInteraction);
dialogueNext.addEventListener('click', advanceDialogue);
quizClose.addEventListener('click', closeQuiz);
quizNext.addEventListener('click', advanceQuiz);

function getObstacleRects() {
  const worldRect = world.getBoundingClientRect();
  return [...world.querySelectorAll('.obstacle')].map((element) => {
    const rect = element.getBoundingClientRect();
    return {
      element,
      left: rect.left - worldRect.left,
      right: rect.right - worldRect.left,
      top: rect.top - worldRect.top,
      bottom: rect.bottom - worldRect.top
    };
  });
}

function playerWouldCollide(nextX, nextY) {
  const worldRect = world.getBoundingClientRect();
  const playerRect = player.getBoundingClientRect();
  const halfWidth = playerRect.width / 2;
  const halfHeight = playerRect.height / 2;
  const centerX = worldRect.width * (nextX / 100);
  const centerY = worldRect.height * (nextY / 100);

  const candidate = {
    left: centerX - halfWidth,
    right: centerX + halfWidth,
    top: centerY - halfHeight,
    bottom: centerY + halfHeight
  };

  return getObstacleRects().some((obstacle) => {
    const padding = 5;
    return !(
      candidate.right < obstacle.left + padding ||
      candidate.left > obstacle.right - padding ||
      candidate.bottom < obstacle.top + padding ||
      candidate.top > obstacle.bottom - padding
    );
  });
}

function tryMove(dx, dy) {
  const nextX = Math.max(3, Math.min(97, state.x + dx * state.speed));
  const nextY = Math.max(5, Math.min(95, state.y + dy * state.speed));

  if (!playerWouldCollide(nextX, state.y)) state.x = nextX;
  if (!playerWouldCollide(state.x, nextY)) state.y = nextY;
}

function updatePlayer() {
  if (state.dialogueOpen || state.quizOpen) return;

  let dx = 0;
  let dy = 0;

  if (state.keys.has('arrowleft') || state.keys.has('a')) dx -= 1;
  if (state.keys.has('arrowright') || state.keys.has('d')) dx += 1;
  if (state.keys.has('arrowup') || state.keys.has('w')) dy -= 1;
  if (state.keys.has('arrowdown') || state.keys.has('s')) dy += 1;

  if (dx && dy) {
    dx *= Math.SQRT1_2;
    dy *= Math.SQRT1_2;
  }

  tryMove(dx, dy);
  player.style.left = `${state.x}%`;
  player.style.top = `${state.y}%`;
}

function distanceTo(element) {
  if (!element) return Infinity;
  const p = player.getBoundingClientRect();
  const e = element.getBoundingClientRect();
  const px = p.left + p.width / 2;
  const py = p.top + p.height / 2;
  const ex = e.left + e.width / 2;
  const ey = e.top + e.height / 2;
  return Math.hypot(px - ex, py - ey);
}

function isNearNpc() {
  return distanceTo(npc) < 135;
}

function isNearQuizHall() {
  return distanceTo(quizHall) < 170;
}

function updateInteractionHint() {
  if (state.dialogueOpen || state.quizOpen) {
    interactionHint.classList.remove('visible');
    talkButton.classList.remove('ready');
    return;
  }

  if (isNearNpc()) {
    interactionHint.textContent = 'Space 키로 도우미 선생님과 이야기하기';
    interactionHint.classList.add('visible');
    talkButton.classList.add('ready');
    return;
  }

  if (isNearQuizHall()) {
    interactionHint.textContent = 'Space 키로 도전관 퀴즈 시작하기';
    interactionHint.classList.add('visible');
    talkButton.classList.add('ready');
    return;
  }

  interactionHint.classList.remove('visible');
  talkButton.classList.remove('ready');
}

function handleInteraction() {
  if (state.quizOpen) return;

  if (state.dialogueOpen) {
    advanceDialogue();
    return;
  }

  if (isNearNpc()) {
    openDialogue();
    return;
  }

  if (isNearQuizHall()) openQuiz();
}

function openDialogue() {
  state.dialogueOpen = true;
  state.keys.clear();
  state.dialogueIndex = 0;
  dialogueName.textContent = npc.dataset.name || '도우미 선생님';
  dialogueText.textContent = dialogueLines[0];
  dialogue.hidden = false;
  interactionHint.classList.remove('visible');
}

function advanceDialogue() {
  if (!state.dialogueOpen) return;
  state.dialogueIndex += 1;

  if (state.dialogueIndex >= dialogueLines.length) {
    closeDialogue();
    return;
  }

  dialogueText.textContent = dialogueLines[state.dialogueIndex];
  dialogueNext.textContent = state.dialogueIndex === dialogueLines.length - 1 ? '닫기 ✓' : '다음 ▶';
}

function closeDialogue() {
  state.dialogueOpen = false;
  dialogue.hidden = true;
  dialogueNext.textContent = '다음 ▶';
}

function openQuiz() {
  state.quizOpen = true;
  state.quizIndex = 0;
  state.quizScore = 0;
  state.quizAnswered = false;
  state.keys.clear();
  quizPanel.hidden = false;
  renderQuizQuestion();
}

function renderQuizQuestion() {
  const item = quizQuestions[state.quizIndex];
  state.quizAnswered = false;
  quizProgress.textContent = `${state.quizIndex + 1} / ${quizQuestions.length}`;
  quizScore.textContent = `점수 ${state.quizScore}`;
  quizQuestion.textContent = item.question;
  quizFeedback.textContent = '';
  quizFeedback.className = 'quiz-feedback';
  quizNext.hidden = true;
  quizOptions.innerHTML = '';

  item.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'quiz-option';
    button.textContent = `${index + 1}. ${option}`;
    button.addEventListener('click', () => answerQuiz(index));
    quizOptions.appendChild(button);
  });
}

function answerQuiz(selectedIndex) {
  if (state.quizAnswered) return;
  state.quizAnswered = true;
  const item = quizQuestions[state.quizIndex];
  const buttons = [...quizOptions.querySelectorAll('.quiz-option')];

  buttons.forEach((button, index) => {
    button.disabled = true;
    if (index === item.answer) button.classList.add('correct');
    if (index === selectedIndex && index !== item.answer) button.classList.add('wrong');
  });

  if (selectedIndex === item.answer) {
    state.quizScore += 100;
    quizFeedback.textContent = `정답! 🎉 ${item.explanation}`;
    quizFeedback.classList.add('success');
  } else {
    quizFeedback.textContent = `아쉬워요! ${item.explanation}`;
    quizFeedback.classList.add('error');
  }

  quizScore.textContent = `점수 ${state.quizScore}`;
  quizNext.hidden = false;
  quizNext.textContent = state.quizIndex === quizQuestions.length - 1 ? '결과 보기 🏆' : '다음 문제 ▶';
}

function advanceQuiz() {
  if (!state.quizAnswered) return;

  if (state.quizIndex === quizQuestions.length - 1) {
    renderQuizResult();
    return;
  }

  state.quizIndex += 1;
  renderQuizQuestion();
}

function renderQuizResult() {
  quizProgress.textContent = '완료';
  quizScore.textContent = `최종 ${state.quizScore}점`;
  quizQuestion.textContent = `3문제 중 ${state.quizScore / 100}문제를 맞혔어요!`;
  quizOptions.innerHTML = '';
  quizFeedback.textContent = state.quizScore === 300
    ? '완벽해요! 도전관 수수께끼 마스터! 🏆'
    : state.quizScore >= 200
      ? '멋져요! 한 번만 더 도전하면 만점도 가능해요. ⭐'
      : '좋은 시작이에요! 다시 도전해 기록을 높여보세요. 🌱';
  quizFeedback.className = 'quiz-feedback success';
  quizNext.hidden = false;
  quizNext.textContent = '다시 도전하기 ↻';
  quizNext.onclick = () => {
    quizNext.onclick = null;
    state.quizIndex = 0;
    state.quizScore = 0;
    renderQuizQuestion();
  };
}

function closeQuiz() {
  state.quizOpen = false;
  quizPanel.hidden = true;
  quizNext.onclick = null;
}

function gameLoop() {
  if (!state.running) return;
  updatePlayer();
  updateInteractionHint();
  requestAnimationFrame(gameLoop);
}
