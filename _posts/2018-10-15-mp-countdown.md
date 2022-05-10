---
layout: post
title:  "用小程序做个动态倒计时"
date:   2018-10-15 20:00:00 +0800
categories: 小程序
---

### 写在前

最近由于业务需要，需要做一个倒计时的小插件，想想自己在很久以前用JavaScript写过，操作dom，很快就可以修改对应的数字了。现在换到小程序后，主要的还是去更改data的值，进而修改对应的图片。  

<!--more-->

### 效果

![counter](https://images.vrm.cn/2018/11/22/微信截图_20181122151328.png)
具体：  

- 精度为天时分秒
- 初始时间可以从接口获取

### 代码
```html
  <view class="counter">
    距离活动结束仅剩
    <image bindload="showPicture" class="clock" mode="widthFix" src="../../src/images/clock/num{{count.dayBegin}}.png"></image>
    <image bindload="showPicture" class="clock" mode="widthFix" src="../../src/images/clock/num{{count.dayEnd}}.png"></image>
    天
    <image bindload="showPicture" class="clock" mode="widthFix" src="../../src/images/clock/num{{count.hourBegin}}.png"></image>
    <image bindload="showPicture" class="clock" mode="widthFix" src="../../src/images/clock/num{{count.hourEnd}}.png"></image>
    时
    <image bindload="showPicture" class="clock" mode="widthFix" src="../../src/images/clock/num{{count.minuteBegin}}.png"></image>
    <image bindload="showPicture" class="clock" mode="widthFix" src="../../src/images/clock/num{{count.minuteEnd}}.png"></image>
    分
    <image bindload="showPicture" class="clock" mode="widthFix" src="../../src/images/clock/num{{count.secondBegin}}.png"></image>
    <image bindload="showPicture" class="clock" mode="widthFix" src="../../src/images/clock/num{{count.secondEnd}}.png"></image>
    秒
  </view>
```
```javascript
// 初始值
timer: null,
data: {
  count: {
    expireDate: 172800, // s
    dayBegin: 0,
    dayEnd: 0,
    hourBegin: 0,
    hourEnd: 0,
    minuteBegin: 0,
    minuteEnd: 0,
    secondBegin: 0,
    secondEnd: 0
  }
}

// 接口回调处
let { count } = this.data
delele count[`expireDate`] // 删除原count中的expireDate
this.setData({
  ...count,
  expireDate: newExpireDate
})
this.timer = setInterval(function() {
  let expireDate = this.data.count.expireDate - 1
  this.setData({
    count: {
      dayBegin: this.convertTime(expireDate)[0][0],
      dayEnd: this.convertTime(expireDate)[0][1],
      hourBegin: this.convertTime(expireDate)[1][0],
      hourEnd: this.convertTime(expireDate)[1][1],
      minuteBegin: this.convertTime(expireDate)[2][0],
      minuteEnd: this.convertTime(expireDate)[2][1],
      secondBegin: this.convertTime(expireDate)[3][0],
      secondEnd: this.convertTime(expireDate)[3][1],
      expireDate,
    }
  })
}, 1000)

/**
 * 时间转化函数，时间戳入参为秒
*/
convertTime: function (sec) {
  let time
  if (sec > -1) {
    let hour = Math.floor(sec / 3600)
    let min = Math.floor(sec / 60) % 60
    let second = sec % 60
    let day = parseInt(hour / 24)
    hour = hour - 24 * day
    hour = hour < 10 ? `0${hour}` : hour
    time = day < 10 ? `0${day}:${hour}:`: `${day}:${hour}:`
    if (min < 10) {
      time += "0"
    }
    time += min + ":";
    if (second < 10) {
      time += "0"
    }
    time += second
    return time.split(':') // 返回一个包含天时分秒的数组
  }
}
// 最后不要忘记在周期销毁处清空计时器
onUnload: function () {
  clearInterval(this.timer)
}
```
```javascript
// 时间转 **前的函数
  getDateDiff: function(dateTimeStamp){
    let result = ''
    let minute = 1000 * 60
    let hour = minute * 60
    let day = hour * 24
    let halfamonth = day * 15
    let month = day * 30
    let now = new Date().getTime()
    let diffValue = now - dateTimeStamp
    if(diffValue < 0) { return; }
    let monthC = diffValue / month
      let weekC = diffValue / (7 * day)
      let dayC = diffValue / day
      let hourC = diffValue / hour
      let minC = diffValue / minute
      if(monthC>= 1){
    result = "" + parseInt(monthC) + "月前"
    }
      else if (weekC >= 1) {
      result = "" + parseInt(weekC) + "周前"
    }
    else if (dayC >= 1) {
      result = "" + parseInt(dayC) + "天前"
    }
    else if (hourC >= 1) {
      result = "" + parseInt(hourC) + "小时前"
    }
    else if (minC >= 1) {
      result = "" + parseInt(minC) + "分钟前"
    } else
      result = "刚刚"
    return result
  },
```
### 最后
相关思路适用于所有mvvm框架。