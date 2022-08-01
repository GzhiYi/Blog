yout: post
title: 博客增加通过命令行新建和编辑文章快捷操作
date: 2022-08-01 12:37:52
categories: 博客
---

# 如果喜欢命令行写内容，不妨可以增加一些快捷操作

任何一个编辑器都可以写文本，当然也就可以写写 markdown。如果期望是做到在命令行一条命令完成文章的新建、编辑操作，那可以写一个脚本去处理不必要的繁琐操作。比如要找到文章的目录去新建文章；要复制文章模板去修改一些基础的信息（标题、分类、创建时间等等）；实现这个功能需要使用 Node 服务。

## 实现代码

创建一个文件`new.js`，代码内容如下：

```js
const fs = require('fs')
const dayjs = require('dayjs')
const readline = require('readline')
const { exec } = require('child_process')
const { start } = require('repl')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function generatePost(title, url, category) {
  const templateStr = `---
layout: post
title: ${title}
date: ${dayjs().format('YYYY-MM-DD HH:mm:ss')} +0800
categories: ${category}
---

# 
`
  const fileName = `${dayjs().format('YYYY-MM-DD')}-${title}.md`
  fs.writeFileSync(`./_posts/${fileName}`, templateStr)
  return `./_posts/${fileName}`
}

const generatePromise = () => {
  return new Promise((resolve, reject) => {
    rl.question('🤔输入这篇文章名称：', title => {
      rl.question('🐼路由英文：', url => {
        rl.question('😪文章类别：', category => {
          const fileName = generatePost(title, url, category)
          console.log('文章已生成，现在编辑！', fileName)
          resolve(fileName)
          rl.close()
        })
      })
    })
  })
}

const begin = async () => {
  const fileName = await generatePromise()
  require('child_process').spawn('vim', [fileName], { stdio: 'inherit' })
}

begin()
```

其中 `generatePost` 函数的 `templateStr` 为文章的模板信息，交给 `Jekyll` 去渲染一些基础信息。通过 `Node` 的 `readline api`，处理手动输入的文章标题、路由、类别等等。最后定义为一个 `Promise` ，以便在生成文件后打开 `vim` 进行编写操作。

## 脚本命令添加

完成脚本后，就可以通过一个简单的命令 `node new.js` 去执行这一系列的操作了。在 `package.json` 中补充命令即可：

```json
"scripts": {
  "new": "node new.js"
}
```

如果你想在整个操作系统中随处写文章，可以设置 `alias` 快捷访问。例如在 `.zshrc` 中补充：

```bash
# /Users/gzhiyi/Documents/projects/blog 为你的 Jekyll 项目目录，按需填写
alias post="cd /Users/gzhiyi/Documents/projects/blog && yarn new"
``` 

别忘记最后重启命令行或者执行 `source ~/.zshrc` 让配置生效。最后如果想写文章，只需要在任何用到 `～/.zshrc` 的 `terminal` 中输入 `post` 即可。

