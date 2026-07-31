/**
 * Deutsch (de-DE) — natives „Basiswissen"-Wörterbuch für somna.help
 *
 * SEO-Keyword-Quellen (DACH-Suchverhalten, nicht EN-Übersetzung):
 * - „Schlaf verbessern", „Einschlafstörungen", „Schlafrhythmus", „Schlaftagebuch"
 * - „CBT-I" / „kognitive Verhaltenstherapie bei Insomnie" (Fachstandard DE)
 * - „Schlafhygiene", „Schlafeffizienz", „Schlafrestriktion"
 */

import type { LearnDict, LearnSlug } from "./learn-i18n";

const deTitles: Record<LearnSlug, string> = {
  "what-is-cbti": "Was ist CBT-I wirklich?",
  "90-minute-sleep-cycle": "Der 90-Minuten-Schlafzyklus",
  "4-7-8-breathing": "Die 4-7-8-Atmung erklärt",
  "racing-thoughts-at-night": "Wenn der Kopf nicht zur Ruhe kommt",
  "circadian-rhythm": "Licht, Koffein und deine innere Uhr",
  "stimulus-control": "Stimuluskontrolle in einfachen Worten",
};

const deSummaries: Record<LearnSlug, string> = {
  "what-is-cbti": "Ein einsteigerfreundliches Intro zu CBT-I und warum es langfristig wirkt.",
  "90-minute-sleep-cycle": "Wie Schlafzyklen dein Erholungsgefühl formen.",
  "4-7-8-breathing": "Ein einfaches Atemmuster, das das Nervensystem beruhigt.",
  "racing-thoughts-at-night": "Warum Gedanken nachts laut werden — und was CBT-I dagegen tut.",
  "circadian-rhythm": "Wie Licht und Koffein leise deine innere Uhr steuern.",
  "stimulus-control": "Die Bett-Schlaf-Verbindung wieder aufbauen, Nacht für Nacht.",
};

const deUi: LearnDict["ui"] = {
  learn: "Wissen",
  quickLessons: "Schnelle Lektionen",
  cbtiGuides: "CBT-I-Leitfäden",
  readBadge: "5 Min. Lesezeit",
  takeawaysTitle: "Die wichtigsten Punkte",
  scienceNoteTitle: "Wissenschaftshinweis",
  practicalTipTitle: "Probiere es heute Abend",
  relatedToolTitle: "Probiere ein verwandtes Tool",
  relatedGuideTitle: "Gehe tiefer",
  relatedGuideCta: "Lies den vollständigen Leitfaden",
  nextLessonTitle: "Als Nächstes",
  nextLessonCta: "Weiterlernen",
  hubTitle: "Wissen",
  hubSub: "Eine Bibliothek mit langen CBT-I-Leitfäden und kurzen, evidenzbasierten Lektionen.",
  hubQuickLessonsLabel: "Schnelle Lektionen",
  hubGuidesLabel: "CBT-I-Leitfäden",
  minRead: "Min. Lesezeit",
};

