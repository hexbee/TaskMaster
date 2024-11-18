import React, { createContext, useContext, useState, useEffect } from 'react';
import { todos } from '../lib/db';
import { useAuth } from './AuthContext';
import { Todo, TodoContextType, TodoFilters } from '../types';

const TodoContext = createContext<TodoContextType | undefined>(undefined);

const initialFilters: TodoFilters = {
  search: '',
  category: null,
  status: 'all',
  dateRange: {
    start: null,
    end: null,
  },
  selectedDate: null,
};

export function TodoProvider({ children }: { children: React.ReactNode }) {
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [filters, setFilters] = useState<TodoFilters>(initialFilters);
  const { user } = useAuth();

  useEffect(() => {
    async function loadTodos() {
      if (user) {
        const loadedTodos = await todos.getAll(user.id);
        setTodoList(loadedTodos);
      } else {
        setTodoList([]);
      }
    }
    loadTodos();
  }, [user]);

  const addTodo = async (text: string, category: string, startTime: Date, endTime?: Date) => {
    if (!user) return;

    const newTodo = await todos.add({
      text,
      completed: false,
      category,
      startTime,
      endTime,
      userId: user.id
    });

    setTodoList(prev => [newTodo, ...prev]);
  };

  const toggleTodo = async (id: string) => {
    if (!user) return;

    const todo = todoList.find(t => t.id === id);
    if (todo) {
      await todos.update(id, user.id, { completed: !todo.completed });
      setTodoList(prev => prev.map(t => 
        t.id === id ? { ...t, completed: !t.completed } : t
      ));
    }
  };

  const deleteTodo = async (id: string) => {
    if (!user) return;

    await todos.delete(id, user.id);
    setTodoList(prev => prev.filter(t => t.id !== id));
  };

  const editTodo = async (id: string, text: string, category: string, startTime: Date, endTime?: Date) => {
    if (!user) return;

    await todos.update(id, user.id, { text, category, startTime, endTime });
    setTodoList(prev => prev.map(t =>
      t.id === id ? { ...t, text, category, startTime, endTime } : t
    ));
  };

  const exportTodos = () => {
    const exportData = todoList.map(({ id, text, completed, category, startTime, endTime, createdAt }) => ({
      text,
      completed,
      category,
      startTime,
      endTime,
      createdAt
    }));
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `taskmaster-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importTodos = async (importedTodos: Omit<Todo, 'id'>[]) => {
    if (!user) return;

    const importPromises = importedTodos.map(todo => 
      todos.add({
        ...todo,
        userId: user.id
      })
    );

    const newTodos = await Promise.all(importPromises);
    setTodoList(prev => [...newTodos, ...prev]);
  };

  return (
    <TodoContext.Provider
      value={{ 
        todos: todoList, 
        filters, 
        setFilters, 
        addTodo, 
        toggleTodo, 
        deleteTodo, 
        editTodo,
        exportTodos,
        importTodos
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}

export function useTodo() {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
}