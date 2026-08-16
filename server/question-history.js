/* v1.9 teacher question edit history. Stores snapshots only; does not modify question data. */
const STORE_KEY='question-edit:history-v1';
const clean=(v,n=500)=>String(v??'').trim().slice(0,n);
function read(getSetting){try{const rows=JSON.parse(getSetting(STORE_KEY)||'[]');return Array.isArray(rows)?rows:[]}catch{return[]}}
function write(setSetting,rows){setSetting(STORE_KEY,JSON.stringify(rows.slice(-500)))}
export function safeQuestionSnapshot(q={}){const type=q.type==='input'?'input':'choice';return{type,word:clean(q.word,300),question:clean(q.question,1000),prompt:clean(q.prompt,1000),options:Array.isArray(q.options)?q.options.slice(0,12).map(v=>clean(v,500)):[],answer:Number.isInteger(Number(q.answer))?Number(q.answer):null,acceptedAnswers:Array.isArray(q.acceptedAnswers)?q.acceptedAnswers.slice(0,8).map(v=>clean(v,100)).filter(Boolean):[]}}
export function recordQuestionHistory({getSetting,setSetting,activityId,questionNumber,reason,before,after}){const id=clean(activityId,80),n=Number(questionNumber),why=clean(reason,240);if(!id||!Number.isInteger(n)||n<1||!why)throw new Error('invalid-history-input');const rows=read(getSetting),entry={id:`qh-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,activityId:id,questionNumber:n,reason:why,before:safeQuestionSnapshot(before),after:safeQuestionSnapshot(after),createdAt:new Date().toISOString(),undoneAt:null};rows.push(entry);write(setSetting,rows);return entry}
export function installQuestionHistoryRoutes(app,{requireAdmin,getSetting,setSetting}){
  app.get('/api/admin/question-history',requireAdmin,(_req,res)=>{const rows=read(getSetting).slice().reverse();res.json({ok:true,history:rows})});
  app.post('/api/admin/question-history/snapshot',requireAdmin,(req,res)=>{try{const entry=recordQuestionHistory({getSetting,setSetting,activityId:req.body?.activityId,questionNumber:req.body?.questionNumber,reason:req.body?.reason,before:req.body?.before,after:req.body?.after});res.json({ok:true,entry})}catch{return res.status(400).json({ok:false,code:'invalid-input'})}});
  app.post('/api/admin/question-history/:id/mark-undone',requireAdmin,(req,res)=>{const rows=read(getSetting),i=rows.findIndex(r=>r.id===req.params.id);if(i<0)return res.status(404).json({ok:false,code:'not-found'});rows[i]={...rows[i],undoneAt:new Date().toISOString()};write(setSetting,rows);res.json({ok:true,entry:rows[i]})});
}
