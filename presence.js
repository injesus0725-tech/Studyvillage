/* v0.9.54 lightweight student presence heartbeat.
   Heartbeats time out quickly and run only while the authenticated student game is visible. */
(()=>{
  const game=document.querySelector('#game-screen');
  const HEARTBEAT_MS=15000,INTERACTION_COOLDOWN_MS=8000,REQUEST_TIMEOUT_MS=4000;let timer=null,lastPing=0,pinging=false;
  function active(){return !document.hidden&&navigator.onLine&&(!game||game.classList.contains('active'))}
  async function ping(force=false){const headers=window.StudyVillageAuth?.authHeaders?.()||{};if(!headers.Authorization||!active()||pinging)return;const now=Date.now();if(!force&&now-lastPing<INTERACTION_COOLDOWN_MS)return;pinging=true;const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),REQUEST_TIMEOUT_MS);try{const r=await fetch('/api/presence/heartbeat',{method:'POST',headers,cache:'no-store',signal:controller.signal});if(r.ok)lastPing=Date.now()}catch{}finally{clearTimeout(timeout);pinging=false}}
  function start(){if(timer||!active())return;ping(true);timer=setInterval(()=>ping(true),HEARTBEAT_MS)}function stop(){if(timer){clearInterval(timer);timer=null}}function activity(){if(active())ping(false)}
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else start()});window.addEventListener('online',start);window.addEventListener('offline',stop);window.addEventListener('focus',()=>{start();ping(true)});window.addEventListener('pointerdown',activity,{passive:true});window.addEventListener('keydown',activity,{passive:true});window.addEventListener('studyvillage:session-ready',start);
  if(game){const observer=new MutationObserver(()=>{if(game.classList.contains('active'))start();else stop()});observer.observe(game,{attributes:true,attributeFilter:['class']})}
  setTimeout(start,1200);
})();