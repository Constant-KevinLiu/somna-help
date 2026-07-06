/**
 * Słownik lekcji „Baza wiedzy” w języku polskim.
 *
 * Zasada: treść pisana natywnie po polsku, bez dosłownego tłumaczenia z
 * angielskiego. Trzymana osobno od słownika angielskiego, aby uniknąć
 * przypadkowego fallbacku i zapewnić lokalne SEO z rodzimymi tekstami.
 */

import type { LearnDict, LearnSlug } from "./learn-i18n";

const plTitles: Record<LearnSlug, string> = {
  "what-is-cbti": "Czym jest CBT-I?",
  "90-minute-sleep-cycle": "90-minutowy cykl snu",
  "4-7-8-breathing": "Oddychanie 4-7-8 wyjaśnione",
  "racing-thoughts-at-night": "Gdy w nocy głowa nie milknie",
  "circadian-rhythm": "Światło, kofeina i Twój wewnętrzny zegar",
  "stimulus-control": "Kontrola bodźców prostym językiem",
};

const plSummaries: Record<LearnSlug, string> = {
  "what-is-cbti":
    "Przyjazne wprowadzenie do CBT-I i dlaczego działa na dłuższą metę.",
  "90-minute-sleep-cycle":
    "Jak cykle snu kształtują poczucie wypoczynku i wybieraj idealną porę budzenia.",
  "4-7-8-breathing":
    "Prosty wzorzec oddechowy, który uspokaja układ nerwowy i pomaga szybciej zasnąć.",
  "racing-thoughts-at-night":
    "Dlaczego myśli stają się tak głośne w nocy — i co CBT-I robi, by je uciszyć.",
  "circadian-rhythm":
    "Jak światło i kofeina po cichu prowadzą Twój zegar biologiczny i wpływają na sen.",
  "stimulus-control":
    "Odbuduj powiązanie łóżko–sen noc po nocy, stosując technikę kontroli bodźców.",
};

const plUi: LearnDict["ui"] = {
  learn: "Baza wiedzy",
  quickLessons: "Szybkie lekcje",
  cbtiGuides: "Przewodniki CBT-I",
  readBadge: "5 min czytania",
  takeawaysTitle: "Najważniejsze wnioski",
  scienceNoteTitle: "Komentarz naukowy",
  practicalTipTitle: "Wypróbuj dziś wieczorem",
  relatedToolTitle: "Sprawdź powiązane narzędzie",
  relatedGuideTitle: "Pogłęb wiedzę",
  relatedGuideCta: "Przeczytaj pełny przewodnik",
  nextLessonTitle: "Następna lekcja",
  nextLessonCta: "Kontynuuj naukę",
  hubTitle: "Baza wiedzy",
  hubSub:
    "Biblioteka obszernych przewodników CBT-I i krótkich lekcji opartych na dowodach, które pomogą zrozumieć sen — i samego siebie.",
  hubQuickLessonsLabel: "Szybkie lekcje",
  hubGuidesLabel: "Przewodniki CBT-I",
  minRead: "min czytania",
};

