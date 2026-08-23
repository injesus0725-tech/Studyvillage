/* v2.0 student activity save enforcement + detailed classroom ranking. */
import Database from 'better-sqlite3';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { evaluateAttempt } from './activity-attempt-policy.js';
import { readActivityAttemptPolicies } from './activity-attempt-settings.js';
import { readExtraAttempts, consumeExtraAttempts } from './activity-attempt-exceptions.js';
import { activityXpReward } from './reward-economy.js';

const __filename=fileURLToPath(import.meta.url),__dirname=path.dirname(__filename);
const clean=(v,n=80)=>String(v??'').trim().slice(0,n);
const POLICY_ALIASES={vocabulary:'library-vocabulary',riddle:'riddle-demo'};
const SUBMISSION_TTL_MS=30*60*1000,MAX_RECENT_SUBMISSIONS=1000,recentSubmissions=new Map();
function openDb(){const dataDir=process.env.STUDYVILLAGE_DATA_DIR||__dirname,db=new Database(path.join(dataDir,'studyvillage.db'));db.pragma('busy_timeout = 3000');return db}
function getSetting(db,key){return db.prepare('SELECT value FROM settings WHERE key=?').get(key)?.value||null}
function setSetting(db,key,value){db.prepare('INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value').run(key,String(value))}
function logActivity(db,name,type,detail=''){db.prepare('INSERT INTO activity_log(player_name,type,detail,created_at) VALUES(?,?,?,?)').run(name,type,detail,new Date().toISOString())}
const xpForLevel=level=>{const n=Math.max(0,(Number(level)||1)-1);return 200*n+25*n*(n-1)};
function levelFromXp(xp){const value=Math.max(0,Number(xp)||0);let level=1;while(value>=xpForLevel(level+1))level++;return level}
function titleForLevel(level){if(level>=50)return'전설의 학습가';if(level>=40)return'마을 수호자';if(level>=30)return'별빛 연구자';if(level>=20)return'지혜의 길잡이';if(level>=10)return'숲길 개척자';if(level>=5)return'학습 탐험가';if(level>=3)return'성장하는 도전자';if(level>=2)return'배움 여행자';return'새싹 주민'}
function equipmentFor(row){const out={hat:null,glasses:null,bag:null,pet:null};try{const raw=JSON.parse(row.equipment_json||'{}');for(const slot of Object.keys(out))if(typeof raw?.[slot]==='string'&&raw[slot])out[slot]=raw[slot]}catch{}return out}
function detailedRanking(db){
  const activity=db.prepare('SELECT COALESCE(SUM(attempts),0) AS attempts,COALESCE(MAX(best_score),0) AS bestScore,COALESCE(SUM(total_score),0) AS totalScore FROM activity_records WHERE player_name=?');
  return db.prepare('SELECT * FROM players ORDER BY xp DESC,name ASC').all().map(row=>{const extra=activity.get(row.name)||{},xp=Math.max(0,Number(row.xp)||0),level=levelFromXp(xp),baseAttempts=Math.max(0,Number(row.attempts)||0),baseBest=Math.max(0,Number(row.best_score)||0),baseTotal=Math.max(0,Number(row.total_score)||0);return{name:row.name,xp,level,title:titleForLevel(level),baseCharacter:row.base_character||'student-default',equipment:equipmentFor(row),attempts:baseAttempts+Math.max(0,Number(extra.attempts)||0),bestScore:Math.max(baseBest,Math.max(0,Number(extra.bestScore)||0)),totalScore:baseTotal+Math.max(0,Number(extra.totalScore)||0)}})
}
function classroomDayRange(now=new Date()){
  const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now),value=type=>parts.find(part=>part.type===type)?.value;
  const start=new Date(`${value('year')}-${value('month')}-${value('day')}T00:00:00+09:00`),end=new Date(start.getTime()+86400000);
  return{day:`${value('year')}-${value('month')}-${value('day')}`,start:start.toISOString(),end:end.toISOString()}
}
function dailyAttempts(db,name,activityId,range=classroomDayRange()){return Number(db.prepare('SELECT COUNT(*) AS count FROM activity_log WHERE player_name=? AND type=? AND created_at>=? AND created_at<?').get(name,`activity-${activityId}`,range.start,range.end)?.count)||0}
function policyIdFor(activityId,policies){const alias=POLICY_ALIASES[activityId];return alias&&policies[alias]?alias:activityId}
function policyRecord(db,name,activityId,policy,record){return policy?.period==='daily'?{...record,attempts:dailyAttempts(db,name,activityId)}:record}
function evaluateWithExtra(policy,record,extraAttempts){const base=evaluateAttempt(policy,record),extra=Math.max(0,Number(extraAttempts)||0),allowed=base.allowed||extra>0,usingExtra=!base.allowed&&extra>0,remaining=base.remaining===null?null:base.remaining+extra,awardXp=base.allowed?base.awardXp:(usingExtra&&base.policy.xpMode==='every-attempt');return{...base,allowed,usingExtra,extraAttempts:extra,remaining,awardXp}}
function submissionIdOf(value){const id=clean(value,100);return /^[A-Za-z0-9._:-]{8,100}$/.test(id)?id:''}
function validExpeditionScore(activityId,score){if(activityId==='exploration-forest-riddle')return[0,20,40,60,80,100].includes(score);if(activityId==='exploration-mountain-riddle')return[0,14,29,43,57,71,86,100].includes(score);return true}
function pruneRecentSubmissions(now=Date.now()){for(const [key,row] of recentSubmissions){if(now-row.savedAt>SUBMISSION_TTL_MS)recentSubmissions.delete(key)}while(recentSubmissions.size>MAX_RECENT_SUBMISSIONS)recentSubmissions.delete(recentSubmissions.keys().next().value)}
function cachedSubmission(name,activityId,submissionId){if(!submissionId)return null;pruneRecentSubmissions();return recentSubmissions.get(`${name}\u0000${activityId}\u0000${submissionId}`)?.result||null}
function rememberSubmission(name,activityId,submissionId,result){if(!submissionId)return;recentSubmissions.set(`${name}\u0000${activityId}\u0000${submissionId}`,{savedAt:Date.now(),result});pruneRecentSubmissions()}

