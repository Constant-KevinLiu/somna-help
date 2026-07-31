/**
 * Sleep Diary v2.3 - English Authentication Content
 * 
 * Natively authored English content for the authentication modal.
 * NOT translated from any other language.
 * 
 * Tone: calm, professional, warm, privacy-conscious
 */

import type { ContentPackage } from "../../content-types";

export interface AuthCopy {
  modal: {
    title: string;
    subtitle: string;
    privacyNote: string;
  };
  emailForm: {
    label: string;
    placeholder: string;
    button: string;
    sending: string;
  };
  otpForm: {
    title: string;
    instructions: string;
    codeLabel: string;
    verifyButton: string;
    verifying: string;
    resendButton: string;
    resendWaiting: string;
  };
  success: {
    title: string;
    message: string;
    continueButton: string;
  };
  errors: {
    invalidEmail: string;
    codeInvalid: string;
    codeExpired: string;
    maxAttempts: string;
    rateLimited: string;
    networkError: string;
    unknownError: string;
  };
  identityMenu: {
    syncProgress: string;
    account: string;
    dashboard: string;
    sleepDiary: string;
    reminderCenter: string;
    syncStatus: string;
    settings: string;
    exportData: string;
    deleteData: string;
    privacy: string;
    signOut: string;
    syncConnected: string;
    syncOffline: string;
  };
  intentLabels: {
    sync_diary: string;
    save_reflection: string;
    enable_reminders: string;
    restore_history: string;
    export_data: string;
    general: string;
  };
  accountExport: {
    title: string;
    description: string;
    button: string;
    downloading: string;
    successMessage: string;
    failureMessage: string;
    includes: string[];
  };
  accountDelete: {
    title: string;
    warning: string;
    explanation: string;
    confirmButton: string;
    cancelButton: string;
    confirmationPlaceholder: string;
    confirmationPhrase: string;
    successMessage: string;
    partialFailureMessage: string;
    sessionRevokedMessage: string;
    clearingCacheMessage: string;
    ariaLabel: string;
  };
  sync: {
    statusLabels: {
      "local-only": string;
      syncing: string;
      synced: string;
      offline: string;
      "needs-attention": string;
      "sync-failed": string;
    };
    lastSynced: string;
    pendingChanges: string;
    conflictsNeedingReview: string;
    syncNow: string;
    retry: string;
    resolveConflict: string;
    migration: {
      preparing: string;
      uploading: string;
      merging: string;
      completed: string;
      failed: string;
    };
    restore: {
      title: string;
      progress: string;
      completed: string;
    };
  };
}

export const authCopyEn: ContentPackage<AuthCopy> = {
  metadata: {
    locale: "en",
    version: "1.0.0",
    reviewedAt: "2026-07-24",
    reviewedBy: "content-team",
    medicalReviewStatus: "approved",
    nativeReviewStatus: "approved",
    lastUpdated: "2026-07-24",
  },
  content: {
    modal: {
      title: "Sync Your Sleep Journey",
      subtitle: "Keep your sleep records and reflections secure, and continue on any device.",
      privacyNote: "No password required. Your private sleep data stays private.",
    },
    emailForm: {
      label: "Email address",
      placeholder: "you@example.com",
      button: "Send verification code",
      sending: "Sending...",
    },
    otpForm: {
      title: "Check your email",
      instructions: "We sent a 6-digit verification code to your email. Enter it below to continue.",
      codeLabel: "Verification code",
      verifyButton: "Verify & continue",
      verifying: "Verifying...",
      resendButton: "Resend code",
      resendWaiting: "Resend available in",
    },
    success: {
      title: "Verified!",
      message: "Your sleep data is now securely synced.",
      continueButton: "Continue",
    },
    errors: {
      invalidEmail: "Please enter a valid email address.",
      codeInvalid: "That code doesn't match. Please try again.",
      codeExpired: "This code has expired. Please request a new one.",
      maxAttempts: "Too many attempts. Please request a new code.",
      rateLimited: "Too many requests. Please try again later.",
      networkError: "Connection issue. Please check your internet and try again.",
      unknownError: "Something went wrong. Please try again.",
    },
    identityMenu: {
      syncProgress: "Sync Progress",
      account: "Account",
      dashboard: "Dashboard",
      sleepDiary: "Sleep Diary",
      reminderCenter: "Reminder Center",
      syncStatus: "Sync Status",
      settings: "Settings",
      exportData: "Export My Data",
      deleteData: "Delete My Data",
      privacy: "Privacy",
      signOut: "Sign Out",
      syncConnected: "Cloud sync connected",
      syncOffline: "Offline mode",
    },
    intentLabels: {
      sync_diary: "Sync your sleep diary",
      save_reflection: "Save your reflection to the cloud",
      enable_reminders: "Enable email reminders",
      restore_history: "Restore your history",
      export_data: "Export your data",
      general: "Sign in",
    },
    accountExport: {
      title: "Export Your Data",
      description: "Download a complete copy of your sleep records, reflections, and settings as a private JSON file.",
      button: "Download Data",
      downloading: "Preparing download...",
      successMessage: "Your data has been exported successfully.",
      failureMessage: "Failed to export data. Please try again.",
      includes: [
        "Sleep records and notes",
        "CBT-I guided reflections",
        "Reminder settings",
        "Program progress",
        "Account preferences",
      ],
    },
    accountDelete: {
      title: "Delete Your Data",
      warning: "This action cannot be undone.",
      explanation: "Permanently delete all your sleep data, reflections, and settings from our servers. Your local data will also be cleared.",
      confirmButton: "Delete All My Data",
      cancelButton: "Cancel",
      confirmationPlaceholder: 'Type "DELETE_MY_SLEEP_DATA" to confirm',
      confirmationPhrase: "DELETE_MY_SLEEP_DATA",
      successMessage: "Your account data has been deleted.",
      partialFailureMessage: "Some data could not be deleted. Please contact support.",
      sessionRevokedMessage: "Your session has been revoked.",
      clearingCacheMessage: "Clearing local cache...",
      ariaLabel: "Delete all your sleep data and account information",
    },
    sync: {
      statusLabels: {
        "local-only": "Local only",
        syncing: "Syncing...",
        synced: "Synced",
        offline: "Offline",
        "needs-attention": "Needs attention",
        "sync-failed": "Sync failed",
      },
      lastSynced: "Last synced",
      pendingChanges: "{count} changes pending",
      conflictsNeedingReview: "{count} conflicts need review",
      syncNow: "Sync now",
      retry: "Retry",
      resolveConflict: "Resolve conflict",
      migration: {
        preparing: "Preparing migration...",
        uploading: "Uploading your data...",
        merging: "Merging with cloud data...",
        completed: "Migration complete!",
        failed: "Migration failed. Please retry.",
      },
      restore: {
        title: "Restoring your data",
        progress: "Downloading from cloud...",
        completed: "Restore complete!",
      },
    },
  },
};

export function getSyncCopy() {
  return authCopyEn.content.sync;
}
