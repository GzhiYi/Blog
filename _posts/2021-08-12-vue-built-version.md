---
layout: post
title:  "Vue构建出来的版本"
date:   2021-08-12 15:43:53 +0800
categories: vue
---

![图 2](https://i.loli.net/2021/08/12/gPNOFU8ycMaV9Jh.png)  

### Vue构建版本

vue构建的版本好多，可以从上图看到。从源码的构建上了解vue构建的版本。

从`/scripts/config.js`中看到，`builds`常量定义了各个构建版本的配置。比如：

```javascript
'web-runtime-cjs-dev': {
  entry: resolve('web/entry-runtime.js'),
  dest: resolve('dist/vue.runtime.common.dev.js'),
  format: 'cjs',
  env: 'development',
  banner
},
```

表示要构建出cjs格式的vue源码。而`web-runtime`也表示了只构建出runtime版本的vue源码。`-dev`则表示不会进行代码压缩，构建出来的版本属于开发版本。

除了上面列举的第一个外，还有：

- `web-runtime-cjs-prod`。 构建【web平台、commonjs、runtime、生产版】源码；对应输出的文件为：`dist/vue.runtime.common.prod.js`。
- `web-full-cjs-dev`。 构建【web平台、commonjs、runtime、compiler、开发版】源码；对应输出的文件为：`dist/vue.common.dev.js`。
- `web-full-cjs-prod`。 构建【web平台、commonjs、runtime、compiler、生产版】源码；对应输出的文件为：`dist/vue.common.prod.js`。
- `web-runtime-esm`。 构建【web平台、esmodule、runtime】源码；对应输出的文件为：`dist/vue.esm.js`。
- `web-full-esm`。 构建【web平台、esmodule、runtime、compiler】源码；对应输出的文件为：`dist/vue.esm.js`。
- `web-full-esm-browser-dev`。 构建【web平台、esmodule、runtime、compiler、浏览器直接引入、开发版】源码；对应输出的文件为：`dist/vue.esm.browser.js`。
- `web-full-esm-browser-prod`。 构建【web平台、esmodule、runtime、compiler、浏览器直接引入、生产版】源码；对应输出的文件为：`dist/vue.esm.browser.min.js`。
- `web-runtime-dev`。 构建【web平台、runtime、umd、开发版】源码；对应输出的文件为：`dist/vue.runtime.js`。
- `web-runtime-prod`。 构建【web平台、runtime、umd、生产版】源码；对应输出的文件为：`dist/vue.runtime.min.js`。
- `web-full-dev`。 构建【web平台、runtime、umd、compiler、开发版】源码；对应输出的文件为：`dist/vue.js`。
- `web-full-prod`。 构建【web平台、runtime、umd、compiler、生产版】源码；对应输出的文件为：`dist/vue.min.js`。
- `web-compiler`。 构建【web平台、commonjs、compiler】源码；对应输出的文件为：`packages/vue-template-compiler/build.js`。
- `web-compiler-browser`。 构建【web平台、commonjs、compiler】源码；对应输出的文件为：`packages/vue-template-compiler/browser.js`。
- `web-server-renderer-dev`。 构建【服务端、commonjs、开发版】源码；对应输出的文件为：`packages/vue-server-renderer/build.dev.js`。
- `web-server-renderer-prod`。 构建【服务端、commonjs、生产版】源码；对应输出的文件为：`packages/vue-server-renderer/build.prod.js`。
- `web-server-renderer-basic`。 构建【服务端、umd、basic版】源码；对应输出的文件为：`packages/vue-server-renderer/basic.js`。
- `web-server-renderer-webpack-server-plugin`。 构建【服务端、commonjs、服务端插件版】源码；对应输出的文件为：`packages/vue-server-renderer/server-plugin.js`。
- `web-server-renderer-webpack-client-plugin`。 构建【服务端、commonjs、客户端插件版】源码；对应输出的文件为：`packages/vue-server-renderer/client-plugin.js`。


## 版本区别

| | UMD | CommonJS | ES Module |
| --- | --- | --- | --- |
| **全版本** | vue.js | vue.common.js | vue.esm.js |
| **只包含运行时** | vue.runtime.js | vue.runtime.common.js | vue.runtime.esm.js |
| **全版本（生产版）** | vue.min.js | | |
| **只包含运行时（生产版）** | vue.runtime.min.js | | |

- **Full**: 包含了编译器和运行时。

- **Compiler**: 编译版本。可以把template字符串代码编译为javascript render函数。

- **Runtime**: 用来创建 Vue 实例、渲染并处理虚拟 DOM 等的代码。基本上就是除去编译器的其它一切。

- **[UMD](https://github.com/umdjs/umd)**: UMD 版本可以通过`script`标签直接用在浏览器中。

- **[CommonJS](http://wiki.commonjs.org/wiki/Modules/1.1)**: CommonJS 版本用来配合老的打包工具比如 Browserify 或 webpack 1。这些打包工具的默认文件 (pkg.main) 是只包含运行时的 CommonJS 版本 (vue.runtime.common.js)。

- **[ES Module](http://exploringjs.com/es6/ch_modules.html)**: ES module版本提供给现代的打包工具，比如webpack2、rollup。为这些打包工具提供的默认文件 (pkg.module) 是只有运行时的 ES Module 构建 (vue.runtime.esm.js)


一般也是要用运行时的版本，运行时版本只占用全版本提及的30%。我们在使用webpack的vue-loader工具最后到网页的呈现时，用的就是运行时的版本，`*.vue` 文件内部的模板会在构建时预编译成 JavaScript render函数。