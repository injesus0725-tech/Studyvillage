/* Aggregate player record relationship validation for current-format backups.
   Older backups are handled by prepare-restore compatibility policy. */

const integer=(v,min,max)=>Number.isInteger(Number(v))&&Number(v)>=min&&Number(v)<=max;

export function validateAggregatePlayerRecords(backup){
  if(!Array.isArray(backup?.players))return{ok:false,code:'missing-required-data',message:'학생 데이터가 없습니다.'};
  for(const row of backup.players){
    const attempts=Number(row?.attempts),bestScore=Number(row?.best_score),lastScore=Number(row?.last_score),totalScore=Number(row?.total_score);
    if(!integer(attempts,0,1000000)||!integer(bestScore,0,1000)||!integer(lastScore,0,1000)||!integer(totalScore,0,100000000))continue;
    const invalid=attempts===0
      ? bestScore!==0||lastScore!==0||totalScore!==0
      : bestScore<lastScore||totalScore<bestScore||totalScore>attempts*1000;
    if(invalid)return{ok:false,code:'invalid-player-score-relationship',message:'학생 전체 기록의 시도 횟수·최고점·마지막 점수·누적 점수 관계가 서로 맞지 않습니다.'};
  }
  return{ok:true};
}
