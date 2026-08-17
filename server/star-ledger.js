/* v1.15 star currency foundation.
   Creates a separate spendable star balance and immutable ledger.
   Star state is mirrored into settings so existing backups preserve it without changing the backup format.
   On read/change after restore, the live star column/table is reconciled from that backed-up mirror.
   Item shop student and teacher routes are installed here with their matching auth guards. */
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

const EXPEDITION_REWARD_IDS=new Set(['exploration-forest-riddle','exploration-mountain-riddle']),STANDARD_REWARD_IDS=new Set(['math-arithmetic','vocabulary']);
function expeditionStarsFor(activityId,score){
  const value=Math.max(0,Math.min(100,Math.round(Number(score)||0)));
  if(activityId==='exploration-forest-riddle')return Math.min(3,Math.ceil(value/40));
  if(activityId==='exploration-mountain-riddle')return value===100?5:Math.min(4,Math.ceil(value/25));
  return 0;
}
function commitExpeditionReward(db,{name,activityId,score,submissionId,now}){
  if(!EXPEDITION_REWARD_IDS.has(activityId)&&!STANDARD_REWARD_IDS.has(activityId))return{stars:0,balance:null};
  if(!/^[A-Za-z0-9._:-]{8,100}$/.test(submissionId||''))throw Object.assign(new Error('invalid-expedition-submission'),{code:'invalid-expedition-submission'});
  ensureSchema(db);
  const kind=EXPEDITION_REWARD_IDS.has(activityId)?'expedition-completion':'learning-completion',prior=db.prepare('SELECT after_value AS balance FROM star_ledger WHERE player_name=? AND kind=? AND reference_id=? LIMIT 1').get(name,kind,submissionId);
  if(prior)return{stars:0,balance:prior.balance,alreadyClaimed:true};
  const player=db.prepare('SELECT stars FROM players WHERE name=?').get(name);if(!player)throw Object.assign(new Error('player-not-found'),{code:'player-not-found'});
  if(!validStarBalance(player.stars))throw Object.assign(new Error('corrupt-star-balance'),{code:'corrupt-star-balance'});
  const stars=EXPEDITION_REWARD_IDS.has(activityId)?expeditionStarsFor(activityId,score):standardActivityStars(activityId,score),before=player.stars,after=before+stars;
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
const COLLECTION_NPCS=new Set(['wizard','ghost','dragon','fox','robot','owl']),COLLECTION_EVENTS=new Set(Object.keys(EXPLORATION_REWARDS));
const COLLECTION_MILESTONES=Object.freeze({
  'npc-three':{title:'마을 친구 3명 만나기',stars:3,complete:collection=>collection.npcs.length>=3},
  'event-all':{title:'탐험 발견물 3종 모으기',stars:5,complete:collection=>collection.events.length>=3},
  'collection-complete':{title:'탐험 도감 전체 완성',stars:10,complete:collection=>collection.npcs.length>=6&&collection.events.length>=3}
});
const collectionKey=name=>`exploration-collection:${encodeURIComponent(clean(name,12))}`;
function readCollection(db,name){const raw=db.prepare('SELECT value FROM settings WHERE key=?').get(collectionKey(name))?.value;try{const value=JSON.parse(raw||'{}');return{npcs:[...new Set((Array.isArray(value.npcs)?value.npcs:[]).filter(id=>COLLECTION_NPCS.has(id)))],events:[...new Set((Array.isArray(value.events)?value.events:[]).filter(id=>COLLECTION_EVENTS.has(id)))]}}catch{return{npcs:[],events:[]}}}
function addCollection(db,name,kind,id){const allowed=kind==='npc'?COLLECTION_NPCS:kind==='event'?COLLECTION_EVENTS:null;if(!allowed?.has(id))return{ok:false,code:'invalid-collection-entry'};const current=readCollection(db,name),key=kind==='npc'?'npcs':'events',isNew=!current[key].includes(id);if(isNew)current[key].push(id);db.prepare('INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value').run(collectionKey(name),JSON.stringify(current));return{ok:true,isNew,collection:current}}
function collectionMilestones(db,name,collection){return Object.entries(COLLECTION_MILESTONES).map(([id,milestone])=>({id,title:milestone.title,stars:milestone.stars,complete:milestone.complete(collection),claimed:!!db.prepare("SELECT 1 FROM star_ledger WHERE player_name=? AND kind='collection-milestone' AND reference_id=? LIMIT 1").get(name,id)}))}
export function explorationCollectionFor(playerName){const name=clean(playerName,12);if(!name)return null;let db;try{db=openLiveDb();const player=db.prepare('SELECT stars FROM players WHERE name=?').get(name);if(!player)return null;const collection=readCollection(db,name);return{ok:true,...collection,milestones:collectionMilestones(db,name,collection),balance:player.stars}}finally{try{db?.close()}catch{}}}
export function recordExplorationCollection(playerName,kind,id){const name=clean(playerName,12),safeKind=clean(kind,12),safeId=clean(id,30);if(!name)return{ok:false,code:'invalid-player'};let db;try{db=openLiveDb();if(!db.prepare('SELECT 1 FROM players WHERE name=?').get(name))return{ok:false,code:'player-not-found'};return addCollection(db,name,safeKind,safeId)}finally{try{db?.close()}catch{}}}
export function claimCollectionMilestone(playerName,milestoneId){const name=clean(playerName,12),id=clean(milestoneId,40),milestone=COLLECTION_MILESTONES[id];if(!name||!milestone)return{ok:false,code:'invalid-collection-milestone'};let db;try{db=openLiveDb();ensureSchema(db);recoverFromMirror(db,name);const tx=db.transaction(()=>{const player=db.prepare('SELECT stars FROM players WHERE name=?').get(name);if(!player)return{ok:false,code:'player-not-found'};if(!validStarBalance(player.stars))return{ok:false,code:'corrupt-star-balance'};const prior=db.prepare("SELECT after_value AS balance FROM star_ledger WHERE player_name=? AND kind='collection-milestone' AND reference_id=? LIMIT 1").get(name,id);if(prior)return{ok:true,alreadyClaimed:true,milestoneId:id,stars:0,balance:prior.balance};const collection=readCollection(db,name);if(!milestone.complete(collection))return{ok:false,code:'collection-milestone-incomplete',milestoneId:id,balance:player.stars};const before=player.stars,after=before+milestone.stars;if(after>MAX_STARS)return{ok:false,code:'star-limit-exceeded',balance:before};const now=new Date().toISOString(),updated=db.prepare('UPDATE players SET stars=?,updated_at=? WHERE name=? AND stars=?').run(after,now,name,before);if(updated.changes!==1)return{ok:false,code:'star-balance-changed'};db.prepare('INSERT INTO star_ledger(player_name,before_value,after_value,delta,kind,reference_id,detail,created_at) VALUES(?,?,?,?,?,?,?,?)').run(name,before,after,milestone.stars,'collection-milestone',id,`탐험 도감 · ${milestone.title}`,now);writeMirror(db,name);return{ok:true,alreadyClaimed:false,milestoneId:id,stars:milestone.stars,balance:after,createdAt:now}});return tx()}finally{try{db?.close()}catch{}}}
export function classroomExplorationCollections(){let db;try{db=openLiveDb();return db.prepare('SELECT name FROM players ORDER BY name COLLATE NOCASE').all().map(({name})=>({name,...readCollection(db,name)}))}finally{try{db?.close()}catch{}}}
const DAILY_MISSIONS=Object.freeze([
  {id:'bookmaru',activityId:'vocabulary',giver:'책방 유령',icon:'📚',title:'일일 책마루 도전',detail:'책마루의 오늘 문제 5개를 완료해요.',stars:3}
]);
const classroomDay=()=>new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Seoul'});
function dailyMissionFor(_name){const day=classroomDay();return{...DAILY_MISSIONS[0],day}}
function kstDay(value){const date=new Date(value);return Number.isNaN(date.getTime())?'':date.toLocaleDateString('en-CA',{timeZone:'Asia/Seoul'})}
export function dailyMissionStatus(playerName){const name=clean(playerName,12);if(!name)return null;let db;try{db=openLiveDb();ensureSchema(db);recoverFromMirror(db,name);const player=db.prepare('SELECT stars FROM players WHERE name=?').get(name);if(!player)return null;const mission=dailyMissionFor(name),record=db.prepare('SELECT updated_at AS updatedAt FROM activity_records WHERE player_name=? AND activity_id=?').get(name,mission.activityId),complete=kstDay(record?.updatedAt)===mission.day,referenceId=`daily-mission:${mission.day}`,claimed=!!db.prepare("SELECT 1 FROM star_ledger WHERE player_name=? AND kind='daily-mission' AND reference_id=? LIMIT 1").get(name,referenceId);return{ok:true,mission,complete,claimed,balance:player.stars}}finally{try{db?.close()}catch{}}}
export function claimDailyMission(playerName){const name=clean(playerName,12);if(!name)return{ok:false,code:'invalid-player'};let db;try{db=openLiveDb();ensureSchema(db);recoverFromMirror(db,name);const mission=dailyMissionFor(name),referenceId=`daily-mission:${mission.day}`;const tx=db.transaction(()=>{const player=db.prepare('SELECT stars FROM players WHERE name=?').get(name);if(!player)return{ok:false,code:'player-not-found'};if(!validStarBalance(player.stars))return{ok:false,code:'corrupt-star-balance'};const prior=db.prepare("SELECT after_value AS balance FROM star_ledger WHERE player_name=? AND kind='daily-mission' AND reference_id=? LIMIT 1").get(name,referenceId);if(prior)return{ok:true,alreadyClaimed:true,mission,stars:0,balance:prior.balance};const record=db.prepare('SELECT updated_at AS updatedAt FROM activity_records WHERE player_name=? AND activity_id=?').get(name,mission.activityId);if(kstDay(record?.updatedAt)!==mission.day)return{ok:false,code:'mission-not-complete',mission,balance:player.stars};const before=player.stars,after=before+mission.stars;if(after>MAX_STARS)return{ok:false,code:'star-limit-exceeded',balance:before};const now=new Date().toISOString(),updated=db.prepare('UPDATE players SET stars=?,updated_at=? WHERE name=? AND stars=?').run(after,now,name,before);if(updated.changes!==1)return{ok:false,code:'star-balance-changed'};db.prepare('INSERT INTO star_ledger(player_name,before_value,after_value,delta,kind,reference_id,detail,created_at) VALUES(?,?,?,?,?,?,?,?)').run(name,before,after,mission.stars,'daily-mission',referenceId,`${mission.giver} 의뢰 · ${mission.title}`,now);writeMirror(db,name);return{ok:true,alreadyClaimed:false,mission,stars:mission.stars,balance:after,createdAt:now}});return tx()}finally{try{db?.close()}catch{}}}
export function claimExplorationReward(playerName,eventType){
  const name=clean(playerName,12),type=clean(eventType,20),reward=EXPLORATION_REWARDS[type];
  if(!name||!reward)return{ok:false,code:'invalid-exploration-event'};
  let db;try{db=openLiveDb();ensureSchema(db);recoverFromMirror(db,name);const day=new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Seoul'}),referenceId=`${type}:${day}`;
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
  app.post('/api/player/me/exploration-collection/milestone',requireSession,(req,res)=>{try{const result=claimCollectionMilestone(req.session.name,req.body?.milestoneId);if(!result.ok)return res.status(result.code==='player-not-found'?404:409).json(result);if(!result.alreadyClaimed){const milestone=COLLECTION_MILESTONES[result.milestoneId];try{publishLiveEvent?.('📖',`${req.session.name} 학생이 탐험 도감 “${milestone.title}” 보상을 획득했습니다!`,'collection-milestone')}catch{}}res.json(result)}catch(err){res.status(500).json({ok:false,code:'collection-milestone-claim-failed',message:clean(err?.message||err,160)})}});
  app.get('/api/admin/exploration-collections',requireAdmin,(_req,res)=>{try{res.json({ok:true,students:classroomExplorationCollections()})}catch(err){res.status(500).json({ok:false,code:'exploration-collections-read-failed',message:clean(err?.message||err,160)})}});
  app.get('/api/player/me/daily-mission',requireSession,(req,res)=>{try{const result=dailyMissionStatus(req.session.name);if(!result)return res.status(404).json({ok:false,code:'player-not-found'});res.json(result)}catch(err){res.status(500).json({ok:false,code:'daily-mission-read-failed',message:clean(err?.message||err,160)})}});
  app.post('/api/player/me/daily-mission/claim',requireSession,(req,res)=>{try{const result=claimDailyMission(req.session.name);if(!result.ok)return res.status(result.code==='player-not-found'?404:409).json(result);res.json(result)}catch(err){res.status(500).json({ok:false,code:'daily-mission-claim-failed',message:clean(err?.message||err,160)})}});
  installRiddleAttemptStudentRoutes(app,{requireSession,publishLiveEvent,commitRiddleReward});
  installMathPracticeRoutes(app,{requireSession});
  installActivityAttemptStudentRoutes(app,{requireSession,commitExpeditionReward,validateActivityCompletion:validateMathCompletion,finalizeActivityCompletion:finalizeMathCompletion});
  installItemShopRoutes(app,{requireSession,requireAdmin,publishLiveEvent});
}
