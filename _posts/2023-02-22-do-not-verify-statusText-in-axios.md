---
layout: post
title: 不能在 axios 拦截器中判断 statusText 的值
date: 2023-02-22 10:22:51 +0800
categories: 前端
---

# 问题来源

项目中出现各个环境构建出来的前端资源运行都很正常，但是个别服务器 serve 的 dist 资源出现奇怪的问题。我们在 axios 的拦截器中判断了接口返回的 status 和 statusText 值：

```js
if (res.status === 200 && res.statusText === 'OK') {
  // 视为接口服务器正确处理并返回结果
  const { status } = res.data
  if (status === 0) {
    console.log('接口返回错误信息')
  }
}
``` 

问题环境上出现接口异常但没有触发通知组件的问题，通知组件理应在接口的状态错误的时候触发，也就是上面“接口返回错误信息”没有触发。但在其他的服务线都是正常的。

## 问题原因

先说明问题原因，那就是 `Response.statusText` 并不总为 'OK' ，即使返回的状态码为 200 。所以解决办法是去掉上面 statusText 的判断就好了。

实际上，我们的问题主要是 http2 不支持 statusText 属性。

## 扩展

statusText 是一个只读属性。一般下，如果状态码是 200，则 statusText 为 OK，100 为 Continue，404 为 Not Found。默认值为 ''。
