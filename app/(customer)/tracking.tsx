import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { listenToOrder } from '../../src/services/orderService';
import { Order } from '../../src/types';

const STATUS_LABELS = {
  NEW: { label: 'Buyurtmangiz qabul qilindi', emoji: '⏳', progress: 0.33 },
  COOKING: { label: 'Tayyorlanmoqda...', emoji: '👨‍🍳', progress: 0.66 },
  READY: { label: 'Buyurtmangiz Tayyor!', emoji: '🥳', progress: 1 },
  DONE: { label: 'Yakunlandi', emoji: '✅', progress: 1 },
};

export default function TrackingScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!orderId) return;
    const unsub = listenToOrder(orderId, setOrder);
    return unsub;
  }, [orderId]);

  if (!order) return (
    <View style={styles.container}>
      <Text style={styles.loading}>Yuklanmoqda...</Text>
    </View>
  );

  const statusInfo = STATUS_LABELS[order.status];

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{statusInfo.emoji}</Text>
      <Text style={styles.statusText}>{statusInfo.label}</Text>
      <Text style={styles.table}>{order.tableNumber}-stol</Text>

      <View style={styles.progressBg}>
        <View style={[styles.progressFill, { width: `${statusInfo.progress * 100}%` }]} />
      </View>

      {order.status === 'NEW' && (
        <Text style={styles.eta}>⏱ Taxminiy vaqt: {order.estimatedTime} daqiqa</Text>
      )}

      {(order.status === 'READY' || order.status === 'DONE') && (
        <>
          <View style={styles.itemsList}>
            {order.items.map((item) => (
              <View key={item.id} style={styles.itemRow}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDetail}>{item.qty} ta • {(item.price * item.qty).toLocaleString()} so'm</Text>
              </View>
            ))}
            <View style={styles.divider} />
            <View style={styles.itemRow}>
              <Text style={styles.total}>Umumiy:</Text>
              <Text style={styles.totalVal}>{order.total.toLocaleString()} so'm</Text>
            </View>
          </View>

          {order.paymentStatus === 'PENDING' && (
            <TouchableOpacity
              style={styles.payBtn}
              onPress={() => router.push({ pathname: '/(customer)/payment', params: { orderId: order.id } })}
            >
              <Text style={styles.payBtnText}>To'lov qilish — {order.total.toLocaleString()} so'm</Text>
            </TouchableOpacity>
          )}

          {order.paymentStatus !== 'PENDING' && (
            <Text style={styles.paid}>✅ To'lov amalga oshirildi</Text>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050D12', alignItems: 'center', justifyContent: 'center', padding: 24 },
  loading: { color: '#fff', fontSize: 18 },
  emoji: { fontSize: 64, marginBottom: 16 },
  statusText: { color: '#fff', fontSize: 22, fontWeight: '700', textAlign: 'center', marginBottom: 8 },
  table: { color: '#E8925A', fontSize: 18, fontWeight: '600', marginBottom: 24 },
  progressBg: { width: '100%', height: 8, backgroundColor: '#1A2E3D', borderRadius: 99, marginBottom: 16 },
  progressFill: { height: 8, backgroundColor: '#E8925A', borderRadius: 99 },
  eta: { color: '#aaa', fontSize: 15, marginBottom: 24 },
  itemsList: { width: '100%', backgroundColor: '#0D1F2D', borderRadius: 16, padding: 16, marginBottom: 24 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  itemName: { color: '#fff', fontSize: 15 },
  itemDetail: { color: '#aaa', fontSize: 14 },
  divider: { height: 1, backgroundColor: '#1A2E3D', marginVertical: 10 },
  total: { color: '#aaa', fontSize: 16 },
  totalVal: { color: '#E8925A', fontSize: 17, fontWeight: '800' },
  payBtn: { width: '100%', backgroundColor: '#E8925A', borderRadius: 99, padding: 18, alignItems: 'center' },
  payBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  paid: { color: '#4CAF50', fontSize: 16, fontWeight: '600' },
});
