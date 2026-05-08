import { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { listenToActiveOrders, updateOrderStatus } from '../../src/services/orderService';
import { Order, OrderStatus } from '../../src/types';

const FILTERS: { label: string; value: OrderStatus | 'ALL' }[] = [
  { label: 'Barchasi', value: 'ALL' },
  { label: 'Yangi', value: 'NEW' },
  { label: 'Jarayonda', value: 'COOKING' },
  { label: 'Tayyor', value: 'READY' },
];

export default function OrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<OrderStatus | 'ALL'>('ALL');

  useEffect(() => {
    const unsub = listenToActiveOrders(setOrders);
    return unsub;
  }, []);

  const filtered = filter === 'ALL' ? orders : orders.filter((o) => o.status === filter);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 Buyurtmalar</Text>

      <View style={styles.filters}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.value}
            style={[styles.filterBtn, filter === f.value && styles.filterActive]}
            onPress={() => setFilter(f.value)}
          >
            <Text style={[styles.filterText, filter === f.value && styles.filterTextActive]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardTop}>
              <Text style={styles.table}>{item.tableNumber}-stol</Text>
              <Text style={styles.total}>{item.total.toLocaleString()} so'm</Text>
            </View>
            {item.items.map((i) => (
              <Text key={i.id} style={styles.item}>{i.name} × {i.qty}</Text>
            ))}
            <View style={styles.cardBottom}>
              <Text style={[styles.status, {
                color: item.status === 'NEW' ? '#F5A623' : item.status === 'COOKING' ? '#4A90E2' : '#4CAF50'
              }]}>{item.status}</Text>
              <Text style={[styles.payment, { color: item.paymentStatus === 'PAID' ? '#4CAF50' : '#F5A623' }]}>
                {item.paymentStatus}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050D12', paddingTop: 56 },
  title: { color: '#fff', fontSize: 24, fontWeight: '800', paddingHorizontal: 20, marginBottom: 16 },
  filters: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 8 },
  filterBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 99, backgroundColor: '#0D1F2D' },
  filterActive: { backgroundColor: '#E8925A' },
  filterText: { color: '#aaa', fontSize: 13, fontWeight: '600' },
  filterTextActive: { color: '#fff' },
  card: { backgroundColor: '#0D1F2D', borderRadius: 14, padding: 16, marginBottom: 10 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  table: { color: '#fff', fontSize: 16, fontWeight: '700' },
  total: { color: '#E8925A', fontWeight: '700' },
  item: { color: '#aaa', fontSize: 13, marginBottom: 2 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  status: { fontWeight: '700', fontSize: 13 },
  payment: { fontWeight: '700', fontSize: 13 },
});
