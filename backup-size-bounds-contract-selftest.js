const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/backup-validator.js','utf8');
for(const token of [
  'players:500',
  'settings:2000',
  'activities:50000',
  'activityRecords:50000',
  'errorReports:10000',
  'scoreLedger:200000',
  'scoreAlertReviews:200000',
  'scoreCorrections:50000',
  "fail('too-many-records'",
  's.value.length>200000',
  'value.length>50000',
  "String(row?.stack??'').length>5000",
  "String(row?.recent_events_json??'').length>12000"
])assert.ok(src.includes(token),`backup size guard missing: ${token}`);
console.log('backup size bounds contract self-test passed');
