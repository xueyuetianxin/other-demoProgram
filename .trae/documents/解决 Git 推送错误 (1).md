# 解决 Git 推送错误

## 问题分析
当前分支 `feature/new-feature` 没有设置上游分支，无法推送。

## 解决方案
1. 切换到 main 分支
2. 推送代码到 main 分支
3. 删除 feature/new-feature 分支（可选）

## 执行步骤
1. 切换到 main 分支
2. 推送代码
3. 删除本地 feature/new-feature 分支