const assert=require('node:assert/strict');
const fs=require('node:fs');

const ranking=fs.readFileSync('assets/student-stability-fixes.js','utf8');
assert.match(ranking,/\.sv-rank-name\{min-width:0\}/,'ranking text must shrink inside its own column');
assert.match(ranking,/@media\(max-width:700px\)\{\.sv-rank-row\{grid-template-columns:38px 72px minmax\(0,1fr\)!important\}/,'narrow ranking cards must reserve the full 72px avatar width');
assert.doesNotMatch(ranking,/grid-template-columns:38px 58px/,'narrow cards must not place a 72px avatar in a 58px column');
console.log('student ranking narrow layout contract self-test passed');
