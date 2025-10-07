import { all, first, run, dbReady, onlyDigits } from './client';
import type { Account } from './types';
import * as SecureStore from 'expo-secure-store';

// Cria conta
export async function createAccount(input: {
  name: string;
  cpfOrCnpj: string;
  password?: string | null;  // A senha agora é uma string normal
  avatar?: string | null;
}): Promise<Account> {
  await dbReady();
  const now = Date.now();
  const digits = onlyDigits(input.cpfOrCnpj);

  let savedPassword: string | null = null;
  if (input.password) {
    savedPassword = input.password;  // Salva a senha como string normal
  }

  const res = await run(
    `INSERT INTO accounts (name, cpf_cnpj, avatar, password, created_at)
     VALUES (?, ?, ?, ?, ?);`,
    [input.name.trim(), digits, input.avatar ?? null, savedPassword, now]
  );

  const id = Number(res.lastInsertRowId);
  const newAccount = await getAccountById(id);

  // Salva a senha no SecureStore após a criação da conta
  if (input.password) {
    await SecureStore.setItemAsync('user_credentials', JSON.stringify({ cpfOrCnpj: input.cpfOrCnpj, password: input.password }));
  }

  return newAccount!;
}
export async function upsertAccount(input: {
  name: string;
  cpfOrCnpj: string;
  password?: string | null;
  avatar?: string | null;
}): Promise<Account> {
  await dbReady();
  const digits = onlyDigits(input.cpfOrCnpj);
  
  // Verificar se a conta já existe com o mesmo CPF/CNPJ
  const existing = await getAccountByCpf(digits);
  
  if (existing) {
    // Se a conta existir, atualiza
    return updateAccount(existing.id, {
      name: input.name,
      avatar: input.avatar ?? null,
      password: input.password ?? null,
    });
  } else {
    // Caso contrário, cria uma nova conta
    return createAccount(input);
  }
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

// Recupera uma conta por CPF
export async function getAccountById(id: number): Promise<Account | null> {
  await dbReady();
  return first<Account>(`SELECT * FROM accounts WHERE id=?;`, [id]);
}

// Recupera uma conta por CPF
export async function getAccountByCpf(cpfDigits: string): Promise<Account | null> {
  await dbReady();
  return first<Account>(`SELECT * FROM accounts WHERE cpf_cnpj=?;`, [onlyDigits(cpfDigits)]);
}

// Listar todas as contas
export async function listAccounts(): Promise<Account[]> {
  await dbReady();
  return all<Account>(`SELECT * FROM accounts ORDER BY created_at DESC;`);
}

// Deletar conta
export async function deleteAccount(id: number) {
  await dbReady();
  await run(`DELETE FROM accounts WHERE id=?;`, [id]);
}

// Função para obter as credenciais salvas no SecureStore
export async function getSavedCredentials() {
  try {
    const credentials = await SecureStore.getItemAsync('user_credentials');
    if (credentials) {
      console.log('Credenciais salvas', credentials);
      return JSON.parse(credentials); // Retorna o objeto com cpf/cnpj e senha
    } else {
      console.log('Nenhuma credencial salva encontrada');
      return null;
    }
  } catch (error) {
    console.error('Erro ao recuperar credenciais:', error);
    return null;
  }
}
