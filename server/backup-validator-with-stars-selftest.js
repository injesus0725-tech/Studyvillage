import assert from 'node:assert/strict';
import { validateStudyvillageBackupWithStars } from './backup-validator-with-stars.js';
import { CURRENT_BACKUP_VERSION } from './backup-migrator.js';

const player={name:'민준',password_hash:'x',password_salt:'y',total_score:0,attempts:0,best_score:0,last_score:0,login_count:0,xp:0,base_character:'student-default',equipment_json:'{}',owned_items_json:'[]',created_at:'2026-01-01T00:00:00.000Z',updated_at:'2026-01-01T00:00:00.000Z',stars:10};
const mirror=JSON.stringify({balance:10,entries:[]});
const base={format:'studyvillage-backup',version:CURRENT_BACKUP_VERSION,players:[player],settings:[{key:`compat:stars:${encodeURIComponent(player.name)}`,value:mirror}],activities:[],activityRecords:[],errorReports:[],scoreLedger:[],scoreAlertReviews:[],scoreCorrections:[]};

assert.equal(validateStudyvillageBackupWithStars(base).ok,true);
assert.equal(validateStudyvillageBackupWithStars({...base,players:[{...player,stars:-1}]}).code,'invalid-player-stars');
assert.equal(validateStudyvillageBackupWithStars({...base,settings:[{key:'compat:stars:%E0%A4%A',value:mirror}]}).code,'invalid-star-backup-key');
assert.equal(validateStudyvillageBackupWithStars({...base,settings:[{key:`compat:stars:${encodeURIComponent('없는학생')}`,value:mirror}]}).code,'orphan-star-backup-setting');
assert.equal(validateStudyvillageBackupWithStars({...base,players:[{...player,stars:9}]}).code,'star-balance-mismatch');

console.log('star backup cross-check self-test passed');
