---
layout: post
title:  "vue是怎么在mounted、created等中访问到data数据的？"
date:   2021-08-16 14:46:24 +0800
categories: Vue
---
![defineProperty](https://i.loli.net/2021/08/16/9wQxRlcUEeNstY8.png)  

```javascript
{
  mounted() {
    console.log(this.name) // GzhiYi
  },
  data() {
    return {
      name: 'GzhiYi'
    }
  }
}
```

如上代码，我们可以在`mounted`的周期钩子中访问到在data中定义到name属性。为什么可以访问到呢，可以通过vue源码中找到原因。

这涉及到了vue在new实例后处理的事情。

### 涉及源码及相关文件

`src/core/instance/index.js`，这个文件中找到vue构造函数。其中`initMixin(Vue)`对Vue实例进行初始化操作。该方法在`src/core/instance/init.js`中进行定义。由于是查看data相关的数据处理动向，我们可以定位到`State`的初始化方法`initState(vm)`。

继续定位到state的初始化方法。

```javascript
// 这里表示opts中如果opts.data有值则初始化data值。
if (opts.data) {
  initData(vm)
} else {
  observe(vm._data = {}, true /* asRootData */)
}
```

在initData中，可以看到：

```js
// 这里连续赋值。如果data是一个函数，则走getData
data = vm._data = typeof data === 'function'
  ? getData(data, vm)
  : data || {}

// 在getData中，是这样对data进行处理的
data.call(vm, vm)
```

最后这里调用函数原型的[call](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call)方法，实际等同于`vm.data(vm)`。由于data是一个函数，那在本例中`getData`返回的就是：

```json
{
  name: "GzhiYi"
}
```

额外增加一个预告，我们在vue中，一般定义data都是`function`的形式，这是建议的，但其实也可以定义为`object`的方式，从源码中可以看到`getData`这个函数存在着`pushTarget`等函数的处理，这是后续我要去看源码理解的。暂时不牵挂。

### 在实例中对data进行代理(proxy)

符合本内容的主要数据操作其实在这里。

```js
proxy(vm, `_data`, key)
// 追到proxy函数中，核心的就是对象的defineProperty方法。
// defineProperty方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回这个对象。

export function proxy (target: Object, sourceKey: string, key: string) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  }
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}
// 就是要把vm实例化时通过遍历data的值并把data的key-value定义到vm中。
```

由于要把data的每一项定义到vm上，所以vue在初始化state的时候，需要检测vm对象中是否已经有了data中定义的key。如果定义重复，也就是大概使用vue的人都会遇到以下的提醒：

```js
warn(
  `Method "${key}" has already been defined as a data property.`,
  vm
)
```

所以，在vm中，也就是vue实例中，created和mounted都是vue实例的key，就可以通过`this[key]`去访问data中的值了。

当然，要注意，`initState(vm)`是在`beforeCreate`这个钩子之后执行，所以beforeCreate是不能通过上面的方式进行访问的。

![hooks](https://i.loli.net/2021/08/16/twNof3mjWJT7A2r.png)  
 
  
   
    
     
      
**Vue版本：[2.6.14](https://github.com/vuejs/vue/archive/refs/tags/v2.6.14.zip)**