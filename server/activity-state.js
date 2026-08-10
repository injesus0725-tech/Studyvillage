/* v0.9.69 shared classroom routes.
   Activity open/close state remains persisted in settings.
   Backup restore requests are now server-validated before the existing restore transaction runs. */
import { validateStudyvillageBackup } from './backup-validator.js';

export function installActivityStateRoutes(app,{getSetting,setSetting,requireAdmin}){
  const key=id=>`activity-state:${id}`;
  const valid=id=>/^[a-z0-9-]{1,40}$/.test(id);
  const read=(id,name='학습 활동')=>{
    let saved=null;try{saved=JSON.parse(getSetting(key(id))||'null')}catch{}
    return{activityId:id,name:String(saved?.name||name).slice(0,80),open:saved?.open!==false,message:String(saved?.message||'').slice(0,240),updatedAt:saved?.updatedAt||null};
  };

  // This middleware is registered before server.js installs the actual restore route.
  // A malformed backup therefore never reaches the destructive restore transaction.
  app.use('/api/admin/restore',requireAdmin,(req,res,next)=>{
    if(req.method!=='POST')return next();
    const validation=validateStudyvillageBackup(req.body);
    if(!validation.ok)return res.status(400).json({ok:false,code:validation.code,message:validation.message});
    req.studyvillageBackupValidation=validation;
    next();
  });

  app.get('/api/activity-state/:id',(req,res)=>{
    const id=String(req.params.id||'').trim();if(!valid(id))return res.status(400).json({ok:false,code:'invalid-activity'});
    res.json({ok:true,activity:read(id)});
  });
  app.get('/api/admin/activity-states',requireAdmin,(_req,res)=>{
    const ids=['riddle-demo','library-vocabulary'];
    res.json({ok:true,activities:ids.map(id=>read(id,id==='riddle-demo'?'도전관 · 수수께끼':'책마루 · 낱말 뜻 맞추기'))});
  });
  app.put('/api/admin/activity-state/:id',requireAdmin,(req,res)=>{
    const id=String(req.params.id||'').trim();if(!valid(id))return res.status(400).json({ok:false,code:'invalid-activity'});
    const current=read(id),next={name:String(req.body?.name||current.name||'학습 활동').trim().slice(0,80),open:req.body?.open!==false,message:String(req.body?.message||'').trim().slice(0,240),updatedAt:new Date().toISOString()};
    setSetting(key(id),JSON.stringify(next));res.json({ok:true,activity:{activityId:id,...next}});
  });
}
