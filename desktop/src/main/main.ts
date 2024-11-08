import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { resolveHtmlPath } from './util';
import path from 'path';
import { exec, execFile, spawn } from 'child_process';

import {
  existsSync,
  mkdirSync,
  copyFileSync,
  unlinkSync,
  readdirSync,
  readFileSync,
} from 'fs';
let run = true;
if (!existsSync('../data/report')) mkdirSync('../data/report');
if (existsSync('c:/Windows/arc/code.txt')) {
  run = true;
}

ipcMain.on('move-files-to-access-area', (e, filesArr) => {
  try {
    const oldFiles = readdirSync('../data/report/');
    oldFiles.forEach((el) => unlinkSync('../data/report/' + el));
    filesArr.forEach((fileObject) => {
      copyFileSync(
        '../data/uploaded/' + fileObject.path,
        '../data/report/' + fileObject.originalname
      );
    });
  } catch (err) {
    console.log(err);
  }

  exec('start ..\\data\\report');
});

let mainWindow: BrowserWindow | null = null;
ipcMain.on('open-file', (e, name) => {
  exec('..\\data\\uploaded\\' + name);
});
ipcMain.on('topbar', async (event, message) => {
  switch (message) {
    case 'fullscreen':
      mainWindow.setFullScreen(true);
      event.reply('topbar', { fullscreen: true });
      break;
    case 'fullscreenexit':
      mainWindow.setFullScreen(false);
      event.reply('topbar', { fullscreen: false });
      break;
    case 'minimize':
      mainWindow.minimize();
      break;
    case 'backup':
      const now = Date.now();

      exec(
        '..\\data\\script2.exe --uri=mongodb://127.0.0.1:27010 --out=..\\data\\dbbackups\\' +
          now,
        (err, stdout, stderr) => {
          exec('start ..\\data\\dbbackups\\' + now);
        }
      );
      break;

    case 'toggledev':
      break;
    case 'close':
      mainWindow.close();
      app.quit();

      break;
    default:
      return 1;
  }
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    frame: false,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.webContents.zoomFactor = 1;
      mainWindow.show();
      setTimeout(() => {
        var mongoProcess = spawn(
          'C:\\Program Files\\MongoDB\\Server\\7.0\\bin\\mongod',
          [
            '--port',
            '27010',
            '--dbpath',
            '..\\data\\database',
            '--logpath',
            '..\\data\\logs\\mongodb.log',
            '--replSet',
            'rs0',
            '--bind_ip',
            'localhost',
          ]
        );
        mongoProcess.stdout.on('data', (chunks) => {
          mainWindow.webContents.send(
            'startserver',
            'تم تشغيل السيرفر الخاص بقاعدة البيانات بنجاح'
          );
        });

        mongoProcess.stderr.on('data', (err) => {
          mainWindow.webContents.send(
            'startserver',
            ' خطأ في تشغيل السيرفر البيانات'
          );
        });
        mongoProcess.on('close', (code, signal) => {});
      }, 0);
      setTimeout(() => {
        process.env.port = '5678';
        process.env.prod = 'yes';
        process.env.database_uri = 'mongodb://127.0.0.1:27010/reports';

        var serverProcess = spawn('node', ['..\\server\\index.js'], {
          detached: !true,
        });
        serverProcess.stdout.on('data', (chunks) => {
          mainWindow.webContents.send('startserver', 'تم تشغيل السيرفر بنجاح');
        });
        serverProcess.stderr.on('data', (err) => {
          // console.log(Buffer.from(err).toString('utf-8'));
          // mainWindow.webContents.send('startserver', 'خطأ أثناء تشغيل السيرفر');
        });
        serverProcess.on('close', (code, signal) => {});
      }, 1000);
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });
};

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
  app
    .whenReady()
    .then(() => {
      if (run) {
        createWindow();

        app.on('activate', () => {
          if (mainWindow === null) createWindow();
        });
        return 0;
      }
    })
    .catch(console.log);
}
