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

> if `-t` flag be used then

```
electron
├── icons
|  ├── icon.ico
|  └── icon.png
├── node_modules
├── package-lock.json
├── package.json
├── src
|  ├── index.css
|  ├── index.html
|  └── index.ts
└── tsconfig.json
```

No configuration or complicated folder structures, only the files you need to build your app.
Once the installation is done, you can open your project folder:

```
cd electron
```

Inside the newly created project, you can run some built-in commands:

```
npm start //to start application

npm run build // build with automatic detection of your system
npm run build-asar // like `npm run build` with `--asar` option on electron-packager

npm run package-mac // build mac application
npm run package-win // build windows application
npm run package-linux // build linux application
```

## Command Line Options

command line flags.

```
-v, --version  output the version number
-t, --types    create app with typescript configuration
-h, --help     display help for command
```
