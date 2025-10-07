// src/features/transactions/repo.ts
import { db } from '@/db';
import type { Transaction } from './types';

// Converte a linha do SQLite para nosso tipo
function mapRow(r: any): Transaction {
  return {
    id: String(r.id),
    title: String(r.title),
    subtitle: r.subtitle ?? null,
    amount: Number(r.amount),
    date: Number(r.date),
    status: r.status as Transaction['status'],
    category: r.category as Transaction['category'],
  };
}

// Lista TODAS as transações (mais recentes primeiro)
export function listAllSync(): Transaction[] {
  const rows = db.getAllSync(
    'SELECT id, title, subtitle, amount, date, status, category FROM transactions ORDER BY date DESC'
  ) as any[];
  return rows.map(mapRow);
}

// Lista as N mais recentes
export function listRecentSync(limit = 5): Transaction[] {
  const rows = db.getAllSync(
    'SELECT id, title, subtitle, amount, date, status, category FROM transactions ORDER BY date DESC LIMIT ?',
    [limit]
  ) as any[];
  return rows.map(mapRow);
}

// Opcional: buscar por ID (para tela de detalhe)
export function getByIdSync(id: string): Transaction | null {
  const row = db.getFirstSync(
    'SELECT id, title, subtitle, amount, date, status, category FROM transactions WHERE id = ?',
    [id]
  ) as any;
  return row ? mapRow(row) : null;
}
