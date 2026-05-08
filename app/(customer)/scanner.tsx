import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { getTableByToken } from '../../src/services/tableService';
import { useCartStore } from '../../src/store/useCartStore';

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const { setTable } = useCartStore();

  const handleScan = async ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    try {
      let token = data;
      if (data.startsWith('fastrest://table/')) {
        token = data.replace('fastrest://table/', '');
      }
      const table = await getTableByToken(token);
      if (!table) {
        Alert.alert('Xato', 'Stol topilmadi', [{ text: 'Qayta', onPress: () => setScanned(false) }]);
        return;
      }
      if (!table.isActive) {
        Alert.alert('Xato', 'Bu stol faol emas', [{ text: 'OK', onPress: () => setScanned(false) }]);
        return;
      }
      setTable(table.id, table.number);
      router.push('/(customer)/order-type');
    } catch (e) {
      Alert.alert('Xato', 'Qayta urinib ko\'ring', [{ text: 'OK', onPress: () => setScanned(false) }]);
    }
  };

  if (!permission) return <View style={styles.container} />;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Kamera ruxsati kerak</Text>
        <TouchableOpacity style={styles.btn} onPress={requestPermission}>
          <Text style={styles.btnText}>Ruxsat berish</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>QR kodni skaner qiling</Text>
      <View style={styles.cameraWrap}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          onBarcodeScanned={scanned ? undefined : handleScan}
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        />
        <View style={styles.overlay} />
      </View>
      {scanned && (
        <TouchableOpacity style={styles.btn} onPress={() => setScanned(false)}>
          <Text style={styles.btnText}>Qayta skaner qilish</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050D12', alignItems: 'center', justifyContent: 'center' },
  title: { color: '#fff', fontSize: 20, fontWeight: '700', marginBottom: 24 },
  cameraWrap: { width: 280, height: 280, borderRadius: 20, overflow: 'hidden', borderWidth: 2, borderColor: '#E8925A' },
  overlay: { ...StyleSheet.absoluteFillObject, borderWidth: 2, borderColor: '#E8925A', borderRadius: 20 },
  text: { color: '#fff', fontSize: 16, marginBottom: 16, textAlign: 'center' },
  btn: { marginTop: 24, backgroundColor: '#E8925A', borderRadius: 99, paddingHorizontal: 32, paddingVertical: 14 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
