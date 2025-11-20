import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

// 专注事件接口定义
export interface FocusEvent {
  id: string;
  title: string;
  duration: number;
  color?: string;
}

// 饼状图组件属性接口
interface FocusPieChartProps {
  events: FocusEvent[];
  title?: string;
  width?: number;
  height?: number;
}

const FocusPieChart: React.FC<FocusPieChartProps> = ({
  events,
  title = '今日专注分布',
  width = Dimensions.get('window').width - 32,
  height = 220,
}) => {
  
  // 默认颜色数组
  const defaultColors = [
    '#4a90e2', // 蓝色
    '#50e3c2', // 青色
    '#f5a623', // 橙色
    '#d0021b', // 红色
    '#9013fe', // 紫色
    '#b8e986', // 浅绿色
    '#bd10e0', // 粉色
    '#7ed321', // 绿色
    '#50e3c2', // 蓝绿色
    '#00aced', // 亮蓝色
  ];

  // 计算总时间
  const totalDuration = events.reduce((sum, event) => sum + event.duration, 0);

  // 准备饼图数据
  const chartData = events.map((event, index) => {
    const percentage = totalDuration > 0 ? Math.round((event.duration / totalDuration) * 100) : 0;
    
    return {
      name: event.title,
      population: percentage,
      color: event.color || defaultColors[index % defaultColors.length],
      legendFontColor: '#333',
      legendFontSize: 12,
    };
  });

  // 格式化时间显示（分钟转换为小时:分钟格式）
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  // 图表配置
  const chartConfig = {
    backgroundColor:  '#f5f5f5',
    backgroundGradientFrom: '#f5f5f5',
    backgroundGradientTo: '#f5f5f5',
    decimalPlaces: 0,
    color: (opacity = 1) =>  `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) =>  `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke:  '#000',
    },
  };

  // 如果没有事件数据，显示空状态
  if (events.length === 0) {
    return (
      <View style={[styles.container]}>
        <Text style={[styles.title]}>{title}</Text>
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText]}>今天还没有专注记录</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container]}>
      <Text style={[styles.title]}>{title}</Text>
      
      {/* 饼图 */}
      <PieChart
        data={chartData}
        width={width}
        height={height}
        chartConfig={chartConfig}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
      
      {/* 事件列表和时间统计 */}
      <View style={styles.legendContainer}>
        {events.map((event, index) => {
          const percentage = totalDuration > 0 ? Math.round((event.duration / totalDuration) * 100) : 0;
          return (
            <View key={event.id} style={styles.legendItem}>
              <View style={styles.legendLeft}>
                <View 
                  style={[
                    styles.colorIndicator, 
                    { backgroundColor: event.color || defaultColors[index % defaultColors.length] }
                  ]} 
                />
                <Text style={[styles.eventTitle]} numberOfLines={1}>
                  {event.title}
                </Text>
              </View>
              <View style={styles.legendRight}>
                <Text style={[styles.durationText]}>
                  {formatDuration(event.duration)}
                </Text>
                <Text style={[styles.percentageText]}>
                  {percentage}%
                </Text>
              </View>
            </View>
          );
        })}
        
        {/* 总计 */}
        <View style={styles.totalContainer}>
          <Text style={[styles.totalLabel]}>总计</Text>
          <Text style={[styles.totalDuration]}>
            {formatDuration(totalDuration)}
          </Text>
        </View>
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
  darkContainer: {
    backgroundColor: '#1e1e1e',
    shadowColor: '#000',
    shadowOpacity: 0.3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  darkText: {
    color: '#fff',
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
  legendContainer: {
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  legendLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  legendRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  eventTitle: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  durationText: {
    fontSize: 14,
    color: '#666',
    marginRight: 12,
  },
  percentageText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalDuration: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4a90e2',
  },
});

export default FocusPieChart;