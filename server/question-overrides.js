/* v1.9 teacher-managed question overrides. Stored in settings/backups; static source stays untouched. */
const STORE_KEY='question-edit:overrides-v1';
const clean=(v,n=500)=>String(v??'').trim().slice(0,n);
const read=getSetting=>{try{const v=JSON.parse(getSetting(STORE_KEY)||'{}');return v&&typeof v==='object'&&!Array.isArray(v)?v:{}}catch{return{}}};
const write=(setSetting,v)=>setSetting(STORE_KEY,JSON.stringify(v));
const safeQuestion=q=>({word:clean(q?.word,300),question:clean(q?.question,1000),prompt:clean(q?.prompt,1000),options:Array.isArray(q?.options)?q.options.slice(0,12).map(x=>clean(x,500)):[],answer:Number.isInteger(Number(q?.answer))?Number(q.answer):null});
const key=(activityId,questionNumber)=>`${clean(activityId,80)}:${Number(questionNumber)}`;
export function installQuestionOverrideRoutes(app,{requireAdmin,getSetting,setSetting}){
  app.get('/api/question-overrides',(_req,res)=>res.json({ok:true,overrides:read(getSetting)}));
  app.post('/api/admin/question-overrides',requireAdmin,(req,res)=>{const activityId=clean(req.body?.activityId,80),questionNumber=Number(req.body?.questionNumber),reason=clean(req.body?.reason,240),before=safeQuestion(req.body?.before),after=safeQuestion(req.body?.after);if(!activityId||!Number.isInteger(questionNumber)||questionNumber<1||!reason||!after.options.length||after.answer===null||after.answer<0||after.answer>=after.options.length)return res.status(400).json({ok:false,code:'invalid-input'});const overrides=read(getSetting);overrides[key(activityId,questionNumber)]={activityId,questionNumber,question:after,updatedAt:new Date().toISOString()};write(setSetting,overrides);res.json({ok:true,override:overrides[key(activityId,questionNumber)],historySnapshot:{activityId,questionNumber,reason,before,after}})});
  app.delete('/api/admin/question-overrides/:activityId/:questionNumber',requireAdmin,(req,res)=>{const overrides=read(getSetting),k=key(req.params.activityId,req.params.questionNumber);if(!overrides[k])return res.status(404).json({ok:false,code:'not-found'});delete overrides[k];write(setSetting,overrides);res.json({ok:true})});
}
