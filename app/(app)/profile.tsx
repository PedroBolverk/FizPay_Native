import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Screen } from '@/components/layout/Screen';
import { colors, spacing, radius } from '@/theme/tokens';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth(); // Acesso ao contexto de autenticação

  if (loading) {
    // Display a loading indicator if the user data is still being fetched
    return (
      <Screen scroll>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primaryStart} />
          <Text style={styles.loadingText}>Carregando dados do perfil...</Text>
        </View>
      </Screen>
    );
  }

  // Função para efetuar o logout e redirecionar para a tela de Welcome
  const onSubmit = async () => {
    // Chama a função de sign out
    router.push('/(auth)/welcome'); // Redireciona para a tela de welcome
  };

  return (
    <Screen scroll>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Perfil</Text>
      </View>

      {/* Perfil */}
      <View style={styles.profileContainer}>
        {/* Foto de Perfil */}
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: user?.avatar ?? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' }}
            style={styles.avatar}
          />
        </View>

        {/* Nome */}
        <Text style={styles.name}>{user?.name ?? 'Rafael Lucas'}</Text>
        <Text style={styles.email}>{user?.email ?? 'rafael@email.com'}</Text>
      </View>

      {/* Ações de perfil */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          // onPress={() => router.push('/(app)/settings')}
        >
          <Text style={styles.actionText}>Configurações</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          // onPress={() => router.push('/(app)/help')}
        >
          <Text style={styles.actionText}>Ajuda</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={onSubmit} // Chama o handleSignOut no click
        >
          <Text style={styles.actionText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

// Estilos
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  loadingText: {
    marginTop: spacing.md,
    color: colors.muted,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.surfaceAlt,
    justifyContent: 'center',
  },
  headerTitle: { color: colors.text, fontSize: 20, fontWeight: '800' },

  profileContainer: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
  },

  avatarContainer: {
    borderRadius: 50,
    overflow: 'hidden',
    width: 120,
    height: 120,
    marginBottom: spacing.md,
  },

  avatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  name: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },

  email: {
    fontSize: 14,
    color: colors.muted,
  },

  actions: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
  },

  actionButton: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
    alignItems: 'center',
  },

  actionText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
  },
});
