/* v1.5 shared classroom routes.
   Activity open/close state remains persisted in settings.
   Older backups are migrated forward, validated, restored one at a time, and successful migrations are recorded after restore.
   Wardrobe ownership is recovered from the validated compatibility mirror after successful restore and audited explicitly.
   Live DB wardrobe schema wiring, activity-record integrity, and score/XP ledger auditing are verified at server startup. */
import Database from 'better-sqlite3';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateStudyvillageBackup } from './backup-validator.js';
import { migrateStudyvillageBackup, legacyWardrobeKey } from './backup-migrator.js';

const __filename=fileURLToPath(import.meta.url),__dirname=path.dirname(__filename);
function openLiveDb(){const dataDir=process.env.STUDYVILLAGE_DATA_DIR||__dirname,dbPath=path.join(dataDir,'studyvillage.db'),db=new Database(dbPath);db.pragma('busy_timeout = 3000');return db}
function verifyLiveWardrobeDb(setSetting){
  let db;
  try{
    db=openLiveDb();
    const columns=()=>db.prepare('PRAGMA table_info(players)').all().map(r=>r.name);
    if(!columns().includes('owned_items_json'))db.exec(`ALTER TABLE players ADD COLUMN owned_items_json TEXT NOT NULL DEFAULT '[]'`);
    if(!columns().includes('owned_items_json'))throw new Error('owned_items_json 컬럼 생성 확인 실패');
    setSetting('release:wardrobe-direct-db-wiring','verified');
    setSetting('release:wardrobe-direct-db-wiring-checked-at',new Date().toISOString());
    return true;
  }catch(err){
    try{setSetting('release:wardrobe-direct-db-wiring','failed');setSetting('release:wardrobe-direct-db-wiring-error',String(err?.message||err).slice(0,240))}catch{}
    console.error('[Studyvillage] 옷장 DB 직접 연결 확인 실패:',err?.message||err);return false;
  }finally{try{db?.close()}catch{}}
}
function ensureScoreLedger(setSetting){
  let db;
  try{
    db=openLiveDb();
    db.exec(`
CREATE TABLE IF NOT EXISTS score_ledger (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_name TEXT NOT NULL,
  scope TEXT NOT NULL,
  activity_id TEXT,
  field TEXT NOT NULL,
  before_value INTEGER NOT NULL,
  after_value INTEGER NOT NULL,
  delta INTEGER NOT NULL,
  source TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_score_ledger_player_id ON score_ledger(player_name,id DESC);
CREATE INDEX IF NOT EXISTS idx_score_ledger_activity_id ON score_ledger(activity_id,id DESC);
CREATE TRIGGER IF NOT EXISTS trg_score_ledger_player_total_score
AFTER UPDATE OF total_score ON players
WHEN NEW.total_score <> OLD.total_score
BEGIN
  INSERT INTO score_ledger(player_name,scope,activity_id,field,before_value,after_value,delta,source,created_at)
  VALUES(NEW.name,'player',NULL,'total_score',OLD.total_score,NEW.total_score,NEW.total_score-OLD.total_score,'players-update',strftime('%Y-%m-%dT%H:%M:%fZ','now'));
END;
CREATE TRIGGER IF NOT EXISTS trg_score_ledger_player_xp
AFTER UPDATE OF xp ON players
WHEN NEW.xp <> OLD.xp
BEGIN
  INSERT INTO score_ledger(player_name,scope,activity_id,field,before_value,after_value,delta,source,created_at)
  VALUES(NEW.name,'player',NULL,'xp',OLD.xp,NEW.xp,NEW.xp-OLD.xp,'players-update',strftime('%Y-%m-%dT%H:%M:%fZ','now'));
END;
CREATE TRIGGER IF NOT EXISTS trg_score_ledger_activity_insert
AFTER INSERT ON activity_records
WHEN NEW.total_score <> 0
BEGIN
  INSERT INTO score_ledger(player_name,scope,activity_id,field,before_value,after_value,delta,source,created_at)
  VALUES(NEW.player_name,'activity',NEW.activity_id,'total_score',0,NEW.total_score,NEW.total_score,'activity-insert',strftime('%Y-%m-%dT%H:%M:%fZ','now'));
END;
CREATE TRIGGER IF NOT EXISTS trg_score_ledger_activity_update
AFTER UPDATE OF total_score ON activity_records
WHEN NEW.total_score <> OLD.total_score
BEGIN
  INSERT INTO score_ledger(player_name,scope,activity_id,field,before_value,after_value,delta,source,created_at)
  VALUES(NEW.player_name,'activity',NEW.activity_id,'total_score',OLD.total_score,NEW.total_score,NEW.total_score-OLD.total_score,'activity-update',strftime('%Y-%m-%dT%H:%M:%fZ','now'));
END;
CREATE TRIGGER IF NOT EXISTS trg_score_ledger_activity_delete
BEFORE DELETE ON activity_records
WHEN OLD.total_score <> 0
BEGIN
  INSERT INTO score_ledger(player_name,scope,activity_id,field,before_value,after_value,delta,source,created_at)
  VALUES(OLD.player_name,'activity',OLD.activity_id,'total_score',OLD.total_score,0,-OLD.total_score,'activity-delete',strftime('%Y-%m-%dT%H:%M:%fZ','now'));
END;
`);
    const triggerCount=Number(db.prepare(`SELECT COUNT(*) AS n FROM sqlite_master WHERE type='trigger' AND name LIKE 'trg_score_ledger_%'`).get()?.n||0);
    const ok=triggerCount===5;
    setSetting('release:score-ledger-wiring',ok?'verified':'failed');
    setSetting('release:score-ledger-wiring-checked-at',new Date().toISOString());
    if(!ok)throw new Error(`점수 장부 트리거 확인 실패 (${triggerCount}/5)`);
    return true;
  }catch(err){
    try{setSetting('release:score-ledger-wiring','failed');setSetting('release:score-ledger-wiring-error',String(err?.message||err).slice(0,240))}catch{}
    console.error('[Studyvillage] 점수 장부 연결 확인 실패:',err?.message||err);return false;
  }finally{try{db?.close()}catch{}}
}
function auditActivityRecords(setSetting){
  let db;
  try{
    db=openLiveDb();
    const orphanCount=Number(db.prepare(`SELECT COUNT(*) AS n FROM activity_records a LEFT JOIN players p ON p.name=a.player_name WHERE p.name IS NULL`).get()?.n||0);
    const duplicateCount=Number(db.prepare(`SELECT COUNT(*) AS n FROM (SELECT player_name,activity_id,COUNT(*) c FROM activity_records GROUP BY player_name,activity_id HAVING c>1)`).get()?.n||0);
    const invalidCount=Number(db.prepare(`SELECT COUNT(*) AS n FROM activity_records WHERE attempts<0 OR best_score<0 OR last_score<0 OR total_score<0 OR best_score>1000 OR last_score>1000`).get()?.n||0);
    const rowCount=Number(db.prepare('SELECT COUNT(*) AS n FROM activity_records').get()?.n||0);
    const audit={ok:orphanCount===0&&duplicateCount===0&&invalidCount===0,rowCount,orphanCount,duplicateCount,invalidCount,checkedAt:new Date().toISOString()};
    setSetting('release:activity-record-integrity',JSON.stringify(audit));
    if(!audit.ok)console.error('[Studyvillage] 활동별 기록 무결성 이상:',JSON.stringify(audit));
    return audit;
  }catch(err){
    const audit={ok:false,rowCount:0,orphanCount:-1,duplicateCount:-1,invalidCount:-1,error:String(err?.message||err).slice(0,240),checkedAt:new Date().toISOString()};
    try{setSetting('release:activity-record-integrity',JSON.stringify(audit))}catch{}
    console.error('[Studyvillage] 활동별 기록 무결성 검사 실패:',err?.message||err);return audit;
  }finally{try{db?.close()}catch{}}
}
function scoreLedgerRows({playerName='',activityId='',limit=200}={}){
  let db;
  try{
    db=openLiveDb();
    const where=[],params={limit:Math.max(1,Math.min(1000,Number(limit)||200))};
    if(playerName){where.push('player_name=@playerName');params.playerName=String(playerName).trim().slice(0,12)}
    if(activityId){where.push('activity_id=@activityId');params.activityId=String(activityId).trim().slice(0,40)}
    const sql=`SELECT id,player_name AS playerName,scope,activity_id AS activityId,field,before_value AS beforeValue,after_value AS afterValue,delta,source,created_at AS createdAt FROM score_ledger ${where.length?`WHERE ${where.join(' AND ')}`:''} ORDER BY id DESC LIMIT @limit`;
    return db.prepare(sql).all(params);
  }finally{try{db?.close()}catch{}}
}

