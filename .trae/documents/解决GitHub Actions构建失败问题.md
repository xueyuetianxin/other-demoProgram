# 修复 Capacitor iOS 同步问题

## 问题分析

本地是 Windows 系统，无法安装 Xcode，导致 `npx cap sync ios` 在本地失败。但 GitHub Actions 会在 macOS 环境中运行，那里已经安装了 Xcode。

## 解决方案

1. 调整 GitHub Actions 工作流，确保 Capacitor iOS 同步步骤正确执行
2. 优化构建命令，确保 web 构建产物正确同步
3. 确保 iOS 项目结构完整

## 执行步骤

1. 调整工作流中的 Capacitor 同步命令
2. 确保 web 构建产物正确生成
3. 更新工作流文件
4. 提交并推送更改

