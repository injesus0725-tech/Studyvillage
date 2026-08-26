/* Final V1 exploration subject UI adapter.
   Keeps the proven V2 adventure/reward/save engine, but feeds the integrated
   Social + Science + Arts question pool into its legacy random entry. */
(()=>{
  const hub=document.querySelector('#student-explore-panel');
  if(!hub)return;
  const list=hub.querySelector('.sv2-exp-list'),filters=hub.querySelector('.sv2-filters');
  if(!list||!filters)return;

  const LABEL='사회·과학·예체능';
  const stage=()=>document.querySelector('#study-expedition-stage');
  let integratedRun=false;

  const selectedSubject=()=>filters.querySelector('button.selected')?.dataset.subject||'all';
  const hideLegacy=()=>{
    /* Keep the legacy cards in the DOM as private engine entry points. Removing
       random made the integrated card lose its path into the V2 closure. */
    list.querySelectorAll('[data-exp="social"],[data-exp="science"],[data-exp="random"]').forEach(el=>{el.hidden=true;el.setAttribute('aria-hidden','true')});
    filters.querySelectorAll('[data-subject="사회"],[data-subject="과학"],[data-subject="랜덤"]').forEach(el=>el.remove());
  };
  const ensureFilter=()=>{
    if(filters.querySelector('[data-subject="integrated"]'))return;
    const b=document.createElement('button');b.type='button';b.dataset.subject='integrated';b.textContent=LABEL;
    const riddle=filters.querySelector('[data-subject="수수께끼"]');filters.insertBefore(b,riddle||null);
  };
  const sourceButton=()=>list.querySelector('[data-exp="random"],[data-exp="social"],[data-exp="science"]')||list.querySelector('.sv2-exp');

  function labelIntegratedRun(){
    if(!integratedRun)return;
    const s=stage();if(!s||s.hidden)return;
    const title=s.querySelector('[data-title]'),subject=s.querySelector('[data-subject]'),result=s.querySelector('[data-result]');
    if(title)title.textContent=`🌏 ${LABEL} 탐험`;
    if(subject)subject.textContent=`${LABEL} · 선택형 랜덤 탐험`;
    if(result&&!result.hidden){
      const h=result.querySelector('h3');
      if(h&&h.textContent.includes('랜덤의 숲'))h.textContent=h.textContent.replace('랜덤의 숲',`${LABEL} 탐험`);
    }
  }

  function runIntegrated(pool,button){
    const legacy=list.querySelector('[data-exp="random"]');
    if(!legacy||pool.length<5)return;

    const originalSets=window.StudyVillageQuestionSets;
    const originalDisabled=legacy.disabled;
    let restored=false;
    integratedRun=true;
    if(button)button.disabled=true;

    /* qSource(random) is private to V2. During the short async start window,
       expose only these already-filtered five questions; V2 then owns the rest
       of the run exactly as before (NPCs, first-answer scoring, rewards, save). */
    window.StudyVillageQuestionSets={
      __integratedExplorationBridge:{
        subject:LABEL,
        spaces:['exploration'],
        questions:pool.map(q=>({...q,spaces:Array.from(new Set([...(q.spaces||[]),'exploration']))}))
      }
    };
    legacy.disabled=false;

    const restore=()=>{
      if(restored)return;restored=true;
      window.StudyVillageQuestionSets=originalSets;
      legacy.disabled=originalDisabled;
      if(button)button.disabled=false;
      labelIntegratedRun();
    };
    const s=stage();
    const observer=s?new MutationObserver(()=>{if(!s.hidden){observer.disconnect();restore()}}):null;
    observer?.observe(s,{attributes:true,attributeFilter:['hidden']});
    setTimeout(()=>{observer?.disconnect();restore()},8500);
    legacy.click();
  }

  const makeIntegrated=()=>{
    let b=list.querySelector('[data-exp="integrated"]');
    const api=window.StudyVillageExplorationSubjectPools;
    const enough=api?.has?.('integrated',5)===true;
    if(!b){
      const template=sourceButton();if(!template)return;
      b=template.cloneNode(true);b.dataset.exp='integrated';list.appendChild(b);
    }
    b.hidden=!['all','integrated'].includes(selectedSubject());
    b.removeAttribute('aria-hidden');
    b.disabled=!enough;b.classList.toggle('locked',!enough);
    b.innerHTML=`<span>🌏</span><div><b>${LABEL} 탐험</b><small>${enough?'선생님이 체크한 사회·과학 단원과 음악·예체능 문제를 섞어 5문제':'선택한 단원의 탐험 문제가 아직 부족해요'}</small><em>${enough?'탐험 출발 ▶':'🔒 지금은 닫힘'}</em></div>`;
    b.onclick=ev=>{
      ev.preventDefault();ev.stopPropagation();
      const pool=api?.pool?.('integrated',5)||[];
      if(pool.length<5)return;
      runIntegrated(pool,b);
    };
  };

  const refresh=()=>{ensureFilter();makeIntegrated();hideLegacy()};
  const observer=new MutationObserver(()=>{observer.disconnect();refresh();observer.observe(list,{childList:true})});
  refresh();observer.observe(list,{childList:true});

  /* V2 does not know the synthetic 'integrated' filter. Handle that one in
     capture phase so its own filter handler cannot redraw the list to empty. */
  filters.addEventListener('click',e=>{
    const b=e.target.closest('[data-subject="integrated"]');if(!b)return;
    e.preventDefault();e.stopImmediatePropagation();
    filters.querySelectorAll('button').forEach(x=>x.classList.toggle('selected',x===b));
    refresh();
    list.querySelectorAll('.sv2-exp').forEach(x=>{x.hidden=x.dataset.exp!=='integrated'});
  },true);

  const runObserver=new MutationObserver(()=>{
    labelIntegratedRun();
    const s=stage();
    if(integratedRun&&s?.hidden){
      const result=s.querySelector('[data-result]');
      if(!result||result.hidden)integratedRun=false;
    }
  });
  const s=stage();if(s)runObserver.observe(s,{subtree:true,childList:true,attributes:true,attributeFilter:['hidden']});
})();
