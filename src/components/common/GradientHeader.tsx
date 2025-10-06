import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, gradients, radius, spacing } from '@/theme/tokens';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export function GradientHeader({ title }: { title: string }) {
  const router = useRouter();
  const { top } = useSafeAreaInsets();

  return (
    <View style={styles.wrap}>
      <LinearGradient {...gradients.primary} style={[styles.header, { paddingTop: top + spacing.lg }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color={colors.primaryTextOn} />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { borderBottomLeftRadius: radius.xl, borderBottomRightRadius: radius.xl, overflow: 'hidden' },
  header: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: radius.md },
  title: { color: colors.primaryTextOn, fontSize: 22, fontWeight: '800', marginTop: 8 },
});
