// Tydzień 1 — Podstawy snu (lekcje 1-3)
// Źródło: natywna polska wersja programu CBT-I Somna.
// Zgodnie z nomenklaturą Polskiego Towarzystwa Badań nad Snem.
import type { LessonContent } from "../../program-lessons";

export const plWeek1Lessons: LessonContent[] = [
  // ───────────────────────── Lekcja 1: Czym jest bezsenność? ─────────────────────────
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
      pl: {
        title: "Czym jest bezsenność?",
        eyebrow: "TYDZIEŃ 1 · LEKCJA 1",
        subtitle:
          "Zrozum naturę bezsenności i dlaczego terapia poznawczo-behawioralna jest najskuteczniejszym sposobem, by ją przezwyciężyć.",
        difficulty: "Początkujący",
        readingTime: "6 min czytania",
        content: [
          {
            heading: "Znacznie więcej niż jedna zła noc",
            paras: [
              "Bezsenność to o wiele więcej niż pojedyncza, niespokojna noc. To doświadczenie pełne frustracji, w którym ciało i umysł zdają się pracować na przeciwnych biegunach — trudno zasnąć, utrzymać sen lub obudzić się wypoczętym, mimo że poświęcamy na odpoczynek wystarczająco dużo czasu.",
              "Jeśli taki stan występuje u Ciebie co najmniej trzy razy w tygodniu przez trzy miesiące lub dłużej, a w dzień odczuwasz zmęczenie, rozdrażnienie lub problemy z koncentracją, prawdopodobnie masz do czynienia z bezsennością przewlekłą. W polskich wytycznych Polskiego Towarzystwa Badań nad Snem taki obraz kliniczny jest podstawą do rozpoznania.",
            ],
          },
          {
            heading: "Model 3P",
            paras: [
              "Aby zrozumieć, dlaczego sen stał się problemem, lekarze snu i psychoterapeuci stosują sprawdzony naukowo Model 3P:",
              "Czynniki predyspozycyjne — Twoja naturalna wrażliwość: skłonność do nadmiernego myślenia, większa reaktywność układu nerwowego lub obciążenie rodzinne zaburzeniami snu.",
              "Czynniki wywołujące — pierwotne wyzwalacze: stresujące wydarzenia życiowe, choroba, zmiana pracy, strata bliskiej osoby lub nagła zmiana trybu życia, która pierwotnie zakłóciła sen.",
              "Czynniki podtrzymujące — nieświadome nawyki i myśli, które adoptujemy, by poradzić sobie ze złym snem: dłuższe leżenie w łóżku, drzemki w ciągu dnia, zegarek pod poduszką, złe skojarzenia z łóżkiem. To one utrzymują bezsenność długo po ustąpieniu pierwotnego problemu.",
            ],
          },
          {
            heading: "Dlaczego terapia poznawczo-behawioralna działa",
            paras: [
              "Terapia poznawczo-behawioralna w leczeniu bezsenności, nazywana w skrócie CBT-I, nie tłumi objawów tak jak pigułka nasenna. Dociera do źródła problemu: usuwa czynniki podtrzymujące i odbudowuje prawidłową relację ze snem od podstaw. To właśnie dlatego jest zalecana jako pierwszy wybór w polskich i międzynarodowych wytycznych.",
            ],
          },
        ],
        actionStepTitle: "Zadanie praktyczne",
        actionStep:
          "W tym tygodniu zaczynamy od spokojnej obserwacji. Pobierz lub wydrukuj Dziennik Snu Somna. Każdego ranka poświęć dwie minuty na zapisanie: kiedy zgaszone było światło, jak długo trwało zasypianie, czy budziłeś się w nocy, o której wstałeś oraz jak oceniasz sen w skali od 1 do 5. Jeszcze niczego nie zmieniaj — obserwuj z ciekawością i życzliwością.",
        reflectionTitle: "Refleksja",
        reflection:
          "Przejrzyj swój dziennik. Jakie wzory ukrywają się w Twoim tygodniu? Czy są dni, w których umysł jest głośniejszy, a ciało bardziej niespokojne? Zauważaj te powiązania bez osądzania.",
        faqs: [
          {
            q: "Jak odróżnić bezsenność od okazjonalnych problemów ze snem?",
            a: "Okazjonalne, niespokojne noce zdarzają się każdemu. Bezsenność rozpoznajemy, gdy trudności ze snem występują co najmniej 3 razy w tygodniu przez co najmniej 3 miesiące i wyraźnie obniżają jakość funkcjonowania w ciągu dnia.",
          },
          {
            q: "Czy bezsenność można pokonać bez leków?",
            a: "Tak. Badania kliniczne potwierdzają, że CBT-I jest złotym standardem w leczeniu przewlekłej bezsenności. Pomaga ona 70–80% osób w odzyskaniu naturalnego, trwałego rytmu snu.",
          },
        ],
        ctaLabel: "Otwórz dziennik snu",
        ctaHref: "/diary",
        seoTitle: "Czym jest bezsenność? Model 3P wyjaśniony | Somna CBT-I",
        seoDescription:
          "Zrozum naturę bezsenności dzięki naukowemu Modelowi 3P i dowiedz się, dlaczego CBT-I skutecznie usuwa nawyki podtrzymujące bezsenność.",
        keywords: [
          "bezsenność",
          "model 3P",
          "przewlekła bezsenność",
          "CBT-I",
          "leczenie bezsenności",
        ],
      },
    },
  },

  // ───────────────────────── Lekcja 2: Jak działa sen ─────────────────────────
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
      pl: {
        title: "Jak działa sen?",
        eyebrow: "TYDZIEŃ 1 · LEKCJA 2",
        subtitle: "Wewnętrzne rytmy: cykle snu, zegar biologiczny i presja snu.",
        difficulty: "Początkujący",
        readingTime: "6 min czytania",
        content: [
          {
            heading: "Aktywny, precyzyjnie zorganizowany proces",
            paras: [
              "Sen nie jest biernym wyłączeniem świadomości. To aktywny, wielopoziomowy proces, w którym mózg regeneruje ciało, porządkuje wspomnienia i oczyszcza emocjonalny bagaż dnia.",
              "Każdej nocy mózg przechodzi przez cykle trwające około 90 minut. W każdym cyklu podróżujemy przez dwa obszary: sen NREM (lekki sen w stadium N1 i N2 oraz głęboki sen fali wolnej w N3, który regeneruje układ odpornościowy i tkanki) oraz sen REM (faza marzeń sennych, kluczowa dla przetwarzania emocji i utrwalania tego, czego się nauczyliśmy).",
            ],
          },
          {
            heading: "Dwie wewnętrzne siły",
            paras: [
              "Czas snu reguluje współdziałanie dwóch sił:",
              "Rytm okołodobowy — Twój wewnętrzny zegar biologiczny, który reaguje na światło i ciemność, wysyłając w dzień sygnał pobudzenia, a w nocy sygnał senności.",
              "Presja snu — homeostatyczna siła snu, którą można porównać do klepsydry. Im dłużej jesteśmy aktywni, tym większa presja, którą organizm musi „spuścić” podczas nocnego odpoczynku.",
              "Wysoka presja snu + nocny sygnał rytmu okołodobowego = sen przychodzący naturalnie.",
            ],
          },
          {
            heading: "Gdy mechanizm zostaje przejęty",
            paras: [
              "Podczas bezsenności naturalny mechanizm zostaje przejęty przez hiperaktywację — stan biologicznej i psychicznej czujności napędzany lękiem. Nawet gdy presja snu jest bardzo wysoka, sygnał „czujności” z układu nerwowego ją przytłacza. CBT-I działa właśnie dlatego, że jej techniki wzmacniają naturalną presję snu i ponownie synchronizują wewnętrzny zegar.",
            ],
          },
        ],
        actionStepTitle: "Zadanie praktyczne",
        actionStep:
          "Wybierz realistyczną godzinę pobudki, która pasuje do Twojego życia. Przez cały tydzień wstawaj o tej samej porze — także w weekendy. Ekspozycja na światło dzienne w ciągu 30 minut od wstania z łóżka mocno zakotwiczy Twój zegar biologiczny.",
        reflectionTitle: "Refleksja",
        reflection:
          "Jak się czujesz, patrząc na sen jako na system biologiczny, a nie jako na nocny egzamin, który nieustannie obrywasz? Czy dostrzegasz momenty, w których codzienne nawyki mogą mylić Twój wewnętrzny zegar?",
        faqs: [
          {
            q: "Czy każdy potrzebuje dokładnie 8 godzin snu?",
            a: "Nie, to sztywny mit. Zapotrzebowanie na sen jest bardzo indywidualne. U dorosłych średnia mieści się zazwyczaj w granicach 7–9 godzin, ale jedni funkcjonują dobrze po 6 godzinach, inni naprawdę potrzebują 9. Skup się na jakości i regularności snu, a nie na arbitralnej liczbie.",
          },
          {
            q: "Dlaczego regularnie budzę się w środku nocy?",
            a: "Krótkie przebudzenia między 90-minutowymi cyklami snu są całkowicie naturalne. Osoby dobrze śpiące przewracają się, poprawiają poduszkę i zasypiają ponownie, nie zapamiętując tego. Problem nie leży w przebudzeniu, ale w fali frustracji lub lęku, która uniemożliwia powrót do snu.",
          },
        ],
        ctaLabel: "Poznaj swój rytm snu",
        ctaHref: "/calculator",
        seoTitle: "Jak działa sen: cykle, rytm okołodobowy i presja snu | Somna",
        seoDescription:
          "Poznaj 90-minutowe cykle snu, rytm okołodobowy i presję snu — oraz jak CBT-I przywraca ich naturalną równowagę.",
        keywords: [
          "jak działa sen",
          "cykle snu",
          "rytm okołodobowy",
          "presja snu",
          "NREM REM",
        ],
      },
    },
  },

  // ───────────────────────── Lekcja 3: Dlaczego większy wysiłek pogarsza sen ─────────────────────────
  {
    slug: "trying-harder-makes-sleep-worse",
    weekNumber: 1,
    weekSlug: "week-1",
    lessonNumber: 3,
    estimatedMinutes: 5,
    relatedLessonSlugs: ["what-is-insomnia", "how-sleep-works", "bed-sleep-association"],
    i18n: {
      pl: {
        title: "Dlaczego większy wysiłek pogarsza sen",
        eyebrow: "TYDZIEŃ 1 · LEKCJA 3",
        subtitle: "Paradoks wysiłku wobec snu i sposób, by wyjść z tej pułapki.",
        difficulty: "Początkujący",
        readingTime: "5 min czytania",
        content: [
          {
            heading: "Paradoks wysiłku",
            paras: [
              "Jedną z najgłębszych prawd nauki o śnie jest paradoks: im bardziej się starasz zasnąć, tym bardziej sen się oddala. To pułapka psychologiczna znana jako lęk wydajnościowy związany ze snem.",
              "Gdy odpoczynek staje się nieuchwytny, Twoim pierwszym odruchem jest walka o niego. Możesz kłaść się wyjątkowo wcześnie, by „złapać” sen, leżeć nieruchomo zmuszając powieki do zamknięcia lub rozkazywać mózgowi, żeby „przestał myśleć”.",
              "Sen jednak jest funkcją biologiczną kierowaną poddaniem się, a nie wysiłkiem. W momencie, gdy traktujesz sen jako cel do osiągnięcia, mózg postrzega to jako zadanie wysokiego ryzyka. Zaczyna uwalniać kortyzol i adrenalinę, wywołując stan hiperaktywacji.",
            ],
          },
          {
            heading: "Bolesna pętla",
            paras: [
              "Powstaje bolesna pętla: trudności ze snem → większy wysiłek → aktywacja układu nerwowego → sen staje się niemożliwy.",
              "Z czasem pętla uczy mózg, że łóżko to nie sanktuarium odpoczynku, ale strefa frustracji i zagrożenia. CBT-I przerywa to uwarunkowanie, usuwając presję wysiłku. Uczymy Cię przestać zmuszać sen i zamiast tego stworzyć łagodne, przyjazne warunki, w których sen może nadejść sam.",
            ],
          },
        ],
        actionStepTitle: "Zadanie praktyczne",
        actionStep:
          "W tym tygodniu ćwiczymy sztukę puszczenia. Jeśli leżysz w łóżku z szeroko otwartymi oczami i rośnie w Tobie frustracja, nie zostawaj tam w walce. Wyjdź z łóżka z łagodnością, udaj się do przyciemnionego pomieszczenia i rób coś spokojnego — poczytaj wciągającą książkę, posłuchaj ambientowego podcastu lub naszkicuj coś na kartce. Wróć do łóżka dopiero wtedy, gdy powieki staną się ciężkie, a autentyczna senność Cię zaleje.",
        reflectionTitle: "Refleksja",
        reflection:
          "Czy potrafisz wskazać konkretne sposoby, w jakie ostatnio „pracowałeś/aś” na sen? Jak by to było, gdybyś dziś wieczorem całkowicie zrezygnował/a z roli osoby zmuszającej się do odpoczynku?",
        faqs: [
          {
            q: "Jeśli wstanę, gdy nie mogę zasnąć, nie stracę jeszcze więcej snu?",
            a: "Krótkoterminowo możesz spędzić mniej czasu w łóżku. Długoterminowo jednak leżenie z frustracją tylko wzmacnia w mózgu skojarzenie między łóżkiem a czuwaniem. Wyjście z łóżka to inwestycja w trwałe zerwanie tej bariery.",
          },
          {
            q: "Co zrobić, jeśli nie mogę przestać myśleć o lęku przed snem?",
            a: "To właśnie tu pomaga restrukturyzacja poznawcza. Zamiast zmuszać myśli do uciszenia, uczymy się zmieniać perspektywę wobec nich, odbierając im emocjonalną moc, która utrzymuje ciało w stanie czuwania.",
          },
        ],
        ctaLabel: "Przejdź do kolejnej lekcji",
        ctaHref: "/program/week-2/bed-sleep-association",
        seoTitle: "Dlaczego większy wysiłek pogarsza sen | Somna CBT-I",
        seoDescription:
          "Odkryj paradoks lęku wydajnościowego związanego ze snem — dlaczego zmuszanie się do snu działa na odwrót — i jak CBT-I pomaga wyjść z pętli wysiłku.",
        keywords: [
          "lęk wydajnościowy sen",
          "zmuszanie się do snu",
          "paradoks wysiłku snu",
          "CBT-I sen",
          "nie mogę zasnąć",
        ],
      },
    },
  },
];
