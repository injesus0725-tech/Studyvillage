/* v1.9 teacher admin logout control for shared classroom PCs. */
(()=>{
  const app=document.querySelector('#admin-app');
  const actions=app?.querySelector('header .actions');
  if(!app||!actions||document.querySelector('#admin-logout-button'))return;
  const button=document.createElement('button');
  button.id='admin-logout-button';
  button.textContent='🔒 로그아웃';
  button.title='교사용 관리자 화면을 잠그고 비밀번호 입력 화면으로 돌아갑니다.';
  button.addEventListener('click',()=>{
    if(!confirm('관리자 화면에서 로그아웃할까요?\n다시 들어오려면 관리자 비밀번호를 입력해야 합니다.'))return;
    sessionStorage.removeItem('studyvillage-admin-token');
    location.reload();
  });
  actions.appendChild(button);
})();