const plLessons: LearnDict["lessons"] = {
  "what-is-cbti": {
    meta: {
      title: "Czym jest CBT-I? | somna",
      desc: "Przyjazne wyjaśnienie poznawczo-behawioralnej terapii bezsenności (CBT-I) i dlaczego uważana jest za najskuteczniejsze długoterminowe leczenie bezsenności.",
    },
    eyebrow: "SZYBKA LEKCJA",
    title: "Czym jest CBT-I?",
    subtitle:
      "Poznawczo-behawioralna terapia bezsenności to nie tabletka na sen — to uporządkowany sposób na ponowne nauczenie mózgu, jak odnosić się do snu.",
    readingTime: "5",
    keyTakeaways: [
      "CBT-I to nie lek — zmienia zachowania i myśli związane ze snem.",
      "Jest zalecana przez specjalistów od snu na całym świecie jako pierwsza linia leczenia przewlekłej bezsenności.",
      "Efekty zwykle trwają znacznie dłużej niż przy tabletkach nasennych.",
      "Większość osób zauważa realną poprawę w ciągu 4–8 tygodni.",
    ],
    sections: [
      {
        heading: "Co oznacza CBT-I?",
        paras: [
          "CBT-I to skrót od Cognitive Behavioral Therapy for Insomnia, czyli poznawczo-behawioralna terapia bezsenności. To uporządkowany, ograniczony czasowo program, który adresuje konkretne myśli i zachowania podtrzymujące bezsenność.",
          "W przeciwieństwie do tabletek nasennych, CBT-I nie uśpia Cię. Zamiast tego uczy mózgu i ciała odzyskiwania naturalnego rytmu snu — łagodnie i bez działań niepożądanych.",
        ],
      },
      {
        heading: "Dlaczego problemy ze snem stają się nauczone",
        paras: [
          "Kilka stresujących nocy to norma. Stają się przewlekłe, gdy mózg zaczyna kojarzyć łóżko z frustracją lub czujnością zamiast z odpoczynkiem.",
          "Przez tygodnie lub miesiące to skojarzenie się wzmacnia. Twój układ nerwowy uczy się: 'pora snu = pozostań czujny'. CBT-I działa, bo bezpośrednio adresuje to nauczenie.",
        ],
      },
      {
        heading: "Pięć kluczowych składników",
        paras: [
          "CBT-I łączy pięć narzędzi opartych na dowodach: ograniczanie czasu w łóżku (by odbudować presję snu), kontrolę bodźców (ponowne połączenie łóżka ze snem), restrukturyzację poznawczą (łagodzenie lękliwych myśli), higienę snu (drobne zmiany środowiskowe) oraz trening relaksacyjny.",
          "Stosowane razem atakują pętlę bezsenności z wielu stron jednocześnie.",
        ],
      },
      {
        heading: "Dlaczego CBT-I działa długoterminowo",
        paras: [
          "Leki mogą maskować objawy, dopóki je przyjmujesz. CBT-I zmienia podstawowe wzorce, więc poprawa utrzymuje się po zakończeniu programu.",
          "Badania obserwacyjne pokazują utrzymujące się korzyści nawet do trzech lat później — co jest rzadkie w przypadku jakiegokolwiek leczenia bezsenności.",
        ],
      },
      {
        heading: "Kto może skorzystać z CBT-I?",
        paras: [
          "Większość dorosłych z przewlekłą bezsennością dobrze reaguje, w tym osoby starsze i ci, którzy zmagają się latami. CBT-I jest też skuteczna w połączeniu z leczeniem lęku lub depresji.",
          "Jeśli masz nieleczone bezdechy senne, zespół niespokojnych nóg lub inny zaburzenie snu, najpierw porozmawiaj z lekarzem, aby CBT-I można było bezpiecznie dostosować.",
        ],
      },
    ],
    scienceNote:
      "Główne organizacje medycyny snu — w tym American Academy of Sleep Medicine i American College of Physicians — zalecają CBT-I jako pierwszą linię leczenia przewlekłej bezsenności u dorosłych.",
    practicalTip:
      "Dziś wieczorem używaj łóżka tylko do snu i intymności — bez scrollowania, bez pracy, bez zamartwiania się. Ta prosta zasada jest sercem kontroli bodźców.",
    cta: { label: "Przeczytaj pełny przewodnik CBT-I", to: "/cbt-i-guide" },
    relatedGuide: { slug: "cbt-i-guide" },
    relatedTool: {
      to: "/calculator",
      label: "Kalkulator cykli snu",
      desc: "Planuj wokół naturalnych 90-minutowych cykli.",
    },
    faqs: [
      {
        q: "Czy CBT-I to rodzaj leku?",
        a: "Nie. CBT-I to program behawioralny i poznawczy. Wykorzystuje uporządkowane techniki, a nie leki, by zająć się przyczynami bezsenności.",
      },
      {
        q: "Jak długo trwa, zanim CBT-I zacznie działać?",
        a: "Większość osób zauważa pewną zmianę w ciągu 1–2 tygodni i znaczącą poprawę po 4–8 tygodniach regularnej praktyki.",
      },
      {
        q: "Czy CBT-I jest lepsza niż tabletki nasenne?",
        a: "W przypadku przewlekłej bezsenności tak — w długoterminowym obserwacji. Leki mogą pomóc krótkoterminowo, ale efekty rzadko utrzymują się po odstawieniu.",
      },
      {
        q: "Czy do CBT-I potrzebny jest terapeuta?",
        a: "Wyszkolony klinicysta daje najlepsze efekty, ale samodzielne i cyfrowe programy CBT-I również mają potwierdzoną skuteczność.",
      },
      {
        q: "Czy CBT-I pomoże, jeśli mam bezsenność od lat?",
        a: "Tak. Nawet długotrwała bezsenność dobrze reaguje, ponieważ CBT-I adresuje wzorce, które ją obecnie podtrzymują, a nie tylko pierwotny czynnik wyzwalający.",
      },
      {
        q: "Czy są działania niepożądane?",
        a: "Głównym 'działaniem niepożądanym' jest tymczasowe zmęczenie podczas ograniczania czasu w łóżku w tygodniach 1–2. Nie ma ryzyka związanego z lekami.",
      },
      {
        q: "Czy mogę stosować CBT-I, biorąc tabletki nasenne?",
        a: "Często tak, pod okiem lekarza. Wiele osób stopniowo zmniejsza dawkowanie leków w trakcie lub po CBT-I.",
      },
    ],
    nextLesson: "stimulus-control",
  },
  "90-minute-sleep-cycle": {
    meta: {
      title: "90-minutowy cykl snu | somna",
      desc: "Zrozum, jak działają cykle snu i dlaczego budzenie się we właściwym momencie poprawia poczucie wypoczynku.",
    },
    eyebrow: "SZYBKA LEKCJA",
    title: "90-minutowy cykl snu",
    subtitle:
      "Sen nie jest jednym długim blokiem — porusza się w powtarzających się cyklach, z których każdy kształtuje, jak czujesz się rano.",
    readingTime: "5",
    keyTakeaways: [
      "Sen przebiega w powtarzających się cyklach, a nie jako jednostajny stan.",
      "Jeden cykl trwa średnio około 90 minut.",
      "Sen głęboki i REM pełnią bardzo różne funkcje.",
      "Moment budzenia ma znaczenie: przebudzenie między cyklami jest zwykle łatwiejsze.",
    ],
    sections: [
      {
        heading: "Co dzieje się podczas snu?",
        paras: [
          "Sen nie jest jednym stanem. Twój mózg przechodzi przez różne etapy, z których każdy charakteryzuje się innym wzorem fal mózgowych, tętna i napięcia mięśniowego.",
          "Te cykle powtarzają się w ciągu nocy, stopniowo przechodząc od głębokiego, regenerującego snu na początku do dłuższych okresów REM pod koniec.",
        ],
      },
      {
        heading: "Cztery etapy snu",
        paras: [
          "Etap 1 to krótkie, płytkie zapadanie w sen. Etap 2 jest nieco głębszy i w nim spędzamy większość nocy. Etap 3 to sen głęboki o wolnych falach — kluczowy dla regeneracji fizycznej. REM (szybkie ruchy gałek ocznych) to faza, w której pojawia się większość żywych snów i która jest niezbędna dla pamięci oraz przetwarzania emocjonalnego.",
          "Każdy cykl przechodzi przez te etapy w przybliżonej kolejności.",
        ],
      },
      {
        heading: "Dlaczego 90 minut ma znaczenie",
        paras: [
          "Średnio pełny cykl snu trwa około 90 minut. Przebudzenie na końcu cyklu — zamiast w środku snu głębokiego — zwykle odczuwa się jako lżejsze i bardziej przejrzyste.",
          "Dlatego kalkulatory snu często sugerują opcje oddalone o 90 minut od siebie.",
        ],
      },
      {
        heading: "Dlaczego czasem budzisz się otępiały",
        paras: [
          "Jeśli budzik przerwie sen głęboki, możesz obudzić się zdezorientowany lub z ciężką głową. To zamglenie nazywa się 'inercją snu' i może trwać 15–30 minut.",
          "Dostosowanie pory kładzenia się o zaledwie 15–30 minut może sprawić, że przebudzenie przypadnie w przyjaźniejszym punkcie cyklu.",
        ],
      },
      {
        heading: "Jak kalkulatory snu wykorzystują cykle",
        paras: [
          "Kalkulator cykli snu działa wstecz od wybranej godziny wstawania, odejmując pełne 90-minutowe cykle oraz niewielki zapas na zaśnięcie.",
          "To wskazówka, nie gwarancja — ale dla wielu osób to przydatny punkt wyjścia do bardziej stabilnych poranków.",
        ],
      },
    ],
    scienceNote:
      "Długość cyklu snu to średnia — rzeczywiste cykle wahają się od około 70 do 120 minut i zmieniają się w ciągu nocy oraz między osobami.",
    practicalTip:
      "Staraj się o pięć lub sześć pełnych cykli, kiedy to możliwe. Dla większości dorosłych oznacza to 7,5–9 godzin snu — w granicach wspieranych przez naukę.",
    cta: { label: "Użyj kalkulatora cykli", to: "/calculator" },
    relatedGuide: { slug: "how-to-fall-asleep-fast" },
    relatedTool: {
      to: "/calculator",
      label: "Kalkulator cykli snu",
      desc: "Dostosuj porę snu do pełnych cykli.",
    },
    faqs: [
      {
        q: "Czy każdy cykl snu ma dokładnie 90 minut?",
        a: "Nie — 90 minut to średnia. Cykle wahają się między około 70 a 120 minut i zmieniają się w ciągu nocy oraz między osobami.",
      },
      {
        q: "Ile cykli powinienem mieć?",
        a: "Większość dorosłych czuje się lepiej po 5–6 cyklach na noc, co odpowiada około 7,5–9 godzinom snu.",
      },
      {
        q: "Dlaczego czasem budzę się otępiały, mimo że spałem wystarczająco długo?",
        a: "Możliwe, że budzik obudził Cię w fazie snu głębokiego. Dostosowanie pory kładzenia się o 15–30 minut może sprawić, że przebudzenie będzie łagodniejsze.",
      },
      {
        q: "Czy sen głęboki jest ważniejszy niż REM?",
        a: "Oba są ważne. Sen głęboki wspiera regenerację fizyczną; REM wspiera pamięć i regulację emocjonalną. Zdrowa noc obejmuje obie fazy.",
      },
      {
        q: "Czy mogę śledzić swoje cykle snu?",
        a: "Urządzenia konsumenckie szacują etapy, ale nie są medycznie precyzyjne. Wzorce obserwowane przez tygodnie są bardziej miarodajne niż pojedyncza noc.",
      },
      {
        q: "Dlaczego cykle zmieniają się w ciągu nocy?",
        a: "Pierwsze cykle zawierają więcej snu głębokiego; późniejsze — więcej REM. Obie połowy nocy są ważne.",
      },
      {
        q: "Czy drzemki też opierają się na cyklach snu?",
        a: "Tak. Dziewięćdziesięciominutowa drzemka może objąć pełny cykl, podczas gdy dwudziestominutowa pozostaje w lżejszych etapach i unika otępienia.",
      },
    ],
    nextLesson: "4-7-8-breathing",
  },
  "4-7-8-breathing": {
    meta: {
      title: "Oddychanie 4-7-8 wyjaśnione | somna",
      desc: "Dowiedz się, jak technika oddychania 4-7-8 może pomóc zmniejszyć fizjologiczny stan czujności przed snem.",
    },
    eyebrow: "SZYBKA LEKCJA",
    title: "Oddychanie 4-7-8 wyjaśnione",
    subtitle:
      "Prosty wzorzec oddechowy, który łagodnie obniża fizjologiczny stan czujności — praktyczny rytuał przed snem, oparty na podstawowej fizjologii.",
    readingTime: "5",
    keyTakeaways: [
      "Powolne oddychanie wpływa na układ nerwowy autonomiczny.",
      "Długie, spokojne wydechy sprzyjają odpowiedzi relaksacyjnej.",
      "Regularność jest ważniejsza niż intensywność.",
      "Działa najlepiej jako część szerszej rutyny snu.",
    ],
    sections: [
      {
        heading: "Co to jest oddychanie 4-7-8?",
        paras: [
          "Oddychanie 4-7-8 to uporządkowany wzorzec: wdech przez nos przez 4 sekundy, wstrzymanie przez 7 sekund i powolny wydech przez usta przez 8 sekund.",
          "Technika została spopularyzowana jako metoda uspokajania, ale jej wpływ ma głębsze korzenie — oddychanie powoli wpływa na reakcję stresową organizmu.",
        ],
      },
      {
        heading: "Jak praktykować",
        paras: [
          "Usiądź lub połóż się wygodnie. Umieść czubek języka za przednimi zębami. Wydech całkowicie przez usta.",
          "Wdech cicho przez nos przez 4 sekundy. Wstrzymaj oddech przez 7. Wydech przez lekko rozchylone wargi przez 8. Powtórz 4 cykle. Zwiększaj stopniowo — na początku może wydawać się intensywne.",
        ],
      },
      {
        heading: "Dlaczego może działać uspokajająco",
        paras: [
          "Długie wydechy aktywują przywspółczulny układ nerwowy, który zwalnia tętno i łagodzi sygnały stresu.",
          "Liczenie również delikatnie zajmuje umysł, odciągając uwagę od goniących myśli.",
        ],
      },
      {
        heading: "Typowe błędy",
        paras: [
          "Zbyt mocne wymuszanie oddechu, zbyt napięte wstrzymywanie lub zbyt wiele cykli naraz mogą być niewygodne.",
          "Jeśli poczujesz zawroty głowy lub lekkość, wróć do naturalnego oddychania. Celem jest spokój, nie wysiłek.",
        ],
      },
      {
        heading: "Jak włączyć do wieczornej rutyny",
        paras: [
          "Połącz technikę z innym sygnałem — przyciemnieniem światła, umyciem twarzy, położeniem się do łóżka — aby stała się automatycznym znakiem, że dzień dobiega końca.",
          "Większość osób zauważa największe korzyści po jednym do dwóch tygodniach regularnej praktyki.",
        ],
      },
    ],
    scienceNote:
      "Badania wykazały, że powolne, rytmiczne oddychanie obniża tętno, ciśnienie krwi i samoocenę stresu u dorosłych w dobrej formie.",
    practicalTip:
      "Wypróbuj tylko 2–4 cykle oddychania 4-7-8 tuż przed zgaszeniem światła dziś wieczorem. Nie gonisz za snem — sygnalizujesz bezpieczeństwo.",
    cta: { label: "Jak szybko zasnąć", to: "/how-to-fall-asleep-fast" },
    relatedGuide: { slug: "how-to-fall-asleep-fast" },
    relatedTool: {
      to: "/relax",
      label: "Sesja prowadzona 4-7-8",
      desc: "Ćwicz przy spokojnej wizualnej referencji.",
    },
    faqs: [
      {
        q: "Czy oddychanie 4-7-8 usypia?",
        a: "Nie bezpośrednio. Obniża stan czujności i wspiera zasypianie, ale nie jest środkiem nasennym.",
      },
      {
        q: "Ile cykli robić?",
        a: "Zacznij od 4 cykli. Niektórzy zwiększają liczbę w ciągu tygodni. Więcej nie zawsze znaczy lepiej.",
      },
      {
        q: "Czy jest bezpieczne dla każdego?",
        a: "Uważa się je za bezpieczne dla zdrowych dorosłych. Jeśli masz problemy z płucami, niskie ciśnienie lub odczuwasz zawroty, wróć do naturalnego oddechu.",
      },
      {
        q: "Czy dzieci mogą praktykować?",
        a: "Uproszczona wersja (krótsze wstrzymywanie) może działać u starszych dzieci, ale najpierw skonsultuj się z pediatrą.",
      },
      {
        q: "Dlaczego wydech jest dłuższy niż wdech?",
        a: "Długie wydechy aktywują przywspółczulny układ 'spoczynku i trawienia'.",
      },
      {
        q: "A jeśli liczenie mnie bardziej niepokoi?",
        a: "Pomiń liczenie. Po prostu oddychaj powoli przez nos, wykonując długi, spokojny wydech. Wzorzec jest ważniejszy niż liczby.",
      },
      {
        q: "Jak często praktykować?",
        a: "Codziennie to ideal — nawet poza porą snu — aby wyuczyć odpowiedź. Większość osób zauważa efekty w ciągu 1–2 tygodni.",
      },
    ],
    nextLesson: "racing-thoughts-at-night",
  },
  "racing-thoughts-at-night": {
    meta: {
      title: "Gdy w nocy głowa nie milknie | somna",
      desc: "Zrozum, dlaczego myśli stają się głośniejsze w nocy i jak CBT-I radzi sobie z goniącymi myślami.",
    },
    eyebrow: "SZYBKA LEKCJA",
    title: "Gdy w nocy głowa nie milknie",
    subtitle:
      "Goniące myśli przed snem nie są wadą charakteru — to przewidywalna cecha układu nerwowego w stanie czujności. CBT-I ma dla nich praktyczne narzędzia.",
    readingTime: "5",
    keyTakeaways: [
      "Goniące myśli w nocy są powszechne, a nie nienormalne.",
      "Hiperwigilancja — fizyczna i umysłowa — odgrywa ważną rolę.",
      "Próby tłumienia myśli zwykle dają efekt odwrotny.",
      "CBT-I oferuje konkretne narzędzia, które działają lepiej niż 'po prostu się zrelaksuj'.",
    ],
    sections: [
      {
        heading: "Dlaczego myśli wydają się głośniejsze w nocy",
        paras: [
          "W ciągu dnia uwaga jest rozproszona zadaniami, rozmowami i ruchem. W nocy rozproszenia opadają, a wewnętrzne myśli mają scenę tylko dla siebie.",
          "Jeśli jesteś też zmęczony i Twoja kora przedczołowa (spokojny planista) jest mniej aktywna, zmartwienia mogą wydawać się pilniejsze, niż są w rzeczywistości.",
        ],
      },
      {
        heading: "Model hiperwigilancji",
        paras: [
          "Badacze opisują przewlekłą bezsenność jako stan hiperwigilancji — ciało i umysł pozostają zbyt aktywne, by sen mógł nadejść.",
          "Hormony stresu, przyspieszone tętno i zajęty umysł wzmacniają się nawzajem. Gdy raz się to rozpocznie, powszechna rada 'spróbuj się zrelaksować' często nie wystarcza.",
        ],
      },
      {
        heading: "Dlaczego próba nie-myślenia nie działa",
        paras: [
          "Mówienie sobie 'przestań myśleć' zwykle wzmaga myśli. To efekt 'białego niedźwiedzia': im bardziej próbujesz coś stłumić, tym częściej wraca.",
          "CBT-I zmienia cel — zamiast zatrzymywać myśli, uczysz się je zauważać i przepuszczać bez angażowania się.",
        ],
      },
      {
        heading: "Przydatne strategie CBT-I",
        paras: [
          "Użyj 'okna zmartwień' w ciągu dnia: poświęć 10 minut wczesnym wieczorem na zapisanie zmartwień i możliwych kolejnych kroków. Zamknij notes, gdy skończy się czas.",
          "Jeśli tkwisz w łóżku obracając się przez 20 minut, wstań. Usiądź gdzieś przy przygaszonym świetle i zrób coś spokojnego: przeczytaj kilka stron lekkiej książki, wykonaj powolne rozciąganie, uspokajająco oddychaj. Wróć tylko, gdy poczujesz senność. To kontrola bodźców — najsilniejsze narzędzie w zestawie CBT-I.",
        ],
      },
      {
        heading: "Kiedy szukać pomocy specjalisty",
        paras: [
          "Jeśli goniące myśli towarzyszą utrzymującemu się obniżonemu nastrojowi, dziennym atakom paniki lub znaczącemu wpływowi na codzienne funkcjonowanie, proszę, skonsultuj się z lekarzem.",
          "Lęk i bezsenność często chodzą razem i dobrze reagują na skoordynowane leczenie.",
        ],
      },
    ],
    scienceNote:
      "Bezsenność jest coraz częściej rozumiana jako zaburzenie hiperwigilancji — obejmujące aktywację poznawczą (umysłową) i fizjologiczną (ciała).",
    practicalTip:
      "Dziś wieczorem napisz listę zadań na jutro, zanim umyjesz zęby. Wynosząc jutrzejszy ładunek na zewnątrz, dajesz mózgowi sygnał, że nie musi tego próbować w łóżku.",
    cta: { label: "Przeczytaj przewodnik o lęku i śnie", to: "/sleep-anxiety" },
    relatedGuide: { slug: "sleep-anxiety" },
    relatedTool: {
      to: "/relax",
      label: "Oddychanie do uspokojenia",
      desc: "Uspokój ciało, by uspokoić umysł.",
    },
    faqs: [
      {
        q: "Dlaczego goniące myśli zawsze pojawiają się przed snem?",
        a: "Bez rozproszeń dnia wewnętrzne myśli nie mają z czym konkurować. Zmęczona kora przedczołowa sprawia też, że zmartwienia wydają się pilniejsze.",
      },
      {
        q: "Czy powinienem próbować odpychać myśli?",
        a: "Nie — zwykle je wzmacnia. Celem jest zauważenie myśli i pozwolenie im przepłynąć, jak chmury po niebie.",
      },
      {
        q: "Czy pisanie dziennika naprawdę pomaga?",
        a: "Tak, zwłaszcza gdy robione wczesnym wieczorem. 'Okno zmartwień' wynosi zmartwienia na zewnątrz, by nie pojawiały się w łóżku.",
      },
      {
        q: "Czy goniące myśli to to samo co lęk?",
        a: "Bardzo się pokrywają. Jeśli towarzyszy im utrzymująca się troska, obniżony nastrój lub panika, rozważ rozmowę z klinicystą.",
      },
      {
        q: "Czy medytacja może pomóc?",
        a: "Dla wielu osób tak — szczególnie podejścia oparte na uważności, które koncentrują się na zauważaniu myśli bez angażowania się.",
      },
      {
        q: "A słuchanie podcastu w łóżku?",
        a: "Dowody są mieszane. Lekkie audio pomaga niektórym, podczas gdy angażująca treść utrzymuje mózg zbyt aktywny.",
      },
      {
        q: "Czy goniące myśli oznaczają, że mam bezsenność?",
        a: "Same w sobie nie. Bezsenność to trudności ze snem występujące przynajmniej 3 noce w tygodniu przez 3+ miesiące i wpływające na funkcjonowanie dzienne.",
      },
    ],
    nextLesson: "circadian-rhythm",
  },
  "circadian-rhythm": {
    meta: {
      title: "Światło, kofeina i Twój wewnętrzny zegar | somna",
      desc: "Dowiedz się, jak ekspozycja na światło i kofeina wpływają na rytm dobowy i porę snu.",
    },
    eyebrow: "SZYBKA LEKCJA",
    title: "Światło, kofeina i Twój wewnętrzny zegar",
    subtitle:
      "Twój organizm ma wewnętrzny zegar o długości około 24 godzin. Światło i kofeina to dwa z najsilniejszych sygnałów kształtujących, kiedy sen przychodzi z łatwością.",
    readingTime: "5",
    keyTakeaways: [
      "Rytm dobowy reguluje, kiedy czujesz senność, a kiedy czujność.",
      "Światło poranne wzmacnia i stabilizuje zegar biologiczny.",
      "Światło wieczorne może opóźniać zasypianie.",
      "Kofeina może wpływać na sen przez wiele godzin po ostatnim łyku.",
    ],
    sections: [
      {
        heading: "Czym jest rytm dobowy?",
        paras: [
          "Twój rytm dobowy to wewnętrzny cykl trwający około 24 godzin, który kontroluje sen, czujność, hormony, temperaturę ciała i wiele więcej.",
          "Działa, czy zwracasz na niego uwagę, czy nie — ale sygnały zewnętrzne, zwłaszcza światło, utrzymują go w zgodzie ze światem.",
        ],
      },
      {
        heading: "Światło poranne a pora snu",
        paras: [
          "Jasne światło w pierwszej lub dwóch pierwszych godzinach po przebudzeniu wysyła do mózgu wyraźny sygnał 'dzień'. To zakotwicza zegar i ułatwia zaśnięcie następnej nocy.",
          "Światło zewnętrzne, nawet w pochmurny dzień, jest znacznie silniejsze niż oświetlenie wewnętrzne — a krótki spacer na zewnątrz to jedna z najprostszych popraw snu.",
        ],
      },
      {
        heading: "Ekspozycja na światło wieczorem",
        paras: [
          "Jasne światło późnym wieczorem — w tym z ekranów — może hamować melatoninę i opóźniać zegar biologiczny.",
          "Przyciemnij światła w ciągu ostatnich 60–90 minut przed snem, a Twój układ nerwowy otrzyma komunikat, że noc się zaczęła.",
        ],
      },
      {
        heading: "Jak kofeina wpływa na sen",
        paras: [
          "Kofeina blokuje adenozynę, cząsteczkę budującą 'presję snu' w ciągu dnia. Jej okres półtrwania wynosi około 5 godzin, co oznacza, że kawa wypita o 14:00 może nadal być w Twoim układzie o porze snu.",
          "Nawet gdy uda Ci się zasnąć, kofeina wieczorem może zmniejszyć sen głęboki — więc budzisz się mniej wypoczęty, nie wiedząc dlaczego.",
        ],
      },
      {
        heading: "Budowanie lepszych nawyków czasowych",
        paras: [
          "Staraj się o stałą porę wstawania, światło poranne codziennie i odcięcie kofeiny wczesnym popołudniem. Te trzy drobne zmiany mogą zmienić odczucie całego tygodnia.",
          "Regularność jest ważniejsza niż perfekcja. Małe, możliwe do utrzymania zmiany pokonują radykalne reformy.",
        ],
      },
    ],
    scienceNote:
      "Światło należy do najsilniejszych sygnałów kształtujących zegar dobowy — zwłaszcza jasne światło rano i warunki słabego oświetlenia wieczorem.",
    practicalTip:
      "Dostarcz światła dziennego w ciągu godziny od przebudzenia — nawet 5–10 minut spaceru wystarczy. Ustal też osobistą zasadę 'brak kofeiny po 14:00' na dwa tygodnie i zobacz, jak zareagują Twoje noce.",
    cta: { label: "Użyj kalkulatora pory snu", to: "/bedtime-calculator" },
    relatedGuide: { slug: "how-to-fall-asleep-fast" },
    relatedTool: {
      to: "/bedtime-calculator",
      label: "Kalkulator pory snu",
      desc: "Znajdź najlepszą porę kładzenia się.",
    },
    faqs: [
      {
        q: "Jak długo kofeina pozostaje w organizmie?",
        a: "Okres półtrwania kofeiny wynosi około 5 godzin, więc połowa kawy wypitej o 14:00 jest nadal aktywna o 19:00, a ćwierć o północy.",
      },
      {
        q: "Czy światło poranne naprawdę ma znaczenie?",
        a: "Tak — to jeden z najsilniejszych sygnałów zakotwiczających zegar dobowy. Nawet 5–10 minut na zewnątrz pomaga.",
      },
      {
        q: "Czy okulary blokujące światło niebieskie są warte uwagi?",
        a: "Ogólne zmniejszenie intensywności światła wieczorem zwykle ma większe znaczenie niż filtrowanie wyłącznie światła niebieskiego.",
      },
      {
        q: "Czy kawa bezkofeinowa jest całkowicie wolna od kofeiny?",
        a: "Nie całkowicie — bezkofeinowa kawa nadal zawiera niewielką ilość kofeiny, zwykle 2–15 mg na filiżankę.",
      },
      {
        q: "A jeśli pracuję na nocne zmiany?",
        a: "Szukaj strategicznej ekspozycji na jasne światło w trakcie 'dnia' i ciemności w trakcie 'nocy'. Praca zmianowa zakłóca rytm dobowy i korzysta z dostosowanego planu.",
      },
      {
        q: "Czy alkohol wpływa na mój zegar biologiczny?",
        a: "Alkohol fragmentuje sen i może zmieniać architekturę snu nawet wtedy, gdy pomaga szybciej zaśnąć.",
      },
      {
        q: "Jak szybko mogę zresetować swój rytm?",
        a: "Większość dorosłych przesuwa się o około 1 godzinę dziennie przy konsekwentnym świetle, posiłkach i porze wstawania.",
      },
    ],
    nextLesson: "stimulus-control",
  },
  "stimulus-control": {
    meta: {
      title: "Kontrola bodźców prostym językiem | somna",
      desc: "Poznaj jedną z najskuteczniejszych strategii CBT-I do odbudowania zdrowego połączenia między łóżkiem a snem.",
    },
    eyebrow: "SZYBKA LEKCJA",
    title: "Kontrola bodźców prostym językiem",
    subtitle:
      "Kontrola bodźców na nowo uczy proste, nabyte skojarzenie między łóżkiem a snem — i jest jednym z najpotężniejszych narzędzi CBT-I.",
    readingTime: "5",
    keyTakeaways: [
      "Łóżko powinno być kojarzone ze snem — nie z czuwaniem.",
      "Leżenie przytomnym w łóżku wzmacnia bezsenność.",
      "Regularność jest ważniejsza niż perfekcja.",
      "Poprawa wymaga praktyki; pierwsze noce są najtrudniejsze.",
    ],
    sections: [
      {
        heading: "Czym jest kontrola bodźców?",
        paras: [
          "Kontrola bodźców to praktyka używania łóżka i sypialni wyłącznie do snu i intymności.",
          "Cel jest prosty: gdy Twoje ciało przekracza próg sypialni, wie, co ma się wydarzyć.",
        ],
      },
      {
        heading: "Jak bezsenność zmienia skojarzenia łóżka",
        paras: [
          "Po wystarczającej liczbie nocy spędzonych w łóżku przytomnym, łóżko paruje się z frustracją, czujnością lub lękiem.",
          "To uwarunkowanie — ten sam rodzaj uczenia się, który sprawia, że ślinisz się na dźwięk znajomego obiadu. Twój mózg nie dyskutuje; po prostu reaguje.",
        ],
      },
      {
        heading: "Zasada 20 minut",
        paras: [
          "Jeśli nie śpisz po około 20 minutach (nie patrząc na zegar — szacuj), wstań z łóżka. Idź w inne miejsce przy przygaszonym świetle i zrób coś spokojnego: kilka stron lekkiej książki, powolne rozciąganie, spokojne siedzące oddychanie.",
          "Wróć do łóżka tylko wtedy, gdy poczujesz senność — ciężkie powieki, opadająca głowa. Powtarzaj w razie potrzeby. To brzmi nielogicznie, ale to serce kontroli bodźców.",
        ],
      },
      {
        heading: "Typowe błędy",
        paras: [
          "Korzystanie z telefonu w łóżku, praca w łóżku, oglądanie telewizji w łóżku lub leżenie i 'próbowanie mocniej' wszystko wzmacnia złe skojarzenie.",
          "Niekonsekwentne stosowanie również opóźnia efekty. Metoda działa najlepiej, gdy jest stosowana każdej nocy przez kilka tygodni.",
        ],
      },
      {
        heading: "Jakich wyników się spodziewać",
        paras: [
          "Większość osób odkrywa, że pierwsze 3–5 nocy jest trudnych — możesz początkowo spać mniej, bo spędzasz mniej czasu leżąc przytomny.",
          "W drugim tygodniu sen zwykle się konsoliduje: zasypiasz szybciej, rzadziej się budzisz i czujesz, że łóżko znowu staje się sygnałem snu.",
        ],
      },
    ],
    scienceNote:
      "Kontrola bodźców należy do najlepiej zbadanych technik CBT-I i jest zalecana jako samodzielne, oparte na dowodach leczenie przewlekłej bezsenności.",
    practicalTip:
      "Dziś wieczorem przenieś ekrany, materiały do pracy i laptopa poza sypialnię. Nawet niewielka fizyczna zmiana zmienia sygnał.",
    cta: { label: "Przeczytaj pełny przewodnik CBT-I", to: "/cbt-i-guide" },
    relatedGuide: { slug: "cbt-i-guide" },
    relatedTool: {
      to: "/calculator",
      label: "Kalkulator cykli snu",
      desc: "Dostosuj porę snu do naturalnych cykli.",
    },
    faqs: [
      {
        q: "Czym jest kontrola bodźców w CBT-I?",
        a: "Kontrola bodźców to praktyka używania łóżka wyłącznie do snu, wstawania z łóżka, gdy się nie śpi, i utrzymywania stałej pory wstawania — aby łóżko znowu stało się sygnałem snu.",
      },
      {
        q: "Jak długo trwa, zanim kontrola bodźców zadziała?",
        a: "Wiele osób zauważa poprawę w ciągu 1–3 tygodni konsekwentnej praktyki.",
      },
      {
        q: "Czy zasada 20 minut jest sztywna?",
        a: "To wytyczna. Nie patrz na zegar — szacuj. Jeśli jesteś wyraźnie przytomny i sfrustrowany, wstań z łóżka.",
      },
      {
        q: "Co robię, gdy wstaję z łóżka?",
        a: "Coś spokojnego przy przygaszonym świetle: lekka książka, powolne rozciąganie, siedzenie w ciszy. Unikaj ekranów, pracy i silnych bodźców.",
      },
      {
        q: "Czy kontrola bodźców działa przy nocnych przebudzeniach?",
        a: "Tak — ta sama zasada 20 minut ma zastosowanie. Jeśli obudzisz się i nie możesz zasnąć, wstań z łóżka i wróć dopiero z sennością.",
      },
      {
        q: "A jeśli wstawanie z łóżka sprawia, że jestem bardziej rozbudzony?",
        a: "Utrzymuj niskie światło, spokojną aktywność i rozluźnione ciało. Celem nie jest całkowita czujność, ale pozwolenie, by sen powrócił naturalnie.",
      },
      {
        q: "Czy mogę stosować kontrolę bodźców bez innych narzędzi CBT-I?",
        a: "Może być skuteczna sama w sobie, ale w połączeniu z ograniczeniem czasu w łóżku i stałą porą wstawania daje najlepsze efekty.",
      },
    ],
    nextLesson: "what-is-cbti",
  },
};

export const plLearnDict: LearnDict = {
  ui: plUi,
  titles: plTitles,
  summaries: plSummaries,
  lessons: plLessons,
};
