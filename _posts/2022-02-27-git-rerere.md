---
layout: post
title:  "rerere！关于 rebase 出现很多冲突的问题"
date:   2022-02-27 10:19:52 +0800
categories: Git
---

# rerere！关于 rebase 出现很多冲突的问题

协作中如果主分支和你当前分支中，在较早的 commit 中已经出现冲突的话，那么如果该改动累积了不少的 commit ，那么在 rebase 的时候就会出现多次不断的 git rebase —continue 以处理冲突，甚至会出现冲突是已经解决过的。

```jsx
git config --global rerere.enabled 1
```

上面的命令可以让你更轻松的进行合并。

rerere 的意思是 reuse recorded resolution 。依照字面意思，允许你告知 Git 去记住你处理过的冲突，以便于在遇到相似的冲突时不再需要你去处理，Git 会给你按处理过的方式处理。