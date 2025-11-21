import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ConfirmModal from "@/components/ConfirmModal";
import { useThemeColor } from "@/hooks/use-theme-color";

// 主题颜色选项
const colorOptions = [
  { id: "blue", name: "蓝色", color: "#1E90FF" },
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
  const [username, setUsername] = useState("用户名");
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [isUsernameInputFocused, setIsUsernameInputFocused] = useState(false);
  
  // 主题颜色状态
  const [themeColor, setThemeColor] = useState("blue");
  
  // 加载状态
  const [isLoading, setIsLoading] = useState(false);
  
  // 错误状态
  const [error, setError] = useState<string | null>(null);
  
  // 动画值
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);
  
  // 输入框引用
  const usernameInputRef = useRef<TextInput>(null);
  
  // 使用主题颜色钩子
  const primaryColor = useThemeColor({
    light: colorOptions.find(option => option.id === themeColor)?.color || "#1E90FF",
    dark: colorOptions.find(option => option.id === themeColor)?.color || "#1E90FF"
  }, 'tint');
  
  // 页面加载动画
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  
  // 模态框状态
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  
  // 处理用户名编辑
  const handleEditUsername = () => {
    setIsEditingUsername(true);
    setNewUsername(username);
    // 延迟聚焦输入框，确保组件已渲染
    setTimeout(() => {
      if (usernameInputRef.current) {
        usernameInputRef.current.focus();
        setIsUsernameInputFocused(true);
      }
    }, 100);
  };
  
  // 保存用户名
  const handleSaveUsername = () => {
    if (!newUsername.trim()) {
      Alert.alert("提示", "用户名不能为空");
      return;
    }
    
    setIsLoading(true);
    // 模拟API调用
    setTimeout(() => {
      setUsername(newUsername.trim());
      setIsEditingUsername(false);
      setIsLoading(false);
      Alert.alert("成功", "用户名已更新");
    }, 500);
  };
  
  // 取消编辑用户名
  const handleCancelEditUsername = () => {
    setIsEditingUsername(false);
    setIsUsernameInputFocused(false);
    setNewUsername("");
  };
  
  // 处理主题颜色更改
  const handleThemeColorChange = (colorId: string) => {
    setThemeColor(colorId);
    // 这里可以添加保存主题颜色到本地存储的逻辑
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
  const handleConfirmDelete = () => {
    setIsLoading(true);
    // 模拟API调用
    setTimeout(() => {
      setIsLoading(false);
      setIsDeleteModalVisible(false);
      Alert.alert("成功", "记录已删除");
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          <Text style={styles.title}>我的</Text>
          
          {/* 用户信息区域 */}
          <View style={[styles.section, { borderColor: primaryColor }]}>
            <Text style={styles.sectionTitle}>用户信息</Text>
            
            {isEditingUsername ? (
              <View style={styles.usernameEditContainer}>
                <TextInput
                  ref={usernameInputRef}
                  style={[
                    styles.usernameInput,
                    isUsernameInputFocused && { borderColor: primaryColor },
                    { borderWidth: isUsernameInputFocused ? 2 : 1 }
                  ]}
                  value={newUsername}
                  onChangeText={setNewUsername}
                  onFocus={() => setIsUsernameInputFocused(true)}
                  onBlur={() => setIsUsernameInputFocused(false)}
                  placeholder="请输入用户名"
                  maxLength={20}
                  autoCapitalize="none"
                />
                <View style={styles.editButtonsContainer}>
                  <TouchableOpacity 
                    style={[styles.editButton, styles.saveButton, { backgroundColor: primaryColor }]}
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
          
          {/* 主题设置区域 */}
          <View style={[styles.section, { borderColor: primaryColor }]}>
            <Text style={styles.sectionTitle}>主题设置</Text>
            <Text style={styles.sectionDescription}>选择您喜欢的主题颜色</Text>
            <View style={styles.colorOptionsContainer}>
              {colorOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.colorOption,
                    { backgroundColor: option.color },
                    themeColor === option.id && styles.selectedColorOption,
                    { borderColor: themeColor === option.id ? '#333' : 'transparent' }
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
          <View style={[styles.section, styles.dangerZoneContainer, { borderColor: '#ffcccc' }]}>
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
        </Animated.View>
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
  },
  selectedColorOption: {
    borderWidth: 3,
  },
  colorOptionLabel: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 2,
  },
  checkMark: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 2,
  },
  dangerZoneContainer: {
    backgroundColor: '#fff8f8',
    borderColor: '#ffcccc',
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
