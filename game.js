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

startButton.addEventListener('click', () => {
  titleScreen.classList.remove('active');
  gameScreen.classList.add('active');
  state.running = true;
  requestAnimationFrame(gameLoop);
});

const movementKeys = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', 'W', 'A', 'S', 'D']);

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
  const press = (event) => { event.preventDefault(); state.keys.add(key); };
  const release = (event) => { event.preventDefault(); state.keys.delete(key); };
  button.addEventListener('pointerdown', press);
  button.addEventListener('pointerup', release);
  button.addEventListener('pointercancel', release);
  button.addEventListener('pointerleave', release);
});

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

  state.x = Math.max(3, Math.min(97, state.x + dx * state.speed));
  state.y = Math.max(5, Math.min(95, state.y + dy * state.speed));

  player.style.left = `${state.x}%`;
  player.style.top = `${state.y}%`;
}

function gameLoop() {
  if (!state.running) return;
  updatePlayer();
  requestAnimationFrame(gameLoop);
}
