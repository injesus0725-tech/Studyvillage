/* v1.9 additive backup validation for mirrored star settings. Pure validation only; no DB writes. */
import { validateStudyvillageBackup } from './backup-validator.js';
import { validateStarMirrorValue } from './star-backup-validator.js';

const STAR_SETTING_PREFIX='compat:stars:';

export function validateStudyvillageBackupWithStars(backup){
  const base=validateStudyvillageBackup(backup);
  if(!base.ok)return base;

  let starMirrorCount=0;
  for(const setting of backup.settings||[]){
    const key=String(setting?.key||'');
    if(!key.startsWith(STAR_SETTING_PREFIX))continue;
    starMirrorCount++;
    const star=validateStarMirrorValue(setting.value);
    if(!star.ok){
      return{
        ok:false,
        code:'invalid-star-backup-setting',
        message:'별 잔액 또는 별 장부 백업 정보가 손상되었습니다.',
        settingKey:key,
        errors:star.errors
      };
    }
  }

  return{...base,starMirrorCount};
}
