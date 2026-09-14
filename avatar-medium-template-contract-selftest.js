require('./avatar-basic-pack-contract-selftest.js');
const assert=require('assert');
const fs=require('fs');
const renderer=fs.readFileSync('avatar-renderer.js','utf8'),css=fs.readFileSync('avatar-assets.css','utf8');
assert.ok(renderer.includes('onePiece:true'),'the shared outfit must retain the fixed head socket');
assert.ok(css.includes('#player.facing-left .player-icon,#player.facing-left .avatar-layer{transform:scaleX(1)')&&css.includes('#player.facing-right .player-icon,#player.facing-right .avatar-layer{transform:scaleX(-1)'),'the authored left-facing avatar must mirror only when walking right');
assert.ok(css.includes('.sv-rank-effect'),'ranking must layer the effect consistently');
console.log('new art fixed-anchor and movement contract passed');
