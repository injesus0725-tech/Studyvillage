/* v1.9 classroom runtime polling budget guard.
   Development-only selftest: prevents accidental high-frequency polling from creeping into normal classroom runtime. */
import fs from 'node:fs';

const checks=[
  {file:'admin-presence.js',minimumMs:8000,requiresHiddenGuard:true,requiresOnlineGuard:false},
  {file:'admin-score-alerts.js',minimumMs:20000,requiresHiddenGuard:true,requiresOnlineGuard:false},
  {file:'presence.js',minimumMs:12000,requiresHiddenGuard:true,requiresOnlineGuard:true},
  {file:'live-events.js',minimumMs:2500,requiresHiddenGuard:true,requiresOnlineGuard:true},
  {file:'error-reporter.js',minimumMs:8000,requiresHiddenGuard:true,requiresOnlineGuard:true},
  {file:'customize.js',minimumMs:3000,requiresHiddenGuard:true,requiresOnlineGuard:true}
];

for(const check of checks){
  const source=fs.readFileSync(new URL(`./${check.file}`,import.meta.url),'utf8');
  const matches=[...source.matchAll(/setInterval\s*\([^,]+,\s*(?:([0-9]+)|([A-Z_]+))\s*\)/g)].map(m=>m[1]?Number(m[1]):m[2]==='FLUSH_MS'?10000:NaN).filter(Number.isFinite);
  if(!matches.length)throw new Error(`${check.file}: polling interval not found`);
  if(matches.some(ms=>ms<check.minimumMs))throw new Error(`${check.file}: polling interval is too aggressive (${matches.join(',')}ms)`);
  if(check.requiresHiddenGuard&&!/document\.hidden/.test(source))throw new Error(`${check.file}: background/hidden-page polling guard is missing`);
  if(check.requiresOnlineGuard&&!/navigator\.onLine/.test(source))throw new Error(`${check.file}: offline polling guard is missing`);
  if(!/polling|pinging|loading|flushing|flushTimer/.test(source))throw new Error(`${check.file}: overlapping request guard is missing`);
}

console.log('runtime polling budget selftest passed');
