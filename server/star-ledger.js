/* v1.16 star currency foundation.
   Preserves balance integrity and optimistic concurrency guards while supporting
   exploration discovery records and the three-part daily mission. */
import Database from 'better-sqlite3';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { installItemShopRoutes } from './item-shop.js';
import { installActivityAttemptStudentRoutes } from './activity-attempt-student.js';
import { standardActivityStars } from './reward-economy.js';
import { installRiddleAttemptStudentRoutes } from './riddle-attempt-student.js';
import { installStudentScoreHistoryRoutes } from './student-score-history.js';
import { installRestoreValidationMiddleware } from './restore-validation-middleware.js';
import { installMathPracticeRoutes, validateMathCompletion, finalizeMathCompletion } from './math-practice.js';

const __filename=fileURLToPath(import.meta.url),__dirname=path.dirname(__filename);
const MAX_STARS=1000000,MAX_MIRROR_ENTRIES=500;
const clean=(v,n=160)=>String(v??'').trim().slice(0,n);
const mirrorKey=name=>`compat:stars:${encodeURIComponent(clean(name,12))}`;
const validStarBalance=value=>Number.isSafeInteger(value)&&value>=0&&value<=MAX_STARS;

function openLiveDb(){
  const dataDir=process.env.STUDYVILLAGE_DATA_DIR||__dirname;
  const db=new Database(path.join(dataDir,'studyvillage.db'));
  db.pragma('busy_timeout = 3000');
  return db;
}
function ensureSchema(db){
  const columns=db.prepare('PRAGMA table_info(players)').all().map(r=>r.name);
  if(!columns.includes('stars'))db.exec('ALTER TABLE players ADD COLUMN stars INTEGER NOT NULL DEFAULT 0');
  db.exec(`
CREATE TABLE IF NOT EXISTS star_ledger (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_name TEXT NOT NULL,
  before_value INTEGER NOT NULL,
  after_value INTEGER NOT NULL,
  delta INTEGER NOT NULL,
  kind TEXT NOT NULL,
  reference_id TEXT,
  detail TEXT,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_star_ledger_player_id ON star_ledger(player_name,id DESC);
`);
}
function readMirror(db,name){
  const raw=db.prepare('SELECT value FROM settings WHERE key=?').get(mirrorKey(name))?.value;
  if(!raw)return null;
  try{
    const value=JSON.parse(raw),balance=Number(value?.balance),entries=Array.isArray(value?.entries)?value.entries:[];
    if(!Number.isInteger(balance)||balance<0||balance>MAX_STARS)return null;
    return{balance,entries:entries.slice(-MAX_MIRROR_ENTRIES).map(e=>({beforeValue:Number(e?.beforeValue)||0,afterValue:Number(e?.afterValue)||0,delta:Number(e?.delta)||0,kind:clean(e?.kind,60)||'legacy',referenceId:clean(e?.referenceId,100)||null,detail:clean(e?.detail,240)||null,createdAt:clean(e?.createdAt,80)}))};
  }catch{return null}
}
function liveSnapshot(db,name){
  const row=db.prepare('SELECT stars FROM players WHERE name=?').get(name);if(!row)return null;
  const entries=db.prepare(`SELECT before_value AS beforeValue,after_value AS afterValue,delta,kind,reference_id AS referenceId,detail,created_at AS createdAt FROM star_ledger WHERE player_name=? ORDER BY id ASC LIMIT ?`).all(name,MAX_MIRROR_ENTRIES);
  return{balance:row.stars,entries};
}
function normalized(value){return JSON.stringify({balance:Number(value?.balance)||0,entries:(value?.entries||[]).map(e=>({beforeValue:Number(e?.beforeValue)||0,afterValue:Number(e?.afterValue)||0,delta:Number(e?.delta)||0,kind:clean(e?.kind,60)||'legacy',referenceId:clean(e?.referenceId,100)||null,detail:clean(e?.detail,240)||null,createdAt:clean(e?.createdAt,80)}))})}
function writeMirror(db,name){
  const snap=liveSnapshot(db,name);if(!snap)return;
  if(!validStarBalance(snap.balance))throw new Error('corrupt-star-balance');
  db.prepare(`INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value`).run(mirrorKey(name),normalized(snap));
}
function recoverFromMirror(db,name){
  const mirror=readMirror(db,name);if(!mirror)return false;
  const live=liveSnapshot(db,name);if(!live)return false;
  if(validStarBalance(live.balance)&&normalized(live)===normalized(mirror))return false;
  const tx=db.transaction(()=>{
    db.prepare('UPDATE players SET stars=?,updated_at=? WHERE name=?').run(mirror.balance,new Date().toISOString(),name);
    db.prepare('DELETE FROM star_ledger WHERE player_name=?').run(name);
    const insert=db.prepare('INSERT INTO star_ledger(player_name,before_value,after_value,delta,kind,reference_id,detail,created_at) VALUES(?,?,?,?,?,?,?,?)');
    for(const e of mirror.entries)insert.run(name,e.beforeValue,e.afterValue,e.delta,e.kind,e.referenceId,e.detail,e.createdAt||new Date().toISOString());
  });
  tx();return true;
}

