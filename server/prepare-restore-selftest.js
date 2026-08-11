/* v1.9 restore preparation smoke test. Uses in-memory objects only; no DB access or writes. */
import assert from 'node:assert/strict';
import { prepareStudyvillageRestore } from './prepare-restore.js';

const player={
  id:1,name:'검증학생',password_hash:'hash',password_salt:'salt',
  total_score:0,attempts:0,best_score:0,last_score:0,login_count:0,last_login_at:null,xp:0,
  base_character:'student-default',equipment_json:'{}',owned_items_json:'[]',
  created_at:'2026-08-11T00:00:00.000Z',updated_at:'2026-08-11T00:00:00.000Z'
};
const validMirror=JSON.stringify({balance:25,entries:[{beforeValue:0,afterValue:25,delta:25,kind:'teacher-adjustment',referenceId:null,detail:'selftest',createdAt:'2026-08-11T00:00:00.000Z'}]});
const base={
  format:'studyvillage-backup',version:9,players:[player],
  settings:[{key:`compat:stars:${encodeURIComponent(player.name)}`,value:validMirror}],
  activities:[],activityRecords:[],errorReports:[],scoreLedger:[],scoreAlertReviews:[],scoreCorrections:[]
};

const before=JSON.stringify(base);
const good=prepareStudyvillageRestore(base);
assert.equal(good.ok,true,'valid backup should pass restore preparation');
assert.equal(good.starMirrorCount,1,'star mirror should be counted');
assert.equal(JSON.stringify(base),before,'restore preparation must not mutate input');

const broken=structuredClone(base);
broken.settings[0].value=JSON.stringify({balance:-1,entries:[]});
const bad=prepareStudyvillageRestore(broken);
assert.equal(bad.ok,false,'invalid star mirror should be rejected');
assert.equal(bad.code,'invalid-star-backup-setting');

console.log('[Studyvillage] restore preparation selftest passed');
