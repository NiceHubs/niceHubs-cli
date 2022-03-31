// 存储模板的位置
const downloadDirectory = `${process.env[process.platform === 'darwin' ? 'HOME' : 'USERPROFILE']}/.template`;

const configFile = `${process.env[process.platform === 'darwin' ? 'HOME' : 'USERPROFILE']}/.Yuerc`; // 配置文件的存储位置
const defaultConfig = {
    repo: 'nicehubs-cli', // 默认拉取的仓库名
}

module.exports = {
    downloadDirectory,
    configFile,
    defaultConfig
};