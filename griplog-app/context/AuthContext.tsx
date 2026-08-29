import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Redirect, useSegments } from 'expo-router';

import { supabase } from '../lib/supabase';

export type AuthSession = {
  userId: string | null;
  email: string | null;
  isAuthenticated: boolean;
};

const AuthContext = createContext<{
  session: AuthSession;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}>({
  session: {
    userId: null,
    email: null,
    isAuthenticated: false,
  },
  signOut: async () => undefined,
  refreshSession: async () => undefined,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const segments = useSegments();
  const [session, setSession] = useState<AuthSession>({
    userId: null,
    email: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;

      setSession({
        userId: user?.id ?? null,
        email: user?.email ?? null,
        isAuthenticated: Boolean(user),
      });
    };

    loadSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      const user = nextSession?.user;
      setSession({
        userId: user?.id ?? null,
        email: user?.email ?? null,
        isAuthenticated: Boolean(user),
      });
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';
    const inTabsGroup = segments[0] === '(tabs)';

    if (!session.isAuthenticated && inTabsGroup) {
      return;
    }

    if (session.isAuthenticated && inAuthGroup) {
      return;
    }
  }, [segments, session]);

  const value = useMemo(
    () => ({
      session,
      signOut: async () => {
        await supabase.auth.signOut();
        setSession({ userId: null, email: null, isAuthenticated: false });
      },
      refreshSession: async () => {
        await supabase.auth.getSession();
      },
    }),
    [session],
  );

  const isAuthRoute = segments[0] === '(auth)';
  const isProtectedRoute = segments[0] === '(tabs)';

  if (!session.isAuthenticated && isProtectedRoute) {
    return <Redirect href="/(auth)/login" />;
  }

  if (session.isAuthenticated && isAuthRoute) {
    return <Redirect href="/(tabs)" />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
