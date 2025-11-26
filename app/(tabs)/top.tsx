import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Alert } from "react-native";
import TopMindUI from "@/components/TopMind";

import {
  getAllTopMindItems,
  addTopMindItem,
  deleteTopMindItem
} from "../../database/topMinditems";

// 定义组件所需的类型，与TopMindUI组件保持一致
interface TopMindItem {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
}

export default function TopScreen() {
  // 数据状态保留在页面组件中，使用组件所需的类型
  const [topMindItems, setTopMindItems] = useState<TopMindItem[]>([]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TopMindItem | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  // 从数据库加载数据
  useEffect(() => {
    loadTopMindItems();
  }, []);

  const loadTopMindItems = async () => {
    try {
      const items = await getAllTopMindItems();
      // 将数据库返回的数据转换为组件所需的格式
      const formattedItems: TopMindItem[] = items.map(item => ({
        // 将id转换为string类型
        id: item.id.toString(),
        title: item.title,
        description: item.description,
        // 将时间戳转换为Date对象
        createdAt: new Date(item.createdAt),
      }));
      setTopMindItems(formattedItems);
    } catch (error) {
      console.error("加载首要事项失败:", error);
      Alert.alert("错误", "加载首要事项失败，请重试");
    }
  };

  // 函数逻辑保留在页面组件中
  const handleAddItem = async () => {
    if (newTitle.trim()) {
      try {
        const id = await addTopMindItem(newTitle, newDescription);
        if (id) {
          // 重新加载数据以确保准确性
          await loadTopMindItems();
          setNewTitle("");
          setNewDescription("");
          setShowAddModal(false);
          Alert.alert("成功", "首要事项已添加");
        } else {
          Alert.alert("错误", "添加首要事项失败，请重试");
        }
      } catch (error) {
        console.error("添加首要事项失败:", error);
        Alert.alert("错误", "添加首要事项失败，请重试");
      }
    }
  };

  const handleItemPress = (item: TopMindItem) => {
    setSelectedItem(item);
    setShowDetailModal(true);
  };

  const handleCancelAdd = () => {
    setShowAddModal(false);
    setNewTitle("");
    setNewDescription("");
  };

  const handleShowDeleteConfirm = (visible: boolean) => {
    setShowDeleteConfirm(visible);
  };

  const handleDeleteItem = async () => {
    if (selectedItem) {
      try {
        // 将string类型的id转换为number类型，以匹配数据库函数的参数要求
        const id = parseInt(selectedItem.id, 10);
        const success = await deleteTopMindItem(id);
        if (success) {
          // 重新加载数据以确保准确性
          await loadTopMindItems();
          
          // 关闭弹窗
          setShowDeleteConfirm(false);
          setShowDetailModal(false);
          Alert.alert("成功", "首要事项已删除");
        } else {
          Alert.alert("错误", "删除首要事项失败，请重试");
        }
      } catch (error) {
        console.error("删除首要事项失败:", error);
        Alert.alert("错误", "删除首要事项失败，请重试");
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["right", "left", "top"]}>
      <TopMindUI
        topMindItems={topMindItems}
        showAddModal={showAddModal}
        showDetailModal={showDetailModal}
        showDeleteConfirm={showDeleteConfirm}
        selectedItem={selectedItem}
        newTitle={newTitle}
        newDescription={newDescription}
        onAddItem={handleAddItem}
        onItemPress={handleItemPress}
        onDeleteItem={handleDeleteItem}
        onShowAddModal={setShowAddModal}
        onShowDetailModal={setShowDetailModal}
        onShowDeleteConfirm={handleShowDeleteConfirm}
        onSetNewTitle={setNewTitle}
        onSetNewDescription={setNewDescription}
        onCancelAdd={handleCancelAdd}
      />
    </SafeAreaView>
  );
}