// 定义数据库表结构和SQL创建语句

// 用户设置表接口
export interface UserSettings {
  id: number;             // 主键，固定为1（单用户应用）
  username: string;       // 用户称呼
  themeColor: string;     // 主题颜色
  createdAt: number;      // 创建时间戳
  updatedAt: number;      // 更新时间戳
}

// 代办任务表接口
export interface Task {
  id: number;             // 主键
  title: string;          // 任务名称
  description: string;    // 任务描述
  isDeleted: boolean;     // 是否删除
  createdAt: number;      // 创建时间戳
  updatedAt: number;      // 更新时间戳
}

// 专注会话表接口
export interface FocusSession {
  id: number;             // 主键
  taskId: number;         // 关联的任务ID
  taskTitle: string;      // 冗余存储任务名称（即使任务被删除也能显示）
  duration: number;       // 专注时长（分钟）
  startTime: number;      // 开始时间戳
  endTime: number;        // 结束时间戳
  date: string;           // 日期字符串（YYYY-MM-DD格式，方便按天查询）
}

// 计划任务表接口
export interface Plan {
  id: number;             // 主键
  title: string;          // 计划名称
  description: string;    // 计划描述
  dueDate: number;        // 完成时间戳
  isCompleted: boolean;   // 是否完成
  createdAt: number;      // 创建时间戳
  updatedAt: number;      // 更新时间戳
}

// 首要事项表接口
export interface TopMindItem {
  id: number;             // 主键
  title: string;          // 事项名称
  description: string;    // 事项描述
  createdAt: number;      // 创建时间戳
  updatedAt: number;      // 更新时间戳
}

// 数据库创建语句
export const CREATE_TABLES = [
  // 用户设置表
  `
  CREATE TABLE IF NOT EXISTS user_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    username TEXT NOT NULL,
    themeColor TEXT NOT NULL,
    createdAt INTEGER NOT NULL,
    updatedAt INTEGER NOT NULL,
    CHECK (id = 1)
  );
  `,
  // 代办任务表
  `
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    isDeleted INTEGER NOT NULL DEFAULT 0,
    createdAt INTEGER NOT NULL,
    updatedAt INTEGER NOT NULL
  );
  `,
  // 专注会话表
  `
  CREATE TABLE IF NOT EXISTS focus_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    taskId INTEGER NOT NULL,
    taskTitle TEXT NOT NULL,
    duration INTEGER NOT NULL,
    startTime INTEGER NOT NULL,
    endTime INTEGER NOT NULL,
    date TEXT NOT NULL
  );
  `,
  // 计划任务表
  `
  CREATE TABLE IF NOT EXISTS plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    dueDate INTEGER NOT NULL,
    isCompleted INTEGER NOT NULL DEFAULT 0,
    createdAt INTEGER NOT NULL,
    updatedAt INTEGER NOT NULL
  );
  `,
  // 首要事项表
  `
  CREATE TABLE IF NOT EXISTS top_mind_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    createdAt INTEGER NOT NULL,
    updatedAt INTEGER NOT NULL
  );
  `,
];

// 索引创建语句
export const CREATE_INDEXES = [
  // 专注会话表索引（按日期查询）
  `CREATE INDEX IF NOT EXISTS idx_focus_sessions_date ON focus_sessions(date);`,
  // 专注会话表索引（按任务ID查询）
  `CREATE INDEX IF NOT EXISTS idx_focus_sessions_task_id ON focus_sessions(taskId);`,
  // 计划任务表索引（按截止日期查询）
  `CREATE INDEX IF NOT EXISTS idx_plans_due_date ON plans(dueDate);`,
];