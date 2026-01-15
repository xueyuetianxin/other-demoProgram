# 更新 GitHub Actions 工作流到 v4 版本

## 问题分析
错误信息显示使用了已弃用的 `actions/upload-artifact: v3` 版本。

## 解决方案
更新工作流文件，将 `actions/upload-artifact@v3` 改为 `actions/upload-artifact@v4`。

## 执行步骤
1. 修改 build-android.yml 文件
2. 修改 build-ios.yml 文件
3. 提交并推送更改