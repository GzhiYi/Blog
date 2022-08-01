---
layout: post
title: CommonJS 和 Es Module 的一些小总结
date: 2022-08-01 21:10:49 +0800
categories: 前端
---

# 关于 CommonJs 和 Es Module

在之前我写过一个关于 Es Module 的[小总结](/es6-module)，但没加上和 CommonJs 的对比，所以这里就再次做一下这两者的区别和做一下总结。

## 历史区别

Common Js 早于 Es Module。以前 JS 就没有完善的模块化概念，只是通过引入 Script 的方式将脚本进行“模块化”。这样的引入在项目代码多起来之后就变得十分不好维护，而且变量可能会被覆盖，造成污染。随后就出现了 CommonJs，再然后到了 ES6 的时代，正式引入ES Module。

## CommonJs 使用

1. 直接导出。省略了 `module` 关键字：`exports.name`。
2. 导出。

    ```js
    // 对象
    module.exports = {
      name: "GzhiYi"
    }

    // 某个值
    module.exports.name = "GzhiYi"
    ```

3. 混合导出。`exports` 和 `module.exports` 可以混在一起使用。

    ```js
    exports.name = "GzhiYi"
    module.exports.name = "GzhiYi"
    ````

4. 导入。使用 `require` 关键字。导入可以出现在任何地方，所以支持动态导入。

    ```js
    const data = require("./index.js")

    // 动态导入

    const path = "./index.js"
    const data = require(path)
    ```

## Es Module 使用

[前面一篇](/es6-module)有提到，有更加具体的描述。

1. 导出。包含单个导出、混合导出。

    ```js
    // 单个导出
    export const name = "GzhiYi"
    
    // 混合导出
    const name = "GzhiYi"
    const country = "china"

    export { name, country }
    ```

2. 混合导出。

    ```js
    export const city = "Guangzhou"

    export default = {
      age: 18,
      city: "Guangzhou"
    }
    ```

3. 导入。`import { name, age } from './index.js'`。
