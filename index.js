#!/usr/bin/env node
"use strict";

const program = require("commander");
const chalk = require("chalk");
const path = require("path");
const fs = require("fs");
const fse = require("fs-extra");
const { spawn } = require("child_process");
const packageJson = require("./package.json");
const ora = require("ora");

let projectName;
let cwd = process.cwd();
var spinner;

program
  .version(packageJson.version, "-v, --version", "output the version number")
  .arguments("<project-name>")
  .action((name) => {
    projectName = name;
  })
  .option("-t, --types", "create app with typescript configuration")
  .option("--use-react", "use react application as web content")
  .parse(process.argv);

if (program.opts().types && program.opts().useReact) {
  console.log(
    chalk.yellow(
      "user `--t and --use-react` this feature note working beacause of react-script doesn't allow tsc compile"
    )
  );
  console.log(chalk.cyan("we working on this problem to be ready soon."));
  process.exit(0);
}

const root = path.join(cwd, projectName);

const run = () => {
  spinner = ora(`Copying Template to ${chalk.cyan(root)}`).start();

  try {
    fs.mkdirSync(root);

    var pkg = {
      name: projectName,
      version: "1.0.0",
      main: program.opts().types
        ? "build/electron/index.js"
        : "src/electron/index.js",
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
      dependencies: {},
      devDependencies: {
        electron: "^13.1.7",
        "electron-packager": "^15.3.0",
      },
    };

    let template;

    if (program.opts().types) {
      template = path.join(__dirname, "template", "typescript");

      pkg["scripts"] = {
        ...pkg.scripts,
        start: "npm run compile && npx electron .",
        compile:
          "tsc && npx copyfiles -e src/electron/**/*.ts -F -u 1 src/electron/**/*.*  build",
      };
      pkg["dependencies"] = {
        ...pkg.dependencies,
        typescript: "^4.3.5",
      };
    } else {
      template = path.join(__dirname, "template", "javascript");
    }

    let indexFile = program.opts().types ? "index.ts" : "index.js";

    if (program.opts().useReact) {
      fse.copySync(path.join(__dirname, "template", "react"), root);

      fse.copySync(
        path.join(__dirname, "template", "electron-react", indexFile),
        path.join(root, "src", "electron", indexFile)
      );

      pkg["homepage"] = "./";

      pkg["scripts"] = {
        ...pkg.scripts,
        "start-react": "react-scripts start",
        "start-electron": program.opts().types
          ? "npm run compile && npx electron ."
          : "npx electron .",
        start:
          'concurrently "set BROWSER=none && npm run start-react" "wait-on http://localhost:3000 && npm run start-electron" -k',
        build:
          "react-scripts build && electron-packager . --overwrite --icon=icons/icon.png  --prune=true --out=release-builds",
        "build-asar":
          'react-scripts build && electron-packager . --overwrite --asar.unpack="**/node_modules/**" --prune=true --icon=icons/icon.png --out=release-builds',
        "package-mac":
          "react-scripts build && electron-packager . --overwrite --platform=darwin --arch=x64 --icon=icons/icon.png  --prune=true --out=release-builds",
        "package-win":
          "react-scripts build && electron-packager . --overwrite --platform=win32 --arch=ia32 --icon=icons/icon.png  --prune=true --out=release-builds",
        "package-linux":
          "react-scripts build && electron-packager . --overwrite --platform=linux --arch=x64 --icon=icons/icon.png --prune=true --out=release-builds",
      };

      pkg["dependencies"] = {
        ...pkg.dependencies,
        "@testing-library/jest-dom": "^5.14.1",
        "@testing-library/react": "^11.2.7",
        "@testing-library/user-event": "^12.8.3",
        concurrently: "^6.2.0",
        react: "^17.0.2",
        "react-dom": "^17.0.2",
        "react-scripts": "4.0.3",
        "wait-on": "^6.0.0",
        "web-vitals": "^1.1.2",
      };
    }

    fs.writeFileSync(
      path.join(root, "package.json"),
      JSON.stringify(pkg, null, 2)
    );

    if (program.opts().useReact) {
      fse.copySync(path.join(__dirname, "template", "base"), root, {
        filter: (src) => {
          return !src.endsWith("index.html");
        },
      });
      fse.copySync(template, root, {
        filter: (src) => {
          return !src.endsWith(indexFile);
        },
      });
    } else {
      fse.copySync(path.join(__dirname, "template", "base"), root);
      fse.copySync(template, root);
    }

    spinner.succeed();
  } catch (error) {
    spinner.fail();
    console.log(error);
    process.exit(1);
  }

  spinner = ora("Installing Packages...").start();
  const cmd = spawn(
    /^win/.test(process.platform) ? "npm.cmd" : "npm",
    ["install"],
    { cwd: root }
  );

  cmd.on("exit", (code) => {
    if (code !== 0) {
      spinner.fail();
      console.log(
        chalk.yellow(
          `packages doesn't installed. You can try \`npm install\` to check the problem`
        )
      );
      console.log(chalk.red(`child process exited with code ${code}`));
      process.exit(1);
    } else {
      spinner.succeed("Installing Packages");
    }
  });

  cmd.on("error", (err) => {
    console.log(err);
  });
};

if (fs.existsSync(root)) {
  console.log(
    chalk.red(`project name \`${projectName}\` deja exist in ${cwd}`)
  );
  process.exit(1);
} else {
  run();
}
