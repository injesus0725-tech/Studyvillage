/* Student startup prerequisites. Keep the login screen usable even when a later optional script fails. */
(()=>{
  const title=document.querySelector('#title-screen');
  const game=document.querySelector('#game-screen');
  const start=document.querySelector('#start-button');
  const name=document.querySelector('#player-name');
  const password=document.querySelector('#player-password');
  const dialogue=document.querySelector('#dialogue');

  if(dialogue&&!document.querySelector('#dialogue-next')){
    dialogue.innerHTML='<div class="dialogue-avatar">👩‍🏫</div><div class="dialogue-body"><strong id="dialogue-name">도우미 선생님</strong><p id="dialogue-text"></p></div><button id="dialogue-next" type="button">다음 ▶</button>';
  }

  /* A fresh page must always begin at the student login. Session restoration may
     later press the normal login button, but no stale screen/overlay may hide it. */
  function exposeLogin(){
    if(!title||!start)return;
    if(!game?.classList.contains('active'))title.classList.add('active');
    start.hidden=false;
    start.style.pointerEvents='auto';
    start.removeAttribute('aria-disabled');
    if(!start.disabled||start.textContent==='마을 입장')start.disabled=false;
    if(name)name.disabled=false;
    if(password)password.disabled=false;
  }
  exposeLogin();
  window.addEventListener('pageshow',()=>{
    if(!game?.classList.contains('active'))exposeLogin();
  });
  /* If startup never reaches the normal login handler, do not leave a frozen
     disabled button behind. Network login itself may legitimately take longer,
     so only restore buttons that are still on the untouched login label. */
  setTimeout(()=>{
    if(title?.classList.contains('active')&&start?.textContent==='마을 입장')exposeLogin();
  },1200);
})();
