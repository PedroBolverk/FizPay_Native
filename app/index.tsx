import React, { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { colors } from '@/theme/tokens';
import { bootstrapDbSync } from '@/db';

export default function Index() {
  useEffect(() => {
    bootstrapDbSync();  // Inicializa o banco de dados
  }, []);
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffffff' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return <Redirect href={user ? '/(app)/home' : '/(auth)/welcome'} />;
}
