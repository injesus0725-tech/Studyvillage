/* Building entrance + interior transition system. Direct click/tap only; no keyboard or duplicate pointer handlers. */
(()=>{
  const game=document.querySelector('#game-screen'),player=document.querySelector('#player');if(!game||!player)return;
  const style=document.createElement('style');style.textContent=`#student-explore-panel{position:absolute!important;inset:0!important;z-index:240!important;display:grid!important;place-items:center!important;padding:12px!important;background:#183625e8!important;backdrop-filter:blur(5px);pointer-events:auto!important;overflow:auto!important}#student-explore-panel[hidden]{display:none!important}#student-explore-panel *{pointer-events:auto!important}#building-interior{pointer-events:auto!important}#building-interior[hidden]{display:none!important}#interior-action-wrap .interior-primary{pointer-events:auto!important;touch-action:manipulation!important;position:relative!important;z-index:5!important}.sv-flow-status{position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:30000;padding:8px 12px;border-radius:999px;background:#173923e8;color:#fff;font-size:12px;font-weight:900;box-shadow:0 5px 18px #0003;pointer-events:none}`;document.head.appendChild(style);
  const hint=document.createElement('div');hint.id='building-interaction-hint';hint.className='interaction-hint';hint.setAttribute('role','status');hint.setAttribute('aria-live','polite');game.appendChild(hint);
  let current=null,open=false,lastCheck=0;
  const buildings=[
    {id:'school',selector:'.school',icon:'🏫',title:'배움터',text:'수학 랜덤 복습으로 교과 학습을 이어가는 공간입니다.',action:'math',button:'➕ 수학 랜덤 복습'},
    {id:'library',selector:'.library',icon:'📚',title:'책마루',text:'수수께끼·어휘·상식·교과 문제를 매일 다양하게 만나는 공간입니다.',action:'library',button:'📚 일일 책마루 도전'},
    {id:'quiz',selector:'#quiz-hall',icon:'❓',title:'도전관',text:'도전 문제로 실력을 확인하는 공간입니다.',action:'quiz',button:'❓ 수수께끼 도전'},
    {id:'shop',selector:'.shop-zone',icon:'🏪',title:'꾸미기 상점',text:'⭐ 별로 아이템을 사고, 가지고 있는 캐릭터 아이템을 골라 꾸미는 공간입니다.',action:'customize',button:'🎨 내 캐릭터 꾸미기'}
  ];
  const overlay=document.createElement('div');overlay.id='building-interior';overlay.hidden=true;overlay.innerHTML=`<div class="interior-room"><button id="interior-exit" class="interior-exit">← 마을로</button><div id="interior-icon" class="interior-icon">🏠</div><span class="interior-label">실내 공간</span><h2 id="interior-title">건물</h2><p id="interior-text"></p><div id="interior-action-wrap"></div><div class="interior-decor"><span>🪴</span><span>🪟</span><span>🪑</span><span>📌</span></div></div>`;game.appendChild(overlay);
  const exit=overlay.querySelector('#interior-exit'),icon=overlay.querySelector('#interior-icon'),title=overlay.querySelector('#interior-title'),text=overlay.querySelector('#interior-text'),actions=overlay.querySelector('#interior-action-wrap');
  const flash=text=>{let n=document.querySelector('.sv-flow-status');if(!n){n=document.createElement('div');n.className='sv-flow-status';document.body.appendChild(n)}n.textContent=text;n.hidden=false;clearTimeout(flash.t);flash.t=setTimeout(()=>n.hidden=true,1200)};
  function distance(el){const a=player.getBoundingClientRect(),b=el.getBoundingClientRect();return Math.hypot(a.left+a.width/2-(b.left+b.width/2),a.top+a.height/2-(b.top+b.height/2))}
  function nearest(){let best=null;for(const b of buildings){const el=document.querySelector(b.selector);if(!el)continue;const d=distance(el);if(d<190&&(!best||d<best.d))best={...b,el,d}}return best}
  function addActionButton(label,onClick){const btn=document.createElement('button');btn.className='interior-primary';btn.type='button';btn.textContent=label;btn.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();onClick()});actions.appendChild(btn)}
  function hideHint(){hint.classList.remove('visible');document.body.classList.remove('near-building-interaction')}
  function leave(){window.StudyVillageMovement?.stop?.();open=false;overlay.hidden=true;current=null;hideHint();document.body.classList.remove('inside-building')}
  function launch(action){
    window.StudyVillageMovement?.stop?.();
    if(action==='math'){leave();window.dispatchEvent(new CustomEvent('studyvillage:open-math-practice'));return}
    if(action==='library'){leave();window.dispatchEvent(new CustomEvent('studyvillage:open-library-game'));return}
    if(action==='quiz'){leave();requestAnimationFrame(()=>{if(typeof window.openQuiz==='function')window.openQuiz();else flash('도전관 문제를 열지 못했어요.')});return}
    if(action==='customize'){leave();requestAnimationFrame(()=>document.querySelector('#customize-button')?.click());return}
  }
  function enter(b){if(!b)return;window.StudyVillageMovement?.stop?.();open=true;current=b;overlay.hidden=false;overlay.dataset.building=b.id;icon.textContent=b.icon;title.textContent=b.title;text.textContent=b.text;actions.innerHTML='';addActionButton(b.button||'열기',()=>launch(b.action));document.body.classList.add('inside-building')}
  exit.addEventListener('click',leave);
  for(const b of buildings){const el=document.querySelector(b.selector);if(!el)continue;el.style.cursor='pointer';el.addEventListener('click',event=>{if(open)return;event.preventDefault();event.stopPropagation();enter({...b,el,d:0})})}
  function tick(now){if(now-lastCheck>=200){lastCheck=now;const active=game.classList.contains('active')&&!document.hidden;if(active&&!open){const b=nearest();if(b){document.body.classList.add('near-building-interaction');hint.textContent=`${b.title}을(를) 터치해 들어가기`;hint.classList.add('visible')}else hideHint()}else hideHint()}requestAnimationFrame(tick)}requestAnimationFrame(tick);
  window.addEventListener('studyvillage:session-cleared',leave);
})();