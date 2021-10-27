const glob = require('glob');

/**
 * 获取开发启动页面路径
 * @param {*} globPath
 * @param {*} startPages
 */
const getEntrys = (globPath, startPages) => {
    let files = glob.sync(globPath);

    if (startPages && startPages !== '**') {
        const list = [];

        for (const item of files) {
            for (const page of startPages) {
                if (item.indexOf(page.path) > -1) {
                    list.push(item);
                }
            }
        }
        files = list;
    }

    const result = {};

    for (const file of files) {
        const paths = file.replace('./client/pages/', '').split('/');

        paths.pop();
        const entryName = paths.join('_');

        result[entryName] = file;
    }

    return result;
};

module.exports = getEntrys;
