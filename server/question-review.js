/* v1.10 teacher-only question review queue.
   Static question source is never changed here. Review/edit state is stored in settings so backup/restore preserves it. */
import { auditQuestionSet, summarizeQuestionAudits } from './question-audit.js';
import { installQuestionHistoryRoutes } from './question-history.js';
import { installQuestionOverrideRoutes } from './question-overrides.js';
import { installQuestionCatalogSettingRoutes } from './question-catalog-settings.js';
import { changeStars, starBalanceFor, starLedgerFor } from './star-ledger.js';
import { installItemShopRoutes } from './item-shop.js';
import { installActivityAttemptSettingRoutes } from './activity-attempt-settings.js';
import { installActivityAttemptOverviewRoutes } from './activity-attempt-overview.js';
import { installActivityAttemptExceptionRoutes } from './activity-attempt-exceptions.js';
import { installScoreAlertReadRoute } from './score-alert-route.js';
import { installAdminScoreHistoryRoutes } from './admin-score-history.js';
import { installRestorePreflightRoute } from './restore-preflight.js';
import { installRestoreValidationMiddleware } from './restore-validation-middleware.js';
import { installNetworkAccessRoute } from './network-access.js';

const STORE_KEY='question-review:queue-v1';
const clean=(v,n=240)=>String(v??'').trim().slice(0,n);
const keyFor=(activityId,issue)=>`${activityId}:${Number(issue.question)||0}:${clean(issue.code,80)}`;
function readQueue(getSetting){try{const rows=JSON.parse(getSetting(STORE_KEY)||'[]');return Array.isArray(rows)?rows:[]}catch{return[]}}
function writeQueue(setSetting,rows){setSetting(STORE_KEY,JSON.stringify(rows.slice(0,500)))}
function clientReviewRow(row){return{...row,questionNumber:Number(row?.question)||0,teacherNote:clean(row?.note,240)}}
function clientReviewPayload(rows){const reviews=rows.map(clientReviewRow),pendingCount=rows.filter(row=>row?.status==='needs-review').length;return{reviews,pendingCount}}
function normalizeClientReviewStatus(value){const status=clean(value,40);if(status==='pending')return'needs-review';if(status==='dismissed')return'ignored';return status}
function updateReview({getSetting,setSetting,key,status,note}){
  const normalized=normalizeClientReviewStatus(status);
  if(!['needs-review','confirmed','fixed','ignored'].includes(normalized))return{ok:false,code:'invalid-review-status',httpStatus:400};
  const rows=readQueue(getSetting),row=rows.find(x=>x.key===key);if(!row)return{ok:false,code:'review-not-found',httpStatus:404};
  row.status=normalized;row.note=note;row.updatedAt=new Date().toISOString();writeQueue(setSetting,rows);return{ok:true,item:clientReviewRow(row)};
}

export function installQuestionReviewRoutes(app,{requireAdmin,getSetting,setSetting}){
  installQuestionHistoryRoutes(app,{requireAdmin,getSetting,setSetting});
  installQuestionOverrideRoutes(app,{requireAdmin,getSetting,setSetting});
  installQuestionCatalogSettingRoutes(app,{requireAdmin,getSetting,setSetting});
  installItemShopRoutes(app,{requireAdmin});
  installActivityAttemptSettingRoutes(app,{requireAdmin,getSetting,setSetting});
  installActivityAttemptOverviewRoutes(app,{requireAdmin});
  installActivityAttemptExceptionRoutes(app,{requireAdmin,getSetting,setSetting});
  installScoreAlertReadRoute(app,{requireAdmin});
  installAdminScoreHistoryRoutes(app,{requireAdmin});
  installRestorePreflightRoute(app,{requireAdmin});
  installRestoreValidationMiddleware(app,{requireAdmin});
  installNetworkAccessRoute(app,{port:Number(process.env.PORT)||3000});

  app.get('/api/admin/stars/:name',requireAdmin,(req,res)=>{
    try{const name=clean(req.params.name,12),balance=starBalanceFor(name);if(balance===null)return res.status(404).json({ok:false,code:'player-not-found'});res.json({ok:true,name,balance,entries:starLedgerFor(name,{limit:req.query.limit})})}
    catch(err){res.status(500).json({ok:false,code:'star-ledger-read-failed',message:clean(err?.message||err,200)})}
  });
  app.post('/api/admin/stars/:name/adjust',requireAdmin,(req,res)=>{
    const name=clean(req.params.name,12),delta=Number(req.body?.delta),reason=clean(req.body?.reason,240);
    if(!Number.isInteger(delta)||delta===0)return res.status(400).json({ok:false,code:'invalid-star-change'});
    if(reason.length<2)return res.status(400).json({ok:false,code:'reason-required'});
    try{const result=changeStars(name,delta,{kind:'teacher-adjustment',referenceId:'admin',detail:reason});if(!result.ok)return res.status(result.code==='player-not-found'?404:409).json(result);res.json({...result,name,balance:result.afterValue})}
    catch(err){res.status(500).json({ok:false,code:'star-adjust-failed',message:clean(err?.message||err,200)})}
  });

  app.post('/api/admin/question-reviews/scan',requireAdmin,(req,res)=>{
    try{
      const sets=Array.isArray(req.body?.sets)?req.body.sets:[],previous=readQueue(getSetting),prevByKey=new Map(previous.map(row=>[row.key,row])),next=[];
      for(const set of sets){
        const activityId=clean(set?.activityId,40),questions=Array.isArray(set?.questions)?set.questions:[];
        if(!activityId||!questions.length)continue;
        const result=auditQuestionSet({activityId,questions});
        for(const issue of result.issues||[]){const key=keyFor(activityId,issue),old=prevByKey.get(key);next.push({key,activityId,question:Number(issue.question)||0,code:clean(issue.code,80),message:clean(issue.message,240),severity:clean(issue.severity,40)||'warning',status:old?.status||'needs-review',note:clean(old?.note,240),updatedAt:new Date().toISOString()})}
      }
      writeQueue(setSetting,next);const client=clientReviewPayload(next);res.json({ok:true,summary:summarizeQuestionAudits(next),items:next,...client});
    }catch(err){res.status(500).json({ok:false,code:'question-review-scan-failed',message:clean(err?.message||err)})}
  });
  app.get('/api/admin/question-reviews',requireAdmin,(req,res)=>{const rows=readQueue(getSetting),client=clientReviewPayload(rows);res.json({ok:true,summary:summarizeQuestionAudits(rows),items:rows,...client})});
  const saveReview=(req,res)=>{const result=updateReview({getSetting,setSetting,key:clean(req.params.key,200),status:req.body?.status,note:clean(req.body?.note,240)});if(!result.ok)return res.status(result.httpStatus).json({ok:false,code:result.code});res.json(result)};
  app.post('/api/admin/question-reviews/:key/review',requireAdmin,saveReview);
  app.post('/api/admin/question-reviews/:key',requireAdmin,saveReview);
}
