/* Refresh teacher question activation immediately before entering curriculum, Bookmaru, or exploration. */
(()=>{
  let refreshing=null;
  const refresh=()=>{
    const api=window.StudyVillageStudentQuestionOverrides;
    if(!api?.refresh)return Promise.resolve();
    if(!refreshing)refreshing=Promise.resolve(api.refresh()).catch(()=>null).finally(()=>{refreshing=null});
    return refreshing;
  };
  const replayEvent=type=>{
    const event=new CustomEvent(type);
    Object.defineProperty(event,'__svCatalogRefreshed',{value:true});
    window.dispatchEvent(event);
  };
  for(const type of ['studyvillage:open-library-game','studyvillage:open-curriculum-learning']){
    window.addEventListener(type,event=>{
      if(event.__svCatalogRefreshed)return;
      event.preventDefault?.();
      event.stopImmediatePropagation();
      refresh().finally(()=>replayEvent(type));
    },true);
  }
  document.addEventListener('click',event=>{
    const cave=event.target.closest?.('#exploration-cave');
    if(!cave||cave.dataset.catalogRefreshBypass==='1')return;
    event.preventDefault();
    event.stopImmediatePropagation();
    refresh().finally(()=>{
      cave.dataset.catalogRefreshBypass='1';
      try{cave.click()}finally{delete cave.dataset.catalogRefreshBypass}
    });
  },true);
  /* The hub may remain open while the teacher changes unit checks. Refresh again at
     the actual expedition start, redraw the hub from the fresh catalog, then replay
     the same expedition button. An expedition already in progress is never touched. */
  document.addEventListener('click',event=>{
    const button=event.target.closest?.('#student-explore-panel button[data-exp]');
    if(!button||button.dataset.catalogRefreshBypass==='1')return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const id=button.dataset.exp;
    refresh().finally(()=>{
      const selected=document.querySelector('#student-explore-panel .sv2-filters button.selected');
      selected?.click();
      const fresh=[...document.querySelectorAll('#student-explore-panel button[data-exp]')].find(item=>item.dataset.exp===id);
      if(!fresh||fresh.disabled)return;
      fresh.dataset.catalogRefreshBypass='1';
      try{fresh.click()}finally{delete fresh.dataset.catalogRefreshBypass}
    });
  },true);
  window.StudyVillageQuestionCatalogLiveRefresh={refresh};
})();
