/* v1.9 teacher-only question review queue.
   Question data is never changed here. Review state is stored in settings so existing backup/restore preserves it automatically. */
import { auditQuestionSet, summarizeQuestionAudits } from './question-audit.js';
import { installQuestionHistoryRoutes } from './question-history.js';

const STORE_KEY='question-review:queue-v1';
const clean=(v,n=240)=>String(v??'').trim().slice(0,n);
const keyFor=(activityId,issue)=>`${activityId}:${Number(issue.question)||0}:${clean(issue.code,80)}`;
function readQueue(getSetting){try{const rows=JSON.parse(getSetting(STORE_KEY)||'[]');return Array.isArray(rows)?rows:[]}catch{return[]}}
function writeQueue(setSetting,rows){setSetting(STORE_KEY,JSON.stringify(rows.slice(0,500)))}

export function installQuestionReviewRoutes(app,{requireAdmin,getSetting,setSetting}){
  installQuestionHistoryRoutes(app,{requireAdmin,getSetting,setSetting});

  app.post('/api/admin/question-reviews/scan',requireAdmin,(req,res)=>{
    try{
      const sets=Array.isArray(req.body?.sets)?req.body.sets.slice(0,100):[];
      const audits=sets.map(set=>auditQuestionSet(set)),now=new Date().toISOString();
      const existing=new Map(readQueue(getSetting).map(row=>[row.reviewKey,row]));
      for(const audit of audits)for(const issue of audit.issues||[]){
        const reviewKey=keyFor(audit.activityId,issue),old=existing.get(reviewKey)||{};
        existing.set(reviewKey,{reviewKey,activityId:audit.activityId,subject:audit.subject||'',topic:audit.topic||'',questionNumber:Number(issue.question)||null,severity:clean(issue.severity,20),code:clean(issue.code,80),message:clean(issue.message,500),status:old.status||'pending',teacherNote:old.teacherNote||'',detectedAt:old.detectedAt||now,reviewedAt:old.reviewedAt||null});
      }
      writeQueue(setSetting,[...existing.values()]);
      res.json({ok:true,summary:summarizeQuestionAudits(audits),audits});
    }catch(err){res.status(500).json({ok:false,code:'question-scan-failed',message:clean(err?.message||err,240)})}
  });

  app.get('/api/admin/question-reviews',requireAdmin,(_req,res)=>{
    try{
      const reviews=readQueue(getSetting).sort((a,b)=>(a.status==='pending'?0:1)-(b.status==='pending'?0:1)||String(b.detectedAt||'').localeCompare(String(a.detectedAt||'')));
      res.json({ok:true,pendingCount:reviews.filter(r=>r.status==='pending').length,reviews});
    }catch(err){res.status(500).json({ok:false,code:'question-review-read-failed',message:clean(err?.message||err,240)})}
  });

  app.post('/api/admin/question-reviews/:key/review',requireAdmin,(req,res)=>{
    const status=clean(req.body?.status,30),note=clean(req.body?.note,240),key=String(req.params.key||'');
    if(!['confirmed','dismissed','pending'].includes(status))return res.status(400).json({ok:false,code:'invalid-status'});
    try{
      const rows=readQueue(getSetting),index=rows.findIndex(row=>row.reviewKey===key);if(index<0)return res.status(404).json({ok:false,code:'not-found'});
      const reviewedAt=status==='pending'?null:new Date().toISOString();rows[index]={...rows[index],status,teacherNote:note,reviewedAt};writeQueue(setSetting,rows);res.json({ok:true,status,reviewedAt});
    }catch(err){res.status(500).json({ok:false,code:'question-review-update-failed',message:clean(err?.message||err,240)})}
  });
}
