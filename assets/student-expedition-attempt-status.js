/* Stabilization: show live expedition attempt availability in the student hub without changing expedition gameplay. */
(()=>{
  const IDS=['exploration-forest-riddle','exploration-mountain-riddle','math-arithmetic'];
  const cache=new Map(),auth=()=>window.StudyVillageAuth?.authHeaders?.()||{};
  const statusText=data=>{
    if(!data?.ok)return '참여 상태 확인 필요';
    if(data.policy?.mode==='unlimited'||data.remaining===null)return '♾️ 자유롭게 도전';
    const extra=Math.max(0,Number(data.extraAttempts)||0),remaining=Math.max(0,Number(data.remaining)||0),daily=data.policy?.period==='daily';
    if(!data.allowed)return `🔒 ${daily?'오늘 ':''}도전 횟수 사용 완료`;
    return `🎟️ ${daily?'오늘 ':''}${remaining}회 남음${extra?` · 추가 ${extra}회 포함`:''}`;
  };
  async function read(activityId){
    try{const response=await fetch(`/api/player/me/activity-attempt-status/${encodeURIComponent(activityId)}`,{headers:auth(),cache:'no-store'}),data=await response.json().catch(()=>({}));return response.ok&&data.ok?data:{ok:false,status:response.status,code:data.code||`http-${response.status}`}}catch(error){return{ok:false,status:0,code:error?.name==='AbortError'?'request-timeout':'network-error'}}
  }
  function activityForCard(card){const id=card?.dataset?.expedition||'';if(id==='riddle-forest')return' exploration-forest-riddle'.trim();if(id==='riddle-dungeon')return'exploration-mountain-riddle';if(id==='math-addition-cave'||id==='math-multiplication-dungeon')return'math-arithmetic';return''}
  function paint(){for(const card of document.querySelectorAll('#student-explore-panel .sv-exp-card')){const activityId=activityForCard(card);if(!activityId)continue;let badge=card.querySelector('.sv-exp-attempt-status');if(!badge){badge=document.createElement('span');badge.className='sv-exp-attempt-status';card.querySelector('span:last-child')?.appendChild(badge)}const data=cache.get(activityId);badge.textContent=data?statusText(data):'도전 횟수 확인 중…';card.classList.toggle('attempt-exhausted',!!data?.ok&&!data.allowed)}}
  async function refresh(){const results=await Promise.all(IDS.map(async id=>[id,await read(id)]));for(const [id,data]of results)cache.set(id,data);paint()}
  const style=document.createElement('style');style.textContent='.sv-exp-attempt-status{display:block;margin-top:2px;font-size:11px;font-weight:1000;color:#53715b}.sv-exp-card.attempt-exhausted{opacity:.68}.sv-exp-card.attempt-exhausted .sv-exp-attempt-status{color:#9a4f4f}';document.head.appendChild(style);
  const observer=new MutationObserver(()=>paint());observer.observe(document.body,{childList:true,subtree:true});
  document.addEventListener('click',event=>{if(event.target.closest('.sv-quick-button.explore,#student-explore-panel [data-hub-close],#student-explore-panel .sv-exp-filter'))setTimeout(refresh,0)},true);
  window.addEventListener('studyvillage:activity-record-refresh',refresh);window.addEventListener('studyvillage:session-restored',refresh);window.addEventListener('studyvillage:session-cleared',()=>{cache.clear();paint()});
  window.StudyVillageExpeditionAttemptStatus={refresh,cache};setTimeout(refresh,700);
})();
