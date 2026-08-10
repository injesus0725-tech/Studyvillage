/* v0.9.17 lightweight student presence heartbeat.
   Regular heartbeat stays at 15 seconds, but returning to the tab or interacting
   after a quiet period can refresh presence immediately without adding constant traffic. */
(()=>{
  const HEARTBEAT_MS=15000,INTERACTION_COOLDOWN_MS=8000;
  let timer=null,lastPing=0,pinging=false;
  async function ping(force=false){
    const headers=window.StudyVillageAuth?.authHeaders?.()||{};
    if(!headers.Authorization||document.hidden||pinging)return;
    const now=Date.now();if(!force&&now-lastPing<INTERACTION_COOLDOWN_MS)return;
    pinging=true;
    try{const r=await fetch('/api/presence/heartbeat',{method:'POST',headers,cache:'no-store'});if(r.ok)lastPing=Date.now()}catch{}finally{pinging=false}
  }
  function start(){if(timer)return;ping(true);timer=setInterval(()=>ping(true),HEARTBEAT_MS)}
  function stop(){if(timer){clearInterval(timer);timer=null}}
  function activity(){ping(false)}
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else start()});
  window.addEventListener('online',start);window.addEventListener('offline',stop);
  window.addEventListener('focus',()=>ping(true));
  window.addEventListener('pointerdown',activity,{passive:true});
  window.addEventListener('keydown',activity,{passive:true});
  window.addEventListener('studyvillage:session-ready',start);
  setTimeout(start,1200);
})();