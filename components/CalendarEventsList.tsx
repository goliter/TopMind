import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert
} from 'react-native';
import { CalendarEvent } from './Calendar';

interface CalendarEventsListProps {
  selectedDate: Date | null;
  events: CalendarEvent[];
  onDeleteEvent: (eventId: string) => void;
  onAddEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  onEventPress?: (event: CalendarEvent) => void;
}

export default function CalendarEventsList({
  selectedDate,
  events,
  onDeleteEvent,
  onAddEvent,
  onEventPress
}: CalendarEventsListProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');

  // 处理删除事件
  const handleDeleteEvent = (eventId: string, eventTitle: string) => {
    Alert.alert(
      '确认删除',
      `确定要删除事件「${eventTitle}」吗？`,
      [
        { text: '取消', style: 'cancel' },
        { text: '删除', style: 'destructive', onPress: () => onDeleteEvent(eventId) }
      ]
    );
  };

  // 处理添加新事件
  const handleAddEvent = () => {
    if (!selectedDate) return;
    
    if (!newEventTitle.trim()) {
      Alert.alert('提示', '请输入事件标题');
      return;
    }

    const newEvent: Omit<CalendarEvent, 'id'> = {
      title: newEventTitle.trim(),
      description: newEventDescription.trim(),
      date: selectedDate
    };

    onAddEvent(newEvent);
    
    // 重置表单并关闭模态框
    setNewEventTitle('');
    setNewEventDescription('');
    setShowAddModal(false);
  };

  if (!selectedDate || events.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>暂无事件</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}
          >
            <Text style={styles.addButtonText}>添加事件</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {selectedDate.getFullYear()}年{selectedDate.getMonth() + 1}月{selectedDate.getDate()}日的事件
        </Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Text style={styles.addButtonText}>添加事件</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.eventsList}>
        {events.map(event => (
          <View key={event.id} style={styles.eventItem}>
            <TouchableOpacity
              style={styles.eventContent}
              onPress={() => onEventPress && onEventPress(event)}
              activeOpacity={0.7}
            >
              <Text style={styles.eventTitle}>{event.title}</Text>
              {event.description && (
                <Text style={styles.eventDescription} numberOfLines={2}>
                  {event.description}
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteEvent(event.id, event.title)}
            >
              <Text style={styles.deleteButtonText}>删除</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* 添加事件模态框 */}
      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>添加事件</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>日期</Text>
              <Text style={styles.dateText}>
                {selectedDate.getFullYear()}年{selectedDate.getMonth() + 1}月{selectedDate.getDate()}日
              </Text>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>标题 *</Text>
              <TextInput
                style={styles.input}
                placeholder="请输入事件标题"
                value={newEventTitle}
                onChangeText={setNewEventTitle}
                maxLength={50}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>描述</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="请输入事件描述（可选）"
                value={newEventDescription}
                onChangeText={setNewEventDescription}
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
                  setNewEventTitle('');
                  setNewEventDescription('');
                }}
              >
                <Text style={styles.cancelButtonText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleAddEvent}
              >
                <Text style={styles.confirmButtonText}>确认添加</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginTop: 16,
    padding: 16,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  addButton: {
    backgroundColor: '#4a90e2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  eventsList: {
    marginTop: 8,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 8,
  },
  eventContent: {
    flex: 1,
    paddingRight: 12,
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
  deleteButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginBottom: 16,
  },
  // 模态框样式
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
    paddingVertical: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '500',
  },
  confirmButton: {
    backgroundColor: '#4a90e2',
    marginLeft: 8,
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
});