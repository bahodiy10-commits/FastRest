import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '../constants/firebase';
import { Table } from '../types';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export const createTable = async (number: number, roomName?: string): Promise<Table> => {
  const token = uuidv4();
  const table: Omit<Table, 'id'> = {
    number,
    roomName: roomName || '',
    token,
    status: 'empty',
    isActive: true,
    createdAt: Date.now(),
  };
  const ref = await addDoc(collection(db, 'tables'), table);
  return { id: ref.id, ...table };
};

export const getTables = async (): Promise<Table[]> => {
  const snap = await getDocs(collection(db, 'tables'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Table));
};

export const getTableByToken = async (token: string): Promise<Table | null> => {
  const q = query(collection(db, 'tables'), where('token', '==', token), where('isActive', '==', true));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as Table;
};

export const deleteTable = async (tableId: string) => {
  await updateDoc(doc(db, 'tables', tableId), { isActive: false });
};
