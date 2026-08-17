/**
 * Sleep Diary v2.5 - Session Hook
 *
 * React hook for authentication state management.
 * Provides session context for Identity-aware Navigation.
 * Integrates with sync client to trigger initial sync after login.
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import type { SessionState } from "@/services/auth/auth-types";
import { getSyncClient, updateStatus } from "@/services/sync/sync-client";

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
  const wasAuthenticatedRef = useRef<boolean>(false);

  /**
   * Handle the transition to authenticated state.
   * Triggers initial sync: restore (pull remote data) + upload local changes.
   * Only fires on the transition from unauthenticated → authenticated.
   */
  const handleBecomeAuthenticated = useCallback(async () => {
    if (typeof window === "undefined") return;

    try {
      const client = getSyncClient();
      client.setAuthenticated(true);
      updateStatus("syncing");

      // First restore — pull all server data and merge into local
      const restoreResult = await client.restore();

      // Then sync — upload any local-only / pending records
      // (restore already pulls, but sync pushes local changes the server didn't have)
      if (restoreResult.success) {
        await client.sync();
      }

      // Dispatch event so components (Timeline, stats) can refresh
      window.dispatchEvent(new CustomEvent("reflection-storage-change"));
    } catch (error) {
      console.error("Initial sync after login failed:", error);
      updateStatus("sync-failed");
    }
  }, []);

  /**
   * Handle the transition to unauthenticated state.
   * Clears sync status but preserves local data.
   */
  const handleBecomeUnauthenticated = useCallback(() => {
    if (typeof window === "undefined") return;

    try {
      const client = getSyncClient();
      client.handleSignOut();
    } catch (error) {
      console.error("Sign-out sync cleanup failed:", error);
    }
  }, []);

  const refreshSession = useCallback(async () => {
    const wasAuth = wasAuthenticatedRef.current;
    try {
      const response = await fetch("/api/auth/session");
      const data = await response.json();

      if (data.authenticated) {
        const newSession = {
          isAuthenticated: true,
          user: data.user,
          expiresAt: data.session?.expiresAt,
        };
        setSession(newSession);

        // Trigger initial sync only on transition unauth → auth
        if (!wasAuth) {
          wasAuthenticatedRef.current = true;
          handleBecomeAuthenticated();
        }
      } else {
        setSession(null);
        if (wasAuth) {
          wasAuthenticatedRef.current = false;
          handleBecomeUnauthenticated();
        }
      }
    } catch (error) {
      setSession(null);
      if (wasAuth) {
        wasAuthenticatedRef.current = false;
        handleBecomeUnauthenticated();
      }
    } finally {
      setLoading(false);
    }
  }, [handleBecomeAuthenticated, handleBecomeUnauthenticated]);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setSession(null);
      wasAuthenticatedRef.current = false;
      handleBecomeUnauthenticated();
      window.dispatchEvent(new CustomEvent("reflection-storage-change"));
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, [handleBecomeUnauthenticated]);

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
