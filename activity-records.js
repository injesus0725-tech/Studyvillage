/* v0.8.5 unified activity record summary */
(()=>{
  const panel=document.querySelector('#record-panel');
  if(!panel)return;
  const labels={vocabulary:{icon:'📚',name:'책마루 · 낱말 뜻 맞추기'},riddle:{icon:'❓',name:'도전관 · 수수께끼'}};
  const section=document.createElement('section');
  section.className='activity-summary-box';
  section.innerHTML='<div class="activity-summary-head"><h3>📚 활동별 기록</h3><span id="activity-summary-count">0개 활동</span></div><div id="activity-summary-list" class="activity-summary-list"><p class="activity-summary-empty">아직 저장된 활동 기록이 없어요.</p></div>';
  const reward=panel.querySelector('.reward-box');
  if(reward)reward.before(section);else panel.appendChild(section);
  const list=section.querySelector('#activity-summary-list'),count=section.querySelector('#activity-summary-count');
  const headers=()=>window.StudyVillageAuth?.authHeaders?.()||{};
  const labelFor=id=>labels[id]||{icon:'🎯',name:id.replace(/-/g,' ')};
  function render(activities=[]){
    const rows=Array.isArray(activities)?activities:[];
    count.textContent=`${rows.length}개 활동`;
    list.innerHTML='';
    if(!rows.length){list.innerHTML='<p class="activity-summary-empty">아직 저장된 활동 기록이 없어요. 첫 활동에 도전해 보세요! 🌱</p>';return}
    rows.forEach(a=>{
      const meta=labelFor(a.activityId||'activity'),card=document.createElement('article');
      card.className='activity-summary-card';
      card.innerHTML=`<div class="activity-summary-title"><span>${meta.icon}</span><strong>${meta.name}</strong></div><div class="activity-summary-stats"><span>도전 <b>${Number(a.attempts)||0}회</b></span><span>최고 <b>${Number(a.bestScore)||0}점</b></span><span>최근 <b>${Number(a.lastScore)||0}점</b></span><span>누적 <b>${Number(a.totalScore)||0}점</b></span></div>`;
      list.appendChild(card);
    });
  }
  async function load(){
    try{const r=await fetch('/api/player/me',{headers:headers()});if(!r.ok)return;const d=await r.json();render(d.player?.activities||[])}catch{}
  }
  document.querySelector('#record-button')?.addEventListener('click',()=>setTimeout(load,0));
  window.addEventListener('studyvillage:library-complete',()=>setTimeout(load,0));
  window.addEventListener('studyvillage:activity-record-refresh',load);
})();
