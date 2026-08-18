/* Stabilization: one student movement path. Tablet taps and PC mouse clicks move directly. */
(()=>{
  const game=document.querySelector('#game-screen'),world=document.querySelector('#world'),player=document.querySelector('#player');
  if(!game||!world||!player)return;
  const map=document.querySelector('#world-map')||world;
  const style=document.createElement('style');
  style.textContent=`.sv-move-target{position:absolute;z-index:9;width:24px;height:24px;border:3px solid #fff;border-radius:50%;background:#5e9fff66;box-shadow:0 0 0 3px #2f78d655;transform:translate(-50%,-50%);pointer-events:none!important}@media(max-width:720px),(pointer:coarse){#world{touch-action:none!important}.interaction-hint{display:none!important}}`;
  document.head.appendChild(style);
  const marker=document.createElement('div');marker.className='sv-move-target';marker.hidden=true;map.appendChild(marker);
  let target=null,raf=0;
  const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
  const panelVisible=el=>!!el&&!el.hidden&&getComputedStyle(el).display!=='none'&&getComputedStyle(el).visibility!=='hidden'&&el.getClientRects().length>0;
  const blocked=()=>[...document.querySelectorAll('#building-interior,#student-explore-panel,#study-expedition-stage,.sv-expedition-panel,#customize-panel,#record-panel,#quiz-panel,#dialogue,.welcome-guide,.math-practice-panel,#library-game,.sv-hub-panel,.sv-mission-panel,.sv-collection-panel,.sv-discovery-panel')].some(panelVisible);
  const interactive=node=>!!node?.closest?.('button,a,input,select,textarea,label,.building,.npc,[role="button"],#building-interior,#student-explore-panel,#study-expedition-stage,.sv-expedition-panel,#customize-panel,#record-panel,#quiz-panel,#dialogue,.welcome-guide,.math-practice-panel,#library-game');
  function stop(){target=null;marker.hidden=true;if(raf){cancelAnimationFrame(raf);raf=0}}
  function worldPoint(clientX,clientY){const r=world.getBoundingClientRect();return{x:clamp((clientX-r.left)/r.width*100,3,97),y:clamp((clientY-r.top)/r.height*100,5,95)}}
  function tick(){raf=0;if(!target||!game.classList.contains('active')||document.hidden||blocked())return stop();let dx=target.x-state.x,dy=target.y-state.y,dist=Math.hypot(dx,dy);if(dist<.8)return stop();dx/=dist;dy/=dist;tryMove(dx,dy);player.style.left=`${state.x}%`;player.style.top=`${state.y}%`;raf=requestAnimationFrame(tick)}
  function moveTo(clientX,clientY){if(!game.classList.contains('active')||blocked())return;stop();target=worldPoint(clientX,clientY);marker.style.left=`${target.x}%`;marker.style.top=`${target.y}%`;marker.hidden=false;raf=requestAnimationFrame(tick)}
  world.addEventListener('pointerup',event=>{if(interactive(event.target)||blocked())return;if(event.button!==undefined&&event.button!==0)return;moveTo(event.clientX,event.clientY)});
  window.addEventListener('blur',stop);document.addEventListener('visibilitychange',()=>{if(document.hidden)stop()});
  new MutationObserver(()=>{if(blocked())stop()}).observe(document.body,{subtree:true,attributes:true,attributeFilter:['hidden','class']});
  window.addEventListener('studyvillage:session-cleared',stop);
  window.StudyVillageMovement={stop,moveTo};
})();
