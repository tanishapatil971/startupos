"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import type { Session, User } from "@supabase/supabase-js";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  hasCompany: boolean | null;
  refreshCompany: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompany, setHasCompany] = useState<boolean | null>(null);

  const checkCompany = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("companies")
        .select("id")
        .eq("user_id", userId)
        .single();
      
      if (!error && data) {
        setHasCompany(true);
      } else {
        setHasCompany(false);
      }
    } catch (err) {
      console.error("Error checking company:", err);
      setHasCompany(false);
    }
  }, []);

  const refreshCompany = useCallback(async () => {
    if (user) {
      await checkCompany(user.id);
    }
  }, [user, checkCompany]);

  useEffect(() => {
    let mounted = true;

    async function getInitialSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          if (session?.user) {
            await checkCompany(session.user.id);
          } else {
            setHasCompany(false);
          }
        }
      } catch (err) {
        console.error("Error getting session:", err);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!mounted) return;
        
        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          if (newSession?.user) {
             await checkCompany(newSession.user.id);
          }
        } else if (event === "SIGNED_OUT") {
          setHasCompany(null);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [checkCompany]);

  return (
    <AuthContext.Provider value={{ session, user, isLoading, hasCompany, refreshCompany }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
