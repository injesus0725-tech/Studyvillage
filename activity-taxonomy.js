/* v1.9 shared activity subject/topic taxonomy.
   Question-set subject/topic metadata is the source of truth when available, while old/non-question activities keep safe display fallbacks. */
(()=>{
  const taxonomy={
    vocabulary:{subject:'국어',topic:'어휘',name:'책마루 · 낱말 뜻 맞추기',icon:'📚'},
    riddle:{subject:'기타',topic:'수수께끼',name:'도전관 · 수수께끼',icon:'❓'}
  };
  const fallback=id=>({subject:'기타',topic:id?String(id).replace(/-/g,' '):'전체',name:id?String(id).replace(/-/g,' '):'전체 기록',icon:'🎯'});
  const questionMeta=id=>{
    const sets=window.StudyVillageQuestionSets||{};
    for(const [key,set] of Object.entries(sets)){
      if((set?.activityId||key)!==id)continue;
      return{subject:String(set.subject||'').trim(),topic:String(set.topic||'').trim()};
    }
    return null;
  };
  window.StudyVillageActivityTaxonomy=Object.freeze({...taxonomy});
  window.StudyVillageActivityMeta=id=>{
    const base=window.StudyVillageActivityTaxonomy[id]||fallback(id),fromQuestions=questionMeta(id);
    if(!fromQuestions)return base;
    return{...base,subject:fromQuestions.subject||base.subject,topic:fromQuestions.topic||base.topic};
  };
})();
