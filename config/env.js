const fs = require('fs');
const path = require('path');
module.exports = filePath => {
    let fileName = path.join(__dirname, filePath);
    let fileContent = fs.readFileSync(fileName, { encoding: 'utf-8' });
    let content = fileContent.replace(/\s*/g, ''); // 把换行和回车替换
    let arr = (content.split(';') || []).map(item => item.split('='));
    let obj = {};
    arr.forEach(item => {
        obj[item[0].trim()] = item[1].trim();
    });
    return obj;
};
