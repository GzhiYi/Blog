---
layout: post
title:  "项目突然跑不起来"
date:   2019-03-08 20:00:00 +0800
categories: 前端
---

## 突遇node建本地开发服务的项目跑不起来
今天早上来上班，发现平时跑的一个项目突然跑不了。症状如下：
1. command无任何异常。
2. autoOpenBrowser正常，打开浏览器后一直转加载。
3. console无任何报错。
4. network仅有一个document处理一直pending的状态。
5. 理应不是端口问题，如果端口被占用会自动选一个的。

## 找问题
1. 查看本机ip变了没有？
2. 这个项目不行，再跑一个其他的同类项目，还是有这个问题？
3. 重启个电脑试一下吧？
4. 最后，问题是：`shadowsocks开了全局代理忘了关`。
![WX20190401-093546](https://user-images.githubusercontent.com/21136420/55298682-903d2d00-5461-11e9-8c7f-6cdb66b0dea2.png)
