/* Stabilization: legacy astronaut data may exist in old classroom records, but it is no longer a selectable student base. */
(()=>{
  const list=document.querySelector('#base-character-list');if(!list)return;
  function clean(){
    const buttons=[...list.querySelectorAll('button.inventory-item')];
    const legacy=buttons.filter(button=>button.querySelector('strong')?.textContent?.trim()==='우주 탐험가'||button.textContent.includes('🧑‍🚀'));
    if(!legacy.length)return;
    const selectedLegacy=legacy.some(button=>button.classList.contains('selected'));
    if(selectedLegacy){const fallback=buttons.find(button=>button.querySelector('strong')?.textContent?.trim()==='기본 학생'&&!legacy.includes(button));fallback?.click()}
    legacy.forEach(button=>button.remove());
  }
  new MutationObserver(clean).observe(list,{childList:true,subtree:true});
  document.querySelector('#customize-button')?.addEventListener('click',()=>setTimeout(clean,0));
  setTimeout(clean,300);
})();
