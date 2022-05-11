---
layout: post
title:  "Docker安装easymock"
date:   2020-01-25 20:00:00 +0800
categories: 学习
---

为了方便本地mock接口，需要在本地用docker跑一个easy-mock服务。第一时间想到docker运行，方便管理和使用。基本上是非常简单就可以跑起来的。所以在这记录一下安装easy-mock的步骤，也为了下次更快的安装。

> 假设在目录"/Users/用户目录名/easymock"存放easy-mock配置。
> 当然需要先安装好docker啦，不再赘述。

## Docker compose文件

x在easymock目录下新建一个docker-compose.yml文件，内容如下：

```yml
version: '3'

services:
  mongodb:
    image: mongo:3.4.1
    volumes:
      # ./data/db 数据库文件存放地址，根据需要修改为本地地址
      - './data/db:/Users/用户目录名/easymock/data/db'
    networks:
      - easy-mock
    restart: always

  redis:
    image: redis:4.0.6
    command: redis-server --appendonly yes
    volumes:
      # ./data/redis redis 数据文件存放地址，根据需要修改为本地地址
      - './data/redis:/Users/用户目录名/easymock/data'
    networks:
      - easy-mock
    restart: always

  web:
    image: easymock/easymock:1.6.0
    command: /bin/bash -c "npm start"
    ports:
      - 7300:7300
    volumes:
      # 日志地址，根据需要修改为本地地址
      - './logs:/Users/用户目录名/easymock/easy-mock/logs'
      # 配置地址，请使用本地配置地址替换
      - './production.json:/Users/用户目录名/easymock/easy-mock/config'
    networks:
      - easy-mock
    restart: always

networks:
  easy-mock:
```

## 运行

`docker-compose up -d`即可运行。

```bash
easymock_redis_1 is up-to-date
easymock_mongodb_1 is up-to-date
easymock_web_1 is up-to-date
```
后打开`localhost:7300`