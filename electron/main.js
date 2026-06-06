// ============================================================
//  QUANTUM EMMA — Electron Main Process v5.0
//  Windows Desktop App · Auto-Update · Secure IPC
//  © 2026 Grigori Saks — All Rights Reserved — Patent Pending
// ============================================================

const { app, BrowserWindow, ipcMain, Menu, Tray, shell,
        dialog, nativeTheme, Notification } = require("electron");
const path   = require("path");
const fs     = require("fs");
const https  = require("https");

// ── App metadata ────────────────────────────────────────────
const APP_VERSION  = "5.0.0";
const APP_NAME     = "Quantum Emma Enterprise";
const TRAY_TOOLTIP = `${APP_NAME} v${APP_VERSION}`;
const PROD_URL     = "https://quantum-emma-app.base44.app";
const DEV_URL      = "http://localhost:5173";
const IS_DEV       = process.env.NODE_ENV === "development";
const IS_WIN       = process.platform === "win32";
const IS_MAC       = process.platform === "darwin";
const ICON_PATH    = path.join(__dirname, "../assets/icon.png");

let mainWindow = null;
let tray       = null;
let isQuitting = false;

// ── Force single instance ────────────────────────────────────
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) { app.quit(); process.exit(0); }
app.on("second-instance", () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

// ── Security: disable node integration in renderer ──────────
app.on("web-contents-created", (_, contents) => {
  contents.on("will-navigate", (event, url) => {
    const allowedOrigins = [
      "https://quantum-emma-app.base44.app",
      "http://localhost:5173",
      "https://app.base44.com",
    ];
    const origin = new URL(url).origin;
    if (!allowedOrigins.includes(origin)) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });
  contents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });
});

// ── Create main window ───────────────────────────────────────
function createWindow() {
  const winState = loadWindowState();

  mainWindow = new BrowserWindow({
    width:           winState.width  || 1400,
    height:          winState.height || 900,
    x:               winState.x,
    y:               winState.y,
    minWidth:        960,
    minHeight:       600,
    title:           APP_NAME,
    icon:            fs.existsSync(ICON_PATH) ? ICON_PATH : undefined,
    backgroundColor: "#000008",
    titleBarStyle:   IS_MAC ? "hiddenInset" : "default",
    autoHideMenuBar: true,
    show:            false,
    webPreferences: {
      nodeIntegration:        false,
      contextIsolation:       true,
      preload:                path.join(__dirname, "preload.js"),
      webSecurity:            true,
      allowRunningInsecureContent: false,
    },
  });

  // Load app
  if (IS_DEV) {
    mainWindow.loadURL(DEV_URL);
    mainWindow.webContents.openDevTools({ mode: "detach" });
  } else {
    mainWindow.loadURL(PROD_URL);
  }

  // Show when ready
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
    if (winState.maximized) mainWindow.maximize();
    sendSplash();
  });

  // Save window state on close
  mainWindow.on("close", (e) => {
    if (!isQuitting) {
      e.preventDefault();
      saveWindowState();
      mainWindow.hide();
    }
  });

  mainWindow.on("closed", () => { mainWindow = null; });
  mainWindow.on("resize",  saveWindowState);
  mainWindow.on("move",    saveWindowState);

  // Dark mode
  nativeTheme.themeSource = "dark";

  createMenu();
  createTray();
}

// ── Splash notification ──────────────────────────────────────
function sendSplash() {
  setTimeout(() => {
    if (mainWindow) {
      mainWindow.webContents.executeJavaScript(`
        console.log('%c⚛️ Quantum Emma Enterprise v${APP_VERSION} — Desktop Mode', 
          'color:#a78bfa;font-size:14px;font-weight:bold');
      `);
    }
    if (Notification.isSupported()) {
      new Notification({
        title: "⚛️ Quantum Emma",
        body:  `Enterprise v${APP_VERSION} is running. Meta Genius TR2 active.`,
        icon:  fs.existsSync(ICON_PATH) ? ICON_PATH : undefined,
      }).show();
    }
  }, 2000);
}

// ── Window state persistence ─────────────────────────────────
const STATE_FILE = path.join(app.getPath("userData"), "window-state.json");
function loadWindowState() {
  try { return JSON.parse(fs.readFileSync(STATE_FILE, "utf8")); } catch { return {}; }
}
function saveWindowState() {
  if (!mainWindow) return;
  const bounds    = mainWindow.getBounds();
  const maximized = mainWindow.isMaximized();
  try { fs.writeFileSync(STATE_FILE, JSON.stringify({ ...bounds, maximized })); } catch {}
}

