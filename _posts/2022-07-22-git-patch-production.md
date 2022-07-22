---
layout: post
title:  "使用 Git Patch 对生产环境进行补丁式更新"
date:   2022-07-22 14:30:52 +0800
categories: Git
---

# Git Patch

git 中有一个命令 patch，可以对比不同分支或者 commit 去打一个包含两者不同修改内容的补丁。如果生产环境代码需要紧急更新，但目前主分支不能够满足代码合并进去，就需要一个紧急的处理方式，也就是将 patch 应用到生产环境中。

先看看命令基本用法。

## 创建 Git Patch 文件

指定分支和目标目录来生成的 patch 文件。

```bash
git format-patch <branch> <options>
``` 

只有 git format-patch 命令是不会输出内容的，需要补充一些参数。比如 feature 分支对比 master 分支的差异可以用以下命令生成：

```bash
# on branch feature
git format-patch master
# 0001-***.patch
```

增加 `-o` 参数可以生成到目标目录。

```js
git format-patch <branch> -o <directory>
```

## 应用 patch 文件

使用 `git am` 应用 patch 文件。

```bash
# 在需要应用补丁的分支上
git am 0001-***.patch
```

## 在生产环境中应用补丁

这一步需要搭配构建流程来使用，比如在 GitLab CI/CD 中使用。在一些前置的 job 中，例如一些prepare 的job 中，在拉取到代码后再应用 patch 文件。这一步发生在项目构建和运行之前。
