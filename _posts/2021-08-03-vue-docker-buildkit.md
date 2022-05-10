---
layout: post
title:  "用docker构建vue项目镜像，与buildkit体积对比"
date:   2021-08-03 16:18:06 +0800
categories: docker
---

## 使用Dockerfile去打包一个vue项目镜像

```bash
vue create hello-world
cd hello-world && touch Dockerfile
```

Dockerfile内容

```bash
FROM node:lts-alpine
RUN npm install -g http-server
WORKDIR /app
COPY package*.json ./
RUN npm install 
COPY . .
RUN npm run build
EXPOSE 8080
CMD ["http-server", "dist"]
```

### 镜像构建与容器运行

```bash
docker build -t vue:demo . # 构建镜像
docker run -it -d -P vue:demo
docker container ls # 查看映射的端口
```

查看生成的镜像大小为：287MB。

### 使用buildkit优化镜像体积

新的Dockerfile

```bash
# systax = docker/dockerfile:experimental
FROM node:lts-alpine
RUN npm install -g http-server
WORKDIR /app
COPY package*.json ./
RUN --mount=type=cache,target=/app/node_modules,id=my_app_npm_module,sharing=locked\
    --mount=type=cache,target=/root/.npm,id=npm_cache \
    npm install 
COPY . .
RUN --mount=type=cache,target=/app/node_modules,id=my_app_npm_module,sharing=locked \
    # --mount=type=cache,target=/app/dist,id=my_app_dist,sharing=locked \
    npm run build
EXPOSE 8080
CMD ["http-server", "dist"]
```

### 构建镜像

```bash
DOCKER_BUILDKIT=1 docker build -t vue:buildx .
```

对比查看，tag为buildx的镜像体积为：124MB。

体积减少了一半，是用buildkit对node_modules进行缓存处理。