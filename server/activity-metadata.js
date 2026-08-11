/* v1.9 shared server activity metadata for score history/read APIs. */
const META=Object.freeze({
  vocabulary:{subject:'국어',topic:'어휘',name:'책마루 · 낱말 뜻 맞추기'},
  riddle:{subject:'기타',topic:'수수께끼',name:'도전관 · 수수께끼'}
});

export function activityMetadataFor(activityId){
  const id=String(activityId??'').trim();
  if(!id)return{subject:'전체',topic:'전체 점수',name:'전체 점수'};
  return META[id]||{subject:'기타',topic:id.replace(/-/g,' '),name:id.replace(/-/g,' ')};
}

export const activityMetadataMap=META;
