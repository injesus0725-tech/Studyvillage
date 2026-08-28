/* Shared choice/input question response rules. */
(()=>{
  const normalize=value=>String(value??'').trim().replace(/\s+/g,' ').toLocaleLowerCase('ko-KR');
  const typeOf=question=>question?.type==='input'?'input':'choice';
  function correct(question,response){if(typeOf(question)==='input'){const value=normalize(response);return !!value&&(question.acceptedAnswers||[]).some(answer=>normalize(answer)===value)}return Number(response)===Number(question?.answer)}
  window.StudyVillageQuestionResponse={normalize,typeOf,correct};
  // Start the small supplemental bank as soon as the stable base banks exist.
  // Activity openers rebuild their pools on entry, so this remains cache-safe without
  // making the large base question file depend on the supplement.
  window.StudyVillageCurriculumSupplementReady=import('./assets/curriculum-content-supplement.js?v=20260828v1').catch(err=>{console.warn('[Studyvillage] curriculum supplement unavailable',err);return null});
})();