const EXPEDITION_REWARD_IDS=new Set(['exploration-forest-riddle','exploration-mountain-riddle','exploration-korean','exploration-math','exploration-social','exploration-science','exploration-random']),STANDARD_REWARD_IDS=new Set(['math-arithmetic','vocabulary','curriculum-korean','curriculum-math','curriculum-social','curriculum-science','curriculum-arts']);
function expeditionStarsFor(activityId,score){
  const value=Math.max(0,Math.min(100,Math.round(Number(score)||0)));
  if(activityId==='exploration-forest-riddle')return value>0?Math.min(2,Math.ceil(value/50)):0;
  if(activityId==='exploration-mountain-riddle'||activityId.startsWith('exploration-'))return value>0?Math.min(2,Math.ceil(value/50)):0;
  return 0;
}
function commitExpeditionReward(db,{name,activityId,score,submissionId,now,starDelta=0}){
  if(!EXPEDITION_REWARD_IDS.has(activityId)&&!STANDARD_REWARD_IDS.has(activityId))return{stars:0,balance:null};
  if(!/^[A-Za-z0-9._:-]{8,100}$/.test(submissionId||''))throw Object.assign(new Error('invalid-expedition-submission'),{code:'invalid-expedition-submission'});
  ensureSchema(db);
  const kind=EXPEDITION_REWARD_IDS.has(activityId)?'expedition-completion':'learning-completion',prior=db.prepare('SELECT after_value AS balance FROM star_ledger WHERE player_name=? AND kind=? AND reference_id=? LIMIT 1').get(name,kind,submissionId);
  if(prior)return{stars:0,balance:prior.balance,alreadyClaimed:true};
  const player=db.prepare('SELECT stars FROM players WHERE name=?').get(name);if(!player)throw Object.assign(new Error('player-not-found'),{code:'player-not-found'});
  if(!validStarBalance(player.stars))throw Object.assign(new Error('corrupt-star-balance'),{code:'corrupt-star-balance'});
  const baseStars=EXPEDITION_REWARD_IDS.has(activityId)?expeditionStarsFor(activityId,score):standardActivityStars(activityId,score),npcDelta=Math.max(-5,Math.min(8,Math.trunc(Number(starDelta)||0))),before=player.stars,stars=npcDelta<0?-Math.min(before,Math.abs(npcDelta)):baseStars+npcDelta,after=before+stars;
  if(after>MAX_STARS)throw Object.assign(new Error('star-limit-exceeded'),{code:'star-limit-exceeded'});
  if(stars){const updated=db.prepare('UPDATE players SET stars=?,updated_at=? WHERE name=? AND stars=?').run(after,now,name,before);if(updated.changes!==1)throw Object.assign(new Error('star-balance-changed'),{code:'star-balance-changed'});db.prepare('INSERT INTO star_ledger(player_name,before_value,after_value,delta,kind,reference_id,detail,created_at) VALUES(?,?,?,?,?,?,?,?)').run(name,before,after,stars,kind,submissionId,`${activityId} 정상 완료 · ${Math.round(Number(score)||0)}점`,now);writeMirror(db,name)}
  return{stars,balance:after,alreadyClaimed:false};
}
function riddleStarsFor(score){const value=Math.max(0,Math.min(1000,Math.round(Number(score)||0)));return value>=1000?3:value>=700?2:value>0?1:0}
function commitRiddleReward(db,{name,attempt,score,now}){
  ensureSchema(db);const referenceId=`riddle-demo:${Math.max(1,Number(attempt)||1)}`,prior=db.prepare("SELECT after_value AS balance FROM star_ledger WHERE player_name=? AND kind='riddle-completion' AND reference_id=? LIMIT 1").get(name,referenceId);
  if(prior)return{stars:0,balance:prior.balance,alreadyClaimed:true};
  const player=db.prepare('SELECT stars FROM players WHERE name=?').get(name);if(!player)throw Object.assign(new Error('player-not-found'),{code:'player-not-found'});if(!validStarBalance(player.stars))throw Object.assign(new Error('corrupt-star-balance'),{code:'corrupt-star-balance'});
  const stars=riddleStarsFor(score),before=player.stars,after=before+stars;if(after>MAX_STARS)throw Object.assign(new Error('star-limit-exceeded'),{code:'star-limit-exceeded'});
  if(stars){const updated=db.prepare('UPDATE players SET stars=?,updated_at=? WHERE name=? AND stars=?').run(after,now,name,before);if(updated.changes!==1)throw Object.assign(new Error('star-balance-changed'),{code:'star-balance-changed'});db.prepare('INSERT INTO star_ledger(player_name,before_value,after_value,delta,kind,reference_id,detail,created_at) VALUES(?,?,?,?,?,?,?,?)').run(name,before,after,stars,'riddle-completion',referenceId,`기본 수수께끼 정상 완료 · ${Math.round(Number(score)||0)}점`,now);writeMirror(db,name)}
  return{stars,balance:after,alreadyClaimed:false};
}

