/* v1.9 source contract for retry-safe activity saves. */
import fs from 'node:fs';

const client=fs.readFileSync(new URL('./library-game.js',import.meta.url),'utf8');
const server=fs.readFileSync(new URL('./server/activity-attempt-student.js',import.meta.url),'utf8');

for(const token of ['submissionId','newSubmissionId','saveCheckpoint']){
  if(!client.includes(token))throw new Error(`library-game.js: missing ${token}`);
}
if(!/body:JSON\.stringify\(\{activityId:ACTIVITY_ID,score,submissionId\}\)/.test(client))throw new Error('library-game.js: submissionId is not sent with activity save');
if(!server.includes('recentSubmissions'))throw new Error('activity-attempt-student.js: recent submission cache missing');
if(!server.includes('deduplicated:true'))throw new Error('activity-attempt-student.js: duplicate response marker missing');
if(!server.includes('rememberSubmission(name,activityId,submissionId,result)'))throw new Error('activity-attempt-student.js: successful submission is not cached');
if(!server.includes('SUBMISSION_TTL_MS'))throw new Error('activity-attempt-student.js: dedupe cache is not bounded by time');

console.log('activity submission idempotency contract passed');
