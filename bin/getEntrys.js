const glob = require('glob');

/**
 * 获取开发启动页面路径
 * @param {*} globPath
 * @param {*} startPages
 */
const getEntrys = (globPath, startPages) => {
    let files = glob.sync(globPath);
    if (startPages && startPages !== '**') {
        let list = [];
        for (const item of files) {
            for (const page of startPages) {
                if (item.indexOf(page.path) > -1) {
                    list.push(item);
                }
            }
        }
        files = list;
    }

    let result = {};
    for (let file of files) {
        let paths = file.replace('./client/pages/', '').split('/');
        paths.pop();
        let entryName = paths.join('_');
        result[entryName] = file;
    }

    return result;
};

module.exports = getEntrys;
