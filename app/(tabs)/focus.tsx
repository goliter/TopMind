import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// 任务接口定义
interface Task {
  id: string;
  title: string;
  description?: string;
  createdAt: Date;
}

// 任务项组件
const TaskItem: React.FC<{
  task: Task;
  onStart: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}> = ({ task, onStart, onEdit, onDelete }) => {
  return (
    <View style={styles.taskItem}>
      <View style={styles.taskContent}>
        <Text style={styles.taskTitle}>{task.title}</Text>
        {task.description && (
          <Text style={styles.taskDescription} numberOfLines={2}>
            {task.description}
          </Text>
        )}
        <Text style={styles.taskDate}>
          创建时间: {task.createdAt.toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.taskActions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.startButton]}
          onPress={() => onStart(task)}
        >
          <Text style={styles.startButtonText}>开始</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.manageButton]}
          onPress={() => onEdit(task)}
        >
          <Text style={styles.manageButtonText}>管理</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function FocusScreen() {
  const [tasks, setTasks] = useState<Task[]>([
    // 示例任务数据
    {
      id: "1",
      title: "完成项目报告",
      description: "整理本周项目进度和下周计划",
      createdAt: new Date(2024, 4, 18)
    },
    {
      id: "2",
      title: "健身30分钟",
      description: "有氧运动和力量训练",
      createdAt: new Date(2024, 4, 18)
    },
    {
      id: "3",
      title: "学习React Native",
      description: "掌握组件生命周期和状态管理",
      createdAt: new Date(2024, 4, 17)
    }
  ]);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  
  // 添加任务
  const handleAddTask = () => {
    if (!taskTitle.trim()) {
      Alert.alert("提示", "请输入任务标题");
      return;
    }
    
    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: taskTitle.trim(),
      description: taskDescription.trim(),
      createdAt: new Date()
    };
    
    setTasks([...tasks, newTask]);
    resetForm();
    setShowAddModal(false);
    Alert.alert("成功", "任务已添加");
  };
  
  // 编辑任务
  const handleEditTask = (task: Task) => {
    setCurrentTask(task);
    setTaskTitle(task.title);
    setTaskDescription(task.description || "");
    setShowEditModal(true);
  };
  
  // 保存编辑的任务
  const handleSaveEdit = () => {
    if (!taskTitle.trim()) {
      Alert.alert("提示", "请输入任务标题");
      return;
    }
    
    if (!currentTask) return;
    
    setTasks(tasks.map(task => 
      task.id === currentTask.id 
        ? { ...task, title: taskTitle.trim(), description: taskDescription.trim() }
        : task
    ));
    
    resetForm();
    setShowEditModal(false);
    Alert.alert("成功", "任务已更新");
  };
  
  // 删除任务
  const handleDeleteTask = (taskId: string) => {
    Alert.alert(
      "确认删除",
      "确定要删除这个任务吗？",
      [
        { text: "取消", style: "cancel" },
        {
          text: "删除",
          style: "destructive",
          onPress: () => {
            setTasks(tasks.filter(task => task.id !== taskId));
            setShowEditModal(false);
            Alert.alert("成功", "任务已删除");
          }
        }
      ]
    );
  };
  
  // 开始任务
  const handleStartTask = (task: Task) => {
    Alert.alert(
      "开始任务",
      `您将开始执行任务：${task.title}\n\n${task.description || "无描述"}`,
      [
        { text: "取消", style: "cancel" },
        {
          text: "开始专注",
          onPress: () => {
            // 这里可以添加计时功能或跳转到专注模式
            Alert.alert("专注模式", `正在执行任务：${task.title}`);
          }
        }
      ]
    );
  };
  
  // 重置表单
  const resetForm = () => {
    setCurrentTask(null);
    setTaskTitle("");
    setTaskDescription("");
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={["right", "left", "top"]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.header}>
          <View style={styles.headerContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>专注</Text>
              <Text style={styles.subtitle}>管理您的代办事务</Text>
            </View>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowAddModal(true)}
            >
              <Text style={styles.addButtonText}>添加任务</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={styles.tasksContainer}
          showsVerticalScrollIndicator={false}
        >
          {tasks.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>暂无任务</Text>
              <Text style={styles.emptySubtext}>
                点击上方按钮添加您的第一个任务
              </Text>
            </View>
          ) : (
            tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onStart={handleStartTask}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            ))
          )}
        </ScrollView>

        {/* 添加任务模态框 */}
        <Modal
          visible={showAddModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => {
            setShowAddModal(false);
            resetForm();
          }}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>添加任务</Text>

              <View style={styles.formGroup}>
                <Text style={styles.label}>任务标题 *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="请输入任务标题"
                  value={taskTitle}
                  onChangeText={setTaskTitle}
                  maxLength={50}
                  autoFocus
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>任务描述</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="请输入任务描述（可选）"
                  value={taskDescription}
                  onChangeText={setTaskDescription}
                  multiline
                  numberOfLines={3}
                  maxLength={200}
                />
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                >
                  <Text style={styles.cancelButtonText}>取消</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={handleAddTask}
                >
                  <Text style={styles.confirmButtonText}>确认添加</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* 编辑任务模态框 */}
        <Modal
          visible={showEditModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => {
            setShowEditModal(false);
            resetForm();
          }}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>管理任务</Text>

              <View style={styles.formGroup}>
                <Text style={styles.label}>任务标题 *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="请输入任务标题"
                  value={taskTitle}
                  onChangeText={setTaskTitle}
                  maxLength={50}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>任务描述</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="请输入任务描述（可选）"
                  value={taskDescription}
                  onChangeText={setTaskDescription}
                  multiline
                  numberOfLines={3}
                  maxLength={200}
                />
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.deleteButton]}
                  onPress={() =>
                    currentTask && handleDeleteTask(currentTask.id)
                  }
                >
                  <Text style={styles.deleteButtonText}>删除任务</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => {
                    setShowEditModal(false);
                    resetForm();
                  }}
                >
                  <Text style={styles.cancelButtonText}>取消</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={handleSaveEdit}
                >
                  <Text style={styles.confirmButtonText}>保存修改</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: "#4a90e2",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  tasksContainer: {
    flex: 1,
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#999",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#bbb",
    textAlign: "center",
  },
  taskItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 3.84,
    elevation: 5,
  },
  taskContent: {
    marginBottom: 12,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 8,
  },
  taskDate: {
    fontSize: 12,
    color: "#999",
  },
  taskActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 70,
    alignItems: "center",
  },
  startButton: {
    backgroundColor: "#4caf50",
  },
  startButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  manageButton: {
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  manageButtonText: {
    color: "#666",
    fontWeight: "600",
    fontSize: 14,
  },
  // 模态框样式
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    width: "90%",
    maxWidth: 400,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: "#333",
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
  },
  cancelButtonText: {
    color: "#666",
    fontWeight: "600",
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: "#4a90e2",
  },
  confirmButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: "#ff4444",
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
