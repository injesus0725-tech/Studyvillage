/* v1.9 read-only teacher overview for configured activity attempt policies.
   Reads player names, activity_records, and per-student extra grants; never changes student records or scores. */
import Database from 'better-sqlite3';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { evaluateAttempt } from './activity-attempt-policy.js';
import { readActivityAttemptPolicies } from './activity-attempt-settings.js';
import { readExtraAttempts } from './activity-attempt-exceptions.js';

const __filename=fileURLToPath(import.meta.url),__dirname=path.dirname(__filename);
const clean=(v,n=160)=>String(v??'').trim().slice(0,n);
const aliasId=id=>id==='riddle-demo'?'riddle':id==='library-vocabulary'?'vocabulary':id;
function classroomDayRange(now=new Date()){const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now),value=type=>parts.find(part=>part.type===type)?.value,start=new Date(`${value('year')}-${value('month')}-${value('day')}T00:00:00+09:00`);return{start:start.toISOString(),end:new Date(start.getTime()+86400000).toISOString()}}
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
          const recordId=aliasId(activityId),record=recordStmt.get(name,recordId)||{attempts:0,bestScore:0,lastScore:0,updatedAt:null},policy=policies[activityId],range=policy?.period==='daily'?classroomDayRange():null,logType=recordId==='riddle'?'quiz-complete':`activity-${recordId}`,dailyCount=range?Number(db.prepare('SELECT COUNT(*) AS count FROM activity_log WHERE player_name=? AND type=? AND created_at>=? AND created_at<?').get(name,logType,range.start,range.end)?.count)||0:null,attemptRecord=dailyCount===null?record:{...record,attempts:dailyCount};
          const decision=evaluateAttempt(policy,attemptRecord),extraAttempts=readExtraAttempts(key=>getSetting(db,key),name,activityId);
          const remaining=decision.remaining===null?null:decision.remaining+extraAttempts;
          return{name,attempts:Number(record.attempts)||0,periodAttempts:decision.attempts,period:policy?.period||'all-time',baseRemaining:decision.remaining,extraAttempts,remaining,allowed:decision.allowed||extraAttempts>0,awardXpOnNextAttempt:decision.awardXp,bestScore:Number(record.bestScore)||0,lastScore:Number(record.lastScore)||0,updatedAt:record.updatedAt||null};
        })
      }));
      res.json({ok:true,activities});
    }catch(err){res.status(500).json({ok:false,code:'attempt-overview-read-failed',message:clean(err?.message||err)})}
    finally{try{db?.close()}catch{}}
  });
}
