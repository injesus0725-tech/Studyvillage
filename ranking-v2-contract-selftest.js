import assert from 'node:assert/strict';
import fs from 'node:fs';
import Database from 'better-sqlite3';
import { completeRankingPastWeeks } from './server/ranking-v2.js';
const server=fs.readFileSync('server/ranking-v2.js','utf8'),main=fs.readFileSync('server/server.js','utf8'),data=fs.readFileSync('data-service.js','utf8');
for(const phrase of ['weekly_ranking_snapshots',"scope IN ('player','activity')","field='total_score'",'Asia/Seoul','hallOfFame'])assert.ok(server.includes(phrase),`ranking v2 missing ${phrase}`);
assert.ok(server.includes("app.get('/api/ranking/v2',requireSession"),'ranking v2 must require a student session');
assert.ok(main.includes('installRankingV2Routes(app,{db,requireSession,playerView:safePlayer})'),'ranking v2 route must be installed without replacing activity saves');
assert.ok(data.includes("timedFetch('/api/ranking/v2'"),'student data service must read ranking v2');
assert.ok(main.includes('aggregatePlayerRecord(r)'),'player profile and cumulative ranking must include saved activity records');
assert.ok(!server.includes('UPDATE players')&&!server.includes('INSERT INTO score_ledger')&&!server.includes('INSERT INTO star_ledger'),'ranking v2 must not mutate player rewards or ledgers');

const db=new Database(':memory:');
db.exec(`
  CREATE TABLE players(name TEXT PRIMARY KEY,xp INTEGER NOT NULL,total_score INTEGER NOT NULL,stars INTEGER NOT NULL);
  CREATE TABLE score_ledger(player_name TEXT NOT NULL,scope TEXT NOT NULL,field TEXT NOT NULL,delta INTEGER NOT NULL,created_at TEXT NOT NULL);
`);
db.prepare('INSERT INTO players(name,xp,total_score,stars) VALUES(?,?,?,?)').run('지민',120,80,3);
db.prepare('INSERT INTO score_ledger(player_name,scope,field,delta,created_at) VALUES(?,?,?,?,?)').run('지민','activity','total_score',80,'2026-09-02T01:00:00.000Z');
completeRankingPastWeeks(db,new Date('2026-09-08T01:00:00.000Z'));
const snapshot=db.prepare('SELECT week_key AS weekKey,label,rankings_json AS rankingsJson FROM weekly_ranking_snapshots').get();
assert.equal(snapshot?.weekKey,'2026-08-31','the completed Aug 31-Sep 4 school week must be archived');
assert.equal(snapshot?.label,'9월 1주 랭킹');
assert.deepEqual(JSON.parse(snapshot?.rankingsJson||'[]'),[{name:'지민',weeklyScore:80,rank:1}],'activity-only scores must open the first hall of fame');
db.close();
console.log('ranking v2 read-only ledger and hall-of-fame contract self-test passed');
