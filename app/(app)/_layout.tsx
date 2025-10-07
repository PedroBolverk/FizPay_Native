import React from 'react';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { colors } from '@/theme/tokens';
import { Home, List, BadgePercent, User } from 'lucide-react-native';

export default function AppTabsLayout() {
  const insets = useSafeAreaInsets();

  // Se quiser deixar sem altura fixa, REMOVA a linha "height".
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primaryStart,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },

        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#E5E7EB',
          borderTopWidth: StyleSheet.hairlineWidth,
          paddingTop: 6,
          paddingBottom: Math.max(insets.bottom, 8),
          height: 56 + insets.bottom, // <- opção A (com altura calculada)
          // opção B (recomendada): comente a linha acima e deixe sem 'height'
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{ title: 'Início', tabBarIcon: ({ color, size }) => <Home color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="statement-list"
        options={{ title: 'Extrato', tabBarIcon: ({ color, size }) => <List color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="cashback"
        options={{ title: 'Cashback', tabBarIcon: ({ color, size }) => <BadgePercent color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Meu perfil', tabBarIcon: ({ color, size }) => <User color={color} size={size} /> }}
      />
      <Tabs.Screen name="qr" options={{ href: null }} />
      <Tabs.Screen name="statement" options={{ href: null }} />
    </Tabs>
  );
}
