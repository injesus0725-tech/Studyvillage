/* v1.9 shared teacher-admin network + auth guard.
   Any /api/admin request without its own AbortSignal gets a bounded wait, and any protected admin 401 returns the UI to the login screen. */
(()=>{
  const REQUEST_TIMEOUT_MS=7000;
  const previousFetch=window.fetch.bind(window);
  const isAdminUrl=url=>String(url).includes('/api/admin/');
  const isLoginUrl=url=>String(url).includes('/api/admin/login');
  function handleExpiredSession(){
    sessionStorage.removeItem('studyvillage-admin-token');
    const app=document.querySelector('#admin-app'),login=document.querySelector('#admin-login'),message=document.querySelector('#admin-login-message');
    if(app)app.hidden=true;
    if(login)login.hidden=false;
    if(message)message.textContent='관리자 로그인이 만료되었습니다. 다시 로그인해 주세요.';
  }
  window.fetch=async(input,options={})=>{
    const url=typeof input==='string'?input:input?.url||'';
    if(!isAdminUrl(url))return previousFetch(input,options);
    let response;
    if(options?.signal){
      response=await previousFetch(input,options);
    }else{
      const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),REQUEST_TIMEOUT_MS);
      try{response=await previousFetch(input,{...options,signal:controller.signal})}
      finally{clearTimeout(timeout)}
    }
    if(response?.status===401&&!isLoginUrl(url))handleExpiredSession();
    return response;
  };
  window.StudyVillageAdminNetworkGuard={timeoutMs:REQUEST_TIMEOUT_MS,handleExpiredSession};
})();