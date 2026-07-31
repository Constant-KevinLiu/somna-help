// Woche 5 — Entspannung und Schlafhygiene (Lektionen 1-3)
// Quelle: native deutsche Version des CBT-I-Programms Somna.
import type { LessonContent } from "../../program-lessons";

export const deWeek5Lessons: LessonContent[] = [
  // ───────────────────────── Lektion 1: Entspannungstechniken ─────────────────────────
  {
    slug: "relaxation-techniques",
    weekNumber: 5,
    weekSlug: "week-5",
    lessonNumber: 1,
    estimatedMinutes: 6,
    relatedLessonSlugs: [
      "4-7-8-breathing",
      "progressive-muscle-relaxation",
      "body-scan",
    ],
    i18n: {
      de: {
        title: "Entspannungstechniken",
        eyebrow: "WOCHE 5 · LEKTION 1",
        subtitle:
          "Wissenschaftlich fundierte Methoden, um das Nervensystem vor dem Schlafengehen zu beruhigen.",
        difficulty: "Einsteiger",
        readingTime: "6 Min. Lesezeit",
        content: [
          {
            heading: "Warum Entspannung wichtig ist",
            paras: [
              "Bei Insomnie ist das Nervensystem oft im Zustand der Hyperarousal — körperlich und mental wach, selbst wenn du müde bist.",
              "Entspannungstechniken aktivieren den parasympathischen Zweig des Nervensystems, den \"Ruhe und Verdauung\"-Modus. Das senkt Herzfrequenz, Blutdruck und Stresshormone.",
            ],
          },
          {
            heading: "Drei wirksame Techniken",
            paras: [
              "Progressive Muskelentspannung: Spanne und entspanne Muskelgruppen systematisch vom Kopf bis zu den Zehen.",
              "4-7-8-Atmung: 4 Sekunden einatmen, 7 Sekunden halten, 8 Sekunden ausatmen. Wiederhole 4 Zyklen.",
              "Body-Scan: Bewege deine Aufmerksamkeit langsam durch deinen Körper und bemerke Empfindungen ohne Urteil.",
            ],
          },
          {
            heading: "Wann und wie oft praktizieren",
            paras: [
              "Praktiziere diese Techniken täglich, nicht nur wenn du nicht schlafen kannst. Regelmäßigkeit stärkt die Entspannungsreaktion.",
              "Integriere sie in deine Abendroutine: 10–15 Minuten vor dem Schlafengehen. Mit der Zeit wird dein Körper lernen, dass diese Signale Schlaf bedeuten.",
            ],
          },
        ],
        actionStepTitle: "Praktische Aufgabe",
        actionStep:
          "Wähle eine Entspannungstechnik (Progressive Muskelentspannung, 4-7-8-Atmung oder Body-Scan). Praktiziere sie jeden Abend diese Woche für 10–15 Minuten vor dem Schlafengehen. Notiere, wie sich dein Körper und Geist fühlen.",
        reflectionTitle: "Reflexion",
        reflection:
          "Welche Technik fühlt sich am natürlichsten für dich? Bemerkst du eine Veränderung in deinem Schlaf oder deiner nächtlichen Erregung nach einer Woche?",
        faqs: [
          {
            q: "Soll ich Entspannungstechniken auch nachts praktizieren, wenn ich aufwache?",
            a: "Ja, aber sanft. Wenn du aufwachst und nicht wieder einschlafen kannst, versuche eine leichte Atmungstechnik oder einen kurzen Body-Scan. Nicht intensiv — das Ziel ist Beruhigung, nicht Aktivierung.",
          },
          {
            q: "Wie lange dauert es, bis Entspannungstechniken wirken?",
            a: "Die meisten Menschen bemerken eine gewisse Wirkung sofort, aber dauerhafte Veränderungen erfordern 2–4 Wochen konsequenter Praxis.",
          },
        ],
        ctaLabel: "Entspannungs-Tool öffnen",
        ctaHref: "/relax",
        seoTitle: "Entspannungstechniken bei Insomnie: CBT-I-Ansatz | Somna",
        seoDescription:
          "Lerne progressive Muskelentspannung, 4-7-8-Atmung und Body-Scan — wissenschaftlich fundierte Methoden zur Beruhigung des Nervensystems.",
        keywords: [
          "Entspannungstechniken",
          "Progressive Muskelentspannung",
          "4-7-8-Atmung",
          "Body-Scan",
          "CBT-I",
          "Schlafhygiene",
        ],
      },
    },
  },

  // ───────────────────────── Lektion 2: Schlafhygiene ─────────────────────────
  {
    slug: "sleep-hygiene",
    weekNumber: 5,
    weekSlug: "week-5",
    lessonNumber: 2,
    estimatedMinutes: 5,
    relatedLessonSlugs: [
      "circadian-rhythm",
      "caffeine-and-sleep",
      "light-and-sleep",
    ],
    i18n: {
      de: {
        title: "Schlafhygiene",
        eyebrow: "WOCHE 5 · LEKTION 2",
        subtitle:
          "Umweltfaktoren und Gewohnheiten, die deinen Schlaf unterstützen oder behindern.",
        difficulty: "Einsteiger",
        readingTime: "5 Min. Lesezeit",
        content: [
          {
            heading: "Was ist Schlafhygiene?",
            paras: [
              "Schlafhygiene umfasst die Umweltbedingungen und Verhaltensweisen, die die Schlafqualität beeinflussen. Sie ist ein wichtiger Teil von CBT-I, aber allein selten ausreichend für chronische Insomnie.",
              "Gute Schlafhygiene schafft optimale Bedingungen für Schlaf, löst aber nicht die zugrundeliegenden Muster, die Insomnie aufrechterhalten.",
            ],
          },
          {
            heading: "Die wichtigsten Faktoren",
            paras: [
              "Licht: Helles Licht am Morgen stabilisiert die innere Uhr. Gedimmtes Licht am Abend fördert Melatonin.",
              "Temperatur: Ein kühles Schlafzimmer (16–19 °C) fördert Tiefschlaf.",
              "Koffein: Vermeide Koffein nach 14 Uhr. Die Halbwertszeit beträgt etwa 5 Stunden.",
              "Alkohol: Alkohol mag beim Einschlafen helfen, fragmentiert aber den Schlaf später in der Nacht.",
              "Bildschirme: Vermeide Bildschirme 60–90 Minuten vor dem Schlafengehen.",
            ],
          },
          {
            heading: "Schlafhygiene vs. CBT-I",
            paras: [
              "Schlafhygiene ist wie das Vorbereiten des Bodens für das Pflanzen. CBT-I ist das eigentliche Pflanzen und Gießen.",
              "Beide sind wichtig, aber wenn du nur den Boden vorbereitest, ohne zu pflanzen, wächst nichts. CBT-I mit guter Schlafhygiene ist die stärkste Kombination.",
            ],
          },
        ],
        actionStepTitle: "Praktische Aufgabe",
        actionStep:
          "Wähle zwei Schlafhygiene-Verbesserungen für diese Woche. Zum Beispiel: keine Bildschirme nach 21 Uhr, oder das Schlafzimmer auf 18 °C kühlen. Halte dich konsequent daran und beobachte die Auswirkungen.",
        reflectionTitle: "Reflexion",
        reflection:
          "Wie einfach oder schwierig war es, die neuen Gewohnheiten einzuhalten? Welche Veränderungen bemerkst du in deinem Schlaf oder deinem Tagesenergie?",
        faqs: [
          {
            q: "Ist Schlafhygiene allein genug, um meine Insomnie zu heilen?",
            a: "Für die meisten Menschen mit chronischer Insomnie nein. Schlafhygiene ist wichtig, aber CBT-I (Stimuluskontrolle, Schlafrestriktion, kognitive Umstrukturierung) ist notwendig, um die zugrundeliegenden Muster zu ändern.",
          },
          {
            q: "Welche Schlafhygiene-Änderung ist am wichtigsten?",
            a: "Konstante Aufstehzeit und Lichtmanagement (morgens Licht, abends gedimmtes Licht) sind die stärksten Hebel. Beginne damit.",
          },
        ],
        ctaLabel: "Schlaftagebuch öffnen",
        ctaHref: "/diary",
        seoTitle: "Schlafhygiene: Umweltfaktoren für besseren Schlaf | Somna",
        seoDescription:
          "Verstehe die wichtigsten Schlafhygiene-Faktoren — Licht, Temperatur, Koffein, Alkohol und Bildschirme — und wie sie mit CBT-I zusammenwirken.",
        keywords: [
          "Schlafhygiene",
          "Schlafumgebung",
          "CBT-I",
          "Lichtmanagement",
          "Koffein",
          "Schlaftemperatur",
        ],
      },
    },
  },

  // ───────────────────────── Lektion 3: Sorgenfenster ─────────────────────────
  {
    slug: "worry-time",
    weekNumber: 5,
    weekSlug: "week-5",
    lessonNumber: 3,
    estimatedMinutes: 5,
    relatedLessonSlugs: [
      "cognitive-restructuring",
      "racing-thoughts-at-night",
      "thought-record-sheet",
    ],
    i18n: {
      de: {
        title: "Sorgenfenster",
        eyebrow: "WOCHE 5 · LEKTION 3",
        subtitle:
          "Eine strukturierte Technik, um nächtliche Grübeleien zu reduzieren.",
        difficulty: "Mittel",
        readingTime: "5 Min. Lesezeit",
        content: [
          {
            heading: "Das Problem nächtlicher Sorgen",
            paras: [
              "Wenn du tagsüber beschäftigt bist, haben Sorgen keine Bühne. Nachts, wenn Ablenkungen verschwinden, stoßen sie an die Oberfläche.",
              "Das ist besonders problematisch, wenn du versuchst zu schlafen. Sorgen aktivieren das Nervensystem genau dann, wenn es sich beruhigen sollte.",
            ],
          },
          {
            heading: "Das Sorgenfenster",
            paras: [
              "Ein Sorgenfenster ist ein festgelegter Zeitraum am frühen Abend (z.B. 15–20 Minuten um 19 Uhr), in dem du Sorgen bewusst aufschreibst und verarbeitest.",
              "Wenn Sorgen nachts auftauchen, kannst du sagen: \"Ich habe das bereits in meinem Sorgenfenster bearbeitet. Jetzt ist Schlafzeit.\"",
            ],
          },
          {
            heading: "Wie es funktioniert",
            paras: [
              "Wähle eine feste Zeit am frühen Abend — nicht zu kurz vor dem Schlafengehen.",
              "Schreibe alle Sorgen auf, die dich beschäftigen.",
              "Für jede Sorge: Notiere den nächsten kleinen Schritt, den du unternehmen kannst.",
              "Wenn die Zeit um ist, schließe das Notizbuch. Wenn Sorgen nachts kommen, erinnere dich daran, dass sie bereits bearbeitet wurden.",
            ],
          },
        ],
        actionStepTitle: "Praktische Aufgabe",
        actionStep:
          "Lege ein Sorgenfenster für diese Woche fest: 15–20 Minuten am frühen Abend. Schreibe jeden Tag deine Sorgen auf und plane kleine nächste Schritte. Wenn du nachts wach liegst und Sorgen kommst, erinnere dich: \"Das ist bereits bearbeitet.\"",
        reflectionTitle: "Reflexion",
        reflection:
          "Wie fühlst du dich nach dem Sorgenfenster? Bemerkst du eine Veränderung in der Häufigkeit oder Intensität nächtlicher Sorgen?",
        faqs: [
          {
            q: "Was, wenn ich keine Sorgen habe?",
            a: "Das ist gut! Nutze die Zeit für Entspannung oder etwas Angenehmes. Das Fenster ist da, wenn du es brauchst.",
          },
          {
            q: "Soll ich das Sorgenfenster direkt vor dem Schlafengehen machen?",
            a: "Nein. Mach es am frühen Abend, mindestens 1–2 Stunden vor dem Schlafengehen. Sorgen direkt vor dem Schlaf kann das Nervensystem aktivieren.",
          },
        ],
        ctaLabel: "Schlaftagebuch öffnen",
        ctaHref: "/diary",
        seoTitle: "Sorgenfenster: Technik gegen Grübeleien nachts | Somna CBT-I",
        seoDescription:
          "Lerne, wie ein strukturiertes Sorgenfenster nächtliche Grübeleien reduziert und den Geist für den Schlaf vorbereitet.",
        keywords: [
          "Sorgenfenster",
          "Grübeleien",
          "CBT-I",
          "Schlafangst",
          "kognitive Umstrukturierung",
          "Schlafhygiene",
        ],
      },
    },
  },
];
