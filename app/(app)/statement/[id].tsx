import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft, Share2, ArrowUpRight, ArrowDownRight, CreditCard, Gift,
  RotateCcw, Send, Download, Dot
} from 'lucide-react-native';
import { Screen } from '@/components/layout/Screen';
import { colors, spacing, radius } from '@/theme/tokens';
import { getByIdSync } from '@/features/transactions/repo';
import type { Transaction } from '@/features/transactions/types';

export default function StatementDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const tx = React.useMemo(
    () => getByIdSync(String(id)),
    [id]
  );

  if (!tx) {
    return (
      <Screen>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
            <ArrowLeft size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Transação</Text>
          <View style={{ width: 36 }} />
        </View>

        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Transação não encontrada</Text>
          <Text style={styles.emptySub}>Verifique o link ou volte ao extrato.</Text>
        </View>
      </Screen>
    );
  }

  const { Icon, bubble, signColor } = getVisual(tx);
  const isIn = tx.amount >= 0;
  const amountAbs = Math.abs(tx.amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const sign = isIn ? '+' : '-';

  const d = new Date(tx.date);
  const dateStr = d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  const timeStr = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  const shareTx = async () => {
    try {
      await Share.share({
        message: `Transação • ${tx.title}\nValor: ${sign}${amountAbs}\nData: ${dateStr} ${timeStr}`,
      });
    } catch {}
  };

  return (
    <Screen>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <ArrowLeft size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhe da transação</Text>
        <TouchableOpacity onPress={shareTx} style={styles.iconBtn}>
          <Share2 size={20} color={colors.muted} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xl }}>
        {/* Card Resumo */}
        <View style={styles.summary}>
          <View style={[styles.bubble, { backgroundColor: bubble }]}>
            <Icon size={22} color="#fff" />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.summaryTitle}>{tx.title}</Text>
            {!!tx.subtitle && <Text style={styles.summarySub}>{tx.subtitle}</Text>}
          </View>

          <Text style={[styles.summaryAmt, { color: signColor }]}>
            {sign}{amountAbs}
          </Text>
        </View>

        {/* Status */}
        <View style={styles.statusRow}>
          <Dot size={16} color={
            tx.status === 'completed' ? '#10B981' : tx.status === 'pending' ? '#F59E0B' : '#EF4444'
          } />
          <Text style={styles.statusText}>
            {tx.status === 'completed' ? 'Concluída' : tx.status === 'pending' ? 'Pendente' : 'Falhada'}
          </Text>
        </View>

        {/* Infos */}
        <View style={styles.block}>
          <InfoRow label="Tipo" value={labelFromCategory(tx)} />
          <InfoRow label="Data" value={dateStr} />
          <InfoRow label="Hora" value={timeStr} />
          <InfoRow label="Identificador" value={tx.id} selectable />
        </View>

        {/* Observações / descrição */}
        <View style={styles.block}>
          <Text style={styles.blockTitle}>Descrição</Text>
          <Text style={styles.blockText}>{tx.subtitle ?? '—'}</Text>
        </View>
      </ScrollView>
    </Screen>
  );
}

function InfoRow({ label, value, selectable }: { label: string; value: string; selectable?: boolean }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue} selectable={selectable}>{value}</Text>
    </View>
  );
}

function getVisual(tx: Transaction) {
  const isIn = tx.amount >= 0;
  const green = '#10B981';
  const red = '#EF4444';
  const gray = '#6B7280';

  let Icon: any = isIn ? ArrowUpRight : ArrowDownRight;
  let bubble = isIn ? green : red;
  let signColor = isIn ? green : red;

  switch (tx.category) {
    case 'pix':
      Icon = isIn ? Download : Send;
      bubble = isIn ? green : red;
      break;
    case 'transfer':
      Icon = isIn ? Download : Send;
      bubble = isIn ? green : red;
      break;
    case 'card':
    case 'purchase':
      Icon = CreditCard;
      bubble = red;
      signColor = red;
      break;
    case 'cashback':
      Icon = Gift;
      bubble = green;
      signColor = green;
      break;
    case 'refund':
      Icon = RotateCcw;
      bubble = green;
      signColor = green;
      break;
    default:
      bubble = gray;
  }
  return { Icon, bubble, signColor };
}

function labelFromCategory(tx: Transaction) {
  switch (tx.category) {
    case 'pix': return tx.amount >= 0 ? 'PIX Recebido' : 'PIX Enviado';
    case 'transfer': return tx.amount >= 0 ? 'Transferência Recebida' : 'Transferência Enviada';
    case 'card': return 'Cartão';
    case 'purchase': return 'Compra';
    case 'cashback': return 'Cashback';
    case 'refund': return 'Reembolso';
    default: return 'Transação';
  }
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconBtn: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F3F4F6' },
  headerTitle: { color: colors.text, fontWeight: '800', fontSize: 18 },

  summary: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: '#fff', borderRadius: radius.xl, padding: spacing.lg,
    borderWidth: StyleSheet.hairlineWidth, borderColor: '#E5E7EB',
  },
  bubble: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  summaryTitle: { color: colors.text, fontWeight: '800' },
  summarySub: { color: colors.muted, marginTop: 2 },
  summaryAmt: { fontWeight: '900', fontSize: 16 },

  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.md, marginBottom: spacing.lg, paddingHorizontal: 2 },
  statusText: { color: colors.muted },

  block: {
    backgroundColor: '#fff', borderRadius: radius.xl, padding: spacing.lg,
    borderWidth: StyleSheet.hairlineWidth, borderColor: '#E5E7EB',
    marginBottom: spacing.md,
  },
  blockTitle: { color: colors.text, fontWeight: '800', marginBottom: 8 },
  blockText: { color: colors.text },

  infoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 },
  infoLabel: { color: colors.muted },
  infoValue: { color: colors.text, fontWeight: '700', marginLeft: spacing.md, flexShrink: 1, textAlign: 'right' },

  empty: { alignItems: 'center', padding: spacing.lg, gap: 8 },
  emptyTitle: { color: colors.text, fontWeight: '800' },
  emptySub: { color: colors.muted, textAlign: 'center' },
});
