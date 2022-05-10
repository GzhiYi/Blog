---
layout: post
title:  "黑苹果计划"
date:   2019-03-08 20:00:00 +0800
categories: MacOS
---

![macos-high-sierra](https://user-images.githubusercontent.com/21136420/53999869-1a0a1b00-4180-11e9-8c8b-8b564e12ff99.jpg)
__看到米本现在黑苹果貌似可以挺稳定的工作，所以想折腾的心就沸腾起来了。也为了方便前端开发！__
## 机器

小米笔记本 13.3 指纹版 i5 7200U；目标系统：macOS High Sierra 10.13

## 前期工作

由于原本在windows上进行开发，还有之前装过windows和mint的双系统，所以现在的状态是GNU 启动。前期有很多的工作要做，是否要重新格盘安装也是未知数。现在前期工作的基本流程是：移除linux分区，移除GNU引导启动，进行备份工作。以上有风险的是：
1. 完全移除linux，稍有不慎可能就启动不了两个系统了。自己在处理这部分的知识不是很足，所以谨慎为妙。
2. 备份工作使用移动硬盘进行备份，主要是工作文档的备份。下面会罗列在windows上进行备份的一些软件链接和配置等。

## windows软件配置列表

- [Google Chrome](https://www.google.com/chrome/)
- Adobe Photoshop CS6
- [Axure RP8](https://www.axure.com/)
- [Bandizip](https://cn.bandisoft.com/bandizip/)
- [ConEmu](https://conemu.github.io/)
- [Foxmail](https://www.foxmail.com/)
- Git version
- Go programming
- KMPlayer
- Logitech 游戏软件
- Microsoft Office Professional Plus 2013
- Microsoft Visual Studio Code 
- Mozilla Firefox
- Node.js
- PostgreSQL 11
- PremiumSoft Navicat Premium
- Fiddler
- PuTTY
- PxCook
- Python 3.7.0
- Ruby
- TIM
- TortoiseSVN
- WinHTTrack Website Copier
- XMind
- Yarn
- 火绒安全软件
- 企业微信
- 贴吧、网易云音乐、微信
- 微信web开发者工具
- 迅雷极速版
- Shadowsocks

## 主要进行开发配置备份

__Chrome__:保证所有内容同步到谷歌服务器。
__Logitech 游戏软件__:关闭鼠标背光，灯光设置-关闭标识。
__Microsoft Visual Studio Code__:确保配置Settings Sync，保存gist以及token。
__PuTTY__: IP:144.34.221.194 Port:28333 Connection type: SSH

## 进度

[教程链接](https://blog.str-mo.com/tech/217/)
- 数据备份------ 0%
- 安装准备 ------ 10%，已刻录mac os镜像
- 原系统处理 ------ 0%

## 关于esp(EFI)分区的扩容

如果是win10和黑果双系统的话，需要保证安装黑果的硬盘内的esp分区大小不小于200M。而win10一般都是100M，所以就必须要进行esp扩容，否则没法对硬盘进行抹除操作。对于这部分，我昨天查了不少的资料，属于点门外汉吧。经过测试，一般的做法是：
1. 在windows下，打开DiskGenius。在windows自带的磁盘管理上，分出一个未分配的磁盘空间，大小够200M即可（压缩卷）。在未分配的磁盘上新建一个esp分区（右键未分配的分区，点击新建分区，后选EFI那个选项），大小为未分配磁盘空间的大小，保存。
2. 在DiskGenius下，浏览原esp分区的文件，将原来的文件复制到桌面，再从桌面复制到新的esp分区上。然后删除原来的100M的esp分区，保存，重启还是可以进入windows的。  
到此，esp分区扩容就完成了。接着按教程走就行。

## 镜像说明

字节莫的镜像存在无法选择Apple安装的问题，在黑果小兵的博客上找到这个镜像的发布说明。[镜像地址](https://blog.daliansky.net/macOS-High-Sierra-10.13.6-17G65-Release-Version-with-Clover-4596-original-mirror.html)。
里面有对这个问题进行说明：  
> 重要提示：由于CLOVER新版的缘故，原来的HD3000/HD4000的配置文件不支持新版，会造成进CLOVER后卡住的情况，请降低CLOVER版本，或者直接删除掉所有的HD3000/HD4000开头的配置文件；

按照上面引用的做法，就不用字节莫的efi文件了，直接用原来的efi然后删除上面的配置文件。删除文件的方法不用说了吧。接着重启就可以选择苹果进入安装了。

## 替换驱动

在mac系统内操作，用访达打开字节莫或者其他好的EFI，依次找路径：EFI-CLOVER-kexts-other文件夹，里面有很多驱动。
1. 触摸板驱动：`ApplePS2SmartTouchPad.kext`。效果：触摸板ok。  

将驱动拖动到Kext Utility，不要拖几次，一次就行，只是有其他加载工作在，等到第二次输入密码的时候就是安装的时候。  
安装后重启驱动效果就有了。

我试了两个ALC的驱动都不能驱动声音。。如果有知道的可以提一下。
亮度也不敢弄，怕显卡驱动不好开不到机，目前配置好了很多开发工具，不大敢冒险了。  
目前亮度的调节是用App Store里面的`Brightness slider`进行调节。治标不治本！

2. 声卡解决：
下载下面这个声卡驱动。按上面一楼的安装方法，完成后重启就行。
链接: https://pan.baidu.com/s/1pkaaUN3hCbxJhkVhX4kn9w 提取码: kiur 
3. 其他：  
如果发现耳机杂音，可以在设置-输出-将平衡拖动到最左或者最右即可。