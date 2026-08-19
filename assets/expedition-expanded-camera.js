/* Expedition map v1.1: make exploration larger than the visible room and follow the student. */
(()=>{
  const stage=document.querySelector('#study-expedition-stage');if(!stage)return;
  const map=()=>stage.querySelector('[data-stage-map]'),hero=()=>map()?.querySelector('.sv-stage-player');
  let raf=0,lastMap=null;
  const style=document.createElement('style');style.textContent='.sv-stage-map.sv-expanded-map{justify-self:start;align-self:start;transform-origin:0 0;will-change:transform;overflow:hidden}.sv-stage-map.sv-expanded-map:after{content:"🌫️  걸어가며 숨은 곳을 찾아보세요";position:absolute;right:7%;top:10%;padding:7px 10px;border-radius:999px;background:#ffffffb8;color:#52645a;font-size:10px;font-weight:1000;pointer-events:none}.sv-stage-head,.sv-stage-route{position:relative;z-index:20}';document.head.appendChild(style);
  function dimensions(host){const shell=host.closest('.sv-stage-shell');if(!shell)return null;const head=shell.querySelector('.sv-stage-head'),route=shell.querySelector('.sv-stage-route'),vw=Math.max(320,shell.clientWidth),vh=Math.max(300,shell.clientHeight-(head?.offsetHeight||0)-(route?.offsetHeight||0));return{shell,vw,vh}}
  function ensureSize(){const host=map();if(!host||stage.hidden)return;const d=dimensions(host);if(!d)return;const coarse=matchMedia('(pointer:coarse)').matches||innerWidth<760,scaleX=coarse?1.45:1.35,scaleY=coarse?1.35:1.25;host.classList.add('sv-expanded-map');host.style.width=`${Math.round(Math.max(d.vw*scaleX,d.vw+260))}px`;host.style.height=`${Math.round(Math.max(d.vh*scaleY,d.vh+180))}px`;lastMap=host;follow()}
  function follow(){const host=map(),player=hero();if(!host||!player||stage.hidden)return;const d=dimensions(host);if(!d)return;const px=player.offsetLeft+player.offsetWidth/2,py=player.offsetTop+player.offsetHeight/2,maxX=Math.max(0,host.offsetWidth-d.vw),maxY=Math.max(0,host.offsetHeight-d.vh),x=Math.max(-maxX,Math.min(0,d.vw*.5-px)),y=Math.max(-maxY,Math.min(0,d.vh*.52-py));host.style.transform=`translate(${Math.round(x)}px,${Math.round(y)}px)`}
  function loop(){raf=0;if(!stage.hidden){if(map()!==lastMap)ensureSize();follow();raf=requestAnimationFrame(loop)}}
  function start(){cancelAnimationFrame(raf);requestAnimationFrame(()=>{ensureSize();raf=requestAnimationFrame(loop)})}
  function stop(){if(raf)cancelAnimationFrame(raf);raf=0;const host=map();if(host)host.style.transform='translate(0,0)'}
  new MutationObserver(mutations=>{if(mutations.some(m=>m.type==='attributes'&&m.attributeName==='hidden'))stage.hidden?stop():start();if(!stage.hidden&&mutations.some(m=>m.type==='childList'))requestAnimationFrame(ensureSize)}).observe(stage,{attributes:true,attributeFilter:['hidden'],subtree:true,childList:true});
  addEventListener('resize',()=>requestAnimationFrame(ensureSize));addEventListener('studyvillage:session-cleared',stop);
  window.StudyVillageExpeditionCamera={ensureSize,follow,stop};
})();
