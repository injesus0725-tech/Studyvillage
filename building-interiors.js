/* Building entrance + interior transition system. Proximity checks are throttled to keep tablets responsive. */
(()=>{
  const game=document.querySelector('#game-screen'),player=document.querySelector('#player'),talk=document.querySelector('#talk-button'),guideNpc=document.querySelector('#guide-npc');
  if(!game||!player)return;
  const style=document.createElement('style');
  style.textContent=`
    #student-explore-panel{position:absolute!important;inset:0!important;z-index:240!important;display:grid!important;place-items:center!important;padding:12px!important;background:#183625e8!important;backdrop-filter:blur(5px);pointer-events:auto!important;overflow:auto!important}
    #student-explore-panel[hidden]{display:none!important}
    #student-explore-panel *{pointer-events:auto!important}
    #building-interior{pointer-events:auto!important}
    #building-interior[hidden]{display:none!important}
    #interior-action-wrap .interior-primary{pointer-events:auto!important;touch-action:manipulation!important;position:relative!important;z-index:5!important}
    .sv-flow-status{position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:30000;padding:8px 12px;border-radius:999px;background:#173923e8;color:#fff;font-size:12px;font-weight:900;box-shadow:0 5px 18px #0003;pointer-events:none}
  `;
  document.head.appendChild(style);
  const hint=document.createElement('div');hint.id='building-interaction-hint';hint.className='interaction-hint';hint.setAttribute('role','status');hint.setAttribute('aria-live','polite');game.appendChild(hint);
  let current=null,open=false,lastCheck=0,bypassUntil=0;
  const buildings=[
    {id:'school',selector:'.school',icon:'🏫',title:'교과 배움터',text:'국어·수학·사회·과학·예체능을 과목과 단원별로 학습하는 공간입니다.',action:'curriculum'},
    {id:'library',selector:'.library',icon:'📚',title:'책마루',text:'독서·어휘 활동을 위한 공간입니다.',action:'library'},
    {id:'quiz',selector:'#quiz-hall',icon:'➕',title:'수학 놀이터',text:'매번 달라지는 수학 문제를 풀며 계산 감각을 기르는 공간입니다.',action:'math'},
    {id:'shop',selector:'.shop-zone',icon:'🏪',title:'꾸미기 상점',text:'⭐ 별로 아이템을 사고, 가지고 있는 캐릭터 아이템을 골라 꾸미는 공간입니다.',action:'customize'}
  ];
  const mathHall=document.querySelector('#quiz-hall');if(mathHall){mathHall.childNodes[0].nodeValue='➕';const label=mathHall.querySelector('span');if(label)label.textContent='수학 놀이터'}
  const overlay=document.createElement('div');overlay.id='building-interior';overlay.hidden=true;overlay.innerHTML=`<div class="interior-room"><button id="interior-exit" class="interior-exit">← 마을로</button><div id="interior-icon" class="interior-icon">🏠</div><span class="interior-label">실내 공간</span><h2 id="interior-title">건물</h2><p id="interior-text"></p><div id="interior-action-wrap"></div><div class="interior-decor"><span>🪴</span><span>🪟</span><span>🪑</span><span>📌</span></div></div>`;game.appendChild(overlay);
  const exit=overlay.querySelector('#interior-exit'),icon=overlay.querySelector('#interior-icon'),title=overlay.querySelector('#interior-title'),text=overlay.querySelector('#interior-text'),actions=overlay.querySelector('#interior-action-wrap');
  const touchMode=()=>matchMedia?.('(pointer:coarse)').matches===true||innerWidth<=700;
  function distance(el){const a=player.getBoundingClientRect(),b=el.getBoundingClientRect();return Math.hypot(a.left+a.width/2-(b.left+b.width/2),a.top+a.height/2-(b.top+b.height/2))}
  function nearest(){let best=null;for(const b of buildings){const el=document.querySelector(b.selector);if(!el)continue;const d=distance(el);if(d<190&&(!best||d<best.d))best={...b,el,d}}return best}
  function addActionButton(label,onClick,requiresServer=false){const btn=document.createElement('button');btn.className='interior-primary';btn.type='button';btn.textContent=label;if(requiresServer)btn.dataset.requiresServer='true';btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();onClick()});actions.appendChild(btn)}
  async function runScoredAction(action){const connection=window.StudyVillageConnection;if(connection?.requireOnline&&!(await connection.requireOnline()))return;leave();bypassUntil=performance.now()+800;requestAnimationFrame(action)}
  function hideHint(){hint.classList.remove('visible');document.body.classList.remove('near-building-interaction')}
  function leave(){open=false;overlay.hidden=true;current=null;hideHint();document.body.classList.remove('inside-building')}
  function startRiddleFromHall(){
    leave();bypassUntil=performance.now()+7000;
    const npc=guideNpc,previousDisplay=npc?.style.display||'';
    if(npc)npc.style.display='none';
    const restore=()=>{if(npc)npc.style.display=previousDisplay};
    const quiz=document.querySelector('#quiz-panel');
    let observer=null,timer=null;
    if(quiz){observer=new MutationObserver(()=>{if(!quiz.hidden){observer?.disconnect();clearTimeout(timer);restore()}});observer.observe(quiz,{attributes:true,attributeFilter:['hidden']})}
    timer=setTimeout(()=>{observer?.disconnect();restore()},6500);
    setTimeout(()=>window.dispatchEvent(new KeyboardEvent('keydown',{key:' ',code:'Space',bubbles:true,cancelable:true})),40)
  }
  function enter(b){if(!b)return;open=true;current=b;overlay.style.removeProperty('pointer-events');overlay.hidden=false;overlay.dataset.building=b.id;icon.textContent=b.icon;title.textContent=b.title;text.textContent=b.text;actions.innerHTML='';
    if(b.action==='curriculum')addActionButton('📚 과목·단원 선택하기',()=>runScoredAction(async()=>{await import('./assets/student-curriculum-learning.js');window.dispatchEvent(new CustomEvent('studyvillage:open-curriculum-learning'))}),true);
    else if(b.action==='math')addActionButton('➕ 랜덤 수학 문제 시작',()=>runScoredAction(async()=>{await import('./assets/student-math-review.js');window.dispatchEvent(new CustomEvent('studyvillage:open-math-practice'))}),true);
    else if(b.action==='library')addActionButton('📖 낱말 뜻 맞추기 시작',()=>runScoredAction(()=>window.dispatchEvent(new CustomEvent('studyvillage:open-library-game'))),true);
    else if(b.action==='customize')addActionButton('🎨 내 캐릭터 꾸미기',()=>{leave();requestAnimationFrame(()=>document.querySelector('#customize-button')?.click())});
    document.body.classList.add('inside-building')
  }
  function interact(e){if(open||performance.now()<bypassUntil)return;const b=nearest();if(!b)return;if(e){e.preventDefault();e.stopImmediatePropagation()}enter(b)}
  function foregroundPanelOpen(){return[...document.querySelectorAll('#student-explore-panel,#study-expedition-stage,#curriculum-learning,.math-practice-panel,#library-game-panel,#library-game,#quiz-panel,#record-panel,#customize-panel,.welcome-guide')].some(el=>el&&!el.hidden&&el.getClientRects().length>0)}
  window.addEventListener('keydown',e=>{if(open&&e.key==='Escape'){if(foregroundPanelOpen())return;e.preventDefault();e.stopImmediatePropagation();leave();return}if((e.code==='Space'||e.key==='Enter')&&!open)interact(e)},true);
  talk?.addEventListener('click',e=>{if(!open)interact(e)},true);exit.addEventListener('click',leave);window.addEventListener('studyvillage:return-to-village',()=>{bypassUntil=0;leave()});
  guideNpc?.addEventListener('click',e=>{if(open||foregroundPanelOpen())return;e.preventDefault();e.stopImmediatePropagation();bypassUntil=performance.now()+500;window.dispatchEvent(new KeyboardEvent('keydown',{key:' ',code:'Space',bubbles:true,cancelable:true}))},true);
  for(const b of buildings){const el=document.querySelector(b.selector);if(!el)continue;el.style.cursor='pointer';el.addEventListener('click',e=>{if(!touchMode()||open)return;e.preventDefault();e.stopImmediatePropagation();if(confirm(`${b.title}에 들어갈까요?`))enter({...b,el,d:0})},true)}
  function tick(now){if(now-lastCheck>=160){lastCheck=now;const active=game.classList.contains('active')&&!document.hidden;if(active&&!open){const b=nearest();if(b){document.body.classList.add('near-building-interaction');hint.textContent=touchMode()?`${b.title}을(를) 직접 터치해 들어가기`:`Space 키로 ${b.title} 입장하기`;hint.classList.add('visible')}else hideHint()}else hideHint()}requestAnimationFrame(tick)}requestAnimationFrame(tick);
})();
