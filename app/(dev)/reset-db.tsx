import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { resetAndSeedSync } from '@/db';
import { Screen } from '@/components/layout/Screen';
import { colors, spacing, radius } from '@/theme/tokens';

export default function ResetDbScreen() {
  const run = () => {
    resetAndSeedSync();
    Alert.alert('SQLite', 'Banco resetado e populado novamente.');
  };

  return (
    <Screen>
      <View style={styles.wrap}>
        <Text style={styles.title}>Resetar Banco (DEV)</Text>
        <TouchableOpacity onPress={run} style={styles.btn}>
          <Text style={styles.btnText}>Reset + Seed</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: spacing.lg, gap: spacing.lg },
  title: { color: colors.text, fontSize: 18, fontWeight: '800' },
  btn: { backgroundColor: '#111827', borderRadius: radius.lg, paddingVertical: 14, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: '800' },
});