export function installActivityStateRoutes(app,{getSetting,setSetting,requireAdmin}){
  const key=id=>`activity-state:${id}`;
  const valid=id=>/^[a-z0-9-]{1,40}$/.test(id);
  let restoreInProgress=false;
  verifyLiveWardrobeDb(setSetting);
  ensureScoreLedger(setSetting);
  auditActivityRecords(setSetting);
  const read=(id,name='학습 활동')=>{
    let saved=null;try{saved=JSON.parse(getSetting(key(id))||'null')}catch{}
    return{activityId:id,name:String(saved?.name||name).slice(0,80),open:saved?.open!==false,message:String(saved?.message||'').slice(0,240),updatedAt:saved?.updatedAt||null};
  };
  const readRestoreAudit=()=>{try{return JSON.parse(getSetting('backup:last-restore-integrity')||'null')}catch{return null}};
  const readActivityAudit=()=>{try{return JSON.parse(getSetting('release:activity-record-integrity')||'null')}catch{return null}};

  app.use('/api/admin/restore',requireAdmin,(req,res,next)=>{
    if(req.method!=='POST')return next();
    if(restoreInProgress)return res.status(409).json({ok:false,code:'restore-in-progress',message:'이미 다른 복원 작업이 진행 중입니다.'});
    const migration=migrateStudyvillageBackup(req.body);
    if(!migration.ok)return res.status(400).json({ok:false,code:migration.code,message:migration.message});
    const validation=validateStudyvillageBackup(migration.backup);
    if(!validation.ok)return res.status(400).json({ok:false,code:validation.code,message:validation.message});
    req.body=migration.backup;
    req.studyvillageBackupMigration={fromVersion:migration.fromVersion,toVersion:migration.toVersion,migrated:migration.migrated};
    req.studyvillageBackupValidation=validation;
    restoreInProgress=true;
    let released=false,finished=false;
    const release=()=>{if(released)return;released=true;restoreInProgress=false};
    res.once('finish',()=>{
      finished=true;
      if(res.statusCode>=200&&res.statusCode<300){
        if(migration.migrated){
          try{setSetting('backup:last-migration',JSON.stringify({fromVersion:migration.fromVersion,toVersion:migration.toVersion,restoredAt:new Date().toISOString()}))}catch(err){console.error('복원 변환 이력 저장 실패:',err?.message||err)}
        }
        try{
          const expected=(migration.backup.players||[]).filter(p=>String(p?.owned_items_json||'[]')!=='[]');
          const missing=[];
          for(const player of expected){const name=String(player?.name||'').trim(),wanted=String(player?.owned_items_json||'[]'),saved=getSetting(legacyWardrobeKey(name));if(saved!==wanted){setSetting(legacyWardrobeKey(name),wanted);const recovered=getSetting(legacyWardrobeKey(name));if(recovered!==wanted)missing.push(name)}}
          const audit={ok:missing.length===0,checked:expected.length,recovered:expected.length-missing.length,missingCount:missing.length,missingPlayers:missing.slice(0,20),checkedAt:new Date().toISOString()};
          setSetting('backup:last-restore-integrity',JSON.stringify(audit));
          if(!audit.ok)console.error('[Studyvillage] 복원 후 옷장 호환성 복구 실패:',missing.join(', '));
        }catch(err){
          const audit={ok:false,checked:0,recovered:0,missingCount:-1,missingPlayers:[],error:String(err?.message||err).slice(0,240),checkedAt:new Date().toISOString()};
          try{setSetting('backup:last-restore-integrity',JSON.stringify(audit))}catch{}
          console.error('복원 후 옷장 호환성 복구 실패:',err?.message||err);
        }
        ensureScoreLedger(setSetting);
        auditActivityRecords(setSetting);
      }
      release();
    });
    res.once('close',()=>{if(!finished)release()});
    next();
  });

  app.get('/api/admin/release-readiness',requireAdmin,(_req,res)=>{
    const audit=readRestoreAudit(),activityAudit=readActivityAudit();
    const wardrobeRestoreIntegrity=!!audit?.ok;
    const wardrobeDirectDbWiring=getSetting('release:wardrobe-direct-db-wiring')==='verified';
    const activityRecordIntegrity=!!activityAudit?.ok;
    const scoreLedgerWiring=getSetting('release:score-ledger-wiring')==='verified';
    const readyFor1_0=wardrobeRestoreIntegrity&&wardrobeDirectDbWiring&&activityRecordIntegrity&&scoreLedgerWiring;
    res.json({ok:true,readyFor1_0,checks:{wardrobeRestoreIntegrity,wardrobeDirectDbWiring,activityRecordIntegrity,scoreLedgerWiring},lastRestoreIntegrity:audit||null,lastActivityRecordIntegrity:activityAudit||null,message:readyFor1_0?'핵심 데이터 무결성 조건이 모두 확인되었습니다.':!wardrobeDirectDbWiring?'옷장 데이터의 직접 DB 연결 검증이 남아 있습니다.':!activityRecordIntegrity?'활동별 기록 무결성 확인이 더 필요합니다.':!scoreLedgerWiring?'점수/XP 변경 장부 연결 확인이 더 필요합니다.':'옷장 복원 무결성 확인이 더 필요합니다.'});
  });

  app.get('/api/admin/score-ledger',requireAdmin,(req,res)=>{
    try{res.json({ok:true,entries:scoreLedgerRows({playerName:req.query.playerName,activityId:req.query.activityId,limit:req.query.limit})})}
    catch(err){res.status(500).json({ok:false,code:'score-ledger-read-failed',message:String(err?.message||err).slice(0,240)})}
  });

  app.get('/api/activity-state/:id',(req,res)=>{
    const id=String(req.params.id||'').trim();if(!valid(id))return res.status(400).json({ok:false,code:'invalid-activity'});
    res.json({ok:true,activity:read(id)});
  });
  app.get('/api/admin/activity-states',requireAdmin,(_req,res)=>{
    const ids=['riddle-demo','library-vocabulary'];
    res.json({ok:true,activities:ids.map(id=>read(id,id==='riddle-demo'?'도전관 · 수수께끼':'책마루 · 낱말 뜻 맞추기'))});
  });
  app.put('/api/admin/activity-state/:id',requireAdmin,(req,res)=>{
    const id=String(req.params.id||'').trim();if(!valid(id))return res.status(400).json({ok:false,code:'invalid-activity'});
    const current=read(id),next={name:String(req.body?.name||current.name||'학습 활동').trim().slice(0,80),open:req.body?.open!==false,message:String(req.body?.message||'').trim().slice(0,240),updatedAt:new Date().toISOString()};
    setSetting(key(id),JSON.stringify(next));res.json({ok:true,activity:{activityId:id,...next}});
  });
}
