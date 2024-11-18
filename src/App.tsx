import React from 'react';
import { CheckCircle, LogOut } from 'lucide-react';
import { TodoProvider } from './context/TodoContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TodoList } from './components/TodoList';
import { TodoForm } from './components/TodoForm';
import { Calendar } from './components/Calendar';
import { AuthPages } from './components/AuthPages';

function Dashboard() {
  const { user, signOut } = useAuth();

  return (
    <TodoProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-12 px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <CheckCircle size={40} className="text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-900">TaskMaster</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">{user?.email}</span>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100"
              >
                <LogOut size={16} />
                Sign out
              </button>
            </div>
          </div>
          <div className="flex gap-8">
            <div className="flex-1">
              <TodoForm />
              <TodoList />
            </div>
            <div className="w-80 shrink-0">
              <Calendar />
            </div>
          </div>
        </div>
      </div>
    </TodoProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { user } = useAuth();
  return user ? <Dashboard /> : <AuthPages />;
}

export default App;