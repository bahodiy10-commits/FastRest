import { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { getTables, createTable, deleteTable } from '../../src/services/tableService';
import { Table } from '../../src/types';
import QRCode from 'react-native-qrcode-svg';

export default function TablesScreen() {
  const [tables, setTables] = useState<Table[]>([]);
  const [number, setNumber] = useState('');
  const [room, setRoom] = useState('');
  const [loading, setLoading] = useState(false);

  const loadTables = async () => {
    const data = await getTables();
    setTables(data.filter((t) => t.isActive));
  };

  useEffect(() => { loadTables(); }, []);

  const handleAdd = async () => {
    if (!number) return;
    setLoading(true);
    await createTable(parseInt(number), room);
    setNumber('');
    setRoom('');
    await loadTables();
    setLoading(false);
  };

  const handleDelete = (id: string) => {
    Alert.alert('O\'chirish', 'Stolni o\'chirmoqchimisiz?', [
      { text: 'Bekor', style: 'cancel' },
      { text: 'O\'chirish', style: 'destructive', onPress: async () => { await deleteTable(id); loadTables(); } },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🪑 Stollar</Text>

      <View style={styles.form}>
        <TextInput style={styles.input} placeholder="Stol raqami" placeholderTextColor="#666" value={number} onChangeText={setNumber} keyboardType="numeric" />
        <TextInput style={styles.input} placeholder="Xona nomi (ixtiyoriy)" placeholderTextColor="#666" value={room} onChangeText={setRoom} />
        <TouchableOpacity style={styles.addBtn} onPress={handleAdd} disabled={loading}>
          <Text style={styles.addBtnText}>{loading ? '...' : '+ Qo\'shish'}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tables}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardLeft}>
              <Text style={styles.tableNum}>{item.number}-stol</Text>
              {item.roomName ? <Text style={styles.room}>{item.roomName}</Text> : null}
              <Text style={styles.token} numberOfLines={1}>{item.token.substring(0, 16)}...</Text>
            </View>
            <View style={styles.cardRight}>
              <QRCode value={`fastrest://table/${item.token}`} size={80} backgroundColor="transparent" color="#fff" />
              <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id)}>
                <Text style={styles.deleteBtnText}>O'chirish</Text>
              </TouchableOpacity>
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
  form: { paddingHorizontal: 16, marginBottom: 8 },
  input: { backgroundColor: '#0D1F2D', color: '#fff', borderRadius: 12, padding: 14, marginBottom: 8, fontSize: 15 },
  addBtn: { backgroundColor: '#E8925A', borderRadius: 12, padding: 14, alignItems: 'center' },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  card: { backgroundColor: '#0D1F2D', borderRadius: 14, padding: 16, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardLeft: { flex: 1 },
  cardRight: { alignItems: 'center', gap: 8 },
  tableNum: { color: '#fff', fontSize: 18, fontWeight: '700' },
  room: { color: '#aaa', fontSize: 13, marginTop: 2 },
  token: { color: '#555', fontSize: 11, marginTop: 4 },
  deleteBtn: { backgroundColor: '#FF4444', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  deleteBtnText: { color: '#fff', fontSize: 12, fontWeight: '600' },
});
