import React from 'react';
import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { colors } from '@/theme/tokens';

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex:1, alignItems:'center', justifyContent:'center', backgroundColor: '#ffffffff' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return <Redirect href={user ? '/(app)/home' : '/(auth)/welcome'} />;
}
