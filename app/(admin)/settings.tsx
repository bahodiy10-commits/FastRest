import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../src/constants/firebase';
import { RestaurantSettings } from '../../src/types';

const DEFAULT: RestaurantSettings = {
  name: 'FastRest',
  logo: '',
  workingHours: '09:00 - 22:00',
  estimatedTime: 15,
  currency: "so'm",
  payments: {
    click: { enabled: false, merchantId: '' },
    payme: { enabled: false, merchantId: '' },
    uzum: { enabled: false, merchantId: '' },
    cash: { enabled: true },
  },
};

export default function SettingsScreen() {
  const [settings, setSettings] = useState<RestaurantSettings>(DEFAULT);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getDoc(doc(db, 'settings', 'main')).then((snap) => {
      if (snap.exists()) setSettings(snap.data() as RestaurantSettings);
    });
  }, []);

  const save = async () => {
    setLoading(true);
    await setDoc(doc(db, 'settings', 'main'), settings);
    setLoading(false);
    Alert.alert('Saqlandi', 'Sozlamalar muvaffaqiyatli saqlandi');
  };

  const setPayment = (key: keyof RestaurantSettings['payments'], field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      payments: { ...prev.payments, [key]: { ...prev.payments[key], [field]: value } },
    }));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>⚙️ Sozlamalar</Text>

      <Text style={styles.section}>Restoran ma'lumotlari</Text>
      <TextInput style={styles.input} placeholder="Restoran nomi" placeholderTextColor="#666" value={settings.name} onChangeText={(v) => setSettings({ ...settings, name: v })} />
      <TextInput style={styles.input} placeholder="Ish vaqti" placeholderTextColor="#666" value={settings.workingHours} onChangeText={(v) => setSettings({ ...settings, workingHours: v })} />
      <TextInput style={styles.input} placeholder="Taxminiy vaqt (daqiqa)" placeholderTextColor="#666" value={String(settings.estimatedTime)} onChangeText={(v) => setSettings({ ...settings, estimatedTime: parseInt(v) || 15 })} keyboardType="numeric" />

      <Text style={styles.section}>To'lov tizimlari</Text>

      {(['click', 'payme', 'uzum'] as const).map((key) => (
        <View key={key} style={styles.payRow}>
          <View style={styles.payLeft}>
            <Switch value={settings.payments[key].enabled} onValueChange={(v) => setPayment(key, 'enabled', v)} trackColor={{ true: '#E8925A' }} />
            <Text style={styles.payLabel}>{key.toUpperCase()}</Text>
          </View>
          <TextInput
            style={styles.payInput}
            placeholder="Merchant ID"
            placeholderTextColor="#555"
            value={settings.payments[key].merchantId}
            onChangeText={(v) => setPayment(key, 'merchantId', v)}
          />
        </View>
      ))}

      <View style={styles.payRow}>
        <View style={styles.payLeft}>
          <Switch value={settings.payments.cash.enabled} onValueChange={(v) => setPayment('cash', 'enabled', v)} trackColor={{ true: '#E8925A' }} />
          <Text style={styles.payLabel}>NAQT</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={save} disabled={loading}>
        <Text style={styles.saveBtnText}>{loading ? 'Saqlanmoqda...' : 'Saqlash'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050D12', paddingTop: 56 },
  title: { color: '#fff', fontSize: 24, fontWeight: '800', paddingHorizontal: 20, marginBottom: 16 },
  section: { color: '#E8925A', fontSize: 16, fontWeight: '700', paddingHorizontal: 16, marginTop: 16, marginBottom: 8 },
  input: { backgroundColor: '#0D1F2D', color: '#fff', borderRadius: 12, padding: 14, marginHorizontal: 16, marginBottom: 8, fontSize: 15 },
  payRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0D1F2D', marginHorizontal: 16, marginBottom: 8, borderRadius: 12, padding: 12, gap: 12 },
  payLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  payLabel: { color: '#fff', fontSize: 15, fontWeight: '600' },
  payInput: { flex: 1, color: '#fff', backgroundColor: '#1A2E3D', borderRadius: 8, padding: 10, fontSize: 14 },
  saveBtn: { backgroundColor: '#E8925A', borderRadius: 99, margin: 16, padding: 18, alignItems: 'center', marginBottom: 40 },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 17 },
});
