/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import chokidar from 'chokidar';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

const fs = require('fs');
const dirTree = require('directory-tree');

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

// server-side
ipcMain.on('get-paths', async (event /* , arg */) => {
  const allpaths: string[] = [];

  if (typeof process.env.PATHS !== 'undefined') {
    const envparams = process.env.PATHS.split(';');
    // For each item, resolve the "absolute path" representation, and add that to "allpaths"
    envparams.map((p) => allpaths.push(path.resolve(p)));
  }

  if (process.argv.length > 1) {
    const params = process.argv.slice(1);
    // For each item, resolve the "absolute path" representation, and add that to "allpaths"
    params.map((p) => allpaths.push(path.resolve(p)));
  }

  event.reply('get-paths', allpaths);
});

// server-side
interface FixerUpper {
  name: string;
  path?: string;
  children?: FixerUpper[];
}
const watchedRoots: string[] = [];
function fix(elem: FixerUpper) {
  if (elem.path) {
    delete elem.path;
  }
  if (elem.children) {
    elem.children.forEach(fix);
  }
}
function getTreeResponse(event, arg) {
  if (fs.existsSync(arg)) {
    const dt = dirTree(arg);
    if (dt) {
      fix(dt);
      event.reply('get-tree', { root: arg, tree: dt, status: 200 });
      return;
    }
  }
  // Fallback: report "not found".
  event.reply('get-tree', {
    root: arg,
    tree: { name: '(does not exist)' },
    status: 404,
  });
}
ipcMain.on('get-tree', async (event, arg) => {
  getTreeResponse(event, arg);
  if (!watchedRoots.includes(arg)) {
    watchedRoots.push(arg);
    const watcher = chokidar.watch(arg, {
      persistent: true,
    });
    watcher.on('error', (error) => {
      console.log(`Watcher error for ${arg}: ${error}`);
      getTreeResponse(event, arg);
      // Always invoke a backup scanner, to handle "clogged up queues/processing"
      // on the part of the file system. 2500 should be sufficient for modern (SSD)
      // compute platforms.
      setTimeout(getTreeResponse, 2500, event, arg);
    });
    watcher.on('ready', async () => {
      watcher.on('all', (/* watchEvent, watchPath */) => {
        getTreeResponse(event, arg);
      });
    });
  }
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDevelopment) {
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
  if (isDevelopment) {
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
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
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
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  // new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
