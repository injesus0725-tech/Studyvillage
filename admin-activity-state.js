/* v0.9.37 teacher activity open/close controls. */
(()=>{
  const app=document.querySelector('#admin-app');if(!app)return;
  const token=()=>sessionStorage.getItem('studyvillage-admin-token')||'';
  const headers=()=>token()?{Authorization:`Bearer ${token}`}:{ };
  const section=document.createElement('section');section.className='panel';section.innerHTML=`<div class="panel-head"><div><h2>🚪 활동 열기·닫기</h2><p>학생이 다시 들어올 수 있는 활동을 선생님이 직접 정합니다.</p></div><span id="activity-state-summary" class="overview-count">확인 중…</span></div><div id="activity-state-list" style="padding:8px 22px 22px"><p class="empty">활동 상태를 확인하는 중입니다.</p></div>`;
  const classPanel=[...app.querySelectorAll('.panel')].find(p=>p.textContent.includes('우리 반 활동 현황'));if(classPanel)classPanel.after(section);else app.prepend(section);
  const list=section.querySelector('#activity-state-list'),summary=section.querySelector('#activity-state-summary');
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  async function load(){
    if(!token())return;
    try{const r=await fetch('/api/admin/activity-states',{headers:headers(),cache:'no-store'});if(!r.ok)throw new Error();const d=await r.json(),rows=d.activities||[];summary.textContent=`${rows.filter(x=>x.open).length}개 열림`;list.innerHTML='';rows.forEach(a=>{const card=document.createElement('article');card.style.cssText='display:flex;align-items:center;justify-content:space-between;gap:16px;padding:13px 4px;border-bottom:1px solid #e7ece8;flex-wrap:wrap';card.innerHTML=`<div><strong>${esc(a.name)}</strong><div style="margin-top:4px;color:#78857c;font-size:12px">${a.open?'🟢 학생 입장 가능':'🔒 문 닫힘'}</div></div><button data-id="${esc(a.activityId)}" data-name="${esc(a.name)}" data-open="${a.open?'1':'0'}">${a.open?'문 닫기':'다시 열기'}</button>`;list.appendChild(card)})}catch{summary.textContent='확인 실패';list.innerHTML='<p class="empty">활동 상태를 불러오지 못했습니다.</p>'}
  }
  list.addEventListener('click',async e=>{const b=e.target.closest('button[data-id]');if(!b)return;const id=b.dataset.id,name=b.dataset.name,currentlyOpen=b.dataset.open==='1',nextOpen=!currentlyOpen;if(currentlyOpen&&!confirm(`${name}의 문을 닫을까요?\n진행 중이던 임시 기록은 바로 삭제하지 않지만 학생은 다시 들어갈 수 없게 됩니다.`))return;b.disabled=true;try{const r=await fetch(`/api/admin/activity-state/${encodeURIComponent(id)}`,{method:'PUT',headers:{...headers(),'Content-Type':'application/json'},body:JSON.stringify({name,open:nextOpen})});if(!r.ok)throw new Error();await load()}catch{alert('활동 상태를 바꾸지 못했습니다. 다시 시도해 주세요.')}finally{b.disabled=false}});
  const observer=new MutationObserver(()=>{if(!app.hidden)load()});observer.observe(app,{attributes:true,attributeFilter:['hidden']});setTimeout(load,900);
})();