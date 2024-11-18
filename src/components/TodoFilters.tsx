import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { useTodo } from '../context/TodoContext';
import { CategorySelect, defaultCategories } from './CategorySelect';
import { DateTimeInput } from './DateTimeInput';
import { TodoFilters as TodoFiltersType } from '../types';

export function TodoFilters() {
  const { filters, setFilters } = useTodo();

  const resetFilters = () => {
    setFilters({
      search: '',
      category: null,
      status: 'all',
      dateRange: {
        start: null,
        end: null,
      },
      selectedDate: null,
    });
  };

  const updateFilters = (updates: Partial<TodoFiltersType>) => {
    setFilters({ ...filters, ...updates });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
            placeholder="Search tasks..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <CategorySelect
          value={filters.category || 'All Categories'}
          onChange={(category) => updateFilters({ category: category === 'All Categories' ? null : category })}
          className="w-48"
          includeAll
        />
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-400" />
          <select
            value={filters.status}
            onChange={(e) => updateFilters({ status: e.target.value as TodoFiltersType['status'] })}
            className="px-3 py-1.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2 flex-1">
          <DateTimeInput
            label="From"
            value={filters.dateRange.start}
            onChange={(date) => updateFilters({ 
              dateRange: { ...filters.dateRange, start: date }
            })}
            className="flex-1"
            allowClear
          />
          <DateTimeInput
            label="To"
            value={filters.dateRange.end}
            onChange={(date) => updateFilters({ 
              dateRange: { ...filters.dateRange, end: date }
            })}
            className="flex-1"
            allowClear
          />
        </div>

        <button
          onClick={resetFilters}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
        >
          <X size={16} />
          Clear Filters
        </button>
      </div>
    </div>
  );
}