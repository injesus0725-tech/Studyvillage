/* Keep every secondary avatar view on the same modular 96x144 mini-me canvas. */
(()=>{
  const renderer=window.StudyVillageAvatar;
  const frame=body=>`<svg viewBox="0 0 96 144" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" shape-rendering="geometricPrecision">${body}</svg>`;
  const stroke='stroke="#684b43" stroke-width="1.45" stroke-linecap="round" stroke-linejoin="round"';
  const svg=(body)=>frame(`<g ${stroke}>${body}</g>`);
  const basics={
    'hair-curly':{svg:svg('<path fill="#6b4734" d="M23 40q-3-25 25-30 28 4 25 30l-8-8-7 8-10-10-10 10-7-8z"/><circle fill="#6b4734" cx="29" cy="22" r="7"/><circle fill="#6b4734" cx="42" cy="15" r="8"/><circle fill="#6b4734" cx="56" cy="15" r="8"/><circle fill="#6b4734" cx="68" cy="23" r="7"/>')},
    'hair-sidepart':{svg:svg('<path fill="#3f312c" d="M25 41Q22 14 48 10q22 1 24 27l-10-10-7 9-8-10-15 15z"/><path fill="none" d="M46 12q-7 8-17 14"/>')},
    'hair-twintail':{svg:svg('<path fill="#6e3f52" d="M25 40Q22 12 48 9t23 31l-8-9-7 8-9-11-9 11-8-9z"/><path fill="#6e3f52" d="M27 29q-15 3-14 20 2 14 13 18l5-9q-9-4-6-17zm42 0q15 3 14 20-2 14-13 18l-5-9q9-4 6-17z"/>')},
    'hair-green':{svg:svg('<path fill="#52745a" d="M24 40Q21 12 48 9q26 1 24 31l-8-10-7 8-9-11-10 11-8-9z"/><path fill="#86a56d" d="M32 17q15-7 30 0-14 1-27 8z"/>')},
    'hat-cap-red':{svg:svg('<path fill="#b64f49" d="M27 29q3-16 21-16 19 1 22 16z"/><path fill="#8c3938" d="M48 13q8 3 11 16H48z"/><path fill="#f0d089" d="M47 18l3 4 5 1-4 3 1 5-5-3-5 3 1-5-4-3 5-1z"/><path fill="#b64f49" d="M47 29h32q-7 7-27 6z"/>')},
    'hat-beanie-green':{svg:svg('<path fill="#5b7d62" d="M27 28q2-18 21-18t21 18z"/><path fill="#3f654c" d="M25 27h46v8H25z"/><circle fill="#d7bd67" cx="48" cy="8" r="4"/>')},
    'glasses-square':{svg:frame('<g fill="#dceef5aa" stroke="#4d4548" stroke-width="1.8"><rect x="29" y="38" width="16" height="14" rx="3"/><rect x="51" y="38" width="16" height="14" rx="3"/><path d="M45 44h6M29 42l-6-2m44 2 6-2"/></g>')},
    'glasses-blue':{svg:frame('<g fill="#ccecffaa" stroke="#38668b" stroke-width="1.8"><circle cx="37" cy="45" r="7"/><circle cx="59" cy="45" r="7"/><path d="M44 44h8M30 42l-6-2m42 2 6-2"/></g>')},
    'outfit-tee-red':{svg:svg('<path fill="#c85a55" d="M30 72l8-5h20l8 5 8 8-7 8-3-7 1 28H31l1-28-3 7-7-8z"/><path fill="#f2d46f" d="M43 80h10l-5 5z"/>')},
    'outfit-tee-blue':{svg:svg('<path fill="#4d78a6" d="M30 72l8-5h20l8 5 8 8-7 8-3-7 1 28H31l1-28-3 7-7-8z"/><path fill="#e9edf2" d="M35 88h26v4H35z"/>')},
    'outfit-stripe':{svg:svg('<path fill="#f3eee2" d="M29 73l9-6h20l9 6-3 36H32z"/><path fill="#4f79a2" d="M31 80h34v5H31zm0 12h34v5H31zm1 12h32v5H32z"/>')},
    'outfit-sweater-green':{svg:svg('<path fill="#64866b" d="M29 73l9-6h20l9 6-3 36H32z"/><path fill="#46684f" d="M39 67h18l-4 10H43zM34 96h28v7H34z"/>')},
    'bottom-pants-black':{svg:svg('<path fill="#35373d" d="M29 102h38l-2 29H51l-3-19-3 19H31z"/><path fill="#22242a" d="M29 102h38v6H29z"/>')},
    'bottom-shorts-sport':{svg:svg('<path fill="#526f99" d="M29 102h38l-3 18H52l-4-8-4 8H32z"/><path fill="#f0d269" d="M47 103h3v11h-3z"/>')},
    'bottom-skirt-navy':{svg:svg('<path fill="#44556f" d="M31 101h34l7 25H24z"/><path fill="#d9b45e" d="M31 101h34v5H31z"/><path fill="none" d="M30 120h36"/>')},
    'shoes-sneakers-red':{svg:svg('<path fill="#f7f3ea" d="M28 122h18v13H24q-5-5 4-13zm22 0h18q9 8 4 13H50z"/><path fill="#bc514d" d="M30 122h14v7H27zm23 0h14l3 7H53z"/><path fill="none" stroke="#fff" d="M32 125h9m14 0h9"/>')},
    'shoes-sneakers-black':{svg:svg('<path fill="#34363b" d="M28 122h18v13H24q-5-5 4-13zm22 0h18q9 8 4 13H50z"/><path fill="#f3f0e8" d="M25 132h21v4H23zm25 0h22l1 4H50z"/>')},
    'shoes-slipon-yellow':{svg:svg('<path fill="#d6b64f" d="M27 124h19v11H24q-4-5 3-11zm23 0h19q7 6 3 11H50z"/><path fill="#f5efe0" d="M31 125h12v4H31zm22 0h12v4H53z"/>')},
    'bag-mini':{svg:svg('<path fill="#8b5f42" d="M70 82h18v28H70z"/><path fill="#d2a854" d="M73 89h12v9H73z"/><path fill="none" d="M73 83q6-11 12 0"/>')},
    'hand-pencil':{svg:svg('<path fill="#e5c34f" d="M14 72l5-3 15 29-5 3z"/><path fill="#e9a5a0" d="M14 72l5-3 3 6-5 3z"/><path fill="#3d3a39" d="M34 98l2 7-7-4z"/>')},
    'hand-notebook':{svg:svg('<rect fill="#5680aa" x="5" y="82" width="28" height="25" rx="2"/><rect fill="#f2ead8" x="9" y="86" width="20" height="17"/><path fill="none" d="M13 91h12m-12 5h12m-12 5h8"/>')},
    'pet-hamster':{svg:svg('<circle fill="#d9a96f" cx="81" cy="120" r="14"/><circle fill="#c18c58" cx="71" cy="110" r="6"/><circle fill="#c18c58" cx="91" cy="110" r="6"/><ellipse fill="#f4dfc8" cx="81" cy="124" rx="8" ry="7"/><circle fill="#342d2b" cx="76" cy="117" r="2"/><circle fill="#342d2b" cx="86" cy="117" r="2"/><circle fill="#a85e5e" cx="81" cy="122" r="2"/>')}
  };
  if(renderer?.ASSETS)Object.assign(renderer.ASSETS,basics);

  const slots=['hair','outfit','bottom','shoes','hat','glasses','bag','hand','pet'];
  function refreshProfile(){const icon=document.querySelector('.profile-avatar'),base=document.querySelector('.player-icon')?.dataset?.avatarBase||'student-default';renderer?.paintBase(icon,base)}
  function syncExpeditionAvatar(){
    const stage=document.querySelector('.sv-stage-player'),player=document.querySelector('#player');if(!stage||!player||!renderer)return;
    stage.replaceChildren();const base=document.createElement('span');base.className='sv-exp-avatar-base';stage.appendChild(base);renderer.paintAvatarBase(base,player.querySelector('.player-icon')?.dataset?.avatarBase||'student-default');
    for(const slot of slots){const layer=document.createElement('span');layer.className=`sv-exp-avatar-layer sv-exp-avatar-${slot}`;stage.appendChild(layer);renderer.paintItem(layer,player.querySelector(`#player-${slot}`)?.dataset?.avatarItem||'')}
    refreshProfile();
  }
  const style=document.createElement('style');style.id='sv-exp-avatar-sync-style';style.textContent='.profile-avatar{display:block;width:28px;height:42px;line-height:0}.sv-stage-player{position:relative!important;width:72px!important;height:108px!important;overflow:visible!important}.sv-stage-player>span{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;line-height:0!important}.sv-exp-avatar-bag{z-index:1}.sv-exp-avatar-base{z-index:2}.sv-exp-avatar-hair{z-index:3}.sv-exp-avatar-outfit,.sv-exp-avatar-bottom,.sv-exp-avatar-shoes{z-index:4}.sv-exp-avatar-hat,.sv-exp-avatar-glasses,.sv-exp-avatar-hand,.sv-exp-avatar-pet{z-index:6}.sv-stage-player svg,.sv-stage-player img,.profile-avatar svg,.profile-avatar img{width:100%;height:100%;object-fit:contain;display:block}';document.head.appendChild(style);
  new MutationObserver(syncExpeditionAvatar).observe(document.body,{subtree:true,attributes:true,attributeFilter:['data-avatar-base','data-avatar-item']});
  window.addEventListener('studyvillage:expedition-open',syncExpeditionAvatar);requestAnimationFrame(()=>{refreshProfile();syncExpeditionAvatar()});
})();
