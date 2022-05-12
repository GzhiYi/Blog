---
layout: post
title:  "Git提交信息格式化（规范）"
date:   2021-08-08 06:05:05 +0800
categories: git
---

## Git 提交信息格式

每一条提交的记录信息由`header`、`body`、`footer`组成。

```
<header>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

header是强制性的，需要符合header的规则约束。

除了“docs”类型的提交外，所有提交都必须使用body。当正文出现时，它必须至少有20个字符长，并且必须符合提交消息正文格式。

footer是可选的。

### header

```
<type>(<scope>): <short summary>
  │       │             │
  │       │             └─⫸ 没有大写，结尾不需要句号
  │       │
  │       └─⫸ Commit Scope: 内定
  │
  └─⫸ Commit Type: build|ci|docs|feat|fix|perf|refactor|test
```

⚠️ type、summary是强制性要求，scope是可选的。

#### type

必须是取下面之一:

* **build**: 修改的内容影响构建功能或者外部的依赖（例如：gulp、broccoli、npm）
* **ci**: 修改了CI配置和脚本（例如：Circle、BrowserStack、GitlabCI）
* **docs**: 文档修改
* **feat**: 新增功能
* **fix**: bug修复
* **perf**: 用于性能提升的修改
* **refactor**: 此修改既不是bug修复，也不是功能的新增
* **test**: 关乎测试相关的内容修改

#### scope

可以理解为修改的作用范围，这一项是根据当前项目所决定的。可以自行确定。确定的规则是思考当前的修改到底影响的是哪一些模块。

#### summary

简要概述。注意

1. 使用的是现在时的语法，例如是“修改”，而不是“修改了”。
2. 首字母不要大写，适用于英文。
3. 句末不需要增加分号（`。`/`.`）。

### body

和summary一样，使用的是现在时的语法，例如是“修改”，而不是“修改了”。

在提交消息体中解释更改的原因。提交消息应该解释为什么要进行这个更改。可以包含旧内容和新内容的比较，用于辅助解释修改的影响。

### footer

页脚可以包含关于重大更新的内容，也是引用GitHub issue、Jira和其他链接。

### 例子

查看[Angular](https://github.com/angular/angular)源代码仓库，使用的提交规则清一色的符合上述情况。

可以看到，提交信息的内容基本都是以动词开始。