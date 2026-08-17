/* Live teacher notification for new physical shop delivery requests. */
(()=>{
  const POLL_MS=5000,REQUEST_TIMEOUT_MS=5000;
  let timer=null,busy=false,initialized=false,knownPending=new Set();
  const headers=()=>{const token=sessionStorage.getItem('studyvillage-admin-token')||'';return token?{Authorization:`Bearer ${token}`}:{}};
  const adminVisible=()=>{const app=document.querySelector('#admin-app');return !!app&&!app.hidden&&!document.hidden&&navigator.onLine&&!!sessionStorage.getItem('studyvillage-admin-token')};
  async function request(){const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),REQUEST_TIMEOUT_MS);try{return await fetch('/api/admin/shop',{headers:headers(),cache:'no-store',signal:controller.signal})}finally{clearTimeout(timeout)}}
  function announce(rows){
    const pending=(Array.isArray(rows)?rows:[]).filter(row=>row?.status==='pending'),next=new Set(pending.map(row=>Number(row.id)).filter(Number.isInteger));
    if(!initialized){knownPending=next;initialized=true;return}
    const fresh=pending.filter(row=>!knownPending.has(Number(row.id)));
    knownPending=next;
    if(!fresh.length)return;
    const latest=fresh[0],message=fresh.length===1?`📦 ${latest.playerName} 학생이 ${latest.itemName} 전달을 요청했습니다.`:`📦 새 전달 요청이 ${fresh.length}건 들어왔습니다.`;
    const badge=document.querySelector('#shop-delivery-status');if(badge){badge.textContent=`새 요청 ${fresh.length}건 · 확인 필요`;badge.classList.add('warning')}
    try{window.alert(`${message}\n교사용 상점의 ‘전달 요청’에서 확인해 주세요.`)}catch{}
  }
  async function poll(){if(busy||!adminVisible())return;busy=true;try{const response=await request();if(response.status===401){initialized=false;knownPending.clear();return}const data=await response.json().catch(()=>({}));if(response.ok&&data.ok)announce(data.deliveryRequests)}catch{}finally{busy=false}}
  function start(){if(timer)return;poll();timer=setInterval(poll,POLL_MS)}
  function stop(){if(timer){clearInterval(timer);timer=null}}
  document.addEventListener('visibilitychange',()=>document.hidden?stop():start());
  window.addEventListener('online',start);window.addEventListener('offline',stop);
  window.addEventListener('load',()=>setTimeout(start,900));
  document.querySelector('#refresh-button')?.addEventListener('click',()=>setTimeout(poll,300));
  const observer=new MutationObserver(()=>{adminVisible()?start():stop()});observer.observe(document.documentElement,{subtree:true,attributes:true,attributeFilter:['hidden']});
})();
