// 数据库/focusSessions.ts
// 专注会话相关操作

import { getDB } from './index';
import { FocusSession } from './schema';

// 添加专注会话
export const addFocusSession = async (
  taskId: number, 
  taskTitle: string, 
  duration: number, 
  startTime: number, 
  endTime: number
): Promise<number | null> => {
  try {
    const db = await getDB();
    const date = new Date(startTime).toISOString().split('T')[0];
    const result = await db.runAsync(
      'INSERT INTO focus_sessions (taskId, taskTitle, duration, startTime, endTime, date) VALUES (?, ?, ?, ?, ?, ?);',
      taskId, taskTitle, duration, startTime, endTime, date
    );
    return result.lastInsertRowId;
  } catch (error) {
    console.error('添加专注会话失败:', error);
    return null;
  }
};

// 获取指定日期的专注会话
export const getFocusSessionsByDate = async (date: string): Promise<FocusSession[]> => {
  try {
    const db = await getDB();
    return await db.getAllAsync<FocusSession>(
      'SELECT * FROM focus_sessions WHERE date = ? ORDER BY startTime ASC;',
      date
    );
  } catch (error) {
    console.error('获取指定日期的专注会话失败:', error);
    return [];
  }
};

// 获取指定任务的专注会话
export const getFocusSessionsByTaskId = async (taskId: number): Promise<FocusSession[]> => {
  try {
    const db = await getDB();
    return await db.getAllAsync<FocusSession>(
      'SELECT * FROM focus_sessions WHERE taskId = ? ORDER BY startTime DESC;',
      taskId
    );
  } catch (error) {
    console.error('获取指定任务的专注会话失败:', error);
    return [];
  }
};

// 获取指定日期范围的专注会话
export const getFocusSessionsByDateRange = async (startDate: string, endDate: string): Promise<FocusSession[]> => {
  try {
    const db = await getDB();
    return await db.getAllAsync<FocusSession>(
      'SELECT * FROM focus_sessions WHERE date >= ? AND date <= ? ORDER BY date ASC, startTime ASC;',
      startDate, endDate
    );
  } catch (error) {
    console.error('获取指定日期范围的专注会话失败:', error);
    return [];
  }
};

// 获取每日专注时长统计
export const getDailyFocusStats = async (startDate: string, endDate: string): Promise<{date: string, totalDuration: number}[]> => {
  try {
    const db = await getDB();
    return await db.getAllAsync<{date: string, totalDuration: number}>(
      'SELECT date, SUM(duration) as totalDuration FROM focus_sessions WHERE date >= ? AND date <= ? GROUP BY date ORDER BY date ASC;',
      startDate, endDate
    );
  } catch (error) {
    console.error('获取每日专注时长统计失败:', error);
    return [];
  }
};

// 获取总专注时长
export const getTotalFocusDuration = async (): Promise<number> => {
  try {
    const db = await getDB();
    const result = await db.getFirstAsync<{ total: number }>(
      'SELECT SUM(duration) as total FROM focus_sessions;'
    );
    return result?.total || 0;
  } catch (error) {
    console.error('获取总专注时长失败:', error);
    return 0;
  }
};