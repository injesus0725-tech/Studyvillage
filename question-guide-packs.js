/* Data-only expansion point for lesson-plan / teacher-guide questions.
   Add new GUIDE_PACKS entries here; student game logic should not need changes. */
(()=>{
  const GUIDE_PACKS=[
    // Example shape is documented in QUESTION_SET_TEMPLATE.md.
    // Real lesson-plan / teacher-guide packs are added after source files are supplied.
  ];

  const allowedSubjects=new Set(['국어','수학','사회','과학','예체능','창의적 사고']);
  const allowedSpaces=new Set(['curriculum','exploration','bookmaru']);
  const clean=value=>String(value??'').trim();
  const cloneQuestion=q=>({...q,options:Array.isArray(q?.options)?[...q.options]:[],acceptedAnswers:Array.isArray(q?.acceptedAnswers)?[...q.acceptedAnswers]:[]});
  const validActivityId=value=>/^[a-z0-9-]{3,80}$/.test(clean(value));
  const validQuestionId=value=>/^[a-z0-9-]{3,100}$/.test(clean(value));

  function normalizePack(pack){
    const base={
      activityId:clean(pack?.activityId),subject:clean(pack?.subject),grade:Number(pack?.grade),semester:Number(pack?.semester),
      unit:clean(pack?.unit),subunit:clean(pack?.subunit||pack?.topic),topic:clean(pack?.topic||pack?.subunit),
      difficulty:clean(pack?.difficulty||'normal')||'normal',spaces:Array.isArray(pack?.spaces)?[...new Set(pack.spaces.map(clean).filter(Boolean))]:[],
      enabled:pack?.enabled!==false
    };
    if(!validActivityId(base.activityId)||!allowedSubjects.has(base.subject)||!Number.isInteger(base.grade)||base.grade<1||base.grade>6||![1,2].includes(base.semester)||!base.unit||!base.spaces.length||base.spaces.some(space=>!allowedSpaces.has(space))||!Array.isArray(pack?.questions)||!pack.questions.length)return null;
    const questions=[];
    for(const raw of pack.questions){
      const q={...cloneQuestion(raw),id:clean(raw?.id),subject:clean(raw?.subject||base.subject),grade:Number(raw?.grade||base.grade),semester:Number(raw?.semester||base.semester),unit:clean(raw?.unit||base.unit),subunit:clean(raw?.subunit||base.subunit),difficulty:clean(raw?.difficulty||base.difficulty)||'normal',spaces:Array.isArray(raw?.spaces)?[...new Set(raw.spaces.map(clean).filter(Boolean))]:[...base.spaces],enabled:raw?.enabled!==false};
      const prompt=clean(q.word||q.question||q.prompt);
      const inputOk=q.type==='input'&&Array.isArray(q.acceptedAnswers)&&q.acceptedAnswers.length>0&&q.acceptedAnswers.every(answer=>clean(answer));
      const choiceOk=q.type!=='input'&&Array.isArray(q.options)&&q.options.length>=2&&q.options.every(option=>clean(option))&&Number.isInteger(Number(q.answer))&&Number(q.answer)>=0&&Number(q.answer)<q.options.length;
      if(!validQuestionId(q.id)||!prompt||!allowedSubjects.has(q.subject)||!q.unit||!q.spaces.length||q.spaces.some(space=>!allowedSpaces.has(space))||(!inputOk&&!choiceOk))return null;
      q.explanation=clean(q.explanation);
      questions.push(q);
    }
    return{...base,questions};
  }

  function install(){
    const sets=window.StudyVillageQuestionSets;
    if(!sets||typeof sets!=='object')return{ok:false,installed:0,skipped:GUIDE_PACKS.length,reason:'base-question-bank-missing'};
    const usedActivities=new Set(Object.values(sets).map(set=>clean(set?.activityId)).filter(Boolean));
    const usedQuestionIds=new Set(Object.values(sets).flatMap(set=>(set?.questions||[]).map(q=>clean(q?.id))).filter(Boolean));
    let installed=0,skipped=0;
    for(const raw of GUIDE_PACKS){
      const pack=normalizePack(raw);
      if(!pack||usedActivities.has(pack.activityId)||pack.questions.some(q=>usedQuestionIds.has(q.id))||new Set(pack.questions.map(q=>q.id)).size!==pack.questions.length){
        skipped++;console.error('[StudyVillage] invalid or duplicate guide question pack skipped',raw?.activityId||raw?.unit||'unknown');continue;
      }
      const key=`guide_${pack.activityId.replace(/-/g,'_')}`;
      sets[key]=pack;usedActivities.add(pack.activityId);for(const q of pack.questions)usedQuestionIds.add(q.id);installed++;
    }
    window.StudyVillageGuideQuestionPacks=GUIDE_PACKS;
    window.StudyVillageGuideQuestionPackStatus={ok:skipped===0,installed,skipped};
    return window.StudyVillageGuideQuestionPackStatus;
  }

  window.StudyVillageInstallGuideQuestionPacks=install;
  install();
})();
