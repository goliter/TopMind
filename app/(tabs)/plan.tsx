 import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Calendar, { CalendarEvent } from "../../components/Calendar";
import { Plan } from "../../database/schema";
import {
  getAllPlans,
  addPlan,
  deletePlan
} from "../../database/plan";

// 将数据库Plan类型转换为Calendar组件所需的CalendarEvent类型
const convertPlanToCalendarEvent = (plan: Plan): CalendarEvent => {
  return {
    id: plan.id.toString(),
    title: plan.title,
    date: new Date(plan.dueDate),
    description: plan.description
  };
};

export default function PlanScreen() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  
  // 从数据库加载所有计划
  const loadPlans = async () => {
    try {
      const plans: Plan[] = await getAllPlans();
      const calendarEvents: CalendarEvent[] = plans.map(convertPlanToCalendarEvent);
      setEvents(calendarEvents);
    } catch (error) {
      console.error("加载计划失败:", error);
      Alert.alert("错误", "加载计划失败，请重试");
    }
  };
  
  // 初始加载计划
  useEffect(() => {
    loadPlans();
  }, []);

  // 处理删除事件
  const handleDeleteEvent = async (eventId: string) => {
    try {
      const planId = parseInt(eventId, 10);
      const success = await deletePlan(planId);
      if (success) {
        // 更新本地状态
        setEvents((prevEvents) =>
          prevEvents.filter((event) => event.id !== eventId)
        );
        Alert.alert("成功", "事件已删除");
      } else {
        Alert.alert("错误", "删除事件失败，请重试");
      }
    } catch (error) {
      console.error("删除事件失败:", error);
      Alert.alert("错误", "删除事件失败，请重试");
    }
  };

  // 处理添加事件
  const handleAddEvent = async (eventData: Omit<CalendarEvent, "id">) => {
    try {
      // 将CalendarEvent转换为数据库所需的Plan类型
      const planId = await addPlan(
        eventData.title,
        eventData.description || "",
        eventData.date.getTime()
      );
      
      if (planId) {
        // 创建新的CalendarEvent并更新本地状态
        const newEvent: CalendarEvent = {
          ...eventData,
          id: planId.toString(),
        };
        setEvents((prevEvents) => [...prevEvents, newEvent]);
        Alert.alert("成功", "事件已添加");
      } else {
        Alert.alert("错误", "添加事件失败，请重试");
      }
    } catch (error) {
      console.error("添加事件失败:", error);
      Alert.alert("错误", "添加事件失败，请重试");
    }
  };

  const handleDayPress = (date: Date, dayEvents: CalendarEvent[]) => {};

  // 处理事件点击
  const handleEventPress = (event: CalendarEvent) => {
    Alert.alert(event.title, event.description || "暂无描述", [
      { text: "确定", style: "default" },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={["right", "left", "top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>计划</Text>
        <Text style={styles.subtitle}>规划你的任务和日程安排</Text>
      </View>
      <View style={styles.calendarContainer}>
        <Calendar
          events={events}
          onDayPress={handleDayPress}
          onEventPress={handleEventPress}
          onDeleteEvent={handleDeleteEvent}
          onAddEvent={handleAddEvent}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  calendarContainer: {
    flex: 1,
  },
});
