// 数据库/userSettings.ts
// 用户设置相关操作

import { getDB } from './index';
import { UserSettings } from './schema';

// 获取用户设置
export const getUserSettings = async (): Promise<UserSettings | null> => {
  try {
    const db = await getDB();
    return await db.getFirstAsync<UserSettings>(
      'SELECT * FROM user_settings WHERE id = 1;'
    );
  } catch (error) {
    console.error('获取用户设置失败:', error);
    return null;
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