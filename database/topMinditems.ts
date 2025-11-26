// 数据库/topMinditems.ts
// 首要事项相关操作

import { getDB } from './index';
import { TopMindItem } from './schema';

// 获取所有首要事项
export const getAllTopMindItems = async (): Promise<TopMindItem[]> => {
  try {
    const db = await getDB();
    return await db.getAllAsync<TopMindItem>(
      'SELECT * FROM top_mind_items ORDER BY createdAt DESC;'
    );
  } catch (error) {
    console.error('获取所有首要事项失败:', error);
    return [];
  }
};

// 根据ID获取首要事项
export const getTopMindItemById = async (id: number): Promise<TopMindItem | null> => {
  try {
    const db = await getDB();
    return await db.getFirstAsync<TopMindItem>(
      'SELECT * FROM top_mind_items WHERE id = ?;',
      id
    );
  } catch (error) {
    console.error('根据ID获取首要事项失败:', error);
    return null;
  }
};

// 添加首要事项
export const addTopMindItem = async (
  title: string, 
  description: string
): Promise<number | null> => {
  try {
    const db = await getDB();
    const now = Date.now();
    const result = await db.runAsync(
      'INSERT INTO top_mind_items (title, description, createdAt, updatedAt) VALUES (?, ?, ?, ?);',
      title, description, now, now
    );
    return result.lastInsertRowId;
  } catch (error) {
    console.error('添加首要事项失败:', error);
    return null;
  }
};

// 更新首要事项
export const updateTopMindItem = async (
  id: number, 
  title: string, 
  description: string
): Promise<boolean> => {
  try {
    const db = await getDB();
    const now = Date.now();
    await db.runAsync(
      'UPDATE top_mind_items SET title = ?, description = ?, updatedAt = ? WHERE id = ?;',
      title, description, now, id
    );
    return true;
  } catch (error) {
    console.error('更新首要事项失败:', error);
    return false;
  }
};

// 删除首要事项
export const deleteTopMindItem = async (id: number): Promise<boolean> => {
  try {
    const db = await getDB();
    await db.runAsync('DELETE FROM top_mind_items WHERE id = ?;', id);
    return true;
  } catch (error) {
    console.error('删除首要事项失败:', error);
    return false;
  }
};

// 获取首要事项总数
export const getTopMindItemCount = async (): Promise<number> => {
  try {
    const db = await getDB();
    const result = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM top_mind_items;'
    );
    return result?.count || 0;
  } catch (error) {
    console.error('获取首要事项总数失败:', error);
    return 0;
  }
};