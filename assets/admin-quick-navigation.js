/* One-click teacher navigation and student-to-star shortcuts. */
(()=>{
  const app=document.querySelector('#admin-app');if(!app)return;
  const style=document.createElement('style');style.textContent=`
    .admin-quick-nav{position:sticky;top:0;z-index:120;display:flex;gap:8px;flex-wrap:wrap;padding:10px 12px;margin:0 0 14px;border:1px solid #dce8dd;border-radius:16px;background:#fffdf7f2;box-shadow:0 8px 22px #18342118;backdrop-filter:blur(8px)}
    .admin-quick-nav button{border:1px solid #d8e4d8;border-radius:999px;padding:8px 12px;background:#f4f8f2;color:#315d3b;font-weight:900;cursor:pointer}
    .admin-quick-nav button:active{transform:translateY(1px)}
    .admin-jump-highlight{outline:4px solid #ffd966;outline-offset:4px;transition:outline-color .8s}
  `;document.head.appendChild(style);
  const nav=document.createElement('nav');nav.className='admin-quick-nav';nav.setAttribute('aria-label','관리자 빠른 메뉴');
  const panelByTitle=text=>[...app.querySelectorAll('.panel')].find(p=>p.querySelector('h2')?.textContent.includes(text));
  const items=[
    ['학생 성장·수정',()=>panelByTitle('학생 성장 현황')],
    ['활동 도전(매일)',()=>document.querySelector('#attempt-policy-panel')],
    ['별 지급·관리',()=>document.querySelector('#admin-star-panel')],
    ['아이템·상점',()=>document.querySelector('#shop-admin-panel')],
    ['문제 관리',()=>panelByTitle('문제')],
    ['접속 학생',()=>panelByTitle('접속')],
    ['오류 기록',()=>[...app.querySelectorAll('.panel')].find(p=>/오류|진단/.test(p.querySelector('h2')?.textContent||''))],
    ['백업·복원',()=>panelByTitle('백업과 복원')]
  ];
  const jump=target=>{if(!target)return false;target.scrollIntoView({behavior:'smooth',block:'start'});target.classList.add('admin-jump-highlight');setTimeout(()=>target.classList.remove('admin-jump-highlight'),1300);return true};
  for(const[label,resolver]of items){const button=document.createElement('button');button.type='button';button.textContent=label;button.onclick=()=>{const target=resolver();if(!jump(target))setTimeout(()=>jump(resolver()),350)};nav.appendChild(button)}
  const header=app.querySelector('header');header?.after(nav);if(!header)app.prepend(nav);
  const organizeQuestionPanels=()=>{let anchor=nav;for(const selector of ['#question-review-panel','#question-editor-panel','#question-catalog-panel']){const target=document.querySelector(selector);if(!target)continue;anchor.after(target);anchor=target}};
  setTimeout(organizeQuestionPanels,1000);

  function decorateStudentRows(){
    const body=document.querySelector('#ranking-body');if(!body)return;
    for(const row of body.querySelectorAll('tr')){
      const cell=row.lastElementChild,name=row.querySelector('button[data-action="activities"]')?.dataset.name;if(!cell||!name||cell.querySelector('[data-star-jump]'))continue;
      const button=document.createElement('button');button.type='button';button.dataset.starJump=name;button.textContent='별 지급';
      button.addEventListener('click',event=>{event.preventDefault();event.stopImmediatePropagation();const panel=document.querySelector('#admin-star-panel'),select=document.querySelector('#admin-star-student');if(!panel||!select){alert('별 관리 화면을 준비 중입니다. 잠시 후 다시 눌러 주세요.');return}select.value=name;select.dispatchEvent(new Event('change',{bubbles:true}));jump(panel)},true);
      cell.insertBefore(button,cell.querySelector('button[data-action="password"]')||null);cell.insertBefore(document.createTextNode(' '),button.nextSibling)
    }
  }
  const body=document.querySelector('#ranking-body');if(body)new MutationObserver(decorateStudentRows).observe(body,{childList:true,subtree:true});decorateStudentRows();
})();
