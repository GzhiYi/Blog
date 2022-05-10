---
layout: post
title:  "npm全局安装package出现EACCES permissions"
date:   2021-07-16 20:00:00 +0800
categories: npm
---

如果在使用npm安装全局package的时候出现EACCES错误，可以这样解决：

1. 重新安装npm（推荐）。
2. 手动修改npm的默认目录。

### 重新安装npm

重新安装是最好的解决这个问题的办法。可以点击[这里](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)看看重新安装的步骤。在安装node版本管理工具之前是不需要删除在你设备的当前的npm或者nodejs。

### 手动修改npm的默认目录

> 这种方法不适用于windows平台。

1. 在终端中创建一个用于npm全局安装的目录.npm-global

```bash
mkdir ~/.npm-global
```

2. 配置npm为一个新的文件目录路径

```bash
npm config set prefix '~/.npm-global'
```

3. 在~/.profile中增加下面这一行，没有这个文件的可以新建一个。

```bash
export PATH=~/.npm-global/bin:$PATH
```

4. 更新系统变量。

```bash
source ~/.profile
```

5. 测试看看还有没有权限报错。

```bash
npm install -g jshint
```