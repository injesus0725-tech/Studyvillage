/* Keep the visible student HUD in sync after server-confirmed activity saves and serialize riddle result retries. */
(()=>{
  function applyPlayer(player={}){
    const score=document.querySelector('#profile-score');
    const level=document.querySelector('#profile-level');
    const title=document.querySelector('#profile-title');
    if(score)score.textContent=`${Number(player.totalScore)||0}점`;
    if(level)level.textContent=`Lv.${Number(player.level)||1}`;
    if(title&&player.title)title.textContent=player.title;
    window.dispatchEvent(new CustomEvent('studyvillage:player-confirmed',{detail:{player}}));
  }

  window.addEventListener('studyvillage:library-complete',event=>{
    const player=event.detail?.player;
    if(player){applyPlayer(player);window.dispatchEvent(new Event('studyvillage:ranking-refresh'))}
    else refreshConfirmedPlayer();
  });

  let profileRefresh=null;
  async function refreshConfirmedPlayer(){
    if(profileRefresh)return profileRefresh;
    profileRefresh=(async()=>{const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),5000);try{const response=await fetch('/api/player/me',{headers:window.StudyVillageAuth?.authHeaders?.()||{},cache:'no-store',signal:controller.signal});if(!response.ok)return;const data=await response.json();if(data.ok&&data.player){applyPlayer(data.player);window.dispatchEvent(new Event('studyvillage:ranking-refresh'))}}catch{}finally{clearTimeout(timeout)}})();
    try{return await profileRefresh}finally{profileRefresh=null}
  }
  window.addEventListener('studyvillage:activity-record-refresh',refreshConfirmedPlayer);

  // The legacy riddle saves through StudyVillageData.savePlayer rather than the
  // newer activity endpoint.  A server-confirmed riddle response always carries
  // rewardStars; the offline pending snapshot does not.  Refresh only after the
  // confirmed response so an outage never makes the HUD claim an unsaved result.
  const data=window.StudyVillageData;
  if(data?.savePlayer&&!data.__riddleRefreshWrapped){
    const originalSave=data.savePlayer.bind(data);
    data.savePlayer=async(...args)=>{
      const player=await originalSave(...args);
      if(player&&Object.prototype.hasOwnProperty.call(player,'rewardStars')){
        applyPlayer(player);
        window.dispatchEvent(new Event('studyvillage:activity-record-refresh'));
        window.dispatchEvent(new Event('studyvillage:ranking-refresh'));
        window.dispatchEvent(new Event('studyvillage:stars-refresh'));
      }
      return player;
    };
    Object.defineProperty(data,'__riddleRefreshWrapped',{value:true});
  }

  const quizNext=document.querySelector('#quiz-next');
  let retryingRiddleResult=false;
  quizNext?.addEventListener('click',event=>{
    if(quizNext.textContent!=='결과 다시 저장하기 ↻'||typeof quizNext.onclick!=='function')return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if(retryingRiddleResult)return;
    retryingRiddleResult=true;
    quizNext.disabled=true;
    const retry=quizNext.onclick;
    Promise.resolve(retry.call(quizNext,event)).finally(()=>{
      retryingRiddleResult=false;
      quizNext.disabled=false;
    });
  },true);
})();