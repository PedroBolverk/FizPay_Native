import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { colors, gradients, radius, spacing } from '@/theme/tokens';
import { listAccounts } from '@/db/accounts';
import type { Account } from '@/db/types';
import { AccountListCard } from '@/components/common/AccountListCard';
import { Screen } from '@/components/layout/Screen';
import Feather from '@expo/vector-icons/Feather';

export default function AccountsScreen() {
  const router = useRouter();
  const [accounts, setAccounts] = React.useState<Account[]>([]);
  const [selected, setSelected] = React.useState<number | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const rows = await listAccounts();
        if (alive) {
          setAccounts(rows);
          setSelected(rows[0]?.id ?? null);
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  function goToPassword() {
    if (!selected) return;
    router.push({ pathname: '/(auth)/login/password', params: { id: String(selected) } });
  }

  return (
    <Screen scroll>
      {/* Header com gradiente */}
      <View style={styles.headerWrap}>
        <LinearGradient {...gradients.primary} style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={{ color: '#fff' }}>
              <Feather name="arrow-left" size={24} color="white" />
            </Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Login</Text>
        </LinearGradient>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* painel claro sobre o gradiente */}
        <View style={styles.panel}>
          <Text style={styles.h1}>Bem vindo</Text>

          {loading ? (
            <View style={styles.loading}>
              <ActivityIndicator />
              <Text style={{ color: colors.muted, marginTop: 8 }}>Carregando contas…</Text>
            </View>
          ) : accounts.length === 0 ? (
            <View style={styles.empty}>
              <Text style={{ color: colors.muted, textAlign: 'center', fontSize: 14 }}>
                Parece que você ainda não cadastrou nenhuma conta.
              </Text>
            </View>
          ) : (
            <AccountListCard
              accounts={accounts}
              selectedId={selected}
              onSelect={setSelected}
              footerRight={
                <TouchableOpacity onPress={() => router.push('/(auth)/login/connect-another')}>
                  <Text style={{ color: colors.primaryStart, fontWeight: '700' }}>Acessar outra conta</Text>
                </TouchableOpacity>
              }
            />
          )}
        </View>
      </ScrollView>

      {/* Footer with buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => {
            if (accounts.length === 0) {
              router.push('/(auth)/login/connect-another');
            } else {
              goToPassword();
            }
          }}
          style={styles.btn}
        >
          <Text style={styles.btnText}>{accounts.length === 0 ? 'Cadastrar conta' : 'Entrar'}</Text>
        </TouchableOpacity>

        {/* Ajuda */}
        <TouchableOpacity onPress={() => { /* abrir suporte */ }} style={{ marginTop: 12 }}>
          <Text style={{ color: colors.primaryStart, fontWeight: '700', textAlign: 'center' }}>Preciso de ajuda</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerWrap: { borderBottomLeftRadius: radius.xl, borderBottomRightRadius: radius.xl, overflow: 'hidden' },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.lg },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: '800', marginTop: 8 },

  panel: {
    backgroundColor: '#ffffffff',
    marginTop: -12,
    padding: spacing.lg,
  },

  h1: { fontSize: 20, fontWeight: '700', color: colors.text, marginBottom: 4, textAlign: 'center', paddingTop: 20 },
  sub: { color: colors.muted, marginBottom: spacing.md },

  loading: { alignItems: 'center', paddingVertical: spacing.lg },
  empty: { padding: spacing.lg, alignItems: 'center' },

  // Scroll View container style
  scrollContainer: {
    flex: 1, // Take available space
    paddingHorizontal: spacing.lg,
    paddingBottom: 350, // Some extra space to prevent the footer from overlapping
  },

  // Footer styles
  footer: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
    justifyContent: 'flex-end', // Ensures buttons are at the bottom
    alignItems: 'center', // Center-align buttons
  },

  btn: { backgroundColor: colors.primaryStart, height: 52, paddingHorizontal: 100, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center', marginTop: spacing.lg },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
