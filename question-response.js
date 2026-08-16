/* Shared choice/input question response rules. */
(()=>{
  const normalize=value=>String(value??'').trim().replace(/\s+/g,' ').toLocaleLowerCase('ko-KR');
  const typeOf=question=>question?.type==='input'?'input':'choice';
  function correct(question,response){if(typeOf(question)==='input'){const value=normalize(response);return !!value&&(question.acceptedAnswers||[]).some(answer=>normalize(answer)===value)}return Number(response)===Number(question?.answer)}
  window.StudyVillageQuestionResponse={normalize,typeOf,correct};
})();
