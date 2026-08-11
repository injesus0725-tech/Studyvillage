/* v1.9 runtime hot-path contract selftest.
   Development-only: keeps frequent classroom endpoints memory-based and bounded. */
import fs from 'node:fs';

const source=fs.readFileSync(new URL('./server.js',import.meta.url),'utf8');

const heartbeat="app.post('/api/presence/heartbeat'";
const liveEvents="app.get('/api/live-events'";
if(!source.includes(heartbeat))throw new Error('presence heartbeat route missing');
if(!source.includes(liveEvents))throw new Error('live events route missing');

const heartbeatSlice=source.slice(source.indexOf(heartbeat),source.indexOf(heartbeat)+500);
if(!/presence\.set\(/.test(heartbeatSlice))throw new Error('heartbeat must stay memory-based');
if(/db\.prepare|SELECT|INSERT|UPDATE|DELETE/.test(heartbeatSlice))throw new Error('heartbeat hot path unexpectedly touches database');

const liveSlice=source.slice(source.indexOf(liveEvents),source.indexOf(liveEvents)+1200);
if(!/liveEvents\.filter/.test(liveSlice))throw new Error('live-events route should read bounded in-memory queue');
if(/db\.prepare|SELECT|INSERT|UPDATE|DELETE/.test(liveSlice))throw new Error('live-events hot path unexpectedly touches database');
if(!/liveEvents\.length>50/.test(source))throw new Error('live event queue bound missing');

console.log('runtime lightweight server contract selftest passed');
