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

const legacy=structuredClone(base);
legacy.version=8;
const legacyBefore=JSON.stringify(legacy);
const migrated=prepareStudyvillageRestore(legacy);
assert.equal(migrated.ok,true,'supported legacy backup should migrate and pass');
assert.equal(migrated.fromVersion,8,'legacy source version should be reported');
assert.equal(migrated.toVersion,9,'legacy backup should migrate to current version');
assert.equal(migrated.migrated,true,'legacy backup should report migration');
assert.equal(migrated.starMirrorCount,1,'legacy migration should preserve star mirror settings');
assert.equal(JSON.stringify(legacy),legacyBefore,'legacy restore preparation must not mutate input');

const broken=structuredClone(base);
broken.settings[0].value=JSON.stringify({balance:-1,entries:[]});
const bad=prepareStudyvillageRestore(broken);
assert.equal(bad.ok,false,'invalid star mirror should be rejected');
assert.equal(bad.code,'invalid-star-backup-setting');

const currentCustomization=structuredClone(base);
currentCustomization.players[0].equipment_json=JSON.stringify({
  face:'face-round',expression:'expression-smile',effect:'aurora-effect',pet:'pet-maltese-production'
});
currentCustomization.players[0].owned_items_json=JSON.stringify(['aurora-effect','pet-maltese-production']);
assert.equal(prepareStudyvillageRestore(currentCustomization).ok,true,'current face, expression, effect and production pet must restore');

const unknownSlot=structuredClone(currentCustomization);
unknownSlot.players[0].equipment_json=JSON.stringify({cape:'unknown-cape'});
assert.equal(prepareStudyvillageRestore(unknownSlot).code,'invalid-player-customization','unknown equipment slots must remain blocked');

const unownedPaidItem=structuredClone(currentCustomization);
unownedPaidItem.players[0].owned_items_json='[]';
assert.equal(prepareStudyvillageRestore(unownedPaidItem).code,'equipped-item-not-owned','unowned paid equipment must remain blocked');

console.log('[Studyvillage] restore preparation selftest passed');
