/**
 * Sleep Diary v2.3 - Polish Authentication Content
 * 
 * Natively authored Polish content for the authentication modal.
 * NOT translated from English.
 * 
 * Tone: calm, professional, warm, privacy-conscious
 */

import type { ContentPackage } from "../../content-types";
import type { AuthCopy } from "../../en/auth/auth-copy";

export const authCopyPl: ContentPackage<AuthCopy> = {
  metadata: {
    locale: "pl",
    version: "1.0.0",
    reviewedAt: "2026-07-24",
    reviewedBy: "content-team-pl",
    medicalReviewStatus: "approved",
    nativeReviewStatus: "approved",
    lastUpdated: "2026-07-24",
  },
  content: {
    modal: {
      title: "Zsynchronizuj Swoją Podróż ze Snem",
      subtitle: "Chroń swoje zapisy snu i refleksje oraz kontynuuj na dowolnym urządzeniu.",
      privacyNote: "Hasło nie jest wymagane. Twoje prywatne dane o śnie pozostają prywatne.",
    },
    emailForm: {
      label: "Adres e-mail",
      placeholder: "ty@przyklad.pl",
      button: "Wyślij kod weryfikacyjny",
      sending: "Wysyłanie...",
    },
    otpForm: {
      title: "Sprawdź swoją pocztę",
      instructions: "Wysłaliśmy 6-cyfrowy kod weryfikacyjny na Twój e-mail. Wpisz go poniżej, aby kontynuować.",
      codeLabel: "Kod weryfikacyjny",
      verifyButton: "Zweryfikuj i kontynuuj",
      verifying: "Weryfikowanie...",
      resendButton: "Wyślij ponownie kod",
      resendWaiting: "Ponowne wysłanie dostępne za",
    },
    success: {
      title: "Zweryfikowano!",
      message: "Twoje dane o śnie są teraz bezpiecznie zsynchronizowane.",
      continueButton: "Kontynuuj",
    },
    errors: {
      invalidEmail: "Wpisz prawidłowy adres e-mail.",
      codeInvalid: "Ten kod nie pasuje. Spróbuj ponownie.",
      codeExpired: "Ten kod wygasł. Wyślij nowy kod.",
      maxAttempts: "Zbyt wiele prób. Wyślij nowy kod.",
      rateLimited: "Zbyt wiele żądań. Spróbuj ponownie później.",
      networkError: "Problem z połączeniem. Sprawdź internet i spróbuj ponownie.",
      unknownError: "Coś poszło nie tak. Spróbuj ponownie.",
    },
    identityMenu: {
      syncProgress: "Synchronizuj Postęp",
      account: "Konto",
      dashboard: "Panel",
      sleepDiary: "Dziennik Snu",
      reminderCenter: "Centrum Przypomnień",
      syncStatus: "Status Synchronizacji",
      settings: "Ustawienia",
      exportData: "Eksportuj Moje Dane",
      deleteData: "Usuń Moje Dane",
      privacy: "Prywatność",
      signOut: "Wyloguj się",
      syncConnected: "Synchronizacja w chmurze połączona",
      syncOffline: "Tryb offline",
    },
    intentLabels: {
      sync_diary: "Zsynchronizuj swój dziennik snu",
      save_reflection: "Zapisz swoją refleksję w chmurze",
      enable_reminders: "Włącz przypomnienia e-mailowe",
      restore_history: "Przywróć swoją historię",
      export_data: "Eksportuj swoje dane",
      general: "Zaloguj się",
    },
    accountExport: {
      title: "Eksportuj Swoje Dane",
      description: "Pobierz pełną kopię swoich zapisów snu, refleksji i ustawień jako prywatny plik JSON.",
      button: "Pobierz Dane",
      downloading: "Przygotowywanie pobierania...",
      successMessage: "Twoje dane zostały pomyślnie wyeksportowane.",
      failureMessage: "Nie udało się wyeksportować danych. Spróbuj ponownie.",
      includes: [
        "Zapisy snu i notatki",
        "Guided refleksje CBT-I",
        "Ustawienia przypomnień",
        "Postęp programu",
        "Preferencje konta",
      ],
    },
    accountDelete: {
      title: "Usuń Swoje Dane",
      warning: "Tej operacji nie można cofnąć.",
      explanation: "Trwale usuń wszystkie dane o śnie, refleksje i ustawienia z naszych serwerów. Twoje lokalne dane również zostaną wyczyszczone.",
      confirmButton: "Usuń Wszystkie Moje Dane",
      cancelButton: "Anuluj",
      confirmationPlaceholder: 'Wpisz "DELETE_MY_SLEEP_DATA", aby potwierdzić',
      confirmationPhrase: "DELETE_MY_SLEEP_DATA",
      successMessage: "Dane Twojego konta zostały usunięte.",
      partialFailureMessage: "Niektóre dane nie mogły zostać usunięte. Skontaktuj się z pomocą techniczną.",
      sessionRevokedMessage: "Twoja sesja została cofnięta.",
      clearingCacheMessage: "Czyszczenie lokalnej pamięci podręcznej...",
      ariaLabel: "Usuń wszystkie dane o śnie i informacje o koncie",
    },
    sync: {
      statusLabels: {
        "local-only": "Tylko lokalnie",
        syncing: "Synchronizowanie...",
        synced: "Zsynchronizowano",
        offline: "Brak połączenia",
        "needs-attention": "Wymaga uwagi",
        "sync-failed": "Błąd synchronizacji",
      },
      lastSynced: "Ostatnia synchronizacja",
      pendingChanges: "{count} zmian oczekujących",
      conflictsNeedingReview: "{count} konfliktów wymaga przeglądu",
      syncNow: "Synchronizuj teraz",
      retry: "Spróbuj ponownie",
      resolveConflict: "Rozwiąż konflikt",
      migration: {
        preparing: "Przygotowywanie migracji...",
        uploading: "Wysyłanie danych...",
        merging: "Scalanie z danymi w chmurze...",
        completed: "Migracja zakończona!",
        failed: "Błąd migracji. Spróbuj ponownie.",
      },
      restore: {
        title: "Przywracanie danych",
        progress: "Pobieranie z chmury...",
        completed: "Przywracanie zakończone!",
      },
    },
  },
};
