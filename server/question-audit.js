/* v1.9 read-only question data auditor.
   This module never edits question data. It only reports suspicious rows for teacher review. */

const text=value=>String(value??'').trim();

export function auditQuestionSet({activityId='',subject='',topic='',questions=[]}={}){
  const issues=[];
  const seenPrompt=new Map();
  const activity=text(activityId)||'unknown';

  if(!Array.isArray(questions)){
    return {ok:false,activityId:activity,subject:text(subject),topic:text(topic),questionCount:0,issues:[{severity:'error',code:'questions-not-array',message:'문제 목록이 배열 형식이 아닙니다.'}]};
  }

  questions.forEach((q,index)=>{
    const number=index+1;
    const prompt=text(q?.question??q?.prompt??q?.word);
    const options=Array.isArray(q?.options)?q.options:[];
    const answer=Number(q?.answer);

    if(!prompt)issues.push({severity:'error',code:'blank-prompt',question:number,message:`${number}번 문제의 문제 문장이 비어 있습니다.`});
    else{
      const key=prompt.replace(/\s+/g,' ').toLocaleLowerCase('ko-KR');
      if(seenPrompt.has(key))issues.push({severity:'warning',code:'duplicate-prompt',question:number,relatedQuestion:seenPrompt.get(key),message:`${number}번 문제가 ${seenPrompt.get(key)}번 문제와 같은 내용으로 보입니다.`});
      else seenPrompt.set(key,number);
    }

    if(options.length<2)issues.push({severity:'error',code:'too-few-options',question:number,message:`${number}번 문제의 선택지가 2개 미만입니다.`});
    if(options.some(option=>!text(option)))issues.push({severity:'error',code:'blank-option',question:number,message:`${number}번 문제에 빈 선택지가 있습니다.`});

    const normalized=options.map(option=>text(option).replace(/\s+/g,' ').toLocaleLowerCase('ko-KR'));
    if(new Set(normalized).size!==normalized.length)issues.push({severity:'warning',code:'duplicate-option',question:number,message:`${number}번 문제에 같은 선택지가 중복되어 있습니다.`});

    if(!Number.isInteger(answer)||answer<0||answer>=options.length)issues.push({severity:'error',code:'invalid-answer-index',question:number,message:`${number}번 문제의 정답 번호가 선택지 범위를 벗어납니다.`});
  });

  return {
    ok:issues.every(issue=>issue.severity!=='error'),
    activityId:activity,
    subject:text(subject),
    topic:text(topic),
    questionCount:questions.length,
    issueCount:issues.length,
    issues
  };
}

export function summarizeQuestionAudits(audits=[]){
  const rows=Array.isArray(audits)?audits:[];
  return {
    setCount:rows.length,
    questionCount:rows.reduce((sum,row)=>sum+(Number(row?.questionCount)||0),0),
    issueCount:rows.reduce((sum,row)=>sum+(Number(row?.issueCount)||0),0),
    errorCount:rows.reduce((sum,row)=>sum+(row?.issues||[]).filter(issue=>issue.severity==='error').length,0),
    warningCount:rows.reduce((sum,row)=>sum+(row?.issues||[]).filter(issue=>issue.severity==='warning').length,0)
  };
}
