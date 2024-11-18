import React, { useState } from 'react';
import { Check, Trash2, Edit2, X, Save, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { Todo } from '../types';
import { useTodo } from '../context/TodoContext';
import { CategorySelect } from './CategorySelect';
import { DateTimeInput } from './DateTimeInput';
import { TaskStatus } from './TaskStatus';

interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
  const { toggleTodo, deleteTodo, editTodo } = useTodo();
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(todo.text);
  const [editedCategory, setEditedCategory] = useState(todo.category);
  const [editedStartTime, setEditedStartTime] = useState(todo.startTime);
  const [editedEndTime, setEditedEndTime] = useState(todo.endTime);

  const handleEdit = () => {
    if (editedText.trim()) {
      editTodo(todo.id, editedText, editedCategory, editedStartTime, editedEndTime);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedText(todo.text);
    setEditedCategory(todo.category);
    setEditedStartTime(todo.startTime);
    setEditedEndTime(todo.endTime);
    setIsEditing(false);
  };

  const formatDateTime = (date: Date) => {
    return format(date, 'MMM d, yyyy h:mm a');
  };

  return (
    <div className={`group bg-white shadow-sm border rounded-lg transition-all ${todo.completed ? 'bg-gray-50' : 'hover:shadow-md'}`}>
      {isEditing ? (
        <div className="p-4 space-y-4">
          <div className="flex gap-4">
            <input
              type="text"
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="flex-1 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <CategorySelect 
              value={editedCategory} 
              onChange={setEditedCategory}
              className="w-40"
            />
          </div>
          <div className="flex gap-4">
            <DateTimeInput
              label="Start Time"
              value={editedStartTime}
              onChange={setEditedStartTime}
              required
              className="flex-1"
            />
            <DateTimeInput
              label="End Time (optional)"
              value={editedEndTime}
              onChange={setEditedEndTime}
              className="flex-1"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={handleEdit}
              className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center gap-1"
            >
              <Save size={16} />
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center gap-1"
            >
              <X size={16} />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4">
          <div className="flex items-center gap-4 mb-3">
            <button
              onClick={() => toggleTodo(todo.id)}
              className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                todo.completed
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'border-gray-300 hover:border-green-500'
              }`}
            >
              {todo.completed && <Check size={14} />}
            </button>
            <span
              className={`flex-1 text-gray-800 ${
                todo.completed ? 'line-through text-gray-500' : ''
              }`}
            >
              {todo.text}
            </span>
            <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
              {todo.category}
            </span>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 text-blue-600 hover:text-blue-700"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="p-1 text-red-600 hover:text-red-700"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock size={14} />
              <span>{formatDateTime(todo.startTime)}</span>
              {todo.endTime && (
                <>
                  <span>→</span>
                  <span>{formatDateTime(todo.endTime)}</span>
                </>
              )}
            </div>
            <TaskStatus startTime={todo.startTime} endTime={todo.endTime} />
          </div>
        </div>
      )}
    </div>
  );
}