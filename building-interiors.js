/* Building entrance + interior transition system. Proximity checks are throttled to keep tablets responsive. */
(()=>{
  const game=document.querySelector('#game-screen'),player=document.querySelector('#player'),talk=document.querySelector('#talk-button');
  if(!game||!player)return;
  const hint=document.createElement('div');hint.id='building-interaction-hint';hint.className='interaction-hint';hint.setAttribute('role','status');hint.setAttribute('aria-live','polite');game.appendChild(hint);
  let current=null,open=false,lastCheck=0;
  const buildings=[
    {id:'school',selector:'.school',icon:'🏫',title:'배움터',text:'수업과 학습을 준비하는 공간입니다. 문제 풀이는 탐험에서 시작합니다.',action:'explore'},
    {id:'library',selector:'.library',icon:'📚',title:'책마루',text:'책과 어휘를 만나는 공간입니다. 문제 풀이는 탐험에서 시작합니다.',action:'explore'},
    {id:'quiz',selector:'#quiz-hall',icon:'❓',title:'도전관',text:'여러 도전을 준비하는 공간입니다. 문제 풀이는 탐험에서 시작합니다.',action:'explore'},
    {id:'shop',selector:'.shop-zone',icon:'🏪',title:'꾸미기 상점',text:'⭐ 별로 아이템을 사고, 가지고 있는 캐릭터 아이템을 골라 꾸미는 공간입니다.',action:'customize'}
  ];
  const overlay=document.createElement('div');overlay.id='building-interior';overlay.hidden=true;overlay.innerHTML=`<div class="interior-room"><button id="interior-exit" class="interior-exit">← 마을로</button><div id="interior-icon" class="interior-icon">🏠</div><span class="interior-label">실내 공간</span><h2 id="interior-title">건물</h2><p id="interior-text"></p><div id="interior-action-wrap"></div><div class="interior-decor"><span>🪴</span><span>🪟</span><span>🪑</span><span>📌</span></div></div>`;game.appendChild(overlay);
  const exit=overlay.querySelector('#interior-exit'),icon=overlay.querySelector('#interior-icon'),title=overlay.querySelector('#interior-title'),text=overlay.querySelector('#interior-text'),actions=overlay.querySelector('#interior-action-wrap');
  function distance(el){const a=player.getBoundingClientRect(),b=el.getBoundingClientRect();return Math.hypot(a.left+a.width/2-(b.left+b.width/2),a.top+a.height/2-(b.top+b.height/2))}
  function nearest(){let best=null;for(const b of buildings){const el=document.querySelector(b.selector);if(!el)continue;const d=distance(el);if(d<190&&(!best||d<best.d))best={...b,el,d}}return best}
  function addActionButton(label,onClick){const btn=document.createElement('button');btn.className='interior-primary';btn.textContent=label;btn.onclick=onClick;actions.appendChild(btn)}
  function openExpeditionHub(){leave();setTimeout(()=>{const button=[...document.querySelectorAll('button')].find(node=>node.textContent?.includes('탐험')&&!node.closest('#building-interior'));button?.click()},80)}
  function enter(b){if(!b)return;open=true;current=b;overlay.hidden=false;overlay.dataset.building=b.id;icon.textContent=b.icon;title.textContent=b.title;text.textContent=b.text;actions.innerHTML='';if(b.action==='explore')addActionButton('🧭 문제 탐험 열기',openExpeditionHub);else if(b.action==='customize')addActionButton('🎨 내 캐릭터 꾸미기',()=>{leave();setTimeout(()=>document.querySelector('#customize-button')?.click(),50)});document.body.classList.add('inside-building')}
  function hideHint(){hint.classList.remove('visible');document.body.classList.remove('near-building-interaction')}
  function leave(){open=false;overlay.hidden=true;current=null;hideHint();document.body.classList.remove('inside-building')}
  function interact(e){if(open)return;const b=nearest();if(!b)return;if(e){e.preventDefault();e.stopImmediatePropagation()}enter(b)}
  window.addEventListener('keydown',e=>{if(open&&e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();leave();return}if((e.code==='Space'||e.key==='Enter')&&!open)interact(e)},true);
  talk?.addEventListener('click',e=>{if(!open)interact(e)},true);exit.addEventListener('click',leave);
  function tick(now){if(now-lastCheck>=160){lastCheck=now;const active=game.classList.contains('active')&&!document.hidden;if(active&&!open){const b=nearest();if(b){document.body.classList.add('near-building-interaction');hint.textContent=`Space 키로 ${b.title} 입장하기`;hint.classList.add('visible')}else hideHint()}else hideHint()}requestAnimationFrame(tick)}requestAnimationFrame(tick);
})();
