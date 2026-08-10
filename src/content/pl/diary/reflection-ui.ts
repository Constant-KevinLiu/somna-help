/**
 * Polski — Reflection UI Text Content
 *
 * Natywna treść interfejsu dla funkcji Kierowanej Refleksji.
 */

import type { ReflectionUiStrings } from "@/content/en/diary/reflection-ui";

export const PL_REFLECTION_UI: ReflectionUiStrings = {
  title: "Kierowana Refleksja CBT-I",
  subtitle: "Trzy dzienne pytania do zbadania Twojej relacji ze snem",
  promptsHeader: "Dzienne pytania",
  word: "słowo",
  wordCount: "liczba słów",
  wordLimit: "słów",
  wordLimitReached: "Osiągnięto limit słów — nadal możesz edytować i usuwać",
  saveButton: "Zapisz Refleksję",
  historyButton: "Zobacz Historię",
  syncButton: "Synchronizuj na urządzeniach",
  saveStatus: {
    idle: "",
    saving: "Zapisywanie...",
    saved: "Zapisano lokalnie",
    error: "Błąd zapisu",
    unsaved: "Niezapisane zmiany",
  },
  toast: {
    saved: "Refleksja zapisana pomyślnie",
    saveError: "Nie udało się zapisać Twojej refleksji. Spróbuj ponownie.",
    deleted: "Refleksja usunięta",
    deleteError: "Nie udało się usunąć refleksji. Spróbuj ponownie.",
  },
  history: {
    title: "Historia Refleksji",
    empty: "Brak refleksji. Zacznij od dzisiejszej!",
    backToToday: "Powrót do Dzisiaj",
    edit: "Edytuj",
    delete: "Usuń",
    deleteConfirm: "Czy na pewno chcesz usunąć tę refleksję? Tego nie można cofnąć.",
    deleteConfirmAction: "Usuń",
    cancel: "Anuluj",
  },
  privacy:
    "Twoje refleksje są przechowywane lokalnie na Twoim urządzeniu i nigdy nie są wysyłane na nasze serwery.",
  accessibility: {
    editorLabel: "Edytor refleksji. Trzy dzienne pytania do zbadania Twojej relacji ze snem",
    wordCountAnnounce: "Napisałeś",
    savedAnnounce: "Twoja refleksja została zapisana lokalnie",
  },
  stats: {
    streak: "dni pod rząd",
    thisMonth: "w tym miesiącu",
    total: "łączna liczba refleksji",
  },
};
