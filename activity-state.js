/* v0.9.35 shared activity availability foundation.
   Activities default to open when the server does not yet expose a state endpoint.
   This module gives every learning activity one place to check whether it may start/resume
   and one consistent student-facing closed message. */
window.StudyVillageActivityState=(()=>{
  const cache=new Map();
  const REQUEST_TIMEOUT_MS=3000;
  function normalize(id,name='학습 활동',state={}){
    return{
      activityId:String(id||''),
      name:String(state.name||name||'학습 활동'),
      open:state.open!==false,
      message:String(state.message||''),
      updatedAt:state.updatedAt||null
    };
  }
  async function timedFetch(url){
    const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),REQUEST_TIMEOUT_MS);
    try{return await fetch(url,{cache:'no-store',headers:window.StudyVillageAuth?.authHeaders?.()||{},signal:controller.signal})}
    finally{clearTimeout(timer)}
  }
  async function get(activityId,name){
    const id=String(activityId||'').trim();if(!id)return normalize('',name);
    try{
      const r=await timedFetch(`/api/activity-state/${encodeURIComponent(id)}`);
      if(r.ok){const d=await r.json(),value=normalize(id,name,d.activity||d);cache.set(id,value);return value}
    }catch{}
    return cache.get(id)||normalize(id,name);
  }
  function closedText(state){
    const s=normalize(state?.activityId,state?.name,state);
    return s.message||`🔒 ${s.name}은(는) 문을 닫았습니다.\n선생님이 활동을 종료했어요. 다음 모험을 기다려 주세요!`;
  }
  async function requireOpen(activityId,name){
    const state=await get(activityId,name);return{ok:state.open,state,message:state.open?'':closedText(state)};
  }
  function remember(activityId,state){const id=String(activityId||'').trim();if(id)cache.set(id,normalize(id,state?.name,state))}
  return{get,requireOpen,closedText,remember};
})();