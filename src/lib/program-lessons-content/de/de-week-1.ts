// Woche 1 — Schlafgrundlagen (Lektionen 1-3)
// Quelle: native deutsche Version des CBT-I-Programms Somna.
// Konform mit der Nomenklatur der Deutschen Gesellschaft für Schlafforschung und Schlafmedizin (DGSM).
import type { LessonContent } from "../../program-lessons";

export const deWeek1Lessons: LessonContent[] = [
  // ───────────────────────── Lektion 1: Was ist Insomnie? ─────────────────────────
  {
    slug: "what-is-insomnia",
    weekNumber: 1,
    weekSlug: "week-1",
    lessonNumber: 1,
    estimatedMinutes: 6,
    relatedLessonSlugs: [
      "how-sleep-works",
      "trying-harder-makes-sleep-worse",
      "what-is-sleep-efficiency",
    ],
    i18n: {
      de: {
        title: "Was ist Insomnie?",
        eyebrow: "WOCHE 1 · LEKTION 1",
        subtitle:
          "Verstehe die Natur von Insomnie und warum kognitive Verhaltenstherapie der effektivste Weg ist, sie zu überwinden.",
        difficulty: "Einsteiger",
        readingTime: "6 Min. Lesezeit",
        content: [
          {
            heading: "Deutlich mehr als eine schlechte Nacht",
            paras: [
              "Insomnie ist viel mehr als eine einzelne, unruhige Nacht. Es ist eine Erfahrung voller Frustration, in der Körper und Geist scheinbar gegenläufig arbeiten — schwer einschlafen, den Schlaf nicht halten oder morgens erschöpft aufwachen, obwohl genügend Zeit für Erholung investiert wurde.",
              "Wenn dieser Zustand mindestens dreimal pro Woche seit drei Monaten oder länger auftritt und du tagsüber Müdigkeit, Reizbarkeit oder Konzentrationsprobleme verspürst, hast du wahrscheinlich mit chronischer Insomnie zu tun. In deutschen Leitlinien der DGSM bildet dieses klinische Bild die Grundlage für die Diagnose.",
            ],
          },
          {
            heading: "Das 3P-Modell",
            paras: [
              "Um zu verstehen, warum Schlaf zum Problem wurde, nutzen Schlafmediziner und Psychotherapeuten das wissenschaftlich fundierte 3P-Modell:",
              "Prädisponierende Faktoren — deine natürliche Empfindlichkeit: Neigung zu übermäßigem Nachdenken, höhere Reaktivität des Nervensystems oder familiäre Belastung durch Schlafstörungen.",
              "Auslösende Faktoren — die ursprünglichen Trigger: stressige Lebensereignisse, Krankheit, Jobwechsel, Verlust eines nahen Menschen oder plötzliche Änderung des Lebensrhythmus, die ursprünglich den Schlaf störten.",
              "Aufrechterhaltende Faktoren — unbewusste Gewohnheiten und Gedanken, die wir annehmen, um mit schlechtem Schlaf umzugehen: längeres Liegen im Bett, Tagschlaf, Uhr unter dem Kopfkissen, schlechte Assoziationen mit dem Bett. Sie halten die Insomnie lange aufrecht, nachdem das ursprüngliche Problem verschwunden ist.",
            ],
          },
          {
            heading: "Warum kognitive Verhaltenstherapie wirkt",
            paras: [
              "Kognitive Verhaltenstherapie bei Insomnie, kurz CBT-I, unterdrückt Symptome nicht wie eine Schlaftablette. Sie geht an die Wurzel des Problems: sie entfernt aufrechterhaltende Faktoren und baut die gesunde Beziehung zum Schlaf von Grund auf neu. Deshalb wird sie in deutschen und internationalen Leitlinien als erste Wahl empfohlen.",
            ],
          },
        ],
        actionStepTitle: "Praktische Aufgabe",
        actionStep:
          "In dieser Woche beginnen wir mit ruhiger Beobachtung. Lade dir das Somna-Schlaftagebuch herunter oder drucke es aus. Verbringe jeden Morgen zwei Minuten damit, aufzuschreiben: wann das Licht ausging, wie lange das Einschlafen dauerte, ob du nachts aufgewacht bist, wann du aufgestanden bist und wie du den Schlaf auf einer Skala von 1 bis 5 bewertest. Ändere noch nichts — beobachte mit Neugier und Wohlwollen.",
        reflectionTitle: "Reflexion",
        reflection:
          "Durchsuche dein Tagebuch. Welche Muster verbergen sich in deiner Woche? Gibt es Tage, an denen der Geist lauter und der Körper unruhiger ist? Beachte diese Verbindungen ohne Urteil.",
        faqs: [
          {
            q: "Wie unterscheidet man Insomnie von gelegentlichen Schlafproblemen?",
            a: "Gelegentliche unruhige Nächte passieren jedem. Insomnie wird diagnostiziert, wenn Schlafprobleme mindestens 3-mal pro Woche seit mindestens 3 Monaten auftreten und die Tagesqualität deutlich beeinträchtigen.",
          },
          {
            q: "Kann man Insomnie ohne Medikamente besiegen?",
            a: "Ja. Klinische Studien bestätigen, dass CBT-I der Goldstandard in der Behandlung chronischer Insomnie ist. Sie hilft 70–80 % der Menschen, einen natürlichen, anhaltenden Schlafrhythmus wiederzugewinnen.",
          },
        ],
        ctaLabel: "Schlaftagebuch öffnen",
        ctaHref: "/diary",
        seoTitle: "Was ist Insomnie? Das 3P-Modell erklärt | Somna CBT-I",
        seoDescription:
          "Verstehe die Natur von Insomnie durch das wissenschaftliche 3P-Modell und erfahre, warum CBT-I effektiv die aufrechterhaltenden Gewohnheiten entfernt.",
        keywords: [
          "Insomnie",
          "3P-Modell",
          "chronische Insomnie",
          "CBT-I",
          "Insomnie-Behandlung",
        ],
      },
    },
  },

  // ───────────────────────── Lektion 2: Wie funktioniert Schlaf ─────────────────────────
  {
    slug: "how-sleep-works",
    weekNumber: 1,
    weekSlug: "week-1",
    lessonNumber: 2,
    estimatedMinutes: 6,
    relatedLessonSlugs: [
      "what-is-insomnia",
      "trying-harder-makes-sleep-worse",
      "racing-thoughts-at-night",
    ],
    i18n: {
      de: {
        title: "Wie funktioniert Schlaf?",
        eyebrow: "WOCHE 1 · LEKTION 2",
        subtitle: "Innere Rhythmen: Schlafzyklen, biologische Uhr und Schlafdruck.",
        difficulty: "Einsteiger",
        readingTime: "6 Min. Lesezeit",
        content: [
          {
            heading: "Aktiver, präzise organisierter Prozess",
            paras: [
              "Schlaf ist kein passives Abschalten des Bewusstseins. Es ist ein aktiver, mehrschichtiger Prozess, in dem das Gehirn den Körper regeneriert, Erinnerungen ordnet und den emotionalen Ballast des Tages klärt.",
              "Jede Nacht durchläuft das Gehirn Zyklen von etwa 90 Minuten. In jedem Zyklus reisen wir durch zwei Bereiche: NREM-Schlaf (leichter Schlaf in Stadium N1 und N2 sowie Tiefschlaf mit langsamen Wellen in N3, der das Immunsystem und Gewebe regeneriert) und REM-Schlaf (Traumphase, entscheidend für Emotionsverarbeitung und Festigung des Gelernten).",
            ],
          },
          {
            heading: "Zwei innere Kräfte",
            paras: [
              "Schlafzeit wird durch das Zusammenspiel zweier Kräfte reguliert:",
              "Zirkadianer Rhythmus — deine innere biologische Uhr, die auf Licht und Dunkelheit reagiert und tagsüber ein Wachsignal, nachts ein Müdigkeitssignal sendet.",
              "Schlafdruck — die homostatische Schlafkraft, vergleichbar mit einer Sanduhr. Je länger wir aktiv sind, desto größer der Druck, den der Körper während der Nachtruhe \"ablassen\" muss.",
              "Hoher Schlafdruck + nächtliches Signal des zirkadianen Rhythmus = natürlich kommender Schlaf.",
            ],
          },
          {
            heading: "Wenn der Mechanismus übernommen wird",
            paras: [
              "Bei Insomnie wird der natürliche Mechanismus durch Hyperarousal übernommen — einen biologischen und psychischen Wachzustand, der von Angst angetrieben wird. Selbst wenn der Schlafdruck sehr hoch ist, überwältigt das \"Wach\"-Signal des Nervensystems ihn. CBT-I wirkt genau deshalb, weil ihre Techniken den natürlichen Schlafdruck stärken und die innere Uhr neu synchronisieren.",
            ],
          },
        ],
        actionStepTitle: "Praktische Aufgabe",
        actionStep:
          "Wähle eine realistische Aufstehzeit, die zu deinem Leben passt. Stehe die ganze Woche zur gleichen Zeit auf — auch am Wochenende. Tageslichtexposition innerhalb von 30 Minuten nach dem Aufstehen verankert deine biologische Uhr stark.",
        reflectionTitle: "Reflexion",
        reflection:
          "Wie fühlst du dich, wenn du Schlaf als biologisches System betrachtest statt als nächtliche Prüfung, die du ständig nicht bestehst? Erkennst du Momente, in denen tägliche Gewohnheiten deine innere Uhr verwirren könnten?",
        faqs: [
          {
            q: "Braucht jeder genau 8 Stunden Schlaf?",
            a: "Nein, das ist ein starrer Mythos. Der Schlafbedarf ist sehr individuell. Bei Erwachsenen liegt der Durchschnitt meist zwischen 7–9 Stunden, aber manche funktionieren gut mit 6 Stunden, andere brauchen wirklich 9. Konzentriere dich auf Schlafqualität und Regelmäßigkeit statt auf einer willkürlichen Zahl.",
          },
          {
            q: "Warum wache ich regelmäßig mitten in der Nacht auf?",
            a: "Kurze Erwachen zwischen 90-minütigen Schlafzyklen sind völlig natürlich. Gute Schläfer drehen sich um, richten das Kopfkissen und schlafen wieder ein, ohne es zu erinnern. Das Problem liegt nicht im Erwachen, sondern in der Welle von Frustration oder Angst, die die Rückkehr zum Schlaf verhindert.",
          },
        ],
        ctaLabel: "Erkenne deinen Schlafrhythmus",
        ctaHref: "/calculator",
        seoTitle: "Wie funktioniert Schlaf: Zyklen, zirkadianer Rhythmus und Schlafdruck | Somna",
        seoDescription:
          "Verstehe 90-Minuten-Schlafzyklen, zirkadianen Rhythmus und Schlafdruck — und wie CBT-I ihr natürliches Gleichgewicht wiederherstellt.",
        keywords: ["wie funktioniert Schlaf", "Schlafzyklen", "zirkadianer Rhythmus", "Schlafdruck", "NREM REM"],
      },
    },
  },

  // ───────────────────────── Lektion 3: Warum mehr Anstrengung den Schlaf verschlechtert ─────────────────────────
  {
    slug: "trying-harder-makes-sleep-worse",
    weekNumber: 1,
    weekSlug: "week-1",
    lessonNumber: 3,
    estimatedMinutes: 5,
    relatedLessonSlugs: ["what-is-insomnia", "how-sleep-works", "bed-sleep-association"],
    i18n: {
      de: {
        title: "Warum mehr Anstrengung den Schlaf verschlechtert",
        eyebrow: "WOCHE 1 · LEKTION 3",
        subtitle: "Das Paradoxon der Anstrengung gegenüber Schlaf und der Weg aus dieser Falle.",
        difficulty: "Einsteiger",
        readingTime: "5 Min. Lesezeit",
        content: [
          {
            heading: "Das Paradoxon der Anstrengung",
            paras: [
              "Eine der tiefsten Wahrheiten der Schlafwissenschaft ist das Paradoxon: je mehr du versuchst zu schlafen, desto mehr weicht der Schlaf aus. Es ist eine psychologische Falle bekannt als schlafbezogene Leistungsangst.",
              "Wenn Erholung unerreichbar wird, ist dein erster Impuls, um sie zu kämpfen. Du kannst dich außergewöhnlich früh ins Bett legen, um Schlaf zu \"fangen\", regungslos liegen und die Augenlider zum Schließen zwingen oder dem Gehirn befehlen, \"aufzuhören zu denken\".",
              "Schlaf ist jedoch eine biologische Funktion, die durch Hingabe gesteuert wird, nicht durch Anstrengung. In dem Moment, in dem du Schlaf als zu erreichendes Ziel behandelst, betrachtet das Gehirn dies als hochriskante Aufgabe. Es beginnt, Cortisol und Adrenalin freizusetzen und einen Hyperarousal-Zustand auszulösen.",
            ],
          },
          {
            heading: "Die schmerzhafte Schleife",
            paras: [
              "Es entsteht eine schmerzhafte Schleife: Schlafprobleme → mehr Anstrengung → Aktivierung des Nervensystems → Schlaf wird unmöglich.",
              "Mit der Zeit lernt das Gehirn, dass das Bett kein Heiligtum der Erholung, sondern eine Zone der Frustration und Bedrohung ist. CBT-I unterbricht diese Konditionierung, indem sie den Druck der Anstrengung entfernt. Wir lehren dich, aufzuhören, Schlaf zu erzwingen, und stattdessen sanfte, freundliche Bedingungen zu schaffen, in denen Schlaf von selbst kommen kann.",
            ],
          },
        ],
        actionStepTitle: "Praktische Aufgabe",
        actionStep:
          "In dieser Woche üben wir die Kunst des Loslassens. Wenn du mit weit geöffneten Augen im Bett liegst und die Frustration wächst, bleib nicht dort im Kampf. Verlasse das Bett sanft, geh in einen gedimmten Raum und tu etwas Ruhiges — lies ein fesselndes Buch, höre einen Ambient-Podcast oder skizziere etwas auf einem Blatt. Kehre erst ins Bett zurück, wenn die Augenlider schwer werden und echte Müdigkeit dich überflutet.",
        reflectionTitle: "Reflexion",
        reflection:
          "Kannst du konkrete Wege nennen, wie du zuletzt \"an Schlaf gearbeitet\" hast? Wie wäre es, wenn du heute Abend vollständig auf die Rolle der Person verzichtest, die sich zur Erholung zwingt?",
        faqs: [
          {
            q: "Wenn ich aufstehe, wenn ich nicht schlafen kann, verliere ich nicht noch mehr Schlaf?",
            a: "Kurzfristig kannst du weniger Zeit im Bett verbringen. Langfristig verstärkt das Liegen mit Frustration jedoch nur das Gehirn-Assoziation zwischen Bett und Wachsein. Das Verlassen des Bettes ist eine Investition in dauerhaftes Brechen dieser Barriere.",
          },
          {
            q: "Was tun, wenn ich nicht aufhören kann, vor dem Schlaf an Angst zu denken?",
            a: "Genau hier hilft kognitive Umstrukturierung. Statt Gedanken zum Schweigen zu zwingen, lernen wir, die Perspektive ihnen gegenüber zu ändern und ihnen die emotionale Macht zu nehmen, die den Körper im Wachzustand hält.",
          },
        ],
        ctaLabel: "Zur nächsten Lektion",
        ctaHref: "/program/week-2/bed-sleep-association",
        seoTitle: "Warum mehr Anstrengung den Schlaf verschlechtert | Somna CBT-I",
        seoDescription:
          "Entdecke das Paradoxon der schlafbezogenen Leistungsangst — warum Schlaf erzwingen rückwärts wirkt — und wie CBT-I hilft, aus der Anstrengungsschleife auszubrechen.",
        keywords: [
          "Schlaf Leistungsangst",
          "Schlaf erzwingen",
          "Anstrengungsparadoxon Schlaf",
          "CBT-I Schlaf",
          "kann nicht einschlafen",
        ],
      },
    },
  },
];
