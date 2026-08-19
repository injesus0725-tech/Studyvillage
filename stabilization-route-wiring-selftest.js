/* Stabilization audit: protect the assembled activity-attempt route wiring.
   This is intentionally source-level and side-effect free; it catches accidental route loss
   before we touch the student runtime or attempt-policy behavior. */
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(path,import.meta.url),'utf8');
const server=read('./server/server.js');
const stars=read('./server/star-ledger.js');
const review=read('./server/question-review.js');
const studentAttempts=read('./server/activity-attempt-student.js');
const settings=read('./server/activity-attempt-settings.js');
const overview=read('./server/activity-attempt-overview.js');
const menu=read('./assets/student-study-menu.js');

if(!/installStarLedgerRoutes\(app/.test(server))throw new Error('server: star-ledger route installer is not assembled');
if(!/installQuestionReviewRoutes\(app/.test(server))throw new Error('server: question-review route installer is not assembled');
if(!/installActivityAttemptStudentRoutes\(app/.test(stars))throw new Error('star-ledger: student attempt routes are not installed');
if(!/installActivityAttemptSettingRoutes\(app/.test(review))throw new Error('question-review: teacher attempt settings routes are not installed');
if(!/installActivityAttemptOverviewRoutes\(app/.test(review))throw new Error('question-review: teacher attempt overview route is not installed');
if(!/installActivityAttemptExceptionRoutes\(app/.test(review))throw new Error('question-review: extra-attempt routes are not installed');
if(!/activity-attempt-status\/:activityId/.test(studentAttempts))throw new Error('student attempt-status endpoint is missing');
if(!/api\/admin\/activity-attempt-policies/.test(settings))throw new Error('teacher attempt-policy endpoint is missing');
if(!/api\/admin\/activity-attempt-overview/.test(overview))throw new Error('teacher attempt-overview endpoint is missing');
if(!/exploration-forest-riddle/.test(menu)||!/exploration-mountain-riddle/.test(menu))throw new Error('expedition activity IDs are missing from student menu');
if(!/activity-attempt-status/.test(menu))throw new Error('expedition entry no longer checks attempt status');

console.log('stabilization route wiring selftest passed');
