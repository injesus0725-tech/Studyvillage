/* v0.9.52 authentication router.
   Server availability cache is invalidated on browser connection changes so a temporary outage cannot leave login/data flows stuck in the old mode. */
window.StudyVillageAuth=(()=>{
  const prefix='studyvillage-account:',SESSION_TOKEN_KEY='studyvillage-session-token',SESSION_NAME_KEY='studyvillage-session-name',RESTORE_SENTINEL='__studyvillage_restore__',SERVER_CHECK_TIMEOUT_MS=3000,REQUEST_TIMEOUT_MS=5000,encoder=new TextEncoder();
  let serverAvailable=null,sessionToken=sessionStorage.getItem(SESSION_TOKEN_KEY)||null,sessionName=sessionStorage.getItem(SESSION_NAME_KEY)||null,restoredPlayer=null,serverCheck=null;
  const toHex=bytes=>[...new Uint8Array(bytes)].map(b=>b.toString(16).padStart(2,'0')).join('');
  async function hashPassword(password,salt){if(!crypto?.subtle)throw new Error('secure-context-required');return toHex(await crypto.subtle.digest('SHA-256',encoder.encode(`${salt}:${password}`)))}
  const key=name=>prefix+name.trim().toLowerCase(),randomSalt=()=>{const bytes=new Uint8Array(16);crypto.getRandomValues(bytes);return toHex(bytes)},read=name=>{try{return JSON.parse(localStorage.getItem(key(name))||'null')}catch{return null}};
  function saveSession(name,token){sessionName=name;sessionToken=token;sessionStorage.setItem(SESSION_NAME_KEY,name);sessionStorage.setItem(SESSION_TOKEN_KEY,token)}
  function clearSession(){sessionName=null;sessionToken=null;restoredPlayer=null;sessionStorage.removeItem(SESSION_NAME_KEY);sessionStorage.removeItem(SESSION_TOKEN_KEY)}
  function invalidateServer(){serverAvailable=null;serverCheck=null}
  async function timedFetch(url,options={},timeoutMs=REQUEST_TIMEOUT_MS){const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),timeoutMs);try{return await fetch(url,{...options,signal:controller.signal})}finally{clearTimeout(timeout)}}
  async function checkServer(force=false){if(!force&&serverAvailable!==null)return serverAvailable;if(serverCheck&&!force)return serverCheck;const work=(async()=>{try{const response=await timedFetch('/api/health',{cache:'no-store'},SERVER_CHECK_TIMEOUT_MS);serverAvailable=response.ok}catch{serverAvailable=false}return serverAvailable})();serverCheck=work;try{return await work}finally{if(serverCheck===work)serverCheck=null}}
  async function serverLogin(name,password){try{const response=await timedFetch('/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,password})});const result=await response.json().catch(()=>({ok:false,code:'server-error'}));if(result.ok&&result.token)saveSession(name,result.token);return{...result,mode:'classroom-server'}}catch(error){invalidateServer();return{ok:false,code:error?.name==='AbortError'?'server-timeout':'server-error',mode:'classroom-server'}}}
  async function localLogin(name,password){const account=read(name);if(!account){const salt=randomSalt(),passwordHash=await hashPassword(password,salt);localStorage.setItem(key(name),JSON.stringify({name,salt,passwordHash,createdAt:new Date().toISOString()}));return{ok:true,isNew:true,mode:'local'}}const passwordHash=await hashPassword(password,account.salt);return passwordHash===account.passwordHash?{ok:true,isNew:false,mode:'local'}:{ok:false,code:'wrong-password',mode:'local'}}
  async function restoreSession(){if(!sessionToken||!sessionName)return null;if(!(await checkServer(true)))return null;try{const response=await timedFetch('/api/player/me',{headers:{Authorization:`Bearer ${sessionToken}`},cache:'no-store'});if(!response.ok){if(response.status===401)clearSession();return null}const result=await response.json();if(!result.ok||!result.player)return null;restoredPlayer=result.player;return{ok:true,name:sessionName,player:result.player,mode:'classroom-server'}}catch{invalidateServer();return null}}
  async function login(name,password){if(password===RESTORE_SENTINEL&&restoredPlayer&&sessionToken&&name===sessionName){const player=restoredPlayer;restoredPlayer=null;return{ok:true,isNew:false,restored:true,player,mode:'classroom-server'}}if(await checkServer())return serverLogin(name,password);return localLogin(name,password)}
  function authHeaders(){return sessionToken?{Authorization:`Bearer ${sessionToken}`}:{}}
  window.addEventListener('online',invalidateServer);window.addEventListener('offline',()=>{serverAvailable=false;serverCheck=null});window.addEventListener('studyvillage:connection-change',e=>{serverAvailable=e.detail?.online===true?true:e.detail?.online===false?false:null;serverCheck=null});
  return{login,restoreSession,checkServer,authHeaders,clearSession,invalidateServer,restoreSentinel:RESTORE_SENTINEL,mode:()=>serverAvailable?'classroom-server':'local'};
})();

(()=>{
  const password=document.querySelector('#player-password');
  if(!password||document.querySelector('#player-password-visibility'))return;
  const label=document.createElement('label');
  label.id='player-password-visibility';
  label.style.cssText='display:flex;align-items:center;gap:6px;margin:2px 0 0;font-size:13px;cursor:pointer;user-select:none';
  label.innerHTML='<input type="checkbox" aria-label="비밀번호 보기"> <span>비밀번호 보기</span>';
  const checkbox=label.querySelector('input');
  checkbox.addEventListener('change',()=>{password.type=checkbox.checked?'text':'password'});
  password.closest('.name-entry')?.after(label);
})();
