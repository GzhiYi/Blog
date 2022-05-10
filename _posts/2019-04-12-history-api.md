---
layout: post
title:  "修改浏览器回退历史"
date:   2019-04-12 20:00:00 +0800
categories: 前端
---

![无标题绘图](https://user-images.githubusercontent.com/21136420/56006752-c05db900-5d08-11e9-94c3-61938d3f2eeb.png)

有个需求，需要修改短链跳转到落地页后，在落地页返回的历史记录。避免出现跳转到落地页后返回还是出现短链中转的问题。

要求：
1. 无法控制落地页的所有代码。
2. 回退页面可在短链内进行定义。 

### History Api

history api提供浏览器修改历史记录功能。简单罗列下api的一些使用。

```javascript
// 返回上一个历史记录
window.history.back()
window.history.go(-1)

// 前进一个历史记录
window.history.forward()
window.history.go(1)

// 添加或者替换历史记录条目，注意这【并不会刷新页面】。
history.pushState(state, title, url);
// state：网址相关的状态Object，在popstate事件触发时，会在回调函数中接收到这个对象。不需要的话可以设为null。
// title：新页面的title属性，填null。
// url：新的页面地址，必须必须和上一个页面处于同域，否则抛出异常。

// 替换当前的历史记录，注意这【并不会刷新页面】。
history.replaceState(state, title, url);
// 参数同上。
```

### 实现的思考

1. 第一次尝试。既然要实现在落地页返回的历史，可不可以在短链中转页上监听一下上一页面的url，当然在跳转到落地页之前可以在落地页的url上带上参数，可以在短链中转页上通过是否带这个参数进行判断。放弃，理由是麻烦而且不稳定，可能出现难以预料的问题。

2. 第二次尝试。使用历史记录api修改历史记录。要修改的页面是短链中转页的历史记录，需要替换【当前】短链中转页的历史，使得跳转到落地页到上一个历史是短链所配置到页面。

需要注意到是，历史记录不能replace或者push不同域的url。所以需要通过一个queryString进行判断。所以做法是：
```javascript
window.onload = function() {
      if (getParam('backUrl', location.href)) {
        console.log('进入跳转到预定回退页')
        location.replace(getParam('backUrl', location.href))
      } else {
        console.log('进入跳转到落地页并改写历史')
        history.replaceState(null, null,  "[域名、处理返回逻辑页面]?backUrl=https://www.baidu.com")
        document.getElementById('jump-id').click() // 跳转到落地页
      }
    }
// getParam是获取链接qs参数的函数。
```