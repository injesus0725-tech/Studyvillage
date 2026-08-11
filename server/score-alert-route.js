/* v1.9 score alert read route using the false-positive policy.
   Read-only: never changes score, XP, reviews, or corrections. Installed before the legacy GET route. */
import Database from 'better-sqlite3';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { classifyScoreLedgerEntry } from './score-alert-policy.js';

const __filename=fileURLToPath(import.meta.url),__dirname=path.dirname(__filename);
const clean=(v,n=160)=>String(v??'').trim().slice(0,n);
function openDb(){const dataDir=process.env.STUDYVILLAGE_DATA_DIR||__dirname,db=new Database(path.join(dataDir,'studyvillage.db'),{readonly:true,fileMustExist:true});db.pragma('busy_timeout = 3000');return db}

export function installScoreAlertReadRoute(app,{requireAdmin}){
  app.get('/api/admin/score-alerts',requireAdmin,(req,res)=>{
    let db;
    try{
      db=openDb();
      const limit=Math.max(1,Math.min(1000,Number(req.query.limit)||400));
      const rows=db.prepare(`SELECT id,player_name AS playerName,scope,activity_id AS activityId,field,before_value AS beforeValue,after_value AS afterValue,delta,source,created_at AS createdAt FROM score_ledger ORDER BY id DESC LIMIT ?`).all(Math.max(limit*4,400));
      const reviewStmt=db.prepare('SELECT status AS reviewStatus,note AS reviewNote,reviewed_at AS reviewedAt FROM score_alert_reviews WHERE ledger_id=?');
      const correctionStmt=db.prepare('SELECT id AS correctionId,before_value AS correctionBeforeValue,after_value AS correctionAfterValue,corrected_at AS correctedAt,undone_at AS undoneAt FROM score_corrections WHERE ledger_id=? ORDER BY id DESC LIMIT 1');
      const chronological=[...rows].reverse(),classified=new Map();
      for(let i=0;i<chronological.length;i++){
        const entry=chronological[i],previous=i?chronological[i-1]:null;
        classified.set(entry.id,classifyScoreLedgerEntry(entry,previous));
      }
      const alerts=[];
      for(const row of rows){
        const review=reviewStmt.get(row.id)||{},correction=correctionStmt.get(row.id)||{},decision=classified.get(row.id)||{priority:'none',reasons:[],suppressed:false};
        if(decision.suppressed&&!review.reviewStatus)continue;
        if(decision.priority==='none'&&!review.reviewStatus)continue;
        alerts.push({...row,...decision,...review,...correction});
        if(alerts.length>=limit)break;
      }
      res.json({ok:true,pendingCount:alerts.filter(a=>!a.reviewStatus).length,alerts});
    }catch(err){res.status(500).json({ok:false,code:'score-alert-read-failed',message:clean(err?.message||err)})}
    finally{try{db?.close()}catch{}}
  });
}
