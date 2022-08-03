---
layout: post
title: Webpack 文档要点记录
date: 2022-08-03 23:32:51 +0800
categories: Webpack
---

# 记录一些可能容易写错的有关 Webpack 的知识点

来源主要为官方文档以及一些实践。内容会慢慢补充。 

## use loader 需要保证顺序

模块的 loader 可以链式调用。链中的每一个 loader 会将本 loader 处理结果递给下一个。需要注意链是逆顺序执行（从右到左，或说从下至上）。

```js
rules: [
  {
    test: /\.css$/i,
    use: ['style-loader', 'css-loader']
  }
]
```

上面表示所有匹配的 css 文件先给 css-loader 处理，再给 style-loader 处理。
