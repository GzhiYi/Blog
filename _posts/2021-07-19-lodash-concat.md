---
layout: post
title:  "lodash数组中concat方法"
date:   2021-07-19 20:00:00 +0800
categories: lodash
---

## Concat

创建一个用任何数组或值拼接的新数组。

### 使用

```javascript
var array = [1]
var other = _.concat(array, 2, [3], [[4]])
 
console.log(other)
// => [1, 2, 3, [4]]
 
console.log(array)
// => [1]
```

返回的是一个全新的数组；调用并不会改变原本的数组。传入的拼接参数可以为数字、一维数组，甚至是二维数组，这有点意思了来看看源代码的实现。

### 源码

```javascript
/**
* @static
* @memberOf _
* @since 4.0.0
* @category Array
* @param {Array} array The array to concatenate.
* @param {...*} [values] The values to concatenate.
* @returns {Array} Returns the new concatenated array.
* @example
*
*/
function concat() {
  // 在定义concat时就不需要指定传入的参数有什么，直接读argruments。
  var length = arguments.length; // 传入参数的长度，用于创建包含length - 1长度的args数组
  if (!length) {
    return [];
  }
  var args = Array(length - 1),
      array = arguments[0], // 这里默认了第一个参数就是要拼接的“原数组”
      index = length;
  // 这里使用while(index--)就是直接遍历index + 1次，index从index - 1开始，最后index = 0作为遍历的结束
  // 如果while(--index)则只会遍历index次，index为0不会被执行
  while (index--) {
    args[index - 1] = arguments[index];
  }
  return arrayPush(isArray(array) ? copyArray(array) : [array], baseFlatten(args, 1));
}
```
由于lodash代码中会存在多处调用（套娃），所以copyArray和baseFlatten在这一页中只作一些使用上的解释，之后也会对代码进行解释理解。

其余函数作用：
1. copyArray(source, array)

将source的值复制为array。结果是source和array在数值上是一样的，只是遍历了source，逐个下标赋值到array中。

2. baseFlatten(array, depth, predicate, isStrict, result)

将数组array铺平。depth为铺平的深度。该函数有递归，后续再详细了解。

其中一个可以学习到的用法：

```javascript
let index = -1
let end = 6
while(++index < end){}

// 这样的遍历等价于

for(let i = 0; i < end; i++) {}
```

3. arrayPush(array, values)

将两个数组合并。
!!这个方法会修改原传入array的数组！！这和数组展开方式进行合并是有一些区别的。

```javascript
let arr = [1, 2, 3]
let arr2 = ['a', 'b', 'c']
[...arr, ...arr2] // 这个结果并不会改变arr和arr2
```

### 总结

这个函数可以对数组进行拼接，即便后续的参数包含有数字，字符串或者数组，和一般的数组拼接有一些额外的不同，但开发中感觉用的比较少。
