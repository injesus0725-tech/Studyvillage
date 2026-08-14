/* v1.9 runtime hot-path contract selftest.
   Development-only: keeps frequent classroom endpoints memory-based and bounded. */
import fs from 'node:fs';

const source=fs.readFileSync(new URL('./server.js',import.meta.url),'utf8');

const heartbeat="app.post('/api/presence/heartbeat'";
const adminPresence="app.get('/api/admin/presence'";
const liveEvents="app.get('/api/live-events'";
const adminLiveEvents="app.post('/api/admin/live-events'";
for(const token of [heartbeat,adminPresence,liveEvents,adminLiveEvents])if(!source.includes(token))throw new Error(`runtime route missing: ${token}`);

const heartbeatStart=source.indexOf(heartbeat),heartbeatEnd=source.indexOf(adminPresence,heartbeatStart);
const heartbeatSlice=source.slice(heartbeatStart,heartbeatEnd);
if(!/presence\.set\(/.test(heartbeatSlice))throw new Error('heartbeat must stay memory-based');
if(/db\.prepare|SELECT|INSERT|UPDATE|DELETE/.test(heartbeatSlice))throw new Error('heartbeat hot path unexpectedly touches database');

const liveStart=source.indexOf(liveEvents),liveEnd=source.indexOf(adminLiveEvents,liveStart);
const liveSlice=source.slice(liveStart,liveEnd);
if(!/liveEvents\.filter/.test(liveSlice))throw new Error('live-events route should read bounded in-memory queue');
if(/db\.prepare|SELECT|INSERT|UPDATE|DELETE/.test(liveSlice))throw new Error('live-events hot path unexpectedly touches database');
if(!/liveEvents\.length>50/.test(source))throw new Error('live event queue bound missing');
if(!/expiresAt<=now/.test(source))throw new Error('expired live events must be pruned from memory');

console.log('runtime lightweight server contract selftest passed');
