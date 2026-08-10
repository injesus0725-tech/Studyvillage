/* v0.9.992 shared classroom routes.
   Activity open/close state remains persisted in settings.
   Older backups are migrated forward, validated, restored one at a time, and successful migrations are recorded after restore.
   Wardrobe ownership is recovered from the validated compatibility mirror after successful restore and audited explicitly.
   Pre-1.0 readiness remains false until both restore integrity and direct wardrobe DB wiring are complete. */
import { validateStudyvillageBackup } from './backup-validator.js';
import { migrateStudyvillageBackup, legacyWardrobeKey } from './backup-migrator.js';

export function installActivityStateRoutes(app,{getSetting,setSetting,requireAdmin}){
  const key=id=>`activity-state:${id}`;
  const valid=id=>/^[a-z0-9-]{1,40}$/.test(id);
  let restoreInProgress=false;
  const read=(id,name='학습 활동')=>{
    let saved=null;try{saved=JSON.parse(getSetting(key(id))||'null')}catch{}
    return{activityId:id,name:String(saved?.name||name).slice(0,80),open:saved?.open!==false,message:String(saved?.message||'').slice(0,240),updatedAt:saved?.updatedAt||null};
  };
  const readRestoreAudit=()=>{try{return JSON.parse(getSetting('backup:last-restore-integrity')||'null')}catch{return null}};

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
      }
      release();
    });
    res.once('close',()=>{if(!finished)release()});
    next();
  });

  app.get('/api/admin/release-readiness',requireAdmin,(_req,res)=>{
    const audit=readRestoreAudit();
    const wardrobeRestoreIntegrity=!!audit?.ok;
    const wardrobeDirectDbWiring=getSetting('release:wardrobe-direct-db-wiring')==='verified';
    const readyFor1_0=wardrobeRestoreIntegrity&&wardrobeDirectDbWiring;
    res.json({ok:true,readyFor1_0,checks:{wardrobeRestoreIntegrity,wardrobeDirectDbWiring},lastRestoreIntegrity:audit||null,message:readyFor1_0?'1.0 핵심 복원 조건이 모두 확인되었습니다.':!wardrobeDirectDbWiring?'옷장 데이터의 직접 DB 연결 검증이 남아 있습니다.':'1.0 전 옷장 복원 무결성 확인이 더 필요합니다.'});
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
