/* v0.9.6 building entrance + interior transition system */
(()=>{
  const game=document.querySelector('#game-screen'),player=document.querySelector('#player'),talk=document.querySelector('#talk-button');
  if(!game||!player)return;
  const hint=document.createElement('div');hint.id='building-interaction-hint';hint.className='interaction-hint';hint.setAttribute('role','status');hint.setAttribute('aria-live','polite');game.appendChild(hint);
  let current=null,open=false,bypassUntil=0;
  const buildings=[
    {id:'school',selector:'.school',icon:'🏫',title:'배움터',text:'수업 활동과 학습 미션이 열리는 공간입니다.',action:'math'},
    {id:'library',selector:'.library',icon:'📚',title:'책마루',text:'독서·어휘 활동을 위한 공간입니다.',action:'library'},
    {id:'quiz',selector:'#quiz-hall',icon:'❓',title:'도전관',text:'수수께끼와 여러 학습 퀴즈에 도전하는 공간입니다.',action:'quiz'},
    {id:'shop',selector:'.shop-zone',icon:'🏪',title:'꾸미기 상점',text:'⭐ 별로 아이템을 사고, 가지고 있는 캐릭터 아이템을 골라 꾸미는 공간입니다.',action:'customize'}
  ];
  const overlay=document.createElement('div');overlay.id='building-interior';overlay.hidden=true;overlay.innerHTML=`<div class="interior-room"><button id="interior-exit" class="interior-exit">← 마을로</button><div id="interior-icon" class="interior-icon">🏠</div><span class="interior-label">실내 공간</span><h2 id="interior-title">건물</h2><p id="interior-text"></p><div id="interior-action-wrap"></div><div class="interior-decor"><span>🪴</span><span>🪟</span><span>🪑</span><span>📌</span></div></div>`;game.appendChild(overlay);
  const exit=overlay.querySelector('#interior-exit'),icon=overlay.querySelector('#interior-icon'),title=overlay.querySelector('#interior-title'),text=overlay.querySelector('#interior-text'),actions=overlay.querySelector('#interior-action-wrap');
  function distance(el){const a=player.getBoundingClientRect(),b=el.getBoundingClientRect();return Math.hypot(a.left+a.width/2-(b.left+b.width/2),a.top+a.height/2-(b.top+b.height/2))}
  function nearest(){let best=null;for(const b of buildings){const el=document.querySelector(b.selector);if(!el)continue;const d=distance(el);if(d<190&&(!best||d<best.d))best={...b,el,d}}return best}
  function addActionButton(label,onClick,requiresServer=false){const btn=document.createElement('button');btn.className='interior-primary';btn.textContent=label;if(requiresServer)btn.dataset.requiresServer='true';btn.onclick=onClick;actions.appendChild(btn)}
  async function runScoredAction(action){const connection=window.StudyVillageConnection;if(connection?.requireOnline&&!(await connection.requireOnline()))return;action()}
  function enter(b){if(!b)return;open=true;current=b;overlay.hidden=false;overlay.dataset.building=b.id;icon.textContent=b.icon;title.textContent=b.title;text.textContent=b.text;actions.innerHTML='';
    if(b.action==='math')addActionButton('➕ 랜덤 계산 연습 시작',()=>runScoredAction(()=>window.dispatchEvent(new CustomEvent('studyvillage:open-math-practice'))),true);
    else if(b.action==='quiz')addActionButton('🎯 수수께끼 도전 시작',()=>runScoredAction(()=>{leave();bypassUntil=performance.now()+700;setTimeout(()=>window.dispatchEvent(new KeyboardEvent('keydown',{key:' ',code:'Space',bubbles:true,cancelable:true})),60)}),true);
    else if(b.action==='library')addActionButton('📖 낱말 뜻 맞추기 시작',()=>runScoredAction(()=>window.dispatchEvent(new CustomEvent('studyvillage:open-library-game'))),true);
    else if(b.action==='customize')addActionButton('🎨 내 캐릭터 꾸미기',()=>{leave();setTimeout(()=>document.querySelector('#customize-button')?.click(),50)});
    else{const note=document.createElement('p');note.className='interior-coming';note.textContent='✨ 이 공간의 활동은 다음 업데이트에서 열립니다.';actions.appendChild(note)}
    document.body.classList.add('inside-building')}
  function hideHint(){if(hint)hint.classList.remove('visible');document.body.classList.remove('near-building-interaction')}
  function leave(){open=false;overlay.hidden=true;current=null;hideHint();document.body.classList.remove('inside-building')}
  function interact(e){if(open)return;if(performance.now()<bypassUntil)return;const b=nearest();if(!b)return;if(e){e.preventDefault();e.stopImmediatePropagation()}enter(b)}
  window.addEventListener('keydown',e=>{if(open&&e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();leave();return}if((e.code==='Space'||e.key==='Enter')&&!open)interact(e)},true);
  talk?.addEventListener('click',e=>{if(!open)interact(e)},true);exit.addEventListener('click',leave);
  function loop(){const active=game.classList.contains('active')&&!document.hidden;if(active&&!open){const b=nearest();if(b&&hint){document.body.classList.add('near-building-interaction');hint.textContent=`Space 키로 ${b.title} 입장하기`;hint.classList.add('visible')}else hideHint()}else hideHint();requestAnimationFrame(loop)}requestAnimationFrame(loop);
})();
