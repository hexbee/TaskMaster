import React from 'react';
import { Clock } from 'lucide-react';
import { differenceInDays, isFuture, isPast, isToday } from 'date-fns';

interface TaskStatusProps {
  startTime: Date;
  endTime?: Date;
}

export function TaskStatus({ startTime, endTime }: TaskStatusProps) {
  const now = new Date();
  const getStatus = () => {
    if (isFuture(startTime)) {
      const daysUntilStart = differenceInDays(startTime, now);
      return {
        message: `Starts in ${daysUntilStart} day${daysUntilStart !== 1 ? 's' : ''}`,
        color: 'text-blue-600 bg-blue-50',
      };
    }

    if (endTime) {
      if (isPast(endTime)) {
        const daysOverdue = differenceInDays(now, endTime);
        return {
          message: `${daysOverdue} day${daysOverdue !== 1 ? 's' : ''} overdue`,
          color: 'text-red-600 bg-red-50',
        };
      }
      
      if (isToday(endTime)) {
        return {
          message: 'Due today',
          color: 'text-amber-600 bg-amber-50',
        };
      }

      const daysUntilDue = differenceInDays(endTime, now);
      return {
        message: `${daysUntilDue} day${daysUntilDue !== 1 ? 's' : ''} remaining`,
        color: 'text-green-600 bg-green-50',
      };
    }

    if (isToday(startTime)) {
      return {
        message: 'Starts today',
        color: 'text-emerald-600 bg-emerald-50',
      };
    }

    return {
      message: 'In progress',
      color: 'text-purple-600 bg-purple-50',
    };
  };

  const status = getStatus();

  return (
    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-sm ${status.color}`}>
      <Clock size={14} />
      <span>{status.message}</span>
    </div>
  );
}