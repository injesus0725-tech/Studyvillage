import express from 'express';
import Database from 'better-sqlite3';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const db = new Database(path.join(__dirname, 'studyvillage.db'));
const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());
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

app.post('/api/login', (req, res) => {
  const name = String(req.body?.name || '').trim().slice(0, 12);
  const password = String(req.body?.password || '');
  if (!name || password.length < 4) return res.status(400).json({ ok: false, code: 'invalid-input' });

  const existing = db.prepare('SELECT * FROM players WHERE name = ?').get(name);
  if (!existing) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = hashPassword(password, salt);
    const now = new Date().toISOString();
    db.prepare(`INSERT INTO players (name,password_hash,password_salt,created_at,updated_at) VALUES (?,?,?,?,?)`).run(name, hash, salt, now, now);
    const created = db.prepare('SELECT * FROM players WHERE name = ?').get(name);
    return res.json({ ok: true, isNew: true, player: safePlayer(created) });
  }

  const valid = crypto.timingSafeEqual(
    Buffer.from(existing.password_hash, 'hex'),
    Buffer.from(hashPassword(password, existing.password_salt), 'hex')
  );
  if (!valid) return res.status(401).json({ ok: false, code: 'wrong-password' });
  res.json({ ok: true, isNew: false, player: safePlayer(existing) });
});

app.get('/api/player/:name', (req, res) => {
  const row = db.prepare('SELECT * FROM players WHERE name = ?').get(String(req.params.name || '').slice(0, 12));
  if (!row) return res.status(404).json({ ok: false, code: 'not-found' });
  res.json({ ok: true, player: safePlayer(row) });
});

app.post('/api/player/:name/record', (req, res) => {
  const name = String(req.params.name || '').slice(0, 12);
  const existing = db.prepare('SELECT * FROM players WHERE name = ?').get(name);
  if (!existing) return res.status(404).json({ ok: false, code: 'not-found' });

  const totalScore = Number(req.body?.totalScore) || 0;
  const attempts = Number(req.body?.attempts) || 0;
  const bestScore = Number(req.body?.bestScore) || 0;
  const lastScore = Number(req.body?.lastScore) || 0;
  const now = new Date().toISOString();
  db.prepare(`UPDATE players SET total_score=?, attempts=?, best_score=?, last_score=?, updated_at=? WHERE name=?`)
    .run(totalScore, attempts, bestScore, lastScore, now, name);
  const updated = db.prepare('SELECT * FROM players WHERE name = ?').get(name);
  res.json({ ok: true, player: safePlayer(updated) });
});

app.get('/api/ranking', (_req, res) => {
  const rows = db.prepare(`SELECT name,total_score,attempts,best_score,last_score,updated_at FROM players ORDER BY best_score DESC, total_score DESC, attempts ASC, name ASC LIMIT 100`).all();
  res.json({ ok: true, players: rows.map(safePlayer) });
});

app.get('/api/health', (_req, res) => res.json({ ok: true, server: 'Studyvillage classroom server' }));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Studyvillage classroom server running on port ${PORT}`);
  console.log(`Teacher PC: http://localhost:${PORT}`);
});
