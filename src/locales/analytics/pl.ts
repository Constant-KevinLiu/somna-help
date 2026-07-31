/**
 * Phase F — Analytics & Insight Polish Dictionary
 */
import type { Dict } from "@/lib/i18n";

export const analyticsPl: Dict = {
  "analytics.window.7d": "Ostatnie 7 dni",
  "analytics.window.14d": "Ostatnie 14 dni",
  "analytics.window.30d": "Ostatnie 30 dni",
  "analytics.window.90d": "Ostatnie 90 dni",
  "analytics.window.thisWeek": "Ten tydzień",
  "analytics.window.lastWeek": "Zeszły tydzień",
  "analytics.window.thisMonth": "Ten miesiąc",
  "analytics.window.lastMonth": "Zeszły miesiąc",

  "analytics.sufficiency.none":
    "Zacznij rejestrować swój sen, aby zobaczyć swoje wzorce.",
  "analytics.sufficiency.insufficient":
    "Kontynuuj rejestrację przez kilka dni, aby zobaczyć wyraźniejszy wzorzec.",
  "analytics.sufficiency.limited":
    "To co widzimy jak dotąd — kontynuuj rejestrację, aby uzyskać pełniejszy obraz.",
  "analytics.sufficiency.sufficient": "",

  "analytics.metric.timeInBed": "Czas w Łóżku",
  "analytics.metric.totalSleepTime": "Całkowity Czas Snu",
  "analytics.metric.sleepEfficiency": "Efektywność Snu",
  "analytics.metric.sleepOnsetLatency": "Latencja Snu",
  "analytics.metric.wakeAfterSleepOnset": "Przebudzenia Nocne",
  "analytics.metric.numberOfAwakenings": "Liczba Przebudzeń",
  "analytics.metric.avgBedtime": "Średnia Godzina Pójścia Spać",
  "analytics.metric.avgWakeTime": "Średnia Godzina Wstania",
  "analytics.metric.bedtimeVariability": "Zmienność Godziny Pójścia Spać",
  "analytics.metric.wakeTimeVariability": "Zmienność Godziny Wstania",
  "analytics.metric.sleepRegularity": "Regularność Snu",
  "analytics.metric.diaryCompletionRate": "Uzupełnienie Dziennika",
  "analytics.metric.sleepQuality": "Jakość Snu",
  "analytics.metric.mood": "Nastrój Poranny",
  "analytics.metric.recordedNights": "Zarejestrowane Noce",

  "analytics.unit.minutes": "min",
  "analytics.unit.hours": "g",
  "analytics.unit.percent": "%",
  "analytics.unit.nights": "nocy",
  "analytics.unit.days": "dni",

  "analytics.trend.improving": "Poprawia się",
  "analytics.trend.declining": "Pogarsza się",
  "analytics.trend.stable": "Stabilne",
  "analytics.trend.insufficient_data": "Jeszcze za mało danych",
  "analytics.trend.later": "Później",
  "analytics.trend.earlier": "Wcześniej",

  "analytics.pattern.weekend_bedtime_later":
    "W zarejestrowanych dniach kładłeś się spać później w weekendy.",
  "analytics.pattern.weekend_bedtime_earlier":
    "W zarejestrowanych dniach kładłeś się spać wcześniej w weekendy.",
  "analytics.pattern.weekend_waketime_later":
    "W zarejestrowanych dniach wstałeś później w weekendy.",
  "analytics.pattern.weekend_waketime_earlier":
    "W zarejestrowanych dniach wstałeś wcześniej w weekendy.",
  "analytics.pattern.consistent_wake_time":
    "Twoja godzina wstania była bardzo stabilna w tym okresie.",
  "analytics.pattern.variable_bedtime":
    "Twoja godzina pójścia spać dość mocno się zmieniała w tym okresie.",
  "analytics.pattern.reminder_stronger":
    "Lepiej radzisz sobie z przypomnieniami niż z dziennikiem.",
  "analytics.pattern.diary_stronger":
    "Rejestracja w dzienniku jest bardziej konsekwentna niż wypełnianie przypomnień.",
  "analytics.pattern.stable_wake_streak":
    "Utrzymywałeś stałą godzinę wstania przez kilka dni z rzędu.",

  "analytics.insight.trend.improving.sleepEfficiency.title":
    "Twoja efektywność snu poprawia się",
  "analytics.insight.trend.improving.sleepEfficiency.body":
    "Twoja efektywność snu ostatnio wzrasta. To sugeruje, że Twój sen staje się bardziej regenerujący. Kontynuuj to, co działa.",
  "analytics.insight.trend.declining.sleepEfficiency.title":
    "Twoja efektywność snu spadła",
  "analytics.insight.trend.declining.sleepEfficiency.body":
    "Twoja efektywność snu była ostatnio niższa. To obserwacja, a nie diagnoza — wiele czynników wpływa na to, jak śpimy z tygodnia na tydzień.",

  "analytics.insight.trend.improving.totalSleepTime.title":
    "Śpisz więcej",
  "analytics.insight.trend.improving.totalSleepTime.body":
    "Twój całkowity czas snu wzrósł. Więcej godzin regenerującego snu może zauważalnie poprawić Twoje samopoczucie w ciągu dnia.",
  "analytics.insight.trend.declining.totalSleepTime.title":
    "Twój całkowity czas snu zmalał",
  "analytics.insight.trend.declining.totalSleepTime.body":
    "Twój całkowity czas snu był ostatnio krótszy. Warto to zaobserwować — zmiany rutyny, stres lub harmonogram mogą mieć wpływ.",

  "analytics.insight.trend.improving.sleepOnsetLatency.title":
    "Zasypiasz szybciej",
  "analytics.insight.trend.improving.sleepOnsetLatency.body":
    "Zasypianie zajmuje Ci mniej czasu. To dobry znak — Twoja rutyna wyciszania może pomaga.",
  "analytics.insight.trend.declining.sleepOnsetLatency.title":
    "Zasypianie trwa dłużej",
  "analytics.insight.trend.declining.sleepOnsetLatency.body":
    "Ostatnio zasypianie zajmuje Ci więcej czasu. Wyścig myśli, ekrany przed snem lub zmiany rutyny mogą się przyczyniać.",

  "analytics.insight.trend.improving.sleepRegularity.title":
    "Twój harmonogram snu staje się bardziej regularny",
  "analytics.insight.trend.improving.sleepRegularity.body":
    "Twoja godzina pójścia spać i wstania była bardziej konsekwentna. Stały harmonogram to jeden z fundamentów zdrowego snu.",
  "analytics.insight.trend.declining.sleepRegularity.title":
    "Twój harmonogram był bardziej zmienny",
  "analytics.insight.trend.declining.sleepRegularity.body":
    "Twoja godzina pójścia spać i wstania ostatnio bardziej się zmieniała. To normalne w intensywnych tygodniach — małe korekty mogą przywrócić regularność.",

  "analytics.insight.pattern.weekend_bedtime_later.title":
    "Później w weekendy",
  "analytics.insight.pattern.weekend_bedtime_later.body":
    "Twoja godzina pójścia spać przesuwa się w weekendy. Społeczny jet lag — nawet niewielka zmiana — może wpływać na samopoczucie na początku tygodnia.",
  "analytics.insight.pattern.weekend_waketime_later.title":
    "Dłuższy sen w weekendy",
  "analytics.insight.pattern.weekend_waketime_later.body":
    "Zwykle wstajesz później w weekendy. Spanie o więcej niż godzinę dłużej może przestawiać Twój zegar biologiczny i utrudniać poniedziałkowe wstawanie.",

  "analytics.insight.pattern.consistent_wake_time.title":
    "Stała godzina wstania",
  "analytics.insight.pattern.consistent_wake_time.body":
    "Twoja godzina wstania była bardzo stabilna. Stała godzina wstania to jeden z najskuteczniejszych sposobów wzmocnienia rytmu okołodobowego — świetna robota.",

  "analytics.insight.pattern.variable_bedtime.title":
    "Twoja godzina pójścia spać bardzo się zmienia",
  "analytics.insight.pattern.variable_bedtime.body":
    "Twoja godzina pójścia spać była bardzo różna z nocy na noc. Spróbuj ją poobserwować bez forsowania wcześniejszej pory — świadomość to pierwszy krok.",

  "analytics.insight.pattern.stable_wake_streak.title":
    "Seria stabilnego wstawania",
  "analytics.insight.pattern.stable_wake_streak.body":
    "Utrzymywałeś podobną godzinę wstania przez kilka dni z rzędu. To buduje silny punkt zaczepienia dla rytmu okołodobowego — tak trzymaj.",

  "analytics.insight.pattern.reminder_habit_stronger_than_diary.title":
    "Przypomnienia dobrze działają",
  "analytics.insight.pattern.reminder_habit_stronger_than_diary.body":
    "Jesteś bardziej konsekwentny w wypełnianiu przypomnień niż dziennika. Przypomnienia budują rutynę — może dasz radę dołączyć do nich dziennik?",

  "analytics.insight.encouragement.start_recording.title":
    "Twoja historia snu zaczyna się tutaj",
  "analytics.insight.encouragement.start_recording.body":
    "Każda podróż zaczyna się od jednej nocy. Rejestrowanie snu przez zaledwie tydzień może ujawnić wzorce, których mogłeś nie zauważyć.",
  "analytics.insight.encouragement.keep_going.title":
    "Zaczynasz",
  "analytics.insight.encouragement.keep_going.body":
    "Świetnie — zacząłeś rejestrować. Kontynuuj przez kilka dni, a zaczniesz widzieć, jak kształtuje się Twój wzorzec snu.",
  "analytics.insight.encouragement.first_week.title":
    "Zbudowałeś podstawę",
  "analytics.insight.encouragement.first_week.body":
    "Zarejestrowałeś kilka nocy w tym tygodniu. To samo w sobie jest osiągnięciem. Pierwszy tydzień to obserwacja — nie perfekcja.",
  "analytics.insight.encouragement.streak.title":
    "Jesteś w serii",
  "analytics.insight.encouragement.streak.body":
    "Rejestrowanie snu dzień po dniu budzi świadomość, a świadomość to pierwszy krok do zmiany. Podtrzymuj serię.",

  "analytics.insight.action.learn_more": "Dowiedz się więcej",
  "analytics.insight.action.observe": "Kontynuuj obserwację",
  "analytics.insight.action.start_diary": "Zacznij dziennik",
  "analytics.insight.action.continue_recording": "Kontynuuj rejestrację",

  "analytics.weekly.title": "Podsumowanie Tygodniowe",
  "analytics.weekly.recordedNights": "Zarejestrowane Noce",
  "analytics.weekly.completion": "Uzupełnienie",
  "analytics.weekly.avgSleep": "Średni Czas Snu",
  "analytics.weekly.avgEfficiency": "Średnia Efektywność",
  "analytics.weekly.avgLatency": "Średnia Latencja",
  "analytics.weekly.bedtime": "Godzina Pójścia Spać",
  "analytics.weekly.wakeTime": "Godzina Wstania",
  "analytics.weekly.bedtimeVar": "Zmienność Godziny Pójścia Spać",
  "analytics.weekly.wakeTimeVar": "Zmienność Godziny Wstania",
  "analytics.weekly.regularity": "Regularność Snu",
  "analytics.weekly.reminderCompletion": "Konsekwencja Przypomnień",
  "analytics.weekly.strongestPattern": "Co poszło dobrze",
  "analytics.weekly.areaToObserve": "Co zaobserwować dalej",
  "analytics.weekly.previousWeek": "Poprzedni tydzień",
  "analytics.weekly.nextWeek": "Następny tydzień",
  "analytics.weekly.thisWeek": "Ten tydzień",
  "analytics.weekly.empty":
    "Brak zarejestrowanych nocy w tym tygodniu. Twoje podsumowanie pojawi się tutaj w miarę rejestracji.",

  "analytics.monthly.title": "Przegląd Miesięczny",
  "analytics.monthly.recordedNights": "Zarejestrowane noce w tym miesiącu",
  "analytics.monthly.completion": "Konsekwencja dziennika",
  "analytics.monthly.avgEfficiency": "Średnia efektywność",
  "analytics.monthly.avgSleep": "Średni czas snu",
  "analytics.monthly.regularity": "Regularność snu",
  "analytics.monthly.bestStreak": "Najlepsza seria",
  "analytics.monthly.habitConsistency": "Konsekwencja nawyków",
  "analytics.monthly.weeklyTrend": "Tygodniowa tendencja",
  "analytics.monthly.notableChanges": "Godne uwagi zmiany",
  "analytics.monthly.previousMonth": "Poprzedni miesiąc",
  "analytics.monthly.nextMonth": "Następny miesiąc",
  "analytics.monthly.empty":
    "Kontynuuj rejestrację — Twój miesięczny przegląd pojawi się tutaj.",

  "analytics.focus.title": "Cel Tygodnia",
  "analytics.focus.subtitle": "Łagodna sugestia na nadchodzący tydzień",
  "analytics.focus.baseline_building.reason":
    "Wciąż budujesz swój rejestr snu.",
  "analytics.focus.baseline_building.action":
    "Skoncentruj się na rejestrowaniu każdego ranka — wystarczy jeden wpis dziennie.",
  "analytics.focus.recording_consistency.reason":
    "Twój dziennik ma luki w tym tygodniu.",
  "analytics.focus.recording_consistency.action":
    "Spróbuj uzupełnić brakujące dni. Nawet szybki wpis pomaga zobaczyć pełny obraz.",
  "analytics.focus.wake_time_consistency.reason":
    "Twoja godzina wstania się zmienia, a Twoja efektywność jest niższa.",
  "analytics.focus.wake_time_consistency.action":
    "Spróbuj wstawać w przedziale 30 minut każdego dnia, w tym w weekendy.",
  "analytics.focus.bedtime_observation.reason":
    "Twoja godzina pójścia spać dość mocno się zmienia z nocy na noc.",
  "analytics.focus.bedtime_observation.action":
    "Poobserwuj swoją godzinę pójścia spać w tym tygodniu bez forsowania wcześniejszej pory. Świadomość jest na pierwszym miejscu.",
  "analytics.focus.reminder_routine.reason":
    "Twoje przypomnienia jeszcze nie są w pełni utrwalone.",
  "analytics.focus.reminder_routine.action":
    "Spróbuj wypełniać przynajmniej jedno przypomnienie dziennie w tym tygodniu, aby zbudować nawyk.",
  "analytics.focus.maintenance.reason":
    "Twój sen wygląda na konsekwentny i efektywny.",
  "analytics.focus.maintenance.action":
    "Utrzymuj świetną rutynę. W tym tygodniu skup się na podtrzymywaniu tego, co działa.",
  "analytics.focus.default.reason":
    "Oto łagodny cel na ten tydzień.",
  "analytics.focus.default.action":
    "Obserwuj swoje wzorce snu z ciekawością — nie ma nic do naprawienia.",
  "analytics.focus.accept": "Zaakceptuj cel",
  "analytics.focus.dismiss": "Odrzuć",
  "analytics.focus.save": "Zapisz",
  "analytics.focus.accepted": "Cel ustalony na ten tydzień",
  "analytics.focus.dismissed": "Odrzucono na ten tydzień",

  "reflection.weekly.title": "Refleksja Tygodniowa",
  "reflection.weekly.subtitle":
    "Przewodnik do spojrzenia wstecz na Twój tydzień i spojrzenia w przyszłość.",
  "reflection.weekly.intro":
    "Poświęć kilka minut na refleksję nad swoim snem i rutyną w tym tygodniu. Nie ma dobrych ani złych odpowiedzi — to jest dla Ciebie.",
  "reflection.weekly.skip": "Pomiń",
  "reflection.weekly.save": "Zapisz refleksję",
  "reflection.weekly.saved": "Zapisano",
  "reflection.weekly.edit": "Edytuj",
  "reflection.weekly.delete": "Usuń",
  "reflection.weekly.words": "słów",
  "reflection.weekly.empty":
    "Nie ma jeszcze zapisanej refleksji na ten tydzień.",
  "reflection.weekly.start": "Rozpocznij refleksję",

  "reflection.weekly.prompt.routine_consistency.1":
    "Co pomogło Ci utrzymać bardziej konsekwentną rutynę snu w tym tygodniu?",
  "reflection.weekly.prompt.routine_consistency.2":
    "Które noce łatwiej było trzymać się harmonogramu i dlaczego?",
  "reflection.weekly.prompt.recording_ease.1":
    "Co sprawiło, że rejestrowanie snu było łatwiejsze lub trudniejsze w tym tygodniu?",
  "reflection.weekly.prompt.manageable_parts.1":
    "Która część Twojej rutyny snu wydawała się najbardziej wykonalna w tym tygodniu?",
  "reflection.weekly.prompt.next_week_observation.1":
    "Co chciałbyś zaobserwować w swoim śnie w przyszłym tygodniu?",
  "reflection.weekly.prompt.wins.1":
    "Co jest jedną rzeczą, która poszła dobrze z Twoim snem w tym tygodniu?",
  "reflection.weekly.prompt.wins.2":
    "Kiedy czułeś się najbardziej wypoczęty w tym tygodniu i co było innego?",
  "reflection.weekly.prompt.challenges.1":
    "Co było trudne w Twoim śnie w tym tygodniu?",
  "reflection.weekly.prompt.gratitude.1":
    "Za co jesteś wdzięczny w kwestii swojego odpoczynku w tym tygodniu?",
  "reflection.weekly.prompt.sleep_confidence.1":
    "Jak bardzo pewny siebie czujesz się w kwestii zdrowego snu właśnie teraz?",

  "reflection.weekly.placeholder.routine_consistency":
    "Napisz o tym, co pomogło lub co przeszkadzało...",
  "reflection.weekly.placeholder.recording_ease":
    "Podziel się tym, co ułatwiło lub utrudniło rejestrację...",
  "reflection.weekly.placeholder.manageable_parts":
    "Opisz, co wydawało się wykonalne i dlaczego...",
  "reflection.weekly.placeholder.next_week_observation":
    "Co chcesz zauważyć w przyszłym tygodniu?",
  "reflection.weekly.placeholder.wins":
    "Świętuj coś — wielkiego lub małego...",
  "reflection.weekly.placeholder.challenges":
    "Napisz o tym, co było trudne...",
  "reflection.weekly.placeholder.gratitude":
    "Za co jesteś wdzięczny?",
  "reflection.weekly.placeholder.sleep_confidence":
    "Jak się czujesz ze swoim snem właśnie teraz?",

  "dashboard.analytics.keyMetrics": "Główne Metryki",
  "dashboard.analytics.trends": "Tendencje",
  "dashboard.analytics.insights": "Wnioski",
  "dashboard.analytics.weeklySummary": "Podsumowanie Tygodniowe",
  "dashboard.analytics.monthlyOverview": "Przegląd Miesięczny",
  "dashboard.analytics.reflection": "Refleksja Tygodniowa",
  "dashboard.analytics.focus": "Twój Cel",

  "chart.efficiency": "Efektywność Snu",
  "chart.sleepTime": "Czas Snu",
  "chart.latency": "Latencja Snu",
  "chart.bedtime": "Godzina Pójścia Spać",
  "chart.wakeTime": "Godzina Wstania",
  "chart.noData": "Za mało danych dla tego widoku",
};
