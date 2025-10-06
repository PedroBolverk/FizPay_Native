import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Receipt } from 'lucide-react-native';
import { colors, spacing, radius } from '@/theme/tokens';

type Tx = {
  id: string;
  title: string;
  subtitle?: string;
  amount: number;  // negativo = saída, positivo = entrada
  date: number;
};

export function TransactionsSection({
  title,
  data = [],
  onSeeAll,
}: {
  title: string;
  data?: Tx[];
  onSeeAll?: () => void;
}) {
  return (
    <View style={{ paddingBottom: spacing.xl }}>
      <View style={styles.row}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={onSeeAll}>
          <Text style={styles.link}>Ver Tudo</Text>
        </TouchableOpacity>
      </View>

      {data.length === 0 ? (
        <View style={styles.empty}>
          <Receipt size={32} color={colors.muted} />
          <Text style={styles.emptyText}>Nenhuma transação recente</Text>
        </View>
      ) : (
        <View style={{ gap: spacing.sm }}>
          {data.map(tx => {
            const positive = tx.amount >= 0;
            const amt = Math.abs(tx.amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            return (
              <View key={tx.id} style={styles.item}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitle}>{tx.title}</Text>
                  {!!tx.subtitle && <Text style={styles.itemSub}>{tx.subtitle}</Text>}
                </View>
                <Text style={[styles.itemAmt, { color: positive ? colors.success : colors.text }]}>
                  {positive ? '+' : '-'}{amt}
                </Text>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md },
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
  },
  itemTitle: { color: colors.text, fontWeight: '700' },
  itemSub: { color: colors.muted, fontSize: 12, marginTop: 2 },
  itemAmt: { fontWeight: '700', marginLeft: spacing.md },
});
