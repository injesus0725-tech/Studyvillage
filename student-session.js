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
  notice.textContent='뒤로가기로 종료되지 않아요. 접속 후 🚪 나가기 또는 멀티태스킹 닫기를 사용해 주세요.';
  document.body.appendChild(notice);

  let navigationArmed=false,leaving=false,noticeTimer=0,wasActive=false;
  function active(){return game.classList.contains('active')}
  function armNavigation(force=false){if(navigationArmed&&!force)return;history.replaceState({studyvillageBase:true},'',location.href);history.pushState({studyvillageGuard:true},'',location.href);navigationArmed=true}
  function showBackNotice(){notice.style.opacity='1';notice.style.transform='translate(-50%,0)';clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>{notice.style.opacity='0';notice.style.transform='translate(-50%,12px)'},1800)}
  window.addEventListener('popstate',()=>{if(leaving)return;history.pushState({studyvillageGuard:true},'',location.href);if(active())window.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',code:'Escape',bubbles:true,cancelable:true}));showBackNotice()});
  new MutationObserver(()=>{const now=active();if(now&&!wasActive)armNavigation(true);wasActive=now}).observe(game,{attributes:true,attributeFilter:['class']});
  armNavigation();wasActive=active();
  window.addEventListener('beforeunload',event=>{if(leaving||!active())return;event.preventDefault();event.returnValue='게임을 종료할까요?';return event.returnValue});

  let switching=false;
  function writeInProgress(){
    const mission=document.querySelector('.sv-mission-panel:not([hidden]) .claim:disabled');if(mission&&mission.closest('.sv-mission-card')?.textContent.includes('저장'))return true;
    if(document.querySelector('.sv-collection-panel:not([hidden]) button:disabled'))return true;
    const customizeSave=document.querySelector('#customize-panel:not([hidden]) #customize-save:disabled');if(customizeSave&&document.querySelector('#customize-message')?.textContent.includes('저장'))return true;
    const mathSubmit=document.querySelector('.math-practice-panel:not([hidden]) [data-submit]:disabled');if(mathSubmit&&mathSubmit.closest('.math-practice-card')?.textContent.includes('서버가'))return true;
    const library=document.querySelector('#library-game:not([hidden])');if(library?.querySelector('#library-progress')?.textContent==='완료'&&library.querySelector('#library-next')?.hidden)return true;
    const quiz=document.querySelector('#quiz-panel:not([hidden])');if(quiz?.querySelector('#quiz-progress')?.textContent==='완료'&&quiz.querySelector('#quiz-next')?.hidden)return true;
    const expedition=document.querySelector('.sv-expedition-panel:not([hidden]) .sv-expedition-result');if(expedition&&!expedition.querySelector('button'))return true;
    const discovery=document.querySelector('.sv-discovery-panel:not([hidden]) .primary:disabled');if(discovery&&discovery.closest('.sv-discovery-card')?.textContent.includes('저장'))return true;
    return false;
  }
  function guardWrite(){if(!writeInProgress())return false;alert('기록을 안전하게 저장하고 있어요.\n완료 또는 다시 시도 안내가 나온 뒤 나가 주세요.');return true}
  function syncCompletedChallengeReturn(){
    const quiz=document.querySelector('#quiz-panel:not([hidden])');
    const next=quiz?.querySelector('#quiz-next');
    if(quiz?.querySelector('#quiz-progress')?.textContent==='완료'&&next&&!next.hidden)next.textContent='마을로 돌아가기 🏡';
  }
  const challengeObserver=new MutationObserver(syncCompletedChallengeReturn);
  const quizPanel=document.querySelector('#quiz-panel');if(quizPanel)challengeObserver.observe(quizPanel,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['hidden']});

  button.addEventListener('click',async()=>{
    if(switching)return;
    if(guardWrite())return;
    const name=document.querySelector('#profile-name')?.textContent?.trim()||'현재 학생';
    if(!confirm(`${name} 학생의 사용을 마치고 다른 학생으로 바꿀까요?\n\n이미 저장된 기록과 풀던 문제의 임시 기록은 지워지지 않습니다.\n저장 중인 화면이 있다면 저장 완료 표시를 확인한 뒤 바꾸는 것이 안전합니다.`))return;
    switching=true;
    button.disabled=true;
    button.textContent='학생 바꾸는 중…';
    await window.StudyVillageAuth.logoutSession();
    location.reload();
  });

  exitButton.addEventListener('click',async()=>{
    if(leaving)return;
    if(guardWrite())return;
    const name=document.querySelector('#profile-name')?.textContent?.trim()||'현재 학생';
    if(!confirm(`${name} 학생의 마을 이용을 마칠까요?\n\n저장된 학습 기록은 유지되고 로그인 화면으로 돌아갑니다.`))return;
    leaving=true;
    exitButton.disabled=true;
    exitButton.textContent='나가는 중…';
    await window.StudyVillageAuth.logoutSession();
    location.reload();
  });

  document.addEventListener('click',event=>{
    const completedChallengeNext=event.target.closest('#quiz-panel:not([hidden]) #quiz-next');
    if(completedChallengeNext&&document.querySelector('#quiz-panel #quiz-progress')?.textContent==='완료'){
      event.preventDefault();event.stopImmediatePropagation();
      document.querySelector('#quiz-panel #quiz-close')?.click();
      return;
    }
    const closeActivity=event.target.closest('.math-practice-panel:not([hidden]) .quiz-close,#library-game:not([hidden]) #library-close,#quiz-panel:not([hidden]) #quiz-close');
    if(!closeActivity)return;
    if(writeInProgress()){event.preventDefault();event.stopImmediatePropagation();guardWrite();return}
    const panel=closeActivity.closest('.math-practice-panel,#library-game,#quiz-panel');
    const isQuiz=panel?.id==='quiz-panel';
    const completed=isQuiz?panel?.querySelector('#quiz-progress')?.textContent==='완료':panel?.querySelector('.math-prompt,.library-word')?.textContent?.includes('완료');
    const message=isQuiz?'수수께끼 도전을 닫고 마을로 돌아갈까요?\n\n아직 완료하지 않은 도전은 다음에 처음부터 다시 시작합니다.':'풀던 활동을 닫고 마을로 돌아갈까요?\n\n제출해 저장된 문제까지는 이어하기 기록에 남습니다. 현재 문제에 입력만 하고 아직 제출하지 않은 답은 저장되지 않습니다.';
    if(completed||confirm(message))return;
    event.preventDefault();event.stopImmediatePropagation();
  },true);

  window.addEventListener('keydown',event=>{
    if(event.key!=='Escape')return;
    const closeActivity=document.querySelector('#quiz-panel:not([hidden]) #quiz-close,.math-practice-panel:not([hidden]) .quiz-close,#library-game:not([hidden]) #library-close');
    if(!closeActivity)return;
    event.preventDefault();event.stopImmediatePropagation();closeActivity.click();
  },true);
})();
