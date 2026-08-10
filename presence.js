/* v0.9.13 student presence heartbeat */
(()=>{
  const HEARTBEAT_MS=15000;
  let timer=null;
  async function ping(){
    const headers=window.StudyVillageAuth?.authHeaders?.()||{};
    if(!headers.Authorization||document.hidden)return;
    try{await fetch('/api/presence/heartbeat',{method:'POST',headers,cache:'no-store'})}catch{}
  }
  function start(){if(timer)return;ping();timer=setInterval(ping,HEARTBEAT_MS)}
  function stop(){if(timer){clearInterval(timer);timer=null}}
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else start()});
  window.addEventListener('online',start);window.addEventListener('offline',stop);
  window.addEventListener('studyvillage:session-ready',start);
  setTimeout(start,1200);
})();