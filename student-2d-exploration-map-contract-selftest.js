const assert=require('assert');
const fs=require('fs');
const src=fs.readFileSync('village-layout.js','utf8');

assert.match(src,/classList\.add\('sv-route-map'\)/,'exploration chooser must switch to the 2D route map');
assert.match(src,/viewBox="0 0 560 410"/,'route art must use a scalable 2D coordinate system');
assert.match(src,/M70 345|M70 345|M70 345/,'route needs a visible journey path');
assert.match(src,/우리 학습마을/,'map must show the village starting point');
assert.match(src,/sv-route-node forest/,'forest must be an interactive map node');
assert.match(src,/sv-route-node mountain/,'mountain must be an interactive map node');
assert.match(src,/출발 → 🌲 숲 → 🏔️ 산/,'map must communicate exploration order');
assert.match(src,/\.sv-route-map button\.sv-route-node\.forest\{left:34%;top:22%\}/,'desktop nodes must occupy distinct 2D positions');
assert.match(src,/@media\(max-width:760px\),\(pointer:coarse\).*\.sv-explore-map\.sv-route-map\{height:470px\}/,'touch layouts must retain a usable map height');
assert.match(src,/map\.querySelectorAll\('button\[data-region\]'\)/,'visual nodes must retain existing expedition behavior');
console.log('student 2D exploration map contract selftest passed');
