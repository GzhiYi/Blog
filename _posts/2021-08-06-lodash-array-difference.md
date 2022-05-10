---
layout: post
title:  "lodash数组中difference方法"
date:   2021-08-06 18:21:57 +0800
categories: lodash
---

## Difference

创建一个具有唯一array值的数组，每个值不包含在其他给定的数组中。（注：即创建一个新数组，这个数组中的值，为第一个数字（array 参数）排除了给定数组中的值。）该方法使用SameValueZero做相等比较。结果值的顺序是由第一个数组中的顺序确定。

```javascript
_.difference([3, 2, 1], [4, 2])
// [3, 1]
```
### 理解

对这个用法，可以理解为抽出属于第一个参数而不属于第二个参数的值（找出右边数组中没有在左边数组内的）。

其中有一个SamealueZero的匹配规则，大致的规则如下：
例如比较x、y
1. 如果x与y不同，返回false
2. 如果x为数值，则
  - 如果x是NaN，y也是NaN，返回true
  - 如果x是-0，y是+0，返回true


### 源码

```javascript
function difference(array, ...values) {
  return isArrayLikeObject(array)
  // baseFlatten用于拍平数组
    ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true))
    : []
}
```

这函数调用的起飞阿，我分析lodash函数的代码，还得刨到底。

#### isArrayLikeObject

```javascript
// 这个函数和isArrayLike差不多，但它会另外的检查传入的value是否为object
// 总之可以模糊的说用于判断是否是可迭代的类型
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value)
}


// 1 
// 用以判断传入的值是否为对象类型，因为typeof null === 'object'，所以要增加一个判断
function isObjectLike(value) {
  return typeof value === 'object' && value !== null
}

// 2
// 由isLength判断value长度的方式来判断传入的value是否为ArrayLike
function isArrayLike(value) {
  return value != null && typeof value !== 'function' && isLength(value.length)
}

// 3
// 判断传入的长度值是否有效！
// 有效的条件：大于-1 并且 任意整数 并且是安全整数（能够准确区分两个不相同的值）

function isLength(value) {
  return typeof value === 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER
}
```

#### baseDifference

```javascript
// iteratee在此（difference函数）调用默认为false
function baseDifference(array, values, iteratee, comparator) {
  // arrayIncludes(array, value)
  // 判断value是否在array中
  let includes = arrayIncludes
  let isCommon = true
  const result = []
  const valuesLength = values.length

  if (!array.length) {
    return result
  }
  // 这几处暂时不需要理解
  if (iteratee) {
    values = map(values, (value) => iteratee(value))
  }
  if (comparator) {
    includes = arrayIncludesWith
    isCommon = false
  }
  // lodash中该值定义为LARGE_ARRAY_SIZE = 200
  else if (values.length >= LARGE_ARRAY_SIZE) {
    // cacheHas这个函数用于判断某个key是否在cache中
    includes = cacheHas
    isCommon = false
    values = new SetCache(values)
  }

  // labeled statement
  // 严格模式下不能使用 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/label
  // 用于跳过某些遍历

  outer:
  for (let value of array) {
    const computed = iteratee == null ? value : iteratee(value)

    value = (comparator || value !== 0) ? value : 0
    if (isCommon && computed === computed) {
      let valuesIndex = valuesLength
      while (valuesIndex--) {
        if (values[valuesIndex] === computed) {
          continue outer
        }
      }
      result.push(value)
    }
    else if (!includes(values, computed, comparator)) {
      result.push(value)
    }
  }
  return result
}
```

### 扩展

#### differenceBy(array, [values], [iteratee=_.identity])

array和values都会经过iteratee这个迭代器执行后进行对比。

#### differenceWith(array, [values], [comparator])

comparator是比较器。

```js
var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
 
_.differenceWith(objects, [{ 'x': 1, 'y': 2 }], _.isEqual);
// => [{ 'x': 2, 'y': 1 }]
```

需要注意，difference是找不同，所以是找出与`isEqual`比较器比较结果相反的数组项。