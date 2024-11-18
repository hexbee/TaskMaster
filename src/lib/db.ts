import { openDB, DBSchema, IDBPDatabase } from 'idb';
import bcrypt from 'bcryptjs';
import { Todo } from '../types';

interface TaskMasterDB extends DBSchema {
  users: {
    key: string;
    value: {
      id: string;
      email: string;
      password: string;
      createdAt: Date;
    };
    indexes: { 'by-email': string };
  };
  todos: {
    key: string;
    value: Todo & { userId: string };
    indexes: { 'by-user': string };
  };
}

let db: IDBPDatabase<TaskMasterDB>;

async function getDB() {
  if (!db) {
    db = await openDB<TaskMasterDB>('taskmaster', 1, {
      upgrade(db) {
        const userStore = db.createObjectStore('users', { keyPath: 'id' });
        userStore.createIndex('by-email', 'email', { unique: true });

        const todoStore = db.createObjectStore('todos', { keyPath: 'id' });
        todoStore.createIndex('by-user', 'userId');
      },
    });
  }
  return db;
}

export interface User {
  id: string;
  email: string;
}

export const auth = {
  async signUp(email: string, password: string): Promise<User> {
    const db = await getDB();
    const existingUser = await db.getFromIndex('users', 'by-email', email);
    
    if (existingUser) {
      throw new Error('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = crypto.randomUUID();
    const user = {
      id: userId,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    };

    await db.add('users', user);
    return { id: userId, email };
  },

  async signIn(email: string, password: string): Promise<User> {
    const db = await getDB();
    const user = await db.getFromIndex('users', 'by-email', email);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new Error('Invalid email or password');
    }

    return { id: user.id, email: user.email };
  }
};

export const todos = {
  async getAll(userId: string): Promise<Todo[]> {
    const db = await getDB();
    const todos = await db.getAllFromIndex('todos', 'by-user', userId);
    return todos.map(({ userId, ...todo }) => todo);
  },

  async add(todo: Omit<Todo, 'id' | 'createdAt'> & { userId: string }): Promise<Todo> {
    const db = await getDB();
    const id = crypto.randomUUID();
    const newTodo = {
      id,
      ...todo,
      createdAt: new Date()
    };

    await db.add('todos', newTodo);
    const { userId, ...todoData } = newTodo;
    return todoData;
  },

  async update(id: string, userId: string, updates: Partial<Todo>): Promise<void> {
    const db = await getDB();
    const todo = await db.get('todos', id);
    
    if (!todo || todo.userId !== userId) {
      throw new Error('Todo not found');
    }

    await db.put('todos', {
      ...todo,
      ...updates,
    });
  },

  async delete(id: string, userId: string): Promise<void> {
    const db = await getDB();
    const todo = await db.get('todos', id);
    
    if (!todo || todo.userId !== userId) {
      throw new Error('Todo not found');
    }

    await db.delete('todos', id);
  }
};