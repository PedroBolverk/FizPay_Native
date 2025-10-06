import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Screen } from '@/components/layout/Screen';
import { colors, spacing } from '@/theme/tokens';

export default function Profile() {
  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.title}>Perfil</Text>
      </View>
    </Screen>
  );
}
const styles = StyleSheet.create({
  container:{ flex:1, padding: spacing.lg },
  title:{ color: colors.text, fontWeight:'800', fontSize:20 },
});
