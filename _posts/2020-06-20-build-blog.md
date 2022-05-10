---
layout: post
title:  "用sapper构建一个博客"
date:   2020-06-20 20:00:00 +0800
categories: 前端
---

发现自己好久没有写博客了。之前在github开了一个仓库，在仓库的[issue区](https://github.com/GzhiYi/blog/issues)写一些内容。issue区体验挺好的，可以refer上项目代码，也可以追加评论。但我想自己写一个博客，不需要很多花里胡哨的功能，只对内容专注，极大的好处是，可以随心所欲的编写自己喜欢的页面样式。刚好最近有接触了下[svelte](https://svelte.dev/)，就顺带的用[sapper](https://sapper.svelte.dev/)写一个静态页面。

实现需要用到的知识点/技术：

1. svelte
2. sapper
3. tailwindcss
4. typescript

后面两点非必须，可以根据自己需要进行增减。

## 思路
整体的思路比较简单。

sapper支持export出静态文件，我只需要将静态文件部署到一个静态站点，首选的就是github pages。sapper导出export有一个好处：

> Static doesn't mean non-interactive — your Svelte components work exactly as they do normally, and you still get all the benefits of client-side routing and prefetching.

sapper默认的template就是一个blog，这不是刚好可以拿来起手嘛！但默认的template的 blog内容是固定的数据，大致内容是一个js文件，export一个blog的array。

```javascript
export const [
  {
    title: '2020-06/build-blog.md',
    slug: '2020-06_build-blog', // 生成的路由路径
    html: '<h1 id=\"用sapper构建一个博客\">用sapper构建一个博客</h1>'
  }
]
```

在sapper export之后，可以在`__sapper__/export/blog`看到生成html静态文件。也就意味着最后需要部署到github pages的目录，就是`__sapper__`目录啦。

**可如果要写博客，那肯定也优先选择Markdown。**

所以需要解决的也就是将Markdown文件转为上面提到的js文件。

## 将Markdown转为js文件

需要用到[Markedjs](https://github.com/markedjs/marked)。

使用也是简单粗暴：

```javascript
const marked = require('marked')
marked.setOptions({
  renderer: new marked.Renderer(),
  highlight: function(code, language) {
    const hljs = require('highlight.js')
    const validLanguage = hljs.getLanguage(language) ? language : 'plaintext'
    return hljs.highlight(validLanguage, code).value
  },
  // ...(more options)
});
marked(markdownString)
```

例如markdownString为：

```
*hello world*
```

将会被转为：

```html
<p><em>hello world</em></p>
```

知道用法之后，只需要通过fs文件操作，将目标的Markdown文件全部push进一个数组，最后将数组写入一个js文件。

## 读取Markdown并写入文件

node对操作文件提供了`readir`、`readFile`、`writeFile`等函数。

其中核心的处理逻辑如下：

```javascript
// 获取所有文件
const getAllFiles = function (dirPath, arrayOfFiles) {
	files = fs.readdirSync(dirPath)
	arrayOfFiles = arrayOfFiles || []
	files.forEach(function (file) {
		if (fs.statSync(dirPath + "/" + file).isDirectory()) {
			arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
		} else {
			arrayOfFiles.push(path.join(dirPath, "/", file))
		}
	})
	return arrayOfFiles
}
// 将markdown转为js文件
const compile = () => {
	try {
		const dirs = getAllFiles('./') // 读取所有文件
		const inPosts = [] // 文章数组
		for (let fileName of dirs) {
			if (/.md/.test(fileName)) {
				const fileData = fs.readFileSync(`./${fileName}`, 'utf-8') // markdown内容
				const fmData = fm(fileData) // 此处可以忽略fm（fm是处理markdown front matter的，可有可无）
				const rmSuffix = fileName.split('.')[0] // 移除文件名后缀
				inPosts.push({
					title: fileName,
					path: rmSuffix,
					slug: rmSuffix.replace('/', '_'),
					html: marked(fmData.body),
					fmData
				})
			}
		}
		inPosts.forEach(post => {
			post.html = post.html.replace(/^\t{3}/gm, '');
		});
		const outPutContent = `export default ${JSON.stringify(inPosts)}`
		fs.writeFile('../routes/blog/_posts.js', outPutContent, err => {
			if (err) return console.log('生成post失败', err)
			console.log('已生成_posts.js')
		})
	} catch (error) {
		console.error('error', error)
	}
}
const watcher = chokidar.watch('./')
watcher
	.on('all', () => {
		compile()
	})
```

## 部署到github pages

对于sapper，执行export命令生成静态文件。

```bash
npm run export
```

将`__sapper__/export`推送到仓库的gh-pages分支。

```bash
git subtree push --prefix __sapper__/export origin gh-pages
```

最后在仓库设置出将gh-pages分支设置为部署分支就好了。

以上完成了从写Markdown到可以看到文章，后续页面的编写就可以随心所欲啦！