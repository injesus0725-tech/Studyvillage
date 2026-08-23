/* v2.0 shared teacher-admin network guard + local teacher-PC auto entry. */
(()=>{
  const REQUEST_TIMEOUT_MS=7000,previousFetch=window.fetch.bind(window),isAdminUrl=url=>String(url).includes('/api/admin/'),isLoginUrl=url=>String(url).includes('/api/admin/login');
  function handleExpiredSession(){sessionStorage.removeItem('studyvillage-admin-token');const app=document.querySelector('#admin-app'),login=document.querySelector('#admin-login'),message=document.querySelector('#admin-login-message');if(app)app.hidden=true;if(login){login.hidden=false;login.style.display=''}if(message)message.textContent='관리자 로그인이 만료되었습니다. 다시 들어가고 있어요.';scheduleLocalLogin()}
  window.fetch=async(input,options={})=>{const url=typeof input==='string'?input:input?.url||'';if(!isAdminUrl(url))return previousFetch(input,options);let response;if(options?.signal)response=await previousFetch(input,options);else{const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),REQUEST_TIMEOUT_MS);try{response=await previousFetch(input,{...options,signal:controller.signal})}finally{clearTimeout(timeout)}}if(response?.status===401&&!isLoginUrl(url))handleExpiredSession();return response};
  function scheduleLocalLogin(){
    if(!['localhost','127.0.0.1','::1'].includes(location.hostname))return;
    setTimeout(()=>{
      if(sessionStorage.getItem('studyvillage-admin-token'))return;
      const box=document.querySelector('#admin-login'),pw=document.querySelector('#admin-password'),button=document.querySelector('#admin-login-button'),message=document.querySelector('#admin-login-message');if(!pw||!button)return;
      if(box)box.style.display='none';pw.value='teacher1234';button.click();
      setTimeout(()=>{if(sessionStorage.getItem('studyvillage-admin-token'))return;if(box)box.style.display='';pw.value='';if(message)message.textContent='예전에 관리자 비밀번호를 변경한 기록이 있어 자동 입장이 되지 않았습니다. 그 비밀번호로 한 번 로그인해 주세요.'},1200)
    },80)
  }
  window.StudyVillageAdminNetworkGuard={timeoutMs:REQUEST_TIMEOUT_MS,handleExpiredSession};scheduleLocalLogin();
})();