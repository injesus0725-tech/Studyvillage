/* Student guide: manual-only so login always enters the playable village immediately. */
(()=>{
  const game=document.querySelector('#game-screen');
  if(!game)return;
  const style=document.createElement('style');
  style.textContent=`
    .guide-button{border:0;border-radius:12px;padding:8px 11px;background:#fff8d8;color:#69551d;font-weight:900;cursor:pointer;box-shadow:0 2px 8px #0001}
    .welcome-guide{position:fixed;inset:0;z-index:10000;display:grid;place-items:center;padding:18px;background:#17392388;backdrop-filter:blur(3px)}
    .welcome-guide[hidden]{display:none!important}.welcome-card{width:min(520px,94vw);border-radius:24px;background:#fff;padding:24px;box-shadow:0 20px 60px #10271955;color:#294332}
    .welcome-card .guide-icon{font-size:48px}.welcome-card h2{margin:9px 0 8px;font-size:25px}.welcome-card p{margin:0;color:#65756b;line-height:1.65;font-weight:700}
    .guide-dots{display:flex;gap:6px;margin:18px 0}.guide-dots span{width:9px;height:9px;border-radius:999px;background:#dbe5dc}.guide-dots span.active{width:24px;background:#4d8a5d}
    .guide-actions{display:flex;justify-content:space-between;gap:10px}.guide-actions button{border:0;border-radius:12px;padding:11px 14px;font-weight:900;cursor:pointer;touch-action:manipulation}.guide-skip{background:#eef2ee;color:#627068}.guide-next{margin-left:auto;background:#38744a;color:#fff}
    @media(max-width:720px){.guide-button{padding:7px 9px;font-size:12px}.welcome-card{padding:20px}.welcome-card h2{font-size:22px}}
  `;
  document.head.appendChild(style);
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
  /* Important: never open a modal automatically after login. First character choice is handled later from 꾸미기. */
})();
