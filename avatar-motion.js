/* v0.7.5 avatar motion observer
   Watches the actual player position, so movement animation stays independent
   from keyboard/touch input and the game movement implementation.
   Pauses expensive geometry reads while the game or tab is hidden. */
(()=>{
  const player=document.querySelector('#player'),game=document.querySelector('#game-screen');
  if(!player||!game)return;
  let lastX=null,lastY=null,lastDirection='down',stillFrames=0,raf=0;
  function schedule(){if(!raf)raf=requestAnimationFrame(frame)}
  function frame(){raf=0;if(document.hidden||!game.classList.contains('active')){lastX=null;lastY=null;stillFrames=0;return}
    const r=player.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2;
    if(lastX===null){lastX=x;lastY=y;window.StudyVillageAvatar?.setMotion(player,{moving:false,direction:lastDirection});schedule();return;}
    const dx=x-lastX,dy=y-lastY,moved=Math.abs(dx)>0.15||Math.abs(dy)>0.15;
    if(moved){
      stillFrames=0;
      if(Math.abs(dx)>Math.abs(dy))lastDirection=dx<0?'left':'right';
      else if(Math.abs(dy)>0.15)lastDirection=dy<0?'up':'down';
      window.StudyVillageAvatar?.setMotion(player,{moving:true,direction:lastDirection});
    }else{
      stillFrames++;
      if(stillFrames>2)window.StudyVillageAvatar?.setMotion(player,{moving:false,direction:lastDirection});
    }
    lastX=x;lastY=y;schedule();
  }
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule()});
  new MutationObserver(()=>{if(game.classList.contains('active'))schedule()}).observe(game,{attributes:true,attributeFilter:['class']});
  schedule();
})();
