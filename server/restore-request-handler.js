/* v1.9 restore request gate. Validates/migrates before any caller-supplied destructive restore function runs. */
import { prepareStudyvillageRestore } from './prepare-restore.js';

export function createRestoreRequestHandler({executeRestore,prepare=prepareStudyvillageRestore}={}){
  if(typeof executeRestore!=='function')throw new TypeError('executeRestore function is required');
  if(typeof prepare!=='function')throw new TypeError('prepare function is required');

  return function handleRestoreRequest(req,res){
    const prepared=prepare(req?.body);
    if(!prepared?.ok){
      return res.status(400).json({
        ok:false,
        code:prepared?.code||'invalid-backup',
        message:prepared?.message||'복원 파일을 안전하게 확인하지 못했습니다.'
      });
    }

    try{
      const result=executeRestore(prepared.backup,prepared);
      return res.json({
        ok:true,
        players:prepared.counts?.players||0,
        auditEntries:prepared.counts?.scoreLedger||0,
        migrated:prepared.migrated===true,
        fromVersion:prepared.fromVersion,
        toVersion:prepared.toVersion,
        ...(result&&typeof result==='object'?result:{})
      });
    }catch(error){
      return res.status(500).json({
        ok:false,
        code:'restore-execution-failed',
        message:'복원 처리 중 오류가 발생했습니다. 기존 데이터 상태를 확인해 주세요.'
      });
    }
  };
}
