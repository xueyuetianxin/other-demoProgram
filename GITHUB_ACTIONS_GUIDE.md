# 使用 GitHub Actions 自动打包 - 完整操作指南

## 第一步：安装 Git

### 1. 下载 Git
访问 https://git-scm.com/download/win

### 2. 安装 Git
1. 双击下载的安装包
2. 点击 "Next" 按默认设置安装
3. 安装完成后，打开新的终端窗口

### 3. 验证安装
在终端中输入：
```bash
git --version
```
如果显示 Git 版本，说明安装成功。

## 第二步：配置 Git

### 1. 配置用户名
```bash
git config --global user.name "Your Name"
```

### 2. 配置邮箱
```bash
git config --global user.email "your.email@example.com"
```

## 第三步：创建 GitHub 账号

1. 访问 https://github.com/signup
2. 注册一个免费的 GitHub 账号
3. 登录你的 GitHub 账号

## 第四步：创建 GitHub 仓库

1. 访问 https://github.com/new
2. 填写仓库信息：
   - **Repository name**：`rental-management`
   - **Description**：`租赁管理系统`
   - **Public/Private**：选择 `Private`（私有）或 `Public`（公开）
3. 点击 **Create repository** 按钮
4. 复制仓库的 URL，例如：`https://github.com/YOUR_USERNAME/rental-management.git`

## 第五步：初始化 Git 仓库

在项目目录（`d:\study\租赁`）中打开终端，执行以下命令：

```bash
# 进入项目目录
cd d:\study\租赁

# 初始化 Git 仓库
git init

# 添加所有文件到暂存区
git add .

# 提交文件
git commit -m "Initial commit: 租赁管理系统"
```

## 第六步：连接到 GitHub 仓库

```bash
# 添加远程仓库（替换 YOUR_USERNAME 为你的 GitHub 用户名）
git remote add origin https://github.com/YOUR_USERNAME/rental-management.git

# 推送代码到 GitHub
git push -u origin main
```

如果遇到认证问题，使用 Personal Access Token：

1. 访问 https://github.com/settings/tokens
2. 点击 **Generate new token** → **Generate new token (classic)**
3. 设置 token 名称和权限（勾选 `repo`）
4. 点击 **Generate token**
5. 复制生成的 token
6. 推送时使用 token 作为密码：
```bash
git push -u origin main
# 用户名：YOUR_USERNAME
# 密码：YOUR_TOKEN
```

## 第七步：查看 GitHub Actions 工作流

1. 访问你的 GitHub 仓库页面
2. 点击 **Actions** 标签页
3. 你会看到两个工作流：
   - **Build Android APK**
   - **Build iOS IPA**

## 第八步：自动触发打包

当你推送代码到 GitHub 时，GitHub Actions 会自动运行：

```bash
# 修改代码后，提交并推送
git add .
git commit -m "Update app"
git push
```

## 第九步：手动触发打包

如果你不想推送代码，可以手动触发：

1. 访问你的 GitHub 仓库
2. 点击 **Actions** 标签页
3. 选择工作流：
   - **Build Android APK** 或
   - **Build iOS IPA**
4. 点击 **Run workflow** 按钮
5. 选择分支（通常是 `main`）
6. 点击 **Run workflow** 确认

## 第十步：下载构建产物

1. 访问你的 GitHub 仓库
2. 点击 **Actions** 标签页
3. 点击最近的工作流运行
4. 滚动到页面底部，找到 **Artifacts** 部分
5. 点击下载你需要的文件：
   - **debug-apk**：Android Debug APK
   - **release-apk**：Android Release APK
   - **ios-ipa**：iOS IPA 文件

## 第十一步：安装应用

### Android APK

1. 将 APK 文件传输到 Android 设备
2. 在设备上启用"未知来源"安装
3. 点击 APK 文件进行安装

### iOS IPA

1. 将 IPA 文件传输到 iOS 设备
2. 使用工具安装（如 AltStore、Cydia Impactor 等）
3. 或使用 Xcode 安装到设备

## 常见问题

### 1. Git 命令无法识别

**问题**：`git : 无法将"git"项识别为 cmdlet、函数、脚本文件或可运行程序的名称`

**解决**：
1. 确认 Git 已正确安装
2. 关闭所有终端窗口
3. 打开新的终端窗口
4. 再次尝试运行 git 命令

### 2. 推送失败

**问题**：推送代码时出现认证错误

**解决**：
1. 使用 Personal Access Token
2. 访问 https://github.com/settings/tokens
3. 生成新的 token
4. 使用 token 作为密码

### 3. 构建失败

**问题**：GitHub Actions 构建失败

**解决**：
1. 访问 Actions 页面
2. 点击失败的工作流运行
3. 查看红色错误步骤的日志
4. 修复问题后重新推送代码

### 4. 下载产物过期

**问题**：GitHub Actions 的构建产物已过期

**解决**：
1. 重新触发工作流
2. 下载新的构建产物

## 完整示例

假设你的 GitHub 用户名是 `yourusername`，完整操作如下：

```bash
# 1. 安装 Git（访问 https://git-scm.com/download/win）

# 2. 配置 Git
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 3. 进入项目目录
cd d:\study\租赁

# 4. 初始化 Git 仓库
git init

# 5. 添加所有文件
git add .

# 6. 提交文件
git commit -m "Initial commit: 租赁管理系统"

# 7. 添加远程仓库
git remote add origin https://github.com/yourusername/rental-management.git

# 8. 推送代码到 GitHub
git push -u origin main

# 9. 访问 https://github.com/yourusername/rental-management/actions

# 10. 等待 GitHub Actions 自动运行

# 11. 下载构建产物
# 在 Artifacts 部分下载 APK 或 IPA 文件
```

## 优势总结

使用 GitHub Actions 自动打包的优势：

✅ **无需本地环境**：不需要安装 JDK、Android Studio、Xcode
✅ **自动化构建**：推送代码自动触发构建
✅ **跨平台支持**：同时构建 Android 和 iOS
✅ **云端构建**：不占用本地资源
✅ **历史记录**：保留所有构建历史
✅ **团队协作**：团队成员都可以下载构建产物

## 下一步

完成以上步骤后，你就可以：

1. 修改代码
2. 推送到 GitHub
3. 等待自动构建
4. 下载 APK 或 IPA 文件
5. 安装到设备测试

如果你在操作过程中遇到任何问题，请告诉我，我会帮你解决！
