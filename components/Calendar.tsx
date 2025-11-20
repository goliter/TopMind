import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import CalendarEventsList from './CalendarEventsList';

// 事件接口定义
export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  description?: string;
}

// 日历组件属性接口
interface CalendarProps {
  events: CalendarEvent[];
  onDayPress?: (date: Date, events: CalendarEvent[]) => void;
  onEventPress?: (event: CalendarEvent) => void;
  onDeleteEvent?: (eventId: string) => void;
  onAddEvent?: (event: Omit<CalendarEvent, 'id'>) => void;
}

export default function Calendar({ 
  events, 
  onDayPress, 
  onEventPress,
  onDeleteEvent,
  onAddEvent 
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date()); // 默认选中今天
  const [eventDates, setEventDates] = useState<{ [key: string]: CalendarEvent[] }>({});

  // 初始化事件日期映射
  useEffect(() => {
    const dates: { [key: string]: CalendarEvent[] } = {};
    events.forEach(event => {
      const dateKey = formatDateKey(event.date);
      if (!dates[dateKey]) {
        dates[dateKey] = [];
      }
      dates[dateKey].push(event);
    });
    setEventDates(dates);
  }, [events]);

  // 格式化日期为 YYYY-MM-DD 格式作为键
  const formatDateKey = (date: Date): string => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  // 获取指定月份的所有日期
  const getMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // 获取当月第一天
    const firstDay = new Date(year, month, 1);
    // 获取当月最后一天
    const lastDay = new Date(year, month + 1, 0);
    
    // 获取当月第一天是星期几（0-6，0是星期日）
    const firstDayOfWeek = firstDay.getDay();
    
    const daysInMonth = lastDay.getDate();
    const days: (Date | null)[] = [];
    
    // 添加上个月的日期（用于填充第一行）
    for (let i = 0; i < firstDayOfWeek; i++) {
      const prevMonthDate = new Date(year, month, -i);
      days.unshift(prevMonthDate);
    }
    
    // 添加当月的日期
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    // 添加下个月的日期（用于填充最后一行）
    const remainingDays = 42 - days.length; // 6行7列 = 42个格子
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }
    
    return days;
  };

  // 切换到上个月
  const goToPreviousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    setSelectedDate(null);
  };

  // 切换到下个月
  const goToNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    setSelectedDate(null);
  };

  // 获取月份名称
  const getMonthName = (): string => {
    const monthNames = [
      '一月', '二月', '三月', '四月', '五月', '六月',
      '七月', '八月', '九月', '十月', '十一月', '十二月'
    ];
    return monthNames[currentDate.getMonth()];
  };

  // 处理日期点击
  const handleDayPress = (date: Date) => {
    setSelectedDate(date);
    const dateKey = formatDateKey(date);
    const dayEvents = eventDates[dateKey] || [];
    if (onDayPress) {
      onDayPress(date, dayEvents);
    }
  };

  // 判断是否是当月日期
  const isCurrentMonth = (date: Date): boolean => {
    return date.getMonth() === currentDate.getMonth();
  };

  // 判断是否是今天
  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // 判断是否是选中的日期
  const isSelectedDate = (date: Date): boolean => {
    if (!selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  // 获取日期的事件数量
  const getEventCount = (date: Date): number => {
    const dateKey = formatDateKey(date);
    return eventDates[dateKey] ? eventDates[dateKey].length : 0;
  };

  // 获取日期的所有事件
  const getDayEvents = (date: Date): CalendarEvent[] => {
    const dateKey = formatDateKey(date);
    return eventDates[dateKey] || [];
  };

  // 渲染星期标题
  const renderWeekdays = () => {
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    return (
      <View style={styles.weekdays}>
        {weekdays.map((day, index) => (
          <Text key={index} style={styles.weekdayText}>{day}</Text>
        ))}
      </View>
    );
  };

  // 渲染日期单元格
  const renderDayCell = (date: Date | null) => {
    if (!date) return <View style={styles.dayCell} />;

    const isCurrent = isCurrentMonth(date);
    const isTodayDate = isToday(date);
    const isSelected = isSelectedDate(date);
    const eventCount = getEventCount(date);
    const hasEvents = eventCount > 0;

    return (
      <TouchableOpacity
          key={`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`}
          style={[
            styles.dayCell,
            !isCurrent && styles.otherMonthCell,
            isTodayDate && styles.todayCell,
            isSelected && styles.selectedCell,
          ]}
          onPress={() => handleDayPress(date)}
          activeOpacity={0.7}
        >
          <View style={styles.dayContent}>
            <Text
              style={[
                styles.dayText,
                !isCurrent && styles.otherMonthDayText,
                isTodayDate && styles.todayDayText,
                isSelected && styles.selectedDayText,
              ]}
            >
              {date.getDate()}
            </Text>
            {hasEvents && (
              <View style={styles.eventIndicator}>
                <View style={styles.eventDot} />
              </View>
            )}
          </View>
        </TouchableOpacity>
    );
  };

  // 渲染日期网格
  const renderDaysGrid = () => {
    const days = getMonthDays();
    return (
      <View style={styles.daysGrid}>
        {days.map((day, index) => renderDayCell(day))}
      </View>
    );
  };

  // 渲染选中日期的事件列表
  const renderSelectedDayEvents = () => {
    if (!selectedDate) return null;
    
    const dayEvents = getDayEvents(selectedDate);

    return (
      <CalendarEventsList
        selectedDate={selectedDate}
        events={dayEvents}
        onDeleteEvent={onDeleteEvent || (() => {})}
        onAddEvent={onAddEvent || (() => {})}
        onEventPress={onEventPress}
      />
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* 月份导航栏 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goToPreviousMonth} style={styles.navButton}>
          <Text style={styles.navButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {currentDate.getFullYear()}年 {getMonthName()}
        </Text>
        <TouchableOpacity onPress={goToNextMonth} style={styles.navButton}>
          <Text style={styles.navButtonText}>›</Text>
        </TouchableOpacity>
      </View>

      {/* 日历主体 */}
      {renderWeekdays()}
      {renderDaysGrid()}

      {/* 选中日期的事件列表 */}
      {renderSelectedDayEvents()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  navButton: {
    padding: 8,
  },
  navButtonText: {
    fontSize: 24,
    color: '#4a90e2',
  },
  weekdays: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  weekdayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#fff',
  },
  dayCell: {
    width: '14.28%', // 7 days per week
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  dayContent: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  otherMonthCell: {
    opacity: 0.3,
  },
  todayCell: {
    backgroundColor: '#e8f4fd',
  },
  selectedCell: {
    backgroundColor: '#4a90e2',
  },
  dayText: {
    fontSize: 16,
    color: '#333',
  },
  otherMonthDayText: {
    color: '#999',
  },
  todayDayText: {
    fontWeight: 'bold',
    color: '#4a90e2',
  },
  selectedDayText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  eventIndicator: {
    position: 'absolute',
    bottom: 6,
    alignItems: 'center',
  },
  eventDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4a90e2',
  },

  eventsContainer: {
    backgroundColor: '#fff',
    marginTop: 16,
    padding: 16,
    marginBottom: 20,
  },
  eventsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  eventItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  eventDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    lineHeight: 20,
  },
});