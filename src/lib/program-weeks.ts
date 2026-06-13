import type { Lang } from "@/lib/i18n";

export type WeekLocale = {
  title: string;
  eyebrow: string;
  seoTitle: string;
  seoDescription: string;
  intro: string;
  whyTitle: string;
  whyPoints: string[];
  practicesTitle: string;
  practices: string[];
  actionsTitle: string;
  actions: string[];
  encouragementTitle: string;
  encouragement: string;
  shortDesc: string;
};

export type WeekContent = {
  slug: string;
  number: number;
  i18n: Record<Lang, WeekLocale>;
};

export const programLabels: Record<Lang, {
  prev: string;
  next: string;
  back: string;
  other: string;
  startAssessment: string;
  weekLabel: string;
}> = {
  en: {
    prev: "Previous",
    next: "Next",
    back: "Back to Program",
    other: "Other weeks in the program",
    startAssessment: "Start assessment",
    weekLabel: "Week",
  },
  zh: {
    prev: "上一周",
    next: "下一周",
    back: "返回课程",
    other: "课程中的其他周",
    startAssessment: "开始测评",
    weekLabel: "第",
  },
  es: {
    prev: "Semana anterior",
    next: "Semana siguiente",
    back: "Volver al programa",
    other: "Otras semanas del programa",
    startAssessment: "Comenzar evaluación",
    weekLabel: "Semana",
  },
};

export function weekHeading(lang: Lang, number: number, title: string) {
  if (lang === "zh") return `第${number}周 · ${title}`;
  if (lang === "es") return `Semana ${number} · ${title}`;
  return `Week ${number} · ${title}`;
}

