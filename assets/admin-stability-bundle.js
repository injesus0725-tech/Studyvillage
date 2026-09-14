/* Teacher UX stabilization: passwordless local entry, direct student-growth navigation, visible extra-attempt controls, and reliable star jump. */
(()=>{
  const login=document.querySelector('#admin-login'),password=document.querySelector('#admin-password'),loginButton=document.querySelector('#admin-login-button'),message=document.querySelector('#admin-login-message');
  const local=['localhost','127.0.0.1','::1'].includes(location.hostname);
  if(local&&login&&password&&loginButton&&sessionStorage.getItem('studyvillage-admin-token'))login.hidden=true;

  const app=document.querySelector('#admin-app');if(!app)return;
  const byTitle=text=>[...app.querySelectorAll('.panel')].find(p=>p.querySelector('h2')?.textContent.includes(text));
  function jump(target){if(!target)return false;target.scrollIntoView({behavior:'smooth',block:'start'});target.classList.add('admin-jump-highlight');setTimeout(()=>target.classList.remove('admin-jump-highlight'),1200);return true}
  function stabilize(){
    const growth=byTitle('학생 성장 현황');if(growth&&!growth.id)growth.id='student-growth-panel';
    const nav=document.querySelector('.admin-quick-nav');if(nav){const first=[...nav.querySelectorAll('button')].find(b=>/학생 성장/.test(b.textContent));if(first&&first.textContent!=='학생 성장 현황')first.textContent='학생 성장 현황'}
    const attempts=document.querySelector('#attempt-policy-panel'),overview=document.querySelector('#attempt-policy-overview');
    if(attempts&&overview){
      const grid=attempts.querySelector('.attempt-policy-grid');
      if(grid&&overview.compareDocumentPosition(grid)&Node.DOCUMENT_POSITION_PRECEDING)attempts.insertBefore(overview,grid);
      overview.style.border='2px solid #f0d78f';overview.style.borderRadius='18px';overview.style.padding='14px';overview.style.margin='12px 0';overview.style.background='#fffdf4';
      const heading=overview.querySelector('h3');if(heading&&heading.textContent!=='➕ 학생별 오늘 추가 도전 횟수')heading.textContent='➕ 학생별 오늘 추가 도전 횟수';
    }
    const body=document.querySelector('#ranking-body');if(body){for(const row of body.querySelectorAll('tr')){const name=row.querySelector('button[data-action="activities"]')?.dataset.name,cell=row.lastElementChild;if(!name||!cell)continue;let star=cell.querySelector('[data-star-jump]');if(star)star.textContent='⭐ 별 수정'}}
  }
  document.addEventListener('click',event=>{
    const star=event.target.closest?.('[data-star-jump]');if(!star)return;
    setTimeout(()=>{const panel=document.querySelector('#admin-star-panel'),select=document.querySelector('#admin-star-student');if(select){select.value=star.dataset.starJump;select.dispatchEvent(new Event('change',{bubbles:true}))}jump(panel)},0)
  },true);
  let stabilizeQueued=false;
  new MutationObserver(()=>{if(stabilizeQueued)return;stabilizeQueued=true;requestAnimationFrame(()=>{stabilizeQueued=false;stabilize()})}).observe(app,{subtree:true,childList:true});
  const registration=document.createElement('section');registration.id='student-registration-panel';registration.className='panel';registration.innerHTML='<div class="panel-head"><div><h2>🔐 새 학생 가입</h2><p>모든 학생이 가입한 뒤 잠그면 기존 학생은 계속 로그인할 수 있지만, 새로운 이름으로는 계정이 만들어지지 않습니다.</p></div><button id="student-registration-toggle" type="button" disabled>상태 확인 중…</button></div><p id="student-registration-status" class="record-message">가입 설정을 불러오는 중입니다.</p>';
  document.querySelector('.summary')?.after(registration);
  const registrationButton=registration.querySelector('#student-registration-toggle'),registrationStatus=registration.querySelector('#student-registration-status');let registrationEnabled=true,registrationBusy=false;
  const adminHeaders=()=>({Authorization:`Bearer ${sessionStorage.getItem('studyvillage-admin-token')||''}`});
  function renderRegistration(studentCount=0){registrationButton.disabled=registrationBusy;registrationButton.textContent=registrationEnabled?'가입 허용 중 · 잠그기':'가입 잠김 · 다시 허용';registrationButton.setAttribute('aria-pressed',String(registrationEnabled));registrationStatus.textContent=registrationEnabled?`현재 새 학생 가입을 허용하고 있습니다. 등록 학생 ${studentCount}명`:`현재 새 학생 가입이 잠겨 있습니다. 기존 학생 ${studentCount}명은 그대로 로그인할 수 있습니다.`;registrationStatus.className=`record-message ${registrationEnabled?'':'success'}`}
  async function loadRegistration(){if(!sessionStorage.getItem('studyvillage-admin-token'))return;try{const response=await fetch('/api/admin/student-registration',{headers:adminHeaders(),cache:'no-store'}),data=await response.json();if(!response.ok||!data.ok)throw new Error(data.code||'registration-load-failed');registrationEnabled=data.enabled!==false;renderRegistration(data.studentCount)}catch{registrationButton.disabled=true;registrationStatus.textContent='가입 설정을 불러오지 못했습니다. 관리자 로그인을 다시 확인해 주세요.'}}
  registrationButton.addEventListener('click',async()=>{if(registrationBusy)return;const next=!registrationEnabled;if(!confirm(next?'새 학생 가입을 다시 허용할까요?':'새 학생 가입을 잠글까요?\n기존 학생 로그인은 계속 가능합니다.'))return;registrationBusy=true;registrationButton.disabled=true;try{const response=await fetch('/api/admin/student-registration',{method:'PUT',headers:{...adminHeaders(),'Content-Type':'application/json'},body:JSON.stringify({enabled:next})}),data=await response.json();if(!response.ok||!data.ok)throw new Error(data.code||'registration-save-failed');registrationEnabled=data.enabled!==false;renderRegistration(data.studentCount)}catch{registrationStatus.textContent='가입 설정을 저장하지 못했습니다. 다시 시도해 주세요.'}finally{registrationBusy=false;registrationButton.disabled=false}});
  document.querySelector('#refresh-button')?.addEventListener('click',loadRegistration);window.addEventListener('focus',()=>{if(!app.hidden)loadRegistration()});new MutationObserver(()=>{if(!app.hidden)loadRegistration()}).observe(app,{attributes:true,attributeFilter:['hidden']});
  window.addEventListener('load',()=>{setTimeout(stabilize,50);setTimeout(loadRegistration,80)});setTimeout(stabilize,50);setTimeout(stabilize,500);setTimeout(loadRegistration,550);
})();
