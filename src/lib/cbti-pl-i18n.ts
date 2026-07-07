/**
 * Słownik przewodników CBT-I w języku polskim.
 *
 * Zasada: teksty pisane natywnie po polsku, bez dosłownego tłumaczenia.
 * Trzymane osobno od słownika angielskiego, aby uniknąć przypadkowego
 * fallbacku i zapewnić lokalne SEO z rodzimymi tekstami.
 */

import type { CbtiDict, CbtiSlug } from "./cbti-i18n";

const plTitles: Record<CbtiSlug, string> = {
  "cbt-i-guide": "Przewodnik CBT-I",
  "sleep-anxiety": "Lęk a sen",
  "how-to-fall-asleep-fast": "Jak szybko zasnąć",
  "wake-up-at-3am": "Budzenie się o 3 w nocy",
  "insomnia-treatment": "Leczenie bezsenności",
};

const plSummaries: Record<CbtiSlug, string> = {
  "cbt-i-guide": "Pełne wprowadzenie do poznawczo-behawioralnej terapii bezsenności.",
  "sleep-anxiety": "Dlaczego martwienie się snem pogarsza sen — i jak przerwać ten cykl.",
  "how-to-fall-asleep-fast":
    "Techniki oparte na dowodach, które pomagają zasnąć szybciej, bez leków.",
  "wake-up-at-3am": "Przyczyny nocnych przebudzeń o świcie i co z nimi robić.",
  "insomnia-treatment": "CBT-I vs leki — co naprawdę mówią badania naukowe.",
};

const plUi: CbtiDict["ui"] = {
  guides: "Przewodniki",
  section: "Biblioteka CBT-I",
  readTime: "min czytania",
  badge: "Potwierdzone naukowo",
  takeawaysTitle: "Najważniejsze wnioski",
  strategyTitle: "Co zaleca CBT-I",
  relatedArticlesTitle: "Powiązane artykuły",
  faqTitle: "Najczęściej zadawane pytania",
  sleepDiary: "Dziennik snu",
  sleepDiaryDesc: "Zapisuj noce bez oceniania.",
};

