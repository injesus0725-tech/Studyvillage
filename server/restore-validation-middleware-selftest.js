import assert from 'node:assert/strict';
import { installRestoreValidationMiddleware } from './restore-validation-middleware.js';

function makeApp(){const routes=[];return{routes,post(path,...handlers){routes.push({path,handlers})}}}
function makeRes(){return{statusCode:200,body:null,status(code){this.statusCode=code;return this},json(body){this.body=body;return this}}}

// Invalid backup must stop before next()/restore executor.
{
  const app=makeApp();installRestoreValidationMiddleware(app,{requireAdmin:(_req,_res,next)=>next()});
  const route=app.routes.find(r=>r.path==='/api/admin/restore');assert.ok(route);
  const middleware=route.handlers.at(-1),req={body:{format:'not-studyvillage'}},res=makeRes();let nextCalls=0;
  middleware(req,res,()=>{nextCalls++});
  assert.equal(nextCalls,0);assert.equal(res.statusCode,400);assert.equal(res.body?.ok,false);
}

// Prepared current backup must pass exactly once and replace req.body only after validation.
{
  const app=makeApp();installRestoreValidationMiddleware(app,{requireAdmin:(_req,_res,next)=>next()});
  const route=app.routes.find(r=>r.path==='/api/admin/restore'),middleware=route.handlers.at(-1);
  const original={format:'studyvillage-backup',version:9,exportedAt:new Date().toISOString(),players:[],settings:[],activities:[],activityRecords:[],errorReports:[],scoreLedger:[],scoreAlertReviews:[],scoreCorrections:[]};
  const req={body:original},res=makeRes();let nextCalls=0;
  middleware(req,res,()=>{nextCalls++});
  assert.equal(nextCalls,1);assert.equal(req.body?.format,'studyvillage-backup');assert.equal(req.body?.version,9);assert.ok(req.studyvillageRestorePreparation);assert.equal(res.body,null);
}

console.log('restore validation middleware selftest: ok');
