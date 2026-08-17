/* Keep student avatar choices visibly full-body and accessory-friendly. */
(()=>{
  const BODY_BY_NAME=Object.freeze({'기본 학생':'🧍','소년 탐험가':'🧍‍♂️','소녀 탐험가':'🧍‍♀️','우주 탐험가':'🧑‍🚀'});
  function refreshChoiceIcons(){const list=document.querySelector('#base-character-list');if(!list)return;for(const button of list.querySelectorAll('button.inventory-item')){const name=button.querySelector('strong')?.textContent?.trim(),icon=button.querySelector('span');if(icon&&BODY_BY_NAME[name])icon.textContent=BODY_BY_NAME[name]}}
  function refreshProfile(){const icon=document.querySelector('.profile-avatar'),base=document.querySelector('.player-icon')?.dataset?.avatarBase||'student-default',renderer=window.StudyVillageAvatar;if(!icon||!renderer)return;icon.textContent=renderer.base(base)?.emoji||'🧍'}
  const customize=document.querySelector('#customize-button');customize?.addEventListener('click',()=>setTimeout(()=>{refreshChoiceIcons();refreshProfile()},0));
  window.addEventListener('studyvillage:ranking-refresh',()=>setTimeout(refreshProfile,0));
  const list=document.querySelector('#base-character-list');if(list)new MutationObserver(refreshChoiceIcons).observe(list,{childList:true,subtree:true});
  const player=document.querySelector('#player');if(player)new MutationObserver(refreshProfile).observe(player,{attributes:true,subtree:true,attributeFilter:['data-avatar-base']});
  setTimeout(()=>{refreshChoiceIcons();refreshProfile()},500);
})();
