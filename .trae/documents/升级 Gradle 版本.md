# 升级 Gradle 版本

## 问题分析
Android Gradle Plugin 8.7.3 需要的最低 Gradle 版本是 8.9，但当前使用的是 8.5。

## 解决方案
将 Gradle 版本从 8.5 升级到 8.9。

## 执行步骤
1. 更新 gradle-wrapper.properties 中的 Gradle 版本
2. 提交并推送更改