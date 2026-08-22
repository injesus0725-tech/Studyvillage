/* Expedition authentication/result safety. Attempt-limit preflight is owned by student-study-menu.js so one tap performs one allowance request. */
(()=>{
  const SELECTOR='#student-explore-panel button[data-expedition]';
  const headers=()=>window.StudyVillageAuth?.authHeaders?.()||{};
  document.addEventListener('click',event=>{
    const button=event.target.closest?.(SELECTOR);if(!button||button.disabled)return;
    const authorization=headers().Authorization;
    if(!authorization){event.preventDefault();event.stopImmediatePropagation();alert('현재는 교실 서버 계정으로 로그인된 상태가 아니에요. 마을에서 나간 뒤 다시 로그인해 주세요.')}
  },true);

  function normalizeTerminalResult(stage){
    const result=stage?.querySelector('[data-stage-result]');
    if(!result||result.hidden||!result.textContent?.includes('참여 횟수가 변경되었어요'))return;
    const button=result.querySelector('button');if(!button||button.dataset.attemptLimitTerminal==='true')return;
    button.dataset.attemptLimitTerminal='true';button.textContent='우리 학습마을로 돌아가기 🏡';
    button.onclick=()=>{stage.hidden=true;const hub=document.querySelector('#student-explore-panel');if(hub)hub.hidden=true;document.body.classList.remove('study-expedition-active');document.querySelector('.sv-quick-button.explore')?.focus?.()};
  }
  function install(){const stage=document.querySelector('#study-expedition-stage');if(!stage)return false;const observer=new MutationObserver(()=>normalizeTerminalResult(stage));observer.observe(stage,{subtree:true,childList:true,attributes:true,attributeFilter:['hidden']});normalizeTerminalResult(stage);return true}
  if(!install()){const observer=new MutationObserver(()=>{if(install())observer.disconnect()});observer.observe(document.body,{subtree:true,childList:true})}
})();
