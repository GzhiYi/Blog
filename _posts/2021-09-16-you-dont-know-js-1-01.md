---
layout: post
title:  "观后笔记-你不知道的JavaScript-上-01"
date:   2021-09-16 21:10:58 +0800
categories: 前端
---

记录一些读书的小点，这些是在自己翻阅书本后觉得可能对自己有帮助的情况下所写下来的内容，并不适用于任何人理解和肯定。

### 自执行函数IIFE

```js
(function funName() {})()
```

具备将变量包裹起来的能力。另外可以当作函数调用并传递参数进去。

```js
const name = 'GzhiYi'
(function IIFE(global) {
  const name = 'Not Me'
  console.log(name) // Not me
  console.log(global.name) // GzhiYi
})
console.log(name) // GzhiYi
```

### with和try/catch都可以创建一个块作用域

用with关键词从对象中跟创建出的作用域仅在with声明中而非外部作用域中有效。

try/catch中的`catch`分句会创建一个块作用域，其中所声明的变量仅在catch内部有效。

```js
try {
  // trigger error!
} catch(error) {
  console.log(error) // error info
}
console.log(error) // ReferenceError: err not found
```

### 没定义的变量RHS查询一定错误吗？

例子：

```js
// 1
a = 2;
var a;
console.log(a) // 2

// 2
console.log(b)
var b = 2
// 你可能认为会输出2或者ReferenceError，实际上输出undefined
```

**包括变量和函数在内的所有生命都会在任何代码被执行前被处理。**

需要理解的是，`var b = 2`实际上是两个声明：

```js
var b;
b = 2;
```

所以，上面的两个代码片段会有以下处理：

```js
// 1
var a; // 声明
a = 2; // 代码执行
console.log(a) // 代码执行

// 2
var b; // 声明
console.log(b) // 代码执行
b = 2 // 代码执行
```

解释的前提是必须要知道，声明都是需要在代码被执行前先被处理，这个过程就是`变量提升`。

每一个作用域都被进行提升操作。

```js
console.log(foo) // 报错误！！
foo()
var foo = function bar() {}
```
以上片段报错不是ReferenceError，而是TypeError：

1. `Uncaught TypeError: foo is not a function`
类型错误，执行了不属于该类型的操作。

2. 如果log的是bar，则`Uncaught ReferenceError: bar is not defined`
引用错误，在当前作用域中找不到该变量。

相当于被处理为：

```js
var foo;
foo()
foo = funciton (){
  var bar = **self**
}
```
