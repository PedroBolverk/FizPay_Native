import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Screen } from '@/components/layout/Screen';
import { colors, spacing } from '@/theme/tokens';

export default function QRPermission() {
  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.title}>Permissão de Câmera</Text>
        <Text style={styles.sub}>Solicite aqui a permissão antes de abrir a câmera.</Text>
      </View>
    </Screen>
  );
}
const styles = StyleSheet.create({
  container:{ flex:1, padding: spacing.lg },
  title:{ color: colors.text, fontWeight:'800', fontSize:20 },
  sub:{ color: colors.muted, marginTop: 8 },
});
