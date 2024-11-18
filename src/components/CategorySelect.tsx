import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface CategorySelectProps {
  value: string;
  onChange: (category: string) => void;
  className?: string;
  includeAll?: boolean;
}

export const defaultCategories = ['Work', 'Personal', 'Shopping', 'Health'];

export function CategorySelect({ value, onChange, className = '', includeAll = false }: CategorySelectProps) {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [customCategory, setCustomCategory] = useState('');

  const categories = includeAll ? ['All Categories', ...defaultCategories] : defaultCategories;

  const handleCategorySelect = (selectedCategory: string) => {
    onChange(selectedCategory);
    setCustomCategory('');
    setIsSelectOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <div 
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 cursor-pointer hover:border-gray-400"
        onClick={() => setIsSelectOpen(!isSelectOpen)}
      >
        <span>{value}</span>
        <ChevronDown size={16} className={`transition-transform ${isSelectOpen ? 'rotate-180' : ''}`} />
      </div>
      
      {isSelectOpen && (
        <div className="absolute z-10 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategorySelect(cat)}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-lg"
            >
              {cat}
            </button>
          ))}
          {!includeAll && (
            <div className="px-4 py-2 border-t">
              <input
                type="text"
                value={customCategory}
                onChange={(e) => {
                  setCustomCategory(e.target.value);
                  if (e.target.value) {
                    onChange(e.target.value);
                  }
                }}
                placeholder="Custom category..."
                className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}