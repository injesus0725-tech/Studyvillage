/* v1.9 retry safety contract across new and legacy activity save paths.
   Development-only: ensures network retries cannot award duplicate attempts/XP in either path. */
import fs from 'node:fs';

const modern=fs.readFileSync(new URL('./server/activity-attempt-student.js',import.meta.url),'utf8');
const legacy=fs.readFileSync(new URL('./server/riddle-attempt-student.js',import.meta.url),'utf8');

for(const token of ['submissionId','recentSubmissions','cachedSubmission','rememberSubmission','deduplicated:true']){
  if(!modern.includes(token))throw new Error(`modern activity retry guard missing: ${token}`);
}
if(!/newAttempts=Math\.max\(0,incoming\.attempts-current\.attempts\)/.test(legacy))throw new Error('legacy riddle path no longer derives retries from attempt delta');
if(!legacy.includes('const awardXp=newAttempts>0'))throw new Error('legacy riddle path may award XP without a new attempt');
if(!legacy.includes('nextAttempts=Math.max'))throw new Error('legacy riddle path may regress attempts on snapshot retry');

console.log('activity retry safety contract passed');
