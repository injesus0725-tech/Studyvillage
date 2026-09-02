const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/activity-attempt-student.js','utf8');
const settings=fs.readFileSync('server/activity-attempt-settings.js','utf8');
const riddle=fs.readFileSync('server/riddle-attempt-student.js','utf8');
const stars=fs.readFileSync('server/star-ledger.js','utf8');
const txStart=src.search(/(?:const\s+)?tx\s*=\s*db\.transaction\(\(\)=>\{/),txEnd=src.indexOf('const result=tx();',txStart),tx=src.slice(txStart,txEnd);
assert.ok(txStart>=0&&txEnd>txStart,'activity save transaction must exist');
for(const pattern of [
  /latestAttemptRecord\s*=\s*policyRecord\(db,name,activityId,latestPolicy,latest\|\|\{\}\)/,
  /latestDecision\s*=\s*evaluateWithExtra\(latestPolicy,latestAttemptRecord,latestExtra\)/,
  /adjusted\s*=\s*latestDecision\.awardXp\?growthAdjustedXp\(latestPlayer\.xp,baseXp\):0/,
  /nextGained\s*=\s*latestDecision\.awardXp\?Math\.max\(0,Math\.round\(adjusted\*explore\.multiplier\)\+explore\.findBonusXp\+explore\.xpDelta\):0/,
  /if\(nextGained\)db\.prepare\('UPDATE players SET xp=xp\+\?,updated_at=\? WHERE name=\?'\)/,
  /else db\.prepare\('UPDATE players SET updated_at=\? WHERE name=\?'\)/,
  /gainedXp\s*:\s*nextGained/,
  /policy\s*:\s*\{\.\.\.latestDecision\.policy,period:latestPolicy\?\.period\|\|'all-time'\}/
])assert.ok(pattern.test(tx),`latest XP policy guard missing: ${pattern}`);
const decisionAt=tx.search(/latestDecision\s*=\s*evaluateWithExtra/),gainAt=tx.search(/nextGained\s*=\s*latestDecision\.awardXp\?Math\.max/),writeAt=tx.indexOf('UPDATE players SET xp=xp+?');
assert.ok(decisionAt>=0&&gainAt>decisionAt,'XP decision must come from latest policy evaluation');
assert.ok(writeAt>gainAt,'XP amount must be decided before player XP write');

// Every active core learning completion that the teacher authorizes must remain reward-bearing.
// Retired standalone riddle/social/science exploration policies must not be normalized back into the admin UI.
for(const activityId of ['library-vocabulary','math-arithmetic','curriculum-korean','curriculum-math','curriculum-social','curriculum-science','curriculum-arts','curriculum-integrated','exploration-korean','exploration-math','exploration-random']){
  assert.ok(settings.includes(`'${activityId}'`),`core reward activity missing: ${activityId}`);
}
assert.match(settings,/REPEAT_XP_ACTIVITIES=new Set\(\['library-vocabulary','math-arithmetic'/,'active repeat-XP activities must be protected from legacy first-completion saves');
assert.match(settings,/RETIRED_ACTIVITY_IDS=new Set\(\['riddle-demo','exploration-social','exploration-science'\]\)/,'retired standalone and subject explorations must stay filtered from saved policies');
for(const retired of ["'riddle-demo':Object.freeze","'exploration-social':Object.freeze","'exploration-science':Object.freeze"])assert.ok(!settings.includes(retired),`retired active policy returned: ${retired}`);
assert.match(settings,/REPEAT_XP_ACTIVITIES\.has\(id\)\?\{\.\.\.normalized,xpMode:'every-attempt'\}/,'saved core policies must be normalized to every-attempt rewards');
assert.match(settings,/'curriculum-integrated':Object\.freeze\(\{mode:'limited',limit:2,xpMode:'every-attempt',period:'daily'\}\)/,'integrated curriculum must never fall back to first-completion-only XP');

// The old riddle persistence path is retained only for compatibility with historical/stale sessions.
// If such a session is accepted, duplicate XP/star writes must still remain internally safe.
assert.match(riddle,/const awardXp=newAttempts>0&&\(policy\.xpMode==='every-attempt'\|\|latestPeriodAttempts===0\)/,'legacy riddle persistence must keep its reward guard');
assert.match(riddle,/const starReward=newAttempts>0&&commitRiddleReward\?commitRiddleReward/,'legacy riddle persistence must keep idempotent star commit wiring');

// Stars have no daily earning-total cap. Reward commits are deduplicated per submission/attempt,
// not by a per-day total. MAX_STARS is only an unreachable balance-corruption safety ceiling.
assert.ok(!/DAILY_(?:MAX|CAP|LIMIT)_[A-Z_]*STAR|dailyStar(?:Cap|Limit|Maximum)|starsToday(?:Cap|Limit|Maximum)/i.test(stars),'star ledger must not introduce a daily total earning cap');
assert.match(stars,/prior=db\.prepare\('SELECT after_value AS balance FROM star_ledger WHERE player_name=\? AND kind=\? AND reference_id=\? LIMIT 1'\)/,'activity stars must deduplicate by submission reference, not daily total');
assert.match(stars,/const stars=riddleStarsFor\(score\),before=player\.stars,after=before\+stars/,'legacy riddle star writes must remain idempotent for historical attempts');

// Retried network submissions may return the cached result, but must not award twice.
const cachedAt=src.indexOf('cachedSubmission(name,activityId,submissionId)'),txAt=src.indexOf('db.transaction(()=>{');
assert.ok(cachedAt>=0&&txAt>cachedAt,'submission deduplication must run before the reward transaction');
assert.match(src,/if\(cached\)return res\.json\(\{\.\.\.cached,deduplicated:true\}\)/,'duplicate submission must reuse the prior result');

console.log('activity policy change XP/star repeat reward contract self-test passed');
