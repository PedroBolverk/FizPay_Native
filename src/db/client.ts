import { openDatabaseSync, type SQLiteDatabase } from 'expo-sqlite';
import { migrations, type Migration } from './migrations';

let _db: SQLiteDatabase | null = null;

export function db(): SQLiteDatabase {
  if (_db) return _db;
  _db = openDatabaseSync('app.db');
  return _db;
}

// Helpers curtos da API v13+
export async function exec(sql: string) {
  return db().execAsync(sql);
}
export async function run(sql: string, params: any[] = []) {
  return db().runAsync(sql, params);
}
export async function all<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  return db().getAllAsync<T>(sql, params);
}
export async function first<T = any>(sql: string, params: any[] = []): Promise<T | null> {
  return db().getFirstAsync<T>(sql, params);
}

// Aplica migrações que ainda não rodaram
export async function applyMigrations() {
  await exec('PRAGMA foreign_keys = ON;');

  // garante tabela de controle
  await exec(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      run_at INTEGER NOT NULL
    );
  `);

  const applied = await all<{ id: number }>(`SELECT id FROM _migrations;`);
  const already = new Set(applied.map(r => r.id));

  for (const m of migrations.sort((a,b) => a.id - b.id)) {
    if (already.has(m.id)) continue;
    // roda cada statement na ordem
    for (const sql of m.up) {
      await exec(sql);
    }
    // registra migração
    await run(
      `INSERT INTO _migrations (id, name, run_at) VALUES (?, ?, ?);`,
      [m.id, m.name, Date.now()]
    );
  }
}

// Chame no boot do app
export async function dbReady() {
  db(); // abre
  await applyMigrations();
}

// Utils comuns
export const onlyDigits = (v: string) => v.replace(/\D/g, '');
