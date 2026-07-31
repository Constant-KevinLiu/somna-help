/**
 * Sleep Diary v2.3 - Session Hook
 * 
 * React hook for authentication state management.
 * Provides session context for Identity-aware Navigation.
 */

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { SessionState } from "@/services/auth/auth-types";

interface SessionContextType {
  session: SessionState | null;
  loading: boolean;
  refreshSession: () => Promise<void>;
  logout: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionState | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/session");
      const data = await response.json();
      
      if (data.authenticated) {
        setSession({
          isAuthenticated: true,
          user: data.user,
          expiresAt: data.session?.expiresAt,
        });
      } else {
        setSession(null);
      }
    } catch (error) {
      setSession(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setSession(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, []);

  // Load session on mount
  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  return (
    <SessionContext.Provider value={{ session, loading, refreshSession, logout }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
