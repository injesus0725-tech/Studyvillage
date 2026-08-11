/* v1.9 student score history with subject/topic metadata.
   Read-only compatibility route. The immutable score ledger schema is not changed. */
import Database from 'better-sqlite3';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename=fileURLToPath(import.meta.url),__dirname=path.dirname(__filename);
const META=Object.freeze({
  vocabulary:{subject:'국어',topic:'어휘',name:'책마루 · 낱말 뜻 맞추기'},
  riddle:{subject:'기타',topic:'수수께끼',name:'도전관 · 수수께끼'}
});
const clean=(v,n=160)=>String(v??'').trim().slice(0,n);
const metaFor=id=>META[id]||{subject:'기타',topic:id?String(id).replace(/-/g,' '):'전체',name:id?String(id).replace(/-/g,' '):'전체 기록'};
function openDb(){const dataDir=process.env.STUDYVILLAGE_DATA_DIR||__dirname,db=new Database(path.join(dataDir,'studyvillage.db'),{readonly:true,fileMustExist:true});db.pragma('busy_timeout = 3000');return db}

export function installStudentScoreHistoryRoutes(app,{requireSession}){
  app.get('/api/player/me/score-ledger',requireSession,(req,res)=>{
    let db;
    try{
      db=openDb();
      const limit=Math.max(1,Math.min(300,Number(req.query.limit)||100));
      const rows=db.prepare(`SELECT id,scope,activity_id AS activityId,field,before_value AS beforeValue,after_value AS afterValue,delta,source,created_at AS createdAt FROM score_ledger WHERE player_name=? ORDER BY id DESC LIMIT ?`).all(req.session.name,limit);
      const entries=rows.map(row=>{
        const meta=row.activityId?metaFor(row.activityId):{subject:'전체',topic:'전체 점수',name:'전체 점수'};
        return{...row,subject:meta.subject,topic:meta.topic,activityName:meta.name};
      });
      res.json({ok:true,entries});
    }catch(err){res.status(500).json({ok:false,code:'score-ledger-read-failed',message:clean(err?.message||err)})}
    finally{try{db?.close()}catch{}}
  });
}
