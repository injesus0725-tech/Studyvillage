const fs=require('fs');
const assert=require('assert');
const server=fs.readFileSync('server/server.js','utf8');
const review=fs.readFileSync('server/question-review.js','utf8');
const middleware=fs.readFileSync('server/restore-validation-middleware.js','utf8');

assert.ok(review.includes("import { installRestoreValidationMiddleware } from './restore-validation-middleware.js'"),'question review must import restore validation middleware');
assert.ok(review.includes('installRestoreValidationMiddleware(app,{requireAdmin})'),'restore validation middleware must be installed with admin auth');
assert.ok(middleware.includes("app.post('/api/admin/restore',requireAdmin,(req,res,next)=>"),'validation middleware must register the restore route');
assert.ok(middleware.includes('req.body=prepared.backup'),'only prepared backup may continue');
assert.ok(middleware.includes('return next()'),'validated request must explicitly continue');
const install=server.indexOf('installQuestionReviewRoutes(app,{getSetting,setSetting,requireAdmin})');
const destructive=server.indexOf("app.post('/api/admin/restore',requireAdmin,(req,res)=>");
assert.ok(install>=0&&destructive>=0&&install<destructive,'validation route registration must happen before destructive restore route');
console.log('restore route order contract self-test passed');
