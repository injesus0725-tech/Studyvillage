/* StudyVillage lightweight avatar pack v5: compact RPG-flavored silhouettes for tiny on-screen characters. */
(()=>{const r=window.StudyVillageAvatar;if(!r?.ASSETS)return;const f=b=>`<svg viewBox="0 0 96 144" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${b}</svg>`;const s=b=>f(`<g stroke="#684b43" stroke-width="1.45" stroke-linecap="round" stroke-linejoin="round">${b}</g>`);Object.assign(r.ASSETS,{
'hair-flame-red':{svg:s('<path fill="#b64a3f" d="M23 40Q20 17 32 13l2-10 7 9 6-11 6 12 8-8 3 10q8 6 8 25l-8-9-8 8-9-11-9 11-8-9z"/><path fill="#e27b43" d="M36 18l7-8 5 8 6-7 5 12-10-4-7 4z"/>')},
'hair-lavender-bob':{svg:s('<path fill="#8d74a8" d="M23 42Q21 10 48 8t26 34v24l-10 5V39l-7-9-9 10-9-10-7 10v31l-10-5z"/><path fill="#b6a0cd" d="M28 20q16-9 34-2-16 2-30 10z"/>')},
'hat-frog-hood':{svg:s('<path fill="#6f9a62" d="M25 31q2-19 23-19t23 19z"/><circle fill="#8fbc7f" cx="34" cy="14" r="7"/><circle fill="#8fbc7f" cx="62" cy="14" r="7"/><circle fill="#333" cx="34" cy="14" r="2"/><circle fill="#333" cx="62" cy="14" r="2"/><path fill="#567b4d" d="M25 30h46v7H25z"/>')},
'hat-knight-mini':{svg:s('<path fill="#8998aa" d="M28 30q2-17 20-19 18 2 20 19v9H28z"/><path fill="#c9a84e" d="M47 6h3v10h-3z"/><path fill="#5f6d7e" d="M31 31h34v8H31z"/><path fill="none" d="M48 15v24"/>')},
'glasses-lightning':{svg:f('<g fill="#f0d65caa" stroke="#7b6542" stroke-width="1.7"><path d="M29 39h15l-5 7h7l-13 12 4-9h-8z"/><path d="M52 39h15l-5 7h7L56 58l4-9h-8z"/></g>')},
'outfit-adventure-red':{svg:s('<path fill="#a94e46" d="M29 72l9-6h20l9 6-3 37H32z"/><path fill="#d9b55d" d="M37 72h22v5H37zM31 94h34v6H31z"/><path fill="#6c4b35" d="M46 77h4v32h-4z"/>')},
'outfit-mage-blue':{svg:s('<path fill="#4e67a0" d="M29 70h38l8 43H21z"/><path fill="#273968" d="M38 69l10 14 10-14 8 7-18 17-18-17z"/><path fill="#d2b45b" d="M47 85h2v28h-2z"/>')},
'bottom-adventure-brown':{svg:s('<path fill="#76543b" d="M29 102h38l-2 29H51l-3-19-3 19H31z"/><path fill="#c7a65a" d="M29 103h38v5H29z"/>')},
'shoes-trail-orange':{svg:s('<path fill="#c36f3f" d="M28 119h18v16H24q-5-5 4-13zm22 0h18v4q8 6 4 12H50z"/><path fill="#5b4a3e" d="M25 132h21v4H23zm25 0h22v4H50z"/>')},
'bag-treasure':{svg:s('<path fill="#8a5b38" d="M67 86h23v25H67z"/><path fill="#c8a348" d="M68 91h21v6H68z"/><path fill="none" d="M70 86q9-15 17 0"/><circle fill="#e6c85b" cx="79" cy="101" r="3"/>')},
'hand-shield':{svg:s('<path fill="#8b633e" d="M5 77l18-5 10 10-4 21-12 8-12-8z"/><path fill="#d0aa58" d="M17 77h4v29h-4zM8 88h21v4H8z"/>')},
'hand-crystal':{svg:s('<path fill="#78d7e5" d="M20 72l10 12-7 18-13 2-6-13 6-15z"/><path fill="#dffaff" d="M20 72l2 17-12-13zm2 17 8-5-7 18z"/>')},
'pet-fennec':{svg:s('<ellipse fill="#d8a367" cx="81" cy="122" rx="13" ry="11"/><path fill="#d8a367" d="M70 113l-7-15 13 10zm22 0 7-15-13 10z"/><ellipse fill="#f1d7b5" cx="81" cy="124" rx="7" ry="5"/><circle fill="#333" cx="76" cy="118" r="2"/><circle fill="#333" cx="86" cy="118" r="2"/>')},
'pet-baby-wolf':{svg:s('<ellipse fill="#7d8793" cx="81" cy="122" rx="14" ry="11"/><path fill="#7d8793" d="M70 113l2-12 8 8zm22 0-2-12-8 8z"/><ellipse fill="#c9ced3" cx="81" cy="124" rx="7" ry="5"/><circle fill="#2f3338" cx="76" cy="118" r="2"/><circle fill="#2f3338" cx="86" cy="118" r="2"/>')},
'pet-moon':{svg:s('<path fill="#e1d37a" d="M90 106q-15 3-15 18t15 17q-22 3-23-17 1-20 23-18z"/><path fill="#fff2b4" d="M83 114l2 4 5 1-4 3 1 5-4-2-4 2 1-5-4-3 5-1z"/>')}
});})();

