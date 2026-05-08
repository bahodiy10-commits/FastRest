import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useCartStore } from '../../src/store/useCartStore';
import { useState } from 'react';
import { OrderType } from '../../src/types';

export default function OrderTypeScreen() {
  const { tableNumber } = useCartStore();
  const [selected, setSelected] = useState<OrderType>('dine_in');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{tableNumber}-stol</Text>
      <Text style={styles.sub}>Buyurtma turini tanlang</Text>

      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.option, selected === 'dine_in' && styles.active]}
          onPress={() => setSelected('dine_in')}
        >
          <Text style={styles.icon}>🍽</Text>
          <Text style={[styles.optText, selected === 'dine_in' && styles.activeText]}>Shu yerda</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, selected === 'takeaway' && styles.active]}
          onPress={() => setSelected('takeaway')}
        >
          <Text style={styles.icon}>🛍</Text>
          <Text style={[styles.optText, selected === 'takeaway' && styles.activeText]}>Olib ketish</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => router.push({ pathname: '/(customer)/menu', params: { type: selected } })}
      >
        <Text style={styles.btnText}>Davom etish →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050D12', alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { color: '#E8925A', fontSize: 28, fontWeight: '800', marginBottom: 8 },
  sub: { color: '#aaa', fontSize: 16, marginBottom: 40 },
  row: { flexDirection: 'row', gap: 16, marginBottom: 40 },
  option: { width: 140, height: 140, backgroundColor: '#0D1F2D', borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'transparent' },
  active: { borderColor: '#E8925A', backgroundColor: '#1A2E3D' },
  icon: { fontSize: 40, marginBottom: 8 },
  optText: { color: '#aaa', fontSize: 16, fontWeight: '600' },
  activeText: { color: '#E8925A' },
  btn: { backgroundColor: '#E8925A', borderRadius: 99, paddingHorizontal: 48, paddingVertical: 16 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 18 },
});
