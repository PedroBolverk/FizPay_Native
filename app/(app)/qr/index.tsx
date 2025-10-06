import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Screen } from '@/components/layout/Screen';
import { colors, spacing } from '@/theme/tokens';

export default function QR() {
  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.title}>QR Code</Text>
        <Text style={styles.sub}>Aqui vai a câmera/leitor.</Text>
      </View>
    </Screen>
  );
}
const styles = StyleSheet.create({
  container:{ flex:1, padding: spacing.lg },
  title:{ color: colors.text, fontWeight:'800', fontSize:20 },
  sub:{ color: colors.muted, marginTop: 8 },
});