/* Compatibility hardening for the two-phase equipment save used by customize.js.
   After the legacy/base save succeeds, clear every purchased slot first. customize.js then
   writes back only the purchased items still selected. This also handles the all-unequipped case. */
(()=>{
  const slots=['face','expression','hair','hat','glasses','outfit','bottom','shoes','bag','hand','pet'];
  const emptyEquipment=()=>Object.fromEntries(slots.map(slot=>[slot,null]));
  const originalFetch=window.fetch.bind(window);
  window.fetch=async function(input,init={}){
    const url=typeof input==='string'?input:input?.url||'',method=String(init?.method||(typeof input!=='string'&&input?.method)||'GET').toUpperCase();
    const response=await originalFetch(input,init);
    if(method==='POST'&&/(^|\/)api\/player\/me\/equipment(?:\?|$)/.test(url)&&response.ok&&!new Headers(init?.headers||{}).has('X-StudyVillage-Keep-Builtin')){
      try{
        const headers=new Headers(init?.headers||{});if(!headers.has('Content-Type'))headers.set('Content-Type','application/json');
        const cleared=await originalFetch('/api/shop/equipment',{method:'PUT',headers,body:JSON.stringify({equipment:emptyEquipment()})});
        if(!cleared.ok)console.warn('[StudyVillage avatar] stale purchased equipment clear failed',cleared.status);
      }catch(err){console.warn('[StudyVillage avatar] stale purchased equipment clear failed',err)}
    }
    return response;
  };
})();

/* Keep an 87-item shop practical on tablet-sized screens. */
(()=>{
  function enhance(){
    const filters=document.querySelector('#student-shop-filters'),list=document.querySelector('#student-shop-items');if(!filters||!list)return false;
    if(!filters.querySelector('[data-shop-slot="face"]')){const all=filters.querySelector('[data-shop-slot="all"]');let anchor=all;for(const [slot,label] of [['face','얼굴'],['expression','표정']]){const b=document.createElement('button');b.type='button';b.dataset.shopSlot=slot;b.setAttribute('aria-pressed','false');b.textContent=label;anchor?.after(b);anchor=b}}
    if(!document.querySelector('#sv-avatar-shop-ux-style')){const style=document.createElement('style');style.id='sv-avatar-shop-ux-style';style.textContent='#student-shop-items{max-height:min(44vh,420px);overflow-y:auto;overscroll-behavior:contain;padding-right:4px}.student-shop-filters{display:flex;flex-wrap:wrap;gap:6px;max-height:94px;overflow-y:auto;overscroll-behavior:contain}.student-shop .inventory-item{min-height:92px}.student-shop-head{position:sticky;top:0;z-index:2;background:inherit}';document.head.appendChild(style)}
    return true;
  }
  if(!enhance()){const observer=new MutationObserver(()=>{if(enhance())observer.disconnect()});observer.observe(document.body,{subtree:true,childList:true})}
})();
