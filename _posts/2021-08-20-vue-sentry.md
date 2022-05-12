---
layout: post
title:  "vue引入sentry上报web异常"
date:   2021-08-20 16:10:25 +0800
categories: vue
---

![sentry](https://i.loli.net/2021/08/20/fLZgCaUNwyb5VI8.png)

如果不知道sentry的，可以到官网了解一下功能。[sentry](https://sentry.io/)是一个错误上报，用于监控线上代码运行情况的一个工具。在对vue-cli项目引入sentry时，出现了一些问题，所以需要记录一下，也方便如果有遇到这些问题的人。

### 引入

引入方式不多说，简单提一下。

在vue实例初始化之前完成sentry的引入。

```shell
yarn add raven-js
```

```js
import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'

// sentryDSN 需要填入

if (isProduction) Raven.config(sentryDSN, {
  release: 'xxxx'
}).addPlugin(RavenVue, Vue).install()
```

### sourceMap

前端项目在部署到线上环境之后，都会进行代码压缩混淆。所以线上报错的异常会指向混淆的代码位置，会不容易定位问题。sourceMap不能部署到线上环境，不然会泄露代码。尽管前端代码没有秘密，但可以通过压缩混淆增加秘密的访问成本。

**所以要把sourceMap上传到sentry但不能部署到线上目录**

#### 开启构建生成sourceMap
在`vue.config.js`中，开启productionSourceMap

```js
productionSourceMap: true
```

#### 无法打包出sourceMap

一般而言，开启该属性会在build构建生产文件内的js目录看到对应的.map文件。

不过我遇到就算开启了sourceMap也没有正确打包生成.map文件的问题。
如果出现这样的问题，考虑是否有其余的插件影响到.map文件的生成。

最后发现是webpack插件[UglifyjsWebpackPlugin](https://webpack.docschina.org/plugins/uglifyjs-webpack-plugin/)导致无法打包出.map。

```js
// 就算开启了productionSourceMap也要把下面的选项开启
new UglifyJsPlugin({
  sourceMap: true,
})
```

### 使用SentryCliPlugin上传souceMap

```js
if (isProduction) {
  config.plugin('sentry').use(SentryPlugin, [
    {
      // 指定忽略文件配置
      ignoreFile: '.gitignore',
      // 指定上传目录
      include: './dist',
      // 指定sentry上传配置
      configFile: './.sentryclirc',
      // 指定发布版本, 需要和raven配置的release一致
      release: 'xxxx',
      // 保持与publicPath相符
      urlPrefix: publicPath
    }
  ])
}
```

#### 上传遇到429错误

![sentry-429](https://i.loli.net/2021/08/20/picIGw19U2k4Rvj.png)

出错原因是请求并发过大，要解决这个问题，需要改为手动通过node调用sentryapi上传souceMap。

通过node上传，可以限制上传的并发数，以达到目的。