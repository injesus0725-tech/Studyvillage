import express from 'express';
import Database from 'better-sqlite3';
import crypto from 'node:crypto';
import os from 'node:os';
import path from 'node:path';
import QRCode from 'qrcode';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const db = new Database(path.join(__dirname, 'studyvillage.db'));
const app = express();
const PORT = Number(process.env.PORT) || 3000;
const sessions = new Map();
const adminSessions = new Map();

app.use(express.json({ limit: '32kb' }));
app.use(express.static(rootDir));

db.pragma('journal_mode = WAL');
db.exec(`
CREATE TABLE IF NOT EXISTS players (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  total_score INTEGER NOT NULL DEFAULT 0,
  attempts INTEGER NOT NULL DEFAULT 0,
  best_score INTEGER NOT NULL DEFAULT 0,
  last_score INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
`);

function hashPassword(password, salt) { return crypto.scryptSync(password, salt, 64).toString('hex'); }
function safePlayer(row) { return { name: row.name, totalScore: row.total_score, attempts: row.attempts, bestScore: row.best_score, lastScore: row.last_score, updatedAt: row.updated_at }; }
function createSession(name) { const token = crypto.randomBytes(32).toString('hex'); sessions.set(token, { name, createdAt: Date.now() }); return token; }
function createAdminSession() { const token = crypto.randomBytes(32).toString('hex'); adminSessions.set(token, { createdAt: Date.now() }); return token; }
function bearer(req) { const auth = String(req.headers.authorization || ''); return auth.startsWith('Bearer ') ? auth.slice(7) : ''; }
function requireSession(req, res, next) { const session = sessions.get(bearer(req)); if (!session) return res.status(401).json({ ok:false, code:'not-authenticated' }); req.session = session; next(); }
function requireAdmin(req, res, next) { if (!adminSessions.has(bearer(req))) return res.status(401).json({ ok:false, code:'admin-not-authenticated' }); next(); }
function classroomUrls() { const urls=[]; for (const [adapter,entries] of Object.entries(os.networkInterfaces())) for (const net of entries||[]) if (net.family==='IPv4'&&!net.internal) urls.push({adapter,address:net.address,url:`http://${net.address}:${PORT}`}); return urls; }
function getSetting(key){ return db.prepare('SELECT value FROM settings WHERE key=?').get(key)?.value || null; }
function setSetting(key,value){ db.prepare('INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value').run(key,value); }
function ensureAdminPassword(){
  if (getSetting('admin_hash') && getSetting('admin_salt')) return;
  const initial = process.env.STUDYVILLAGE_ADMIN_PASSWORD || 'teacher1234';
  const salt = crypto.randomBytes(16).toString('hex');
  setSetting('admin_salt', salt); setSetting('admin_hash', hashPassword(initial, salt));
  console.log('초기 관리자 비밀번호가 설정되었습니다. 기본값: teacher1234');
  console.log('첫 로그인 후 관리자 화면에서 반드시 변경하세요.');
}
ensureAdminPassword();

app.post('/api/login', (req,res)=>{
  const name=String(req.body?.name||'').trim().replace(/\s+/g,' ').slice(0,12), password=String(req.body?.password||'');
  if(!name||password.length<4||password.length>72) return res.status(400).json({ok:false,code:'invalid-input'});
  const existing=db.prepare('SELECT * FROM players WHERE name=?').get(name);
  if(!existing){const salt=crypto.randomBytes(16).toString('hex'),now=new Date().toISOString();db.prepare('INSERT INTO players (name,password_hash,password_salt,created_at,updated_at) VALUES (?,?,?,?,?)').run(name,hashPassword(password,salt),salt,now,now);const created=db.prepare('SELECT * FROM players WHERE name=?').get(name);return res.json({ok:true,isNew:true,token:createSession(name),player:safePlayer(created)});}
  const actual=Buffer.from(existing.password_hash,'hex'),candidate=Buffer.from(hashPassword(password,existing.password_salt),'hex');
  if(!(actual.length===candidate.length&&crypto.timingSafeEqual(actual,candidate))) return res.status(401).json({ok:false,code:'wrong-password'});
  res.json({ok:true,isNew:false,token:createSession(name),player:safePlayer(existing)});
});
app.get('/api/player/me',requireSession,(req,res)=>{const row=db.prepare('SELECT * FROM players WHERE name=?').get(req.session.name);if(!row)return res.status(404).json({ok:false,code:'not-found'});res.json({ok:true,player:safePlayer(row)});});
app.post('/api/player/me/record',requireSession,(req,res)=>{const clamp=(v,min,max)=>Math.max(min,Math.min(max,Number(v)||0));const now=new Date().toISOString();db.prepare('UPDATE players SET total_score=?,attempts=?,best_score=?,last_score=?,updated_at=? WHERE name=?').run(clamp(req.body?.totalScore,0,100000000),clamp(req.body?.attempts,0,1000000),clamp(req.body?.bestScore,0,1000),clamp(req.body?.lastScore,0,1000),now,req.session.name);const updated=db.prepare('SELECT * FROM players WHERE name=?').get(req.session.name);res.json({ok:true,player:safePlayer(updated)});});

