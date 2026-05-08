import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { listenToActiveOrders } from '../../src/services/orderService';
import { Order } from '../../src/types';
import { logoutUser } from '../../src/services/authService';
import { useAuthStore } from '../../src/store/useAuthStore';
import { router } from 'expo-router';

export default function DashboardScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const { logout } = useAuthStore();

  useEffect(() => {
    const unsub = listenToActiveOrders(setOrders);
    return unsub;
  }, []);

  const newOrders = orders.filter((o) => o.status === 'NEW').length;
  const cookingOrders = orders.filter((o) => o.status === 'COOKING').length;
  const readyOrders = orders.filter((o) => o.status === 'READY').length;
  const totalRevenue = orders.filter((o) => o.paymentStatus === 'PAID').reduce((s, o) => s + o.total, 0);

  const handleLogout = async () => {
    await logoutUser();
    logout();
    router.replace('/(auth)/login');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📊 Dashboard</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logout}>Chiqish</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        <View style={[styles.card, { borderColor: '#F5A623' }]}>
          <Text style={styles.cardNum}>{newOrders}</Text>
          <Text style={styles.cardLabel}>🆕 Yangi</Text>
        </View>
        <View style={[styles.card, { borderColor: '#4A90E2' }]}>
          <Text style={styles.cardNum}>{cookingOrders}</Text>
          <Text style={styles.cardLabel}>👨‍🍳 Jarayonda</Text>
        </View>
        <View style={[styles.card, { borderColor: '#4CAF50' }]}>
          <Text style={styles.cardNum}>{readyOrders}</Text>
          <Text style={styles.cardLabel}>✅ Tayyor</Text>
        </View>
        <View style={[styles.card, { borderColor: '#E8925A' }]}>
          <Text style={styles.cardNum}>{totalRevenue.toLocaleString()}</Text>
          <Text style={styles.cardLabel}>💰 Tushum</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Faol buyurtmalar</Text>
      {orders.length === 0 ? (
        <Text style={styles.empty}>Hozircha buyurtma yo'q</Text>
      ) : (
        orders.map((o) => (
          <View key={o.id} style={styles.orderCard}>
            <Text style={styles.orderTable}>{o.tableNumber}-stol</Text>
            <Text style={styles.orderTotal}>{o.total.toLocaleString()} so'm</Text>
            <Text style={[styles.orderStatus, { color: o.status === 'NEW' ? '#F5A623' : o.status === 'COOKING' ? '#4A90E2' : '#4CAF50' }]}>
              {o.status}
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050D12' },
  header: { paddingTop: 56, paddingHorizontal: 20, paddingBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: '#fff', fontSize: 24, fontWeight: '800' },
  logout: { color: '#E8925A', fontSize: 14 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', padding: 12, gap: 12 },
  card: { width: '47%', backgroundColor: '#0D1F2D', borderRadius: 16, padding: 20, borderWidth: 2, alignItems: 'center' },
  cardNum: { color: '#fff', fontSize: 28, fontWeight: '800', marginBottom: 4 },
  cardLabel: { color: '#aaa', fontSize: 14 },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: '700', paddingHorizontal: 20, marginTop: 8, marginBottom: 12 },
  empty: { color: '#555', textAlign: 'center', padding: 20 },
  orderCard: { backgroundColor: '#0D1F2D', marginHorizontal: 16, marginBottom: 8, borderRadius: 12, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderTable: { color: '#fff', fontSize: 15, fontWeight: '600' },
  orderTotal: { color: '#E8925A', fontWeight: '700' },
  orderStatus: { fontWeight: '700', fontSize: 13 },
});
