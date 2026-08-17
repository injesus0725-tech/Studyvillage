/* Student guide + tablet tap controls. Login enters the playable village immediately. */
(()=>{
  const game=document.querySelector('#game-screen'),world=document.querySelector('#world'),player=document.querySelector('#player');
  if(!game||!world||!player)return;
  const touchMode=()=>matchMedia?.('(pointer:coarse)').matches===true||innerWidth<=700;
  const style=document.createElement('style');
  style.textContent=`
    [hidden]{display:none!important;pointer-events:none!important}
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
    @media(max-width:720px),(pointer:coarse){.mobile-controls{display:none!important}.control-help{display:none!important}#world{touch-action:none!important}.interaction-hint.visible{font-size:12px;bottom:10px}.guide-button{padding:7px 9px;font-size:12px}.welcome-card{padding:20px}.welcome-card h2{font-size:22px}.teacher-preview-return{top:8px;left:8px;padding:8px 11px;font-size:12px}}
  `;
  document.head.appendChild(style);
  if(new URLSearchParams(location.search).get('teacher-preview')==='1'){const back=document.createElement('a');back.href='/admin.html';back.className='teacher-preview-return';back.textContent='← 교사 화면으로';document.body.appendChild(back)}

  const steps=[
    {icon:'🌳',title:'우리 학습마을에 온 걸 환영해!',text:'마을을 돌아다니며 건물과 탐험 메뉴에서 학습 활동에 참여해 보세요. 활동 기록과 성장 내용은 자동으로 저장됩니다.'},
    {icon:'👆',title:'가고 싶은 곳을 터치해 보세요',text:'태블릿과 휴대폰에서는 지도에서 가고 싶은 곳을 터치하면 캐릭터가 그곳으로 이동합니다. 컴퓨터에서는 방향키 또는 WASD도 사용할 수 있어요.'},
    {icon:'🏫',title:'건물과 친구를 직접 터치해요',text:'건물이나 마을 친구를 터치하면 확인 메시지가 나타납니다. 확인하면 바로 들어가거나 가까이 이동해 상호작용합니다.'},
    {icon:'⭐',title:'배우면서 성장해요',text:'활동을 마치면 기록과 XP가 쌓여요. 내 기록에서 결과를 확인하고 모은 별은 상점과 꾸미기에 사용할 수 있습니다.'}
  ];
  let guideIndex=0;
  const overlay=document.createElement('div');overlay.className='welcome-guide';overlay.hidden=true;overlay.innerHTML=`<section class="welcome-card" role="dialog" aria-modal="true" aria-label="마을 이용 안내"><div id="guide-icon" class="guide-icon"></div><h2 id="guide-title"></h2><p id="guide-text"></p><div id="guide-dots" class="guide-dots"></div><div class="guide-actions"><button id="guide-skip" class="guide-skip" type="button">닫기</button><button id="guide-next" class="guide-next" type="button">다음 ▶</button></div></section>`;document.body.appendChild(overlay);
  const icon=overlay.querySelector('#guide-icon'),title=overlay.querySelector('#guide-title'),text=overlay.querySelector('#guide-text'),dots=overlay.querySelector('#guide-dots'),next=overlay.querySelector('#guide-next'),skip=overlay.querySelector('#guide-skip');
  function renderGuide(){const s=steps[guideIndex];icon.textContent=s.icon;title.textContent=s.title;text.textContent=s.text;dots.innerHTML=steps.map((_,i)=>`<span class="${i===guideIndex?'active':''}"></span>`).join('');next.textContent=guideIndex===steps.length-1?'마을로 돌아가기 ✓':'다음 ▶'}
  function openGuide(){guideIndex=0;renderGuide();overlay.hidden=false}
  function finishGuide(){overlay.hidden=true}
  next.addEventListener('click',()=>{if(guideIndex<steps.length-1){guideIndex++;renderGuide()}else finishGuide()});skip.addEventListener('click',finishGuide);overlay.addEventListener('click',e=>{if(e.target===overlay)finishGuide()});window.addEventListener('keydown',e=>{if(overlay.hidden)return;if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();finishGuide()}},true);
  const hudRight=document.querySelector('.hud-right');if(hudRight){const b=document.createElement('button');b.type='button';b.className='guide-button';b.textContent='❔ 마을 안내';b.addEventListener('click',openGuide);hudRight.insertBefore(b,hudRight.firstChild)}

  const hint=document.querySelector('#interaction-hint');
  function normalizeHint(){if(!touchMode()||!hint)return;const current=hint.textContent||'';if(current.includes('도우미 선생님'))hint.textContent='도우미 선생님을 직접 터치해 이야기하기';else if(current.includes('수수께끼')||current.includes('도전관'))hint.textContent='도전관을 직접 터치해 들어가기'}
  if(hint){new MutationObserver(normalizeHint).observe(hint,{childList:true,characterData:true,subtree:true});window.addEventListener('resize',normalizeHint)}

  const map=document.querySelector('#world-map')||world;
  const marker=document.createElement('div');marker.className='tap-target';marker.hidden=true;map.appendChild(marker);
  let moveFrame=0,target=null,lastPointerAt=0;
  const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
  function stopMove(){target=null;marker.hidden=true;if(moveFrame){cancelAnimationFrame(moveFrame);moveFrame=0}}
  function worldPercent(clientX,clientY){const r=world.getBoundingClientRect();return{x:clamp((clientX-r.left)/r.width*100,3,97),y:clamp((clientY-r.top)/r.height*100,8,92)}}
  function beginMove(clientX,clientY){if(!touchMode()||!game.classList.contains('active'))return;const p=worldPercent(clientX,clientY);target=p;marker.style.left=`${p.x}%`;marker.style.top=`${p.y}%`;marker.hidden=false;if(!moveFrame)moveFrame=requestAnimationFrame(stepMove)}
  function stepMove(){moveFrame=0;if(!target||!game.classList.contains('active')||document.hidden){stopMove();return}const left=parseFloat(player.style.left)||50,top=parseFloat(player.style.top)||68,dx=target.x-left,dy=target.y-top,dist=Math.hypot(dx,dy);if(dist<0.7){player.style.left=`${target.x}%`;player.style.top=`${target.y}%`;stopMove();return}const speed=Math.min(0.8,dist);player.style.left=`${left+dx/dist*speed}%`;player.style.top=`${top+dy/dist*speed}%`;moveFrame=requestAnimationFrame(stepMove)}

  function rectHit(el,x,y){if(!el||el.hidden)return false;const r=el.getBoundingClientRect();return r.width>0&&r.height>0&&x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom}
  function visibleBlockingPanel(){return [...document.querySelectorAll('#building-interior,#student-explore-panel,#study-expedition-stage,.sv-expedition-panel,#customize-panel,#record-panel,#quiz-panel,#dialogue,.welcome-guide')].some(el=>!el.hidden&&getComputedStyle(el).display!=='none')}
  function routeTouch(clientX,clientY){
    if(!touchMode()||!game.classList.contains('active')||visibleBlockingPanel())return false;
    const hudButtons=[...document.querySelectorAll('.hud button,.hud a')];
    const hudHit=hudButtons.find(el=>rectHit(el,clientX,clientY));
    if(hudHit){hudHit.click();return true}
    const buildings=[...document.querySelectorAll('.building')];
    const buildingHit=buildings.find(el=>rectHit(el,clientX,clientY));
    if(buildingHit){buildingHit.click();return true}
    const npc=document.querySelector('#guide-npc');if(rectHit(npc,clientX,clientY)){npc.click();return true}
    if(rectHit(world,clientX,clientY)){beginMove(clientX,clientY);return true}
    return false;
  }
  document.addEventListener('pointerup',e=>{if(!touchMode())return;lastPointerAt=Date.now();if(routeTouch(e.clientX,e.clientY)){e.preventDefault();e.stopImmediatePropagation()}},true);
  document.addEventListener('touchend',e=>{if(!touchMode()||Date.now()-lastPointerAt<500)return;const t=e.changedTouches?.[0];if(!t)return;if(routeTouch(t.clientX,t.clientY)){e.preventDefault();e.stopImmediatePropagation()}},{capture:true,passive:false});
  window.addEventListener('blur',stopMove);document.addEventListener('visibilitychange',()=>{if(document.hidden)stopMove()});

  function resetTransientUi(){if(!game.classList.contains('active'))return;overlay.hidden=true;stopMove();for(const selector of ['#building-interior','#student-explore-panel','#study-expedition-stage','.sv-expedition-panel','#customize-panel','#record-panel','#quiz-panel','#dialogue'])document.querySelectorAll(selector).forEach(node=>{node.hidden=true;node.style.pointerEvents='none'});document.body.classList.remove('inside-building','near-building-interaction');game.style.pointerEvents='auto';world.style.pointerEvents='auto';map.style.pointerEvents='auto';document.querySelectorAll('.hud button,.hud a,.building,.npc').forEach(node=>{node.style.pointerEvents='auto';if('disabled' in node)node.disabled=false});document.querySelectorAll('#world-map .obstacle').forEach(node=>node.classList.remove('obstacle'));normalizeHint()}
  let wasActive=game.classList.contains('active');new MutationObserver(()=>{const active=game.classList.contains('active');if(active&&!wasActive)requestAnimationFrame(resetTransientUi);wasActive=active}).observe(game,{attributes:true,attributeFilter:['class']});if(wasActive)requestAnimationFrame(resetTransientUi);window.addEventListener('studyvillage:session-cleared',()=>{overlay.hidden=true;stopMove()});
  /* Never open a modal automatically after login. Character choice stays available from 꾸미기. */
})();
