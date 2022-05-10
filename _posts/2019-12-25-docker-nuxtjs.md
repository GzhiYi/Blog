---
layout: post
title:  "Docker部署nuxtjs应用"
date:   2019-12-25 20:00:00 +0800
categories: 学习
---

有个主页的项目需要用到ssr。所以选择nuxtjs进行主页开发。关于nextjs的使用可以到官方文档进行查看。这里主要是记录一下docker部署nuxtjs应用的一些小事情。

## Dockerfile

通过dockerfile可以build一个docker镜像。dockerfile内容如下：
```dockerfile
FROM node:11.13.0-alpine

# create destination directory
RUN mkdir -p /app
WORKDIR /app

# copy the app, note .dockerignore
COPY . /app
RUN npm install

# build necessary, even if no static files are needed,
# since it builds the server as well
RUN npm run build

# expose 3000 on container
EXPOSE 3000

# set app serving to permissive / assigned
ENV NUXT_HOST=0.0.0.0
# set app port
ENV NUXT_PORT=3000

# start the app
CMD [ "npm", "start" ]
```

注意：
1. 部署 Nuxt.js 服务端渲染的应用不能直接使用 nuxt 命令，而应该先进行编译构建，然后再启动 Nuxt 服务。
2. 在build之前，需要ignore以下三个规则文件（手动创建.dockerignore文件）：

```
node_modules
npm-debug*
.nuxt
```

否则会出现镜像build失败的情况。

运行命令：docker run -it -d -p 3000:3000 gzhiyi/nuxt-homepage  后面为镜像build后的名称，注意按实际情况进行更改。

## nginx配置

Docker运行node服务，如果需要外部访问的话，需要nginx反向代理。具体配置：

```nginx
server {
    listen 80;
    server_name *your servername*;
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
## 访问
需要配置host才能访问，如下：

```hosts
*your serverip* *your servername*
```