/* v1.9 teacher question edit history. Stores snapshots only; does not modify question data. */
const STORE_KEY='question-edit:history-v1';
const clean=(v,n=500)=>String(v??'').trim().slice(0,n);
function read(getSetting){try{const rows=JSON.parse(getSetting(STORE_KEY)||'[]');return Array.isArray(rows)?rows:[]}catch{return[]}}
function write(setSetting,rows){setSetting(STORE_KEY,JSON.stringify(rows.slice(-500)))}
function safeQuestion(q={}){return{word:clean(q.word,300),question:clean(q.question,1000),prompt:clean(q.prompt,1000),options:Array.isArray(q.options)?q.options.slice(0,12).map(v=>clean(v,500)):[],answer:Number.isInteger(Number(q.answer))?Number(q.answer):null}}
export function installQuestionHistoryRoutes(app,{requireAdmin,getSetting,setSetting}){
  app.get('/api/admin/question-history',requireAdmin,(_req,res)=>{const rows=read(getSetting).slice().reverse();res.json({ok:true,history:rows})});
  app.post('/api/admin/question-history/snapshot',requireAdmin,(req,res)=>{
    const activityId=clean(req.body?.activityId,80),questionNumber=Number(req.body?.questionNumber),reason=clean(req.body?.reason,240),before=safeQuestion(req.body?.before),after=safeQuestion(req.body?.after);
    if(!activityId||!Number.isInteger(questionNumber)||questionNumber<1||!reason)return res.status(400).json({ok:false,code:'invalid-input'});
    const rows=read(getSetting),entry={id:`qh-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,activityId,questionNumber,reason,before,after,createdAt:new Date().toISOString(),undoneAt:null};rows.push(entry);write(setSetting,rows);res.json({ok:true,entry});
  });
  app.post('/api/admin/question-history/:id/mark-undone',requireAdmin,(req,res)=>{const rows=read(getSetting),i=rows.findIndex(r=>r.id===req.params.id);if(i<0)return res.status(404).json({ok:false,code:'not-found'});rows[i]={...rows[i],undoneAt:new Date().toISOString()};write(setSetting,rows);res.json({ok:true,entry:rows[i]})});
}
