import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Screen } from '@/components/layout/Screen';
import { colors, spacing, radius } from '@/theme/tokens';
import { useRouter } from 'expo-router';

export default function Welcome() {
  const router = useRouter();
  return (
    <Screen>
      <View style={{ padding: spacing.lg }}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={{ width: 24, height: 29.18 }}
          resizeMode="contain"
        />
      </View>

      <View style={{ alignItems: 'center', marginBottom: spacing.lg }}>
        <Image
          source={require('../../assets/images/wpp-Onboarding.gif')}
          style={{ width: 482, height: 301 }}
          resizeMode="contain"
        />
      </View>

      <View style={{ paddingHorizontal: spacing.lg, gap: 55, marginBottom: 110 }}>
        <Text style={styles.h1}>A carteira digital feita para oferecer benefícios!</Text>
        <Text style={styles.subtitle}>Acesse sua conta e aproveite todos os benefícios do FizPay.</Text>
      </View>

      <View style={{ padding: spacing.lg, gap: 85, flexDirection: 'row', justifyContent: 'center' }}>
        <TouchableOpacity style={styles.cta} onPress={() => router.push('/(auth)/login/accounts')}>
          <Text style={styles.ctaText}>Entrar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.ctaOutline} onPress={() => router.push('/(auth)/login/connect-another')}>
          <Text style={{ color: colors.text, fontWeight: '700' }}>Abrir Conta →</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  h1: { fontSize: 18, fontWeight: '800', color: colors.text, textAlign: 'center', marginBottom: 8 },
  subtitle: { color: colors.muted, textAlign: 'center' },
  cta: { backgroundColor: colors.primaryStart, borderRadius: radius.lg, height: 53, width: 152, alignItems: 'center', justifyContent: 'center' },
  ctaText: { color: '#fff', fontWeight: '700' },
  ctaOutline: { height: 52, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center' },
  logoOuter: { width: 36, height: 36, borderRadius: 8, backgroundColor: colors.primaryStart, alignItems: 'center', justifyContent: 'center' },
  logoInner: { width: 20, height: 20, borderRadius: 4, backgroundColor: '#fff', transform: [{ rotate: '45deg' }] },
});
