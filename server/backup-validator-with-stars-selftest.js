import assert from 'node:assert/strict';
import { validateStudyvillageBackupWithStars } from './backup-validator-with-stars.js';
import { CURRENT_BACKUP_VERSION } from './backup-migrator.js';

const player={name:'민준',password_hash:'x',password_salt:'y',total_score:0,attempts:0,best_score:0,last_score:0,login_count:0,xp:0,base_character:'student-default',equipment_json:'{}',owned_items_json:'[]',created_at:'2026-01-01T00:00:00.000Z',updated_at:'2026-01-01T00:00:00.000Z',stars:10};
const mirror=JSON.stringify({balance:10,entries:[]});
const starKey=`compat:stars:${encodeURIComponent(player.name)}`;
const extraKey=`activity-attempt-extra:v1:${encodeURIComponent(player.name)}:riddle-1`;
const historyKey='activity-attempt-extra-history:v1';
const history=[{id:'1',name:player.name,activityId:'riddle-1',type:'grant',amount:2,before:0,after:2,detail:'교사가 추가 도전 허용',createdAt:'2026-08-13T00:00:00.000Z'},{id:'2',name:player.name,activityId:'riddle-1',type:'consume',amount:-1,before:2,after:1,detail:'학생 활동에 사용',createdAt:'2026-08-13T00:01:00.000Z'}];
const base={format:'studyvillage-backup',version:CURRENT_BACKUP_VERSION,players:[player],settings:[{key:starKey,value:mirror},{key:extraKey,value:'1'},{key:historyKey,value:JSON.stringify(history)}],activities:[],activityRecords:[],errorReports:[],scoreLedger:[],scoreAlertReviews:[],scoreCorrections:[]};

let result=validateStudyvillageBackupWithStars(base);
assert.equal(result.ok,true);
assert.equal(result.extraAttemptSettingCount,1);
assert.equal(result.extraAttemptHistoryCount,2);
assert.equal(validateStudyvillageBackupWithStars({...base,players:[{...player,stars:-1}]}).code,'invalid-player-stars');
assert.equal(validateStudyvillageBackupWithStars({...base,settings:[{key:'compat:stars:%E0%A4%A',value:mirror}]}).code,'invalid-star-backup-key');
assert.equal(validateStudyvillageBackupWithStars({...base,settings:[{key:`compat:stars:${encodeURIComponent('없는학생')}`,value:mirror}]}).code,'orphan-star-backup-setting');
assert.equal(validateStudyvillageBackupWithStars({...base,players:[{...player,stars:9}]}).code,'star-balance-mismatch');
assert.equal(validateStudyvillageBackupWithStars({...base,settings:[{key:starKey,value:'not-json'}]}).code,'invalid-star-backup-setting');
assert.equal(validateStudyvillageBackupWithStars({...base,settings:[{key:starKey,value:JSON.stringify({balance:10,entries:[{id:1,player_name:'민준',delta:3,before_balance:8,after_balance:10,kind:'award',created_at:'2026-01-01'}]})}]}).code,'invalid-star-backup-setting');
assert.equal(validateStudyvillageBackupWithStars({...base,settings:[{key:starKey,value:JSON.stringify({balance:10,entries:[{id:2,player_name:'민준',delta:10,before_balance:0,after_balance:10,kind:'award',created_at:'2026-01-01'},{id:1,player_name:'민준',delta:0,before_balance:10,after_balance:10,kind:'adjust',created_at:'2026-01-02'}]})}]}).code,'invalid-star-backup-setting');
assert.equal(validateStudyvillageBackupWithStars({...base,settings:[{key:`activity-attempt-extra:v1:${encodeURIComponent('없는학생')}:riddle-1`,value:'1'}]}).code,'orphan-extra-attempt-backup-setting');
assert.equal(validateStudyvillageBackupWithStars({...base,settings:[{key:`activity-attempt-extra:v1:${encodeURIComponent(player.name)}:BAD!`,value:'1'}]}).code,'invalid-extra-attempt-activity');
assert.equal(validateStudyvillageBackupWithStars({...base,settings:[{key:extraKey,value:'1001'}]}).code,'invalid-extra-attempt-value');
assert.equal(validateStudyvillageBackupWithStars({...base,settings:[{key:'activity-attempt-extra:v1:%E0%A4%A:riddle-1',value:'1'}]}).code,'invalid-extra-attempt-backup-key');
assert.equal(validateStudyvillageBackupWithStars({...base,settings:[{key:historyKey,value:'not-json'}]}).code,'invalid-extra-attempt-history-json');
assert.equal(validateStudyvillageBackupWithStars({...base,settings:[{key:historyKey,value:JSON.stringify([{...history[0],name:'없는학생'}])}]}).code,'orphan-extra-attempt-history');
assert.equal(validateStudyvillageBackupWithStars({...base,settings:[{key:historyKey,value:JSON.stringify([{...history[0],activityId:'BAD!'}])}]}).code,'invalid-extra-attempt-history-activity');
assert.equal(validateStudyvillageBackupWithStars({...base,settings:[{key:historyKey,value:JSON.stringify([{...history[0],type:'hack'}])}]}).code,'invalid-extra-attempt-history-type');
assert.equal(validateStudyvillageBackupWithStars({...base,settings:[{key:historyKey,value:JSON.stringify([{...history[0],amount:3}])}]}).code,'extra-attempt-history-balance-mismatch');
const discontinuous=[history[0],{...history[1],before:3,after:2,amount:-1}];
assert.equal(validateStudyvillageBackupWithStars({...base,settings:[{key:extraKey,value:'2'},{key:historyKey,value:JSON.stringify(discontinuous)}]}).code,'extra-attempt-history-discontinuity');
const reversedTime=[history[0],{...history[1],createdAt:'2026-08-12T23:59:00.000Z'}];
assert.equal(validateStudyvillageBackupWithStars({...base,settings:[{key:extraKey,value:'1'},{key:historyKey,value:JSON.stringify(reversedTime)}]}).code,'extra-attempt-history-time-order');
assert.equal(validateStudyvillageBackupWithStars({...base,settings:[{key:extraKey,value:'2'},{key:historyKey,value:JSON.stringify(history)}]}).code,'extra-attempt-current-balance-mismatch');

console.log('star and extra-attempt backup cross-check self-test passed');
