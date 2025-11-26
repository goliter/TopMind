// 数据库/userSettings.ts
// 用户设置相关操作

import { getDB } from './index';
import { UserSettings } from './schema';

// 获取用户设置
export const getUserSettings = async (): Promise<UserSettings | null> => {
  try {
    const db = await getDB();
    // 使用更简单的方法来查询数据
    const result = await db.getAllAsync<UserSettings>(
      'SELECT * FROM user_settings WHERE id = 1;'
    );
    // 如果查询结果为空数组，返回null，否则返回第一个元素
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('获取用户设置失败:', error);
    // 如果数据库查询失败，返回默认的用户设置
    return {
      id: 1,
      username: '用户',
      themeColor: 'blue',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
  }
};

// 更新用户名
export const updateUsername = async (username: string): Promise<boolean> => {
  try {
    const db = await getDB();
    const now = Date.now();
    await db.runAsync(
      'UPDATE user_settings SET username = ?, updatedAt = ? WHERE id = 1;',
      username, now
    );
    return true;
  } catch (error) {
    console.error('更新用户名失败:', error);
    return false;
  }
};

// 更新主题颜色
export const updateThemeColor = async (themeColor: string): Promise<boolean> => {
  try {
    const db = await getDB();
    const now = Date.now();
    await db.runAsync(
      'UPDATE user_settings SET themeColor = ?, updatedAt = ? WHERE id = 1;',
      themeColor, now
    );
    return true;
  } catch (error) {
    console.error('更新主题颜色失败:', error);
    return false;
  }
};

// 更新用户设置（批量更新）
export const updateUserSettings = async (settings: Partial<UserSettings>): Promise<boolean> => {
  try {
    const db = await getDB();
    const now = Date.now();
    
    const updates: string[] = [];
    const params: any[] = [];
    
    if (settings.username !== undefined) {
      updates.push('username = ?');
      params.push(settings.username);
    }
    
    if (settings.themeColor !== undefined) {
      updates.push('themeColor = ?');
      params.push(settings.themeColor);
    }
    
    updates.push('updatedAt = ?');
    params.push(now);
    params.push(1);
    
    await db.runAsync(
      `UPDATE user_settings SET ${updates.join(', ')} WHERE id = ?;`,
      ...params
    );
    
    return true;
  } catch (error) {
    console.error('更新用户设置失败:', error);
    return false;
  }
};