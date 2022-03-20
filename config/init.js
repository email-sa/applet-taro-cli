const { readFileSync, writeFileSync } = require('fs');
const path = require('path');
// const { readFileSync, writeFileSync } = fs;
function updateProjectConfig(filePath) {
    const fileOption = { encoding: 'utf-8' };
    const fileContent = readFileSync(filePath, fileOption);
    let config = JSON.parse(fileContent.toString());
    const appid = {
        development: '',
        testing: '',
        production: ''
        // development: 'wx989cad3a4dc96fb9',
        // testing: 'wxe25528aac2acd617',
        // production: 'wx612e638e8053d5c5'
        // API_URL = 'https://local-wechat-dev.travel.vcolco.com/v1';
        // UPLOAD_URL = 'https://local-wechat-dev.travel.vcolco.com/v1'
    };
    config.appid = appid[process.env.NODE_ENV || 'development'];
    let newStr = JSON.stringify(config, null, 2);
    writeFileSync(filePath, newStr, fileOption);
}

updateProjectConfig(path.join(__dirname, '../project.config.json'));
