/* v0.3.2 authentication router.
   Firebase is used when configured; otherwise the local bridge remains available. */
window.StudyVillageAuth = (() => {
  const prefix = 'studyvillage-account:';
  const encoder = new TextEncoder();
  let cloudChecked = false;
  let cloudReady = false;

  const toHex = bytes => [...new Uint8Array(bytes)].map(b => b.toString(16).padStart(2,'0')).join('');
  async function hashPassword(password, salt) {
    if (!crypto?.subtle) throw new Error('secure-context-required');
    return toHex(await crypto.subtle.digest('SHA-256', encoder.encode(`${salt}:${password}`)));
  }
  const key = name => prefix + name.trim().toLowerCase();
  const randomSalt = () => { const bytes=new Uint8Array(16); crypto.getRandomValues(bytes); return toHex(bytes); };
  const read = name => { try{return JSON.parse(localStorage.getItem(key(name))||'null')}catch{return null} };

  async function ensureCloud() {
    if (cloudChecked) return cloudReady;
    cloudChecked = true;
    if (!window.StudyVillageFirebase) return false;
    try {
      const result = await window.StudyVillageFirebase.init();
      cloudReady = result.ok === true;
    } catch {
      cloudReady = false;
    }
    return cloudReady;
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
    if (await ensureCloud()) {
      const result = await window.StudyVillageFirebase.loginOrRegister(name,password);
      return { ...result, mode:'firebase' };
    }
    return localLogin(name,password);
  }

  return { login, ensureCloud, mode: () => cloudReady ? 'firebase' : 'local' };
})();
