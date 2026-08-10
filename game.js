const titleScreen = document.querySelector('#title-screen');
const gameScreen = document.querySelector('#game-screen');
const startButton = document.querySelector('#start-button');
const nameInput = document.querySelector('#player-name');
const nameError = document.querySelector('#name-error');
const profileName = document.querySelector('#profile-name');
const profileScore = document.querySelector('#profile-score');
const playerLabel = document.querySelector('#player-label');
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
  x: 50, y: 68, speed: 0.48, keys: new Set(), running: false,
  playerName: '', totalScore: 0, attempts: 0, bestScore: 0, lastScore: 0,
  dialogueOpen: false, dialogueIndex: 0,
  quizOpen: false, quizIndex: 0, quizScore: 0, quizAnswered: false
};

const dialogueLines = [
  () => `${state.playerName}아, 우리 학습마을에 온 걸 환영해!`,
  () => '도전관에는 이제 수수께끼 10문제가 준비되어 있단다.',
  () => `지금까지 도전 횟수는 ${state.attempts}번, 최고 점수는 ${state.bestScore}점이야.`,
  () => '천천히 둘러보고 준비되면 도전해 보렴!'
];

const quizQuestions = [
  { question: '먹을수록 커지고, 물을 마시면 죽는 것은?', options: ['불','구름','나무','그림자'], answer: 0, explanation: '정답은 불! 불은 연료를 먹으며 커지고 물을 만나면 꺼져요.' },
  { question: '항상 내 앞에 있지만 볼 수 없는 것은?', options: ['뒤통수','미래','거울','발자국'], answer: 1, explanation: '정답은 미래! 미래는 늘 앞에 있지만 아직 볼 수 없어요.' },
  { question: '다리는 네 개인데 걷지 못하는 것은?', options: ['의자','강아지','말','고양이'], answer: 0, explanation: '정답은 의자! 다리가 네 개지만 스스로 걷지는 못해요.' },
  { question: '입은 있지만 말을 하지 못하고, 물은 마시지만 먹지는 못하는 것은?', options: ['강','컵','사람','물고기'], answer: 0, explanation: '정답은 강! 강에는 입구와 물길이 있지만 말을 하지는 못해요.' },
  { question: '아침에는 네 발, 낮에는 두 발, 저녁에는 세 발인 것은?', options: ['사람','고양이','새','나무'], answer: 0, explanation: '정답은 사람! 아기 때 기고, 어른이 되어 걷고, 노년에는 지팡이를 짚는다는 수수께끼예요.' },
  { question: '쓰면 쓸수록 작아지는 것은?', options: ['연필','공책','가방','책상'], answer: 0, explanation: '정답은 연필! 사용할수록 길이가 짧아져요.' },
  { question: '문은 문인데 열 수 없는 문은?', options: ['소문','현관문','창문','교문'], answer: 0, explanation: '정답은 소문! 이름에 문이 들어가지만 실제 문은 아니에요.' },
  { question: '세상에서 가장 뜨거운 과일은?', options: ['천도복숭아','사과','포도','수박'], answer: 0, explanation: '정답은 천도복숭아! 말장난 수수께끼예요.' },
  { question: '눈은 있는데 볼 수 없는 것은?', options: ['감자','사람','독수리','고양이'], answer: 0, explanation: '정답은 감자! 감자의 싹이 나는 부분을 눈이라고 부르기도 해요.' },
  { question: '깨뜨려야만 사용할 수 있는 것은?', options: ['달걀','유리컵','의자','연필'], answer: 0, explanation: '정답은 달걀! 껍데기를 깨야 요리에 사용할 수 있어요.' }
];

