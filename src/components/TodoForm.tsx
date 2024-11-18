import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { useTodo } from '../context/TodoContext';
import { CategorySelect } from './CategorySelect';
import { DateTimeInput } from './DateTimeInput';

export function TodoForm() {
  const { addTodo } = useTodo();
  const [text, setText] = useState('');
  const [category, setCategory] = useState('Personal');
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<Date | undefined>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      addTodo(text.trim(), category, startTime, endTime);
      setText('');
      setCategory('Personal');
      setStartTime(new Date());
      setEndTime(undefined);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border mb-8">
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <CategorySelect value={category} onChange={setCategory} />
      </div>
      <div className="flex items-end gap-4">
        <DateTimeInput
          label="Start Time"
          value={startTime}
          onChange={setStartTime}
          required
          className="flex-1"
        />
        <DateTimeInput
          label="End Time (optional)"
          value={endTime}
          onChange={setEndTime}
          className="flex-1"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2"
        >
          <PlusCircle size={20} />
          Add Task
        </button>
      </div>
    </form>
  );
}