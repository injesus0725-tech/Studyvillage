/* v1.9 shared-tablet student switch control.
   Clears only the current login session; saved activity checkpoints remain available to the same student. */
(()=>{
  const game=document.querySelector('#game-screen');
  const hudRight=document.querySelector('.hud-right');
  if(!game||!hudRight||!window.StudyVillageAuth?.clearSession)return;

  const button=document.createElement('button');
  button.id='student-switch-button';
  button.className='record-button';
  button.textContent='👤 학생 바꾸기';
  button.title='현재 학생의 로그인을 끝내고 다른 학생이 로그인합니다.';
  const profile=hudRight.querySelector('.player-profile');
  if(profile)hudRight.insertBefore(button,profile);else hudRight.appendChild(button);

  const exitButton=document.createElement('button');
  exitButton.id='student-exit-button';
  exitButton.className='record-button';
  exitButton.textContent='🚪 나가기';
  exitButton.title='확인 후 현재 학생의 마을 이용을 마칩니다.';
  hudRight.insertBefore(exitButton,button);

  const notice=document.createElement('div');
  notice.id='student-back-notice';
  notice.setAttribute('role','status');
  notice.setAttribute('aria-live','polite');
  notice.style.cssText='position:fixed;left:50%;bottom:105px;z-index:12000;transform:translate(-50%,12px);padding:10px 15px;border-radius:999px;background:#203f2eea;color:#fff;font-size:13px;font-weight:900;opacity:0;pointer-events:none;transition:.2s';
  notice.textContent='마을을 나가려면 위쪽의 🚪 나가기를 눌러 주세요.';
  document.body.appendChild(notice);

  let navigationArmed=false,leaving=false,noticeTimer=0;
  function active(){return game.classList.contains('active')}
  function armNavigation(){if(navigationArmed||!active())return;history.pushState({studyvillageGuard:true},'',location.href);navigationArmed=true}
  function showBackNotice(){notice.style.opacity='1';notice.style.transform='translate(-50%,0)';clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>{notice.style.opacity='0';notice.style.transform='translate(-50%,12px)'},1800)}
  window.addEventListener('popstate',()=>{if(leaving||!active())return;history.pushState({studyvillageGuard:true},'',location.href);window.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',code:'Escape',bubbles:true,cancelable:true}));showBackNotice()});
  new MutationObserver(armNavigation).observe(game,{attributes:true,attributeFilter:['class']});

  let switching=false;
  button.addEventListener('click',()=>{
    if(switching)return;
    const name=document.querySelector('#profile-name')?.textContent?.trim()||'현재 학생';
    if(!confirm(`${name} 학생의 사용을 마치고 다른 학생으로 바꿀까요?\n\n이미 저장된 기록과 풀던 문제의 임시 기록은 지워지지 않습니다.\n저장 중인 화면이 있다면 저장 완료 표시를 확인한 뒤 바꾸는 것이 안전합니다.`))return;
    switching=true;
    button.disabled=true;
    button.textContent='학생 바꾸는 중…';
    window.StudyVillageAuth.clearSession();
    location.reload();
  });

  exitButton.addEventListener('click',()=>{
    if(leaving)return;
    const name=document.querySelector('#profile-name')?.textContent?.trim()||'현재 학생';
    if(!confirm(`${name} 학생의 마을 이용을 마칠까요?\n\n저장된 학습 기록은 유지되고 로그인 화면으로 돌아갑니다.`))return;
    leaving=true;
    exitButton.disabled=true;
    exitButton.textContent='나가는 중…';
    window.StudyVillageAuth.clearSession();
    location.reload();
  });
})();
