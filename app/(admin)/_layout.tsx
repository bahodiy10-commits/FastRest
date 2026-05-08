import { Tabs } from 'expo-router';
import { Text } from 'react-native';

export default function AdminLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle: { backgroundColor: '#0D1F2D', borderTopColor: '#1A2E3D' },
      tabBarActiveTintColor: '#E8925A',
      tabBarInactiveTintColor: '#666',
    }}>
      <Tabs.Screen name="dashboard" options={{ title: 'Dashboard', tabBarIcon: ({ color }) => <Text style={{ color }}>📊</Text> }} />
      <Tabs.Screen name="orders" options={{ title: 'Buyurtmalar', tabBarIcon: ({ color }) => <Text style={{ color }}>📋</Text> }} />
      <Tabs.Screen name="tables" options={{ title: 'Stollar', tabBarIcon: ({ color }) => <Text style={{ color }}>🪑</Text> }} />
      <Tabs.Screen name="menu" options={{ title: 'Menyu', tabBarIcon: ({ color }) => <Text style={{ color }}>🍽</Text> }} />
      <Tabs.Screen name="settings" options={{ title: 'Sozlamalar', tabBarIcon: ({ color }) => <Text style={{ color }}>⚙️</Text> }} />
    </Tabs>
  );
}
