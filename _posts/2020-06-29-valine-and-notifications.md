---
layout: post
title:  "博客评论更改为valine并增加评论推送"
date:   2020-06-29 20:00:00 +0800
categories: 博客
---

通过一点时间的使用，发现gitalk可以解决静态博客评论问题，是挺方便的，但综合考虑下，存在以下两个缺点：

1. 需要github账号登录。
2. 访问非常慢。

有意间，发现一个评论插件很适合静态博客植入：[Valine](https://valine.js.org/)。

新样式

![style](https://i.loli.net/2020/06/29/RiSBpcyAQD1kXCN.jpg)

新评论模块默认很清新，和我当前的样式较为符合，只做了一点点的样式覆盖。

```css
/* valine 样式覆盖 */
.v[data-class=v] .vwrap {
	border: 1px solid rgba(255, 62, 0, 0.1) !important;
}
.v[data-class=v] .vwrap .vheader .vinput {
	border-bottom: none !important;
}
.v[data-class=v] .txt-right {
	display: none !important;
}
```

## 推送

在valine的文档中，有提到可以用一个扩展的valine-admin以实现评论通知功能。我在leancloud尝试了发现比较麻烦。外加之前使用GitHub Actions用到了一个推送服务实现了在action成功之后推送部署成功的通知到手机上。那是不是可以通过下面的思路去实现评论推送呢？

> [PUSH注册](https://push.techulus.com/)注册后使用免费的plan，可以每月100条推送限额。要推送到手机，只需要调用提供的接口还有下载一个手机APP就好了。

要知道，做到推送到手机，只需要POST下面的接口：

```bash
https://push.techulus.com/api/v1/notify/{YOU API KEY}?title=Push by Techulus&body=This is your first push notification
```



1. 在评论接口POST请求之后，在lean端通过类似拦截/触发的方法调用推送接口。
2. 在网页端拦截POST请求，在评论发出之后，在调用推送接口。

在查看对应文档之后，第一种方式我找不到可行的入口。我想确定数据库入库的逻辑在哪处理的也找不到，所以采用第二种方法。

## 拦截评论请求

1. 博客引入ajax-hook全局拦截请求

```html
<script src="https://unpkg.com/ajax-hook@2.0.3/dist/ajaxhook.min.js"></script>
```

2. 在ajax-hook实例上，处理onRequest钩子。

   ```javascript
   ah.proxy({
			//请求发起前进入
			onRequest: (config, handler) => {
				if (config.url.includes('classes/Comment') && config.method === 'POST') {
					console.log('请求发起前', config.body)
					fetch(
						`https://push.techulus.com/api/v1/notify/${YOU API KEY}?title=${location.pathname || '文章'}有新回复&body=${config.body.substr(12, 30)}`,
						{
							method: 'POST',
							mode: 'cors',
							headers: new Headers({
								'Content-Type': 'application/json'
							})
						}
					)
				}
				handler.next(config);
			},
			//请求发生错误时进入，比如超时；注意，不包括http状态码错误，如404仍然会认为请求成功
			onError: (err, handler) => {
					handler.next(err)
			},
			//请求成功后进入
			onResponse: (response, handler) => {
					handler.next(response)
			}
		})
   ```

   更多关于ajax-hook的文档，参阅：[ajax-hook](https://github.com/wendux/Ajax-hook)	

## 缺点提示

第一种方式可以很好的保护推送的API KEY，因为有限额，暴露后可以随意调用。第二种比较简单易行。不过，反正push服务免费的话，也不会有损失。如果push服务付费就不要用第二种方法了。

完成以上操作就可以收到评论推送啦，还是很方便的。如果有更好的免费push服务提供的，可以评论留言，我会很快看到的。