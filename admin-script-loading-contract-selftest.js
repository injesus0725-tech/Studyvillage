const fs=require('fs');
const assert=require('assert');

const html=fs.readFileSync('admin.html','utf8');
assert.ok(html.includes('admin-shop-production.js?v=20260901production1')&&!html.includes('src="admin-shop.js'), '관리자 상점은 이전 파일 캐시를 우회하는 새 production 진입점을 사용해야 합니다.');
assert.ok(JSON.parse(fs.readFileSync('package.json','utf8')).build.files.includes('admin-shop-production.js'),'휴대용 EXE에 새 관리자 상점 진입점을 포함해야 합니다.');
const adminFiles=[...html.matchAll(/<script\s+src="([^"]+\.js)(?:\?[^"]*)?"/g)].map(m=>m[1]);
const duplicates=adminFiles.filter((file,index)=>adminFiles.indexOf(file)!==index);
assert.deepStrictEqual(duplicates,[],'admin.html must not load the same script more than once');

const listed=new Set(adminFiles);
for(const file of adminFiles.filter(x=>x.startsWith('admin-'))){
  if(!fs.existsSync(file))continue;
  const src=fs.readFileSync(file,'utf8');
  for(const match of src.matchAll(/\.src\s*=\s*['"]([^'"]+\.js)['"]/g)){
    const injected=match[1];
    assert.ok(!listed.has(injected),`${file} dynamically injects ${injected}, which admin.html already loads`);
  }
}

const dialogIndex=html.indexOf('admin-dialog.js');
const adminIndex=html.indexOf('admin.js');
assert.ok(dialogIndex>=0&&dialogIndex<adminIndex,'EXE 호환 관리자 입력창은 관리자 기능보다 먼저 로드해야 합니다.');
assert.ok(JSON.parse(fs.readFileSync('package.json','utf8')).build.files.includes('admin-dialog.js'),'휴대용 EXE에 관리자 입력창 파일을 포함해야 합니다.');
assert.ok(!fs.readFileSync('admin-network-guard.js','utf8').includes('admin-direct-controls.js'),'중복 학생 직접 조정 패널을 다시 주입하면 안 됩니다.');
for(const file of ['admin.js','admin-student-edit.js','admin-question-editor.js','admin-question-review.js','admin-stars.js','admin-score-alerts.js','admin-errors.js']){
  assert.ok(!/\bprompt\s*\(/.test(fs.readFileSync(file,'utf8')),`${file}은 Electron에서 지원되지 않는 prompt()를 사용하면 안 됩니다.`);
}
const dialog=fs.readFileSync('admin-dialog.js','utf8'),studentEdit=fs.readFileSync('admin-student-edit.js','utf8'),stars=fs.readFileSync('admin-stars.js','utf8');
assert.ok(dialog.includes("for(const delay of [0,60,180,400])")&&dialog.includes("window.addEventListener('focus',focusInput)"),'Windows EXE 입력창은 열릴 때와 창 복귀 때 키보드 초점을 복구해야 합니다.');
assert.ok(studentEdit.includes("{type:'number',multiline:false,min:0,max}")&&stars.includes("{type:'number',multiline:false,min:1}"),'아이템 번호와 별 개수는 한 줄 숫자 입력칸을 사용해야 합니다.');

console.log('admin script loading contract self-test passed');
