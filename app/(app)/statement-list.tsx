import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SectionList,
  Modal,
  Pressable,
  Animated,
} from 'react-native';
import {
  Filter, Calendar, ChevronDown,
  ArrowUpRight, ArrowDownRight, CreditCard, Gift, RotateCcw, Send, Download,
} from 'lucide-react-native';
import { Screen } from '@/components/layout/Screen';
import { colors, spacing, radius } from '@/theme/tokens';
import { listAllSync } from '@/features/transactions/repo';
import type { Transaction } from '@/features/transactions/types';
import { useRouter } from 'expo-router';

type PeriodKey = 'today' | 'week' | 'month' | 'last3' | 'year';

const PERIODS: { key: PeriodKey; label: string }[] = [
  { key: 'today', label: 'Hoje' },
  { key: 'week', label: 'Esta semana' },
  { key: 'month', label: 'Este mês' },
  { key: 'last3', label: 'Últimos 3 meses' },
  { key: 'year', label: 'Este ano' },
];

export default function StatementScreen() {
  const [selected, setSelected] = React.useState<PeriodKey>('month');
  const [showFilters, setShowFilters] = React.useState(false);
  const router = useRouter();

  const all = React.useMemo(() => listAllSync(), []);
  const filtered = React.useMemo(() => filterByPeriod(all, selected), [all, selected]);
  const sections = React.useMemo(() => toSections(filtered), [filtered]);

  return (
    <Screen>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Extrato</Text>
        <TouchableOpacity onPress={() => setShowFilters(true)} style={styles.headerBtn}>
          <Filter size={20} color={colors.muted} />
        </TouchableOpacity>
      </View>

      {/* Filtro por período */}
      <View style={{ paddingHorizontal: spacing.lg, marginBottom: spacing.md }}>
        <TouchableOpacity
          onPress={() => setShowFilters(true)}
          style={styles.periodBtn}
          activeOpacity={0.8}
        >
          <Calendar size={16} color={colors.muted} />
          <Text style={styles.periodLabel}>{PERIODS.find(p => p.key === selected)?.label}</Text>
          <ChevronDown size={16} color={colors.muted} />
        </TouchableOpacity>
      </View>

      {/* Lista agrupada */}
      {sections.length === 0 ? (
        <View style={styles.empty}>
          <Filter size={28} color={colors.muted} />
          <Text style={styles.emptyTitle}>Nenhuma transação encontrada</Text>
          <Text style={styles.emptySub}>Não há transações para o período selecionado</Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xl }}
          stickySectionHeadersEnabled={false}
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Text style={styles.sectionCount}>
                {section.data.length} {section.data.length === 1 ? 'transação' : 'transações'}
              </Text>
            </View>
          )}
          renderItem={({ item }) => (
            <TxRow
              tx={item}
              onPress={() =>
                router.push({
                  pathname: '/(app)/statement/[id]',
                  params: { id: item.id },
                })
              }
            />
          )}
          ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
          SectionSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        />
      )}

      {/* Modal de períodos */}
      <Modal visible={showFilters} transparent animationType="fade">
        <Pressable style={styles.backdrop} onPress={() => setShowFilters(false)} />
        <View style={styles.sheet}>
          <Text style={styles.sheetTitle}>Período</Text>
          <View style={{ marginTop: spacing.sm }}>
            {PERIODS.map(p => {
              const isActive = p.key === selected;
              return (
                <TouchableOpacity
                  key={p.key}
                  style={[styles.sheetItem, isActive && styles.sheetItemActive]}
                  onPress={() => { setSelected(p.key); setShowFilters(false); }}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.sheetItemText, isActive && styles.sheetItemTextActive]}>
                    {p.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

/** Row da transação com animação  **/
function TxRow({ tx, onPress }: { tx: Transaction; onPress?: () => void }) {
  const { Icon, bubble, signColor } = getVisual(tx);
  const isIn = tx.amount >= 0;
  const abs = Math.abs(tx.amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const sign = isIn ? '+' : '-';

  const date = new Date(tx.date);
  const dateStr = date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });

  const scale = React.useRef(new Animated.Value(1)).current;
  const onPressIn = () =>
    Animated.spring(scale, { toValue: 0.98, useNativeDriver: true, speed: 20, bounciness: 6 }).start();
  const onPressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 6 }).start();

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={onPress}
        activeOpacity={0.85}
        style={styles.item}
      >
        <View style={[styles.bubble, { backgroundColor: bubble }]}>
          <Icon size={18} color="#fff" />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.itemTitle}>{tx.title}</Text>
          <Text style={styles.itemSub} numberOfLines={1}>
            {tx.subtitle ?? '—'}
          </Text>
          <Text style={styles.itemDate}>{dateStr}</Text>
        </View>

        <View style={{ alignItems: 'flex-end' }}>
          <Text style={[styles.itemAmt, { color: signColor }]}>{sign}{abs}</Text>
          <View style={styles.statusRow}>
            <View
              style={[
                styles.dot,
                tx.status === 'completed'
                  ? { backgroundColor: '#10B981' }
                  : tx.status === 'pending'
                    ? { backgroundColor: '#F59E0B' }
                    : { backgroundColor: '#EF4444' },
              ]}
            />
            <Text style={styles.statusText}>
              {tx.status === 'completed' ? 'Concluída' : tx.status === 'pending' ? 'Pendente' : 'Falhada'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

/** Helpers de visual  */
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

/** Helpers de dados  */
function filterByPeriod(list: Transaction[], key: PeriodKey) {
  const now = new Date();
  const start = new Date(now);

  switch (key) {
    case 'today':
      start.setHours(0, 0, 0, 0);
      break;
    case 'week': {
      const day = now.getDay(); 
      const diff = (day + 6) % 7; 
      start.setDate(now.getDate() - diff);
      start.setHours(0, 0, 0, 0);
      break;
    }
    case 'month':
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      break;
    case 'last3': {
      start.setMonth(now.getMonth() - 2, 1);
      start.setHours(0, 0, 0, 0);
      break;
    }
    case 'year':
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
      break;
  }

  return list.filter(tx => tx.date >= start.getTime());
}

function toSections(list: Transaction[]) {
  const map = new Map<string, { title: string; key: string; data: Transaction[]; dateKey: number }>();
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);

  for (const tx of list) {
    const d = new Date(tx.date);
    const day = new Date(d); day.setHours(0, 0, 0, 0);

    let title: string;
    if (day.getTime() === today.getTime()) title = 'Hoje';
    else if (day.getTime() === yesterday.getTime()) title = 'Ontem';
    else title = d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });

    const key = `${day.getTime()}`;
    if (!map.has(key)) map.set(key, { title, key, data: [], dateKey: day.getTime() });
    map.get(key)!.data.push(tx);
  }

  const sections = Array.from(map.values())
    .sort((a, b) => b.dateKey - a.dateKey)
    .map(s => ({ ...s, data: s.data.sort((a, b) => b.date - a.date) }));

  return sections;
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
  headerTitle: { color: colors.text, fontSize: 20, fontWeight: '800' },
  headerBtn: {
    width: 36, height: 36, alignItems: 'center', justifyContent: 'center',
    borderRadius: 10, backgroundColor: '#F3F4F6',
  },

  periodBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#F3F4F6', borderRadius: 12,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
  },
  periodLabel: { color: colors.text, fontWeight: '700' },

  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginTop: spacing.md, marginBottom: spacing.sm,
  },
  sectionTitle: { color: colors.muted, fontWeight: '700' },
  sectionCount: { color: colors.muted, fontSize: 12 },

  item: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: '#fff', borderRadius: radius.xl, padding: spacing.md,
    borderWidth: StyleSheet.hairlineWidth, borderColor: '#E5E7EB',
  },
  bubble: {
    width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center',
  },
  itemTitle: { color: colors.text, fontWeight: '800' },
  itemSub: { color: colors.muted, marginTop: 2 },
  itemDate: { color: colors.muted, fontSize: 12, marginTop: 2 },
  itemAmt: { fontWeight: '800', fontSize: 14 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { color: colors.muted, fontSize: 12 },

  empty: { alignItems: 'center', padding: spacing.xl, gap: 8 },
  emptyTitle: { color: colors.text, fontWeight: '800' },
  emptySub: { color: colors.muted },

  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.25)' },
  sheet: {
    position: 'absolute', left: spacing.lg, right: spacing.lg, top: 120,
    backgroundColor: '#fff', borderRadius: radius.xl, padding: spacing.lg,
    borderWidth: StyleSheet.hairlineWidth, borderColor: '#E5E7EB',
  },
  sheetTitle: { color: colors.text, fontWeight: '800', fontSize: 16 },
  sheetItem: { paddingVertical: 12, paddingHorizontal: 8, borderRadius: 10 },
  sheetItemActive: { backgroundColor: '#F3F4F6' },
  sheetItemText: { color: colors.text, fontWeight: '600' },
  sheetItemTextActive: { color: colors.primaryStart },
});
