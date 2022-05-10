---
layout: post
title:  "safari出现未设置title属性却显示ttile弹窗的问题"
date:   2020-07-06 20:00:00 +0800
categories: 前端
---

在safari浏览器下，出现dom未设置title属性，但hover过去会显示一个title的问题。如图：

![Xnip2020-07-06_14-08-29](https://user-images.githubusercontent.com/21136420/86565425-634bc400-bf9a-11ea-8daf-76cba18e2936.jpg)

一开始一直往title属性上找问题，但dom的属性结构光溜溜的，并没有任何title有关的属性。这个问题在chrome和firefox都没有，只有在safari上出现。

## 问题所在

经过一顿排查，发现是css设置为文本超出省略显示后才会有这个问题。

我们常用到文本超出省略的设置，如：

```css
.text-ellipsis {
	overflow: hidden;
  text-overflow: ellipsis;
  word-break: keep-all;
  white-space: nowrap;
}
```

## 解决办法

在`text-ellipsis`包裹的元素中添加一个空的block元素。如：

```
<div class="text-ellipsis ...">
	<span></span>
	this is a long text!!!!!!!!
<div>
<style>
.text-ellipsis {
	overflow: hidden;
	text-overflow: ellipsis;
	word-break;
	white-space: nowrap;
}
.text-ellipsis span {
	display: block;
}
</style>
```

