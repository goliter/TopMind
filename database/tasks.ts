// 数据库/tasks.ts
// 代办任务相关操作

import { getDB } from './index';
import { Task } from './schema';

// 获取所有未删除的任务
export const getAllActiveTasks = async (): Promise<Task[]> => {
  try {
    const db = await getDB();
    const tasks = await db.getAllAsync<Task>(
      'SELECT * FROM tasks WHERE isDeleted = 0 ORDER BY createdAt DESC;'
    );
    return tasks.map(task => ({
      ...task,
      isDeleted: Boolean(task.isDeleted)
    }));
  } catch (error) {
    console.error('获取所有任务失败:', error);
    return [];
  }
};

// 根据ID获取任务
export const getTaskById = async (id: number): Promise<Task | null> => {
  try {
    const db = await getDB();
    const task = await db.getFirstAsync<Task>(
      'SELECT * FROM tasks WHERE id = ?;',
      id
    );
    return task ? {
      ...task,
      isDeleted: Boolean(task.isDeleted)
    } : null;
  } catch (error) {
    console.error('根据ID获取任务失败:', error);
    return null;
  }
};

// 添加任务
export const addTask = async (title: string, description: string): Promise<number | null> => {
  try {
    const db = await getDB();
    const now = Date.now();
    const result = await db.runAsync(
      'INSERT INTO tasks (title, description, isDeleted, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?);',
      title, description, 0, now, now
    );
    return result.lastInsertRowId;
  } catch (error) {
    console.error('添加任务失败:', error);
    return null;
  }
};

// 更新任务
export const updateTask = async (id: number, title: string, description: string): Promise<boolean> => {
  try {
    const db = await getDB();
    const now = Date.now();
    await db.runAsync(
      'UPDATE tasks SET title = ?, description = ?, updatedAt = ? WHERE id = ? AND isDeleted = 0;',
      title, description, now, id
    );
    return true;
  } catch (error) {
    console.error('更新任务失败:', error);
    return false;
  }
};

// 删除任务（软删除）
export const deleteTask = async (id: number): Promise<boolean> => {
  try {
    const db = await getDB();
    const now = Date.now();
    await db.runAsync(
      'UPDATE tasks SET isDeleted = 1, updatedAt = ? WHERE id = ?;',
      now, id
    );
    return true;
  } catch (error) {
    console.error('删除任务失败:', error);
    return false;
  }
};

// 获取任务总数
export const getTaskCount = async (): Promise<number> => {
  try {
    const db = await getDB();
    const result = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM tasks WHERE isDeleted = 0;'
    );
    return result?.count || 0;
  } catch (error) {
    console.error('获取任务总数失败:', error);
    return 0;
  }
};