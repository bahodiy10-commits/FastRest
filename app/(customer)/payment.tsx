import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { updatePaymentStatus } from '../../src/services/orderService';
import { PaymentMethod } from '../../src/types';

const METHODS: { id: PaymentMethod; label: string; emoji: string }[] = [
  { id: 'click', label: 'Click', emoji: '💳' },
  { id: 'payme', label: 'Payme', emoji: '💳' },
  { id: 'uzum', label: 'Uzum', emoji: '💳' },
  { id: 'cash', label: 'Naqt', emoji: '💵' },
];

export default function PaymentScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const [selected, setSelected] = useState<PaymentMethod | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    if (!selected || !orderId) return;
    setLoading(true);
    try {
      if (selected === 'cash') {
        await updatePaymentStatus(orderId, 'CASH', 'cash');
        Alert.alert('Naqt to\'lov', 'Kassaga boring va to\'lovni amalga oshiring', [
          { text: 'OK', onPress: () => router.replace('/(customer)/scanner') }
        ]);
      } else {
        await updatePaymentStatus(orderId, 'PAID', selected);
        Alert.alert('To\'lov', 'To\'lov muvaffaqiyatli amalga oshirildi!', [
          { text: 'OK', onPress: () => router.replace('/(customer)/scanner') }
        ]);
      }
    } catch (e) {
      Alert.alert('Xato', 'To\'lov amalga oshmadi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Text style={styles.back}>← Orqaga</Text>
      </TouchableOpacity>
      <Text style={styles.title}>To'lov usulini tanlang</Text>

      <View style={styles.methods}>
        {METHODS.map((m) => (
          <TouchableOpacity
            key={m.id}
            style={[styles.method, selected === m.id && styles.methodActive]}
            onPress={() => setSelected(m.id)}
          >
            <Text style={styles.methodEmoji}>{m.emoji}</Text>
            <Text style={[styles.methodLabel, selected === m.id && styles.methodLabelActive]}>{m.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.btn, !selected && styles.btnDisabled]}
        onPress={handlePay}
        disabled={!selected || loading}
      >
        <Text style={styles.btnText}>{loading ? 'Jarayonda...' : 'To\'lovni tasdiqlash'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050D12', padding: 24, paddingTop: 60 },
  backBtn: { marginBottom: 24 },
  back: { color: '#E8925A', fontSize: 16 },
  title: { color: '#fff', fontSize: 22, fontWeight: '800', marginBottom: 32 },
  methods: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginBottom: 40 },
  method: { width: '47%', backgroundColor: '#0D1F2D', borderRadius: 16, padding: 20, alignItems: 'center', borderWidth: 2, borderColor: 'transparent' },
  methodActive: { borderColor: '#E8925A', backgroundColor: '#1A2E3D' },
  methodEmoji: { fontSize: 32, marginBottom: 8 },
  methodLabel: { color: '#aaa', fontSize: 16, fontWeight: '600' },
  methodLabelActive: { color: '#E8925A' },
  btn: { backgroundColor: '#E8925A', borderRadius: 99, padding: 18, alignItems: 'center' },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 17 },
});
