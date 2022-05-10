---
layout: post
title:  "微信小程序获取群id的方式"
date:   2021-09-07 13:44:14 +0800
categories: 小程序
---
![图 1](https://i.loli.net/2021/09/07/MWD9UtfXIVFZzPj.png)

如果小程序中有应用场景涉及到需要获取群的唯一标识的，可以获取opengid用以区分。

`wx.getGroupEnterInfo()`可以获取到opengid。

### 回调内容

```
wx.getGroupEnterInfo({
  success(res) {
    // errMsg 错误信息	
    // encryptedData 加密数据
    // iv 加密算法的初始向量
    // cloudID 敏感数据对应的云 ID，开通云开发的小程序才会返回，可通过云调用直接获取开放数据
  }
})
```

如果解密成功，将会获取opengid。

### 服务端解密encryptedData获取opengid

此处以`nodejs`为例子，需要准备的内容参数：

1. appId。小程序的appId。
2. session_key。小程序会话key，获取方式：
![session_key获取](https://i.loli.net/2021/09/07/cmuFGA7rZHLJzh1.png) 
3. encryptedData。上面提到的加密数据。
4. iv。加密算法的初始向量。

```js
// 引入 WXBizDataCrypt
//  WXBizDataCrypt下载地址：https://res.wx.qq.com/wxdoc/dist/assets/media/aes-sample.eae1f364.zip，在里面找到。
const WXBizDataCrypt = require('./WXBizDataCrypt')

const appId = ''
const sessionKey = ''
const encryptedData = ''
const iv = ''

const pc = new WXBizDataCrypt(appId, sessionKey)

// 解密后的数据
const data = pc.decryptData(encryptedData , iv)
```

### 云函数解密opengid

需要准备一个接受调用解密的云函数。

在小程序端调用：

```js
const cloudID = '' // 这里是调用getGroupEnterInfo返回的cloudID
wx.cloud.callFunction({
  name: 'decrypt',
  data: {
    groupData: wx.cloud.CloudID(cloudID), // 这个 CloudID 值到云函数端会被替换
    // 下面这个obj是错误示例，不会在云函数中把解密的opengid塞进obj，所以遵循上面的写法，只放在第一层
    obj: {
      groupData: wx.cloud.CloudID(cloudID), // 不要这么写！！
    }
  }
})
```

在云函数端，应该是这样的：

```js
exports.main = async (event) => {
  // groupData是和小程序端的命名是一致的，这样才能正确返回
  return {
    code: 1,
    data: event.groupInfo.data,
    msg: '获取成功',
  }
}
```

### 只显示群昵称

小程序可以通过开发数据组件open-data展示群昵称，需要的参数为opengid。

```html
<open-data type="groupName" open-gid="{{opengid}}"></open-data>
```

如果想修改样式，需要在外面包一层view进行样式控制。

不能通过一个固定的opengid获取群名，这在模拟器中调试是不成功的。