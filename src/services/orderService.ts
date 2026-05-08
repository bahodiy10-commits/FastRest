import { collection, addDoc, updateDoc, doc, onSnapshot, query, where, orderBy, getDoc } from 'firebase/firestore';
import { db } from '../constants/firebase';
import { Order, OrderStatus, PaymentStatus, PaymentMethod } from '../types';

export const createOrder = async (order: Omit<Order, 'id'>): Promise<string> => {
  const ref = await addDoc(collection(db, 'orders'), order);
  return ref.id;
};

export const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
  await updateDoc(doc(db, 'orders', orderId), { status });
};

export const updatePaymentStatus = async (
  orderId: string,
  paymentStatus: PaymentStatus,
  paymentMethod: PaymentMethod
) => {
  await updateDoc(doc(db, 'orders', orderId), { paymentStatus, paymentMethod });
};

export const listenToOrder = (orderId: string, callback: (order: Order) => void) => {
  return onSnapshot(doc(db, 'orders', orderId), (snap) => {
    if (snap.exists()) {
      callback({ id: snap.id, ...snap.data() } as Order);
    }
  });
};

export const listenToActiveOrders = (callback: (orders: Order[]) => void) => {
  const q = query(
    collection(db, 'orders'),
    where('status', 'in', ['NEW', 'COOKING', 'READY']),
    orderBy('timestamp', 'desc')
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order)));
  });
};
