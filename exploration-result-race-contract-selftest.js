const assert=require('assert');
const fs=require('fs');
const src=fs.readFileSync('village-layout.js','utf8');

assert.match(src,/result=await response\.json\(\)\.catch\(\(\)=>\(\{\}\)\)/,'failed expedition saves must parse safe server error codes');
assert.match(src,/error\.code=result\.code\|\|'save-failed'/,'server rejection codes must survive to the result UI');
assert.match(src,/error\?\.code==='attempt-limit-reached'/,'attempt races must have a terminal result state');
assert.match(src,/이번 결과는 기록되지 않았습니다/,'students must be told clearly when a raced result was not saved');
assert.match(src,/body\.querySelector\('button'\)\.onclick=leave}else/,'attempt limit rejection must return to the map, not retry forever');
assert.match(src,/window\.dispatchEvent\(new Event\('studyvillage:activity-record-refresh'\)\);refreshMapProgress\(\)/,'successful saves must refresh both records and map progress');
assert.match(src,/if\(explore\)explore\.hidden=false;refreshMapProgress\(\)/,'returning to the map must always refresh authoritative progress');
console.log('exploration result race contract selftest passed');
