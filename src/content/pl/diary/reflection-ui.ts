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
  saveChangesButton: "Zapisz zmiany",
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
    copied: "Skopiowano do schowka",
    copyError: "Nie udało się skopiować do schowka",
  },
  timeline: {
    tabToday: "Dzisiaj",
    tabTimeline: "Oś czasu",
    title: "Historia Refleksji",
    empty: "Brak refleksji",
    emptyCta: "Napisz dzisiejszą refleksję",
    today: "Dzisiaj",
    yesterday: "Wczoraj",
    savedLocally: "Zapisano lokalnie",
    synced: "Zsynchronizowano",
    pending: "Oczekiwanie na synchronizację",
    expand: "Pokaż więcej",
    collapse: "Pokaż mniej",
    edit: "Edytuj",
    copy: "Kopiuj",
    copied: "Skopiowano",
    delete: "Usuń",
    deleteConfirm: "Czy na pewno chcesz usunąć tę refleksję? Tego nie można cofnąć.",
    deleteConfirmAction: "Usuń",
    cancel: "Anuluj",
    backToToday: "Powrót do Dzisiaj",
    total: "łączna liczba refleksji",
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
    expandEntry: "Rozwiń wpis, aby przeczytać całą refleksję",
    collapseEntry: "Zwiń wpis",
    editEntry: "Edytuj tę refleksję",
    copyEntry: "Kopiuj tekst refleksji do schowka",
    deleteEntry: "Usuń tę refleksję",
    timelineTab: "Zobacz oś czasu refleksji",
    todayTab: "Wróć do dzisiejszej refleksji",
  },
  stats: {
    streak: "dni pod rząd",
    thisMonth: "w tym miesiącu",
    total: "łączna liczba refleksji",
  },
};
