/* v1.9 student activity save enforcement.
   Installed before the legacy activity route so attempt limits and XP policy are enforced server-side.
   Keeps the existing activity_records shape and score calculation behavior. */
import Database from 'better-sqlite3';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { evaluateAttempt } from './activity-attempt-policy.js';
import { readActivityAttemptPolicies } from './activity-attempt-settings.js';

const __filename=fileURLToPath(import.meta.url),__dirname=path.dirname(__filename);
const clean=(v,n=80)=>String(v??'').trim().slice(0,n);
function openDb(){const dataDir=process.env.STUDYVILLAGE_DATA_DIR||__dirname,db=new Database(path.join(dataDir,'studyvillage.db'));db.pragma('busy_timeout = 3000');return db}
function getSetting(db,key){return db.prepare('SELECT value FROM settings WHERE key=?').get(key)?.value||null}
function logActivity(db,name,type,detail=''){db.prepare('INSERT INTO activity_log(player_name,type,detail,created_at) VALUES(?,?,?,?)').run(name,type,detail,new Date().toISOString())}

export function installActivityAttemptStudentRoutes(app,{requireSession}){
  app.post('/api/player/me/activity',requireSession,(req,res)=>{
    const activityId=clean(req.body?.activityId,40),score=Math.max(0,Math.min(1000,Number(req.body?.score)||0));
    if(!/^[a-z0-9-]+$/.test(activityId))return res.status(400).json({ok:false,code:'invalid-activity'});
    let db;
    try{
      db=openDb();
      const name=req.session.name,player=db.prepare('SELECT * FROM players WHERE name=?').get(name);if(!player)return res.status(404).json({ok:false});
      const existing=db.prepare('SELECT * FROM activity_records WHERE player_name=? AND activity_id=?').get(name,activityId);
      const policies=readActivityAttemptPolicies(key=>getSetting(db,key)),decision=evaluateAttempt(policies[activityId]||{},existing||{});
      if(!decision.allowed)return res.status(409).json({ok:false,code:'attempt-limit-reached',activityId,attempts:decision.attempts,remaining:decision.remaining,policy:decision.policy});
      const now=new Date().toISOString(),attempts=(existing?.attempts||0)+1,best=Math.max(existing?.best_score||0,score),total=(existing?.total_score||0)+score,baseXp=20+Math.floor(score/10),gained=decision.awardXp?baseXp:0;
      const tx=db.transaction(()=>{
        const latest=db.prepare('SELECT * FROM activity_records WHERE player_name=? AND activity_id=?').get(name,activityId),latestDecision=evaluateAttempt(policies[activityId]||{},latest||{});
        if(!latestDecision.allowed)return{ok:false,code:'attempt-limit-reached',activityId,attempts:latestDecision.attempts,remaining:latestDecision.remaining,policy:latestDecision.policy};
        const nextAttempts=(latest?.attempts||0)+1,nextBest=Math.max(latest?.best_score||0,score),nextTotal=(latest?.total_score||0)+score,nextGained=latestDecision.awardXp?baseXp:0;
        db.prepare(`INSERT INTO activity_records(player_name,activity_id,attempts,best_score,last_score,total_score,updated_at) VALUES(?,?,?,?,?,?,?) ON CONFLICT(player_name,activity_id) DO UPDATE SET attempts=excluded.attempts,best_score=excluded.best_score,last_score=excluded.last_score,total_score=excluded.total_score,updated_at=excluded.updated_at`).run(name,activityId,nextAttempts,nextBest,score,nextTotal,now);
        if(nextGained)db.prepare('UPDATE players SET xp=xp+?,updated_at=? WHERE name=?').run(nextGained,now,name);else db.prepare('UPDATE players SET updated_at=? WHERE name=?').run(now,name);
        logActivity(db,name,`activity-${activityId}`,`${score}점${nextGained?` · +${nextGained}XP`:' · XP 추가 없음'}`);
        return{ok:true,gainedXp:nextGained,record:{activityId,attempts:nextAttempts,bestScore:nextBest,lastScore:score,totalScore:nextTotal,updatedAt:now},policy:latestDecision.policy};
      });
      const result=tx();
      if(!result.ok)return res.status(409).json(result);
      res.json(result);
    }catch(err){res.status(500).json({ok:false,code:'activity-save-failed',message:clean(err?.message||err,160)})}
    finally{try{db?.close()}catch{}}
  });
}
