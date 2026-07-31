/**
 * Deutsch (de-DE) — natives CBT-I-Wörterbuch für somna.help
 *
 * SEO-Keyword-Quellen (DACH-Suchverhalten, nicht EN-Übersetzung):
 * - „Schlaf verbessern", „Einschlafstörungen", „Schlafrhythmus", „Schlaftagebuch"
 * - „CBT-I" / „kognitive Verhaltenstherapie bei Insomnie" (Fachstandard DE)
 * - „Schlafhygiene", „Schlafeffizienz", „Schlafrestriktion"
 */

import type { CbtiDict, CbtiSlug } from "./cbti-i18n";

const deTitles: Record<CbtiSlug, string> = {
  "cbt-i-guide": "CBT-I-Leitfaden",
  "sleep-anxiety": "Schlafangst",
  "how-to-fall-asleep-fast": "Schnell einschlafen",
  "wake-up-at-3am": "Um 3 Uhr aufwachen",
  "insomnia-treatment": "Insomnie-Behandlung",
};

const deSummaries: Record<CbtiSlug, string> = {
  "cbt-i-guide": "Eine umfassende Einführung in die kognitive Verhaltenstherapie bei Insomnie.",
  "sleep-anxiety": "Warum Sorgen über den Schlaf den Schlaf verschlechtern – und wie man den Kreislauf durchbricht.",
  "how-to-fall-asleep-fast":
    "Wissenschaftlich fundierte Techniken, um schneller einzuschlafen – ohne Medikamente.",
  "wake-up-at-3am": "Ursachen für nächtliches Aufwachen und was man dagegen tun kann.",
  "insomnia-treatment": "CBT-I vs. Medikamente – was die Forschung wirklich sagt.",
};

const deUi: CbtiDict["ui"] = {
  guides: "Leitfäden",
  section: "CBT-I-Bibliothek",
  readTime: "Min. Lesezeit",
  badge: "Wissenschaftlich fundiert",
  takeawaysTitle: "Die wichtigsten Punkte",
  strategyTitle: "Was CBT-I empfiehlt",
  relatedArticlesTitle: "Verwandte Artikel",
  faqTitle: "Häufige Fragen",
  sleepDiary: "Schlaftagebuch",
  sleepDiaryDesc: "Protokolliere deine Nächte ohne Verurteilung.",
};