export function ensureStarLedger(){let db;try{db=openLiveDb();ensureSchema(db);return true}finally{try{db?.close()}catch{}}}
export function starBalanceFor(playerName){
  let db;try{db=openLiveDb();ensureSchema(db);const name=clean(playerName,12);recoverFromMirror(db,name);const row=db.prepare('SELECT stars FROM players WHERE name=?').get(name);if(!row)return null;if(!validStarBalance(row.stars))throw new Error('corrupt-star-balance');return row.stars}finally{try{db?.close()}catch{}}
}
export function starLedgerFor(playerName,{limit=100}={}){
  let db;try{db=openLiveDb();ensureSchema(db);const name=clean(playerName,12);recoverFromMirror(db,name);return db.prepare(`SELECT id,before_value AS beforeValue,after_value AS afterValue,delta,kind,reference_id AS referenceId,detail,created_at AS createdAt FROM star_ledger WHERE player_name=? ORDER BY id DESC LIMIT ?`).all(name,Math.max(1,Math.min(300,Number(limit)||100)))}finally{try{db?.close()}catch{}}
}
export function changeStars(playerName,delta,{kind='teacher-adjustment',referenceId='',detail=''}={}){
  const name=clean(playerName,12),change=Number(delta);if(!name||!Number.isInteger(change)||change===0||Math.abs(change)>MAX_STARS)return{ok:false,code:'invalid-star-change'};
  let db;
  try{
    db=openLiveDb();ensureSchema(db);recoverFromMirror(db,name);
    const tx=db.transaction(()=>{
      const player=db.prepare('SELECT stars FROM players WHERE name=?').get(name);if(!player)return{ok:false,code:'player-not-found'};
      if(!validStarBalance(player.stars))return{ok:false,code:'corrupt-star-balance'};
      const before=player.stars,after=before+change;if(after<0)return{ok:false,code:'insufficient-stars',balance:before};if(after>MAX_STARS)return{ok:false,code:'star-limit-exceeded',balance:before};
      const now=new Date().toISOString(),updated=db.prepare('UPDATE players SET stars=?,updated_at=? WHERE name=? AND stars=?').run(after,now,name,before);if(updated.changes!==1)return{ok:false,code:'star-balance-changed'};
      const result=db.prepare('INSERT INTO star_ledger(player_name,before_value,after_value,delta,kind,reference_id,detail,created_at) VALUES(?,?,?,?,?,?,?,?)').run(name,before,after,change,clean(kind,60),clean(referenceId,100)||null,clean(detail,240)||null,now);
      writeMirror(db,name);return{ok:true,id:Number(result.lastInsertRowid),beforeValue:before,afterValue:after,delta:change,createdAt:now};
    });
    return tx();
  }finally{try{db?.close()}catch{}}
}

