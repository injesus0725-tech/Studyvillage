/* Keep every secondary avatar view on the same modular 96x144 mini-me canvas. */
(()=>{
  const slots=['hair','outfit','bottom','shoes','hat','glasses','bag','hand','pet'];
  function refreshProfile(){const icon=document.querySelector('.profile-avatar'),base=document.querySelector('.player-icon')?.dataset?.avatarBase||'student-default';window.StudyVillageAvatar?.paintBase(icon,base)}
  function syncExpeditionAvatar(){
    const stage=document.querySelector('.sv-stage-player'),player=document.querySelector('#player'),renderer=window.StudyVillageAvatar;if(!stage||!player||!renderer)return;
    stage.replaceChildren();const base=document.createElement('span');base.className='sv-exp-avatar-base';stage.appendChild(base);renderer.paintBase(base,player.querySelector('.player-icon')?.dataset?.avatarBase||'student-default');
    for(const slot of slots){const layer=document.createElement('span');layer.className=`sv-exp-avatar-layer sv-exp-avatar-${slot}`;stage.appendChild(layer);renderer.paintItem(layer,player.querySelector(`#player-${slot}`)?.dataset?.avatarItem||'')}
    refreshProfile();
  }
  const style=document.createElement('style');style.id='sv-exp-avatar-sync-style';style.textContent='.profile-avatar{display:block;width:28px;height:42px;line-height:0}.sv-stage-player{position:relative!important;width:72px!important;height:108px!important;overflow:visible!important}.sv-stage-player>span{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;line-height:0!important}.sv-exp-avatar-bag{z-index:1}.sv-exp-avatar-base{z-index:2}.sv-exp-avatar-hair{z-index:3}.sv-exp-avatar-outfit,.sv-exp-avatar-bottom,.sv-exp-avatar-shoes{z-index:4}.sv-exp-avatar-hat,.sv-exp-avatar-glasses,.sv-exp-avatar-hand,.sv-exp-avatar-pet{z-index:6}.sv-stage-player svg,.profile-avatar svg{width:100%;height:100%;display:block}';document.head.appendChild(style);
  new MutationObserver(syncExpeditionAvatar).observe(document.body,{subtree:true,attributes:true,attributeFilter:['data-avatar-base','data-avatar-item']});
  window.addEventListener('studyvillage:expedition-open',syncExpeditionAvatar);requestAnimationFrame(()=>{refreshProfile();syncExpeditionAvatar()});
})();
