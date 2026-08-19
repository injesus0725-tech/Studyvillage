/* Teacher dashboard: replace one very long page with a home menu and focused work areas. */
(()=>{
  const app=document.querySelector('#admin-app');if(!app)return;
  const groups=[
    {id:'students',icon:'🌟',title:'학생 관리',desc:'성장·XP·칭호·비밀번호·개별 활동',keys:['학생 성장','살펴볼 학생','학생 활동별','학생별 남은']},
    {id:'activities',icon:'🎯',title:'활동·횟수',desc:'활동 현황·매일 도전 횟수·열기/닫기·이어하기',keys:['우리 반 활동','도전 횟수','활동 열기','체크포인트','이어하기']},
    {id:'questions',icon:'📝',title:'문제 관리',desc:'문제 검토·수정·교사용 문제 편집',keys:['문제 검토','문제 편집','문제 관리']},
    {id:'shop',icon:'⭐',title:'별·상점·아이템',desc:'별 지급·상점 설정·아이템·전달 요청',keys:['별 관리','별 지급','상점','아이템','전달']},
    {id:'explore',icon:'🧭',title:'탐험 관리',desc:'탐험 횟수·수집·발견 기록',keys:['탐험','수집','발견']},
    {id:'system',icon:'🛠️',title:'기록·백업·오류',desc:'최근 활동·오류·백업·복원·접속 상태',keys:['최근 활동','오류','백업','접속','온라인']}
  ];
  const nav=document.createElement('section');nav.id='admin-dashboard-menu';nav.innerHTML=`<div class="sv-admin-home-head"><div><h2>🏠 관리자 홈</h2><p>필요한 관리 메뉴만 열어서 사용하세요.</p></div><button type="button" data-admin-home hidden>← 관리자 홈</button></div><div class="sv-admin-menu-grid">${groups.map(g=>`<button type="button" data-admin-group="${g.id}"><span>${g.icon}</span><strong>${g.title}</strong><small>${g.desc}</small></button>`).join('')}</div>`;
  const header=app.querySelector('header');header?.after(nav);if(!header)app.prepend(nav);
  const style=document.createElement('style');style.textContent='#admin-dashboard-menu{margin:16px 0;padding:18px;border:1px solid #dfe8df;border-radius:22px;background:#fbfdf8}.sv-admin-home-head{display:flex;justify-content:space-between;gap:12px;align-items:center}.sv-admin-home-head h2{margin:0}.sv-admin-home-head p{margin:4px 0 0;color:#6c7d70}.sv-admin-menu-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin-top:14px}.sv-admin-menu-grid button{display:grid;grid-template-columns:auto 1fr;text-align:left;gap:3px 10px;align-items:center;padding:15px;border:1px solid #dce6dc;border-radius:16px;background:#fff;cursor:pointer}.sv-admin-menu-grid button>span{grid-row:1/3;font-size:28px}.sv-admin-menu-grid strong{font-size:16px;color:#294c35}.sv-admin-menu-grid small{color:#718077;line-height:1.35}.sv-admin-menu-grid button:hover{box-shadow:0 5px 18px #24472d18;transform:translateY(-1px)}[data-admin-home]{padding:9px 13px;border:0;border-radius:12px;background:#eaf3e8;color:#31583c;font-weight:900;cursor:pointer}.sv-admin-hidden-by-menu{display:none!important}';document.head.appendChild(style);
  const summary=app.querySelector('.summary');
  function panels(){return [...app.querySelectorAll(':scope > section.panel')].filter(p=>p.id!=='admin-dashboard-menu')}
  function text(panel){return (panel.querySelector('h2,h3')?.textContent||panel.textContent||'').trim()}
  function home(){for(const panel of panels())panel.classList.add('sv-admin-hidden-by-menu');summary?.classList.remove('sv-admin-hidden-by-menu');nav.querySelector('[data-admin-home]').hidden=true;nav.querySelector('.sv-admin-menu-grid').hidden=false;window.scrollTo({top:0,behavior:'smooth'})}
  function openGroup(id){const group=groups.find(g=>g.id===id);if(!group)return;let shown=0;for(const panel of panels()){const match=group.keys.some(key=>text(panel).includes(key));panel.classList.toggle('sv-admin-hidden-by-menu',!match);if(match)shown++}summary?.classList.add('sv-admin-hidden-by-menu');nav.querySelector('[data-admin-home]').hidden=false;nav.querySelector('.sv-admin-menu-grid').hidden=true;if(!shown){nav.querySelector('.sv-admin-home-head p').textContent='이 메뉴의 관리 화면을 아직 찾지 못했습니다. 다른 메뉴를 확인해 주세요.'}else nav.querySelector('.sv-admin-home-head p').textContent=`${group.icon} ${group.title} · ${shown}개 관리 화면`;window.scrollTo({top:0,behavior:'smooth'})}
  nav.addEventListener('click',event=>{const b=event.target.closest('button');if(!b)return;if(b.dataset.adminHome!==undefined)return home();if(b.dataset.adminGroup)return openGroup(b.dataset.adminGroup)});
  const observer=new MutationObserver(()=>{if(!nav.querySelector('.sv-admin-menu-grid').hidden)for(const panel of panels())panel.classList.add('sv-admin-hidden-by-menu')});observer.observe(app,{childList:true,subtree:false});
  home();
})();
