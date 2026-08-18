/* Student guide only. Mobile interaction stays native; movement uses the built-in mobile controls. */
(()=>{
  const game=document.querySelector('#game-screen');
  if(!game)return;

  const style=document.createElement('style');
  style.textContent=`
    [hidden]{display:none!important}
    #game-screen.active{pointer-events:auto!important;touch-action:manipulation}
    #game-screen.active .hud,#game-screen.active .hud *,#game-screen.active #world,#game-screen.active .building,#game-screen.active .npc{pointer-events:auto!important}
    .guide-button{border:0;border-radius:12px;padding:8px 11px;background:#fff8d8;color:#69551d;font-weight:900;cursor:pointer;box-shadow:0 2px 8px #0001}
    .welcome-guide{position:fixed;inset:0;z-index:10000;display:grid;place-items:center;padding:18px;background:#17392388;backdrop-filter:blur(3px)}
    .welcome-guide[hidden]{display:none!important}
    .welcome-card{width:min(520px,94vw);border-radius:24px;background:#fff;padding:24px;box-shadow:0 20px 60px #10271955;color:#294332}
    .welcome-card .guide-icon{font-size:48px}.welcome-card h2{margin:9px 0 8px;font-size:25px}.welcome-card p{margin:0;color:#65756b;line-height:1.65;font-weight:700}
    .guide-dots{display:flex;gap:6px;margin:18px 0}.guide-dots span{width:9px;height:9px;border-radius:999px;background:#dbe5dc}.guide-dots span.active{width:24px;background:#4d8a5d}
    .guide-actions{display:flex;justify-content:space-between;gap:10px}.guide-actions button{border:0;border-radius:12px;padding:11px 14px;font-weight:900;cursor:pointer;touch-action:manipulation}.guide-skip{background:#eef2ee;color:#627068}.guide-next{margin-left:auto;background:#38744a;color:#fff}
    .teacher-preview-return{position:fixed;left:12px;top:12px;z-index:20000;padding:10px 14px;border-radius:999px;background:#fff;color:#315d3b;font-weight:900;text-decoration:none;box-shadow:0 5px 20px #0003;touch-action:manipulation}
    @media(max-width:720px),(pointer:coarse){
      .control-help{display:none!important}
      .mobile-controls{display:flex!important;pointer-events:auto!important;z-index:120!important}
      .mobile-controls button{pointer-events:auto!important;touch-action:manipulation!important}
      .interaction-hint{display:none!important}.guide-button{padding:7px 9px;font-size:12px}.welcome-card{padding:20px}.welcome-card h2{font-size:22px}.teacher-preview-return{top:8px;left:8px;padding:8px 11px;font-size:12px}
    }
  `;
  document.head.appendChild(style);

  if(new URLSearchParams(location.search).get('teacher-preview')==='1'){
    const back=document.createElement('a');
    back.href='/admin.html';
    back.className='teacher-preview-return';
    back.textContent='← 교사 화면으로';
    document.body.appendChild(back);
  }

  const steps=[
    {icon:'🌳',title:'우리 학습마을에 온 걸 환영해!',text:'마을을 돌아다니며 건물과 탐험 메뉴에서 학습 활동에 참여해 보세요. 활동 기록과 성장 내용은 자동으로 저장됩니다.'},
    {icon:'🎮',title:'화면 아래 이동 버튼을 사용해요',text:'태블릿과 휴대폰에서는 화면 아래 방향 버튼으로 이동합니다. 건물과 메뉴 버튼은 평소처럼 직접 터치하면 됩니다.'},
    {icon:'🏫',title:'건물과 친구를 직접 터치해요',text:'건물이나 마을 친구를 터치하면 확인 메시지가 나타납니다. 확인하면 바로 들어가거나 상호작용할 수 있어요.'},
    {icon:'⭐',title:'배우면서 성장해요',text:'활동을 마치면 기록과 XP가 쌓여요. 내 기록에서 결과를 확인하고 모은 별은 상점과 꾸미기에 사용할 수 있습니다.'}
  ];
  let guideIndex=0;
  const overlay=document.createElement('div');
  overlay.className='welcome-guide';
  overlay.hidden=true;
  overlay.innerHTML=`<section class="welcome-card" role="dialog" aria-modal="true" aria-label="마을 이용 안내"><div id="guide-icon" class="guide-icon"></div><h2 id="guide-title"></h2><p id="guide-text"></p><div id="guide-dots" class="guide-dots"></div><div class="guide-actions"><button id="guide-skip" class="guide-skip" type="button">닫기</button><button id="guide-next" class="guide-next" type="button">다음 ▶</button></div></section>`;
  document.body.appendChild(overlay);
  const icon=overlay.querySelector('#guide-icon'),title=overlay.querySelector('#guide-title'),text=overlay.querySelector('#guide-text'),dots=overlay.querySelector('#guide-dots'),next=overlay.querySelector('#guide-next'),skip=overlay.querySelector('#guide-skip');
  function renderGuide(){const s=steps[guideIndex];icon.textContent=s.icon;title.textContent=s.title;text.textContent=s.text;dots.innerHTML=steps.map((_,i)=>`<span class="${i===guideIndex?'active':''}"></span>`).join('');next.textContent=guideIndex===steps.length-1?'마을로 돌아가기 ✓':'다음 ▶'}
  function openGuide(){guideIndex=0;renderGuide();overlay.hidden=false}
  function finishGuide(){overlay.hidden=true}
  next.addEventListener('click',()=>{if(guideIndex<steps.length-1){guideIndex++;renderGuide()}else finishGuide()});
  skip.addEventListener('click',finishGuide);
  overlay.addEventListener('click',e=>{if(e.target===overlay)finishGuide()});

  const hudRight=document.querySelector('.hud-right');
  if(hudRight&&!hudRight.querySelector('.guide-button')){
    const b=document.createElement('button');b.type='button';b.className='guide-button';b.textContent='❔ 마을 안내';b.addEventListener('click',openGuide);hudRight.insertBefore(b,hudRight.firstChild);
  }

  function clearStaleInlineLocks(){
    if(!game.classList.contains('active'))return;
    for(const selector of ['#game-screen','#world','.hud','.hud button','.hud a','.building','.npc','.mobile-controls','.mobile-controls button','#building-interior','#student-explore-panel','#study-expedition-stage','.sv-expedition-panel','#customize-panel','#record-panel','#quiz-panel','#dialogue']){
      document.querySelectorAll(selector).forEach(node=>node.style.removeProperty('pointer-events'));
    }
  }
  let wasActive=game.classList.contains('active');
  new MutationObserver(()=>{const active=game.classList.contains('active');if(active&&!wasActive)requestAnimationFrame(clearStaleInlineLocks);wasActive=active}).observe(game,{attributes:true,attributeFilter:['class']});
  if(wasActive)requestAnimationFrame(clearStaleInlineLocks);
  window.addEventListener('studyvillage:session-cleared',()=>{overlay.hidden=true});
})();
