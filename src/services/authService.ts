import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../constants/firebase';
import { User, UserRole } from '../types';

export const loginUser = async (email: string, password: string): Promise<User> => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  const userDoc = await getDoc(doc(db, 'users', result.user.uid));
  if (userDoc.exists()) {
    return userDoc.data() as User;
  }
  throw new Error('Foydalanuvchi topilmadi');
};

export const logoutUser = async () => {
  await signOut(auth);
};

export const getUserRole = async (uid: string): Promise<UserRole> => {
  const userDoc = await getDoc(doc(db, 'users', uid));
  if (userDoc.exists()) {
    return userDoc.data().role as UserRole;
  }
  return 'customer';
};

export const createUser = async (uid: string, email: string, role: UserRole) => {
  await setDoc(doc(db, 'users', uid), {
    uid, email, role, createdAt: Date.now(),
  });
};

export const onAuthChange = (callback: (user: any) => void) => {
  return onAuthStateChanged(auth, callback);
};
