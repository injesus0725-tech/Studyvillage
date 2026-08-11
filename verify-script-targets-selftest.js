const fs=require('fs');
const path=require('path');
const assert=require('assert');

const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));
const verify=String(pkg&&pkg.scripts&&pkg.scripts.verify||'');
assert.ok(verify,'package.json에 verify 스크립트가 필요합니다.');

const commands=verify.split('&&').map(part=>part.trim()).filter(Boolean);
const missing=[];
for(const command of commands){
  const match=command.match(/^node(?:\s+--check)?\s+([^\s]+\.js)$/);
  if(!match) continue;
  const target=match[1];
  if(!fs.existsSync(path.resolve(target))) missing.push(target);
}

assert.deepStrictEqual(
  missing,
  [],
  `verify가 존재하지 않는 JS 파일을 참조합니다: ${missing.join(', ')}`
);

console.log('verify script targets self-test passed');
