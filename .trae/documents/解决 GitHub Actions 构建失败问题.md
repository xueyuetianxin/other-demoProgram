## 问题分析

GitHub Actions 构建失败的原因是 **Node.js 版本不兼容**：
- Capacitor 8.0.1 需要 Node.js >=22.0.0
- 当前 GitHub Actions 工作流中使用的是 Node.js 20
- 错误信息：`[fatal] The Capacitor CLI requires NodeJS >=22.0.0`

## 解决方案

需要修改 GitHub Actions 工作流文件，将 Node.js 版本从 20 升级到 22 或 24：

1. **修改 `.github/workflows/build-android.yml`**：
   - 将 `node-version` 从 `20` 改为 `22` 或 `24`

2. **修改 `.github/workflows/build-ios.yml`**：
   - 将 `node-version` 从 `20` 改为 `22` 或 `24`

## 实施步骤

1. 编辑 `build-android.yml`，更新 Node.js 版本
2. 编辑 `build-ios.yml`，更新 Node.js 版本
3. 提交更改到 GitHub
4. 观察 GitHub Actions 构建结果

这个修改将确保 GitHub Actions 环境使用与 Capacitor 8.0.1 兼容的 Node.js 版本，从而解决构建失败问题。