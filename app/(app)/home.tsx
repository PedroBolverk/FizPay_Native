import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing } from '@/theme/tokens';

export default function Home() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Início</Text>
      <Text style={styles.sub}>Login concluído com sucesso 🎉</Text>
      <TouchableOpacity onPress={() => router.replace('/(auth)/welcome')} style={styles.btn}>
        <Text style={{ color: '#fff', fontWeight: '700' }}>Sair (voltar ao welcome)</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex:1, backgroundColor: colors.background, padding: spacing.lg, gap: spacing.md },
  title: { color: colors.text, fontSize: 20, fontWeight: '800' },
  sub: { color: colors.muted },
  btn: { backgroundColor: colors.primaryStart, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 12 },
});
