/* v0.9.11 privacy-safe automatic client error reporter.
   Errors are kept locally as a fallback and automatically sent to the classroom server after login.
   Students do not need to press or send anything.
   Passwords, auth tokens, request bodies, and full student records are never included. */
(()=>{
  const VERSION='0.9.11';
  const STORAGE_KEY='studyvillage-error-reports:v1';
  const EVENT_KEY='studyvillage-error-events:v1';
  const MAX_REPORTS=30,MAX_EVENTS=80;
  let flushing=false;
  const now=()=>new Date().toISOString();
  const safeText=(v,max=1800)=>String(v??'').replace(/Bearer\s+[A-Za-z0-9._-]+/gi,'Bearer [REDACTED]').slice(0,max);
  const read=(key,fallback=[])=>{try{const v=JSON.parse(localStorage.getItem(key)||'null');return Array.isArray(v)?v:fallback}catch{return fallback}};
  const write=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value))}catch{}};
  const trim=(rows,max)=>rows.slice(Math.max(0,rows.length-max));
  const page=()=>location.pathname||'/';
  const mode=()=>window.StudyVillageAuth?.mode?.()||'unknown';
  function addEvent(type,detail=''){const rows=read(EVENT_KEY);rows.push({at:now(),type:safeText(type,80),detail:safeText(detail,350),page:page()});write(EVENT_KEY,trim(rows,MAX_EVENTS))}
  function makeReport(kind,message,stack='',extra={}){return{id:`err-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,at:now(),version:VERSION,kind:safeText(kind,80),message:safeText(message),stack:safeText(stack,5000),page:page(),online:navigator.onLine,mode:mode(),userAgent:safeText(navigator.userAgent,500),viewport:{width:innerWidth,height:innerHeight},extra,recentEvents:read(EVENT_KEY).slice(-20)}}
  function saveReport(kind,message,stack='',extra={}){const rows=read(STORAGE_KEY),report=makeReport(kind,message,stack,extra);rows.push(report);write(STORAGE_KEY,trim(rows,MAX_REPORTS));setTimeout(flush,0);return report}
  const originalFetch=window.fetch.bind(window);
  async function send(report){const headers=window.StudyVillageAuth?.authHeaders?.()||{};if(!headers.Authorization)return false;try{const r=await originalFetch('/api/error-report',{method:'POST',headers:{'Content-Type':'application/json',...headers},body:JSON.stringify(report)});return r.ok}catch{return false}}
  async function flush(){if(flushing||!navigator.onLine)return;const headers=window.StudyVillageAuth?.authHeaders?.()||{};if(!headers.Authorization)return;flushing=true;try{const rows=read(STORAGE_KEY),remaining=[];for(const report of rows){if(!(await send(report)))remaining.push(report)}write(STORAGE_KEY,remaining)}finally{flushing=false}}
  window.addEventListener('error',e=>saveReport('window-error',e.message||'알 수 없는 JavaScript 오류',e.error?.stack||'',{file:safeText(e.filename,500),line:e.lineno||null,column:e.colno||null}));
  window.addEventListener('unhandledrejection',e=>{const r=e.reason;saveReport('unhandled-rejection',r?.message||r||'처리되지 않은 Promise 오류',r?.stack||'')});
  window.addEventListener('offline',()=>addEvent('network','브라우저 offline'));window.addEventListener('online',()=>{addEvent('network','브라우저 online');flush()});
  window.addEventListener('studyvillage:library-complete',e=>addEvent('activity-complete',`vocabulary score=${Number(e.detail?.score)||0}`));window.addEventListener('studyvillage:activity-record-refresh',()=>addEvent('record-refresh'));
  window.fetch=async(...args)=>{const input=args[0],url=typeof input==='string'?input:input?.url||'',method=String(args[1]?.method||input?.method||'GET').toUpperCase();try{const response=await originalFetch(...args);if(!response.ok&&String(url).includes('/api/')&&!String(url).includes('/api/error-report')){const safeUrl=String(url).split('?')[0];addEvent('api-failure',`${method} ${safeUrl} → ${response.status}`);if(response.status>=500)saveReport('api-error',`${method} ${safeUrl} returned ${response.status}`,'',{status:response.status})}if(String(url).includes('/api/login')&&response.ok)setTimeout(flush,100);return response}catch(error){const safeUrl=String(url).split('?')[0];if(String(url).includes('/api/')&&!String(url).includes('/api/error-report'))addEvent('api-network-failure',`${method} ${safeUrl}`);throw error}};
  function buildExport(){return{format:'studyvillage-error-report',version:VERSION,exportedAt:now(),privacyNotice:'비밀번호, 인증 토큰, 요청 본문은 수집하지 않도록 설계됨',page:page(),browser:{userAgent:safeText(navigator.userAgent,500),online:navigator.onLine,viewport:{width:innerWidth,height:innerHeight}},reports:read(STORAGE_KEY),recentEvents:read(EVENT_KEY)}}
  function download(){const data=JSON.stringify(buildExport(),null,2),blob=new Blob([data],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a'),stamp=new Date().toISOString().replace(/[:.]/g,'-');a.href=url;a.download=`Studyvillage-error-${stamp}.json`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)}
  window.StudyVillageErrorReporter={addEvent,saveReport,flush,download,count:()=>read(STORAGE_KEY).length,clear:()=>{write(STORAGE_KEY,[]);write(EVENT_KEY,[])}};addEvent('page-load',`v${VERSION}`);setInterval(flush,10000);setTimeout(flush,1000);
})();