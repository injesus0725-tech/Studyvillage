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
    const nav=document.querySelector('.admin-quick-nav');if(nav){const first=[...nav.querySelectorAll('button')].find(b=>/학생 성장/.test(b.textContent));if(first)first.textContent='학생 성장 현황'}
    const attempts=document.querySelector('#attempt-policy-panel'),overview=document.querySelector('#attempt-policy-overview');
    if(attempts&&overview){
      const grid=attempts.querySelector('.attempt-policy-grid');
      if(grid&&overview.compareDocumentPosition(grid)&Node.DOCUMENT_POSITION_PRECEDING)attempts.insertBefore(overview,grid);
      overview.style.border='2px solid #f0d78f';overview.style.borderRadius='18px';overview.style.padding='14px';overview.style.margin='12px 0';overview.style.background='#fffdf4';
      const heading=overview.querySelector('h3');if(heading)heading.textContent='➕ 학생별 오늘 추가 도전 횟수';
    }
    const body=document.querySelector('#ranking-body');if(body){for(const row of body.querySelectorAll('tr')){const name=row.querySelector('button[data-action="activities"]')?.dataset.name,cell=row.lastElementChild;if(!name||!cell)continue;let star=cell.querySelector('[data-star-jump]');if(star)star.textContent='⭐ 별 수정'}}
  }
  document.addEventListener('click',event=>{
    const star=event.target.closest?.('[data-star-jump]');if(!star)return;
    setTimeout(()=>{const panel=document.querySelector('#admin-star-panel'),select=document.querySelector('#admin-star-student');if(select){select.value=star.dataset.starJump;select.dispatchEvent(new Event('change',{bubbles:true}))}jump(panel)},0)
  },true);
  new MutationObserver(stabilize).observe(app,{subtree:true,childList:true});
  window.addEventListener('load',()=>setTimeout(stabilize,50));setTimeout(stabilize,50);setTimeout(stabilize,500);
})();
