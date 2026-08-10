/* v0.9.6 privacy-safe client error reporter.
   Captures browser/runtime errors and failed API requests locally.
   Never stores passwords, auth tokens, request bodies, or full student records. */
(()=>{
  const VERSION='0.9.6';
  const STORAGE_KEY='studyvillage-error-reports:v1';
  const EVENT_KEY='studyvillage-error-events:v1';
  const MAX_REPORTS=30,MAX_EVENTS=80;
  let exporting=false;
  const now=()=>new Date().toISOString();
  const safeText=(v,max=1800)=>String(v??'').replace(/Bearer\s+[A-Za-z0-9._-]+/gi,'Bearer [REDACTED]').slice(0,max);
  const read=(key,fallback=[])=>{try{const v=JSON.parse(localStorage.getItem(key)||'null');return Array.isArray(v)?v:fallback}catch{return fallback}};
  const write=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value))}catch{}};
  const trim=(rows,max)=>rows.slice(Math.max(0,rows.length-max));
  const page=()=>location.pathname||'/';
  const mode=()=>window.StudyVillageAuth?.mode?.()||'unknown';
  function addEvent(type,detail=''){
    const rows=read(EVENT_KEY);rows.push({at:now(),type:safeText(type,80),detail:safeText(detail,350),page:page()});write(EVENT_KEY,trim(rows,MAX_EVENTS));
  }
  function saveReport(kind,message,stack='',extra={}){
    const rows=read(STORAGE_KEY);rows.push({
      id:`err-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,
      at:now(),version:VERSION,kind:safeText(kind,80),message:safeText(message),stack:safeText(stack,5000),
      page:page(),online:navigator.onLine,mode:mode(),userAgent:safeText(navigator.userAgent,500),
      viewport:{width:innerWidth,height:innerHeight},extra,
      recentEvents:read(EVENT_KEY).slice(-20)
    });write(STORAGE_KEY,trim(rows,MAX_REPORTS));showButton();
  }
  window.addEventListener('error',e=>saveReport('window-error',e.message||'알 수 없는 JavaScript 오류',e.error?.stack||'',{file:safeText(e.filename,500),line:e.lineno||null,column:e.colno||null}));
  window.addEventListener('unhandledrejection',e=>{const r=e.reason;saveReport('unhandled-rejection',r?.message||r||'처리되지 않은 Promise 오류',r?.stack||'')});
  window.addEventListener('offline',()=>addEvent('network','브라우저 offline'));
  window.addEventListener('online',()=>addEvent('network','브라우저 online'));
  window.addEventListener('studyvillage:library-complete',e=>addEvent('activity-complete',`vocabulary score=${Number(e.detail?.score)||0}`));
  window.addEventListener('studyvillage:activity-record-refresh',()=>addEvent('record-refresh'));

  const originalFetch=window.fetch.bind(window);
  window.fetch=async(...args)=>{
    const input=args[0],url=typeof input==='string'?input:input?.url||'',method=String(args[1]?.method||input?.method||'GET').toUpperCase();
    try{
      const response=await originalFetch(...args);
      if(!response.ok&&String(url).includes('/api/')){
        const safeUrl=String(url).split('?')[0];
        addEvent('api-failure',`${method} ${safeUrl} → ${response.status}`);
        if(response.status>=500)saveReport('api-error',`${method} ${safeUrl} returned ${response.status}`,'',{status:response.status});
      }
      return response;
    }catch(error){
      const safeUrl=String(url).split('?')[0];
      if(String(url).includes('/api/'))addEvent('api-network-failure',`${method} ${safeUrl}`);
      throw error;
    }
  };

  const button=document.createElement('button');button.id='error-report-button';button.type='button';button.textContent='🛠️ 오류 리포트';button.hidden=true;
  const style=document.createElement('style');style.textContent=`#error-report-button{position:fixed;right:12px;bottom:84px;z-index:12000;border:2px solid #e0b36b;background:#fff7e8;color:#6d4a17;border-radius:14px;padding:9px 12px;font-weight:900;box-shadow:0 7px 20px #352d2130;cursor:pointer;font-size:12px}#error-report-button:hover{background:#fff0cf}`;document.head.appendChild(style);document.body.appendChild(button);
  function showButton(){button.hidden=!read(STORAGE_KEY).length}
  function buildExport(){return{format:'studyvillage-error-report',version:VERSION,exportedAt:now(),privacyNotice:'비밀번호, 인증 토큰, 요청 본문은 수집하지 않도록 설계됨',page:page(),browser:{userAgent:safeText(navigator.userAgent,500),online:navigator.onLine,viewport:{width:innerWidth,height:innerHeight}},reports:read(STORAGE_KEY),recentEvents:read(EVENT_KEY)}}
  function download(){if(exporting)return;exporting=true;try{const data=JSON.stringify(buildExport(),null,2),blob=new Blob([data],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a'),stamp=new Date().toISOString().replace(/[:.]/g,'-');a.href=url;a.download=`Studyvillage-error-${stamp}.json`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)}finally{exporting=false}}
  button.addEventListener('click',download);
  window.StudyVillageErrorReporter={addEvent,saveReport,download,count:()=>read(STORAGE_KEY).length,clear:()=>{write(STORAGE_KEY,[]);write(EVENT_KEY,[]);showButton()}};
  addEvent('page-load',`v${VERSION}`);showButton();
})();