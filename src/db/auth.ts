import { dbReady, first, run, onlyDigits } from './client';
import { all } from './client';
import type { Account, Session } from './types';
import { getAccountById } from './accounts';
import * as SecureStore from 'expo-secure-store'; // Importando expo-secure-store para armazenar credenciais

// Login com senha
export async function loginWithPassword(cpfOrCnpj: string, password?: string | null): Promise<Account> {
  await dbReady();
  const row = await first<Account>(
    `SELECT * FROM accounts WHERE cpf_cnpj=?;`,
    [onlyDigits(cpfOrCnpj)]
  );

  if (!row) throw new Error('Credenciais inválidas');

  // Verifica se a senha fornecida corresponde à senha armazenada
  if (password !== row.password) {
    throw new Error('Credenciais inválidas');
  }

  // Armazenar a senha no SecureStore após o login, para preenchimento automático
  await SecureStore.setItemAsync('user_credentials', JSON.stringify({ cpfOrCnpj, password: password ?? '' }));

  // Criação de uma sessão para o login
  await run(`INSERT INTO sessions (account_id, created_at) VALUES (?, ?);`, [row.id, Date.now()]);
  return row;
}

// Criar sessão para o usuário
export async function createSession(accountId: number): Promise<Session> {
  await dbReady();
  const now = Date.now();
  const res = await run(`INSERT INTO sessions (account_id, created_at) VALUES (?, ?);`, [accountId, now]);
  const id = Number(res.lastInsertRowId);
  const s = await first<Session>(`SELECT * FROM sessions WHERE id=?;`, [id]);
  return s!;
}

// Listar todas as sessões
export async function listSessions(): Promise<Session[]> {
  await dbReady();
  return all<Session>(
    `SELECT * FROM sessions ORDER BY created_at DESC;`
  );
}

// Limpar todas as sessões
export async function clearSessions() {
  await dbReady();
  await run(`DELETE FROM sessions;`);
}

// Recuperar a última conta que foi logada
export async function getLastSessionAccount(): Promise<Account | null> {
  await dbReady();
  const s = await first<{ account_id: number }>(
    `SELECT account_id FROM sessions ORDER BY created_at DESC LIMIT 1;`
  );
  if (!s) return null;
  return getAccountById(s.account_id);
}

// Recuperar as credenciais salvas no SecureStore
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
