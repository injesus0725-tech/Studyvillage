/* v1.9 teacher-only question review queue.
   Question data is never changed here. This module stores review findings/status only. */
import Database from 'better-sqlite3';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { auditQuestionSet, summarizeQuestionAudits } from './question-audit.js';

const __filename=fileURLToPath(import.meta.url),__dirname=path.dirname(__filename);
const clean=(v,n=240)=>String(v??'').trim().slice(0,n);
function openDb(){const dataDir=process.env.STUDYVILLAGE_DATA_DIR||__dirname,db=new Database(path.join(dataDir,'studyvillage.db'));db.pragma('busy_timeout = 3000');return db}
function ensure(db){db.exec(`CREATE TABLE IF NOT EXISTS question_review_queue (
  review_key TEXT PRIMARY KEY,
  activity_id TEXT NOT NULL,
  subject TEXT,
  topic TEXT,
  question_number INTEGER,
  severity TEXT NOT NULL,
  code TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  teacher_note TEXT,
  detected_at TEXT NOT NULL,
  reviewed_at TEXT
);CREATE INDEX IF NOT EXISTS idx_question_review_status ON question_review_queue(status,detected_at DESC);`)}
const keyFor=(activityId,issue)=>`${activityId}:${Number(issue.question)||0}:${clean(issue.code,80)}`;

export function installQuestionReviewRoutes(app,{requireAdmin}){
  app.post('/api/admin/question-reviews/scan',requireAdmin,(req,res)=>{
    const sets=Array.isArray(req.body?.sets)?req.body.sets.slice(0,100):[];
    const audits=sets.map(set=>auditQuestionSet(set));
    let db;try{db=openDb();ensure(db);const now=new Date().toISOString(),upsert=db.prepare(`INSERT INTO question_review_queue(review_key,activity_id,subject,topic,question_number,severity,code,message,status,detected_at)
      VALUES(@reviewKey,@activityId,@subject,@topic,@questionNumber,@severity,@code,@message,'pending',@detectedAt)
      ON CONFLICT(review_key) DO UPDATE SET severity=excluded.severity,message=excluded.message,subject=excluded.subject,topic=excluded.topic`);
      const tx=db.transaction(()=>{for(const audit of audits)for(const issue of audit.issues||[])upsert.run({reviewKey:keyFor(audit.activityId,issue),activityId:audit.activityId,subject:audit.subject||'',topic:audit.topic||'',questionNumber:Number(issue.question)||null,severity:clean(issue.severity,20),code:clean(issue.code,80),message:clean(issue.message,500),detectedAt:now})});tx();
      res.json({ok:true,summary:summarizeQuestionAudits(audits),audits});
    }catch(err){res.status(500).json({ok:false,code:'question-scan-failed',message:clean(err?.message||err,240)})}finally{try{db?.close()}catch{}}
  });
  app.get('/api/admin/question-reviews',requireAdmin,(_req,res)=>{let db;try{db=openDb();ensure(db);const reviews=db.prepare(`SELECT review_key AS reviewKey,activity_id AS activityId,subject,topic,question_number AS questionNumber,severity,code,message,status,teacher_note AS teacherNote,detected_at AS detectedAt,reviewed_at AS reviewedAt FROM question_review_queue ORDER BY CASE status WHEN 'pending' THEN 0 ELSE 1 END, detected_at DESC LIMIT 300`).all();res.json({ok:true,pendingCount:reviews.filter(r=>r.status==='pending').length,reviews})}catch(err){res.status(500).json({ok:false,code:'question-review-read-failed',message:clean(err?.message||err,240)})}finally{try{db?.close()}catch{}}});
  app.post('/api/admin/question-reviews/:key/review',requireAdmin,(req,res)=>{const status=clean(req.body?.status,30),note=clean(req.body?.note,240);if(!['confirmed','dismissed','pending'].includes(status))return res.status(400).json({ok:false,code:'invalid-status'});let db;try{db=openDb();ensure(db);const reviewedAt=status==='pending'?null:new Date().toISOString(),result=db.prepare('UPDATE question_review_queue SET status=?,teacher_note=?,reviewed_at=? WHERE review_key=?').run(status,note,reviewedAt,String(req.params.key||''));if(!result.changes)return res.status(404).json({ok:false,code:'not-found'});res.json({ok:true,status,reviewedAt})}catch(err){res.status(500).json({ok:false,code:'question-review-update-failed',message:clean(err?.message||err,240)})}finally{try{db?.close()}catch{}}});
}
