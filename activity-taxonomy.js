/* v1.9 shared activity subject/topic taxonomy.
   Keep display classification separate from score data so old records remain readable. */
(()=>{
  const taxonomy={
    vocabulary:{subject:'국어',topic:'어휘',name:'책마루 · 낱말 뜻 맞추기',icon:'📚'},
    riddle:{subject:'기타',topic:'수수께끼',name:'도전관 · 수수께끼',icon:'❓'}
  };
  const fallback=id=>({subject:'기타',topic:id?String(id).replace(/-/g,' '):'전체',name:id?String(id).replace(/-/g,' '):'전체 기록',icon:'🎯'});
  window.StudyVillageActivityTaxonomy=Object.freeze({...taxonomy});
  window.StudyVillageActivityMeta=id=>window.StudyVillageActivityTaxonomy[id]||fallback(id);
})();
