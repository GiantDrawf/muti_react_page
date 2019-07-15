const path = require('path');
const getEntrys = require('./bin/getEntrys.js');
const getHtmls = require('./bin/getHtmls.js');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const postImport = require('postcss-import');
const nextcss = require('postcss-cssnext');
const adaptive = require('postcss-adaptive');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({
    size: 1
});
const packageJson = require('./package.json');
const appName = packageJson.name.split('.').join('');

module.exports = {
    mode: 'production',
    devtool: 'source-map',
    entry: getEntrys(`./client/**/app.jsx`, ''),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[chunkhash:8].js',
        publicPath: `https://p0.ifengimg.com/fe/zl/test/live/${appName}/`,
        chunkFilename: `[name].[chunkhash:8].js`
    },
    resolve: {
        extensions: ['.js', '.json', '.jsx'],
        alias: {
            wxSDK: path.resolve(__dirname, 'client/wxUtils/wxSDK.js')
        }
    },
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                include: [
                    path.resolve(__dirname, 'node_modules/@ifeng/'),
                    path.resolve(__dirname, 'client/')
                ],
                use: 'happypack/loader?id=babel'
            },
            {
                test: /\.s?css$/,
                include: [
                    path.resolve(__dirname, 'node_modules/@ifeng'),
                    path.resolve(__dirname, 'client')
                ],
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            localIdentName: '[local]-[hash:base64:8]'
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                            plugins: [
                                postImport(),
                                nextcss({
                                    browsers: [
                                        'last 2 versions',
                                        'IOS >= 8',
                                        'android>= 4'
                                    ]
                                }),
                                adaptive({
                                    remUnit: 75,
                                    autoRem: true,
                                    useCssModules: true
                                })
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif|jpeg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 100,
                            name: '[name].[hash:8].[ext]'
                        }
                    }
                ]
            },
            {
                test: /\.ejs$/,
                use: 'handlebars-loader'
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HappyPack({
            id: 'babel',
            loaders: [
                {
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
                                            'Edge >= 15')
                                        ]
                                    },
                                    modules: 'commonjs',
                                    useBuiltIns: 'entry',
                                    debug: false
                                }
                            ],
                            '@babel/preset-react'
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
                                    legacy: true
                                }
                            ],
                            '@babel/plugin-proposal-function-sent',
                            '@babel/plugin-proposal-export-namespace-from',
                            '@babel/plugin-proposal-numeric-separator',
                            '@babel/plugin-proposal-throw-expressions',
                            '@babel/plugin-transform-async-to-generator'
                        ]
                    }
                }
            ],
            threadPool: happyThreadPool,
            verbose: true
        }),
        new UglifyJsPlugin({
            test: /\.jsx?$/,
            include: [
                path.resolve(__dirname, 'node_modules/@ifeng/'),
                path.resolve(__dirname, 'client/')
            ],
            cache: true,
            uglifyOptions: {
                ie8: false,
                compress: {
                    // remove warnings
                    warnings: false,
                    // Drop console statements
                    drop_console: true
                }
            },
            sourceMap: true
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[hash].css',
            chunkFilename: '[id].[hash].css'
        }),
        ...getHtmls('./client/**/template.ejs', '', 'production')
    ]
};
