/* v1.9 shared server activity metadata for score history/read APIs. */
const META=Object.freeze({
  vocabulary:{subject:'국어',topic:'어휘',name:'책마루 · 낱말 뜻 맞추기'},
  'math-arithmetic':{subject:'수학',topic:'사칙 계산',name:'배움터 · 랜덤 계산 연습'},
  riddle:{subject:'기타',topic:'수수께끼',name:'도전관 · 수수께끼'},
  'exploration-riddle':{subject:'창의적 사고',topic:'수수께끼 탐험',name:'탐험 · 수수께끼'},
  'exploration-forest-riddle':{subject:'창의적 사고',topic:'쉬운 수수께끼',name:'생각의 숲 · 수수께끼'},
  'exploration-mountain-riddle':{subject:'창의적 사고',topic:'도전 수수께끼',name:'도전의 산 · 수수께끼'}
});

export function activityMetadataFor(activityId){
  const id=String(activityId??'').trim();
  if(!id)return{subject:'전체',topic:'전체 점수',name:'전체 점수'};
  return META[id]||{subject:'기타',topic:id.replace(/-/g,' '),name:id.replace(/-/g,' ')};
}

export const activityMetadataMap=META;
