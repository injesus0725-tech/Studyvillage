/* Final safety net for the legacy riddle hall completion flow. Keeps save recovery intact, but guarantees a completed result can return to a clean village state. */
(()=>{
  const quiz=document.querySelector('#quiz-panel');
  if(!quiz)return;
  const progress=()=>document.querySelector('#quiz-progress');
  const next=()=>document.querySelector('#quiz-next');
  const complete=()=>progress()?.textContent?.trim()==='완료';
  let returning=false;
  function cleanupVillage(){
    quiz.hidden=true;
    const interior=document.querySelector('#building-interior');
    if(interior)interior.hidden=true;
    const dialogue=document.querySelector('#dialogue');
    if(dialogue)dialogue.hidden=true;
    document.body.classList.remove('inside-building','near-building-interaction');
    window.dispatchEvent(new Event('studyvillage:return-to-village'));
  }
  function safeReturn(){
    if(returning||!complete())return;
    returning=true;
    try{
      const close=document.querySelector('#quiz-close');
      close?.click();
    }catch{}
    setTimeout(()=>{try{cleanupVillage()}finally{returning=false}},0);
  }
  function arm(){
    const button=next();
    if(!complete()||!button||button.hidden)return;
    button.textContent='결과 확인 완료 · 마을로 돌아가기 🏡';
    button.onclick=safeReturn;
    button.dataset.riddleCompletionReturn='1';
  }
  new MutationObserver(()=>arm()).observe(quiz,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['hidden']});
  document.addEventListener('click',event=>{
    const button=event.target.closest?.('#quiz-next[data-riddle-completion-return="1"]');
    if(!button)return;
    event.preventDefault();
    event.stopImmediatePropagation();
    safeReturn();
  },true);
  window.addEventListener('studyvillage:return-to-village',()=>{if(quiz.hidden)return;const question=document.querySelector('#quiz-question')?.textContent||'';if(complete()&&!question.includes('교실 서버 연결을 기다리고 있어요.'))cleanupVillage()});
})();
