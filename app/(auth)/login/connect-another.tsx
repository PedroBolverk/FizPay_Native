import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { colors, gradients, radius, spacing } from '@/theme/tokens';
import { upsertAccount } from '@/db/accounts';

export default function ConnectAnother() {
  const router = useRouter();
  const [cpf, setCpf] = React.useState('');
  const [name, setName] = React.useState('');
  const [password, setPassword] = React.useState('');

  const canSave = name.trim().length >= 2 && cpf.replace(/\D/g, '').length >= 11;

  async function handleSave() {
    try {
      await upsertAccount({ name, cpfOrCnpj: cpf, password: password || null });
      router.replace('/(auth)/login/accounts');
    } catch (e: any) {
      Alert.alert('Erro', e?.message ?? 'Não foi possível salvar a conta.');
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Header com gradiente */}
      <View style={styles.headerWrap}>
        <LinearGradient {...gradients.primary} style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={{ color: '#fff' }}>{'< Voltar'}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Conectar-se a outra conta</Text>
        </LinearGradient>
      </View>

      <View style={styles.panel}>
        <Text style={styles.label}>CPF ou CNPJ</Text>
        <TextInput
          value={cpf}
          onChangeText={setCpf}
          keyboardType="numeric"
          placeholder="000.000.000-00"
          placeholderTextColor={colors.muted}
          style={styles.input}
        />

        <Text style={styles.label}>Como deseja ser chamado</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Seu nome"
          placeholderTextColor={colors.muted}
          style={styles.input}
        />

        <Text style={styles.label}>Senha (opcional)</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          placeholderTextColor={colors.muted}
          secureTextEntry
          style={styles.input}
        />

        <TouchableOpacity
          disabled={!canSave}
          onPress={handleSave}
          style={[styles.btn, { opacity: canSave ? 1 : 0.4 }]}
        >
          <Text style={styles.btnText}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  headerWrap: { borderBottomLeftRadius: radius.xl, borderBottomRightRadius: radius.xl, overflow: 'hidden' },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.lg },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '800', marginTop: 8 },

  panel: { backgroundColor: '#fff', marginTop: -12, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, padding: spacing.lg, gap: spacing.sm },
  label: { color: colors.muted, marginTop: spacing.sm, marginBottom: 6 },
  input: { height: 52, borderRadius: radius.lg, backgroundColor: '#EEF2F7', paddingHorizontal: 14, color: colors.text },
  btn: { backgroundColor: colors.primaryStart, height: 52, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center', marginTop: spacing.lg },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
