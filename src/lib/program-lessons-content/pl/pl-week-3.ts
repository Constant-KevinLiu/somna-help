// Tydzień 3 — Ograniczenie snu (lekcje 7-9)
// Źródło: natywna polska wersja programu CBT-I Somna.
import type { LessonContent } from "../../program-lessons";

export const plWeek3Lessons: LessonContent[] = [
  // ───────────────────────── Lekcja 7: Co to jest wydajność snu ─────────────────────────
  {
    slug: "what-is-sleep-efficiency",
    weekNumber: 3,
    weekSlug: "week-3",
    lessonNumber: 7,
    estimatedMinutes: 6,
    relatedLessonSlugs: [
      "sleep-restriction-therapy",
      "sleep-restriction-mistakes",
      "how-sleep-works",
    ],
    i18n: {
      pl: {
        title: "Co to jest wydajność snu?",
        eyebrow: "TYDZIEŃ 3 · LEKCJA 7",
        subtitle: "Dlaczego czas w łóżku to nie to samo co czas snu.",
        difficulty: "Średniozaawansowany",
        readingTime: "6 min czytania",
        content: [
          {
            heading: "Jakość zamiast ilości",
            paras: [
              "Aby realnie poprawić odpoczynek, potrzebujemy miarodajnego wskaźnika, który skupia się na prawdziwej jakości nocy, a nie tylko na liczbie godzin spędzonych w łóżku. W CBT-I takim podstawowym wskaźnikiem jest wydajność snu.",
              "Wydajność snu to dokładny, matematyczny stosunek całkowitego czasu rzeczywistego snu do całkowitego czasu spędzonego w łóżku, wyrażony w procentach: wydajność snu = (całkowity czas snu ÷ całkowity czas w łóżku) × 100%.",
            ],
          },
          {
            heading: "Jasne porównanie",
            paras: [
              "Niespokojna noc: spędzasz w łóżku 8 godzin, ale z powodu przewracania się i wybudek śpisz tylko 6 godzin. Twoja wydajność snu wynosi 75%.",
              "Spokojna noc: spędzasz w łóżku 6,5 godziny, ale śpisz głęboko przez 6 godzin. Twoja wydajność snu rośnie do 92%.",
              "U zdrowego, regularnie śpiącego człowieka wydajność snu naturalnie przekracza 85%. U osoby z przewlekłą bezsennością często spada poniżej 75% — co oznacza, że znaczna część nocy mija na ćwiczeniu czuwania i niepokoju w łóżku.",
            ],
          },
          {
            heading: "Nowy cel",
            paras: [
              "CBT-I całkowicie zmienia cel. Zamiast stresującego dążenia do ilości (więcej godzin w łóżku), skupiamy się na maksymalizacji jakości (spójnego, nieprzerwanego snu). Skracając czas w łóżku do poziomu zbliżonego do faktycznej zdolności snu, eliminujemy puste, napięte przestrzenie w nocy.",
            ],
          },
        ],
        actionStepTitle: "Zadanie praktyczne",
        actionStep:
          "Oblicz swoją linię bazową. Spójrz na wpisy w dzienniku snu z ostatniego tygodnia. Uśrednij całkowity czas rzeczywistego snu, podziel przez średni całkowity czas w łóżku i pomnóż przez 100. Zapisz ten wynik procentowy w panelu danych — posłuży nam jako kompas w kolejnej fazie.",
        reflectionTitle: "Refleksja",
        reflection:
          "Jak się czujesz, patrząc na noc przez pryzmat wydajności, a nie surowej liczby godzin? Czy przynosi to ulgę, że krótszy czas w łóżku może być drogą do głębszego odpoczynku?",
        faqs: [
          {
            q: "Jaki jest docelowy poziom wydajności snu?",
            a: "W terapii CBT-I dążymy do utrzymania wydajności snu na poziomie około 85% lub wyższym. Osiągnięcie tego pozwala stopniowo wydłużać czas w łóżku bez powrotu bezsenności.",
          },
          {
            q: "Co jeśli moja wydajność snu jest już wysoka, ale wciąż czuję się wyczerpany?",
            a: "Wysoka wydajność przy niewielkiej całkowitej ilości snu może oznaczać, że śpisz zbyt krótko. W takim przypadku stopniowo zwiększamy czas w łóżku, zachowując wysoką efektywność.",
          },
        ],
        ctaLabel: "Otwórz dziennik snu",
        ctaHref: "/diary",
        seoTitle: "Wydajność snu: dlaczego czas w łóżku to nie sen | Somna CBT-I",
        seoDescription:
          "Naucz się obliczać wydajność snu i zrozum, dlaczego krótszy czas w łóżku może poprawić jakość snu.",
        keywords: ["wydajność snu", "jakość snu", "czas w łóżku", "CBT-I"],
      },
    },
  },

  // ───────────────────────── Lekcja 8: Terapia ograniczenia snu ─────────────────────────
  {
    slug: "sleep-restriction-therapy",
    weekNumber: 3,
    weekSlug: "week-3",
    lessonNumber: 8,
    estimatedMinutes: 7,
    relatedLessonSlugs: [
      "what-is-sleep-efficiency",
      "sleep-restriction-mistakes",
      "stimulus-control-science",
    ],
    i18n: {
      pl: {
        title: "Terapia ograniczenia snu",
        eyebrow: "TYDZIEŃ 3 · LEKCJA 8",
        subtitle: "Jak bezpiecznie skrócić czas w łóżku, by sen stał się głębszy.",
        difficulty: "Średniozaawansowany",
        readingTime: "7 min czytania",
        content: [
          {
            heading: "Intuicyjnie trudna, naukowo skuteczna",
            paras: [
              "Terapia ograniczenia snu brzmi przerażająco: świadomie ograniczamy czas spędzany w łóżku. W rzeczywistości jednak nie odbieramy snu — odbieramy czas spędzany na czuwaniu w łóżku.",
              "Cel jest prosty: zwiększyć presję snu i skondensować sen w krótszym oknie czasowym, dzięki czemu noc staje się głębsza, bardziej ciągła i bardziej odpoczywająca.",
            ],
          },
          {
            heading: "Jak obliczyć docelowy czas w łóżku",
            paras: [
              "Krok 1: z dziennika snu oblicz średnią liczbę godzin rzeczywistego snu na noc (nie czas w łóżku).",
              "Krok 2: dodaj do tego około 30 minut jako bufor.",
              "Krok 3: ustal stałą porę wstawania, a późniejszą porę snu wynikającą z wyliczonego czasu w łóżku.",
              "Na przykład: jeśli średnio śpisz 5,5 godziny, docelowy czas w łóżku to około 6 godzin. Przy wstawaniu o 6:30 sen zaczyna się o 00:30.",
            ],
          },
          {
            heading: "Zasady bezpieczeństwa",
            paras: [
              "Minimalny czas w łóżku w terapii CBT-I to zazwyczaj 5–5,5 godziny. Nigdy nie powinien być krótszy, szczególnie jeśli prowadzisz pojazdy, obsługujesz maszyny lub masz choroby współistniejące. Jeśli masz wątpliwości, skonsultuj plan z lekarzem.",
            ],
          },
        ],
        actionStepTitle: "Zadanie praktyczne",
        actionStep:
          "Na podstawie ostatniego tygodnia dziennika snu oblicz swój docelowy czas w łóżku. Ustal stałą porę wstawania na najbliższe 7 dni i wypisz planowaną porę snu. Nie zmieniaj jej, nawet jeśli pewnej nocy zaśniesz później.",
        reflectionTitle: "Refleksja",
        reflection:
          "Jakie obawy budzi w Tobie myśl o skróceniu czasu w łóżku? Czy obawiasz się, że będziesz jeszcze bardziej zmęczony, czy że nie dasz rady? Zapisz te obawy — będziemy do nich wracać wraz z postępami.",
        faqs: [
          {
            q: "Czy terapia ograniczenia snu oznacza, że będę mniej spał?",
            a: "Nie na dłuższą metę. Na początku czas w łóżku jest krótszy, ale sen staje się głębszy i bardziej efektywny. Wraz z poprawą wydajności snu stopniowo wydłużamy czas w łóżku.",
          },
          {
            q: "Kiedy wydłużać czas w łóżku?",
            a: "Zazwyczaj, gdy średnia wydajność snu przez tydzień przekracza 85–90%, dodajemy 15 minut do czasu w łóżku, zachowując stałą porę wstawania.",
          },
        ],
        ctaLabel: "Zobacz typowe błędy",
        ctaHref: "/program/week-3/sleep-restriction-mistakes",
        seoTitle: "Terapia ograniczenia snu w CBT-I | Somna",
        seoDescription:
          "Praktyczny przewodnik po terapii ograniczenia snu: jak obliczyć docelowy czas w łóżku i stopniowo go zwiększać.",
        keywords: ["ograniczenie snu", "terapia ograniczenia snu", "czas w łóżku", "CBT-I"],
      },
    },
  },

  // ───────────────────────── Lekcja 9: Najczęstsze błędy przy ograniczeniu snu ─────────────────────────
  {
    slug: "sleep-restriction-mistakes",
    weekNumber: 3,
    weekSlug: "week-3",
    lessonNumber: 9,
    estimatedMinutes: 6,
    relatedLessonSlugs: [
      "sleep-restriction-therapy",
      "what-is-sleep-efficiency",
      "leaving-bed-without-frustration",
    ],
    i18n: {
      pl: {
        title: "Błędy przy ograniczeniu snu",
        eyebrow: "TYDZIEŃ 3 · LEKCJA 9",
        subtitle: "Czego unikać, by technika działała i nie naruszała bezpieczeństwa.",
        difficulty: "Średniozaawansowany",
        readingTime: "6 min czytania",
        content: [
          {
            heading: "Zbyt krótki czas w łóżku",
            paras: [
              "Najczęstszy błąd to przesadne skrócenie czasu w łóżku poniżej bezpiecznego minimum. Presja snu jest pomocna, ale drastyczne ograniczenie prowadzi do senności w ciągu dnia, mikrosnów i większego ryzyka wypadków.",
              "Pamiętaj: dolna granica to zazwyczaj 5–5,5 godziny. Jeśli czujesz, że jesteś zbyt słaby, bezpieczeństwo jest ważniejsze niż sztywne trzymanie się planu.",
            ],
          },
          {
            heading: "Zmienne pory wstawania",
            paras: [
              "Terapia ograniczenia snu opiera się na stałej porze wstawania. Jeśli wstajesz o różnych godzinach, tracisz kotwicę rytmu dobowego i utrudniasz ocenę postępów. Weekendowe „doganianie snu” szczególnie psuje efekt.",
            ],
          },
          {
            heading: "Spanie w ciągu dnia",
            paras: [
              "Długie drzemki w ciągu dnia obniżają presję snu i osłabiają działanie terapii. Jeśli musisz odpocząć, ogranicz drzemkę do 10–20 minut przed godziną 15:00.",
            ],
          },
        ],
        actionStepTitle: "Zadanie praktyczne",
        actionStep:
          "Sprawdź swój plan na najbliższy tydzień. Czy czas w łóżku nie jest zbyt krótki? Czy pora wstawania jest realistyczna i stała? Czy planujesz drzemki? Zapisz jedną korektę, którą wprowadzisz już dziś.",
        reflectionTitle: "Refleksja",
        reflection:
          "Który z błędów jest dla Ciebie najbardziej realny? Co możesz zrobić, by uniknąć go w nadchodzącym tygodniu?",
        faqs: [
          {
            q: "Co zrobić, jeśli jednej nocy nie wytrzymam i pójdę spać wcześniej?",
            a: "Pojedyncza noc to nie porażka. Ważne, by następnego dnia wrócić do planu i utrzymać stałą porę wstawania. Nie próbuj „nadganiać” snu kolejnej nocy.",
          },
          {
            q: "Czy mogę korzystać z terapii ograniczenia snu, jeśli mam depresję lub zaburzenia lękowe?",
            a: "W takich przypadkach szczególnie ważna jest konsultacja z lekarzem lub terapeutą. Ograniczenie snu może tymczasowo nasilać zmęczenie, dlatego wymaga indywidualnej oceny.",
          },
        ],
        ctaLabel: "Przejdź do tygodnia o relaksacji",
        ctaHref: "/program/week-4/racing-thoughts-at-night",
        seoTitle: "Błędy przy ograniczeniu snu — jak ich unikać | Somna CBT-I",
        seoDescription:
          "Najczęstsze pułapki podczas terapii ograniczenia snu i wskazówki, jak stosować ją bezpiecznie i skutecznie.",
        keywords: [
          "błędy ograniczenia snu",
          "bezpieczeństwo terapii snu",
          "drzemki a bezsenność",
          "CBT-I",
        ],
      },
    },
  },
];
