/* Student guide + tablet tap controls. Login enters the playable village immediately. */
(()=>{
  const game=document.querySelector('#game-screen'),world=document.querySelector('#world'),player=document.querySelector('#player');
  if(!game||!world||!player)return;
  const touchMode=()=>matchMedia?.('(pointer:coarse)').matches===true||innerWidth<=700;
  const style=document.createElement('style');
  style.textContent=`
    [hidden]{display:none!important;pointer-events:none!important}
    #game-screen.active{pointer-events:auto!important}
    body.student-playing>#game-screen{pointer-events:auto!important}
    body.student-playing>*:not(#game-screen):not(script):not(style){pointer-events:none!important}
    #game-screen.active .hud,#game-screen.active .hud *,#game-screen.active #world,#game-screen.active #world-map,#game-screen.active .building,#game-screen.active .npc{pointer-events:auto!important}
    #game-screen.active button,#game-screen.active a{pointer-events:auto!important;touch-action:manipulation!important}
    .guide-button{border:0;border-radius:12px;padding:8px 11px;background:#fff8d8;color:#69551d;font-weight:900;cursor:pointer;box-shadow:0 2px 8px #0001}
    .welcome-guide{position:fixed;inset:0;z-index:10000;display:grid;place-items:center;padding:18px;background:#17392388;backdrop-filter:blur(3px)}
    .welcome-guide[hidden]{display:none!important}.welcome-card{width:min(520px,94vw);border-radius:24px;background:#fff;padding:24px;box-shadow:0 20px 60px #10271955;color:#294332}
    .welcome-card .guide-icon{font-size:48px}.welcome-card h2{margin:9px 0 8px;font-size:25px}.welcome-card p{margin:0;color:#65756b;line-height:1.65;font-weight:700}
    .guide-dots{display:flex;gap:6px;margin:18px 0}.guide-dots span{width:9px;height:9px;border-radius:999px;background:#dbe5dc}.guide-dots span.active{width:24px;background:#4d8a5d}
    .guide-actions{display:flex;justify-content:space-between;gap:10px}.guide-actions button{border:0;border-radius:12px;padding:11px 14px;font-weight:900;cursor:pointer;touch-action:manipulation}.guide-skip{background:#eef2ee;color:#627068}.guide-next{margin-left:auto;background:#38744a;color:#fff}
    .teacher-preview-return{position:fixed;left:12px;top:12px;z-index:20000;padding:10px 14px;border-radius:999px;background:#fff;color:#315d3b;font-weight:900;text-decoration:none;box-shadow:0 5px 20px #0003;touch-action:manipulation}
    .tap-target{position:absolute;z-index:9;width:26px;height:26px;border:3px solid #fff;border-radius:50%;background:#5e9fff66;box-shadow:0 0 0 3px #2f78d655;transform:translate(-50%,-50%);pointer-events:none;animation:tap-pulse .65s ease-out infinite alternate}
    @keyframes tap-pulse{to{transform:translate(-50%,-50%) scale(1.22);opacity:.55}}
    @media(max-width:720px),(pointer:coarse){.mobile-controls{display:none!important}.control-help{display:none!important}#world{touch-action:none!important}.interaction-hint.visible{font-size:12px;bottom:10px;pointer-events:none!important}.guide-button{padding:7px 9px;font-size:12px}.welcome-card{padding:20px}.welcome-card h2{font-size:22px}.teacher-preview-return{top:8px;left:8px;padding:8px 11px;font-size:12px}}
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
  function openGuide(){guideIndex=0;renderGuide();overlay.hidden=false;overlay.style.pointerEvents='auto'}
  function finishGuide(){overlay.hidden=true;overlay.style.pointerEvents='none'}
  next.addEventListener('click',()=>{if(guideIndex<steps.length-1){guideIndex++;renderGuide()}else finishGuide()});skip.addEventListener('click',finishGuide);overlay.addEventListener('click',e=>{if(e.target===overlay)finishGuide()});window.addEventListener('keydown',e=>{if(overlay.hidden)return;if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();finishGuide()}},true);
  const hudRight=document.querySelector('.hud-right');if(hudRight){const b=document.createElement('button');b.type='button';b.className='guide-button';b.textContent='❔ 마을 안내';b.addEventListener('click',openGuide);hudRight.insertBefore(b,hudRight.firstChild)}

  const hint=document.querySelector('#interaction-hint');
  function normalizeHint(){if(!touchMode()||!hint)return;const current=hint.textContent||'';if(current.includes('도우미 선생님'))hint.textContent='도우미 선생님을 직접 터치해 이야기하기';else if(current.includes('수수께끼'))hint.textContent='도전관을 직접 터치해 들어가기'}
  if(hint){hint.style.pointerEvents='none';new MutationObserver(normalizeHint).observe(hint,{childList:true,characterData:true,subtree:true});window.addEventListener('resize',normalizeHint)}

  const marker=document.createElement('div');marker.className='tap-target';marker.hidden=true;(document.querySelector('#world-map')||world).appendChild(marker);
  let target=null,pendingSpace=false,held=new Set(),moveFrame=0;
  const keyName={left:'ArrowLeft',right:'ArrowRight',up:'ArrowUp',down:'ArrowDown'};
  function fire(key,type){window.dispatchEvent(new KeyboardEvent(type,{key,code:key,bubbles:true,cancelable:true}))}
  function setHeld(wanted){for(const dir of [...held])if(!wanted.has(dir)){fire(keyName[dir],'keyup');held.delete(dir)}for(const dir of wanted)if(!held.has(dir)){fire(keyName[dir],'keydown');held.add(dir)}}
  function stopMove(){target=null;pendingSpace=false;setHeld(new Set());marker.hidden=true;if(moveFrame){cancelAnimationFrame(moveFrame);moveFrame=0}}
  function worldPoint(clientX,clientY){const r=world.getBoundingClientRect();return{x:Math.max(r.left+18,Math.min(r.right-18,clientX)),y:Math.max(r.top+18,Math.min(r.bottom-18,clientY)),left:(clientX-r.left)/r.width*100,top:(clientY-r.top)/r.height*100}}
  function beginMove(clientX,clientY,spaceAfter=false){if(!touchMode()||!game.classList.contains('active'))return;const p=worldPoint(clientX,clientY);target={x:p.x,y:p.y};pendingSpace=spaceAfter;marker.style.left=`${Math.max(2,Math.min(98,p.left))}%`;marker.style.top=`${Math.max(2,Math.min(98,p.top))}%`;marker.hidden=false;if(!moveFrame)moveFrame=requestAnimationFrame(stepMove)}
  function stepMove(){moveFrame=0;if(!target||!game.classList.contains('active')||document.hidden){stopMove();return}const r=player.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,dx=target.x-cx,dy=target.y-cy,dist=Math.hypot(dx,dy);if(dist<20){const interact=pendingSpace;stopMove();if(interact){setTimeout(()=>{fire(' ','keydown');fire(' ','keyup')},30)}return}const wanted=new Set();if(Math.abs(dx)>12)wanted.add(dx<0?'left':'right');if(Math.abs(dy)>12)wanted.add(dy<0?'up':'down');setHeld(wanted);moveFrame=requestAnimationFrame(stepMove)}

  function handleWorldTap(e){if(!touchMode()||!game.classList.contains('active'))return;const interactive=e.target.closest?.('.building,.npc,.shop-zone,button,a,input');if(interactive)return;e.preventDefault();beginMove(e.clientX,e.clientY,false)}
  world.addEventListener('pointerup',handleWorldTap,{passive:false});
  const npc=document.querySelector('#guide-npc');if(npc){npc.style.cursor='pointer';npc.addEventListener('pointerup',e=>{if(!touchMode())return;e.preventDefault();e.stopImmediatePropagation();if(!confirm('도우미 선생님과 이야기할까요?'))return;const r=npc.getBoundingClientRect();beginMove(r.left+r.width/2,r.top+r.height/2,true)},true)}
  window.addEventListener('blur',stopMove);document.addEventListener('visibilitychange',()=>{if(document.hidden)stopMove()});

  function resetTransientUi(){
    if(!game.classList.contains('active'))return;
    document.body.classList.add('student-playing');
    overlay.hidden=true;overlay.style.pointerEvents='none';stopMove();
    for(const selector of ['#building-interior','#student-explore-panel','#study-expedition-stage','.sv-expedition-panel','#customize-panel','#record-panel','#quiz-panel','#dialogue'])document.querySelectorAll(selector).forEach(node=>{node.hidden=true;node.style.pointerEvents='none'});
    document.body.classList.remove('inside-building','near-building-interaction');
    game.style.pointerEvents='auto';world.style.pointerEvents='auto';
    const worldMap=document.querySelector('#world-map');if(worldMap)worldMap.style.pointerEvents='auto';
    document.querySelectorAll('.hud,.hud *,#world .building,#world .npc,#game-screen button,#game-screen a').forEach(node=>{node.style.pointerEvents='auto';if('disabled'in node)node.disabled=false});
    document.querySelectorAll('#world-map .obstacle').forEach(node=>node.classList.remove('obstacle'));
    normalizeHint();
  }
  let wasActive=game.classList.contains('active');new MutationObserver(()=>{const active=game.classList.contains('active');if(active&&!wasActive)requestAnimationFrame(resetTransientUi);if(!active)document.body.classList.remove('student-playing');wasActive=active}).observe(game,{attributes:true,attributeFilter:['class']});if(wasActive)requestAnimationFrame(resetTransientUi);window.addEventListener('studyvillage:session-cleared',()=>{document.body.classList.remove('student-playing');overlay.hidden=true;overlay.style.pointerEvents='none';stopMove()});
})();
