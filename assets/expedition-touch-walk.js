/* Tablet expedition movement: tap the map to walk; reaching or tapping the challenge gate opens the problem. */
(()=>{
  const stage=document.querySelector('#study-expedition-stage');if(!stage)return;
  let opening=false;
  function prepare(){
    const map=stage.querySelector('.sv-stage-map'),player=map?.querySelector('.sv-stage-player'),gate=map?.querySelector('.sv-stage-npc');if(!map||!player||!gate)return;
    gate.innerHTML='<span>🚪</span><b>문제 관문</b><small>가까이 이동하거나 관문을 눌러 문제 풀기</small>';
    gate.style.cursor='pointer';gate.style.pointerEvents='auto';gate.style.touchAction='manipulation';
    player.style.transition='left .45s ease, top .45s ease';player.style.bottom='auto';player.style.top='68%';
    map.style.touchAction='manipulation';
  }
  const observer=new MutationObserver(prepare);observer.observe(stage,{subtree:true,childList:true});prepare();
  stage.addEventListener('click',event=>{
    const gateButton=event.target.closest('.sv-stage-npc');
    if(gateButton){event.stopPropagation();return}
    const map=event.target.closest('.sv-stage-map');if(!map||!stage.contains(map)||event.target.closest('button,input'))return;
    const player=map.querySelector('.sv-stage-player'),gate=map.querySelector('.sv-stage-npc');if(!player||!gate)return;
    const r=map.getBoundingClientRect(),x=Math.max(7,Math.min(88,(event.clientX-r.left)/r.width*100)),y=Math.max(15,Math.min(82,(event.clientY-r.top)/r.height*100));
    player.style.left=`${x}%`;player.style.top=`${y}%`;
    const gr=gate.getBoundingClientRect(),gx=(gr.left+gr.width/2-r.left)/r.width*100,gy=(gr.top+gr.height/2-r.top)/r.height*100;
    if(Math.hypot(x-gx,y-gy)<18&&!opening){opening=true;setTimeout(()=>{gate.click();opening=false},470)}
  },true);
  const qObserver=new MutationObserver(()=>stage.querySelectorAll('.sv-stage-question .trait').forEach(el=>el.remove()));qObserver.observe(stage,{subtree:true,childList:true});
})();
