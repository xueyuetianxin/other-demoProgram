@echo off
echo ========================================
echo 租赁管理系统 - APK 打包工具
echo ========================================
echo.

echo 检查 Java 环境...
java -version
if %errorlevel% neq 0 (
    echo [错误] 未找到 Java 环境
    echo.
    echo 请先安装 JDK 17 或更高版本：
    echo 1. 访问 https://www.oracle.com/java/technologies/downloads/
    echo 2. 下载并安装 JDK
    echo 3. 配置 JAVA_HOME 环境变量
    echo.
    pause
    exit /b 1
)

echo [成功] Java 环境正常
echo.

echo 检查 Android 项目...
if not exist "android" (
    echo [错误] 未找到 android 目录
    echo 请先运行: npx cap add android
    echo.
    pause
    exit /b 1
)

echo [成功] Android 项目存在
echo.

echo 构建项目...
call npm run build
if %errorlevel% neq 0 (
    echo [错误] 项目构建失败
    pause
    exit /b 1
)

echo [成功] 项目构建完成
echo.

echo 同步 Capacitor...
call npx cap sync
if %errorlevel% neq 0 (
    echo [错误] Capacitor 同步失败
    pause
    exit /b 1
)

echo [成功] Capacitor 同步完成
echo.

echo 选择打包类型:
echo 1. Debug APK（调试版本，可以直接安装）
echo 2. Release APK（发布版本，需要签名）
echo.
set /p choice=请选择 (1 或 2):

if "%choice%"=="1" (
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
) else if "%choice%"=="2" (
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

echo.
pause
