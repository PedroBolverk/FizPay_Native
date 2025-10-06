import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors, gradients, radius, spacing } from '@/theme/tokens';
import { getAccountById } from '@/db/accounts';
import { loginWithPassword } from '@/db/auth';
import type { Account } from '@/db/types';

export default function Password() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [acc, setAcc] = React.useState<Account | null>(null);
  const [pwd, setPwd] = React.useState('');
  const [show, setShow] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      if (!id) return;
      const row = await getAccountById(Number(id));
      if (alive) { setAcc(row); setLoading(false); }
    })();
    return () => { alive = false; };
  }, [id]);

  async function onLogin() {
    try {
      if (!acc) return;
      await loginWithPassword(acc.cpf_cnpj, pwd);
      router.replace('/(app)/home');
    } catch (e: any) {
      Alert.alert('Falha no login', e?.message ?? 'Credenciais inválidas');
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header com gradiente */}
      <View style={styles.headerWrap}>
        <LinearGradient {...gradients.primary} style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={{ color: '#fff' }}>{'< Voltar'}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Entre na sua conta</Text>
        </LinearGradient>
      </View>

      <View style={styles.panel}>
        {loading ? (
          <Text style={{ color: colors.muted }}>Carregando…</Text>
        ) : acc ? (
          <>
            <View style={{ marginBottom: spacing.lg }}>
              <Text style={{ fontSize: 18, fontWeight: '800', color: colors.text }}>{acc.name}</Text>
              <Text style={{ color: colors.muted }}>
                CPF: ***.{acc.cpf_cnpj.slice(-9,-6)}.{acc.cpf_cnpj.slice(-6,-3)}-**
              </Text>
            </View>

            <Text style={styles.label}>Senha</Text>
            <View style={styles.inputWrap}>
              <TextInput
                value={pwd}
                onChangeText={setPwd}
                placeholder="••••••••"
                placeholderTextColor={colors.muted}
                secureTextEntry={!show}
                style={{ flex: 1, color: colors.text }}
              />
              <TouchableOpacity onPress={() => setShow(v => !v)}>
                <Text style={{ color: colors.muted }}>{show ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={{ marginTop: 8 }}>
              <Text style={{ color: colors.text }}>Esqueceu a senha?</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onLogin} style={styles.btn}>
              <Text style={styles.btnText}>Entrar</Text>
            </TouchableOpacity>

            <View style={{ alignItems: 'center', marginTop: 24 }}>
              <Text style={{ color: '#9CA3AF', textAlign: 'center' }}>
                Toque no sensor{'\n'}para entrar com sua biometria
              </Text>
            </View>
          </>
        ) : (
          <Text style={{ color: colors.muted }}>Conta não encontrada.</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrap: { borderBottomLeftRadius: radius.xl, borderBottomRightRadius: radius.xl, overflow: 'hidden' },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.lg },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '800', marginTop: 8 },

  panel: { backgroundColor: '#fff', marginTop: -12, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, padding: spacing.lg },
  label: { color: colors.muted, marginBottom: 6, marginTop: spacing.sm },
  inputWrap: { height: 52, borderRadius: radius.lg, backgroundColor: '#EEF2F7', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14 },
  btn: { backgroundColor: colors.primaryStart, height: 52, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center', marginTop: spacing.lg },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