const plArticles: CbtiDict["articles"] = {
  "cbt-i-guide": {
    meta: {
      title: "Przewodnik CBT-I: naukowe podejście do lepszego snu | somna",
      desc: "Dowiedz się, jak działa poznawczo-behawioralna terapia bezsenności (CBT-I) i dlaczego jest uważana za pierwszą linię leczenia przewlekłej bezsenności.",
    },
    eyebrow: "BIBLIOTEKA CBT-I",
    title: "Przewodnik CBT-I: naukowe podejście do lepszego snu",
    intro:
      "Poznawczo-behawioralna terapia bezsenności (CBT-I) to złoty standard niefarmakologicznego leczenia przewlekłej bezsenności. Ten przewodnik wyjaśnia, jak działa, czego oczekiwać i jak zacząć.",
    readTime: "8",
    takeaways: [
      "CBT-I jest zalecana jako pierwsza linia leczenia przewlekłej bezsenności przez główne organizacje medyczne.",
      "Działa przez ponowne nauczenie mózgu relacji ze snem — nie przez usypianie.",
      "Większość osób zauważa znaczącą poprawę w ciągu 4–8 tygodni.",
      "Nie ma działań niepożądanych, a korzyści utrzymują się długo po zakończeniu programu.",
    ],
    sections: [
      {
        heading: "Czym jest CBT-I?",
        paras: [
          "CBT-I to uporządkowany, ograniczony czasowo program, który adresuje myśli i zachowania podtrzymujące bezsenność. W przeciwieństwie do tabletek nasennych, zajmuje się przyczynami, a nie tylko maskowaniem objawów.",
          "Typowy program trwa 4–8 tygodni, z cotygodniowymi krokami, które łagodnie odbudowują naturalną presję snu i pewność siebie w zasypianiu.",
        ],
      },
      {
        heading: "Dlaczego CBT-I działa",
        paras: [
          "Przewlekła bezsenność jest zwykle podtrzymywana przez samonakręcającą się pętlę: złe noce tworzą lęk przed snem, który zwiększa pobudzenie, co sprawia, że następna noc jest jeszcze gorsza. CBT-I przerywa tę pętlę z wielu stron jednocześnie.",
        ],
      },
      {
        heading: "Pięć kluczowych składników",
        bullets: [
          "Ograniczenie czasu w łóżku — tymczasowe skrócenie czasu w łóżku, by odbudować presję snu.",
          "Kontrola bodźców — ponowne skojarzenie łóżka ze snem, a nie z czuwaniem.",
          "Restrukturyzacja poznawcza — łagodzenie lękliwych myśli o śnie.",
          "Higiena snu — drobne zmiany środowiskowe i stylu życia.",
          "Trening relaksacyjny — uspokajanie reakcji stresowej ciała wieczorem.",
        ],
      },
      {
        heading: "Jakich wyników można oczekiwać?",
        paras: [
          "Badania pokazują, że 70–80% osób z przewlekłą bezsennością reaguje na CBT-I. Większość zauważa, że zasypia szybciej, rzadziej się budzi i ma więcej energii w ciągu dnia.",
        ],
      },
      {
        heading: "Jak długo trwa CBT-I?",
        paras: [
          "Większość programów trwa 4–8 tygodni. Niektóre poprawy pojawiają się już w pierwszych 1–2 tygodniach, ale głębsze efekty przychodzą z regularnością.",
        ],
      },
      {
        heading: "Czy CBT-I jest lepsza niż tabletki nasenne?",
        paras: [
          "Obie mogą pomóc krótkoterminowo, ale tylko CBT-I wykazuje trwałe korzyści po zakończeniu leczenia. Główne wytyczne dotyczące snu (AASM, ACP) zalecają CBT-I jako pierwszą linię leczenia.",
        ],
      },
    ],
    strategyIntro: "Jeśli możesz zapamiętać tylko kilka idei z CBT-I, zapamiętaj te.",
    strategyItems: [
      {
        title: "Utrzymuj stałą porę wstawania",
        desc: "Codziennie, także w weekendy. To najsilniejsza dźwignia dla Twojego zegara biologicznego.",
      },
      {
        title: "Wstawaj z łóżka, gdy nie możesz zasnąć",
        desc: "Po około 20 minutach czuwania idź w inne miejsce przy przygaszonym świetle i zrób coś spokojnego. Wróć tylko, gdy poczujesz senność.",
      },
      {
        title: "Ogranicz czas w łóżku do rzeczywistego czasu snu",
        desc: "Leżenie godzinami w łóżku w oczekiwaniu na sen osłabia skojarzenie między łóżkiem a snem.",
      },
      {
        title: "Traktuj myśli jak myśli",
        desc: "Nie musisz walczyć z lękliwymi myślami o śnie. Rozpoznaj je i pozwól im przejść.",
      },
    ],
    cta: { label: "Zacznij zapisywać swój sen", to: "/diary" },
    faqs: [
      {
        q: "Czy CBT-I jest dla mnie odpowiednia?",
        a: "CBT-I pomaga większości dorosłych z przewlekłą bezsennością (trudności ze snem 3+ noce w tygodniu, przez 3+ miesiące). Jeśli masz nieleczone bezdechy senne, zespół niespokojnych nóg lub zaburzenia nastroju, najpierw porozmawiaj z lekarzem.",
      },
      {
        q: "Czy potrzebuję terapeuty?",
        a: "Praca z wyszkolonym klinicystą daje najsilniejsze efekty, ale samodzielne i cyfrowe programy CBT-I również mają potwierdzoną skuteczność.",
      },
      {
        q: "Czy będę musiał zrezygnować z drzemek?",
        a: "Zwykle tak, przynajmniej w fazie aktywnej. Drzemki zmniejszają presję snu, która jest paliwem, z którego korzysta CBT-I.",
      },
      {
        q: "Jaka jest różnica między CBT-I a higieną snu?",
        a: "Higiena snu to tylko niewielka część CBT-I. Samodzielnie rzadko rozwiązuje przewlekłą bezsenność — składniki behawioralne i poznawcze wykonują większość pracy.",
      },
      {
        q: "Czy CBT-I może początkowo pogorszyć bezsenność?",
        a: "Ograniczenie czasu w łóżku może wydawać się trudniejsze w tygodniach 1–2, ponieważ celowo zwiększa presję snu. To tymczasowe, zaplanowane i zwykle szybko się poprawia.",
      },
      {
        q: "Czy CBT-I działa u osób starszych?",
        a: "Tak. Badania pokazują dobre wyniki u osób starszych, często lepsze niż leki i bez działań niepożądanych.",
      },
      {
        q: "Czy mogę stosować CBT-I, biorąc tabletki nasenne?",
        a: "Często tak, pod okiem lekarza. Wiele osób stopniowo zmniejsza dawkowanie leków w trakcie lub po CBT-I.",
      },
      {
        q: "Jak długo utrzymują się korzyści?",
        a: "Badania obserwacyjne pokazują utrzymujące się korzyści przez 1–3 lata po programie CBT-I, co jest rzadkie w przypadku jakiegokolwiek leczenia bezsenności.",
      },
    ],
  },
  "sleep-anxiety": {
    meta: {
      title: "Lęk a sen: dlaczego martwienie się snem pogarsza sen | somna",
      desc: "Zrozum, jak rozwija się lęk związany ze snem i poznaj techniki CBT-I, by przerwać cykl troski i bezsenności.",
    },
    eyebrow: "BIBLIOTEKA CBT-I",
    title: "Lęk a sen: dlaczego martwienie się snem pogarsza sen",
    intro:
      "Martwienie się snem jest jednym z najczęstszych czynników podtrzymujących bezsenność. Zrozumienie cyklu to pierwszy krok, by go osłabić.",
    readTime: "7",
    takeaways: [
      "Lęk snu to reakcja nauczona — Twój mózg próbuje Cię chronić.",
      "Im bardziej starasz się na siłę zasnąć, tym bardziej Twój układ nerwowy pozostaje w stanie czujności.",
      "Akceptacja, a nie kontrola, to to, czego CBT-I używa do przerwania cyklu.",
      "Drobne zmiany w ciągu dnia mogą zmienić, jak czuje się następna noc.",
    ],
    sections: [
      {
        heading: "Czym jest lęk snu?",
        paras: [
          "Lęk snu to niepokój, obawa lub stan hiperwigilancji, który nasila się w okolicy pory snu i w środku nocy. To nie wada osobista — to uwarunkowana odpowiedź mózgu, który nauczył się kojarzyć łóżko z walką.",
        ],
      },
      {
        heading: "Cykl lęk–bezsenność",
        paras: [
          "Kilka złych nocy wywołuje troskę o przyszłe złe noce. Troska zwiększa kortyzol i tętno. To pobudzenie sprawia, że następna noc jest trudniejsza, potwierdzając troskę. I tak cykl trwa.",
        ],
      },
      {
        heading: "Typowe lękliwe myśli",
        bullets: [
          '"A co jeśli dziś nie zasnę?"',
          '"Jutro będę wyczerpany i nie poradzę sobie."',
          '"Wszyscy inni zasypiają — co jest ze mną nie tak?"',
          '"Muszę teraz zasnąć, inaczej noc jest stracona."',
        ],
      },
      {
        heading: "Dlaczego mózg staje się hiperczujny",
        paras: [
          "Twój mózg się uczy. Po wystarczającej liczbie nocy, w których łóżko oznaczało trudności, samo położenie się może wywołać reakcję alarmu — przyspieszone serce, goniące myśli, rozgrzana skóra. To uwarunkowanie, nie słabość.",
        ],
      },
      {
        heading: "Strategie CBT-I na lęk snu",
        bullets: [
          "Kontrola bodźców — wstawaj z łóżka, gdy czuwanie się przeciąga.",
          "Defuzja poznawcza — pozwól myślom przepływać bez angażowania się.",
          "Intencja paradoksalna — spróbuj łagodnie pozostać przytomnym i spokojnym, zdejmując presję zasypiania.",
          "Okno zmartwień w ciągu dnia — przetwarzaj troski następnego dnia wcześniej, nie o północy.",
        ],
      },
      {
        heading: "Akceptacja kontra kontrola",
        paras: [
          "Snu nie można wymusić. Im bardziej pchać, tym bardziej system odepchnie. CBT-I prosi o coś nielogicznego: poddaj się walce. Ciało zasypia, gdy czuje się bezpiecznie.",
        ],
      },
    ],
    strategyIntro: "Gdy lęk snu wybuchnie, postaw na te strategie.",
    strategyItems: [
      {
        title: "Porzuć cel zasypiania",
        desc: "Dąż do odpoczynku, nie snu. Sen przychodzi jako efekt uboczny poczucia bezpieczeństwa i spokoju.",
      },
      {
        title: "Wstawaj z łóżka, jeśli kręcisz się",
        desc: "Idź w miejsce o słabym świetle i małym pobudzeniu. Wróć tylko wtedy, gdy naprawdę poczujesz senność.",
      },
      {
        title: "Zaplanuj zmartwienia na wcześniej",
        desc: "Poświęć 10 minut wczesnym wieczorem na zapisanie trosk. Zamknij notes.",
      },
      {
        title: "Wydłużaj wydech",
        desc: "Długi, spokojny wydech obniża tętno i sygnalizuje bezpieczeństwo układowi nerwowemu.",
      },
    ],
    cta: { label: "Przeczytaj pełny przewodnik CBT-I", to: "/cbt-i-guide" },
    faqs: [
      {
        q: "Dlaczego zwykle zaczyna się lęk snu?",
        a: "Stresujące wydarzenie życiowe, choroba lub okres złych nocy zazwyczaj zasiewa ziarno. Mózg potem uczy się kojarzyć łóżko z walką.",
      },
      {
        q: "Czy lęk snu to to samo co bezsenność?",
        a: "Bardzo się pokrywają. Lęk snu to jedna z najczęstszych przyczyn podtrzymywania przewlekłej bezsenności.",
      },
      {
        q: "Czy mogę po prostu wziąć coś na uspokojenie?",
        a: "Sedatywy mogą pomóc krótkoterminowo, ale zwykle nie leczą leżącego u podstaw uwarunkowania. CBT-I reedukuje samą odpowiedź.",
      },
      {
        q: "Dlaczego czuję się niespokojny tylko przed snem?",
        a: "Ponieważ to sygnał, którego nauczył się Twój mózg. Poza sypialnią reakcja alarmu nie jest aktywowana.",
      },
      {
        q: "Czy patrzenie na zegar pomaga?",
        a: "Nie. Obserwowanie zegara niezawodnie zwiększa lęk. Odwróć go lub schowaj.",
      },
      {
        q: "Jak długo zajmuje poczucie większego spokoju przed snem?",
        a: "Większość osób zauważa pewną ulgę między 2 a 4 tygodniami konsekwentnej praktyki CBT-I.",
      },
      {
        q: "Czy oddychanie naprawdę pomaga?",
        a: "Tak — powolne, wydłużone wydechy (np. 4-7-8 lub oddychanie pudełkowe) niezawodnie obniżają fizjologiczny stan czujności.",
      },
      {
        q: "Kiedy powinienem zwrócić się do klinicysty?",
        a: "Jeśli lęk snu towarzyszą dzienne ataki paniki, utrzymujący się obniżony nastrój lub znaczące pogorszenie funkcjonowania, poszukaj wsparcia.",
      },
    ],
  },
  "how-to-fall-asleep-fast": {
    meta: {
      title: "Jak szybko zasnąć: strategie snu oparte na dowodach | somna",
      desc: "Odkryj techniki potwierdzone naukowo, które pomagają zasnąć szybciej bez polegania na lekach nasennych.",
    },
    eyebrow: "BIBLIOTEKA CBT-I",
    title: "Jak szybko zasnąć: strategie snu oparte na dowodach",
    intro:
      "Zasypiania nie można wymusić — ale można stworzyć warunki, w których sen przychodzi łatwiej. Zobacz, co naprawdę popiera nauka.",
    readTime: "6",
    takeaways: [
      "Większość dorosłych zasypia w ciągu 10–20 minut — to norma, nie powolność.",
      "Próby mocniejszego zasypiania niemal zawsze dają efekt odwrotny.",
      "Światło, temperatura i pora dnia mają większe znaczenie niż jakakolwiek pojedyncza technika.",
      "Jeśli jesteś przytomny po około 20 minutach, wstań z łóżka.",
    ],
    sections: [
      {
        heading: "Dlaczego czasem trudno zasnąć",
        paras: [
          "Zasypianie zależy od dwóch systemów: presji snu (gromadzonej przez godziny czuwania) i rytmu dobowego (Twojego zegara biologicznego). Gdy jeden z nich jest rozregulowany, dłużej trwa zaśnięcie.",
          "Stres, ekrany, kofeina popołudniowa i nieregularne pory dnia opóźniają zasypianie.",
        ],
      },
      {
        heading: "Typowe błędy",
        bullets: [
          "Kładzenie się przed poczuciem prawdziwej senności.",
          "Korzystanie z telefonu w łóżku.",
          "Patrzenie na zegar, gdy nie można zasnąć.",
          "Próbowanie zasypiania czystym wysiłkiem.",
          "Picie alkoholu, by się zrelaksować — on później fragmentuje sen.",
        ],
      },
      {
        heading: "Zalecenia CBT-I",
        bullets: [
          "Idź do łóżka tylko wtedy, gdy jesteś senny, nie tylko zmęczony.",
          "Utrzymuj stałą porę wstawania, nawet po złych nocach.",
          "Przyciemniaj światła 60–90 minut przed snem.",
          "Utrzymuj sypialnię chłodną (ok. 18°C).",
        ],
      },
      {
        heading: "Metody relaksacji, które naprawdę pomagają",
        bullets: [
          "Progresywny relaks mięśni — napinaj i rozluźniaj grupy mięśni, od głowy do stóp.",
          "Body scan — powoli przesuwaj uwagę po ciele.",
          "Kognitywne mieszanie — wyobrażaj sobie losowe, niepowiązane obrazy, by odciążyć umysł.",
        ],
      },
      {
        heading: "Ćwiczenia oddechowe",
        paras: [
          "Powolne oddychanie nosem z długim wydechem to technika o największym poparciu naukowym. Wypróbuj 4-7-8 (wdech 4 s, wstrzymanie 7 s, wydech 8 s) przez 4 cykle lub proste oddychanie 4-6.",
        ],
      },
      {
        heading: "Co robić, gdy nie możesz zasnąć",
        paras: [
          "Jeśli minie 20 minut i wciąż jesteś bardzo przytomny, wstań. Usiądź w cichym miejscu przy przygaszonym świetle. Przeczytaj coś lekkiego. Wróć, gdy poczujesz senność. To odbudowuje połączenie łóżko–sen.",
        ],
      },
    ],
    strategyIntro: "Dziś wieczorem wypróbuj te kroki — po kolei.",
    strategyItems: [
      {
        title: "Przyciemnij wszystko 60 min przed snem",
        desc: "Światło hamuje melatoninę. Niższe natężenie światła to najłatwiejszy sposób na wsparcie melatoniny.",
      },
      {
        title: "Zostaw ekrany poza sypialnią",
        desc: "Albo przynajmniej przestań scrollować, gdy już jesteś w łóżku.",
      },
      {
        title: "Poczekaj, aż sen przyjdzie",
        desc: "Zmęczenie to nie to samo co senność. Senność = ciężkie powieki, opadająca głowa. Kładź się dopiero wtedy.",
      },
      {
        title: "Jeśli czuwasz 20 min, wstań z łóżka",
        desc: "Spokojna aktywność przy słabym świetle do momentu poczucia senności. To najpotężniejsze narzędzie CBT-I do zasypiania.",
      },
    ],
    cta: { label: "Użyj kalkulatora pory snu", to: "/bedtime-calculator" },
    faqs: [
      {
        q: "Jak długo powinno zajmować zasypianie?",
        a: "Około 10–20 minut to zdrowe. Mniej niż 5 minut może wskazywać na deprywację snu; więcej niż 30 minut regularnie sugeruje bezsenność.",
      },
      {
        q: "Czy liczenie owiec działa?",
        a: "Niewiele. Kognitywne mieszanie — losowe, niepowiązane obrazy — działa lepiej dla większości osób.",
      },
      {
        q: "Czy aplikacje do snu i szumy są skuteczne?",
        a: "Stały dźwięk otoczenia pomaga niektórym zagłuszać nagłe hałasy. Skuteczność jest różna.",
      },
      {
        q: "Czy czytać w łóżku?",
        a: "Jeśli czytanie zwykle Cię usypia, tak. Jeśli pobudza, czytaj gdzie indziej i wracaj do łóżka dopiero z sennością.",
      },
      {
        q: "Czy melatonina pomaga szybciej zasnąć?",
        a: "Może dostosować porę snu, szczególnie przy jet lagu lub opóźnionej fazie snu. Nie jest środkiem nasennym.",
      },
      {
        q: "A ćwiczenia?",
        a: "Regularne ćwiczenia poprawiają zasypianie. Unikaj intensywnych aktywności na 2 godziny przed snem.",
      },
      {
        q: "Jaka jest najlepsza temperatura w sypialni?",
        a: "Chłodno — ok. 16–19°C dla większości dorosłych.",
      },
      {
        q: "A jeśli po prostu nie mogę zasnąć?",
        a: "Wstań i idź w inne miejsce przy słabym świetle. Walka z czuwaniem tylko utrzymuje układ nerwowy włączony.",
      },
    ],
  },
  "wake-up-at-3am": {
    meta: {
      title: "Dlaczego budzę się o 3 w nocy każdej nocy? | somna",
      desc: "Zrozum powszechne przyczyny budzenia się o świcie i dowiedz się, co CBT-I zaleca, by poprawić ciągłość snu.",
    },
    eyebrow: "BIBLIOTEKA CBT-I",
    title: "Dlaczego budzę się o 3 w nocy każdej nocy?",
    intro:
      "Budzenie się w środku nocy to jeden z najczęstszych — i najbardziej frustrujących — wzorców bezsenności. Zobacz, dlaczego tak się dzieje i co pomaga.",
    readTime: "6",
    takeaways: [
      "Krótkie przebudzenia między cyklami snu są całkowicie normalne.",
      "Problem rzadko polega na obudzeniu — na tym, że trudno z powrotem zasnąć.",
      "Stres i hiperwigilancja często osiągają szczyt w drugiej połowie nocy.",
      "To, co robisz przez te 20 minut, ma większe znaczenie niż powód przebudzenia.",
    ],
    sections: [
      {
        heading: "Czy budzenie się o 3 w nocy jest normalne?",
        paras: [
          "Tak. Osoby dobrze śpiące budzą się krótko między cyklami snu kilka razy w nocy i zasypiają z powrotem natychmiast. Problem nie w obudzeniu, ale w utknięciu.",
        ],
      },
      {
        heading: "Stres i hiperwigilancja",
        paras: [
          "Kortyzol zaczyna naturalnie wzrastać w drugiej połowie nocy, by przygotować Cię do przebudzenia. Gdy stres jest wysoki, wzrost zaczyna się wcześniej i jest silniejszy — wyciągając Cię ze snu między 2 a 4 rano.",
        ],
      },
      {
        heading: "Cykle snu a przebudzenia",
        paras: [
          "O 3 w nocy większość dorosłych zakończyła już kilka cykli snu i spędza więcej czasu w lżejszym śnie REM, z którego łatwiej się obudzić. Mały hałas lub zmiana temperatury mogą wystarczyć.",
        ],
      },
      {
        heading: "Inne powszechne przyczyny",
        bullets: [
          "Alkohol — relaksuje na początku, ale fragmentuje sen 4–6 godzin później.",
          "Późne posiłki lub spadek cukru we krwi.",
          "Zbyt ciepła sypialnia.",
          "Nieleczony bezdech senny lub zespół niespokojnych nóg.",
          "Pełny pęcherz (szczególnie przy piciu wieczorem).",
        ],
      },
      {
        heading: "Czego NIE robić",
        bullets: [
          "Nie patrz na zegar.",
          "Nie sięgaj po telefon.",
          "Nie leż wymuszając sen przez 30+ minut.",
          "Nie zaczynaj planować następnego dnia.",
        ],
      },
      {
        heading: "Zalecenia CBT-I",
        paras: [
          "Po około 20 minutach czuwania wstań z łóżka. Usiądź w spokojnym miejscu przy słabym świetle. Zrób coś łagodnie angażującego. Wróć tylko, gdy poczujesz senność. W ciągu tygodni przebudzenia skracają się i często znikają.",
        ],
      },
      {
        heading: "Kiedy szukać pomocy medycznej",
        paras: [
          "Jeśli przebudzenia towarzyszą duszności, dławienie się, głośne chrapanie, mimowolne ruchy nóg lub dzienne zmęczenie mimo godzin spędzonych w łóżku, porozmawiaj z lekarzem — może to wskazywać na bezdech senny lub inne leczalne zaburzenie.",
        ],
      },
    ],
    strategyIntro: "Następnym razem, gdy obudzisz się o 3 w nocy, wypróbuj tę sekwencję.",
    strategyItems: [
      {
        title: "Nie patrz na zegar",
        desc: "Wiedza, że jest 3 w nocy, natychmiast aktywuje cykl troski.",
      },
      {
        title: "Zostań w bezruchu i oddychaj powoli",
        desc: "Długie wydechy. Żaden wysiłek, by zasnąć — po prostu odpoczywaj.",
      },
      {
        title: "Po około 20 min wstań",
        desc: "Słabe światło, spokojna aktywność. Wróć, gdy poczujesz senność, nie wcześniej.",
      },
      {
        title: "Wstań o zwykłej porze",
        desc: "Nie przesypiaj się. Ochrona pory wstawania chroni presję snu następnej nocy.",
      },
    ],
    flow: {
      heading: "Schemat postępowania przy nocnym przebudzeniu",
      yes: "Tak",
      no: "Nie",
      nodes: [
        {
          q: "Obudziłeś się?",
          yes: "Zostań w bezruchu, oddychaj powoli.",
          no: "Kontynuuj odpoczynek.",
        },
        {
          q: "Wciąż przytomny po około 20 minutach?",
          yes: "Wstań z łóżka. Słabe światło. Spokojna aktywność.",
          no: "Pozwól snu wrócić.",
        },
        {
          q: "Znów czujesz senność?",
          yes: "Wróć do łóżka.",
          no: "Pozostań przytomny do poczucia senności.",
        },
        { action: "Wstań o zwykłej porze — nie przesypiaj się." },
      ],
    },
    cta: { label: "Śledź swoje wzorce snu", to: "/diary" },
    faqs: [
      {
        q: "Dlaczego akurat o 3 w nocy?",
        a: "Kortyzol naturalnie wzrasta w drugiej połowie nocy, a sen jest wtedy lżejszy. Okno 2–4 w nocy jest najczęstsze dla przebudzeń.",
      },
      {
        q: "Czy to oznacza problem kliniczny?",
        a: "Zwykle nie. Ale trwałe przebudzenia w środku nocy z objawami dziennymi wymagają oceny lekarskiej.",
      },
      {
        q: "Dlaczego nie mogę z powrotem zasnąć?",
        a: "Często dlatego, że umysł aktywuje się w momencie, gdy zdaje sobie sprawę, że jesteś obudzony — a troska blokuje powrót do snu.",
      },
      {
        q: "Czy powinienem coś zjeść?",
        a: "Tylko jeśli głód jest wyraźnym wyzwalaczem. W przeciwnym razie jedzenie wzmacnia czuwanie w środku nocy.",
      },
      {
        q: "Czy alkohol to pogarsza?",
        a: "Bardzo prawdopodobne. Alkohol fragmentuje sen, szczególnie w drugiej połowie nocy.",
      },
      {
        q: "Czy to oznacza, że mam bezsenność?",
        a: "Częste przebudzenia w środku nocy z trudnością w powrocie do snu, 3+ noce w tygodniu przez 3+ miesiące, spełniają definicję bezsenności.",
      },
      {
        q: "Czy melatonina może pomóc przy budzeniu się o 3 w nocy?",
        a: "Zwykle nie — melatonina wpływa na porę snu, nie na jego podtrzymanie.",
      },
      {
        q: "Czy CBT-I pomaga?",
        a: "Tak — CBT-I jest wysoce skuteczna zarówno przy długim zasypianiu, jak i przy nocnych przebudzeniach.",
      },
    ],
  },
  "insomnia-treatment": {
    meta: {
      title: "Leczenie bezsenności: CBT-I czy leki? | somna",
      desc: "Porównaj CBT-I i leki nasenne i dowiedz się, które opcje leczenia mają poparcie naukowe.",
    },
    eyebrow: "BIBLIOTEKA CBT-I",
    title: "Leczenie bezsenności: CBT-I czy leki?",
    intro:
      "Leki działają szybko. CBT-I idzie głębiej. Zobacz uczciwe, oparte na dowodach porównanie, aby dobrze wybrać.",
    readTime: "7",
    takeaways: [
      "CBT-I jest zalecana jako pierwsza linia leczenia przez główne wytyczne dotyczące snu.",
      "Leki mogą pomóc krótkoterminowo, ale rzadko rozwiązują przewlekłą bezsenność.",
      "CBT-I ma trwałe korzyści i brak działań niepożądanych.",
      "Oba podejścia można łączyć pod okiem lekarza.",
    ],
    sections: [
      {
        heading: "Czym jest bezsenność?",
        paras: [
          "Bezsenność to trudność w zaśnięciu, utrzymaniu snu lub zbyt wczesne budzenie — przynajmniej 3 noce w tygodniu, przez 3+ miesiące, z wpływem na funkcjonowanie dzienne. To stan kliniczny, nie cecha osobowości.",
        ],
      },
      {
        heading: "Opcja 1 — CBT-I",
        paras: [
          "Uporządkowany program oparty na dowodach, który adresuje myśli i zachowania podtrzymujące bezsenność. Trwa 4–8 tygodni. Bez leków. Efekty utrzymują się długo po zakończeniu programu.",
        ],
      },
      {
        heading: "Opcja 2 — Leki nasenne",
        paras: [
          "Obejmują przepisane hipnotyki (z-leki, benzodiazepiny), sedatywny antydepresanty i leki dostępne bez recepty. Mogą skrócić czas zasypiania, ale często tracą skuteczność, mogą powodować uzależnienie i nie leczą przyczyn.",
        ],
      },
      {
        heading: "Wady i zalety",
        bullets: [
          "CBT-I — trwała, bez działań niepożądanych, wymaga wysiłku i cierpliwości.",
          "Leki — szybka ulga, możliwe działania niepożądane, często bezsenność nawrotowa po odstawieniu.",
        ],
      },
      {
        heading: "Które podejście działa długoterminowo?",
        paras: [
          "Badania są jasne: CBT-I przewyższa leki w obserwacji 6–12 miesięcy. Korzyść z leków maleje po ich odstawieniu; korzyść z CBT-I zwykle się utrzymuje.",
        ],
      },
      {
        heading: "Czy można je łączyć?",
        paras: [
          "Tak. Wielu klinicystów stosuje leki krótkoterminowo razem z CBT-I, a potem stopniowo je odstawia. Zawsze koordynuj z osobą przepisującą.",
        ],
      },
    ],
    strategyIntro: "Jeśli wybierasz, od czego zacząć, rozważ to.",
    strategyItems: [
      {
        title: "Gdy to możliwe, najpierw wypróbuj CBT-I",
        desc: "Zalecana przez AASM i ACP jako pierwsza linia leczenia przewlekłej bezsenności.",
      },
      {
        title: "Używaj leków jako mostu, nie celu",
        desc: "Krótkoterminowo, w minimalnej skutecznej dawce, z planem stopniowego odstawiania.",
      },
      {
        title: "Pracuj nad nawykami dziennymi",
        desc: "Pora kofeiny, alkohol, ekspozycja na światło i ćwiczenia kształtują Twoje noce.",
      },
      {
        title: "Monitoruj swój sen",
        desc: "Prosty dziennik snu ujawnia wzorce, których żadna aplikacja nie jest w stanie odgadnąć.",
      },
    ],
    cta: { label: "Poznaj przewodnik CBT-I", to: "/cbt-i-guide" },
    faqs: [
      {
        q: "Czy CBT-I jest naprawdę lepsza niż tabletki nasenne?",
        a: "W przypadku przewlekłej bezsenności tak — w długoterminowej obserwacji. Przy ostrym, incydentalnym problemie ze snem krótkoterminowe leki mogą być odpowiednie.",
      },
      {
        q: "Czy leki nasenne są bezpieczne?",
        a: "Stosowane krótkoterminowo i zgodnie z przepisaniem zwykle tak. Ryzyka obejmują uzależnienie, dzienne senność, upadki (szczególnie u osób starszych) i bezsenność nawrotową.",
      },
      {
        q: "A leki nasenne bez recepty?",
        a: "Większość zawiera sedytywne leki przeciwhistaminowe. Mogą powodować dzienne senność i szybko rozwija się tolerancja. Nie są zalecane długoterminowo.",
      },
      {
        q: "Czy melatonina to lek nasenny?",
        a: "Nie — reguluje porę snu, zamiast uśpiać. Jest bardziej przydatna przy jet lagu i opóźnionej fazie snu.",
      },
      {
        q: "Ile kosztuje CBT-I?",
        a: "Różnie. Terapia indywidualna jest najdroższa, grupowa ma koszt pośredni, a cyfrowe CBT-I (w tym samodzielne) zazwyczaj są najbardziej dostępne.",
      },
      {
        q: "A jeśli biorę leki od lat?",
        a: "Wiele osób jest w stanie stopniowo zmniejszać dawkowanie podczas CBT-I, z wsparciem osoby przepisującej. Nie przerywaj nagłe.",
      },
      {
        q: "Czy ubezpieczenie pokrywa CBT-I?",
        a: "W wielu regionach tak, szczególnie gdy prowadzi ją licencjonowany klinicysta. Pokrycie programów cyfrowych jest różne.",
      },
      {
        q: "Skąd wiem, że leczenie działa?",
        a: "Zasypiasz szybciej, rzadziej się budzisz, utrzymujesz bardziej regularne pory i masz więcej energii w ciągu dnia. Dziennik snu pomaga obiektywnie zobaczyć postęp.",
      },
    ],
  },
};

export const plCbtiDict: CbtiDict = {
  ui: plUi,
  titles: plTitles,
  summaries: plSummaries,
  articles: plArticles,
};
