export type Account = {
  id: number;
  name: string;
  email?: string | null;
  cpf_cnpj: string;           // salve sem máscara (apenas dígitos)
  avatar?: string | null;
  password?: string | null;   // DEMO: em produção, use hash + salt
  created_at: number;         // epoch ms
};

export type Session = {
  id: number;
  account_id: number;
  created_at: number;
};
