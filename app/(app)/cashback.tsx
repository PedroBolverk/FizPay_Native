import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Gift, Store, Coffee, ShoppingBag, Fuel, Pill, Star, Wallet, Target, Award, Percent, Receipt, ChevronRight, Eye, EyeOff } from 'lucide-react-native';
import { colors, spacing, radius } from '@/theme/tokens';
import { Screen } from '@/components/layout/Screen';

interface CashbackCategory {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  percentage: number;
  color: string;
  image: string;
}

interface CashbackHistory {
  id: string;
  store: string;
  category: string;
  amount: number;
  percentage: number;
  date: string;
  icon: React.ComponentType<any>;
  color: string;
}

const categories: CashbackCategory[] = [
  { id: '1', name: 'Supermercados', icon: Store, percentage: 5, color: colors.primaryStart, image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop' },
  { id: '2', name: 'Restaurantes', icon: Coffee, percentage: 3, color: colors.secondary, image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100&h=100&fit=crop' },
  { id: '3', name: 'Shopping', icon: ShoppingBag, percentage: 4, color: colors.accent, image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&h=100&fit=crop' },
  { id: '4', name: 'Postos', icon: Fuel, percentage: 2, color: colors.muted, image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop' },
  { id: '5', name: 'Farmácias', icon: Pill, percentage: 6, color: colors.destructive, image: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=100&h=100&fit=crop' },
];

const cashbackHistory: CashbackHistory[] = [
  { id: '1', store: 'Supermercado Extra', category: 'Supermercados', amount: 12.5, percentage: 5, date: '2024-12-06', icon: Store, color: colors.primaryStart },
  { id: '2', store: "McDonald's", category: 'Restaurantes', amount: 4.2, percentage: 3, date: '2024-12-05', icon: Coffee, color: colors.secondary },
  { id: '3', store: 'Farmácia Droga Raia', category: 'Farmácias', amount: 8.9, percentage: 6, date: '2024-12-04', icon: Pill, color: colors.destructive },
  { id: '4', store: 'Shopping Iguatemi', category: 'Shopping', amount: 15.6, percentage: 4, date: '2024-12-03', icon: ShoppingBag, color: colors.accent },
];

export default function Cashback() {
  const [selectedPeriod, setSelectedPeriod] = useState('Este mês');
  const [showBalance, setShowBalance] = useState(true);

  const totalCashback = 23454.0;
  const monthlyEarned = 156.5;
  const totalEarned = 1247.8;
  const averageRate = 4.2;

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  return (
    <Screen scroll>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: spacing.lg }}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Cashback</Text>
          <Text style={styles.headerSub}>Ganhe dinheiro de volta em suas compras</Text>
        </View>

        {/* Main Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceTop}>
            <View style={styles.balanceLabel}>
              <Gift size={20} color="#fff" />
              <View style={{ marginLeft: spacing.sm }}>
                <Text style={styles.balanceText}>SALDO CASHBACK</Text>
                <Text style={styles.balanceSubText}>Disponível para saque</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
              {showBalance ? <Eye size={20} color="#fff" /> : <EyeOff size={20} color="#fff" />}
            </TouchableOpacity>
          </View>

          <Text style={styles.balanceAmount}>{showBalance ? formatCurrency(totalCashback) : '•••••••'}</Text>

          <View style={styles.balanceStats}>
            <View>
              <Text style={styles.statLabel}>Este mês</Text>
              <Text style={styles.statValue}>{showBalance ? formatCurrency(monthlyEarned) : '•••••'}</Text>
            </View>
            <View>
              <Text style={styles.statLabel}>Total ganho</Text>
              <Text style={styles.statValue}>{showBalance ? formatCurrency(totalEarned) : '•••••'}</Text>
            </View>
          </View>

          <View style={styles.balanceActions}>
            <TouchableOpacity style={styles.balanceBtn}>
              <Wallet size={16} color="#000000ff" />
              <Text style={styles.balanceBtnText}>Sacar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.balanceBtnOutline}>
              <Target size={16} color="#000000ff" />
              <Text style={styles.balanceBtnText}>Metas</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Top Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categorias em alta</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ gap: spacing.sm }}>
            {categories.map((category) => (
              <View key={category.id} style={[styles.categoryCard, { backgroundColor: category.color }]}>
                <category.icon size={24} color="#fff" />
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryPercent}>{category.percentage}%</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Recent Cashback */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Últimos cashbacks</Text>
          {cashbackHistory.map((item) => (
            <View key={item.id} style={styles.historyCard}>
              <item.icon size={20} color={item.color} />
              <View style={{ marginLeft: spacing.sm, flex: 1 }}>
                <Text style={styles.historyStore}>{item.store}</Text>
                <Text style={styles.historyCategory}>{item.category} • {item.percentage}% de volta</Text>
                <Text style={styles.historyDate}>{formatDate(item.date)}</Text>
              </View>
              <Text style={styles.historyAmount}>{formatCurrency(item.amount)}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: spacing.lg, borderBottomWidth: 1, borderColor: colors.border },
  headerTitle: { fontSize: 24, fontWeight: '800', color: colors.text },
  headerSub: { fontSize: 14, color: colors.muted, marginTop: 4 },

  balanceCard: { backgroundColor: colors.primaryStart, margin: spacing.lg, borderRadius: radius.xl, padding: spacing.lg },
  balanceTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  balanceLabel: { flexDirection: 'row', alignItems: 'center' },
  balanceText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  balanceSubText: { color: '#fff', fontSize: 10 },
  balanceAmount: { color: '#fff', fontSize: 28, fontWeight: '800', marginVertical: spacing.md },
  balanceStats: { flexDirection: 'row', justifyContent: 'space-between' },
  statLabel: { color: '#fff', fontSize: 12 },
  statValue: { color: '#fff', fontWeight: '700', fontSize: 16 },
  balanceActions: { flexDirection: 'row', marginTop: spacing.md, gap: spacing.sm },
  balanceBtn: { flex: 1, backgroundColor: '#fff', borderRadius: radius.lg, padding: spacing.sm, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: spacing.sm },
  balanceBtnOutline: { flex: 1, borderColor: '#fff', borderWidth: 1, borderRadius: radius.lg, padding: spacing.sm, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: spacing.sm },
  balanceBtnText: { color: '#000000ff', fontWeight: '700', marginLeft: 4 },

  section: { marginTop: spacing.lg, paddingHorizontal: spacing.lg },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: spacing.sm },

  categoryCard: { width: 100, height: 120, borderRadius: radius.lg, padding: spacing.sm, justifyContent: 'space-between', marginRight: spacing.sm },
  categoryName: { color: '#fff', fontWeight: '700', fontSize: 12 },
  categoryPercent: { color: '#fff', fontWeight: '800', fontSize: 16 },

  historyCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, padding: spacing.sm, borderRadius: radius.lg, marginBottom: spacing.sm },
  historyStore: { fontWeight: '700', color: colors.text },
  historyCategory: { fontSize: 12, color: colors.muted },
  historyDate: { fontSize: 10, color: colors.muted },
  historyAmount: { fontWeight: '700', color: colors.primaryStart },
});
