/**
 * Phase F — Analytics & Insight Spanish Dictionary
 *
 * Spanish translations for Phase F analytics features.
 * Keys follow the same structure as the English canonical source.
 */
import type { Dict } from "@/lib/i18n";

export const analyticsEs: Dict = {
  // Windows
  "analytics.window.7d": "Últimos 7 días",
  "analytics.window.14d": "Últimos 14 días",
  "analytics.window.30d": "Últimos 30 días",
  "analytics.window.90d": "Últimos 90 días",
  "analytics.window.thisWeek": "Esta semana",
  "analytics.window.lastWeek": "Semana pasada",
  "analytics.window.thisMonth": "Este mes",
  "analytics.window.lastMonth": "Mes pasado",

  // Sufficiency
  "analytics.sufficiency.none": "Empieza a registrar tu sueño para ver tus patrones.",
  "analytics.sufficiency.insufficient":
    "Sigue registrando unos días más para ver un patrón más claro.",
  "analytics.sufficiency.limited":
    "Esto es lo que vemos hasta ahora — sigue registrando para una imagen más completa.",
  "analytics.sufficiency.sufficient": "",

  // Metrics
  "analytics.metric.timeInBed": "Tiempo en Cama",
  "analytics.metric.totalSleepTime": "Tiempo Total de Sueño",
  "analytics.metric.sleepEfficiency": "Eficiencia del Sueño",
  "analytics.metric.sleepOnsetLatency": "Latencia de Inicio",
  "analytics.metric.wakeAfterSleepOnset": "Despertares Nocturnos",
  "analytics.metric.numberOfAwakenings": "Número de Despertares",
  "analytics.metric.avgBedtime": "Hora de Dormir Promedio",
  "analytics.metric.avgWakeTime": "Hora de Despertar Promedio",
  "analytics.metric.bedtimeVariability": "Variabilidad de Hora de Dormir",
  "analytics.metric.wakeTimeVariability": "Variabilidad de Hora de Despertar",
  "analytics.metric.sleepRegularity": "Regularidad del Sueño",
  "analytics.metric.diaryCompletionRate": "Cumplimiento del Diario",
  "analytics.metric.sleepQuality": "Calidad del Sueño",
  "analytics.metric.mood": "Estado de Ánimo",
  "analytics.metric.recordedNights": "Noches Registradas",

  // Units
  "analytics.unit.minutes": "min",
  "analytics.unit.hours": "h",
  "analytics.unit.percent": "%",
  "analytics.unit.nights": "noches",
  "analytics.unit.days": "días",

  // Trends
  "analytics.trend.improving": "Mejorando",
  "analytics.trend.declining": "Disminuyendo",
  "analytics.trend.stable": "Estable",
  "analytics.trend.insufficient_data": "Pocos datos aún",
  "analytics.trend.later": "Más tarde",
  "analytics.trend.earlier": "Más temprano",

  // Patterns
  "analytics.pattern.weekend_bedtime_later":
    "En los días registrados, te dormiste más tarde los fines de semana.",
  "analytics.pattern.weekend_bedtime_earlier":
    "En los días registrados, te dormiste más temprano los fines de semana.",
  "analytics.pattern.weekend_waketime_later":
    "En los días registrados, te despertaste más tarde los fines de semana.",
  "analytics.pattern.weekend_waketime_earlier":
    "En los días registrados, te despertaste más temprano los fines de semana.",
  "analytics.pattern.consistent_wake_time":
    "Tu hora de despertar ha sido muy consistente en este periodo.",
  "analytics.pattern.variable_bedtime":
    "Tu hora de dormir ha variado bastante durante este periodo.",
  "analytics.pattern.reminder_stronger":
    "Has cumplido mejor con tus recordatorios que con tu diario.",
  "analytics.pattern.diary_stronger":
    "Tu registro en el diario ha sido más consistente que tus recordatorios.",
  "analytics.pattern.stable_wake_streak":
    "Has mantenido una hora de despertar constante durante varios días seguidos.",

  // Insight — Trends
  "analytics.insight.trend.improving.sleepEfficiency.title":
    "Tu eficiencia de sueño está mejorando",
  "analytics.insight.trend.improving.sleepEfficiency.body":
    "Tu eficiencia de sueño ha tendido al alza recientemente. Esto sugiere que tu sueño se está volviendo más reparador. Sigue con lo que funciona.",
  "analytics.insight.trend.declining.sleepEfficiency.title": "Tu eficiencia de sueño ha bajado",
  "analytics.insight.trend.declining.sleepEfficiency.body":
    "Tu eficiencia de sueño ha sido menor recientemente. Es una observación, no un diagnóstico — muchos factores afectan cómo dormimos de una semana a otra.",

  "analytics.insight.trend.improving.totalSleepTime.title": "Estás durmiendo más",
  "analytics.insight.trend.improving.totalSleepTime.body":
    "Tu tiempo total de sueño ha aumentado. Más horas de sueño reparador pueden marcar una diferencia notable en cómo te sientes durante el día.",
  "analytics.insight.trend.declining.totalSleepTime.title": "Tu sueño total ha disminuido",
  "analytics.insight.trend.declining.totalSleepTime.body":
    "Tu tiempo total de sueño ha sido más corto recientemente. Vale la pena observarlo — los cambios en la rutina, el estrés o el horario influyen.",

  "analytics.insight.trend.improving.sleepOnsetLatency.title": "Te estás durmiendo más rápido",
  "analytics.insight.trend.improving.sleepOnsetLatency.body":
    "Estás tardando menos en quedarte dormido. Es una buena señal — tu rutina de relajación puede estar ayudando.",
  "analytics.insight.trend.declining.sleepOnsetLatency.title": "Estás tardando más en dormirte",
  "analytics.insight.trend.declining.sleepOnsetLatency.body":
    "Has tardado más en quedarte dormido recientemente. Pensamientos acelerados, pantallas antes de dormir o cambios en la rutina pueden contribuir.",

  "analytics.insight.trend.improving.sleepRegularity.title": "Tu horario de sueño es más regular",
  "analytics.insight.trend.improving.sleepRegularity.body":
    "Tu hora de dormir y despertar ha sido más consistente. Un horario regular es uno de los pilares del sueño saludable.",
  "analytics.insight.trend.declining.sleepRegularity.title": "Tu horario ha sido más variable",
  "analytics.insight.trend.declining.sleepRegularity.body":
    "Tu hora de dormir y despertar ha variado más recientemente. Es normal en semanas ocupadas — pequeños ajustes pueden recuperar la consistencia.",

  // Insight — Patterns
  "analytics.insight.pattern.weekend_bedtime_later.title": "Más tarde los fines de semana",
  "analytics.insight.pattern.weekend_bedtime_later.body":
    "Tu hora de dormir se desplaza los fines de semana. El jet lag social — incluso un cambio pequeño — puede afectar cómo te sientes al empezar la semana.",
  "analytics.insight.pattern.weekend_waketime_later.title":
    "Dormir hasta más tarde los fines de semana",
  "analytics.insight.pattern.weekend_waketime_later.body":
    "Sueles despertarte más tarde los fines de semana. Dormir más de una hora más puede retrasar tu reloj corporativo y hacer que los lunes sean más difíciles.",

  "analytics.insight.pattern.consistent_wake_time.title": "Hora de despertar consistente",
  "analytics.insight.pattern.consistent_wake_time.body":
    "Tu hora de despertar ha sido muy estable. Una hora de despertar consistente es una de las formas más efectivas de fortalecer tu ritmo circadiano — excelente trabajo.",

  "analytics.insight.pattern.variable_bedtime.title": "Tu hora de dormir varía mucho",
  "analytics.insight.pattern.variable_bedtime.body":
    "Tu hora de dormir ha sido muy diferente de noche a noche. Intenta observarla sin forzarla — la conciencia es el primer paso.",

  "analytics.insight.pattern.stable_wake_streak.title": "Racha de despertar constante",
  "analytics.insight.pattern.stable_wake_streak.body":
    "Has mantenido una hora de despertar similar durante varios días seguidos. Esto construye un anclaje circadiano fuerte — sigue así.",

  "analytics.insight.pattern.reminder_habit_stronger_than_diary.title":
    "Los recordatorios van bien",
  "analytics.insight.pattern.reminder_habit_stronger_than_diary.body":
    "Has sido más consistente con tus recordatorios que con tu diario. Los recordatorios están construyendo una rutina — ¿puedes llevarte el diario también?",

  // Insight — Encouragement
  "analytics.insight.encouragement.start_recording.title": "Tu historia de sueño empieza aquí",
  "analytics.insight.encouragement.start_recording.body":
    "Todo viaje comienza con una sola noche. Registrar tu sueño durante solo una semana puede revelar patrones que quizás no habías notado.",
  "analytics.insight.encouragement.keep_going.title": "Estás empezando",
  "analytics.insight.encouragement.keep_going.body":
    "Genial — has empezado a registrar. Sigue así unos días más y empezarás a ver cómo se forma tu patrón de sueño.",
  "analytics.insight.encouragement.first_week.title": "Has construido una base",
  "analytics.insight.encouragement.first_week.body":
    "Has registrado varias noches esta semana. Eso por sí solo es un logro. La primera semana es de observación — no de perfección.",
  "analytics.insight.encouragement.streak.title": "Vas en racha",
  "analytics.insight.encouragement.streak.body":
    "Registrar tu sueño día tras día crea conciencia, y la conciencia es el primer paso hacia el cambio. Sigue con la racha.",

  // Actions
  "analytics.insight.action.learn_more": "Saber más",
  "analytics.insight.action.observe": "Seguir observando",
  "analytics.insight.action.start_diary": "Empezar tu diario",
  "analytics.insight.action.continue_recording": "Seguir registrando",

  // Weekly Summary
  "analytics.weekly.title": "Resumen Semanal",
  "analytics.weekly.recordedNights": "Noches Registradas",
  "analytics.weekly.completion": "Cumplimiento",
  "analytics.weekly.avgSleep": "Sueño Promedio",
  "analytics.weekly.avgEfficiency": "Eficiencia Promedio",
  "analytics.weekly.avgLatency": "Latencia Promedio",
  "analytics.weekly.bedtime": "Hora de Dormir",
  "analytics.weekly.wakeTime": "Hora de Despertar",
  "analytics.weekly.bedtimeVar": "Variabilidad de Hora de Dormir",
  "analytics.weekly.wakeTimeVar": "Variabilidad de Hora de Despertar",
  "analytics.weekly.regularity": "Regularidad del Sueño",
  "analytics.weekly.reminderCompletion": "Consistencia de Recordatorios",
  "analytics.weekly.strongestPattern": "Lo que salió bien",
  "analytics.weekly.areaToObserve": "Qué observar después",
  "analytics.weekly.previousWeek": "Semana anterior",
  "analytics.weekly.nextWeek": "Semana siguiente",
  "analytics.weekly.thisWeek": "Esta semana",
  "analytics.weekly.empty":
    "Sin noches registradas esta semana. Tu resumen aparecerá aquí conforme registres.",

  // Monthly Summary
  "analytics.monthly.title": "Resumen Mensual",
  "analytics.monthly.recordedNights": "Noches registradas este mes",
  "analytics.monthly.completion": "Consistencia del diario",
  "analytics.monthly.avgEfficiency": "Eficiencia promedio",
  "analytics.monthly.avgSleep": "Sueño promedio",
  "analytics.monthly.regularity": "Regularidad del sueño",
  "analytics.monthly.bestStreak": "Mejor racha",
  "analytics.monthly.habitConsistency": "Consistencia de hábitos",
  "analytics.monthly.weeklyTrend": "Tendencia semanal",
  "analytics.monthly.notableChanges": "Cambios notables",
  "analytics.monthly.previousMonth": "Mes anterior",
  "analytics.monthly.nextMonth": "Mes siguiente",
  "analytics.monthly.empty": "Sigue registrando — tu resumen mensual aparecerá aquí.",

  // Weekly Focus
  "analytics.focus.title": "Enfoque de la Semana",
  "analytics.focus.subtitle": "Una sugerencia para la semana que viene",
  "analytics.focus.baseline_building.reason": "Todavía estás construyendo tu registro de sueño.",
  "analytics.focus.baseline_building.action":
    "Céntrate en registrar cada mañana — solo una entrada al día.",
  "analytics.focus.recording_consistency.reason": "Tu diario tiene huecos esta semana.",
  "analytics.focus.recording_consistency.action":
    "Intenta completar los días que faltan. Incluso una entrada rápida ayuda a ver el panorama completo.",
  "analytics.focus.wake_time_consistency.reason":
    "Tu hora de despertar varía y tu eficiencia es más baja de lo normal.",
  "analytics.focus.wake_time_consistency.action":
    "Intenta despertarte dentro de un rango de 30 minutos todos los días, incluidos los fines de semana.",
  "analytics.focus.bedtime_observation.reason":
    "Tu hora de dormir varía bastante de noche a noche.",
  "analytics.focus.bedtime_observation.action":
    "Observa tu hora de dormir esta semana sin intentar adelantarla. La conciencia viene primero.",
  "analytics.focus.reminder_routine.reason":
    "Tus recordatorios aún no están del todo consolidados.",
  "analytics.focus.reminder_routine.action":
    "Intenta completar al menos un recordatorio al día esta semana para construir el hábito.",
  "analytics.focus.maintenance.reason": "Tu sueño se ve consistente y eficiente.",
  "analytics.focus.maintenance.action":
    "Mantén la gran rutina. Esta semana, céntrate en mantener lo que funciona.",
  "analytics.focus.default.reason": "Aquí tienes un enfoque suave para la semana.",
  "analytics.focus.default.action":
    "Observa tus patrones de sueño con curiosidad — no hay nada que arreglar.",
  "analytics.focus.accept": "Aceptar enfoque",
  "analytics.focus.dismiss": "Descartar",
  "analytics.focus.save": "Guardar",
  "analytics.focus.accepted": "Enfoque fijado para esta semana",
  "analytics.focus.dismissed": "Descartado para esta semana",

  // Weekly Reflection
  "reflection.weekly.title": "Reflexión Semanal",
  "reflection.weekly.subtitle": "Un repaso guiado para mirar atrás en tu semana y mirar adelante.",
  "reflection.weekly.intro":
    "Tómate unos minutos para reflexionar sobre tu sueño y tu rutina esta semana. No hay respuestas correctas ni incorrectas — esto es para ti.",
  "reflection.weekly.skip": "Saltar",
  "reflection.weekly.save": "Guardar reflexión",
  "reflection.weekly.saved": "Guardado",
  "reflection.weekly.edit": "Editar",
  "reflection.weekly.delete": "Eliminar",
  "reflection.weekly.words": "palabras",
  "reflection.weekly.empty": "Aún no hay ninguna reflexión guardada para esta semana.",
  "reflection.weekly.start": "Empezar reflexión",

  "reflection.weekly.prompt.routine_consistency.1":
    "¿Qué te ayudó a mantener una rutina de sueño más consistente esta semana?",
  "reflection.weekly.prompt.routine_consistency.2":
    "¿Qué noches te resultó más fácil cumplir tu horario y por qué?",
  "reflection.weekly.prompt.recording_ease.1":
    "¿Qué hizo que registrar tu sueño fuera más fácil o más difícil esta semana?",
  "reflection.weekly.prompt.manageable_parts.1":
    "¿Qué parte de tu rutina de sueño se sintió más manejable esta semana?",
  "reflection.weekly.prompt.next_week_observation.1":
    "¿Qué te gustaría observar de tu sueño la próxima semana?",
  "reflection.weekly.prompt.wins.1": "¿Qué es una cosa que salió bien con tu sueño esta semana?",
  "reflection.weekly.prompt.wins.2":
    "¿Cuándo te sentiste más descansado esta semana y qué fue diferente?",
  "reflection.weekly.prompt.challenges.1": "¿Qué fue desafiante de tu sueño esta semana?",
  "reflection.weekly.prompt.gratitude.1":
    "¿Por qué cosa estás agradecido acerca de tu descanso esta semana?",
  "reflection.weekly.prompt.sleep_confidence.1":
    "¿Qué tan seguro te sientes de tu capacidad de dormir bien ahora mismo?",

  "reflection.weekly.placeholder.routine_consistency":
    "Escribe sobre qué ayudó o qué se interpuso...",
  "reflection.weekly.placeholder.recording_ease":
    "Comparte qué hizo que registrar fuera más fácil o más difícil...",
  "reflection.weekly.placeholder.manageable_parts": "Describe qué se sintió factible y por qué...",
  "reflection.weekly.placeholder.next_week_observation": "¿Qué quieres notar la próxima semana?",
  "reflection.weekly.placeholder.wins": "Celebra algo — grande o pequeño...",
  "reflection.weekly.placeholder.challenges": "Escribe sobre qué fue difícil...",
  "reflection.weekly.placeholder.gratitude": "¿Por qué estás agradecido?",
  "reflection.weekly.placeholder.sleep_confidence": "¿Cómo te sientes con tu sueño ahora mismo?",

  // Dashboard
  "dashboard.analytics.keyMetrics": "Métricas Clave",
  "dashboard.analytics.trends": "Tendencias",
  "dashboard.analytics.insights": "Perspectivas",
  "dashboard.analytics.weeklySummary": "Resumen Semanal",
  "dashboard.analytics.monthlyOverview": "Resumen Mensual",
  "dashboard.analytics.reflection": "Reflexión Semanal",
  "dashboard.analytics.focus": "Tu Enfoque",

  // Chart
  "chart.efficiency": "Eficiencia del Sueño",
  "chart.sleepTime": "Tiempo de Sueño",
  "chart.latency": "Latencia de Inicio",
  "chart.bedtime": "Hora de Dormir",
  "chart.wakeTime": "Hora de Despertar",
  "chart.noData": "Pocos datos para esta vista",
};
