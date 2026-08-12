/* v1.9 additive backup validation for mirrored star settings. Pure validation only; no DB writes. */
import { validateStudyvillageBackup } from './backup-validator.js';
import { validateStarMirrorValue } from './star-backup-validator.js';

const STAR_SETTING_PREFIX='compat:stars:';
const MAX_STARS=1000000;
const validStars=value=>Number.isInteger(Number(value))&&Number(value)>=0&&Number(value)<=MAX_STARS;

export function validateStudyvillageBackupWithStars(backup){
  const base=validateStudyvillageBackup(backup);
  if(!base.ok)return base;

  const players=new Map((backup.players||[]).map(player=>[String(player?.name||'').trim(),player]));
  for(const [name,player] of players){
    if(Object.prototype.hasOwnProperty.call(player||{},'stars')&&!validStars(player.stars)){
      return{ok:false,code:'invalid-player-stars',message:'학생 별 잔액이 정상 범위를 벗어났습니다.',playerName:name};
    }
  }

  let starMirrorCount=0;
  for(const setting of backup.settings||[]){
    const key=String(setting?.key||'');
    if(!key.startsWith(STAR_SETTING_PREFIX))continue;
    starMirrorCount++;
    const encodedName=key.slice(STAR_SETTING_PREFIX.length);
    let playerName='';
    try{playerName=decodeURIComponent(encodedName)}catch{
      return{ok:false,code:'invalid-star-backup-key',message:'별 백업 설정의 학생 이름 형식이 손상되었습니다.',settingKey:key};
    }
    const player=players.get(playerName);
    if(!player){
      return{ok:false,code:'orphan-star-backup-setting',message:'존재하지 않는 학생의 별 백업 설정이 포함되어 있습니다.',settingKey:key};
    }
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
    if(Object.prototype.hasOwnProperty.call(player,'stars')){
      const mirror=JSON.parse(setting.value);
      if(Number(player.stars)!==Number(mirror.balance)){
        return{ok:false,code:'star-balance-mismatch',message:'학생 별 잔액과 별 장부 백업 잔액이 서로 다릅니다.',playerName,settingKey:key};
      }
    }
  }

  return{...base,starMirrorCount};
}
