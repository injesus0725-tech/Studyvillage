/* Student guide + stabilized tablet/click movement. Login enters the playable village immediately. */
(()=>{
  const game=document.querySelector('#game-screen'),world=document.querySelector('#world'),player=document.querySelector('#player');
  if(!game||!world||!player)return;
  const style=document.createElement('style');
  style.textContent=`
    [hidden]{display:none!important}
    #game-screen.active{pointer-events:auto!important;touch-action:manipulation}
    #game-screen.active .hud,#game-screen.active .hud *,#game-screen.active #world,#game-screen.active #world-map,#game-screen.active .building,#game-screen.active .npc{pointer-events:auto!important}
    .guide-button{border:0;border-radius:12px;padding:8px 11px;background:#fff8d8;color:#69551d;font-weight:900;cursor:pointer;box-shadow:0 2px 8px #0001}
    .welcome-guide{position:fixed;inset:0;z-index:10000;display:grid;place-items:center;padding:18px;background:#17392388;backdrop-filter:blur(3px)}
    .welcome-guide[hidden]{display:none!important}.welcome-card{width:min(520px,94vw);border-radius:24px;background:#fff;padding:24px;box-shadow:0 20px 60px #10271955;color:#294332}
    .welcome-card .guide-icon{font-size:48px}.welcome-card h2{margin:9px 0 8px;font-size:25px}.welcome-card p{margin:0;color:#65756b;line-height:1.65;font-weight:700}
    .guide-dots{display:flex;gap:6px;margin:18px 0}.guide-dots span{width:9px;height:9px;border-radius:999px;background:#dbe5dc}.guide-dots span.active{width:24px;background:#4d8a5d}
    .guide-actions{display:flex;justify-content:space-between;gap:10px}.guide-actions button{border:0;border-radius:12px;padding:11px 14px;font-weight:900;cursor:pointer;touch-action:manipulation}.guide-skip{background:#eef2ee;color:#627068}.guide-next{margin-left:auto;background:#38744a;color:#fff}
    .teacher-preview-return{position:fixed;left:12px;top:12px;z-index:20000;padding:10px 14px;border-radius:999px;background:#fff;color:#315d3b;font-weight:900;text-decoration:none;box-shadow:0 5px 20px #0003;touch-action:manipulation}
    .tap-target{position:absolute;z-index:9;width:26px;height:26px;border:3px solid #fff;border-radius:50%;background:#5e9fff66;box-shadow:0 0 0 3px #2f78d655;transform:translate(-50%,-50%);pointer-events:none!important;animation:tap-pulse .65s ease-out infinite alternate}
    @keyframes tap-pulse{to{transform:translate(-50%,-50%) scale(1.22);opacity:.55}}
    .mobile-controls,.control-help{display:none!important}
    @media(max-width:720px),(pointer:coarse){#world{touch-action:none!important}.interaction-hint{display:none!important}.guide-button{padding:7px 9px;font-size:12px}.welcome-card{padding:20px}.welcome-card h2{font-size:22px}.teacher-preview-return{top:8px;left:8px;padding:8px 11px;font-size:12px}}
  `;
  document.head.appendChild(style);
  if(new URLSearchParams(location.search).get('teacher-preview')==='1'){const back=document.createElement('a');back.href='/admin.html';back.className='teacher-preview-return';back.textContent='← 교사 화면으로';document.body.appendChild(back)}

  const steps=[
    {icon:'🌳',title:'우리 학습마을에 온 걸 환영해!',text:'마을을 돌아다니며 건물과 탐험 메뉴에서 학습 활동에 참여해 보세요. 활동 기록과 성장 내용은 자동으로 저장됩니다.'},
    {icon:'👆',title:'가고 싶은 곳을 터치해 보세요',text:'태블릿과 휴대폰에서는 지도에서 가고 싶은 곳을 터치하면 캐릭터가 그곳으로 이동합니다. 컴퓨터에서 학생 화면을 확인할 때는 마우스로 클릭하면 됩니다.'},
    {icon:'🏫',title:'건물과 친구를 직접 터치해요',text:'건물이나 마을 친구를 직접 터치하면 해당 기능이 열립니다. 이동 터치와 메뉴 클릭은 서로 가로채지 않도록 분리되어 있습니다.'},
    {icon:'⭐',title:'배우면서 성장해요',text:'활동을 마치면 기록과 XP가 쌓여요. 내 기록에서 결과를 확인하고 모은 별은 상점과 꾸미기에 사용할 수 있습니다.'}
  ];
  let guideIndex=0;
  const overlay=document.createElement('div');overlay.className='welcome-guide';overlay.hidden=true;overlay.innerHTML=`<section class="welcome-card" role="dialog" aria-modal="true" aria-label="마을 이용 안내"><div id="guide-icon" class="guide-icon"></div><h2 id="guide-title"></h2><p id="guide-text"></p><div id="guide-dots" class="guide-dots"></div><div class="guide-actions"><button id="guide-skip" class="guide-skip" type="button">닫기</button><button id="guide-next" class="guide-next" type="button">다음 ▶</button></div></section>`;document.body.appendChild(overlay);
  const icon=overlay.querySelector('#guide-icon'),title=overlay.querySelector('#guide-title'),text=overlay.querySelector('#guide-text'),dots=overlay.querySelector('#guide-dots'),next=overlay.querySelector('#guide-next'),skip=overlay.querySelector('#guide-skip');
  function renderGuide(){const s=steps[guideIndex];icon.textContent=s.icon;title.textContent=s.title;text.textContent=s.text;dots.innerHTML=steps.map((_,i)=>`<span class="${i===guideIndex?'active':''}"></span>`).join('');next.textContent=guideIndex===steps.length-1?'마을로 돌아가기 ✓':'다음 ▶'}
  function openGuide(){guideIndex=0;renderGuide();overlay.hidden=false;stopMovement()}
  function finishGuide(){overlay.hidden=true}
  next.addEventListener('click',()=>{if(guideIndex<steps.length-1){guideIndex++;renderGuide()}else finishGuide()});skip.addEventListener('click',finishGuide);overlay.addEventListener('click',e=>{if(e.target===overlay)finishGuide()});window.addEventListener('keydown',e=>{if(overlay.hidden)return;if(e.key==='Escape'){e.preventDefault();finishGuide()}},true);
  const hudRight=document.querySelector('.hud-right');if(hudRight){const b=document.createElement('button');b.type='button';b.className='guide-button';b.textContent='❔ 마을 안내';b.addEventListener('click',openGuide);hudRight.insertBefore(b,hudRight.firstChild)}

  const map=document.querySelector('#world-map')||world;
  const marker=document.createElement('div');marker.className='tap-target';marker.hidden=true;map.appendChild(marker);
  const directionButtons={ArrowLeft:document.querySelector('.mobile-controls button[data-key="ArrowLeft"]'),ArrowRight:document.querySelector('.mobile-controls button[data-key="ArrowRight"]'),ArrowUp:document.querySelector('.mobile-controls button[data-key="ArrowUp"]'),ArrowDown:document.querySelector('.mobile-controls button[data-key="ArrowDown"]')};
  let target=null,moveTimer=0,held=new Set();
  const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
  const pointerEvent=(type)=>{try{return new PointerEvent(type,{bubbles:true,pointerId:77,pointerType:'touch',isPrimary:true})}catch{return new Event(type,{bubbles:true})}};
  function setDirection(key,on){const button=directionButtons[key];if(!button)return;if(on&&!held.has(key)){held.add(key);button.dispatchEvent(pointerEvent('pointerdown'))}else if(!on&&held.has(key)){held.delete(key);button.dispatchEvent(pointerEvent('pointerup'))}}
  function stopDirections(){for(const key of Object.keys(directionButtons))setDirection(key,false)}
  function stopMovement(){stopDirections();if(moveTimer){clearInterval(moveTimer);moveTimer=0}target=null;marker.hidden=true}
  function worldPercent(clientX,clientY){const r=world.getBoundingClientRect();return{x:clamp((clientX-r.left)/r.width*100,3,97),y:clamp((clientY-r.top)/r.height*100,8,92)}}
  function playerPercent(){const r=world.getBoundingClientRect(),p=player.getBoundingClientRect();return{x:(p.left+p.width/2-r.left)/r.width*100,y:(p.top+p.height/2-r.top)/r.height*100}}
  function driveTowardTarget(){if(!target||!game.classList.contains('active')||document.hidden||visibleBlockingPanel()){stopMovement();return}const p=playerPercent(),dx=target.x-p.x,dy=target.y-p.y;if(Math.hypot(dx,dy)<1.3){stopMovement();return}setDirection('ArrowLeft',dx<-.8);setDirection('ArrowRight',dx>.8);setDirection('ArrowUp',dy<-.8);setDirection('ArrowDown',dy>.8)}
  function beginMove(clientX,clientY){if(!game.classList.contains('active')||visibleBlockingPanel())return;stopMovement();target=worldPercent(clientX,clientY);marker.style.left=`${target.x}%`;marker.style.top=`${target.y}%`;marker.hidden=false;driveTowardTarget();moveTimer=setInterval(driveTowardTarget,80)}

  function panelVisible(el){if(!el||el.hidden)return false;const cs=getComputedStyle(el);return cs.display!=='none'&&cs.visibility!=='hidden'&&el.getClientRects().length>0}
  function visibleBlockingPanel(){return [...document.querySelectorAll('#building-interior,#student-explore-panel,#study-expedition-stage,.sv-expedition-panel,#customize-panel,#record-panel,#quiz-panel,#dialogue,.welcome-guide')].some(panelVisible)}
  function isInteractiveTarget(targetNode){return !!targetNode?.closest?.('button,a,input,select,textarea,label,.building,.npc,#guide-npc,[role="button"],#building-interior,#student-explore-panel,#study-expedition-stage,.sv-expedition-panel,#customize-panel,#record-panel,#quiz-panel,#dialogue,.welcome-guide')}
  world.addEventListener('pointerup',e=>{if(!game.classList.contains('active')||visibleBlockingPanel()||isInteractiveTarget(e.target))return;if(e.button!==undefined&&e.button!==0)return;beginMove(e.clientX,e.clientY)},false);
  window.addEventListener('blur',stopMovement);document.addEventListener('visibilitychange',()=>{if(document.hidden)stopMovement()});

  function resetTransientUi(){if(!game.classList.contains('active'))return;overlay.hidden=true;stopMovement();for(const selector of ['#building-interior','#student-explore-panel','#study-expedition-stage','.sv-expedition-panel','#customize-panel','#record-panel','#quiz-panel','#dialogue'])document.querySelectorAll(selector).forEach(node=>{node.hidden=true;node.style.removeProperty('pointer-events')});document.body.classList.remove('inside-building','near-building-interaction');game.style.removeProperty('pointer-events');world.style.removeProperty('pointer-events');map.style.removeProperty('pointer-events');document.querySelectorAll('.hud button,.hud a,.building,.npc').forEach(node=>{node.style.removeProperty('pointer-events');if('disabled' in node)node.disabled=false});document.querySelectorAll('#world-map .obstacle').forEach(node=>node.classList.remove('obstacle'))}
  let wasActive=game.classList.contains('active');new MutationObserver(()=>{const active=game.classList.contains('active');if(active&&!wasActive)requestAnimationFrame(resetTransientUi);wasActive=active}).observe(game,{attributes:true,attributeFilter:['class']});if(wasActive)requestAnimationFrame(resetTransientUi);window.addEventListener('studyvillage:session-cleared',()=>{overlay.hidden=true;stopMovement()});
})();
