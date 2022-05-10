---
layout: post
title:  "chrome出现Caution provisional headers are shown的问题"
date:   2019-01-07 20:00:00 +0800
categories: 前端
---

开发的一个项目出现一个Caution：
```bash
Caution provisional headers are shown
```
注：这个提示出现在chrome开发者工具的每一个接口请求上。这也只是个警告，还要理它干啥？先看看Google“热搜”的第一个解答：
[“CAUTION: provisional headers are shown” in Chrome debugger](https://stackoverflow.com/questions/21177387/caution-provisional-headers-are-shown-in-chrome-debugger)
“请求被阻塞，东西发不出去，自然没有东西回来”  
在答者那的例子他说是被adblock拦截了。

## 问题

在项目上线的这段时间内，前期由于使用的少，并未将问题暴露出来，后面使用的人数多了之后，就会出现一个高概率的事情：
**个别接口请求一直处于pending状态，数据无法回流**  
这个问题比较严重，后面一直在找解决方案。我的思路历程是：
1. 一开始发现这个问题的时候，有些不可思议，第一次遇到，如果这是一个普遍的问题，为啥又只会出现在个别接口（非固定的个别接口）？
2. 调试工具出现`provisional headers are shown`的警告，瞄准这个警告入手。找到了大量相关的问题描述和方法，在前端这边的处理都未解决。在拦截器修改头，在`net-internals`抓起日志等就差在每个请求后加上时间戳了（怀疑是前端缓存cache出现异常）。
3. 开始怀疑是后端的问题。与后端商量后，在日志打印那发现每一个请求返回都在几毫秒内。当然这个好像没有什么参考性，因为前端貌似这边请求并未成功发出。
4. 发现除chrome默认模式外，其它浏览器比如firefox、Edge都没这个问题。甚至在chrome无痕模式也没有这个问题。这时候觉得解决问题比找到原因更重要了（因为已经上线了）。
5. 经过后端前端的协调与商量，发现这大概率是因为前后端跨域而出现的问题。

## 解决

**设置请求接口与静态文件处于同源状态（需要nginx配置），警告消失，经过一段时间观察，问题解决。**