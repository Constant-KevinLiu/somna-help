/**
 * Sleep Diary v2.3 — Sync Status Component
 *
 * Reusable component showing current sync state.
 * Integrates with Identity Menu, Diary, and Reminder Center.
 */

import { useEffect, useState } from "react";
import { getSyncStatus, updateStatus } from "@/services/sync/sync-client";
import type { SyncStatusInfo, SyncStatusDisplay } from "@/services/sync/sync-types";
import { useI18n } from "@/lib/i18n";
import { authCopyEn } from "@/content/en/auth/auth-copy";
import { authCopyEs } from "@/content/es/auth/auth-copy";
import { authCopyPtBr } from "@/content/pt-BR/auth/auth-copy";
import { authCopyPl } from "@/content/pl/auth/auth-copy";

interface SyncStatusProps {
  compact?: boolean;
  showSyncNow?: boolean;
}

const STATUS_ICONS: Record<SyncStatusDisplay, string> = {
  "local-only": "📱",
  syncing: "🔄",
  synced: "✓",
  offline: "📡",
  "needs-attention": "⚠️",
  "sync-failed": "✗",
};

function getSyncCopyForLocale(locale: string) {
  switch (locale) {
    case "es":
      return authCopyEs.content.sync;
    case "pt-BR":
      return authCopyPtBr.content.sync;
    case "pl":
      return authCopyPl.content.sync;
    default:
      return authCopyEn.content.sync;
  }
}

export function SyncStatus({ compact = false, showSyncNow = true }: SyncStatusProps) {
  const { lang: locale } = useI18n();
  const [status, setStatus] = useState<SyncStatusInfo>({
    status: "synced",
    pendingCount: 0,
    conflictCount: 0,
  });

  const copy = getSyncCopyForLocale(locale);

  useEffect(() => {
    // Update status initially
    setStatus(getSyncStatus());

    // Listen for sync status changes
    const handleSyncStatusChange = (event: CustomEvent<SyncStatusInfo>) => {
      setStatus(event.detail);
    };

    // Listen for online/offline changes
    const handleOnline = () => updateStatus("synced");
    const handleOffline = () => updateStatus("offline");

    window.addEventListener("sync-status-change", handleSyncStatusChange as EventListener);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("sync-status-change", handleSyncStatusChange as EventListener);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const icon = STATUS_ICONS[status.status];

  const handleSyncNow = async () => {
    updateStatus("syncing");
    try {
      const { getSyncClient } = await import("@/services/sync/sync-client");
      const client = getSyncClient();
      if (client.isAuthenticated()) {
        await client.sync();
      }
    } catch {
      updateStatus("sync-failed");
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <span aria-hidden="true">{icon}</span>
        <span className="text-gray-600 dark:text-gray-400">
          {copy.statusLabels[status.status]}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="text-lg" aria-hidden="true">
          {icon}
        </span>
        <div>
          <div className="font-medium text-gray-900 dark:text-gray-100">
            {copy.statusLabels[status.status]}
          </div>
          {status.lastSyncedAt && (
            <div className="text-xs text-gray-500 dark:text-gray-500">
              {copy.lastSynced}: {new Date(status.lastSyncedAt).toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>

      {status.pendingCount > 0 && (
        <div className="text-sm text-amber-600 dark:text-amber-400">
          {copy.pendingChanges.replace("{count}", String(status.pendingCount))}
        </div>
      )}

      {status.conflictCount > 0 && (
        <div className="text-sm text-orange-600 dark:text-orange-400">
          {copy.conflictsNeedingReview.replace("{count}", String(status.conflictCount))}
        </div>
      )}

      {showSyncNow && status.status !== "offline" && status.status !== "syncing" && (
        <button
          onClick={handleSyncNow}
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline"
          type="button"
        >
          {copy.syncNow}
        </button>
      )}
    </div>
  );
}
