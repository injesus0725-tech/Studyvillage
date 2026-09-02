/* Keep students from being trapped when a scored activity result cannot reach the classroom server. */
(()=>{
  const addCurriculumExit=()=>{
    const panel=document.querySelector('#curriculum-learning');
    if(!panel||panel.hidden)return;
    const body=panel.querySelector('[data-body]');
    if(!body||!body.textContent?.includes('결과를 저장하지 못했어요.')||body.querySelector('[data-save-recovery-back]'))return;
    const retry=body.querySelector('.curriculum-next');
    if(!retry)return;
    const back=document.createElement('button');
    back.type='button';back.className='curriculum-next';back.dataset.saveRecoveryBack='1';back.textContent='마을로 돌아가기 🏡';back.style.marginLeft='8px';
    back.onclick=()=>window.StudyVillageCurriculumLearning?.close?.();
    retry.after(back);
  };
  new MutationObserver(addCurriculumExit).observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['hidden']});
  addCurriculumExit();
  window.StudyVillageActivitySaveRecovery={refresh:addCurriculumExit};
})();
