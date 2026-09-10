const assert=require('assert');
const fs=require('fs');
const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));
const files=pkg.build?.files||[];
assert(files.includes('curriculum-question-bank.js'),'the expanded curriculum bank must be included in the Windows classroom build');
for(const page of ['index.html','admin.html']){
  const html=fs.readFileSync(page,'utf8');
  assert(html.indexOf('question-data.js')<html.indexOf('curriculum-question-bank.js'),`${page} must load the base bank before the curriculum bank`);
  assert(html.indexOf('curriculum-question-bank.js')<html.indexOf('assets/student-question-overrides.js')||page==='admin.html',`${page} must register curriculum questions before student overrides`);
}
console.log('curriculum question bank packaging contract self-test passed');
