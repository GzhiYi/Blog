---
layout: post
title:  Vue 从 2.6 升级到 2.7 的问题
date:   2022-07-29 14:00:00 +0800
categories: Vue
---

# 升级 Vue 到 2.7

Vue 2.7 的一些特性向 Vue 3 靠拢。主要是包含了 Composition API。尽管是小版本升级，也得十分注意升级带来的一些项目上的变化。一个非常容易出现错误就是认为像 2.6 升级到 2.7 这种觉得不大的版本并不会带来严重的问题。但要知道，升级迭代往往新版兼容旧版本，而旧版本是无法兼容新版本特性的。

## Vue 2.6 可以用 Vue 2.7 写的组件吗？

如果用新的 Composition API 写的组件，是不可以用的。所以有这些问题考虑的时候，就得花很多心思去调研升级 Vue 版本会不会影响到目前项目的情况。需要非常细致，如果没有分析清楚就动键盘，写出一大堆组件却没法被低版本的项目引用，这心态会崩溃。

## 用 Vue 2.7 Composition 写好了组件，怎么给低版本 Vue 2.6 用？

可以有三种方案。需要确定的是，补救措施的目的是为了减少组件返工，减少开发时间。那么可以：

1. 将引入 Vue 2.7 组件的项目升级到 Vue 2.7。尽管这个方法很可行，但维护久远的项目想要升级这种主要依赖的版本，是需要非常慎重！不推荐。
2. 将 Vue 2.7 组件项目更改为 Vue 2.6 + Composition API 依赖的方式。只需要引入依赖`@vue/composition-api`即可。推荐，几乎无伤。
3. 将引入 Vue 2.7 组件的项目引入支持 Composition API。这样需要在项目中添加一个而外的依赖以补全 Composition API 的使用。还行，比第一个方案好。 
 
   ```bash
   pnpm install @vue/composition-api
   ```
   
   然后在 `main.js` 中:

   ```js
   import VueCompositionAPI from '@vue/composition-api'
   Vue.use(VueCompositionAPI)
   ```
