/* v0.8.1 large village camera with hidden-screen idle guard.
   Expands the logical village beyond the viewport and keeps the player near
   the center while the world scrolls underneath. */
(()=>{
  const viewport=document.querySelector('#world');
  const player=document.querySelector('#player');
  const game=document.querySelector('#game-screen');
  if(!viewport||!player)return;
  const WORLD_W=2200,WORLD_H=1400;
  viewport.classList.add('large-world-viewport');
  const layer=document.createElement('div');
  layer.id='world-map';
  layer.className='world-map';
  layer.style.width=`${WORLD_W}px`;layer.style.height=`${WORLD_H}px`;
  const children=[...viewport.children];
  for(const child of children)layer.appendChild(child);
  viewport.appendChild(layer);
  // Existing positions are percentages; they now naturally spread across the larger map.
  function active(){return !document.hidden&&(!game||!game.hidden)}
  function updateCamera(){
    if(active()){
      const vw=viewport.clientWidth,vh=viewport.clientHeight;
      const pr=player.getBoundingClientRect(),vr=viewport.getBoundingClientRect();
      const currentX=Number(layer.dataset.cameraX||0),currentY=Number(layer.dataset.cameraY||0);
      const px=pr.left-vr.left+pr.width/2+currentX,py=pr.top-vr.top+pr.height/2+currentY;
      const targetX=Math.max(0,Math.min(WORLD_W-vw,px-vw/2));
      const targetY=Math.max(0,Math.min(WORLD_H-vh,py-vh/2));
      const x=currentX+(targetX-currentX)*0.12,y=currentY+(targetY-currentY)*0.12;
      layer.dataset.cameraX=x;layer.dataset.cameraY=y;
      layer.style.transform=`translate3d(${-x}px,${-y}px,0)`;
    }
    requestAnimationFrame(updateCamera);
  }
  requestAnimationFrame(updateCamera);
})();
