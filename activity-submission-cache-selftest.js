/* v1.9 retry-cache safety contract.
   Read-only source check: keeps activity retry dedupe bounded and isolated without touching scores or question data. */
import fs from 'node:fs';

const source=fs.readFileSync(new URL('./server/activity-attempt-student.js',import.meta.url),'utf8');

if(!source.includes('MAX_RECENT_SUBMISSIONS=1000'))throw new Error('activity retry cache: maximum size guard missing');
if(!source.includes('while(recentSubmissions.size>MAX_RECENT_SUBMISSIONS)'))throw new Error('activity retry cache: size pruning missing');
if(!source.includes('`${name}\\u0000${activityId}\\u0000${submissionId}`'))throw new Error('activity retry cache: student/activity/submission isolation key missing');
if(!source.includes('/^[A-Za-z0-9._:-]{8,100}$/'))throw new Error('activity retry cache: submission id validation missing');

const cachedAt=source.indexOf('const name=req.session.name,cached=cachedSubmission');
const openDbAt=source.indexOf('db=openDb()');
if(cachedAt<0||openDbAt<0||cachedAt>openDbAt)throw new Error('activity retry cache: duplicate lookup must happen before database access');

console.log('activity submission cache selftest passed');
