/**
 * Phase F — Analytics & Insight Portuguese (Brazil) Dictionary
 */
import type { Dict } from "@/lib/i18n";

export const analyticsPt: Dict = {
  "analytics.window.7d": "Últimos 7 dias",
  "analytics.window.14d": "Últimos 14 dias",
  "analytics.window.30d": "Últimos 30 dias",
  "analytics.window.90d": "Últimos 90 dias",
  "analytics.window.thisWeek": "Esta semana",
  "analytics.window.lastWeek": "Semana passada",
  "analytics.window.thisMonth": "Este mês",
  "analytics.window.lastMonth": "Mês passado",

  "analytics.sufficiency.none":
    "Comece a registrar seu sono para ver seus padrões.",
  "analytics.sufficiency.insufficient":
    "Continue registrando mais alguns dias para ver um padrão mais claro.",
  "analytics.sufficiency.limited":
    "Isto é o que estamos vendo até agora — continue registrando para um quadro mais completo.",
  "analytics.sufficiency.sufficient": "",

  "analytics.metric.timeInBed": "Tempo na Cama",
  "analytics.metric.totalSleepTime": "Tempo Total de Sono",
  "analytics.metric.sleepEfficiency": "Eficiência do Sono",
  "analytics.metric.sleepOnsetLatency": "Latência do Sono",
  "analytics.metric.wakeAfterSleepOnset": "Despertares Noturnos",
  "analytics.metric.numberOfAwakenings": "Número de Despertares",
  "analytics.metric.avgBedtime": "Horário Médio de Dormir",
  "analytics.metric.avgWakeTime": "Horário Médio de Acordar",
  "analytics.metric.bedtimeVariability": "Variabilidade do Horário de Dormir",
  "analytics.metric.wakeTimeVariability": "Variabilidade do Horário de Acordar",
  "analytics.metric.sleepRegularity": "Regularidade do Sono",
  "analytics.metric.diaryCompletionRate": "Conclusão do Diário",
  "analytics.metric.sleepQuality": "Qualidade do Sono",
  "analytics.metric.mood": "Humor Matinal",
  "analytics.metric.recordedNights": "Noites Registradas",

  "analytics.unit.minutes": "min",
  "analytics.unit.hours": "h",
  "analytics.unit.percent": "%",
  "analytics.unit.nights": "noites",
  "analytics.unit.days": "dias",

  "analytics.trend.improving": "Melhorando",
  "analytics.trend.declining": "Piorando",
  "analytics.trend.stable": "Estável",
  "analytics.trend.insufficient_data": "Poucos dados ainda",
  "analytics.trend.later": "Mais tarde",
  "analytics.trend.earlier": "Mais cedo",

  "analytics.pattern.weekend_bedtime_later":
    "Nos dias registrados, você dormiu mais tarde nos fins de semana.",
  "analytics.pattern.weekend_bedtime_earlier":
    "Nos dias registrados, você dormiu mais cedo nos fins de semana.",
  "analytics.pattern.weekend_waketime_later":
    "Nos dias registrados, você acordou mais tarde nos fins de semana.",
  "analytics.pattern.weekend_waketime_earlier":
    "Nos dias registrados, você acordou mais cedo nos fins de semana.",
  "analytics.pattern.consistent_wake_time":
    "Seu horário de acordar tem sido muito consistente neste período.",
  "analytics.pattern.variable_bedtime":
    "Seu horário de dormir variou bastante durante este período.",
  "analytics.pattern.reminder_stronger":
    "Você tem cumprido mais seus lembretes do que seu diário.",
  "analytics.pattern.diary_stronger":
    "Seu registro no diário tem sido mais consistente que seus lembretes.",
  "analytics.pattern.stable_wake_streak":
    "Você manteve um horário de acordar constante por vários dias seguidos.",

  "analytics.insight.trend.improving.sleepEfficiency.title":
    "Sua eficiência do sono está melhorando",
  "analytics.insight.trend.improving.sleepEfficiency.body":
    "Sua eficiência do sono tem tendência de alta recentemente. Isso sugere que seu sono está se tornando mais reparador. Continue com o que está funcionando.",
  "analytics.insight.trend.declining.sleepEfficiency.title":
    "Sua eficiência do sono caiu",
  "analytics.insight.trend.declining.sleepEfficiency.body":
    "Sua eficiência do sono tem sido menor recentemente. Isto é uma observação, não um diagnóstico — muitos fatores afetam como dormimos de semana para semana.",

  "analytics.insight.trend.improving.totalSleepTime.title":
    "Você está dormindo mais",
  "analytics.insight.trend.improving.totalSleepTime.body":
    "Seu tempo total de sono aumentou. Mais horas de sono reparador podem fazer uma diferença notável em como você se sente durante o dia.",
  "analytics.insight.trend.declining.totalSleepTime.title":
    "Seu sono total diminuiu",
  "analytics.insight.trend.declining.totalSleepTime.body":
    "Seu tempo total de sono tem sido menor recentemente. Vale a pena observar — mudanças na rotina, estresse ou horário podem influenciar.",

  "analytics.insight.trend.improving.sleepOnsetLatency.title":
    "Você está pegando no sono mais rápido",
  "analytics.insight.trend.improving.sleepOnsetLatency.body":
    "Você está demorando menos para pegar no sono. É um bom sinal — sua rotina de relaxamento pode estar ajudando.",
  "analytics.insight.trend.declining.sleepOnsetLatency.title":
    "Você está demorando mais para dormir",
  "analytics.insight.trend.declining.sleepOnsetLatency.body":
    "Você tem demorado mais para pegar no sono recentemente. Pensamentos acelerados, telas antes de dormir ou mudanças na rotina podem contribuir.",

  "analytics.insight.trend.improving.sleepRegularity.title":
    "Seu horário de sono está mais regular",
  "analytics.insight.trend.improving.sleepRegularity.body":
    "Seu horário de dormir e acordar tem sido mais consistente. Um horário regular é um dos pilares do sono saudável.",
  "analytics.insight.trend.declining.sleepRegularity.title":
    "Seu horário tem sido mais variável",
  "analytics.insight.trend.declining.sleepRegularity.body":
    "Seu horário de dormir e acordar variou mais recentemente. É normal em semanas ocupadas — pequenos ajustes podem recuperar a consistência.",

  "analytics.insight.pattern.weekend_bedtime_later.title":
    "Mais tarde nos fins de semana",
  "analytics.insight.pattern.weekend_bedtime_later.body":
    "Seu horário de dormir se desloca nos fins de semana. O jet lag social — mesmo uma pequena mudança — pode afetar como você se sente no começo da semana.",
  "analytics.insight.pattern.weekend_waketime_later.title":
    "Dormir até mais tarde nos fins de semana",
  "analytics.insight.pattern.weekend_waketime_later.body":
    "Você costuma acordar mais tarde nos fins de semana. Dormir mais de uma hora a mais pode atrasar seu relógio corporal e tornar as segundas-feiras mais difíceis.",

  "analytics.insight.pattern.consistent_wake_time.title":
    "Horário de acordar consistente",
  "analytics.insight.pattern.consistent_wake_time.body":
    "Seu horário de acordar tem sido muito estável. Um horário de acordar consistente é uma das formas mais eficazes de fortalecer seu ritmo circadiano — ótimo trabalho.",

  "analytics.insight.pattern.variable_bedtime.title":
    "Seu horário de dormir varia muito",
  "analytics.insight.pattern.variable_bedtime.body":
    "Seu horário de dormir tem sido bem diferente de noite para noite. Tente observá-lo sem forçar mais cedo — a consciência é o primeiro passo.",

  "analytics.insight.pattern.stable_wake_streak.title":
    "Sequência de acordar estável",
  "analytics.insight.pattern.stable_wake_streak.body":
    "Você manteve um horário de acordar similar por vários dias seguidos. Isto constrói uma âncora circadiana forte — continue assim.",

  "analytics.insight.pattern.reminder_habit_stronger_than_diary.title":
    "Lembretes estão indo bem",
  "analytics.insight.pattern.reminder_habit_stronger_than_diary.body":
    "Você tem sido mais consistente com seus lembretes do que com seu diário. Os lembretes estão construindo uma rotina — você pode levar o diário junto também?",

  "analytics.insight.encouragement.start_recording.title":
    "Sua história de sono começa aqui",
  "analytics.insight.encouragement.start_recording.body":
    "Toda jornada começa com uma única noite. Registrar seu sono por apenas uma semana pode revelar padrões que você talvez não tenha notado.",
  "analytics.insight.encouragement.keep_going.title":
    "Você está começando",
  "analytics.insight.encouragement.keep_going.body":
    "Ótimo — você começou a registrar. Continue por mais alguns dias e começará a ver seu padrão de sono tomar forma.",
  "analytics.insight.encouragement.first_week.title":
    "Você construiu uma base",
  "analytics.insight.encouragement.first_week.body":
    "Você registrou várias noites esta semana. Isso por si só já é uma conquista. A primeira semana é de observação — não de perfeição.",
  "analytics.insight.encouragement.streak.title":
    "Você está em sequência",
  "analytics.insight.encouragement.streak.body":
    "Registrar seu sono dia após dia cria consciência, e a consciência é o primeiro passo para a mudança. Continue a sequência.",

  "analytics.insight.action.learn_more": "Saber mais",
  "analytics.insight.action.observe": "Continue observando",
  "analytics.insight.action.start_diary": "Comece seu diário",
  "analytics.insight.action.continue_recording": "Continue registrando",

  "analytics.weekly.title": "Resumo Semanal",
  "analytics.weekly.recordedNights": "Noites Registradas",
  "analytics.weekly.completion": "Conclusão",
  "analytics.weekly.avgSleep": "Sono Médio",
  "analytics.weekly.avgEfficiency": "Eficiência Média",
  "analytics.weekly.avgLatency": "Latência Média",
  "analytics.weekly.bedtime": "Horário de Dormir",
  "analytics.weekly.wakeTime": "Horário de Acordar",
  "analytics.weekly.bedtimeVar": "Variabilidade do Horário",
  "analytics.weekly.wakeTimeVar": "Variabilidade do Acordar",
  "analytics.weekly.regularity": "Regularidade do Sono",
  "analytics.weekly.reminderCompletion": "Consistência dos Lembretes",
  "analytics.weekly.strongestPattern": "O que deu certo",
  "analytics.weekly.areaToObserve": "O que observar depois",
  "analytics.weekly.previousWeek": "Semana anterior",
  "analytics.weekly.nextWeek": "Próxima semana",
  "analytics.weekly.thisWeek": "Esta semana",
  "analytics.weekly.empty":
    "Sem noites registradas esta semana. Seu resumo aparecerá aqui conforme você registrar.",

  "analytics.monthly.title": "Visão Mensal",
  "analytics.monthly.recordedNights": "Noites registradas este mês",
  "analytics.monthly.completion": "Consistência do diário",
  "analytics.monthly.avgEfficiency": "Eficiência média",
  "analytics.monthly.avgSleep": "Sono médio",
  "analytics.monthly.regularity": "Regularidade do sono",
  "analytics.monthly.bestStreak": "Melhor sequência",
  "analytics.monthly.habitConsistency": "Consistência dos hábitos",
  "analytics.monthly.weeklyTrend": "Tendência semanal",
  "analytics.monthly.notableChanges": "Mudanças notáveis",
  "analytics.monthly.previousMonth": "Mês anterior",
  "analytics.monthly.nextMonth": "Próximo mês",
  "analytics.monthly.empty":
    "Continue registrando — sua visão mensal aparecerá aqui.",

  "analytics.focus.title": "Foco da Semana",
  "analytics.focus.subtitle": "Uma sugestão gentil para a semana que vem",
  "analytics.focus.baseline_building.reason":
    "Você ainda está construindo seu registro de sono.",
  "analytics.focus.baseline_building.action":
    "Foque em registrar todas as manhãs — apenas uma entrada por dia.",
  "analytics.focus.recording_consistency.reason":
    "Seu diário tem lacunas esta semana.",
  "analytics.focus.recording_consistency.action":
    "Tente preencher os dias que faltam. Mesmo uma entrada rápida ajuda a ver o quadro completo.",
  "analytics.focus.wake_time_consistency.reason":
    "Seu horário de acordar varia e sua eficiência está mais baixa.",
  "analytics.focus.wake_time_consistency.action":
    "Tente acordar dentro de um intervalo de 30 minutos todos os dias, incluindo fins de semana.",
  "analytics.focus.bedtime_observation.reason":
    "Seu horário de dormir varia bastante de noite para noite.",
  "analytics.focus.bedtime_observation.action":
    "Observe seu horário de dormir esta semana sem tentar forçar mais cedo. A consciência vem primeiro.",
  "analytics.focus.reminder_routine.reason":
    "Seus lembretes ainda não estão totalmente consolidados.",
  "analytics.focus.reminder_routine.action":
    "Tente completar pelo menos um lembrete por dia esta semana para construir o hábito.",
  "analytics.focus.maintenance.reason":
    "Seu sono está parecendo consistente e eficiente.",
  "analytics.focus.maintenance.action":
    "Mantenha a ótima rotina. Esta semana, foque em manter o que está funcionando.",
  "analytics.focus.default.reason":
    "Aqui vai um foco suave para a semana.",
  "analytics.focus.default.action":
    "Observe seus padrões de sono com curiosidade — não há nada para consertar.",
  "analytics.focus.accept": "Aceitar foco",
  "analytics.focus.dismiss": "Dispensar",
  "analytics.focus.save": "Guardar",
  "analytics.focus.accepted": "Foco definido para esta semana",
  "analytics.focus.dismissed": "Dispensado para esta semana",

  "reflection.weekly.title": "Reflexão Semanal",
  "reflection.weekly.subtitle":
    "Uma revisão guiada para olhar para trás na sua semana e olhar para frente.",
  "reflection.weekly.intro":
    "Reserve alguns minutos para refletir sobre seu sono e sua rotina esta semana. Não há respostas certas ou erradas — isto é para você.",
  "reflection.weekly.skip": "Pular",
  "reflection.weekly.save": "Salvar reflexão",
  "reflection.weekly.saved": "Salvo",
  "reflection.weekly.edit": "Editar",
  "reflection.weekly.delete": "Excluir",
  "reflection.weekly.words": "palavras",
  "reflection.weekly.empty":
    "Nenhuma reflexão salva para esta semana ainda.",
  "reflection.weekly.start": "Começar reflexão",

  "reflection.weekly.prompt.routine_consistency.1":
    "O que ajudou você a manter uma rotina de sono mais consistente esta semana?",
  "reflection.weekly.prompt.routine_consistency.2":
    "Quais noites foram mais fáceis de manter seu horário e por quê?",
  "reflection.weekly.prompt.recording_ease.1":
    "O que fez com que registrar seu sono fosse mais fácil ou mais difícil esta semana?",
  "reflection.weekly.prompt.manageable_parts.1":
    "Qual parte da sua rotina de sono se sentiu mais manejável esta semana?",
  "reflection.weekly.prompt.next_week_observation.1":
    "O que você gostaria de observar sobre seu sono na próxima semana?",
  "reflection.weekly.prompt.wins.1":
    "O que é uma coisa que deu bem com seu sono esta semana?",
  "reflection.weekly.prompt.wins.2":
    "Quando você se sentiu mais descansado esta semana e o que foi diferente?",
  "reflection.weekly.prompt.challenges.1":
    "O que foi desafiador sobre seu sono esta semana?",
  "reflection.weekly.prompt.gratitude.1":
    "Por o que você é grato sobre seu descanso esta semana?",
  "reflection.weekly.prompt.sleep_confidence.1":
    "Quão confiante você se sente sobre sua capacidade de dormir bem agora?",

  "reflection.weekly.placeholder.routine_consistency":
    "Escreva sobre o que ajudou ou o que atrapalhou...",
  "reflection.weekly.placeholder.recording_ease":
    "Compartilhe o que facilitou ou dificultou registrar...",
  "reflection.weekly.placeholder.manageable_parts":
    "Descreva o que se sentiu factível e por quê...",
  "reflection.weekly.placeholder.next_week_observation":
    "O que você quer notar na próxima semana?",
  "reflection.weekly.placeholder.wins":
    "Celebre algo — grande ou pequeno...",
  "reflection.weekly.placeholder.challenges":
    "Escreva sobre o que foi difícil...",
  "reflection.weekly.placeholder.gratitude":
    "Por o que você é grato?",
  "reflection.weekly.placeholder.sleep_confidence":
    "Como você se sente sobre seu sono agora?",

  "dashboard.analytics.keyMetrics": "Métricas Principais",
  "dashboard.analytics.trends": "Tendências",
  "dashboard.analytics.insights": "Insights",
  "dashboard.analytics.weeklySummary": "Resumo Semanal",
  "dashboard.analytics.monthlyOverview": "Visão Mensal",
  "dashboard.analytics.reflection": "Reflexão Semanal",
  "dashboard.analytics.focus": "Seu Foco",

  "chart.efficiency": "Eficiência do Sono",
  "chart.sleepTime": "Tempo de Sono",
  "chart.latency": "Latência do Sono",
  "chart.bedtime": "Horário de Dormir",
  "chart.wakeTime": "Horário de Acordar",
  "chart.noData": "Poucos dados para esta visualização",
};
