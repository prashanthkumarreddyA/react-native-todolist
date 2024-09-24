import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Button,
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const API_BASE_URL = 'https://todolist-backend-vercel.vercel.app';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/todos/`);
      setTodos(response.data.todos);
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async () => {
    if (newTodo.trim()) {
      setLoading(true);
      try {
        await axios.post(`${API_BASE_URL}/todos/`, {
          todo: newTodo,
          isChecked: false,
        });
        setNewTodo('');
        fetchTodos();
      } catch (error) {
        console.error('Error adding todo:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleTodo = async (id, isChecked) => {
    setLoading(true);
    try {
      await axios.put(`${API_BASE_URL}/todos/${id}/`, {
        isChecked: !isChecked,
      });
      fetchTodos();
    } catch (error) {
      console.error('Error updating todo:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTodo = async id => {
    setLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/todos/${id}/`);
      fetchTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (id, currentText) => {
    setEditingTodoId(id);
    setEditingText(currentText);
  };

  const updateTodo = async id => {
    if (editingText.trim()) {
      setLoading(true);
      try {
        await axios.put(`${API_BASE_URL}/todos/${id}/`, {
          todo: editingText,
        });
        setEditingTodoId(null);
        fetchTodos();
      } catch (error) {
        console.error('Error updating todo:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const renderItem = ({item}) => (
    <View style={styles.todoItem}>
      {editingTodoId === item.id ? (
        <>
          <TextInput
            style={styles.input}
            value={editingText}
            onChangeText={setEditingText}
          />
          <TouchableOpacity
            onPress={() => updateTodo(item.id)}
            style={styles.saveButton}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TouchableOpacity
            onPress={() => toggleTodo(item.id, item.isChecked)}
            style={styles.todoButton}>
            <Text style={[styles.todoText, item.isChecked && styles.checked]}>
              {item.todo}
            </Text>
          </TouchableOpacity>
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              onPress={() => startEditing(item.id, item.todo)}
              style={styles.editButton}>
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => deleteTodo(item.id)}
              style={styles.deleteButton}>
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );

  return (
    <ImageBackground
      source={require('./asserts/images/background.png')}
      style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Todo List</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newTodo}
            onChangeText={setNewTodo}
            placeholder="Add a new todo"
          />
          <Button title="Add" onPress={addTodo} color="#28a745" />
        </View>
        {loading ? (
          <ActivityIndicator size="large" color="#28a745" />
        ) : (
          <FlatList
            data={todos}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.todoList}
          />
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(244, 246, 248, 0.8)',
    paddingHorizontal: 20,
    paddingTop: 20,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'rgb(0, 128, 0)',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    padding: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 4,
    marginRight: 10,
    color: 'black',
    backgroundColor: '#fff',
    height: 40,
  },
  todoList: {
    flexGrow: 1,
    gap: 10,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderRadius: 10,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  todoText: {
    fontSize: 16,
    color: 'black',
  },
  checked: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  saveButton: {
    padding: 8,
    backgroundColor: '#28a745',
    borderRadius: 4,
    marginLeft: 5,
  },
  editButton: {
    padding: 8,
    backgroundColor: '#007bff',
    borderRadius: 4,
    marginLeft: 5,
  },
  deleteButton: {
    padding: 8,
    backgroundColor: '#dc3545',
    borderRadius: 4,
    marginLeft: 5,
  },
  buttonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  todoButton: {
    flex: 1,
  },
});

export default TodoList;
