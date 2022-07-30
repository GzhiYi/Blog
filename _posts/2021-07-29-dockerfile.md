---
layout: post
title:  "Dockerfile的一些用法记录"
date:   2021-07-29 16:23:53 +0800
categories: Docker
---

对于docker镜像的制作和compose的使用等就在这进行记录，便于学习理解和记忆使用。

## 定制镜像

## Dockerfile

Dockerfile就当作是一个脚本文件，包含了一系列的指令用于构建每一层镜像。

举例一个定制nginx镜像:

新建一个Dockerfile文件，内容：

```bash
FROM nginx
RUN echo '<h1>Hello, Docker!</h1>' > /usr/share/nginx/html/index.html
```

### FROM

指定基础镜像，在这个基础镜像的基础上进行定制。上面的基础镜像就是nginx。如果不以任何镜像为基础进行定制，则可以指定一个空白镜像`scratch`。

```bash
FROM scratch
```

### RUN

- shell格式，直接RUN + 命令的方式。

- exec格式，RUN ["可执行文件", "参数1", "参数2"]

由于每一个RUN指令都会建立一层镜像，所以具有同一个目的的命令应该写在一个RUN里。不要用RUN当作shell命令去写。

如：

```bash
RUN yarn install
RUN yarn build
```
可以修改为：

```bash
RUN yarn install && yarn build
# 如果指令长，可以换行和缩进
RUN yarn install \
    && yarn build
```

最后也是需要记住的重要的事情是需要在每一层的构建后需要清理掉与镜像无关的文件内容。

### 构建镜像

```bash
docker build -t nginx:v3 .

Sending build context to Docker daemon  2.048kB # 发送构建的上下文到docker引擎（上下文为命令中的 .）
Step 1/2 : FROM nginx
latest: Pulling from library/nginx
33847f680f63: Pull complete 
dbb907d5159d: Pull complete 
8a268f30c42a: Pull complete 
b10cf527a02d: Pull complete 
c90b090c213b: Pull complete 
1f41b2f2bf94: Pull complete 
Digest: sha256:8f335768880da6baf72b70c701002b45f4932acae8d574dedfddaf967fc3ac90
Status: Downloaded newer image for nginx:latest
 ---> 08b152afcfae
Step 2/2 : RUN echo '<h1>Hello, Docker!</h1>' > /usr/share/nginx/html/index.html
 ---> Running in 24875d44bcc4
Removing intermediate container 24875d44bcc4
 ---> a79570bc2fc7
Successfully built a79570bc2fc7
Successfully tagged nginx:v3
```

构建完成之后，可以通过`docker image ls`查看构建好的镜像

运行构建的镜像：

```bash
docker run -d -P nginx:v3
# 查看ip+端口就可以看到Hello, Docker!
```

### 镜像构建上下文（context）

`docker build -t nginx:v3 .`

上面这条命令，最后的这个`.`就是构建此次镜像的上下文。指定这个上下文的作用是让其他的指令，如COPY、ADD等可以正确的处理文件内容。

docker build命令执行时，会将这个上下文路径内的所有内容进行打包，上传到docker引擎中，docker引擎在后续就可以得到处理构建镜像过程的所有文件内容。

```bash
COPY ./package.json /app/
```

这个命令不是复制文件的命令，意在复制上下文（/APP/）目录下的package.json文件。

- .dockerignore

如果在上下文中的一些文件不需要/不想被发送到docker引擎，可以使用`.dockerignore`忽略。

### docker build 使用

- 从git仓库进行构建

```bash
docker build -t [IMAGE NAME] [REPO URL]
```

### Dockerfile 指令

- COPY 文件复制

COPY 指令将从构建上下文目录中 <源路径> 的文件/目录复制到新的一层的镜像内的 <目标路径> 位置。

```bash
COPY package.json /usr/src/app # 从构建上下文目录中的package.json复制到/usr/src/app中
```

- ADD 高级的文件复制

和COPY差不多的一致，在COPY的基础上增加了自动解压缩等的功能。

- CMD 容器启动命令，用于指定默认的容器主进程的启动命令的。

一般推荐使用exec格式，注意要使用双引号。

- ENTRYPOINT 目的和CMD一样，都是在指定容器启动程序及参数。

- ENV 用于设置环境变量。无论后面的其他指令还是运行时的应用，都可以直接使用这里定义的环境变量。

```bash
ENV VERSION=1.0
RUN curl "https://$VERSION"
```

- ARG 构建参数 = 默认值

构建参数和ENV的效果是一样的，都是设置环境变量。不过ARG设置的构建环境变量在将来容器运行时是不会存在的。ARG指令有生效范围，在FORM指令前指定，只能用于FORM指令中。

- VOLUME 匿名卷

```bash
VOLUME /data
```

在容器运行时自动挂载匿名卷，任何向/data中写入的信息都不会记录进容器的存储层，保证容器存储层无状态化。

覆盖挂载：可以在运行容器时覆盖该挂载设置：

```bash
docker run -d -v mydata:/data xxxx
```

在这行命令中，就使用了 mydata 这个命名卷挂载到了 /data 这个位置，替代了 Dockerfile 中定义的匿名卷的挂载配置。

- EXPOSE 暴露端口

只作端口声明。作用：

1. 帮助镜像使用者理解镜像所需要的配置端口。
2. 运行时会自动随机映射EXPOSE端口。

```bash
docker run -P
```

- WORKDIR 指定工作目录

在两条RUN指令中，都是完全不同的容器，如果第二条RUN指令用到第一条指令的内容，可能会出现错误。

例如目录：

```bash
Dockerfile
app
  - package.json
```
在Dockerfile中

```bash
RUN cd app
RUN yarn install
```

以上指令会出现错误，因为第一条RUN和第二条RUN完全没有关联。如果需要关联，可能需要用到WORKDIR指令。

```bash
WORKDIR /app
RUN yarn install
```