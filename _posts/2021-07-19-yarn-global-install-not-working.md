---
layout: post
title:  "npm全局安装yarn不生效的问题"
date:   2021-07-19 20:00:00 +0800
categories: 前端
---

在ubuntu上安装了node和npm，命令行上都可以看到node以及npm的版本号。但通过npm全局安装yarn却不能用的问题。
官网也是建议通过npm进行全局安装。

```bash
npm install --global yarn
```

### 解决


```bash
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update
sudo apt-get install yarn
```

注意不要直接安装yarn，否则会出现以下问题：

```
00h00m00s 0/0: : ERROR: There are no scenarios; must have at least one.
```
是因为安装错了，如果出现上面的提示的问题。可以把安装的yarn移除了：

```bash
sudo apt remove yarn
```