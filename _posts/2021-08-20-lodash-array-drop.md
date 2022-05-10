---
layout: post
title:  "lodash数组中drop方法"
date:   2021-08-20 18:58:57 +0800
categories: 前端
---

## Drop

创建一个数组，取出数组前n个元素，n的默认值是1。

我个人理解为"踢掉"更好。

```javascript
_.drop([1, 2, 3]);
// => [2, 3]
```

### 源码

drop：

```js
function drop(array, n=1) {
  // 对数组长度进行判断
  const length = array == null ? 0 : array.length
  // 如果数组有长度的话，走核心的slice方法
  return length
    ? slice(array, n < 0 ? 0 : toInteger(n), length)
    : []
}
```

slice： 虽然slice是后续的内容，但可以提前了解到。

```js
function slice(array, start, end) {
  // 判断数组长度
  let length = array == null ? 0 : array.length
  if (!length) {
    return []
  }
  start = start == null ? 0 : start
  // 如果没有定义end参数，则默认为数组的长度
  end = end === undefined ? length : end

  if (start < 0) {
    // 还是对输入参数合法的校准，如果开始的数值为负数而且取正后大于
    // 数组长度，则设置start为0。

    // 如果不是上述的情况，则会把start设置为length + start
    // 假如数组 [1, 2, 3, 4, 5]，slice(arr, -3, 2)的start为2
    start = -start > length ? 0 : (length + start)
  }
  end = end > length ? length : end
  if (end < 0) {
    // 和start处理一致
    end += length
  }
  // 这里处理start和end大小关系
  // 存在位运算
  length = start > end ? 0 : ((end - start) >>> 0)
  // start = start >>> 0
  start >>>= 0

  let index = -1
  const result = new Array(length)
  while (++index < length) {
    result[index] = array[index + start]
  }
  return result
}
```

- 有符号移位>>: 该操作符会将第一个操作数向右移动指定的位数。向右被移出的位被丢弃，拷贝最左侧的位以填充左侧。

```
9 >> 2
11111111111111111111111111110111  // -9 -> 11111111111111111111111111111101   // -3
```


- 无符号移位>>>: 该操作符会将第一个操作数向右移动指定的位数。向右被移出的位被丢弃，左侧用0填充。因为符号位变成了 0，所以结果总是非负的。

```
9 >>> 2
00000000000000000000000000001001   // 9 ->  00000000000000000000000000000010 // 2
```

### 扩展

#### dropRight(array, [n=1])

从尾部倒过来切。

#### dropRightWhile(array, [predicate=_.identity])

创建一个切片数组，去除array中从 predicate 返回假值开始到尾部的部分。

xxxxx(xxxxxxxxxxxxx)
      ^            ^
      |            |
 predicate假       结尾

```js
var users = [
  { 'user': 'barney',  'active': true },
  { 'user': 'fred',    'active': false },
  { 'user': 'pebbles', 'active': false }
];
 
 // 切掉users中active为false的对象

_.dropRightWhile(users, function(o) { return !o.active; });
// => objects for ['barney']

_.dropRightWhile(users, { 'user': 'pebbles', 'active': false });
// => objects for ['barney', 'fred']
```

这貌似和filter的感觉一样，但drop返回的是一个新数组且predicate更具有灵活性。

#### dropWhile(array, [predicate=_.identity])

创建一个切片数组，去除array中从起点开始到 predicate 返回假值结束部分。

(xxxxxxxxxxx)xxxxxxx
           ^
           |
       predicate假


identity为返回入参自身。

```
dentity = function(value) { return value; }
```

predicate传入对象也会在内部变为函数处理，编译后的代码为：

```js
function dropWhile(array, predicate) {
  return (array && array.length)
    ? baseWhile(array, getIteratee(predicate, 3), true)
    : [];
}
```