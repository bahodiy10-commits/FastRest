import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useCartStore } from '../../src/store/useCartStore';
import { createOrder } from '../../src/services/orderService';
import { useState } from 'react';
import { OrderType } from '../../src/types';

export default function CartScreen() {
  const { items, updateQty, removeItem, total, tableId, tableNumber, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const { type } = useLocalSearchParams<{ type: OrderType }>();

  const handleOrder = async () => {
    if (!tableId || !tableNumber || items.length === 0) return;
    setLoading(true);
    try {
      const orderId = await createOrder({
        tableId,
        tableNumber,
        items,
        total: total(),
        type: (type as OrderType) || 'dine_in',
        status: 'NEW',
        paymentStatus: 'PENDING',
        estimatedTime: 15,
        timestamp: Date.now(),
      });
      clearCart();
      router.replace({ pathname: '/(customer)/tracking', params: { orderId } });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Orqaga</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Savatcha</Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>{(item.price * item.qty).toLocaleString()} so'm</Text>
            </View>
            <View style={styles.qtyRow}>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(item.id, item.qty - 1)}>
                <Text style={styles.qtyBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.qty}>{item.qty}</Text>
              <TouchableOpacity style={[styles.qtyBtn, styles.addBtn]} onPress={() => updateQty(item.id, item.qty + 1)}>
                <Text style={styles.qtyBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={{ padding: 16, paddingBottom: 160 }}
      />

      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Jami:</Text>
          <Text style={styles.totalValue}>{total().toLocaleString()} so'm</Text>
        </View>
        <TouchableOpacity style={styles.btn} onPress={handleOrder} disabled={loading || items.length === 0}>
          <Text style={styles.btnText}>{loading ? 'Yuborilmoqda...' : 'Buyurtma berish'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050D12' },
  header: { paddingTop: 56, paddingHorizontal: 20, paddingBottom: 16, flexDirection: 'row', alignItems: 'center', gap: 16 },
  back: { color: '#E8925A', fontSize: 16 },
  title: { color: '#fff', fontSize: 22, fontWeight: '800' },
  row: { backgroundColor: '#0D1F2D', borderRadius: 14, padding: 16, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  info: { flex: 1 },
  name: { color: '#fff', fontSize: 15, fontWeight: '600', marginBottom: 4 },
  price: { color: '#E8925A', fontWeight: '700' },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  qtyBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#1A2E3D', alignItems: 'center', justifyContent: 'center' },
  addBtn: { backgroundColor: '#E8925A' },
  qtyBtnText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  qty: { color: '#fff', fontSize: 16, fontWeight: '700', minWidth: 24, textAlign: 'center' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#0D1F2D', padding: 24, borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  totalLabel: { color: '#aaa', fontSize: 16 },
  totalValue: { color: '#fff', fontSize: 20, fontWeight: '800' },
  btn: { backgroundColor: '#E8925A', borderRadius: 99, padding: 18, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 17 },
});
