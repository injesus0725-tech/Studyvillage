/* v0.9.36 activity-state server hook.
   Loaded before server.js by Electron. It installs persistent activity state routes
   just before the Express app starts listening, without changing the large server core. */
import express from 'express';
import Database from 'better-sqlite3';
import path from 'node:path';

const originalListen=express.application.listen;
let installed=false;

function isLocalRequest(req){
  const ip=String(req.socket?.remoteAddress||'');
  return ip==='127.0.0.1'||ip==='::1'||ip==='::ffff:127.0.0.1';
}

express.application.listen=function(...args){
  if(!installed){
    installed=true;
    const dataDir=process.env.STUDYVILLAGE_DATA_DIR||path.dirname(new URL(import.meta.url).pathname);
    const db=new Database(path.join(dataDir,'studyvillage.db'));
    db.exec('CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY,value TEXT NOT NULL)');
    const getSetting=k=>db.prepare('SELECT value FROM settings WHERE key=?').get(k)?.value||null;
    const setSetting=(k,v)=>db.prepare('INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value').run(k,v);
    const key=id=>`activity-state:${id}`;
    const valid=id=>/^[a-z0-9-]{1,40}$/.test(id);
    const defaults={
      'riddle-demo':'도전관 · 수수께끼',
      'vocabulary':'책마루 · 낱말 뜻 맞추기'
    };
    const read=id=>{
      let saved=null;try{saved=JSON.parse(getSetting(key(id))||'null')}catch{}
      return{activityId:id,name:String(saved?.name||defaults[id]||'학습 활동').slice(0,80),open:saved?.open!==false,message:String(saved?.message||'').slice(0,240),updatedAt:saved?.updatedAt||null};
    };
    this.get('/api/activity-state/:id',(req,res)=>{
      const id=String(req.params.id||'').trim();if(!valid(id))return res.status(400).json({ok:false,code:'invalid-activity'});
      res.json({ok:true,activity:read(id)});
    });
    this.get('/api/local/activity-states',(req,res)=>{
      if(!isLocalRequest(req))return res.status(403).json({ok:false,code:'teacher-pc-only'});
      res.json({ok:true,activities:Object.keys(defaults).map(read)});
    });
    this.put('/api/local/activity-state/:id',(req,res)=>{
      if(!isLocalRequest(req))return res.status(403).json({ok:false,code:'teacher-pc-only'});
      const id=String(req.params.id||'').trim();if(!valid(id))return res.status(400).json({ok:false,code:'invalid-activity'});
      const current=read(id),next={name:String(req.body?.name||current.name).trim().slice(0,80),open:req.body?.open!==false,message:String(req.body?.message||'').trim().slice(0,240),updatedAt:new Date().toISOString()};
      setSetting(key(id),JSON.stringify(next));res.json({ok:true,activity:{activityId:id,...next}});
    });
  }
  return originalListen.apply(this,args);
};
