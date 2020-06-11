const path = require('path');
const postImport = require('postcss-import');
const nextcss = require('postcss-cssnext');
const adaptive = require('postcss-adaptive');
const getEntrys = require('./bin/getEntrys.js');
const getHtmls = require('./bin/getHtmls.js');
const devPageConfig = require('./bin/devPageConfig.js');

// 获取开发打包路径
const getPackPageConfig = () => {
    const packPages = [];
    const packPagesNames = [];
    devPageConfig.forEach(item => {
        if (item.pack) {
            packPages.push(item);
            packPagesNames.push(item.name);
        }
    });

    console.log(`待打包页面 ====> ${packPagesNames.join('、')}`);

    return packPages;
};

const packPages = getPackPageConfig();

module.exports = {
    mode: 'development',
    devtool: 'cheap-module-source-map',
    entry: getEntrys(`./client/pages/**/app.jsx`, packPages),
    output: {
        path: path.resolve(__dirname, 'devtmp'),
        filename: 'js/[name].js',
        publicPath: '/',
        chunkFilename: 'js/[name].chunk.js',
    },
    resolve: {
        extensions: ['.js', '.json', '.jsx'],
        alias: {
            '@': path.resolve(__dirname, 'client'),
            ErrorBoundary: path.resolve(__dirname, 'client/components/errorBoundary'),
        },
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                include: [path.resolve(__dirname, 'node_modules/@ifeng/'), path.resolve(__dirname, 'client')],
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        presets: [
                            [
                                '@babel/preset-env',
                                {
                                    targets: {
                                        browsers: [
                                            ('Chrome >= 60',
                                            'Safari >= 10.1',
                                            'iOS >= 10.3',
                                            'Firefox >= 54',
                                            'Edge >= 15'),
                                        ],
                                    },
                                    modules: 'commonjs',
                                    useBuiltIns: 'entry',
                                    debug: false,
                                },
                            ],
                            '@babel/preset-react',
                        ],
                        plugins: [
                            '@babel/plugin-transform-runtime',
                            '@babel/plugin-syntax-dynamic-import',
                            '@babel/plugin-syntax-import-meta',
                            '@babel/plugin-proposal-class-properties',
                            '@babel/plugin-proposal-json-strings',
                            [
                                '@babel/plugin-proposal-decorators',
                                {
                                    legacy: true,
                                },
                            ],
                            '@babel/plugin-proposal-function-sent',
                            '@babel/plugin-proposal-export-namespace-from',
                            '@babel/plugin-proposal-numeric-separator',
                            '@babel/plugin-proposal-throw-expressions',
                            '@babel/plugin-transform-async-to-generator',
                        ],
                    },
                },
            },
            {
                test: /\.s?css$/,
                include: [path.resolve(__dirname, 'node_modules/@ifeng/'), path.resolve(__dirname, 'client/')],
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            localIdentName: '[path][name]_[local]',
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                            plugins: [
                                postImport(),
                                nextcss({
                                    browsers: ['last 2 versions', 'IOS >= 8', 'android>= 4'],
                                }),
                                adaptive({
                                    remUnit: 75,
                                    autoRem: true,
                                    useCssModules: true,
                                }),
                            ],
                        },
                    },
                ],
            },
            {
                test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif|jpeg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 20480,
                            name: '[name].[hash:8].[ext]',
                            outputPath: 'images/',
                        },
                    },
                ],
            },
            {
                test: /\.ejs$/,
                use: 'handlebars-loader',
            },
        ],
    },
    plugins: [...getHtmls('./client/pages/**/template.ejs', packPages, 'development')],
};
