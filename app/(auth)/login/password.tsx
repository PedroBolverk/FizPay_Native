import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Screen } from '@/components/layout/Screen';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import { colors, gradients, radius, spacing } from '@/theme/tokens';
import { getAccountById } from '@/db/accounts';
import { loginWithPassword } from '@/db/auth';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store'; // Usando expo-secure-store
import type { Account } from '@/db/types';

export default function Password() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [acc, setAcc] = useState<Account | null>(null);
  const [pwd, setPwd] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [savedCredentials, setSavedCredentials] = useState<{ username: string, password: string } | null>(null);

  useEffect(() => {
    // Recupera as credenciais salvas no SecureStore
    const fetchCredentials = async () => {
      const credentials = await SecureStore.getItemAsync('user_credentials');
      if (credentials) {
        setSavedCredentials(JSON.parse(credentials)); // Recupera as credenciais do SecureStore
      }
    };

    fetchCredentials();
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!id) return;
      const row = await getAccountById(Number(id));
      if (alive) { setAcc(row); setLoading(false); }
    })();
    return () => { alive = false; };
  }, [id]);

  useEffect(() => {
    // Verifica se o dispositivo suporta biometria (impressão digital ou Face ID)
    (async () => {
      const isAvailable = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(isAvailable);
    })();
  }, []);

  const onLogin = async () => {
    try {
      if (!acc) return;
      // Aqui a senha é verificada e a conta logada com a senha
      await loginWithPassword(acc.cpf_cnpj, pwd);
      router.replace('/(app)/home');
    } catch (e: any) {
      Alert.alert('Falha no login', e?.message ?? 'Credenciais inválidas');
    }
  };

  const authenticateWithBiometrics = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Autentique-se usando biometria',
        fallbackLabel: 'Usar senha', // Se a biometria falhar, o usuário poderá usar a senha
      });

      if (result.success) {
        if (acc) {
          // Aqui usamos a senha armazenada no SecureStore para login
          await loginWithPassword(acc.cpf_cnpj, savedCredentials?.password ?? '');
          router.replace('/(app)/home');
        }
      } else {
        Alert.alert('Falha na autenticação biométrica', 'A autenticação biométrica falhou');
      }
    } catch (e: any) {
      console.error('Erro na autenticação biométrica', e);
      Alert.alert('Erro', 'Ocorreu um erro ao tentar autenticar com biometria');
    }
  };

  return (
    <Screen scroll>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {/* Header com gradiente */}
        <View style={styles.headerWrap}>
          <LinearGradient {...gradients.primary} style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={{ color: '#fff' }}>
                <Feather name="arrow-left" size={24} color="white" />
              </Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Entre na sua conta</Text>
          </LinearGradient>
        </View>

        <View style={styles.panel}>
          {loading ? (
            <ActivityIndicator size="large" color={colors.primaryStart} />
          ) : acc ? (
            <>
              <View style={{ marginBottom: spacing.lg, flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                <View style={styles.avatarWrap}>
                  <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face' }}
                    style={styles.avatar}
                  />
                </View>
                <View>
                  <Text style={{ fontSize: 18, fontWeight: '800', color: colors.text }}>{acc.name}</Text>
                  <TextInput style={{ color: colors.muted }}>
                    CPF: ***.{acc.cpf_cnpj.slice(-9, -6)}.{acc.cpf_cnpj.slice(-6, -3)}-**
                  </TextInput>
                </View>
              </View>

              <Text style={styles.label}>Senha</Text>
              <View style={styles.inputWrap}>
                <TextInput
                  value={pwd || savedCredentials?.password || ''} // Use senha salva se disponível
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

              {isBiometricSupported && (
                <View style={{ alignItems: 'center', marginTop: 24 }}>
                  <TouchableOpacity
                    onPress={authenticateWithBiometrics}
                    style={{ alignItems: 'center' }}>
                    <Image
                      source={require('../../../assets/images/biometric_icon.png')}
                      style={{ width: 32, height: 32 }}
                      resizeMode="contain"
                    />
                    <Text style={{ color: '#9CA3AF', textAlign: 'center' }}>
                      Toque no sensor{'\n'}para entrar com sua biometria
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          ) : (
            <Text style={{ color: colors.muted }}>Conta não encontrada.</Text>
          )}
        </View>
      </View>
    </Screen>
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
  avatar: { width: '100%', height: '100%' },
  avatarWrap: { width: 64, height: 64, borderRadius: 32, overflow: 'hidden', backgroundColor: '#e5e7eb' },
});
