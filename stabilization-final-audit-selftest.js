const fs=require('fs'),assert=require('assert');
const admin=fs.readFileSync('admin.html','utf8');
const index=fs.readFileSync('index.html','utf8');
const restore=fs.readFileSync('admin-restore-guard.js','utf8');
const migrator=fs.readFileSync('server/backup-migrator.js','utf8');
const network=fs.readFileSync('admin-network-guard.js','utf8');
const runtime=fs.readFileSync('assets/admin-runtime-fixes.js','utf8');
const expeditionMovement=fs.readFileSync('assets/expedition-direct-movement.js','utf8');
const homeMovement=fs.readFileSync('student-direct-movement.js','utf8');
const onboarding=fs.readFileSync('onboarding.js','utf8');
const attempt=fs.readFileSync('admin-attempt-policy.js','utf8');

for(const script of ['admin-network-guard.js','admin-restore-guard.js','admin-restore-preflight.js','assets/admin-runtime-fixes.js','admin-attempt-policy.js'])assert.ok(admin.includes(script),`${script} must load in admin.html`);
assert.ok(network.includes('REQUEST_TIMEOUT_MS=7000'),'teacher network requests must have a bounded wait');
assert.ok(runtime.includes('reset-password')&&runtime.includes('/xp')&&runtime.includes('/rename'),'teacher correction actions must be runtime guarded');
assert.ok(attempt.includes('activity-attempt-overview')&&attempt.includes('activity-attempt-policies'),'teacher attempt policy must read both policy and student state');

const guardVersion=Number(restore.match(/CURRENT_BACKUP_VERSION=(\d+)/)?.[1]);
const serverVersion=Number(migrator.match(/CURRENT_BACKUP_VERSION=(\d+)/)?.[1]);
assert.ok(guardVersion>0&&serverVersion>0,'backup versions must be discoverable');
assert.strictEqual(guardVersion,serverVersion,'browser restore guard and server migrator backup versions must match');
assert.ok(migrator.includes('verifyMigrationChain()'),'backup migration chain must self-verify');
assert.ok(restore.includes('MAX_FILE_BYTES'),'restore must reject unreasonable files before server mutation');

assert.ok(index.includes('가고 싶은 곳을 터치하거나 클릭하세요'),'student UI must explain pointer navigation');
assert.ok(index.includes('student-direct-movement.js?v=20260819b'),'home direct movement must load explicitly');
assert.ok(index.indexOf('game.js')<index.indexOf('world-camera.js')&&index.indexOf('world-camera.js')<index.indexOf('village-layout.js')&&index.indexOf('village-layout.js')<index.indexOf('student-direct-movement.js'),'home movement must bind only after canonical game and map layers exist');
assert.ok(!onboarding.includes("createElement('script')"),'onboarding must not race a dynamically injected movement controller');
assert.ok(!homeMovement.includes('movementKeys')&&!homeMovement.includes('blockKeyboard'),'home movement must not retain keyboard interception');
assert.ok(!index.includes('data-key="ArrowUp"')&&!index.includes('id="talk-button"')&&!index.includes('class="mobile-controls"'),'legacy on-screen movement controls must not return');
for(const script of ['assets/expedition-direct-movement.js','assets/expedition-discovery-walk.js','assets/student-expedition-attempt-status.js'])assert.ok(index.includes(script),`${script} must load in student runtime`);
assert.ok(expeditionMovement.includes('obstacleRects')&&expeditionMovement.includes('canStand'),'expedition movement must enforce obstacle collision');
assert.ok(expeditionMovement.includes('studyvillage:session-cleared'),'expedition movement must stop on session clear');

console.log('stabilization final audit self-test passed');
