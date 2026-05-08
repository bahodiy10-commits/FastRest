import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform,
  ActivityIndicator, Alert
} from 'react-native';
import { router } from 'expo-router';
import { loginUser } from '../../src/services/authService';
import { useAuthStore } from '../../src/store/useAuthStore';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser, setRole } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Xato', 'Email va parolni kiriting');
      return;
    }
    setLoading(true);
    try {
      const user = await loginUser(email, password);
      setUser(user);
      setRole(user.role);
      if (user.role === 'admin') router.replace('/(admin)/dashboard');
      else if (user.role === 'kitchen') router.replace('/(kitchen)/display');
      else router.replace('/(customer)/scanner');
    } catch (e: any) {
      Alert.alert('Xato', e.message || 'Login amalga oshmadi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.logo}>🍽 FastRest</Text>
        <Text style={styles.title}>Kirish</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Parol"
          placeholderTextColor="#666"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.btn} onPress={handleLogin} disabled={loading}>
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.btnText}>Kirish</Text>
          }
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050D12', justifyContent: 'center', alignItems: 'center' },
  card: { width: '88%', backgroundColor: '#0D1F2D', borderRadius: 20, padding: 28 },
  logo: { fontSize: 32, textAlign: 'center', marginBottom: 8 },
  title: { fontSize: 24, fontWeight: '700', color: '#fff', textAlign: 'center', marginBottom: 24 },
  input: {
    backgroundColor: '#1A2E3D', color: '#fff', borderRadius: 12,
    padding: 14, marginBottom: 14, fontSize: 16,
  },
  btn: {
    backgroundColor: '#E8925A', borderRadius: 99, padding: 16,
    alignItems: 'center', marginTop: 8,
  },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
