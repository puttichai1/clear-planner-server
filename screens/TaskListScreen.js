import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';



export default function TaskListScreen({ route, navigation }) {
  const { folderName } = route.params || { folderName: 'TERM 1' };

  const [weeks, setWeeks] = useState([
    { id: '1', title: 'WEEK 1', tasks: [], selected: false },
    { id: '2', title: 'WEEK 2', tasks: [], selected: false },
    
  ]);
  
  const addWeek = () => {
    const newId = Date.now().toString();
    const newWeek = {
      id: newId,
      title: `WEEK ${weeks.length + 1}`,
      tasks: [],
      selected: false,
    };
    setWeeks([...weeks, newWeek]);
  };
  const toggleSelectWeek = (weekId) => {
    setWeeks(weeks.map(week =>
      week.id === weekId ? { ...week, selected: !week.selected } : week
    ));
  };
  const deleteSelectedWeeks = () => {
    const selectedCount = weeks.filter(week => week.selected).length;
    if (selectedCount === 0) {
      Alert.alert('Notice', 'Please select weeks to delete');
      return;
    }
    setWeeks(weeks.filter(week => !week.selected));
  };
  
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [selectedWeekId, setSelectedWeekId] = useState(null);

  const openAddTask = (weekId) => {
    setSelectedWeekId(weekId);
    setNewTask('');
    setShowModal(true);
  };

  const addTaskToWeek = () => {
    if (!newTask.trim()) return;
    setWeeks(weeks.map(week =>
      week.id === selectedWeekId
        ? { ...week, tasks: [...week.tasks, { name: newTask, done: false }] }
        : week
    ));
    setShowModal(false);
  };

  const toggleTaskDone = (weekId, taskIndex) => {
    setWeeks(weeks.map(week =>
      week.id === weekId
        ? {
            ...week,
            tasks: week.tasks.map((task, i) =>
              i === taskIndex ? { ...task, done: !task.done } : task
            )
          }
        : week
    ));
  };

  const renderWeekBox = ({ item }) => (
    <View style={styles.weekBox}>
  <View style={styles.weekHeader}>
    <TouchableOpacity onPress={() => toggleSelectWeek(item.id)}>
      <Ionicons
        name={item.selected ? 'checkbox' : 'square-outline'}
        size={20}
        color={item.selected ? '#FF9800' : '#999'}
      />
    </TouchableOpacity>

    <Text style={styles.weekTitle}>{item.title}</Text>

    <TouchableOpacity onPress={() => openAddTask(item.id)}>
      <Text style={styles.addButton}>＋</Text>
    </TouchableOpacity>
  </View>


      {item.tasks.map((task, index) => (
        <View key={index} style={styles.taskItem}>
          <TouchableOpacity onPress={() => toggleTaskDone(item.id, index)}>
            <Ionicons
              name={task.done ? 'checkbox' : 'square-outline'}
              size={20}
              color={task.done ? '#4CAF50' : '#999'}
            />
          </TouchableOpacity>
          <Text style={[styles.taskText, task.done && { textDecorationLine: 'line-through', color: 'gray' }]}>
            {task.name}
          </Text>
        </View>
      ))}
    </View>
  );


  return (
    <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.backButton}>
  <Text style={styles.backText}>← Back</Text>
</TouchableOpacity>


      <Text style={styles.title}>{folderName}</Text>

      <FlatList
        data={weeks}
        renderItem={renderWeekBox}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
      />
      <View style={styles.controlRow}>
        <TouchableOpacity style={styles.controlButton} onPress={addWeek}>
            <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={deleteSelectedWeeks}>
            <Ionicons name="trash" size={24} color="#fff" />
        </TouchableOpacity>
    </View>

      {/* MODAL เพิ่มงาน */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Task</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter task"
              value={newTask}
              onChangeText={setNewTask}
            />
            <TouchableOpacity style={styles.modalButton} onPress={addTaskToWeek}>
              <Text style={styles.modalButtonText}>Add</Text>
            </TouchableOpacity>

            
          </View>
        </View>
      </Modal>
    </View>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E58C39',
    padding: 16,
  },
  backButton: {
    marginTop: 10,
  marginBottom: 10,
  },
  backText: {
    marginTop: 20, 
    fontSize: 25,
    color: '#fff',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#4E342E',
  },
  grid: {
    justifyContent: 'center',
  },
  weekBox: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 10,
    margin: 10,
    width: 150,
    elevation: 2,
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  weekTitle: {
    fontWeight: 'bold',
    color: '#5D4037',
  },
  addButton: {
    fontSize: 18,
    color: '#E58C39',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 5,
  },
  taskText: {
    fontSize: 14,
    color: '#000',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    backgroundColor: '#fff',
    margin: 40,
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: '#E58C39',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 20,
  },
  controlButton: {
    backgroundColor: '#4E342E',
    borderRadius: 30,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  
});
