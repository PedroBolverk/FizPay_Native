import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { getLastSessionAccount, clearSessions } from '@/db/auth';  // Funções de sessão

type User = { 
  id: string;
  name: string;
  avatar: string | null;
  email?: string | null; 
} | null;

type AuthCtx = {
  user: User;
  loading: boolean;
  setUser: (u: User) => void;
  reload: () => Promise<void>;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);  // Estado para controlar o carregamento

  // Função para recarregar o usuário
  async function reload() {
    try {
      const acc = await getLastSessionAccount();  // Obtém a última conta ativa
      console.log('Account loaded from DB:', acc); // Verifique os dados carregados

      if (acc) {
        setUser({
          id: String(acc.id),  // Garantindo que o id seja string
          name: acc.name,
          avatar: acc.avatar ?? null,
          email: acc.email ?? `${acc.name.toLowerCase()}@email.com`,  // Usando o `email`
        });
      } else {
        setUser(null);  // Se não houver usuário, seta o estado para null
      }
    } catch (e) {
      console.error("Erro ao carregar a conta:", e);
      setUser(null);  // Caso ocorra erro, garantir que o estado de usuário seja limpo
    } finally {
      setLoading(false);  // Indica que o carregamento foi finalizado
    }
  }

  useEffect(() => {
    reload();
  }, []);

  async function signOut() {
    await clearSessions();  // Limpa a sessão do banco de dados
    setUser(null);  // Limpa o estado do usuário
  }

  const value = useMemo(() => ({ user, loading, setUser, reload, signOut }), [user, loading]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
