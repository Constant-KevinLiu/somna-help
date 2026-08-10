// Woche 4 — Kognitive Umstrukturierung (Lektionen 1-3)
// Quelle: native deutsche Version des CBT-I-Programms Somna.
import type { LessonContent } from "../../program-lessons";

export const deWeek4Lessons: LessonContent[] = [
  // ───────────────────────── Lektion 1: Was ist kognitive Umstrukturierung? ─────────────────────────
  {
    slug: "cognitive-restructuring",
    weekNumber: 4,
    weekSlug: "week-4",
    lessonNumber: 1,
    estimatedMinutes: 6,
    relatedLessonSlugs: [
      "racing-thoughts-at-night",
      "sleep-anxiety",
      "challenging-negative-thoughts",
    ],
    i18n: {
      de: {
        title: "Was ist kognitive Umstrukturierung?",
        eyebrow: "WOCHE 4 · LEKTION 1",
        subtitle:
          "Wie man ängstliche Gedanken über Schlaf identifiziert und ihre emotionale Macht reduziert.",
        difficulty: "Mittel",
        readingTime: "6 Min. Lesezeit",
        content: [
          {
            heading: "Gedanken sind nicht Fakten",
            paras: [
              'Wenn du nachts liegst und denkst: "Ich werde morgen nicht funktionieren", fühlt es sich wie eine absolute Wahrheit. Aber es ist nur ein Gedanke — eine Interpretation, keine Tatsache.',
              "Kognitive Umstrukturierung ist der Prozess, Gedanken zu untersuchen, ihre Genauigkeit zu hinterfragen und sie durch realistischere, weniger bedrohliche Alternativen zu ersetzen.",
            ],
          },
          {
            heading: "Typische Schlafgedanken",
            paras: [
              "Ängstliche Gedanken über Schlaf fallen oft in Muster:",
              'Katastrophisieren: "Wenn ich heute Nacht nicht schlafe, verliere ich meinen Job."',
              'Alles-oder-Nichts: "Ich muss perfekt schlafen oder ich bin ruiniert."',
              'Übergeneralisieren: "Ich schlafe nie gut."',
              'Lesen: "Ich weiß, dass ich morgen erschöpft sein werde."',
            ],
          },
          {
            heading: "Der ABC-Prozess",
            paras: [
              "A (Auslöser): Du liegst wach im Bett.",
              'B (Gedanke): "Ich werde morgen nicht funktionieren."',
              "C (Konsequenz): Angst, erhöhter Herzschlag, noch weniger Schlaf.",
              'Kognitive Umstrukturierung ändert B, um C zu ändern. Statt "Ich werde nicht funktionieren", fragst du: "Habe ich mich nach rauen Nächten früher schon mal durchgesetzt? Ja. Ich kann vielleicht nicht auf meinem Höchstniveau sein, aber ich werde funktionieren."',
            ],
          },
        ],
        actionStepTitle: "Praktische Aufgabe",
        actionStep:
          "In dieser Woche notierst du ängstliche Gedanken, die nachts auftreten. Schreibe sie auf, sobald sie kommen. Später am Tag hinterfrage jeden Gedanken: Ist das eine Tatsache oder eine Interpretation? Was ist eine realistischere Alternative?",
        reflectionTitle: "Reflexion",
        reflection:
          "Welche Gedanken wiederholen sich bei dir? Erkennst du Muster wie Katastrophisieren oder Übergeneralisieren? Wie fühlst du dich, nachdem du einen Gedanken hinterfragt hast?",
        faqs: [
          {
            q: "Kann kognitive Umstrukturierung mein Schlafproblem lösen?",
            a: "Es ist ein wichtiger Teil von CBT-I, aber meistens nicht allein. In Kombination mit Stimuluskontrolle und Schlafrestriktion ist es sehr wirksam.",
          },
          {
            q: "Wie lange dauert es, bis Gedanken sich ändern?",
            a: "Gedankenmuster sind tief verwurzelt. Erwarte 2–4 Wochen konsequenter Praxis, bevor du eine spürbare Veränderung bemerkst.",
          },
        ],
        ctaLabel: "Schlaftagebuch öffnen",
        ctaHref: "/diary",
        seoTitle: "Kognitive Umstrukturierung bei Insomnie | Somna CBT-I",
        seoDescription:
          "Lerne, wie kognitive Umstrukturierung ängstliche Schlafgedanken identifiziert und durch realistischere Alternativen ersetzt.",
        keywords: [
          "kognitive Umstrukturierung",
          "CBT-I",
          "Schlafangst",
          "negative Gedanken",
          "Insomnie-Behandlung",
        ],
      },
    },
  },

  // ───────────────────────── Lektion 2: Negative Gedanken hinterfragen ─────────────────────────
  {
    slug: "challenging-negative-thoughts",
    weekNumber: 4,
    weekSlug: "week-4",
    lessonNumber: 2,
    estimatedMinutes: 5,
    relatedLessonSlugs: [
      "cognitive-restructuring",
      "racing-thoughts-at-night",
      "thought-record-sheet",
    ],
    i18n: {
      de: {
        title: "Negative Gedanken hinterfragen",
        eyebrow: "WOCHE 4 · LEKTION 2",
        subtitle: "Konkrete Techniken, um die Genauigkeit ängstlicher Gedanken zu prüfen.",
        difficulty: "Mittel",
        readingTime: "5 Min. Lesezeit",
        content: [
          {
            heading: "Die Detektiv-Methode",
            paras: [
              "Behandle deine Gedanken wie Beweise, nicht wie Urteile. Wenn ein Gedanke auftaucht, frage dich wie ein Detektiv:",
              '"Was ist der Beweis für diesen Gedanken?"',
              '"Was ist der Beweis gegen diesen Gedanken?"',
              '"Gibt es eine alternative Erklärung?"',
              '"Was würde ich einem Freund sagen, der diesen Gedanken hat?"',
            ],
          },
          {
            heading: 'Beispiel: "Ich werde morgen nicht funktionieren"',
            paras: [
              "Beweis dafür: Ich bin nach rauen Nächten früher schon müde gewesen.",
              "Beweis dagegen: Ich bin trotzdem zur Arbeit gegangen und meine Aufgaben erledigt. Ich bin vielleicht nicht auf meinem Höchstniveau gewesen, aber ich habe funktioniert.",
              "Alternative: Ich werde morgen vielleicht etwas müder sein, aber ich kann meine Prioritäten anpassen und das Wichtige schaffen.",
            ],
          },
          {
            heading: "Das Socratic Questioning",
            paras: [
              "Eine andere Technik ist das sokratische Fragen — sanftes Hinterfragen statt aggressiver Widerlegung:",
              '"Ist dieser Gedanke 100 % wahr?"',
              '"Gibt es Zeiten, in denen er nicht wahr war?"',
              '"Was ist das Schlimmste, das passieren könnte? Wie wahrscheinlich ist das?"',
            ],
          },
        ],
        actionStepTitle: "Praktische Aufgabe",
        actionStep:
          "Nimm einen ängstlichen Gedanken, den du diese Woche notiert hast. Wende die Detektiv-Methode an: schreibe Beweise dafür und dagegen auf. Formuliere eine realistischere Alternative.",
        reflectionTitle: "Reflexion",
        reflection:
          "Wie fühlst du dich nach dem Hinterfragen eines Gedankens? Fühlst du dich etwas entlastet oder skeptisch? Beachte, wie sich deine Körperreaktion ändert.",
        faqs: [
          {
            q: "Was, wenn ich keine Beweise gegen meinen Gedanken finde?",
            a: 'Dann ist der Gedanke vielleicht teilweise wahr. Aber selbst dann kannst du fragen: "Ist er 100 % wahr? Gibt es Nuancen, die ich übersehe?"',
          },
          {
            q: "Soll ich Gedanken hinterfragen, wenn ich versuche zu schlafen?",
            a: "Nein. Hinterfrage Gedanken am Tag, nicht nachts. Nachts ist das Ziel, den Geist zu beruhigen, nicht zu analysieren.",
          },
        ],
        ctaLabel: "Schlaftagebuch öffnen",
        ctaHref: "/diary",
        seoTitle: "Negative Gedanken hinterfragen: CBT-I-Techniken | Somna",
        seoDescription:
          "Lerne konkrete Techniken wie die Detektiv-Methode und sokratisches Fragen, um ängstliche Schlafgedanken zu prüfen.",
        keywords: [
          "negative Gedanken hinterfragen",
          "CBT-I",
          "Detektiv-Methode",
          "Schlafangst",
          "kognitive Umstrukturierung",
        ],
      },
    },
  },

  // ───────────────────────── Lektion 3: Gedankenprotokoll ─────────────────────────
  {
    slug: "thought-record-sheet",
    weekNumber: 4,
    weekSlug: "week-4",
    lessonNumber: 3,
    estimatedMinutes: 5,
    relatedLessonSlugs: ["challenging-negative-thoughts", "cognitive-restructuring", "worry-time"],
    i18n: {
      de: {
        title: "Gedankenprotokoll",
        eyebrow: "WOCHE 4 · LEKTION 3",
        subtitle: "Ein strukturiertes Werkzeug, um Gedankenmuster zu erkennen und zu ändern.",
        difficulty: "Mittel",
        readingTime: "5 Min. Lesezeit",
        content: [
          {
            heading: "Struktur des Gedankenprotokolls",
            paras: [
              "Ein Gedankenprotokoll hat sechs Spalten:",
              "1. Situation: Wann und wo trat der Gedanke auf?",
              "2. Gedanke: Was genau dachtest du?",
              "3. Emotion: Was fühltest du? (0–100 %)",
              "4. Beweis dafür: Was stützt diesen Gedanken?",
              "5. Beweis dagegen: Was widerspricht diesem Gedanken?",
              "6. Alternativer Gedanke: Was ist eine realistischere Sichtweise?",
            ],
          },
          {
            heading: "Beispiel",
            paras: [
              "Situation: 02:00 Uhr, wach im Bett.",
              'Gedanke: "Ich werde morgen bei der Präsentation scheitern."',
              "Emotion: Angst (85 %)",
              "Beweis dafür: Ich bin müde.",
              "Beweis dagegen: Ich habe die Präsentation vorbereitet. Ich bin nach rauen Nächten früher gut durchgekommen.",
              'Alternativer Gedanke: "Ich werde vielleicht etwas müder sein, aber ich habe mich gut vorbereitet. Ich kann es schaffen."',
            ],
          },
          {
            heading: "Regelmäßigkeit ist wichtig",
            paras: [
              "Fülle das Gedankenprotokoll täglich aus, besonders nach Nächten mit ängstlichen Gedanken. Über Wochen erkennst du Muster — welche Gedanken wiederholen sich, welche Trigger sie auslösen.",
              "Diese Muster sind der Schlüssel zur dauerhaften Veränderung.",
            ],
          },
        ],
        actionStepTitle: "Praktische Aufgabe",
        actionStep:
          "Erstelle ein einfaches Gedankenprotokoll mit sechs Spalten. Fülle es für jeden ängstlichen Gedanken aus, den du diese Woche hast. Am Ende der Woche überprüfe es auf Muster.",
        reflectionTitle: "Reflexion",
        reflection:
          "Welche Muster erkennst du in deinen Gedanken? Gibt es bestimmte Situationen oder Zeiten, die ängstliche Gedanken auslösen? Wie fühlst du dich nach dem Aufschreiben?",
        faqs: [
          {
            q: "Soll ich das Gedankenprotokoll nachts ausfüllen?",
            a: "Nein. Notiere den Gedanken kurz nachts, aber fülle das Protokoll am nächsten Tag aus. Nachts ist das Ziel, nicht zu analysieren.",
          },
          {
            q: "Wie lange brauche ich, bis ich Muster erkenne?",
            a: "Meistens 1–2 Wochen konsequenter Protokollierung. Je mehr Einträge, desto klarer die Muster.",
          },
        ],
        ctaLabel: "Schlaftagebuch öffnen",
        ctaHref: "/diary",
        seoTitle: "Gedankenprotokoll bei CBT-I: Muster erkennen | Somna",
        seoDescription:
          "Lerne, wie du ein strukturiertes Gedankenprotokoll nutzt, um ängstliche Schlafgedanken zu identifizieren und zu ändern.",
        keywords: [
          "Gedankenprotokoll",
          "CBT-I",
          "Gedankenmuster",
          "Schlafangst",
          "kognitive Umstrukturierung",
        ],
      },
    },
  },
];
