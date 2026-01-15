# 使用命令行打包 APK

## 当前状态
✅ Android 平台已添加
✅ Web 资源已同步
✅ Android Studio 未安装

## 解决方案
使用 Gradle 命令行工具打包 APK，无需 Android Studio。

## 执行步骤

### 1. 检查 Android 项目结构
确认 `android` 目录和 Gradle 配置

### 2. 使用 Gradle 打包 Debug APK
```bash
cd android
./gradlew assembleDebug
```

### 3. 使用 Gradle 打包 Release APK
```bash
cd android
./gradlew assembleRelease
```

### 4. 查找 APK 文件
- Debug APK：`android/app/build/outputs/apk/debug/app-debug.apk`
- Release APK：`android/app/build/outputs/apk/release/app-release.apk`

## 注意事项
- Release APK 需要签名才能安装
- Debug APK 可以直接安装，但包含调试信息
- 如果需要签名 Release APK，需要创建签名文件