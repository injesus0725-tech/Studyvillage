/* Keep the visible student HUD in sync after server-confirmed activity saves. */
(()=>{
  function applyPlayer(player={}){
    const score=document.querySelector('#profile-score');
    const level=document.querySelector('#profile-level');
    const title=document.querySelector('#profile-title');
    if(score)score.textContent=`${Number(player.totalScore)||0}점`;
    if(level)level.textContent=`Lv.${Number(player.level)||1}`;
    if(title&&player.title)title.textContent=player.title;
  }

  window.addEventListener('studyvillage:library-complete',event=>{
    const player=event.detail?.player;
    if(player)applyPlayer(player);
  });
})();
