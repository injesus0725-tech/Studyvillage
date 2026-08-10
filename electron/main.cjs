const { app, BrowserWindow, shell } = require('electron');
const path = require('node:path');
const fs = require('node:fs');

let mainWindow;

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
  const serverModule = await import(path.join(__dirname, '..', 'server', 'server.js'));
  serverModule.startClassroomServer();
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

app.whenReady().then(createWindow).catch(error => {
  console.error(error);
  app.quit();
});

app.on('window-all-closed', () => {
  app.quit();
});