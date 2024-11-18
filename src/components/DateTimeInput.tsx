import React from 'react';
import { format } from 'date-fns';
import { X } from 'lucide-react';

interface DateTimeInputProps {
  value: Date | undefined | null;
  onChange: (date: Date | null) => void;
  label: string;
  required?: boolean;
  className?: string;
  allowClear?: boolean;
}

export function DateTimeInput({ 
  value, 
  onChange, 
  label, 
  required = false, 
  className = '',
  allowClear = false
}: DateTimeInputProps) {
  const formatForInput = (date: Date | undefined | null) => {
    if (!date) return '';
    return format(date, "yyyy-MM-dd'T'HH:mm");
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <label className="text-sm text-gray-600 mb-1">{label}</label>
      <div className="relative">
        <input
          type="datetime-local"
          value={formatForInput(value)}
          onChange={(e) => onChange(e.target.value ? new Date(e.target.value) : null)}
          required={required}
          className="w-full px-3 py-1.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {allowClear && value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}