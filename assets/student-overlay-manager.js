/* Student HUD panels are mutually exclusive. Opening a top menu closes the current foreground panel first. */
(()=>{
  const topIds=new Set(['customize-button','record-button']);
  function isTopButton(el){return !!el&&(topIds.has(el.id)||el.textContent?.includes('탐험'))}
  function hide(selector){document.querySelectorAll(selector).forEach(el=>{if(!el.hidden)el.hidden=true})}
  function closeForeground(except){
    const selectors=['#customize-panel','#record-panel','#library-game','.math-practice-panel','#quiz-panel','#student-explore-panel','#building-interior'];
    for(const selector of selectors){document.querySelectorAll(selector).forEach(el=>{if(el!==except&&!el.hidden)el.hidden=true})}
  }
  document.addEventListener('click',event=>{const button=event.target.closest('button');if(!isTopButton(button))return;let except=null;if(button.id==='customize-button')except=document.querySelector('#customize-panel');else if(button.id==='record-button')except=document.querySelector('#record-panel');else except=document.querySelector('#student-explore-panel');closeForeground(except)},true);
  window.StudyVillagePanels={closeForeground};
})();