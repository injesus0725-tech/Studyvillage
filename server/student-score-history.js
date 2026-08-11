/* v1.9 student score history with subject/topic metadata.
   Read-only compatibility route. The immutable score ledger schema is not changed. */
import Database from 'better-sqlite3';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { activityMetadataFor } from './activity-metadata.js';

const __filename=fileURLToPath(import.meta.url),__dirname=path.dirname(__filename);
const clean=(v,n=160)=>String(v??'').trim().slice(0,n);
function openDb(){const dataDir=process.env.STUDYVILLAGE_DATA_DIR||__dirname,db=new Database(path.join(dataDir,'studyvillage.db'),{readonly:true,fileMustExist:true});db.pragma('busy_timeout = 3000');return db}

export function installStudentScoreHistoryRoutes(app,{requireSession}){
  app.get('/api/player/me/score-ledger',requireSession,(req,res)=>{
    let db;
    try{
      db=openDb();
      const limit=Math.max(1,Math.min(300,Number(req.query.limit)||100));
      const rows=db.prepare(`SELECT id,scope,activity_id AS activityId,field,before_value AS beforeValue,after_value AS afterValue,delta,source,created_at AS createdAt FROM score_ledger WHERE player_name=? ORDER BY id DESC LIMIT ?`).all(req.session.name,limit);
      const entries=rows.map(row=>{
        const meta=activityMetadataFor(row.activityId);
        return{...row,subject:meta.subject,topic:meta.topic,activityName:meta.name};
      });
      res.json({ok:true,entries});
    }catch(err){res.status(500).json({ok:false,code:'score-ledger-read-failed',message:clean(err?.message||err)})}
    finally{try{db?.close()}catch{}}
  });
}
