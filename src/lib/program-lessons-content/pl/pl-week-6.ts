// Tydzień 6 — Utrzymanie efektów (lekcje 16-18)
// Źródło: natywna polska wersja programu CBT-I Somna.
import type { LessonContent } from "../../program-lessons";

export const plWeek6Lessons: LessonContent[] = [
  // ───────────────────────── Lekcja 16: Zapobieganie nawrotom ─────────────────────────
  {
    slug: "preventing-relapse",
    weekNumber: 6,
    weekSlug: "week-6",
    lessonNumber: 16,
    estimatedMinutes: 6,
    relatedLessonSlugs: [
      "travel-jet-lag-sleep",
      "long-term-sleep-health",
      "sleep-restriction-mistakes",
    ],
    i18n: {
      pl: {
        title: "Zapobieganie nawrotom bezsenności",
        eyebrow: "TYDZIEŃ 6 · LEKCJA 16",
        subtitle: "Plan działania na trudniejsze noce i okresy stresu.",
        difficulty: "Średniozaawansowany",
        readingTime: "6 min czytania",
        content: [
          {
            heading: "Nawrót to nie porażka",
            paras: [
              "Po poprawie bezsenności niemal każdy doświadcza od czasu do czasu gorszej nocy. Różnica polega na tym, jak na nią zareagujesz. Jeśli potraktujesz ją jako katastrofę, łatwo wrócisz do starego wzorca. Jeśli potraktujesz jako normalne zaburzenie — szybciej wrócisz do równowagi.",
            ],
          },
          {
            heading: "Plan awaryjny",
            paras: [
              "Warto mieć gotowy plan na trudniejsze noce. Może on wyglądać tak: utrzymuję stałą porę wstawania; nie drzemam w ciągu dnia; wieczorem robię krótką relaksację; jeśli nie zasypiam w ciągu 20 minut — wstaję z łóżka; nie sprawdzam zegara w nocy.",
            ],
          },
          {
            heading: "Wczesne sygnały ostrzegawcze",
            paras: [
              "Zwracaj uwagę na wczesne sygnały: zaczynasz martwić się snem przed położeniem się, znowu dłużej leżysz w łóżku, wracasz do patrzenia na zegar. To moment, by aktywować plan awaryjny, zanim problem się pogłębi.",
            ],
          },
        ],
        actionStepTitle: "Zadanie praktyczne",
        actionStep:
          "Napisz dziś swój osobisty plan awaryjny na trudniejsze noce. Powinien zawierać 4–5 konkretnych kroków, które podejmiesz, gdy sen się pogorszy. Umieść go obok łóżka.",
        reflectionTitle: "Refleksja",
        reflection:
          "Jakie sytuacje w przeszłości najczęściej prowadziły u Ciebie do gorszych nocy? Stres? Choroba? Podróż? Wypicie alkoholu? Co możesz zrobić inaczej w przyszłości?",
        faqs: [
          {
            q: "Czy powinienem wracać do ograniczenia snu przy nawrocie?",
            a: "Krótkie, kontrolowane ograniczenie czasu w łóżku może pomóc przy nawrocie, ale rób to rozważnie. Jeśli objawy są silne lub trwają dłużej niż tydzień, skonsultuj się z lekarzem.",
          },
          {
            q: "Jak długo trwa nawrót?",
            a: "Pojedyncza zła noc to nie nawrót. Nawrót to powracający wzorzec przez kilka dni lub tygodni. Szybka reakcja na wczesne sygnały znacznie go skraca.",
          },
        ],
        ctaLabel: "Dalej: sen w podróży",
        ctaHref: "/program/week-6/travel-jet-lag-sleep",
        seoTitle: "Zapobieganie nawrotom bezsenności | Somna CBT-I",
        seoDescription:
          "Stwórz osobisty plan zapobiegania nawrotom bezsenności na trudniejsze noce i okresy wzmożonego stresu.",
        keywords: [
          "nawrót bezsenności",
          "zapobieganie bezsenności",
          "plan awaryjny sen",
          "CBT-I",
        ],
      },
    },
  },

  // ───────────────────────── Lekcja 17: Sen w podróży i jet lag ─────────────────────────
  {
    slug: "travel-jet-lag-sleep",
    weekNumber: 6,
    weekSlug: "week-6",
    lessonNumber: 17,
    estimatedMinutes: 6,
    relatedLessonSlugs: [
      "preventing-relapse",
      "long-term-sleep-health",
      "how-sleep-works",
    ],
    i18n: {
      pl: {
        title: "Sen w podróży i jet lag",
        eyebrow: "TYDZIEŃ 6 · LEKCJA 17",
        subtitle: "Jak chronić rytm snu podczas podróży i zmiany strefy czasowej.",
        difficulty: "Średniozaawansowany",
        readingTime: "6 min czytania",
        content: [
          {
            heading: "Dlaczego podróż tak zakłóca sen",
            paras: [
              "Zmiana strefy czasowej, inne łóżko, hałas, światło, temperatura — wszystko to sprawia, że mózg traci swoje zwykłe sygnały. Jet lag to de facto chwilowe zaburzenie rytmu dobowego, które zwykle mija w ciągu kilku dni.",
            ],
          },
          {
            heading: "Przed podróżą",
            paras: [
              "Jeśli to możliwe, zacznij stopniowo przesuwać porę snu i wstawania na kilka dni przed wyjazdem, zwłaszcza przy dużych różnicach czasu. Przygotuj sobie wygodny zestaw podróżny: zatyczki do uszu, maska na oczy, ulubiona książka lub nagranie relaksacyjne.",
            ],
          },
          {
            heading: "Po przyjeździe",
            paras: [
              "Dostosuj się do lokalnego czasu jak najszybciej. Jeśli przyjechałeś rano, wytrzymaj do wieczora, zanim położysz się spać. Jeśli przyjechałeś wieczorem, unikaj wcześniejszego chodzenia spać. Światło dzienne jest Twoim najlepszym sprzymierzeńcem — spędź jak najwięcej czasu na zewnątrz pierwszego dnia.",
            ],
          },
        ],
        actionStepTitle: "Zadanie praktyczne",
        actionStep:
          "Jeśli masz w planach podróż, zapisz trzy konkretne działania, które pomogą Ci ochronić rytm snu: jedno przed podróżą, jedno w trakcie i jedno po przyjeździe.",
        reflectionTitle: "Refleksja",
        reflection:
          "Jak Twoje ostatnie podróże wpłynęły na sen? Co pomogło Ci wrócić do równowagi, a co pogorszyło sytuację?",
        faqs: [
          {
            q: "Czy melatonina pomaga na jet lag?",
            a: "Melatonina może pomóc przy przesuwaniu rytmu dobowego, ale jej stosowanie wymaga odpowiedniego dawkowania i momentu przyjęcia. Warto skonsultować to z lekarzem, szczególnie jeśli przyjmujesz inne leki.",
          },
          {
            q: "Jak długo trwa jet lag?",
            a: "Zazwyczaj około jeden dzień na każdą przekroczoną strefę czasową, ale jest to bardzo indywidualne. Ekspozycja na światło dzienne i regularność przyspieszają adaptację.",
          },
        ],
        ctaLabel: "Dalej: długoterminowe zdrowie snu",
        ctaHref: "/program/week-6/long-term-sleep-health",
        seoTitle: "Sen w podróży i jet lag: jak sobie radzić | Somna CBT-I",
        seoDescription:
          "Praktyczne strategie na jet lag i zmiany rytmu dobowego podczas podróży, bez utraty postępów CBT-I.",
        keywords: [
          "sen w podróży",
          "jet lag",
          "zmiana strefy czasowej",
          "rytm dobowy",
          "CBT-I",
        ],
      },
    },
  },

  // ───────────────────────── Lekcja 18: Długoterminowe zdrowie snu ─────────────────────────
  {
    slug: "long-term-sleep-health",
    weekNumber: 6,
    weekSlug: "week-6",
    lessonNumber: 18,
    estimatedMinutes: 6,
    relatedLessonSlugs: [
      "preventing-relapse",
      "travel-jet-lag-sleep",
      "realistic-sleep-expectations",
    ],
    i18n: {
      pl: {
        title: "Długoterminowe zdrowie snu",
        eyebrow: "TYDZIEŃ 6 · LEKCJA 18",
        subtitle: "Jak utrzymać dobre nawyki snu przez miesiące i lata.",
        difficulty: "Początkujący",
        readingTime: "6 min czytania",
        content: [
          {
            heading: "Sen to proces, nie cel",
            paras: [
              "Po sześciu tygodniach programu masz już narzędzia, które działają. Kluczem do długoterminowego zdrowia snu nie jest jednak ukończenie programu, lecz przekształcenie wybranych nawyków w codzienną rutynę.",
              "Najważniejsze filary to: regularna pora wstawania, kontrola bodźców, realistyczne oczekiwania oraz świadome radzenie sobie z trudnymi nocami.",
            ],
          },
          {
            heading: "Wybierz swoje niewygodne minimum",
            paras: [
              "Nie musisz być perfekcyjny. Wybierz 2–3 nawyki, które są dla Ciebie najważniejsze i które potrafisz utrzymać nawet w trudniejszych okresach. Dla większości ludzi będzie to stała pora wstawania oraz zasada „łóżko tylko do spania”.",
            ],
          },
          {
            heading: "Sen lubi rutynę",
            paras: [
              "Rytm dobowy nie lubi nagłych skoków. Weekendowe spanie do południa, późne imprezy lub długie drzemki mogą szybko zaburzyć postępy. To nie znaczy, że nie możesz żyć — ale warto planować odstępstwa z rozwagą.",
            ],
          },
        ],
        actionStepTitle: "Zadanie praktyczne",
        actionStep:
          "Zapisz swoje 2–3 kluczowe nawyki snu, których będziesz bronił nawet w trudnych tygodniach. Umieść listę w widocznym miejscu — na przykład przy łóżku lub w telefonie.",
        reflectionTitle: "Refleksja",
        reflection:
          "Które techniki z programu okazały się dla Ciebie najbardziej pomocne? Które z nich chcesz zachować na stałe, a które były trudne do wprowadzenia?",
        faqs: [
          {
            q: "Czy muszę trzymać się programu do końca życia?",
            a: "Nie. Z czasem wiele nawyków staje się naturalnych. Najważniejsze jest utrzymanie kilku filarów, które wspierają Twój rytm.",
          },
          {
            q: "Co jeśli wrócą trudniejsze noce?",
            a: "Pojedyncze trudne noce są normalne. Nie oznaczają powrotu bezsenności. Wróć do podstaw: stała pora wstawania, kontrola bodźców, realistyczne myślenie.",
          },
        ],
        ctaLabel: "Wróć do strony głównej programu",
        ctaHref: "/program",
        seoTitle: "Długoterminowe zdrowie snu: jak utrzymać efekty CBT-I | Somna",
        seoDescription:
          "Praktyczne wskazówki, jak zachować dobre nawyki snu na dłużej i chronić efekty terapii CBT-I.",
        keywords: [
          "zdrowie snu",
          "utrzymanie efektów CBT-I",
          "nawyki snu",
          "długoterminowy sen",
        ],
      },
    },
  },
];
