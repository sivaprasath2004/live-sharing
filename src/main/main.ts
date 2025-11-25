/* eslint global-require: off, no-console: off, promise/always-return: off */

import path from "path";
import { app, BrowserWindow, ipcMain, desktopCapturer, shell } from "electron";
import { autoUpdater } from "electron-updater";
import log from "electron-log";
import MenuBuilder from "./menu";
import { resolveHtmlPath } from "./util";
const { fork } = require("child_process");
const WebSocket = require("ws");

let mainWindow = null;
let robotProcess = null;
let wsClient = null;

// ------------------------------
//   WEBSOCKET SERVER
// ------------------------------
const wss = new WebSocket.Server({ port: 8899 });
let x=0
let y=0
wss.on("connection", (ws) => {
  wsClient = ws;

  ws.on("message", (msg) => {
    const data = JSON.parse(msg);
    console.log({data})
    if (!robotProcess) return;

    if (data.type === "mouse-move") {   
    robotProcess.send({ type: "move", x: data.x, y: data.y });
    }

    if (data.type === "mouse-click") { 
     robotProcess.send({ type: "click" });
    }

    if (data.type === "mouse-left-click") { 
   //   robotProcess.send({ type: "move", x: x, y: y })
  //  robotProcess.send({ type: "left-click" });
  }

  if (data.type === "mouse-right-click") {  
    robotProcess.send({ type: "right-click" });
  }
    if (data.type === "key-press") { 
  robotProcess.send({
      type: "key",
      command: data.command,  // ex: "a", "Enter"
    });
      //robotProcess.send({ type: "key", key: data.key });
    }
  });
});

// ------------------------------
//   AUTO UPDATER SETUP
// ------------------------------
class AppUpdater {
  constructor() {
    log.transports.file.level = "info";
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

// ------------------------------
//   SCREEN STREAM IPC
// ------------------------------
ipcMain.handle("get-screen-stream", async () => {
  const sources = await desktopCapturer.getSources({ types: ["screen"] });
  return sources[0].id;
});

// ------------------------------
//   CREATE WINDOW
// ------------------------------
const createWindow = async () => {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 728,
    show: false,
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, "preload.js")
        : path.join(__dirname, "../../.erb/dll/preload.js"),
    },
    autoHideMenuBar:true,
  });

  mainWindow.loadURL(resolveHtmlPath("index.html"));

  mainWindow.on("ready-to-show", () => mainWindow?.show());
  mainWindow.on("closed", () => (mainWindow = null));

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: "deny" };
  });

  new AppUpdater();
};

// ------------------------------
//   APP READY
// ------------------------------
app.whenReady().then(() => {
  // Correct child process path
 let mouseScript = app.isPackaged
  ? path.join(process.resourcesPath, "MouseEvents.js")
  : path.join(__dirname, "../../src/main/MouseEvents.js");
  robotProcess = fork(mouseScript);

  robotProcess.on("error", (err) => {
    console.log("Child process error:", err);
  });

  robotProcess.on("exit", (code) => {
    console.log("Child process exited with code", code);
  });


  createWindow();

  app.on("activate", () => {
    if (mainWindow === null) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
