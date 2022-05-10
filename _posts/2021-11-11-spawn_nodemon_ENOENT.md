---
layout: post
title:  "node运行命令出现spawn nodemon ENOENT错误 "
date:   2021-11-11 10:19:52 +0800
categories: 前端
---

为了节约硬盘空间，我把某个项目的node_module删除后用pnpm重新安装依赖，但出现spawn nodemon ENOENT的错误从而没法运行起来。

这个错误大概的原因是该命令不存在或者某些处理路径不存在，亦或者是个别平台出现的bug。我把pnpm安装的依赖删除后再用yarn去安装却能正常运行，所以我能定位到是pnpm的问题。

看错误信息，大概的猜得出是nodemon这个命令不存在。果然在全局安装nodemon之后，运行就正常了。

```bash
npm install nodemon -g
```

项目存在monorepo，使用pnpm无法直接安装monorepo下的依赖，这有待查看pnpm文档解决。
