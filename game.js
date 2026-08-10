const titleScreen = document.querySelector('#title-screen');
const gameScreen = document.querySelector('#game-screen');
const startButton = document.querySelector('#start-button');
const world = document.querySelector('#world');
const player = document.querySelector('#player');

const state = {
  x: 50,
  y: 68,
  speed: 0.48,
  keys: new Set(),
  running: false
};

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
  if (movementKeys.has(event.key)) {
    event.preventDefault();
    state.keys.add(event.key.toLowerCase());
  }
});

window.addEventListener('keyup', (event) => {
  state.keys.delete(event.key.toLowerCase());
});

window.addEventListener('blur', () => state.keys.clear());

document.querySelectorAll('.mobile-controls button').forEach((button) => {
  const key = button.dataset.key.toLowerCase();
  const press = (event) => {
    event.preventDefault();
    state.keys.add(key);
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

function getObstacleRects() {
  return [...world.querySelectorAll('.obstacle')].map((element) => {
    const worldRect = world.getBoundingClientRect();
    const rect = element.getBoundingClientRect();

    return {
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

  if (!playerWouldCollide(nextX, state.y)) {
    state.x = nextX;
  }

  if (!playerWouldCollide(state.x, nextY)) {
    state.y = nextY;
  }
}

function updatePlayer() {
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

function gameLoop() {
  if (!state.running) return;
  updatePlayer();
  requestAnimationFrame(gameLoop);
}
