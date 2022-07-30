---
layout: post
title: 给 Jekyll 博客添加一个和 Github 一样的日历图
date: 2022-07-30 20:16:00 +0800
categories: 博客
---

## 效果图

![博客日历图](https://s2.loli.net/2022/07/30/iUlRnX9ef8MxwB3.jpg)

在线可以看：[关于](/about)

和 GitHub 的做法类似，日历图可以汇集你每天的博客编写量，颜色越深则文章越多，很直截了当的表明活跃程度。GitHub 上也有不少的日历图实现，但大多都是以组件的形式调用。想了一下，其实实现思路很简单，相关的内容也比较好实现，所以就手动用原生 Javascript 将这个日历图渲染出来。

## 实现思路和过程

Jekyll 是需要将项目打包成静态 HTML 后才能部署到服务端。这也就说明，图表的渲染需要在服务端进行处理。这部分处理可以交给 Node 。Node 可以很方便快捷的做一些文件的操作和图表的内容生成。实现的大致思路为：

1. 读取 `_posts` 目录，确定将当前目录下的 `markdown` 文件并生成一个包含文章日期和数量关系的结构。结构为：

    ```js
    const data = {
      '2022-07-30': ['post title one', 'post title two']
    }
    ```

2. 选用了 svg 进行方块渲染，可以很方便的手动调试各个方块间的间距问题。图表的结构有三块，一块是图表主要内容，也就是格子区域；一块是月份内容，显示最近一年的每个月起始点；第三块是标识每周的周一、周三和周五。根据第一步获取的文章数据进行遍历渲染。svg 结构为：

    ```html
    <svg width="720" height="121" class="graph">
      <g transform="translate(15, 20)">
        <g transform="translate(0, 0)">
        <rect class="rect-item" width="10" height="10" x="14" y="0" data-level="0" data-count="0" data-date="2021-07-25"></rect>
        <!-- 省略，这里包含总共 7 个格子，一个 rect 表示一天 -->
      </g>
        <text x="53" y="-7" data-windex="1" data-date="2021-08-01" class="month-label">08月</text>
        <!-- 省略，这里包含总共 12 个格子，一个 text 显示一个月 -->

        <text class="week-label" dx="10" dy="21.5">周一</text>
        <text class="week-label" dx="10" dy="47.5">周三</text>
        <text class="week-label" dx="10" dy="74.5">周五</text>
      </g>
    </svg>
    <div
      class="svg-tip"
      style="pointer-events: none;"
    >
    </div>
    ```

    其中最下面的 `svg-tip` 用来在鼠标移动到某一天时显示该天的文章数量等信息。剩下的部分包含了一系列的格子间距调整，这里必要说明一点，就是月份文本渲染的时候，因为数字 `0` 和 `1` 的宽度不一致，所以需要稍微的判断数字然后去缩减左间距以更准确的展示。

    ```js
    const fitOneNum = date.slice(5, 7)[0] !== '0' ? 3 : 0
    monthLabel += `
      <text
      x="${40 + 14 * weekIndex - weekIndex - fitOneNum}"
      y="-7"
      data-windex="${weekIndex}"
      data-date="${date}"
      class="month-label"
      >${label}</text>
    `
    ```

    你可以随意调整文章数量对应的颜色深度值，我因为更新的的不多，所以设置每天如果有写超过 4 篇文章就是颜色最深。

    ```js
    function dataLevel(length) {
      return length >= 4 ? 4 : length
    }
    ```

    ```scss
    .rect-item {
      fill: #ebedf0;
      shape-rendering: geometricPrecision;
      outline: 1px solid #1b1f230f;
      outline-offset: -1px;
      pointer-events: all;

      &[data-level="4"] {
        fill: #216e39;
      }
      &[data-level="3"] {
        fill: #30a14e;
      }
      &[data-level="2"] {
        fill: #40c463;
      }
      &[data-level="1"] {
        fill: #9be9a8;
      }
      &[data-level="0"] {
        fill: #ebedf0;
      }
    }
    ```

3. 覆盖原来所需要显示日历图的网页。如果你需要在 `about.html` 的某处渲染这个图表，那需要在这个页面添加一个替换的标志。例如我的操作就是替换标志 `<!-- heatmap -->` 为日历图 `svg` 标签。

    ```html
    <div class="heatmap">
      <!-- heatmap -->
    </div>
    ```

4. 部署。相关操作不应该在本地开发环境进行渲染生成，因为这样会替换掉 `about.html` 内的标志而不好再次生成。这步操作最好在 `CI/CD` 中静默执行，这样在不动任何日历图逻辑的情况下，文章一写好，一提交部署就自动生成。注意生成的逻辑操作需要在博客构建生成静态内容之前进行。

## 适用范围

由于使用原生的 `JavaScript` 编写，所以适用于所有的 Web 框架，且具有不错的性能表现。实现思路是通用的，只需要根据项目情况进行添加，并对一些排版的样式进行调整即可。

## 相关代码

本博客已增加了这个日历图，详细的代码可以查看这个博客的源代码：[GzhiYi/blog/heatmap/index.js](https://github.com/GzhiYi/blog/blob/master/heatmap/index.js)。

里面包含了日历生成渲染等全部操作，另外还增加了 `rect` 的 `mouseover` 事件用来显示 `tip` 弹窗以及增加了点击格子后跳转到文章列表并筛选所点击日期的日历的操作。
