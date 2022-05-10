---
layout: post
title:  "分离小程序环境"
date:   2019-09-08 20:00:00 +0800
categories: 小程序
---

官方文档很模糊，搜索到了几条关于小程序环境分离的问题，大部分吐槽官方怎么没有一个好的办法分离开发和生产环境。

## 分离方式

1. 云函数在调用的时候指定环境，依据云函数所在的环境进行动态设置。

```javascript
const wxContext = cloud.getWXContext()
  cloud.updateConfig({
    env: wxContext.ENV
  })
  // 初始化数据库
  const db = cloud.database({
    env: wxContext.ENV
  })
```

2. 小程序端起到起立环境的主要作用。在appjs中。

```javascript
     wx.cloud.init({
        traceUser: true,
        env: 'release-wifo3', // 测试环境
        // env: 'dandan-zdm86' // 正式环境
      })
```
预览小程序的时候开启测试环境的env，在部署上线发布的时候再切换为正式环境。