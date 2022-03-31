"use strict";

// 存储模板的位置
var downloadDirectory = "".concat(process.env[process.platform === 'darwin' ? 'HOME' : 'USERPROFILE'], "/.template");
var configFile = "".concat(process.env[process.platform === 'darwin' ? 'HOME' : 'USERPROFILE'], "/.Yuerc"); // 配置文件的存储位置

var defaultConfig = {
  repo: 'niceHubs-cli' // 默认拉取的仓库名

};
module.exports = {
  downloadDirectory: downloadDirectory,
  configFile: configFile,
  defaultConfig: defaultConfig
};