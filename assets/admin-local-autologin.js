/* Teacher-PC convenience: the classroom program uses the default local admin credential automatically. Remote student devices never load admin.html during normal use. */
(()=>{
  const login=document.querySelector('#admin-login'),app=document.querySelector('#admin-app'),password=document.querySelector('#admin-password'),button=document.querySelector('#admin-login-button'),message=document.querySelector('#admin-login-message');
  if(!login||!button||!password)return;
  const local=['localhost','127.0.0.1','::1'].includes(location.hostname);
  if(!local)return;
  login.style.display='none';
  const tryLogin=()=>{
    if(sessionStorage.getItem('studyvillage-admin-token')){login.style.display='none';return}
    password.value='teacher1234';button.click();
    setTimeout(()=>{
      if(!sessionStorage.getItem('studyvillage-admin-token')){
        login.style.display='';
        const input=password;input.value='';input.placeholder='이전 관리자 비밀번호를 입력해 주세요';
        if(message)message.textContent='자동 입장에 실패했습니다. 예전에 관리자 비밀번호를 바꾼 적이 있다면 그 비밀번호로 한 번만 로그인해 주세요.';
      }
    },1200)
  };
  setTimeout(tryLogin,30);
})();