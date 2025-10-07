// src/db/index.ts
import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('fizpay_v2.db');

export function bootstrapDbSync() {
  // PRAGMAs básicos
  db.execSync('PRAGMA journal_mode = WAL;');

  // Lê versão do schema
  const row = db.getFirstSync<{ user_version: number }>('PRAGMA user_version;');
  const v = row?.user_version ?? 0;

  if (v < 1) {
    // Tabelas
    db.execSync(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT,
        avatar TEXT
      );
    `);

    db.execSync(`
      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        subtitle TEXT,
        amount REAL NOT NULL,   -- + entrada, - saída
        date INTEGER NOT NULL,  -- epoch ms
        status TEXT NOT NULL,   -- completed | pending | failed
        category TEXT NOT NULL  -- pix | transfer | card | purchase | cashback | refund
      );
    `);

    // Índice útil para ordenação por data (opcional, mas recomendado)
    db.execSync(`CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date DESC);`);

    // Seed inicial
    seedDemoDataSync();

    // Marca versão de schema
    db.execSync('PRAGMA user_version = 1;');
  }
}

/** =========================================================
 *  SEED DE DEMONSTRAÇÃO — EDITE AQUI seus "mocks"
 *  =======================================================*/
export function seedDemoDataSync() {
  const count =
    db.getFirstSync<{ count: number }>(
      'SELECT COUNT(*) AS count FROM transactions'
    )?.count ?? 0;

  // Só popula se estiver vazio (para não duplicar)
  if (count > 0) return;

  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;

  // id, title, subtitle, amount, date(ms), status, category
  const txs: [string, string, string, number, number, string, string][] = [
    ['t1','PIX Recebido','De: João Silva',                250.00, now - 1*day, 'completed','pix'],
    ['t2','Compra no débito','Supermercado Extra',        -89.50, now - 1*day, 'completed','purchase'],
    ['t3','PIX Enviado','Para: Maria Santos',             -150.00, now - 2*day, 'completed','pix'],
    ['t4','Cashback','Compra Farmácia Droga Raia',        12.50,  now - 2*day, 'completed','cashback'],
    ['t5','Pagamento','Netflix Mensal',                   -39.90, now - 3*day, 'completed','purchase'],
    ['t6','PIX Recebido','De: Vitoria Oliveira',           75.00,  now - 4*day, 'completed','pix'],
    ['t7','PIX Recebido','De: Jose Oliveira',             175.00,  now - 5*day, 'completed','pix'],
    ['t8','PIX Recebido','De: Pedro Oliveira',            275.00,  now - 0*day, 'completed','pix'],
    // ➕ adicione/edite linhas à vontade
  ];

  const insert = db.prepareSync(
    'INSERT INTO transactions (id,title,subtitle,amount,date,status,category) VALUES (?,?,?,?,?,?,?)'
  );

  db.withTransactionSync(() => {
    for (const row of txs) insert.executeSync(row as any);

    // Usuário demo (edite aqui também)
    db.runSync(
      'INSERT OR REPLACE INTO users (id,name,email,avatar) VALUES (?,?,?,?)',
      [
        'u1',
        'Rafael Lucas',
        'rafael@email.com',
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      ]
    );
  });

  insert.finalizeSync();
}

/** =========================================================
 *  DEV ONLY: resetar e reaplicar seed rapidamente
 *  =======================================================*/
export function resetAndSeedSync() {
  db.withTransactionSync(() => {
    db.execSync('DELETE FROM transactions;');
    db.execSync('DELETE FROM users;');
  });
  seedDemoDataSync();
}
