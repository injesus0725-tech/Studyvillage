/* v0.9.60 first-visit student guide */
(()=>{
  const game=document.querySelector('#game-screen');
  if(!game)return;
  const style=document.createElement('style');
  style.textContent=`
    .guide-button{border:0;border-radius:12px;padding:8px 11px;background:#fff8d8;color:#69551d;font-weight:900;cursor:pointer;box-shadow:0 2px 8px #0001}
    .welcome-guide{position:fixed;inset:0;z-index:10000;display:grid;place-items:center;padding:18px;background:#17392388;backdrop-filter:blur(3px)}
    .welcome-guide[hidden]{display:none}.welcome-card{width:min(520px,94vw);border-radius:24px;background:#fff;padding:24px;box-shadow:0 20px 60px #10271955;color:#294332}
    .welcome-card .guide-icon{font-size:48px}.welcome-card h2{margin:9px 0 8px;font-size:25px}.welcome-card p{margin:0;color:#65756b;line-height:1.65;font-weight:700}
    .guide-dots{display:flex;gap:6px;margin:18px 0}.guide-dots span{width:9px;height:9px;border-radius:999px;background:#dbe5dc}.guide-dots span.active{width:24px;background:#4d8a5d}
    .guide-actions{display:flex;justify-content:space-between;gap:10px}.guide-actions button{border:0;border-radius:12px;padding:11px 14px;font-weight:900;cursor:pointer}.guide-skip{background:#eef2ee;color:#627068}.guide-next{margin-left:auto;background:#38744a;color:#fff}
    .first-character-choice{position:fixed;inset:0;z-index:10010;display:grid;place-items:center;padding:18px;background:#173923aa;backdrop-filter:blur(4px)}.first-character-choice[hidden]{display:none}.first-character-card{width:min(460px,94vw);padding:25px;border-radius:25px;background:#fffdf7;text-align:center;box-shadow:0 24px 70px #10271966}.first-character-card h2{margin:0 0 7px;color:#315d3b}.first-character-card p{margin:0 0 18px;color:#6d7b70;font-weight:800}.first-character-options{display:grid;grid-template-columns:1fr 1fr;gap:12px}.first-character-options button{min-height:142px;border:3px solid #dfeadb;border-radius:20px;background:#f4f9f1;color:#345d40;font-weight:1000;cursor:pointer}.first-character-options button:active{transform:scale(.98)}.first-character-options span{display:block;width:74px;height:108px;margin:0 auto;line-height:0}.first-character-options span svg{width:100%;height:100%;display:block}.first-character-status{min-height:22px;margin:13px 0 0!important;color:#8b5e24!important;font-size:13px}
    @media(max-width:720px){.guide-button{padding:7px 9px;font-size:12px}.welcome-card{padding:20px}.welcome-card h2{font-size:22px}}
  `;
  document.head.appendChild(style);
  const steps=[
    {icon:'🌳',title:'우리 학습마을에 온 걸 환영해!',text:'마을을 돌아다니며 건물에 들어가 학습 활동에 참여해 보세요. 활동 기록과 성장 내용은 자동으로 저장됩니다.'},
    {icon:'🎮',title:'캐릭터를 움직여 보세요',text:'컴퓨터에서는 방향키 또는 WASD로 움직이고 Space 키로 상호작용해요. 태블릿에서는 화면 아래 방향 버튼과 상호작용 버튼을 사용하면 됩니다.'},
    {icon:'🏫',title:'건물마다 할 일이 달라요',text:'배움터에서는 랜덤 계산 연습, 책마루에서는 어휘·상식 활동을 할 수 있어요. 꾸미기 화면에서는 가지고 있는 아이템을 장착하고 ⭐ 별 상점에서 새 아이템도 살 수 있습니다.'},
    {icon:'⭐',title:'배우면서 성장해요',text:'활동을 마치면 기록과 XP, 별이 쌓여요. 위쪽의 ‘내 기록’에서 활동별 결과와 별 장부를 확인하고, 모은 별은 꾸미기 화면의 ⭐ 별 상점에서 사용할 수 있어요.'}
  ];
  let index=0;
  const overlay=document.createElement('div');overlay.className='welcome-guide';overlay.hidden=true;overlay.innerHTML=`<section class="welcome-card" role="dialog" aria-modal="true" aria-label="마을 이용 안내"><div id="guide-icon" class="guide-icon"></div><h2 id="guide-title"></h2><p id="guide-text"></p><div id="guide-dots" class="guide-dots"></div><div class="guide-actions"><button id="guide-skip" class="guide-skip">나중에 보기</button><button id="guide-next" class="guide-next">다음 ▶</button></div></section>`;document.body.appendChild(overlay);
  const icon=overlay.querySelector('#guide-icon'),title=overlay.querySelector('#guide-title'),text=overlay.querySelector('#guide-text'),dots=overlay.querySelector('#guide-dots'),next=overlay.querySelector('#guide-next'),skip=overlay.querySelector('#guide-skip');
  const choice=document.createElement('div');choice.className='first-character-choice';choice.hidden=true;choice.innerHTML='<section class="first-character-card" role="dialog" aria-modal="true" aria-label="첫 캐릭터 선택"><h2>내 캐릭터를 골라 주세요</h2><p>나중에 꾸미기 화면에서도 다시 바꿀 수 있어요.</p><div class="first-character-options"><button type="button" data-base="student-girl"><span class="base-choice-preview" data-base-preview="student-girl"></span>여자 캐릭터</button><button type="button" data-base="student-boy"><span class="base-choice-preview" data-base-preview="student-boy"></span>남자 캐릭터</button></div><p class="first-character-status" aria-live="polite"></p></section>';document.body.appendChild(choice);const choiceButtons=[...choice.querySelectorAll('button[data-base]')],choiceStatus=choice.querySelector('.first-character-status');
  for(const preview of choice.querySelectorAll('[data-base-preview]'))window.StudyVillageAvatar?.paintBase(preview,preview.dataset.basePreview);
  const profileName=document.querySelector('#profile-name');
  const blockedKeys=new Set(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','a','s','d','W','A','S','D',' ']);
  function playerKey(){const n=(profileName?.textContent||'student').trim();return`studyvillage-guide-seen:${n}`}
  function render(){const s=steps[index];icon.textContent=s.icon;title.textContent=s.title;text.textContent=s.text;dots.innerHTML=steps.map((_,i)=>`<span class="${i===index?'active':''}"></span>`).join('');next.textContent=index===steps.length-1?'마을 시작하기 ✓':'다음 ▶'}
  function open(){index=0;render();overlay.hidden=false}
  function finish(markSeen=true){overlay.hidden=true;if(markSeen)localStorage.setItem(playerKey(),'1')}
  next.addEventListener('click',()=>{if(index<steps.length-1){index++;render()}else finish(true)});
  skip.addEventListener('click',()=>finish(false));
  overlay.addEventListener('click',e=>{if(e.target===overlay)finish(false)});
  window.addEventListener('keydown',e=>{if(!choice.hidden){if(blockedKeys.has(e.key)||e.key==='Escape'||e.key==='Enter'){e.preventDefault();e.stopImmediatePropagation()}return}if(overlay.hidden)return;if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();finish(false);return}if(blockedKeys.has(e.key)){e.preventDefault();e.stopImmediatePropagation()}},true);
  const hudRight=document.querySelector('.hud-right');if(hudRight){const b=document.createElement('button');b.type='button';b.className='guide-button';b.textContent='❔ 마을 안내';b.addEventListener('click',open);hudRight.insertBefore(b,hudRight.firstChild)}
  let shown=false,choosing=false;function showGuideOnce(){if(shown||choosing||!game.classList.contains('active'))return;shown=true;setTimeout(()=>{if(!localStorage.getItem(playerKey()))open()},350)}const observer=new MutationObserver(showGuideOnce);observer.observe(game,{attributes:true,attributeFilter:['class']});
  async function chooseCharacter(baseCharacter){if(!['student-girl','student-boy'].includes(baseCharacter)||choiceButtons.some(button=>button.disabled))return;choiceButtons.forEach(button=>button.disabled=true);choiceStatus.textContent='캐릭터를 저장하고 있어요.';const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),5000);try{const response=await fetch('/api/player/me/equipment',{method:'POST',headers:{'Content-Type':'application/json',...(window.StudyVillageAuth?.authHeaders?.()||{})},body:JSON.stringify({baseCharacter,equipment:{}}),signal:controller.signal}),data=await response.json();if(!response.ok||!data.ok)throw new Error(data.code||'save-failed');window.StudyVillageAvatar?.paintBase(document.querySelector('.player-icon'),baseCharacter);choice.hidden=true;choosing=false;window.dispatchEvent(new Event('studyvillage:activity-record-refresh'));showGuideOnce()}catch(error){choiceStatus.textContent=error?.name==='AbortError'?'저장 시간이 오래 걸려요. 다시 골라 주세요.':'저장하지 못했어요. 교실 서버 연결을 확인해 주세요.'}finally{clearTimeout(timer);choiceButtons.forEach(button=>button.disabled=false)}}
  choiceButtons.forEach(button=>button.addEventListener('click',()=>chooseCharacter(button.dataset.base)));
  window.addEventListener('studyvillage:first-character-choice',()=>{choosing=true;overlay.hidden=true;choiceStatus.textContent='';choice.hidden=false});
})();
