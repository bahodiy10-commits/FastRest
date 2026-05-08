import { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Alert, Image, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { listenToMenu, addMenuItem, updateMenuItem, deleteMenuItem, uploadMenuImage, getCategories, addCategory } from '../../src/services/menuService';
import { MenuItem, Category } from '../../src/types';

export default function AdminMenuScreen() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCategories().then(setCategories);
    const unsub = listenToMenu(setMenu);
    return unsub;
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const handleAdd = async () => {
    if (!name || !price || !category) { Alert.alert('Xato', 'Barcha majburiy maydonlarni to\'ldiring'); return; }
    setLoading(true);
    try {
      let imageUrl = '';
      if (image) imageUrl = await uploadMenuImage(image, name);
      await addMenuItem({ name, description: desc, price: parseInt(price), imageUrl, category, isAvailable: true, createdAt: Date.now() });
      setName(''); setDesc(''); setPrice(''); setCategory(''); setImage('');
    } catch (e) { Alert.alert('Xato', 'Mahsulot qo\'shilmadi'); }
    finally { setLoading(false); }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>🍽 Menyu boshqaruvi</Text>

        <View style={styles.form}>
          <TextInput style={styles.input} placeholder="Nom *" placeholderTextColor="#666" value={name} onChangeText={setName} />
          <TextInput style={styles.input} placeholder="Tavsif" placeholderTextColor="#666" value={desc} onChangeText={setDesc} />
          <TextInput style={styles.input} placeholder="Narx (so'm) *" placeholderTextColor="#666" value={price} onChangeText={setPrice} keyboardType="numeric" />
          <TextInput style={styles.input} placeholder="Kategoriya ID *" placeholderTextColor="#666" value={category} onChangeText={setCategory} />

          <TouchableOpacity style={styles.imgBtn} onPress={pickImage}>
            {image ? <Image source={{ uri: image }} style={styles.preview} /> : <Text style={styles.imgBtnText}>📷 Rasm tanlash</Text>}
          </TouchableOpacity>

          <TouchableOpacity style={styles.addBtn} onPress={handleAdd} disabled={loading}>
            <Text style={styles.addBtnText}>{loading ? '...' : '+ Qo\'shish'}</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={menu}
          scrollEnabled={false}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {item.imageUrl ? <Image source={{ uri: item.imageUrl }} style={styles.cardImg} /> : null}
              <View style={styles.cardInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>{item.price.toLocaleString()} so'm</Text>
              </View>
              <View style={styles.cardActions}>
                <TouchableOpacity onPress={() => updateMenuItem(item.id, { isAvailable: !item.isAvailable })}>
                  <Text style={{ color: item.isAvailable ? '#4CAF50' : '#888', fontSize: 12 }}>
                    {item.isAvailable ? '✅ Mavjud' : '❌ Mavjud emas'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteMenuItem(item.id)}>
                  <Text style={styles.delete}>O'chirish</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050D12', paddingTop: 56 },
  title: { color: '#fff', fontSize: 24, fontWeight: '800', paddingHorizontal: 20, marginBottom: 16 },
  form: { padding: 16 },
  input: { backgroundColor: '#0D1F2D', color: '#fff', borderRadius: 12, padding: 14, marginBottom: 8, fontSize: 15 },
  imgBtn: { backgroundColor: '#0D1F2D', borderRadius: 12, height: 100, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  imgBtnText: { color: '#aaa', fontSize: 16 },
  preview: { width: '100%', height: 100, borderRadius: 12 },
  addBtn: { backgroundColor: '#E8925A', borderRadius: 12, padding: 14, alignItems: 'center' },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  card: { backgroundColor: '#0D1F2D', marginHorizontal: 16, marginBottom: 8, borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center' },
  cardImg: { width: 60, height: 60, borderRadius: 10, marginRight: 12 },
  cardInfo: { flex: 1 },
  itemName: { color: '#fff', fontSize: 15, fontWeight: '600' },
  itemPrice: { color: '#E8925A', fontSize: 13 },
  cardActions: { gap: 8, alignItems: 'flex-end' },
  delete: { color: '#FF4444', fontSize: 12 },
});
