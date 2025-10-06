import { dbReady, first, run, onlyDigits } from './client';
import type { Account, Session } from './types';
import { getAccountById } from './accounts';
// (DEMO) Login: valida cpf + senha
export async function loginWithPassword(cpfOrCnpj: string, password?: string | null): Promise<Account> {
  await dbReady();
  const row = await first<Account>(
    `SELECT * FROM accounts WHERE cpf_cnpj=? AND (password IS NULL OR password=?);`,
    [onlyDigits(cpfOrCnpj), password ?? null]
  );
  if (!row) throw new Error('Credenciais inválidas');
  await run(`INSERT INTO sessions (account_id, created_at) VALUES (?, ?);`, [row.id, Date.now()]);
  return row;
}

export async function createSession(accountId: number): Promise<Session> {
  await dbReady();
  const now = Date.now();
  const res = await run(`INSERT INTO sessions (account_id, created_at) VALUES (?, ?);`, [accountId, now]);
  const id = Number(res.lastInsertRowId);
  const s = await first<Session>(`SELECT * FROM sessions WHERE id=?;`, [id]);
  return s!;
}

export async function listSessions(): Promise<Session[]> {
  await dbReady();
  return (await import('./client')).all<Session>(
    `SELECT * FROM sessions ORDER BY created_at DESC;`
  );
}

export async function clearSessions() {
  await dbReady();
  await run(`DELETE FROM sessions;`);
}

export async function getLastSessionAccount(): Promise<Account | null> {
  await dbReady();
  const s = await first<{ account_id: number }>(
    `SELECT account_id FROM sessions ORDER BY created_at DESC LIMIT 1;`
  );
  if (!s) return null;
  return getAccountById(s.account_id);
}