const deArticles: CbtiDict["articles"] = {
  "cbt-i-guide": {
    meta: {
      title: "CBT-I-Leitfaden: Ein wissenschaftsbasierter Ansatz für besseren Schlaf | Somna",
      desc: "Erfahre, wie die kognitive Verhaltenstherapie bei Insomnie (CBT-I) wirkt und warum sie als Erstlinientherapie bei chronischer Insomnie gilt.",
    },
    eyebrow: "CBT-I-BIBLIOTHEK",
    title: "CBT-I-Leitfaden: Ein wissenschaftsbasierter Ansatz für besseren Schlaf",
    intro:
      "Die kognitive Verhaltenstherapie bei Insomnie (CBT-I) ist der Goldstandard der nicht-medikamentösen Behandlung von chronischer Insomnie. Dieser Leitfaden erklärt, wie sie funktioniert, was du erwarten kannst und wie du beginnst.",
    readTime: "8",
    takeaways: [
      "CBT-I wird von großen medizinischen Organisationen als Erstlinientherapie bei chronischer Insomnie empfohlen.",
      "Sie wirkt, indem sie die Beziehung deines Gehirns zum Schlaf neu trainiert – nicht durch Sedierung.",
      "Die meisten Menschen sehen innerhalb von 4–8 Wochen eine spürbare Verbesserung.",
      "Sie hat keine Nebenwirkungen und die Vorteile halten lange nach dem Programmende an.",
    ],
    sections: [
      {
        heading: "Was ist CBT-I?",
        paras: [
          "CBT-I ist ein strukturiertes, zeitlich begrenztes Programm, das die Gedanken und Verhaltensweisen anspricht, die Insomnie aufrechterhalten. Im Gegensatz zu Schlaftabletten behandelt es die zugrundeliegenden Ursachen statt nur die Symptome zu maskieren.",
          "Ein typischer Verlauf dauert 4–8 Wochen, mit wöchentlichen Schritten, die deinen natürlichen Schlafdruck und dein Vertrauen in den Schlaf sanft wieder aufbauen.",
        ],
      },
      {
        heading: "Warum CBT-I wirkt",
        paras: [
          "Chronische Insomnie wird meist durch einen sich selbst verstärkenden Kreislauf aufrechterhalten: Schlechte Nächte erzeugen Angst vor dem Schlaf, was die Erregung erhöht, was die nächste Nacht schlechter macht. CBT-I unterbricht diesen Kreislauf aus mehreren Winkeln gleichzeitig.",
        ],
      },
      {
        heading: "Die fünf Kernkomponenten",
        bullets: [
          "Schlafrestriktion — vorübergehende Komprimierung der Bettzeit, um den Schlafdruck wieder aufzubauen.",
          "Stimuluskontrolle — erneute Verknüpfung des Bettes mit Schlaf statt Wachsein.",
          "Kognitive Umstrukturierung — Abschwächung von ängstlichen Gedanken über den Schlaf.",
          "Schlafhygiene — kleine umwelt- und lebensstilbezogene Anpassungen.",
          "Entspannungstraining — Beruhigung der Stressreaktion des Körpers am Abend.",
        ],
      },
      {
        heading: "Welche Ergebnisse kannst du erwarten?",
        paras: [
          "Studien zeigen, dass 70–80 % der Menschen mit chronischer Insomnie auf CBT-I ansprechen. Die meisten erleben eine kürzere Einschlafzeit, weniger nächtliche Erwachen und eine bessere Tagesenergie.",
        ],
      },
      {
        heading: "Wie lange dauert CBT-I?",
        paras: [
          "Die meisten Programme dauern 4–8 Wochen. Einige Verbesserungen zeigen sich bereits in den ersten 1–2 Wochen, aber die tiefsten Fortschritte kommen durch Beständigkeit.",
        ],
      },
      {
        heading: "Ist CBT-I besser als Schlaftabletten?",
        paras: [
          "Beide können kurzfristig helfen, aber nur CBT-I zeigt anhaltende Vorteile nach dem Ende der Behandlung. Große Schlaf-Leitlinien (AASM, ACP) empfehlen CBT-I als Erstlinienbehandlung.",
        ],
      },
    ],
    strategyIntro: "Wenn du nur ein paar Dinge aus CBT-I behältst, lass es diese sein.",
    strategyItems: [
      {
        title: "Halte eine konstante Aufstehzeit ein",
        desc: "Jeden Tag, auch am Wochenende. Das ist der stärkste Hebel für deinen zirkadianen Rhythmus.",
      },
      {
        title: "Steh auf, wenn du nicht schlafen kannst",
        desc: "Nach etwa 20 Minuten Wachsein verlasse das Schlafzimmer. Mach etwas Beruhigendes bei gedimmtem Licht. Kehre nur zurück, wenn du müde bist.",
      },
      {
        title: "Beschränke die Bettzeit auf tatsächlichen Schlaf",
        desc: "Stunden im Bett in der Hoffnung auf Schlaf schwächen die Bett-Schlaf-Verknüpfung.",
      },
      {
        title: "Behandle Gedanken als Gedanken",
        desc: "Du musst dich nicht mit ängstlichen Gedanken über den Schlaf auseinandersetzen. Acknowledgiere sie und lass sie vorbeiziehen.",
      },
    ],
    cta: { label: "Beginne, deinen Schlaf zu protokollieren", to: "/diary" },
    faqs: [
      {
        q: "Ist CBT-I das Richtige für mich?",
        a: "CBT-I hilft den meisten Erwachsenen mit chronischer Insomnie (Schlafprobleme 3+ Nächte pro Woche seit 3+ Monaten). Wenn du unbehandelte Schlafapnoe, unruhige Beine oder eine Stimmungsstörung hast, sprich zuerst mit einem Arzt.",
      },
      {
        q: "Brauche ich einen Therapeuten?",
        a: "Die Arbeit mit einem CBT-I-geschulten Kliniker bringt die stärksten Ergebnisse, aber selbstgeleitete digitale CBT-I-Programme sind ebenfalls wissenschaftlich fundiert und wirksam.",
      },
      {
        q: "Muss ich auf Nickerchen verzichten?",
        a: "Oft ja, zumindest während der aktiven Phase. Nickerchen reduzieren den Schlafdruck, der der Treibstoff für CBT-I ist.",
      },
      {
        q: "Wie unterscheidet sich CBT-I von Schlafhygiene?",
        a: "Schlafhygiene ist ein kleiner Teil von CBT-I. Allein löst sie selten chronische Insomnie — die verhaltens- und kognitiven Komponenten übernehmen den Großteil der Arbeit.",
      },
      {
        q: "Macht CBT-I die Insomnie anfangs schlimmer?",
        a: "Die Schlafrestriktion kann sich in Woche 1–2 schwieriger anfühlen, weil sie absichtlich Schlafdruck aufbaut. Das ist temporär, beabsichtigt und verbessert sich meist schnell.",
      },
      {
        q: "Funktioniert CBT-I bei älteren Erwachsenen?",
        a: "Ja. Studien zeigen starke Ergebnisse bei älteren Erwachsenen, oft besser als Medikamente und ohne Nebenwirkungen.",
      },
      {
        q: "Kann ich CBT-I machen, während ich Schlaftabletten nehme?",
        a: "Oft ja, unter ärztlicher Anleitung. Viele Menschen reduzieren Medikamente während oder nach CBT-I schrittweise.",
      },
      {
        q: "Wie lange halten die Vorteile an?",
        a: "Folgestudien zeigen Vorteile, die 1–3 Jahre nach einem CBT-I-Programm anhalten — was ungewöhnlich für jede Insomniebehandlung ist.",
      },
    ],
  },
  "sleep-anxiety": {
    meta: {
      title: "Schlafangst: Warum Sorgen über den Schlaf den Schlaf verschlechtern | Somna",
      desc: "Verstehe, wie sich Schlafangst entwickelt und entdecke CBT-I-Techniken, um den Kreislauf aus Sorgen und Insomnie zu durchbrechen.",
    },
    eyebrow: "CBT-I-BIBLIOTHEK",
    title: "Schlafangst: Warum Sorgen über den Schlaf den Schlaf verschlechtern",
    intro:
      "Sorgen um den Schlaf sind einer der häufigsten Treiber von Insomnie. Den Kreislauf zu verstehen, ist der erste Schritt, ihn abzuschwächen.",
    readTime: "7",
    takeaways: [
      "Schlafangst ist eine gelernte Reaktion — dein Gehirn versucht, dich zu schützen.",
      "Je mehr du versuchst zu schlafen, desto mehr bleibt dein Nervensystem in Alarmbereitschaft.",
      "Akzeptanz, nicht Kontrolle, ist das, was CBT-I nutzt, um den Kreislauf zu durchbrechen.",
      "Kleine Tagesänderungen können verändern, wie sich die nächste Nacht anfühlt.",
    ],
    sections: [
      {
        heading: "Was ist Schlafangst?",
        paras: [
          "Schlafangst ist die Sorge, die Furcht oder die Hypererregung, die sich um die Schlafenszeit und während der Nacht aufbaut. Es ist kein persönlicher Fehler — es ist eine konditionierte Reaktion eines Gehirns, das das Bett mit Stress verknüpft hat.",
        ],
      },
      {
        heading: "Der Schlafangst-Kreislauf",
        paras: [
          "Ein paar schlechte Nächte lösen Sorgen über zukünftige schlechte Nächte aus. Sorgen erhöhen Cortisol und Herzfrequenz. Diese Erregung macht die nächste Nacht schwieriger, was die Sorge bestätigt. Im Kreis.",
        ],
      },
      {
        heading: "Typische ängstliche Gedanken",
        bullets: [
          '"Was, wenn ich heute Nacht nicht einschlafe?"',
          '"Ich werde morgen erschöpft sein und nicht funktionieren können."',
          '"Alle anderen schlafen ein — was ist falsch mit mir?"',
          '"Ich muss jetzt einschlafen, sonst ist die Nacht ruiniert."',
        ],
      },
      {
        heading: "Warum das Gehirn hyperalarmiert wird",
        paras: [
          "Dein Gehirn lernt. Nach genügend Nächten, in denen das Bett gleich Kampf bedeutete, kann das bloße Hineinlegen eine Alarmreaktion auslösen — schnelles Herz, rasende Gedanken, heiße Haut. Das ist Konditionierung, keine Schwäche.",
        ],
      },
      {
        heading: "CBT-I-Strategien gegen Schlafangst",
        bullets: [
          "Stimuluskontrolle — verlasse das Bett, wenn sich Wachsein hinzieht.",
          "Kognitive Defusion — lass Gedanken vorbeiziehen, ohne dich darauf einzulassen.",
          "Paradoxe Intention — versuche sanft, ruhig wach zu bleiben, und nimm den Druck zum Einschlafen.",
          "Tägliche Sorgenfenster — verarbeite morgige Sorgen früher, nicht um Mitternacht.",
        ],
      },
      {
        heading: "Akzeptanz versus Kontrolle",
        paras: [
          "Schlaf kann nicht erzwungen werden. Je mehr du drängst, desto mehr drückt dein System zurück. CBT-I bittet um etwas Gegenintuitives: lass den Kampf los. Der Körper schläft, wenn er sich sicher fühlt.",
        ],
      },
    ],
    strategyIntro: "Wenn Schlafangst hochschießt, verlass dich auf diese Strategien.",
    strategyItems: [
      {
        title: "Lass das Schlafziel los",
        desc: "Ziel auf Ruhe, nicht auf Schlaf. Schlaf kommt als Nebenprodukt von Sicherheit und Unbeschwertheit.",
      },
      {
        title: "Steh auf, wenn du kreiselst",
        desc: "Geh zu einer Aktivität bei schwachem Licht und geringer Stimulation. Kehre nur zurück, wenn du wirklich müde bist.",
      },
      {
        title: "Plane Sorgen früher ein",
        desc: "Verbringe 10 Minuten am frühen Abend damit, Sorgen aufzuschreiben. Schließe das Notizbuch.",
      },
      {
        title: "Verlangsame deinen Ausatmen",
        desc: "Ein langer, sanfter Ausatem senkt die Herzfrequenz und signalisiert Sicherheit dem Nervensystem.",
      },
    ],
    cta: { label: "Lies den CBT-I-Leitfaden", to: "/cbt-i-guide" },
    faqs: [
      {
        q: "Warum beginnt meist Schlafangst?",
        a: "Ein stressiges Lebensereignis, eine Krankheit oder eine Phase schlechten Schlafes pflanzen oft die ersten Samen. Das Gehirn lernt dann, das Bett mit Kampf zu verknüpfen.",
      },
      {
        q: "Ist Schlafangst dasselbe wie Insomnie?",
        a: "Sie überlappen stark. Schlafangst ist einer der häufigsten Treiber und Aufrechterhalter von chronischer Insomnie.",
      },
      {
        q: "Kann ich einfach etwas zur Beruhigung nehmen?",
        a: "Sedativa können kurzfristig helfen, adressieren aber selten die zugrundeliegende Konditionierung. CBT-I trainiert die Reaktion selbst neu.",
      },
      {
        q: "Warum fühle ich mich nur vor dem Schlafengehen ängstlich?",
        a: "Weil das der Hinweis ist, den dein Gehirn gelernt hat. Außerhalb des Schlafzimmers feuert die Alarmreaktion nicht.",
      },
      {
        q: "Hilft das Uhrschauen?",
        a: "Nein. Uhrschauen erhöht zuverlässig die Angst. Drehe die Uhr weg oder aus dem Sichtfeld.",
      },
      {
        q: "Wie lange dauert es, sich abends ruhiger zu fühlen?",
        a: "Die meisten Menschen bemerken eine gewisse Erleichterung innerhalb von 2–4 Wochen konsequenter CBT-I-Praxis.",
      },
      {
        q: "Hilft Atmen wirklich?",
        a: "Ja — langsame, verlängerte Ausatmungen (z.B. 4-7-8 oder Box-Atmung) senken zuverlässig die physiologische Erregung.",
      },
      {
        q: "Wann sollte ich einen Kliniker aufsuchen?",
        a: "Wenn Schlafangst mit Tagespanik, anhaltend gedrückter Stimmung oder erheblicher täglicher Beeinträchtigung einhergeht, bitte um Unterstützung.",
      },
    ],
  },
  "how-to-fall-asleep-fast": {
    meta: {
      title: "Schnell einschlafen: Wissenschaftsbasierte Schlafstrategien | Somna",
      desc: "Entdecke wissenschaftlich gestützte Techniken, die dir helfen, schneller einzuschlafen, ohne auf Schlaftabletten angewiesen zu sein.",
    },
    eyebrow: "CBT-I-BIBLIOTHEK",
    title: "Schnell einschlafen: Wissenschaftsbasierte Schlafstrategien",
    intro:
      "Einschlafen kann nicht erzwungen werden — aber du kannst Bedingungen schaffen, unter denen Schlaf leichter kommt. Hier ist, was die Forschung tatsächlich unterstützt.",
    readTime: "6",
    takeaways: [
      "Die meisten Erwachsenen brauchen 10–20 Minuten zum Einschlafen — das ist normal, nicht langsam.",
      "Versuchen, härter zu schlafen, schlägt fast immer zurück.",
      "Licht, Temperatur und Timing sind wichtiger als jede einzelne Technik.",
      "Wenn du nach etwa 20 Minuten wach bist, steh auf.",
    ],
    sections: [
      {
        heading: "Warum Einschlafen schwierig sein kann",
        paras: [
          "Einschlafen hängt von zwei Systemen ab: Schlafdruck (aufgebaut durch Stunden Wachsein) und zirkadianes Timing (deine innere Uhr). Wenn eines davon nicht stimmt, dauert das Einschlafen länger.",
          "Stress, Bildschirme, spätes Koffein und unregelmäßige Zeitpläne verzögern allesamt den Einschlaf.",
        ],
      },
      {
        heading: "Häufige Fehler",
        bullets: [
          "Vor dem eigentlichen Schlafgefühl ins Bett gehen.",
          "Im Bett das Handy benutzen.",
          "Auf die Uhr schauen, wenn du nicht einschlafen kannst.",
          "Versuchen, mit bloßer Anstrengung zu schlafen.",
          "Alkohol zum Entspannen trinken — er fragmentiert den Schlaf später in der Nacht.",
        ],
      },
      {
        heading: "CBT-I-Empfehlungen",
        bullets: [
          "Geh nur ins Bett, wenn du müde bist, nicht nur erschöpft.",
          "Halte eine konstante Aufstehzeit ein, auch nach rauen Nächten.",
          "Dimme Lichter 60–90 Minuten vor dem Schlafengehen.",
          "Halte das Schlafzimmer kühl (~18°C).",
        ],
      },
      {
        heading: "Entspannungsmethoden, die wirklich helfen",
        bullets: [
          "Progressive Muskelentspannung — spanne und entspanne Muskelgruppen, vom Kopf bis zu den Zehen.",
          "Body-Scan-Meditation — bewege die Aufmerksamkeit langsam durch den Körper.",
          "Kognitives Shuffle — stelle dir zufällige, nicht zusammenhängende Bilder vor, um das Denken zu entkoppeln.",
        ],
      },
      {
        heading: "Atemübungen",
        paras: [
          "Langsames nasales Atmen mit langem Ausatem ist die am besten unterstützte Technik. Versuche 4-7-8 (einatmen 4, halten 7, ausatmen 8) für 4 Zyklen oder einfaches 4-6-Atmen.",
        ],
      },
      {
        heading: "Was tun, wenn du nicht schlafen kannst",
        paras: [
          "Wenn 20 Minuten vergehen und du hellwach bist, steh auf. Setz dich irgendwo ruhig bei gedimmtem Licht. Lies etwas Sanftes. Kehre zurück, wenn du müde bist. Das baut die Bett-Schlaf-Verknüpfung wieder auf.",
        ],
      },
    ],
    strategyIntro: "Heute Abend versuche diese — in dieser Reihenfolge.",
    strategyItems: [
      {
        title: "Dimme alles 60 Min vor dem Schlafengehen",
        desc: "Licht unterdrückt Melatonin. Gedimmtes Lichter sind der einfachste Melatonin-Booster, den du hast.",
      },
      {
        title: "Bring Bildschirme aus dem Schlafzimmer",
        desc: "Oder zumindest kein Scrollen, sobald du im Bett bist.",
      },
      {
        title: "Warte auf Schlafgefühl",
        desc: "Erschöpft ist nicht dasselbe wie müde. Müde = schwere Augen, nickender Kopf. Geh dann ins Bett.",
      },
      {
        title: "Wenn 20 Min wach, verlasse das Bett",
        desc: "Ruhige, gedimmte Aktivität bis zur Müdigkeit. Das ist das stärkste CBT-I-Werkzeug für den Einschlaf.",
      },
    ],
    cta: { label: "Benutze den Schlafzyklus-Rechner", to: "/bedtime-calculator" },
    faqs: [
      {
        q: "Wie lange sollte das Einschlafen dauern?",
        a: "Etwa 10–20 Minuten ist gesund. Weniger als 5 Minuten kann auf Schlafmangel hindeuten; mehr als 30 Minuten regelmäßig deutet auf Insomnie hin.",
      },
      {
        q: "Funktioniert das Zählen von Schafen?",
        a: "Mäßig. Das kognitive Shuffle — zufällige, nicht zusammenhängende Bilder — funktioniert für die meisten Menschen besser.",
      },
      {
        q: "Sind Schlaf-Apps und Weißes Rauschen wirksam?",
        a: "Stetiger Umgebungssound hilft einigen Menschen, plötzliche Geräusche zu maskieren. Die Wirksamkeit variiert.",
      },
      {
        q: "Soll ich im Bett lesen?",
        a: "Wenn Lesen dich verlässlich müde macht, ja. Wenn du hellwach bleibst, mach es anderswo und kehre erst bei Müdigkeit ins Bett zurück.",
      },
      {
        q: "Hilft Melatonin, schneller einzuschlafen?",
        a: "Es kann das Timing verschieben, besonders bei Jetlag oder verzögerter Schlafphase. Es ist kein Sedativum.",
      },
      {
        q: "Was ist mit Bewegung?",
        a: "Regelmäßige Bewegung verbessert den Einschlaf. Vermeide intensive Workouts innerhalb von 2 Stunden vor dem Schlafengehen.",
      },
      {
        q: "Was ist die beste Raumtemperatur?",
        a: "Kühl — etwa 16–19°C (60–67°F) für die meisten Erwachsenen.",
      },
      {
        q: "Ist es in Ordnung, mit dem Fernseher einzuschlafen?",
        a: "Im Allgemeinen nicht — Licht und wechselnder Audio fragmentieren den Schlaf, auch wenn du es nicht bemerkst.",
      },
    ],
  },
  "wake-up-at-3am": {
    meta: {
      title: "Warum wache ich jede Nacht um 3 Uhr auf? | Somna",
      desc: "Verstehe die häufigen Ursachen für nächtliches Aufwachen und was CBT-I empfiehlt, um die Schlafkontinuität zu verbessern.",
    },
    eyebrow: "CBT-I-BIBLIOTHEK",
    title: "Warum wache ich jede Nacht um 3 Uhr auf?",
    intro:
      "Mitten in der Nacht aufzuwachen ist eines der häufigsten — und frustrierendsten — Muster bei Insomnie. Hier ist, warum es passiert und was hilft.",
    readTime: "6",
    takeaways: [
      "Kurze Erwachen zwischen Schlafzyklen sind völlig normal.",
      "Das Problem ist selten das Aufwachen — es ist die Schwierigkeit, wieder einzuschlafen.",
      "Stress und Hypererregung erreichen oft in der zweiten Nachthälfte ihren Höhepunkt.",
      "Was du in diesen 20 Minuten tust, ist wichtiger als warum du aufgewacht bist.",
    ],
    sections: [
      {
        heading: "Ist das Aufwachen um 3 Uhr normal?",
        paras: [
          "Ja. Gesunde Schläfer wachen kurz zwischen Schlafzyklen mehrmals pro Nacht auf und schlafen sofort wieder ein. Das Problem ist nicht das Erwachen — es ist das Steckenbleiben.",
        ],
      },
      {
        heading: "Stress und Hypererregung",
        paras: [
          "Cortisol beginnt natürlich in der zweiten Nachthälfte zu steigen, um dich auf das Aufwachen vorzubereiten. Wenn Stress hoch ist, beginnt dieser Anstieg früher und härter — und zieht dich zwischen 2 und 4 Uhr aus dem Schlaf.",
        ],
      },
      {
        heading: "Schlafzyklen und Erwachen",
        paras: [
          "Um 3 Uhr haben die meisten Erwachsenen bereits mehrere Schlafzyklen abgeschlossen und verbringen mehr Zeit in leichterem REM-Schlaf, aus dem man leichter aufwacht. Ein kleines Geräusch oder eine Temperaturänderung können die Schwelle überschreiten.",
        ],
      },
      {
        heading: "Andere häufige Ursachen",
        bullets: [
          "Alkohol — entspannt zunächst, fragmentiert aber den Schlaf 4–6 Stunden später.",
          "Späte Mahlzeiten oder niedriger Blutzucker.",
          "Schlafzimmer zu warm.",
          "Unbehandelte Schlafapnoe oder unruhige Beine.",
          "Gefüllte Blase (besonders bei abendlichem Trinken).",
        ],
      },
      {
        heading: "Was NICHT tun",
        bullets: [
          "Auf die Uhr schauen.",
          "Zum Handy greifen.",
          "30+ Minuten im Bett liegen und Schlaf erzwingen.",
          "Mentan den nächsten Tag planen.",
        ],
      },
      {
        heading: "CBT-I-Empfehlungen",
        paras: [
          "Nach etwa 20 Minuten Wachsein steh auf. Setz dich irgendwo ruhig bei gedimmtem Licht. Mach etwas sanft Absorbierendes. Kehre nur zurück, wenn du müde bist. Über Wochen verkürzen sich die Erwachen und verschwinden oft.",
        ],
      },
      {
        heading: "Wann medizinische Hilfe suchen",
        paras: [
          "Wenn Erwachen mit Atemnot, Würgen, lautem Schnarchen, Beinzucken oder Tageserschöpfung trotz genügender Stunden im Bett einhergehen, sprich mit einem Kliniker — das können Anzeichen für Schlafapnoe oder eine andere behandelbare Störung sein.",
        ],
      },
    ],
    strategyIntro: "Nächstes Mal, wenn du um 3 Uhr aufwachst, versuche diese Sequenz.",
    strategyItems: [
      {
        title: "Schau nicht auf die Uhr",
        desc: "Zu wissen, dass es 3 Uhr ist, aktiviert sofort den Sorgenkreislauf.",
      },
      {
        title: "Bleib still und atme langsam",
        desc: "Lange Ausatmungen. Keine Anstrengung zum Einschlafen — einfach ruhen.",
      },
      {
        title: "Nach etwa 20 Min steh auf",
        desc: "Gedimmtes Licht, ruhige Aktivität. Kehre zurück, wenn müde, nicht vorher.",
      },
      {
        title: "Steh zur gewohnten Zeit auf",
        desc: "Schlaf nicht aus. Den Schutz der Aufstehzeit schützt den Schlafdruck der nächsten Nacht.",
      },
    ],
    flow: {
      heading: "Ablaufplan für nächtliches Erwachen",
      yes: "Ja",
      no: "Nein",
      nodes: [
        { q: "Bist du aufgewacht?", yes: "Bleib still, atme langsam.", no: "Bleib ruhig." },
        {
          q: "Noch wach nach etwa 20 Minuten?",
          yes: "Verlasse das Bett. Gedimmtes Licht. Ruhige Aktivität.",
          no: "Lass dich wieder einschlafen.",
        },
        { q: "Fühlst du dich wieder müde?", yes: "Kehre ins Bett zurück.", no: "Bleib wach bis zur Müdigkeit." },
        { action: "Steh zur gewohnten Zeit auf — schlaf nicht aus." },
      ],
    },
    cta: { label: "Protokolliere deine Schlafrhythmen", to: "/diary" },
    faqs: [
      {
        q: "Warum speziell um 3 Uhr?",
        a: "Cortisol steigt natürlich in der zweiten Nachthälfte, und der Schlaf ist dann leichter. 2–4 Uhr ist das häufigste Erwachen-Fenster.",
      },
      {
        q: "Bedeutet das, dass medizinisch etwas falsch ist?",
        a: "Meistens nicht. Aber anhaltende mitternächtliche Erwachen mit Tagessymptomen verdienen eine klinische Prüfung.",
      },
      {
        q: "Warum kann ich nicht wieder einschlafen?",
        a: "Oft weil der Geist sich aktiviert, sobald er bemerkt, dass er wach ist — und Sorgen blockieren die Rückkehr zum Schlaf.",
      },
      {
        q: "Soll ich etwas essen?",
        a: "Nur wenn Hunger offensichtlich der Auslöser ist. Andernfalls verstärkt Essen mitternächtliches Wachsein.",
      },
      {
        q: "Macht Alkohol es schlimmer?",
        a: "Sehr wahrscheinlich. Alkohol fragmentiert Schlaf besonders in der zweiten Nachthälfte.",
      },
      {
        q: "Bedeutet das, dass ich Insomnie habe?",
        a: "Häufiges mitternächtliches Erwachen mit Schwierigkeiten, wieder einzuschlafen, 3+ Nächte pro Woche seit 3+ Monaten, erfüllt die Definition von Insomnie.",
      },
      {
        q: "Kann Melatonin beim 3-Uhr-Erwachen helfen?",
        a: "Typischerweise nicht — Melatonin beeinflusst das Schlaf-Timing, nicht die Schlaf-Erhaltung.",
      },
      {
        q: "Hilft CBT-I?",
        a: "Ja — CBT-I ist hochwirksam sowohl für Einschlaf als auch für mitternächtliche Erwachen.",
      },
    ],
  },
  "insomnia-treatment": {
    meta: {
      title: "Insomnie-Behandlung: CBT-I vs. Medikamente | Somna",
      desc: "Vergleiche CBT-I und Schlaftabletten und erfahre, welche Behandlungsoptionen von der Forschung unterstützt werden.",
    },
    eyebrow: "CBT-I-BIBLIOTHEK",
    title: "Insomnie-Behandlung: CBT-I vs. Medikamente",
    intro:
      "Tabletten wirken schnell. CBT-I wirkt tiefer. Hier ist ein ehrlicher, wissenschaftsbasierter Vergleich, damit du gut wählen kannst.",
    readTime: "7",
    takeaways: [
      "CBT-I wird als Erstlinientherapie von großen Schlaf-Leitlinien empfohlen.",
      "Medikamente können kurzfristig helfen, lösen aber selten chronische Insomnie.",
      "CBT-I hat anhaltende Vorteile und keine Nebenwirkungen.",
      "Beide können unter ärztlicher Anleitung kombiniert werden.",
    ],
    sections: [
      {
        heading: "Was ist Insomnie?",
        paras: [
          "Insomnie ist Schwierigkeit beim Einschlafen, Einschlafenbleiben oder zu frühem Aufwachen — mindestens 3 Nächte pro Woche, seit 3+ Monaten, mit Tagesauswirkung. Es ist ein klinischer Zustand, keine Persönlichkeitseigenschaft.",
        ],
      },
      {
        heading: "Behandlungsoption 1 — CBT-I",
        paras: [
          "Ein strukturiertes, evidenzbasiertes Programm, das die Gedanken und Verhaltensweisen anspricht, die Insomnie aufrechterhalten. 4–8 Wochen. Keine Medikamente. Effekte halten lange nach dem Programmende an.",
        ],
      },
      {
        heading: "Behandlungsoption 2 — Schlaftabletten",
        paras: [
          "Umfassen verschreibungspflichtige Hypnotika (Z-Medikamente, Benzodiazepine), sedierende Antidepressiva und rezeptfreie Hilfsmittel. Sie können die Einschlafzeit verkürzen, verlieren aber oft an Wirksamkeit, können Abhängigkeit verursachen und adressieren keine Ursachen.",
        ],
      },
      {
        heading: "Vor- und Nachteile",
        bullets: [
          "CBT-I — anhaltend, keine Nebenwirkungen, erfordert Aufwand und Geduld.",
          "Medikamente — schnelle Linderung, Nebenwirkungen möglich, oft Rebound-Insomnie beim Absetzen.",
        ],
      },
      {
        heading: "Welcher Ansatz wirkt langfristig?",
        paras: [
          "Die Forschung ist klar: CBT-I übertrifft Medikamente bei der 6–12-Monats-Nachbeobachtung. Der Vorteil von Medikamenten verblasst beim Absetzen; der Vorteil von CBT-I hält meist an.",
        ],
      },
      {
        heading: "Können sie kombiniert werden?",
        paras: [
          "Ja. Viele Kliniker setzen kurzfristige Medikamente neben CBT-I ein und reduzieren dann. Koordiniere immer mit deinem Verschreiber.",
        ],
      },
    ],
    strategyIntro: "Wenn du entscheidest, wo du anfangen sollst, berücksichtige dies.",
    strategyItems: [
      {
        title: "Versuche CBT-I zuerst, wenn möglich",
        desc: "Empfohlen von AASM und ACP als Erstlinienbehandlung für chronische Insomnie.",
      },
      {
        title: "Nutze Medikamente als Brücke, nicht als Ziel",
        desc: "Kurzfristig, niedrigste wirksame Dosis, mit einem Reduktionsplan.",
      },
      {
        title: "Adressiere Tagesgewohnheiten",
        desc: "Koffein-Timing, Alkohol, Lichtexposition und Bewegung formen deine Nächte.",
      },
      {
        title: "Protokolliere deinen Schlaf",
        desc: "Ein einfaches Schlaftagebuch deckt Muster auf, die keine App erraten kann.",
      },
    ],
    cta: { label: "Erkunde den CBT-I-Leitfaden", to: "/cbt-i-guide" },
    faqs: [
      {
        q: "Ist CBT-I wirklich besser als Schlaftabletten?",
        a: "Bei chronischer Insomnie ja — bei der Langzeit-Nachbeobachtung. Für einmalige akute Insomnie können kurzfristige Medikamente angemessen sein.",
      },
      {
        q: "Sind Schlaftabletten sicher?",
        a: "Bei kurzfristiger und verschreibungsgemäßer Anwendung oft ja. Risiken umfassen Abhängigkeit, nächste Tagesmüdigkeit, Stürze (besonders bei älteren Erwachsenen) und Rebound-Insomnie.",
      },
      {
        q: "Was ist mit rezeptfreien Schlafhilfen?",
        a: "Die meisten nutzen sedierende Antihistaminika. Sie können nächste Tagesmüdigkeit verursachen und Toleranz baut sich schnell auf. Nicht für Langzeitanwendung empfohlen.",
      },
      {
        q: "Ist Melatonin eine Schlaftablette?",
        a: "Nein — es passt zirkadianes Timing an statt zu sedieren. Am nützlichsten für Jetlag und verzögerte Schlafphase.",
      },
      {
        q: "Wie viel kostet CBT-I?",
        a: "Es variiert. Persönliche Therapie ist am teuersten, Gruppenprogramme sind mittelpreisig, und digitales CBT-I (einschließlich selbstgeleitet) ist oft am erschwinglichsten.",
      },
      {
        q: "Was, wenn ich schon seit Jahren Medikamente nehme?",
        a: "Viele Menschen reduzieren während oder nach CBT-I erfolgreich unter Unterstützung ihres Verschreibers. Hör nicht abrupt auf.",
      },
      {
        q: "Deckt die Versicherung CBT-I?",
        a: "In vielen Regionen ja, besonders wenn von einem lizenzierten Kliniker durchgeführt. Die Abdeckung für digitale Programme variiert.",
      },
      {
        q: "Wie weiß ich, ob meine Behandlung wirkt?",
        a: "Besserer Einschlaf, weniger Erwachen, konstanteres Timing und bessere Tagesenergie. Ein Schlaftagebuch hilft dir, Fortschritt objektiv zu sehen.",
      },
    ],
  },
};

export const deCbtiDict: CbtiDict = {
  ui: deUi,
  titles: deTitles,
  summaries: deSummaries,
  articles: deArticles,
};
