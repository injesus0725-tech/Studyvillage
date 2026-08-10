const titleScreen = document.querySelector('#title-screen');
const gameScreen = document.querySelector('#game-screen');
const startButton = document.querySelector('#start-button');
const world = document.querySelector('#world');
const player = document.querySelector('#player');
const npc = document.querySelector('#guide-npc');
const interactionHint = document.querySelector('#interaction-hint');
const dialogue = document.querySelector('#dialogue');
const dialogueName = document.querySelector('#dialogue-name');
const dialogueText = document.querySelector('#dialogue-text');
const dialogueNext = document.querySelector('#dialogue-next');
const talkButton = document.querySelector('#talk-button');

const state = {
  x: 50,
  y: 68,
  speed: 0.48,
  keys: new Set(),
  running: false,
  dialogueOpen: false,
  dialogueIndex: 0
};

const dialogueLines = [
  '안녕! 우리 학습마을에 온 걸 환영해.',
  '마을 곳곳에는 배움터와 책마루, 그리고 도전관이 있단다.',
  '앞으로 도전관에서는 문제를 풀고 점수도 얻을 수 있게 될 거야!',
  '우선 마을을 천천히 둘러보렴. 다음에 또 이야기하자!'
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

  if (movementKeys.has(event.key) && !state.dialogueOpen) {
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
    if (!state.dialogueOpen) state.keys.add(key);
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
  if (state.dialogueOpen) return;

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

function isNearNpc() {
  if (!npc) return false;
  const p = player.getBoundingClientRect();
  const n = npc.getBoundingClientRect();
  const px = p.left + p.width / 2;
  const py = p.top + p.height / 2;
  const nx = n.left + n.width / 2;
  const ny = n.top + n.height / 2;
  return Math.hypot(px - nx, py - ny) < 135;
}

function updateInteractionHint() {
  const nearby = isNearNpc() && !state.dialogueOpen;
  interactionHint.classList.toggle('visible', nearby);
  talkButton.classList.toggle('ready', nearby);
}

function handleInteraction() {
  if (state.dialogueOpen) {
    advanceDialogue();
    return;
  }

  if (isNearNpc()) openDialogue();
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

function gameLoop() {
  if (!state.running) return;
  updatePlayer();
  updateInteractionHint();
  requestAnimationFrame(gameLoop);
}
