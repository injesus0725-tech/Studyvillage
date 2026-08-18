/* Stabilized expedition discovery catalog. Village discovery spawning and legacy keyboard/talk handlers are intentionally removed. */
(()=>{
  const events=[
    {type:'chest',icon:'🧰',name:'숲속 보물상자',prompt:'상자에 별빛 자물쇠가 걸려 있어요.',action:'조심히 열기',success:'찰칵! 탐험 별이 들어 있었어요.',reward:3},
    {type:'tree',icon:'🌳',name:'반짝 나무',prompt:'나뭇잎 사이에서 작은 빛이 반짝여요.',action:'나무 살펴보기',success:'잎 뒤에서 반짝이는 별 하나를 찾았어요.',reward:1},
    {type:'flower',icon:'🌷',name:'잠든 꽃',prompt:'목이 마른 꽃봉오리가 고개를 숙이고 있어요.',action:'물 한 모금 주기',success:'꽃이 활짝 피며 별빛 향기를 선물했어요.',reward:2}
  ];
  window.StudyVillageExpeditionEvents=Object.freeze(events.map(event=>Object.freeze({...event})));
})();
