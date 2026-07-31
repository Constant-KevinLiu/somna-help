/**
 * Español — Guided CBT-I Reflection Prompts
 *
 * Contenido redactado nativamente.
 * Por un educador en salud del sueño nativo hispanohablante.
 * Prompts terapéuticos — NO traducir en tiempo de ejecución.
 */

import type { ContentPackage } from "@/content/content-types";
import type { ReflectionPrompt } from "@/lib/reflection/reflection-types";

const ES_REFLECTION_PROMPTS: ReflectionPrompt[] = [
  // Sleep Thoughts Category
  {
    id: "es-thoughts-001",
    category: "sleep-thoughts",
    text: "¿Qué pensamientos pasaban por tu mente mientras intentabas dormir anoche? Escribe los que sentiste más presentes, sin juzgarlos.",
  },
  {
    id: "es-thoughts-002",
    category: "sleep-thoughts",
    text: "¿Alguna preocupación específica apareció repetidamente mientras estabas en la cama? Descríbela con amabilidad hacia ti mismo.",
  },
  {
    id: "es-thoughts-003",
    category: "sleep-thoughts",
    text: "¿Qué historia te contaste a ti mismo sobre tu sueño anoche? ¿Te ayudó o te generó más presión?",
  },
  {
    id: "es-thoughts-004",
    category: "sleep-thoughts",
    text: "Cuando despertaste durante la noche, ¿cuál fue el primer pensamiento que apareció? ¿Cómo afectó tu capacidad de volver a dormir?",
  },

  // Sleep Anxiety Category
  {
    id: "es-anxiety-001",
    category: "sleep-anxiety",
    text: "En una escala de tranquilo a acelerado, ¿cómo describirías tu estado mental al acostarte? ¿Qué contribuyó a esa sensación?",
  },
  {
    id: "es-anxiety-002",
    category: "sleep-anxiety",
    text: "¿Qué sensaciones físicas notaste en tu cuerpo al intentar relajarte? ¿Alguna se sintió especialmente difícil de liberar?",
  },
  {
    id: "es-anxiety-003",
    category: "sleep-anxiety",
    text: "¿Te preocupaste por las consecuencias de dormir mal antes de acostarte? ¿Cuáles eran esos miedos y qué tan realistas son?",
  },
  {
    id: "es-anxiety-004",
    category: "sleep-anxiety",
    text: "¿Pensó '¡tengo que dormirme YA!' en algún momento? ¿Cómo te hizo sentir esa presión?",
  },

  // Sleep Behaviors Category
  {
    id: "es-behaviors-001",
    category: "sleep-behaviors",
    text: "¿Qué hiciste en la hora antes de acostarte anoche? ¿Qué actividades te ayudaron a descansar y cuáles te mantuvieron alerta?",
  },
  {
    id: "es-behaviors-002",
    category: "sleep-behaviors",
    text: "¿Qué tan consistente fue tu hora de acostarte comparado con tu patrón habitual? ¿Qué factores lo hicieron más temprano o más tarde?",
  },
  {
    id: "es-behaviors-003",
    category: "sleep-behaviors",
    text: "¿Usaste pantallas en la cama? ¿Con qué contenido estabas interactuando y cómo afectó tu transición al sueño?",
  },
  {
    id: "es-behaviors-004",
    category: "sleep-behaviors",
    text: "¿Qué rutina amigable con el sueño seguiste? ¿Hay un pequeño cambio que podrías hacer en tu ritual pre-sueño?",
  },

  // Relaxation Category
  {
    id: "es-relax-001",
    category: "relaxation",
    text: "Describe un momento de ayer en el que te sentiste realmente tranquilo y relajado. ¿Qué hizo posible esa sensación?",
  },
  {
    id: "es-relax-002",
    category: "relaxation",
    text: "¿Qué técnica de relajación te ha resultado más útil? ¿Cuándo fue la última vez que la usaste y cómo funcionó?",
  },
  {
    id: "es-relax-003",
    category: "relaxation",
    text: "¿Qué sonidos o experiencias sensoriales te ayudan a sentirte en paz? ¿Puedes traer más de esto a tu habitación?",
  },
  {
    id: "es-relax-004",
    category: "relaxation",
    text: "Piensa en tu respiración al acostarte anoche. ¿Era superficial o profunda, rápida o lenta? ¿Cómo se sentiría una respiración más pausada?",
  },

  // Gratitude Category
  {
    id: "es-gratitude-001",
    category: "gratitude",
    text: "Nombra tres cosas pequeñas y específicas de ayer que apreciaste. No necesitan ser grandes ni impresionantes.",
  },
  {
    id: "es-gratitude-002",
    category: "gratitude",
    text: "¿Qué es una cosa que tu cuerpo hizo por ti ayer que quizás des por sentado? Reconoce ese esfuerzo aquí.",
  },
  {
    id: "es-gratitude-003",
    category: "gratitude",
    text: "¿Quién o qué te hizo sentir apoyado en el último día? Escribe una breve nota de agradecimiento por esa presencia.",
  },
  {
    id: "es-gratitude-004",
    category: "gratitude",
    text: "¿Qué cosa gentil hiciste por ti mismo ayer? Celebra ese acto de cuidado, por pequeño que sea.",
  },

  // Sleep Confidence Category
  {
    id: "es-confidence-001",
    category: "sleep-confidence",
    text: "¿Cuándo has dormido bien en el último mes? ¿Cuáles eran las circunstancias y qué hiciste que contribuyó a ello?",
  },
  {
    id: "es-confidence-002",
    category: "sleep-confidence",
    text: "¿Qué es una cosa que sabes que ayuda a tu sueño y en la que puedes confiar? Recuérdate a ti mismo de esta verdad.",
  },
  {
    id: "es-confidence-003",
    category: "sleep-confidence",
    text: "Incluso en noches difíciles, ¿qué pequeña victoria tuviste con tu sueño recientemente? Reconoce tu esfuerzo.",
  },
  {
    id: "es-confidence-004",
    category: "sleep-confidence",
    text: "¿Cómo se sentiría confiar en la capacidad de tu cuerpo para dormir? Describe esa sensación de seguridad y confianza.",
  },

  // Stimulus Control Category
  {
    id: "es-stimulus-001",
    category: "stimulus-control",
    text: "¿Cómo usas tu cama además de dormir? ¿Podrías mover alguna de estas actividades a otra habitación?",
  },
  {
    id: "es-stimulus-002",
    category: "stimulus-control",
    text: "Cuando no pudiste dormir anoche, ¿qué hiciste? ¿Hay un enfoque diferente que podrías probar la próxima vez?",
  },
  {
    id: "es-stimulus-003",
    category: "stimulus-control",
    text: "¿Cómo se ve y se siente tu entorno de dormitorio? ¿Hay un ajuste que lo haría más amigable con el sueño?",
  },
  {
    id: "es-stimulus-004",
    category: "stimulus-control",
    text: "¿Qué tan rápido te levantas de la cama cuando no puedes dormir? ¿Qué barrera — si existe — te impide levantarte antes?",
  },

  // Sleep Restriction Category
  {
    id: "es-restriction-001",
    category: "sleep-restriction",
    text: "¿Cuánto tiempo realmente dormiste anoche versus cuánto tiempo pasaste en la cama? Observa la diferencia.",
  },
  {
    id: "es-restriction-002",
    category: "sleep-restriction",
    text: "¿Qué significa 'eficiencia del sueño' para ti personalmente? ¿Cómo podría cambiar tus noches construir un impulso de sueño más fuerte?",
  },
  {
    id: "es-restriction-003",
    category: "sleep-restriction",
    text: "¿Estás pasando más tiempo en la cama intentando 'recuperar' sueño? ¿Cómo ha afectado eso la calidad de tu descanso?",
  },
  {
    id: "es-restriction-004",
    category: "sleep-restriction",
    text: "¿Cómo sería para ti una hora de levantarse consistente — incluso los fines de semana? ¿Qué beneficios podría traer?",
  },

  // Night Awakenings Category
  {
    id: "es-awakenings-001",
    category: "night-awakenings",
    text: "Cuando despertaste anoche, ¿cuál fue tu reacción inmediata? ¿Te frustraste o pudiste observarlo con calma?",
  },
  {
    id: "es-awakenings-002",
    category: "night-awakenings",
    text: "¿A qué hora despertaste y no volviste a dormir rápidamente? ¿Qué pensamientos daban vueltas durante ese tiempo?",
  },
  {
    id: "es-awakenings-003",
    category: "night-awakenings",
    text: "Despertar por la noche es normal. ¿Cuándo se ha sentido más manejable para ti? ¿Qué era diferente en esos momentos?",
  },
  {
    id: "es-awakenings-004",
    category: "night-awakenings",
    text: "¿Cuál es tu estrategia habitual cuando no puedes volver a dormir? ¿Hay una técnica nueva que te gustaría practicar?",
  },

  // Cognitive Reframing Category
  {
    id: "es-reframing-001",
    category: "cognitive-reframing",
    text: "¿Qué pensamiento negativo sobre el sueño tuviste recientemente? ¿Puedes encontrar una forma más equilibrada de ver la misma situación?",
  },
  {
    id: "es-reframing-002",
    category: "cognitive-reframing",
    text: "En lugar de 'debo dormir 8 horas', ¿qué pensamiento más flexible y amable podrías tener sobre tus necesidades de sueño?",
  },
  {
    id: "es-reframing-003",
    category: "cognitive-reframing",
    text: "Cuando piensas en una 'mala noche', ¿estás recordando toda la imagen o solo la parte difícil? Escribe la historia completa.",
  },
  {
    id: "es-reframing-004",
    category: "cognitive-reframing",
    text: "¿Qué pensamiento catastrófico sobre el mal sueño has tenido? ¿Qué evidencia contradice este miedo?",
  },
];

export const ES_REFLECTION_PACKAGE: ContentPackage<ReflectionPrompt[]> = {
  metadata: {
    locale: "es",
    version: "1.0.0",
    reviewedAt: "2025-01-15",
    reviewedBy: "equipo-educacion-sueno",
    medicalReviewStatus: "approved",
    nativeReviewStatus: "approved",
    lastUpdated: "2025-01-15",
  },
  content: ES_REFLECTION_PROMPTS,
};
