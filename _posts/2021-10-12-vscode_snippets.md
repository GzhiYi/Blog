---
layout: post
title:  "在VSCode中设置用户代码片段，以提高开发的效率"
date:   2021-10-12 17:21:45 +0800
categories: 代码工具
---
![图 1](https://i.loli.net/2021/10/12/YXdtzfLxoD5Jlah.png)  

用户代码片段可以设置全局和在某个文件夹的项目内。我最常用的是执行console.log还有设置本地缓存。比如设置一个全局的log snippets：

```json
{
  "Print to console": {
  "prefix": "lg",
  "body": [
   "console.log('$1', $2)",
  ],
  "description": "Log output to console"
 }
}
```

这样只要在编辑器内打出`lg`就会提示输出`console.log('', )`。

## 动态去生成这个snippets文件

相比在语言语法上的代码提示，项目内结合业务的提示会让开发更清楚哪些地方需要该代码片段。因为大部分语言上的片段都会通过安装扩展的方式支持。

例如如果对表格进行了封装，做到了可以通过列名去渲染该列的内容：

```js
// 假设可以读取columns这个数组并渲染该数组的每一项，数组 --> 表格
const columns = [
  {
    name: '参加人数'
  }
]
```

这对表格复用有很大的帮助。

针对不同的页面，如果多个不同的页面复用了同一个字段，那只需要在columns上声明这个字段就好，不需要额外的写代码去渲染判断，避免重复性内容。

**在组件template中接受要渲染的columns数组**

大致的渲染代码可以如下：

```vue
div(v-if="col.name === '参加人数'") {{row.num }}
```

如果可封装的列少或者都能记得每一个列的列名，倒可以很快的知道要输入的列名到底是啥。但业务多起来的时候，会出现重复查看到底有啥列名的操作。

这时候就可以考虑动态生成snippets。

### 在vue执行编译运行开发环境前增加生成snippets

```bash
node init.js && vue-cli-service serve
```

#### 读取template中的判断

上面提到的vue template，要知道所有可选的列名，可以通过在template中截取`div(v-if="col.name === '参加人数'")`中的值。

```js
function getSnippetsContent() {
  let result = {}
  // 这里可以补充更多需要提示的代码片段
  // 表格的一些快捷方式
  const data = fs
    .readFileSync('表格template的组件文件地址.vue')
    .toString()
  const colName = []
  const filtered = data.match(/col\.name === '(\S*)'/g)
  filtered.forEach(item => {
    colName.push(item.replace("col.name === '", '').replace("'", ''))
  })
  Array.from(new Set(colName)).forEach(item => {
    item = `'${item}'`
    result[`表格-${item}`] = {
      "scope": "javascript,typescript",
      "prefix": `表格-${item}`,
      "body": [item],
      "description": item
    }
  })

  return JSON.stringify(result)
}

function createSnippets() {
  if (!fs.existsSync('.vscode')) {
    fs.mkdirSync('.vscode')
  }
  fs.writeFileSync('.vscode/mapPage.code-snippets', getSnippetsContent())
}

try {
  // 生成vscode snipppets
  createSnippets()
} catch (error) {
  // 
}
```
