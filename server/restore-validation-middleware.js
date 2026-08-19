/* v1.10 server-side restore validation middleware.
   Runs before the legacy destructive restore route. Valid/migrated backups continue via next(); invalid backups never reach it.
   After a successful legacy restore, mirrored star balances/ledger entries are materialized immediately so a restored classroom never briefly exposes a zero balance. */
import Database from 'better-sqlite3';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { prepareStudyvillageRestore } from './prepare-restore.js';

const __filename=fileURLToPath(import.meta.url),__dirname=path.dirname(__filename);
const clean=(v,n=200)=>String(v??'').trim().slice(0,n);
const STAR_PREFIX='compat:stars:',MAX_STARS=1000000,MAX_ENTRIES=500;
function restoreStarMirrors(){
  const dataDir=process.env.STUDYVILLAGE_DATA_DIR||__dirname,db=new Database(path.join(dataDir,'studyvillage.db'));
  try{
    db.pragma('busy_timeout = 3000');
    const columns=db.prepare('PRAGMA table_info(players)').all().map(r=>r.name);if(!columns.includes('stars'))db.exec('ALTER TABLE players ADD COLUMN stars INTEGER NOT NULL DEFAULT 0');
    db.exec(`CREATE TABLE IF NOT EXISTS star_ledger (id INTEGER PRIMARY KEY AUTOINCREMENT,player_name TEXT NOT NULL,before_value INTEGER NOT NULL,after_value INTEGER NOT NULL,delta INTEGER NOT NULL,kind TEXT NOT NULL,reference_id TEXT,detail TEXT,created_at TEXT NOT NULL);CREATE INDEX IF NOT EXISTS idx_star_ledger_player_id ON star_ledger(player_name,id DESC);`);
    const rows=db.prepare('SELECT key,value FROM settings WHERE key LIKE ? ORDER BY key').all(`${STAR_PREFIX}%`),players=new Set(db.prepare('SELECT name FROM players').all().map(r=>r.name));
    const tx=db.transaction(()=>{for(const row of rows){let name='';try{name=decodeURIComponent(String(row.key).slice(STAR_PREFIX.length))}catch{continue}if(!players.has(name))continue;let mirror;try{mirror=JSON.parse(row.value)}catch{continue}const balance=Number(mirror?.balance);if(!Number.isInteger(balance)||balance<0||balance>MAX_STARS)continue;db.prepare('UPDATE players SET stars=? WHERE name=?').run(balance,name);db.prepare('DELETE FROM star_ledger WHERE player_name=?').run(name);const insert=db.prepare('INSERT INTO star_ledger(player_name,before_value,after_value,delta,kind,reference_id,detail,created_at) VALUES(?,?,?,?,?,?,?,?)');for(const e of (Array.isArray(mirror?.entries)?mirror.entries:[]).slice(-MAX_ENTRIES)){const before=Number(e?.beforeValue)||0,after=Number(e?.afterValue)||0,delta=Number(e?.delta)||0;if(after-before!==delta)continue;insert.run(name,before,after,delta,clean(e?.kind,60)||'legacy',clean(e?.referenceId,100)||null,clean(e?.detail,240)||null,clean(e?.createdAt,80)||new Date().toISOString())}}});
    tx();return rows.length;
  }finally{db.close()}
}

export function installRestoreValidationMiddleware(app,{requireAdmin}){
  app.post('/api/admin/restore',requireAdmin,(req,res,next)=>{
    try{
      const prepared=prepareStudyvillageRestore(req.body);
      if(!prepared?.ok){return res.status(400).json({ok:false,code:clean(prepared?.code||'invalid-backup',80),message:clean(prepared?.message||'복원 파일을 안전하게 확인하지 못했습니다.')})}
      req.body=prepared.backup;
      req.studyvillageRestorePreparation={migrated:prepared.migrated===true,fromVersion:prepared.fromVersion,toVersion:prepared.toVersion,counts:prepared.counts||{}};
      const originalJson=res.json.bind(res);
      res.json=payload=>{
        if(payload?.ok===true){
          try{const restoredStarMirrors=restoreStarMirrors();payload={...payload,restoredStarMirrors}}
          catch(error){return originalJson({ok:false,code:'post-restore-star-recovery-failed',message:clean(error?.message||error)})}
        }
        return originalJson(payload);
      };
      return next();
    }catch(err){return res.status(400).json({ok:false,code:'restore-validation-failed',message:clean(err?.message||err)})}
  });
}
