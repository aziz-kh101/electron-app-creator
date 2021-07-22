# electron app Creator

This package includes the global command for create electron application.

## Creating an App

You’ll need to have Node 16.2.0 or later version on your local development machine

To create a new app, you may choose one of the following methods:

```
npx electron-app-creator electron
```

> If you've previously installed `electron-app-creator` globally via `npm install -g electron-app-creator`, then

```
electron-app-creator electron
```

It will create a directory called electron inside the current folder.

```
electron
├── icons
|  ├── icon.ico
|  └── icon.png
├── node_modules
├── package-lock.json
├── package.json
└── src
   ├── index.css
   ├── index.html
   └── index.js
```

No configuration or complicated folder structures, only the files you need to build your app.
Once the installation is done, you can open your project folder:

```
cd electron
```

Inside the newly created project, you can run some built-in commands:

```
npm start //to start application

npm run package-mac // build mac application
npm run package-win // build windows application
npm run package-linux // build linux application
```
