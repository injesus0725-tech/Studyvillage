const { app, BrowserWindow, shell, dialog } = require('electron');
const path = require('node:path');
const fs = require('node:fs');
const { pathToFileURL } = require('node:url');

// Classroom PCs often use older integrated graphics drivers.  A renderer can
// turn completely white after navigating from the launcher even though the
// embedded server is still healthy.  StudyVillage does not need GPU rendering,
// so prefer the stable software path.
app.disableHardwareAcceleration();

let mainWindow;
let classroomServer;
let runtimeLogFile='';
let rendererRecoveryCount=0;
const gotSingleInstanceLock = app.requestSingleInstanceLock();

function safeRuntimeText(value,limit=5000){let text=String(value??'');try{text=text.split(app.getPath('userData')).join('[USER_DATA]')}catch{}text=text.split(path.resolve(__dirname,'..')).join('[APP]');return text.replace(/Bearer\s+[A-Za-z0-9._-]+/gi,'Bearer [REDACTED]').slice(0,limit)}
function writeRuntimeError(kind,error){try{if(!runtimeLogFile){const dir=path.join(app.getPath('userData'),'data');fs.mkdirSync(dir,{recursive:true});runtimeLogFile=path.join(dir,'runtime-errors.jsonl')}if(fs.existsSync(runtimeLogFile)&&fs.statSync(runtimeLogFile).size>200000){const data=fs.readFileSync(runtimeLogFile,'utf8').slice(-100000),start=data.indexOf('\n');fs.writeFileSync(runtimeLogFile,start>=0?data.slice(start+1):'','utf8')}const row={kind:safeRuntimeText(kind,80),message:safeRuntimeText(error?.message||error,1800),stack:safeRuntimeText(error?.stack||'',5000),at:new Date().toISOString(),pid:process.pid};fs.appendFileSync(runtimeLogFile,`${JSON.stringify(row)}\n`,'utf8')}catch{}}

async function waitForServer(url, timeoutMs = 15000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) return true;
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  return false;
}

async function startServer() {
  const dataDir = path.join(app.getPath('userData'), 'data');
  fs.mkdirSync(dataDir, { recursive: true });
  runtimeLogFile = path.join(dataDir, 'runtime-errors.jsonl');
  process.env.STUDYVILLAGE_DATA_DIR = dataDir;
  process.env.STUDYVILLAGE_EMBEDDED = '1';

  const hookPath = path.join(__dirname, '..', 'server', 'activity-state-hook.js');
  await import(pathToFileURL(hookPath).href);
  const serverPath = path.join(__dirname, '..', 'server', 'server.js');
  const serverModule = await import(pathToFileURL(serverPath).href);
  const server = serverModule.startClassroomServer();
  classroomServer = await new Promise((resolve,reject) => {
    let settled = false;
    const timeout = setTimeout(() => finish(new Error('Studyvillage server listen timed out.')), 10000);
    const finish = error => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      server.removeListener('listening', onListening);
      server.removeListener('error', onError);
      if (error) reject(error); else resolve(server);
    };
    const onListening = () => finish();
    const onError = error => finish(error);
    server.once('listening', onListening);
    server.once('error', onError);
    if (server.listening) finish();
  });
  classroomServer.on('error',error=>writeRuntimeError('server-error',error));
}

async function createWindow() {
  await startServer();
  const ready = await waitForServer('http://127.0.0.1:3000/api/health');
  if (!ready) throw new Error('Studyvillage server did not start in time.');

  mainWindow = new BrowserWindow({
    width: 1180,
    height: 820,
    minWidth: 900,
    minHeight: 650,
    title: 'Studyvillage 교실 서버',
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  await mainWindow.loadURL('http://127.0.0.1:3000/connect.html');
  mainWindow.webContents.on('render-process-gone',(_event,details)=>{
    writeRuntimeError('renderer-gone',new Error(`reason=${details?.reason||'unknown'} exitCode=${details?.exitCode??'unknown'}`));
    if(rendererRecoveryCount>=2)return;
    rendererRecoveryCount++;
    setTimeout(()=>{if(mainWindow&&!mainWindow.isDestroyed())mainWindow.loadURL('http://127.0.0.1:3000/connect.html?recovered='+Date.now()).catch(error=>writeRuntimeError('renderer-reload-failed',error))},500);
  });
  mainWindow.webContents.on('unresponsive',()=>{
    writeRuntimeError('renderer-unresponsive',new Error('The classroom window stopped responding.'));
    if(rendererRecoveryCount>=2)return;
    rendererRecoveryCount++;
    setTimeout(()=>{if(mainWindow&&!mainWindow.isDestroyed())mainWindow.reloadIgnoringCache()},500);
  });
  mainWindow.webContents.on('did-fail-load',(_event,errorCode,errorDescription,validatedURL,isMainFrame)=>{
    if(!isMainFrame||errorCode===-3)return;
    writeRuntimeError('page-load-failed',new Error(`${errorCode} ${errorDescription} ${validatedURL}`));
    setTimeout(async()=>{
      if(!mainWindow||mainWindow.isDestroyed())return;
      const healthy=await waitForServer('http://127.0.0.1:3000/api/health',5000);
      if(healthy)mainWindow.loadURL('http://127.0.0.1:3000/connect.html?loadRecovered='+Date.now()).catch(error=>writeRuntimeError('page-recovery-failed',error));
    },700);
  });
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http://127.0.0.1:3000') || url.startsWith('http://localhost:3000')) return { action: 'allow' };
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

if (!gotSingleInstanceLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (!mainWindow) return;
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.show();
    mainWindow.focus();
  });

  app.whenReady().then(createWindow).catch(error => {
    writeRuntimeError('startup-error',error);
    console.error(error);
    dialog.showErrorBox(
      'Studyvillage를 시작하지 못했습니다',
      '교실 서버를 시작하지 못했습니다. 앱을 모두 닫은 뒤 다시 실행해 주세요. 계속되면 선생님이 Windows에서 컴퓨터를 직접 재부팅한 뒤 다시 시도해 주세요. Studyvillage가 컴퓨터를 자동으로 재부팅하지는 않습니다.'
    );
    app.quit();
  });
}

app.on('before-quit', () => {
  if (classroomServer?.listening) classroomServer.close();
});

app.on('window-all-closed', () => {
  app.quit();
});

process.on('unhandledRejection',reason=>writeRuntimeError('electron-unhandled-rejection',reason));
process.on('uncaughtException',error=>{writeRuntimeError('electron-uncaught-exception',error);console.error(error);app.quit()});
