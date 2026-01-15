# 将 React 项目适配到 HBuilder X 云打包

## 问题分析
HBuilder X 主要用于 **uni-app**（Vue.js）项目，而当前项目是 **React + Vite** 项目，无法直接在 HBuilder X 中云打包。

## 解决方案

### 方案 1：使用 HBuilder X 的 5+App 模式（推荐）
HBuilder X 支持 5+App 模式，可以导入 Web 项目。

**步骤：**
1. 在 HBuilder X 中创建新项目
2. 选择 5+App 模式
3. 导入当前项目的 dist 目录
4. 配置 manifest.json
5. 云打包

### 方案 2：使用 Capacitor 打包成原生应用
将 React 项目打包成 iOS 和 Android 应用。

**安装依赖：**
```bash
npm install @capacitor/core @capacitor/cli
npx cap init
npm install @capacitor/android @capacitor/ios
```

**配置步骤：**
1. 修改 vite.config.ts 添加 Capacitor 配置
2. 创建 capacitor.config.ts 文件
3. 添加图标和启动画面

**打包步骤：**
```bash
npm run build
npx cap sync
npx cap open android
npx cap open ios
```

### 方案 3：使用 PWA（渐进式 Web 应用）
将项目打包成 PWA，可以在移动设备上安装使用。

**安装依赖：**
```bash
npm install vite-plugin-pwa -D
```

**配置 vite.config.ts：**
添加 PWA 配置，包括 manifest、service worker 等

## 推荐方案
推荐使用 **Capacitor**，因为：
- 支持 React 项目
- 可以打包成 iOS 和 Android 应用
- 配置简单，使用方便
- 支持原生功能访问

## 执行步骤
1. 选择打包方案（推荐 Capacitor）
2. 安装必要的依赖
3. 配置项目
4. 执行打包命令