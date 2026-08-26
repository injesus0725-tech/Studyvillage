/* v1.12 shared student question override loader. Applies teacher-reviewed edits and teacher activation settings without destructively shrinking the bundled question bank. */
(()=>{
  const TIMEOUT_MS=5000;
  const originals=new Map();
  const clone=q=>({...q,options:Array.isArray(q?.options)?[...q.options]:[],acceptedAnswers:Array.isArray(q?.acceptedAnswers)?[...q.acceptedAnswers]:[]});
  const valid=q=>{const prompt=q?.word||q?.question||q?.prompt;if(typeof prompt!=='string'||!prompt.trim())return false;if(q.type==='input')return Array.isArray(q.acceptedAnswers)&&q.acceptedAnswers.length>0&&q.acceptedAnswers.length<=8&&q.acceptedAnswers.every(v=>typeof v==='string'&&v.trim());return Array.isArray(q.options)&&q.options.length>=2&&q.options.every(v=>typeof v==='string'&&v.trim())&&Number.isInteger(Number(q.answer))&&Number(q.answer)>=0&&Number(q.answer)<q.options.length};
  async function fetchJson(url){const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),TIMEOUT_MS);try{const response=await fetch(url,{cache:'no-store',signal:controller.signal}),data=await response.json().catch(()=>({}));if(!response.ok||data.ok===false)throw new Error(data.code||'question-data-load-failed');return data}finally{clearTimeout(timer)}}
  const unitKey=q=>[q.subject,q.grade,q.semester,q.unit].map(v=>String(v??'').trim()).join('|');
  const questionKey=(q,set,index)=>String(q?.catalogId||q?.id||`${set?.activityId||'question'}:${Number(index)+1}`);
  const enabled=(q,settings)=>q.enabled!==false&&settings[`unit:${unitKey(q)}`]?.enabled!==false&&settings[`question:${questionKey(q)}`]?.enabled!==false;
  const eligible=(q,space,settings)=>enabled(q,settings)&&settings[`space-subject:${space}|${q.subject}`]?.enabled!==false&&settings[`space-unit:${space}|${unitKey(q)}`]?.enabled!==false;
  function sourceQuestions(set){
    const id=String(set.activityId||'');
    if(!originals.has(id))originals.set(id,(set.questions||[]).map(clone));
    return (originals.get(id)||[]).map(clone);
  }
  async function apply(){
    const sets=Object.values(window.StudyVillageQuestionSets||{}).filter(set=>set?.activityId&&Array.isArray(set.questions));
    if(!sets.length)return{ok:true,applied:0,disabled:0};
    try{
      const [overrideData,settingData]=await Promise.all([fetchJson('/api/question-overrides'),fetchJson('/api/question-catalog/settings')]),overrides=overrideData.overrides||{},settings=settingData.settings||{};
      let applied=0,disabled=0;
      for(const set of sets){
        const bases=sourceQuestions(set);
        set.questions=bases.map((base,index)=>{const catalogId=questionKey(base,set,index),row=overrides[`${set.activityId}:${index+1}`]?.question;if(!row||!valid(row))return{...base,catalogId};applied++;return clone({...base,...row,catalogId,answer:row.type==='input'?null:Number(row.answer)})}).filter(question=>{const keep=enabled(question,settings);if(!keep)disabled++;return keep});
      }
      window.StudyVillageQuestionCatalog={settings,unitKey,questionKey,eligible:(q,space)=>eligible(q,space,settings)};
      window.dispatchEvent(new CustomEvent('studyvillage:question-catalog-refreshed',{detail:{settings,applied,disabled}}));
      return{ok:true,applied,disabled};
    }catch(error){
      console.warn('[Studyvillage] shared question settings unavailable; keeping last usable question catalog',error?.name==='AbortError'?'timeout':error?.message||error);
      if(!window.StudyVillageQuestionCatalog)window.StudyVillageQuestionCatalog={settings:{},unitKey,questionKey,eligible:()=>true};
      return{ok:false,applied:0,disabled:0,error};
    }
  }
  const ready=apply();
  window.StudyVillageStudentQuestionOverrides={ready,refresh:apply,originals};
  document.addEventListener('click',event=>{const card=event.target.closest?.('.sv-exp-card[data-expedition]');if(!card||card.dataset.overrideReady==='1')return;event.preventDefault();event.stopImmediatePropagation();ready.finally(()=>{card.dataset.overrideReady='1';card.click()})},true);
})();
