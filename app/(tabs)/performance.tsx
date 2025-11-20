import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FocusPieChart, { FocusEvent } from "@/components/FocusPieChart";
import FocusTrendChart, { FocusTrendData } from "@/components/FocusTrendChart";

const mockFocusEvents: FocusEvent[] = [
  { id: '1', title: '项目开发', duration: 120 },
  { id: '2', title: '学习研究', duration: 90 },
  { id: '3', title: '会议讨论', duration: 60 },
];

// 生成近30天的模拟专注时长数据
const generateMockTrendData = (): FocusTrendData[] => {
  const data: FocusTrendData[] = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    // 生成50-200分钟之间的随机专注时长
    const focusDuration = Math.floor(Math.random() * 150) + 50;
    
    // 格式化为月/日格式，使图表底部日期标签更简洁
    data.push({
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      duration: focusDuration,
    });
  }
  
  return data;
};

const mockTrendData = generateMockTrendData();

export default function PerformanceScreen() {
  
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
          <FocusPieChart events={mockFocusEvents} title="今日专注分布" />
        </View>
        
        <View style={styles.chartContainer}>
          <FocusTrendChart data={mockTrendData} title="近30天专注趋势" />
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
