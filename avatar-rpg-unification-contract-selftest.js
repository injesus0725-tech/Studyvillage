const fs=require('fs'),assert=require('assert');
const js=fs.readFileSync('assets/avatar-rpg-unification.js','utf8'),css=fs.readFileSync('assets/avatar-rpg-unification.css','utf8'),html=fs.readFileSync('index.html','utf8');
for(const id of ['expression-smile','expression-calm','expression-sparkle'])assert.ok(js.includes(`'${id}'`),`기본 표정 누락: ${id}`);
assert.ok(js.includes("face: 'face-round', expression"),'얼굴은 고정하고 표정만 저장해야 합니다.');
assert.ok(js.includes("'/api/player/me/equipment'")&&js.includes('rpg-expression-picker'),'표정 선택과 서버 저장이 연결되어야 합니다.');
for(const slot of ['hair','hat','glasses','outfit','bottom'])assert.ok(css.includes(`-${slot}.svg-asset`),`${slot} SVG 크기 통일 규칙이 필요합니다.`);
assert.ok(css.includes('studyvillage-rpg-walk-soft')&&!css.includes('steps('),'걷기 모션은 계단식으로 버벅이지 않아야 합니다.');
assert.ok(html.includes('avatar-rpg-unification.js')&&html.includes('avatar-rpg-unification.css'),'학생 화면에 RPG 통일 모듈이 포함되어야 합니다.');
console.log('avatar RPG unification contract self-test passed');
