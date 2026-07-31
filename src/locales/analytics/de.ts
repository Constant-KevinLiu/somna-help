/**
 * Phase F — Analytics & Insight German Dictionary
 */
import type { Dict } from "@/lib/i18n";

export const analyticsDe: Dict = {
  "analytics.window.7d": "Letzte 7 Tage",
  "analytics.window.14d": "Letzte 14 Tage",
  "analytics.window.30d": "Letzte 30 Tage",
  "analytics.window.90d": "Letzte 90 Tage",
  "analytics.window.thisWeek": "Diese Woche",
  "analytics.window.lastWeek": "Letzte Woche",
  "analytics.window.thisMonth": "Dieser Monat",
  "analytics.window.lastMonth": "Letzter Monat",

  "analytics.sufficiency.none":
    "Starte mit der Aufzeichnung deines Schlafs, um deine Muster zu sehen.",
  "analytics.sufficiency.insufficient":
    "Zeichne noch ein paar Tage weiter auf, um ein klareres Muster zu erkennen.",
  "analytics.sufficiency.limited":
    "Das sehen wir bisher — zeichne weiter auf für ein vollständigeres Bild.",
  "analytics.sufficiency.sufficient": "",

  "analytics.metric.timeInBed": "Bettzeit",
  "analytics.metric.totalSleepTime": "Gesamte Schlafdauer",
  "analytics.metric.sleepEfficiency": "Schlafeffizienz",
  "analytics.metric.sleepOnsetLatency": "Einschlafzeit",
  "analytics.metric.wakeAfterSleepOnset": "Nächtliches Aufwachen",
  "analytics.metric.numberOfAwakenings": "Anzahl Aufwachvorgänge",
  "analytics.metric.avgBedtime": "Durchschnittliche Schlafenszeit",
  "analytics.metric.avgWakeTime": "Durchschnittliche Aufstehzeit",
  "analytics.metric.bedtimeVariability": "Schwankung der Schlafenszeit",
  "analytics.metric.wakeTimeVariability": "Schwankung der Aufstehzeit",
  "analytics.metric.sleepRegularity": "Schlafregularität",
  "analytics.metric.diaryCompletionRate": "Tagebuch-Vervollständigung",
  "analytics.metric.sleepQuality": "Schlafqualität",
  "analytics.metric.mood": "Morgenstimmung",
  "analytics.metric.recordedNights": "Aufgezeichnete Nächte",

  "analytics.unit.minutes": "Min",
  "analytics.unit.hours": "Std",
  "analytics.unit.percent": "%",
  "analytics.unit.nights": "Nächte",
  "analytics.unit.days": "Tage",

  "analytics.trend.improving": "Verbesserung",
  "analytics.trend.declining": "Verschlechterung",
  "analytics.trend.stable": "Stabil",
  "analytics.trend.insufficient_data": "Noch zu wenige Daten",
  "analytics.trend.later": "Später",
  "analytics.trend.earlier": "Früher",

  "analytics.pattern.weekend_bedtime_later":
    "An den aufgezeichneten Tagen gingst du am Wochenende später ins Bett.",
  "analytics.pattern.weekend_bedtime_earlier":
    "An den aufgezeichneten Tagen gingst du am Wochenende früher ins Bett.",
  "analytics.pattern.weekend_waketime_later":
    "An den aufgezeichneten Tagen bist du am Wochenende später aufgewacht.",
  "analytics.pattern.weekend_waketime_earlier":
    "An den aufgezeichneten Tagen bist du am Wochenende früher aufgewacht.",
  "analytics.pattern.consistent_wake_time":
    "Deine Aufstehzeit war in diesem Zeitraum sehr konstant.",
  "analytics.pattern.variable_bedtime":
    "Deine Schlafenszeit hat sich in diesem Zeitraum recht stark verändert.",
  "analytics.pattern.reminder_stronger":
    "Du hast deine Erinnerungen konsistenter eingehalten als dein Tagebuch.",
  "analytics.pattern.diary_stronger":
    "Deine Tagebuchführung war konsistenter als das Abschließen von Erinnerungen.",
  "analytics.pattern.stable_wake_streak":
    "Du hast mehrere Tage hintereinander eine konstante Aufstehzeit gehalten.",

  "analytics.insight.trend.improving.sleepEfficiency.title":
    "Deine Schlafeffizienz verbessert sich",
  "analytics.insight.trend.improving.sleepEfficiency.body":
    "Deine Schlafeffizienz zeigt in letzter Zeit einen Aufwärtstrend. Das deutet darauf hin, dass dein Schlaf erholsamer wird. Bleib dabei, was funktioniert.",
  "analytics.insight.trend.declining.sleepEfficiency.title":
    "Deine Schlafeffizienz ist gesunken",
  "analytics.insight.trend.declining.sleepEfficiency.body":
    "Deine Schlafeffizienz war in letzter Zeit niedriger. Das ist eine Beobachtung, keine Diagnose — viele Faktoren beeinflussen, wie wir von Woche zu Woche schlafen.",

  "analytics.insight.trend.improving.totalSleepTime.title":
    "Du schläfst mehr",
  "analytics.insight.trend.improving.totalSleepTime.body":
    "Deine gesamte Schlafdauer hat zugenommen. Mehr erholsame Schlafstunden können einen spürbaren Unterschied in deinem Tagesbefinden machen.",
  "analytics.insight.trend.declining.totalSleepTime.title":
    "Dein Gesamtschlaf hat abgenommen",
  "analytics.insight.trend.declining.totalSleepTime.body":
    "Deine gesamte Schlafdauer war in letzter Zeit kürzer. Das ist wert zu beobachten — Veränderungen in Routine, Stress oder Zeitplan können mitwirken.",

  "analytics.insight.trend.improving.sleepOnsetLatency.title":
    "Du schläfst schneller ein",
  "analytics.insight.trend.improving.sleepOnsetLatency.body":
    "Du brauchst weniger Zeit zum Einschlafen. Das ist ein gutes Zeichen — deine Einschlafrituale könnten helfen.",
  "analytics.insight.trend.declining.sleepOnsetLatency.title":
    "Du brauchst länger zum Einschlafen",
  "analytics.insight.trend.declining.sleepOnsetLatency.body":
    "Du brauchst in letzter Zeit länger zum Einschlafen. Gekreiste Gedanken, Bildschirmzeit vor dem Schlaf oder Veränderungen der Routine können dazu beitragen.",

  "analytics.insight.trend.improving.sleepRegularity.title":
    "Dein Schlafrhythmus wird regelmäßiger",
  "analytics.insight.trend.improving.sleepRegularity.body":
    "Deine Schlafens- und Aufstehzeit waren konsistenter. Ein fester Rhythmus ist eines der Fundamente gesunden Schlafs.",
  "analytics.insight.trend.declining.sleepRegularity.title":
    "Dein Rhythmus war veränderlicher",
  "analytics.insight.trend.declining.sleepRegularity.body":
    "Deine Schlafens- und Aufstehzeit haben sich in letzter Zeit stärker verändert. Das ist in anspruchsvollen Wochen normal — kleine Anpassungen können die Konstanz zurückbringen.",

  "analytics.insight.pattern.weekend_bedtime_later.title":
    "Spätere Schlafenszeit am Wochenende",
  "analytics.insight.pattern.weekend_bedtime_later.body":
    "Deine Schlafenszeit verschiebt sich am Wochenende. Sozialer Jetlag — selbst eine kleine Verschiebung — kann beeinflussen, wie du dich am Wochenanfang fühlst.",
  "analytics.insight.pattern.weekend_waketime_later.title":
    "Länger schlafen am Wochenende",
  "analytics.insight.pattern.weekend_waketime_later.body":
    "Du stehst am Wochenende später auf. Mehr als eine Stunde länger schlafen kann deine innere Uhr verschieben und Montagmorgenschwierigkeiten machen.",

  "analytics.insight.pattern.consistent_wake_time.title":
    "Konstante Aufstehzeit",
  "analytics.insight.pattern.consistent_wake_time.body":
    "Deine Aufstehzeit war sehr stabil. Eine konstante Aufstehzeit ist eine der effektivsten Möglichkeiten, deinen zirkadianen Rhythmus zu stärken — toll gemacht.",

  "analytics.insight.pattern.variable_bedtime.title":
    "Deine Schlafenszeit variiert stark",
  "analytics.insight.pattern.variable_bedtime.body":
    "Deine Schlafenszeit war von Nacht zu Nacht sehr unterschiedlich. Versuche, sie zu beobachten ohne sie früher erzwingen zu wollen — Bewusstsein ist der erste Schritt.",

  "analytics.insight.pattern.stable_wake_streak.title":
    "Serie konstanten Aufstehens",
  "analytics.insight.pattern.stable_wake_streak.body":
    "Du hast mehrere Tage hintereinander eine ähnliche Aufstehzeit gehalten. Das baut einen starken zirkadianen Anker — mach weiter so.",

  "analytics.insight.pattern.reminder_habit_stronger_than_diary.title":
    "Erinnerungen laufen gut",
  "analytics.insight.pattern.reminder_habit_stronger_than_diary.body":
    "Du warst konsistenter mit deinen Erinnerungen als mit deinem Tagebuch. Die Erinnerungen bauen eine Routine auf — kannst du das Tagebuch mitnehmen?",

  "analytics.insight.encouragement.start_recording.title":
    "Deine Schlafgeschichte beginnt hier",
  "analytics.insight.encouragement.start_recording.body":
    "Jede Reise beginnt mit einer einzigen Nacht. Wenn du deinen Schlaf nur eine Woche aufzeichnest, können sich Muster zeigen, die du vielleicht noch nicht bemerkt hast.",
  "analytics.insight.encouragement.keep_going.title":
    "Du hast angefangen",
  "analytics.insight.encouragement.keep_going.body":
    "Super — du hast mit der Aufzeichnung begonnen. Mach noch ein paar Tage weiter, dann siehst du dein Schlafmuster langsam entstehen.",
  "analytics.insight.encouragement.first_week.title":
    "Du hast eine Grundlage geschaffen",
  "analytics.insight.encouragement.first_week.body":
    "Du hast in dieser Woche mehrere Nächte aufgezeichnet. Das allein ist schon ein Erfolg. Die erste Woche dient der Beobachtung — nicht der Perfektion.",
  "analytics.insight.encouragement.streak.title":
    "Du bist in einer Serie",
  "analytics.insight.encouragement.streak.body":
    "Tägliche Aufzeichnung schafft Bewusstsein, und Bewusstsein ist der erste Schritt zur Veränderung. Halte die Serie.",

  "analytics.insight.action.learn_more": "Mehr erfahren",
  "analytics.insight.action.observe": "Weiter beobachten",
  "analytics.insight.action.start_diary": "Tagebuch starten",
  "analytics.insight.action.continue_recording": "Weiter aufzeichnen",

  "analytics.weekly.title": "Wöchentliche Zusammenfassung",
  "analytics.weekly.recordedNights": "Aufgezeichnete Nächte",
  "analytics.weekly.completion": "Vervollständigung",
  "analytics.weekly.avgSleep": "Durchschn. Schlafdauer",
  "analytics.weekly.avgEfficiency": "Durchschn. Effizienz",
  "analytics.weekly.avgLatency": "Durchschn. Einschlafzeit",
  "analytics.weekly.bedtime": "Schlafenszeit",
  "analytics.weekly.wakeTime": "Aufstehzeit",
  "analytics.weekly.bedtimeVar": "Schwankung Schlafenszeit",
  "analytics.weekly.wakeTimeVar": "Schwankung Aufstehzeit",
  "analytics.weekly.regularity": "Schlafregularität",
  "analytics.weekly.reminderCompletion": "Erinnerungs-Konstanz",
  "analytics.weekly.strongestPattern": "Was gut gelaufen ist",
  "analytics.weekly.areaToObserve": "Was du als Nächstes beobachtest",
  "analytics.weekly.previousWeek": "Vorherige Woche",
  "analytics.weekly.nextWeek": "Nächste Woche",
  "analytics.weekly.thisWeek": "Diese Woche",
  "analytics.weekly.empty":
    "Keine aufgezeichneten Nächte diese Woche. Deine wöchentliche Zusammenfassung wird hier erscheinen, sobald du aufzeichnest.",

  "analytics.monthly.title": "Monatlicher Überblick",
  "analytics.monthly.recordedNights": "Aufgezeichnete Nächte diesen Monat",
  "analytics.monthly.completion": "Tagebuch-Konstanz",
  "analytics.monthly.avgEfficiency": "Durchschn. Effizienz",
  "analytics.monthly.avgSleep": "Durchschn. Schlafdauer",
  "analytics.monthly.regularity": "Schlafregularität",
  "analytics.monthly.bestStreak": "Beste Serie",
  "analytics.monthly.habitConsistency": "Gewohnheits-Konstanz",
  "analytics.monthly.weeklyTrend": "Wöchentlicher Trend",
  "analytics.monthly.notableChanges": "Bemerkenswerte Veränderungen",
  "analytics.monthly.previousMonth": "Vorheriger Monat",
  "analytics.monthly.nextMonth": "Nächster Monat",
  "analytics.monthly.empty":
    "Zeichne weiter auf — dein monatlicher Überblick wird hier erscheinen.",

  "analytics.focus.title": "Fokus dieser Woche",
  "analytics.focus.subtitle": "Ein sanfter Vorschlag für die kommende Woche",
  "analytics.focus.baseline_building.reason":
    "Du baust deinen Schlafdatensatz noch auf.",
  "analytics.focus.baseline_building.action":
    "Konzentriere dich darauf, jeden Morgen aufzuzeichnen — nur ein Eintrag pro Tag.",
  "analytics.focus.recording_consistency.reason":
    "Dein Tagebuch hat diese Woche Lücken.",
  "analytics.focus.recording_consistency.action":
    "Versuche, die fehlenden Tage auszufüllen. Selbst ein kurzer Eintrag hilft, das Gesamtbild zu sehen.",
  "analytics.focus.wake_time_consistency.reason":
    "Deine Aufstehzeit schwankt und deine Effizienz ist niedriger als möglich.",
  "analytics.focus.wake_time_consistency.action":
    "Versuche, jeden Tag innerhalb eines 30-Minuten-Fensters aufzustehen, einschließlich am Wochenende.",
  "analytics.focus.bedtime_observation.reason":
    "Deine Schlafenszeit schwankt ziemlich stark von Nacht zu Nacht.",
  "analytics.focus.bedtime_observation.action":
    "Beobachte diese Woche deine Schlafenszeit, ohne sie früher erzwingen zu wollen. Bewusstsein kommt zuerst.",
  "analytics.focus.reminder_routine.reason":
    "Deine Erinnerungen sind noch nicht ganz fest etabliert.",
  "analytics.focus.reminder_routine.action":
    "Versuche, diese Woche mindestens eine Erinnerung pro Tag abzuschließen, um die Gewohnheit aufzubauen.",
  "analytics.focus.maintenance.reason":
    "Dein Schlaf wirkt konstant und effizient.",
  "analytics.focus.maintenance.action":
    "Behalte die gute Routine bei. Konzentriere dich diese Woche darauf, zu halten, was funktioniert.",
  "analytics.focus.default.reason":
    "Hier ist ein sanfter Fokus für die Woche.",
  "analytics.focus.default.action":
    "Beobachte deine Schlafmuster mit Neugier — es gibt nichts zu reparieren.",
  "analytics.focus.accept": "Fokus annehmen",
  "analytics.focus.dismiss": "Ablehnen",
  "analytics.focus.save": "Merken",
  "analytics.focus.accepted": "Fokus für diese Woche gesetzt",
  "analytics.focus.dismissed": "Für diese Woche abgelehnt",

  "reflection.weekly.title": "Wöchentliche Reflexion",
  "reflection.weekly.subtitle":
    "Eine angeleitete Rückschau auf deine Woche und den Blick nach vorne.",
  "reflection.weekly.intro":
    "Nimm dir ein paar Minuten Zeit, um über deinen Schlaf und deine Routine diese Woche nachzudenken. Es gibt keine richtigen oder falschen Antworten — das ist für dich.",
  "reflection.weekly.skip": "Überspringen",
  "reflection.weekly.save": "Reflexion speichern",
  "reflection.weekly.saved": "Gespeichert",
  "reflection.weekly.edit": "Bearbeiten",
  "reflection.weekly.delete": "Löschen",
  "reflection.weekly.words": "Wörter",
  "reflection.weekly.empty":
    "Noch keine Reflexion für diese Woche gespeichert.",
  "reflection.weekly.start": "Reflexion starten",

  "reflection.weekly.prompt.routine_consistency.1":
    "Was hat dir geholfen, diese Woche eine konsistentere Schlafroutine zu halten?",
  "reflection.weekly.prompt.routine_consistency.2":
    "Welche Nächte fielen dir leichter, deinen Zeitplan einzuhalten und warum?",
  "reflection.weekly.prompt.recording_ease.1":
    "Was hat die Aufzeichnung deines Schlafs diese Woche einfacher oder schwieriger gemacht?",
  "reflection.weekly.prompt.manageable_parts.1":
    "Welcher Teil deiner Schlafroutine fühlte sich diese Woche am machbarsten an?",
  "reflection.weekly.prompt.next_week_observation.1":
    "Was möchtest du nächste Woche an deinem Schlaf beobachten?",
  "reflection.weekly.prompt.wins.1":
    "Was ist eine Sache, die diese Woche mit deinem Schlaf gut gelaufen ist?",
  "reflection.weekly.prompt.wins.2":
    "Wann hast du dich diese Woche am erholtest gefühlt und was war anders?",
  "reflection.weekly.prompt.challenges.1":
    "Was war diese Woche eine Herausforderung in Bezug auf deinen Schlaf?",
  "reflection.weekly.prompt.gratitude.1":
    "Wofür bist du in Bezug auf deine Erholung diese Woche dankbar?",
  "reflection.weekly.prompt.sleep_confidence.1":
    "Wie zuversichtlich fühlst du dich gerade in Bezug auf deine Fähigkeit, gut zu schlafen?",

  "reflection.weekly.placeholder.routine_consistency":
    "Schreibe darüber, was geholfen hat oder was im Weg stand...",
  "reflection.weekly.placeholder.recording_ease":
    "Teile mit, was das Aufzeichnen erleichtert oder erschwert hat...",
  "reflection.weekly.placeholder.manageable_parts":
    "Beschreibe, was sich machbar anfühlte und warum...",
  "reflection.weekly.placeholder.next_week_observation":
    "Was willst du nächste Woche bemerken?",
  "reflection.weekly.placeholder.wins":
    "Feier etwas — Großes oder Kleines...",
  "reflection.weekly.placeholder.challenges":
    "Schreibe darüber, was schwierig war...",
  "reflection.weekly.placeholder.gratitude":
    "Wofür bist du dankbar?",
  "reflection.weekly.placeholder.sleep_confidence":
    "Wie fühlst du dich gerade mit deinem Schlaf?",

  "dashboard.analytics.keyMetrics": "Wichtige Kennwerte",
  "dashboard.analytics.trends": "Trends",
  "dashboard.analytics.insights": "Erkenntnisse",
  "dashboard.analytics.weeklySummary": "Wöchentliche Zusammenfassung",
  "dashboard.analytics.monthlyOverview": "Monatlicher Überblick",
  "dashboard.analytics.reflection": "Wöchentliche Reflexion",
  "dashboard.analytics.focus": "Dein Fokus",

  "chart.efficiency": "Schlafeffizienz",
  "chart.sleepTime": "Schlafdauer",
  "chart.latency": "Einschlafzeit",
  "chart.bedtime": "Schlafenszeit",
  "chart.wakeTime": "Aufstehzeit",
  "chart.noData": "Zu wenige Daten für diese Ansicht",
};
