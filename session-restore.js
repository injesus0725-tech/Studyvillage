/* v0.9.57 automatic classroom session restoration.
   Restoration cannot double-click the login flow, and one temporary startup failure gets one safe reconnect/focus retry while the student has not started typing. */
(()=>{
  const name=document.querySelector('#player-name'),password=document.querySelector('#player-password'),start=document.querySelector('#start-button'),title=document.querySelector('#title-screen'),message=document.querySelector('#name-error');
  if(!name||!password||!start||!title||!window.StudyVillageAuth?.restoreSession)return;
  let restoring=false,finished=false,retryUsed=false,initialAttemptDone=false;
  async function restore({retry=false}={}){
    if(restoring||finished||!title.classList.contains('active')||name.value||password.value)return;
    if(retry&&retryUsed)return;
    if(retry)retryUsed=true;
    restoring=true;
    try{
      const result=await window.StudyVillageAuth.restoreSession();
      initialAttemptDone=true;
      if(!result?.ok||!result.name)return;
      if(!title.classList.contains('active')||name.value||password.value){finished=true;return}
      if(message)message.textContent='이전 접속을 확인했어요. 마을로 다시 들어갑니다…';
      name.value=result.name;password.value=window.StudyVillageAuth.restoreSentinel||'__studyvillage_restore__';finished=true;start.click();setTimeout(()=>{password.value=''},400);
    }finally{restoring=false}
  }
  function retryRestore(){if(!initialAttemptDone||retryUsed||finished||name.value||password.value||!title.classList.contains('active'))return;restore({retry:true})}
  setTimeout(()=>restore(),250);
  window.addEventListener('online',retryRestore);
  window.addEventListener('focus',retryRestore);
})();
