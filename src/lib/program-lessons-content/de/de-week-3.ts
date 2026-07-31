// Woche 3 — Schlafrestriktion (Lektionen 1-3)
// Quelle: native deutsche Version des CBT-I-Programms Somna.
import type { LessonContent } from "../../program-lessons";

export const deWeek3Lessons: LessonContent[] = [
  // ───────────────────────── Lektion 1: Was ist Schlafrestriktion? ─────────────────────────
  {
    slug: "sleep-restriction",
    weekNumber: 3,
    weekSlug: "week-3",
    lessonNumber: 1,
    estimatedMinutes: 6,
    relatedLessonSlugs: [
      "what-is-sleep-efficiency",
      "stimulus-control",
      "calculating-your-sleep-window",
    ],
    i18n: {
      de: {
        title: "Was ist Schlafrestriktion?",
        eyebrow: "WOCHE 3 · LEKTION 1",
        subtitle:
          "Die effektivste, aber am meisten missverstandene CBT-I-Technik erklärt.",
        difficulty: "Mittel",
        readingTime: "6 Min. Lesezeit",
        content: [
          {
            heading: "Nicht weniger Schlaf, sondern mehr Schlaf pro Minute im Bett",
            paras: [
              "Schlafrestriktion klingt beängstigend, aber das Ziel ist nicht, weniger Schlaf zu bekommen. Das Ziel ist, mehr Schlaf pro Minute im Bett zu bekommen.",
              "Wenn du 9 Stunden im Bett liegst und nur 6 Stunden schläfst, verbringst du 3 Stunden wach. Das schwächt die Bett-Schlaf-Verbindung. Schlafrestriktion komprimiert die Bettzeit auf deine tatsächliche Schlafzeit, um den Schlafdruck aufzubauen.",
            ],
          },
          {
            heading: "Wie es funktioniert",
            paras: [
              "Basierend auf deinem Schlaftagebuch berechnest du deine durchschnittliche Schlafzeit. Das wird deine neue Bettzeit — minus 15 Minuten als Puffer.",
              "Du gehst später ins Bett und stehst zur gleichen Zeit auf. Das baut Schlafdruck auf, sodass du schneller einschlafst und seltener aufwachst.",
            ],
          },
          {
            heading: "Die schwierige Phase",
            paras: [
              "Die ersten 1–2 Wochen können sich mühsam anfühlen. Du bist vielleicht tagsüber müder, weil du weniger Zeit im Bett verbringst. Das ist beabsichtigt — es baut Schlafdruck auf.",
              "Die meisten Menschen sehen in Woche 3–4 eine deutliche Verbesserung: schnelleres Einschlafen, weniger Erwachen, mehr Tiefschlaf.",
            ],
          },
        ],
        actionStepTitle: "Praktische Aufgabe",
        actionStep:
          "Berechne deine durchschnittliche Schlafzeit aus den letzten 2 Wochen deines Schlaftagebuchs. Das ist deine neue Bettzeit. Setze deine Aufstehzeit fest und arbeite rückwärts, um deine neue Schlafenszeit zu finden. Beginne heute Nacht.",
        reflectionTitle: "Reflexion",
        reflection:
          "Wie reagierst du auf die Idee, später ins Bett zu gehen? Fühlst du Widerstand oder Erleichterung? Beachte deine emotionale Reaktion — sie ist Teil des Prozesses.",
        faqs: [
          {
            q: "Werde ich tagsüber zu müde funktionieren?",
            a: "Du bist vielleicht etwas müder, besonders in Woche 1–2. Plane keine wichtigen Entscheidungen oder gefährlichen Aktivitäten. Die meisten Menschen passen sich schnell an.",
          },
          {
            q: "Kann ich am Wochenende ausschlafen?",
            a: "Nein. Konstante Aufstehzeit ist entscheidend für den Erfolg. Ausschlafen würde den Schlafdruck schwächen.",
          },
        ],
        ctaLabel: "Schlaftagebuch öffnen",
        ctaHref: "/diary",
        seoTitle: "Schlafrestriktion: Wie CBT-I Schlafdruck aufbaut | Somna",
        seoDescription:
          "Verstehe Schlafrestriktion bei CBT-I — warum sie funktioniert, wie man sie berechnet und was in den ersten Wochen zu erwarten ist.",
        keywords: [
          "Schlafrestriktion",
          "CBT-I",
          "Schlafdruck",
          "Schlafzeitfenster",
          "Insomnie-Behandlung",
        ],
      },
    },
  },

  // ───────────────────────── Lektion 2: Dein Schlafzeitfenster berechnen ─────────────────────────
  {
    slug: "calculating-your-sleep-window",
    weekNumber: 3,
    weekSlug: "week-3",
    lessonNumber: 2,
    estimatedMinutes: 5,
    relatedLessonSlugs: [
      "sleep-restriction",
      "adjusting-your-window",
      "what-is-sleep-efficiency",
    ],
    i18n: {
      de: {
        title: "Dein Schlafzeitfenster berechnen",
        eyebrow: "WOCHE 3 · LEKTION 2",
        subtitle: "Schritt-für-Schritt-Anleitung zur Ermittlung deiner optimalen Bettzeit.",
        difficulty: "Mittel",
        readingTime: "5 Min. Lesezeit",
        content: [
          {
            heading: "Schritt 1: Durchschnittliche Schlafzeit",
            paras: [
              "Nimm dein Schlaftagebuch der letzten 2 Wochen. Addiere deine tatsächliche Schlafzeit für jede Nacht und teile durch die Anzahl der Nächte. Das ist deine durchschnittliche Schlafzeit.",
              "Zum Beispiel: 6,5 Stunden, 7 Stunden, 6 Stunden = (6,5 + 7 + 6) / 3 = 6,5 Stunden.",
            ],
          },
          {
            heading: "Schritt 2: Bettzeit festlegen",
            paras: [
              "Deine neue Bettzeit = durchschnittliche Schlafzeit + 15 Minuten Puffer.",
              "Wenn deine durchschnittliche Schlafzeit 6,5 Stunden ist, ist deine neue Bettzeit 6 Stunden 45 Minuten.",
            ],
          },
          {
            heading: "Schritt 3: Aufstehzeit festlegen",
            paras: [
              "Wähle eine Aufstehzeit, die zu deinem Leben passt und konstant bleiben kann — jeden Tag, auch am Wochenende.",
              "Zum Beispiel: 07:00 Uhr.",
            ],
          },
          {
            heading: "Schritt 4: Schlafenszeit berechnen",
            paras: [
              "Arbeite rückwärts von deiner Aufstehzeit minus deiner Bettzeit.",
              "Wenn du um 07:00 Uhr aufstehst und 6 Stunden 45 Minuten im Bett verbringst, gehst du um 00:15 Uhr ins Bett.",
            ],
          },
        ],
        actionStepTitle: "Praktische Aufgabe",
        actionStep:
          "Berechne dein Schlafzeitfenster mit den Schritten oben. Schreibe deine neue Schlafens- und Aufstehzeit auf. Hänge sie sichtbar auf — am Kühlsrank, am Spiegel, als Handy-Hintergrund.",
        reflectionTitle: "Reflexion",
        reflection:
          "Wie realistisch fühlt sich dein neues Zeitfenster? Ist es früher oder später als deine gewohnte Zeit? Beachte, wie dein Körper auf die erste Nacht reagiert.",
        faqs: [
          {
            q: "Was, wenn meine durchschnittliche Schlafzeit unter 5 Stunden liegt?",
            a: "Setze ein Minimum von 5 Stunden Bettzeit. Weniger als das ist nicht gesund und kann die Insomnie verschlimmern. Sprich mit einem Kliniker, wenn du unter 5 Stunden liegst.",
          },
          {
            q: "Kann ich mein Zeitfenster anpassen, wenn ich mich zu müde fühle?",
            a: "Warte mindestens eine Woche, bevor du anpasst. Die erste Woche ist die schwierigste — gib deinem Körper Zeit, sich anzupassen.",
          },
        ],
        ctaLabel: "Schlaftagebuch öffnen",
        ctaHref: "/diary",
        seoTitle: "Schlafzeitfenster berechnen: Schritt-für-Schritt-Anleitung | Somna",
        seoDescription:
          "Lerne, wie du dein CBT-I-Schlafzeitfenster basierend auf deinem Schlaftagebuch berechnest.",
        keywords: [
          "Schlafzeitfenster",
          "Bettzeit berechnen",
          "CBT-I",
          "Schlafrestriktion",
          "Schlaftagebuch",
        ],
      },
    },
  },

  // ───────────────────────── Lektion 3: Dein Zeitfenster anpassen ─────────────────────────
  {
    slug: "adjusting-your-window",
    weekNumber: 3,
    weekSlug: "week-3",
    lessonNumber: 3,
    estimatedMinutes: 5,
    relatedLessonSlugs: [
      "calculating-your-sleep-window",
      "sleep-restriction",
      "when-to-expand",
    ],
    i18n: {
      de: {
        title: "Dein Zeitfenster anpassen",
        eyebrow: "WOCHE 3 · LEKTION 3",
        subtitle: "Wann und wie du dein Schlafzeitfenster erweitern oder verkürzen solltest.",
        difficulty: "Mittel",
        readingTime: "5 Min. Lesezeit",
        content: [
          {
            heading: "Wann erweitern?",
            paras: [
              "Wenn deine Schlafeffizienz konsequent über 90 % liegt für 1 Woche, kannst du dein Zeitfenster um 15 Minuten erweitern.",
              "Das bedeutet: 15 Minuten früher ins Bett gehen, gleiche Aufstehzeit.",
            ],
          },
          {
            heading: "Wann verkürzen?",
            paras: [
              "Wenn deine Schlafeffizienz unter 85 % fällt oder du dich tagsüber übermäßig müde fühlst, verkürze dein Zeitfenster um 15 Minuten.",
              "Das bedeutet: 15 Minuten später ins Bett gehen, gleiche Aufstehzeit.",
            ],
          },
          {
            heading: "Die goldene Regel",
            paras: [
              "Ändere nur eine Variable pro Woche. Nicht gleichzeitig Schlafens- und Aufstehzeit ändern.",
              "Die Aufstehzeit bleibt immer konstant. Nur die Schlafenszeit ändert sich.",
            ],
          },
        ],
        actionStepTitle: "Praktische Aufgabe",
        actionStep:
          "Am Ende dieser Woche berechne deine Schlafeffizienz. Wenn sie über 90 % liegt, plane, dein Zeitfenster nächste Woche um 15 Minuten zu erweitern. Wenn sie unter 85 % liegt, plane eine Verkürzung.",
        reflectionTitle: "Reflexion",
        reflection:
          "Wie hat sich dein Schlaf in dieser Woche verändert? Fühlst du dich tagsüber müder oder energiegeladener? Beachte die Verbindung zwischen Bettzeit und Tagesenergie.",
        faqs: [
          {
            q: "Wie schnell kann ich mein Zeitfenster auf 8 Stunden erweitern?",
            a: "Langsam. Erwarte 15-Minuten-Erweiterungen pro Woche. Es kann 4–6 Wochen dauern, bis du bei 8 Stunden bist — wenn das dein Ziel ist.",
          },
          {
            q: "Was, wenn ich mich nach der Erweiterung wieder schlechter schlafe?",
            a: "Gehe einen Schritt zurück. Verkürze das Zeitfenster wieder um 15 Minuten und warte eine Woche, bevor du es erneut versuchst.",
          },
        ],
        ctaLabel: "Schlaftagebuch öffnen",
        ctaHref: "/diary",
        seoTitle: "Schlafzeitfenster anpassen: Wann erweitern oder verkürzen | Somna",
        seoDescription:
          "Lerne, wann und wie du dein CBT-I-Schlafzeitfenster basierend auf Schlafeffizienz und Tagesenergie anpasst.",
        keywords: [
          "Schlafzeitfenster anpassen",
          "Schlafeffizienz",
          "CBT-I",
          "Schlafrestriktion",
          "Schlaf verbessern",
        ],
      },
    },
  },
];
