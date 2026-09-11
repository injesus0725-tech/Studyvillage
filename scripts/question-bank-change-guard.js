#!/usr/bin/env node
'use strict';

const fs=require('fs');
const path=require('path');
const vm=require('vm');
const {execFileSync}=require('child_process');

const ROOT=path.resolve(__dirname,'..');
const DEFAULT_BASE='origin/stabilize-touch-buildings-20260820';
const ALLOWED_FILES=Object.freeze(['curriculum-question-bank.js','question-data.js']);

const git=(args)=>execFileSync('git',args,{cwd:ROOT,encoding:'utf8'}).trim();
const stable=(value)=>JSON.stringify(value);
const normalize=(value)=>String(value||'').replace(/\s+/g,' ').trim().toLowerCase();

function loadBank(readFile){
  const sandbox={window:{}};
  vm.createContext(sandbox);
  for(const file of ['question-data.js','curriculum-question-bank.js']){
    vm.runInContext(readFile(file),sandbox,{filename:file,timeout:3000});
  }
  return JSON.parse(JSON.stringify(sandbox.window.StudyVillageQuestionSets||{}));
}

function validateQuestion(question,label){
  if(!question||typeof question!=='object')throw new Error(`${label}: 문제 객체가 아닙니다.`);
  if(!String(question.id||'').trim())throw new Error(`${label}: ID가 없습니다.`);
  if(!String(question.question||'').trim())throw new Error(`${label}: 질문이 없습니다.`);
  if(!Array.isArray(question.options)||question.options.length<2)throw new Error(`${label}: 보기가 2개 미만입니다.`);
  if(question.options.some(option=>!String(option||'').trim()))throw new Error(`${label}: 빈 보기가 있습니다.`);
  const options=question.options.map(normalize);
  if(new Set(options).size!==options.length)throw new Error(`${label}: 중복 보기가 있습니다.`);
  if(!Number.isInteger(question.answer)||question.answer<0||question.answer>=question.options.length)throw new Error(`${label}: 정답 번호가 보기 범위를 벗어났습니다.`);
  if(!String(question.explanation||'').trim())throw new Error(`${label}: 해설이 없습니다.`);
}

function validateBanks(before,after){
  const beforeKeys=Object.keys(before).sort(),afterKeys=Object.keys(after).sort();
  if(stable(beforeKeys)!==stable(afterKeys))throw new Error('단원/문제 세트의 추가·삭제·이름 변경이 감지되었습니다.');
  let added=0;
  const globalIds=new Set();
  for(const key of beforeKeys){
    const oldSet=before[key],newSet=after[key];
    const oldMeta={...oldSet},newMeta={...newSet};
    delete oldMeta.questions;delete newMeta.questions;
    if(stable(oldMeta)!==stable(newMeta))throw new Error(`${key}: 단원 메타데이터가 변경되었습니다.`);
    const oldQuestions=Array.isArray(oldSet.questions)?oldSet.questions:[];
    const newQuestions=Array.isArray(newSet.questions)?newSet.questions:[];
    if(newQuestions.length<oldQuestions.length)throw new Error(`${key}: 기존 문제가 삭제되었습니다.`);
    for(let index=0;index<oldQuestions.length;index++){
      if(stable(oldQuestions[index])!==stable(newQuestions[index]))throw new Error(`${key}: 기존 문제 ${index+1}번이 수정·이동되었습니다.`);
    }
    const seenQuestions=new Set();
    newQuestions.forEach((question,index)=>{
      const label=`${key} ${index+1}번`;
      validateQuestion(question,label);
      const id=String(question.id).trim();
      if(globalIds.has(id))throw new Error(`${label}: 중복 ID ${id}`);
      globalIds.add(id);
      const text=normalize(question.question);
      if(seenQuestions.has(text))throw new Error(`${label}: 같은 단원 안의 중복 질문입니다.`);
      seenQuestions.add(text);
    });
    added+=newQuestions.length-oldQuestions.length;
  }
  if(added<1)throw new Error('추가된 신규 문제가 없습니다.');
  return added;
}

function main(){
  const baseRef=process.argv[2]||process.env.QUESTION_BANK_BASE||DEFAULT_BASE;
  try{git(['rev-parse','--verify',baseRef]);}catch(error){throw new Error(`기준 ref ${baseRef}를 찾을 수 없습니다. 먼저 git fetch origin을 실행하세요.`)}
  const base=git(['merge-base','HEAD',baseRef]);
  const rows=git(['diff','--name-status',`${base}...HEAD`]).split(/\r?\n/).filter(Boolean);
  if(!rows.length)throw new Error('기준 브랜치 이후 변경 파일이 없습니다.');
  for(const row of rows){
    const [status,...parts]=row.split('\t'),file=parts.at(-1);
    if(status!=='M'||!ALLOWED_FILES.includes(file))throw new Error(`허용되지 않은 변경: ${row}`);
  }
  const before=loadBank(file=>git(['show',`${base}:${file}`]));
  const after=loadBank(file=>fs.readFileSync(path.join(ROOT,file),'utf8'));
  const added=validateBanks(before,after);
  console.log(`문제은행 전용 보호 검사 통과: 신규 ${added}문제, 변경 파일 ${rows.length}개`);
}

if(require.main===module){
  try{main()}catch(error){console.error(`문제은행 전용 보호 검사 실패: ${error.message}`);process.exit(1)}
}

module.exports={validateBanks,validateQuestion};
