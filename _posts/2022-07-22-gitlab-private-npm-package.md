---
layout: post
title:  在自建 GitLab 中 使用 NPM Packages
date:   2022-07-22 16:26:52 +0800
categories: GitLab
---

如果不想将个人 npm 包放到外部访问，只能在个别项目上引入的话，可以使用 GitLab 的 Package Registry 服务。实际上不止 npm 包，还有很多比如 Composer、Ruby gems 等都可以将一个 Git 仓库作为一个 Package。

这里只说明 npm 的包上传和使用。

## 上传 package 到 GitLab

首先需要一个 Deploy Token 才能上传。这个 Token 可以让你读取包(packages)、代码内容(repository)、代码镜像(registry images)。

进入项目（具有package.json的仓库，这里不做区分，仓库就是 npm 包！） - 设置 - 仓库设置 - 部署令牌。英文则是：Settings - Repository - Deploy tokens。

填写令牌名称和过期时间（不填则永久），注意必须勾选 `读` 和 `写` 权限，否则不能正常上传和引入。

新建一个 .npmrc 文件存放当前项目的 npm 配置。内容如下：

```bash
registry=https://私有GitLab域名/api/v4/projects/项目ID/packages/npm/
//私有GitLab域名/api/v4/projects/项目ID/packages/npm/:_authToken=部署令牌
```

说明：

1. 私有 GitLab 域名。填写正在使用 GitLab 域名。
2. 项目ID。在项目主页信息中有个 Project ID 显示。
3. 部署令牌。由上面操作生成的具有读和写操作的令牌。

上传到 GitLab 上，还需要最后一步，在 `package.json` 中指定发布配置 Registry 地址。

```json
"publishConfig ": {
    "registry": "https://私有Gitlab域名/api/v4/projects/项目ID/packages/npm/"
}
```

然后就可以发布了。

```bash
npm publish
```

发布成功后，就可以在 GitLab 仓库的 `包&镜像(Packages & Registries)` 中找到刚刚上传的镜像。

## 外部引用

在需要引入的项目中，创建一个 .npmrc 文件。一样将上面 .npmrc 内容复制过来，就可以直接 npm install 了，当然需要在 项目的 package.json 中设置引入包名以及版本。
