/* Teacher-managed question and unit activation. Static content remains the source of truth. */
const STORE_KEY='question-catalog:settings-v1';
const clean=(value,n=120)=>String(value??'').trim().slice(0,n);
const read=getSetting=>{try{const value=JSON.parse(getSetting(STORE_KEY)||'{}');if(!value||typeof value!=='object'||Array.isArray(value))return{};const current={};for(const[key,row]of Object.entries(value)){if(key.startsWith('space-unit:')||key.startsWith('space-subject:'))continue;current[key]=row}return current}catch{return{}}};
const write=(setSetting,value)=>setSetting(STORE_KEY,JSON.stringify(value));
export function installQuestionCatalogSettingRoutes(app,{requireAdmin,getSetting,setSetting}){
  app.get('/api/question-catalog/settings',(_req,res)=>res.json({ok:true,settings:read(getSetting)}));
  app.get('/api/admin/question-catalog/settings',requireAdmin,(_req,res)=>res.json({ok:true,settings:read(getSetting)}));
  app.post('/api/admin/question-catalog/settings',requireAdmin,(req,res)=>{
    const scope=clean(req.body?.scope,20),key=clean(req.body?.key,160),enabled=req.body?.enabled===true;
    // Final V1 uses one shared unit switch. Legacy per-space settings are intentionally retired so stale classroom values cannot block a re-enabled unit.
    if(!['question','unit','subject'].includes(scope)||!key)return res.status(400).json({ok:false,code:'invalid-question-setting'});
    const settings=read(getSetting),settingKey=`${scope}:${key}`;
    settings[settingKey]={scope,key,enabled,updatedAt:new Date().toISOString()};write(setSetting,settings);
    res.json({ok:true,setting:settings[settingKey]});
  });
}
