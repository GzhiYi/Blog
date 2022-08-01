const fs = require('fs')
const dayjs = require('dayjs')
const readline = require('readline')
const { exec } = require('child_process')
const { start } = require('repl')


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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
  new Promise((resolve, reject) => {
    rl.question('🤔输入这篇文章名称：', title => {
      rl.question('🐼路由英文：', url => {
        rl.question('😪文章类别：', category => {
          const fileName = generatePost(title, url, category)
          console.log('fileName', fileName)
          resolve(fileName)
          rl.close()
        })
      })
    })
  })
}

const begin = async () => {
  const fileName = await generatePromise()
  exec(`vim ${fileName}`)
}

begin()