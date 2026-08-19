const fs=require('fs');
const assert=require('assert');

const server=fs.readFileSync('server/server.js','utf8');
const questionReview=fs.readFileSync('server/question-review.js','utf8');
const starLedger=fs.readFileSync('server/star-ledger.js','utf8');
const admin=fs.readFileSync('admin.js','utf8');
const studentEdit=fs.readFileSync('admin-student-edit.js','utf8');
const stars=fs.readFileSync('admin-stars.js','utf8');
const attempts=fs.readFileSync('admin-attempt-policy.js','utf8');
const activityState=fs.readFileSync('admin-activity-state.js','utf8');

function has(src,needle,label){assert.ok(src.includes(needle),`${label}: missing ${needle}`)}

// Core student account writes.
has(admin,'/reset-record','admin reset-record client');
has(server,"app.post('/api/admin/player/:name/reset-record'",'server reset-record route');
has(admin,'/reset-password','admin password client');
has(server,"app.post('/api/admin/player/:name/reset-password'",'server password route');
has(admin,"method:'DELETE'",'admin delete client');
has(server,"app.delete('/api/admin/player/:name'",'server delete route');

// Teacher correction writes.
has(studentEdit,'/xp','admin XP correction client');
has(server,"app.post('/api/admin/player/:name/xp'",'server XP correction route');
has(studentEdit,'/custom-title','admin title correction client');
has(server,"app.post('/api/admin/player/:name/custom-title'",'server title correction route');
has(studentEdit,'/activity-records/','admin activity correction client');
has(server,"app.post('/api/admin/player/:name/activity-records/:activityId'",'server activity correction route');
has(studentEdit,'/rename','admin rename client');
has(server,"app.post('/api/admin/player/:name/rename'",'server rename route');

// Star writes are mounted indirectly through question-review -> star-ledger helpers.
has(stars,'/api/admin/stars/','admin star client');
has(questionReview,"app.post('/api/admin/stars/:name/adjust'",'admin star adjustment route');
has(questionReview,'changeStars(name,delta','star adjustment implementation');
has(starLedger,'export function changeStars','star ledger mutation helper');

// Attempt policy and extra attempt writes.
has(attempts,'/api/admin/activity-attempt-policies','attempt policy client');
has(questionReview,'installActivityAttemptSettingRoutes','attempt policy route installer');
has(attempts,'/grant','extra attempt client');
has(questionReview,'installActivityAttemptExceptionRoutes','extra attempt route installer');

// Activity open/close writes.
has(activityState,'/api/admin/activity-state/','activity state client');
has(server,'installActivityStateRoutes(app','activity state route installer');

console.log('stabilization admin write wiring self-test passed');
