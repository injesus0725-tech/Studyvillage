/* v1.9 star currency foundation.
   Creates a separate spendable star balance and immutable ledger.
   No automatic earning or spending rules are installed here. */
import Database from 'better-sqlite3';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename=fileURLToPath(import.meta.url),__dirname=path.dirname(__filename);
const MAX_STARS=1000000;
const clean=(v,n=160)=>String(v??'').trim().slice(0,n);

function openLiveDb(){
  const dataDir=process.env.STUDYVILLAGE_DATA_DIR||__dirname;
  const db=new Database(path.join(dataDir,'studyvillage.db'));
  db.pragma('busy_timeout = 3000');
  return db;
}

export function ensureStarLedger(){
  let db;
  try{
    db=openLiveDb();
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
    return true;
  }finally{try{db?.close()}catch{}}
}

export function starBalanceFor(playerName){
  let db;
  try{
    db=openLiveDb();
    const row=db.prepare('SELECT stars FROM players WHERE name=?').get(clean(playerName,12));
    return row?Math.max(0,Number(row.stars)||0):null;
  }finally{try{db?.close()}catch{}}
}

export function starLedgerFor(playerName,{limit=100}={}){
  let db;
  try{
    db=openLiveDb();
    return db.prepare(`SELECT id,before_value AS beforeValue,after_value AS afterValue,delta,kind,reference_id AS referenceId,detail,created_at AS createdAt FROM star_ledger WHERE player_name=? ORDER BY id DESC LIMIT ?`).all(clean(playerName,12),Math.max(1,Math.min(300,Number(limit)||100)));
  }finally{try{db?.close()}catch{}}
}

export function changeStars(playerName,delta,{kind='teacher-adjustment',referenceId='',detail=''}={}){
  const name=clean(playerName,12),change=Number(delta);
  if(!name||!Number.isInteger(change)||change===0||Math.abs(change)>MAX_STARS)return{ok:false,code:'invalid-star-change'};
  let db;
  try{
    db=openLiveDb();
    const tx=db.transaction(()=>{
      const player=db.prepare('SELECT stars FROM players WHERE name=?').get(name);
      if(!player)return{ok:false,code:'player-not-found'};
      const before=Math.max(0,Number(player.stars)||0),after=before+change;
      if(after<0)return{ok:false,code:'insufficient-stars',balance:before};
      if(after>MAX_STARS)return{ok:false,code:'star-limit-exceeded',balance:before};
      const now=new Date().toISOString();
      const updated=db.prepare('UPDATE players SET stars=?,updated_at=? WHERE name=? AND stars=?').run(after,now,name,before);
      if(updated.changes!==1)return{ok:false,code:'star-balance-changed'};
      const result=db.prepare('INSERT INTO star_ledger(player_name,before_value,after_value,delta,kind,reference_id,detail,created_at) VALUES(?,?,?,?,?,?,?,?)').run(name,before,after,change,clean(kind,60),clean(referenceId,100)||null,clean(detail,240)||null,now);
      return{ok:true,id:Number(result.lastInsertRowid),beforeValue:before,afterValue:after,delta:change,createdAt:now};
    });
    return tx();
  }finally{try{db?.close()}catch{}}
}

export function installStarLedgerRoutes(app,{requireSession}){
  ensureStarLedger();
  app.get('/api/player/me/stars',requireSession,(req,res)=>{
    try{
      const balance=starBalanceFor(req.session.name),entries=starLedgerFor(req.session.name,{limit:req.query.limit});
      if(balance===null)return res.status(404).json({ok:false,code:'player-not-found'});
      res.json({ok:true,balance,entries});
    }catch(err){res.status(500).json({ok:false,code:'star-ledger-read-failed',message:clean(err?.message||err,160)})}
  });
}
