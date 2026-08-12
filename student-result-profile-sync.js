/* Keep the visible student HUD in sync after server-confirmed activity saves and serialize riddle result retries. */
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
