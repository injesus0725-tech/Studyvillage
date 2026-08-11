/* v1.9 server-side restore validation middleware.
   Runs before the legacy destructive restore route. Valid/migrated backups continue via next(); invalid backups never reach it. */
import { prepareStudyvillageRestore } from './prepare-restore.js';

const clean=(v,n=200)=>String(v??'').trim().slice(0,n);

export function installRestoreValidationMiddleware(app,{requireAdmin}){
  app.post('/api/admin/restore',requireAdmin,(req,res,next)=>{
    try{
      const prepared=prepareStudyvillageRestore(req.body);
      if(!prepared?.ok){
        return res.status(400).json({
          ok:false,
          code:clean(prepared?.code||'invalid-backup',80),
          message:clean(prepared?.message||'복원 파일을 안전하게 확인하지 못했습니다.')
        });
      }
      // Pass the validated/migrated current-format backup to the existing restore executor.
      req.body=prepared.backup;
      req.studyvillageRestorePreparation={
        migrated:prepared.migrated===true,
        fromVersion:prepared.fromVersion,
        toVersion:prepared.toVersion,
        counts:prepared.counts||{}
      };
      return next();
    }catch(err){
      return res.status(400).json({
        ok:false,
        code:'restore-validation-failed',
        message:clean(err?.message||err)
      });
    }
  });
}
