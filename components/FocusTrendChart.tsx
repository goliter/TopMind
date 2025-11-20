import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

// 专注趋势数据接口
export interface FocusTrendData {
  date: string; // 日期，格式如 '1/1' 或 '01-01'
  duration: number; // 专注时长，单位为分钟
}

// 折线图组件属性接口
interface FocusTrendChartProps {
  data?: FocusTrendData[];
  title?: string;
  width?: number;
  height?: number;
}

const FocusTrendChart: React.FC<FocusTrendChartProps> = ({
  data,
  title = '近30天专注趋势',
  width = Dimensions.get('window').width - 32,
  height = 220,
}) => {
  // 生成模拟数据（近30天的专注时长数据）
  const generateMockData = (): FocusTrendData[] => {
    const mockData: FocusTrendData[] = [];
    const today = new Date();
    
    // 生成最近30天的数据
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      // 生成模拟的专注时长（30-300分钟之间的随机值）
      const duration = Math.floor(Math.random() * 270) + 30;
      
      mockData.push({
        date: `${date.getMonth() + 1}/${date.getDate()}`,
        duration,
      });
    }
    
    return mockData;
  };

  // 使用传入的数据或模拟数据
  const trendData = data || generateMockData();
  
  // 准备图表数据
  const chartData = {
    labels: trendData.map(item => item.date),
    datasets: [
      {
        data: trendData.map(item => item.duration),
        color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`, // 蓝色线条
        strokeWidth: 2,
      },
    ],
    legend: ['专注时长 (分钟)'],
  };

  // 图表配置
  const chartConfig = {
    backgroundColor: '#f5f5f5',
    backgroundGradientFrom: '#f5f5f5',
    backgroundGradientTo: '#f5f5f5',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`, // 确保线条颜色为蓝色
    labelColor: (opacity = 1) => `rgba(66, 66, 66, ${opacity})`, // 稍深的标签颜色提高可读性
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#4a90e2',
    },
    propsForBackgroundLines: {
      strokeDasharray: '', // 实线网格
      stroke: 'rgba(0, 0, 0, 0.1)',
    },
    propsForLabels: {
      fontSize: 8, // 减小字体大小，避免标签重叠
      paddingVertical: 4,
    },
  };

  // 格式化总时长
  const formatTotalDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  // 计算统计数据
  const totalDuration = trendData.reduce((sum, item) => sum + item.duration, 0);
  const averageDuration = trendData.length > 0 ? Math.round(totalDuration / trendData.length) : 0;
  const maxDuration = Math.max(...trendData.map(item => item.duration));
  const minDuration = Math.min(...trendData.map(item => item.duration));

  // 找出时长最长的日期
  const maxDurationDate = trendData.find(item => item.duration === maxDuration)?.date || '';
  // 找出时长最短的日期
  const minDurationDate = trendData.find(item => item.duration === minDuration)?.date || '';

  // 如果没有数据，显示空状态
  if (trendData.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>暂无专注趋势数据</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      
      {/* 统计信息卡片 */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{formatTotalDuration(totalDuration)}</Text>
          <Text style={styles.statLabel}>总时长</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{averageDuration}m</Text>
          <Text style={styles.statLabel}>平均每日</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{maxDuration}m</Text>
          <Text style={styles.statLabel}>最长单日</Text>
        </View>
      </View>
      
      {/* 折线图，使用ScrollView支持水平滚动 */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.chartScrollView}
        contentContainerStyle={styles.chartScrollContent}
      >
        <LineChart
          data={chartData}
          width={trendData.length * 30 + 40} // 根据数据点数量动态计算宽度，避免标签重叠
          height={height}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          withInnerLines={true}
          withOuterLines={true}
          withVerticalLines={false} // 移除垂直线，减少视觉混乱
          withHorizontalLines={true}
          withDots={true}
          withShadow={false}
          segments={4} // 减少网格线数量
          fromZero
          formatYLabel={(value) => `${value}m`} // Y轴标签添加单位
        />
      </ScrollView>
      
      {/* 附加信息 */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>最长专注日: {maxDurationDate}  时长: {maxDuration}m</Text>
        <Text style={styles.infoText}>最低专注日: {minDurationDate}  时长: {minDuration}m</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e0e0e0',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4a90e2',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  chartScrollView: {
    marginBottom: 12,
  },
  chartScrollContent: {
    paddingRight: 20,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  infoContainer: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  emptyContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});

export default FocusTrendChart;