const deLessons: LearnDict["lessons"] = {
  "what-is-cbti": {
    meta: {
      title: "Was ist CBT-I wirklich? | Somna",
      desc: "Eine einsteigerfreundliche Erklärung der kognitiven Verhaltenstherapie bei Insomnie (CBT-I) und warum sie als die effektivste langfristige Insomniebehandlung gilt.",
    },
    eyebrow: "SCHNELLE LEKTION",
    title: "Was ist CBT-I wirklich?",
    subtitle:
      "Kognitive Verhaltenstherapie bei Insomnie ist keine Schlaftablette — es ist ein strukturierter Weg, um das Gehirn neu zu trainieren, wie es sich zum Schlaf verhält.",
    readingTime: "5",
    keyTakeaways: [
      "CBT-I ist kein Medikament — es verändert Verhaltensweisen und Gedanken um den Schlaf.",
      "Es wird von Schlafspezialisten weltweit als Erstlinienbehandlung für chronische Insomnie empfohlen.",
      "Die Ergebnisse halten oft viel länger an als bei Schlaftabletten.",
      "Die meisten Menschen sehen innerhalb von 4–8 Wochen eine spürbare Verbesserung.",
    ],
    sections: [
      {
        heading: "Was bedeutet CBT-I?",
        paras: [
          "CBT-I steht für Cognitive Behavioral Therapy for Insomnia, also kognitive Verhaltenstherapie bei Insomnie. Es ist ein strukturiertes, zeitlich begrenztes Programm, das die spezifischen Gedanken und Verhaltensweisen anspricht, die Insomnie aufrechterhalten.",
          "Im Gegensatz zu Schlaftabletten sediert CBT-I dich nicht. Stattdessen lehrt es deinem Gehirn und Körper, wie sie ihren natürlichen Schlafrhythmus wiedererlangen — sanft und ohne Nebenwirkungen.",
        ],
      },
      {
        heading: "Warum Schlafprobleme erlernt werden",
        paras: [
          "Ein paar stressige Nächte sind normal. Sie werden chronisch, wenn das Gehirn beginnt, das Bett mit Frustration oder Wachsein statt mit Ruhe zu verknüpfen.",
          "Über Wochen oder Monate verstärkt sich diese Verknüpfung. Dein Nervensystem lernt: 'Schlafenszeit = wach bleiben.' CBT-I wirkt, weil es dieses Lernen direkt adressiert.",
        ],
      },
      {
        heading: "Die fünf Kernkomponenten",
        paras: [
          "CBT-I kombiniert fünf evidenzbasierte Werkzeuge: Schlafrestriktion (Komprimierung der Bettzeit, um Schlafdruck wieder aufzubauen), Stimuluskontrolle (Wiederverknüpfung des Bettes mit Schlaf), kognitive Umstrukturierung (Abschwächung ängstlicher Gedanken), Schlafhygiene (kleine Umweltveränderungen) und Entspannungstraining.",
          "Zusammen eingesetzt greifen sie den Insomnie-Kreislauf aus mehreren Winkeln gleichzeitig an.",
        ],
      },
      {
        heading: "Warum CBT-I langfristig wirkt",
        paras: [
          "Medikamente können Symptome maskieren, während du sie nimmst. CBT-I verändert die zugrundeliegenden Muster, sodass die Verbesserungen nach dem Programmende anhalten.",
          "Folgestudien zeigen Vorteile, die ein bis drei Jahre später anhalten — was ungewöhnlich für jede Insomniebehandlung ist.",
        ],
      },
      {
        heading: "Wer kann von CBT-I profitieren?",
        paras: [
          "Die meisten Erwachsenen mit chronischer Insomnie reagieren gut, einschließlich älterer Erwachsener und Menschen, die seit Jahren kämpfen. CBT-I ist auch wirksam neben der Behandlung von Angst oder Depression.",
          "Wenn du unbehandelte Schlafapnoe, unruhige Beine oder eine andere Schlafstörung hast, sprich zuerst mit einem Kliniker, damit CBT-I sicher angepasst werden kann.",
        ],
      },
    ],
    scienceNote:
      "Große Schlafmedizin-Organisationen — einschließlich der American Academy of Sleep Medicine und des American College of Physicians — empfehlen CBT-I als Erstlinienbehandlung für chronische Insomnie bei Erwachsenen.",
    practicalTip:
      "Benutze heute Abend dein Bett nur für Schlaf und Intimität — kein Scrollen, keine Arbeit, keine Sorgen. Diese einzelne Regel ist das Herz der Stimuluskontrolle.",
    cta: { label: "Lies den vollständigen CBT-I-Leitfaden", to: "/cbt-i-guide" },
    relatedGuide: { slug: "cbt-i-guide" },
    relatedTool: {
      to: "/calculator",
      label: "Schlafzyklus-Rechner",
      desc: "Plane um natürliche 90-Minuten-Zyklen.",
    },
    faqs: [
      {
        q: "Ist CBT-I eine Art Medikament?",
        a: "Nein. CBT-I ist ein verhaltens- und kognitives Programm. Es nutzt strukturierte Techniken, keine Medikamente, um die Ursachen von Insomnie anzugehen.",
      },
      {
        q: "Wie lange dauert es, bis CBT-I wirkt?",
        a: "Die meisten Menschen bemerken einige Veränderung innerhalb von 1–2 Wochen und eine spürbare Verbesserung innerhalb von 4–8 Wochen konsequenter Praxis.",
      },
      {
        q: "Ist CBT-I besser als Schlaftabletten?",
        a: "Bei chronischer Insomnie ja — bei der Langzeit-Nachbeobachtung. Tabletten können kurzfristig helfen, aber die Gewinne halten selten nach dem Absetzen an.",
      },
      {
        q: "Brauche ich einen Therapeuten für CBT-I?",
        a: "Ein geschulter Kliniker bringt die stärksten Ergebnisse, aber selbstgeleitete und digitale CBT-I-Programme sind ebenfalls evidenzbasiert und wirksam.",
      },
      {
        q: "Hilft CBT-I, wenn ich seit Jahren Insomnie habe?",
        a: "Ja. Selbst langjährige Insomnie reagiert gut, weil CBT-I die Muster anspricht, die sie derzeit aufrechterhalten, nicht nur den ursprünglichen Auslöser.",
      },
      {
        q: "Gibt es Nebenwirkungen?",
        a: "Die Haupt-'Nebenwirkung' ist temporäre Müdigkeit während der Schlafrestriktion in Woche 1–2. Es gibt keine medikamentenbezogenen Risiken.",
      },
      {
        q: "Kann ich CBT-I machen, während ich Schlaftabletten nehme?",
        a: "Oft ja, unter Anleitung eines Klinikers. Viele Menschen reduzieren Medikamente während oder nach CBT-I schrittweise.",
      },
    ],
    nextLesson: "stimulus-control",
  },
  "90-minute-sleep-cycle": {
    meta: {
      title: "Der 90-Minuten-Schlafzyklus | Somna",
      desc: "Verstehe, wie Schlafzyklen funktionieren und warum das Aufwachen zur richtigen Zeit dein Erholungsgefühl verbessern kann.",
    },
    eyebrow: "SCHNELLE LEKTION",
    title: "Der 90-Minuten-Schlafzyklus",
    subtitle:
      "Schlaf passiert nicht in einem langen Block — er bewegt sich in wiederholenden Zyklen, von denen jeder formt, wie du dich morgens fühlst.",
    readingTime: "5",
    keyTakeaways: [
      "Schlaf erfolgt in wiederholenden Zyklen, nicht als ein einziger flacher Zustand.",
      "Ein Zyklus dauert im Durchschnitt etwa 90 Minuten.",
      "Tiefschlaf und REM erfüllen sehr unterschiedliche Zwecke.",
      "Timing ist wichtig: Aufwachen zwischen Zyklen fühlt sich meist leichter an.",
    ],
    sections: [
      {
        heading: "Was passiert während des Schlafes?",
        paras: [
          "Schlaf ist kein einzelner Zustand. Dein Gehirn durchläuft verschiedene Stadien, jedes mit seinem eigenen Muster von Gehirnwellen, Herzfrequenz und Muskeltonus.",
          "Diese Zyklen wiederholen sich über die Nacht hinweg und verschieben sich sanft von tieferem, regenerativem Schlaf am Anfang zu längeren REM-Phasen gegen Morgen.",
        ],
      },
      {
        heading: "Die vier Schlafstadien",
        paras: [
          "Stadium 1 ist ein kurzer, leichter Eintritt in den Schlaf. Stadium 2 ist etwas tiefer und dort verbringen wir den Großteil der Nacht. Stadium 3 ist tiefer, langsamer Schlaf — wichtig für körperliche Erholung. REM (Rapid Eye Movement) ist, wo die meisten lebhaften Träume stattfinden und wichtig für Gedächtnis und emotionale Verarbeitung sind.",
          "Jeder Zyklus bewegt sich durch diese Stadien in ungefähr derselben Reihenfolge.",
        ],
      },
      {
        heading: "Warum 90 Minuten wichtig ist",
        paras: [
          "Im Durchschnitt dauert ein vollständiger Schlafzyklus etwa 90 Minuten. Aufwachen am Ende eines Zyklus — statt mitten im Tiefschlaf — fühlt sich meist leichter und klarer an.",
          "Deshalb schlagen Schlaf-Rechner oft Optionen vor, die 90 Minuten auseinander liegen.",
        ],
      },
      {
        heading: "Warum du dich manchmal benommen fühlst",
        paras: [
          "Wenn dein Wecker Tiefschlaf unterbricht, kannst du verwirrt oder schwerköpfig aufwachen. Dieser Nebel wird 'Schlafträgheit' genannt und kann 15–30 Minuten dauern.",
          "Anpassen deiner Schlafenszeit um sogar nur 15–30 Minuten kann deine Aufstehzeit an einem freundlicheren Punkt im Zyklus landen lassen.",
        ],
      },
      {
        heading: "Wie Schlaf-Rechner Schlafzyklen nutzen",
        paras: [
          "Ein Schlafzyklus-Rechner arbeitet rückwärts von deiner gewünschten Aufstehzeit, subtrahiert vollständige 90-Minuten-Zyklen und einen kurzen Puffer zum Einschlafen.",
          "Es ist eine Richtlinie, keine Garantie — aber für viele Menschen ist es ein hilfreicher Ausgangspunkt für stabilere Morgen.",
        ],
      },
    ],
    scienceNote:
      "Die Schlafzyklus-Länge ist ein Durchschnitt — echte Zyklen variieren von etwa 70 bis 120 Minuten und ändern sich über die Nacht und zwischen Individuen.",
    practicalTip:
      "Ziel auf fünf oder sechs vollständige Zyklen, wenn du kannst. Für die meisten Erwachsenen sind das 7,5–9 Stunden Schlaf — gut im wissenschaftlich unterstützten Bereich.",
    cta: { label: "Benutze den Schlafzyklus-Rechner", to: "/calculator" },
    relatedGuide: { slug: "how-to-fall-asleep-fast" },
    relatedTool: {
      to: "/calculator",
      label: "Schlafzyklus-Rechner",
      desc: "Plane Schlafenszeit um volle Zyklen.",
    },
    faqs: [
      {
        q: "Ist jeder Schlafzyklus genau 90 Minuten?",
        a: "Nein — 90 Minuten ist ein Durchschnitt. Zyklen variieren ungefähr von 70–120 Minuten und ändern sich über die Nacht und zwischen Menschen.",
      },
      {
        q: "Wie viele Zyklen sollte ich anstreben?",
        a: "Die meisten Erwachsenen fühlen sich am besten mit 5–6 Zyklen pro Nacht, das sind etwa 7,5–9 Stunden Schlaf.",
      },
      {
        q: "Warum wache ich manchmal benommen auf, trotz genug Schlaf?",
        a: "Du bist vielleicht im Tiefschlaf aufgewacht. Anpassen der Schlafenszeit um 15–30 Minuten kann deine Aufstehzeit sanfter machen.",
      },
      {
        q: "Ist Tiefschlaf wichtiger als REM?",
        a: "Beide sind wichtig. Tiefschlaf unterstützt körperliche Erholung; REM unterstützt Gedächtnis und emotionale Regulation. Eine gesunde Nacht umfasst beide.",
      },
      {
        q: "Kann ich meine Schlafzyklen verfolgen?",
        a: "Verbraucher-Wearables schätzen Stadien, sind aber nicht medizinisch präzise. Muster über Wochen sind aussagekräftiger als jede einzelne Nacht.",
      },
      {
        q: "Warum ändern sich Zyklen über die Nacht?",
        a: "Frühe Zyklen enthalten mehr Tiefschlaf; spätere Zyklen enthalten mehr REM. Beide Nachthälften sind wichtig.",
      },
      {
        q: "Nutzen Nickerchen auch Schlafzyklen?",
        a: "Ja. Ein 90-Minuten-Nickerchen kann einen vollständigen Zyklus umfassen, während ein 20-Minuten-Nickerchen in leichteren Stadien bleibt und Benommenheit vermeidet.",
      },
    ],
    nextLesson: "4-7-8-breathing",
  },
  "4-7-8-breathing": {
    meta: {
      title: "Die 4-7-8-Atmung erklärt | Somna",
      desc: "Erfahre, wie die 4-7-8-Atmungsmethode helfen kann, physiologische Erregung vor dem Schlafengehen zu reduzieren.",
    },
    eyebrow: "SCHNELLE LEKTION",
    title: "Die 4-7-8-Atmung erklärt",
    subtitle:
      "Ein einfaches Atemmuster, das physiologische Erregung sanft senkt — ein praktisches Abendritual, gestützt durch grundlegende Physiologie.",
    readingTime: "5",
    keyTakeaways: [
      "Langsames Atmen beeinflusst das autonome Nervensystem.",
      "Lange, sanfte Ausatmungen fördern eine Entspannungsreaktion.",
      "Beständigkeit ist wichtiger als Intensität.",
      "Es funktioniert am besten als Teil einer breiteren Abendroutine.",
    ],
    sections: [
      {
        heading: "Was ist 4-7-8-Atmung?",
        paras: [
          "4-7-8-Atmung ist ein strukturiertes Atemmuster: 4 Sekunden durch die Nase einatmen, 7 Sekunden halten, 8 Sekunden langsam durch den Mund ausatmen.",
          "Es wurde als Beruhigungstechnik populär, aber seine Wirkung wurzelt in etwas Älterem — dem Einfluss langsamen Atmens auf die Stressreaktion des Körpers.",
        ],
      },
      {
        heading: "Wie man es praktiziert",
        paras: [
          "Setz oder leg dich bequem hin. Platziere die Zungenspitze hinter deine oberen Frontzähne. Atme vollständig durch den Mund aus.",
          "Atme ruhig durch die Nase für 4 Sekunden ein. Halte den Atem für 7. Atme durch leicht geöffnete Lippen für 8 aus. Wiederhole für 4 Zyklen. Baue langsam auf — es kann sich anfangs intensiv anfühlen.",
        ],
      },
      {
        heading: "Warum es sich beruhigend anfühlen kann",
        paras: [
          "Lange Ausatmungen aktivieren den parasympathischen Zweig des Nervensystems, der die Herzfrequenz verlangsamt und Stresssignale abschwächt.",
          "Das Zählen beschäftigt den Geist auch sanft und lenkt die Aufmerksamkeit von rasenden Gedanken ab.",
        ],
      },
      {
        heading: "Häufige Fehler",
        paras: [
          "Zu hartes Atmen, zu festes Halten oder zu viele Zyklen auf einmal können sich unangenehm anfühlen.",
          "Wenn du dich schwindelig oder leicht fühlst, kehre zum natürlichen Atmen zurück. Das Ziel ist Ruhe, nicht Anstrengung.",
        ],
      },
      {
        heading: "Wie man es in die Nachtroutine einbaut",
        paras: [
          "Verbinde die Technik mit einem anderen Hinweis — Lichter dimmen, Gesicht waschen, ins Bett gehen — damit sie zum automatischen Signal wird, dass der Tag zu Ende geht.",
          "Die meisten Menschen sehen den größten Nutzen nach ein bis zwei Wochen konsequenter Praxis.",
        ],
      },
    ],
    scienceNote:
      "Langsames, getaktetes Atmen wurde in Studien gezeigt, Herzfrequenz, Blutdruck und selbstberichteten Stress bei gesunden Erwachsenen zu reduzieren.",
    practicalTip:
      "Versuche heute Abend nur 2–4 Zyklen der 4-7-8-Atmung direkt vor dem Lichtauslöschen. Du jagst nicht dem Schlaf hinterher — du signalisierst Sicherheit.",
    cta: { label: "Wie man schnell einschläft", to: "/how-to-fall-asleep-fast" },
    relatedGuide: { slug: "how-to-fall-asleep-fast" },
    relatedTool: {
      to: "/relax",
      label: "Geführte 4-7-8-Sitzung",
      desc: "Praktiziere mit einem ruhigen visuellen Hinweis.",
    },
    faqs: [
      {
        q: "Lässt dich 4-7-8-Atmung einschlafen?",
        a: "Nicht direkt. Es reduziert Erregung und unterstützt das Einschlafen, ist aber kein Sedativum.",
      },
      {
        q: "Wie viele Zyklen sollte ich machen?",
        a: "Beginne mit 4 Zyklen. Einige Praktizierende bauen über Wochen auf. Mehr ist nicht immer besser.",
      },
      {
        q: "Ist es für jeden sicher?",
        a: "Es gilt als sicher für gesunde Erwachsene. Wenn du Lungenprobleme, niedrigen Blutdruck hast oder dich schwindelig fühlst, atme stattdessen natürlich.",
      },
      {
        q: "Können Kinder es praktizieren?",
        a: "Eine einfachere Version (kürzere Haltezeiten) kann für ältere Kinder funktionieren, aber überprüfe zuerst mit einem Kinderarzt.",
      },
      {
        q: "Warum ausatmen länger als einatmen?",
        a: "Lange Ausatmungen aktivieren den parasympathischen 'Ruhe und Verdauung'-Zweig des Nervensystems.",
      },
      {
        q: "Was, wenn das Zählen mich ängstiger macht?",
        a: "Überspringe die Zählung. Atme einfach langsam durch die Nase mit einem langen, sanften Ausatmen. Das Muster ist wichtiger als die Zahlen.",
      },
      {
        q: "Wie oft sollte ich praktizieren?",
        a: "Täglich ist ideal — sogar außerhalb der Schlafenszeit — um die Reaktion zu trainieren. Die meisten Menschen bemerken Vorteile innerhalb von 1–2 Wochen.",
      },
    ],
    nextLesson: "racing-thoughts-at-night",
  },
  "racing-thoughts-at-night": {
    meta: {
      title: "Wenn der Kopf nicht zur Ruhe kommt | Somna",
      desc: "Verstehe, warum Gedanken nachts lauter werden und wie CBT-I rasende Gedanken angeht.",
    },
    eyebrow: "SCHNELLE LEKTION",
    title: "Wenn der Kopf nicht zur Ruhe kommt",
    subtitle:
      "Rasende Gedanken vor dem Schlafengehen sind kein Charzelfehler — sie sind ein vorhersehbares Merkmal eines erregten Nervensystems. CBT-I hat praktische Werkzeuge dafür.",
    readingTime: "5",
    keyTakeaways: [
      "Rasende Gedanken nachts sind häufig, nicht ungewöhnlich.",
      "Hypererregung — körperlich und mental — spielt eine große Rolle.",
      "Versuchen, Gedanken zu unterdrücken, schlägt meist zurück.",
      "CBT-I bietet spezifische Werkzeuge, die besser funktionieren als 'einfach entspannen'.",
    ],
    sections: [
      {
        heading: "Warum sich Gedanken nachts lauter anfühlen",
        paras: [
          "Tagsüber wird deine Aufmerksamkeit nach außen durch Aufgaben, Gespräche und Bewegung gezogen. Nachts lassen diese Ablenkungen nach und innere Gedanken haben die Bühne nur für sich.",
          "Wenn du auch müde bist und dein präfrontaler Kortex (der ruhige Planer) weniger aktiv ist, können sich Sorgen dringender anfühlen, als sie wirklich sind.",
        ],
      },
      {
        heading: "Das Hypererregungs-Modell",
        paras: [
          "Forscher beschreiben chronische Insomnie als Zustand von Hypererregung — Körper und Geist bleiben zu aktiv für Schlaf, um übernehmen zu können.",
          "Stresshormone, schnelles Herz und ein beschäftigter Geist verstärken sich gegenseitig. Sobald dieser Kreislauf beginnt, reicht der gewöhnliche Rat 'versuch zu entspannen' oft nicht aus.",
        ],
      },
      {
        heading: "Warum Versuchen, nicht zu denken, nicht funktioniert",
        paras: [
          "Dir selbst zu sagen 'hör auf zu denken' macht Gedanken meist lauter. Das ist der 'weiße Bär'-Effekt: je mehr du versuchst, etwas zu unterdrücken, desto mehr kehrt es zurück.",
          "CBT-I verschiebt das Ziel — statt Gedanken zu stoppen, lernst du, sie vorbeiziehen zu lassen, ohne dich darauf einzulassen.",
        ],
      },
      {
        heading: "Hilfreiche CBT-I-Strategien",
        paras: [
          "Nutze ein tageszeitliches 'Sorgenfenster': verbringe 10 Minuten früher am Abend damit, Sorgen und mögliche nächste Schritte aufzuschreiben. Schließe das Notizbuch, wenn die Zeit um ist.",
          "Wenn du 20 Minuten im Bett kreiselst, steh auf. Setz dich irgendwo bei gedimmtem Licht. Lies etwas Sanftes. Kehre nur zurück, wenn du müde bist. Das ist Stimuluskontrolle — das stärkste Werkzeug im CBT-I-Werkzeugkasten.",
        ],
      },
      {
        heading: "Wann professionelle Hilfe suchen",
        paras: [
          "Wenn rasende Gedanken mit anhaltend gedrückter Stimmung, Tagespanik oder erheblicher täglicher Beeinträchtigung einhergehen, bitte um Unterstützung.",
          "Angst und Insomnie gehen oft zusammen und reagieren gut auf koordinierte Behandlung.",
        ],
      },
    ],
    scienceNote:
      "Insomnie wird zunehmend als Störung von Hypererregung verstanden — sowohl kognitiv (mental) als auch physiologisch (körperlich).",
    practicalTip:
      "Schreibe heute Abend deine Aufgabenliste für morgen auf, bevor du dir die Zähne putzt. Das Externalisieren von morgigem Load sagt deinem Gehirn, dass es nicht im Bett üben muss.",
    cta: { label: "Lies den Schlafangst-Leitfaden", to: "/sleep-anxiety" },
    relatedGuide: { slug: "sleep-anxiety" },
    relatedTool: {
      to: "/relax",
      label: "Entspannungs-Atmung",
      desc: "Beruhige den Körper, um den Geist zu beruhigen.",
    },
    faqs: [
      {
        q: "Warum treffen rasende Gedanken immer vor dem Schlafengehen ein?",
        a: "Ohne tageszeitliche Ablenkungen haben innere Gedanken nichts, womit sie konkurrieren können. Ein müder präfrontaler Kortex lässt Sorgen auch dringender wirken.",
      },
      {
        q: "Sollte ich versuchen, Gedanken wegzudrücken?",
        a: "Nein — das verstärkt sie meist. Das Ziel ist, Gedanken zu bemerken und sie vorbeiziehen zu lassen, wie Wolken am Himmel.",
      },
      {
        q: "Hilft Journaling wirklich?",
        a: "Ja, besonders wenn es früher am Abend gemacht wird. Ein 'Sorgenfenster' externalisiert Sorgen, damit sie nicht im Bett hochkommen.",
      },
      {
        q: "Sind rasende Gedanken dasselbe wie Angst?",
        a: "Sie überlappen stark. Wenn Gedanken mit anhaltender Sorge, gedrückter Stimmung oder Panik einhergehen, erwäge, mit einem Kliniker zu sprechen.",
      },
      {
        q: "Kann Meditation helfen?",
        a: "Für viele Menschen ja — besonders achtsamkeitsbasierte Ansätze, die sich darauf konzentrieren, Gedanken zu bemerken, ohne sich darauf einzulassen.",
      },
      {
        q: "Was ist mit Podcast-Hören im Bett?",
        a: "Gemischte Evidenz. Leichtes Audio hilft einigen Menschen, während einengende Inhalte den Geist zu aktiv halten.",
      },
      {
        q: "Bedeuten rasende Gedanken, dass ich Insomnie habe?",
        a: "Nicht allein. Insomnie ist definiert durch Schlafprobleme, die mindestens 3 Nächte pro Woche seit 3+ Monaten auftreten und das Tagesfunktionieren beeinträchtigen.",
      },
    ],
    nextLesson: "circadian-rhythm",
  },
  "circadian-rhythm": {
    meta: {
      title: "Licht, Koffein und deine innere Uhr | Somna",
      desc: "Erfahre, wie Lichtexposition und Koffein den zirkadianen Rhythmus und das Schlaf-Timing beeinflussen.",
    },
    eyebrow: "SCHNELLE LEKTION",
    title: "Licht, Koffein und deine innere Uhr",
    subtitle:
      "Dein Körper hat eine innere 24-Stunden-Uhr. Licht und Koffein sind zwei der stärksten Signale, die formen, wann Schlaf leicht kommt.",
    readingTime: "5",
    keyTakeaways: [
      "Zirkadianer Rhythmus reguliert, wann du dich müde und wach fühlst.",
      "Morgenslicht stärkt und stabilisiert die Körperuhr.",
      "Abendlicht kann den Einschlaf verzögern.",
      "Koffein kann Schlaf viele Stunden nach dem letzten Schluck beeinflussen.",
    ],
    sections: [
      {
        heading: "Was ist zirkadianer Rhythmus?",
        paras: [
          "Dein zirkadianer Rhythmus ist ein ungefähr 24-stündiger innerer Zyklus, der Schlaf, Wachheit, Hormone, Körpertemperatur und mehr regiert.",
          "Er läuft, ob du darauf achtest oder nicht — aber externe Signale, besonders Licht, halten ihn mit der Welt im Einklang.",
        ],
      },
      {
        heading: "Morgenslicht und Schlaf-Timing",
        paras: [
          "Helles Licht in der ersten oder zweiten Stunde nach dem Aufwachen sendet ein klares 'Tag'-Signal an dein Gehirn. Das verankert deine Uhr und macht es einfacher, die folgende Nacht einzuschlafen.",
          "Außenlicht, sogar an einem bewölkten Tag, ist viel heller als Innenbeleuchtung — und ein kurzer Spaziergang draußen ist eine der einfachsten Schlaf-Upgrades.",
        ],
      },
      {
        heading: "Abendlicht-Exposition",
        paras: [
          "Helles Licht spät abends — einschließlich von Bildschirmen — kann Melatonin unterdrücken und deine Körperuhr später verschieben.",
          "Dimme Lichter für die letzten 60–90 Minuten vor dem Schlafengehen und dein Nervensystem erhält die Nachricht, dass die Nacht begonnen hat.",
        ],
      },
      {
        heading: "Wie Koffein Schlaf beeinflusst",
        paras: [
          "Koffein blockiert Adenosin, das Molekül, das 'Schlafdruck' über den Tag aufbaut. Es hat eine Halbwertszeit von ungefähr 5 Stunden, was bedeutet, dass ein 14-Uhr-Kaffee noch zur Schlafenszeit in deinem System sein kann.",
          "Selbst wenn du einschlafen kannst, kann Abendkoffein Tiefschlaf reduzieren — also wachst du weniger erholt auf, ohne zu wissen warum.",
        ],
      },
      {
        heading: "Bessere Timing-Gewohnheiten aufbauen",
        paras: [
          "Ziel auf eine konstante Aufstehzeit, tägliches Morgenslicht und einen Koffein-Cutoff am frühen Nachmittag. Diese drei kleinen Verschiebungen können verändern, wie sich die gesamte Woche anfühlt.",
          "Beständigkeit ist wichtiger als Perfektion. Kleine, nachhaltige Änderungen übertreffen dramatische Überholungen.",
        ],
      },
    ],
    scienceNote:
      "Licht ist unter den stärksten Signalen, die den zirkadianen Taktgeber formen — besonders helles Licht morgens und gedimmte Bedingungen abends.",
    practicalTip:
      "Hol dir Tageslicht innerhalb einer Stunde nach dem Aufwachen — sogar ein 5–10-minütiger Spaziergang zählt. Und setze dir eine persönliche 'kein Koffein nach 14 Uhr'-Regel für zwei Wochen, um zu sehen, wie deine Nächte reagieren.",
    cta: { label: "Benutze den Schlafenszeit-Rechner", to: "/bedtime-calculator" },
    relatedGuide: { slug: "how-to-fall-asleep-fast" },
    relatedTool: {
      to: "/bedtime-calculator",
      label: "Schlafenszeit-Rechner",
      desc: "Finde die beste Zeit, ins Bett zu gehen.",
    },
    faqs: [
      {
        q: "Wie lange bleibt Koffein im System?",
        a: "Koffein hat eine Halbwertszeit von etwa 5 Stunden, also ist die Hälfte eines 14-Uhr-Kaffees noch um 19 Uhr aktiv und ein Viertel um Mitternacht.",
      },
      {
        q: "Macht Morgenslicht wirklich einen Unterschied?",
        a: "Ja — es ist eines der stärksten Signale, um den zirkadianen Rhythmus zu verankern. Sogar 5–10 Minuten draußen helfen.",
      },
      {
        q: "Lohnen sich Blaulicht-Brillen?",
        a: "Die allgemeine Reduktion der Lichtintensität abends neigt dazu, mehr zu bedeuten als spezifisches Blaulicht-Filtern.",
      },
      {
        q: "Ist entkoffeinierter Kaffee völlig koffeinfrei?",
        a: "Nicht ganz — entkoffeinierter Kaffee enthält immer noch eine kleine Menge Koffein, normalerweise 2–15 mg pro Tasse.",
      },
      {
        q: "Was, wenn ich Nachtschichten arbeite?",
        a: "Ziel auf strategische Hellicht-Exposition während deines 'Tages' und Dunkelheit während deiner 'Nacht'. Schichtarbeit stört den zirkadianen Rhythmus und profitiert von einem angepassten Plan.",
      },
      {
        q: "Beeinflusst Alkohol meine Körperuhr?",
        a: "Alkohol fragmentiert Schlaf und kann die Schlafarchitektur verändern, selbst wenn er hilft, schneller einzuschlafen.",
      },
      {
        q: "Wie schnell kann ich meinen Rhythmus zurücksetzen?",
        a: "Die meisten Erwachsenen verschieben sich um etwa 1 Stunde pro Tag mit konsequentem Licht, Mahlzeiten- und Aufstehzeit-Signalen.",
      },
    ],
    nextLesson: "stimulus-control",
  },
  "stimulus-control": {
    meta: {
      title: "Stimuluskontrolle in einfachen Worten | Somna",
      desc: "Lerne eine der effektivsten CBT-I-Strategien, um eine gesunde Verbindung zwischen Bett und Schlaf wieder aufzubauen.",
    },
    eyebrow: "SCHNELLE LEKTION",
    title: "Stimuluskontrolle in einfachen Worten",
    subtitle:
      "Stimuluskontrolle trainiert die einfache, gelernte Verbindung zwischen Bett und Schlaf neu — und ist eines der mächtigsten Werkzeuge in CBT-I.",
    readingTime: "5",
    keyTakeaways: [
      "Bett sollte mit Schlaf verknüpft sein — nicht mit Wachsein.",
      "Wach im Bett liegen verstärkt Insomnie.",
      "Beständigkeit ist wichtiger als Perfektion.",
      "Verbesserung braucht Praxis; die ersten Nächte sind die härtesten.",
    ],
    sections: [
      {
        heading: "Was ist Stimuluskontrolle?",
        paras: [
          "Stimuluskontrolle ist die Praxis, dein Bett und Schlafzimmer nur für Schlaf und Intimität zu nutzen.",
          "Das Ziel ist einfach: Wenn dein Körper die Schwelle des Schlafzimmers überschreitet, weiß er, was passieren wird.",
        ],
      },
      {
        heading: "Wie Insomnie Bett-Verknüpfungen ändert",
        paras: [
          "Nach genügend Nächten, wach im Bett gelegen zu haben, wird das Bett mit Frustration, Wachsein oder Angst gepaart.",
          "Das ist Konditionierung — dieselbe Art von Lernen, die dich sabbern lässt, wenn du ein vertrautes Abendgeräusch hörst. Dein Gehirn diskutiert nicht; es reagiert einfach.",
        ],
      },
      {
        heading: "Die 20-Minuten-Regel",
        paras: [
          "Wenn du nicht nach etwa 20 Minuten schläfst (kein Uhrschauen — schätze), steh aus dem Bett. Geh an einen anderen Ort bei gedimmtem Licht und mach etwas Ruhiges: ein paar Seiten eines sanften Buches, langsames Dehnen, ruhiges sitzendes Atmen.",
          "Kehre nur ins Bett zurück, wenn du dich müde fühlst — schwere Augen, nickender Kopf. Wiederhole bei Bedarf. Das klingt gegenintuitiv, aber es ist das Herz der Stimuluskontrolle.",
        ],
      },
      {
        heading: "Häufige Fehler",
        paras: [
          "Handy im Bett benutzen, im Bett arbeiten, im Bett fernsehen oder liegen und 'härter versuchen' verstärken alle die falsche Verknüpfung.",
          "Inkonsistente Anwendung verlangsamt auch Ergebnisse. Die Methode funktioniert am besten, wenn sie jede Nacht für mehrere Wochen angewendet wird.",
        ],
      },
      {
        heading: "Welche Ergebnisse zu erwarten sind",
        paras: [
          "Die meisten Menschen finden, dass die ersten 3–5 Nächte zäh sind — du kannst anfangs weniger schlafen, weil du weniger Zeit wach im Bett verbringst.",
          "In Woche 2 konsolidiert sich der Schlaf oft: du schläfst schneller ein, wachst weniger auf und fühlst, dass das Bett wieder zum Schlaf-Hinweis wird.",
        ],
      },
    ],
    scienceNote:
      "Stimuluskontrolle ist unter den am besten untersuchten CBT-I-Techniken und wird als eigenständige evidenzbasierte Behandlung für chronische Insomnie empfohlen.",
    practicalTip:
      "Bring Bildschirme, Arbeitsmaterialien und deinen Laptop heute Abend aus dem Schlafzimmer. Sogar eine kleine körperliche Änderung formt den Hinweis.",
    cta: { label: "Lies den vollständigen CBT-I-Leitfaden", to: "/cbt-i-guide" },
    relatedGuide: { slug: "cbt-i-guide" },
    relatedTool: {
      to: "/calculator",
      label: "Schlafzyklus-Rechner",
      desc: "Matche Schlafenszeit an natürliche Zyklen.",
    },
    faqs: [
      {
        q: "Was ist Stimuluskontrolle in CBT-I?",
        a: "Stimuluskontrolle ist die Praxis, das Bett nur für Schlaf zu nutzen, das Bett zu verlassen, wenn man nicht schläft, und eine konstante Aufstehzeit einzuhalten — damit das Bett wieder zum Schlaf-Hinweis wird.",
      },
      {
        q: "Wie lange bis Stimuluskontrolle wirkt?",
        a: "Viele Menschen sehen Verbesserung innerhalb von 1–3 Wochen konsequenter Praxis.",
      },
      {
        q: "Ist die 20-Minuten-Regel streng?",
        a: "Es ist eine Richtlinie. Schau nicht auf die Uhr — schätze. Wenn du dich klar wach und frustriert fühlst, verlasse das Bett.",
      },
      {
        q: "Was sollte ich tun, wenn ich das Bett verlasse?",
        a: "Etwas Ruhiges bei gedimmtem Licht: sanftes Buch, langsames Dehnen, ruhiges Sitzen. Vermeide Bildschirme, Arbeit und alles Stimulierende.",
      },
      {
        q: "Funktioniert Stimuluskontrolle bei mitternächtlichen Erwachen?",
        a: "Ja — dieselbe 20-Minuten-Regel gilt. Wenn du aufwachst und nicht wieder einschlafen kannst, verlasse das Bett und kehre nur bei Müdigkeit zurück.",
      },
      {
        q: "Was, wenn das Bett-Verlassen mich mehr aufweckt?",
        a: "Halte Licht gedimmt, Aktivität ruhig und deinen Körper entspannt. Das Ziel ist nicht volle Wachheit — es ist, Müdigkeit natürlich zurückkehren zu lassen.",
      },
      {
        q: "Kann ich Stimuluskontrolle ohne andere CBT-I-Werkzeuge machen?",
        a: "Es kann allein wirksam sein, aber in Kombination mit Schlafrestriktion und konstanter Aufstehzeit bringt es die stärksten Ergebnisse.",
      },
    ],
    nextLesson: "what-is-cbti",
  },
};

export const deLearnDict: LearnDict = {
  ui: deUi,
  titles: deTitles,
  summaries: deSummaries,
  lessons: deLessons,
};
