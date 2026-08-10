/* v0.9.51 automatic classroom session restoration.
   Restoration runs once per page and cannot double-click the login flow if startup events overlap. */
(()=>{
  const name=document.querySelector('#player-name'),password=document.querySelector('#player-password'),start=document.querySelector('#start-button'),title=document.querySelector('#title-screen'),message=document.querySelector('#name-error');
  if(!name||!password||!start||!title||!window.StudyVillageAuth?.restoreSession)return;
  let restoring=false,finished=false;
  async function restore(){
    if(restoring||finished||!title.classList.contains('active')||name.value||password.value)return;
    restoring=true;
    try{
      const result=await window.StudyVillageAuth.restoreSession();
      if(!result?.ok||!result.name){finished=true;return}
      if(!title.classList.contains('active')||name.value||password.value){finished=true;return}
      if(message)message.textContent='이전 접속을 확인했어요. 마을로 다시 들어갑니다…';
      name.value=result.name;password.value=window.StudyVillageAuth.restoreSentinel||'__studyvillage_restore__';finished=true;start.click();setTimeout(()=>{password.value=''},400);
    }finally{restoring=false}
  }
  setTimeout(restore,250);
})();