app.post('/api/admin/login',(req,res)=>{
  const password=String(req.body?.password||'');const salt=getSetting('admin_salt'),expected=getSetting('admin_hash');
  const actual=Buffer.from(expected,'hex'),candidate=Buffer.from(hashPassword(password,salt),'hex');
  if(!(actual.length===candidate.length&&crypto.timingSafeEqual(actual,candidate))) return res.status(401).json({ok:false,code:'wrong-admin-password'});
  res.json({ok:true,token:createAdminSession()});
});
app.post('/api/admin/password',requireAdmin,(req,res)=>{
  const password=String(req.body?.password||''); if(password.length<6||password.length>72) return res.status(400).json({ok:false,code:'invalid-password'});
  const salt=crypto.randomBytes(16).toString('hex');setSetting('admin_salt',salt);setSetting('admin_hash',hashPassword(password,salt));adminSessions.clear();res.json({ok:true});
});
app.get('/api/admin/players',requireAdmin,(_req,res)=>{const rows=db.prepare('SELECT * FROM players ORDER BY best_score DESC,total_score DESC,attempts ASC,name ASC').all();res.json({ok:true,players:rows.map(safePlayer)});});
app.post('/api/admin/player/:name/reset-record',requireAdmin,(req,res)=>{const name=String(req.params.name||'').slice(0,12),now=new Date().toISOString();db.prepare('UPDATE players SET total_score=0,attempts=0,best_score=0,last_score=0,updated_at=? WHERE name=?').run(now,name);res.json({ok:true});});
app.post('/api/admin/player/:name/reset-password',requireAdmin,(req,res)=>{const name=String(req.params.name||'').slice(0,12),password=String(req.body?.password||'');if(password.length<4||password.length>72)return res.status(400).json({ok:false,code:'invalid-password'});const salt=crypto.randomBytes(16).toString('hex'),now=new Date().toISOString();db.prepare('UPDATE players SET password_hash=?,password_salt=?,updated_at=? WHERE name=?').run(hashPassword(password,salt),salt,now,name);res.json({ok:true});});
app.delete('/api/admin/player/:name',requireAdmin,(req,res)=>{const name=String(req.params.name||'').slice(0,12);db.prepare('DELETE FROM players WHERE name=?').run(name);for(const [token,session] of sessions)if(session.name===name)sessions.delete(token);res.json({ok:true});});

app.get('/api/ranking',(_req,res)=>{const rows=db.prepare('SELECT * FROM players ORDER BY best_score DESC,total_score DESC,attempts ASC,name ASC LIMIT 100').all();res.json({ok:true,players:rows.map(safePlayer)});});
app.get('/api/network',async(_req,res)=>{const urls=classroomUrls();const items=await Promise.all(urls.map(async item=>({...item,qr:await QRCode.toDataURL(item.url,{margin:1,width:320})})));res.json({ok:true,port:PORT,teacherUrl:`http://localhost:${PORT}`,urls:items});});
app.get('/api/health',(_req,res)=>res.json({ok:true,server:'Studyvillage classroom server'}));
app.listen(PORT,'0.0.0.0',()=>{console.log('');console.log('=============================================');console.log(' Studyvillage 교실 서버가 실행되었습니다.');console.log('=============================================');console.log(`접속/QR: http://localhost:${PORT}/connect.html`);console.log(`관리자: http://localhost:${PORT}/admin.html`);for(const {adapter,url} of classroomUrls())console.log(`학생 [${adapter}] ${url}`);console.log('');});