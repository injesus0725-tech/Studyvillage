/* Tablet expedition movement: tap the map to walk; reaching the challenge gate opens the problem. */
(()=>{
  const stage=document.querySelector('#study-expedition-stage');if(!stage)return;
  let opening=false;
  function prepare(){
    const map=stage.querySelector('.sv-stage-map'),player=map?.querySelector('.sv-stage-player'),gate=map?.querySelector('.sv-stage-npc');if(!map||!player||!gate)return;
    gate.innerHTML='<span>🚪</span><b>문제 관문</b><small>가까이 이동하면 문제가 열려요</small>';
    gate.style.cursor='default';gate.style.pointerEvents='none';
    player.style.transition='left .55s ease, top .55s ease, bottom .55s ease';
    player.style.bottom='auto';player.style.top='68%';
    map.style.touchAction='manipulation';
  }
  const observer=new MutationObserver(prepare);observer.observe(stage,{subtree:true,childList:true});prepare();
  stage.addEventListener('click',event=>{
    const map=event.target.closest('.sv-stage-map');if(!map||!stage.contains(map)||event.target.closest('button,input'))return;
    const player=map.querySelector('.sv-stage-player'),gate=map.querySelector('.sv-stage-npc');if(!player||!gate)return;
    const r=map.getBoundingClientRect(),x=Math.max(7,Math.min(88,(event.clientX-r.left)/r.width*100)),y=Math.max(15,Math.min(82,(event.clientY-r.top)/r.height*100));
    player.style.left=`${x}%`;player.style.top=`${y}%`;
    const gr=gate.getBoundingClientRect(),gx=(gr.left+gr.width/2-r.left)/r.width*100,gy=(gr.top+gr.height/2-r.top)/r.height*100;
    if(Math.hypot(x-gx,y-gy)<18&&!opening){opening=true;setTimeout(()=>{gate.style.pointerEvents='auto';gate.click();gate.style.pointerEvents='none';opening=false},560)}
  },true);
  const qObserver=new MutationObserver(()=>stage.querySelectorAll('.sv-stage-question .trait').forEach(el=>el.remove()));qObserver.observe(stage,{subtree:true,childList:true});
})();