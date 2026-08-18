/* Stabilization: expedition rooms use tap/click destination movement with safe walkable bounds and proximity interaction. */
(()=>{
  const stage=document.querySelector('#study-expedition-stage');if(!stage)return;
  const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));let target=null,raf=0,last=0;
  function map(){return stage.querySelector('[data-stage-map]')}
  function player(){return map()?.querySelector('.sv-stage-player')}
  function npc(){return map()?.querySelector('.sv-stage-npc')}
  function center(el,host){const a=el.getBoundingClientRect(),b=host.getBoundingClientRect();return{x:a.left-b.left+a.width/2,y:a.top-b.top+a.height/2}}
  function bounds(host,hero){const w=hero.offsetWidth||70,h=hero.offsetHeight||70;return{left:w/2+8,right:Math.max(w/2+8,host.clientWidth-w/2-8),top:h/2+38,bottom:Math.max(h/2+38,host.clientHeight-h/2-12)}}
  function safePoint(host,hero,x,y){const b=bounds(host,hero);return{x:clamp(x,b.left,b.right),y:clamp(y,b.top,b.bottom)}}
  function place(el,host,x,y){const p=safePoint(host,el,x,y),w=el.offsetWidth||70,h=el.offsetHeight||70;el.style.left=`${p.x-w/2}px`;el.style.top=`${p.y-h/2}px`;el.style.right='auto';el.style.bottom='auto'}
  function direction(dx,dy){if(Math.abs(dx)>Math.abs(dy))return dx<0?'left':'right';return dy<0?'up':'down'}
  function setMotion(hero,moving,dir){hero.dataset.motion=moving?'walk':'idle';hero.dataset.direction=dir||hero.dataset.direction||'down';hero.classList.toggle('is-moving',moving);window.StudyVillageAvatar?.setMotion?.(hero,{moving,direction:hero.dataset.direction})}
  function animate(now=performance.now()){raf=0;const host=map(),hero=player();if(!host||!hero||!target||stage.hidden)return;const p=center(hero,host),dx=target.x-p.x,dy=target.y-p.y,dist=Math.hypot(dx,dy);if(dist<4){place(hero,host,target.x,target.y);target=null;setMotion(hero,false);return}const elapsed=Math.min(32,Math.max(8,now-(last||now-16))),step=Math.min(260*elapsed/1000,dist);last=now;place(hero,host,p.x+dx/dist*step,p.y+dy/dist*step);setMotion(hero,true,direction(dx,dy));raf=requestAnimationFrame(animate)}
  function setTarget(x,y){const host=map(),hero=player();if(!host||!hero)return;target=safePoint(host,hero,x,y);last=performance.now();if(!raf)raf=requestAnimationFrame(animate)}
  function nearNpc(){const host=map(),hero=player(),guide=npc();if(!host||!hero||!guide)return false;const a=center(hero,host),b=center(guide,host);return Math.hypot(a.x-b.x,a.y-b.y)<=Math.max(110,guide.offsetWidth*.92)}
  function approachNpc(guide){const host=map(),hero=player();if(!host||!hero||!guide)return;const g=center(guide,host),h=center(hero,host),dx=h.x-g.x,dy=h.y-g.y,len=Math.hypot(dx,dy)||1,distance=Math.max(88,guide.offsetWidth*.68);setTarget(g.x+dx/len*distance,g.y+dy/len*distance)}
  stage.addEventListener('pointerup',event=>{const host=map();if(!host||stage.hidden||(event.pointerType==='mouse'&&event.button!==0))return;if(event.target.closest('.sv-stage-question,.sv-stage-result,.sv-stage-head'))return;const guide=event.target.closest('.sv-stage-npc');if(guide){if(nearNpc()){guide.click();return}approachNpc(guide);return}const r=host.getBoundingClientRect();setTarget(event.clientX-r.left,event.clientY-r.top)},true);
  stage.addEventListener('click',event=>{const guide=event.target.closest('.sv-stage-npc');if(guide&&!nearNpc()){event.preventDefault();event.stopImmediatePropagation()}},true);
  function reset(){target=null;last=0;if(raf){cancelAnimationFrame(raf);raf=0}const host=map(),hero=player();if(host&&hero&&!stage.hidden){hero.style.position='absolute';place(hero,host,Math.max(55,host.clientWidth*.13),Math.max(90,host.clientHeight*.72));setMotion(hero,false,'right')}}
  new MutationObserver(mutations=>{if(mutations.some(m=>m.type==='attributes'||[...m.addedNodes].some(n=>n.nodeType===1&&(n.matches?.('.sv-stage-player')||n.querySelector?.('.sv-stage-player')))))requestAnimationFrame(reset)}).observe(stage,{attributes:true,attributeFilter:['hidden'],childList:true,subtree:true});
  window.addEventListener('resize',()=>{const host=map(),hero=player();if(host&&hero&&!stage.hidden){const p=center(hero,host);place(hero,host,p.x,p.y)}});
  window.StudyVillageExpeditionMovement={setTarget,nearNpc,reset};
})();
