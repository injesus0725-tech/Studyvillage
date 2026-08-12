import assert from 'node:assert/strict';
import { validateStudyvillageBackupWithStars } from './backup-validator-with-stars.js';
import { CURRENT_BACKUP_VERSION } from './backup-migrator.js';

const player={name:'민준',password_hash:'x',password_salt:'y',total_score:0,attempts:0,best_score:0,last_score:0,login_count:0,xp:0,base_character:'student-default',equipment_json:'{}',owned_items_json:'[]',created_at:'2026-01-01T00:00:00.000Z',updated_at:'2026-01-01T00:00:00.000Z',stars:10};
const mirror=JSON.stringify({balance:10,entries:[]});
const base={format:'studyvillage-backup',version:CURRENT_BACKUP_VERSION,players:[player],settings:[{key:`compat:stars:${encodeURIComponent(player.name)}`,value:mirror}],activities:[],activityRecords:[],errorReports:[],scoreLedger:[],scoreAlertReviews:[],scoreCorrections:[]};
const starKey=`compat:stars:${encodeURIComponent(player.name)}`;

assert.equal(validateStudyvillageBackupWithStars(base).ok,true);
assert.equal(validateStudyvillageBackupWithStars({...base,players:[{...player,stars:-1}]}).code,'invalid-player-stars');
assert.equal(validateStudyvillageBackupWithStars({...base,settings:[{key:'compat:stars:%E0%A4%A',value:mirror}]}).code,'invalid-star-backup-key');
assert.equal(validateStudyvillageBackupWithStars({...base,settings:[{key:`compat:stars:${encodeURIComponent('없는학생')}`,value:mirror}]}).code,'orphan-star-backup-setting');
assert.equal(validateStudyvillageBackupWithStars({...base,players:[{...player,stars:9}]}).code,'star-balance-mismatch');
assert.equal(validateStudyvillageBackupWithStars({...base,settings:[{key:starKey,value:'not-json'}]}).code,'invalid-star-backup-setting');
assert.equal(validateStudyvillageBackupWithStars({...base,settings:[{key:starKey,value:JSON.stringify({balance:10,entries:[{id:1,player_name:'민준',delta:3,before_balance:8,after_balance:10,kind:'award',created_at:'2026-01-01'}]})}]}).code,'invalid-star-backup-setting');
assert.equal(validateStudyvillageBackupWithStars({...base,settings:[{key:starKey,value:JSON.stringify({balance:10,entries:[{id:2,player_name:'민준',delta:10,before_balance:0,after_balance:10,kind:'award',created_at:'2026-01-01'},{id:1,player_name:'민준',delta:0,before_balance:10,after_balance:10,kind:'adjust',created_at:'2026-01-02'}]})}]}).code,'invalid-star-backup-setting');

console.log('star backup cross-check self-test passed');
