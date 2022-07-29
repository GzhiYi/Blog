---
layout: post
title:  "博客又双改了，现在使用 jekyll 进行部署"
date:   2022-05-13 10:44:52 +0800
categories: Blog
---

# 抛弃原有博客仓库，使用 jekyll 

原本使用的是基于 svelte 的 sapper “框架”写的博客。其实只看内容渲染的话还是可以的，seo 很好，页面打开速度也很不错。在看到一个新的评论模块后，想加入到页面上，无奈在引入 svelte 评论组件 giscus 的时候一直处于报错无法引入的状态，因此就想换了。

sapper 写博客缺点是编译 markdown 内容会比较慢。个别操作还是不够细腻，因为一开始的目标仅仅是满足写博客的需求。

## jekyll

> 注意下面代码都需要将 \% 更改为 % 才能正常工作

jekyll 编译起来速度非常快。

我在 M1 Pro 的 MacBook Pro 上编译本站所有博客时间快的惊人！

```bash
Generating feed for posts
...done in 0.145698 seconds
```

代码目录非常简洁，个人修改页面内容也是非常简单方便。加上原本就用着的构建流程，整体替换下来基本上无痛。

在对默认的 minima 主题修改个别样式和结构之后，也大致完成了整个博客的内容编写和部署流程了。主要增加了 giscus 评论、按分类和按时间排序文章、google analysis 统计、medium-zoom 图片预览效果。针对个人页面描述内容和一些样式的大修改，需要在后面构思好再处理。目标页面样式为简洁明了，至少需要看起来舒服。额外的不需要的功能不会再加入。

## 接入的一些功能

这里记一下接入一些功能时的要点，减少后续接入的问题。

### giscus 评论

这个评论插件和之前使用过的 gittalk 类似，但 giscus 利用了 github 比较新的 discussions 功能，而 gittalk 插件则是用到了仓库的 issues 模块。

在 `_layout/post.html` 博客 content 下添加上从 giscus 生成的 script 代码片段即可。片段生成引导非常详细，基本上不会有出错，所以不赘述。

### 按分类和按时间排序文章

1. 按时间分组展示  
  默认的排序为按时间倒序，博客的根目录 / 所呈现的就是按日期倒序展示的。这里在日期倒序的前提下增加按月份分组。  
  将 `_layout/home.html` 相关遍历 `site.posts` 改为：  
    ```
    {\% raw %}
    ~~~html
    {\% assign postsByDay = site.posts | group_by_exp:"post", "post.date | date: '%Y 年 %m 月 %d 日'" %}
    {\% for day in postsByDay %}
      <h3>{{ day.name }}（{{ day.items | size }}）</h3>
      <ul>
        {% for post in day.items %}
        <li><a href="{{ post.url }}">{{ post.title }}</a></li>
        {% endfor %}
      </ul>
      
    {\% endfor %}
    ~~~
    {\% endraw %}
    ```


2. 按分类展示：  
  在 `_layout` 目录新建一个 `categories.html` 文件，内容和 `home.html` 基本一直，在博客渲染遍历代码上有所不同。
  ```
  {\% raw %}
  ~~~html
  {\% for cate in site.categories %}
      <h3>{{ cate[0] }} ({{cate[1] | size}})</h3>
      <ul>
        {% for post in cate[1] %}
        <li><a href="{{ post.url }}">{{ post.title }}</a></li>
        {% endfor %}
      </ul>
  {\% endfor %}
  ~~~
  {\% endraw  %}
  ```

### medium-zoom 插件

提供和 medium 图片一样显示效果的插件。

在 `_includes/head.html` 文件中添加 `medium.zoom.min.js` 脚本引入。脚本应该存放在 `assets` 目录下。

在引入后需要初始化。初始化代码放在引入脚本下方。

```html
<script>
    window.onload = function() {
      mediumZoom && mediumZoom(document.querySelectorAll('img'))
    }
</script>
```

# 更多

如果还有疑惑，可以在下面的评论进行留言。评论需要 github 账号登录。或者，你也可以到这个博客的源码上查看一些细节，比如 actions 处理等等。

[GzhiYi/blog](https://github.com/GzhiYi/blog)
