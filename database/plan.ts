// 数据库/plan.ts
// 计划任务相关操作

import { getDB } from './index';
import { Plan } from './schema';

// 获取所有计划
export const getAllPlans = async (): Promise<Plan[]> => {
  try {
    const db = await getDB();
    const plans = await db.getAllAsync<Plan>(
      'SELECT * FROM plans ORDER BY dueDate ASC;' 
    );
    return plans.map((plan) => ({
      ...plan,
      isCompleted: Boolean(plan.isCompleted),
    }));
  } catch (error) {
    console.error('获取所有计划失败:', error);
    return [];
  }
};

// 根据日期获取计划
export const getPlansByDate = async (date: number): Promise<Plan[]> => {
  try {
    const db = await getDB();
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    const plans = await db.getAllAsync<Plan>(
      'SELECT * FROM plans WHERE dueDate >= ? AND dueDate <= ? ORDER BY dueDate ASC;',
      startOfDay.getTime(), endOfDay.getTime()
    );
    return plans.map(plan => ({
      ...plan,
      isCompleted: Boolean(plan.isCompleted)
    }));
  } catch (error) {
    console.error('根据日期获取计划失败:', error);
    return [];
  }
};

// 添加计划
export const addPlan = async (
  title: string, 
  description: string, 
  dueDate: number
): Promise<number | null> => {
  try {
    const db = await getDB();
    const now = Date.now();
    const result = await db.runAsync(
      'INSERT INTO plans (title, description, dueDate, isCompleted, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?);',
      title, description, dueDate, 0, now, now
    );
    return result.lastInsertRowId;
  } catch (error) {
    console.error('添加计划失败:', error);
    return null;
  }
};

// 更新计划
export const updatePlan = async (
  id: number, 
  title: string, 
  description: string, 
  dueDate: number
): Promise<boolean> => {
  try {
    const db = await getDB();
    const now = Date.now();
    await db.runAsync(
      'UPDATE plans SET title = ?, description = ?, dueDate = ?, updatedAt = ? WHERE id = ?;',
      title, description, dueDate, now, id
    );
    return true;
  } catch (error) {
    console.error('更新计划失败:', error);
    return false;
  }
};

// 标记计划为已完成
export const markPlanAsCompleted = async (id: number): Promise<boolean> => {
  try {
    const db = await getDB();
    const now = Date.now();
    await db.runAsync(
      'UPDATE plans SET isCompleted = 1, updatedAt = ? WHERE id = ?;',
      now, id
    );
    return true;
  } catch (error) {
    console.error('标记计划为已完成失败:', error);
    return false;
  }
};

// 删除计划
export const deletePlan = async (id: number): Promise<boolean> => {
  try {
    const db = await getDB();
    await db.runAsync('DELETE FROM plans WHERE id = ?;', id);
    return true;
  } catch (error) {
    console.error('删除计划失败:', error);
    return false;
  }
};

// 获取所有未完成的计划
export const getPendingPlans = async (): Promise<Plan[]> => {
  try {
    const db = await getDB();
    const plans = await db.getAllAsync<Plan>(
      'SELECT * FROM plans WHERE isCompleted = 0 ORDER BY dueDate ASC;' 
    );
    return plans.map((plan) => ({
      ...plan,
      isCompleted: Boolean(plan.isCompleted),
    }));
  } catch (error) {
    console.error('获取未完成计划失败:', error);
    return [];
  }
};