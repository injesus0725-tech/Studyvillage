/* Stabilization: expedition rooms use the same tap/click destination movement model as the village. */
(()=>{
  const stage=document.querySelector('#study-expedition-stage');if(!stage)return;
  const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));let target=null,raf=0;
  function map(){return stage.querySelector('[data-stage-map]')}
  function player(){return map()?.querySelector('.sv-stage-player')}
  function npc(){return map()?.querySelector('.sv-stage-npc')}
  function center(el,host){const a=el.getBoundingClientRect(),b=host.getBoundingClientRect();return{x:a.left-b.left+a.width/2,y:a.top-b.top+a.height/2}}
  function place(el,host,x,y){const w=el.offsetWidth||70,h=el.offsetHeight||70;el.style.left=`${clamp(x-w/2,4,Math.max(4,host.clientWidth-w-4))}px`;el.style.top=`${clamp(y-h/2,4,Math.max(4,host.clientHeight-h-4))}px`;el.style.right='auto';el.style.bottom='auto'}
  function animate(){raf=0;const host=map(),hero=player();if(!host||!hero||!target||stage.hidden)return;const p=center(hero,host),dx=target.x-p.x,dy=target.y-p.y,dist=Math.hypot(dx,dy);if(dist<5){place(hero,host,target.x,target.y);target=null;hero.classList.remove('is-moving');return}const step=Math.min(10,dist);place(hero,host,p.x+dx/dist*step,p.y+dy/dist*step);hero.classList.add('is-moving');raf=requestAnimationFrame(animate)}
  function setTarget(x,y){const host=map(),hero=player();if(!host||!hero)return;target={x:clamp(x,8,host.clientWidth-8),y:clamp(y,8,host.clientHeight-8)};if(!raf)raf=requestAnimationFrame(animate)}
  function nearNpc(){const host=map(),hero=player(),guide=npc();if(!host||!hero||!guide)return false;const a=center(hero,host),b=center(guide,host);return Math.hypot(a.x-b.x,a.y-b.y)<=Math.max(105,guide.offsetWidth*.9)}
  stage.addEventListener('pointerup',event=>{const host=map();if(!host||stage.hidden||event.pointerType==='mouse'&&event.button!==0)return;if(event.target.closest('.sv-stage-question,.sv-stage-result,.sv-stage-head'))return;const guide=event.target.closest('.sv-stage-npc');if(guide){if(nearNpc()){guide.click();return}const b=host.getBoundingClientRect(),g=guide.getBoundingClientRect();setTarget(g.left-b.left-35,g.top-b.top+g.height*.72);return}const r=host.getBoundingClientRect();setTarget(event.clientX-r.left,event.clientY-r.top)},true);
  stage.addEventListener('click',event=>{const guide=event.target.closest('.sv-stage-npc');if(guide&&!nearNpc()){event.preventDefault();event.stopImmediatePropagation()}},true);
  new MutationObserver(()=>{target=null;if(raf){cancelAnimationFrame(raf);raf=0}const host=map(),hero=player();if(host&&hero&&!stage.hidden){hero.style.position='absolute';const r=host.getBoundingClientRect();place(hero,host,Math.max(55,r.width*.13),Math.max(70,r.height*.72))}}).observe(stage,{attributes:true,attributeFilter:['hidden'],childList:true,subtree:true});
  window.StudyVillageExpeditionMovement={setTarget,nearNpc};
})();
