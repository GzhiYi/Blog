---
ayout: post
title:  "为node应用增加hot reload"
date:   2021-08-17 14:33:00 +0800
categories: node
---
![nodemon](https://i.loli.net/2021/08/17/24wim8VqIhJK3kg.png)  

起了一个express应用，初期基本上都是修改一处，随后ctrl + c后再run，等应用稍微大一些些的时候，会被反复的重启应用影响开发效率。

上面就是热更新（hot reload）解决的最大的痛点。

### 使用nodemon进行热更新

[nodemon](https://nodemon.io/)可以在node应用中一旦有任何代码上的改动都会重新启动你的应用。推荐在项目内添加而不是全局使用。

在项目中：

```shell
yarn add nodemon --dev
```

在package中的script脚本，替换原有的node启动命令为：

```json
{
  "scripts": {
    "dev": "nodemon index.js"
  }
}
```

随后就可以通过`yarn run dev`的方式运行带有hotreload的node应用了。


