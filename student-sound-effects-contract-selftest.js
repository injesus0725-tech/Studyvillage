const fs=require('fs'),assert=require('assert');
const sound=fs.readFileSync('sound-effects.js','utf8'),index=fs.readFileSync('index.html','utf8');
const game=fs.readFileSync('game.js','utf8'),library=fs.readFileSync('library-game.js','utf8'),math=fs.readFileSync('math-practice.js','utf8'),exploration=fs.readFileSync('assets/student-exploration-v2.js','utf8');
assert.ok(index.includes('sound-effects.js?v='),'student page must load the V1 sound manager');
assert.ok(index.indexOf('sound-effects.js')<index.indexOf('game.js?v='),'sound manager must load before activities');
for(const token of ['studyvillage-sound-enabled-v1',"button.id='sound-toggle'",'correct:', 'wrong:', 'reward:', 'danger:', 'angel:', 'villain:', 'mystery:', 'complete:', 'levelup:'])assert.ok(sound.includes(token),`sound manager missing ${token}`);
for(const [name,source] of [['challenge',game],['library',library],['math',math],['exploration',exploration]])assert.ok(source.includes('StudyVillageSound?.play'),`${name} must use the shared sound manager`);
assert.ok(exploration.includes("sound(kind='reward')")&&exploration.includes("'danger'"),'exploration reveals must distinguish reward and danger');
console.log('student sound effects contract self-test passed');
