/* Lightweight avatar motion observer for classroom tablets.
   Reads player geometry at a modest cadence instead of every animation frame. */
(()=>{
  const player=document.querySelector('#player'),game=document.querySelector('#game-screen');
  if(!player||!game)return;

  const interactionHint=document.querySelector('#interaction-hint');
  const touchMode=window.matchMedia?.('(max-width:700px),(pointer:coarse)').matches===true;
  function normalizeTouchHint(){
    if(!touchMode||!interactionHint)return;
    const text=interactionHint.textContent||'';
    if(text.startsWith('Space 키로 '))interactionHint.textContent=text.replace('Space 키로 ','✨ 상호작용 버튼으로 ');
  }
  if(touchMode&&interactionHint){
    new MutationObserver(normalizeTouchHint).observe(interactionHint,{childList:true,characterData:true,subtree:true});
    normalizeTouchHint();
  }

  let lastX=null,lastY=null,lastDirection='down',timer=null;
  function stop(){if(timer){clearInterval(timer);timer=null}}
  function sample(){
    if(document.hidden||!game.classList.contains('active')){lastX=null;lastY=null;return}
    const r=player.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2;
    if(lastX===null){lastX=x;lastY=y;window.StudyVillageAvatar?.setMotion(player,{moving:false,direction:lastDirection});return}
    const dx=x-lastX,dy=y-lastY,moved=Math.abs(dx)>0.35||Math.abs(dy)>0.35;
    if(moved){if(Math.abs(dx)>Math.abs(dy))lastDirection=dx<0?'left':'right';else if(Math.abs(dy)>0.35)lastDirection=dy<0?'up':'down'}
    window.StudyVillageAvatar?.setMotion(player,{moving:moved,direction:lastDirection});lastX=x;lastY=y;
  }
  function start(){if(timer||document.hidden||!game.classList.contains('active'))return;sample();timer=setInterval(sample,120)}
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else start()});
  new MutationObserver(()=>{if(game.classList.contains('active'))start();else stop()}).observe(game,{attributes:true,attributeFilter:['class']});
  start();
})();
