import { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { listenToActiveOrders, updateOrderStatus } from '../../src/services/orderService';
import { Order } from '../../src/types';
import { logoutUser } from '../../src/services/authService';
import { useAuthStore } from '../../src/store/useAuthStore';
import { router } from 'expo-router';

const STATUS_COLORS = {
  NEW: '#F5A623',
  COOKING: '#4A90E2',
  READY: '#4CAF50',
  DONE: '#888',
};

export default function KitchenDisplay() {
  const [orders, setOrders] = useState<Order[]>([]);
  const { logout } = useAuthStore();

  useEffect(() => {
    const unsub = listenToActiveOrders(setOrders);
    return unsub;
  }, []);

  const handleReady = async (orderId: string) => {
    await updateOrderStatus(orderId, 'READY');
  };

  const handleCooking = async (orderId: string) => {
    await updateOrderStatus(orderId, 'COOKING');
  };

  const handleLogout = async () => {
    await logoutUser();
    logout();
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🍳 Oshxona</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logout}>Chiqish</Text>
        </TouchableOpacity>
      </View>

      {orders.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Hozircha buyurtma yo'q</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(i) => i.id}
          numColumns={2}
          contentContainerStyle={{ padding: 12 }}
          renderItem={({ item }) => (
            <View style={[styles.card, { borderColor: STATUS_COLORS[item.status] }]}>
              <View style={[styles.cardHeader, { backgroundColor: STATUS_COLORS[item.status] + '33' }]}>
                <Text style={styles.cardTitle}>
                  {item.status === 'NEW' ? '🆕' : item.status === 'COOKING' ? '👨‍🍳' : '✅'} {item.tableNumber}-STOL
                </Text>
                <Text style={styles.cardType}>{item.type === 'dine_in' ? 'Shu yerda' : 'Olib ketish'}</Text>
              </View>

              {item.items.map((i) => (
                <View key={i.id} style={styles.itemRow}>
                  <Text style={styles.itemName}>{i.name}</Text>
                  <Text style={styles.itemQty}>{i.qty} ta</Text>
                  <Text style={styles.itemPrice}>{(i.price * i.qty).toLocaleString()}</Text>
                </View>
              ))}

              <View style={styles.divider} />
              <Text style={styles.total}>Jami: {item.total.toLocaleString()} so'm</Text>

              {item.status === 'NEW' && (
                <TouchableOpacity style={[styles.btn, { backgroundColor: '#4A90E2' }]} onPress={() => handleCooking(item.id)}>
                  <Text style={styles.btnText}>👨‍🍳 Tayyorlanmoqda</Text>
                </TouchableOpacity>
              )}
              {item.status === 'COOKING' && (
                <TouchableOpacity style={[styles.btn, { backgroundColor: '#4CAF50' }]} onPress={() => handleReady(item.id)}>
                  <Text style={styles.btnText}>✅ Buyurtma Tayyor</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  header: { paddingTop: 52, paddingHorizontal: 20, paddingBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: '#39FF14', fontSize: 26, fontWeight: '800' },
  logout: { color: '#888', fontSize: 14 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: '#555', fontSize: 18 },
  card: { flex: 1, margin: 8, backgroundColor: '#111', borderRadius: 16, borderWidth: 2, overflow: 'hidden' },
  cardHeader: { padding: 12, marginBottom: 8 },
  cardTitle: { color: '#fff', fontSize: 18, fontWeight: '800' },
  cardType: { color: '#aaa', fontSize: 13, marginTop: 2 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12, marginBottom: 4 },
  itemName: { color: '#fff', fontSize: 14, flex: 1 },
  itemQty: { color: '#aaa', fontSize: 14, marginHorizontal: 8 },
  itemPrice: { color: '#39FF14', fontSize: 14 },
  divider: { height: 1, backgroundColor: '#222', marginVertical: 8, marginHorizontal: 12 },
  total: { color: '#fff', fontSize: 15, fontWeight: '700', paddingHorizontal: 12, marginBottom: 12 },
  btn: { margin: 12, borderRadius: 10, padding: 12, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
