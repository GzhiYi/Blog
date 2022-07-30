---
layout: post
title:  "每次重装Linux Mint减少90%时间"
date:   2017-12-21 20:00:00 +0800
categories: Linux
---

## 系统

1. [Google](https://www.google.com/chrome/browser/desktop/index.html)  
    谷歌页面缩放125%
2. [搜狗输入法](https://pinyin.sogou.com/linux/?r=pinyin)  
    重启-输入法设置成功-QQ登录同步词库
3. 安装扩展透明状态栏  
    设置-面板-扩展
4. terminal  
    ctrl + shift + c --> ctrl + c  
5. 创建ssh key  

[粘贴到github](https://github.com/settings/keys)

```bash
sh-keygen -t rsa -b 4096 -C "gzy.guy@gmail.com"
```
6. 安装oh my zsh

```bash
https://github.com/robbyrussell/oh-my-zsh
sudo apt-get install zsh
sudo apt-get install git
```
7. 设置小飞机  
    [#链接](https://github.com/GzhiYi/frontend-log/issues/2)  
8. 安装vscode   
    [vsCode](https://code.visualstudio.com/)  
    下载安装扩展setting-sync 需要token 和 gistId
9. 字体问题  
    [链接](http://tieba.baidu.com/p/5128932851)  
    软件管理器 - 删除 Fonts-arphic-ukai  Fonts-arphic-uming

## 项目

1. 安装nvm

```bash
sudo apt-get update
sudo apt-get install build-essential libssl-dev
curl -sL https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh -o install_nvm.sh
bash install_nvm.sh
nvm use 6.11.5
```
2. 换源  
    [链接](https://github.com/GzhiYi/frontend-log/issues/4)
3. 安装postgres

```bash
sudo apt-get install postgresql-client
sudo apt-get install postgresql
sudo apt-get install pgadmin3
sudo su - postgres
psql
create role gzhiyi login;
```

4. 安装virtualenv  

```bash
sudo apt-get install virtualenv
```

## 问题

ubuntu 系的chrome有个闪屏的问题， 原因还是因为显卡。
有解决办法：
1. 关闭chrome设置中的硬件加速。
2. 打开 chrome://flags， 找到GPU rasterization，选择Force enable for layers。
第二个不知道有没用。

只是没有闪的问题，但是还有些异常的