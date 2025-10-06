import { dbReady, run, first } from './client';

export async function ensureSeedAccounts() {
  await dbReady();
  const row = await first<{ c: number }>(`SELECT COUNT(1) as c FROM accounts;`);
  if ((row?.c ?? 0) > 0) return;

  const now = Date.now();
  await run(`INSERT INTO accounts (name, cpf_cnpj, password, created_at) VALUES (?, ?, ?, ?);`,
    ['Rafa',  '00009100000', '123456', now]);
  await run(`INSERT INTO accounts (name, cpf_cnpj, password, created_at) VALUES (?, ?, ?, ?);`,
    ['Maria', '00009100001', '123456', now]);
}
