# react 多页面脚手架项目

## 开发

```
npm i

npm start
```

## 提交

提交使用 `git cz`

## 打包上线

```
npm run build

npm run uploadcdn

取dist文件夹中的html文件使用即可
```

## 目录结构

```
- bin // 用于放置页面打包的配置文件(dev/prod)
- client // 客户端业务代码
---- common // 公用文件
---- components // 跨页面公用组件
---- pages // 页面
- server // 请求接口数据文件
- uploadcdn.js // 上传资源组件
- webpack.conf.js // webpack开发时配置
- webpack.prod.conf.js // webpack生产包时配置
```

## 添加新页

1. 在 `bin/devPageConfig.js` 下添加页面信息, `name`、`path` 和 `pack`, `pack`仅在开发时生效，标识该页面是否打包

2. 在`pages`目录下建立新页

3. 重新启动 `npm start` 命令
