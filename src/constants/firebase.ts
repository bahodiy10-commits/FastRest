import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyARexBtYfSJTnSod24OQudviRQvWGjEKvM",
  authDomain: "fastrest-7b5aa.firebaseapp.com",
  projectId: "fastrest-7b5aa",
  storageBucket: "fastrest-7b5aa.firebasestorage.app",
  messagingSenderId: "711659144425",
  appId: "1:711659144425:web:924ba0e8a424f44cf81c78"
};

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
