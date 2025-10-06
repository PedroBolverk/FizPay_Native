import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { QrCode, Eye, ArrowUpRight, CreditCard } from 'lucide-react-native';
import { Screen } from '@/components/layout/Screen';
import { colors, spacing, radius, gradients } from '@/theme/tokens';
import { useAuth } from '@/context/AuthContext';
import { TransactionsSection } from '@/components/transactions/TransactionsSection';
import { getRecentTransactions } from '@/features/transactions/mock';
import { useHiddenBalance } from '@/hooks/useHiddenBalance';
import { useRouter } from 'expo-router';

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const { show, toggle, ready } = useHiddenBalance(true);
  const recentTx = React.useMemo(() => getRecentTransactions(5), []);

  const formatBRL = (v: number) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

  return (
    <Screen scroll>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoOuter}><View style={styles.logoInner} /></View>
          <Text style={styles.hello}>Olá, {user?.name ?? 'Rafael Lucas'}</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/(app)/qr')}>
            <QrCode size={20} color={colors.primaryStart} />
          </TouchableOpacity>
          <View style={styles.avatarWrap}>
            <Image
              source={{ uri: user?.avatar ?? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face' }}
              style={styles.avatar}
            />
          </View>
        </View>
      </View>

      <View style={{ paddingHorizontal: spacing.lg, gap: spacing.lg }}>
        {/* Balances */}
        <View style={styles.grid2}>
          <BalanceCard title="SALDO PIX" value={ready && show ? formatBRL(25454) : '••••••'} onToggle={toggle} />
          <BalanceCard title="SALDO DE CASHBACK" value={ready && show ? formatBRL(23454) : '••••••'} onToggle={toggle} />
        </View>

        {/* Ações rápidas */}
        <View>
          <Text style={styles.sectionTitle}>O que deseja fazer hoje?</Text>
          <View style={styles.grid3}>
            <ActionCard title="Pagar" icon={<QrCode size={24} color={colors.muted} />} onPress={() => router.push('/(app)/qr')} />
            <ActionCard title="Transferir" icon={<ArrowUpRight size={24} color={colors.muted} />} onPress={() => {/* route */}} />
            <ActionCard title="Meus Cartões" icon={<CreditCard size={24} color={colors.muted} />} onPress={() => {/* route */}} />
          </View>
        </View>

        {/* Destaque */}
        <View>
          <Text style={styles.sectionTitle}>Em destaque</Text>
          <View style={styles.featuredCard}>
            <ImageBackground
              source={{ uri: 'https://images.unsplash.com/photo-1565619489205-42adf91ff3a4?auto=format&fit=crop&w=1080&q=60' }}
              style={styles.featuredImage}
              imageStyle={{ borderRadius: radius.lg }}
            >
              <LinearGradient colors={['rgba(0,0,0,0.6)', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
              <View style={styles.featuredLeft}>
                <View style={styles.badge}><Text style={styles.badgeText}>AVISTÃO</Text></View>
                <Text style={styles.featuredText}>Acesse as promoções{'\n'}do supermercado</Text>
              </View>
              <View style={styles.featuredRight}>
                <TouchableOpacity style={styles.inviteBtn}><Text style={styles.inviteBtnText}>Convidar{'\n'}para o FizPay</Text></TouchableOpacity>
              </View>
            </ImageBackground>
          </View>
        </View>

        {/* Transações mockadas */}
        <TransactionsSection title="Transações" data={recentTx} onSeeAll={() => {router.push('/(app)/statement')}} />
      </View>
    </Screen>
  );
}

function BalanceCard({ title, value, onToggle }: { title: string; value: string; onToggle: () => void; }) {
  return (
    <LinearGradient {...gradients.primary} style={styles.balanceCard}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
        <Text style={styles.balanceTitle}>{title}</Text>
        <TouchableOpacity onPress={onToggle}><Eye size={16} color={colors.primaryTextOn} /></TouchableOpacity>
      </View>
      <Text style={styles.balanceValue}>{value}</Text>
      <View style={styles.circleTop} />
      <View style={styles.circleBottom} />
    </LinearGradient>
  );
}
function ActionCard({ title, icon, onPress }: { title: string; icon: React.ReactNode; onPress: () => void; }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.actionCard} activeOpacity={0.7}>
      <View style={styles.actionIconWrap}>{icon}</View>
      <Text style={styles.actionLabel}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.md, backgroundColor: colors.surfaceAlt, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  hello: { color: colors.text, fontWeight: '600' },
  logoOuter: { width: 24, height: 24, borderRadius: 6, backgroundColor: colors.primaryStart, alignItems: 'center', justifyContent: 'center' },
  logoInner: { width: 12, height: 12, borderRadius: 3, backgroundColor: '#fff', transform: [{ rotate: '45deg' }] },
  iconBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  avatarWrap: { width: 32, height: 32, borderRadius: 16, overflow: 'hidden', backgroundColor: '#e5e7eb' },
  avatar: { width: '100%', height: '100%' },

  grid2: { flexDirection: 'row', gap: spacing.md },
  grid3: { flexDirection: 'row', gap: spacing.md },

  balanceCard: { flex: 1, borderRadius: radius.xl, padding: spacing.md, overflow: 'hidden' },
  balanceTitle: { color: colors.primaryTextOn, fontSize: 12, fontWeight: '600' },
  balanceValue: { color: colors.primaryTextOn, fontSize: 18, fontWeight: '800' },
  circleTop: { position: 'absolute', top: -16, right: -16, width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.10)' },
  circleBottom: { position: 'absolute', bottom: -10, left: -10, width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.10)' },

  sectionTitle: { color: colors.text, fontWeight: '800', marginBottom: spacing.md },

  actionCard: { flex: 1, backgroundColor: colors.surface, borderRadius: radius.lg, paddingVertical: spacing.lg, alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border },
  actionIconWrap: { width: 48, height: 48, borderRadius: radius.lg, backgroundColor: '#EEF2F7', alignItems: 'center', justifyContent: 'center' },
  actionLabel: { color: colors.text, fontWeight: '600' },

  featuredCard: { borderRadius: radius.lg, overflow: 'hidden', borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border },
  featuredImage: { width: '100%', height: 140, justifyContent: 'center' },
  featuredLeft: { position: 'absolute', top: 16, left: 16 },
  featuredRight: { position: 'absolute', top: 16, right: 16 },
  badge: { backgroundColor: '#ef4444', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start' },
  badgeText: { color: '#fff', fontWeight: '800', fontSize: 12 },
  featuredText: { color: '#fff', marginTop: 6, fontSize: 12 },

  inviteBtn: { backgroundColor: colors.surface, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  inviteBtnText: { color: colors.text, fontWeight: '700', fontSize: 12 },
});
