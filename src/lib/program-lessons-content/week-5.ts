// Week 5 — Cognitive Reframing (Lessons 13-15)
// Source: "18 CBT-I Program.docx"
import type { LessonContent } from "../program-lessons";

export const week5Lessons: LessonContent[] = [
  // ───────────────────────── Lesson 13: The Most Common Insomnia Thoughts ─────────────────────────
  {
    slug: "common-insomnia-thoughts",
    weekNumber: 5,
    weekSlug: "week-5",
    lessonNumber: 13,
    estimatedMinutes: 7,
    relatedLessonSlugs: [
      "cbti-changes-sleep-beliefs",
      "realistic-sleep-expectations",
      "racing-thoughts-at-night",
    ],
    i18n: {
      en: {
        title: "The Most Common Insomnia Thoughts",
        eyebrow: "WEEK 5 · LESSON 13",
        subtitle: "Four cognitive traps that fuel sleep anxiety — and how to spot them.",
        difficulty: "Intermediate",
        readingTime: "7 min read",
        content: [
          {
            heading: "Thoughts that keep you awake",
            paras: [
              "Insomnia doesn't just impact your body — it actively colors the way you think. When you struggle with long-term sleep issues, your brain naturally develops automatic, highly distorted thinking habits. These patterns seem entirely realistic at the time, but they generate intense anxiety that keeps you awake.",
            ],
          },
          {
            heading: "Four cognitive traps",
            paras: [
              "1. Catastrophizing (The Worst-Case Scenario): \"If I don't fall asleep in the next ten minutes, my presentation tomorrow will be an absolute disaster and I'll ruin my career.\" The reality: while poor sleep is deeply uncomfortable, you have likely navigated tough days on minimal rest before and gotten through them successfully.",
              '2. All-or-Nothing Thinking (The Binary Trap): "If I don\'t get 8 hours of pristine, uninterrupted sleep tonight, my entire day is a total failure." The reality: sleep is fluid. A night with brief awakenings or 6 solid hours can still provide meaningful restoration.',
              '3. Unfair Comparisons (The Isolation Illusion): "Everyone else in the world is sleeping effortlessly right now. There is something fundamentally broken in my biology." The reality: millions of people navigate sleep challenges every single night. You are not alone, and your body retains its natural ability to sleep.',
              '4. "Should" Statements (The Pressure Cooker): "I should be able to fall asleep naturally without any effort. My body should just work." The reality: placing rigid expectations on a natural biological process only creates frustration, pushing sleep further away.',
            ],
          },
          {
            heading: "Accurate, not positive",
            paras: [
              "Cognitive therapy within CBT-I isn't about forced positive thinking or pretending everything is perfect. It is about accurate, balanced thinking — stepping back from catastrophic stories so your nervous system can finally settle.",
            ],
          },
        ],
        actionStepTitle: "Action Step",
        actionStep:
          "This week, keep a Thought Diary right next to your daytime resting area. The moment you catch yourself feeling intense anxiety about sleep, jot down the exact words your mind is saying. See if you can spot which of the four cognitive traps it falls into.",
        reflectionTitle: "Reflection",
        reflection:
          "Which of these four cognitive patterns feels most familiar to you? How does that specific thought affect your body physically when you are lying in bed?",
        faqs: [
          {
            q: "Aren't my worries about being exhausted tomorrow completely realistic?",
            a: "The fatigue is real, but the extreme catastrophic story your mind builds around that fatigue is often distorted. Cognitive reframing helps separate real daytime challenges from stressful mental exaggeration.",
          },
          {
            q: "How can I stop these thoughts from appearing in my mind?",
            a: "You cannot stop thoughts from arriving. The goal is to change how you react to them. When you recognize a thought as a distorted pattern, you take away its emotional power over your body.",
          },
        ],
        ctaLabel: "Download My Thought Diary Template",
        seoTitle: "The Most Common Insomnia Thoughts | Somna CBT-I",
        seoDescription:
          'Learn the four most common cognitive traps of insomnia — catastrophizing, all-or-nothing thinking, unfair comparisons, and "should" statements.',
        keywords: [
          "insomnia thoughts",
          "cognitive distortions sleep",
          "catastrophizing sleep",
          "CBT-I thought diary",
          "sleep anxiety thoughts",
        ],
      },
      zh: {
        title: "最常见的失眠思维",
        eyebrow: "第5周 · 第13课",
        subtitle: "四种加剧睡眠焦虑的认知陷阱——以及如何识别它们。",
        difficulty: "进阶",
        readingTime: "7 分钟阅读",
        content: [
          {
            heading: "让你清醒的想法",
            paras: [
              "失眠不仅影响身体,还会主动染上你的思维方式。当你长期受睡眠问题困扰,大脑会自然发展出自动、高度扭曲的思维习惯。这些模式当时看起来完全合理,却会产生强烈焦虑,让你无法入睡。",
            ],
          },
          {
            heading: "四种认知陷阱",
            paras: [
              "1. 灾难化(最坏情境):「如果接下来十分钟睡不着,明天的演示就彻底完蛋,我的事业也毁了。」现实:虽然睡不好很难受,但你很可能曾在极少睡眠下熬过艰难的一天并成功度过。",
              "2. 全有或全无思维(二元陷阱):「今晚睡不到完美的 8 小时不间断,我整天就彻底失败。」现实:睡眠是流动的。有短暂醒来或 6 小时安稳睡眠的夜晚,仍能提供有意义的恢复。",
              "3. 不公平比较(孤立错觉):「世界上其他人都睡得轻松,我的身体根本坏了。」现实:每晚有数百万人面对睡眠挑战。你并不孤单,身体仍保有自然的睡眠能力。",
              "4. 「应该」陈述(压力锅):「我应该能毫不费力地自然入睡,我的身体应该就是能工作。」现实:对自然生理过程施加僵化期望只会制造挫败,把睡眠推得更远。",
            ],
          },
          {
            heading: "准确,而非积极",
            paras: [
              "CBT-I 中的认知疗法不是强迫积极思考或假装一切完美。它关乎准确、平衡的思考——从灾难化的故事中退一步,让神经系统终于安顿下来。",
            ],
          },
        ],
        actionStepTitle: "行动步骤",
        actionStep:
          "本周,在白天休息区旁放一本「思维日记」。一旦察觉自己对睡眠有强烈焦虑,就写下大脑正在说的确切话语。看看能否识别它落入四种陷阱中的哪一种。",
        reflectionTitle: "反思练习",
        reflection:
          "这四种认知模式中,哪一个对你最熟悉?当你躺在床上时,那个具体想法如何在身体上影响你?",
        faqs: [
          {
            q: "我对明天疲惫的担忧难道不现实吗?",
            a: "疲惫是真实的,但大脑围绕它构建的极端灾难故事往往扭曲。认知重建帮助区分真实的日间挑战与压力性的心理夸大。",
          },
          {
            q: "我怎样才能不让这些想法出现?",
            a: "你无法阻止想法到来。目标是改变你对它们的反应。当你识别出某个想法是扭曲模式,就剥夺了它对身体的情绪力量。",
          },
        ],
        ctaLabel: "下载我的思维日记模板",
        seoTitle: "最常见的失眠思维｜Somna CBT-I",
        seoDescription:
          "了解失眠最常见的四种认知陷阱——灾难化、全有或全无、不公平比较与「应该」陈述。",
        keywords: ["失眠思维", "睡眠认知扭曲", "灾难化 睡眠", "CBT-I 思维日记", "睡眠焦虑 想法"],
      },
      es: {
        title: "Los pensamientos más comunes del insomnio",
        eyebrow: "SEMANA 5 · LECCIÓN 13",
        subtitle:
          "Cuatro trampas cognitivas que alimentan la ansiedad del sueño — y cómo detectarlas.",
        difficulty: "Intermedio",
        readingTime: "7 min de lectura",
        content: [
          {
            heading: "Pensamientos que te mantienen despierto",
            paras: [
              "El insomnio no solo afecta tu cuerpo — colorea activamente tu forma de pensar. Cuando lidias con problemas de sueño a largo plazo, tu cerebro desarrolla de forma natural hábitos de pensamiento automáticos y muy distorsionados. Estos patrones parecen totalmente realistas en el momento, pero generan una ansiedad intensa que te mantiene despierto.",
            ],
          },
          {
            heading: "Cuatro trampas cognitivas",
            paras: [
              '1. Catastrofización (el peor escenario): "Si no me duermo en los próximos diez minutos, mi presentación de mañana será un desastre absoluto y arruinaré mi carrera." La realidad: aunque dormir mal es muy incómodo, probablemente ya has superado días difíciles con poco descanso y los has superado con éxito.',
              '2. Pensamiento de todo o nada (la trampa binaria): "Si esta noche no duermo 8 horas prístinas e ininterrumpidas, mi día entero es un fracaso total." La realidad: el sueño es fluido. Una noche con despertares breves o 6 horas sólidas puede aportar una restauración significativa.',
              '3. Comparaciones injustas (la ilusión de aislamiento): "Todos los demás en el mundo duermen sin esfuerzo ahora mismo. Hay algo fundamentalmente roto en mi biología." La realidad: millones de personas lidian con desafíos de sueño cada noche. No estás solo y tu cuerpo conserva su capacidad natural de dormir.',
              '4. Declaraciones de "debería" (la olla a presión): "Debería poder dormirme de forma natural sin ningún esfuerzo. Mi cuerpo simplemente debería funcionar." La realidad: imponer expectativas rígidas a un proceso biológico natural solo genera frustración y aleja más el sueño.',
            ],
          },
          {
            heading: "Preciso, no positivo",
            paras: [
              "La terapia cognitiva dentro de la CBT-I no consiste en pensar positivamente por obligación ni en fingir que todo es perfecto. Se trata de un pensamiento preciso y equilibrado — dar un paso atrás respecto a las historias catastróficas para que tu sistema nervioso pueda asentarse por fin.",
            ],
          },
        ],
        actionStepTitle: "Paso de acción",
        actionStep:
          "Esta semana, lleva un Diario de Pensamientos junto a tu zona de descanso diurna. En cuanto te sorprendas sintiendo una ansiedad intensa por el sueño, anota las palabras exactas que dice tu mente. A ver si logras identificar en cuál de las cuatro trampas cognitivas encaja.",
        reflectionTitle: "Reflexión",
        reflection:
          "¿Cuál de estos cuatro patrones cognitivos te resulta más familiar? ¿Cómo afecta físicamente a tu cuerpo ese pensamiento concreto cuando estás acostado en la cama?",
        faqs: [
          {
            q: "¿Acaso no son realistas mis preocupaciones por estar agotado mañana?",
            a: "La fatiga es real, pero la historia catastrófica extrema que tu mente construye en torno a ella suele estar distorsionada. La reestructuración cognitiva ayuda a separar los desafíos diurnos reales de la exageración mental estresante.",
          },
          {
            q: "¿Cómo puedo evitar que estos pensamientos aparezcan en mi mente?",
            a: "No puedes evitar que lleguen los pensamientos. El objetivo es cambiar cómo reaccionas a ellos. Cuando reconoces un pensamiento como un patrón distorsionado, le quitas su poder emocional sobre tu cuerpo.",
          },
        ],
        ctaLabel: "Descargar mi plantilla de diario de pensamientos",
        seoTitle: "Los pensamientos más comunes del insomnio | Somna CBT-I",
        seoDescription:
          'Conoce las cuatro trampas cognitivas más comunes del insomnio — catastrofización, pensamiento de todo o nada, comparaciones injustas y declaraciones de "debería".',
        keywords: [
          "pensamientos de insomnio",
          "distorsiones cognitivas sueño",
          "catastrofización sueño",
          "CBT-I diario de pensamientos",
          "pensamientos ansiedad sueño",
        ],
      },
      pt: {
        title: "Os pensamentos mais comuns da insônia",
        eyebrow: "SEMANA 5 · LIÇÃO 13",
        subtitle: "Quatro armadilhas cognitivas que alimentam a ansiedade do sono — e como identificá-las.",
        difficulty: "Intermediário",
        readingTime: "7 min de leitura",
        content: [
          {
            heading: "Pensamentos que te mantêm acordado",
            paras: [
              "A insônia não afeta só o corpo — ela colore ativamente o modo como você pensa. Quando luta com problemas de sono a longo prazo, seu cérebro desenvolve naturalmente hábitos de pensamento automáticos e muito distorcidos. Esses padrões parecem totalmente realistas na hora, mas geram ansiedade intensa que te mantém acordado.",
            ],
          },
          {
            heading: "Quatro armadilhas cognitivas",
            paras: [
              "1. Catastrofização (o pior cenário): \"Se eu não pegar no sono nos próximos dez minutos, minha apresentação amanhã vai ser um desastre absoluto e vou arruinar minha carreira.\" A realidade: embora o mau sono seja profundamente incômodo, você provavelmente já enfrentou dias difíceis com pouco descanso antes e superou eles com sucesso.",
              "2. Pensamento de tudo ou nada (a armadilha binária): \"Se eu não conseguir 8 horas perfeitas de sono ininterrupto hoje, meu dia inteiro é um fracasso total.\" A realidade: o sono é fluido. Uma noite com despertares breves ou 6 horas sólidas ainda pode oferecer restauração significativa.",
              "3. Comparações injustas (a ilusão do isolamento): \"Todo mundo no mundo está dormindo facilmente agora. Tem algo fundamentalmente quebrado na minha biologia.\" A realidade: milhões de pessoas enfrentam desafios de sono todas as noites. Você não está sozinho, e seu corpo mantém sua capacidade natural de dormir.",
              "4. Afirmações de \"deveria\" (a panela de pressão): \"Eu deveria conseguir dormir naturalmente sem esforço. Meu corpo deveria simplesmente funcionar.\" A realidade: impor expectativas rígidas a um processo biológico natural só cria frustração, empurrando o sono para mais longe.",
            ],
          },
          {
            heading: "Preciso, não positivo",
            paras: [
              "A terapia cognitiva dentro da TCC-I não é sobre pensamento positivo forçado ou fingir que tudo está perfeito. É sobre pensamento preciso e equilibrado — dar um passo atrás das histórias catastróficas para que seu sistema nervoso finalmente possa se acalmar.",
            ],
          },
        ],
        actionStepTitle: "Passo de ação",
        actionStep:
          "Esta semana, mantenha um Diário de Pensamentos ao lado da sua área de descanso diurno. No momento em que perceber ansiedade intensa sobre o sono, anote as palavras exatas que sua mente está dizendo. Veja se consegue identificar em qual das quatro armadilhas cognitivas ela se encaixa.",
        reflectionTitle: "Reflexão",
        reflection:
          "Qual desses quatro padrões cognitivos parece mais familiar para você? Como esse pensamento específico afeta seu corpo fisicamente quando você está deitado na cama?",
        faqs: [
          {
            q: "As minhas preocupações sobre estar exausto amanhã não são completamente realistas?",
            a: "O cansaço é real, mas a história catastrófica extrema que sua mente constrói em torno desse cansaço costuma ser distorcida. A reformulação cognitiva ajuda a separar desafios reais do dia a dia da exageração mental estressante.",
          },
          {
            q: "Como posso fazer esses pensamentos pararem de aparecer na minha mente?",
            a: "Você não pode impedir que os pensamentos cheguem. O objetivo é mudar como você reage a eles. Quando reconhece um pensamento como um padrão distorcido, você tira dele o poder emocional sobre seu corpo.",
          },
        ],
        ctaLabel: "Baixar meu modelo de diário de pensamentos",
        seoTitle: "Os pensamentos mais comuns da insônia | Somna TCC-I",
        seoDescription:
          "Conheça as quatro armadilhas cognitivas mais comuns da insônia — catastrofização, pensamento de tudo ou nada, comparações injustas e afirmações de \"deveria\".",
        keywords: [
          "pensamentos de insônia",
          "distorções cognitivas sono",
          "catastrofização sono",
          "TCC-I diário de pensamentos",
          "pensamentos ansiedade sono",
        ],
      },
    },
  },

  // ───────────────────────── Lesson 14: How CBT-I Changes Sleep Beliefs ─────────────────────────
  {
    slug: "cbti-changes-sleep-beliefs",
    weekNumber: 5,
    weekSlug: "week-5",
    lessonNumber: 14,
    estimatedMinutes: 7,
    relatedLessonSlugs: [
      "common-insomnia-thoughts",
      "realistic-sleep-expectations",
      "sleep-restriction-therapy",
    ],
    i18n: {
      en: {
        title: "How CBT-I Changes Sleep Beliefs",
        eyebrow: "WEEK 5 · LESSON 14",
        subtitle: "Cognitive Restructuring in three phases — identify, challenge, reframe.",
        difficulty: "Advanced",
        readingTime: "7 min read",
        content: [
          {
            heading: "A structured exercise",
            paras: [
              "To permanently shift your relationship with sleep, we use a core CBT-I process called Cognitive Restructuring. This is a structured exercise where you examine your anxious sleep thoughts with gentle curiosity, challenge their accuracy, and replace them with realistic perspectives.",
              "This process moves through three clear phases: Step 1 — Identify: catch the automatic, anxious thought. Step 2 — Challenge: examine the actual evidence for and against it. Step 3 — Reframe: replace it with a balanced, accurate alternative.",
            ],
          },
          {
            heading: "A practical example",
            paras: [
              "The Automatic Thought: \"If I don't sleep well tonight, I won't be able to function at all tomorrow, and I'll make terrible mistakes at work.\"",
              "The Reality Check: let's look at the actual evidence. Have there been previous days where you slept poorly but still managed to complete your essential tasks? Yes, many times. Did you survive those days? Yes. Would you tell a dear friend who is struggling with sleep that they are completely incapable of functioning? Of course not.",
              'The Balanced Reframe: "I prefer a full night of sleep, but I know from experience that I can get through my workday even when I\'m tired. One restless night does not mean tomorrow is a disaster."',
              "Notice how the reframed perspective doesn't sugarcoat the challenge. It is simply accurate, fair, and reassuring, which allows your body to relax and let sleep arrive naturally.",
            ],
          },
        ],
        actionStepTitle: "Action Step",
        actionStep:
          "Pick one repetitive, stressful sleep thought you find yourself having regularly. Run it through the three steps of Cognitive Restructuring today: write it down, challenge it with real evidence, and craft a balanced alternative you can rely on tonight.",
        reflectionTitle: "Reflection",
        reflection:
          "How does it feel to question the absolute truth of your anxious thoughts? Did you notice any subtle resistance from your mind during this exercise? That is a perfectly normal part of changing long-standing habits.",
        faqs: [
          {
            q: "Is cognitive restructuring just a form of positive thinking?",
            a: "No, positive thinking can feel artificial when you are genuinely tired. Cognitive restructuring focuses on realistic thinking — seeing your situation clearly as it truly is, rather than through a lens of fear.",
          },
          {
            q: "How long does it take to change these long-standing mental habits?",
            a: "Shifting deep-seated mental habits is a gradual process. With steady practice, most users notice a significant drop in their sleep anxiety within 3 to 5 weeks.",
          },
        ],
        ctaLabel: "Try the Cognitive Reframer Tool",
        seoTitle: "How CBT-I Changes Sleep Beliefs | Somna Cognitive Restructuring",
        seoDescription:
          "Learn the three-phase Cognitive Restructuring process — identify, challenge, reframe — with a practical example that turns anxious sleep thoughts into balanced perspectives.",
        keywords: [
          "cognitive restructuring",
          "CBT-I sleep beliefs",
          "reframe sleep thoughts",
          "cognitive restructuring example",
          "CBT-I cognitive therapy",
        ],
      },
      zh: {
        title: "CBT-I 如何改变睡眠信念",
        eyebrow: "第5周 · 第14课",
        subtitle: "认知重建三阶段——识别、挑战、重建。",
        difficulty: "高阶",
        readingTime: "7 分钟阅读",
        content: [
          {
            heading: "一项结构化练习",
            paras: [
              "要永久改变与睡眠的关系,我们使用 CBT-I 的核心流程——认知重建。这是一项结构化练习:以温柔的好奇审视焦虑的睡眠想法,挑战其准确性,并用现实的视角替换它们。",
              "这个过程分三个清晰阶段:第 1 步——识别:捕捉自动的焦虑想法。第 2 步——挑战:审视支持和反对它的真实证据。第 3 步——重建:用平衡、准确的替代想法替换它。",
            ],
          },
          {
            heading: "一个实际例子",
            paras: [
              "自动想法:「如果今晚睡不好,我明天就完全无法运转,会在工作中犯下可怕错误。」",
              "现实核查:看看真实证据。以前是否有睡得不好却仍完成关键任务的日子?有,很多次。那些天你挺过来了吗?是的。你会对一个正受睡眠困扰的好友说他们完全无法运转吗?当然不会。",
              "平衡重建:「我更希望睡个整夜,但凭经验我知道,即使疲惫也能撑过工作日。一个不安之夜并不意味着明天就是灾难。」",
              "注意重建后的视角并未粉饰挑战。它只是准确、公正、令人安心,让身体得以放松,让睡眠自然降临。",
            ],
          },
        ],
        actionStepTitle: "行动步骤",
        actionStep:
          "选一个你经常反复出现的压力性睡眠想法。今天让它走一遍认知重建三步:写下来、用真实证据挑战它、打造一个今晚可依赖的平衡替代想法。",
        reflectionTitle: "反思练习",
        reflection:
          "质疑焦虑想法的绝对真相,感觉如何?练习中你是否察觉心智的微妙抗拒?这是改变长期习惯时完全正常的一部分。",
        faqs: [
          {
            q: "认知重建只是积极思考的一种形式吗?",
            a: "不是,当你真正疲惫时,积极思考会显得虚假。认知重建专注于现实思考——如实看清处境,而非透过恐惧的滤镜。",
          },
          {
            q: "改变这些长期心智习惯需要多久?",
            a: "改变根深蒂固的心智习惯是渐进过程。坚持练习,大多数人 3–5 周内会注意到睡眠焦虑显著下降。",
          },
        ],
        ctaLabel: "尝试认知重建工具",
        seoTitle: "CBT-I 如何改变睡眠信念｜Somna 认知重建",
        seoDescription:
          "学习三阶段认知重建流程——识别、挑战、重建——用一个实际例子把焦虑的睡眠想法转为平衡视角。",
        keywords: ["认知重建", "CBT-I 睡眠信念", "重建睡眠想法", "认知重建 例子", "CBT-I 认知疗法"],
      },
      es: {
        title: "Cómo la CBT-I cambia las creencias sobre el sueño",
        eyebrow: "SEMANA 5 · LECCIÓN 14",
        subtitle: "Reestructuración cognitiva en tres fases — identificar, desafiar, reencuadrar.",
        difficulty: "Avanzado",
        readingTime: "7 min de lectura",
        content: [
          {
            heading: "Un ejercicio estructurado",
            paras: [
              "Para cambiar de forma permanente tu relación con el sueño, usamos un proceso central de la CBT-I llamado Reestructuración Cognitiva. Es un ejercicio estructurado en el que examinas tus pensamientos ansiosos sobre el sueño con curiosa amabilidad, desafías su precisión y los sustituyes por perspectivas realistas.",
              "El proceso avanza por tres fases claras: Paso 1 — Identificar: atrapa el pensamiento ansioso automático. Paso 2 — Desafiar: examina las pruebas reales a favor y en contra. Paso 3 — Reencuadrar: sustitúyelo por una alternativa equilibrada y precisa.",
            ],
          },
          {
            heading: "Un ejemplo práctico",
            paras: [
              'El pensamiento automático: "Si esta noche no duermo bien, mañana no podré funcionar en absoluto y cometeré errores terribles en el trabajo."',
              "La comprobación de la realidad: veamos las pruebas reales. ¿Ha habido días anteriores en los que dormiste mal pero aun así lograste completar tus tareas esenciales? Sí, muchas veces. ¿Sobreviviste a esos días? Sí. ¿Le dirías a un buen amigo que lucha con el sueño que es completamente incapaz de funcionar? Por supuesto que no.",
              'El reencuadre equilibrado: "Prefiero una noche completa de sueño, pero sé por experiencia que puedo superar mi jornada laboral incluso cuando estoy cansado. Una noche inquieta no significa que mañana sea un desastre."',
              "Observa cómo la perspectiva reencuadrada no endulza el desafío. Es simplemente precisa, justa y tranquilizadora, lo que permite a tu cuerpo relajarse y dejar que el sueño llegue de forma natural.",
            ],
          },
        ],
        actionStepTitle: "Paso de acción",
        actionStep:
          "Elige un pensamiento estresante y repetitivo sobre el sueño que tengas a menudo. Pásalo hoy por los tres pasos de la Reestructuración Cognitiva: escríbelo, desáfialo con pruebas reales y elabora una alternativa equilibrada en la que puedas apoyarte esta noche.",
        reflectionTitle: "Reflexión",
        reflection:
          "¿Cómo se siente cuestionar la verdad absoluta de tus pensamientos ansiosos? ¿Notaste alguna resistencia sutil de tu mente durante el ejercicio? Es una parte perfectamente normal de cambiar hábitos arraigados.",
        faqs: [
          {
            q: "¿Es la reestructuración cognitiva solo una forma de pensamiento positivo?",
            a: "No, el pensamiento positivo puede resultar artificial cuando estás genuinamente cansado. La reestructuración cognitiva se centra en el pensamiento realista — ver tu situación con claridad tal como es, en lugar de a través del filtro del miedo.",
          },
          {
            q: "¿Cuánto tarda en cambiarse estos hábitos mentales arraigados?",
            a: "Cambiar hábitos mentales profundos es un proceso gradual. Con práctica constante, la mayoría de los usuarios nota una caída significativa de su ansiedad de sueño en 3 a 5 semanas.",
          },
        ],
        ctaLabel: "Probar la herramienta de reestructuración cognitiva",
        seoTitle:
          "Cómo la CBT-I cambia las creencias sobre el sueño | Somna Reestructuración Cognitiva",
        seoDescription:
          "Aprende el proceso de Reestructuración Cognitiva en tres fases — identificar, desafiar, reencuadrar — con un ejemplo práctico que convierte pensamientos ansiosos en perspectivas equilibradas.",
        keywords: [
          "reestructuración cognitiva",
          "CBT-I creencias sueño",
          "reencuadrar pensamientos sueño",
          "ejemplo reestructuración cognitiva",
          "CBT-I terapia cognitiva",
        ],
      },
      pt: {
        title: "Como a TCC-I muda as crenças sobre o sono",
        eyebrow: "SEMANA 5 · LIÇÃO 14",
        subtitle: "Reformulação Cognitiva em três fases — identificar, questionar, reenquadrar.",
        difficulty: "Avançado",
        readingTime: "7 min de leitura",
        content: [
          {
            heading: "Um exercício estruturado",
            paras: [
              "Para mudar permanentemente sua relação com o sono, usamos um processo central da TCC-I chamado Reformulação Cognitiva. É um exercício estruturado em que você examina seus pensamentos ansiosos sobre o sono com curiosidade gentil, questiona sua precisão e os substitui por perspectivas realistas.",
              "Esse processo passa por três fases claras: Passo 1 — Identificar: pegue o pensamento automático e ansioso. Passo 2 — Questionar: examine as evidências reais a favor e contra. Passo 3 — Reenquadrar: substitua-o por uma alternativa equilibrada e precisa.",
            ],
          },
          {
            heading: "Um exemplo prático",
            paras: [
              "O pensamento automático: \"Se eu não dormir bem hoje à noite, não vou conseguir funcionar amanhã e vou cometer erros terríveis no trabalho.\"",
              "A verificação da realidade: vamos olhar para as evidências reais. Já houve dias em que você dormiu mal, mas ainda conseguiu completar suas tarefas essenciais? Sim, muitas vezes. Você sobreviveu a esses dias? Sim. Você diria a um amigo querido que está com dificuldades de sono que ele é completamente incapaz de funcionar? Claro que não.",
              "O reenquadramento equilibrado: \"Eu prefiro uma noite inteira de sono, mas sei por experiência própria que consigo passar pelo dia de trabalho mesmo cansado. Uma noite inquieta não significa que amanhã será um desastre.\"",
              "Note como a perspectiva reenquadrada não maqueia o desafio. Ela é simplesmente precisa, justa e reconfortante, o que permite ao seu corpo relaxar e deixar o sono chegar naturalmente.",
            ],
          },
        ],
        actionStepTitle: "Passo de ação",
        actionStep:
          "Escolha um pensamento repetitivo e estressante sobre o sono que você tenha com frequência. Passe ele pelos três passos da Reformulação Cognitiva hoje: escreva-o, questione-o com evidências reais e crie uma alternativa equilibrada na qual possa confiar esta noite.",
        reflectionTitle: "Reflexão",
        reflection:
          "Como é questionar a verdade absoluta dos seus pensamentos ansiosos? Você notou alguma resistência sutil da mente durante o exercício? Isso é uma parte perfeitamente normal de mudar hábitos antigos.",
        faqs: [
          {
            q: "A reformulação cognitiva é só uma forma de pensamento positivo?",
            a: "Não, o pensamento positivo pode parecer artificial quando você está genuinamente cansado. A reformulação cognitiva foca em pensamento realista — ver sua situação claramente como ela realmente é, em vez de através de uma lente de medo.",
          },
          {
            q: "Quanto tempo leva para mudar esses hábitos mentais arraigados?",
            a: "Mudar hábitos mentais profundos é um processo gradual. Com prática constante, a maioria dos usuários nota uma queda significativa da ansiedade com o sono em 3 a 5 semanas.",
          },
        ],
        ctaLabel: "Experimentar a ferramenta de reformulação cognitiva",
        seoTitle: "Como a TCC-I muda as crenças sobre o sono | Somna Reformulação Cognitiva",
        seoDescription:
          "Aprenda o processo de Reformulação Cognitiva em três fases — identificar, questionar, reenquadrar — com um exemplo prático que transforma pensamentos ansiosos sobre o sono em perspectivas equilibradas.",
        keywords: [
          "reformulação cognitiva",
          "TCC-I crenças sono",
          "reenquadrar pensamentos sono",
          "exemplo reformulação cognitiva",
          "TCC-I terapia cognitiva",
        ],
      },
    },
  },

  // ───────────────────────── Lesson 15: Building Realistic Sleep Expectations ─────────────────────────
  {
    slug: "realistic-sleep-expectations",
    weekNumber: 5,
    weekSlug: "week-5",
    lessonNumber: 15,
    estimatedMinutes: 6,
    relatedLessonSlugs: [
      "common-insomnia-thoughts",
      "cbti-changes-sleep-beliefs",
      "trying-harder-makes-sleep-worse",
    ],
    i18n: {
      en: {
        title: "Building Realistic Sleep Expectations",
        eyebrow: "WEEK 5 · LESSON 15",
        subtitle: "Replace four rigid sleep myths with evidence-based expectations.",
        difficulty: "Intermediate",
        readingTime: "6 min read",
        content: [
          {
            heading: "The invisible pressure cooker",
            paras: [
              "Many individuals navigating chronic insomnia are carrying rigid, perfectionist expectations about sleep. These expectations act like an invisible pressure cooker, generating the very performance anxiety that disrupts their nights.",
              "Let's realign our perspective by replacing four common sleep myths with evidence-based expectations.",
            ],
          },
          {
            heading: "Four myths, four truths",
            paras: [
              'Myth: "I must secure 8 hours of sleep every single night to stay healthy." Truth: sleep needs naturally vary based on your genetics, age, and activity. Quality and consistency matter far more than an arbitrary number.',
              'Myth: "I should drift off into sleep immediately after my head hits the pillow." Truth: a normal, healthy sleep onset period actually takes 10 to 20 minutes. Falling asleep instantly is often a sign of severe exhaustion.',
              "Myth: \"Waking up during the night means my therapy isn't working.\" Truth: brief awakenings between sleep cycles are a natural part of human biology. Restful sleep isn't a solid block; it is a series of gentle waves.",
              'Myth: "A bad night of sleep will completely ruin my health and my week." Truth: the human body is remarkably resilient. Your biological sleep drive will naturally deepen tonight to make up for yesterday\'s restless hours.',
            ],
          },
          {
            heading: "Inviting, not performing",
            paras: [
              "By stepping away from the demand for an absolutely perfect night, you remove the heavy pressure that keeps you awake. Sleep is a natural rhythm to be invited in, not a performance to be judged.",
            ],
          },
        ],
        actionStepTitle: "Action Step",
        actionStep:
          "Review these four realistic sleep truths. Choose the one that brings you the greatest sense of relief and repeat it gently to yourself whenever you feel sleep anxiety starting to build this week.",
        reflectionTitle: "Reflection",
        reflection:
          "How have your expectations about sleep shaped your evening routines lately? What shifts when you give yourself permission to simply have an imperfect, human night of rest?",
        faqs: [
          {
            q: "If I stop striving for perfect sleep, won't I settle for poor rest?",
            a: "Paradoxically, letting go of the desperate pursuit of perfect sleep is exactly what allows your body's natural sleep mechanics to take over and function beautifully.",
          },
          {
            q: "I have had insomnia for decades. Can I really rewrite my deep beliefs?",
            a: "Absolutely. Neuroplasticity — your brain's natural ability to learn and adapt — remains active throughout your entire life. Long-standing beliefs change beautifully with steady, compassionate practice.",
          },
        ],
        ctaLabel: "Attend the Sleep Belief Workshop",
        seoTitle: "Building Realistic Sleep Expectations | Somna CBT-I",
        seoDescription:
          "Replace four rigid sleep myths with evidence-based expectations — and release the performance anxiety that keeps you awake.",
        keywords: [
          "realistic sleep expectations",
          "sleep myths",
          "8 hours sleep myth",
          "CBT-I beliefs",
          "sleep perfectionism",
        ],
      },
      zh: {
        title: "建立现实的睡眠期望",
        eyebrow: "第5周 · 第15课",
        subtitle: "用循证期望替换四种僵化的睡眠迷思。",
        difficulty: "进阶",
        readingTime: "6 分钟阅读",
        content: [
          {
            heading: "无形的压力锅",
            paras: [
              "许多慢性失眠者背负着僵化、完美主义的睡眠期望。这些期望像无形的压力锅,制造出扰乱夜晚的表现焦虑。",
              "让我们用循证期望替换四种常见睡眠迷思,重新校准视角。",
            ],
          },
          {
            heading: "四个迷思,四个真相",
            paras: [
              "迷思:「我每晚必须睡满 8 小时才能健康。」真相:睡眠需求因基因、年龄和活动量而异。质量与稳定性远比武断的数字重要。",
              "迷思:「头一沾枕头就该立刻入睡。」真相:正常健康的入睡潜伏期其实需要 10–20 分钟。瞬间入睡往往是严重疲惫的信号。",
              "迷思:「夜里醒来意味着疗法无效。」真相:睡眠周期之间的短暂醒来是人类生物学的自然部分。安稳睡眠不是一块铁板,而是一连串温柔的波浪。",
              "迷思:「一夜睡不好会彻底毁掉我的健康和这一周。」真相:人体具有惊人的恢复力。你今晚的生物睡眠驱动力会自然加深,弥补昨夜的不安时光。",
            ],
          },
          {
            heading: "邀请,而非表演",
            paras: [
              "放下对绝对完美之夜的苛求,你就移除了让你清醒的沉重压力。睡眠是一种被邀请的自然节律,而非一场被评判的表演。",
            ],
          },
        ],
        actionStepTitle: "行动步骤",
        actionStep:
          "回顾这四个现实的睡眠真相。选择带给你最大释然的那一个,本周每当睡眠焦虑开始累积时,就温柔地对自己重复它。",
        reflectionTitle: "反思练习",
        reflection:
          "你对睡眠的期望最近如何塑造了你的晚间日常?当你允许自己拥有一个不完美、人之常情的夜晚时,会发生什么转变?",
        faqs: [
          {
            q: "如果不再追求完美睡眠,我不会就此满足于糟糕的休息吗?",
            a: "矛盾的是,正是放下对完美睡眠的绝望追求,才让身体的自然睡眠机制接管并美妙运作。",
          },
          {
            q: "我失眠几十年了,真能改写深层信念吗?",
            a: "完全可以。神经可塑性——大脑学习与适应的自然能力——终生活跃。长期信念在稳定、慈悲的练习下会美好地改变。",
          },
        ],
        ctaLabel: "参加睡眠信念工作坊",
        seoTitle: "建立现实的睡眠期望｜Somna CBT-I",
        seoDescription: "用循证期望替换四种僵化的睡眠迷思——释放让你清醒的表现焦虑。",
        keywords: ["现实睡眠期望", "睡眠迷思", "8小时睡眠迷思", "CBT-I 信念", "睡眠完美主义"],
      },
      es: {
        title: "Construir expectativas realistas sobre el sueño",
        eyebrow: "SEMANA 5 · LECCIÓN 15",
        subtitle: "Sustituye cuatro mitos rígidos del sueño por expectativas basadas en evidencia.",
        difficulty: "Intermedio",
        readingTime: "6 min de lectura",
        content: [
          {
            heading: "La olla a presión invisible",
            paras: [
              "Muchas personas que atraviesan insomnio crónico cargan expectativas rígidas y perfeccionistas sobre el sueño. Estas expectativas actúan como una olla a presión invisible, generando precisamente la ansiedad de rendimiento que altera sus noches.",
              "Realineemos nuestra perspectiva sustituyendo cuatro mitos comunes del sueño por expectativas basadas en evidencia.",
            ],
          },
          {
            heading: "Cuatro mitos, cuatro verdades",
            paras: [
              'Mito: "Debo conseguir 8 horas de sueño cada noche para mantenerme sano." Verdad: las necesidades de sueño varían naturalmente según tu genética, edad y actividad. La calidad y la constancia importan mucho más que un número arbitrario.',
              'Mito: "Debería dormirme inmediatamente después de tocar la almohada." Verdad: un periodo de inicio del sueño sano y normal tarda de 10 a 20 minutos. Dormirse al instante suele ser señal de agotamiento severo.',
              'Mito: "Despertarse por la noche significa que mi terapia no funciona." Verdad: los despertares breves entre ciclos de sueño son parte natural de la biología humana. El sueño reparador no es un bloque sólido, sino una serie de olas suaves.',
              'Mito: "Una mala noche de sueño arruinará por completo mi salud y mi semana." Verdad: el cuerpo humano es notablemente resiliente. Tu presión biológica de sueño se profundizará esta noche de forma natural para compensar las horas inquietas de ayer.',
            ],
          },
          {
            heading: "Invitar, no actuar",
            paras: [
              "Al alejarte de la exigencia de una noche absolutamente perfecta, eliminas la presión pesada que te mantiene despierto. El sueño es un ritmo natural que se invita, no una actuación que se juzga.",
            ],
          },
        ],
        actionStepTitle: "Paso de acción",
        actionStep:
          "Revisa estas cuatro verdades realistas del sueño. Elige la que te aporte mayor alivio y repítetela con suavidad siempre que sientas que la ansiedad del sueño empieza a acumularse esta semana.",
        reflectionTitle: "Reflexión",
        reflection:
          "¿Cómo han moldeado tus expectativas sobre el sueño tus rutinas vespertinas últimamente? ¿Qué cambia cuando te das permiso para tener simplemente una noche de descanso imperfecta y humana?",
        faqs: [
          {
            q: "Si dejo de perseguir el sueño perfecto, ¿no me conformaré con un descanso pobre?",
            a: "Paradójicamente, soltar la búsqueda desesperada del sueño perfecto es justo lo que permite a la mecánica natural del sueño de tu cuerpo tomar el control y funcionar maravillosamente.",
          },
          {
            q: "Llevo décadas con insomnio. ¿De verdad puedo reescribir mis creencias profundas?",
            a: "Por supuesto. La neuroplasticidad — la capacidad natural de tu cerebro para aprender y adaptarse — permanece activa toda la vida. Las creencias arraigadas cambian de forma hermosa con una práctica constante y compasiva.",
          },
        ],
        ctaLabel: "Asistir al taller de creencias del sueño",
        seoTitle: "Construir expectativas realistas sobre el sueño | Somna CBT-I",
        seoDescription:
          "Sustituye cuatro mitos rígidos del sueño por expectativas basadas en evidencia — y libera la ansiedad de rendimiento que te mantiene despierto.",
        keywords: [
          "expectativas realistas del sueño",
          "mitos del sueño",
          "mito 8 horas sueño",
          "CBT-I creencias",
          "perfeccionismo del sueño",
        ],
      },
      pt: {
        title: "Construindo expectativas realistas sobre o sono",
        eyebrow: "SEMANA 5 · LIÇÃO 15",
        subtitle: "Substitua quatro mitos rígidos do sono por expectativas baseadas em evidência.",
        difficulty: "Intermediário",
        readingTime: "6 min de leitura",
        content: [
          {
            heading: "A panela de pressão invisível",
            paras: [
              "Muitas pessoas que lidam com insônia crônica carregam expectativas rígidas e perfeccionistas sobre o sono. Essas expectativas agem como uma panela de pressão invisível, gerando a própria ansiedade de desempenho que perturba suas noites.",
              "Vamos realinhar nossa perspectiva substituindo quatro mitos comuns do sono por expectativas baseadas em evidência.",
            ],
          },
          {
            heading: "Quatro mitos, quatro verdades",
            paras: [
              "Mito: \"Preciso garantir 8 horas de sono todas as noites para ficar saudável.\" Verdade: as necessidades de sono variam naturalmente conforme sua genética, idade e atividade. Qualidade e constância importam muito mais do que um número arbitrário.",
              "Mito: \"Eu deveria adormecer imediatamente depois que minha cabeça toca o travesseiro.\" Verdade: um período normal e saudável para pegar no sono leva de 10 a 20 minutos. Adormecer instantaneamente costuma ser sinal de exaustão severa.",
              "Mito: \"Acordar durante a noite significa que minha terapia não está funcionando.\" Verdade: despertares breves entre ciclos de sono são uma parte natural da biologia humana. O sono reparador não é um bloco sólido; é uma série de ondas gentis.",
              "Mito: \"Uma noite ruim de sono vai arruinar completamente minha saúde e minha semana.\" Verdade: o corpo humano é notavelmente resiliente. Sua pressão natural de sono vai aprofundar o sono de hoje à noite para compensar as horas inquietas de ontem.",
            ],
          },
          {
            heading: "Convidar, não performar",
            paras: [
              "Ao se afastar da exigência por uma noite absolutamente perfeita, você remove a pressão pesada que te mantém acordado. O sono é um ritmo natural a ser convidado, e não uma performance a ser julgada.",
            ],
          },
        ],
        actionStepTitle: "Passo de ação",
        actionStep:
          "Releia essas quatro verdades realistas sobre o sono. Escolha aquela que te traz a maior sensação de alívio e repita-a gentilmente para si mesmo sempre que sentir a ansiedade com o sono começar a crescer esta semana.",
        reflectionTitle: "Reflexão",
        reflection:
          "Como suas expectativas sobre o sono têm moldado suas rotinas noturnas ultimamente? O que muda quando você se dá permissão para simplesmente ter uma noite de descanso humana e imperfeita?",
        faqs: [
          {
            q: "Se eu parar de buscar o sono perfeito, não vou me conformar com um descanso ruim?",
            a: "Paradoxalmente, soltar a busca desesperada pelo sono perfeito é exatamente o que permite que a mecânica natural do sono do seu corpo assuma o controle e funcione maravilhosamente.",
          },
          {
            q: "Tenho insônia há décadas. Será que consigo mesmo reescrever minhas crenças profundas?",
            a: "Com certeza. A neuroplasticidade — a capacidade natural do seu cérebro de aprender e se adaptar — permanece ativa durante toda a vida. Crenças arraigadas mudam de forma linda com uma prática constante e compassiva.",
          },
        ],
        ctaLabel: "Participar do workshop de crenças sobre o sono",
        seoTitle: "Construindo expectativas realistas sobre o sono | Somna TCC-I",
        seoDescription:
          "Substitua quatro mitos rígidos do sono por expectativas baseadas em evidência — e libere a ansiedade de desempenho que te mantém acordado.",
        keywords: [
          "expectativas realistas do sono",
          "mitos do sono",
          "mito 8 horas de sono",
          "TCC-I crenças",
          "perfeccionismo do sono",
        ],
      },
    },
  },
];
