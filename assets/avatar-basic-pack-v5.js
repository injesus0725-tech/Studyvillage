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
,'hand-balloon':{svg:s('<path fill="none" d="M20 74q8 22 4 40"/><ellipse fill="#75bde8" cx="17" cy="63" rx="12" ry="15"/><path fill="#75bde8" d="M17 77l-4 7h8z"/><path fill="#fff6" stroke="none" d="M10 56q4-7 8-6-4 3-5 9z"/>')}
,'hand-candy-cane':{svg:s('<path fill="none" stroke="#f5eee2" stroke-width="8" d="M29 101L11 72q-6-11 5-15 10-2 12 8"/><path fill="none" stroke="#d95358" stroke-width="3" stroke-dasharray="7 6" d="M29 101L11 72q-6-11 5-15 10-2 12 8"/>')}
,'hand-lollipop':{svg:s('<path fill="#b98b4f" d="M26 83l4 2-13 27-4-2z"/><circle fill="#ef6d86" cx="29" cy="74" r="12"/><path fill="none" stroke="#ffd35e" stroke-width="3" d="M22 70q13-7 14 4-2 9-12 3"/>')}
,'hand-flower-bouquet':{svg:s('<path fill="#67945f" d="M22 83l5 2-7 27-5-2zM12 87l5-3 8 26-5 2z"/><circle fill="#f18ba5" cx="12" cy="78" r="7"/><circle fill="#ffd45d" cx="24" cy="74" r="8"/><circle fill="#8ecde3" cx="32" cy="82" r="7"/><path fill="#d8b45d" d="M12 96h18l-4 9H16z"/>')}
,'hand-village-flag':{svg:s('<path fill="#8a673f" d="M25 64h4v50h-4z"/><path fill="#5da2d8" d="M29 65h25l-7 11 7 11H29z"/><path fill="#ffe06b" d="M39 70l2 5 5 1-4 3 1 5-4-3-4 3 1-5-4-3 5-1z"/>')}
,'hand-bubble-wand':{svg:s('<path fill="#6b8db3" d="M24 83h4v31h-4z"/><circle fill="#a9eaf399" cx="26" cy="73" r="11"/><circle fill="#d6f8fc99" stroke="none" cx="11" cy="61" r="5"/><circle fill="#d6f8fc99" stroke="none" cx="37" cy="55" r="4"/>')}
,'hand-lantern':{svg:s('<path fill="none" d="M13 79q5-15 16 0"/><path fill="#6b5143" d="M11 80h21v27H11z"/><path fill="#ffd86b" d="M15 84h13v18H15z"/><path fill="#fff1a3" stroke="none" d="M19 87h4v11h-4z"/>')}
,'hand-umbrella':{svg:s('<path fill="#67abd2" d="M3 78q18-27 38 0-6-4-10 1-6-6-10 0-5-6-10 0-4-5-8-1z"/><path fill="none" d="M22 76v31q0 9 8 4"/>')}
,'hand-trophy':{svg:s('<path fill="#e2b94f" d="M10 72h22v15q-2 13-11 13T10 87zM18 99h6v9h-6zM11 108h21v6H11z"/><path fill="none" d="M10 76H3q0 14 11 15m18-15h7q0 14-11 15"/><path fill="#fff2a1" d="M21 77l2 5 5 1-4 3 1 5-4-3-4 3 1-5-4-3 5-1z"/>')}
,'hand-guitar':{svg:s('<ellipse fill="#b96b42" cx="18" cy="96" rx="13" ry="17"/><circle fill="#4d392f" cx="18" cy="95" r="5"/><path fill="#8a5a3c" d="M23 85l18-28 5 3-18 30z"/><path fill="#d6b15d" d="M39 55h10v9H39z"/><path fill="none" stroke="#f4dc9c" d="M18 80v31"/>')}
,'hand-star-cookie':{svg:s('<path fill="#d9a75a" d="M19 77l5 10 11 2-8 8 2 11-10-5-10 5 2-11-8-8 11-2z"/><circle fill="#76503a" stroke="none" cx="15" cy="92" r="2"/><circle fill="#76503a" stroke="none" cx="23" cy="96" r="2"/><circle fill="#76503a" stroke="none" cx="19" cy="87" r="2"/>')}
,'hand-magic-orb':{svg:s('<circle fill="#8b72d7" cx="20" cy="83" r="14"/><circle fill="#d9cfff" stroke="none" cx="16" cy="78" r="5"/><path fill="#6b5143" d="M11 98h18l5 15H6z"/><path fill="#e9cf67" d="M9 104h22v4H9z"/>')}
,'pet-unicorn':{svg:s('<ellipse fill="#f4eef4" cx="81" cy="123" rx="14" ry="11"/><path fill="#f4eef4" d="M70 115l2-12 8 8 9-7 4 12v17H70z"/><path fill="#e7c456" d="M80 106l4-15 4 16z"/><path fill="#bc8ed3" d="M69 113q9-13 18-8l-4 5-8 8z"/><circle fill="#4c4148" cx="77" cy="119" r="2"/><circle fill="#4c4148" cx="87" cy="119" r="2"/>')}
,'pet-robot':{svg:s('<rect fill="#91a9ba" x="68" y="108" width="26" height="26" rx="6"/><path fill="#687d8e" d="M79 101h4v8h-4z"/><circle fill="#f0cf5a" cx="81" cy="99" r="3"/><circle fill="#66d4df" cx="76" cy="117" r="3"/><circle fill="#66d4df" cx="86" cy="117" r="3"/><path fill="none" d="M76 127h10"/>')}
,'pet-smile-cloud':{svg:s('<path fill="#eaf7ff" d="M67 125q0-9 8-10 2-11 12-8 7 1 7 9 8 1 7 9-1 8-10 8H76q-9 0-9-8z"/><circle fill="#4b5660" cx="80" cy="123" r="2"/><circle fill="#4b5660" cx="90" cy="123" r="2"/><path fill="none" d="M81 128q4 3 8 0"/>')}
,'pet-friendly-ghost':{svg:s('<path fill="#e9e4f2" d="M69 132v-15q0-13 12-13t12 13v15l-6-4-6 5-6-5z"/><circle fill="#554d60" cx="77" cy="116" r="2"/><circle fill="#554d60" cx="86" cy="116" r="2"/><path fill="none" d="M78 122q3 3 6 0"/>')}
,'pet-sprout':{svg:s('<path fill="#8bc66e" d="M79 110q-13-2-14-12 12-2 17 8 2-13 14-13 0 12-13 17z"/><ellipse fill="#a8734b" cx="81" cy="125" rx="13" ry="10"/><circle fill="#3f3a36" cx="77" cy="123" r="2"/><circle fill="#3f3a36" cx="86" cy="123" r="2"/><path fill="none" d="M78 128q3 2 6 0"/>')}
,'pet-baby-seal':{svg:s('<ellipse fill="#c9d5dd" cx="81" cy="124" rx="15" ry="11"/><circle fill="#dce5ea" cx="88" cy="114" r="10"/><circle fill="#3c454b" cx="85" cy="112" r="2"/><circle fill="#3c454b" cx="93" cy="112" r="2"/><ellipse fill="#59646b" cx="89" cy="117" rx="3" ry="2"/><path fill="none" d="M86 119l-8 3m14-3 8 2"/>')}
,'pet-red-panda':{svg:s('<path fill="#b75d3e" d="M68 112l4-13 9 8 9-8 4 13v21H68z"/><path fill="#f4e1c7" d="M72 113l9 9 9-9-2 15H74z"/><path fill="#4b3b35" d="M69 110l8 3-5 6zm24 0-8 3 5 6z"/><circle fill="#372f2c" cx="77" cy="116" r="2"/><circle fill="#372f2c" cx="86" cy="116" r="2"/>')}
,'pet-phoenix':{svg:s('<path fill="#e05d43" d="M81 105l7 10 12-5-7 12 6 9-13-4-5 10-5-10-13 4 6-9-7-12 12 5z"/><path fill="#f3b64f" d="M81 110l5 10-5 12-5-12z"/><circle fill="#3c3430" cx="78" cy="118" r="1.5"/><circle fill="#3c3430" cx="84" cy="118" r="1.5"/>')}
,'pet-octopus':{svg:s('<circle fill="#9b79c6" cx="81" cy="117" r="12"/><path fill="none" stroke="#9b79c6" stroke-width="6" d="M72 126q-8 10-12 1m17 1q-5 11-10 4m20-4q5 11 10 4m-7-6q8 10 12 1"/><circle fill="#fff" stroke="none" cx="77" cy="115" r="3"/><circle fill="#fff" stroke="none" cx="86" cy="115" r="3"/><circle fill="#3d3446" stroke="none" cx="77" cy="115" r="1.5"/><circle fill="#3d3446" stroke="none" cx="86" cy="115" r="1.5"/>')}
,'pet-side-heart':{svg:s('<path fill="#ef7391" d="M81 132q-18-11-18-22 0-8 8-8 7 0 10 7 3-7 10-7 8 0 8 8 0 11-18 22z"/><path fill="#fff7" stroke="none" d="M70 107q5-4 8 1-5 0-7 5z"/>')}
,'pet-side-music':{svg:s('<path fill="#735bb2" d="M76 105h4v22q-4 10-12 5-4-7 7-10zm4 4 17-5v18q-4 10-12 5-4-7 7-10v-7l-12 4z"/>')}
,'pet-side-wow':{svg:s('<path fill="#f2c95a" d="M77 101h9l-2 23h-5z"/><circle fill="#f2c95a" cx="81" cy="132" r="5"/><path fill="#fff3" stroke="none" d="M80 105h3l-1 13h-2z"/>')}
,'pet-side-cheer':{svg:s('<path fill="#78b6df" d="M65 105h34v23H84l-9 8 2-8H65z"/><path fill="#fff" stroke="none" d="M72 113h20v4H72zm0 7h14v4H72z"/>')}
,'pet-side-fire':{svg:s('<path fill="#e85d42" d="M81 137q-15-4-12-18 2-9 10-17 0 10 6 12 6-8 5-15 13 14 7 27-4 9-16 11z"/><path fill="#ffd05a" d="M82 132q-8-3-6-10 1-5 6-9 0 6 4 8 4 7-4 11z"/>')}
,'pet-side-rainbow':{svg:s('<path fill="none" stroke="#e56a69" stroke-width="5" d="M65 130q16-30 32 0"/><path fill="none" stroke="#f0c85b" stroke-width="5" d="M70 130q11-21 22 0"/><path fill="none" stroke="#69b77b" stroke-width="5" d="M75 130q6-12 12 0"/><circle fill="#eef7ff" cx="65" cy="131" r="7"/><circle fill="#eef7ff" cx="97" cy="131" r="7"/>')}
,'pet-side-sparkle':{svg:s('<path fill="#f1d25f" d="M81 103l4 11 11 4-11 4-4 11-4-11-11-4 11-4z"/><path fill="#9bd8e5" d="M96 99l2 6 6 2-6 2-2 6-2-6-6-2 6-2zM68 125l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/>')}
,'pet-side-thumbs':{svg:s('<path fill="#f2c19c" d="M72 116l7-16q4-7 8-2v14h10q6 0 4 7l-5 16H73z"/><path fill="#5e91c5" d="M64 115h10v22H64z"/><path fill="#fff5" stroke="none" d="M67 119h4v14h-4z"/>')}
,'pet-side-question':{svg:s('<path fill="#70a6d5" d="M70 109q1-12 12-12 13 0 14 11 1 9-9 14v5h-9v-10q9-3 9-9 0-4-5-4-5 0-5 6z"/><circle fill="#70a6d5" cx="82" cy="135" r="5"/>')}
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
    if(!document.querySelector('#sv-avatar-shop-ux-style')){const style=document.createElement('style');style.id='sv-avatar-shop-ux-style';style.textContent='#student-shop-items{max-height:min(44vh,420px);overflow-y:auto;overscroll-behavior:contain;padding-right:4px}.student-shop-filters{display:flex;flex-wrap:wrap;gap:6px;max-height:94px;overflow-y:auto;overscroll-behavior:contain}.student-shop .inventory-item{min-height:92px}.student-shop-head{position:sticky;top:0;z-index:2;background:inherit}';document.head.appendChild(style)}
    return true;
  }
  if(!enhance()){const observer=new MutationObserver(()=>{if(enhance())observer.disconnect()});observer.observe(document.body,{subtree:true,childList:true})}
})();
