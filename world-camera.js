/* Lightweight home village map. Expeditions own their own randomized maps. */
(()=>{
  const viewport=document.querySelector('#world');
  const player=document.querySelector('#player');
  if(!viewport||!player)return;
  viewport.classList.remove('large-world-viewport');
  let layer=document.querySelector('#world-map');
  if(!layer){
    layer=document.createElement('div');
    layer.id='world-map';
    layer.className='world-map';
    const children=[...viewport.children];
    for(const child of children)layer.appendChild(child);
    viewport.appendChild(layer);
  }
  layer.style.width='100%';
  layer.style.height='100%';
  layer.style.transform='none';
  layer.style.willChange='auto';
  delete layer.dataset.cameraX;
  delete layer.dataset.cameraY;
})();
