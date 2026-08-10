/* v0.9.12 automatic classroom session restoration */
(()=>{
  const name=document.querySelector('#player-name'),password=document.querySelector('#player-password'),start=document.querySelector('#start-button'),title=document.querySelector('#title-screen'),message=document.querySelector('#name-error');
  if(!name||!password||!start||!title||!window.StudyVillageAuth?.restoreSession)return;
  async function restore(){
    if(!title.classList.contains('active')||name.value||password.value)return;
    const result=await window.StudyVillageAuth.restoreSession();
    if(!result?.ok||!result.name)return;
    if(message)message.textContent='이전 접속을 확인했어요. 마을로 다시 들어갑니다…';
    name.value=result.name;
    password.value=window.StudyVillageAuth.restoreSentinel||'__studyvillage_restore__';
    start.click();
    setTimeout(()=>{password.value=''},400);
  }
  setTimeout(restore,250);
})();
