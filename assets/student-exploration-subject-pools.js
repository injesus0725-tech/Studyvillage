/* Exploration V2 subject-pool bridge.
   Keeps the existing adventure engine intact while presenting the final V1 curriculum groups:
   Korean / Math / Social+Science+Arts integrated / Riddles. */
(()=>{
  const INTEGRATED=new Set(['사회','과학','음악','예체능']);
  const shuffle=values=>{const out=[...values];for(let i=out.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]]}return out};
  function rows(){return Object.values(window.StudyVillageQuestionSets||{}).flatMap(set=>(set.questions||[]).map(q=>({...q,subject:q.subject||set.subject,grade:q.grade??set.grade,semester:q.semester??set.semester,unit:q.unit||set.unit,spaces:q.spaces||set.spaces||[]})))}
  function eligible(q){const spaces=q.spaces||[];return(spaces.includes('exploration')||spaces.includes('curriculum'))&&q.type!=='input'&&Array.isArray(q.options)&&q.options.length>=2&&(window.StudyVillageQuestionCatalog?.eligible?.(q,'curriculum')??true)}
  function pool(group,count=5){const source=rows().filter(eligible).filter(q=>group==='integrated'?INTEGRATED.has(q.subject):q.subject===group);return shuffle(source).slice(0,count)}
  window.StudyVillageExplorationSubjectPools=Object.freeze({integratedSubjects:Object.freeze([...INTEGRATED]),pool,has:(group,count=5)=>pool(group,count).length>=count});
})();
