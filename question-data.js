/* v1.9 Studyvillage question data. Keep learning content separate from game logic for safe teacher review/edit history. */
(()=>{
  const sets={
    vocabulary:{
      activityId:'vocabulary',
      subject:'국어',
      topic:'어휘',
      questions:[
        {word:'다정하다',options:['정이 많고 친절하다','매우 빠르다','소리가 크다','마음이 급하다'],answer:0},
        {word:'망설이다',options:['바로 행동하다','결정하지 못하고 주저하다','기뻐서 웃다','조용히 기다리다'],answer:1},
        {word:'뿌듯하다',options:['속이 상하다','몹시 피곤하다','보람을 느껴 기쁘다','깜짝 놀라다'],answer:2},
        {word:'살피다',options:['주의 깊게 자세히 보다','큰 소리로 부르다','빨리 달리다','잠깐 쉬다'],answer:0},
        {word:'격려하다',options:['잘못을 꾸짖다','힘내도록 용기와 힘을 북돋우다','모르는 척하다','혼자 해결하다'],answer:1}
      ]
    }
  };
  window.StudyVillageQuestionSets=sets;
})();
