const { app, BrowserWindow, shell, dialog } = require('electron');
const path = require('node:path');
const fs = require('node:fs');
const { pathToFileURL } = require('node:url');

let mainWindow;
let classroomServer;
const gotSingleInstanceLock = app.requestSingleInstanceLock();

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
  process.env.STUDYVILLAGE_DATA_DIR = dataDir;
  process.env.STUDYVILLAGE_EMBEDDED = '1';

  const hookPath = path.join(__dirname, '..', 'server', 'activity-state-hook.js');
  await import(pathToFileURL(hookPath).href);
  const serverPath = path.join(__dirname, '..', 'server', 'server.js');
  const serverModule = await import(pathToFileURL(serverPath).href);
  classroomServer = serverModule.startClassroomServer();
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
