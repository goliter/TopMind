import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
} from "react-native";
import ConfirmModal from "./ConfirmModal";

interface TopMindItem {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
}

interface TopMindUIProps {
  topMindItems: TopMindItem[];
  showAddModal: boolean;
  showDetailModal: boolean;
  showDeleteConfirm: boolean;
  selectedItem: TopMindItem | null;
  newTitle: string;
  newDescription: string;
  onAddItem: () => void;
  onItemPress: (item: TopMindItem) => void;
  onDeleteItem: () => void;
  onShowAddModal: (visible: boolean) => void;
  onShowDetailModal: (visible: boolean) => void;
  onShowDeleteConfirm: (visible: boolean) => void;
  onSetNewTitle: (title: string) => void;
  onSetNewDescription: (description: string) => void;
  onCancelAdd: () => void;
}

export default function TopMindUI({
  topMindItems,
  showAddModal,
  showDetailModal,
  showDeleteConfirm,
  selectedItem,
  newTitle,
  newDescription,
  onAddItem,
  onItemPress,
  onDeleteItem,
  onShowAddModal,
  onShowDetailModal,
  onShowDeleteConfirm,
  onSetNewTitle,
  onSetNewDescription,
  onCancelAdd,
}: TopMindUIProps) {
  // 渲染事件项
  const renderItem = ({ item }: { item: TopMindItem }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => onItemPress(item)}
    >
      <Text style={styles.itemTitle}>{item.title}</Text>
      <Text style={styles.itemDate}>{item.createdAt.toLocaleDateString()}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Top of Mind</Text>
        <Text style={styles.subtitle}>重要的事情放在首位</Text>
      </View>

      <FlatList
        data={topMindItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={
          topMindItems.length === 0 ? styles.emptyList : styles.listContent
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>还没有添加任何重要事件</Text>
            <Text style={styles.emptySubtext}>
              点击下方按钮添加你的第一个事件
            </Text>
          </View>
        }
      />

      {/* 添加按钮 */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => onShowAddModal(true)}
      >
        <Text style={styles.addButtonText}>+ 添加重要事件</Text>
      </TouchableOpacity>

      {/* 添加事件的模态框 */}
      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => onShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>添加新事件</Text>

            <TextInput
              style={styles.input}
              placeholder="事件标题"
              value={newTitle}
              onChangeText={onSetNewTitle}
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="详细描述（可选）"
              value={newDescription}
              onChangeText={onSetNewDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={onCancelAdd}
              >
                <Text style={styles.cancelButtonText}>取消</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={onAddItem}
              >
                <Text style={styles.confirmButtonText}>添加</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 事件详情模态框 */}
      <Modal
        visible={showDetailModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => onShowDetailModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedItem && (
              <>
                <Text style={styles.modalTitle}>{selectedItem.title}</Text>
                <Text style={styles.detailDate}>
                  添加于: {selectedItem.createdAt.toLocaleString()}
                </Text>
                <Text style={styles.detailDescription}>
                  {selectedItem.description || "暂无描述"}
                </Text>
                <View style={styles.detailButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.deleteButton]}
                    onPress={() => onShowDeleteConfirm(true)}
                  >
                    <Text style={styles.deleteButtonText}>删除</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.closeButton]}
                    onPress={() => onShowDetailModal(false)}
                  >
                    <Text style={styles.closeButtonText}>关闭</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* 删除确认弹窗 */}
      <ConfirmModal
        visible={showDeleteConfirm}
        title="确认删除"
        message="请确认该事件已经完成或不需要后再删除哦！"
        confirmText="删除"
        cancelText="取消"
        onConfirm={onDeleteItem}
        onCancel={() => onShowDeleteConfirm(false)}
        confirmButtonStyle={styles.deleteConfirmButton}
        onRequestClose={() => onShowDeleteConfirm(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 20,
    paddingTop: 30,
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
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  emptyList: {
    flexGrow: 1,
  },
  itemContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  itemDate: {
    fontSize: 14,
    color: "#888",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
  },
  addButton: {
    backgroundColor: "#4a90e2",
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
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
    width: "85%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  textArea: {
    height: 100,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
    marginRight: 8,
  },
  confirmButton: {
    backgroundColor: "#4a90e2",
    marginLeft: 8,
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "500",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  detailDate: {
    fontSize: 14,
    color: "#888",
    marginBottom: 16,
  },
  detailDescription: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    marginBottom: 24,
  },
  detailButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
    marginRight: 8,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  closeButton: {
    backgroundColor: "#357ABD",
    marginLeft: 8,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  confirmText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    marginBottom: 24,
    textAlign: "center",
  },
  deleteConfirmButton: {
    backgroundColor: "#e74c3c",
    marginLeft: 8,
  },
});
