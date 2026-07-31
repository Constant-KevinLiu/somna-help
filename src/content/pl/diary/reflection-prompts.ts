/**
 * Polski — Guided CBT-I Reflection Prompts
 *
 * Treść stworzona rodzimym językiem.
 * Napisane przez rodzimego edukatora zdrowia snu.
 * Pytania terapeutyczne — NIE tłumacz w czasie wykonywania.
 */

import type { ContentPackage } from "@/content/content-types";
import type { ReflectionPrompt } from "@/lib/reflection/reflection-types";

const PL_REFLECTION_PROMPTS: ReflectionPrompt[] = [
  // Sleep Thoughts Category
  {
    id: "pl-thoughts-001",
    category: "sleep-thoughts",
    text: "Co przechodziło przez Twoją umysł podczas próby zaśnięcia wczorajszej nocy? Zapisz myśli, które czułeś jako najbardziej obecne, bez oceniania.",
  },
  {
    id: "pl-thoughts-002",
    category: "sleep-thoughts",
    text: "Czy jakaś konkretna obawa pojawiła się powtarzająco podczas leżenia w łóżku? Opisz ją z życzliwością dla siebie.",
  },
  {
    id: "pl-thoughts-003",
    category: "sleep-thoughts",
    text: "Jaką historię opowiedziałeś sobie o swoim śnie wczorajszej nocy? Czy pomogła Ci, czy wygenerowała większą presję?",
  },
  {
    id: "pl-thoughts-004",
    category: "sleep-thoughts",
    text: "Kiedy obudziłeś się w nocy, jaka była pierwsza myśl, która się pojawiła? Jak wpłynęła to na Twoją zdolność ponownego zaśnięcia?",
  },

  // Sleep Anxiety Category
  {
    id: "pl-anxiety-001",
    category: "sleep-anxiety",
    text: "W skali od spokojnego do przyspieszonego, jak opisałbyś swój stan umysłu podczas kładzenia się spać? Co przyczyniło się do tego uczucia?",
  },
  {
    id: "pl-anxiety-002",
    category: "sleep-anxiety",
    text: "Jakie fizyczne odczucia zauważyłeś w swoim ciele podczas próby relaksacji? Czy jakieś czułeś się szczególnie trudne do uwolnienia?",
  },
  {
    id: "pl-anxiety-003",
    category: "sleep-anxiety",
    text: "Czy martwiłeś się konsekwencjami złego snu przed położeniem się spać? Jakie były te lęki i jak bardzo realistyczne są?",
  },
  {
    id: "pl-anxiety-004",
    category: "sleep-anxiety",
    text: "Czy pomyślałeś 'muszę zasnąć TERAZ!' w którymś momencie? Jak ta presja sprawiła, że się czułeś?",
  },

  // Sleep Behaviors Category
  {
    id: "pl-behaviors-001",
    category: "sleep-behaviors",
    text: "Co zrobiłeś w godzinę przed położeniem się spać wczorajszej nocy? Jakie aktywności pomogły Ci odpocząć, a które utrzymały Cię w stanie czujności?",
  },
  {
    id: "pl-behaviors-002",
    category: "sleep-behaviors",
    text: "Jak bardzo konsekwentna była Twoja godzina położenia się spać w porównaniu do Twojego zwyczajowego wzorca? Jakie czynniki sprawiły, że była wcześniej lub później?",
  },
  {
    id: "pl-behaviors-003",
    category: "sleep-behaviors",
    text: "Czy używałeś ekranów w łóżku? Z jaką treścią współpracowałeś i jak wpłynęło to na Twoje przejście do snu?",
  },
  {
    id: "pl-behaviors-004",
    category: "sleep-behaviors",
    text: "Jaką przyjazną snu rutynę podążałeś? Czy jest mała zmiana, którą mógłbyś wprowadzić w swoim rytuale przed snem?",
  },

  // Relaxation Category
  {
    id: "pl-relax-001",
    category: "relaxation",
    text: "Opisz moment z wczoraj, w którym czułeś się naprawdę spokojny i zrelaksowany. Co sprawiło, że to uczucie było możliwe?",
  },
  {
    id: "pl-relax-002",
    category: "relaxation",
    text: "Jaką technikę relaksacyjną uznałeś za najbardziej pomocną? Kiedy ostatnio jej użyłeś i jak działała?",
  },
  {
    id: "pl-relax-003",
    category: "relaxation",
    text: "Jakie dźwięki lub doświadczenia zmysłowe pomagają Ci poczuć się w spokoju? Czy możesz przynieść więcej tego do swojej sypialni?",
  },
  {
    id: "pl-relax-004",
    category: "relaxation",
    text: "Pomyśl o swoim oddechu podczas kładzenia się spać wczorajszej nocy. Czy był płytki czy głęboki, szybki czy wolny? Jak by się czuł wolniejszy oddech?",
  },

  // Gratitude Category
  {
    id: "pl-gratitude-001",
    category: "gratitude",
    text: "Wymień trzy małe, konkretne rzeczy z wczoraj, które doceniłeś. Nie muszą być duże ani imponujące.",
  },
  {
    id: "pl-gratitude-002",
    category: "gratitude",
    text: "Co jest jedną rzeczą, którą Twoje ciało zrobiło dla Ciebie wczoraj, którą być może bierzesz za pewnik? Uznaj ten wysiłek tutaj.",
  },
  {
    id: "pl-gratitude-003",
    category: "gratitude",
    text: "Kto lub co sprawił, że czułeś się wspierany w ostatnim dniu? Napisz krótką notatkę wdzięczności za tę obecność.",
  },
  {
    id: "pl-gratitude-004",
    category: "gratitude",
    text: "Jaką delikatną rzecz zrobiłeś dla siebie wczoraj? Świętuj ten akt samoopieki, bez względu na to, jak mały jest.",
  },

  // Sleep Confidence Category
  {
    id: "pl-confidence-001",
    category: "sleep-confidence",
    text: "Kiedy spałeś dobrze w ostatnim miesiącu? Jakie były okoliczności i co zrobiłeś, co się do tego przyczyniło?",
  },
  {
    id: "pl-confidence-002",
    category: "sleep-confidence",
    text: "Co jest jedną rzeczą, którą wiesz, że pomaga Twojemu snowi i na którą możesz zaufać? Przypomnij sobie tę prawdę.",
  },
  {
    id: "pl-confidence-003",
    category: "sleep-confidence",
    text: "Nawet w trudnych nocach, jakie małe zwycięstwo odniosłeś ze swoim snem ostatnio? Uznaj swój wysiłek.",
  },
  {
    id: "pl-confidence-004",
    category: "sleep-confidence",
    text: "Jak by się czuło zaufanie do zdolności Twojego ciała do snu? Opisz to uczucie bezpieczeństwa i pewności.",
  },

  // Stimulus Control Category
  {
    id: "pl-stimulus-001",
    category: "stimulus-control",
    text: "Jak używasz swojego łóżka oprócz spania? Czy mógłbyś przenieść którąkolwiek z tych aktywności do innego pokoju?",
  },
  {
    id: "pl-stimulus-002",
    category: "stimulus-control",
    text: "Kiedy nie mogłeś zasnąć wczorajszej nocy, co zrobiłeś? Czy jest inne podejście, które mógłbyś spróbować następnym razem?",
  },
  {
    id: "pl-stimulus-003",
    category: "stimulus-control",
    text: "Jak wygląda i jak się czuje Twoje środowisko sypialni? Czy jest jedna regulacja, która sprawiłaby, że byłoby bardziej przyjazne snowi?",
  },
  {
    id: "pl-stimulus-004",
    category: "stimulus-control",
    text: "Jak szybko wstajesz z łóżka, kiedy nie możesz zasnąć? Jaka bariera — jeśli istnieje — powstrzymuje Cię przed wcześniejszym wstaniem?",
  },

  // Sleep Restriction Category
  {
    id: "pl-restriction-001",
    category: "sleep-restriction",
    text: "Ile czasu naprawdę spałeś wczorajszej nocy w porównaniu do czasu spędzonego w łóżku? Zauważ różnicę.",
  },
  {
    id: "pl-restriction-002",
    category: "sleep-restriction",
    text: "Co oznacza 'wydajność snu' dla Ciebie osobiście? Jak mogłoby zmienić Twoje noce zbudowanie silniejszego popędu snu?",
  },
  {
    id: "pl-restriction-003",
    category: "sleep-restriction",
    text: "Czy spędzasz więcej czasu w łóżku próbując 'nadrobić' sen? Jak to wpłynęło na jakość Twojego odpoczynku?",
  },
  {
    id: "pl-restriction-004",
    category: "sleep-restriction",
    text: "Jak by dla Ciebie wyglądała konsekwentna godzina wstania — nawet w weekendy? Jakie korzyści mogłoby to przynieść?",
  },

  // Night Awakenings Category
  {
    id: "pl-awakenings-001",
    category: "night-awakenings",
    text: "Kiedy obudziłeś się wczorajszej nocy, jaka była Twoja natychmiastowa reakcja? Czy się zirytowałeś, czy udało Ci się to obserwować spokojnie?",
  },
  {
    id: "pl-awakenings-002",
    category: "night-awakenings",
    text: "O której godzinie obudziłeś się i nie wróciłeś do snu szybko? Jakie myśli krążyły w tym czasie?",
  },
  {
    id: "pl-awakenings-003",
    category: "night-awakenings",
    text: "Budzenie się w nocy jest normalne. Kiedy czułeś się to najbardziej znośne dla Ciebie? Co było inaczej w tych momentach?",
  },
  {
    id: "pl-awakenings-004",
    category: "night-awakenings",
    text: "Jaka jest Twoja zwyczajowa strategia, kiedy nie możesz wrócić do snu? Czy jest nowa technika, którą chciałbyś ćwiczyć?",
  },

  // Cognitive Reframing Category
  {
    id: "pl-reframing-001",
    category: "cognitive-reframing",
    text: "Jaką negatywną myśl o śnie miałeś ostatnio? Czy możesz znaleźć bardziej zrównoważony sposób spojrzenia na tę samą sytuację?",
  },
  {
    id: "pl-reframing-002",
    category: "cognitive-reframing",
    text: "Zamiast 'muszę spać 8 godzin', jaką bardziej elastyczną i życzliwą myśl mógłbyś mieć o swoich potrzebach snu?",
  },
  {
    id: "pl-reframing-003",
    category: "cognitive-reframing",
    text: "Kiedy myślisz o 'złej nocy', czy pamiętasz cały obraz czy tylko trudną część? Napisz całą historię.",
  },
  {
    id: "pl-reframing-004",
    category: "cognitive-reframing",
    text: "Jaką katastroficzną myśl o złym śnie miałeś? Jaki dowód zaprzecza temu lękowi?",
  },
];

export const PL_REFLECTION_PACKAGE: ContentPackage<ReflectionPrompt[]> = {
  metadata: {
    locale: "pl",
    version: "1.0.0",
    reviewedAt: "2025-01-15",
    reviewedBy: "zespol-edukacja-snu-pl",
    medicalReviewStatus: "approved",
    nativeReviewStatus: "approved",
    lastUpdated: "2025-01-15",
  },
  content: PL_REFLECTION_PROMPTS,
};
