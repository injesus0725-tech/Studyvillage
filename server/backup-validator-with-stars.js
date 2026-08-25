/* v1.19 additive backup validation for mirrored star settings, extra-attempt settings/history integrity, restore-time equipment ownership parity, and item-purchase ledger semantics. Pure validation only; no DB writes. */
import { validateStudyvillageBackup } from './backup-validator.js';
import { validateStarMirrorValue } from './star-backup-validator.js';
import { parseOwnedItems } from './item-ownership.js';

const STAR_SETTING_PREFIX='compat:stars:';
const EXTRA_ATTEMPT_PREFIX='activity-attempt-extra:v1:';
const EXTRA_ATTEMPT_HISTORY_KEY='activity-attempt-extra-history:v1';
const SAFE_ACTIVITY=/^[a-z0-9-]{1,40}$/;
const MAX_STARS=1000000;
const SHOP_ITEM_IDS=new Set(['cap-blue','crown-gold','glasses-round','backpack','pet-chick','pet-cat','leaf-cap','scholar-cap','explorer-goggles','star-monocle','field-satchel','book-pack','pet-owl','pet-fox','hair-short','hair-bob','hair-ponytail','hair-blue','hat-wizard','hat-pirate','hat-flower','glasses-sun','glasses-heart','outfit-hoodie','outfit-uniform','outfit-wizard','outfit-armor','shoes-sneakers','shoes-boots','shoes-wing','bag-art','bag-rocket','hand-sword','hand-wand','hand-book','hand-magnifier','pet-dog','pet-rabbit','pet-dragon','pet-slime','aurora-effect']);
const validStars=value=>Number.isInteger(Number(value))&&Number(value)>=0&&Number(value)<=MAX_STARS;
const normalizePlayerName=value=>String(value??'').trim();
const validCanonicalPlayerName=value=>{const raw=String(value??''),name=normalizePlayerName(raw);return !!name&&name.length<=12&&name===raw};
function equippedItemIds(value){
  try{const equipment=JSON.parse(value||'{}');return Object.values(equipment||{}).filter(v=>typeof v==='string'&&v)}catch{return[]}
}
function validateExtraAttemptHistory(value,players){
  let rows;try{rows=JSON.parse(value)}catch{return{ok:false,code:'invalid-extra-attempt-history-json',message:'추가 도전권 사용 기록 JSON이 손상되었습니다.'}}
  if(!Array.isArray(rows)||rows.length>1000)return{ok:false,code:'invalid-extra-attempt-history-size',message:'추가 도전권 사용 기록의 개수 또는 형식이 올바르지 않습니다.'};
  const lastByScope=new Map(),lastBalanceByScope=new Map(),seenIds=new Set();
  for(const row of rows){
    const id=String(row?.id||''),rawName=String(row?.name??''),name=normalizePlayerName(rawName),activityId=String(row?.activityId||''),type=String(row?.type||''),amount=Number(row?.amount),before=Number(row?.before),after=Number(row?.after),detail=String(row?.detail||''),createdAt=String(row?.createdAt||'');
    if(!validCanonicalPlayerName(rawName))return{ok:false,code:'invalid-extra-attempt-history-player',message:'추가 도전권 기록의 학생 이름 형식이 올바르지 않습니다.',playerName:name};
    if(!id||id.length>120)return{ok:false,code:'invalid-extra-attempt-history-id',message:'추가 도전권 기록 ID가 올바르지 않습니다.',playerName:name};
    if(seenIds.has(id))return{ok:false,code:'duplicate-extra-attempt-history-id',message:'추가 도전권 기록 ID가 중복되어 있습니다.',historyId:id};
    seenIds.add(id);
    if(!players.has(name))return{ok:false,code:'orphan-extra-attempt-history',message:'존재하지 않는 학생의 추가 도전권 기록이 포함되어 있습니다.',playerName:name};
    if(!SAFE_ACTIVITY.test(activityId))return{ok:false,code:'invalid-extra-attempt-history-activity',message:'추가 도전권 기록의 활동 ID가 올바르지 않습니다.',playerName:name};
    if(!['grant','set','consume'].includes(type))return{ok:false,code:'invalid-extra-attempt-history-type',message:'추가 도전권 기록의 유형이 올바르지 않습니다.',playerName:name};
    if(!Number.isInteger(amount)||!Number.isInteger(before)||!Number.isInteger(after)||before<0||before>1000||after<0||after>1000)return{ok:false,code:'invalid-extra-attempt-history-value',message:'추가 도전권 기록의 수량이 정상 범위를 벗어났습니다.',playerName:name};
    if(detail.length>240||!createdAt||Number.isNaN(Date.parse(createdAt)))return{ok:false,code:'invalid-extra-attempt-history-metadata',message:'추가 도전권 기록의 설명 또는 시간이 올바르지 않습니다.',playerName:name};
    if(type==='grant'&&amount<=0)return{ok:false,code:'invalid-extra-attempt-history-delta',message:'추가 도전권 지급 기록의 변화량이 올바르지 않습니다.',playerName:name};
    if(type==='consume'&&amount>=0)return{ok:false,code:'invalid-extra-attempt-history-delta',message:'추가 도전권 사용 기록의 변화량이 올바르지 않습니다.',playerName:name};
    if(after-before!==amount)return{ok:false,code:'extra-attempt-history-balance-mismatch',message:'추가 도전권 기록의 전후 수량과 변화량이 서로 맞지 않습니다.',playerName:name};
    const scope=`${name}\u0000${activityId}`,previous=lastByScope.get(scope);
    if(previous&&previous.after!==before)return{ok:false,code:'extra-attempt-history-discontinuity',message:'추가 도전권 기록의 이전 잔여량과 다음 시작 잔여량이 이어지지 않습니다.',playerName:name,activityId};
    if(previous&&Date.parse(createdAt)<Date.parse(previous.createdAt))return{ok:false,code:'extra-attempt-history-time-order',message:'추가 도전권 기록의 시간 순서가 올바르지 않습니다.',playerName:name,activityId};
    lastByScope.set(scope,{after,createdAt});lastBalanceByScope.set(scope,after);
  }
  return{ok:true,count:rows.length,lastBalanceByScope};
}

