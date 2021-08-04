import { app, BrowserWindow, Menu } from "electron";
import path from "path";
import { menuTemplate } from "./menu-template";
import url from "url";

let mainWindow: BrowserWindow | null;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    title: "Hello World!",
    width: 800,
    height: 600,
    show: false,
    icon: path.join(__dirname, "../../icons/icon.ico"),
    webPreferences: {
      // Allow es6 syntax in html file
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  const startUrl = app.isPackaged
    ? url.format({
        pathname: path.join(__dirname, "../../build/index.html"),
        protocol: "file:",
        slashes: true,
      })
    : "http://localhost:3000";

  // load react url
  mainWindow.loadURL(startUrl);

  // Showing the window after this event will have no visual flash
  mainWindow?.once("ready-to-show", () => {
    mainWindow?.show();
  });

  // free memory on window closed
  mainWindow?.once("closed", () => {
    mainWindow = null;
  });

  // add custom menu
  const maiMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(maiMenu);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

// handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.log(error);
  app.quit();
});
