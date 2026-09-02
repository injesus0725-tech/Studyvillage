/* v2.0 shared teacher-admin network guard + local teacher-PC auto entry. */
(()=>{
  const marker=document.createElement('div');marker.textContent='입력초점 R8 · 20260825';marker.style.cssText='position:fixed;right:8px;bottom:6px;z-index:99999;padding:4px 7px;border-radius:7px;background:#203f2e;color:#fff;font:700 11px system-ui';document.body.appendChild(marker);
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
      let failure='NO-RESPONSE';try{const response=await previousFetch('/api/admin/local-session',{method:'POST',cache:'no-store'}),data=await response.json().catch(()=>({}));failure=`HTTP-${response.status}:${String(data.code||'UNKNOWN').slice(0,40)}`;if(response.ok&&data.ok&&data.token){sessionStorage.setItem('studyvillage-admin-token',data.token);location.replace('/admin.html?local-session=1');return}}catch(error){failure=String(error?.message||error||'FETCH-ERROR').slice(0,60)}finally{localEntryRunning=false}
      if(box){box.hidden=false;box.style.display=''}if(pw){pw.hidden=false;pw.disabled=false;pw.focus()}if(button){button.hidden=false;button.disabled=false;button.textContent='암호로 로그인';button.onclick=null}if(message)message.textContent=`자동입장 실패 [${failure}] · 관리자 암호를 직접 입력해 주세요.`;
    },80)
  }
  // Keep one teacher write-action path. The former window-capture repair
  // handler intercepted the real editor/table handlers and caused frozen scroll.
  const passwordChange=document.querySelector('#change-admin-password');if(passwordChange){passwordChange.hidden=true;passwordChange.style.display='none'}document.querySelector('#admin-direct-controls')?.remove();
  window.StudyVillageAdminNetworkGuard={timeoutMs:REQUEST_TIMEOUT_MS,handleExpiredSession};scheduleLocalLogin();
})();
