/* v1.9 legacy riddle record enforcement.
   Intercepts /api/player/me/record before the legacy server route so the riddle activity follows
   the same teacher attempt policy and per-student extra-attempt grants as newer activities.
   Snapshot retries are idempotent; multi-attempt legacy jumps are handled conservatively without
   multiplying XP from a single lastScore value. */
import Database from 'better-sqlite3';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { normalizeAttemptPolicy } from './activity-attempt-policy.js';
import { readActivityAttemptPolicies } from './activity-attempt-settings.js';
import { readExtraAttempts, consumeExtraAttempts } from './activity-attempt-exceptions.js';

const __filename=fileURLToPath(import.meta.url),__dirname=path.dirname(__filename);
const POLICY_ID='riddle-demo';
const clean=(v,n=160)=>String(v??'').trim().slice(0,n);
const clamp=(v,min,max)=>Math.max(min,Math.min(max,Number(v)||0));
function openDb(){const dataDir=process.env.STUDYVILLAGE_DATA_DIR||__dirname,db=new Database(path.join(dataDir,'studyvillage.db'));db.pragma('busy_timeout = 3000');return db}
function getSetting(db,key){return db.prepare('SELECT value FROM settings WHERE key=?').get(key)?.value||null}
function setSetting(db,key,value){db.prepare('INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value').run(key,String(value))}
const xpForLevel=level=>{const n=Math.max(0,(Number(level)||1)-1);return 200*n+25*n*(n-1)},levelFromXp=xp=>{const value=Math.max(0,Number(xp)||0);let level=1;while(value>=xpForLevel(level+1))level++;return level},progressFromXp=xp=>{const value=Math.max(0,Number(xp)||0),level=levelFromXp(value),start=xpForLevel(level),next=xpForLevel(level+1);return{level,xpIntoLevel:value-start,xpToNext:next-start}};
function rewardsFor(r){const level=levelFromXp(r.xp),badges=[];if((r.attempts||0)>=1)badges.push({id:'first-challenge',icon:'🌱',name:'첫 도전'});if((r.best_score||0)>=1000)badges.push({id:'perfect',icon:'🏆',name:'수수께끼 마스터'});if((r.attempts||0)>=10)badges.push({id:'persistent',icon:'🔥',name:'꾸준한 도전자'});if((r.login_count||0)>=10)badges.push({id:'regular',icon:'📅',name:'마을 단골'});if(level>=3)badges.push({id:'growing',icon:'⭐',name:'성장하는 학습자'});if(level>=5)badges.push({id:'scholar',icon:'🎓',name:'학습 탐험가'});let title='새싹 주민';if(level>=2)title='배움 여행자';if(level>=3)title='성장하는 도전자';if(level>=5)title='학습 탐험가';if((r.best_score||0)>=1000)title='수수께끼 마스터';return{title,badges}}
function playerView(r){const rewards=rewardsFor(r),progress=progressFromXp(r.xp);return{name:r.name,totalScore:r.total_score,attempts:r.attempts,bestScore:r.best_score,lastScore:r.last_score,loginCount:r.login_count||0,lastLoginAt:r.last_login_at||null,xp:r.xp||0,...progress,title:rewards.title,badges:rewards.badges,updatedAt:r.updated_at}}
function logActivity(db,name,detail){db.prepare('INSERT INTO activity_log(player_name,type,detail,created_at) VALUES(?,?,?,?)').run(name,'quiz-complete',detail,new Date().toISOString())}

export function installRiddleAttemptStudentRoutes(app,{requireSession}){
  app.post('/api/player/me/record',requireSession,(req,res)=>{
    let db;
    try{
      db=openDb();
      const name=req.session.name,current=db.prepare('SELECT * FROM players WHERE name=?').get(name);if(!current)return res.status(404).json({ok:false,code:'player-not-found'});
      const incoming={totalScore:clamp(req.body?.totalScore,0,100000000),attempts:clamp(req.body?.attempts,0,1000000),bestScore:clamp(req.body?.bestScore,0,1000),lastScore:clamp(req.body?.lastScore,0,1000)};
      const newAttempts=Math.max(0,incoming.attempts-current.attempts);
      const policies=readActivityAttemptPolicies(key=>getSetting(db,key)),policy=normalizeAttemptPolicy(policies[POLICY_ID]||{});
      const unlimited=policy.mode==='unlimited',baseRemaining=unlimited?Number.POSITIVE_INFINITY:Math.max(0,Number(policy.limit||1)-Number(current.attempts||0));
      const extraBefore=readExtraAttempts(key=>getSetting(db,key),name,POLICY_ID),extraNeeded=newAttempts?Math.max(0,newAttempts-(Number.isFinite(baseRemaining)?baseRemaining:newAttempts)):0;
      if(extraNeeded>extraBefore)return res.status(409).json({ok:false,code:'attempt-limit-reached',activityId:POLICY_ID,attempts:current.attempts,remaining:Number.isFinite(baseRemaining)?baseRemaining:null,extraAttempts:extraBefore,policy});
      const tx=db.transaction(()=>{
        const latest=db.prepare('SELECT * FROM players WHERE name=?').get(name);if(!latest)throw Object.assign(new Error('player-not-found'),{code:'player-not-found'});
        if(latest.attempts!==current.attempts)throw Object.assign(new Error('record-changed'),{code:'record-changed'});
        const latestExtra=readExtraAttempts(key=>getSetting(db,key),name,POLICY_ID);if(extraNeeded>latestExtra)throw Object.assign(new Error('attempt-limit-reached'),{code:'attempt-limit-reached'});
        if(extraNeeded){const consumed=consumeExtraAttempts(key=>getSetting(db,key),(key,value)=>setSetting(db,key,value),name,POLICY_ID,extraNeeded,'수수께끼 추가 도전 사용');if(!consumed.ok)throw Object.assign(new Error(consumed.code),{code:consumed.code})}
        const awardXp=newAttempts>0&&(policy.xpMode==='every-attempt'||current.attempts===0),gained=awardXp?20+Math.floor(incoming.lastScore/10):0,now=new Date().toISOString();
        const nextTotal=Math.max(Number(current.total_score)||0,incoming.totalScore),nextBest=Math.max(Number(current.best_score)||0,incoming.bestScore),nextAttempts=Math.max(Number(current.attempts)||0,incoming.attempts),nextLast=newAttempts>0?incoming.lastScore:Number(current.last_score)||0;
        db.prepare('UPDATE players SET total_score=?,attempts=?,best_score=?,last_score=?,xp=xp+?,updated_at=? WHERE name=?').run(nextTotal,nextAttempts,nextBest,nextLast,gained,now,name);
        if(newAttempts>0)logActivity(db,name,`${incoming.lastScore}점${gained?` · +${gained}XP`:' · XP 추가 없음'}${extraNeeded?` · 추가 도전권 ${extraNeeded}회 사용`:''}${newAttempts>1?' · 레거시 묶음 기록':''}`);
        return{player:playerView(db.prepare('SELECT * FROM players WHERE name=?').get(name)),gainedXp:gained,extraAttemptsUsed:extraNeeded,extraAttemptsRemaining:Math.max(0,latestExtra-extraNeeded)};
      });
      const result=tx();res.json({ok:true,...result});
    }catch(err){const code=clean(err?.code||'riddle-record-save-failed',80);res.status(code==='attempt-limit-reached'||code==='record-changed'?409:500).json({ok:false,code,message:clean(err?.message||err,160)})}
    finally{try{db?.close()}catch{}}
  });
}
