// ============================================================
//  QUANTUM EMMA — Electron Preload (Secure Bridge) v5.0
//  © 2026 Grigori Saks — All Rights Reserved
// ============================================================
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  getAppInfo:        ()            => ipcRenderer.invoke("get-app-info"),
  getVersion:        ()            => ipcRenderer.invoke("get-version"),
  openExternal:      (url)         => ipcRenderer.invoke("open-external", url),
  showNotification:  (opts)        => ipcRenderer.invoke("show-notification", opts),
  showSaveDialog:    (opts)        => ipcRenderer.invoke("show-save-dialog", opts),
  minimizeWindow:    ()            => ipcRenderer.invoke("minimize-window"),
  maximizeWindow:    ()            => ipcRenderer.invoke("maximize-window"),
  hideWindow:        ()            => ipcRenderer.invoke("hide-window"),
  isElectron:        true,
  version:           "5.0.0",
  platform:          process.platform,
});
