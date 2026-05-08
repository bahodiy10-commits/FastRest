import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '../src/store/useAuthStore';

export default function Index() {
  const { user, role, isLoading } = useAuthStore();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace('/(auth)/login');
    } else if (role === 'admin') {
      router.replace('/(admin)/dashboard');
    } else if (role === 'kitchen') {
      router.replace('/(kitchen)/display');
    } else {
      router.replace('/(customer)/scanner');
    }
  }, [user, role, isLoading]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#050D12' }}>
      <ActivityIndicator size="large" color="#E8925A" />
    </View>
  );
}
