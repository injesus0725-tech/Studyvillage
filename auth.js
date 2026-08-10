/* v0.4.1 authentication router.
   Default: classroom Node server on the teacher PC.
   Fallback: local browser account only when the server is unavailable. */
window.StudyVillageAuth = (() => {
  const prefix = 'studyvillage-account:';
  const encoder = new TextEncoder();
  let serverAvailable = null;
  let sessionToken = null;

  const toHex = bytes => [...new Uint8Array(bytes)].map(b => b.toString(16).padStart(2,'0')).join('');
  async function hashPassword(password, salt) {
    if (!crypto?.subtle) throw new Error('secure-context-required');
    return toHex(await crypto.subtle.digest('SHA-256', encoder.encode(`${salt}:${password}`)));
  }
  const key = name => prefix + name.trim().toLowerCase();
  const randomSalt = () => { const bytes=new Uint8Array(16); crypto.getRandomValues(bytes); return toHex(bytes); };
  const read = name => { try{return JSON.parse(localStorage.getItem(key(name))||'null')}catch{return null} };

  async function checkServer(force = false) {
    if (!force && serverAvailable !== null) return serverAvailable;
    try {
      const response = await fetch('/api/health', { cache: 'no-store' });
      serverAvailable = response.ok;
    } catch {
      serverAvailable = false;
    }
    return serverAvailable;
  }

  async function serverLogin(name,password) {
    const response = await fetch('/api/login', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({name,password})
    });
    const result = await response.json().catch(()=>({ok:false,code:'server-error'}));
    if (result.ok && result.token) sessionToken = result.token;
    return { ...result, mode:'classroom-server' };
  }

  async function localLogin(name,password) {
    const account=read(name);
    if(!account){
      const salt=randomSalt(),passwordHash=await hashPassword(password,salt);
      localStorage.setItem(key(name),JSON.stringify({name,salt,passwordHash,createdAt:new Date().toISOString()}));
      return {ok:true,isNew:true,mode:'local'};
    }
    const passwordHash=await hashPassword(password,account.salt);
    return passwordHash===account.passwordHash ? {ok:true,isNew:false,mode:'local'} : {ok:false,code:'wrong-password',mode:'local'};
  }

  async function login(name,password) {
    if (await checkServer()) return serverLogin(name,password);
    return localLogin(name,password);
  }

  function authHeaders() {
    return sessionToken ? { Authorization:`Bearer ${sessionToken}` } : {};
  }

  return { login, checkServer, authHeaders, mode: () => serverAvailable ? 'classroom-server' : 'local' };
})();
