# TopMind

TopMind 是一款专注于提高工作效率和时间管理的移动应用，帮助用户管理任务、记录专注时间并分析工作表现。

## 🚀 功能特点

### 核心功能

- **专注任务管理**：创建、编辑和删除专注任务，设置任务描述
- **专注会话记录**：开始专注计时，自动保存专注数据到本地数据库
- **统计分析**：通过图表直观展示今日专注分布和近 30 天专注趋势
- **主题定制**：支持多种颜色主题，适应不同用户喜好
- **计划管理**：创建和跟踪长期计划，设置截止日期
- **首要事项**：标记和管理最重要的工作事项

### 用户体验

- 简洁直观的界面设计
- 流畅的导航体验
- 实时数据更新
- 响应式布局，适配各种屏幕尺寸

## 🛠️ 技术栈

### 前端框架

- **Expo** - 跨平台移动应用开发框架
- **React Native** - 原生移动应用开发
- **TypeScript** - 类型安全的 JavaScript 超集

### 导航与路由

- **expo-router** - 文件系统路由
- **React Navigation** - 应用内导航管理

### 数据库

- **expo-sqlite** - 本地 SQLite 数据库，用于持久化存储用户数据

### UI 组件与图表

- **React Native SVG** - 矢量图形支持
- **react-native-chart-kit** - 数据可视化图表库
- **@expo/vector-icons** - 图标库

### 状态管理

- **React Hooks** - useState, useEffect, useRef 等
- **自定义 Hooks** - 封装常用功能逻辑

## 📁 项目结构

```
TopMind/
├── app/
│   ├── (tabs)/               # 底部标签导航页面
│   │   ├── focus.tsx         # 专注任务页面
│   │   ├── plan.tsx          # 计划管理页面
│   │   ├── top.tsx           # 首要事项页面
│   │   ├── performance.tsx   # 表现统计页面
│   │   ├── profile.tsx       # 用户设置页面
│   │   └── _layout.tsx       # 标签页布局
│   ├── FocusDetailScreen.tsx # 专注详情页面
│   ├── _layout.tsx           # 应用根布局
│   └── index.tsx             # 应用入口
├── components/               # 可复用组件
│   ├── FocusPieChart.tsx     # 专注分布饼图
│   ├── FocusTrendChart.tsx   # 专注趋势图表
│   ├── Calendar.tsx          # 日历组件
│   └── ConfirmModal.tsx      # 确认模态框
├── constants/                # 常量定义
│   └── theme.ts              # 主题颜色配置
├── database/                 # 数据库相关
│   ├── index.ts              # 数据库初始化
│   ├── schema.ts             # 数据库表结构
│   ├── focusSessions.ts      # 专注会话数据操作
│   ├── tasks.ts              # 任务数据操作
│   ├── plans.ts              # 计划数据操作
│   ├── topMinditems.ts       # 首要事项数据操作
│   └── userSettings.ts       # 用户设置数据操作
├── hooks/                    # 自定义Hooks
│   ├── use-app-theme.ts      # 应用主题Hook
│   └── use-color-scheme.ts   # 颜色方案Hook
├── assets/                   # 静态资源
│   └── images/               # 图片资源
└── package.json              # 项目配置和依赖
```

## 🗄️ 数据库设计

### 主要表结构

1. **用户设置表 (user_settings)**

   - id: 主键 (固定为 1)
   - username: 用户称呼
   - themeColor: 主题颜色
   - createdAt: 创建时间戳
   - updatedAt: 更新时间戳

2. **代办任务表 (tasks)**

   - id: 主键
   - title: 任务名称
   - description: 任务描述
   - isDeleted: 是否删除
   - createdAt: 创建时间戳
   - updatedAt: 更新时间戳

3. **专注会话表 (focus_sessions)**

   - id: 主键
   - taskId: 关联的任务 ID
   - taskTitle: 任务名称(冗余存储)
   - duration: 专注时长(分钟)
   - startTime: 开始时间戳
   - endTime: 结束时间戳
   - date: 日期字符串(YYYY-MM-DD)

4. **计划任务表 (plans)**

   - id: 主键
   - title: 计划名称
   - description: 计划描述
   - dueDate: 截止时间戳
   - isCompleted: 是否完成
   - createdAt: 创建时间戳
   - updatedAt: 更新时间戳

5. **首要事项表 (top_mind_items)**
   - id: 主键
   - title: 事项名称
   - description: 事项描述
   - createdAt: 创建时间戳
   - updatedAt: 更新时间戳

## 🎨 主题系统

### 主题颜色

应用支持多种主题颜色：

- 蓝色 (#4A90E2)
- 绿色 (#20B2AA)
- 紫色 (#9370DB)
- 粉色 (#FF69B4)
- 橙色 (#FF8C00)
- 红色 (#FF4444)
- 黄色 (#FFD700)
- 灰色 (#808080)

### 深色/浅色模式

自动适应系统深色/浅色模式，提供一致的用户体验。

## 📱 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npx expo start
```

### 运行应用

在输出中，您可以选择以下方式打开应用：

- **开发构建**：使用自定义开发构建运行
- **Android 模拟器**：在 Android Studio 模拟器中运行
- **iOS 模拟器**：在 Xcode 模拟器中运行
- **Expo Go**：使用 Expo Go 应用扫描二维码体验

## 📝 使用指南

### 1. 管理专注任务

- 在专注页面创建新任务
- 编辑现有任务的标题和描述
- 删除不需要的任务

### 2. 开始专注

- 选择一个任务，点击"开始专注"
- 专注详情页面会自动开始计时
- 可以暂停/继续计时
- 完成后点击结束，数据会自动保存

### 3. 查看统计数据

- 切换到表现页面
- 查看今日专注分布饼图
- 浏览近 30 天专注趋势

### 4. 个性化设置

- 切换到个人页面
- 选择喜欢的主题颜色
- 编辑用户称呼

## 🔧 开发说明

### 代码规范

- 使用 TypeScript 确保类型安全
- 遵循 React 最佳实践
- 使用 ESLint 进行代码检查

### 自定义 Hooks

- `use-app-theme`：封装主题相关逻辑
- `use-color-scheme`：处理深色/浅色模式

### 数据库操作

所有数据库操作都封装在`database/`目录下，提供了完整的 CRUD 接口。

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来帮助改进 TopMind！

## 📧 联系方式

如有问题或建议，请通过以下方式联系：

- Email: goliterwzh@outlook.com
- GitHub Issues: https://github.com/goliter/TopMind/issues
