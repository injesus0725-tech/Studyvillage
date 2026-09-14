const assert=require('assert');
const fs=require('fs');
const html=fs.readFileSync('index.html','utf8');
const css=fs.readFileSync('style.css','utf8');

for(const token of ['/* Student entrance interior */','content:"STUDYVILLAGE"','content:"학생 입장"','grid-template-columns:1fr 1fr','max-height:720px','env(safe-area-inset-top)','title-card #start-button'])assert.ok(css.includes(token),`student entrance styling is missing ${token}`);
for(const id of ['player-name','player-password','start-button','name-error'])assert.equal((html.match(new RegExp(`id="${id}"`,'g'))||[]).length,1,`student auth control ${id} must remain unique`);
const auth=html.search(/<script src="auth\.js(?:\?[^\"]*)?"><\/script>/),game=html.search(/<script src="game\.js(?:\?[^\"]*)?"><\/script>/);assert.ok(auth>=0&&game>=0&&auth<game,'authentication must still load before the game');
console.log('student entrance interior contract selftest passed');
