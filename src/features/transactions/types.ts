export type TransactionDirection = 'in' | 'out';
export type TransactionStatus = 'completed' | 'pending' | 'failed';
export type TransactionCategory = 'pix' | 'transfer' | 'card' | 'cashback' | 'purchase' | 'refund';

export type Transaction = {
  id: string;
  title: string;
  subtitle?: string;
  amount: number;
  date: number; // epoch ms
  status: 'completed' | 'pending' | 'failed';
  category: 'pix' | 'transfer' | 'card' | 'purchase' | 'cashback' | 'refund';
};
