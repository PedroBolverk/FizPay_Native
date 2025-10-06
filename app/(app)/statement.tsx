import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing } from '@/theme/tokens';

export default function Statement() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()}><Text style={{ color: colors.primaryStart }}>{'< Voltar'}</Text></TouchableOpacity>
      <Text style={styles.title}>Extrato</Text>
      {/* ...lista de lançamentos... */}
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#fff', padding: spacing.lg },
  title: { color: colors.text, fontSize: 20, fontWeight: '800', marginTop: spacing.md },
});
