const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const fs = require('node:fs');
const os = require('node:os');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    icon: path.join(__dirname, 'assets/icon.png'),
  });

  // Load from Vite dev server in development, or from file in production
  // app.isPackaged is true when the app is packaged, false otherwise
  if (!app.isPackaged) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist', 'renderer', 'index.html'));
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handler for saving snapshots
ipcMain.handle('save-snapshot', async (event, stocks) => {
  try {
    // The user wants it on G:\ which is common for Google Drive, but not universal.
    // A more robust approach might be to use a dialog, but we will stick to the user request.
    const drivePath = os.platform() === 'win32' ? 'G:' : path.join(os.homedir(), 'Google Drive');
    const reportDir = path.join(drivePath, 'My Drive', 'Stock Reports');
    
    // Check if the directory exists, create it if not
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    // Generate a unique filename with a timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `stock-snapshot-${timestamp}.json`;
    const fullPath = path.join(reportDir, filename);

    // Write the stocks data to the file
    fs.writeFileSync(fullPath, JSON.stringify(stocks, null, 2));

    return { success: true, path: fullPath };
  } catch (error) {
    console.error('Failed to save snapshot:', error);
    return { success: false, error: error.message };
  }
});