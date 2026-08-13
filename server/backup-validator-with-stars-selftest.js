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
assert.equal(validateStudyvillageBackupWithStars({...base,settings:[...base.settings,{key:extraKey,value:'1'}]}).code,'duplicate-backup-setting-key');
assert.equal(validateStudyvillageBackupWithStars({...base,settings:[...base.settings,{key:historyKey,value:JSON.stringify(history)}]}).code,'duplicate-backup-setting-key');
assert.equal(validateStudyvillageBackupWithStars({...base,settings:[{key:extraKey,value:'1'},{key:historyKey,value:JSON.stringify([history[0],{...history[1],id:'1'}])}]}).code,'duplicate-extra-attempt-history-id');
assert.equal(validateStudyvillageBackupWithStars({...base,settings:[{key:extraKey,value:'1'},{key:historyKey,value:JSON.stringify([{...history[0],id:''}])}]}).code,'invalid-extra-attempt-history-id');
assert.equal(validateStudyvillageBackupWithStars({...base,settings:[{key:starKey,value:mirror},{key:historyKey,value:JSON.stringify(history)}]}).code,'missing-extra-attempt-current-setting');
assert.equal(validateStudyvillageBackupWithStars({...base,settings:[{key:extraKey,value:'1'}]}).ok,true,'migrated/legacy backups may contain a current extra-attempt value before history exists');

console.log('star and extra-attempt backup cross-check self-test passed');
