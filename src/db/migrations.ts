// Migrações versionadas. Cada migração tem um ID incremental.
// Evite multi-statements numa única string; dispare em ordem.

export type Migration = {
  id: number;           // ex.: 1, 2, 3...
  name: string;         // rótulo amigável
  up: string[];         // comandos SQL (em ordem)
};

export const migrations: Migration[] = [
  {
    id: 1,
    name: 'init-accounts-sessions',
    up: [
      `PRAGMA foreign_keys = ON;`,
      `CREATE TABLE IF NOT EXISTS _migrations (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        run_at INTEGER NOT NULL
      );`,
      `CREATE TABLE IF NOT EXISTS accounts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        cpf_cnpj TEXT NOT NULL UNIQUE,
        avatar TEXT,
        password TEXT,
        created_at INTEGER NOT NULL
      );`,
      `CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        account_id INTEGER NOT NULL,
        created_at INTEGER NOT NULL,
        FOREIGN KEY(account_id) REFERENCES accounts(id) ON DELETE CASCADE
      );`,
    ],
  },
  // Futuras migrações: { id: 2, name: '...', up: [ ... ] }
];
