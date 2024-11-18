export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  category: string;
  startTime: Date;
  endTime?: Date;
  createdAt: Date;
}

export interface TodoFilters {
  search: string;
  category: string | null;
  status: 'all' | 'active' | 'completed';
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  selectedDate: Date | null;
}

export type TodoContextType = {
  todos: Todo[];
  filters: TodoFilters;
  setFilters: (filters: TodoFilters) => void;
  addTodo: (text: string, category: string, startTime: Date, endTime?: Date) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  editTodo: (id: string, text: string, category: string, startTime: Date, endTime?: Date) => void;
  exportTodos: () => void;
  importTodos: (todos: Omit<Todo, 'id'>[]) => void;
};