const fs=require('fs'),assert=require('assert');
const server=fs.readFileSync('server/server.js','utf8'),riddle=fs.readFileSync('server/riddle-attempt-student.js','utf8'),game=fs.readFileSync('game.js','utf8');
const tiers=[
  [2,'배움 여행자',null],[3,'성장하는 도전자','성장하는 학습자'],[5,'학습 탐험가','학습 탐험가'],
  [10,'숲길 개척자','숲길 개척자'],[20,'지혜의 길잡이','지혜의 길잡이'],[30,'별빛 연구자','별빛 연구자'],
  [40,'마을 수호자','마을 수호자'],[50,'전설의 학습가','전설의 학습가'],[60,'나만의 칭호',null]
];
for(const src of [server,riddle]){
  for(const [level,title,badge] of tiers){assert.ok(src.includes(`level:${level},title:'${title}'`),`Lv.${level} title preview must match real rewards`);if(badge)assert.ok(src.includes(`name:'${badge}'`),`Lv.${level} badge must be defined`)}
  assert.ok(src.includes("if(level>=50)title='전설의 학습가'"),'level titles must progress through Lv.50');
  assert.ok(src.includes("if((r.best_score||0)>=1000)title='수수께끼 마스터'"),'the existing perfect-score achievement title must remain available');
  assert.ok(src.includes('nextGrowthReward:nextGrowthRewardFor(progress.level)'),'student responses must derive previews from server level state')
}
assert.ok(game.includes("recordNextReward.id='record-next-growth-reward'"),'record UI needs a dedicated reward preview');
assert.ok(game.includes('recordNextReward.hidden=!reward'),'undefined future rewards must not show a fake promise');
assert.ok(game.includes('🎁 다음 성장 보상 · Lv.${reward.level} “${reward.title}”'),'preview must show the verified level and title');
console.log('student next growth reward contract self-test passed');
