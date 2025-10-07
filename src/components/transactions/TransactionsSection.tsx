import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  ArrowUpRight, ArrowDownRight, CreditCard, Gift, RotateCcw,
  Send, Download, QrCode
} from 'lucide-react-native';
import { colors, spacing, radius } from '@/theme/tokens';

type Transaction = {
  id: string;
  title: string;
  subtitle?: string;
  amount: number;     // >=0 entrada, <0 saída
  date: number;       // epoch ms
  category: 'pix' | 'transfer' | 'card' | 'cashback' | 'purchase' | 'refund';
};

export function TransactionsSection({
  title,
  data = [],
  onSeeAll,
}: {
  title: string;
  data?: Transaction[];
  onSeeAll?: () => void;
}) {
  return (
    <View style={{ paddingBottom: spacing.xl }}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={onSeeAll}>
          <Text style={styles.link}>Ver Tudo</Text>
        </TouchableOpacity>
      </View>

      {data.length === 0 ? (
        <View style={styles.empty}>
          <QrCode size={28} color={colors.muted} />
          <Text style={styles.emptyText}>Nenhuma transação recente</Text>
        </View>
      ) : (
        <View style={{ gap: spacing.sm }}>
          {data.map((tx) => {
            const { Icon, bubble, signColor } = getVisual(tx);
            const amountAbs = Math.abs(tx.amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            const sign = tx.amount >= 0 ? '+' : '-';
            const date = new Date(tx.date);
            const dateStr = date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });

            return (
              <View key={tx.id} style={styles.item}>
                <View style={[styles.iconBubble, { backgroundColor: bubble }]}>
                  <Icon size={18} color="#fff" />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitle}>{tx.title}</Text>
                  <Text style={styles.itemSub}>
                    {tx.subtitle ?? '—'}{'\n'}
                    <Text style={styles.itemDate}>{dateStr}</Text>
                  </Text>
                </View>

                <Text style={[styles.itemAmt, { color: signColor }]}>
                  {sign}{amountAbs}
                </Text>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

/** Mapping visual por categoria + direção */
function getVisual(tx: Transaction) {
  const isIn = tx.amount >= 0;

  // cores
  const green = '#10B981';
  const red = '#EF4444';
  const gray = '#6B7280';

  // defaults por direção
  let Icon = isIn ? ArrowUpRight : ArrowDownRight;
  let bubble = isIn ? green : red;
  let signColor = isIn ? green : red;

  switch (tx.category) {
    case 'pix':
      Icon = isIn ? Download : Send; // entrada/saída
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
      signColor = isIn ? green : red;
  }

  return { Icon, bubble, signColor };
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md },
  title: { color: colors.text, fontWeight: '800' },
  link: { color: colors.primaryStart, fontWeight: '700', fontSize: 12 },

  empty: { alignItems: 'center', paddingVertical: spacing.xl, gap: 8, backgroundColor: '#F3F4F6', borderRadius: radius.lg },
  emptyText: { color: colors.muted, fontSize: 12 },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    gap: spacing.md,
  },
  iconBubble: {
    width: 32, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  itemTitle: { color: colors.text, fontWeight: '700' },
  itemSub: { color: colors.muted, fontSize: 12, marginTop: 2 },
  itemDate: { color: colors.muted },
  itemAmt: { fontWeight: '800', marginLeft: spacing.md },
});
