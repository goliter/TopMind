import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ConfirmModal from "@/components/ConfirmModal";
import { getUserSettings, updateThemeColor, updateUsername } from "@/database/userSettings";
import { deleteAllRecords } from "@/database";

// 主题颜色选项
const colorOptions = [
  { id: "blue", name: "蓝色", color: "#4A90E2" },
  { id: "green", name: "绿色", color: "#20B2AA" },
  { id: "purple", name: "紫色", color: "#9370DB" },
  { id: "pink", name: "粉色", color: "#FF69B4" },
  { id: "orange", name: "橙色", color: "#FF8C00" },
  { id: "red", name: "红色", color: "#FF4444" },
  { id: "yellow", name: "黄色", color: "#FFD700" },
  { id: "gray", name: "灰色", color: "#808080" },
];

export default function ProfileScreen() {
  // 用户信息状态
  const [username, setUsername] = useState("用户");
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  
  // 主题颜色状态
  const [themeColor, setThemeColor] = useState("blue");
  
  // 加载状态
  const [isLoading, setIsLoading] = useState(false);
  
  // 模态框状态
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  
  // 加载用户设置
  useEffect(() => {
    const loadUserSettings = async () => {
      setIsLoading(true);
      try {
        console.log('开始加载用户设置');
        const settings = await getUserSettings();
        console.log('获取到的用户设置:', settings);
        if (settings) {
          setUsername(settings.username);
          setThemeColor(settings.themeColor);
          console.log('更新状态后的username:', settings.username);
          console.log('更新状态后的themeColor:', settings.themeColor);
        } else {
          console.log('未获取到用户设置，使用默认值');
        }
      } catch (error) {
        console.error('加载用户设置失败:', error);
        Alert.alert('错误', '加载用户设置失败');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserSettings();
  }, []);
  
  // 处理用户名编辑
  const handleEditUsername = () => {
    setIsEditingUsername(true);
    setNewUsername(username);
  };
  
  // 保存用户名
  const handleSaveUsername = async () => {
    if (!newUsername.trim()) {
      Alert.alert("提示", "用户名不能为空");
      return;
    }
    
    setIsLoading(true);
    try {
      const success = await updateUsername(newUsername.trim());
      if (success) {
        setUsername(newUsername.trim());
        setIsEditingUsername(false);
        Alert.alert("成功", "用户名已更新");
      } else {
        throw new Error('更新失败');
      }
    } catch (error) {
      console.error('保存用户名失败:', error);
      Alert.alert('错误', '保存用户名失败');
    } finally {
      setIsLoading(false);
      setNewUsername("");
    }
  };
  
  // 取消编辑用户名
  const handleCancelEditUsername = () => {
    setIsEditingUsername(false);
    setNewUsername("");
  };
  
  // 处理主题颜色更改（只保存，不影响样式）
  const handleThemeColorChange = async (colorId: string) => {
    try {
      setThemeColor(colorId);
      await updateThemeColor(colorId);
      console.log('主题颜色已切换为:', colorId);
    } catch (error) {
      console.error('保存主题颜色失败:', error);
      Alert.alert('错误', '保存主题颜色失败');
    }
  };
  
  // 打开删除记录确认模态框
  const handleOpenDeleteModal = () => {
    setIsDeleteModalVisible(true);
  };
  
  // 关闭删除记录确认模态框
  const handleCloseDeleteModal = () => {
    setIsDeleteModalVisible(false);
  };
  
  // 确认删除记录
  const handleConfirmDelete = async () => {
    setIsLoading(true);
    try {
      const success = await deleteAllRecords();
      if (success) {
        setIsDeleteModalVisible(false);
        Alert.alert("成功", "记录已删除");
      } else {
        throw new Error('删除失败');
      }
    } catch (error) {
      console.error('删除记录失败:', error);
      setIsDeleteModalVisible(false);
      Alert.alert('错误', '删除记录失败');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <View style={styles.content}>
          <Text style={styles.title}>我的</Text>
          
          {/* 用户信息区域 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>用户信息</Text>
            
            {isEditingUsername ? (
              <View style={styles.usernameEditContainer}>
                <TextInput
                  style={styles.usernameInput}
                  value={newUsername}
                  onChangeText={setNewUsername}
                  placeholder="请输入用户名"
                  maxLength={20}
                  autoCapitalize="none"
                />
                <View style={styles.editButtonsContainer}>
                  <TouchableOpacity 
                    style={[styles.editButton, styles.saveButton]}
                    onPress={handleSaveUsername}
                    disabled={isLoading}
                  >
                    <Text style={styles.saveButtonText}>保存</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.editButton, styles.cancelButton]}
                    onPress={handleCancelEditUsername}
                    disabled={isLoading}
                  >
                    <Text style={styles.cancelButtonText}>取消</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.usernameContainer} 
                onPress={handleEditUsername}
                disabled={isLoading}
              >
                <Text style={styles.usernameLabel}>用户名</Text>
                <View style={styles.usernameRow}>
                  <Text style={styles.username}>{username}</Text>
                  <Text style={styles.editIcon}>✏️</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
          
          {/* 主题设置区域 - 只保留切换功能，不影响样式 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>主题设置</Text>
            <Text style={styles.sectionDescription}>选择您喜欢的主题颜色</Text>
            <View style={styles.colorOptionsContainer}>
              {colorOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.colorOption,
                    { backgroundColor: option.color },
                    themeColor === option.id && styles.selectedColorOption
                  ]}
                  onPress={() => handleThemeColorChange(option.id)}
                  disabled={isLoading}
                >
                  <Text style={styles.colorOptionLabel}>{option.name}</Text>
                  {themeColor === option.id && <Text style={styles.checkMark}>✓</Text>}
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          {/* 数据管理区域 */}
          <View style={styles.section}>
            <Text style={styles.dangerZoneTitle}>数据管理</Text>
            <Text style={styles.dangerZoneDescription}>删除您在数据库中的所有记录，此操作不可撤销</Text>
            <TouchableOpacity 
              style={styles.dangerButton}
              onPress={handleOpenDeleteModal}
              disabled={isLoading}
            >
              <Text style={styles.dangerButtonText}>删除所有记录</Text>
            </TouchableOpacity>
            <Text style={styles.warningText}>警告：此操作将永久删除您的所有数据</Text>
          </View>
        </View>
      </ScrollView>
      
      {/* 删除确认模态框 */}
      <ConfirmModal
        visible={isDeleteModalVisible}
        title="确认删除"
        message="确定要删除所有记录吗？此操作不可撤销。"
        confirmText="确认删除"
        cancelText="取消"
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseDeleteModal}
        confirmButtonStyle={{ backgroundColor: '#ff4444' }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 20,
  },
  content: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0', // 固定边框颜色，不随主题变化
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  usernameContainer: {
    marginBottom: 8,
  },
  usernameLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  usernameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  username: {
    fontSize: 16,
    color: '#333',
  },
  editIcon: {
    fontSize: 16,
  },
  usernameEditContainer: {
    marginBottom: 8,
  },
  usernameInput: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: 'white',
  },
  editButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    marginRight: 8,
    backgroundColor: '#007AFF', // 固定保存按钮颜色
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
    marginLeft: 8,
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 16,
  },
  colorOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  colorOption: {
    width: '22%',
    aspectRatio: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColorOption: {
    borderWidth: 3,
    borderColor: '#333',
  },
  colorOptionLabel: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  checkMark: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  dangerZoneTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#cc0000',
    marginBottom: 8,
  },
  dangerZoneDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  dangerButton: {
    backgroundColor: '#ff4444',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#ff4444',
  },
  dangerButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  warningText: {
    color: '#ff6600',
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
