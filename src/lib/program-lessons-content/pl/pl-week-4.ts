// Tydzień 4 — Relaksacja i myśli (lekcje 10-12)
// Źródło: natywna polska wersja programu CBT-I Somna.
import type { LessonContent } from "../../program-lessons";

export const plWeek4Lessons: LessonContent[] = [
  // ───────────────────────── Lekcja 10: Natłok myśli w nocy ─────────────────────────
  {
    slug: "racing-thoughts-at-night",
    weekNumber: 4,
    weekSlug: "week-4",
    lessonNumber: 10,
    estimatedMinutes: 6,
    relatedLessonSlugs: [
      "relaxation-techniques",
      "breathing-exercises-for-sleep",
      "common-insomnia-thoughts",
    ],
    i18n: {
      pl: {
        title: "Gdy w nocy głowa nie milknie",
        eyebrow: "TYDZIEŃ 4 · LEKCJA 10",
        subtitle: "Techniki radzenia sobie z natłokiem myśli i lękiem przed snem.",
        difficulty: "Średniozaawansowany",
        readingTime: "6 min czytania",
        content: [
          {
            heading: "Dlaczego myśli przyspieszają wieczorem",
            paras: [
              "W ciągu dnia jesteś zajęty, rozpraszany, w ruchu. Gdy wieczorem zwalniasz i kładziesz się do łóżka, niechlubny efekt uboczny ciszy jest taki, że umysł wreszcie ma przestrzeń, by „zrobić nadgodziny”.",
              "To nie znaczy, że masz więcej problemów niż inni. To znaczy, że Twój umysł nauczył się używać łóżka jako miejsca do rozwiązywania życia. CBT-I pomaga mu nauczyć się czegoś innego.",
            ],
          },
          {
            heading: "Technika czasu na zmartwienia",
            paras: [
              "Ustal 15–20 minut wieczorem, na co najmniej godzinę przed snem, jako czas przeznaczony wyłącznie na zmartwienia. Usiądź z dziennikiem i zapisz wszystko, co Cię trapi oraz jedną najprostszą następną czynność dla każdego problemu.",
              "Kiedy później w łóżku pojawią się myśli, przypomnij sobie: „To już było w moim czasie na zmartwienia. Jutro mogę do tego wrócić”. To proste przekierowanie z czasem staje się coraz skuteczniejsze.",
            ],
          },
          {
            heading: "Kiedy myśli są po prostu hałasem",
            paras: [
              "Nie wszystkie myśli wymagają rozwiązania. Część z nich to tylko głośny szum zmęczonego umysłu. W takich momentach pomaga przenieść uwagę na coś fizycznego: oddech, napięcie mięśniowe, dźwięki w pokoju.",
            ],
          },
        ],
        actionStepTitle: "Zadanie praktyczne",
        actionStep:
          "Zaplanuj swój pierwszy „czas na zmartwienia” na dziś wieczór. Przygotuj dziennik i wybierz stałą godzinę. Kiedy później położysz się do łóżka, użyj zdania: „To już tam było. Teraz czas odpocząć”.",
        reflectionTitle: "Refleksja",
        reflection:
          "Jakie tematy najczęściej pojawiają się w Twojej głowie w nocy? Czy są to sprawy do załatwienia, czy raczej powtarzające się, nieproduktywne koła myślowe?",
        faqs: [
          {
            q: "A jeśli naprawdę muszę o czymś pomyśleć przed snem?",
            a: "Jeśli coś ważnego wymaga rozwiązania, zapisz to w czasie na zmartwienia. W łóżku nie podejmuj decyzji — to nie jest dobre miejsce ani dobry czas.",
          },
          {
            q: "Czy medytacja pomoże na natłok myśli?",
            a: "Tak, ale nie od razu. Medytacja uczy obserwowania myśli bez wchodzenia z nimi w interakcję. Efekt rośnie z regularną praktyką.",
          },
        ],
        ctaLabel: "Wypróbuj oddychanie 4-7-8",
        ctaHref: "/program/week-4/breathing-exercises-for-sleep",
        seoTitle: "Natłok myśli w nocy: jak sobie radzić | Somna CBT-I",
        seoDescription:
          "Poznaj strategie CBT-I do łagodzenia wieczornego lęku i natłoku myśli, które utrudniają zasypianie.",
        keywords: [
          "natłok myśli w nocy",
          "lęk przed snem",
          "ruminacje",
          "CBT-I",
        ],
      },
    },
  },

  // ───────────────────────── Lekcja 11: Techniki relaksacyjne przed snem ─────────────────────────
  {
    slug: "relaxation-techniques",
    weekNumber: 4,
    weekSlug: "week-4",
    lessonNumber: 11,
    estimatedMinutes: 7,
    relatedLessonSlugs: [
      "racing-thoughts-at-night",
      "breathing-exercises-for-sleep",
      "leaving-bed-without-frustration",
    ],
    i18n: {
      pl: {
        title: "Techniki relaksacyjne przed snem",
        eyebrow: "TYDZIEŃ 4 · LEKCJA 11",
        subtitle: "Skanowanie ciała, progresywna relaksacja mięśni i wieczorny rytuał.",
        difficulty: "Średniozaawansowany",
        readingTime: "7 min czytania",
        content: [
          {
            heading: "Relaksacja to umiejętność",
            paras: [
              "Wielu ludzi mówi: „Nie umiem się zrelaksować”. To jakby powiedzieć „nie umiem grać na gitarze” bez wcześniejszej praktyki. Relaksacja jest umiejętnością, która rośnie wraz z regularnym treningiem.",
              "W CBT-I techniki relaksacyjne nie zastępują podstawowych metod, takich jak kontrola bodźców czy ograniczenie snu, ale stanowią cenne wsparcie — szczególnie gdy ciało jest napięte, a umysł niespokojny.",
            ],
          },
          {
            heading: "Progresywna relaksacja mięśni",
            paras: [
              "Polega na naprzemiennym napinaniu i rozluźnianiu grup mięśniowych. Zacznij od stóp: mocno napnij mięśnie na kilka sekund, a potem całkowicie je rozluźnij. Przechodź stopniowo w górę: łydki, uda, brzuch, dłonie, przedramiona, ramiona, szyja, twarz.",
              "Kluczem jest zauważenie kontrastu między napięciem a rozluźnieniem. Z czasem ciało uczy się samodzielnie przechodzić w stan spoczynku.",
            ],
          },
          {
            heading: "Skanowanie ciała",
            paras: [
              "Skanowanie ciała polega na powolnym przesuwaniu uwagi przez kolejne części ciała bez oceniania. Zauważasz ciepło, napięcie, puls, oddech. Nie zmieniasz niczego na siłę — po prostu jesteś.",
            ],
          },
        ],
        actionStepTitle: "Zadanie praktyczne",
        actionStep:
          "Dzisiaj wieczorem poświęć 10 minut na jedną z technik: progresywną relaksację lub skanowanie ciała. Wykonaj ją poza łóżkiem, w fotelu lub na macie, a do sypialni wróć dopiero wtedy, gdy poczujesz senność.",
        reflectionTitle: "Refleksja",
        reflection:
          "Która część Twojego ciała najczęściej jest napięta wieczorem? Szczęka, barki, brzuch, dłonie? Zauważenie tego to pierwszy krok do rozluźnienia.",
        faqs: [
          {
            q: "Ile czasu dziennie powinienem poświęcać na relaksację?",
            a: "Nawet 10 minut dziennie przez kilka tygodni daje zauważalne efekty. Ważniejsza jest regularność niż długość pojedynczej sesji.",
          },
          {
            q: "Czy relaksacja może zastąpić kontrolę bodźców?",
            a: "Nie. Relaksacja wspiera proces, ale podstawowymi filarami CBT-I pozostają: stała pora wstawania, kontrola bodźców i ograniczenie czasu w łóżku.",
          },
        ],
        ctaLabel: "Posłuchaj dźwięków relaksacyjnych",
        ctaHref: "/relax",
        seoTitle: "Techniki relaksacyjne przed snem | Somna CBT-I",
        seoDescription:
          "Praktyczny przegląd technik relaksacyjnych: skanowanie ciała, progresywna relaksacja mięśni i budowanie wieczornego rytuału.",
        keywords: [
          "relaksacja przed snem",
          "skanowanie ciała",
          "progresywna relaksacja mięśni",
          "CBT-I",
        ],
      },
    },
  },

  // ───────────────────────── Lekcja 12: Ćwiczenia oddechowe na lepszy sen ─────────────────────────
  {
    slug: "breathing-exercises-for-sleep",
    weekNumber: 4,
    weekSlug: "week-4",
    lessonNumber: 12,
    estimatedMinutes: 6,
    relatedLessonSlugs: [
      "relaxation-techniques",
      "racing-thoughts-at-night",
      "how-sleep-works",
    ],
    i18n: {
      pl: {
        title: "Ćwiczenia oddechowe na lepszy sen",
        eyebrow: "TYDZIEŃ 4 · LEKCJA 12",
        subtitle: "Jak wykorzystać oddech, by przełączyć układ nerwowy w tryb spoczynku.",
        difficulty: "Początkujący",
        readingTime: "6 min czytania",
        content: [
          {
            heading: "Oddech jako most do snu",
            paras: [
              "Oddech jest jedynym układem w ciele, który działa automatycznie, ale który możesz też świadomie kontrolować. Dzięki temu staje się potężnym narzędziem do łagodzenia napięcia i przygotowania organizmu do snu.",
              "Wolny, głęboki oddech aktywuje układ przywspółczulny — gałąź układu nerwowego odpowiedzialną za odpoczynek, trawienie i regenerację.",
            ],
          },
          {
            heading: "Technika 4-7-8",
            paras: [
              "Weź powoli wdech przez nos, licząc do czterech.",
              "Wstrzymaj oddech, licząc do siedmiu.",
              "Wypuść powietrze przez usta, licząc do ośmiu, z delikatnym dźwiękiem.",
              "Powtórz cykl cztery razy. Tempo jest ważniejsze niż perfekcja — jeśli liczenie do siedmiu jest trudne, skróć wstrzymanie, ale zachowaj stosunek wydłużonego wydechu.",
            ],
          },
          {
            heading: "Oddychanie przeponowe",
            paras: [
              "Połóż jedną dłoń na klatce piersiowej, a drugą na brzuchu. Podczas wdechu brzuch ma delikatnie unosić się pod dłonią, podczas gdy klatka piersiowa pozostaje spokojna. To proste ćwiczenie uczy ciało fizycznego rozluźnienia.",
            ],
          },
        ],
        actionStepTitle: "Zadanie praktyczne",
        actionStep:
          "Wykonaj dziś wieczorem cztery cykle techniki 4-7-8, zanim położysz się do łóżka. Obserwuj, jak zmienia się napięcie w ciele po każdym wydechu. Nie oczekuj natychmiastowych efektów — regularność jest kluczem.",
        reflectionTitle: "Refleksja",
        reflection:
          "Jak oddychasz, gdy jesteś zestresowany? Płytko, w klatce piersiowej, szybko? Zauważenie tego wzoru to pierwszy krok do jego zmiany.",
        faqs: [
          {
            q: "Czy ćwiczenia oddechowe działają od razu?",
            a: "Niektórzy odczuwają ulgę od razu, ale większość ludzi potrzebuje kilku dni lub tygodni regularnej praktyki, by oddech automatycznie kojarzył się ze spokojem.",
          },
          {
            q: "Czy mogę robić ćwiczenia oddechowe w łóżku?",
            a: "Możesz, ale ostrożnie. Jeśli w łóżku zaczniesz ćwiczyć zbyt intensywnie, może to stać się kolejną czynnością kojarzoną z łóżkiem. Lepiej robić je wcześniej, w fotelu.",
          },
        ],
        ctaLabel: "Przejdź do artykułu o oddychaniu 4-7-8",
        ctaHref: "/learn/4-7-8-breathing",
        seoTitle: "Ćwiczenia oddechowe na bezsenność | Somna CBT-I",
        seoDescription:
          "Poznaj proste techniki oddechowe, które aktywują układ przywspółczulny i pomagają zasnąć.",
        keywords: [
          "oddech a sen",
          "ćwiczenia oddechowe",
          "oddychanie przed snem",
          "CBT-I",
        ],
      },
    },
  },
];
