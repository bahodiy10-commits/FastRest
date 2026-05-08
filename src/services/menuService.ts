import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db, storage } from '../constants/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { MenuItem, Category } from '../types';

export const getCategories = async (): Promise<Category[]> => {
  const snap = await getDocs(collection(db, 'categories'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Category));
};

export const addCategory = async (name: string, order: number) => {
  await addDoc(collection(db, 'categories'), { name, order });
};

export const listenToMenu = (callback: (items: MenuItem[]) => void) => {
  return onSnapshot(collection(db, 'menu'), (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as MenuItem)));
  });
};

export const addMenuItem = async (item: Omit<MenuItem, 'id'>) => {
  await addDoc(collection(db, 'menu'), item);
};

export const updateMenuItem = async (id: string, data: Partial<MenuItem>) => {
  await updateDoc(doc(db, 'menu', id), data);
};

export const deleteMenuItem = async (id: string) => {
  await deleteDoc(doc(db, 'menu', id));
};

export const uploadMenuImage = async (uri: string, name: string): Promise<string> => {
  const response = await fetch(uri);
  const blob = await response.blob();
  const storageRef = ref(storage, `menu/${name}_${Date.now()}`);
  await uploadBytes(storageRef, blob);
  return await getDownloadURL(storageRef);
};
