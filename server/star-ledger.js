/* v1.14 star currency foundation.
   Creates a separate spendable star balance and immutable ledger.
   Star state is mirrored into settings so existing backups preserve it without changing the backup format.
   On read/change after restore, the live star column/table is reconciled from that backed-up mirror.
   Item shop student and teacher routes are installed here with their matching auth guards. */
import Database from 'better-sqlite3';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { installItemShopRoutes } from './item-shop.js';
import { installActivityAttemptStudentRoutes } from './activity-attempt-student.js';
import { installRiddleAttemptStudentRoutes } from './riddle-attempt-student.js';
import { installStudentScoreHistoryRoutes } from './student-score-history.js';
import { installRestoreValidationMiddleware } from './restore-validation-middleware.js';

const __filename=fileURLToPath(import.meta.url),__dirname=path.dirname(__filename);
const MAX_STARS=1000000,MAX_MIRROR_ENTRIES=500;
const clean=(v,n=160)=>String(v??'').trim().slice(0,n);
const mirrorKey=name=>`compat:stars:${encodeURIComponent(clean(name,12))}`;

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
  return{balance:Math.max(0,Number(row.stars)||0),entries};
}
function normalized(value){return JSON.stringify({balance:Number(value?.balance)||0,entries:(value?.entries||[]).map(e=>({beforeValue:Number(e?.beforeValue)||0,afterValue:Number(e?.afterValue)||0,delta:Number(e?.delta)||0,kind:clean(e?.kind,60)||'legacy',referenceId:clean(e?.referenceId,100)||null,detail:clean(e?.detail,240)||null,createdAt:clean(e?.createdAt,80)}))})}
function writeMirror(db,name){
  const snap=liveSnapshot(db,name);if(!snap)return;
  db.prepare(`INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value`).run(mirrorKey(name),normalized(snap));
}
function recoverFromMirror(db,name){
  const mirror=readMirror(db,name);if(!mirror)return false;
  const live=liveSnapshot(db,name);if(!live)return false;
  if(normalized(live)===normalized(mirror))return false;
  const tx=db.transaction(()=>{
    db.prepare('UPDATE players SET stars=?,updated_at=? WHERE name=?').run(mirror.balance,new Date().toISOString(),name);
    db.prepare('DELETE FROM star_ledger WHERE player_name=?').run(name);
    const insert=db.prepare('INSERT INTO star_ledger(player_name,before_value,after_value,delta,kind,reference_id,detail,created_at) VALUES(?,?,?,?,?,?,?,?)');
    for(const e of mirror.entries)insert.run(name,e.beforeValue,e.afterValue,e.delta,e.kind,e.referenceId,e.detail,e.createdAt||new Date().toISOString());
  });
  tx();return true;
}

export function ensureStarLedger(){let db;try{db=openLiveDb();ensureSchema(db);return true}finally{try{db?.close()}catch{}}}
export function starBalanceFor(playerName){
  let db;try{db=openLiveDb();ensureSchema(db);const name=clean(playerName,12);recoverFromMirror(db,name);const row=db.prepare('SELECT stars FROM players WHERE name=?').get(name);return row?Math.max(0,Number(row.stars)||0):null}finally{try{db?.close()}catch{}}
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
      const before=Math.max(0,Number(player.stars)||0),after=before+change;if(after<0)return{ok:false,code:'insufficient-stars',balance:before};if(after>MAX_STARS)return{ok:false,code:'star-limit-exceeded',balance:before};
      const now=new Date().toISOString(),updated=db.prepare('UPDATE players SET stars=?,updated_at=? WHERE name=? AND stars=?').run(after,now,name,before);if(updated.changes!==1)return{ok:false,code:'star-balance-changed'};
      const result=db.prepare('INSERT INTO star_ledger(player_name,before_value,after_value,delta,kind,reference_id,detail,created_at) VALUES(?,?,?,?,?,?,?,?)').run(name,before,after,change,clean(kind,60),clean(referenceId,100)||null,clean(detail,240)||null,now);
      writeMirror(db,name);return{ok:true,id:Number(result.lastInsertRowid),beforeValue:before,afterValue:after,delta:change,createdAt:now};
    });
    return tx();
  }finally{try{db?.close()}catch{}}
}
export function installStarLedgerRoutes(app,{requireSession,requireAdmin}){
  ensureStarLedger();
  installRestoreValidationMiddleware(app,{requireAdmin});
  installStudentScoreHistoryRoutes(app,{requireSession});
  app.post('/api/login',(req,res,next)=>{
    const name=String(req.body?.name??'').trim().replace(/\s+/g,' ');
    if(name.length>12)return res.status(400).json({ok:false,code:'invalid-input'});
    next();
  });
  app.get('/api/player/me/stars',requireSession,(req,res)=>{
    try{const balance=starBalanceFor(req.session.name),entries=starLedgerFor(req.session.name,{limit:req.query.limit});if(balance===null)return res.status(404).json({ok:false,code:'player-not-found'});res.json({ok:true,balance,entries})}
    catch(err){res.status(500).json({ok:false,code:'star-ledger-read-failed',message:clean(err?.message||err,160)})}
  });
  installRiddleAttemptStudentRoutes(app,{requireSession});
  installActivityAttemptStudentRoutes(app,{requireSession});
  installItemShopRoutes(app,{requireSession,requireAdmin});
}
