/* v2.0 shared teacher-admin network guard + local teacher-PC auto entry. */
(()=>{
  const REQUEST_TIMEOUT_MS=7000,previousFetch=window.fetch.bind(window),isAdminUrl=url=>String(url).includes('/api/admin/'),isLoginUrl=url=>String(url).includes('/api/admin/login')||String(url).includes('/api/admin/local-session');
  function handleExpiredSession(){sessionStorage.removeItem('studyvillage-admin-token');const app=document.querySelector('#admin-app'),login=document.querySelector('#admin-login'),message=document.querySelector('#admin-login-message');if(app)app.hidden=true;if(login){login.hidden=false;login.style.display=''}if(message)message.textContent='관리자 로그인이 만료되었습니다. 다시 들어가고 있어요.';scheduleLocalLogin()}
  window.fetch=async(input,options={})=>{const url=typeof input==='string'?input:input?.url||'';if(!isAdminUrl(url))return previousFetch(input,options);const stored=sessionStorage.getItem('studyvillage-admin-token')||'',headers={...(options?.headers||{})};if(stored&&!isLoginUrl(url)&&!headers.Authorization)headers.Authorization=`Bearer ${stored}`;const requestOptions={...options,headers};let response;if(options?.signal)response=await previousFetch(input,requestOptions);else{const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),REQUEST_TIMEOUT_MS);try{response=await previousFetch(input,{...requestOptions,signal:controller.signal})}finally{clearTimeout(timeout)}}if(response?.status===401&&!isLoginUrl(url))handleExpiredSession();return response};
  let localEntryRunning=false;
  function scheduleLocalLogin(){
    if(!['localhost','127.0.0.1','::1'].includes(location.hostname))return;
    setTimeout(async()=>{
      if(sessionStorage.getItem('studyvillage-admin-token'))return;
      if(localEntryRunning)return;localEntryRunning=true;
      const box=document.querySelector('#admin-login'),pw=document.querySelector('#admin-password'),button=document.querySelector('#admin-login-button'),message=document.querySelector('#admin-login-message');
      if(box){box.hidden=true;box.style.display='none'}
      try{const response=await previousFetch('/api/admin/local-session',{method:'POST',cache:'no-store'}),data=await response.json().catch(()=>({}));if(response.ok&&data.ok&&data.token){sessionStorage.setItem('studyvillage-admin-token',data.token);if(box){box.hidden=true;box.style.display='none'}const app=document.querySelector('#admin-app');if(app)app.hidden=false;setTimeout(()=>document.querySelector('#refresh-button')?.click(),0);return}}catch{}finally{localEntryRunning=false}
      if(box){box.hidden=false;box.style.display=''}if(pw)pw.hidden=true;if(button){button.hidden=false;button.textContent='교사용 화면 다시 연결';button.onclick=event=>{event.preventDefault();event.stopImmediatePropagation();scheduleLocalLogin()}}if(message)message.textContent='교사용 화면 연결이 늦어지고 있습니다. 위 버튼을 눌러 다시 연결해 주세요.';
    },80)
  }
  window.StudyVillageAdminNetworkGuard={timeoutMs:REQUEST_TIMEOUT_MS,handleExpiredSession};scheduleLocalLogin();
})();