export function validateStudyvillageBackupWithStars(backup){
  const base=validateStudyvillageBackup(backup);
  if(!base.ok)return base;

  const players=new Map((backup.players||[]).map(player=>[normalizePlayerName(player?.name),player]));
  const ownedByPlayer=new Map();
  for(const [name,player] of players){
    if(Object.prototype.hasOwnProperty.call(player||{},'stars')&&!validStars(player.stars))return{ok:false,code:'invalid-player-stars',message:'학생 별 잔액이 정상 범위를 벗어났습니다.',playerName:name};
    const owned=new Set(parseOwnedItems(player?.owned_items_json||'[]'));ownedByPlayer.set(name,owned);
    for(const itemId of equippedItemIds(player?.equipment_json))if(!owned.has(itemId))return{ok:false,code:'equipped-item-not-owned',message:'장착된 아이템이 학생의 보유 아이템 목록에 없습니다.',playerName:name,itemId};
  }

  let starMirrorCount=0,extraAttemptSettingCount=0,extraAttemptHistoryCount=0,historyLastBalances=new Map();
  const extraAttemptBalances=new Map(),seenSpecialSettings=new Set();
  for(const setting of backup.settings||[]){
    const key=String(setting?.key||'');
    if(key===EXTRA_ATTEMPT_HISTORY_KEY||key.startsWith(EXTRA_ATTEMPT_PREFIX)||key.startsWith(STAR_SETTING_PREFIX)){
      if(seenSpecialSettings.has(key))return{ok:false,code:'duplicate-backup-setting-key',message:'백업 설정 키가 중복되어 복원 결과를 신뢰할 수 없습니다.',settingKey:key};
      seenSpecialSettings.add(key);
    }
    if(key===EXTRA_ATTEMPT_HISTORY_KEY){
      const history=validateExtraAttemptHistory(String(setting?.value||''),players);
      if(!history.ok)return{...history,settingKey:key};
      extraAttemptHistoryCount=history.count;historyLastBalances=history.lastBalanceByScope;continue;
    }
    if(key.startsWith(EXTRA_ATTEMPT_PREFIX)){
      extraAttemptSettingCount++;
      const rest=key.slice(EXTRA_ATTEMPT_PREFIX.length),split=rest.lastIndexOf(':');
      if(split<=0)return{ok:false,code:'invalid-extra-attempt-backup-key',message:'추가 도전권 백업 설정의 키 형식이 손상되었습니다.',settingKey:key};
      const encodedName=rest.slice(0,split),activityId=rest.slice(split+1);
      let playerName='';
      try{playerName=decodeURIComponent(encodedName)}catch{return{ok:false,code:'invalid-extra-attempt-backup-key',message:'추가 도전권 백업 설정의 학생 이름 형식이 손상되었습니다.',settingKey:key}}
      if(!validCanonicalPlayerName(playerName)||encodeURIComponent(playerName)!==encodedName)return{ok:false,code:'invalid-extra-attempt-backup-player',message:'추가 도전권 백업 설정의 학생 이름이 현재 이름 규칙과 맞지 않습니다.',settingKey:key};
      if(!players.has(playerName))return{ok:false,code:'orphan-extra-attempt-backup-setting',message:'존재하지 않는 학생의 추가 도전권 설정이 포함되어 있습니다.',settingKey:key};
      if(!SAFE_ACTIVITY.test(activityId))return{ok:false,code:'invalid-extra-attempt-activity',message:'추가 도전권 백업 설정의 활동 ID가 올바르지 않습니다.',settingKey:key};
      const amount=Number(setting?.value);
      if(!Number.isInteger(amount)||amount<0||amount>1000)return{ok:false,code:'invalid-extra-attempt-value',message:'추가 도전권 수량이 정상 범위를 벗어났습니다.',settingKey:key};
      extraAttemptBalances.set(`${playerName}\u0000${activityId}`,amount);continue;
    }
    if(!key.startsWith(STAR_SETTING_PREFIX))continue;
    starMirrorCount++;
    const encodedName=key.slice(STAR_SETTING_PREFIX.length);
    let playerName='';
    try{playerName=decodeURIComponent(encodedName)}catch{return{ok:false,code:'invalid-star-backup-key',message:'별 백업 설정의 학생 이름 형식이 손상되었습니다.',settingKey:key}}
    if(!validCanonicalPlayerName(playerName)||encodeURIComponent(playerName)!==encodedName)return{ok:false,code:'invalid-star-backup-player',message:'별 백업 설정의 학생 이름이 현재 이름 규칙과 맞지 않습니다.',settingKey:key};
    const player=players.get(playerName);
    if(!player)return{ok:false,code:'orphan-star-backup-setting',message:'존재하지 않는 학생의 별 백업 설정이 포함되어 있습니다.',settingKey:key};
    const star=validateStarMirrorValue(setting.value);
    if(!star.ok)return{ok:false,code:'invalid-star-backup-setting',message:'별 잔액 또는 별 장부 백업 정보가 손상되었습니다.',settingKey:key,errors:star.errors};
    const mirror=JSON.parse(setting.value),owned=ownedByPlayer.get(playerName)||new Set();
    for(const entry of mirror.entries||[]){
      if(String(entry?.kind||'')!=='item-purchase')continue;
      const itemId=String(entry?.referenceId||'');
      if(!SHOP_ITEM_IDS.has(itemId))return{ok:false,code:'invalid-item-purchase-reference',message:'아이템 구매 별 원장이 존재하지 않는 상점 아이템을 참조합니다.',playerName,itemId,settingKey:key};
      if(Number(entry?.delta)>=0)return{ok:false,code:'invalid-item-purchase-delta',message:'아이템 구매 별 원장의 변화량이 차감 값이 아닙니다.',playerName,itemId,settingKey:key};
      if(!owned.has(itemId))return{ok:false,code:'item-purchase-ownership-mismatch',message:'아이템 구매 별 원장이 있지만 현재 보유 아이템 목록에 해당 아이템이 없습니다.',playerName,itemId,settingKey:key};
    }
    if(Object.prototype.hasOwnProperty.call(player,'stars')&&Number(player.stars)!==Number(mirror.balance))return{ok:false,code:'star-balance-mismatch',message:'학생 별 잔액과 별 장부 백업 잔액이 서로 다릅니다.',playerName,settingKey:key};
  }
  for(const [scope,lastBalance] of historyLastBalances){
    const [playerName,activityId]=scope.split('\u0000');
    if(!extraAttemptBalances.has(scope))return{ok:false,code:'missing-extra-attempt-current-setting',message:'추가 도전권 사용 기록은 있지만 현재 잔여량 설정이 없어 복원 결과를 신뢰할 수 없습니다.',playerName,activityId};
    if(extraAttemptBalances.get(scope)!==lastBalance)return{ok:false,code:'extra-attempt-current-balance-mismatch',message:'추가 도전권의 현재 잔여량과 마지막 사용 기록의 잔여량이 서로 다릅니다.',playerName,activityId};
  }
  return{...base,starMirrorCount,extraAttemptSettingCount,extraAttemptHistoryCount};
}
