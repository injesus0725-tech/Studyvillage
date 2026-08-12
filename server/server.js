/* v1.9: existing classroom APIs preserved; question review state is stored in backed-up settings. */
import express from 'express';
import Database from 'better-sqlite3';
import crypto from 'node:crypto';
import os from 'node:os';
import fs from 'node:fs';
import path from 'node:path';
import QRCode from 'qrcode';
import { fileURLToPath } from 'node:url';
import { installActivityStateRoutes } from './activity-state.js';
import { installQuestionReviewRoutes } from './question-review.js';
import { installStarLedgerRoutes } from './star-ledger.js';
import { CURRENT_BACKUP_VERSION } from './backup-migrator.js';

const __filename=fileURLToPath(import.meta.url),__dirname=path.dirname(__filename),rootDir=path.resolve(__dirname,'..');
const dataDir=process.env.STUDYVILLAGE_DATA_DIR||__dirname;fs.mkdirSync(dataDir,{recursive:true});
const dbPath=path.join(dataDir,'studyvillage.db'),db=new Database(dbPath),app=express(),PORT=Number(process.env.PORT)||3000;
const sessions=new Map(),adminSessions=new Map(),presence=new Map();
const liveEvents=[];let liveEventSeq=0;
app.use(express.json({limit:'2mb'}));app.use(express.static(rootDir));db.pragma('journal_mode = WAL');db.pragma('busy_timeout = 5000');
