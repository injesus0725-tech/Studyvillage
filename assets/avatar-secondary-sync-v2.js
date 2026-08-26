/* Keep profile + expedition avatar views in lockstep with the player's full modular equipment. */
(()=>{
  const renderer=window.StudyVillageAvatar;if(!renderer)return;
  const slots=['face','expression','hair','outfit','bottom','shoes','hat','glasses','bag','hand','pet'];
  const player=()=>document.querySelector('#player');
  const baseId=()=>player()?.querySelector('.player-icon')?.dataset?.avatarBase||'student-boy';
  const itemId=slot=>player()?.querySelector(`#player-${slot}`)?.dataset?.avatarItem||'';
  function appendLayer(host,className,slot=null){const layer=document.createElement('span');layer.className=className;host.appendChild(layer);if(slot==='hair')renderer.paintHair(layer,itemId(slot)||null,baseId());else if(slot)renderer.paintItem(layer,itemId(slot));return layer}
  function syncProfile(){const host=document.querySelector('.profile-avatar');if(!host||!player())return;host.replaceChildren();appendLayer(host,'sv-profile-layer sv-profile-base');renderer.paintAvatarBase(host.lastElementChild,baseId());for(const slot of slots)appendLayer(host,`sv-profile-layer sv-profile-${slot}`,slot)}
  function syncExpedition(){const host=document.querySelector('.sv-stage-player');if(!host||!player())return;host.replaceChildren();appendLayer(host,'sv-exp2-layer sv-exp2-base');renderer.paintAvatarBase(host.lastElementChild,baseId());for(const slot of slots)appendLayer(host,`sv-exp2-layer sv-exp2-${slot}`,slot)}
  function sync(){syncProfile();syncExpedition()}
  function profileOwned(){const host=document.querySelector('.profile-avatar');return !host||!!host.querySelector(':scope > .sv-profile-base')&&slots.every(slot=>host.querySelector(`:scope > .sv-profile-${slot}`))}
  function expeditionOwned(){const host=document.querySelector('.sv-stage-player');return !host||!!host.querySelector(':scope > .sv-exp2-base')&&slots.every(slot=>host.querySelector(`:scope > .sv-exp2-${slot}`))}
  let repairQueued=false;
  function ensureOwned(){if(profileOwned()&&expeditionOwned())return;if(repairQueued)return;repairQueued=true;requestAnimationFrame(()=>{repairQueued=false;if(!profileOwned())syncProfile();if(!expeditionOwned())syncExpedition()})}
  const style=document.createElement('style');style.id='sv-avatar-secondary-sync-v2-style';style.textContent=`
.profile-avatar{position:relative!important;display:block!important;width:28px!important;height:42px!important;line-height:0!important;overflow:visible!important}.sv-profile-layer,.sv-exp2-layer{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;line-height:0!important}.sv-stage-player{position:relative!important;width:72px!important;height:108px!important;overflow:visible!important}.sv-profile-bag,.sv-exp2-bag{z-index:1}.sv-profile-base,.sv-exp2-base{z-index:2}.sv-profile-face,.sv-exp2-face,.sv-profile-hair,.sv-exp2-hair{z-index:3}.sv-profile-outfit,.sv-exp2-outfit,.sv-profile-bottom,.sv-exp2-bottom,.sv-profile-shoes,.sv-exp2-shoes{z-index:4}.sv-profile-expression,.sv-exp2-expression{z-index:5}.sv-profile-hat,.sv-exp2-hat,.sv-profile-glasses,.sv-exp2-glasses,.sv-profile-hand,.sv-exp2-hand,.sv-profile-pet,.sv-exp2-pet{z-index:6}.sv-profile-layer svg,.sv-profile-layer img,.sv-exp2-layer svg,.sv-exp2-layer img{width:100%!important;height:100%!important;object-fit:contain!important;display:block!important}`;document.head.appendChild(style);
  new MutationObserver(mutations=>{if(mutations.some(m=>m.type==='attributes'))requestAnimationFrame(sync);else ensureOwned()}).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['data-avatar-base','data-avatar-item']});
  window.addEventListener('studyvillage:expedition-open',()=>requestAnimationFrame(sync));window.addEventListener('studyvillage:shop-purchase',()=>requestAnimationFrame(sync));window.addEventListener('studyvillage:ranking-refresh',()=>requestAnimationFrame(sync));requestAnimationFrame(sync);
})();
