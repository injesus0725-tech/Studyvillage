/* Classroom convenience: the teacher PC opens the admin screen without typing the unchanged default password. If the password was changed, the normal login form remains available. */
(()=>{
  if(sessionStorage.getItem('studyvillage-admin-token'))return;
  const pw=document.querySelector('#admin-password'),button=document.querySelector('#admin-login-button'),box=document.querySelector('#admin-login'),message=document.querySelector('#admin-login-message');
  if(!pw||!button||!box)return;
  box.dataset.autoLogin='1';box.style.opacity='.01';box.style.pointerEvents='none';
  pw.value='teacher1234';
  setTimeout(()=>button.click(),40);
  setTimeout(()=>{if(sessionStorage.getItem('studyvillage-admin-token'))return;box.style.opacity='1';box.style.pointerEvents='auto';box.dataset.autoLogin='0';if(message&&!message.textContent)message.textContent='관리자 비밀번호를 변경한 경우에만 입력해 주세요.'},1200);
})();
