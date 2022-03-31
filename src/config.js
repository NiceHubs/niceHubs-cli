const fs = require('fs');
const { encode, decode } = require('ini');
const { defaultConfig, configFile } = require('../util/constants.js');

module.exports = (action, k, v) => {
    const o = {};
    if (fs.existsSync(configFile)) {
        let content = fs.readFileSync(configFile, 'utf8');
        content = decode(content);
        Object.assign(o, c);
    }

    if (action === 'get') {
        console.log(o[k] || defaultConfig[k]);
    } else if (action === 'set') {
        o[k] = v;

        fs.writeFileSync(configFile, encode(o));
        console.log(`${k}=${v}`);
    } else if (action === 'getVal') {
        return o[k];
    }
}