/* Expedition entry preflight.
   Expedition activities require the classroom server because attempt limits, grading and rewards are server-authoritative.
   The preflight allowance response is reused by the expedition hub so one student click causes only one network allowance check.
   A transition lock also prevents repeated taps from starting overlapping expedition sessions. */
(()=>{
  const SELECTOR='#student-explore-panel button[data-expedition]';
  const REQUEST_TIMEOUT_MS=4500,START_LOCK_MS=7000;
  let bypass=false,busy=false,approvedStatus=null,unlockTimer=null;

  const headers=()=>window.StudyVillageAuth?.authHeaders?.()||{};
  const originalFetch=window.fetch.bind(window);
  const activityForButton=button=>{
    const id=String(button?.dataset?.expedition||'');
    if(id==='math-addition-cave'||id==='math-multiplication-dungeon')return'math-arithmetic';
    if(id==='riddle-forest')return'exploration-forest-riddle';
    if(id==='riddle-dungeon')return'exploration-mountain-riddle';
    return'';
  };
  const statusPath=activityId=>`/api/player/me/activity-attempt-status/${encodeURIComponent(activityId)}`;
  function requestUrl(input){try{return typeof input==='string'?new URL(input,location.href):new URL(input?.url||'',location.href)}catch{return null}}
  function consumeApproved(input){
    if(!approvedStatus||Date.now()>approvedStatus.expiresAt){approvedStatus=null;return null}
    const url=requestUrl(input);if(!url||url.pathname!==statusPath(approvedStatus.activityId))return null;
    const cached=approvedStatus;approvedStatus=null;
    return new Response(JSON.stringify(cached.data),{status:200,headers:{'Content-Type':'application/json'}})
  }
  window.fetch=async(input,options)=>consumeApproved(input)||originalFetch(input,options);

  function messageFor(status,code){
    if(status===401||code==='not-authenticated')return'교실 서버 로그인 정보가 만료되었어요. 마을에서 나간 뒤 다시 로그인해 주세요.';
    if(status===404)return'현재 실행 중인 교실 서버가 탐험 참여 확인 기능을 지원하지 않아요. 선생님 프로그램을 최신 버전으로 다시 실행해 주세요.';
    if(status>=500)return'교실 서버가 참여 횟수를 확인하는 중 문제가 생겼어요. 잠시 후 다시 눌러 주세요.';
    return'탐험 참여 횟수를 확인하지 못했어요. 교실 서버 연결을 확인해 주세요.';
  }
  async function fetchStatus(activityId){
    const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),REQUEST_TIMEOUT_MS);
    try{
      const response=await originalFetch(statusPath(activityId),{headers:headers(),cache:'no-store',signal:controller.signal});
      const data=await response.json().catch(()=>({}));
      return{response,data};
    }finally{clearTimeout(timer)}
  }
  async function preflight(button){
    const activityId=activityForButton(button);if(!activityId)return null;
    const authorization=headers().Authorization;
    if(!authorization){
      alert('현재는 교실 서버 계정으로 로그인된 상태가 아니에요. 탐험은 참여 횟수와 보상을 서버에 저장하므로, 선생님 프로그램이 켜진 상태에서 다시 로그인해 주세요.');
      return null;
    }
    const connection=window.StudyVillageConnection;
    if(connection?.requireOnline&&!(await connection.requireOnline()))return null;
    try{
      const {response,data}=await fetchStatus(activityId);
      if(!response.ok||data.ok===false){
        alert(messageFor(response.status,data.code));
        if(response.status===401&&data.code==='not-authenticated')window.StudyVillageAuth?.clearSession?.();
        return null;
      }
      if(!data.allowed){
        alert('이 탐험에 참여할 수 있는 횟수를 모두 사용했어요. 선생님이 추가 도전권을 줄 수 있어요.');
        return null;
      }
      return{activityId,data};
    }catch(error){
      alert(error?.name==='AbortError'?'참여 횟수 확인이 오래 걸리고 있어요. 교실 서버 연결을 확인한 뒤 다시 눌러 주세요.':'탐험 참여 횟수를 확인하지 못했어요. 교실 서버 연결을 확인해 주세요.');
      return null;
    }
  }
  function releaseStartLock(button){
    busy=false;clearTimeout(unlockTimer);unlockTimer=null;
    if(button?.dataset.expeditionStarting==='true'){delete button.dataset.expeditionStarting;button.disabled=false}
  }
  function holdUntilTransition(button){
    busy=true;button.dataset.expeditionStarting='true';button.disabled=true;
    const startedAt=Date.now();
    const check=()=>{
      const hub=document.querySelector('#student-explore-panel'),stage=document.querySelector('#study-expedition-stage');
      if((stage&&!stage.hidden)||(hub&&hub.hidden))return releaseStartLock(button);
      if(Date.now()-startedAt>=START_LOCK_MS)return releaseStartLock(button);
      unlockTimer=setTimeout(check,120)
    };
    unlockTimer=setTimeout(check,120)
  }
  document.addEventListener('click',event=>{
    const button=event.target.closest?.(SELECTOR);if(!button||button.disabled)return;
    if(bypass){bypass=false;return}
    event.preventDefault();event.stopImmediatePropagation();
    if(busy)return;
    busy=true;button.disabled=true;
    (async()=>{
      let handedOff=false;
      try{
        const approved=await preflight(button);
        if(approved){
          approvedStatus={...approved,expiresAt:Date.now()+START_LOCK_MS};
          bypass=true;button.disabled=false;button.click();handedOff=true;holdUntilTransition(button)
        }
      }finally{
        if(!handedOff){busy=false;button.disabled=false}
      }
    })();
  },true);
})();
