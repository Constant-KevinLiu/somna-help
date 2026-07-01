// Week 3 — Sleep Restriction (Lessons 7-9)
// Source: "18 CBT-I Program.docx"
import type { LessonContent } from "../program-lessons";

export const week3Lessons: LessonContent[] = [
  // ───────────────────────── Lesson 7: What Is Sleep Efficiency? ─────────────────────────
  {
    slug: "what-is-sleep-efficiency",
    weekNumber: 3,
    weekSlug: "week-3",
    lessonNumber: 7,
    estimatedMinutes: 6,
    relatedLessonSlugs: [
      "sleep-restriction-therapy",
      "sleep-restriction-mistakes",
      "how-sleep-works",
    ],
    i18n: {
      en: {
        title: "What Is Sleep Efficiency?",
        eyebrow: "WEEK 3 · LESSON 7",
        subtitle: "The foundational metric that shifts your focus from hours to quality.",
        difficulty: "Intermediate",
        readingTime: "6 min read",
        content: [
          {
            heading: "Quality over quantity",
            paras: [
              "To make meaningful improvements to your rest, we need a reliable metric that focuses on the true quality of your night, rather than just the total number of hours you spend in bed. In CBT-I, this foundational metric is called Sleep Efficiency (SE).",
              "Sleep Efficiency is the exact mathematical ratio of your total actual sleep time to the total amount of time you spend lying in bed, calculated as a percentage: Sleep Efficiency = (Total Actual Sleep Time ÷ Total Time Spent in Bed) × 100%.",
            ],
          },
          {
            heading: "A clear comparison",
            paras: [
              "The Restless Night: you spend 8 hours in bed, but due to tossing, turning, and waking up frequently, you only sleep for 6 hours. Your Sleep Efficiency is 75%.",
              "The Consolidated Night: you spend only 6.5 hours in bed, but you sleep soundly for 6 hours. Your Sleep Efficiency rises to 92%.",
              "For a healthy, consistent sleeper, Sleep Efficiency naturally sits beautifully above 85%. For those navigating chronic insomnia, it frequently drops below 75% — meaning a massive portion of your night is spent practicing wakefulness and worry inside your bed.",
            ],
          },
          {
            heading: "A new goal",
            paras: [
              "CBT-I completely transforms your goal. We shift your focus away from a stressful quest for quantity (more hours in bed) and focus entirely on maximizing quality (consolidated, unbroken sleep). By shrinking your time in bed to closely match your actual sleep capacity, we eliminate the empty, anxious gaps in your night.",
            ],
          },
        ],
        actionStepTitle: "Action Step",
        actionStep:
          "Let's calculate your baseline. Look over your sleep diary entries from the past week. Average your total actual sleep time, divide it by your average total time in bed, and multiply by 100. Write this percentage down in your dashboard — it will serve as our compass for the next phase.",
        reflectionTitle: "Reflection",
        reflection:
          "How does it feel to look at your night through the lens of efficiency rather than raw hours? Does it bring a sense of relief to realize that spending less time in bed could be the secret to deeper rest?",
        faqs: [
          {
            q: "What is our ultimate target Sleep Efficiency?",
            a: "Our target is a stable zone between 85% and 90%. Once your sleep is consistently compressed and efficient within this window, we can safely and gradually expand your time in bed.",
          },
          {
            q: "What if my Sleep Efficiency is already quite high, but I still feel exhausted?",
            a: "If your efficiency is naturally above 85% but you feel unrefreshed, your challenges may stem from circadian misalignments, sleep quality disruptions, or specific cognitive stressors. We will address these in our upcoming modules.",
          },
        ],
        ctaLabel: "Calculate My Sleep Efficiency",
        seoTitle: "What Is Sleep Efficiency? The CBT-I Metric Explained | Somna",
        seoDescription:
          "Learn what Sleep Efficiency is, how to calculate it, and why CBT-I shifts your focus from hours in bed to consolidated, quality sleep.",
        keywords: [
          "sleep efficiency",
          "CBT-I metric",
          "calculate sleep efficiency",
          "sleep quality",
          "insomnia efficiency",
        ],
      },
      zh: {
        title: "什么是睡眠效率?",
        eyebrow: "第3周 · 第7课",
        subtitle: "这个基础指标,把你的关注点从时长转向质量。",
        difficulty: "进阶",
        readingTime: "6 分钟阅读",
        content: [
          {
            heading: "质量胜于数量",
            paras: [
              "要让睡眠有意义的改善,我们需要一个可靠的指标,聚焦夜晚的真正质量,而非你躺在床上的总时长。在 CBT-I 中,这个基础指标叫做睡眠效率(SE)。",
              "睡眠效率是你实际睡眠总时间与躺在床上总时间的精确数学比值,以百分比表示:睡眠效率 = (实际睡眠总时间 ÷ 在床总时间) × 100%。",
            ],
          },
          {
            heading: "一个清晰的对比",
            paras: [
              "焦躁之夜:你在床上躺了 8 小时,但因辗转反侧和频繁醒来,只睡了 6 小时。睡眠效率为 75%。",
              "整合之夜:你只在床上躺了 6.5 小时,却安稳睡了 6 小时。睡眠效率升至 92%。",
              "对健康稳定的睡眠者,睡眠效率自然稳稳高于 85%。对慢性失眠者,它常常跌破 75%——意味着你夜晚很大一部分时间都在床上练习清醒与担忧。",
            ],
          },
          {
            heading: "新的目标",
            paras: [
              "CBT-I 彻底改变了你的目标。我们把关注点从对数量(更多在床时间)的焦虑追求,转向最大化质量(整合、不间断的睡眠)。通过把在床时间压缩到接近你的实际睡眠能力,我们消除夜晚中那些空洞、焦虑的间隙。",
            ],
          },
        ],
        actionStepTitle: "行动步骤",
        actionStep:
          "让我们计算你的基线。查看过去一周的睡眠日记。算出实际睡眠总时间的平均值,除以在床总时间的平均值,再乘以 100。把这个百分比记在仪表盘里——它将作为下一阶段的指南针。",
        reflectionTitle: "反思练习",
        reflection:
          "用效率而非原始时长的视角看待你的夜晚,感觉如何?意识到少待在床上可能是更深休息的秘诀,是否带来一丝释然?",
        faqs: [
          {
            q: "我们的最终目标睡眠效率是多少?",
            a: "目标是稳定在 85%–90% 之间。一旦你的睡眠在这个窗口内持续紧凑高效,我们就可以安全、逐步地延长在床时间。",
          },
          {
            q: "如果我的睡眠效率已经很高,却仍觉得疲惫怎么办?",
            a: "如果效率自然高于 85% 却仍感未恢复,你的困扰可能源于昼夜节律错位、睡眠质量受损或特定认知压力。我们会在后续模块中处理。",
          },
        ],
        ctaLabel: "计算我的睡眠效率",
        seoTitle: "什么是睡眠效率?CBT-I 指标详解｜Somna",
        seoDescription:
          "了解睡眠效率是什么、如何计算,以及为什么 CBT-I 把关注点从在床时长转向整合的高质量睡眠。",
        keywords: ["睡眠效率", "CBT-I 指标", "计算睡眠效率", "睡眠质量", "失眠 效率"],
      },
      es: {
        title: "¿Qué es la eficiencia del sueño?",
        eyebrow: "SEMANA 3 · LECCIÓN 7",
        subtitle: "La métrica fundamental que cambia tu enfoque de las horas a la calidad.",
        difficulty: "Intermedio",
        readingTime: "6 min de lectura",
        content: [
          {
            heading: "Calidad sobre cantidad",
            paras: [
              "Para mejorar de forma significativa tu descanso, necesitamos una métrica fiable que se centre en la calidad real de tu noche, no solo en el total de horas que pasas en la cama. En la CBT-I, esta métrica fundamental se llama Eficiencia del Sueño (ES).",
              "La Eficiencia del Sueño es la razón matemática exacta entre tu tiempo total de sueño real y el tiempo total que pasas en la cama, expresada en porcentaje: Eficiencia del Sueño = (Tiempo Total de Sueño Real ÷ Tiempo Total en Cama) × 100%.",
            ],
          },
          {
            heading: "Una comparación clara",
            paras: [
              "La noche inquieta: pasas 8 horas en la cama, pero por dar vueltas y despertarte a menudo solo duermes 6 horas. Tu Eficiencia del Sueño es del 75%.",
              "La noche consolidada: pasas solo 6,5 horas en la cama, pero duermes profundamente 6 horas. Tu Eficiencia del Sueño sube al 92%.",
              "Para un dormidor sano y constante, la Eficiencia del Sueño se sitúa naturalmente por encima del 85%. Para quienes atraviesan insomnio crónico, suele caer por debajo del 75% — lo que significa que gran parte de tu noche la pasas practicando vigilia y preocupación en la cama.",
            ],
          },
          {
            heading: "Un nuevo objetivo",
            paras: [
              "La CBT-I transforma por completo tu objetivo. Desplazamos tu enfoque de la búsqueda estresante de cantidad (más horas en cama) hacia maximizar la calidad (sueño consolidado e ininterrumpido). Al reducir tu tiempo en cama para que coincida con tu capacidad real de sueño, eliminamos los huecos vacíos y ansiosos de tu noche.",
            ],
          },
        ],
        actionStepTitle: "Paso de acción",
        actionStep:
          "Calculemos tu línea base. Revisa las entradas de tu diario de sueño de la semana pasada. Promedia tu tiempo total de sueño real, divídelo entre tu tiempo medio total en cama y multiplica por 100. Anota este porcentaje en tu panel — servirá como brújula para la siguiente fase.",
        reflectionTitle: "Reflexión",
        reflection:
          "¿Cómo se siente mirar tu noche a través de la lente de la eficiencia en lugar de las horas brutas? ¿Te alivia descubrir que pasar menos tiempo en la cama podría ser el secreto de un descanso más profundo?",
        faqs: [
          {
            q: "¿Cuál es nuestra Eficiencia del Sueño objetivo?",
            a: "Nuestro objetivo es una zona estable entre el 85% y el 90%. Una vez que tu sueño esté comprimido y sea eficiente de forma constante en esta ventana, podremos ampliar tu tiempo en cama de forma segura y gradual.",
          },
          {
            q: "¿Y si mi Eficiencia del Sueño ya es bastante alta, pero sigo sintiéndome agotado?",
            a: "Si tu eficiencia es naturalmente superior al 85% pero te sientes sin descansar, tus desafíos pueden provenir de desalineaciones circadianas, alteraciones de la calidad del sueño o estresores cognitivos específicos. Los abordaremos en los próximos módulos.",
          },
        ],
        ctaLabel: "Calcular mi eficiencia del sueño",
        seoTitle: "¿Qué es la eficiencia del sueño? La métrica de la CBT-I explicada | Somna",
        seoDescription:
          "Aprende qué es la Eficiencia del Sueño, cómo calcularla y por qué la CBT-I desplaza tu enfoque de las horas en cama al sueño consolidado y de calidad.",
        keywords: [
          "eficiencia del sueño",
          "métrica CBT-I",
          "calcular eficiencia del sueño",
          "calidad del sueño",
          "insomnio eficiencia",
        ],
      },
    },
  },

  // ───────────────────────── Lesson 8: How Sleep Restriction Therapy Works ─────────────────────────
  {
    slug: "sleep-restriction-therapy",
    weekNumber: 3,
    weekSlug: "week-3",
    lessonNumber: 8,
    estimatedMinutes: 7,
    relatedLessonSlugs: [
      "what-is-sleep-efficiency",
      "sleep-restriction-mistakes",
      "stimulus-control-science",
    ],
    i18n: {
      en: {
        title: "How Sleep Restriction Therapy Works",
        eyebrow: "WEEK 3 · LESSON 8",
        subtitle: "Counterintuitive but profound — compressing your window to deepen your sleep.",
        difficulty: "Intermediate",
        readingTime: "7 min read",
        content: [
          {
            heading: "A counterintuitive principle",
            paras: [
              "Sleep Restriction Therapy is undeniably one of the most counterintuitive aspects of CBT-I, yet it is profoundly effective. The core principle sounds radical: to cure your insomnia, we must temporarily limit the amount of time you are allowed to spend in bed.",
              'When you sleep poorly, the natural temptation is to stay in bed longer to "catch up" on rest. However, this stretches out your sleep, leading to shallow, fragmented nights filled with long stretches of wakefulness.',
              "Sleep Restriction works like a dam, building up your natural Sleep Drive (your homeostatic sleep pressure). By narrowing your nightly window, we concentrate your sleep into a dense, unbroken block.",
            ],
          },
          {
            heading: "How it works step-by-step",
            paras: [
              "1. Establish Your Baseline: if your diary shows you average 5.5 hours of actual sleep, we set your initial allowed time in bed to exactly 5.5 hours (e.g., 12:00 AM to 5:30 AM).",
              "2. Anchor Your Wake Time: you choose a fixed wake time based on your life (e.g., 6:30 AM) and count backward to determine your strict bedtime (e.g., 1:00 AM).",
              "3. Build Sleep Pressure: this restricted window creates a mild, safe sleep deficit. This pressure acts as a natural sedative, overriding your hyperarousal and helping you fall asleep rapidly and stay asleep deeply.",
              "4. Gradual Expansion: once your Sleep Efficiency climbs safely above 85% for a full week, we reward your body by expanding your window by 15 minutes. We repeat this gentle process until we find your optimal, natural sleep duration.",
            ],
          },
          {
            heading: "Safety note",
            paras: [
              "To preserve cognitive health and daily safety, we never compress an individual's sleep window below a strict minimum of 5 hours.",
            ],
          },
        ],
        actionStepTitle: "Action Step",
        actionStep:
          "Using your metrics from the previous lesson, calculate your personalized Initial Sleep Window. Fix your mandatory wake-up time, count backward by your average actual sleep time, and set your new bedtime. Commit to this schedule strictly for the next seven days.",
        reflectionTitle: "Reflection",
        reflection:
          "What internal resistance or anxieties surface when you consider shortening your time in bed? Acknowledge these feelings — they are completely natural when trying something so beautifully unconventional.",
        faqs: [
          {
            q: "Will this make me feel tired during the day initially?",
            a: "Yes, it is very common to feel increased daytime sleepiness during the first few days of this phase. This daytime fatigue is a clear sign that your homeostatic sleep drive is building beautifully, preparing you for a deeper night ahead.",
          },
          {
            q: "Can I sleep in on weekends if I had an exceptionally intense week?",
            a: "To break chronic insomnia, consistency is vital. Shifting your window on weekends confuses your circadian rhythm and resets your progress. Keep your wake time steady.",
          },
        ],
        ctaLabel: "Generate My Custom Sleep Window",
        seoTitle: "How Sleep Restriction Therapy Works | Somna CBT-I",
        seoDescription:
          "Understand how Sleep Restriction Therapy compresses your sleep window to build sleep drive, deepen sleep, and gradually expand to your natural duration.",
        keywords: [
          "sleep restriction therapy",
          "CBT-I sleep restriction",
          "sleep window",
          "sleep drive",
          "insomnia treatment",
        ],
      },
      zh: {
        title: "睡眠限制疗法如何运作",
        eyebrow: "第3周 · 第8课",
        subtitle: "反直觉却深刻——压缩睡眠窗口以加深你的睡眠。",
        difficulty: "进阶",
        readingTime: "7 分钟阅读",
        content: [
          {
            heading: "反直觉的原理",
            paras: [
              "睡眠限制疗法无疑是 CBT-I 中最反直觉的部分之一,却极为有效。核心原理听起来很激进:要治愈失眠,我们必须暂时限制你被允许在床上的时间。",
              "当你睡得不好,自然的诱惑是赖床更久来「补觉」。然而这会拉长你的睡眠,导致浅而破碎的夜晚,充满漫长的清醒时段。",
              "睡眠限制像一座水坝,蓄积你天然的睡眠驱动力(稳态睡眠压力)。通过收窄每晚的窗口,我们把睡眠浓缩成一段密集、不间断的区块。",
            ],
          },
          {
            heading: "逐步运作",
            paras: [
              "1. 建立基线:如果日记显示你平均实际睡眠 5.5 小时,我们就把初始允许在床时间设为正好 5.5 小时(例如 0:00–5:30)。",
              "2. 锚定起床时间:根据生活选择固定起床时间(例如 6:30),倒推确定严格的上床时间(例如 1:00)。",
              "3. 蓄积睡眠压力:这个受限窗口制造温和、安全的睡眠赤字。压力如同天然镇静剂,压过过度觉醒,帮你快速入睡并深睡。",
              "4. 逐步扩展:一旦睡眠效率连续一周稳稳高于 85%,我们就把窗口延长 15 分钟作为奖励。重复这个温柔过程,直到找到你最佳的自然睡眠时长。",
            ],
          },
          {
            heading: "安全提示",
            paras: [
              "为保护认知健康与日常安全,我们绝不把任何人的睡眠窗口压缩到严格最低 5 小时以下。",
            ],
          },
        ],
        actionStepTitle: "行动步骤",
        actionStep:
          "用上一课的指标,计算你个性化的初始睡眠窗口。固定强制起床时间,按平均实际睡眠时间倒推,设定新的上床时间。接下来七天严格遵守这个时间表。",
        reflectionTitle: "反思练习",
        reflection:
          "想到要缩短在床时间,内心会浮现哪些抗拒或焦虑?承认这些感受——在尝试如此美妙而非常规的方法时,它们完全自然。",
        faqs: [
          {
            q: "一开始白天会犯困吗?",
            a: "会,这一阶段前几天白天嗜睡增加很常见。这种日间疲劳清楚地表明你的稳态睡眠驱动力正在美好地蓄积,为更深的夜晚做准备。",
          },
          {
            q: "如果一周特别累,周末可以补觉吗?",
            a: "要打破慢性失眠,一致性至关重要。周末改变窗口会扰乱昼夜节律、重置进度。保持起床时间稳定。",
          },
        ],
        ctaLabel: "生成我的定制睡眠窗口",
        seoTitle: "睡眠限制疗法如何运作｜Somna CBT-I",
        seoDescription:
          "了解睡眠限制疗法如何压缩睡眠窗口以蓄积睡眠驱动力、加深睡眠,并逐步扩展到你的自然时长。",
        keywords: ["睡眠限制疗法", "CBT-I 睡眠限制", "睡眠窗口", "睡眠驱动力", "失眠治疗"],
      },
      es: {
        title: "Cómo funciona la Terapia de Restricción del Sueño",
        eyebrow: "SEMANA 3 · LECCIÓN 8",
        subtitle: "Contraintuitiva pero profunda — comprime tu ventana para profundizar tu sueño.",
        difficulty: "Intermedio",
        readingTime: "7 min de lectura",
        content: [
          {
            heading: "Un principio contraintuitivo",
            paras: [
              "La Terapia de Restricción del Sueño es sin duda uno de los aspectos más contraintuitivos de la CBT-I, pero es profundamente eficaz. El principio central suena radical: para curar tu insomnio, debemos limitar temporalmente el tiempo que se te permite pasar en la cama.",
              'Cuando duermes mal, la tentación natural es quedarte más tiempo en la cama para "recuperar" el descanso. Sin embargo, esto estira tu sueño y produce noches superficiales y fragmentadas, llenas de largos tramos de vigilia.',
              "La Restricción del Sueño funciona como una presa, acumulando tu Presión de Sueño natural (la presión homeostática). Al estrechar tu ventana nocturna, concentramos tu sueño en un bloque denso e ininterrumpido.",
            ],
          },
          {
            heading: "Cómo funciona paso a paso",
            paras: [
              "1. Establece tu línea base: si tu diario muestra que duermes de media 5,5 horas, fijamos tu tiempo inicial permitido en cama en exactamente 5,5 horas (p. ej., 0:00 a 5:30).",
              "2. Ancla tu hora de despertar: elige una hora fija de despertar según tu vida (p. ej., 6:30) y cuenta hacia atrás para determinar tu hora estricta de acostarte (p. ej., 1:00).",
              "3. Acumula presión de sueño: esta ventana restringida crea un déficit de sueño leve y seguro. Esta presión actúa como un sedante natural, anulando tu hiperactivación y ayudándote a dormirte rápido y profundamente.",
              "4. Expansión gradual: una vez que tu Eficiencia del Sueño supere el 85% durante una semana completa, recompensamos a tu cuerpo ampliando tu ventana en 15 minutos. Repetimos este proceso suave hasta encontrar tu duración natural óptima.",
            ],
          },
          {
            heading: "Nota de seguridad",
            paras: [
              "Para preservar la salud cognitiva y la seguridad diaria, nunca comprimimos la ventana de sueño de una persona por debajo de un mínimo estricto de 5 horas.",
            ],
          },
        ],
        actionStepTitle: "Paso de acción",
        actionStep:
          "Con tus métricas de la lección anterior, calcula tu Ventana Inicial de Sueño personalizada. Fija tu hora obligatoria de despertar, cuenta hacia atrás según tu tiempo medio real de sueño y establece tu nueva hora de acostarte. Comprométete con este horario de forma estricta durante los próximos siete días.",
        reflectionTitle: "Reflexión",
        reflection:
          "¿Qué resistencias o ansiedades internas surgen al considerar acortar tu tiempo en la cama? Reconoce estos sentimientos — son completamente naturales al probar algo tan bellamente poco convencional.",
        faqs: [
          {
            q: "¿Esto me hará sentir cansado durante el día al principio?",
            a: "Sí, es muy común sentir más somnolencia diurna durante los primeros días de esta fase. Esta fatiga diurna es una señal clara de que tu presión homeostática de sueño se está acumulando maravillosamente, preparándote para una noche más profunda.",
          },
          {
            q: "¿Puedo dormir más los fines de semana si he tenido una semana especialmente intensa?",
            a: "Para romper el insomnio crónico, la constancia es vital. Cambiar tu ventana los fines de semana confunde tu ritmo circadiano y reinicia tu progreso. Mantén estable tu hora de despertar.",
          },
        ],
        ctaLabel: "Generar mi ventana de sueño personalizada",
        seoTitle: "Cómo funciona la Terapia de Restricción del Sueño | Somna CBT-I",
        seoDescription:
          "Comprende cómo la Terapia de Restricción del Sueño comprime tu ventana para acumular presión de sueño, profundizar el sueño y expandirse gradualmente a tu duración natural.",
        keywords: [
          "terapia de restricción del sueño",
          "CBT-I restricción del sueño",
          "ventana de sueño",
          "presión del sueño",
          "tratamiento del insomnio",
        ],
      },
    },
  },

  // ───────────────────────── Lesson 9: Common Mistakes During Sleep Restriction ─────────────────────────
  {
    slug: "sleep-restriction-mistakes",
    weekNumber: 3,
    weekSlug: "week-3",
    lessonNumber: 9,
    estimatedMinutes: 6,
    relatedLessonSlugs: [
      "sleep-restriction-therapy",
      "what-is-sleep-efficiency",
      "leaving-bed-without-frustration",
    ],
    i18n: {
      en: {
        title: "Common Mistakes During Sleep Restriction",
        eyebrow: "WEEK 3 · LESSON 9",
        subtitle: "Five behavioral pitfalls to avoid — and how to protect your progress.",
        difficulty: "Intermediate",
        readingTime: "6 min read",
        content: [
          {
            heading: "Mistakes 1–3",
            paras: [
              "Sleep Restriction Therapy is an incredibly powerful catalyst for deeper rest, but because it challenges our natural instincts, it requires precise execution.",
              "Mistake 1 — Compressing the Window Too Aggressively: restricting your time in bed too severely causes excessive deprivation rather than a helpful, managed sleep debt. Always maintain a baseline of at least 5 to 5.5 hours in bed unless supervised by a specialist.",
              "Mistake 2 — Sneaking in Daytime Naps: napping acts like a pressure valve, releasing the valuable sleep drive you are working so hard to build during the day. If you absolutely must rest for safety, limit it to a maximum of 20 minutes before 3:00 PM.",
              "Mistake 3 — Forgetting Stimulus Control: if you find yourself awake inside your restricted window, do not lie there trying to force it. Sleep restriction must always be paired with stimulus control — if you are clearly awake, get up.",
            ],
          },
          {
            heading: "Mistakes 4–5",
            paras: [
              "Mistake 4 — Expanding Your Time in Bed Too Rapidly: adding an hour back to your schedule after just one good night can immediately fracture your sleep again. Only increase your time in bed in 15-minute increments after maintaining a weekly efficiency above 85%.",
              "Mistake 5 — Clock-Watching Vigilance: staring at your alarm clock to see if you are adhering to your window perfectly triggers adrenaline. Set your alarms, turn the clock face to the wall, and trust the behavioral structure.",
            ],
          },
        ],
        actionStepTitle: "Action Step",
        actionStep:
          "Take a look back at your entries from the past few days. Did any of these common pitfalls slip into your routine? Choose just one area of vulnerability and write down a clear, gentle plan to protect against it this week.",
        reflectionTitle: "Reflection",
        reflection:
          "Which of these mistakes feels the most tempting to make in your daily life? Why does that specific habit feel comforting, and how can we support you in shifting away from it?",
        faqs: [
          {
            q: "What should I do if I feel too exhausted to drive safely?",
            a: "Daily safety is always your absolute priority. If daytime fatigue ever compromises your safety while driving or operating machinery, immediately expand your sleep window by 30 minutes and focus on stabilization.",
          },
          {
            q: "What if I follow my window perfectly but still wake up in the middle of the night?",
            a: "Do not panic. This is standard in the opening phase of therapy. Step out of bed, apply your stimulus control tools, and let your building sleep drive guide you back naturally.",
          },
        ],
        ctaLabel: "Connect With the Somna Community",
        seoTitle: "Common Mistakes During Sleep Restriction | Somna CBT-I",
        seoDescription:
          "Avoid the five most common Sleep Restriction mistakes — over-compressing, napping, skipping stimulus control, expanding too fast, and clock-watching.",
        keywords: [
          "sleep restriction mistakes",
          "CBT-I errors",
          "sleep restriction tips",
          "insomnia therapy pitfalls",
          "sleep compression",
        ],
      },
      zh: {
        title: "睡眠限制期间的常见错误",
        eyebrow: "第3周 · 第9课",
        subtitle: "五个需要避免的行为陷阱——以及如何保护你的进度。",
        difficulty: "进阶",
        readingTime: "6 分钟阅读",
        content: [
          {
            heading: "错误 1–3",
            paras: [
              "睡眠限制疗法是通往深度休息的强大催化剂,但因为它挑战本能,所以需要精确执行。",
              "错误 1——压缩窗口过猛:过度限制在床时间会造成过度剥夺,而非有益、可控的睡眠负债。除非有专家监督,否则在床时间至少保持 5–5.5 小时基线。",
              "错误 2——偷偷白天小睡:小睡像减压阀,会释放你辛苦在白天蓄积的宝贵睡眠驱动力。若为安全必须休息,限制在下午 3 点前不超过 20 分钟。",
              "错误 3——忘记刺激控制:如果在受限窗口内清醒,不要躺着硬撑。睡眠限制必须始终与刺激控制配合——明显清醒就起身。",
            ],
          },
          {
            heading: "错误 4–5",
            paras: [
              "错误 4——过快延长在床时间:仅一夜睡好就把时间加回一小时,可能立刻再次打碎睡眠。只有在周效率持续高于 85% 后,才以 15 分钟为单位增加在床时间。",
              "错误 5——盯钟式警觉:盯着闹钟看自己是否完美遵守窗口会触发肾上腺素。设好闹钟,把钟面朝墙,信任行为结构。",
            ],
          },
        ],
        actionStepTitle: "行动步骤",
        actionStep:
          "回顾过去几天的日记。这些常见陷阱是否悄悄混入了你的日常?选择一个薄弱环节,写下一份清晰、温柔的计划,本周保护自己不受其影响。",
        reflectionTitle: "反思练习",
        reflection:
          "这些错误中,哪一个在你日常生活里最诱人?为什么那个具体习惯让你感到安慰?我们如何支持你转变它?",
        faqs: [
          {
            q: "如果累到无法安全驾驶怎么办?",
            a: "日常安全永远是绝对优先。如果白天疲劳危及你驾驶或操作机械的安全,立即把睡眠窗口延长 30 分钟,专注于稳定。",
          },
          {
            q: "如果完美遵守窗口却仍在半夜醒来怎么办?",
            a: "别慌。这是治疗初期阶段的标准情况。下床,运用你的刺激控制工具,让正在蓄积的睡眠驱动力自然引导你回去。",
          },
        ],
        ctaLabel: "加入 Somna 社区",
        seoTitle: "睡眠限制期间的常见错误｜Somna CBT-I",
        seoDescription:
          "避免睡眠限制最常见的五个错误——过度压缩、小睡、跳过刺激控制、过快延长、盯钟。",
        keywords: ["睡眠限制 错误", "CBT-I 错误", "睡眠限制 技巧", "失眠疗法 陷阱", "睡眠压缩"],
      },
      es: {
        title: "Errores comunes durante la restricción del sueño",
        eyebrow: "SEMANA 3 · LECCIÓN 9",
        subtitle: "Cinco trampas conductuales que evitar — y cómo proteger tu progreso.",
        difficulty: "Intermedio",
        readingTime: "6 min de lectura",
        content: [
          {
            heading: "Errores 1–3",
            paras: [
              "La Terapia de Restricción del Sueño es un catalizador increíblemente potente para un descanso más profundo, pero como desafía nuestros instintos naturales, requiere una ejecución precisa.",
              "Error 1 — Comprimir la ventana con demasiada agresividad: restringir el tiempo en la cama de forma demasiado severa causa una privación excesiva en lugar de una deuda de sueño útil y gestionada. Mantén siempre una línea base de al menos 5 a 5,5 horas en cama salvo supervisión de un especialista.",
              "Error 2 — Colar siestas diurnas: la siesta actúa como una válvula de presión, liberando la valiosa presión de sueño que tanto te esfuerzas por acumular durante el día. Si debes descansar por seguridad, limítalo a un máximo de 20 minutos antes de las 3:00 p.m.",
              "Error 3 — Olvidar el control de estímulos: si te encuentras despierto dentro de tu ventana restringida, no te quedes ahí intentando forzarlo. La restricción del sueño debe combinarse siempre con el control de estímulos — si estás claramente despierto, levántate.",
            ],
          },
          {
            heading: "Errores 4–5",
            paras: [
              "Error 4 — Ampliar el tiempo en cama demasiado rápido: añadir una hora a tu horario tras una sola buena noche puede fracturar tu sueño de inmediato. Aumenta el tiempo en cama solo en incrementos de 15 minutos tras mantener una eficiencia semanal superior al 85%.",
              "Error 5 — Vigilancia del reloj: mirar el despertador para comprobar si cumples tu ventana a la perfección dispara la adrenalina. Pon tus alarmas, gira la esfera del reloj hacia la pared y confía en la estructura conductual.",
            ],
          },
        ],
        actionStepTitle: "Paso de acción",
        actionStep:
          "Revisa tus entradas de los últimos días. ¿Se ha colado alguno de estos errores comunes en tu rutina? Elige solo un área vulnerable y escribe un plan claro y amable para protegerte de ella esta semana.",
        reflectionTitle: "Reflexión",
        reflection:
          "¿Cuál de estos errores te resulta más tentador en tu vida diaria? ¿Por qué te resulta reconfortante ese hábito concreto y cómo podemos apoyarte para cambiarlo?",
        faqs: [
          {
            q: "¿Qué debo hacer si me siento demasiado agotado para conducir con seguridad?",
            a: "La seguridad diaria es siempre tu prioridad absoluta. Si la fatiga diurna compromete tu seguridad al conducir o manejar maquinaria, amplía inmediatamente tu ventana de sueño en 30 minutos y céntrate en estabilizarte.",
          },
          {
            q: "¿Y si sigo mi ventana a la perfección pero sigo despertándome a mitad de la noche?",
            a: "No te asustes. Es habitual en la fase inicial de la terapia. Sal de la cama, aplica tus herramientas de control de estímulos y deja que tu presión de sueño en aumento te guíe de vuelta de forma natural.",
          },
        ],
        ctaLabel: "Conectar con la comunidad Somna",
        seoTitle: "Errores comunes durante la restricción del sueño | Somna CBT-I",
        seoDescription:
          "Evita los cinco errores más comunes de la Restricción del Sueño — comprimir en exceso, siestas, omitir el control de estímulos, ampliar demasiado rápido y vigilar el reloj.",
        keywords: [
          "errores restricción del sueño",
          "errores CBT-I",
          "consejos restricción del sueño",
          "trampas terapia insomnio",
          "compresión del sueño",
        ],
      },
    },
  },
];
