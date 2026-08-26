/* Teacher-managed question and unit activation. Static content remains the source of truth. */
const STORE_KEY='question-catalog:settings-v1';
const clean=(value,n=120)=>String(value??'').trim().slice(0,n);
const read=getSetting=>{try{const value=JSON.parse(getSetting(STORE_KEY)||'{}');return value&&typeof value==='object'&&!Array.isArray(value)?value:{}}catch{return{}}};
const write=(setSetting,value)=>setSetting(STORE_KEY,JSON.stringify(value));
export function installQuestionCatalogSettingRoutes(app,{requireAdmin,getSetting,setSetting}){
  app.get('/api/question-catalog/settings',(_req,res)=>res.json({ok:true,settings:read(getSetting)}));
  app.get('/api/admin/question-catalog/settings',requireAdmin,(_req,res)=>res.json({ok:true,settings:read(getSetting)}));
  app.post('/api/admin/question-catalog/settings',requireAdmin,(req,res)=>{
    const scope=clean(req.body?.scope,20),key=clean(req.body?.key,160),enabled=req.body?.enabled===true;
    // `subject` is the final shared switch used for subjects that do not need unit-by-unit rollout (music theory first).
    // Legacy space-unit / space-subject scopes remain accepted so older saved classrooms and clients are not broken.
    if(!['question','unit','subject','space-unit','space-subject'].includes(scope)||!key)return res.status(400).json({ok:false,code:'invalid-question-setting'});
    const settings=read(getSetting),settingKey=`${scope}:${key}`;
    settings[settingKey]={scope,key,enabled,updatedAt:new Date().toISOString()};write(setSetting,settings);
    res.json({ok:true,setting:settings[settingKey]});
  });
}
