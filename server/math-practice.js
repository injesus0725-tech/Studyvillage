/* Server-issued and server-scored Grade 3 random review sessions. Math playground shares teacher math-unit checks, while only auto-generatable unit types participate. */
import crypto from 'node:crypto';
import Database from 'better-sqlite3';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __filename=fileURLToPath(import.meta.url),__dirname=path.dirname(__filename);
const TTL_MS=30*60*1000,MAX_SESSIONS=1000,sessions=new Map(),ACTIVITY_ID='math-arithmetic',EXPLORATION_ACTIVITY_ID='exploration-math',CATALOG_KEY='question-catalog:settings-v1';
const clean=(value,n=100)=>String(value??'').trim().slice(0,n),rand=(min,max)=>Math.floor(Math.random()*(max-min+1))+min,pick=a=>a[rand(0,a.length-1)];
function prune(now=Date.now()){for(const[id,row]of sessions)if(now-row.createdAt>TTL_MS)sessions.delete(id);while(sessions.size>MAX_SESSIONS)sessions.delete(sessions.keys().next().value)}
function addition(){const a=rand(101,899),b=rand(101,999-a);return{prompt:`${a} + ${b} = ?`,answer:a+b,unit:'1단원 덧셈과 뺄셈'}}
function subtraction(){const a=rand(201,999),b=rand(101,a-1);return{prompt:`${a} - ${b} = ?`,answer:a-b,unit:'1단원 덧셈과 뺄셈'}}
function addSub(){return Math.random()<.5?addition():subtraction()}
function planeShape(){const rows=[['삼각형의 변은 몇 개인가요?',3],['사각형의 변은 몇 개인가요?',4],['직사각형의 직각은 몇 개인가요?',4],['정사각형의 길이가 같은 변은 몇 개인가요?',4]];const[prompt,answer]=pick(rows);return{prompt,answer,unit:'2단원 평면도형'}}
function division(){const d=rand(2,9),q=rand(1,9);return{prompt:`${d*q} ÷ ${d} = ?`,answer:q,unit:'3단원 나눗셈'}}
function multiplication(){const a=rand(10,99),b=rand(2,9);return{prompt:`${a} × ${b} = ?`,answer:a*b,unit:'4단원 곱셈'}}
function length(){if(Math.random()<.5){const cm=rand(1,30),mm=rand(1,9);return{prompt:`${cm} cm ${mm} mm는 모두 몇 mm인가요?`,answer:cm*10+mm,unit:'5단원 길이와 시간'}}const km=rand(1,8),m=rand(1,999);return{prompt:`${km} km ${m} m는 모두 몇 m인가요?`,answer:km*1000+m,unit:'5단원 길이와 시간'}}
function time(){const h=rand(1,11),m=rand(0,9)*5,elapsed=rand(1,9)*5,total=h*60+m+elapsed;return{prompt:`${h}시 ${m}분부터 ${elapsed}분 후는 몇 시 몇 분인가요? 정답은 시각을 분으로 바꾼 값(예: 2시 10분 → 130)을 입력하세요.`,answer:total,unit:'5단원 길이와 시간'}}
function fraction(){const d=rand(2,10),a=rand(1,d-1),mode=rand(0,2);if(mode===0)return{prompt:`분수 ${a}/${d}에서 분자는 얼마인가요?`,answer:a,unit:'6단원 분수와 소수'};if(mode===1)return{prompt:`분수 ${a}/${d}에서 분모는 얼마인가요?`,answer:d,unit:'6단원 분수와 소수'};let b=rand(1,d-1);while(b===a)b=rand(1,d-1);return{prompt:`${a}/${d}와 ${b}/${d} 중 더 큰 분수의 분자를 입력하세요.`,answer:Math.max(a,b),unit:'6단원 분수와 소수'}}
function unitFraction(){let a=rand(2,10),b=rand(2,10);while(a===b)b=rand(2,10);return{prompt:`1/${a}와 1/${b} 중 더 큰 분수의 분모를 입력하세요.`,answer:Math.min(a,b),unit:'6단원 분수와 소수'}}
function decimal(){const whole=rand(0,9),tenth=rand(1,9);return{prompt:`${whole}.${tenth}에서 소수 첫째 자리 숫자는 무엇인가요?`,answer:tenth,unit:'6단원 분수와 소수'}}
function multiplication2(){const a=rand(101,299),b=rand(2,4);return{prompt:`${a} × ${b} = ?`,answer:a*b,unit:'1단원 곱셈'}}
function multiplicationTens(){const a=rand(11,49),b=rand(2,9)*10;return{prompt:`${a} × ${b} = ?`,answer:a*b,unit:'1단원 곱셈'}}
function division2(){const d=rand(2,9),q=rand(10,49),r=rand(0,d-1);return{prompt:`${d*q+r} ÷ ${d}의 몫은?`,answer:q,unit:'2단원 나눗셈'}}
function circle(){const radius=rand(2,20);if(Math.random()<.5)return{prompt:`반지름이 ${radius} cm인 원의 지름은 몇 cm인가요?`,answer:radius*2,unit:'3단원 원'};const diameter=radius*2;return{prompt:`지름이 ${diameter} cm인 원의 반지름은 몇 cm인가요?`,answer:radius,unit:'3단원 원'}}
function fraction2(){const d=rand(2,9),whole=rand(1,4),n=rand(1,d-1);return Math.random()<.5?{prompt:`${whole}와 ${n}/${d}을 가분수로 나타낼 때 분자는?`,answer:whole*d+n,unit:'4단원 분수'}:{prompt:`${whole*d+n}/${d}을 대분수로 나타낼 때 자연수 부분은?`,answer:whole,unit:'4단원 분수'}}
function capacity(){const l=rand(1,8),ml=rand(1,9)*100;return{prompt:`${l} L ${ml} mL는 모두 몇 mL인가요?`,answer:l*1000+ml,unit:'5단원 들이와 무게'}}
function weight(){const kg=rand(1,8),g=rand(1,9)*100;return{prompt:`${kg} kg ${g} g은 모두 몇 g인가요?`,answer:kg*1000+g,unit:'5단원 들이와 무게'}}
function pictograph(){const each=pick([2,5,10]),icons=rand(2,9);return{prompt:`그림그래프에서 그림 하나가 ${each}개를 나타냅니다. 그림이 ${icons}개라면 모두 몇 개인가요?`,answer:each*icons,unit:'6단원 그림그래프'}}
const GENERATOR_ROWS=Object.freeze([
 {unit:'1단원 덧셈과 뺄셈',modes:['mixed','addition'],make:addition},
 {unit:'1단원 덧셈과 뺄셈',modes:['mixed','subtraction'],make:subtraction},
 {unit:'2단원 평면도형',modes:['mixed'],make:planeShape},
 {unit:'3단원 나눗셈',modes:['mixed','division'],make:division},
 {unit:'4단원 곱셈',modes:['mixed','multiplication'],make:multiplication},
 {unit:'5단원 길이와 시간',modes:['mixed'],make:length},
 {unit:'5단원 길이와 시간',modes:['mixed'],make:time},
 {unit:'6단원 분수와 소수',modes:['mixed','fraction'],make:fraction},
 {unit:'6단원 분수와 소수',modes:['mixed','fraction'],make:unitFraction},
 {unit:'6단원 분수와 소수',modes:['mixed','fraction'],make:decimal},
 {semester:2,unit:'1단원 곱셈',modes:['mixed','multiplication'],make:multiplication2},
 {semester:2,unit:'1단원 곱셈',modes:['mixed','multiplication'],make:multiplicationTens},
 {semester:2,unit:'2단원 나눗셈',modes:['mixed','division'],make:division2},
 {semester:2,unit:'3단원 원',modes:['mixed'],make:circle},
 {semester:2,unit:'4단원 분수',modes:['mixed','fraction'],make:fraction2},
 {semester:2,unit:'5단원 들이와 무게',modes:['mixed'],make:capacity},
 {semester:2,unit:'5단원 들이와 무게',modes:['mixed'],make:weight},
 {semester:2,unit:'6단원 그림그래프',modes:['mixed'],make:pictograph}
]);
const VALID_MODES=new Set(['mixed','addition','subtraction','multiplication','division','fraction']);
function normalizeMode(value){const mode=clean(value,30).toLowerCase();return VALID_MODES.has(mode)?mode:'mixed'}
function readCatalogSettings(){let db;try{const dataDir=process.env.STUDYVILLAGE_DATA_DIR||__dirname;db=new Database(path.join(dataDir,'studyvillage.db'),{readonly:true,fileMustExist:false});const raw=db.prepare('SELECT value FROM settings WHERE key=?').get(CATALOG_KEY)?.value||'{}',value=JSON.parse(raw);return value&&typeof value==='object'&&!Array.isArray(value)?value:{}}catch{return{}}finally{try{db?.close()}catch{}}}
const mathUnitKey=unit=>`unit:수학|3|1|${unit}`;
function unitEnabled(unit,settings){return settings[mathUnitKey(unit)]?.enabled!==false}
const mathUnitKey2=unit=>`unit:수학|3|2|${unit}`;
function generatorsFor(mode,settings){const normalized=normalizeMode(mode);return GENERATOR_ROWS.filter(row=>row.modes.includes(normalized)&&(row.semester===2?settings[mathUnitKey2(row.unit)]?.enabled!==false:unitEnabled(row.unit,settings)))}
function makeProblem(mode='mixed',settings={}){const rows=generatorsFor(mode,settings);return rows.length?pick(rows).make():null}
function explain(problem){const p=problem.prompt,a=problem.answer;if(p.includes(' + '))return`각 자리의 수를 더하면 정답은 ${a}입니다.`;if(p.includes(' - '))return`각 자리에서 빼기를 계산하면 정답은 ${a}입니다.`;if(p.includes(' × '))return`앞의 수를 뒤의 수만큼 곱하면 ${a}입니다.`;if(p.includes(' ÷ '))return`나누는 수와 ${a}를 곱하면 나누어지는 수가 됩니다.`;if(p.includes('몇 mm'))return`1 cm는 10 mm이므로 단위를 mm로 바꾸어 더하면 ${a}입니다.`;if(p.includes('몇 m'))return`1 km는 1000 m이므로 단위를 m로 바꾸어 더하면 ${a}입니다.`;if(p.includes('분 후'))return`시각을 분으로 바꾸고 지난 시간을 더하면 ${a}분입니다.`;if(p.includes('원의 지름'))return`지름은 반지름의 2배이므로 정답은 ${a}입니다.`;if(p.includes('원의 반지름'))return`반지름은 지름의 절반이므로 정답은 ${a}입니다.`;if(p.includes('그림그래프'))return`그림 하나가 나타내는 수와 그림 수를 곱하면 ${a}입니다.`;if(p.includes('분자'))return`분수에서 가로선 위의 수가 분자이므로 정답은 ${a}입니다.`;if(p.includes('분모'))return`분수에서 가로선 아래의 수가 분모이므로 정답은 ${a}입니다.`;if(p.includes('직각')||p.includes('변은 몇'))return`도형의 기본 성질을 떠올리면 정답은 ${a}입니다.`;return`문제의 수와 단위를 차례로 확인하면 정답은 ${a}입니다.`}
export function installMathPracticeRoutes(app,{requireSession}){
  app.post('/api/player/me/math-practice/start',requireSession,(req,res)=>{prune();const mode=normalizeMode(req.body?.mode),activityId=req.body?.exploration===true?EXPLORATION_ACTIVITY_ID:ACTIVITY_ID,settings=readCatalogSettings(),available=generatorsFor(mode,settings);if(!available.length)return res.status(409).json({ok:false,code:'no-math-playground-unit-enabled',message:'선생님이 체크한 수학 단원 중 수학 놀이터에서 자동으로 만들 수 있는 문제가 없어요.'});const id=crypto.randomUUID(),problems=Array.from({length:5},()=>makeProblem(mode,settings));sessions.set(id,{id,name:req.session.name,mode,activityId,problems,createdAt:Date.now(),authorizedScore:null,finalized:false});res.json({ok:true,activityId,mode,sessionId:id,problems:problems.map((problem,index)=>({id:index+1,prompt:problem.prompt,unit:problem.unit}))})});
  app.post('/api/player/me/math-practice/:sessionId/check',requireSession,(req,res)=>{prune();const id=clean(req.params?.sessionId),row=sessions.get(id),index=Number(req.body?.index),answer=Number(req.body?.answer);if(!row||row.name!==req.session.name)return res.status(404).json({ok:false,code:'math-session-not-found'});if(!Number.isInteger(index)||index<0||index>=row.problems.length||!Number.isInteger(answer)||Math.abs(answer)>1000000)return res.status(400).json({ok:false,code:'invalid-math-answer'});res.json({ok:true,sessionId:id,index,correct:answer===row.problems[index].answer})});
  app.post('/api/player/me/math-practice/:sessionId/answers',requireSession,(req,res)=>{prune();const id=clean(req.params?.sessionId),row=sessions.get(id);if(!row||row.name!==req.session.name)return res.status(404).json({ok:false,code:'math-session-not-found'});const answers=req.body?.answers;if(!Array.isArray(answers)||answers.length!==row.problems.length||answers.some(value=>!Number.isInteger(Number(value))||Math.abs(Number(value))>1000000))return res.status(400).json({ok:false,code:'invalid-math-answers'});const correct=row.problems.reduce((sum,problem,index)=>sum+(Number(answers[index])===problem.answer?1:0),0),score=correct*20;row.authorizedScore=score;res.json({ok:true,activityId:row.activityId,sessionId:id,submissionId:id,correct,total:row.problems.length,score,solutions:row.problems.map(problem=>problem.answer),review:row.problems.map((problem,index)=>({number:index+1,prompt:problem.prompt,unit:problem.unit,studentAnswer:Number(answers[index]),answer:problem.answer,correct:Number(answers[index])===problem.answer,explanation:explain(problem)}))})})
}
export function validateMathCompletion({name,activityId,score,submissionId}){if(![ACTIVITY_ID,EXPLORATION_ACTIVITY_ID].includes(activityId))return{ok:true};prune();const row=sessions.get(submissionId);return row&&!row.finalized&&row.name===name&&row.activityId===activityId&&row.authorizedScore===score?{ok:true}:{ok:false,code:'unverified-math-completion'}}
export function finalizeMathCompletion({activityId,submissionId}){if([ACTIVITY_ID,EXPLORATION_ACTIVITY_ID].includes(activityId)){const row=sessions.get(submissionId);if(row)row.finalized=true}}
