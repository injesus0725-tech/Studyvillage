/* v1.9 teacher-managed question overrides. Stored in settings/backups; static source stays untouched. */
import { recordQuestionHistory, safeQuestionSnapshot } from './question-history.js';
const STORE_KEY='question-edit:overrides-v1';
const clean=(v,n=500)=>String(v??'').trim().slice(0,n);
const read=getSetting=>{try{const v=JSON.parse(getSetting(STORE_KEY)||'{}');return v&&typeof v==='object'&&!Array.isArray(v)?v:{}}catch{return{}}};
const write=(setSetting,v)=>setSetting(STORE_KEY,JSON.stringify(v));
const key=(activityId,questionNumber)=>`${clean(activityId,80)}:${Number(questionNumber)}`;
const validQuestion=q=>{const prompt=q.word||q.question||q.prompt;if(!prompt)return false;if(q.type==='input'){const normalized=q.acceptedAnswers.map(value=>value.replace(/\s+/g,' ').toLocaleLowerCase('ko-KR'));return q.acceptedAnswers.length>0&&q.acceptedAnswers.length<=8&&new Set(normalized).size===normalized.length}return q.options.length>=2&&q.answer!==null&&q.answer>=0&&q.answer<q.options.length};
export function installQuestionOverrideRoutes(app,{requireAdmin,getSetting,setSetting}){
  app.get('/api/question-overrides',(_req,res)=>res.json({ok:true,overrides:read(getSetting)}));
  app.post('/api/admin/question-overrides',requireAdmin,(req,res)=>{
    const activityId=clean(req.body?.activityId,80),questionNumber=Number(req.body?.questionNumber),reason=clean(req.body?.reason,240),before=safeQuestionSnapshot(req.body?.before),after=safeQuestionSnapshot(req.body?.after);
    if(!activityId||!Number.isInteger(questionNumber)||questionNumber<1||!reason||!validQuestion(after))return res.status(400).json({ok:false,code:'invalid-input'});
    const overrides=read(getSetting),k=key(activityId,questionNumber),previous=overrides[k];
    try{
      overrides[k]={activityId,questionNumber,question:after,updatedAt:new Date().toISOString()};write(setSetting,overrides);
      const entry=recordQuestionHistory({getSetting,setSetting,activityId,questionNumber,reason,before,after});
      res.json({ok:true,override:overrides[k],history:entry});
    }catch(err){if(previous)overrides[k]=previous;else delete overrides[k];write(setSetting,overrides);res.status(500).json({ok:false,code:'question-edit-save-failed',message:clean(err?.message||err,240)})}
  });
  app.post('/api/admin/question-overrides/:activityId/:questionNumber/revert',requireAdmin,(req,res)=>{
    const activityId=clean(req.params.activityId,80),questionNumber=Number(req.params.questionNumber),reason=clean(req.body?.reason,240),after=safeQuestionSnapshot(req.body?.baseQuestion),overrides=read(getSetting),k=key(activityId,questionNumber),previous=overrides[k];
    if(!activityId||!Number.isInteger(questionNumber)||questionNumber<1||!reason||!previous||!validQuestion(after))return res.status(previous?400:404).json({ok:false,code:previous?'invalid-input':'not-found'});
    const before=safeQuestionSnapshot(previous.question);
    try{
      delete overrides[k];write(setSetting,overrides);
      const entry=recordQuestionHistory({getSetting,setSetting,activityId,questionNumber,reason,before,after});
      res.json({ok:true,history:entry});
    }catch(err){overrides[k]=previous;write(setSetting,overrides);res.status(500).json({ok:false,code:'question-revert-failed',message:clean(err?.message||err,240)})}
  });
  app.delete('/api/admin/question-overrides/:activityId/:questionNumber',requireAdmin,(_req,res)=>res.status(405).json({ok:false,code:'use-history-safe-revert'}));
}
