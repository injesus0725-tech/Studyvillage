const fs=require('fs'),assert=require('assert');
const html=fs.readFileSync('admin.html','utf8');
const nav=fs.readFileSync('assets/admin-dashboard-nav.js','utf8');
const modules=['admin.js','admin-student-edit.js','admin-checkpoints.js','admin-score-alerts.js','admin-question-review.js','admin-question-editor.js','admin-stars.js','admin-shop.js','admin-attempt-policy.js','admin-exploration-collections.js','admin-presence.js','admin-live-events.js','admin-activity-state.js','admin-errors.js','assets/admin-runtime-fixes.js','assets/admin-modal-actions.js'];
for(const file of modules){assert.ok(fs.existsSync(file),`${file} must exist`);const src=file.startsWith('assets/')?file:file;assert.ok(html.includes(`src="${src}`),`${file} must be loaded by admin.html`)}
assert.ok(html.lastIndexOf('assets/admin-dashboard-nav.js')>html.lastIndexOf('assets/admin-modal-actions.js'),'dashboard nav must load after action wiring');
for(const id of ['students','activities','questions','shop','explore','system'])assert.ok(nav.includes(`id:'${id}'`),`dashboard group ${id} must exist`);
for(const selector of ['#score-alert-panel','#student-activity-panel','#admin-star-panel','#attempt-policy-panel','#shop-admin-panel'])assert.ok(nav.includes(selector),`dashboard must explicitly own ${selector}`);
assert.ok(nav.includes('activeGroup')&&nav.includes('applyVisibility')&&nav.includes('MutationObserver'),'dashboard must keep group state when dynamic panels are inserted');
assert.ok(nav.includes("studyvillage:admin-menu-change")&&nav.includes("studyvillage:admin-open-group"),'dashboard must expose navigation events');
const serverFiles=['server/server.js','server/activity-attempt-settings.js','server/activity-attempt-overview.js','server/activity-attempt-exceptions.js','server/activity-state.js','server/question-review.js','server/question-overrides.js','server/star-ledger.js','server/item-shop.js'].map(f=>fs.readFileSync(f,'utf8')).join('\n');
for(const route of ['/api/admin/players','/api/admin/activity','/api/admin/shop','/api/admin/activity-attempt-policies','/api/admin/activity-attempt-overview','/api/admin/presence','/api/admin/live-events','/api/admin/errors'])assert.ok(serverFiles.includes(route),`server must expose ${route}`);
console.log('admin dashboard connection contract self-test passed');
