import React, { useState, useEffect } from "react";
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
import { Task as TaskType } from "../../database/schema";
import {
  getAllActiveTasks,
  addTask,
  updateTask,
  deleteTask
} from "../../database/tasks";

// 任务项组件
const TaskItem: React.FC<{
  task: TaskType;
  onStart: (task: TaskType) => void;
  onEdit: (task: TaskType) => void;
  onDelete: (taskId: number) => void;
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
          创建时间: {new Date(task.createdAt).toLocaleDateString()}
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
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentTask, setCurrentTask] = useState<TaskType | null>(null);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  
  // 加载所有活跃任务
  const loadTasks = async () => {
    try {
      const allTasks = await getAllActiveTasks();
      setTasks(allTasks);
    } catch (error) {
      console.error("加载任务失败:", error);
      Alert.alert("错误", "加载任务失败，请重试");
    }
  };
  
  // 初始加载任务
  useEffect(() => {
    loadTasks();
  }, []);
  
  // 添加任务
  const handleAddTask = async () => {
    if (!taskTitle.trim()) {
      Alert.alert("提示", "请输入任务标题");
      return;
    }
    
    try {
      const newTaskId = await addTask(taskTitle.trim(), taskDescription.trim());
      if (newTaskId) {
        // 重新加载任务列表，确保数据一致性
        await loadTasks();
        resetForm();
        setShowAddModal(false);
        Alert.alert("成功", "任务已添加");
      } else {
        Alert.alert("错误", "添加任务失败，请重试");
      }
    } catch (error) {
      console.error("添加任务失败:", error);
      Alert.alert("错误", "添加任务失败，请重试");
    }
  };
  
  // 编辑任务
  const handleEditTask = (task: TaskType) => {
    setCurrentTask(task);
    setTaskTitle(task.title);
    setTaskDescription(task.description || "");
    setShowEditModal(true);
  };
  
  // 保存编辑的任务
  const handleSaveEdit = async () => {
    if (!taskTitle.trim()) {
      Alert.alert("提示", "请输入任务标题");
      return;
    }
    
    if (!currentTask) return;
    
    try {
      const success = await updateTask(currentTask.id, taskTitle.trim(), taskDescription.trim());
      if (success) {
        // 重新加载任务列表，确保数据一致性
        await loadTasks();
        resetForm();
        setShowEditModal(false);
        Alert.alert("成功", "任务已更新");
      } else {
        Alert.alert("错误", "更新任务失败，请重试");
      }
    } catch (error) {
      console.error("更新任务失败:", error);
      Alert.alert("错误", "更新任务失败，请重试");
    }
  };
  
  // 删除任务
  const handleDeleteTask = async (taskId: number) => {
    Alert.alert(
      "确认删除",
      "确定要删除这个任务吗？",
      [
        { text: "取消", style: "cancel" },
        {
          text: "删除",
          style: "destructive",
          onPress: async () => {
            try {
              const success = await deleteTask(taskId);
              if (success) {
                // 重新加载任务列表，确保数据一致性
                await loadTasks();
                setShowEditModal(false);
                Alert.alert("成功", "任务已删除");
              } else {
                Alert.alert("错误", "删除任务失败，请重试");
              }
            } catch (error) {
              console.error("删除任务失败:", error);
              Alert.alert("错误", "删除任务失败，请重试");
            }
          }
        }
      ]
    );
  };
  
  // 开始任务
  const handleStartTask = (task: TaskType) => {
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
