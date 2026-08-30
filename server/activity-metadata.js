/* v1.10 shared server activity metadata for score history/read APIs. */
const META=Object.freeze({
  vocabulary:{subject:'국어',topic:'어휘',name:'책마루 · 낱말 뜻 맞추기'},
  'math-arithmetic':{subject:'수학',topic:'랜덤 계산',name:'수학 놀이터 · 랜덤 문제'},
  'curriculum-korean':{subject:'국어',topic:'문장과 낱말',name:'교과 배움터 · 국어'},
  'curriculum-math':{subject:'수학',topic:'덧셈과 뺄셈',name:'교과 배움터 · 수학'},
  'curriculum-social':{subject:'사회',topic:'우리 고장의 모습',name:'교과 배움터 · 사회'},
  'curriculum-science':{subject:'과학',topic:'물질의 성질',name:'교과 배움터 · 과학'},
  'curriculum-arts':{subject:'예체능',topic:'표현과 감상',name:'교과 배움터 · 예체능'},
  'curriculum-integrated':{subject:'통합',topic:'사회·과학·예체능',name:'교과 배움터 · 사회·과학·예체능 통합'},
  'curriculum-challenge-korean':{subject:'국어',topic:'문제은행 도전',name:'도전관 · 국어 도전'},
  'curriculum-challenge-math':{subject:'수학',topic:'문제은행 도전',name:'도전관 · 수학 도전'},
  'curriculum-challenge-integrated':{subject:'통합',topic:'사회·과학·예체능',name:'도전관 · 사회·과학·예체능 통합'},
  riddle:{subject:'기타',topic:'수수께끼',name:'재미 수수께끼'},
  'exploration-riddle':{subject:'창의적 사고',topic:'수수께끼 탐험',name:'탐험 · 수수께끼'},
  'exploration-forest-riddle':{subject:'창의적 사고',topic:'쉬운 수수께끼',name:'생각의 숲 · 수수께끼'},
  'exploration-mountain-riddle':{subject:'창의적 사고',topic:'도전 수수께끼',name:'도전의 산 · 수수께끼'},
  'exploration-korean':{subject:'국어',topic:'전체 문제은행',name:'탐험 · 국어의 숲'},
  'exploration-math':{subject:'수학',topic:'덧셈·곱셈',name:'탐험 · 덧셈 동굴·곱셈 던전'},
  'exploration-social':{subject:'사회',topic:'전체 문제은행',name:'탐험 · 사회의 숲'},
  'exploration-science':{subject:'과학',topic:'전체 문제은행',name:'탐험 · 과학의 숲'},
  'exploration-random':{subject:'통합',topic:'사회·과학·예체능',name:'탐험 · 사회·과학·예체능 통합'}
});

export function activityMetadataFor(activityId){
  const id=String(activityId??'').trim();
  if(!id)return{subject:'전체',topic:'전체 점수',name:'전체 점수'};
  return META[id]||{subject:'기타',topic:id.replace(/-/g,' '),name:id.replace(/-/g,' ')};
}

export const activityMetadataMap=META;
