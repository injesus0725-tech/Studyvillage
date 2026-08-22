/* Expedition result safety only. Entry preflight is owned by student-study-menu.js so one tap performs one allowance check. */
(()=>{
  function normalizeTerminalResult(stage){
    const result=stage?.querySelector('[data-stage-result]');
    if(!result||result.hidden||!result.textContent?.includes('참여 횟수가 변경되었어요'))return;
    const button=result.querySelector('button');if(!button||button.dataset.attemptLimitTerminal==='true')return;
    button.dataset.attemptLimitTerminal='true';button.textContent='우리 학습마을로 돌아가기 🏡';
    button.onclick=()=>{
      stage.hidden=true;
      const hub=document.querySelector('#student-explore-panel');if(hub)hub.hidden=true;
      document.body.classList.remove('study-expedition-active');
      document.querySelector('.sv-quick-button.explore')?.focus?.();
    };
  }
  function install(){
    const stage=document.querySelector('#study-expedition-stage');if(!stage)return false;
    const observer=new MutationObserver(()=>normalizeTerminalResult(stage));
    observer.observe(stage,{subtree:true,childList:true,attributes:true,attributeFilter:['hidden']});
    normalizeTerminalResult(stage);return true;
  }
  if(!install()){
    const observer=new MutationObserver(()=>{if(install())observer.disconnect()});
    observer.observe(document.body,{subtree:true,childList:true});
  }
})();
