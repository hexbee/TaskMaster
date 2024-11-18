import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDxkUVyXkXqHxFjGHziQbFxGKj-jeEe8ZE",
  authDomain: "taskmaster-bolt.firebaseapp.com",
  projectId: "taskmaster-bolt",
  storageBucket: "taskmaster-bolt.appspot.com",
  messagingSenderId: "839772361827",
  appId: "1:839772361827:web:9c9b9b8b8b8b8b8b8b8b8b"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);