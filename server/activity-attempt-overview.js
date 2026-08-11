/* v1.9 read-only teacher overview for configured activity attempt policies.
   Reads player names and activity_records only; never changes student records, scores, XP, or settings. */
import Database from 'better-sqlite3';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { evaluateAttempt } from './activity-attempt-policy.js';
import { readActivityAttemptPolicies } from './activity-attempt-settings.js';

const __filename=fileURLToPath(import.meta.url),__dirname=path.dirname(__filename);
const clean=(v,n=160)=>String(v??'').trim().slice(0,n);
function openDb(){const dataDir=process.env.STUDYVILLAGE_DATA_DIR||__dirname,db=new Database(path.join(dataDir,'studyvillage.db'),{readonly:true,fileMustExist:true});db.pragma('busy_timeout = 3000');return db}
function getSetting(db,key){return db.prepare('SELECT value FROM settings WHERE key=?').get(key)?.value||null}

export function installActivityAttemptOverviewRoutes(app,{requireAdmin}){
  app.get('/api/admin/activity-attempt-overview',requireAdmin,(_req,res)=>{
    let db;
    try{
      db=openDb();
      const policies=readActivityAttemptPolicies(key=>getSetting(db,key));
      const activityIds=Object.keys(policies).sort();
      const players=db.prepare('SELECT name FROM players ORDER BY name').all();
      const recordStmt=db.prepare('SELECT attempts,best_score AS bestScore,last_score AS lastScore,updated_at AS updatedAt FROM activity_records WHERE player_name=? AND activity_id=?');
      const activities=activityIds.map(activityId=>({
        activityId,
        policy:policies[activityId],
        students:players.map(({name})=>{
          const record=recordStmt.get(name,activityId)||{attempts:0,bestScore:0,lastScore:0,updatedAt:null};
          const decision=evaluateAttempt(policies[activityId],record);
          return{name,attempts:decision.attempts,remaining:decision.remaining,allowed:decision.allowed,awardXpOnNextAttempt:decision.awardXp,bestScore:Number(record.bestScore)||0,lastScore:Number(record.lastScore)||0,updatedAt:record.updatedAt||null};
        })
      }));
      res.json({ok:true,activities});
    }catch(err){res.status(500).json({ok:false,code:'attempt-overview-read-failed',message:clean(err?.message||err)})}
    finally{try{db?.close()}catch{}}
  });
}
