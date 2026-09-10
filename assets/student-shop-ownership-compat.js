/* Compatibility repair for older player data: an equipped digital item is necessarily owned.
   Some earlier builds saved equipment before owned_items_json, which made already-equipped hats/glasses buyable again. */
(()=>{
  const originalFetch=window.fetch.bind(window);
  window.fetch=async function(input,init){
    const response=await originalFetch(input,init);
    try{
      const url=typeof input==='string'?input:input?.url||'';
      const method=String(init?.method||(typeof input!=='string'&&input?.method)||'GET').toUpperCase();
      if(method!=='GET'||!/(^|\/)api\/shop(?:\?|$)/.test(url)||!response.ok)return response;
      const data=await response.clone().json();
      if(!data||data.ok===false)return response;
      const owned=new Set(Array.isArray(data.ownedItems)?data.ownedItems:[]);
      const equipment=data.equipment&&typeof data.equipment==='object'?data.equipment:{};
      for(const id of Object.values(equipment))if(typeof id==='string'&&id)owned.add(id);
      data.ownedItems=[...owned];
      return new Response(JSON.stringify(data),{status:response.status,statusText:response.statusText,headers:response.headers});
    }catch{return response}
  };
})();
