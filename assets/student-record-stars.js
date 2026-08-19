/* Student record: show current spendable star balance without opening the shop/ledger. */
(()=>{
  const panel=document.querySelector('#record-panel'),grid=panel?.querySelector('.record-grid');if(!panel||!grid)return;
  let card=document.querySelector('#record-star-card');
  if(!card){card=document.createElement('div');card.id='record-star-card';card.innerHTML='<span>⭐ 보유 별</span><strong id="record-stars">확인 중…</strong>';grid.appendChild(card)}
  const value=card.querySelector('#record-stars');
  let busy=false;
  async function refresh(){if(busy)return;busy=true;value.textContent='확인 중…';const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),5000);try{const response=await fetch('/api/player/me/stars?limit=1',{headers:window.StudyVillageAuth?.authHeaders?.()||{},cache:'no-store',signal:controller.signal}),data=await response.json().catch(()=>({}));if(response.status===401){value.textContent='다시 로그인';return}if(!response.ok||!data.ok){value.textContent='확인 필요';return}value.textContent=`${Math.max(0,Number(data.balance)||0)}별`}catch{value.textContent='확인 필요'}finally{clearTimeout(timer);busy=false}}
  document.querySelector('#record-button')?.addEventListener('click',()=>setTimeout(refresh,0));
  window.addEventListener('studyvillage:stars-refresh',refresh);window.addEventListener('studyvillage:shop-purchase',refresh);window.addEventListener('studyvillage:activity-record-refresh',refresh);window.addEventListener('studyvillage:session-restored',refresh);
  setTimeout(refresh,700);
})();
