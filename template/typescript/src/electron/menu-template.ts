import { app, MenuItemConstructorOptions } from "electron";

export const menuTemplate: MenuItemConstructorOptions[] = [
  {
    label: "File",
    submenu: [
      {
        label: "Quit",
        accelerator: process.platform === "darwin" ? "Command+Q" : "Ctrl+Q",
        click: () => {
          app.quit();
        },
      },
    ],
  },
];

if (process.platform === "darwin") {
  menuTemplate.unshift({});
}

if (!app.isPackaged) {
  menuTemplate.push({
    label: "View",
    submenu: [
      {
        role: "reload",
      },
      {
        role: "toggleDevTools",
      },
    ],
  });
}
