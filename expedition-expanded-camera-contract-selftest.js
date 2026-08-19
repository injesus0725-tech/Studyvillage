const fs=require('fs'),assert=require('assert');
const camera=fs.readFileSync('assets/expedition-expanded-camera.js','utf8'),index=fs.readFileSync('index.html','utf8'),discovery=fs.readFileSync('assets/expedition-discovery-walk.js','utf8');
assert(index.includes('assets/expedition-expanded-camera.js'),'expanded expedition camera must load');
assert(camera.includes('scaleX=coarse?1.45:1.35')&&camera.includes('scaleY=coarse?1.35:1.25'),'expedition map must be larger than the visible room');
assert(camera.includes('host.style.transform=`translate('),'camera must follow the student across the larger map');
assert(camera.includes('Math.max(-maxX')&&camera.includes('Math.max(-maxY'),'camera must stay within map bounds');
assert(discovery.includes('opacity:0')&&discovery.includes("d<190")&&discovery.includes('randomPoint(host)'),'hidden discoveries must remain proximity-based and randomized');
console.log('expanded expedition camera contract: ok');
