---
layout: post
title:  "Visual Studio Code快速上下滚动光标"
date:   2020-06-30 20:00:00 +0800
categories: 代码工具
---

设置光标快速滚动，可以在少动鼠标的情况下快速滚动到目标代码处，结合常用的快捷键，可以提高编码效率。

## 设置

在vscode，打开设置-键盘快捷方式，点击下图打开[keybindings.json](https://code.visualstudio.com/docs/getstarted/keybindings#_advanced-customization)。

![Xnip2020-06-30_17-21-04.jpg](https://i.loli.net/2020/06/30/5IA78WnLfSpmeJP.jpg)

在json底部添加：

```json
  {
    "key": "cmd+up",
    "command": "cursorMove",
    "args": {
      "to": "up",
      "by": "line",
      "value": 3
    },
    "when": "editorTextFocus"
  },
  {
    "key": "cmd+down",
    "command": "cursorMove",
    "args": {
      "to": "down",
      "by": "line",
      "value": 3
    },
    "when": "editorTextFocus"
  }
```

可以将cmd更改为未占用或者舒服的按键。

可以将value更改为自己舒适的一次按键滚动行数。

找了好久的办法，就想实现快速滚动，因为平时如果键盘和鼠标切换多了，总有种**代码输出伤害溢出大**的感觉。

