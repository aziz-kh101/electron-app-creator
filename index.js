#!/usr/bin/env node
"use strict";

const program = require("commander");
const chalk = require("chalk");
const path = require("path");
const fs = require("fs");
const fse = require("fs-extra");
const { spawn } = require("child_process");
const packageJson = require("./package.json");
const { clearInterval } = require("timers");

let projectName;
let cwd = process.cwd();
let interval;

const waitText = (text) => {
  const arr = ["/", "-", "\\", "-"];
  let i = 0;
  interval = setInterval(() => {
    process.stdout.write(`${chalk.bgBlack.blueBright(arr[i])} ${text}\r`);
    i = ++i % 4;
  }, 100);
};

const doneText = (text) => {
  clearInterval(interval);
  process.stdout.write(`${chalk.green("✔")} ${text}\r\n`);
};

program
  .version(packageJson.version, "-v, --version", "output the version number")
  .arguments("<project-name>")
  .action((name) => {
    projectName = name;
  })
  .option("-t, --types", "create app with typescript configuration")
  .parse(process.argv);

const root = path.join(cwd, projectName);
if (fs.existsSync(root)) {
  console.log(
    chalk.red(`project name \`${projectName}\` deja exist in ${cwd}`)
  );
  process.exit(1);
}

fs.mkdirSync(root);

var pkg = {
  name: projectName,
  version: "1.0.0",
  main: "src/index.js",
  scripts: {
    start: "npx electron .",
    build:
      "electron-packager . --overwrite --icon=icons/icon.png  --prune=true --out=release-builds",
    "build-asar":
      'electron-packager . --overwrite --asar.unpack="**/node_modules/**" --prune=true --icon=icons/icon.png --out=release-builds',
    "package-mac":
      "electron-packager . --overwrite --platform=darwin --arch=x64 --icon=icons/icon.png  --prune=true --out=release-builds",
    "package-win":
      "electron-packager . --overwrite --platform=win32 --arch=ia32 --icon=icons/icon.png  --prune=true --out=release-builds",
    "package-linux":
      "electron-packager . --overwrite --platform=linux --arch=x64 --icon=icons/icon.png --prune=true --out=release-builds",
  },
  dependencies: {
    "electron-squirrel-startup": "^1.0.0",
  },
  devDependencies: {
    electron: "^13.1.7",
    "electron-packager": "^15.3.0",
  },
};

let template;

if (program.opts().types) {
  template = path.join(__dirname, "template", "typescript");

  pkg["main"] = "dist/index.js";
  (pkg["scripts"]["start"] = "npm run compile && npx electron ."),
    (pkg["scripts"]["compile"] =
      "tsc && npx copyfiles -e src/**/*.ts -F -u 1 src/**/*.*  dist"),
    (pkg["dependencies"]["typescript"] = "^4.3.5");
} else {
  template = path.join(__dirname, "template", "javascript");
}

fs.writeFileSync(path.join(root, "package.json"), JSON.stringify(pkg, null, 2));

fse.copySync(path.join(__dirname, "template", "base"), root);
fse.copySync(template, root);

console.log(`path : ${root}`);
waitText("Installing Packages...");

const cmd = spawn(
  /^win/.test(process.platform) ? "npm.cmd" : "npm",
  ["install"],
  { cwd: root }
);

cmd.on("exit", (code) => {
  doneText("Installing Packages");
  if (code !== 0) {
    console.log(
      chalk.yellow(
        `packages doesn't installed. You can try \`npm install\` to check the problem`
      )
    );
    console.log(chalk.red(`child process exited with code ${code}`));
    process.exit(1);
  }
});

cmd.on("error", (err) => {
  console.log(err);
});
