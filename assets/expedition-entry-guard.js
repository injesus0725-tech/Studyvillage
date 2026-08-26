/* Exploration V2 entry/isolation guard. The cave is the only exploration entry point. */
(()=>{
  const EXP_BUTTON='#student-explore-panel button[data-exp]';
  const START_LOCK_MS=7000;
  const headers=()=>window.StudyVillageAuth?.authHeaders?.()||{};
  const visible=selector=>[...document.querySelectorAll(selector)].some(el=>el&&!el.hidden&&el.getClientRects().length>0);
  const explorationOpen=()=>document.body.classList.contains('study-expedition-active')||visible('#student-explore-panel,#study-expedition-stage');
  const otherActivityOpen=()=>visible('#building-interior,#curriculum-learning,.math-practice-panel,#library-game-panel,#library-game,#quiz-panel,#record-panel,#customize-panel,#student-ranking-panel');

  function block(event){event.preventDefault?.();event.stopImmediatePropagation?.()}
  function clearInterior(){
    const interior=document.querySelector('#building-interior');
    if(interior)interior.hidden=true;
    document.body.classList.remove('inside-building');
  }
  function prepareCaveEntry(){
    clearInterior();
    const hub=document.querySelector('#student-explore-panel');
    window.StudyVillagePanels?.closeForeground?.(hub);
    for(const selector of ['#curriculum-learning','.math-practice-panel','#library-game-panel','#library-game','#quiz-panel','#record-panel','#customize-panel','#student-ranking-panel']){
      document.querySelectorAll(selector).forEach(el=>{if(el&&!el.hidden)el.hidden=true});
    }
  }
  function holdUntilTransition(button){
    button.dataset.expeditionStarting='true';
    const started=Date.now();
    const timer=setInterval(()=>{
      const stage=document.querySelector('#study-expedition-stage');
      if((stage&&!stage.hidden)||Date.now()-started>=START_LOCK_MS){clearInterval(timer);delete button.dataset.expeditionStarting}
    },120);
  }

  document.addEventListener('click',event=>{
    const cave=event.target.closest?.('#exploration-cave');
    if(cave){
      if(explorationOpen())return block(event);
      prepareCaveEntry();
      return;
    }

    const expedition=event.target.closest?.(EXP_BUTTON);
    if(expedition){
      if(expedition.disabled)return;
      if(expedition.dataset.expeditionStarting==='true')return block(event);
      if(!headers().Authorization){
        block(event);
        alert('현재는 교실 서버 계정으로 로그인된 상태가 아니에요. 마을에서 나간 뒤 다시 로그인해 주세요.');
        return;
      }
      holdUntilTransition(expedition);
      return;
    }

    if(!explorationOpen())return;
    if(event.target.closest?.('.school,.library,#quiz-hall,.shop-zone,#guide-npc,#talk-button,#customize-button,#record-button,.sv-quick-button.ranking'))block(event);
  },true);

  for(const type of ['studyvillage:open-library-game','studyvillage:open-math-practice','studyvillage:open-curriculum-learning']){
    window.addEventListener(type,event=>{if(explorationOpen())block(event)},true);
  }

  function normalizeTerminalResult(stage){
    const result=stage?.querySelector('[data-stage-result],.sv2-result');
    if(!result||result.hidden||!result.textContent?.includes('참여 횟수가 변경되었어요'))return;
    const button=result.querySelector('button');if(!button||button.dataset.attemptLimitTerminal==='true')return;
    button.dataset.attemptLimitTerminal='true';button.textContent='우리 학습마을로 돌아가기 🏡';
    button.onclick=()=>{stage.hidden=true;const hub=document.querySelector('#student-explore-panel');if(hub)hub.hidden=true;document.body.classList.remove('study-expedition-active');window.dispatchEvent(new Event('studyvillage:return-to-village'));document.querySelector('#exploration-cave')?.focus?.()};
  }
  function install(){const stage=document.querySelector('#study-expedition-stage');if(!stage)return false;const observer=new MutationObserver(()=>normalizeTerminalResult(stage));observer.observe(stage,{subtree:true,childList:true,attributes:true,attributeFilter:['hidden']});normalizeTerminalResult(stage);return true}
  if(!install()){const observer=new MutationObserver(()=>{if(install())observer.disconnect()});observer.observe(document.body,{subtree:true,childList:true})}

  window.addEventListener('studyvillage:return-to-village',()=>{
    document.body.classList.remove('study-expedition-active');
    document.querySelectorAll(`${EXP_BUTTON}[data-expedition-starting]`).forEach(button=>delete button.dataset.expeditionStarting);
  });
})();
