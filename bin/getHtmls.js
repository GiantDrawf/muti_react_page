const HtmlWebpackPlugin = require('html-webpack-plugin');
const glob = require('glob');

module.exports = function createHtml(globPath, startPages, env) {
    let files = glob.sync(globPath);
    const list = [];

    if (startPages) {
        for (const item of files) {
            for (const page of startPages) {
                if (item.indexOf(page.path) > -1) {
                    list.push({
                        path: item,
                        name: page.name,
                    });
                }
            }
        }
        files = list;
    } else if (env === 'production') {
        const allPages = require('./devPageConfig.js');

        for (const item of files) {
            for (const page of allPages) {
                list.push({
                    path: item,
                    name: page.name,
                });
            }
        }
        files = list;
    }

    return [
        ...files.map((file) => {
            const path = file.path.replace('./client/pages/', '');
            const paths = path.split('/');

            paths.pop();
            const entryName = paths.join('_');

            return new HtmlWebpackPlugin({
                title: file.name,
                template: file.path,
                filename: `${entryName}.html`,
                inject: false,
                hash: false,
                chunks: [entryName],
            });
        }),
    ];
};
