// 数据库初始化、连接管理和统一导出

import * as SQLite from 'expo-sqlite';
import { CREATE_TABLES, CREATE_INDEXES, UserSettings } from './schema';

// 数据库名称
const DB_NAME = 'topmind.db';

// 获取数据库连接
const getDB = async () => {
  const db = await SQLite.openDatabaseAsync(DB_NAME);
  return db;
};

// 初始化数据库
export const initDatabase = async () => {
  try {
    const db = await getDB();
    
    // 开启事务执行创建表和索引
    await db.execAsync('BEGIN TRANSACTION;');
    
    // 创建所有表
    for (const createTableSql of CREATE_TABLES) {
      await db.execAsync(createTableSql);
    }
    
    // 创建所有索引
    for (const createIndexSql of CREATE_INDEXES) {
      await db.execAsync(createIndexSql);
    }
    
    // 检查并插入默认用户设置
    const userSettings = await db.getFirstAsync<UserSettings | null>(
      'SELECT * FROM user_settings WHERE id = 1;'
    );
    
    if (!userSettings) {
      const now = Date.now();
      await db.runAsync(
        'INSERT INTO user_settings (id, username, themeColor, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?);',
        1, '用户', '#4A90E2', now, now
      );
    }
    
    await db.execAsync('COMMIT;');
    console.log('数据库初始化成功');
    return true;
  } catch (error) {
    console.error('数据库初始化失败:', error);
    // 回滚事务
    const db = await getDB();
    await db.execAsync('ROLLBACK;');
    return false;
  }
};

// 导出数据库连接方法
export { getDB };

// 类型定义导出
export type { UserSettings, Task, FocusSession, Plan, TopMindItem } from './schema';

// 用户设置相关操作导出
export * from './userSettings';

// 代办任务相关操作导出
export * from './tasks';

// 专注会话相关操作导出
export * from './focusSessions';

// 计划任务相关操作导出
export * from './plan';

// 首要事项相关操作导出
export * from './topMinditems';
