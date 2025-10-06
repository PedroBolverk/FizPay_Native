import { all, first, run, dbReady, onlyDigits } from './client';
import type { Account } from './types';

// Cria conta
export async function createAccount(input: {
  name: string;
  cpfOrCnpj: string;
  password?: string | null;
  avatar?: string | null;
}): Promise<Account> {
  await dbReady();
  const now = Date.now();
  const digits = onlyDigits(input.cpfOrCnpj);

  const res = await run(
    `INSERT INTO accounts (name, cpf_cnpj, avatar, password, created_at)
     VALUES (?, ?, ?, ?, ?);`,
    [input.name.trim(), digits, input.avatar ?? null, input.password ?? null, now]
  );

  const id = Number(res.lastInsertRowId);
  return (await getAccountById(id))!;
}

// Atualiza (parcial) conta por ID
export async function updateAccount(id: number, patch: {
  name?: string;
  password?: string | null;
  avatar?: string | null;
}): Promise<Account> {
  await dbReady();
  const current = await getAccountById(id);
  if (!current) throw new Error('Conta não encontrada');

  const name = patch.name?.trim() ?? current.name;
  const avatar = patch.avatar === undefined ? current.avatar ?? null : patch.avatar;
  const password = patch.password === undefined ? current.password ?? null : patch.password;

  await run(
    `UPDATE accounts SET name=?, avatar=?, password=? WHERE id=?;`,
    [name, avatar, password, id]
  );

  return (await getAccountById(id))!;
}

export async function upsertAccount(input: {
  name: string;
  cpfOrCnpj: string;
  password?: string | null;
  avatar?: string | null;
}): Promise<Account> {
  await dbReady();
  const digits = onlyDigits(input.cpfOrCnpj);
  const existing = await getAccountByCpf(digits);
  if (existing) {
    return updateAccount(existing.id, {
      name: input.name,
      avatar: input.avatar ?? null,
      password: input.password ?? null,
    });
  }
  return createAccount(input);
}

export async function getAccountById(id: number): Promise<Account | null> {
  await dbReady();
  return first<Account>(`SELECT * FROM accounts WHERE id=?;`, [id]);
}

export async function getAccountByCpf(cpfDigits: string): Promise<Account | null> {
  await dbReady();
  return first<Account>(`SELECT * FROM accounts WHERE cpf_cnpj=?;`, [onlyDigits(cpfDigits)]);
}

export async function listAccounts(): Promise<Account[]> {
  await dbReady();
  return all<Account>(`SELECT * FROM accounts ORDER BY created_at DESC;`);
}

export async function deleteAccount(id: number) {
  await dbReady();
  await run(`DELETE FROM accounts WHERE id=?;`, [id]);
}
