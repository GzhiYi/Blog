---
layout: post
title:  "Docker的一些需记基础命令和用法"
date:   2021-07-29 10:44:51 +0800
categories: Docker
---

由于docker目前在项目中用的比较少，慢慢在写项目的过程中，有一些命令会被我遗忘掉。所以我把一些基础常用的docker命令列下来，方便自己在回顾docker或者重新使用的时候快速运用上。在后续的时间里，也会尽可能的将docker应用到能用上的项目中。

## 安装

我用linux比较多，所以只记录在linux下的安装步骤。

1. 如果有旧版本的docker，需要先卸载旧版本。旧版本为docker或者docker-engine。

```bash
sudo apt-get remove docker docker-engine docker.io
```

2. 用脚本安装。

```bash
curl -fsSL get.docker.com -o get-docker.sh
sudo sh get-docker.sh --mirror Aliyun
```

3. 启动docker

```bash
sudo systemctl enable docker
sudo systemctl start docker
```

4. 建立docker用户组

```bash
sudo groupadd docker
sudo usermod -aG docker $USER
```

5. 测试是否安装好

```bash
docker run --rm hello-world
```

## 常用命令

注意-t之类的命令是用于修饰动作的，比如`run -t-d`

### 镜像使用

- 拉取

```bash
docker pull ubuntu:18.04 # 拉取ubuntu镜像，对应版本（tag）为18.04
```

- 运行（这个镜像为基础启动并运行一个容器）

```bash
docker run -it ubuntu:18.04 bash # -ℹ交互式操作，-t终端
```

- 列出

```bash
docker image ls # ls后跟具名可以过滤该名的镜像； -a列出所有镜像
```

- 删除

```bash
docker image rm [IMAGE ID / 仓库名：标签] # id不需要全部打完，输入前3个就可以定位到
# 例如删除ubuntu
docker image rm ubuntu:18.04
```

### 容器使用

容器是独立运行的一个或一组应用，以及它们的运行态环境。

- 列出

```bash
docker container ls # ls只列出当前运行的容器，ls -a列出所有容器，包含了已经停止运行的
```

- 启动（这个镜像为基础启动并运行一个容器）

创建一个新的容器

```bash
docker run -it ubuntu:18.04 bash # -ℹ交互式操作，-t终端
```

启动一个已经停止的容器

```bash
docker container start [CONTAINER ID] # id不需要全部打完，输入前3个就可以定位到
```

- 守护态运行

```bash
docker run -it -d ubuntu:18.04 bash # -ℹ交互式操作，-t终端
```

如果需要查看守护态容器的日志信息，可以使用：

```bash
docker logs [CONTAINER ID] # id不需要全部打完，输入前3个就可以定位到
```

- 停止

```bash
docker container stop [CONTAINER ID] 
# 如果需要重新启动，可以restart
docker container restart [CONTAINER ID]
```

- 进入容器

一般来说，都是需要一个可交互的终端进入容器

```bash
docker exec -it [CONTAINER ID] bash # exec进入容器，使用exit并不会停止容器的运行，这和attach不一样
```

- 删除

```bash
docker container rm [CONTAINER ID]

# 如果想清理所有停止运行的容器
docker container prune
```

## Docker Hub

### 登陆和退出docker hub

```
docker login
docker logout
``

### 镜像的搜索

```bash
docker search ubuntu # 可以看到搜索出来的镜像
```

## 数据卷Volume

数据卷 可以在容器之间共享和重用
对 数据卷 的修改会立马生效
对 数据卷 的更新，不会影响镜像
数据卷 默认会一直存在，即使容器被删除

- 创建

```bash
docker volume create my-vol
```

- 查看

```bash
docker volume ls # 查看所有的数据卷
docker volume inspect [VOLUME NAME] # 查看某个数据卷的信息
```

- 启动

在使用docker run命令的时候，带上`--mount`将数据卷挂载到容器中

```bash
docker run -d -P --name web --mount source=my-vol,target=/usr/share/nginx/html nginx:alpine # --name 定义容器的名称
```

以上命令。创建一个名为`web`的容器，家在一个数据卷到容器web的`/usr/share/nginx/html`目录。

查看数据卷的具体信息

```bash
docker inspect web
```

结果：

```json
"Mounts": [
  {
    "Type": "volume",
    "Name": "my-vol",
    "Source": "/var/lib/docker/volumes/my-vol/_data",
    "Destination": "/usr/share/nginx/html",
    "Driver": "local",
    "Mode": "",
    "RW": true,
    "Propagation": ""
  }
],
```

- 删除

```bash
docker volume rm [VOLUME NAME] # 删除指定的数据卷
docker volume prune # 删除无主的数据卷
```

- 挂载目录

```bash
$ docker run -d -P --name web --mount type=bind,source=/src/webapp,target=/usr/share/nginx/html nginx:alpine
```

如果source为绝对路径，则为挂载主机的目录。

## 网络

### 外部访问容器

通过-P或-p参数指定或者不制定端口的方式让外部访问容器内部的网络应用。

```bash
docker run -d -P nginx:alpine # 启动一个容器
docker container ls
```

在PORTS那一列，可以看到：

```
0.0.0.0:32768->80/tcp
```

这里表示着本机的32768端口被映射到了容器的80端口，意味着在本机上访问32768端口就可以访问到容器的nginx默认页面。访问方式为本机ip + 端口（32768）。

### 容器互联

通过docker网络的方式让连接到创建的网络上实现容器之间的互联。

- 创建网络

```bash
docker network create -d bridge [NETWORK NAME]
```

运行第一个容器并连接到网络[NETWORK NAME]

```bash
docker run -it --rm --name busybox1 --network [NETWORK NAME] busybox sh
```

运行第一个容器并连接到网络[NETWORK NAME]

```bash
docker run -it --rm --name busybox2 --network [NETWORK NAME] busybox sh
```

以上两个容器连接到了同一个网络[NETWORK NAME]，某一个容器都可以ping通与之连载在同一个网络下的容器。

```bash
/ # ping busybox2
PING busybox2 (172.19.0.3): 56 data bytes
64 bytes from 172.19.0.3: seq=0 ttl=64 time=0.072 ms
64 bytes from 172.19.0.3: seq=1 ttl=64 time=0.118 ms
```