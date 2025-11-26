import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FocusPieChart, { FocusEvent } from "@/components/FocusPieChart";
import FocusTrendChart, { FocusTrendData } from "@/components/FocusTrendChart";
import { getFocusSessionsByDate, getDailyFocusStats } from "../../database/focusSessions";

export default function PerformanceScreen() {
  // 状态管理
  const [todayFocusEvents, setTodayFocusEvents] = useState<FocusEvent[]>([]);
  const [trendData, setTrendData] = useState<FocusTrendData[]>([]);

  // 获取今日日期（YYYY-MM-DD格式）
  const getTodayDate = (): string => {
    return new Date().toISOString().split('T')[0];
  };

  // 获取30天前的日期（YYYY-MM-DD格式）
  const getThirtyDaysAgoDate = (): string => {
    const date = new Date();
    date.setDate(date.getDate() - 29); // 包括今天共30天
    return date.toISOString().split('T')[0];
  };

  // 加载今日专注数据
  const loadTodayFocusData = async () => {
    try {
      const today = getTodayDate();
      const sessions = await getFocusSessionsByDate(today);
      
      // 按任务标题分组计算总时长
      const groupedData = sessions.reduce((acc, session) => {
        const existingItem = acc.find(item => item.title === session.taskTitle);
        if (existingItem) {
          existingItem.duration += session.duration;
        } else {
          acc.push({
            id: session.id.toString(),
            title: session.taskTitle,
            duration: session.duration
          });
        }
        return acc;
      }, [] as FocusEvent[]);
      
      // 如果没有数据，添加一个默认的0时长事件
      if (groupedData.length === 0) {
        groupedData.push({
          id: '0',
          title: '今日无专注数据',
          duration: 1
        });
      }
      
      setTodayFocusEvents(groupedData);
    } catch (error) {
      console.error("加载今日专注数据失败:", error);
      // 错误情况下也显示0时长事件
      setTodayFocusEvents([{
        id: '0',
        title: '数据错误，请重试',
        duration: 0
      }]);
    }
  };

  // 加载近30天专注趋势数据
  const loadTrendData = async () => {
    try {
      const startDate = getThirtyDaysAgoDate();
      const endDate = getTodayDate();
      const dailyStats = await getDailyFocusStats(startDate, endDate);
      
      // 创建一个包含近30天所有日期的数组，默认时长为0
      const allDates: FocusTrendData[] = [];
      const currentDate = new Date(startDate);
      const end = new Date(endDate);
      
      while (currentDate <= end) {
        // 格式化为YYYY-MM-DD格式，用于数据库数据匹配
        const dateKey = currentDate.toISOString().split('T')[0];
        // 格式化为月/日格式，用于图表显示
        const displayDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}`;
        
        allDates.push({
          date: displayDate,
          duration: 0 // 默认时长为0
        });
        
        // 移到下一天
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      // 用数据库返回的实际数据覆盖对应日期的时长
      dailyStats.forEach(stat => {
        const date = new Date(stat.date);
        const displayDate = `${date.getMonth() + 1}/${date.getDate()}`;
        const index = allDates.findIndex(item => item.date === displayDate);
        if (index !== -1) {
          allDates[index].duration = stat.totalDuration;
        }
      });
      
      setTrendData(allDates);
    } catch (error) {
      console.error("加载专注趋势数据失败:", error);
      // 错误情况下生成默认的30天数据，全部为0
      const defaultTrendData: FocusTrendData[] = [];
      const today = new Date();
      
      for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        defaultTrendData.push({
          date: `${date.getMonth() + 1}/${date.getDate()}`,
          duration: 0
        });
      }
      
      setTrendData(defaultTrendData);
    }
  };

  // 组件挂载时加载数据
  useEffect(() => {
    loadTodayFocusData();
    loadTrendData();
  }, []);
  
  return (
    <SafeAreaView 
      style={[
        styles.container, 
        { backgroundColor: '#f5f5f5' }
      ]} 
      edges={["right", "left", "top"]}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.title]}>表现</Text>
          <Text style={[styles.subtitle]}>
            查看您的专注时间分布和工作效率
          </Text>
        </View>
        
        <View style={styles.chartContainer}>
          <FocusPieChart events={todayFocusEvents} title="今日专注分布" />
        </View>
        
        <View style={styles.chartContainer}>
          <FocusTrendChart data={trendData} title="近30天专注趋势" />
        </View>
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  darkText: {
    color: '#fff',
  },
  darkSubtitle: {
    color: '#999',
  },
  chartContainer: {
    marginVertical: 16,
  },
  insightsContainer: {
    marginHorizontal: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  darkCard: {
    backgroundColor: '#1e1e1e',
    shadowOpacity: 0.3,
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  insightItem: {
    marginBottom: 8,
  },
  insightText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
});
