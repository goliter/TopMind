import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { addFocusSession } from "@/database/focusSessions";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Task as TaskType } from "@/database/schema";

// 定义路由参数类型
interface RouteParams {
  task: TaskType;
}

export default function FocusDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { task } = route.params as RouteParams;

  // 使用自定义主题hook
  const { currentColor } = useAppTheme();

  // 计时器状态
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  // 确认模态框状态
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // 计时器引用 (React Native中setInterval返回number类型)
  const timerRef = useRef<number | null>(null);

  // 开始时间
  const startTimeRef = useRef(Date.now());

  // 格式化时间（秒 -> MM:SS）
  const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  // 开始计时
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    // 清理函数
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning]);

  // 暂停/继续计时
  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  // 打开结束确认模态框
  const handleEndFocus = () => {
    setShowConfirmModal(true);
  };

  // 关闭确认模态框
  const handleCancelEnd = () => {
    setShowConfirmModal(false);
  };

  // 确认结束专注
  const handleConfirmEnd = async () => {
    try {
      // 计算专注时长（秒 -> 分钟，向上取整）
      const durationMinutes = Math.ceil(seconds / 60);
      const startTime = startTimeRef.current;
      const endTime = Date.now();

      // 保存专注会话数据
      await addFocusSession(
        task.id,
        task.title,
        durationMinutes,
        startTime,
        endTime
      );

      // 关闭模态框并返回上一页
      setShowConfirmModal(false);
      Alert.alert("成功", `专注时长已记录：${formatTime(seconds)}`);
      navigation.goBack();
    } catch (error) {
      console.error("保存专注数据失败:", error);
      Alert.alert("错误", "保存专注数据失败，请重试");
    }
  };

  // 返回上一页（不保存数据）
  const handleBack = () => {
    if (seconds > 0) {
      Alert.alert("确认退出", "您的专注数据将不会保存，确定要退出吗？", [
        { text: "取消", style: "cancel" },
        {
          text: "退出",
          style: "destructive",
          onPress: () => navigation.goBack(),
        },
      ]);
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 背景层 - 使用主题颜色 */}
      <View
        style={[styles.backgroundLayer, { backgroundColor: currentColor }]}
      />

      {/* 内容层 */}
      <View style={styles.content}>
        {/* 标题栏 */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>专注中</Text>
          <View style={styles.headerRight} />
        </View>

        {/* 任务信息 */}
        <View style={styles.taskInfo}>
          <Text style={styles.taskTitle}>{task.title}</Text>
          {task.description && (
            <Text style={styles.taskDescription}>{task.description}</Text>
          )}
        </View>

        {/* 计时器 */}
        <View style={styles.timerContainer}>
          <Text style={styles.timer}>{formatTime(seconds)}</Text>
        </View>

        {/* 控制按钮 */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.controlButton, styles.pauseButton]}
            onPress={toggleTimer}
          >
            <Text style={styles.controlButtonText}>
              {isRunning ? "暂停" : "继续"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.controlButton, styles.endButton]}
            onPress={handleEndFocus}
          >
            <Text style={styles.controlButtonText}>结束</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 结束确认模态框 */}
      <Modal
        visible={showConfirmModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancelEnd}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>结束专注</Text>
            <Text style={styles.modalMessage}>
              您已专注 {formatTime(seconds)}，确定要结束吗？
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelModalButton]}
                onPress={handleCancelEnd}
              >
                <Text style={styles.modalButtonText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmModalButton]}
                onPress={handleConfirmEnd}
              >
                <Text style={styles.modalButtonText}>确认结束</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  backgroundLayer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 24,
    color: "#333",
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  headerRight: {
    width: 40,
  },
  taskInfo: {
    alignItems: "center",
    marginBottom: 60,
  },
  taskTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
    textAlign: "center",
  },
  taskDescription: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 40,
  },
  timerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  timer: {
    fontSize: 80,
    fontWeight: "bold",
    color: "#333",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 40,
  },
  controlButton: {
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 30,
    minWidth: 120,
    alignItems: "center",
  },
  pauseButton: {
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  endButton: {
    backgroundColor: "#ff4444",
  },
  controlButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
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
    borderRadius: 16,
    padding: 24,
    width: "80%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelModalButton: {
    backgroundColor: "#f5f5f5",
  },
  confirmModalButton: {
    backgroundColor: "#4a90e2",
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
