import express from 'express';
import Database from 'better-sqlite3';
import crypto from 'node:crypto';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const db = new Database(path.join(__dirname, 'studyvillage.db'));
const app = express();
const PORT = Number(process.env.PORT) || 3000;
const sessions = new Map();

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
`);

function hashPassword(password, salt) {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}
function safePlayer(row) {
  return {
    name: row.name,
    totalScore: row.total_score,
    attempts: row.attempts,
    bestScore: row.best_score,
    lastScore: row.last_score,
    updatedAt: row.updated_at
  };
}
function createSession(name) {
  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, { name, createdAt: Date.now() });
  return token;
}
function requireSession(req, res, next) {
  const auth = String(req.headers.authorization || '');
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  const session = sessions.get(token);
  if (!session) return res.status(401).json({ ok: false, code: 'not-authenticated' });
  req.session = session;
  next();
}

app.post('/api/login', (req, res) => {
  const name = String(req.body?.name || '').trim().replace(/\s+/g, ' ').slice(0, 12);
  const password = String(req.body?.password || '');
  if (!name || password.length < 4 || password.length > 72) return res.status(400).json({ ok: false, code: 'invalid-input' });

  const existing = db.prepare('SELECT * FROM players WHERE name = ?').get(name);
  if (!existing) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = hashPassword(password, salt);
    const now = new Date().toISOString();
    db.prepare(`INSERT INTO players (name,password_hash,password_salt,created_at,updated_at) VALUES (?,?,?,?,?)`).run(name, hash, salt, now, now);
    const created = db.prepare('SELECT * FROM players WHERE name = ?').get(name);
    return res.json({ ok: true, isNew: true, token: createSession(name), player: safePlayer(created) });
  }

  const actual = Buffer.from(existing.password_hash, 'hex');
  const candidate = Buffer.from(hashPassword(password, existing.password_salt), 'hex');
  const valid = actual.length === candidate.length && crypto.timingSafeEqual(actual, candidate);
  if (!valid) return res.status(401).json({ ok: false, code: 'wrong-password' });
  res.json({ ok: true, isNew: false, token: createSession(name), player: safePlayer(existing) });
});

app.get('/api/player/me', requireSession, (req, res) => {
  const row = db.prepare('SELECT * FROM players WHERE name = ?').get(req.session.name);
  if (!row) return res.status(404).json({ ok: false, code: 'not-found' });
  res.json({ ok: true, player: safePlayer(row) });
});

app.post('/api/player/me/record', requireSession, (req, res) => {
  const existing = db.prepare('SELECT * FROM players WHERE name = ?').get(req.session.name);
  if (!existing) return res.status(404).json({ ok: false, code: 'not-found' });

  const clamp = (value, min, max) => Math.max(min, Math.min(max, Number(value) || 0));
  const totalScore = clamp(req.body?.totalScore, 0, 100000000);
  const attempts = clamp(req.body?.attempts, 0, 1000000);
  const bestScore = clamp(req.body?.bestScore, 0, 1000);
  const lastScore = clamp(req.body?.lastScore, 0, 1000);
  const now = new Date().toISOString();
  db.prepare(`UPDATE players SET total_score=?, attempts=?, best_score=?, last_score=?, updated_at=? WHERE name=?`)
    .run(totalScore, attempts, bestScore, lastScore, now, req.session.name);
  const updated = db.prepare('SELECT * FROM players WHERE name = ?').get(req.session.name);
  res.json({ ok: true, player: safePlayer(updated) });
});

app.get('/api/ranking', (_req, res) => {
  const rows = db.prepare(`SELECT * FROM players ORDER BY best_score DESC, total_score DESC, attempts ASC, name ASC LIMIT 100`).all();
  res.json({ ok: true, players: rows.map(safePlayer) });
});

app.get('/api/health', (_req, res) => res.json({ ok: true, server: 'Studyvillage classroom server' }));

function classroomUrls() {
  const urls = [];
  const nets = os.networkInterfaces();
  for (const entries of Object.values(nets)) {
    for (const net of entries || []) {
      if (net.family === 'IPv4' && !net.internal) urls.push(`http://${net.address}:${PORT}`);
    }
  }
  return urls;
}

app.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('=============================================');
  console.log(' Studyvillage 교실 서버가 실행되었습니다.');
  console.log('=============================================');
  console.log(`선생님 컴퓨터: http://localhost:${PORT}`);
  const urls = classroomUrls();
  if (urls.length) {
    console.log('학생 접속 주소:');
    urls.forEach(url => console.log(`  ${url}`));
  } else {
    console.log('학생 접속 주소를 찾지 못했습니다. 네트워크 연결을 확인하세요.');
  }
  console.log('');
});
