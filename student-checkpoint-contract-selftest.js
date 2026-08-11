import fs from 'node:fs';

const riddle=fs.readFileSync(new URL('./game.js',import.meta.url),'utf8');
const vocabulary=fs.readFileSync(new URL('./library-game.js',import.meta.url),'utf8');
const checkpoint=fs.readFileSync(new URL('./activity-checkpoint.js',import.meta.url),'utf8');

for(const token of ['save(playerName,activityId','load(playerName,activityId)','clear(playerName,activityId)']){
  if(!checkpoint.includes(token))throw new Error(`activity-checkpoint.js: missing ${token}`);
}
for(const token of ['saveQuizCheckpoint()','readQuizCheckpoint()','clearQuizCheckpoint()']){
  if(!riddle.includes(token))throw new Error(`game.js: missing riddle checkpoint step ${token}`);
}
for(const token of ['saveCheckpoint()','readCheckpoint()','clearCheckpoint()']){
  if(!vocabulary.includes(token))throw new Error(`library-game.js: missing vocabulary checkpoint step ${token}`);
}
if(!riddle.includes('이전에 풀던 수수께끼 기록이 있어요'))throw new Error('game.js: riddle resume prompt missing');
if(!vocabulary.includes('이전에 풀던 책마루 기록이 있어요'))throw new Error('library-game.js: vocabulary resume prompt missing');

console.log('student checkpoint contract selftest passed');
