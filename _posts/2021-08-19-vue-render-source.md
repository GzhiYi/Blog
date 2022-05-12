---
layout: post
title:  "理解一下vue的render方法"
date:   2021-08-19 14:37:13 +0800
categories: vue
---

![属性未定义的错误提示](https://i.loli.net/2021/08/19/w6YcFmd1eJOA5oC.png) 

上面提示会出现在我们没有在vue中定义该data却在模板中提到的时候。恰好是在render执行过程中出现的，所以可以借此理解一下vue的render函数。

### render

render函数是vue实例中的一个私有方法，作用是通过`createElement`创建并返回虚拟dom(vnode)。翻看源码，该方法定义在[src/core/instance/render.js](https://github.com/vuejs/vue/blob/dev/src/core/instance/render.js)中。

位于`initRender`函数。在这函数里面找到_render的定义：

```js
Vue.prototype._render = function (){
  // ...
  // 从options中拿到render函数
  const { render } = vm.$options

  // 通过call函数传入当前上下文
  vnode = render.call(vm._renderProxy, vm.$createElement)
  // ...
}
```

### createElement

vm中的createElement在该函数上方有定义。


```js
vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false)
vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)
```

可以知道，第一个私有函数_c挂在vm上是提供给编译器编译模版生成render函数。

第二个直接定义在实例上，提供用于手写render方法。

我们在vue中render函数是这么写的：

```js
new Vue({
  render(createElement) {
    // do sth
    return createElement(
      // vnode stuff
    )
  }
})
```

这里的createElement就是在上方代码中定义的。  

**vnode的生成会替换render目标元素dom，所以不能把vue实例render到有内容的dom上。**

### renderProxy

render.call函数的第一个参数是`vm._renderProxy`，在`init.js`中，有这两行代码在初始化周期等前执行：

```js
if (process.env.NODE_ENV !== 'production') {
  initProxy(vm)
} else {
  vm._renderProxy = vm
}
```

表示如果当前是开发环境，就执行initProxy，来看看initProxy的代码。initProxy位于`src/core/instance/proxy.js`中。

```js
initProxy = function initProxy (vm) {
  // hasProxy是用于判断当前环境是否支持proxy/
  // 支持的浏览器将直接调用new Proxy进行数据劫持
  if (hasProxy) {
    // determine which proxy handler to use
    const options = vm.$options
    const handlers = options.render && options.render._withStripped
      ? getHandler
      : hasHandler
    vm._renderProxy = new Proxy(vm, handlers)
  } else {
    vm._renderProxy = vm
  }
}
```

如果在支持的浏览器中，`new Proxy`的第二个参数会传入`hasHandler`，查看hasHandler定义:

```js
const hasHandler = {
  has (target, key) {
    const has = key in target
    const isAllowed = allowedGlobals(key) ||
      (typeof key === 'string' && key.charAt(0) === '_' && !(key in target.$data))
    if (!has && !isAllowed) {
      if (key in target.$data) warnReservedPrefix(target, key)
      else warnNonPresent(target, key)
    }
    return has || !isAllowed
  }
}
```

[Proxy](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)，在这里就是对vm的data进行数据劫持，也就是代理。

handler又一个has方法，这是针对 in 操作符的代理方法，has内部主要检查target中是否有key属性，如果有就继续执行，如果没有，就回到文章开头的那个错误提示啦。

### 总结

在`init.js`中定义了`initRender`以及`_renderProxy`方法。在`render.js`找到render函数定义，主要描述了对用户手写的render函数进行处理生成vnode，中间将vnode设置到vm实例中(vm.$vnode)，最后返回并执行后续的操作。

**Vue版本：[2.6.14](https://github.com/vuejs/vue/archive/refs/tags/v2.6.14.zip)**