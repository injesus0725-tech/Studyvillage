/* Stabilization student activity gate.
   Activity open/close and attempt policies are checked without legacy keyboard/talk-button interception.
   Errors preserve the real HTTP/code category so server, session, policy, and network failures are distinguishable. */
(()=>{
  const activityState=()=>window.StudyVillageActivityState;
  const recordIds={'riddle-demo':'riddle','library-vocabulary':'vocabulary'};
  const REQUEST_TIMEOUT_MS=5000,NOTICE_COOLDOWN_MS=1800;
  let lastNoticeAt=0;const pending=new Set();
  function blockedByPanel(){return[...document.querySelectorAll('#dialogue,#quiz-panel,#record-panel,#customize-panel,#library-game-panel,#building-interior,#student-explore-panel,#study-expedition-stage')].some(el=>el&&!el.hidden)}
  async function timedFetch(url,options={}){const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),REQUEST_TIMEOUT_MS);try{return await fetch(url,{...options,signal:controller.signal})}finally{clearTimeout(timer)}}
  function errorMessage(name,status,code){
    if(status===401||code==='not-authenticated'||code==='session-replaced')return`🔐 ${name} 참여 정보를 확인하려면 학생 로그인이 필요해요.\n마을에 다시 로그인해 주세요.`;
    if(status===404)return`🧩 ${name} 참여 설정 경로를 찾지 못했어요.\n교실 서버 버전을 확인해 주세요.`;
    if(status>=500)return`⚠️ ${name} 참여 설정을 서버에서 읽지 못했어요.\n오류: ${code||`HTTP ${status}`}`;
    return`📡 ${name}의 남은 도전 횟수를 확인할 수 없어요.\n오류: ${code||'network-or-timeout'}`;
  }
  async function checkAttemptLimit(id,name){
    try{
      const headers=window.StudyVillageAuth?.authHeaders?.()||{},recordId=recordIds[id]||id,response=await timedFetch(`/api/player/me/activity-attempt-status/${encodeURIComponent(recordId)}`,{headers,cache:'no-store'}),data=await response.json().catch(()=>({}));
      if(!response.ok||!data.ok)return{ok:false,code:data.code||`http-${response.status}`,status:response.status,message:errorMessage(name,response.status,data.code)};
      if(data.allowed)return{ok:true,remaining:data.remaining,extraAttempts:data.extraAttempts,policy:data.policy,policyId:data.policyId};
      return{ok:false,code:'attempt-limit-reached',status:409,message:`🔒 ${name}의 도전 횟수를 모두 사용했어요.\n선생님이 추가 도전을 허용하면 다시 참여할 수 있어요.`};
    }catch(error){const code=error?.name==='AbortError'?'request-timeout':'network-error';return{ok:false,code,status:0,message:errorMessage(name,0,code)}}
  }
  async function allow(id,name,{silent=false}={}){
    if(pending.has(id))return{ok:false,code:'pending'};pending.add(id);
    try{
      const state=activityState();if(state){const open=await state.requireOpen(id,name);if(!open.ok){if(!silent)notice(open.message);return{ok:false,code:open.code||'activity-closed',message:open.message}}}
      const attempts=await checkAttemptLimit(id,name);if(!attempts.ok&&!silent)notice(attempts.message);return attempts;
    }finally{pending.delete(id)}
  }
  function notice(message){const now=Date.now();if(now-lastNoticeAt<NOTICE_COOLDOWN_MS)return;lastNoticeAt=now;alert(message)}
  window.addEventListener('studyvillage:open-library-game',event=>{if(event.detail?.gateApproved)return;event.stopImmediatePropagation();if(blockedByPanel())return;(async()=>{const result=await allow('library-vocabulary','책마루 · 낱말 뜻 맞추기');if(result.ok)window.dispatchEvent(new CustomEvent('studyvillage:open-library-game',{detail:{gateApproved:true,attemptStatus:result}}))})()});
  window.StudyVillageActivityGate={allow,checkAttemptLimit};
})();
