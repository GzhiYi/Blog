---
layout: post
title:  "lodash数组中chunk、compact方法"
date:   2021-07-15 20:00:00 +0800
categories: Lodash
---
## Chunk

lodash的chunk方法用于对数组进行按size切割。如果最后数组不满足size的长度，则剩余的部分会放到最后一个数组上。

### 使用

```javascript
const arr = [1, 2, 3, 4, 5]
_.chunk(arr, 2) // [[1, 2], [3, 4], [5]] 
```

结果返回的是一个二维数组。开发了这么久，想了下这个函数所实现的功能需求貌似少之又少。

### 源码

```javascript
function chunk(array, size = 1) { // 存在参数默认
  size = Math.max(toInteger(size), 0)     // 【验证输入参数的合法性】toInteger会把传入的size转为整数
  const length = array == null ? 0 : array.length   //  【验证输入参数的合法性】计算传入数组的长度
  if (!length || size < 1) {
    return []
  }
  let index = 0
  let resIndex = 0
  const result = new Array(Math.ceil(length / size)) //   这里新建一个包含切割结果个数的空数组，如[, , , ]

  while (index < length) {
    result[resIndex++] = slice(array, index, (index += size)) //    slice是封装的函数，可以切割回数组的第二个参数到第三个参数的值
  }
  return result
}
```

## compact

compact在字面上的意思是紧凑的，在lodash中，就是把一个数组中值为 `false`, `null`, `0`, `""`, `undefined`, `NaN`的都剔除。

### 使用

```javascript
_.compact([0, 1, false, 2, '', 3]) // => [1, 2, 3]
```

业务中使用的也比较少。

### 源码

```javascript
function compact(array) {
  let resIndex = 0 //   貌似都喜欢把下标定位resIndex这个变量名。。
  const result = []

  if (array == null) {
    return result
  }

  for (const value of array) { //   这里用for of对数组进行遍历
    if (value) { //   核心的过滤就是这里，在if下，falsy的参数会被过滤掉。
      result[resIndex++] = value
    }
  }
  return result
}
```

> Lodash 源码理解 1
