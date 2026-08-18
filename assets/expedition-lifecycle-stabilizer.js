/* Stabilization: keep expedition enter/exit/complete transitions clean and free of stale movement/discovery state. */
(()=>{
  const stage=document.querySelector('#study-expedition-stage'),hub=document.querySelector('#student-explore-panel');if(!stage)return;
  const cleanup=()=>{window.StudyVillageExpeditionMovement?.stop?.();for(const find of stage.querySelectorAll('.sv-stage-find'))find.remove();document.body.classList.toggle('study-expedition-active',!stage.hidden);if(stage.hidden){stage.querySelector('[data-stage-question]')?.setAttribute('hidden','');stage.querySelector('[data-stage-result]')?.setAttribute('hidden','')}};
  new MutationObserver(cleanup).observe(stage,{attributes:true,attributeFilter:['hidden'],childList:true,subtree:false});
  stage.addEventListener('click',event=>{if(event.target.closest('[data-stage-exit]'))window.StudyVillageExpeditionMovement?.stop?.()},true);
  hub?.addEventListener('click',event=>{if(event.target.closest('[data-hub-close]'))window.StudyVillageExpeditionMovement?.stop?.()},true);
  window.addEventListener('studyvillage:session-cleared',()=>{stage.hidden=true;if(hub)hub.hidden=true;cleanup()});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)window.StudyVillageExpeditionMovement?.stop?.()});
  cleanup();
})();
