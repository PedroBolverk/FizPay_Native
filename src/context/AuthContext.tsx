import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Account } from '@/db/types';
import { getLastSessionAccount, clearSessions } from '@/db/auth';

type User = (Pick<Account, 'id'|'name'|'avatar'> & { email?: string | null }) | null;

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
  const [loading, setLoading] = useState(true);

  async function reload() {
    try {
      const acc = await getLastSessionAccount();
      if (acc) {
        setUser({ id: acc.id, name: acc.name, avatar: acc.avatar ?? null, email: `${acc.name.toLowerCase()}@email.com` });
      } else {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { reload(); }, []);

  async function signOut() {
    await clearSessions();
    setUser(null);
  }

  const value = useMemo(() => ({ user, loading, setUser, reload, signOut }), [user, loading]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
