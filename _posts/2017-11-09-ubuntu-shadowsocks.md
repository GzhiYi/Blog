---
layout: post
title:  "如何在ubuntu下使用shadowsocks"
date:   2017-11-09 20:00:00 +0800
categories: linux
---

### 提示：
1. 测试环境：Ubuntu 16.04 (gnome桌面环境)
2. 需要ss出国，就需要有ss账号。有很多的出售账号的地方。当然也可以自己搭建个人ss服务器，这里就不再赘述。
3. 需要下载软件Shadowsocks-Qt5,具体下面会列出。
4. 提供SwitchyOmega配置文件，不需要自己配置。
5. 每次开机需要手动连接Qt5，除非设置自动连接。
6. [文件](https://github.com/GzhiYi/frontend-log/releases/tag/ss)
## 步骤(Steps):
- 下载Shadowsocks-Qt5：  
```
sudo add-apt-repository ppa:hzwhuang/ss-qt5
sudo apt-get update
sudo apt-get install shadowsocks-qt5
```  
- 打开Qt5，右键空白选择添加。对应填上自己的ss账号信息。  
有多种添加账号的方式，哪种合适用哪种。账号信息填好就点击新建的账号连接。如果ip能连通一般有延迟显示。
- 下载SwitchyOmega  
可以提供gfw过滤等，在chrome下使用体验很不错。  
[chrome上车](https://chrome.google.com/webstore/detail/proxy-switchyomega/padekgcemlokbadohgkifijomclgjgif?utm_source=chrome-ntp-icon)  
[fireFox上车](https://addons.mozilla.org/zh-CN/firefox/addon/switchyomega/)    
文件在提示第六条有release下载。
- 配置SwitchyOmega  
点击选项--导入/导出--从备份文件恢复。选择文件  
```
OmegaOptionsChrome.bak
```  
- 开启switchyOmega  
选择switchyOmega的自动切换

## 开机自启方法

1. 选择Qt5添加的项目右键--编辑，勾选程序启动时自动连接
2. Qt5  设置--常规设置--登录时启动
