/* v0.3.0 authentication foundation.
   IMPORTANT: This local implementation is only a bridge toward server authentication.
   Passwords are never stored as plain text. For real multi-device use, authentication
   will move to a backend/provider and localStorage password data will be retired. */
window.StudyVillageAuth = (() => {
  const prefix = 'studyvillage-account:';
  const encoder = new TextEncoder();
  const toHex = bytes => [...new Uint8Array(bytes)].map(b => b.toString(16).padStart(2,'0')).join('');
  async function hashPassword(password, salt) {
    if (!crypto?.subtle) throw new Error('secure-context-required');
    const data = encoder.encode(`${salt}:${password}`);
    return toHex(await crypto.subtle.digest('SHA-256', data));
  }
  function key(name){ return prefix + name.trim().toLowerCase(); }
  function randomSalt(){ const bytes=new Uint8Array(16); crypto.getRandomValues(bytes); return toHex(bytes); }
  function read(name){ try{return JSON.parse(localStorage.getItem(key(name))||'null')}catch{return null} }
  async function register(name,password){
    if(read(name)) return {ok:false,code:'exists'};
    const salt=randomSalt(), passwordHash=await hashPassword(password,salt);
    localStorage.setItem(key(name),JSON.stringify({name,salt,passwordHash,createdAt:new Date().toISOString()}));
    return {ok:true,isNew:true};
  }
  async function login(name,password){
    const account=read(name); if(!account) return register(name,password);
    const passwordHash=await hashPassword(password,account.salt);
    return passwordHash===account.passwordHash ? {ok:true,isNew:false} : {ok:false,code:'wrong-password'};
  }
  return {login};
})();