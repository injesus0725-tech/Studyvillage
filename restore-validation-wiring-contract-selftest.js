const fs=require('fs');
const assert=require('assert');
const review=fs.readFileSync('server/question-review.js','utf8');
const middleware=fs.readFileSync('server/restore-validation-middleware.js','utf8');
const server=fs.readFileSync('server/server.js','utf8');

assert.ok(review.includes("import { installRestoreValidationMiddleware } from './restore-validation-middleware.js'"),'restore validation middleware must be imported');
assert.ok(review.includes('installRestoreValidationMiddleware(app,{requireAdmin})'),'restore validation middleware must be installed');
assert.ok(middleware.includes("app.post('/api/admin/restore',requireAdmin,(req,res,next)=>"),'validation must intercept the restore route first');
assert.ok(middleware.includes('req.body=prepared.backup'),'only validated/migrated backup may reach restore executor');
assert.ok(middleware.includes('return next()'),'valid restore must continue to the destructive executor');
const installIndex=server.indexOf('installQuestionReviewRoutes(app,{getSetting,setSetting,requireAdmin})');
const restoreIndex=server.indexOf("app.post('/api/admin/restore',requireAdmin");
assert.ok(installIndex>=0&&restoreIndex>=0&&installIndex<restoreIndex,'restore validation routes must be registered before destructive restore executor');
console.log('restore validation wiring contract self-test passed');
