/* Retire the pre-study-menu exploration overlay without touching shared village/ranking layout code. */
(()=>{
  const legacyPanel=document.querySelector('.sv-expedition-panel');
  if(legacyPanel)legacyPanel.remove();
  document.documentElement.dataset.legacyExplorationRetired='true';
})();
