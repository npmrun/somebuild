#!/usr/bin/env node
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// ../utils/src/index.ts
import chalk from "chalk";
function error(message, willExit) {
  if (willExit === "exit") {
    throw new Error(message);
  } else {
    console.error(chalk.bold.red(message));
  }
}
var init_src = __esm({
  "../utils/src/index.ts"() {
  }
});

// ../check/src/index.ts
var src_exports = {};
__export(src_exports, {
  buildinfo: () => buildinfo,
  jsonFile: () => jsonFile,
  pkgInfo: () => pkgInfo
});
import path from "path";
import fs from "fs-extra";
var jsonFile, pkgInfo, buildinfo;
var init_src2 = __esm({
  "../check/src/index.ts"() {
    init_src();
    jsonFile = path.resolve(process.cwd(), "./package.json");
    if (!fs.pathExistsSync(jsonFile)) {
      error("\u4E0D\u5B58\u5728package.json", "exit");
    }
    pkgInfo = fs.readJSONSync(jsonFile);
    buildinfo = pkgInfo.buildinfo;
    if (buildinfo === void 0) {
      error("package.json\u4E0D\u5B58\u5728buildinfo\u5B57\u6BB5", "exit");
    }
  }
});

// src/index.ts
init_src();
import { Command } from "commander";
var program = new Command();
program.name("anybuild");
program.version("0.0.1", "-v, --version").description("\u67E5\u770B\u5F53\u524D\u7248\u672C\u53F7");
program.helpOption("-h --help", "\u663E\u793A\u5E2E\u52A9\u4FE1\u606F");
program.showHelpAfterError(`(${"anybuild"} -h \u67E5\u770B\u5E2E\u52A9\u4FE1\u606F)`);
var reportErrorMessage;
try {
  await Promise.resolve().then(() => (init_src2(), src_exports));
  reportErrorMessage = void 0;
} catch (error2) {
  reportErrorMessage = error2.message;
}
program.option("-w, --watch", "\u5F00\u53D1\u6A21\u5F0F").option("-s, --site", "\u7AD9\u70B9\u6A21\u5F0F").option("--ssr", "ssr\u6A21\u5F0F").option("-d, --debug [value]", "Debug\u65E5\u5FD7").description("\u6784\u5EFA").action(async ({ watch, debug, site, ssr }) => {
  if (reportErrorMessage) {
    error(reportErrorMessage, "exit");
  }
});
program.command("init").description("\u521D\u59CB\u5316\u9879\u76EE").action(async ({}) => {
  error("\u5F00\u53D1\u4E2D\uFF0C\u6682\u4E0D\u53EF\u7528");
});
program.parse(process.argv);
//# sourceMappingURL=bin.js.map