const movementKeys = new Set(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','a','s','d','W','A','S','D']);
nameInput.addEventListener('keydown', e => { if (e.key === 'Enter') startGame(); });
startButton.addEventListener('click', startGame);

function recordKey(name) { return `studyvillage-player:${name}`; }
function loadPlayerRecord(name) {
  try {
    const data = JSON.parse(localStorage.getItem(recordKey(name)) || '{}');
    state.totalScore = Number(data.totalScore) || 0;
    state.attempts = Number(data.attempts) || 0;
    state.bestScore = Number(data.bestScore) || 0;
    state.lastScore = Number(data.lastScore) || 0;
  } catch {
    state.totalScore = state.attempts = state.bestScore = state.lastScore = 0;
  }
}
function savePlayerRecord() {
  localStorage.setItem(recordKey(state.playerName), JSON.stringify({
    totalScore: state.totalScore,
    attempts: state.attempts,
    bestScore: state.bestScore,
    lastScore: state.lastScore,
    updatedAt: new Date().toISOString()
  }));
}
function startGame() {
  const cleanedName = nameInput.value.trim().replace(/\s+/g, ' ');
  if (!cleanedName) { nameError.textContent = '이름을 입력해야 마을에 들어갈 수 있어요.'; nameInput.focus(); return; }
  state.playerName = cleanedName.slice(0, 12);
  loadPlayerRecord(state.playerName);
  profileName.textContent = state.playerName;
  playerLabel.textContent = state.playerName;
  updateProfileScore();
  nameError.textContent = '';
  titleScreen.classList.remove('active'); gameScreen.classList.add('active');
  state.running = true; requestAnimationFrame(gameLoop);
}
function updateProfileScore() { profileScore.textContent = `${state.totalScore}점`; }

window.addEventListener('keydown', event => {
  if (!state.running) return;
  if (event.code === 'Space') { event.preventDefault(); handleInteraction(); return; }
  if (event.key === 'Escape') { if (state.quizOpen) closeQuiz(); else if (state.dialogueOpen) closeDialogue(); return; }
  if (movementKeys.has(event.key) && !state.dialogueOpen && !state.quizOpen) { event.preventDefault(); state.keys.add(event.key.toLowerCase()); }
});
window.addEventListener('keyup', event => state.keys.delete(event.key.toLowerCase()));
window.addEventListener('blur', () => state.keys.clear());
document.querySelectorAll('.mobile-controls button[data-key]').forEach(button => {
  const key = button.dataset.key.toLowerCase();
  const press = e => { e.preventDefault(); if (!state.dialogueOpen && !state.quizOpen) state.keys.add(key); };
  const release = e => { e.preventDefault(); state.keys.delete(key); };
  button.addEventListener('pointerdown', press); button.addEventListener('pointerup', release); button.addEventListener('pointercancel', release); button.addEventListener('pointerleave', release);
});
talkButton.addEventListener('click', handleInteraction); dialogueNext.addEventListener('click', advanceDialogue); quizClose.addEventListener('click', closeQuiz); quizNext.addEventListener('click', advanceQuiz);

function getObstacleRects() {
  const worldRect = world.getBoundingClientRect();
  return [...world.querySelectorAll('.obstacle')].map(element => { const rect = element.getBoundingClientRect(); return { left: rect.left-worldRect.left, right: rect.right-worldRect.left, top: rect.top-worldRect.top, bottom: rect.bottom-worldRect.top }; });
}
function playerWouldCollide(nextX,nextY) {
  const wr = world.getBoundingClientRect(), pr = player.getBoundingClientRect();
  const cx = wr.width*(nextX/100), cy = wr.height*(nextY/100);
  const c = { left: cx-pr.width/2, right: cx+pr.width/2, top: cy-pr.height/2, bottom: cy+pr.height/2 };
  return getObstacleRects().some(o => !(c.right < o.left+5 || c.left > o.right-5 || c.bottom < o.top+5 || c.top > o.bottom-5));
}
function tryMove(dx,dy) {
  const nx = Math.max(3,Math.min(97,state.x+dx*state.speed)), ny = Math.max(5,Math.min(95,state.y+dy*state.speed));
  if (!playerWouldCollide(nx,state.y)) state.x = nx; if (!playerWouldCollide(state.x,ny)) state.y = ny;
}
function updatePlayer() {
  if (state.dialogueOpen || state.quizOpen) return;
  let dx=0,dy=0; if (state.keys.has('arrowleft')||state.keys.has('a')) dx--; if (state.keys.has('arrowright')||state.keys.has('d')) dx++; if (state.keys.has('arrowup')||state.keys.has('w')) dy--; if (state.keys.has('arrowdown')||state.keys.has('s')) dy++;
  if (dx&&dy) { dx*=Math.SQRT1_2; dy*=Math.SQRT1_2; } tryMove(dx,dy); player.style.left=`${state.x}%`; player.style.top=`${state.y}%`;
}
function distanceTo(element) {
  if (!element) return Infinity; const p=player.getBoundingClientRect(), e=element.getBoundingClientRect(); return Math.hypot(p.left+p.width/2-(e.left+e.width/2), p.top+p.height/2-(e.top+e.height/2));
}
function isNearNpc(){return distanceTo(npc)<135;} function isNearQuizHall(){return distanceTo(quizHall)<170;}
function updateInteractionHint(){
  if(state.dialogueOpen||state.quizOpen){interactionHint.classList.remove('visible');talkButton.classList.remove('ready');return;}
  if(isNearNpc()){interactionHint.textContent='Space 키로 도우미 선생님과 이야기하기';interactionHint.classList.add('visible');talkButton.classList.add('ready');return;}
  if(isNearQuizHall()){interactionHint.textContent='Space 키로 수수께끼 10문제 시작하기';interactionHint.classList.add('visible');talkButton.classList.add('ready');return;}
  interactionHint.classList.remove('visible');talkButton.classList.remove('ready');
}
function handleInteraction(){if(state.quizOpen)return;if(state.dialogueOpen)return advanceDialogue();if(isNearNpc())return openDialogue();if(isNearQuizHall())openQuiz();}
function openDialogue(){state.dialogueOpen=true;state.keys.clear();state.dialogueIndex=0;dialogueName.textContent=npc.dataset.name||'도우미 선생님';dialogueText.textContent=dialogueLines[0]();dialogue.hidden=false;interactionHint.classList.remove('visible');}
function advanceDialogue(){if(!state.dialogueOpen)return;state.dialogueIndex++;if(state.dialogueIndex>=dialogueLines.length)return closeDialogue();dialogueText.textContent=dialogueLines[state.dialogueIndex]();dialogueNext.textContent=state.dialogueIndex===dialogueLines.length-1?'닫기 ✓':'다음 ▶';}
function closeDialogue(){state.dialogueOpen=false;dialogue.hidden=true;dialogueNext.textContent='다음 ▶';}

function openQuiz(){state.quizOpen=true;state.quizIndex=0;state.quizScore=0;state.quizAnswered=false;state.keys.clear();quizPanel.hidden=false;renderQuizQuestion();}
function renderQuizQuestion(){
  const item=quizQuestions[state.quizIndex];state.quizAnswered=false;quizProgress.textContent=`${state.quizIndex+1} / ${quizQuestions.length}`;quizScore.textContent=`이번 도전 ${state.quizScore}점`;quizQuestion.textContent=item.question;quizFeedback.textContent='';quizFeedback.className='quiz-feedback';quizNext.hidden=true;quizNext.onclick=null;quizOptions.innerHTML='';
  item.options.forEach((option,index)=>{const button=document.createElement('button');button.type='button';button.className='quiz-option';button.textContent=`${index+1}. ${option}`;button.addEventListener('click',()=>answerQuiz(index));quizOptions.appendChild(button);});
}
function answerQuiz(selectedIndex){
  if(state.quizAnswered)return;state.quizAnswered=true;const item=quizQuestions[state.quizIndex],buttons=[...quizOptions.querySelectorAll('.quiz-option')];
  buttons.forEach((button,index)=>{button.disabled=true;if(index===item.answer)button.classList.add('correct');if(index===selectedIndex&&index!==item.answer)button.classList.add('wrong');});
  if(selectedIndex===item.answer){state.quizScore+=100;quizFeedback.textContent=`정답! 🎉 ${item.explanation}`;quizFeedback.classList.add('success');}else{quizFeedback.textContent=`아쉬워요! ${item.explanation}`;quizFeedback.classList.add('error');}
  quizScore.textContent=`이번 도전 ${state.quizScore}점`;quizNext.hidden=false;quizNext.textContent=state.quizIndex===quizQuestions.length-1?'결과 보기 🏆':'다음 문제 ▶';
}
function advanceQuiz(){if(!state.quizAnswered)return;if(state.quizIndex===quizQuestions.length-1)return renderQuizResult();state.quizIndex++;renderQuizQuestion();}
function renderQuizResult(){
  state.totalScore+=state.quizScore;state.attempts+=1;state.lastScore=state.quizScore;state.bestScore=Math.max(state.bestScore,state.quizScore);savePlayerRecord();updateProfileScore();
  const correct=state.quizScore/100;quizProgress.textContent='완료';quizScore.textContent=`이번 ${state.quizScore}점 · 최고 ${state.bestScore}점`;quizQuestion.textContent=`${state.playerName}, 10문제 중 ${correct}문제를 맞혔어요!`;quizOptions.innerHTML='';
  quizFeedback.textContent=`누적 ${state.totalScore}점 · 도전 ${state.attempts}회 · 최근 ${state.lastScore}점`;quizFeedback.className='quiz-feedback success';quizNext.hidden=false;quizNext.textContent='다시 도전하기 ↻';quizNext.onclick=()=>{quizNext.onclick=null;state.quizIndex=0;state.quizScore=0;renderQuizQuestion();};
}
function closeQuiz(){state.quizOpen=false;quizPanel.hidden=true;quizNext.onclick=null;}
function gameLoop(){if(!state.running)return;updatePlayer();updateInteractionHint();requestAnimationFrame(gameLoop);}
