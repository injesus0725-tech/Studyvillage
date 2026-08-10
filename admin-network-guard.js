/* v0.9.61 shared teacher-admin network guard.
   Any /api/admin request without its own AbortSignal gets a bounded wait so legacy admin actions cannot hang forever when the classroom server stalls. */
(()=>{
  const REQUEST_TIMEOUT_MS=7000;
  const previousFetch=window.fetch.bind(window);
  window.fetch=async(input,options={})=>{
    const url=typeof input==='string'?input:input?.url||'';
    if(!String(url).includes('/api/admin/')||options?.signal)return previousFetch(input,options);
    const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),REQUEST_TIMEOUT_MS);
    try{return await previousFetch(input,{...options,signal:controller.signal})}
    finally{clearTimeout(timeout)}
  };
  window.StudyVillageAdminNetworkGuard={timeoutMs:REQUEST_TIMEOUT_MS};
})();