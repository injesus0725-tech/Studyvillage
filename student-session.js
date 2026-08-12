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
})();
