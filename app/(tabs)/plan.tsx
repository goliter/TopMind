import React, { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Calendar, { CalendarEvent } from "../../components/Calendar";

export default function PlanScreen() {
  // 生成示例事件数据
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: "1",
      title: "项目会议",
      date: new Date(), // 今天
      description: "讨论Q4季度项目进度和下一阶段计划"
    },
    {
      id: "2",
      title: "健身课程",
      date: new Date(Date.now() + 86400000), // 明天
      description: "每周三下午的瑜伽课，记得带上瑜伽垫"
    },
    {
      id: "3",
      title: "生日聚会",
      date: new Date(Date.now() + 172800000), // 后天
      description: "小明的生日派对，晚上7点在餐厅集合"
    },
    {
      id: "4",
      title: "代码评审",
      date: new Date(Date.now() - 86400000), // 昨天
      description: "审查新功能的代码实现和测试用例"
    },
    {
      id: "5",
      title: "团队建设",
      date: new Date(Date.now() + 432000000), // 5天后
      description: "户外拓展活动，增强团队凝聚力"
    },
    {
      id: "6",
      title: "客户拜访",
      date: new Date(Date.now() + 259200000), // 3天后
      description: "与ABC公司洽谈合作事宜"
    },
    {
      id: "7",
      title: "学习React Native",
      date: new Date(Date.now() + 604800000), // 一周后
      description: "完成在线课程第3章到第5章的学习"
    },
    {
      id: "8",
      title: "提交周报",
      date: new Date(Date.now() + 345600000), // 4天后
      description: "整理本周工作总结和下周计划"
    }
  ]);

  
  // 处理删除事件
  const handleDeleteEvent = (eventId: string) => {
    setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
    Alert.alert('成功', '事件已删除');
  };

  // 处理添加事件
  const handleAddEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    setEvents(prevEvents => [...prevEvents, newEvent]);
    Alert.alert('成功', '事件已添加');
  };

  const handleDayPress = (date: Date, dayEvents: CalendarEvent[]) => {
    
  };

  // 处理事件点击
  const handleEventPress = (event: CalendarEvent) => {
    Alert.alert(
      event.title,
      event.description || "暂无描述",
      [{ text: "确定", style: "default" }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
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
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  calendarContainer: {
    flex: 1,
  },
});
