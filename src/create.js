const axios = require('axios');
const ora = require('ora');
const fs = require('fs');
const ncp = require('ncp');
const path = require('path');
const inquirer = require('inquirer');
const { promisify } = require('util');
const MetalSmith = require('metalsmith');
let { render } = require('consolidate').ejs;
render = promisify(render);


let downloadGitRepo = require('download-git-repo');
downloadGitRepo = promisify(downloadGitRepo);
const { downloadDirectory } = require('../util/constants.js');

async function getRepositoryList() {
    const { data } = await axios.get("https://api.github.com/orgs/NiceHubs-template/repos");
    return data;
}

const getTagList = async (repo) => {
    const { data } = await axios.get(`https://api.github.com/repos/NiceHubs-template/${repo}/tags`);
    return data;
};

const loading = (fn, message) => async (...args) => {
    const spinner = ora(message);
    spinner.start();
    const result = await fn(...args);
    spinner.succeed();
    return result;
};

const downloadTask = async (repo, tag) => {
    let url = `NiceHubs-template/${repo}`;
    if (tag) url += `#${tag}`
    const dest = `${downloadDirectory}/${repo}`;
    console.log("dest", dest, "url", url);
    await downloadGitRepo(url, dest);
    return dest;
};

module.exports = async (projectName) => {

    let repoList = await loading(getRepositoryList, "fetching template ...")();
    const { repo } = await inquirer.prompt({
        name: "repo",
        type: "list",
        message: "please choice a template to create project !",
        choices: repoList.map(item => item.name)
    })

    let tagList = await loading(getTagList, "fetching tags ...")(repo);

    const { tag } = await inquirer.prompt({
        name: 'tag',
        type: 'list',
        message: 'please choices tags to create project',
        choices: tagList.map(item => item.name),
    });

    const dest = await loading(downloadTask, "download template ...")(repo, tag);
    console.log(" 🍀  项目初始化成功～");
    console.log(" 🏠  项目路径：", path.resolve(projectName));
    await ncp(dest, path.resolve(projectName));

    if (!fs.existsSync(path.join(dest, 'render.js'))) {
        await ncp(dest, path.resolve(projectName));
    } else {
        await new Promise((resolve, reject) => {
            MetalSmith(__dirname)
                .source(dest)
                .destination(path.resolve(projectName))
                .use(async (files, metal, done) => {
                    const args = require(path.join(dest, 'render.js'));
                    const obj = await inquirer.prompt(args);
                    const meta = metal.metadata();
                    Object.assign(meta, obj);
                    delete files['render.js'];
                    done();
                })
                .use((files, metal, done) => {
                    const obj = metal.metadata();
                    Reflect.ownKeys(files).forEach(async (file) => {
                        if (file.includes('js') || file.includes('json')) {
                            let content = files[file].contents.toString();
                            if (content.includes('<%')) {
                                content = await render(content, obj);
                                files[file].contents = Buffer.from(content);
                            }
                        }
                    });
                    done();
                })
                .build((err) => {
                    if (err) {
                        reject();
                    } else {
                        resolve();
                    }
                });
        });

    }
};