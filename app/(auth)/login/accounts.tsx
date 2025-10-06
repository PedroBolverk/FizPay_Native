import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { colors, gradients, radius, spacing } from '@/theme/tokens';
import { listAccounts } from '@/db/accounts';
import type { Account } from '@/db/types';
import { AccountListCard } from '@/components/common/AccountListCard';
import { Screen } from '@/components/layout/Screen';
import Feather from '@expo/vector-icons/Feather'

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
          <TouchableOpacity onPress={() => router.back()}><Text style={{ color: '#fff'}}>{<Feather name="arrow-left" size={24} color="white" />}</Text></TouchableOpacity>
          <Text style={styles.headerTitle}>Login</Text>
        </LinearGradient>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.lg }}>
        {/* painel claro sobre o gradiente */}
        <View style={styles.panel}>
          <Text style={styles.h1}>Bem vindo de volta 👋</Text>
          <Text style={styles.sub}>Olá, faça login para continuar!</Text>

          {loading ? (
            <View style={styles.loading}>
              <ActivityIndicator />
              <Text style={{ color: colors.muted, marginTop: 8 }}>Carregando contas…</Text>
            </View>
          ) : accounts.length === 0 ? (
            <View style={styles.empty}>
              <Text style={{ color: colors.muted, textAlign: 'center' }}>
                Nenhuma conta encontrada.{'\n'}Toque abaixo para adicionar.
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

        {/* CTA Entrar */}
        <TouchableOpacity
          disabled={!selected}
          onPress={goToPassword}
          style={[styles.btn, { opacity: selected ? 1 : 0.4 }]}
        >
          <Text style={styles.btnText}>Entrar</Text>
        </TouchableOpacity>

        {/* Ajuda */}
        <TouchableOpacity onPress={() => { /* abrir suporte */ }} style={{ alignSelf: 'center', marginTop: 12 }}>
          <Text style={{ color: colors.primaryStart, fontWeight: '700' }}>Preciso de ajuda</Text>
        </TouchableOpacity>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerWrap: { borderBottomLeftRadius: radius.xl, borderBottomRightRadius: radius.xl, overflow: 'hidden' },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.lg },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: '800', marginTop: 8 },

  panel: {
    backgroundColor: '#fff',
    marginTop: -12,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.lg,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
  },

  h1: { fontSize: 20, fontWeight: '800', color: colors.text, marginBottom: 4 },
  sub: { color: colors.muted, marginBottom: spacing.md },

  btn: { backgroundColor: colors.primaryStart, height: 52, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center', marginTop: spacing.lg },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },

  loading: { alignItems: 'center', paddingVertical: spacing.lg },
  empty: { backgroundColor: '#F3F4F6', borderRadius: radius.lg, padding: spacing.lg, alignItems: 'center' },
});
