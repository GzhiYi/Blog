---
layout: post
title:  "vue获取不到dom节点"
date:   2021-06-29 20:00:00 +0800
categories: Vue
---

在vue开发中，出现拿不到dom节点的问题，具体的场景是页面需要对echarts进行实例化，画布需要挂在到某个id的dom上，图表的数据需要从接口上获取，大致的代码如下：

```vue
<template lang="pug">
  div#render-id
<template>
<script>
  export default {
    mounted() {
      this.getChartData()
    },
    methods: {
      async getChartData() {
        // do fetch chart data
        this.renderChart()
      },
      renderChart() {
        const node = document.querySelector('#render-id')
        console.log(node) 
      }
    }
  }
</script>
```

出现的异常：

```
 Cannot read property 'getAttribute' of undefined"
```

打印node节点发现为null。

### 问题解决

解决这个问题需要知道的是，获取不到节点的直接原因就是在query节点的时候render-id还没挂载到dom上。但会问，不是在mounted后才读这个节点吗？按照上面的代码逻辑，想法是正确的，即便是接口数据大，获取数据的时间长，也会在render-id这个元素挂载到dom后才会执行query操作。理论是不会出现读取不到该节点的问题。

处理思路应该聚集在渲染dom有什么另外的操作会影响。总结无外乎就是：

1. 优先确认query节点的操作要在dom渲染完成后操作（这是核心思路）。
2. 检查有无异步的操作产生影响。比如元素需要在接口获取到之后写入到document，但写入前读取是会出现这样的问题的。
3. 检查获取的元素或者元素的外层是否有loading的操作。
4. $nextTick(f)有时候会解决此类问题。