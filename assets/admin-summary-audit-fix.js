/* Stabilization: teacher summary counts all learning/exploration activity attempts, not only the legacy riddle counter. */
(()=>{
  const app=document.querySelector('#admin-app'),target=document.querySelector('#attempt-count');if(!app||!target)return;
  let busy=false;
  const token=()=>sessionStorage.getItem('studyvillage-admin-token')||'';
  function attemptsFor(player){const rows=Array.isArray(player?.activities)?player.activities:[];if(rows.length)return rows.reduce((sum,row)=>sum+Math.max(0,Number(row?.attempts)||0),0);return Math.max(0,Number(player?.attempts)||0)}
  async function refresh(){if(busy||app.hidden||!token())return;busy=true;try{const response=await fetch('/api/admin/players',{headers:{Authorization:`Bearer ${token()}`},cache:'no-store'}),data=await response.json().catch(()=>({}));if(!response.ok||!Array.isArray(data.players))return;const total=data.players.reduce((sum,p)=>sum+attemptsFor(p),0);target.textContent=`${total}회`;target.title='책마루·도전관·배움터·탐험을 포함한 전체 활동 도전 횟수'}catch{}finally{busy=false}}
  document.querySelector('#refresh-button')?.addEventListener('click',()=>setTimeout(refresh,250));window.addEventListener('focus',refresh);new MutationObserver(()=>{if(!app.hidden)setTimeout(refresh,250)}).observe(app,{attributes:true,attributeFilter:['hidden']});setTimeout(refresh,700);
  window.StudyVillageAdminSummaryAudit={attemptsFor,refresh};
})();
