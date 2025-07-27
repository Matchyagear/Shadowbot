const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  saveSnapshot: (stocks) => ipcRenderer.invoke('save-snapshot', stocks),
});
