// Woche 6 — Langfristige Aufrechterhaltung (Lektionen 1-3)
// Quelle: native deutsche Version des CBT-I-Programms Somna.
import type { LessonContent } from "../../program-lessons";

export const deWeek6Lessons: LessonContent[] = [
  // ───────────────────────── Lektion 1: Rückfallprävention ─────────────────────────
  {
    slug: "relapse-prevention",
    weekNumber: 6,
    weekSlug: "week-6",
    lessonNumber: 1,
    estimatedMinutes: 6,
    relatedLessonSlugs: [
      "maintaining-gains",
      "identifying-triggers",
      "emergency-plan",
    ],
    i18n: {
      de: {
        title: "Rückfallprävention",
        eyebrow: "WOCHE 6 · LEKTION 1",
        subtitle:
          "Wie du deine Schlafverbesserungen langfristig aufrechterhältst und Rückschritte erkennst.",
        difficulty: "Mittel",
        readingTime: "6 Min. Lesezeit",
        content: [
          {
            heading: "Rückschritte sind normal",
            paras: [
              "Selbst nach erfolgreichem Abschluss von CBT-I werden schlechte Nächte passieren. Stress, Krankheit, Lebensveränderungen — alles kann den Schlaf vorübergehend stören.",
              "Der Schlüssel ist nicht, schlechte Nächte zu vermeiden, sondern zu verhindern, dass sie zu einem neuen Muster chronischer Insomnie werden.",
            ],
          },
          {
            heading: "Rückfallsignale erkennen",
            paras: [
              "Frühwarnsignale für einen Rückfall:",
              "Du beginnst wieder, länger im Bett zu liegen als nötig.",
              "Du nimmst Nickerchen oder schläfst am Wochenende aus.",
              "Du beginnst, das Bett für Aktivitäten außer Schlaf zu nutzen.",
              "Sorgen über den Schlaf kehren zurück.",
              "Du beginnst, Uhrschauen nachts.",
            ],
          },
          {
            heading: "Der Notfallplan",
            paras: [
              "Wenn du Rückfallsignale bemerkst, aktiviere sofort deinen Notfallplan:",
              "Kehre zu den Grundlagen zurück: konstante Aufstehzeit, Stimuluskontrolle, 20-Minuten-Regel.",
              "Verwende dein Schlaftagebuch für 1–2 Wochen, um Muster zu erkennen.",
              "Praktiziere Entspannungstechniken täglich.",
              "Wenn nach 2–3 Wochen keine Verbesserung eintritt, erwäge eine Auffrischungssitzung mit einem CBT-I-Kliniker.",
            ],
          },
        ],
        actionStepTitle: "Praktische Aufgabe",
        actionStep:
          "Erstelle deinen persönlichen Rückfallpräventionsplan. Schreibe deine Frühwarnsignale auf und die Schritte, die du unternehmen wirst. Habe diesen Plan sichtbar — am Kühlschrank, als Handy-Hintergrund.",
        reflectionTitle: "Reflexion",
        reflection:
          "Wie fühlst du dich bei der Idee, dass schlechte Nächte passieren können? Fühlst du dich besser vorbereitet mit einem Plan?",
        faqs: [
          {
            q: "Gilt eine schlechte Nacht als Rückfall?",
            a: "Nein. Eine schlechte Nacht ist normal. Ein Rückfall ist, wenn schlechte Nächte zu einem neuen Muster werden und du alte Gewohnheiten wieder aufnimmst.",
          },
          {
            q: "Wie lange sollte ich warten, bevor ich meinen Notfallplan aktiviere?",
            a: "Warte nicht. Wenn du 2–3 aufeinanderfolgende schlechte Nächte hast oder Frühwarnsignale bemerkst, aktiviere den Plan sofort.",
          },
        ],
        ctaLabel: "Schlaftagebuch öffnen",
        ctaHref: "/diary",
        seoTitle: "Rückfallprävention bei Insomnie: Langfristiger Erfolg | Somna CBT-I",
        seoDescription:
          "Lerne, wie du Schlafverbesserungen langfristig aufrechterhältst, Rückfallsignale erkennst und einen Notfallplan erstellst.",
        keywords: [
          "Rückfallprävention",
          "CBT-I",
          "Insomnie",
          "Schlafverbesserung",
          "Schlafhygiene",
        ],
      },
    },
  },

  // ───────────────────────── Lektion 2: Gewinne aufrechterhalten ─────────────────────────
  {
    slug: "maintaining-gains",
    weekNumber: 6,
    weekSlug: "week-6",
    lessonNumber: 2,
    estimatedMinutes: 5,
    relatedLessonSlugs: [
      "relapse-prevention",
      "healthy-sleep-habits",
      "long-term-cbt-i",
    ],
    i18n: {
      de: {
        title: "Gewinne aufrechterhalten",
        eyebrow: "WOCHE 6 · LEKTION 2",
        subtitle:
          "Gesunde Schlafgewohnheiten für ein Leben lang guten Schlaf.",
        difficulty: "Einsteiger",
        readingTime: "5 Min. Lesezeit",
        content: [
          {
            heading: "Von CBT-I zu Lebensstil",
            paras: [
              "Nach Abschluss des CBT-I-Programms werden die Techniken zu deinen natürlichen Gewohnheiten. Das Ziel ist nicht, CBT-I für immer zu \"machen\", sondern zu schlafen wie jemand, der CBT-I gelernt hat.",
              "Die wichtigsten Gewohnheiten, die beibehalten werden sollten:",
            ],
          },
          {
            heading: "Die drei Säulen",
            paras: [
              "Konstante Aufstehzeit: Auch am Wochenende. Das ist der stärkste Hebel für deine innere Uhr.",
              "Bett nur für Schlaf: Kein Lesen, kein Fernsehen, kein Handy im Bett.",
              "20-Minuten-Regel: Wenn du wach liegst, verlasse das Bett. Diese Regel bleibt für immer relevant.",
            ],
          },
          {
            heading: "Periodisches Schlaftagebuch",
            paras: [
              "Du musst nicht jeden Tag protokollieren, aber periodisches Tracking (z.B. 1 Woche pro Monat oder wenn du Schlafprobleme bemerkst) hilft dir, Muster frühzeitig zu erkennen.",
              "Wenn du siehst, dass deine Schlafeffizienz sinkt oder du mehr Zeit wach im Bett verbringst, ist das dein Hinweis, zurück zu den Grundlagen zu gehen.",
            ],
          },
        ],
        actionStepTitle: "Praktische Aufgabe",
        actionStep:
          "Wähle eine Strategie für langfristiges Tracking. Vielleicht 1 Woche pro Monat Schlaftagebuch, oder wenn du 2–3 schlechte Nächte hintereinander hast. Lege fest, wann du das nächste Mal protokollieren wirst.",
        reflectionTitle: "Reflexion",
        reflection:
          "Welche CBT-I-Gewohnheiten fühlen sich bereits natürlich an? Welche erfordern noch bewusste Aufmerksamkeit?",
        faqs: [
          {
            q: "Muss ich für immer mein Schlaftagebuch führen?",
            a: "Nicht jeden Tag. Periodisches Tracking (z.B. 1 Woche pro Monat) ist ausreichend, um Muster zu erkennen und frühzeitig zu intervenieren.",
          },
          {
            q: "Kann ich meine Bettzeit erweitern, wenn mein Schlaf gut ist?",
            a: "Ja, langsam und vorsichtig. Erweitere um 15 Minuten pro Woche, solange deine Schlafeffizienz über 90 % bleibt. Nicht über 8–9 Stunden Bettzeit hinausgehen, es sei denn, dein Körper braucht mehr.",
          },
        ],
        ctaLabel: "Schlaftagebuch öffnen",
        ctaHref: "/diary",
        seoTitle: "Gewinne aufrechterhalten: Gesunde Schlafgewohnheiten | Somna",
        seoDescription:
          "Lerne, wie du CBT-I-Erfolge langfristig aufrechterhältst und gesunde Schlafgewohnheiten für ein Leben lang entwickelst.",
        keywords: [
          "Gewinne aufrechterhalten",
          "CBT-I",
          "Schlafgewohnheiten",
          "Schlafhygiene",
          "Langzeit-Schlaf",
        ],
      },
    },
  },

  // ───────────────────────── Lektion 3: Abschluss und Übergang ─────────────────────────
  {
    slug: "graduation-and-transition",
    weekNumber: 6,
    weekSlug: "week-6",
    lessonNumber: 3,
    estimatedMinutes: 5,
    relatedLessonSlugs: [
      "maintaining-gains",
      "relapse-prevention",
      "celebrating-progress",
    ],
    i18n: {
      de: {
        title: "Abschluss und Übergang",
        eyebrow: "WOCHE 6 · LEKTION 3",
        subtitle:
          "Feiere deinen Fortschritt und plane den Übergang zum selbstständigen Schlafmanagement.",
        difficulty: "Einsteiger",
        readingTime: "5 Min. Lesezeit",
        content: [
          {
            heading: "Feiere deinen Fortschritt",
            paras: [
              "Du hast 6 Wochen CBT-I absolviert. Das ist eine bedeutende Leistung. Du hast neue Fähigkeiten gelernt, dein Schlafsystem zu verstehen und zu steuern.",
              "Nimm einen Moment, um zu reflektieren: Wie war dein Schlaf vor dem Programm? Wie ist er jetzt? Welche Techniken waren am hilfreichsten?",
            ],
          },
          {
            heading: "Was du erreicht hast",
            paras: [
              "Verständnis deines Schlafsystems: Zyklen, zirkadianer Rhythmus, Schlafdruck.",
              "Stimuluskontrolle: Bett-Schlaf-Verbindung neu aufgebaut.",
              "Schlafrestriktion: Schlafeffizienz verbessert.",
              "Kognitive Umstrukturierung: Ängstliche Gedanken hinterfragt.",
              "Entspannungstechniken: Nervensystem beruhigt.",
              "Schlafhygiene: Umwelt optimiert.",
            ],
          },
          {
            heading: "Der Übergang",
            paras: [
              "Ab jetzt bist du dein eigener Schlaf-Manager. Du hast die Werkzeuge, aber es liegt an dir, sie anzuwenden.",
              "Erinnere dich: CBT-I ist nicht etwas, das du \"machst\" und dann fertig bist. Es ist eine neue Art zu schlafen, die du für den Rest deines Lebens beibehalten kannst.",
            ],
          },
        ],
        actionStepTitle: "Praktische Aufgabe",
        actionStep:
          "Schreibe einen Brief an dein zukünftiges Selbst — 6 Monate oder 1 Jahr von heute. Beschreibe, wie du schläfst, welche Gewohnheiten du beibehältst und wie du mit Rückschritten umgehst. Bewahre diesen Brief auf und lies ihn in 6 Monaten.",
        reflectionTitle: "Reflexion",
        reflection:
          "Wie fühlst du dich am Ende dieses Programms? Stolz? Erleichtert? Skeptisch? Was ist dein nächster Schritt?",
        faqs: [
          {
            q: "Was, wenn ich in 6 Monaten wieder Schlafprobleme habe?",
            a: "Dann kehre zu den Grundlagen zurück: Schlaftagebuch, konstante Aufstehzeit, Stimuluskontrolle. Du hast die Werkzeuge — du musst sie nur wieder anwenden.",
          },
          {
            q: "Soll ich dieses Programm noch einmal durchlaufen?",
            a: "Vielleicht eine Auffrischung, wenn du einen Rückfall hast. Aber im Allgemeinen ist es besser, die Grundlagen anzuwenden, anstatt das gesamte Programm zu wiederholen.",
          },
        ],
        ctaLabel: "Schlaftagebuch öffnen",
        ctaHref: "/diary",
        seoTitle: "CBT-I Abschluss: Übergang zum selbstständigen Schlaf | Somna",
        seoDescription:
          "Feiere deinen CBT-I-Fortschritt, reflektiere auf deine Erfolge und plane den Übergang zum selbstständigen Schlafmanagement.",
        keywords: [
          "CBT-I Abschluss",
          "Schlafmanagement",
          "Insomnie-Behandlung",
          "Schlafverbesserung",
          "Langzeit-Schlaf",
        ],
      },
    },
  },
];