const EXPLORATION_REWARDS=Object.freeze({chest:{stars:3,detail:'보물상자 발견'},tree:{stars:1,detail:'반짝 나무 관찰'},flower:{stars:2,detail:'숨은 꽃 피우기'}});
const COLLECTION_NPCS=new Set(['wizard','ghost','dragon','fox','robot','owl']),COLLECTION_EVENTS=new Set(Object.keys(EXPLORATION_REWARDS)),COLLECTION_LOCATIONS=new Set(['gymnasium','nurse-office','cafeteria','wee-class','class-3-1','teachers-office','playground','multipurpose-room','english-room']);
const collectionKey=name=>`exploration-collection:${encodeURIComponent(clean(name,12))}`;
function readCollection(db,name){const raw=db.prepare('SELECT value FROM settings WHERE key=?').get(collectionKey(name))?.value;try{const value=JSON.parse(raw||'{}');return{npcs:[...new Set((Array.isArray(value.npcs)?value.npcs:[]).filter(id=>COLLECTION_NPCS.has(id)))],events:[...new Set((Array.isArray(value.events)?value.events:[]).filter(id=>COLLECTION_EVENTS.has(id)))],locations:[...new Set((Array.isArray(value.locations)?value.locations:[]).filter(id=>COLLECTION_LOCATIONS.has(id)))]}}catch{return{npcs:[],events:[],locations:[]}}}
function addCollection(db,name,kind,id){const allowed=kind==='npc'?COLLECTION_NPCS:kind==='event'?COLLECTION_EVENTS:kind==='location'?COLLECTION_LOCATIONS:null;if(!allowed?.has(id))return{ok:false,code:'invalid-collection-entry'};const current=readCollection(db,name),key=kind==='npc'?'npcs':kind==='event'?'events':'locations',isNew=!current[key].includes(id);if(isNew)current[key].push(id);db.prepare('INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value').run(collectionKey(name),JSON.stringify(current));return{ok:true,isNew,collection:current}}
export function explorationCollectionFor(playerName){const name=clean(playerName,12);if(!name)return null;let db;try{db=openLiveDb();const player=db.prepare('SELECT stars FROM players WHERE name=?').get(name);if(!player)return null;return{ok:true,...readCollection(db,name),balance:player.stars}}finally{try{db?.close()}catch{}}}
export function recordExplorationCollection(playerName,kind,id){const name=clean(playerName,12),safeKind=clean(kind,12),safeId=clean(id,30);if(!name)return{ok:false,code:'invalid-player'};let db;try{db=openLiveDb();if(!db.prepare('SELECT 1 FROM players WHERE name=?').get(name))return{ok:false,code:'player-not-found'};return addCollection(db,name,safeKind,safeId)}finally{try{db?.close()}catch{}}}
export function classroomExplorationCollections(){let db;try{db=openLiveDb();return db.prepare('SELECT name FROM players ORDER BY name COLLATE NOCASE').all().map(({name})=>({name,...readCollection(db,name)}))}finally{try{db?.close()}catch{}}}

