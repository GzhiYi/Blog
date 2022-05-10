---
layout: post
title:  "JS引入资源的一点总结"
date:   2019-09-28 20:00:00 +0800
categories: 学习
---

## JS引入的时候放在哪比较好呢？

很常见的情况是把script放在body右闭合标签的上方，都是这样加载不阻塞页面解析和渲染，达到最优的效果。见得多，用的也多，我比较想理解下其中原因。

## 浏览器渲染

在知道放在哪最好之前，需要知道下浏览器渲染的过程。有以下的步骤：

- 处理文档中的标签并构建DOM（Document Object Model）树。
- 处理文档中的css并构建CSSOM（CSS Object Model）树。
- 合并DOM和CSSOM为一个渲染树。
- 处理渲染树没一个节点的布局。
- 最后将没一个节点渲染（绘制）到浏览器上。

### 阻塞渲染：CSS和JavaScript

浏览器资源阻塞是一个常见的问题。要知道，资源在大多数浏览器上都是并行加载的，这种情况下，当Html文档被javascript阻塞时，Html文档会终止构建，但仍会`识别阻塞脚本后面的资源，进行预加载`。有以下要点需要注意：

- css加载不会阻塞dom树解析，但会阻塞dom树渲染。
- 浏览器dom构建会在遇到script标签的时候暂停，直到script内的脚本执行完毕。
- CSSOM在构建的时候，JavaScript的执行会暂停，直到CSSOM准备就绪。

以上正好说明了，我该把js脚本放在哪😄。我们就得出这样的原则以加快文档构建渲染：

1. CSS优先渲染。将css放在JavaScript资源之上，也就是普遍的放在 < head > 标签内。
2. 为减少script脚本对dom构建的影响，应该把script尽可能的放到最后（文档底部）。

## defer和async

script标签的这两个属性，均是为解决上面问题的。defer和async的使用有所不同。
`defer`：DOM元素的加载和脚本的 ** 加载 ** 异步执行。但是脚本的执行需要在所有dom元素解析完成之后，在`DOMContentLoaded`事件触发之前执行。
`async`：DOM元素的加载和脚本的加载 ** 以及执行 ** 异步执行。

![284aec5bb7f16b3ef4e7482110c5ddbb_articlex](https://user-images.githubusercontent.com/21136420/65817605-0ae1dc00-e23c-11e9-890b-e70207d371b6.jpeg)

  - 无async和defer的时候，dom渲染被脚本~~加载以及执行~~所中断。
  - defer的时候，dom渲染未被阻塞，但脚本执行将会到最后。这个特性可以对需求有所利用。
  - async的时候，dom渲染和脚本加载和执行异步。

## 有时候要用到动态引入？

  统计脚本，广告脚本这类第三方嵌入脚本会在文档底部引入脚本文件。但都是以js生成script标签的形式进行动态引入。
  先来看下百度统计脚本是怎么引入的：
  ```javascript
(function() {
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?10dbf7bc9ad86276329db7b";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
  })();
```
这就是动态创建script标签进行引入的方式。那么为什么要这样引入而不是直接:
  ```html
<script src="source_url" async></script>
```
  ** 其实，这既不是自执行函数的问题，也不是阻塞渲染的问题。是为了防止用户把脚本放置在文档不规范的地方导致文档被阻塞，并不是所有的脚本嵌入用户都知道这个脚本应该嵌入在哪的。而这样动态引入就可以避免这样的问题。**
