@echo off
echo ========================================
echo 租赁管理系统 - 应用打包工具
echo ========================================
echo.

echo 检查 Java 环境...
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo [警告] 未找到 Java 环境，Android 打包需要 JDK
    echo.
)

echo 检查 Android 项目...
if exist "android" (
    echo [成功] Android 项目存在
) else (
    echo [警告] 未找到 Android 项目
)

echo 检查 iOS 项目...
if exist "ios" (
    echo [成功] iOS 项目存在
) else (
    echo [警告] 未找到 iOS 项目
)

echo.
echo 选择打包平台:
echo 1. Android APK
echo 2. iOS IPA（需要 Mac 和 Xcode）
echo 3. 两者都打包
echo.
set /p choice=请选择 (1, 2 或 3):

if "%choice%"=="1" (
    echo.
    echo 开始 Android APK 打包...
    call :build_android
) else if "%choice%"=="2" (
    echo.
    echo 开始 iOS IPA 打包...
    call :build_ios
) else if "%choice%"=="3" (
    echo.
    echo 开始 Android APK 打包...
    call :build_android
    echo.
    echo 开始 iOS IPA 打包...
    call :build_ios
) else (
    echo [错误] 无效的选择
)

echo.
pause
exit /b 0

:build_android
echo.
echo 构建项目...
call npm run build
if %errorlevel% neq 0 (
    echo [错误] 项目构建失败
    exit /b 1
)

echo [成功] 项目构建完成
echo.

echo 同步 Capacitor...
call npx cap sync android
if %errorlevel% neq 0 (
    echo [错误] Capacitor 同步失败
    exit /b 1
)

echo [成功] Capacitor 同步完成
echo.

echo 选择 Android 打包类型:
echo 1. Debug APK（调试版本，可以直接安装）
echo 2. Release APK（发布版本，需要签名）
echo.
set /p android_choice=请选择 (1 或 2):

if "%android_choice%"=="1" (
    echo.
    echo 开始构建 Debug APK...
    cd android
    call gradlew.bat assembleDebug
    cd ..
    
    if %errorlevel% equ 0 (
        echo.
        echo [成功] Debug APK 构建完成
        echo 文件位置: android\app\build\outputs\apk\debug\app-debug.apk
        echo.
        start android\app\build\outputs\apk\debug
    ) else (
        echo.
        echo [错误] Debug APK 构建失败
    )
) else if "%android_choice%"=="2" (
    echo.
    echo 开始构建 Release APK...
    cd android
    call gradlew.bat assembleRelease
    cd ..
    
    if %errorlevel% equ 0 (
        echo.
        echo [成功] Release APK 构建完成
        echo 文件位置: android\app\build\outputs\apk\release\app-release-unsigned.apk
        echo.
        echo 注意: Release APK 需要签名才能安装
        echo 请使用以下命令签名:
        echo jarsigner -keystore your-keystore.jks -signedjar signed.apk app-release-unsigned.apk
        echo.
        start android\app\build\outputs\apk\release
    ) else (
        echo.
        echo [错误] Release APK 构建失败
    )
) else (
    echo [错误] 无效的选择
)
goto :eof

:build_ios
echo.
echo 检查系统环境...
if not exist "C:\Program Files\Git\bin\sh.exe" (
    echo [错误] 未找到 Git Bash，iOS 打包需要 Git
    echo 请先安装 Git: https://git-scm.com/download/win
    exit /b 1
)

echo.
echo 构建项目...
call npm run build
if %errorlevel% neq 0 (
    echo [错误] 项目构建失败
    exit /b 1
)

echo [成功] 项目构建完成
echo.

echo 同步 Capacitor...
call npx cap sync ios
if %errorlevel% neq 0 (
    echo [错误] Capacitor 同步失败
    exit /b 1
)

echo [成功] Capacitor 同步完成
echo.

echo.
echo [信息] iOS 打包需要 Mac 电脑和 Xcode
echo [信息] 请在 Mac 上打开 ios/App/App.xcworkspace
echo [信息] 使用 Xcode 进行打包
echo.
echo 或者使用 GitHub Actions 自动打包:
echo 1. 将项目推送到 GitHub
echo 2. 在 GitHub Actions 中运行 "Build iOS IPA" 工作流
echo 3. 下载生成的 IPA 文件
echo.
start ios
goto :eof
