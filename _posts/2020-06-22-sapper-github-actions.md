---
layout: post
title:  "使用github actions自动编译部署sapper-blog"
date:   2020-06-22 20:00:00 +0800
categories: Blog
---

之前构建好了的[博客](/blog/2020-06_build-blog)，通过编写一个脚本实现本地自动化部署。脚本实现的功能就是在本地处理项目的打包并将静态文件推送到远端的`gh-pages`分支以实现静态文件部署。在了解github actions之后，决定增加一个自动化打包部署的workflow。这样就可以将编译打包的操作完全放置在”云端“。

## 编写workflow配置文件

在项目根目录创建`.github/workflows/main.yml`

```yaml
name: Deploy GitHub Pages

on:
  push:
  	# push钩子监听的分支，为编译打包的分支
    branches:
      - feat/dev

# 任务
jobs:
  build-and-deploy:
    # 服务器环境：最新版 Ubuntu
    runs-on: ubuntu-latest
    steps:
      # 拉取代码
      - name: Checkout
        uses: actions/checkout@v2
        with:
          persist-credentials: false

      # 生成静态文件
      - name: Build
        run: npm install && npm run export && cp -i CNAME __sapper__/export

      # 部署到 GitHub Pages
      - name: Deploy
        uses: JamesIves/github-pages-deploy-action@releases/v3
        with:
          ACCESS_TOKEN: ${{ secrets.GH_PAGES }}
          BRANCH: gh-pages
          FOLDER: __sapper__/export
```

上面配置有个别要注意的点：

1. branches需要设置为要处理的分支。

2. with/ACCESS_TOKEN为github生成的token。

   生成步骤：

   [github右上角的Settings-Developer settings-Personal access tokens](https://github.com/settings/tokens) 点击`Generate new token`，为了和配置文件对应，token的note需要填写为GH_PAGES，然后勾选scope为repo。

   在博客的仓库的setting设置secret。

   ![Xnip2020-06-22_14-12-10.jpg](https://i.loli.net/2020/06/22/jurxoLcUY7p5C8a.jpg)

3. with/FOLDER为sapper导出export的静态文件目录。

以上完成之后，将代码push到远端仓库，就可以在Actions看到名字为`Deploy Github Pages`的workflow。

![Xnip2020-06-22_14-15-32.jpg](https://i.loli.net/2020/06/22/bCxitLWKVlgHD8P.jpg)

## 体会

Github Actions比在公司使用gitlab cicd快了不少，体验非常不错。在写完博客之后，只需要做的，只有将更新的内容push到github就可以了。