const DAILY_MISSIONS=Object.freeze([
  {id:'bookmaru',activityIds:['vocabulary'],icon:'📚',title:'책마루 완료',detail:'책마루 활동을 1회 완료해요.'},
  {id:'math',activityIds:['math-arithmetic'],icon:'➕',title:'수학 놀이터 완료',detail:'수학 놀이터에서 랜덤 복습을 1회 완료해요.'},
  {id:'exploration',activityIds:['exploration-korean','exploration-math','exploration-social','exploration-science','exploration-random'],icon:'🗺️',title:'탐험 완료',detail:'탐험 동굴에서 원하는 탐험을 1회 완료해요.'}
]);
const DAILY_REWARD=2;
const classroomDay=()=>new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Seoul'});
function kstDay(value){const date=new Date(value);return Number.isNaN(date.getTime())?'':date.toLocaleDateString('en-CA',{timeZone:'Asia/Seoul'})}
function missionProgress(db,name,day){
  return DAILY_MISSIONS.map(mission=>{
    const placeholders=mission.activityIds.map(()=>'?').join(',');
    const rows=db.prepare(`SELECT activity_id AS activityId,updated_at AS updatedAt FROM activity_records WHERE player_name=? AND activity_id IN (${placeholders})`).all(name,...mission.activityIds);
    return{...mission,complete:rows.some(row=>kstDay(row.updatedAt)===day)};
  });
}
function dailyMissionStatusFromDb(db,name,player,day=classroomDay()){
  const missions=missionProgress(db,name,day),completed=missions.filter(m=>m.complete).length,complete=completed===missions.length,referenceId=`daily-mission:${day}`,claimed=!!db.prepare("SELECT 1 FROM star_ledger WHERE player_name=? AND kind='daily-mission' AND reference_id=? LIMIT 1").get(name,referenceId);
  return{ok:true,day,missions,completed,total:missions.length,complete,claimed,rewardStars:DAILY_REWARD,balance:player.stars};
}
export function dailyMissionStatus(playerName){
  const name=clean(playerName,12);if(!name)return null;let db;
  try{db=openLiveDb();ensureSchema(db);recoverFromMirror(db,name);const player=db.prepare('SELECT stars FROM players WHERE name=?').get(name);if(!player)return null;if(!validStarBalance(player.stars))throw new Error('corrupt-star-balance');return dailyMissionStatusFromDb(db,name,player)}finally{try{db?.close()}catch{}}
}
export function claimDailyMission(playerName){
  const name=clean(playerName,12);if(!name)return{ok:false,code:'invalid-player'};let db;
  try{
    db=openLiveDb();ensureSchema(db);recoverFromMirror(db,name);const day=classroomDay(),referenceId=`daily-mission:${day}`;
    const tx=db.transaction(()=>{
      const player=db.prepare('SELECT stars FROM players WHERE name=?').get(name);if(!player)return{ok:false,code:'player-not-found'};if(!validStarBalance(player.stars))return{ok:false,code:'corrupt-star-balance'};
      const prior=db.prepare("SELECT after_value AS balance FROM star_ledger WHERE player_name=? AND kind='daily-mission' AND reference_id=? LIMIT 1").get(name,referenceId);
      const missions=missionProgress(db,name,day),completed=missions.filter(m=>m.complete).length;
      if(prior)return{ok:true,alreadyClaimed:true,day,missions,completed,total:missions.length,complete:completed===missions.length,claimed:true,rewardStars:DAILY_REWARD,stars:0,balance:prior.balance};
      if(completed!==missions.length)return{ok:false,code:'mission-not-complete',day,missions,completed,total:missions.length,complete:false,claimed:false,rewardStars:DAILY_REWARD,balance:player.stars};
      const before=player.stars,after=before+DAILY_REWARD;if(after>MAX_STARS)return{ok:false,code:'star-limit-exceeded',balance:before};
      const now=new Date().toISOString(),updated=db.prepare('UPDATE players SET stars=?,updated_at=? WHERE name=? AND stars=?').run(after,now,name,before);if(updated.changes!==1)return{ok:false,code:'star-balance-changed'};
      db.prepare('INSERT INTO star_ledger(player_name,before_value,after_value,delta,kind,reference_id,detail,created_at) VALUES(?,?,?,?,?,?,?,?)').run(name,before,after,DAILY_REWARD,'daily-mission',referenceId,'오늘의 의뢰 3개 모두 완료',now);
      writeMirror(db,name);return{ok:true,alreadyClaimed:false,day,missions,completed,total:missions.length,complete:true,claimed:true,rewardStars:DAILY_REWARD,stars:DAILY_REWARD,balance:after,createdAt:now};
    });
    return tx();
  }finally{try{db?.close()}catch{}}
}

export function claimExplorationReward(playerName,eventType){
  const name=clean(playerName,12),type=clean(eventType,20),reward=EXPLORATION_REWARDS[type];
  if(!name||!reward)return{ok:false,code:'invalid-exploration-event'};
  let db;try{db=openLiveDb();ensureSchema(db);recoverFromMirror(db,name);const day=classroomDay(),referenceId=`${type}:${day}`;
    const tx=db.transaction(()=>{const player=db.prepare('SELECT stars FROM players WHERE name=?').get(name);if(!player)return{ok:false,code:'player-not-found'};if(!validStarBalance(player.stars))return{ok:false,code:'corrupt-star-balance'};const prior=db.prepare("SELECT after_value AS balance FROM star_ledger WHERE player_name=? AND kind='exploration-event' AND reference_id=? LIMIT 1").get(name,referenceId);if(prior){addCollection(db,name,'event',type);return{ok:true,alreadyClaimed:true,eventType:type,stars:0,balance:prior.balance}}const before=player.stars,after=before+reward.stars;if(after>MAX_STARS)return{ok:false,code:'star-limit-exceeded',balance:before};const now=new Date().toISOString(),updated=db.prepare('UPDATE players SET stars=?,updated_at=? WHERE name=? AND stars=?').run(after,now,name,before);if(updated.changes!==1)return{ok:false,code:'star-balance-changed'};db.prepare('INSERT INTO star_ledger(player_name,before_value,after_value,delta,kind,reference_id,detail,created_at) VALUES(?,?,?,?,?,?,?,?)').run(name,before,after,reward.stars,'exploration-event',referenceId,reward.detail,now);addCollection(db,name,'event',type);writeMirror(db,name);return{ok:true,alreadyClaimed:false,eventType:type,stars:reward.stars,balance:after,createdAt:now}});return tx();
  }finally{try{db?.close()}catch{}}
}

