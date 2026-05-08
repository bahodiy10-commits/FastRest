import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { onAuthChange, getUserRole } from '../src/services/authService';
import { useAuthStore } from '../src/store/useAuthStore';
import 'react-native-get-random-values';

export default function RootLayout() {
  const { setUser, setRole, setLoading } = useAuthStore();

  useEffect(() => {
    const unsub = onAuthChange(async (firebaseUser: any) => {
      if (firebaseUser) {
        const role = await getUserRole(firebaseUser.uid);
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          role,
          createdAt: Date.now(),
        });
        setRole(role);
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(customer)" />
        <Stack.Screen name="(admin)" />
        <Stack.Screen name="(kitchen)" />
      </Stack>
    </>
  );
}
