---
layout: post
title:  "七牛回收测试域名后，下载图片"
date:   2018-11-22 20:00:00 +0800
categories: 前端
---

![_20181122152425](https://user-images.githubusercontent.com/21136420/48887594-d3134680-ee6a-11e8-9721-b46722c63f88.png)

## 测试域名回收

月中就收到了七牛测试域名被回收的邮件。没多瞥几眼，直接拖到了过期时间，错过了下载图片的时间。

现在考虑不用hexo那个github pages了，转移到github issue区进行记录。博客嘛，不搞花里胡巧了，issue几乎满足所有要求。对于图片挂了这回事，还是要处理的，所以找了下补救措施，也在这记录下。

## 主要步骤（系统环境Windows）

1. 在对象存储处，新建一个新的存储空间，假设名为`backup`，过期的空间名为`images`。注意存储区域选择和原有过期空间一致。
2. 下载[qshell](https://github.com/qiniu/qshell)。下载解压后应该包含以下几端的qshell文件（以下载回来的文件为主）。
![image](https://user-images.githubusercontent.com/21136420/48888437-aa408080-ee6d-11e8-8a4b-ab02b58a6f7d.png)
3. 根据对于系统选择对应的qshell文件。注意windows不要双击打开，应该在该目录处打开shell脚本，输入文件名代替qshell命令。

查看qshell版本检查qshell是否可用：
![image](https://user-images.githubusercontent.com/21136420/48888591-2f2b9a00-ee6e-11e8-8732-14a97de2baac.png)

4. 按以下命令格式配置七牛账号信息，注意命令包含AK（access_key）、SK（secret_key）以及账户名（注册邮箱）。
```bash
 qshell_windows_x64.exe account AK SK NAME
```
![image](https://user-images.githubusercontent.com/21136420/48888794-c133a280-ee6e-11e8-9edb-db6b3db9188c.png)
[命令account参考](https://github.com/qiniu/qshell/blob/master/docs/account.md)

5. 导出图片信息列表到txt文件。
```bash
qshell_windows_x64.exe -v  listbucket images -o tocopy.txt
```
[命令listbucket参考](https://github.com/qiniu/qshell/blob/master/docs/listbucket.md)
完成后，tocopy.txt就包含了原有过期空间images的所有文件信息。

6. 只保留tocopy.txt每行内的文件名，其余的去掉。

7. 使用batchcopy命令迁移。
```bash
qshell_windows_x64.exe -v  batchcopy images backup -i tocopy.txt
```
[命令batchcopy参考](https://github.com/qiniu/qshell/blob/master/docs/batchcopy.md)
自此，空间文件迁移成功，可以到新空间查看图片或者下载图片了。
