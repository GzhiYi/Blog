---
date: 2018-05-16
layout: post
title:  "防盗链的解析"
date:   2018-10-15 20:00:00 +0800
categories: 小程序
---

### 前言

最近涉及到了图片防盗链的问题，链接是特殊的，不能被其他网站解析为图片。说下来有几种办法，当然解决后发现还是最后那种简单便捷。唯一的缺点就是大概也许差不多可能无法访问到。这个没关系，只要保佑保佑，总会比加iframe轻松愉悦的。  

首先，你看到的图片会是这样的：

![例图](https://mmbiz.qpic.cn/mmbiz_jpg/cfehZicXpD0ib9BP0iafksSmxPcWm4ORDGkD5ibHIHeWSyWjHriaFGhHLFvZNwiau4icCOBvT56MktVFATAf1D8vuyOHw/0?wx_fmt=jpeg)  

实际上，如果你能看到上面这张图，说明你骨骼精奇，自带解锁功能。
但是我们想直接看到：  

![例图](https://images.weserv.nl/?url=//mmbiz.qpic.cn/mmbiz_jpg/cfehZicXpD0ib9BP0iafksSmxPcWm4ORDGkD5ibHIHeWSyWjHriaFGhHLFvZNwiau4icCOBvT56MktVFATAf1D8vuyOHw/0?wx_fmt=jpeg)  

那怎么做呢？

### 页面头部加入<mate>标签

```html
<meta name="referrer" content="never">
```

这种办法通过控制referer绕过防盗链的检测。html可以通过这个参数决定http请求中的referer，要注意使用这个标签属性的时候，浏览器原有的referer策略就发生改变了。

### 图片在iframe内显示

```javascript
let url='防盗的链接';
let finalUrl = displayImg(url);
console.log(finalUrl);
document.getElementById('img').innerHTML = finalUrl;

displayImg = (url) => {
    let iFrameid = 'frameimg' + Math.random();
    window.img = '<img id="img" src=\'' + url + '?' + Math.random() + '\' />';
    return '<iframe id="' + iFrameid + '" src="javascript:parent.img;" frameBorder="0" scrolling="no" width="100%"></iframe>';
}
```

这样可以正常显示图片，除了多了iframe外也没啥太大的问题，但是我发现在Vue里面一旦数据更新iframe就会刷新，外加上插件vue-draggable没法用了所以我就放弃这个方法了。这也促使我找更好的方案👇。

### 传送门 | 跳板

所以最后我还是找到了一个好的方法，搜索引擎下，发现大部分的跳板都被清理了。不要慌，总会有的，对于怎么找到这个跳板的话，我的建议是怎么不去对比一下开头的两张图？😄😄😄