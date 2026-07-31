// Woche 2 — Bett-Schlaf-Assoziation (Lektionen 1-3)
// Quelle: native deutsche Version des CBT-I-Programms Somna.
import type { LessonContent } from "../../program-lessons";

export const deWeek2Lessons: LessonContent[] = [
  // ───────────────────────── Lektion 1: Bett-Schlaf-Assoziation ─────────────────────────
  {
    slug: "bed-sleep-association",
    weekNumber: 2,
    weekSlug: "week-2",
    lessonNumber: 1,
    estimatedMinutes: 6,
    relatedLessonSlugs: [
      "trying-harder-makes-sleep-worse",
      "stimulus-control",
      "what-is-sleep-efficiency",
    ],
    i18n: {
      de: {
        title: "Bett-Schlaf-Assoziation",
        eyebrow: "WOCHE 2 · LEKTION 1",
        subtitle:
          "Warum dein Gehirn das Bett mit Wachsein verknüpft hat und wie wir diese Verbindung neu aufbauen.",
        difficulty: "Einsteiger",
        readingTime: "6 Min. Lesezeit",
        content: [
          {
            heading: "Gelernte Verknüpfungen",
            paras: [
              "Dein Gehirn ist ein Muster-Lern-Maschine. Jedes Mal, wenn du eine Handlung ausführst und ein Ergebnis erlebst, stärkt es die Verbindung zwischen beiden.",
              "Wenn du über viele Nächte hinweg wach im Bett lagest, gelesen hast, gearbeitet hast oder dich über Schlaf gefragt hast, lernte dein Gehirn: Bett = Wachsein, Frustration, Sorge. Das ist keine Schwäche — es ist einfach, wie Lernen funktioniert.",
            ],
          },
          {
            heading: "Die gute Nachricht",
            paras: [
              "Gelernte Verknüpfungen können neu gelernt werden. CBT-I nutzt Stimuluskontrolle, um die Bett-Schlaf-Verbindung wieder aufzubauen. Das Ziel ist einfach: Wenn du die Schwelle des Schlafzimmers überschreitest, sollte dein Körper wissen, dass Schlaf kommt.",
            ],
          },
          {
            heading: "Die 20-Minuten-Regel",
            paras: [
              "Wenn du nicht nach etwa 20 Minuten schläfst (kein Uhrschauen — schätze), steh auf. Geh an einen anderen Ort bei gedimmtem Licht. Lies etwas Sanftes, höre ruhige Musik oder dehne dich sanft. Kehre nur ins Bett zurück, wenn du dich müde fühlst — schwere Augen, nickender Kopf.",
              "Das klingt gegenintuitiv, aber es ist das Herz der Stimuluskontrolle. Du trainierst dein Gehirn: Bett = Schlaf, nicht Bett = Wachsein.",
            ],
          },
        ],
        actionStepTitle: "Praktische Aufgabe",
        actionStep:
          "In dieser Woche wendest du die 20-Minuten-Regel konsequent an. Wenn du wach im Bett liegst und die Frustration steigt, verlasse das Bett. Mach etwas Ruhiges bei gedimmtem Licht. Kehre erst zurück, wenn echte Müdigkeit kommt. Wiederhole dies bei Bedarf mehrmals pro Nacht.",
        reflectionTitle: "Reflexion",
        reflection:
          "Wie fühlst du dich beim Aufstehen aus dem Bett? Widerstehst du dem Impuls oder gehst du sanft? Beachte, wie sich dein Körper beim Zurückkehren fühlt — ist die Müdigkeit stärker geworden?",
        faqs: [
          {
            q: "Wie schätze ich 20 Minuten ohne auf die Uhr zu schauen?",
            a: "Es ist eine grobe Schätzung. Wenn du dich wach fühlst und die Zeit langsam zieht, ist das dein Hinweis. Genauigkeit ist nicht wichtig — die Absicht, das Bett zu verlassen, ist.",
          },
          {
            q: "Soll ich auch nachts aufstehen, wenn ich aufwache?",
            a: "Ja. Dieselbe 20-Minuten-Regel gilt für mitternächtliche Erwachen. Wenn du nicht wieder einschlafen kannst, verlasse das Bett und kehre nur bei Müdigkeit zurück.",
          },
        ],
        ctaLabel: "Schlaftagebuch öffnen",
        ctaHref: "/diary",
        seoTitle: "Bett-Schlaf-Assoziation: Stimuluskontrolle erklärt | Somna CBT-I",
        seoDescription:
          "Lerne, wie Stimuluskontrolle die Bett-Schlaf-Verbindung neu aufbaut und warum das Verlassen des Bettes ein Schlüsselwerkzeug bei CBT-I ist.",
        keywords: [
          "Bett-Schlaf-Assoziation",
          "Stimuluskontrolle",
          "CBT-I",
          "Schlaftraining",
          "Insomnie",
        ],
      },
    },
  },

  // ───────────────────────── Lektion 2: Was ist Schlafeffizienz? ─────────────────────────
  {
    slug: "what-is-sleep-efficiency",
    weekNumber: 2,
    weekSlug: "week-2",
    lessonNumber: 2,
    estimatedMinutes: 5,
    relatedLessonSlugs: [
      "bed-sleep-association",
      "stimulus-control",
      "sleep-restriction",
    ],
    i18n: {
      de: {
        title: "Was ist Schlafeffizienz?",
        eyebrow: "WOCHE 2 · LEKTION 2",
        subtitle:
          "Ein einfacher Metrik, der zeigt, wie viel Zeit du tatsächlich schläfst vs. im Bett liegst.",
        difficulty: "Einsteiger",
        readingTime: "5 Min. Lesezeit",
        content: [
          {
            heading: "Die Formel",
            paras: [
              "Schlafeffizienz ist einfach: (tatsächliche Schlafzeit / Zeit im Bett) × 100.",
              "Wenn du 8 Stunden im Bett liegst und davon 6 Stunden schläfst, ist deine Schlafeffizienz 75 %. Wenn du 7 Stunden im Bett liegst und 6,5 Stunden schläfst, steigt sie auf 93 %.",
            ],
          },
          {
            heading: "Warum es wichtig ist",
            paras: [
              "Bei chronischer Insomnie liegt die Schlafeffizienz oft unter 80 %. Das bedeutet, du verbringst viel Zeit wach im Bett, was die negative Bett-Assoziation stärkt.",
              "CBT-I zielt darauf ab, die Schlafeffizienz auf 85–90 % zu bringen. Das ist der Bereich, in dem die meisten Menschen sich gut ausgeruht fühlen und die Bett-Schlaf-Verbindung stark ist.",
            ],
          },
          {
            heading: "Wie man sie verbessert",
            paras: [
              "Der effektivste Weg ist Schlafrestriktion — vorübergehende Komprimierung der Bettzeit auf deine tatsächliche Schlafzeit. Das baut Schlafdruck auf und stärkt die Bett-Schlaf-Verbindung.",
              "Es fühlt sich anfangs schwierig an, aber die meisten Menschen sehen innerhalb von 1–2 Wochen eine deutliche Verbesserung der Schlafeffizienz.",
            ],
          },
        ],
        actionStepTitle: "Praktische Aufgabe",
        actionStep:
          "Berechne deine Schlafeffizienz für die vergangene Woche mit deinem Schlaftagebuch. Teile deine durchschnittliche Schlafzeit durch deine durchschnittliche Bettzeit. Wo stehst du? Notiere diese Zahl — sie ist dein Ausgangspunkt.",
        reflectionTitle: "Reflexion",
        reflection:
          "Wie reagierst du auf deine Schlafeffizienz-Zahl? Fühlst du dich motiviert oder frustriert? Erinnere dich daran: Es ist nur ein Datenpunkt, kein Urteil über deinen Wert.",
        faqs: [
          {
            q: "Ist eine Schlafeffizienz von 100 % ideal?",
            a: "Nicht unbedingt. Die meisten Menschen haben leichte Erwachen zwischen Zyklen. Ein Bereich von 85–90 % ist gesund und realistisch.",
          },
          {
            q: "Kann ich meine Schlafeffizienz ohne Schlafrestriktion verbessern?",
            a: "Stimuluskontrolle kann helfen, aber Schlafrestriktion ist der effektivste Weg, die Zahl schnell zu heben.",
          },
        ],
        ctaLabel: "Schlaftagebuch öffnen",
        ctaHref: "/diary",
        seoTitle: "Was ist Schlafeffizienz? Berechnung und Bedeutung | Somna",
        seoDescription:
          "Verstehe die Schlafeffizienz-Formel, warum sie bei Insomnie wichtig ist und wie CBT-I sie auf 85–90 % bringt.",
        keywords: [
          "Schlafeffizienz",
          "Schlafberechnung",
          "CBT-I",
          "Schlafrestriktion",
          "Insomnie-Metrik",
        ],
      },
    },
  },

  // ───────────────────────── Lektion 3: Stimuluskontrolle in der Praxis ─────────────────────────
  {
    slug: "stimulus-control",
    weekNumber: 2,
    weekSlug: "week-2",
    lessonNumber: 3,
    estimatedMinutes: 5,
    relatedLessonSlugs: ["bed-sleep-association", "what-is-sleep-efficiency", "sleep-restriction"],
    i18n: {
      de: {
        title: "Stimuluskontrolle in der Praxis",
        eyebrow: "WOCHE 2 · LEKTION 3",
        subtitle: "Konkrete Regeln, um die Bett-Schlaf-Verbindung wieder aufzubauen.",
        difficulty: "Einsteiger",
        readingTime: "5 Min. Lesezeit",
        content: [
          {
            heading: "Die fünf Regeln",
            paras: [
              "Stimuluskontrolle basiert auf fünf einfachen, aber mächtigen Regeln:",
              "1. Benutze das Bett nur für Schlaf und Intimität. Kein Lesen, kein Fernsehen, kein Handy, keine Arbeit.",
              "2. Geh nur ins Bett, wenn du müde bist — nicht nur erschöpft.",
              "3. Wenn du nicht nach etwa 20 Minuten schläfst, steh auf. Geh an einen anderen Ort bei gedimmtem Licht. Kehre erst bei Müdigkeit zurück.",
              "4. Halte eine konstante Aufstehzeit, jeden Tag — auch am Wochenende.",
              "5. Vermeide Nickerchen, zumindest während der aktiven Phase des Programms.",
            ],
          },
          {
            heading: "Warum es funktioniert",
            paras: [
              "Diese Regeln entfernen das Bett aus dem Wachsein-Kontext und verankern es im Schlaf-Kontext. Dein Gehirn lernt neu: Bett = Schlaf.",
              "Es erfordert Disziplin, besonders in den ersten Wochen. Aber die meisten Menschen berichten, dass sich das Bett nach 2–3 Wochen wieder wie ein Heiligtum anfühlt.",
            ],
          },
        ],
        actionStepTitle: "Praktische Aufgabe",
        actionStep:
          "In dieser Woche bringst du Bildschirme, Arbeitsmaterialien und alles andere aus dem Schlafzimmer. Dein Schlafzimmer wird zum reinen Schlafraum. Wenn du das Bett betrittst, ist der einzige Zweck: schlafen.",
        reflectionTitle: "Reflexion",
        reflection:
          "Wie fühlt sich dein Schlafzimmer jetzt an? Ist es ein Ruheort oder ein Arbeitsplatz? Beachte, wie sich deine Stimmung ändert, wenn du den Raum betrittst.",
        faqs: [
          {
            q: "Kann ich im Bett lesen, wenn es mich müde macht?",
            a: "Wenn Lesen dich verlässlich müde macht, ja. Wenn es dich wach hält, lies woanders und kehre erst bei Müdigkeit ins Bett zurück.",
          },
          {
            q: "Was, wenn ich das Bett verlassen muss, aber mein Partner schläft?",
            a: "Sei so leise wie möglich. Wenn möglich, habe einen separaten Ruhebereich. Das Ziel ist, die Bett-Schlaf-Verbindung für dich wieder aufzubauen.",
          },
        ],
        ctaLabel: "Zur nächsten Lektion",
        ctaHref: "/program/week-3/sleep-restriction",
        seoTitle: "Stimuluskontrolle: 5 Regeln für besseren Schlaf | Somna CBT-I",
        seoDescription:
          "Die fünf Stimuluskontroll-Regeln, die die Bett-Schlaf-Verbindung neu aufbauen und Insomnie behandeln.",
        keywords: [
          "Stimuluskontrolle",
          "Bett-Schlaf-Regeln",
          "CBT-I",
          "Insomnie-Behandlung",
          "Schlafhygiene",
        ],
      },
    },
  },
];
