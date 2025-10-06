import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronRight, ChevronUp } from 'lucide-react-native';
import { colors, radius, spacing } from '@/theme/tokens';
import type { Account } from '@/db/types';

type Props = {
  accounts: Account[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  footerRight?: React.ReactNode; // ex.: "Acessar outra conta"
};

export function AccountListCard({ accounts, selectedId, onSelect, footerRight }: Props) {
  return (
    <View style={styles.card}>
      {accounts.map((a, i) => (
        <React.Fragment key={a.id}>
          <TouchableOpacity style={styles.row} onPress={() => onSelect(a.id)} activeOpacity={0.7}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{a.name}</Text>
              <Text style={styles.cpf}>
                CPF: ***.{a.cpf_cnpj.slice(-9, -6)}.{a.cpf_cnpj.slice(-6, -3)}-**
              </Text>
            </View>
            {selectedId === a.id ? (
              <ChevronUp size={18} color="#9CA3AF" />
            ) : (
              <ChevronRight size={18} color="#9CA3AF" />
            )}
          </TouchableOpacity>
          {i < accounts.length - 1 && <View style={styles.sep} />}
        </React.Fragment>
      ))}

      {!!footerRight && <View style={{ alignItems: 'flex-end', paddingTop: 8 }}>{footerRight}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  name: { color: colors.text, fontSize: 16, fontWeight: '700' },
  cpf: { color: colors.muted, marginTop: 2 },
  sep: { height: StyleSheet.hairlineWidth, backgroundColor: '#E5E7EB' },
});
