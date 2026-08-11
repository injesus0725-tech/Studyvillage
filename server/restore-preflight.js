/* v1.9 read-only restore preflight.
   Validates/migrates a candidate backup without touching live classroom data. */
import { prepareStudyvillageRestore } from './prepare-restore.js';

const clean=(v,n=200)=>String(v??'').trim().slice(0,n);

export function installRestorePreflightRoute(app,{requireAdmin}){
  app.post('/api/admin/restore/preflight',requireAdmin,(req,res)=>{
    try{
      const prepared=prepareStudyvillageRestore(req.body);
      if(!prepared?.ok){
        return res.status(400).json({
          ok:false,
          code:clean(prepared?.code||'invalid-backup',80),
          message:clean(prepared?.message||'복원 파일을 안전하게 확인하지 못했습니다.')
        });
      }
      return res.json({
        ok:true,
        players:Number(prepared.counts?.players)||0,
        settings:Number(prepared.counts?.settings)||0,
        activityRecords:Number(prepared.counts?.activityRecords)||0,
        auditEntries:Number(prepared.counts?.scoreLedger)||0,
        migrated:prepared.migrated===true,
        fromVersion:prepared.fromVersion,
        toVersion:prepared.toVersion
      });
    }catch(err){
      return res.status(500).json({ok:false,code:'restore-preflight-failed',message:clean(err?.message||err)});
    }
  });
}
