// Week 1 — Sleep Foundations (Lessons 1-3)
// Source: "18 CBT-I Program.docx"
import type { LessonContent } from "../program-lessons";

export const week1Lessons: LessonContent[] = [
  // ───────────────────────── Lesson 1: What Is Insomnia? ─────────────────────────
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
      en: {
        title: "What Is Insomnia?",
        eyebrow: "WEEK 1 · LESSON 1",
        subtitle: "Understand what insomnia really is — and why CBT-I is built to dismantle it.",
        difficulty: "Beginner",
        readingTime: "6 min read",
        content: [
          {
            heading: "More than a bad night",
            paras: [
              "Insomnia is so much more than just a bad night's sleep. It is a deeply frustrating experience where your body and mind feel out of sync, leaving you unable to fall asleep, stay asleep, or wake up feeling refreshed — even when you have given yourself plenty of time to rest.",
              "If this has been happening to you at least three times a week for three months or more, and it is beginning to cloud your days with fatigue, mood shifts, or brain fog, you are likely experiencing what professionals call chronic insomnia.",
            ],
          },
          {
            heading: "The 3P Model",
            paras: [
              'To understand why sleep became so difficult, we look at a highly validated scientific framework known as the "3P" Model:',
              "Predisposing Factors: Your baseline vulnerability — genetics, natural sensitivity to stress, or simply being a deep thinker.",
              "Precipitating Factors: The initial triggers — life events, intense stress, illness, or major transitions that originally disrupted your rest.",
              "Perpetuating Factors: The accidental loops — behaviors or anxious thoughts we adopt to cope with poor sleep (like staying in bed longer or worrying about the next day) that inadvertently keep the insomnia alive long after the initial trigger has faded.",
            ],
          },
          {
            heading: "The good news",
            paras: [
              "Cognitive Behavioral Therapy for Insomnia (CBT-I) does not just mask your symptoms like a temporary sleeping pill. It is specifically designed to dismantle those perpetuating factors, helping you rewrite your relationship with sleep from the ground up.",
            ],
          },
        ],
        actionStepTitle: "Action Step",
        actionStep:
          "This week, we begin with gentle awareness. Download or print your Somna Sleep Diary. Every morning, spend just two minutes recording your night: when you turned off the lights, about how long it took to drift off, any wakeful moments, and your final wake time. Change absolutely nothing about your routine yet — simply observe with kindness and curiosity.",
        reflectionTitle: "Reflection",
        reflection:
          "Open your diary and look closely. What subtle patterns are hidden in your week? Are there certain days where your mind feels louder or your body feels more restless? Begin to notice these connections without judgment.",
        faqs: [
          {
            q: "How do I know if I have insomnia or just occasional poor sleep?",
            a: "Occasional restless nights happen to everyone. Insomnia is when these difficulties show up at least 3 times a week for 3 months or longer, significantly impacting your energy, focus, and emotional well-being during the day.",
          },
          {
            q: "Can insomnia really be resolved without medication?",
            a: "Absolutely. Clinical research shows that CBT-I is the gold-standard, first-line approach for chronic insomnia, helping 70–80% of individuals reclaim their natural sleep rhythms sustainably.",
          },
        ],
        ctaLabel: "Download Your Free Sleep Diary",
        seoTitle: "What Is Insomnia? The 3P Model Explained | Somna CBT-I",
        seoDescription:
          "Understand what insomnia really is through the science-backed 3P Model, and learn why CBT-I dismantles the patterns that keep insomnia alive.",
        keywords: [
          "what is insomnia",
          "3P model insomnia",
          "chronic insomnia",
          "CBT-I insomnia",
          "insomnia definition",
        ],
      },
      zh: {
        title: "什么是失眠?",
        eyebrow: "第1周 · 第1课",
        subtitle: "理解失眠的真正含义,以及为什么 CBT-I 专门用来化解它。",
        difficulty: "入门",
        readingTime: "6 分钟阅读",
        content: [
          {
            heading: "不只是糟糕的一晚",
            paras: [
              "失眠远不止是偶尔睡得不好。它是一种令人深感挫败的体验——身心仿佛失去了同步,即使你给了自己充足的休息时间,却依然难以入睡、难以维持睡眠,或醒来后毫无清爽之感。",
              "如果这种情况每周出现至少三次、持续三个月以上,并开始让白天蒙上疲惫、情绪波动或脑雾的阴影,你很可能正在经历专业上所说的慢性失眠。",
            ],
          },
          {
            heading: "3P 模型",
            paras: [
              "要理解睡眠为何变得如此困难,我们可以借助一个经过充分验证的科学框架——「3P 模型」:",
              "易感因素(Predisposing):你的基础脆弱性——基因、对压力的天然敏感,或仅仅因为你是一个深思型的人。",
              "诱发因素(Precipitating):最初的触发点——生活事件、强烈压力、疾病或重大转变,最初打乱了你的睡眠。",
              "维持因素(Perpetuating):无意中形成的循环——为了应对糟糕的睡眠而采取的行为或焦虑想法(例如赖床更久、担心第二天),在最初的诱因消退后,反而让失眠持续存在。",
            ],
          },
          {
            heading: "好消息",
            paras: [
              "失眠认知行为疗法(CBT-I)并不像安眠药那样只是暂时掩盖症状。它专门用来拆解那些维持因素,帮助你从根本上重建与睡眠的关系。",
            ],
          },
        ],
        actionStepTitle: "行动步骤",
        actionStep:
          "本周,我们从温柔的觉察开始。下载或打印你的 Somna 睡眠日记。每天早晨只花两分钟记录昨夜:关灯时间、大约多久入睡、中途是否醒来、最终起床时间。暂时不要改变任何习惯——只是带着善意与好奇去观察。",
        reflectionTitle: "反思练习",
        reflection:
          "翻开你的日记仔细看看。这一周里藏着哪些细微的模式?是否有些日子思绪格外喧嚣,或身体格外不安?开始不带评判地留意这些联系。",
        faqs: [
          {
            q: "我怎么判断自己是失眠,还是偶尔睡不好?",
            a: "偶尔的辗转反侧人人都有。失眠是指这些困难每周出现至少 3 次、持续 3 个月以上,并明显影响白天的精力、专注力和情绪状态。",
          },
          {
            q: "失眠真的可以不吃药就改善吗?",
            a: "完全可以。临床研究表明,CBT-I 是慢性失眠的金标准一线疗法,能帮助 70–80% 的人可持续地找回自然的睡眠节律。",
          },
        ],
        ctaLabel: "下载免费睡眠日记",
        seoTitle: "什么是失眠?3P 模型详解｜Somna CBT-I",
        seoDescription:
          "通过科学验证的 3P 模型理解失眠的真正含义,了解 CBT-I 如何拆解让失眠持续的模式。",
        keywords: ["什么是失眠", "失眠 3P 模型", "慢性失眠", "CBT-I 失眠", "失眠定义"],
      },
      es: {
        title: "¿Qué es el insomnio?",
        eyebrow: "SEMANA 1 · LECCIÓN 1",
        subtitle:
          "Comprende qué es realmente el insomnio y por qué la CBT-I está diseñada para desmontarlo.",
        difficulty: "Inicial",
        readingTime: "6 min de lectura",
        content: [
          {
            heading: "Más que una mala noche",
            paras: [
              "El insomnio es mucho más que una simple mala noche. Es una experiencia profundamente frustrante en la que tu cuerpo y tu mente se sienten desincronizados: no logras dormirte, mantener el sueño o despertar renovado, incluso cuando te has dado tiempo suficiente para descansar.",
              "Si esto te ocurre al menos tres veces por semana durante tres meses o más, y empieza a nublar tus días con fatiga, cambios de humor o niebla mental, probablemente estás experimentando lo que los profesionales llaman insomnio crónico.",
            ],
          },
          {
            heading: "El Modelo de las 3 P",
            paras: [
              'Para entender por qué el sueño se volvió tan difícil, recurrimos a un marco científico muy validado conocido como el Modelo de las "3 P":',
              "Factores predisponentes: tu vulnerabilidad de base — genética, sensibilidad natural al estrés o simplemente ser una persona reflexiva.",
              "Factores precipitantes: los detonantes iniciales — eventos de vida, estrés intenso, enfermedad o grandes transiciones que alteraron tu descanso al principio.",
              "Factores perpetuantes: los bucles accidentales — conductas o pensamientos ansiosos que adoptamos para lidiar con el mal dormir (como quedarnos más tiempo en la cama o preocuparnos por el día siguiente) que mantienen vivo el insomnio mucho después de que el detonante inicial desapareció.",
            ],
          },
          {
            heading: "La buena noticia",
            paras: [
              "La Terapia Cognitivo-Conductual para el Insomnio (CBT-I) no se limita a enmascarar los síntomas como una pastilla temporal. Está diseñada específicamente para desmontar esos factores perpetuantes y ayudarte a reescribir tu relación con el sueño desde la raíz.",
            ],
          },
        ],
        actionStepTitle: "Paso de acción",
        actionStep:
          "Esta semana empezamos con una conciencia amable. Descarga o imprime tu Diario de Sueño de Somna. Cada mañana dedica solo dos minutos a registrar tu noche: cuándo apagaste la luz, cuánto tardaste en dormirte, los despertares y tu hora final de levantarte. No cambies nada de tu rutina todavía: simplemente observa con curiosidad y amabilidad.",
        reflectionTitle: "Reflexión",
        reflection:
          "Abre tu diario y míralo de cerca. ¿Qué patrones sutiles se esconden en tu semana? ¿Hay días en que tu mente se siente más ruidosa o tu cuerpo más inquieto? Empieza a notar estas conexiones sin juzgarlas.",
        faqs: [
          {
            q: "¿Cómo sé si tengo insomnio o solo malas noches ocasionales?",
            a: "Las noches inquietas ocasionales le pasan a todo el mundo. El insomnio se da cuando estas dificultades aparecen al menos 3 veces por semana durante 3 meses o más, afectando significativamente tu energía, concentración y bienestar emocional durante el día.",
          },
          {
            q: "¿De verdad puede resolverse el insomnio sin medicación?",
            a: "Por supuesto. La investigación clínica muestra que la CBT-I es el enfoque de primera línea y estándar de oro para el insomnio crónico, ayudando al 70–80% de las personas a recuperar de forma sostenible sus ritmos naturales de sueño.",
          },
        ],
        ctaLabel: "Descarga tu diario de sueño gratuito",
        seoTitle: "¿Qué es el insomnio? El Modelo de las 3 P explicado | Somna CBT-I",
        seoDescription:
          "Comprende qué es realmente el insomnio mediante el Modelo de las 3 P respaldado por la ciencia y por qué la CBT-I desmonta los patrones que lo mantienen.",
        keywords: [
          "qué es el insomnio",
          "modelo 3P insomnio",
          "insomnio crónico",
          "CBT-I insomnio",
          "definición de insomnio",
        ],
      },
      pt: {
        title: "O que é insônia?",
        eyebrow: "SEMANA 1 · LIÇÃO 1",
        subtitle:
          "Entenda o que a insônia realmente é — e por que a TCC-I foi criada para desmontá-la.",
        difficulty: "Iniciante",
        readingTime: "6 min de leitura",
        content: [
          {
            heading: "Muito mais do que uma noite ruim",
            paras: [
              "A insônia é bem mais do que uma simples noite mal dormida. É uma experiência profundamente frustrante em que corpo e mente parecem fora de sincronia: você não consegue pegar no sono, manter o sono ou acordar descansado — mesmo quando se deu tempo suficiente para descansar.",
              "Se isso vem acontecendo pelo menos três vezes por semana, há três meses ou mais, e começa a nublar seus dias com cansaço, mudanças de humor ou neblina mental, você provavelmente está vivendo o que os profissionais chamam de insônia crônica.",
            ],
          },
          {
            heading: "O Modelo das 3 P",
            paras: [
              'Para entender por que o sono ficou tão difícil, recorremos a um arcabouço científico bastante validado, conhecido como "Modelo das 3 P":',
              "Fatores predisponentes: sua vulnerabilidade de base — genética, sensibilidade natural ao estresse ou simplesmente ser uma pessoa que pensa demais.",
              "Fatores precipitantes: os gatilhos iniciais — eventos de vida, estresse intenso, doença ou grandes transições que originalmente atrapalharam seu descanso.",
              "Fatores perpetuantes: os ciclos acidentais — comportamentos ou pensamentos ansiosos que adotamos para lidar com o mau sono (como ficar mais tempo na cama ou se preocupar com o dia seguinte) e que acabam mantendo a insônia viva muito tempo depois de o gatilho inicial ter desaparecido.",
            ],
          },
          {
            heading: "A boa notícia",
            paras: [
              "A Terapia Cognitivo-Comportamental para Insônia (TCC-I) não apenas mascara os sintomas como um remédio para dormir temporário. Ela é desenhada especificamente para desmontar esses fatores perpetuantes, ajudando você a reescrever sua relação com o sono desde a raiz.",
            ],
          },
        ],
        actionStepTitle: "Passo de ação",
        actionStep:
          "Esta semana, começamos com uma escuta amável. Baixe ou imprima seu Diário do Sono do somna. Toda manhã, gaste apenas dois minutos registrando a noite: quando apagou a luz, mais ou menos quanto tempo levou para pegar no sono, despertares no meio da noite e o horário final de levantar. Não mude absolutamente nada na sua rotina ainda — apenas observe com gentileza e curiosidade.",
        reflectionTitle: "Reflexão",
        reflection:
          "Abra seu diário e olhe com atenção. Quais padrões sutis estão escondidos na sua semana? Existem dias em que a mente parece mais barulhenta ou o corpo mais inquieto? Comece a notar essas conexões sem julgamento.",
        faqs: [
          {
            q: "Como sei se tenho insônia ou apenas noites ruins de vez em quando?",
            a: "Noites inquietas de vez em quando acontecem com todo mundo. A insônia acontece quando essas dificuldades aparecem pelo menos 3 vezes por semana durante 3 meses ou mais, afetando de forma significativa sua energia, concentração e bem-estar emocional durante o dia.",
          },
          {
            q: "A insônia realmente pode ser resolvida sem medicação?",
            a: "Com certeza. A pesquisa clínica mostra que a TCC-I é a abordagem de primeira linha e padrão-ouro para a insônia crônica, ajudando de 70 a 80% das pessoas a recuperar de forma sustentável seus ritmos naturais de sono.",
          },
        ],
        ctaLabel: "Baixe seu diário do sono gratuito",
        seoTitle: "O que é insônia? O Modelo das 3 P explicado | Somna TCC-I",
        seoDescription:
          "Entenda o que a insônia realmente é por meio do Modelo das 3 P, respaldado pela ciência, e por que a TCC-I desmonta os padrões que mantêm a insônia viva.",
        keywords: [
          "o que é insônia",
          "modelo 3P insônia",
          "insônia crônica",
          "TCC-I insônia",
          "definição de insônia",
        ],
      },
    },
  },

  // ───────────────────────── Lesson 2: How Sleep Works ─────────────────────────
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
      en: {
        title: "How Sleep Works",
        eyebrow: "WEEK 1 · LESSON 2",
        subtitle: "The inner rhythms — sleep cycles, circadian timing, and sleep drive.",
        difficulty: "Beginner",
        readingTime: "6 min read",
        content: [
          {
            heading: "An active, orchestrated dance",
            paras: [
              "Sleep is far from a passive state of unconsciousness. It is a highly active, beautifully orchestrated dance designed to restore your physical body, organize your memories, and clear out emotional clutter.",
              "Every night, your brain moves through structural cycles lasting roughly 90 minutes. Within each cycle, you journey through two distinct realms: NREM sleep (light sleep in stages N1 and N2, and deep slow-wave sleep in N3 that repairs your immune system and tissues) and REM sleep (the canvas for dreaming, vital for processing emotions and cementing what you learned).",
            ],
          },
          {
            heading: "Two internal forces",
            paras: [
              "Your sleep timing is governed by the alignment of two internal forces:",
              "The Circadian Rhythm: your biological 24-hour clock, ticking gently in your brain, responding to light and dark to signal alertness by day and sleepiness by night.",
              "The Sleep Drive: homeostatic sleep pressure — think of it as an internal hourglass. The longer you stay awake, the more pressure builds, demanding to be emptied at night.",
              "High Sleep Drive + Circadian Night Signal = Effortless Sleep.",
            ],
          },
          {
            heading: "When the machinery gets hijacked",
            paras: [
              'When you experience insomnia, this natural machinery gets hijacked by hyperarousal — a state of biological and mental alertness driven by anxiety. Even when your sleep drive is bursting, your nervous system\'s "alert" signal overrides it. CBT-I works beautifully because its core techniques are designed to strengthen your natural sleep drive and realign your internal clock.',
            ],
          },
        ],
        actionStepTitle: "Action Step",
        actionStep:
          "To help stabilize your circadian rhythm, pick a realistic wake-up time that works for your life. Commit to waking up at this exact time every single day this week — yes, even on weekends. Exposure to morning sunlight within 30 minutes of waking will anchor your clock perfectly.",
        reflectionTitle: "Reflection",
        reflection:
          "How does it feel to look at sleep as a biological system rather than a nightly test you are failing? Can you pinpoint moments where your daily habits might be confusing your internal clock?",
        faqs: [
          {
            q: "Is it true that everyone needs exactly 8 hours of sleep?",
            a: "No, this is a rigid myth. Sleep needs are highly individual. While the general adult average is 7–9 hours, some individuals thrive on 6, and others truly need 9. Focus on the quality and consistency of your rest, not an arbitrary number.",
          },
          {
            q: "Why do I wake up consistently in the middle of the night?",
            a: "Brief awakenings between 90-minute sleep cycles are completely natural. Healthy sleepers stir, adjust their pillows, and drift right back off without remembering it. The issue isn't the waking — it's the sudden wave of frustration or anxiety that keeps you from drifting back down.",
          },
        ],
        ctaLabel: "Explore My Sleep Rhythms",
        seoTitle: "How Sleep Works: Cycles, Circadian Rhythm & Sleep Drive | Somna",
        seoDescription:
          "Learn how 90-minute sleep cycles, your circadian rhythm, and sleep drive combine to create effortless sleep — and how CBT-I realigns them.",
        keywords: [
          "how sleep works",
          "sleep cycles",
          "circadian rhythm",
          "sleep drive",
          "NREM REM sleep",
        ],
      },
      zh: {
        title: "睡眠是如何运作的",
        eyebrow: "第1周 · 第2课",
        subtitle: "内在节律——睡眠周期、昼夜节律与睡眠驱动力。",
        difficulty: "入门",
        readingTime: "6 分钟阅读",
        content: [
          {
            heading: "一场主动而精妙的舞蹈",
            paras: [
              "睡眠绝非被动的无意识状态。它是一场高度活跃、精心编排的舞蹈,旨在修复你的身体、整理记忆、清理情绪负担。",
              "每晚,大脑都会经历约 90 分钟为一个周期的结构性循环。每个周期内,你会穿越两个领域:NREM 睡眠(包括 N1、N2 的浅睡,以及 N3 的深度慢波睡眠——修复免疫系统和组织)和 REM 睡眠(梦境的画布,对处理情绪和巩固所学至关重要)。",
            ],
          },
          {
            heading: "两股内在力量",
            paras: [
              "你的睡眠时机由两股内在力量的协同决定:",
              "昼夜节律:大脑中轻柔跳动的 24 小时生物钟,响应光暗变化,白天发出警觉信号,夜晚发出困倦信号。",
              "睡眠驱动力:稳态睡眠压力——可以想象成一个内在沙漏。清醒越久,压力累积越多,夜晚需要释放。",
              "高睡眠驱动力 + 昼夜节律的夜间信号 = 毫不费力的睡眠。",
            ],
          },
          {
            heading: "当机制被劫持",
            paras: [
              "当你失眠时,这套天然机制会被「过度觉醒」劫持——一种由焦虑驱动的身心警觉状态。即使睡眠驱动力已满,神经系统的「警觉」信号仍会压过它。CBT-I 之所以有效,正是因为它的核心技巧旨在强化你天然的睡眠驱动力,并重新校准内在时钟。",
            ],
          },
        ],
        actionStepTitle: "行动步骤",
        actionStep:
          "为了稳定昼夜节律,选择一个适合你生活的现实起床时间。本周每天(是的,包括周末)都在同一时间起床。醒来后 30 分钟内接触晨光,能完美锚定你的生物钟。",
        reflectionTitle: "反思练习",
        reflection:
          "把睡眠看作一个生物系统,而不是你每晚都在失败的考试,这种感觉如何?你能指出日常习惯中哪些时刻可能在扰乱你的内在时钟吗?",
        faqs: [
          {
            q: "每个人真的都需要正好 8 小时睡眠吗?",
            a: "并非如此,这是一个僵化的迷思。睡眠需求因人而异。成年人平均需要 7–9 小时,但有些人 6 小时就精力充沛,另一些人确实需要 9 小时。关注睡眠的质量与稳定性,而非一个武断的数字。",
          },
          {
            q: "为什么我总是在半夜醒来?",
            a: "在 90 分钟睡眠周期之间短暂醒来是完全自然的。健康睡眠者会翻身、调整枕头,然后毫无记忆地再次入睡。问题不在于醒来,而在于随之而来的挫败或焦虑浪潮,让你无法再次沉入睡眠。",
          },
        ],
        ctaLabel: "探索我的睡眠节律",
        seoTitle: "睡眠如何运作:周期、昼夜节律与睡眠驱动力｜Somna",
        seoDescription:
          "了解 90 分钟睡眠周期、昼夜节律与睡眠驱动力如何共同创造毫不费力的睡眠,以及 CBT-I 如何重新校准它们。",
        keywords: ["睡眠如何运作", "睡眠周期", "昼夜节律", "睡眠驱动力", "NREM REM 睡眠"],
      },
      es: {
        title: "Cómo funciona el sueño",
        eyebrow: "SEMANA 1 · LECCIÓN 2",
        subtitle: "Los ritmos internos — ciclos de sueño, ritmo circadiano y presión del sueño.",
        difficulty: "Inicial",
        readingTime: "6 min de lectura",
        content: [
          {
            heading: "Una danza activa y orquestada",
            paras: [
              "El sueño está lejos de ser un estado pasivo de inconsciencia. Es una danza altamente activa y bellamente orquestada, diseñada para restaurar tu cuerpo, organizar tus recuerdos y limpiar el desorden emocional.",
              "Cada noche, tu cerebro recorre ciclos estructurales de unos 90 minutos. En cada ciclo viajas por dos reinos distintos: el sueño NREM (sueño ligero en las fases N1 y N2, y sueño profundo de ondas lentas en N3 que repara tu sistema inmunitario y tus tejidos) y el sueño REM (el lienzo de los sueños, vital para procesar emociones y consolidar lo aprendido).",
            ],
          },
          {
            heading: "Dos fuerzas internas",
            paras: [
              "El momento de tu sueño se rige por la alineación de dos fuerzas internas:",
              "El ritmo circadiano: tu reloj biológico de 24 horas, que late suavemente en tu cerebro y responde a la luz y la oscuridad para señalar alerta de día y sueño de noche.",
              "La presión del sueño: presión homeostática — imagínala como un reloj de arena interno. Cuanto más tiempo permaneces despierto, más presión se acumula y pide ser vaciada por la noche.",
              "Alta presión del sueño + señal circadiana nocturna = sueño sin esfuerzo.",
            ],
          },
          {
            heading: "Cuando la maquinaria es secuestrada",
            paras: [
              'Cuando sufres insomnio, esta maquinaria natural es secuestrada por la hiperactivación — un estado de alerta biológica y mental impulsado por la ansiedad. Aunque tu presión de sueño esté al máximo, la señal de "alerta" de tu sistema nervioso la anula. La CBT-I funciona maravillosamente porque sus técnicas centrales están diseñadas para fortalecer tu presión natural de sueño y realinear tu reloj interno.',
            ],
          },
        ],
        actionStepTitle: "Paso de acción",
        actionStep:
          "Para estabilizar tu ritmo circadiano, elige una hora realista de despertar que encaje con tu vida. Comprométete a levantarte a esa misma hora todos los días esta semana — sí, también los fines de semana. La luz solar matinal dentro de los primeros 30 minutos anclará tu reloj a la perfección.",
        reflectionTitle: "Reflexión",
        reflection:
          "¿Cómo se siente ver el sueño como un sistema biológico en lugar de un examen nocturno que estás suspendiendo? ¿Puedes identificar momentos en que tus hábitos diarios podrían estar confundiendo tu reloj interno?",
        faqs: [
          {
            q: "¿Es cierto que todo el mundo necesita exactamente 8 horas de sueño?",
            a: "No, es un mito rígido. Las necesidades de sueño son muy individuales. Aunque la media adulta general es de 7–9 horas, algunas personas rinden con 6 y otras necesitan de verdad 9. Céntrate en la calidad y la constancia de tu descanso, no en un número arbitrario.",
          },
          {
            q: "¿Por qué me despierto siempre a mitad de la noche?",
            a: "Los despertares breves entre los ciclos de 90 minutos son completamente naturales. Los dormidores sanos se mueven, ajustan la almohada y vuelven a dormirse sin recordarlo. El problema no es despertarse, sino la oleada de frustración o ansiedad que impide volver a dormir.",
          },
        ],
        ctaLabel: "Explorar mis ritmos de sueño",
        seoTitle: "Cómo funciona el sueño: ciclos, ritmo circadiano y presión del sueño | Somna",
        seoDescription:
          "Aprende cómo los ciclos de 90 minutos, el ritmo circadiano y la presión del sueño se combinan para crear un sueño sin esfuerzo — y cómo la CBT-I los realinea.",
        keywords: [
          "cómo funciona el sueño",
          "ciclos de sueño",
          "ritmo circadiano",
          "presión del sueño",
          "sueño NREM REM",
        ],
      },
      pt: {
        title: "Como funciona o sono",
        eyebrow: "SEMANA 1 · LIÇÃO 2",
        subtitle: "Os ritmos internos — ciclos de sono, ritmo circadiano e pressão do sono.",
        difficulty: "Iniciante",
        readingTime: "6 min de leitura",
        content: [
          {
            heading: "Uma dança ativa e orquestrada",
            paras: [
              "O sono está longe de ser um estado passivo de inconsciência. É uma dança altamente ativa e lindamente orquestrada, desenhada para restaurar seu corpo, organizar suas memórias e limpar a bagunça emocional.",
              "Toda noite, seu cérebro percorre ciclos estruturais de cerca de 90 minutos. Em cada ciclo, você viaja por dois reinos distintos: o sono NREM (sono leve nas fases N1 e N2, e sono profundo de ondas lentas na fase N3, que repara seu sistema imunológico e seus tecidos) e o sono REM (a tela dos sonhos, vital para processar emoções e consolidar o que você aprendeu).",
            ],
          },
          {
            heading: "Duas forças internas",
            paras: [
              "O momento do seu sono é governado pelo alinhamento de duas forças internas:",
              "O ritmo circadiano: seu relógio biológico de 24 horas, que bate suavemente no seu cérebro e responde à luz e à escuridão para sinalizar alerta de dia e sono à noite.",
              "A pressão do sono: pressão homeostática — imagine uma ampulheta interna. Quanto mais tempo você fica acordado, mais pressão se acumula, pedindo para ser esvaziada à noite.",
              "Pressão do sono alta + sinal circadiano noturno = sono sem esforço.",
            ],
          },
          {
            heading: "Quando a engrenagem é sequestrada",
            paras: [
              'Quando você sofre com insônia, essa engrenagem natural é sequestrada pela hiperativação — um estado de alerta biológico e mental movido pela ansiedade. Mesmo quando sua pressão de sono está no talo, o sinal de "alerta" do seu sistema nervoso a sobrepõe. A TCC-I funciona tão bem porque suas técnicas centrais são desenhadas para fortalecer sua pressão natural de sono e realinhar seu relógio interno.',
            ],
          },
        ],
        actionStepTitle: "Passo de ação",
        actionStep:
          "Para estabilizar seu ritmo circadiano, escolha um horário realista para acordar que funcione na sua vida. Comprometa-se a acordar nesse horário exato todos os dias nesta semana — sim, inclusive nos fins de semana. A exposição à luz do sol pela manhã, dentro dos primeiros 30 minutos após acordar, vai ancorar seu relógio perfeitamente.",
        reflectionTitle: "Reflexão",
        reflection:
          "Como é olhar para o sono como um sistema biológico em vez de uma prova noturna que você está reprovando? Você consegue identificar momentos em que seus hábitos do dia podem estar confundindo seu relógio interno?",
        faqs: [
          {
            q: "É verdade que todo mundo precisa de exatamente 8 horas de sono?",
            a: "Não, esse é um mito rígido. As necessidades de sono são bem individuais. Embora a média adulta fique entre 7 e 9 horas, algumas pessoas se saem bem com 6, e outras realmente precisam de 9. Foque na qualidade e na constância do seu descanso, não em um número arbitrário.",
          },
          {
            q: "Por que eu sempre acordo no meio da noite?",
            a: "Despertares breves entre os ciclos de 90 minutos de sono são totalmente naturais. Pessoas que dormem bem se mexem, ajustam o travesseiro e voltam a dormir sem lembrar. O problema não é acordar, e sim a onda repentina de frustração ou ansiedade que impede você de voltar a dormir.",
          },
        ],
        ctaLabel: "Explorar meus ritmos de sono",
        seoTitle: "Como funciona o sono: ciclos, ritmo circadiano e pressão do sono | Somna",
        seoDescription:
          "Aprenda como os ciclos de 90 minutos, o ritmo circadiano e a pressão do sono se combinam para criar um sono sem esforço — e como a TCC-I os realinha.",
        keywords: [
          "como funciona o sono",
          "ciclos de sono",
          "ritmo circadiano",
          "pressão do sono",
          "sono NREM REM",
        ],
      },
    },
  },

  // ───────────────────────── Lesson 3: Why Trying Harder Makes Sleep Worse ─────────────────────────
  {
    slug: "trying-harder-makes-sleep-worse",
    weekNumber: 1,
    weekSlug: "week-1",
    lessonNumber: 3,
    estimatedMinutes: 5,
    relatedLessonSlugs: ["what-is-insomnia", "how-sleep-works", "bed-sleep-association"],
    i18n: {
      en: {
        title: "Why Trying Harder to Sleep Makes Sleep Worse",
        eyebrow: "WEEK 1 · LESSON 3",
        subtitle: "The paradox of sleep effort — and how to step out of the loop.",
        difficulty: "Beginner",
        readingTime: "5 min read",
        content: [
          {
            heading: "The paradox of effort",
            paras: [
              "One of the most profound truths of sleep science is entirely paradoxical: the harder you try to sleep, the further it slips away. This psychological trap is known as sleep performance anxiety.",
              'When rest becomes elusive, your natural instinct is to fight for it. You might go to bed exceptionally early to "catch" sleep, lie perfectly still forcing your eyes shut, or command your brain to "just stop thinking."',
              "Unfortunately, sleep is a biological function governed by surrender, not effort. The moment you treat sleep as a goal to achieve, your brain perceives the effort as a high-stakes task. It releases cortisol and adrenaline, triggering a state of hyperarousal.",
            ],
          },
          {
            heading: "The painful loop",
            paras: [
              "This creates a painful loop: you experience difficulty sleeping → you exert more effort → your nervous system activates → sleep becomes completely impossible.",
              "Over time, this loop conditions your brain to view your bed not as a sanctuary of rest, but as a zone of frustration and danger. CBT-I breaks this conditioning by removing the pressure of effort. We teach you to stop forcing sleep and instead create the gentle, inviting conditions that allow it to happen naturally.",
            ],
          },
        ],
        actionStepTitle: "Action Step",
        actionStep:
          "This week, we practice the art of letting go. If you are lying in bed awake, feeling your frustration mount, do not stay there and fight. Gently step out of bed, move to a dimly lit room, and do something peaceful — read an engaging book, listen to an ambient podcast, or sketch. Return to your bed only when your eyelids feel heavy and authentic drowsiness washes over you.",
        reflectionTitle: "Reflection",
        reflection:
          'Can you identify the specific ways you have been "working hard" to sleep lately? What would it feel like to completely resign from the job of forcing your rest tonight?',
        faqs: [
          {
            q: "If I get out of bed when I can't sleep, won't I lose even more rest?",
            a: "In the short term, you might lose a little time in bed. But in the long run, staying in bed while frustrated only reinforces the brain's association between your bed and wakefulness. Leaving the bed is an investment in breaking that barrier permanently.",
          },
          {
            q: "What if I cannot stop thinking about my sleep anxiety?",
            a: "This is precisely where cognitive reframing comes in. Instead of trying to force your thoughts to stop, we learn to change our perspective on those thoughts, stripping away the emotional power that keeps your body awake.",
          },
        ],
        ctaLabel: "Ready to Step Out of the Loop?",
        seoTitle: "Why Trying Harder to Sleep Makes It Worse | Somna CBT-I",
        seoDescription:
          "Discover the paradox of sleep performance anxiety — why forcing sleep backfires — and how CBT-I helps you step out of the effort loop.",
        keywords: [
          "sleep performance anxiety",
          "trying to sleep",
          "sleep effort paradox",
          "CBT-I sleep",
          "can't sleep",
        ],
      },
      zh: {
        title: "为什么越努力想睡,反而越睡不着",
        eyebrow: "第1周 · 第3课",
        subtitle: "睡眠努力的悖论——以及如何走出这个循环。",
        difficulty: "入门",
        readingTime: "5 分钟阅读",
        content: [
          {
            heading: "努力的悖论",
            paras: [
              "睡眠科学中最深刻的真相之一,完全是个悖论:你越努力想睡,睡眠就离你越远。这种心理陷阱被称为「睡眠表现焦虑」。",
              "当睡眠变得难以捉摸,你的本能是去争取。你可能会为了「抓住」睡眠而很早上床,一动不动地强迫闭眼,或命令大脑「别再想了」。",
              "然而,睡眠是一种由「放下」而非「努力」主导的生理功能。当你把睡眠当作一个要去达成的目标,大脑会把这种努力视为高风险任务,释放皮质醇和肾上腺素,触发过度觉醒状态。",
            ],
          },
          {
            heading: "痛苦的循环",
            paras: [
              "这会形成一个痛苦的循环:睡眠困难 → 你更努力 → 神经系统被激活 → 睡眠变得完全不可能。",
              "久而久之,这个循环会让大脑把床视为挫败与危险的区域,而非休息的圣殿。CBT-I 通过移除努力的压力来打破这种条件反射。我们教你停止强迫睡眠,转而创造温柔、诱人的条件,让睡眠自然降临。",
            ],
          },
        ],
        actionStepTitle: "行动步骤",
        actionStep:
          "本周,我们练习「放下」的艺术。如果你躺在床上清醒着、挫败感不断攀升,不要留在那里硬撑。温柔地起身,走到一个昏暗的房间,做些平静的事——读一本引人入胜的书、听一段环境音播客,或画画。只有当眼皮沉重、真正的困倦袭来时,再回到床上。",
        reflectionTitle: "反思练习",
        reflection:
          "你能识别出最近自己「努力想睡」的具体方式吗?如果今晚彻底辞去「强迫入睡」这份工作,会是什么感觉?",
        faqs: [
          {
            q: "睡不着时下床,不是会损失更多休息吗?",
            a: "短期内,你可能会少待一会儿床。但长远来看,带着挫败感赖床只会强化大脑把床和清醒联系在一起。离开床是对永久打破这道障碍的投资。",
          },
          {
            q: "如果我无法停止对睡眠焦虑的思考怎么办?",
            a: "这正是认知重建发挥作用的地方。我们不是强迫想法停止,而是学会改变对这些想法的看法,剥离让身体保持清醒的情绪力量。",
          },
        ],
        ctaLabel: "准备好走出循环了吗?",
        seoTitle: "为什么越努力想睡反而越睡不着｜Somna CBT-I",
        seoDescription:
          "了解睡眠表现焦虑的悖论——为什么强迫入睡会适得其反——以及 CBT-I 如何帮你走出努力循环。",
        keywords: ["睡眠表现焦虑", "努力想睡", "睡眠努力悖论", "CBT-I 睡眠", "睡不着"],
      },
      es: {
        title: "Por qué esforzarse más por dormir empeora el sueño",
        eyebrow: "SEMANA 1 · LECCIÓN 3",
        subtitle: "La paradoja del esfuerzo del sueño — y cómo salir del bucle.",
        difficulty: "Inicial",
        readingTime: "5 min de lectura",
        content: [
          {
            heading: "La paradoja del esfuerzo",
            paras: [
              "Una de las verdades más profundas de la ciencia del sueño es totalmente paradójica: cuanto más te esfuerzas por dormir, más se aleja el sueño. Esta trampa psicológica se conoce como ansiedad por rendimiento del sueño.",
              'Cuando el descanso se vuelve esquivo, tu instinto natural es luchar por él. Puede que te acuestes muy temprano para "cazar" el sueño, te quedes perfectamente quieto forzando el cierre de los ojos, o le ordenes a tu cerebro que "deje de pensar".',
              "Por desgracia, el sueño es una función biológica regida por la rendición, no por el esfuerzo. En el momento en que tratas el sueño como una meta a alcanzar, tu cerebro percibe el esfuerzo como una tarea de alto riesgo. Libera cortisol y adrenalina, desencadenando un estado de hiperactivación.",
            ],
          },
          {
            heading: "El bucle doloroso",
            paras: [
              "Esto crea un bucle doloroso: tienes dificultad para dormir → te esfuerzas más → se activa tu sistema nervioso → el sueño se vuelve completamente imposible.",
              "Con el tiempo, este bucle condiciona a tu cerebro a ver la cama no como un santuario de descanso, sino como una zona de frustración y peligro. La CBT-I rompe este condicionamiento eliminando la presión del esfuerzo. Te enseñamos a dejar de forzar el sueño y, en su lugar, a crear las condiciones suaves y acogedoras que permiten que ocurra de forma natural.",
            ],
          },
        ],
        actionStepTitle: "Paso de acción",
        actionStep:
          "Esta semana practicamos el arte de soltar. Si estás despierto en la cama y sientes que la frustración aumenta, no te quedes ahí luchando. Levántate con suavidad, ve a una habitación con luz tenue y haz algo tranquilo — lee un libro absorbente, escucha un pódcast ambiental o dibuja. Vuelve a la cama solo cuando tus párpados pesen y te invada una somnolencia auténtica.",
        reflectionTitle: "Reflexión",
        reflection:
          '¿Puedes identificar las formas concretas en que últimamente te has "esforzado" por dormir? ¿Cómo se sentiría renunciar por completo esta noche al trabajo de forzar tu descanso?',
        faqs: [
          {
            q: "Si me levanto cuando no puedo dormir, ¿no perderé aún más descanso?",
            a: "A corto plazo puede que pierdas un poco de tiempo en la cama. Pero a largo plazo, quedarse en la cama frustrado solo refuerza la asociación del cerebro entre la cama y el desvelo. Levantarse es una inversión para romper esa barrera de forma permanente.",
          },
          {
            q: "¿Y si no puedo dejar de pensar en mi ansiedad por el sueño?",
            a: "Justo aquí entra la reestructuración cognitiva. En lugar de intentar forzar a que los pensamientos se detengan, aprendemos a cambiar nuestra perspectiva sobre ellos, quitándoles el poder emocional que mantiene despierto a tu cuerpo.",
          },
        ],
        ctaLabel: "¿Listo para salir del bucle?",
        seoTitle: "Por qué esforzarse más por dormir empeora el sueño | Somna CBT-I",
        seoDescription:
          "Descubre la paradoja de la ansiedad por rendimiento del sueño — por qué forzar el sueño resulta contraproducente — y cómo la CBT-I te ayuda a salir del bucle de esfuerzo.",
        keywords: [
          "ansiedad por rendimiento del sueño",
          "esforzarse por dormir",
          "paradoja del esfuerzo del sueño",
          "CBT-I sueño",
          "no puedo dormir",
        ],
      },
      pt: {
        title: "Por que se esforçar demais para dormir piora o sono",
        eyebrow: "SEMANA 1 · LIÇÃO 3",
        subtitle: "O paradoxo do esforço pelo sono — e como sair desse ciclo.",
        difficulty: "Iniciante",
        readingTime: "5 min de leitura",
        content: [
          {
            heading: "O paradoxo do esforço",
            paras: [
              "Uma das verdades mais profundas da ciência do sono é totalmente paradoxal: quanto mais você se esforça para dormir, mais o sono se afasta. Essa armadilha psicológica é conhecida como ansiedade de desempenho do sono.",
              'Quando o descanso fica difícil, seu instinto natural é lutar por ele. Você pode deitar muito cedo para "caçar" o sono, ficar totalmente imóvel forçando os olhos a fechar, ou mandar seu cérebro "parar de pensar".',
              "O problema é que o sono é uma função biológica regida pelo soltar, e não pelo esforço. No momento em que você trata o sono como uma meta a ser conquistada, seu cérebro interpreta o esforço como uma tarefa de alto risco. Ele libera cortisol e adrenalina, disparando um estado de hiperativação.",
            ],
          },
          {
            heading: "O ciclo doloroso",
            paras: [
              "Isso cria um ciclo doloroso: você tem dificuldade para dormir → se esforça mais → o sistema nervoso ativa → o sono se torna totalmente impossível.",
              "Com o tempo, esse ciclo condiciona seu cérebro a enxergar a cama não como um santuário de descanso, mas como uma zona de frustração e perigo. A TCC-I rompe esse condicionamento ao retirar a pressão do esforço. Ensina você a parar de forçar o sono e, no lugar, a criar as condições gentis e acolhedoras que permitem que ele aconteça de forma natural.",
            ],
          },
        ],
        actionStepTitle: "Passo de ação",
        actionStep:
          "Esta semana, praticamos a arte de soltar. Se você estiver acordado na cama, sentindo a frustração subir, não fique aí lutando. Levante com calma, vá para um cômodo com luz baixa e faça algo tranquilo — leia um livro que prende a atenção, ouça um podcast ambiente ou desenhe. Volte para a cama só quando suas pálpebras pesarem e uma sonolência de verdade te invadir.",
        reflectionTitle: "Reflexão",
        reflection:
          'Você consegue identificar as formas concretas pelas quais tem se "esforçado demais" para dormir ultimamente? Como seria renunciar, esta noite, ao trabalho de forçar seu descanso?',
        faqs: [
          {
            q: "Se eu sair da cama quando não consigo dormir, não vou perder ainda mais descanso?",
            a: "A curto prazo, você pode perder um pouco de tempo na cama. Mas, a longo prazo, ficar na cama frustrado só reforça a associação do cérebro entre a cama e a vigília. Sair da cama é um investimento para romper essa barreira de forma permanente.",
          },
          {
            q: "E se eu não consigo parar de pensar na minha ansiedade com o sono?",
            a: "É justamente aí que entra a reformulação cognitiva. Em vez de tentar forçar os pensamentos a parar, aprendemos a mudar nossa perspectiva sobre eles, tirando o poder emocional que mantém seu corpo acordado.",
          },
        ],
        ctaLabel: "Pronto para sair do ciclo?",
        seoTitle: "Por que se esforçar demais para dormir piora o sono | Somna TCC-I",
        seoDescription:
          "Descubra o paradoxo da ansiedade de desempenho do sono — por que forçar o sono dá errado — e como a TCC-I ajuda você a sair do ciclo de esforço.",
        keywords: [
          "ansiedade de desempenho do sono",
          "esforço para dormir",
          "paradoxo do esforço do sono",
          "TCC-I sono",
          "não consigo dormir",
        ],
      },
    },
  },
];
