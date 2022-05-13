---
layout: post
title:  "使用 CSS 自定义属性解决行内 hover 等伪类样式问题"
date:   2022-05-13 17:09:00 +0800
categories: CSS
---

在个别情况需要用到 CSS 自定属性解决一些自定义样式问题。例如有个组件定义一个 props 为 `hoverColor`，意思是可以根据传入的颜色决定组件内某处元素 hover 的背景色。css 本身不支持行内的 hover 属性定义，所以不能直接在 style 内通过变量去设置 hover 样式。

## CSS 自定义属性

包含的值在整个文档中生效并可重复使用，属性名需要`--`打头。通过 style 去设置值：

```html
<div style="--hover-color: red;"></div>
```

通过 var 去取值：

```scss
.item:hover {
    background-color: var(--hover-color);
}
```

在 chrome 和 safari 上都具有不错的兼容性，chrome 上最佳。

## 和 sass 配合处理数组配置的样式问题

假设有这样一个配置数组：

```js
export const boxData = [
  {
    title: 'boxa',
    hoverColor: '#f5a432'
  },
  {
    title: 'boxb',
    hoverColor: '#f32422'
  },
  {
    title: 'boxc',
    hoverColor: '#f54432'
  }
]
```

组件渲染这个数组，生成 3 个 div 盒子：


```vue
<div v-for="item in boxData"></div>

```

boxData 为上方定义的数据。

根据上面的做法，配合 sass 可以实现定义多个 css 自定义属性。

```vue
<div
  v-for="(item, index) in boxData"
  :style="`--hover-color-${index}: ${item.hoverColor}`"
  :class="`hover-item-${index}`"
></div>
```

```sass
@for $i from 0 to 3 {
  .hover-item-#{$i}:hover {
    background-color: var(--hover-color-#{$i});
  }
}
```

如果有更好的做法，欢迎评论中留言～
