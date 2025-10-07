import type { Transaction } from './types';

// util rápido p/ “dias atrás”
const daysAgo = (n: number) => Date.now() - n * 24 * 60 * 60 * 1000;

// lista fixa (pode ajustar à vontade)
const MOCK_TX: Transaction[] = [
  {
    id: 'tx_001',
    title: 'PIX de João',
    subtitle: 'Almoço',
    amount: -42.9,
    date: daysAgo(0),
    direction: 'out',
    status: 'completed',
    category: 'pix',
  },
  {
    id: 'tx_002',
    title: 'Cashback Recebido',
    subtitle: 'Campanha Avistão',
    amount: 12.5,
    date: daysAgo(1),
    direction: 'in',
    status: 'completed',
    category: 'cashback',
  },
  {
    id: 'tx_003',
    title: 'Cartão MercadoX',
    subtitle: 'Compra débito',
    amount: -189.0,
    date: daysAgo(1),
    direction: 'out',
    status: 'completed',
    category: 'card',
  },
  {
    id: 'tx_004',
    title: 'PIX Recebido',
    subtitle: 'Rafael Lucas',
    amount: 250.0,
    date: daysAgo(2),
    direction: 'in',
    status: 'completed',
    category: 'pix',
  },
  {
    id: 'tx_005',
    title: 'Transferência TED',
    subtitle: 'Aluguel',
    amount: -1200.0,
    date: daysAgo(3),
    direction: 'out',
    status: 'completed',
    category: 'transfer',
  },
  {
    id: 'tx_006',
    title: 'Reembolso',
    subtitle: 'Mercado',
    amount: 35.2,
    date: daysAgo(4),
    direction: 'in',
    status: 'completed',
    category: 'refund',
  },
  {
    id: 'tx_007',
    title: 'Cartão Padaria',
    subtitle: 'Crédito',
    amount: -18.0,
    date: daysAgo(5),
    direction: 'out',
    status: 'completed',
    category: 'card',
  },
];

function sortDesc(a: Transaction, b: Transaction) {
  return b.date - a.date;
}

export function getAllTransactions(): Transaction[] {
  return [...MOCK_TX].sort(sortDesc);
}

export function getRecentTransactions(limit = 5): Transaction[] {
  return getAllTransactions().slice(0, limit);
}
