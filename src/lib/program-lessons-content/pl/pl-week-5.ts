// Tydzień 5 — Myśli i przekonania (lekcje 13-15)
// Źródło: natywna polska wersja programu CBT-I Somna.
import type { LessonContent } from "../../program-lessons";

export const plWeek5Lessons: LessonContent[] = [
  // ───────────────────────── Lekcja 13: Typowe myśli przy bezsenności ─────────────────────────
  {
    slug: "common-insomnia-thoughts",
    weekNumber: 5,
    weekSlug: "week-5",
    lessonNumber: 13,
    estimatedMinutes: 7,
    relatedLessonSlugs: [
      "cbti-changes-sleep-beliefs",
      "realistic-sleep-expectations",
      "racing-thoughts-at-night",
    ],
    i18n: {
      pl: {
        title: "Typowe myśli przy bezsenności",
        eyebrow: "TYDZIEŃ 5 · LEKCJA 13",
        subtitle: "„Muszę dziś dobrze spać” i inne pułapki myślowe.",
        difficulty: "Średniozaawansowany",
        readingTime: "7 min czytania",
        content: [
          {
            heading: "Myśli, które podtrzymują bezsenność",
            paras: [
              "Bezsenność nie żyje tylko w ciele — żyje również w myślach. Są pewne wzorce myślowe, które pojawiają się wieczorem i jeszcze bardziej nakręcają lęk przed snem. Im częściej się powtarzają, tym silniejszy staje się ich wpływ.",
              "Najczęstsze to: „Muszę dziś dobrze spać”, „Jutro będzie katastrofa, jeśli nie zasnę”, „Mój organizm już nigdy nie nauczy się spać”, „Inni mogą spać, a ja nie”.",
            ],
          },
          {
            heading: "Katastrofizowanie",
            paras: [
              "Katastrofizowanie polega na automatycznym zakładaniu najgorszego możliwego scenariusza. Jedna nieprzespana noc staje się „zniszczeniem całego tygodnia”, a zmęczenie — „niezdolnością do życia”. Te myśli sprawiają, że układ nerwowy traktuje sen jak zagrożenie.",
            ],
          },
          {
            heading: "Jak rozpoznać pułapkę",
            paras: [
              "Pierwszym krokiem jest zauważenie, że myśl jest tylko myślą, a nie faktem. Gdy pojawi się „jutro będzie katastrofa”, możesz zapytać siebie: „Czy to przewidywanie, czy fakt?” oraz „Czy kiedykolwiek zdarzyło mi się przetrwać zmęczony dzień?” — to dobre pytania.",
            ],
          },
        ],
        actionStepTitle: "Zadanie praktyczne",
        actionStep:
          "Przez najbliższe trzy noce zapisuj w dzienniku snu lub na kartce najczęstsze myśli pojawiające się przed snem. Nie oceniaj ich — po prostu je złap w słowa. Zauważenie wzorca to połowa sukcesu.",
        reflectionTitle: "Refleksja",
        reflection:
          "Która myśl o śnie pojawia się u Ciebie najczęściej? Co ona zakłada o jutrze? Czy to założenie zawsze się sprawdzało?",
        faqs: [
          {
            q: "Czy myśli naprawdę mogą wpływać na sen?",
            a: "Tak. Lęk przed snem aktywuje układ współczulny, który fizjologicznie przeciwdziała zasypianiu. Myśli i ciało działają razem.",
          },
          {
            q: "Czy powinienem tłumić te myśli?",
            a: "Nie. Tłumienie zwykle prowadzi do efektu bumerangu. Lepiej je zauważyć, nazwać i przepisać w bardziej realistyczny sposób.",
          },
        ],
        ctaLabel: "Dalej: realistyczne oczekiwania",
        ctaHref: "/program/week-5/realistic-sleep-expectations",
        seoTitle: "Typowe myśli przy bezsenności | Somna CBT-I",
        seoDescription:
          "Poznaj najczęstsze niepomocne myśli przy bezsenności i naucz się je rozpoznawać, zanim przejmą kontrolę nad snem.",
        keywords: [
          "myśli przy bezsenności",
          "lęk przed snem",
          "katastrofizowanie",
          "CBT-I",
        ],
      },
    },
  },

  // ───────────────────────── Lekcja 14: Jak CBT-I zmienia przekonania o śnie ─────────────────────────
  {
    slug: "cbti-changes-sleep-beliefs",
    weekNumber: 5,
    weekSlug: "week-5",
    lessonNumber: 14,
    estimatedMinutes: 7,
    relatedLessonSlugs: [
      "common-insomnia-thoughts",
      "realistic-sleep-expectations",
      "sleep-restriction-therapy",
    ],
    i18n: {
      pl: {
        title: "Jak CBT-I zmienia przekonania o śnie",
        eyebrow: "TYDZIEŃ 5 · LEKCJA 14",
        subtitle: "Restrukturyzacja poznawcza w praktyce, krok po kroku.",
        difficulty: "Zaawansowany",
        readingTime: "7 min czytania",
        content: [
          {
            heading: "Myśl → emocja → ciało",
            paras: [
              "W CBT-I zakładamy, że sposób, w jaki myślimy o śnie, wpływa na emocje, a emocje wpływają na ciało. Niepomocna myśl wieczorem generuje lęk, który fizjologicznie blokuje sen.",
              "Restrukturyzacja poznawcza polega na identyfikowaniu tych myśli i sprawdzaniu, czy są one rzeczywiście prawdziwe i pomocne.",
            ],
          },
          {
            heading: "Model pracy z myślą",
            paras: [
              "Krok 1: złap myśl. Zapisz dokładnie, co pojawiło się w głowie.",
              "Krok 2: nazwij emocję. Lęk? Frustracja? Poczucie winy?",
              "Krok 3: zadaj pytania. Czy ta myśl jest faktem czy przewidywaniem? Czy mam dowody na jej prawdziwość? Czy myślałem tak wcześniej i czy rzeczywiście było tak źle?",
              "Krok 4: przepisz myśl. Stwórz bardziej realistyczną, życzliwą wersję.",
            ],
          },
          {
            heading: "Przykład w praktyce",
            paras: [
              "Myśl: „Jeśli dziś nie zasnę, jutro nie dam rady pracować”. Emocja: lęk. Pytania: Czy zawsze, gdy spałem słabo, byłem bezużyteczny następnego dnia? Czy istnieją dowody na przeciw? Przepisana myśl: „Bywałem zmęczony po słabej nocy, ale zawsze jakoś dawałem radę. Jutro też dam sobie radę, nawet jeśli nie będzie idealnie”.",
            ],
          },
        ],
        actionStepTitle: "Zadanie praktyczne",
        actionStep:
          "Wybierz jedną niepomocną myśl, która pojawia się u Ciebie przed snem. Zapisz ją w dzienniku i przejdź przez cztery kroki restrukturyzacji poznawczej. Trzymaj tę kartkę przy łóżku.",
        reflectionTitle: "Refleksja",
        reflection:
          "Jaką jedną myśl o śnie chciałbyś zmienić najbardziej? Dlaczego ona jest dla Ciebie tak wiarygodna? Co musiałoby się stać, byś zaczął jej nie ufać?",
        faqs: [
          {
            q: "Czy restrukturyzacja poznawcza to pozytywne myślenie?",
            a: "Nie. To nie jest wymuszanie optymizmu. To sprawdzanie rzeczywistości i tworzenie myśli, które są bardziej zgodne z faktami i mniej napędzają lęk.",
          },
          {
            q: "Jak długo trwa zmiana przekonań?",
            a: "Zazwyczaj tygodnie do miesięcy. Nowe myśli stają się naturalne dopiero po wielokrotnym powtórzeniu i potwierdzeniu w codziennym życiu.",
          },
        ],
        ctaLabel: "Zobacz typowe myśli",
        ctaHref: "/program/week-5/common-insomnia-thoughts",
        seoTitle: "Zmiana przekonań o śnie dzięki CBT-I | Somna",
        seoDescription:
          "Praktyczne wprowadzenie do restrukturyzacji poznawczej: jak korygować niepomocne przekonania o śnie.",
        keywords: [
          "restrukturyzacja poznawcza",
          "przekonania o śnie",
          "CBT-I",
          "myślenie o śnie",
        ],
      },
    },
  },

  // ───────────────────────── Lekcja 15: Realistyczne oczekiwania wobec snu ─────────────────────────
  {
    slug: "realistic-sleep-expectations",
    weekNumber: 5,
    weekSlug: "week-5",
    lessonNumber: 15,
    estimatedMinutes: 6,
    relatedLessonSlugs: [
      "common-insomnia-thoughts",
      "cbti-changes-sleep-beliefs",
      "trying-harder-makes-sleep-worse",
    ],
    i18n: {
      pl: {
        title: "Realistyczne oczekiwania wobec snu",
        eyebrow: "TYDZIEŃ 5 · LEKCJA 15",
        subtitle: "Ile snu naprawdę potrzebujesz i dlaczego perfekcjonizm szkodzi.",
        difficulty: "Średniozaawansowany",
        readingTime: "6 min czytania",
        content: [
          {
            heading: "Pułapka idealnego snu",
            paras: [
              "Dążenie do „idealnej nocy” często pogarsza bezsenność. Kiedy wymagasz od siebie, że musisz zasnąć w ciągu 10 minut, przeżyć 8 godzin głębokiego snu i obudzić się pełen energii, każda odchylająca się noc staje się porażką.",
              "W rzeczywistości sen naturalnie zmienia się z nocy na noc. Wpływają na niego: stres, aktywność fizyczna, posiłki, pogoda, emocje. Nie ma dwóch identycznych nocy.",
            ],
          },
          {
            heading: "Indywidualne zapotrzebowanie",
            paras: [
              "Choć większość dorosłych funkcjonuje najlepiej po 7–9 godzinach snu, zapotrzebowanie jest indywidualne. Niektórzy czują się dobrze po 6,5 godziny, inni potrzebują ponad 8. Ważniejsza od liczby godzin jest jakość i regularność.",
            ],
          },
          {
            heading: "Dobra wystarczająco",
            paras: [
              "Zamiast dążyć do idealnego snu, postaw sobie za cel sen wystarczająco dobry: regularny, wspierający funkcjonowanie w ciągu dnia, bez konieczności doskonałej wydajności każdej nocy.",
            ],
          },
        ],
        actionStepTitle: "Zadanie praktyczne",
        actionStep:
          "Zapisz swoje obecne oczekiwania wobec snu. Następnie przepisz je w bardziej realistyczny sposób. Na przykład zamiast „Muszę spać 8 godzin” napisz „Chcę zachować regularność i czuć się w miarę wypoczęty w ciągu dnia”.",
        reflectionTitle: "Refleksja",
        reflection:
          "Jak perfekcjonizm wokół snu wpływa na Twoje samopoczucie? Czy oczekiwania, które stawiasz sobie co do snu, są realistyczne i życzliwe?",
        faqs: [
          {
            q: "Czy jedna zła noc zepsuje cały tydzień?",
            a: "Nie. Ludzki organizm jest elastyczny i dobrze radzi sobie z pojedynczymi nocami o krótszym śnie. Problemem staje się dopiero chroniczny wzorzec.",
          },
          {
            q: "Jak ustalić swoje realne zapotrzebowanie na sen?",
            a: "Przez kilka tygodni obserwuj, po ilu godzinach snu czujesz się najlepiej w ciągu dnia — pod warunkiem, że sen jest regularny. Dziennik snu bardzo tu pomaga.",
          },
        ],
        ctaLabel: "Przejdź do tygodnia utrzymania efektów",
        ctaHref: "/program/week-6/preventing-relapse",
        seoTitle: "Realistyczne oczekiwania wobec snu | Somna CBT-I",
        seoDescription:
          "Dlaczego dążenie do idealnego snu może pogarszać bezsenność i jak ustalić zdrowe, realistyczne oczekiwania.",
        keywords: [
          "oczekiwania wobec snu",
          "perfekcjonizm snu",
          "ile snu potrzebuję",
          "CBT-I",
        ],
      },
    },
  },
];
