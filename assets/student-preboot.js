/* Student DOM prerequisites that must exist before game.js attaches handlers. */
(()=>{
  const dialogue=document.querySelector('#dialogue');
  if(dialogue&&!document.querySelector('#dialogue-next')){
    dialogue.innerHTML='<div class="dialogue-avatar">👩‍🏫</div><div class="dialogue-body"><strong id="dialogue-name">도우미 선생님</strong><p id="dialogue-text"></p></div><button id="dialogue-next" type="button">다음 ▶</button>';
  }
})();
