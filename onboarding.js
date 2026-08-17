/* Student guide: manual-only so login always enters the playable village immediately. */
(()=>{
  const game=document.querySelector('#game-screen');
  if(!game)return;
  const style=document.createElement('style');
  style.textContent=`
    [hidden]{display:none!important;pointer-events:none!important}
    #game-screen.active{pointer-events:auto!important}
    #game-screen.active .mobile-controls,#game-screen.active .mobile-controls button,#game-screen.active .hud button{pointer-events:auto!important}
    #game-screen.active .mobile-controls button{touch-action:none!important}
    .guide-button{border:0;border-radius:12px;padding:8px 11px;background:#fff8d8;color:#69551d;font-weight:900;cursor:pointer;box-shadow:0 2px 8px #0001}
    .welcome-guide{position:fixed;inset:0;z-index:10000;display:grid;place-items:center;padding:18px;background:#17392388;backdrop-filter:blur(3px)}
    .welcome-guide[hidden]{display:none!important}.welcome-card{width:min(520px,94vw);border-radius:24px;background:#fff;padding:24px;box-shadow:0 20px 60px #10271955;color:#294332}
    .welcome-card .guide-icon{font-size:48px}.welcome-card h2{margin:9px 0 8px;font-size:25px}.welcome-card p{margin:0;color:#65756b;line-height:1.65;font-weight:700}
    .guide-dots{display:flex;gap:6px;margin:18px 0}.guide-dots span{width:9px;height:9px;border-radius:999px;background:#dbe5dc}.guide-dots span.active{width:24px;background:#4d8a5d}
    .guide-actions{display:flex;justify-content:space-between;gap:10px}.guide-actions button{border:0;border-radius:12px;padding:11px 14px;font-weight:900;cursor:pointer;touch-action:manipulation}.guide-skip{background:#eef2ee;color:#627068}.guide-next{margin-left:auto;background:#38744a;color:#fff}
    .teacher-preview-return{position:fixed;left:12px;top:12px;z-index:20000;padding:10px 14px;border-radius:999px;background:#fff;color:#315d3b;font-weight:900;text-decoration:none;box-shadow:0 5px 20px #0003;touch-action:manipulation}
    @media(max-width:720px){.guide-button{padding:7px 9px;font-size:12px}.welcome-card{padding:20px}.welcome-card h2{font-size:22px}.teacher-preview-return{top:8px;left:8px;padding:8px 11px;font-size:12px}}
  `;
  document.head.appendChild(style);
  if(new URLSearchParams(location.search).get('teacher-preview')==='1'){const back=document.createElement('a');back.href='/admin.html';back.className='teacher-preview-return';back.textContent='← 교사 화면으로';document.body.appendChild(back)}
  const steps=[
    {icon:'🌳',title:'우리 학습마을에 온 걸 환영해!',text:'마을을 돌아다니며 건물과 탐험 메뉴에서 학습 활동에 참여해 보세요. 활동 기록과 성장 내용은 자동으로 저장됩니다.'},
    {icon:'🎮',title:'캐릭터를 움직여 보세요',text:'컴퓨터에서는 방향키 또는 WASD로 움직이고 Space 키로 상호작용해요. 태블릿에서는 화면 아래 방향 버튼과 상호작용 버튼을 사용하면 됩니다.'},
    {icon:'🧭',title:'문제 탐험을 떠나 보세요',text:'탐험 버튼을 누르면 수학 동굴, 수수께끼 숲 같은 작은 문제 맵으로 떠날 수 있어요.'},
    {icon:'⭐',title:'배우면서 성장해요',text:'활동을 마치면 기록과 XP가 쌓여요. 내 기록에서 결과를 확인하고 모은 별은 상점과 꾸미기에 사용할 수 있습니다.'}
  ];
  let index=0;
  const overlay=document.createElement('div');overlay.className='welcome-guide';overlay.hidden=true;overlay.innerHTML=`<section class="welcome-card" role="dialog" aria-modal="true" aria-label="마을 이용 안내"><div id="guide-icon" class="guide-icon"></div><h2 id="guide-title"></h2><p id="guide-text"></p><div id="guide-dots" class="guide-dots"></div><div class="guide-actions"><button id="guide-skip" class="guide-skip" type="button">닫기</button><button id="guide-next" class="guide-next" type="button">다음 ▶</button></div></section>`;document.body.appendChild(overlay);
  const icon=overlay.querySelector('#guide-icon'),title=overlay.querySelector('#guide-title'),text=overlay.querySelector('#guide-text'),dots=overlay.querySelector('#guide-dots'),next=overlay.querySelector('#guide-next'),skip=overlay.querySelector('#guide-skip');
  function render(){const s=steps[index];icon.textContent=s.icon;title.textContent=s.title;text.textContent=s.text;dots.innerHTML=steps.map((_,i)=>`<span class="${i===index?'active':''}"></span>`).join('');next.textContent=index===steps.length-1?'마을로 돌아가기 ✓':'다음 ▶'}
  function open(){index=0;render();overlay.hidden=false}
  function finish(){overlay.hidden=true}
  next.addEventListener('click',()=>{if(index<steps.length-1){index++;render()}else finish()});
  skip.addEventListener('click',finish);
  overlay.addEventListener('click',e=>{if(e.target===overlay)finish()});
  window.addEventListener('keydown',e=>{if(overlay.hidden)return;if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();finish()}},true);
  const hudRight=document.querySelector('.hud-right');if(hudRight){const b=document.createElement('button');b.type='button';b.className='guide-button';b.textContent='❔ 마을 안내';b.addEventListener('click',open);hudRight.insertBefore(b,hudRight.firstChild)}

  function touchUiVisible(){const controls=document.querySelector('.mobile-controls');return !!controls&&getComputedStyle(controls).display!=='none'}
  const hint=document.querySelector('#interaction-hint');
  function normalizeTouchHint(){if(!hint||!touchUiVisible())return;const current=hint.textContent||'';if(current.includes('수수께끼'))hint.textContent='✨ 상호작용 버튼으로 수수께끼 시작하기';else if(current.includes('도우미 선생님'))hint.textContent='✨ 상호작용 버튼으로 도우미 선생님과 이야기하기'}
  if(hint){new MutationObserver(normalizeTouchHint).observe(hint,{childList:true,characterData:true,subtree:true});window.addEventListener('resize',normalizeTouchHint)}

  /* Android/Samsung classroom browsers sometimes miss PointerEvent capture. Feed the existing keyboard path directly from touch events, without a repeating timer. */
  const heldTouchKeys=new Map();
  const fireKey=(key,type)=>window.dispatchEvent(new KeyboardEvent(type,{key,code:key,bubbles:true,cancelable:true}));
  function touchPress(button,event){if(!game.classList.contains('active'))return;event.preventDefault();const key=button.dataset.key;if(!key||heldTouchKeys.has(button))return;fireKey(key,'keydown');const safety=setTimeout(()=>touchRelease(button),900);heldTouchKeys.set(button,{key,safety})}
  function touchRelease(button,event){event?.preventDefault?.();const held=heldTouchKeys.get(button);if(!held)return;clearTimeout(held.safety);heldTouchKeys.delete(button);fireKey(held.key,'keyup')}
  document.querySelectorAll('.mobile-controls button[data-key]').forEach(button=>{button.addEventListener('touchstart',event=>touchPress(button,event),{passive:false});button.addEventListener('touchend',event=>touchRelease(button,event),{passive:false});button.addEventListener('touchcancel',event=>touchRelease(button,event),{passive:false})});
  window.addEventListener('blur',()=>{for(const [button,held] of heldTouchKeys){clearTimeout(held.safety);fireKey(held.key,'keyup')}heldTouchKeys.clear()});
  const talk=document.querySelector('#talk-button');if(talk){talk.addEventListener('touchstart',event=>{if(!game.classList.contains('active'))return;event.preventDefault();fireKey(' ','keydown');fireKey(' ','keyup')},{passive:false})}

  function resetTransientUi(){
    if(!game.classList.contains('active'))return;
    overlay.hidden=true;
    for(const selector of ['#building-interior','#student-explore-panel','#study-expedition-stage','.sv-expedition-panel','#customize-panel','#record-panel','#quiz-panel','#dialogue'])document.querySelectorAll(selector).forEach(node=>{node.hidden=true});
    document.body.classList.remove('inside-building','near-building-interaction');
    game.style.pointerEvents='auto';
    document.querySelectorAll('.mobile-controls button,.hud button').forEach(button=>{button.style.pointerEvents='auto';button.disabled=false});
    document.querySelectorAll('#world-map .obstacle').forEach(node=>node.classList.remove('obstacle'));
    normalizeTouchHint();
  }
  let wasActive=game.classList.contains('active');
  new MutationObserver(()=>{const active=game.classList.contains('active');if(active&&!wasActive)requestAnimationFrame(resetTransientUi);wasActive=active}).observe(game,{attributes:true,attributeFilter:['class']});
  if(wasActive)requestAnimationFrame(resetTransientUi);
  window.addEventListener('studyvillage:session-cleared',()=>{overlay.hidden=true});
  /* Never open a modal automatically after login. Character choice stays available from 꾸미기. */
})();
