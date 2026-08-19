/* Challenge Hall save bridge: route riddle completions through the activity endpoint so teacher attempt policies are enforced server-side. */
(()=>{
  const data=window.StudyVillageData;if(!data?.savePlayerConfirmed)return;
  const originalSave=data.savePlayerConfirmed.bind(data);
  const auth=()=>window.StudyVillageAuth?.authHeaders?.()||{};
  let active=null;
  const submissionId=()=>globalThis.crypto?.randomUUID?.()||`challenge-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,12)}`;
  window.addEventListener('studyvillage:challenge-selected',event=>{if(event.detail?.type==='riddle')active={submissionId:submissionId(),difficulty:event.detail?.difficulty||'normal'}});
  window.addEventListener('studyvillage:session-cleared',()=>{active=null});
  data.savePlayerConfirmed=async record=>{
    const runner=document.querySelector('#challenge-riddle-runner');
    if(!active||!runner||runner.hidden)return originalSave(record);
    const score=Math.max(0,Math.min(1000,Number(record?.lastScore)||0));
    try{
      const response=await fetch('/api/player/me/activity',{method:'POST',headers:{'Content-Type':'application/json',...auth()},body:JSON.stringify({activityId:'riddle',score,submissionId:active.submissionId})});
      const result=await response.json().catch(()=>({}));
      if(!response.ok||!result.ok){if(response.status===409)window.dispatchEvent(new CustomEvent('studyvillage:challenge-attempt-rejected',{detail:result}));return null}
      const player=await data.loadPlayer(document.querySelector('#profile-name')?.textContent||'');
      if(!player)return null;
      active=null;
      return{...player,rewardStars:Number(result.activityStars)||0,starBalance:Number.isFinite(Number(result.starBalance))?Number(result.starBalance):null,activityRecord:result.record||null};
    }catch{return null}
  };
})();
