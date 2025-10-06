export type TransactionDirection = 'in' | 'out';
export type TransactionStatus = 'completed' | 'pending' | 'failed';
export type TransactionCategory = 'pix' | 'transfer' | 'card' | 'cashback' | 'purchase' | 'refund';

export type Transaction = {
  id: string;
  title: string;
  subtitle?: string;
  amount: number;      // use negativo para saída, positivo para entrada
  date: number;        // epoch ms
  direction: TransactionDirection;
  status: TransactionStatus;
  category: TransactionCategory;
};