export const programWeeks: WeekContent[] = [
  {
    slug: "week-1-sleep-foundations",
    number: 1,
    i18n: {
      en: {
        title: "Sleep Foundations",
        eyebrow: "WEEK 1 · CBT-I PROGRAM",
        seoTitle: "Sleep Foundations | Week 1 CBT-I Program | Somna",
        seoDescription:
          "Build the foundation for healthy sleep with consistent habits and gentle CBT-I practices.",
        intro:
          "Healthy sleep starts with understanding how sleep works. Consistent habits are often more effective than trying to force sleep.",
        whyTitle: "Why it matters",
        whyPoints: [
          "Sleep depends on circadian rhythm and sleep pressure.",
          "Consistency helps the brain relearn healthy sleep.",
        ],
        practicesTitle: "Key practices",
        practices: [
          "Maintain a regular wake-up time.",
          "Reduce caffeine in the afternoon.",
          "Create a relaxing evening routine.",
        ],
        actionsTitle: "Today's actions",
        actions: [
          "Wake up at the same time",
          "Reduce screens before bedtime",
        ],
        encouragementTitle: "A gentle reminder",
        encouragement: "Healthy sleep is rebuilt gradually.",
        shortDesc: "Set a consistent wake time and start a gentle routine.",
      },
      zh: {
        title: "睡眠基础",
        eyebrow: "第1周 · CBT-I 课程",
        seoTitle: "睡眠基础｜CBT-I 第1周｜Somna",
        seoDescription: "通过规律的习惯与温柔的 CBT-I 练习,建立健康睡眠的基础。",
        intro: "健康睡眠始于理解睡眠机制。建立稳定规律,比强迫入睡更加有效。",
        whyTitle: "为什么重要",
        whyPoints: [
          "睡眠受到昼夜节律和睡眠压力调节。",
          "规律性能够帮助大脑重新学习健康睡眠。",
        ],
        practicesTitle: "核心练习",
        practices: [
          "固定起床时间。",
          "下午减少咖啡因。",
          "建立睡前放松仪式。",
        ],
        actionsTitle: "今日行动",
        actions: ["固定起床时间", "睡前减少电子屏幕"],
        encouragementTitle: "温柔提醒",
        encouragement: "健康睡眠需要逐步恢复。",
        shortDesc: "建立稳定的起床时间,开启温柔的睡眠日记。",
      },
      es: {
        title: "Fundamentos del Sueño",
        eyebrow: "SEMANA 1 · PROGRAMA CBT-I",
        seoTitle: "Fundamentos del Sueño | Semana 1 del Programa CBT-I | Somna",
        seoDescription:
          "Construye la base de un sueño saludable con hábitos constantes y prácticas suaves de CBT-I.",
        intro:
          "Dormir mejor comienza con comprender cómo funciona el sueño. La constancia suele ser más eficaz que intentar forzar el sueño.",
        whyTitle: "Por qué es importante",
        whyPoints: [
          "El sueño depende del ritmo circadiano y de la presión del sueño.",
          "La regularidad ayuda al cerebro a recuperar patrones saludables.",
        ],
        practicesTitle: "Prácticas clave",
        practices: [
          "Mantener una hora fija para despertarse.",
          "Reducir la cafeína por la tarde.",
          "Crear una rutina relajante por la noche.",
        ],
        actionsTitle: "Acciones de hoy",
        actions: [
          "Levantarse a la misma hora",
          "Reducir las pantallas antes de dormir",
        ],
        encouragementTitle: "Motivación",
        encouragement: "El sueño saludable se reconstruye gradualmente.",
        shortDesc: "Fija una hora de despertar y comienza una rutina suave.",
      },
    },
  },
  {
    slug: "week-2-stimulus-control",
    number: 2,
    i18n: {
      en: {
        title: "Stimulus Control",
        eyebrow: "WEEK 2 · CBT-I PROGRAM",
        seoTitle: "Stimulus Control | Week 2 CBT-I Program | Somna",
        seoDescription:
          "Reconnect bed with sleep using stimulus control — one of the most effective CBT-I techniques.",
        intro: "Stimulus control helps reconnect the bed with sleep.",
        whyTitle: "Why it matters",
        whyPoints: [
          "Insomnia can teach the brain to associate bed with wakefulness.",
          "Stimulus control retrains that association so bed signals sleep again.",
        ],
        practicesTitle: "Key practices",
        practices: [
          "Go to bed only when sleepy.",
          "Leave the bed if awake for about 20 minutes.",
          "Avoid phones in bed.",
        ],
        actionsTitle: "Today's actions",
        actions: [
          "Wait until genuinely sleepy",
          "Get out of bed if awake for too long",
          "Return when sleepy again",
        ],
        encouragementTitle: "A gentle reminder",
        encouragement: "Getting out of bed is not a failure.",
        shortDesc: "Reconnect bed with sleep — and only sleep.",
      },
      zh: {
        title: "刺激控制",
        eyebrow: "第2周 · CBT-I 课程",
        seoTitle: "刺激控制｜CBT-I 第2周｜Somna",
        seoDescription: "通过刺激控制重新建立床和睡眠之间的联系。",
        intro: "刺激控制帮助重新建立床和睡眠之间的联系。",
        whyTitle: "为什么重要",
        whyPoints: [
          "失眠会让大脑把床和清醒联系在一起。",
          "刺激控制能够温柔地重建床与睡眠的连接。",
        ],
        practicesTitle: "核心练习",
        practices: [
          "困倦时再上床。",
          "醒着超过20分钟可以暂时离床。",
          "不在床上玩手机。",
        ],
        actionsTitle: "今日行动",
        actions: ["真正困倦时再上床", "长时间清醒就离床", "再次困倦时回到床上"],
        encouragementTitle: "温柔提醒",
        encouragement: "离开床并不意味着失败。",
        shortDesc: "让床只与睡眠产生联结。",
      },
      es: {
        title: "Control de Estímulos",
        eyebrow: "SEMANA 2 · PROGRAMA CBT-I",
        seoTitle: "Control de Estímulos | Semana 2 del Programa CBT-I | Somna",
        seoDescription:
          "Vuelve a asociar la cama con el sueño mediante el control de estímulos.",
        intro: "El control de estímulos ayuda a asociar nuevamente la cama con el sueño.",
        whyTitle: "Por qué es importante",
        whyPoints: [
          "El insomnio puede enseñar al cerebro a asociar la cama con el desvelo.",
          "El control de estímulos restablece la asociación entre cama y sueño.",
        ],
        practicesTitle: "Prácticas clave",
        practices: [
          "Acostarse solamente cuando aparezca el sueño.",
          "Salir de la cama después de unos 20 minutos despierto.",
          "Evitar el teléfono en la cama.",
        ],
        actionsTitle: "Acciones de hoy",
        actions: [
          "Esperar hasta tener verdadero sueño",
          "Salir de la cama si llevas mucho despierto",
          "Volver cuando regrese el sueño",
        ],
        encouragementTitle: "Motivación",
        encouragement: "Salir de la cama no significa fracasar.",
        shortDesc: "Vuelve a asociar la cama con el sueño.",
      },
    },
  },
  {
    slug: "week-3-sleep-restriction",
    number: 3,
    i18n: {
      en: {
        title: "Sleep Restriction",
        eyebrow: "WEEK 3 · CBT-I PROGRAM",
        seoTitle: "Sleep Restriction | Week 3 CBT-I Program | Somna",
        seoDescription:
          "Improve sleep efficiency by aligning time in bed with actual sleep.",
        intro: "Sleep restriction improves sleep efficiency.",
        whyTitle: "Why it matters",
        whyPoints: [
          "Too much time in bed weakens sleep pressure.",
          "A tighter window deepens sleep and reduces awakenings.",
        ],
        practicesTitle: "Key practices",
        practices: [
          "Fixed wake-up time.",
          "Avoid long naps.",
          "Follow the recommended sleep window.",
        ],
        actionsTitle: "Today's actions",
        actions: [
          "Keep a stable wake-up time",
          "Follow your sleep window",
          "Avoid long naps",
        ],
        encouragementTitle: "A gentle reminder",
        encouragement: "Temporary sleepiness is expected.",
        shortDesc: "Compress time in bed to deepen your sleep drive.",
      },
      zh: {
        title: "睡眠限制",
        eyebrow: "第3周 · CBT-I 课程",
        seoTitle: "睡眠限制｜CBT-I 第3周｜Somna",
        seoDescription: "通过限制在床时间提升睡眠效率。",
        intro: "睡眠限制帮助提高睡眠效率。",
        whyTitle: "为什么重要",
        whyPoints: [
          "在床时间过长会削弱睡眠压力。",
          "更紧凑的睡眠窗口能加深睡眠、减少醒来。",
        ],
        practicesTitle: "核心练习",
        practices: ["固定起床时间。", "避免长时间午睡。", "遵循推荐睡眠窗口。"],
        actionsTitle: "今日行动",
        actions: ["保持稳定起床时间", "遵守你的睡眠窗口", "避免长时间午睡"],
        encouragementTitle: "温柔提醒",
        encouragement: "短暂困倦属于正常现象。",
        shortDesc: "适度压缩在床时间,增强睡眠驱动。",
      },
      es: {
        title: "Restricción del Sueño",
        eyebrow: "SEMANA 3 · PROGRAMA CBT-I",
        seoTitle: "Restricción del Sueño | Semana 3 del Programa CBT-I | Somna",
        seoDescription:
          "Mejora la eficiencia del sueño alineando el tiempo en cama con el sueño real.",
        intro: "La restricción del sueño ayuda a mejorar la eficiencia del sueño.",
        whyTitle: "Por qué es importante",
        whyPoints: [
          "Demasiado tiempo en cama debilita la presión del sueño.",
          "Una ventana más ajustada profundiza el sueño y reduce los despertares.",
        ],
        practicesTitle: "Prácticas clave",
        practices: [
          "Mantener una hora fija para despertarse.",
          "Evitar siestas largas.",
          "Seguir la ventana de sueño recomendada.",
        ],
        actionsTitle: "Acciones de hoy",
        actions: [
          "Mantén una hora estable para despertar",
          "Sigue tu ventana de sueño",
          "Evita siestas largas",
        ],
        encouragementTitle: "Motivación",
        encouragement: "La somnolencia temporal es normal.",
        shortDesc: "Comprime el tiempo en cama para fortalecer el sueño.",
      },
    },
  },
  {
    slug: "week-4-calming-the-mind",
    number: 4,
    i18n: {
      en: {
        title: "Calming the Mind",
        eyebrow: "WEEK 4 · CBT-I PROGRAM",
        seoTitle: "Calming the Mind | Week 4 CBT-I Program | Somna",
        seoDescription:
          "Quiet a racing mind with breathing, body scans, and mindful acceptance.",
        intro: "A busy mind is one of the most common causes of insomnia.",
        whyTitle: "Why it matters",
        whyPoints: [
          "Stress activates the alert system and makes sleep harder.",
          "Calming practices help shift the nervous system into rest mode.",
        ],
        practicesTitle: "Key practices",
        practices: ["Deep breathing", "Body scan", "Relaxation audio"],
        actionsTitle: "Today's actions",
        actions: [
          "Practice 4-7-8 breathing",
          "Try a body scan",
          "Use relaxation audio",
        ],
        encouragementTitle: "A gentle reminder",
        encouragement: "Rest itself is valuable.",
        shortDesc: "Wind-down rituals, breathing, and worry release.",
      },
      zh: {
        title: "平静思绪",
        eyebrow: "第4周 · CBT-I 课程",
        seoTitle: "平静思绪｜CBT-I 第4周｜Somna",
        seoDescription: "通过呼吸、身体扫描与正念,温柔安抚夜间的思绪。",
        intro: "思绪过度活跃是失眠常见原因之一。",
        whyTitle: "为什么重要",
        whyPoints: [
          "压力会激活警觉系统,让入睡更困难。",
          "放松练习能帮助神经系统切换到休息模式。",
        ],
        practicesTitle: "核心练习",
        practices: ["深呼吸", "身体扫描", "放松音频"],
        actionsTitle: "今日行动",
        actions: ["练习 4-7-8 呼吸", "尝试身体扫描", "聆听放松音频"],
        encouragementTitle: "温柔提醒",
        encouragement: "休息本身就有价值。",
        shortDesc: "睡前仪式、呼吸练习、释放担忧。",
      },
      es: {
        title: "Calmar la Mente",
        eyebrow: "SEMANA 4 · PROGRAMA CBT-I",
        seoTitle: "Calmar la Mente | Semana 4 del Programa CBT-I | Somna",
        seoDescription:
          "Silencia una mente acelerada con respiración, escaneo corporal y aceptación.",
        intro: "La mente acelerada es una causa frecuente del insomnio.",
        whyTitle: "Por qué es importante",
        whyPoints: [
          "El estrés activa el sistema de alerta y dificulta el sueño.",
          "Las prácticas calmantes ayudan al sistema nervioso a entrar en descanso.",
        ],
        practicesTitle: "Prácticas clave",
        practices: ["Respiración profunda", "Escaneo corporal", "Audio de relajación"],
        actionsTitle: "Acciones de hoy",
        actions: [
          "Practica respiración 4-7-8",
          "Prueba un escaneo corporal",
          "Usa audio de relajación",
        ],
        encouragementTitle: "Motivación",
        encouragement: "Descansar también tiene valor.",
        shortDesc: "Rituales de descanso, respiración y liberar la preocupación.",
      },
    },
  },
  {
    slug: "week-5-cognitive-reframing",
    number: 5,
    i18n: {
      en: {
        title: "Cognitive Reframing",
        eyebrow: "WEEK 5 · CBT-I PROGRAM",
        seoTitle: "Cognitive Reframing | Week 5 CBT-I Program | Somna",
        seoDescription:
          "Soften unhelpful thoughts about sleep with CBT-I cognitive reframing.",
        intro: "Thoughts influence emotions, and emotions influence sleep.",
        whyTitle: "Why it matters",
        whyPoints: [
          "Catastrophic thinking increases anxiety and keeps the brain alert.",
          "Balanced perspectives help the body settle.",
        ],
        practicesTitle: "Try this reframe",
        practices: [
          "Common thought: \"I'll never sleep again.\"",
          "Balanced response: \"One difficult night does not define my progress.\"",
        ],
        actionsTitle: "Today's actions",
        actions: [
          "Notice automatic thoughts",
          "Challenge extreme predictions",
          "Replace with balanced perspectives",
        ],
        encouragementTitle: "A gentle reminder",
        encouragement: "Sleep does not require perfect thinking.",
        shortDesc: "Soften unhelpful thoughts about sleep.",
      },
      zh: {
        title: "认知重建",
        eyebrow: "第5周 · CBT-I 课程",
        seoTitle: "认知重建｜CBT-I 第5周｜Somna",
        seoDescription: "通过 CBT-I 认知重建,温柔化解关于睡眠的卡点。",
        intro: "想法影响情绪,情绪影响睡眠。",
        whyTitle: "为什么重要",
        whyPoints: [
          "灾难化思维会增加焦虑、让大脑保持警觉。",
          "平衡的视角能帮助身体安顿下来。",
        ],
        practicesTitle: "尝试重建",
        practices: [
          "常见想法：\"我再也睡不好了。\"",
          "平衡思维：\"一次糟糕的夜晚不能定义我的恢复过程。\"",
        ],
        actionsTitle: "今日行动",
        actions: ["留意自动想法", "挑战极端预期", "用平衡的视角替换它们"],
        encouragementTitle: "温柔提醒",
        encouragement: "睡眠不需要完美的思维。",
        shortDesc: "温柔松动那些关于睡眠的卡点。",
      },
      es: {
        title: "Reestructuración Cognitiva",
        eyebrow: "SEMANA 5 · PROGRAMA CBT-I",
        seoTitle: "Reestructuración Cognitiva | Semana 5 del Programa CBT-I | Somna",
        seoDescription:
          "Suaviza pensamientos poco útiles sobre el sueño con la reestructuración cognitiva.",
        intro: "Los pensamientos influyen en las emociones, y las emociones en el sueño.",
        whyTitle: "Por qué es importante",
        whyPoints: [
          "El pensamiento catastrófico aumenta la ansiedad y mantiene al cerebro alerta.",
          "Las perspectivas equilibradas ayudan al cuerpo a calmarse.",
        ],
        practicesTitle: "Prueba este reencuadre",
        practices: [
          "Pensamiento común: \"Nunca volveré a dormir.\"",
          "Respuesta equilibrada: \"Una mala noche no define mi progreso.\"",
        ],
        actionsTitle: "Acciones de hoy",
        actions: [
          "Nota los pensamientos automáticos",
          "Cuestiona las predicciones extremas",
          "Reemplázalas con perspectivas equilibradas",
        ],
        encouragementTitle: "Motivación",
        encouragement: "El sueño no requiere un pensamiento perfecto.",
        shortDesc: "Suaviza los pensamientos poco útiles sobre el sueño.",
      },
    },
  },
  {
    slug: "week-6-maintain-and-flourish",
    number: 6,
    i18n: {
      en: {
        title: "Maintain & Flourish",
        eyebrow: "WEEK 6 · CBT-I PROGRAM",
        seoTitle: "Maintain & Flourish | Week 6 CBT-I Program | Somna",
        seoDescription:
          "Maintain healthy sleep long-term. Lock in CBT-I gains and trust your body's natural rhythm.",
        intro: "Healthy sleep is a lifelong skill.",
        whyTitle: "Why it matters",
        whyPoints: [
          "Occasional poor nights do not erase progress.",
          "Maintenance protects the gains you've built.",
        ],
        practicesTitle: "Key practices",
        practices: [
          "Keep consistent wake-up times.",
          "Continue relaxation rituals.",
          "Trust your body's natural ability to sleep.",
        ],
        actionsTitle: "Today's actions",
        actions: [
          "Continue your routines",
          "Accept occasional setbacks",
          "Focus on long-term progress",
        ],
        encouragementTitle: "A gentle reminder",
        encouragement: "Good sleep is resilience, not perfection.",
        shortDesc: "Keep your gains. Sleep with trust again.",
      },
      zh: {
        title: "巩固与成长",
        eyebrow: "第6周 · CBT-I 课程",
        seoTitle: "巩固与成长｜CBT-I 第6周｜Somna",
        seoDescription: "长期维持健康睡眠,巩固 CBT-I 成果,重新信任身体的节律。",
        intro: "健康睡眠是一项长期能力。",
        whyTitle: "为什么重要",
        whyPoints: [
          "偶尔的糟糕夜晚不会抹去进步。",
          "维持练习能保护你已建立的成果。",
        ],
        practicesTitle: "核心练习",
        practices: [
          "保持稳定的起床时间。",
          "延续放松仪式。",
          "信任身体自然的入睡能力。",
        ],
        actionsTitle: "今日行动",
        actions: ["延续你的日常练习", "接纳偶尔的波动", "关注长期进展"],
        encouragementTitle: "温柔提醒",
        encouragement: "良好的睡眠意味着恢复能力,而不是完美。",
        shortDesc: "巩固成果,重新信任睡眠。",
      },
      es: {
        title: "Mantener y Prosperar",
        eyebrow: "SEMANA 6 · PROGRAMA CBT-I",
        seoTitle: "Mantener y Prosperar | Semana 6 del Programa CBT-I | Somna",
        seoDescription:
          "Mantén un sueño saludable a largo plazo y confía en el ritmo natural de tu cuerpo.",
        intro: "Dormir bien es una habilidad para toda la vida.",
        whyTitle: "Por qué es importante",
        whyPoints: [
          "Las noches difíciles ocasionales no borran el progreso.",
          "El mantenimiento protege los logros del programa.",
        ],
        practicesTitle: "Prácticas clave",
        practices: [
          "Mantén horarios estables al despertar.",
          "Continúa con tus rituales de relajación.",
          "Confía en la capacidad natural del cuerpo para dormir.",
        ],
        actionsTitle: "Acciones de hoy",
        actions: [
          "Continúa tus rutinas",
          "Acepta los altibajos ocasionales",
          "Enfócate en el progreso a largo plazo",
        ],
        encouragementTitle: "Motivación",
        encouragement: "Dormir bien significa resiliencia, no perfección.",
        shortDesc: "Conserva tus logros y vuelve a confiar en el sueño.",
      },
    },
  },
];

export function getWeek(slug: string) {
  return programWeeks.find((w) => w.slug === slug);
}

export function getAdjacentWeeks(slug: string) {
  const idx = programWeeks.findIndex((w) => w.slug === slug);
  return {
    prev: idx > 0 ? programWeeks[idx - 1] : null,
    next: idx >= 0 && idx < programWeeks.length - 1 ? programWeeks[idx + 1] : null,
  };
}