// ── App menu ─────────────────────────────────────────────────
function createMenu() {
  const template = [
    {
      label: "⚛️ Quantum Emma",
      submenu: [
        { label: `Version ${APP_VERSION}`, enabled: false },
        { type: "separator" },
        { label: "🔄 Reload", accelerator: "CmdOrCtrl+R",
          click: () => mainWindow?.webContents.reload() },
        { label: "🔍 DevTools", accelerator: "F12",
          click: () => mainWindow?.webContents.toggleDevTools() },
        { type: "separator" },
        { label: "📦 GitHub", click: () => shell.openExternal("https://github.com/GrischaS/quantum-emma") },
        { label: "🌐 Web App", click: () => shell.openExternal(PROD_URL) },
        { type: "separator" },
        { label: "❌ Quit", accelerator: "CmdOrCtrl+Q",
          click: () => { isQuitting = true; app.quit(); } },
      ],
    },
    {
      label: "Navigate",
      submenu: [
        { label: "🏠 Dashboard",  click: () => mainWindow?.loadURL(`${IS_DEV?DEV_URL:PROD_URL}/`) },
        { label: "📊 Trading",    click: () => mainWindow?.loadURL(`${IS_DEV?DEV_URL:PROD_URL}/trading`) },
        { label: "💼 Portfolio",  click: () => mainWindow?.loadURL(`${IS_DEV?DEV_URL:PROD_URL}/portfolio`) },
        { label: "🤖 AI Oracle",  click: () => mainWindow?.loadURL(`${IS_DEV?DEV_URL:PROD_URL}/agents`) },
        { label: "⛏ Mining",     click: () => mainWindow?.loadURL(`${IS_DEV?DEV_URL:PROD_URL}/mining`) },
        { label: "🔒 Staking",    click: () => mainWindow?.loadURL(`${IS_DEV?DEV_URL:PROD_URL}/staking`) },
        { label: "🏛 Governance", click: () => mainWindow?.loadURL(`${IS_DEV?DEV_URL:PROD_URL}/governance`) },
        { label: "🔬 Research",   click: () => mainWindow?.loadURL(`${IS_DEV?DEV_URL:PROD_URL}/research`) },
        { label: "🧠 MetaMemory", click: () => mainWindow?.loadURL(`${IS_DEV?DEV_URL:PROD_URL}/metamemory`) },
      ],
    },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

// ── System tray ──────────────────────────────────────────────
function createTray() {
  try {
    if (!fs.existsSync(ICON_PATH)) return;
    tray = new Tray(ICON_PATH);
    tray.setToolTip(TRAY_TOOLTIP);
    tray.setContextMenu(Menu.buildFromTemplate([
      { label: "⚛️ " + APP_NAME, enabled: false },
      { label: `v${APP_VERSION}`,         enabled: false },
      { type: "separator" },
      { label: "Show",   click: () => mainWindow?.show() },
      { label: "Hide",   click: () => mainWindow?.hide() },
      { type: "separator" },
      { label: "🌐 Open Web App", click: () => shell.openExternal(PROD_URL) },
      { type: "separator" },
      { label: "Quit",   click: () => { isQuitting = true; app.quit(); } },
    ]));
    tray.on("double-click", () => mainWindow?.show());
  } catch {}
}

// ── IPC handlers ─────────────────────────────────────────────
ipcMain.handle("get-app-info", () => ({
  version: APP_VERSION,
  name:    APP_NAME,
  platform:IS_WIN ? "windows" : IS_MAC ? "macos" : "linux",
  isDev:   IS_DEV,
}));

ipcMain.handle("get-version",     () => APP_VERSION);
ipcMain.handle("show-window",     () => mainWindow?.show());
ipcMain.handle("hide-window",     () => mainWindow?.hide());
ipcMain.handle("minimize-window", () => mainWindow?.minimize());
ipcMain.handle("maximize-window", () => mainWindow?.isMaximized() ? mainWindow.restore() : mainWindow.maximize());

ipcMain.handle("open-external", (_, url) => { shell.openExternal(url); });

ipcMain.handle("show-notification", (_, { title, body }) => {
  if (Notification.isSupported()) {
    new Notification({ title, body }).show();
  }
});

ipcMain.handle("show-save-dialog", async (_, opts) => {
  return dialog.showSaveDialog(mainWindow, opts);
});

// ── App lifecycle ────────────────────────────────────────────
app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (!IS_MAC) app.quit();
});

app.on("activate", () => {
  if (!mainWindow) createWindow();
  else mainWindow.show();
});

app.on("before-quit", () => { isQuitting = true; });
