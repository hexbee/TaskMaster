import React, { useMemo } from 'react';
import { isSameDay, isWithinInterval } from 'date-fns';
import { Download, Upload } from 'lucide-react';
import { useTodo } from '../context/TodoContext';
import { TodoItem } from './TodoItem';
import { TodoFilters } from './TodoFilters';
import { Todo } from '../types';

export function TodoList() {
  const { todos, filters, importTodos, exportTodos } = useTodo();

  const filteredTodos = useMemo(() => {
    return todos.filter((todo: Todo) => {
      if (filters.search && !todo.text.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      if (filters.category && todo.category !== filters.category) {
        return false;
      }

      if (filters.status === 'active' && todo.completed) return false;
      if (filters.status === 'completed' && !todo.completed) return false;

      if (filters.selectedDate) {
        const hasStartTimeOnDate = isSameDay(new Date(todo.startTime), filters.selectedDate);
        const hasEndTimeOnDate = todo.endTime && isSameDay(new Date(todo.endTime), filters.selectedDate);
        if (!hasStartTimeOnDate && !hasEndTimeOnDate) return false;
      }

      if (filters.dateRange.start && filters.dateRange.end) {
        const todoStart = new Date(todo.startTime);
        const todoEnd = todo.endTime ? new Date(todo.endTime) : todoStart;
        
        const isInRange = isWithinInterval(todoStart, {
          start: filters.dateRange.start,
          end: filters.dateRange.end
        }) || isWithinInterval(todoEnd, {
          start: filters.dateRange.start,
          end: filters.dateRange.end
        });
        
        if (!isInRange) return false;
      }

      return true;
    });
  }, [todos, filters]);

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const tasks = JSON.parse(e.target?.result as string);
          importTodos(tasks);
        } catch (error) {
          alert('Invalid file format. Please upload a valid JSON file.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <TodoFilters />
        <div className="flex gap-2">
          <button
            onClick={exportTodos}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Download size={16} />
            Export Tasks
          </button>
          <label className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer">
            <Upload size={16} />
            Import Tasks
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>
      </div>
      
      {filteredTodos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No tasks found matching your filters</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTodos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </div>
      )}
    </div>
  );
}