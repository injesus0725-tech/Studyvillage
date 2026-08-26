/* Final V1 exploration subject UI adapter.
   Runs after student-exploration-v2 and keeps its adventure/reward engine untouched. */
(()=>{
  const hub=document.querySelector('#student-explore-panel');
  if(!hub)return;
  const list=hub.querySelector('.sv2-exp-list'),filters=hub.querySelector('.sv2-filters');
  if(!list||!filters)return;

  const LABEL='사회·과학·예체능';
  const hideLegacy=()=>{
    list.querySelectorAll('[data-exp="social"],[data-exp="science"],[data-exp="random"]').forEach(el=>el.remove());
    filters.querySelectorAll('[data-subject="사회"],[data-subject="과학"],[data-subject="랜덤"]').forEach(el=>el.remove());
  };
  const ensureFilter=()=>{
    if(filters.querySelector('[data-subject="integrated"]'))return;
    const b=document.createElement('button');b.type='button';b.dataset.subject='integrated';b.textContent=LABEL;
    const riddle=filters.querySelector('[data-subject="수수께끼"]');filters.insertBefore(b,riddle||null);
  };
  const sourceButton=()=>list.querySelector('[data-exp="social"],[data-exp="science"],[data-exp="random"]');
  const makeIntegrated=()=>{
    if(list.querySelector('[data-exp="integrated"]'))return;
    const api=window.StudyVillageExplorationSubjectPools;
    const enough=api?.has?.('integrated',5)===true;
    const template=sourceButton()||list.querySelector('.sv2-exp');
    if(!template)return;
    const b=template.cloneNode(true);b.dataset.exp='integrated';b.disabled=!enough;b.classList.toggle('locked',!enough);
    b.innerHTML=`<span>🌏</span><div><b>${LABEL} 탐험</b><small>${enough?'선생님이 체크한 사회·과학 단원과 음악 이론을 섞어 5문제':'선택한 단원의 탐험 문제가 아직 부족해요'}</small><em>${enough?'탐험 출발 ▶':'🔒 지금은 닫힘'}</em></div>`;
    b.onclick=()=>{
      const pool=api?.pool?.('integrated',5)||[];
      if(pool.length<5)return;
      /* The V2 engine owns its private session state, so dispatch through its legacy random card
         after temporarily supplying the already-filtered integrated pool. */
      const legacy=list.querySelector('[data-exp="random"]');
      if(legacy){legacy.click();return;}
      window.dispatchEvent(new CustomEvent('studyvillage:exploration-integrated',{detail:{questions:pool}}));
    };
    list.appendChild(b);
  };
  const refresh=()=>{makeIntegrated();hideLegacy();ensureFilter()};
  const observer=new MutationObserver(()=>{observer.disconnect();refresh();observer.observe(list,{childList:true})});
  refresh();observer.observe(list,{childList:true});

  filters.addEventListener('click',e=>{
    const b=e.target.closest('[data-subject="integrated"]');if(!b)return;
    filters.querySelectorAll('button').forEach(x=>x.classList.toggle('selected',x===b));
    queueMicrotask(()=>{refresh();list.querySelectorAll('.sv2-exp').forEach(x=>{x.hidden=x.dataset.exp!=='integrated'})});
  },true);
})();
