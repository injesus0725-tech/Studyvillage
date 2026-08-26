const assert=require('assert');
const fs=require('fs');
const renderer=fs.readFileSync('avatar-renderer.js','utf8');
const css=fs.readFileSync('avatar-assets.css','utf8');

const efficientBasics=['cap-blue','glasses-round','explorer-goggles','star-monocle','glasses-sun','bottom-jeans','bottom-skirt','shoes-sneakers','backpack','field-satchel','book-pack','bag-art','hand-book','hand-magnifier','pet-chick','pet-cat','pet-owl','pet-fox','pet-dog','pet-rabbit','pet-slime'];
for(const id of efficientBasics)assert.match(renderer,new RegExp(`'${id}':\\{svg:`),`${id} must stay on the efficient small-screen SVG template path`);
for(const id of ['crown-gold','outfit-wizard','bottom-shorts','shoes-wing','hand-wand','pet-dragon'])assert.match(renderer,new RegExp(`'${id}':\\{src:`),`${id} must preserve its premium raster artwork`);
assert.ok(css.includes('saturate(1.12)')&&css.includes('contrast(1.04)'),'small-screen SVG polish must remain enabled');
console.log(`avatar medium template contract passed: ${efficientBasics.length} efficient basics, premium set preserved`);
