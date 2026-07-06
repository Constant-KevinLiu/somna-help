// Tydzień 2 — Kontrola bodźców (lekcje 4-6)
// Źródło: natywna polska wersja programu CBT-I Somna.
import type { LessonContent } from "../../program-lessons";

export const plWeek2Lessons: LessonContent[] = [
  // ───────────────────────── Lekcja 4: Dlaczego mózg nie kojarzy łóżka ze snem ─────────────────────────
  {
    slug: "bed-sleep-association",
    weekNumber: 2,
    weekSlug: "week-2",
    lessonNumber: 4,
    estimatedMinutes: 6,
    relatedLessonSlugs: [
      "stimulus-control-science",
      "leaving-bed-without-frustration",
      "trying-harder-makes-sleep-worse",
    ],
    i18n: {
      pl: {
        title: "Dlaczego mózg nie kojarzy łóżka ze snem",
        eyebrow: "TYDZIEŃ 2 · LEKCJA 4",
        subtitle: "Jak warunkowanie klasyczne niszczy połączenie łóżko–sen i jak je odbudować.",
        difficulty: "Początkujący",
        readingTime: "6 min czytania",
        content: [
          {
            heading: "Łóżko jako sygnał",
            paras: [
              "Mózg uczy się przez kojarzenie. Jeśli większość czasu w łóżku spędzasz na czuwaniu, zmartwieniach lub przeglądaniu telefonu, mózg zaczyna kojarzyć łóżko z aktywnością, a nie z odpoczynkiem.",
              "W efekcie samo położenie się do łóżka może uruchamiać nieświadomy sygnał: „czas być czujnym”. To właśnie dlatego wielu ludzi czuje się sennych na kanapie, ale natychmiast budzi się w pełni energii, gdy tylko głowa dotyka poduszki.",
            ],
          },
          {
            heading: "Reguła jednego przeznaczenia",
            paras: [
              "Technika kontroli bodźców opiera się na prostym założeniu: łóżko służy tylko do snu oraz seksu. Żadnego oglądania seriali, pracy, jedzenia, długich rozmów ani przeglądania internetu.",
              "Im konsekwentniej będziesz przestrzegać tej reguły, tym szybciej mózg odbuduje silne skojarzenie: łóżko = sen. To jedna z najpotężniejszych zmian w całym programie CBT-I.",
            ],
          },
          {
            heading: "Zacznij od dzisiaj",
            paras: [
              "Nie musisz robić tego doskonale. Każda noc, w której używasz łóżka tylko do snu, wzmacnia właściwy związek. Początkowo może być trudno, ale efekt kumuluje się z tygodniami.",
            ],
          },
        ],
        actionStepTitle: "Zadanie praktyczne",
        actionStep:
          "Przez najbliższy tydzień ustal nową zasadę: jeśli nie śpisz, nie przebywaj w łóżku. Jeśli budzisz się w nocy i nie możesz zasnąć — wstań. Zabierz ze sobą telefon lub książkę do innego pomieszczenia i wróć dopiero, gdy poczujesz senność.",
        reflectionTitle: "Refleksja",
        reflection:
          "Co obecnie robisz w łóżku oprócz snu? Które z tych czynności najtrudniej byłoby Ci przenieść gdzie indziej? Dlaczego?",
        faqs: [
          {
            q: "Czy czytanie książki w łóżku jest w porządku?",
            a: "Najlepiej czytać poza sypialnią. Jeśli czytanie pomaga Ci zasnąć, możesz robić to w fotelu w innym pomieszczeniu, a do łóżka chodzić dopiero, gdy oczy same zaczynają się zamykać.",
          },
          {
            q: "A jeśli mam małe mieszkanie i nie mam innego pokoju?",
            a: "Wystarczy, że wstaniesz z łóżka i usiądziesz na krześle lub podłodze w tym samym pokoju, plecami do łóżka. Chodzi o zerwanie fizycznego kontaktu z łóżkiem na czas czuwania.",
          },
        ],
        ctaLabel: "Poznaj techniki relaksacyjne",
        ctaHref: "/program/week-4/relaxation-techniques",
        seoTitle: "Łóżko tylko do spania: kontrola bodźców | Somna CBT-I",
        seoDescription:
          "Dowiedz się, dlaczego ograniczenie aktywności w łóżku wzmacnia sygnał snu i przyspiesza zasypianie.",
        keywords: [
          "łóżko tylko do spania",
          "kontrola bodźców",
          "higiena snu",
          "telefon przed snem",
          "CBT-I",
        ],
      },
    },
  },

  // ───────────────────────── Lekcja 5: Nauka o kontroli bodźców ─────────────────────────
  {
    slug: "stimulus-control-science",
    weekNumber: 2,
    weekSlug: "week-2",
    lessonNumber: 5,
    estimatedMinutes: 6,
    relatedLessonSlugs: [
      "bed-sleep-association",
      "leaving-bed-without-frustration",
      "sleep-restriction-therapy",
    ],
    i18n: {
      pl: {
        title: "Kontrola bodźców w praktyce",
        eyebrow: "TYDZIEŃ 2 · LEKCJA 5",
        subtitle: "Jak działa jedna z najskuteczniejszych technik CBT-I.",
        difficulty: "Średniozaawansowany",
        readingTime: "6 min czytania",
        content: [
          {
            heading: "Zasada jest prosta, skutki potężne",
            paras: [
              "Kontrola bodźców została opracowana przez amerykańskiego psychologa Richarda Bootzina i od dekad pozostaje jedną z najlepiej przebadanych metod leczenia przewlekłej bezsenności.",
              "Jej sedno brzmi: ogranicz czas spędzony w łóżku na czuwaniu, a mózg ponownie nauczy się kojarzyć łóżko z szybkim, naturalnym zaśnięciem.",
            ],
          },
          {
            heading: "Sześć zasad kontroli bodźców",
            paras: [
              "Połóż się do łóżka tylko wtedy, gdy naprawdę jesteś senny.",
              "Używaj łóżka wyłącznie do snu i seksu.",
              "Jeśli nie możesz zasnąć w ciągu około 15–20 minut — wstań.",
              "Wróć do łóżka dopiero, gdy poczujesz senność.",
              "Powtarzaj ten cykl tak długo, jak to konieczne.",
              "Wstawaj o stałej porze, niezależnie od tego, jak spałeś.",
            ],
          },
          {
            heading: "Dlaczego to działa",
            paras: [
              "Każde wstanie z łóżka w trakcie bezsenności przerywa pętlę frustracji. Zamiast trenować ciało w byciu przebudzonym w łóżku, uczysz je, że łóżko to miejsce, w którym sen przychodzi szybko.",
            ],
          },
        ],
        actionStepTitle: "Zadanie praktyczne",
        actionStep:
          "Wypisz dzisiaj na kartce sześć zasad kontroli bodźców i umieść ją przy łóżku. Przez najbliższe siedem nocy traktuj tę kartkę jako swoją instrukcję obsługi, gdy sen nie przychodzi.",
        reflectionTitle: "Refleksja",
        reflection:
          "Która z sześciu zasad wydaje Ci się najtrudniejsza do wprowadzenia? Co stoi na przeszkodzie: nawyk, wygodne łóżko, strach przed zmęczeniem następnego dnia, czy coś innego?",
        faqs: [
          {
            q: "Czy wstawanie w nocy nie rozreguluje jeszcze bardziej snu?",
            a: "Krótkoterminowo może być trudniej, ale długoterminowo przerywasz naukę związku „łóżko = czuwanie”. To inwestycja w szybsze zasypianie w przyszłości.",
          },
          {
            q: "Czy muszę wstawać dokładnie po 15 minutach?",
            a: "Nie chodzi o dokładny czasomierz. Chodzi o to, by nie leżeć w łóżku w stanie frustracji. Gdy czujesz, że sen się oddala i zaczynasz się denerwować — to sygnał, by wstać.",
          },
        ],
        ctaLabel: "Następna lekcja: wychodzenie z łóżka",
        ctaHref: "/program/week-2/leaving-bed-without-frustration",
        seoTitle: "Reguła 15–20 minut przy bezsenności | Somna CBT-I",
        seoDescription:
          "Poznaj praktyczną zasadę kontroli bodźców: wstawaj z łóżka, gdy sen nie przychodzi, by mózg ponownie połączył łóżko ze snem.",
        keywords: [
          "reguła 15 minut bezsenność",
          "kontrola bodźców",
          "co robić gdy nie mogę zasnąć",
          "CBT-I",
        ],
      },
    },
  },

  // ───────────────────────── Lekcja 6: Wychodzenie z łóżka bez frustracji ─────────────────────────
  {
    slug: "leaving-bed-without-frustration",
    weekNumber: 2,
    weekSlug: "week-2",
    lessonNumber: 6,
    estimatedMinutes: 6,
    relatedLessonSlugs: [
      "bed-sleep-association",
      "stimulus-control-science",
      "relaxation-techniques",
    ],
    i18n: {
      pl: {
        title: "Wychodzenie z łóżka bez frustracji",
        eyebrow: "TYDZIEŃ 2 · LEKCJA 6",
        subtitle: "Jak wstać w nocy, nie wpadając w złość i niepokój.",
        difficulty: "Początkujący",
        readingTime: "6 min czytania",
        content: [
          {
            heading: "Wychodzenie to nie kara",
            paras: [
              "Wielu ludzi postrzega wstawanie z łóżka w nocy jako porażkę lub stratę czasu. To błędne myślenie. Wstawanie jest aktywnym krokiem terapeutycznym, który chroni Twój mózg przed nauczeniem się złego skojarzenia.",
              "Zamiast myśleć „znów mi się nie udało”, spróbuj: „daję sobie i swojemu mózgowi szansę, by nauczyć się, że łóżko to miejsce snu”.",
            ],
          },
          {
            heading: "Co robić po wstaniu",
            paras: [
              "Wybierz czynność cichą, niewymagającą i niezbyt absorbującą. Może to być czytanie książki papierowej, łagodne rysowanie, słuchanie cichej muzyki lub prosta praca ręczna.",
              "Unikaj telefonu, tabletu i telewizora — niebieskie światło oraz angażujące treści mogą dodatkowo opóźnić senność. Unikaj również patrzenia na zegar.",
            ],
          },
          {
            heading: "Zachowaj spokój",
            paras: [
              "Kluczem jest podejście bez presji. Nie musisz „zrobić czegokolwiek”, by zasnąć. Twoim zadaniem jest po prostu być w stanie czuwania bez walki, aż senność sama wróci.",
            ],
          },
        ],
        actionStepTitle: "Zadanie praktyczne",
        actionStep:
          "Przygotuj dzisiaj „nocny zestaw relaksacyjny” — książkę, ciepły sweter, małą lampkę i butelkę wody — który umieścisz poza sypialnią. Gdy następnym razem nie będziesz mógł zasnąć, użyjesz go bez zbędnego szukania i stresu.",
        reflectionTitle: "Refleksja",
        reflection:
          "Jakie emocje pojawiają się u Ciebie, gdy w nocy nie możesz zasnąć? Frustracja, smutek, lęk, złość? Która z nich jest najsilniejsza i jak możesz ją łagodnie nazwać?",
        faqs: [
          {
            q: "Co zrobić, gdy nie mam siły wstać z łóżka?",
            a: "Zacznij od małych kroków. Nawet usadzenie się na brzegu łóżka lub przesunięcie na krzesło obok na kilka minut może pomóc przerwać pętlę frustracji.",
          },
          {
            q: "Czy mogę wrócić do łóżka, gdy tylko poczuję się zmęczony?",
            a: "Tak, ale wracaj dopiero wtedy, gdy czujesz realną senność — na przykład oczy same się zamykają i ziewasz. Nie wcześniej.",
          },
        ],
        ctaLabel: "Przejdź do tygodnia o ograniczeniu snu",
        ctaHref: "/program/week-3/what-is-sleep-efficiency",
        seoTitle: "Wychodzenie z łóżka przy bezsenności | Somna CBT-I",
        seoDescription:
          "Praktyczne wskazówki, jak wstawać z łóżka w nocy bez frustracji i skutecznie wspierać kontrolę bodźców.",
        keywords: [
          "wychodzenie z łóżka bezsenność",
          "co robić gdy nie śpię",
          "kontrola bodźców",
          "CBT-I",
        ],
      },
    },
  },
];
