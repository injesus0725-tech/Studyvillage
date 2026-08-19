/* Expedition region variety v1: vary scenery, obstacles and starting position on every rendered room. */
(()=>{
  const stage=document.querySelector('#study-expedition-stage');if(!stage)return;
  const map=()=>stage.querySelector('[data-stage-map]');
  const layouts=[
    {id:'west-grove',start:[.12,.74],decor:[[.24,.24],[.52,.63],[.76,.30],[.67,.78],[.42,.44]]},
    {id:'south-turn',start:[.26,.82],decor:[[.16,.34],[.45,.20],[.70,.52],[.84,.76],[.54,.72]]},
    {id:'north-entry',start:[.18,.28],decor:[[.34,.64],[.62,.20],[.80,.46],[.72,.78],[.46,.42]]},
    {id:'east-loop',start:[.78,.78],decor:[[.18,.52],[.38,.22],[.56,.66],[.76,.28],[.46,.82]]},
    {id:'center-fork',start:[.15,.58],decor:[[.28,.18],[.43,.72],[.61,.38],[.82,.62],[.68,.82]]},
    {id:'long-crossing',start:[.10,.82],decor:[[.24,.48],[.42,.24],[.58,.72],[.74,.40],[.88,.70]]}
  ];
  const themeExtras={forest:['🌲','🪵','🍄','🌿'],cave:['🪨','💎','🕯️','💧'],dungeon:['🧱','🔥','🛡️','🗝️'],ruins:['🗿','🏛️','🪨','🌿'],castle:['🧱','🚩','🛡️','🕯️']};
  const pick=a=>a[Math.floor(Math.random()*a.length)],shuffle=a=>[...a].sort(()=>Math.random()-.5);
  const style=document.createElement('style');style.textContent='.sv-stage-decor[data-region-extra]{font-size:34px;z-index:3;filter:drop-shadow(0 5px 4px #22352833)}.sv-stage-map[data-region-layout="north-entry"] .sv-stage-path{transform:rotate(4deg) scaleX(.92)}.sv-stage-map[data-region-layout="east-loop"] .sv-stage-path{transform:rotate(8deg) scale(.90,1.08)}.sv-stage-map[data-region-layout="center-fork"] .sv-stage-path{transform:rotate(-8deg) scale(.95,1.1)}.sv-stage-map[data-region-layout="long-crossing"] .sv-stage-path{transform:rotate(2deg) scaleX(1.06)}';document.head.appendChild(style);
  function themeOf(host){return [...host.classList].find(c=>c.startsWith('theme-'))?.slice(6)||'forest'}
  function apply(){const host=map(),hero=host?.querySelector('.sv-stage-player'),note=host?.querySelector('.sv-stage-map-note');if(!host||!hero||stage.hidden)return;const roomKey=`${note?.textContent||''}|${host.className}`;if(host.dataset.regionRoomKey===roomKey&&host.querySelector('[data-region-extra]'))return;host.dataset.regionRoomKey=roomKey;host.querySelectorAll('[data-region-extra]').forEach(el=>el.remove());const layout=pick(layouts),spots=shuffle(layout.decor),theme=themeOf(host),extras=themeExtras[theme]||themeExtras.forest;host.dataset.regionLayout=layout.id;host.dataset.startX=String(layout.start[0]);host.dataset.startY=String(layout.start[1]);const existing=[...host.querySelectorAll('.sv-stage-decor:not([data-region-extra])')];existing.forEach((el,i)=>{const [x,y]=spots[i%spots.length];el.style.left=`${Math.round(x*100)}%`;el.style.top=`${Math.round(y*100)}%`;el.style.right='auto';el.style.bottom='auto'});for(let i=3;i<5;i++){const [x,y]=spots[i],el=document.createElement('span');el.className='sv-stage-decor';el.dataset.regionExtra='1';el.textContent=extras[(Math.floor(Math.random()*extras.length)+i)%extras.length];el.style.left=`${Math.round(x*100)}%`;el.style.top=`${Math.round(y*100)}%`;host.appendChild(el)}requestAnimationFrame(()=>window.StudyVillageExpeditionMovement?.reset?.())}
  let timer=0;new MutationObserver(mutations=>{if(stage.hidden)return;const relevant=mutations.some(m=>m.type==='childList'||(m.type==='attributes'&&m.attributeName==='hidden'));if(!relevant)return;clearTimeout(timer);timer=setTimeout(apply,60)}).observe(stage,{subtree:true,childList:true,attributes:true,attributeFilter:['hidden']});
  addEventListener('resize',()=>requestAnimationFrame(apply));addEventListener('studyvillage:session-cleared',()=>{const host=map();if(host){delete host.dataset.regionRoomKey;delete host.dataset.regionLayout;delete host.dataset.startX;delete host.dataset.startY}});
  window.StudyVillageExpeditionRegion={apply,layouts};
})();
