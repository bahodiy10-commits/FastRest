import { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ScrollView, ActivityIndicator, Image
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { listenToMenu, getCategories } from '../../src/services/menuService';
import { useCartStore } from '../../src/store/useCartStore';
import { MenuItem, Category } from '../../src/types';

export default function MenuScreen() {
  const { type } = useLocalSearchParams();
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const { addItem, items, total } = useCartStore();

  useEffect(() => {
    getCategories().then((cats) => {
      setCategories(cats);
      if (cats.length > 0) setActiveCategory(cats[0].id);
    });
    const unsub = listenToMenu((items) => {
      setMenu(items);
      setLoading(false);
    });
    return unsub;
  }, []);

  const filtered = menu.filter((i) => i.category === activeCategory && i.isAvailable);

  const getQty = (id: string) => items.find((i) => i.id === id)?.qty || 0;

  const renderItem = useCallback(({ item }: { item: MenuItem }) => {
    const qty = getQty(item.id);
    return (
      <View style={styles.card}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.img} />
        ) : (
          <View style={[styles.img, styles.imgPlaceholder]}>
            <Text style={{ fontSize: 32 }}>🍽</Text>
          </View>
        )}
        <View style={styles.cardBody}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemDesc} numberOfLines={2}>{item.description}</Text>
          <View style={styles.cardRow}>
            <Text style={styles.price}>{item.price.toLocaleString()} so'm</Text>
            <View style={styles.qtyRow}>
              {qty > 0 && (
                <>
                  <TouchableOpacity style={styles.qtyBtn} onPress={() => useCartStore.getState().updateQty(item.id, qty - 1)}>
                    <Text style={styles.qtyBtnText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.qty}>{qty}</Text>
                </>
              )}
              <TouchableOpacity style={[styles.qtyBtn, styles.addBtn]} onPress={() => addItem({ id: item.id, name: item.name, price: item.price, qty: 1, image: item.imageUrl })}>
                <Text style={styles.qtyBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }, [items]);

  if (loading) return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#E8925A" />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Menyu</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabs}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.tab, activeCategory === cat.id && styles.tabActive]}
            onPress={() => setActiveCategory(cat.id)}
          >
            <Text style={[styles.tabText, activeCategory === cat.id && styles.tabTextActive]}>{cat.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filtered}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
      />

      {items.length > 0 && (
        <TouchableOpacity style={styles.fab} onPress={() => router.push('/(customer)/cart')}>
          <Text style={styles.fabText}>🛒 Savatcha • {total().toLocaleString()} so'm</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050D12' },
  header: { paddingTop: 56, paddingHorizontal: 20, paddingBottom: 12 },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: '800' },
  tabs: { paddingHorizontal: 16, marginBottom: 8 },
  tab: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 99, backgroundColor: '#0D1F2D', marginRight: 8 },
  tabActive: { backgroundColor: '#E8925A' },
  tabText: { color: '#aaa', fontWeight: '600' },
  tabTextActive: { color: '#fff' },
  card: { backgroundColor: '#0D1F2D', borderRadius: 16, marginBottom: 12, flexDirection: 'row', overflow: 'hidden' },
  img: { width: 100, height: 100 },
  imgPlaceholder: { backgroundColor: '#1A2E3D', alignItems: 'center', justifyContent: 'center' },
  cardBody: { flex: 1, padding: 12 },
  itemName: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 4 },
  itemDesc: { color: '#888', fontSize: 13, marginBottom: 8 },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { color: '#E8925A', fontWeight: '700', fontSize: 15 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  qtyBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#1A2E3D', alignItems: 'center', justifyContent: 'center' },
  addBtn: { backgroundColor: '#E8925A' },
  qtyBtnText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  qty: { color: '#fff', fontSize: 16, fontWeight: '700', minWidth: 20, textAlign: 'center' },
  fab: { position: 'absolute', bottom: 24, left: 24, right: 24, backgroundColor: '#E8925A', borderRadius: 99, padding: 18, alignItems: 'center' },
  fabText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