export function installStarLedgerRoutes(app,{requireSession,requireAdmin,publishLiveEvent}){
  ensureStarLedger();
  installRestoreValidationMiddleware(app,{requireAdmin});
  installStudentScoreHistoryRoutes(app,{requireSession});
  app.post('/api/login',(req,res,next)=>{
    const name=String(req.body?.name??'').trim().replace(/\s+/g,' ');
    if(name.length>12)return res.status(400).json({ok:false,code:'invalid-input'});
    next();
  });
  app.post('/api/player/me/record',(req,res,next)=>{
    const clamp=(v,min,max)=>Math.max(min,Math.min(max,Number(v)||0));
    const totalScore=clamp(req.body?.totalScore,0,100000000),attempts=clamp(req.body?.attempts,0,1000000),bestScore=clamp(req.body?.bestScore,0,1000),lastScore=clamp(req.body?.lastScore,0,1000);
    const invalid=attempts===0&&(totalScore!==0||bestScore!==0||lastScore!==0)||attempts>0&&(bestScore<lastScore||totalScore<bestScore||totalScore>attempts*1000);
    if(invalid)return res.status(400).json({ok:false,code:'invalid-record-relationship'});
    next();
  });
  app.get('/api/player/me/stars',requireSession,(req,res)=>{
    try{const balance=starBalanceFor(req.session.name),entries=starLedgerFor(req.session.name,{limit:req.query.limit});if(balance===null)return res.status(404).json({ok:false,code:'player-not-found'});res.json({ok:true,balance,entries})}
    catch(err){res.status(500).json({ok:false,code:'star-ledger-read-failed',message:clean(err?.message||err,160)})}
  });
  app.post('/api/player/me/exploration-event',requireSession,(req,res)=>{try{const result=claimExplorationReward(req.session.name,req.body?.eventType);if(!result.ok)return res.status(result.code==='player-not-found'?404:400).json(result);res.json(result)}catch(err){res.status(500).json({ok:false,code:'exploration-event-failed',message:clean(err?.message||err,160)})}});
  app.get('/api/player/me/exploration-collection',requireSession,(req,res)=>{try{const result=explorationCollectionFor(req.session.name);if(!result)return res.status(404).json({ok:false,code:'player-not-found'});res.json(result)}catch(err){res.status(500).json({ok:false,code:'exploration-collection-read-failed',message:clean(err?.message||err,160)})}});
  app.post('/api/player/me/exploration-collection',requireSession,(req,res)=>{try{const result=recordExplorationCollection(req.session.name,req.body?.kind,req.body?.id);if(!result.ok)return res.status(result.code==='player-not-found'?404:400).json(result);res.json(result)}catch(err){res.status(500).json({ok:false,code:'exploration-collection-write-failed',message:clean(err?.message||err,160)})}});
  app.post('/api/player/me/exploration-collection/milestone',requireSession,(_req,res)=>res.status(410).json({ok:false,code:'collection-milestone-retired'}));
  app.get('/api/admin/exploration-collections',requireAdmin,(_req,res)=>{try{res.json({ok:true,students:classroomExplorationCollections()})}catch(err){res.status(500).json({ok:false,code:'exploration-collections-read-failed',message:clean(err?.message||err,160)})}});
  app.get('/api/player/me/daily-mission',requireSession,(req,res)=>{try{const result=dailyMissionStatus(req.session.name);if(!result)return res.status(404).json({ok:false,code:'player-not-found'});res.json(result)}catch(err){res.status(500).json({ok:false,code:'daily-mission-read-failed',message:clean(err?.message||err,160)})}});
  app.post('/api/player/me/daily-mission/claim',requireSession,(req,res)=>{try{const result=claimDailyMission(req.session.name);if(!result.ok)return res.status(result.code==='player-not-found'?404:409).json(result);res.json(result)}catch(err){res.status(500).json({ok:false,code:'daily-mission-claim-failed',message:clean(err?.message||err,160)})}});
  installRiddleAttemptStudentRoutes(app,{requireSession,publishLiveEvent,commitRiddleReward});
  installMathPracticeRoutes(app,{requireSession});
  installActivityAttemptStudentRoutes(app,{requireSession,commitExpeditionReward,validateActivityCompletion:validateMathCompletion,finalizeActivityCompletion:finalizeMathCompletion});
  installItemShopRoutes(app,{requireSession,requireAdmin,publishLiveEvent});
}
