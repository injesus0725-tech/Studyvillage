const {spawnSync}=require('child_process');
const tests=[
  'activity-taxonomy-selftest.js',
  'activity-save-transaction-contract-selftest.js',
  'avatar-motion-runtime-safety-contract-selftest.js',
  'backup-cross-reference-integrity-contract-selftest.js',
  'backup-equipment-ownership-contract-selftest.js',
  'backup-future-version-safety-contract-selftest.js',
  'error-reporter-polling-contract-selftest.js',
  'live-broadcast-safety-contract-selftest.js',
  'question-content-selftest.js',
  'restore-executor-single-run-contract-selftest.js',
  'restore-preflight-fail-closed-contract-selftest.js',
  'restore-star-ledger-reset-contract-selftest.js',
  'restore-validation-wiring-contract-selftest.js',
  'shop-price-validation-parity-contract-selftest.js',
  'shop-star-equipment-consistency-contract-selftest.js',
  'sqlite-classroom-write-safety-contract-selftest.js',
  'star-backup-ledger-integrity-contract-selftest.js',
  'student-building-interaction-safety-contract-selftest.js',
  'student-cross-device-profile-contract-selftest.js',
  'student-customize-immediate-equip-contract-selftest.js',
  'vocabulary-startup-timeout-cleanup-contract-selftest.js'
];
for(const file of tests){
  const result=spawnSync(process.execPath,[file],{stdio:'inherit'});
  if(result.status!==0)process.exit(result.status||1);
}
console.log('runtime critical extra selftests passed');