export function installActivityAttemptStudentRoutes(app,{requireSession,commitExpeditionReward=()=>({stars:0,balance:null}),validateActivityCompletion=()=>({ok:true}),finalizeActivityCompletion=()=>{}}){
  /* Installed before the legacy /api/ranking route, so every ranking tab receives real aggregate metrics. */
  app.get('/api/ranking',requireSession,(_req,res)=>{let db;try{db=openDb();res.json({ok:true,players:detailedRanking(db)})}catch(err){res.status(500).json({ok:false,code:'ranking-read-failed',message:clean(err?.message||err,160)})}finally{try{db?.close()}catch{}}});
  app.get('/api/player/me/activity-attempt-status/:activityId',requireSession,(req,res)=>{const activityId=clean(req.params?.activityId,40);if(!/^[a-z0-9-]+$/.test(activityId))return res.status(400).json({ok:false,code:'invalid-activity'});let db;try{db=openDb();const name=req.session.name,player=db.prepare('SELECT 1 FROM players WHERE name=?').get(name);if(!player)return res.status(404).json({ok:false,code:'player-not-found'});const policies=readActivityAttemptPolicies(key=>getSetting(db,key)),policyId=policyIdFor(activityId,policies),policy=policies[policyId]||{},record=db.prepare('SELECT attempts,best_score AS bestScore,last_score AS lastScore,total_score AS totalScore,updated_at AS updatedAt FROM activity_records WHERE player_name=? AND activity_id=?').get(name,activityId)||{},attemptRecord=policyRecord(db,name,activityId,policy,record),extra=readExtraAttempts(key=>getSetting(db,key),name,policyId),decision=evaluateWithExtra(policy,attemptRecord,extra),range=policy?.period==='daily'?classroomDayRange():null;res.json({ok:true,activityId,policyId,allowed:decision.allowed,remaining:decision.remaining,extraAttempts:extra,policy:{...decision.policy,period:policy?.period||'all-time'},resetAt:range?.end||null,record:{attempts:Number(record.attempts)||0,periodAttempts:Number(attemptRecord.attempts)||0,bestScore:Number(record.bestScore)||0,lastScore:Number(record.lastScore)||0,totalScore:Number(record.totalScore)||0,updatedAt:record.updatedAt||null}})}catch(err){res.status(500).json({ok:false,code:'activity-attempt-status-failed',message:clean(err?.message||err,160)})}finally{try{db?.close()}catch{}}});
  app.post('/api/player/me/activity',requireSession,(req,res)=>{
    const activityId=clean(req.body?.activityId,40),score=Math.max(0,Math.min(1000,Number(req.body?.score)||0)),submissionId=submissionIdOf(req.body?.submissionId);
    if(!/^[a-z0-9-]+$/.test(activityId))return res.status(400).json({ok:false,code:'invalid-activity'});
    if(!validExpeditionScore(activityId,score)||activityId.startsWith('exploration-')&&!submissionId)return res.status(400).json({ok:false,code:'invalid-expedition-completion'});
    const name=req.session.name,cached=cachedSubmission(name,activityId,submissionId);if(cached)return res.json({...cached,deduplicated:true});
    const verified=validateActivityCompletion({name,activityId,score,submissionId});if(!verified?.ok)return res.status(400).json({ok:false,code:verified?.code||'unverified-activity-completion'});
    let db;try{
      db=openDb();const player=db.prepare('SELECT * FROM players WHERE name=?').get(name);if(!player)return res.status(404).json({ok:false});
      const policies=readActivityAttemptPolicies(key=>getSetting(db,key)),policyId=policyIdFor(activityId,policies),policy=policies[policyId]||{},existing=db.prepare('SELECT * FROM activity_records WHERE player_name=? AND activity_id=?').get(name,activityId),attemptRecord=policyRecord(db,name,activityId,policy,existing||{}),extra=readExtraAttempts(key=>getSetting(db,key),name,policyId),decision=evaluateWithExtra(policy,attemptRecord,extra);if(!decision.allowed)return res.status(409).json({ok:false,code:'attempt-limit-reached',activityId,policyId,attempts:decision.attempts,remaining:decision.remaining,extraAttempts:decision.extraAttempts,policy:decision.policy});
      const now=new Date().toISOString(),baseXp=activityXpReward(activityId,score),tx=db.transaction(()=>{
        const latestPolicies=readActivityAttemptPolicies(key=>getSetting(db,key)),latestPolicyId=policyIdFor(activityId,latestPolicies),latestPolicy=latestPolicies[latestPolicyId]||{},latest=db.prepare('SELECT * FROM activity_records WHERE player_name=? AND activity_id=?').get(name,activityId),latestAttemptRecord=policyRecord(db,name,activityId,latestPolicy,latest||{}),latestExtra=readExtraAttempts(key=>getSetting(db,key),name,latestPolicyId),latestDecision=evaluateWithExtra(latestPolicy,latestAttemptRecord,latestExtra);if(!latestDecision.allowed)return{ok:false,code:'attempt-limit-reached',activityId,policyId:latestPolicyId,attempts:latestDecision.attempts,remaining:latestDecision.remaining,extraAttempts:latestDecision.extraAttempts,policy:latestDecision.policy};
        const nextAttempts=(latest?.attempts||0)+1,nextBest=Math.max(latest?.best_score||0,score),nextTotal=(latest?.total_score||0)+score,nextGained=latestDecision.awardXp?baseXp:0;
        db.prepare(`INSERT INTO activity_records(player_name,activity_id,attempts,best_score,last_score,total_score,updated_at) VALUES(?,?,?,?,?,?,?) ON CONFLICT(player_name,activity_id) DO UPDATE SET attempts=excluded.attempts,best_score=excluded.best_score,last_score=excluded.last_score,total_score=excluded.total_score,updated_at=excluded.updated_at`).run(name,activityId,nextAttempts,nextBest,score,nextTotal,now);
        if(latestDecision.usingExtra){const consumed=consumeExtraAttempts(key=>getSetting(db,key),(key,value)=>setSetting(db,key,value),name,latestPolicyId,1,`${activityId} 활동 추가 도전 사용`);if(!consumed.ok)throw Object.assign(new Error(consumed.code),{code:consumed.code})}
        if(nextGained)db.prepare('UPDATE players SET xp=xp+?,updated_at=? WHERE name=?').run(nextGained,now,name);else db.prepare('UPDATE players SET updated_at=? WHERE name=?').run(now,name);
        const expeditionReward=commitExpeditionReward(db,{name,activityId,score,submissionId,now});logActivity(db,name,`activity-${activityId}`,`${score}점${nextGained?` · +${nextGained}XP`:' · XP 추가 없음'}${expeditionReward.stars?` · 탐험 별 +${expeditionReward.stars}`:''}${latestDecision.usingExtra?' · 추가 도전권 1회 사용':''}`);
        return{ok:true,gainedXp:nextGained,activityStars:expeditionReward.stars,expeditionStars:expeditionReward.stars,starBalance:expeditionReward.balance,rewardDeduplicated:expeditionReward.alreadyClaimed===true,usedExtraAttempt:latestDecision.usingExtra,extraAttempts:latestDecision.usingExtra?latestExtra-1:latestExtra,record:{activityId,attempts:nextAttempts,periodAttempts:(Number(latestAttemptRecord.attempts)||0)+1,bestScore:nextBest,lastScore:score,totalScore:nextTotal,updatedAt:now},policyId:latestPolicyId,policy:{...latestDecision.policy,period:latestPolicy?.period||'all-time'}}
      });
      const result=tx();if(!result.ok)return res.status(409).json(result);rememberSubmission(name,activityId,submissionId,result);finalizeActivityCompletion({name,activityId,score,submissionId});res.json(result)
    }catch(err){res.status(500).json({ok:false,code:err?.code||'activity-save-failed',message:clean(err?.message||err,160)})}finally{try{db?.close()}catch{}}
  });
}
