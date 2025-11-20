import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import TopMindUI from "@/components/TopMind";

interface TopMindItem {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
}

export default function TopScreen() {
  // 数据状态保留在页面组件中
  const [topMindItems, setTopMindItems] = useState<TopMindItem[]>([
    // 添加一些示例数据
    {
      id: "1",
      title: "完成项目提案",
      description: "为客户准备详细的项目提案文档，包括时间线和预算估算。",
      createdAt: new Date(),
    },
    {
      id: "2",
      title: "健身计划",
      description: "每周进行3次有氧运动和2次力量训练，保持健康生活方式。",
      createdAt: new Date(),
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TopMindItem | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  // 函数逻辑保留在页面组件中
  const handleAddItem = () => {
    if (newTitle.trim()) {
      const newItem: TopMindItem = {
        id: Date.now().toString(),
        title: newTitle,
        description: newDescription,
        createdAt: new Date(),
      };

      setTopMindItems([newItem, ...topMindItems]);
      setNewTitle("");
      setNewDescription("");
      setShowAddModal(false);
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

  const handleDeleteItem = () => {
    if (selectedItem) {
      const updatedItems = topMindItems.filter(
        (item) => item.id !== selectedItem.id
      );
      setTopMindItems(updatedItems);
      
      // 关闭弹窗
      setShowDeleteConfirm(false);
      setShowDetailModal(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
