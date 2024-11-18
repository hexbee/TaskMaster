import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  addMonths,
  subMonths,
  isSameDay,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isToday,
} from 'date-fns';
import { useTodo } from '../context/TodoContext';

export function Calendar() {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const { todos, filters, setFilters } = useTodo();

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const weeks = useMemo(() => {
    const weeks = [];
    let currentWeek = [];

    days.forEach((day) => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });

    return weeks;
  }, [days]);

  const getTasksForDate = (date: Date) => {
    return todos.filter(
      (todo) =>
        isSameDay(new Date(todo.startTime), date) ||
        (todo.endTime && isSameDay(new Date(todo.endTime), date))
    );
  };

  const handleDateClick = (date: Date) => {
    setFilters({
      ...filters,
      selectedDate: isSameDay(filters.selectedDate || new Date(0), date) ? null : date,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentDate(subMonths(currentDate, 1))}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-lg font-semibold">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <button
          onClick={() => setCurrentDate(addMonths(currentDate, 1))}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-500 py-1"
          >
            {day}
          </div>
        ))}

        {weeks.map((week, weekIndex) =>
          week.map((day, dayIndex) => {
            const tasksForDay = getTasksForDate(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isSelected = filters.selectedDate && isSameDay(day, filters.selectedDate);

            return (
              <button
                key={`${weekIndex}-${dayIndex}`}
                onClick={() => handleDateClick(day)}
                className={`aspect-square p-1 relative transition-colors ${
                  !isCurrentMonth ? 'text-gray-400' : ''
                } ${isToday(day) ? 'bg-blue-50' : ''}
                ${isSelected ? 'bg-blue-100 font-semibold' : 'hover:bg-gray-50'}
                ${tasksForDay.length > 0 ? 'font-medium' : ''}`}
              >
                <span className="text-sm">{format(day, 'd')}</span>
                {tasksForDay.length > 0 && (
                  <div className="absolute bottom-1 right-1 flex gap-0.5">
                    {tasksForDay.slice(0, 3).map((_, i) => (
                      <div
                        key={i}
                        className={`w-1 h-1 rounded-full ${
                          isSelected ? 'bg-blue-600' : 'bg-blue-500'
                        }`}
                      />
                    ))}
                    {tasksForDay.length > 3 && (
                      <div
                        className={`w-1 h-1 rounded-full ${
                          isSelected ? 'bg-blue-400' : 'bg-gray-300'
                        }`}
                      />
                    )}
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>

      {filters.selectedDate && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-600">
              Tasks for {format(filters.selectedDate, 'MMM d, yyyy')}:
            </h3>
            <button
              onClick={() => setFilters({ ...filters, selectedDate: null })}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear selection
            </button>
          </div>
          <div className="space-y-1">
            {getTasksForDate(filters.selectedDate).length > 0 ? (
              getTasksForDate(filters.selectedDate).map((todo) => (
                <div
                  key={todo.id}
                  className="text-sm px-2 py-1.5 rounded bg-gray-50 flex items-center justify-between"
                >
                  <span className={todo.completed ? 'line-through text-gray-500' : ''}>
                    {todo.text}
                  </span>
                  <span className="text-xs text-gray-500">
                    {format(new Date(todo.startTime), 'h:mm a')}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-2">
                No tasks for this date
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}