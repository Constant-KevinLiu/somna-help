// Week 4 — Calming the Mind (Lessons 10-12)
// Source: "18 CBT-I Program.docx"
import type { LessonContent } from "../program-lessons";

export const week4Lessons: LessonContent[] = [
  // ───────────────────────── Lesson 10: Why Racing Thoughts Happen at Night ─────────────────────────
  {
    slug: "racing-thoughts-at-night",
    weekNumber: 4,
    weekSlug: "week-4",
    lessonNumber: 10,
    estimatedMinutes: 6,
    relatedLessonSlugs: [
      "relaxation-techniques",
      "breathing-exercises-for-sleep",
      "common-insomnia-thoughts",
    ],
    i18n: {
      en: {
        title: "Why Racing Thoughts Happen at Night",
        eyebrow: "WEEK 4 · LESSON 10",
        subtitle:
          "The psychology of nighttime mental activation — and how to give worries a dedicated space.",
        difficulty: "Intermediate",
        readingTime: "6 min read",
        content: [
          {
            heading: "A familiar experience",
            paras: [
              "It is an incredibly familiar experience for anyone navigating insomnia: the world goes completely quiet, your head hits the pillow, and your mind suddenly roars to life. You find yourself replaying ancient conversations, organizing tomorrow's schedules, or catastrophizing about how tired you will be.",
              "This nighttime mental activation is not a personal failing; it is driven by predictable psychological mechanisms.",
            ],
          },
          {
            heading: "Three mechanisms",
            paras: [
              "The Loss of Distraction Buffers: during the day, your brain is fully occupied with work, conversations, and stimuli. When you turn off the lights, this cognitive noise vanishes. The stillness creates a natural vacuum, allowing suppressed worries to rush to the surface.",
              "The Cognitive Rebound Effect: actively trying not to think about your worries during the day uses significant mental energy. The moment your body attempts to relax at night, that conscious control slips away, triggering a natural rebound of active thoughts.",
              'Conditioned Sleep Anxiety: because poor sleep has been distressing, the act of going to bed itself is perceived by your brain as a stressful event. Your nervous system treats the bedroom like a challenge, releasing cortisol and activating your problem-solving mind to keep you safe from the "threat" of wakefulness.',
            ],
          },
          {
            heading: "A structured approach",
            paras: [
              "To settle these racing thoughts, we don't try to force our minds silent. Instead, we use structured tools to give our thoughts a dedicated space outside of our sleeping hours, systematically turning down our nervous system's volume.",
            ],
          },
        ],
        actionStepTitle: "Action Step",
        actionStep:
          'This week, introduce a restorative practice called "Scheduled Worry Time." Every afternoon, set a timer for 15 minutes. Sit down with a notebook and write down every single worry, task, or anxious thought on your mind. If any of those familiar worries try to surface at 2:00 AM, gently remind yourself: "I have already processed that during my worry time, and I will revisit it tomorrow afternoon."',
        reflectionTitle: "Reflection",
        reflection:
          "Look at the recurring themes in your nighttime thoughts. Are they practical, everyday problem-solving tasks, or are they deeper anxieties about sleep itself? Categorizing them helps take away their power.",
        faqs: [
          {
            q: "Why do my problems feel so much bigger and more terrifying at 3:00 AM?",
            a: "In the deep middle of the night, your brain's emotional center (the amygdala) operates without the full balancing control of your logical prefrontal cortex. This creates an echo chamber where small concerns look like major crises.",
          },
          {
            q: "Can't I just use sheer willpower to force my mind to be quiet?",
            a: "Trying to suppress a thought actually signals your brain that the thought is incredibly important, making it return with greater intensity. We focus on acknowledgment and redirection rather than suppression.",
          },
        ],
        ctaLabel: "Open My Digital Worry Journal",
        seoTitle: "Why Racing Thoughts Happen at Night | Somna CBT-I",
        seoDescription:
          "Understand the three psychological mechanisms behind nighttime racing thoughts — and how Scheduled Worry Time gives them a dedicated space.",
        keywords: [
          "racing thoughts at night",
          "nighttime anxiety",
          "scheduled worry time",
          "CBT-I racing thoughts",
          "can't sleep thinking",
        ],
      },
      zh: {
        title: "为什么夜晚思绪纷飞",
        eyebrow: "第4周 · 第10课",
        subtitle: "夜间心理激活的机制——以及如何给担忧一个专属空间。",
        difficulty: "进阶",
        readingTime: "6 分钟阅读",
        content: [
          {
            heading: "熟悉的体验",
            paras: [
              "对任何经历失眠的人来说,这都是再熟悉不过的体验:世界彻底安静下来,头一沾枕头,思绪却突然轰鸣起来。你开始重播久远的对话、安排明天的日程,或灾难化地想象自己会有多累。",
              "这种夜间心理激活并非个人失败,而是由可预测的心理机制驱动。",
            ],
          },
          {
            heading: "三种机制",
            paras: [
              "失去分心缓冲:白天大脑被工作、对话和刺激占满。关灯后,这些认知噪音消失。寂静制造了天然真空,让被压抑的担忧涌上心头。",
              "认知反弹效应:白天努力不去想担忧会消耗大量心理能量。夜晚身体试图放松时,这种有意识控制松懈,触发活跃思绪的自然反弹。",
              "条件化睡眠焦虑:因为糟糕的睡眠令人痛苦,上床本身被大脑视为压力事件。神经系统把卧室当作挑战,释放皮质醇,激活解决问题的大脑,让你远离「清醒的威胁」。",
            ],
          },
          {
            heading: "结构化的方法",
            paras: [
              "要平息纷飞思绪,我们不是强迫大脑安静,而是用结构化工具,在睡眠时间之外给思绪一个专属空间,系统地调低神经系统的音量。",
            ],
          },
        ],
        actionStepTitle: "行动步骤",
        actionStep:
          "本周,引入一种恢复性练习——「定时担忧时间」。每天下午设 15 分钟计时,带着笔记本坐下,写下脑海中每一个担忧、任务或焦虑想法。如果凌晨两点那些熟悉的担忧又冒出来,温柔提醒自己:「我已经在担忧时间处理过它了,明天下午再 revisit。」",
        reflectionTitle: "反思练习",
        reflection:
          "看看夜间思绪中反复出现的主题。它们是实际的日常问题解决,还是对睡眠本身更深的焦虑?给它们分类有助于削弱其力量。",
        faqs: [
          {
            q: "为什么凌晨三点问题显得更大更可怕?",
            a: "深夜时分,大脑的情绪中心(杏仁核)在没有逻辑前额叶皮层充分平衡的情况下运作。这形成回音室,让小担忧看起来像大危机。",
          },
          {
            q: "我不能用意志力强迫大脑安静吗?",
            a: "试图压抑一个想法,反而会向大脑发出「这个想法很重要」的信号,让它以更强力度回归。我们专注于承认与 redirect,而非压抑。",
          },
        ],
        ctaLabel: "打开我的数字担忧日记",
        seoTitle: "为什么夜晚思绪纷飞｜Somna CBT-I",
        seoDescription:
          "理解夜间纷飞思绪背后的三种心理机制——以及「定时担忧时间」如何给它们专属空间。",
        keywords: ["夜间思绪纷飞", "夜间焦虑", "定时担忧时间", "CBT-I 思绪", "睡不着 胡思乱想"],
      },
      es: {
        title: "Por qué aparecen pensamientos acelerados por la noche",
        eyebrow: "SEMANA 4 · LECCIÓN 10",
        subtitle:
          "La psicología de la activación mental nocturna — y cómo dar a las preocupaciones un espacio dedicado.",
        difficulty: "Intermedio",
        readingTime: "6 min de lectura",
        content: [
          {
            heading: "Una experiencia familiar",
            paras: [
              "Es una experiencia increíblemente familiar para quien atraviesa el insomnio: el mundo se queda completamente en silencio, tu cabeza toca la almohada y tu mente de pronto se enciende. Te encuentras repasando conversaciones antiguas, organizando el horario de mañana o catastrofizando sobre lo cansado que estarás.",
              "Esta activación mental nocturna no es un fallo personal; está impulsada por mecanismos psicológicos predecibles.",
            ],
          },
          {
            heading: "Tres mecanismos",
            paras: [
              "La pérdida de los amortiguadores de distracción: durante el día, tu cerebro está plenamente ocupado con trabajo, conversaciones y estímulos. Al apagar la luz, ese ruido cognitivo desaparece. El silencio crea un vacío natural que permite que las preocupaciones reprimidas afloren.",
              "El efecto de rebote cognitivo: intentar activamente no pensar en tus preocupaciones durante el día consume mucha energía mental. En el momento en que tu cuerpo intenta relajarse por la noche, ese control consciente se afloja y desencadena un rebote natural de pensamientos activos.",
              'Ansiedad condicionada del sueño: como el mal dormir ha sido angustioso, el acto de acostarse es percibido por tu cerebro como un evento estresante. Tu sistema nervioso trata el dormitorio como un desafío, libera cortisol y activa tu mente de resolución de problemas para mantenerte a salvo de la "amenaza" de la vigilia.',
            ],
          },
          {
            heading: "Un enfoque estructurado",
            paras: [
              "Para asentar estos pensamientos acelerados, no intentamos forzar a la mente al silencio. En su lugar, usamos herramientas estructuradas para dar a nuestros pensamientos un espacio dedicado fuera de las horas de sueño, bajando sistemáticamente el volumen del sistema nervioso.",
            ],
          },
        ],
        actionStepTitle: "Paso de acción",
        actionStep:
          'Esta semana, introduce una práctica restauradora llamada "Tiempo Programado de Preocupación". Cada tarde, pon un temporizador de 15 minutos. Siéntate con un cuaderno y anota cada preocupación, tarea o pensamiento ansioso que tengas. Si alguna de esas preocupaciones familiares intenta asomar a las 2:00 a.m., recuérdate con suavidad: "Ya procesé eso durante mi tiempo de preocupación y lo retomaré mañana por la tarde".',
        reflectionTitle: "Reflexión",
        reflection:
          "Observa los temas recurrentes en tus pensamientos nocturnos. ¿Son tareas prácticas de resolución diaria o ansiedades más profundas sobre el propio sueño? Categorizarlos ayuda a quitarles poder.",
        faqs: [
          {
            q: "¿Por qué mis problemas se sienten mucho más grandes y terroríficos a las 3:00 a.m.?",
            a: "En plena noche, el centro emocional de tu cerebro (la amígdala) opera sin el control equilibrador completo de tu córtex prefrontal lógico. Esto crea una cámara de eco donde las pequeñas preocupaciones parecen crisis mayores.",
          },
          {
            q: "¿No puedo simplemente usar la fuerza de voluntad para silenciar mi mente?",
            a: "Intentar suprimir un pensamiento en realidad le señala a tu cerebro que es increíblemente importante, haciéndolo volver con mayor intensidad. Nos centramos en el reconocimiento y la redirección, no en la supresión.",
          },
        ],
        ctaLabel: "Abrir mi diario digital de preocupaciones",
        seoTitle: "Por qué aparecen pensamientos acelerados por la noche | Somna CBT-I",
        seoDescription:
          "Comprende los tres mecanismos psicológicos detrás de los pensamientos acelerados nocturnos — y cómo el Tiempo Programado de Preocupación les da un espacio dedicado.",
        keywords: [
          "pensamientos acelerados de noche",
          "ansiedad nocturna",
          "tiempo programado de preocupación",
          "CBT-I pensamientos acelerados",
          "no puedo dormir pensando",
        ],
      },
      pt: {
        title: "Por que os pensamentos acelerados aparecem à noite",
        eyebrow: "SEMANA 4 · LIÇÃO 10",
        subtitle:
          "A psicologia da ativação mental noturna — e como dar um espaço dedicado às preocupações.",
        difficulty: "Intermediário",
        readingTime: "6 min de leitura",
        content: [
          {
            heading: "Uma experiência familiar",
            paras: [
              "É uma experiência super familiar para quem vive com insônia: o mundo fica totalmente silencioso, sua cabeça toca o travesseiro e, de repente, a mente dispara. Você se pega revivendo conversas antigas, organizando a agenda de amanhã ou imaginando catástrofes sobre o cansaço que vai sentir.",
              "Essa ativação mental noturna não é uma falha pessoal; ela é movida por mecanismos psicológicos previsíveis.",
            ],
          },
          {
            heading: "Três mecanismos",
            paras: [
              "A perda dos filtros de distração: durante o dia, seu cérebro está ocupado com trabalho, conversas e estímulos. Quando você apaga a luz, esse ruído cognitivo some. A quietude cria um vácuo natural, deixando as preocupações reprimidas aflorar.",
              "O efeito de rebote cognitivo: tentar ativamente não pensar nas suas preocupações durante o dia consome muita energia mental. No momento em que o corpo tenta relaxar à noite, esse controle consciente afrouxa, disparando um rebote natural de pensamentos ativos.",
              'Ansiedade condicionada pelo sono: como o mau sono tem sido angustiante, o ato de deitar é percebido pelo cérebro como um evento estressante. Seu sistema nervoso trata o quarto como um desafio, liberando cortisol e ativando a mente de resolução de problemas para te proteger da "ameaça" da vigília.',
            ],
          },
          {
            heading: "Uma abordagem estruturada",
            paras: [
              "Para acalmar esses pensamentos acelerados, não tentamos forçar a mente a ficar em silêncio. Em vez disso, usamos ferramentas estruturadas para dar aos pensamentos um espaço dedicado fora do horário de sono, baixando sistematicamente o volume do sistema nervoso.",
            ],
          },
        ],
        actionStepTitle: "Passo de ação",
        actionStep:
          'Esta semana, introduza uma prática restauradora chamada "Hora Marcada para Preocupações". Toda tarde, programe um timer de 15 minutos. Sente-se com um caderno e anote cada preocupação, tarefa ou pensamento ansioso que vier à cabeça. Se alguma dessas preocupações familiares tentar surgir às 2h da manhã, lembre-se com gentileza: "Eu já processei isso na minha hora de preocupação e vou rever amanhã à tarde."',
        reflectionTitle: "Reflexão",
        reflection:
          "Olhe para os temas recorrentes nos seus pensamentos noturnos. São tarefas práticas de resolução de problemas do dia a dia, ou são ansiedades mais profundas sobre o próprio sono? Categorizá-los ajuda a tirar o poder deles.",
        faqs: [
          {
            q: "Por que meus problemas parecem muito maiores e mais assustadores às 3h da manhã?",
            a: "No fundo da noite, o centro emocional do seu cérebro (a amígdala) funciona sem o controle equilibrador completo do córtex pré-frontal lógico. Isso cria uma câmara de eco onde pequenas preocupações viram crises enormes.",
          },
          {
            q: "Não posso usar pura força de vontade para silenciar a mente?",
            a: "Tentar suprimir um pensamento, na verdade, sinaliza ao cérebro que ele é importantíssimo, fazendo o pensamento voltar com mais força. Focamos em reconhecer e redirecionar, e não em suprimir.",
          },
        ],
        ctaLabel: "Abrir meu diário de preocupações digital",
        seoTitle: "Por que os pensamentos acelerados aparecem à noite | Somna TCC-I",
        seoDescription:
          "Entenda os três mecanismos psicológicos por trás dos pensamentos acelerados noturnos — e como a Hora Marcada para Preocupações dá a eles um espaço dedicado.",
        keywords: [
          "pensamentos acelerados à noite",
          "ansiedade noturna",
          "hora marcada para preocupações",
          "TCC-I pensamentos acelerados",
          "não consigo dormir pensando",
        ],
      },
    },
  },

  // ───────────────────────── Lesson 11: Relaxation Techniques Backed by Research ─────────────────────────
  {
    slug: "relaxation-techniques",
    weekNumber: 4,
    weekSlug: "week-4",
    lessonNumber: 11,
    estimatedMinutes: 7,
    relatedLessonSlugs: [
      "racing-thoughts-at-night",
      "breathing-exercises-for-sleep",
      "leaving-bed-without-frustration",
    ],
    i18n: {
      en: {
        title: "Relaxation Techniques Backed by Research",
        eyebrow: "WEEK 4 · LESSON 11",
        subtitle:
          "Four evidence-based methods to shift your nervous system into parasympathetic peace.",
        difficulty: "Intermediate",
        readingTime: "7 min read",
        content: [
          {
            heading: "Reversing the stress response",
            paras: [
              "Relaxation techniques within a CBT-I framework are not casual suggestions — they are precise, evidence-based tools designed to reverse your body's physiological stress response. Our goal is to lower your heart rate, reduce muscle tension, and guide your nervous system from a state of hyperarousal into deep parasympathetic peace.",
            ],
          },
          {
            heading: "Four validated methods",
            paras: [
              "Progressive Muscle Relaxation (PMR): you systematically tense specific muscle groups for 5 seconds and release them completely for 10 seconds. This physical contrast breaks somatic tension and shifts your focus directly into comforting physical sensations, anchoring a busy mind.",
              "Diaphragmatic Breathing (Belly Breathing): drawing slow breaths deep into your abdomen rather than shallowly into your chest directly stimulates the vagus nerve. This signals your brain to reduce cortisol production and lower your blood pressure.",
              "Guided Imagery: you construct a highly detailed, deeply comforting sensory landscape in your mind (e.g., a secluded forest trail or a sun-warmed beach). By engaging your visual, auditory, and tactile senses, you leave no room for anxious thoughts.",
              "Mindfulness Meditation: you rest your attention on the present moment — like the rise and fall of your breath — while observing passing thoughts and worries with gentle neutrality, without getting caught up in them.",
            ],
          },
          {
            heading: "Creating a soft space",
            paras: [
              'Remember: these practices are not meant to magically "force" sleep. They are designed to create a soft, calm physical space where sleep feels invited to enter naturally.',
            ],
          },
        ],
        actionStepTitle: "Action Step",
        actionStep:
          "Let's experiment this week. Try a different relaxation technique from our audio library on four separate evenings. Note which method brings you the greatest sense of ease, and make that your signature practice for the rest of the module.",
        reflectionTitle: "Reflection",
        reflection:
          "How does your physical body hold stress during the day? Do your shoulders bunch up, or does your jaw clench? Connecting with these daytime signs helps you release tension more effectively at night.",
        faqs: [
          {
            q: "How long should I spend practicing these relaxation techniques?",
            a: "Just 5 to 10 minutes of dedicated practice can create a profound shift in your nervous system. Consistency is far more valuable than duration.",
          },
          {
            q: "What if practicing these techniques makes me feel more anxious?",
            a: "This is a common phenomenon called relaxation-induced anxiety. It happens when focusing intensely on the body makes you feel hyper-aware of your restlessness. If this happens, shift to an external focus like an ambient soundscape or an engaging audiobook.",
          },
        ],
        ctaLabel: "Access the Somna Audio Library",
        seoTitle: "Relaxation Techniques Backed by Research | Somna CBT-I",
        seoDescription:
          "Explore four evidence-based relaxation techniques — PMR, diaphragmatic breathing, guided imagery, and mindfulness — to calm hyperarousal before sleep.",
        keywords: [
          "relaxation techniques sleep",
          "progressive muscle relaxation",
          "diaphragmatic breathing",
          "guided imagery",
          "mindfulness meditation CBT-I",
        ],
      },
      zh: {
        title: "有研究支持的放松技巧",
        eyebrow: "第4周 · 第11课",
        subtitle: "四种循证方法,把神经系统切换到副交感的平静。",
        difficulty: "进阶",
        readingTime: "7 分钟阅读",
        content: [
          {
            heading: "逆转压力反应",
            paras: [
              "CBT-I 框架内的放松技巧不是随意的建议——它们是精确、循证的工具,旨在逆转身体的生理压力反应。目标是降低心率、缓解肌肉紧张,引导神经系统从过度觉醒进入深度的副交感平静。",
            ],
          },
          {
            heading: "四种经过验证的方法",
            paras: [
              "渐进式肌肉放松(PMR):系统地对特定肌群紧张 5 秒,再完全放松 10 秒。这种身体对比打破躯体紧张,把注意力直接带入舒适的身体感受,锚定纷乱的心智。",
              "腹式呼吸(横膈膜呼吸):把缓慢的呼吸深深吸入腹部,而非浅浅吸入胸腔,直接刺激迷走神经。这向大脑发出信号,减少皮质醇分泌、降低血压。",
              "引导想象:在脑海中构建一个高度细致、深度抚慰的感官场景(如幽静林径或阳光海滩)。调动视觉、听觉和触觉,焦虑思绪便无处容身。",
              "正念冥想:把注意力安放在当下——如呼吸的起伏——以温柔的中立观察来来去去的思绪与担忧,不被卷入其中。",
            ],
          },
          {
            heading: "创造柔软的空间",
            paras: [
              "记住:这些练习不是要神奇地「强迫」睡眠。它们旨在创造一个柔软、平静的身体空间,让睡眠感到被邀请,自然降临。",
            ],
          },
        ],
        actionStepTitle: "行动步骤",
        actionStep:
          "本周来做个实验。在四个不同的夜晚,从我们的音频库尝试不同的放松技巧。记录哪种方法带给你最大的轻松感,把它作为本模块余下时间的标志性练习。",
        reflectionTitle: "反思练习",
        reflection:
          "白天你的身体如何承载压力?肩膀是否紧绷?下巴是否咬紧?与这些日间信号连接,有助于你在夜晚更有效地释放紧张。",
        faqs: [
          {
            q: "这些放松技巧该练多久?",
            a: "只需 5–10 分钟专注练习,就能给神经系统带来深刻转变。一致性远比时长重要。",
          },
          {
            q: "如果练习反而让我更焦虑怎么办?",
            a: "这是一种常见现象,叫「放松诱发焦虑」。当过度关注身体时,你会对不安格外敏感。若发生,转向外部焦点,如环境音景或引人入胜的有声书。",
          },
        ],
        ctaLabel: "访问 Somna 音频库",
        seoTitle: "有研究支持的放松技巧｜Somna CBT-I",
        seoDescription:
          "探索四种循证放松技巧——渐进式肌肉放松、腹式呼吸、引导想象与正念——在睡前平息过度觉醒。",
        keywords: ["放松技巧 睡眠", "渐进式肌肉放松", "腹式呼吸", "引导想象", "正念冥想 CBT-I"],
      },
      es: {
        title: "Técnicas de relajación respaldadas por la ciencia",
        eyebrow: "SEMANA 4 · LECCIÓN 11",
        subtitle:
          "Cuatro métodos basados en evidencia para llevar al sistema nervioso a la paz parasimpática.",
        difficulty: "Intermedio",
        readingTime: "7 min de lectura",
        content: [
          {
            heading: "Revertir la respuesta al estrés",
            paras: [
              "Las técnicas de relajación dentro del marco de la CBT-I no son sugerencias casuales — son herramientas precisas y basadas en evidencia, diseñadas para revertir la respuesta fisiológica al estrés de tu cuerpo. El objetivo es bajar tu ritmo cardíaco, reducir la tensión muscular y guiar a tu sistema nervioso desde la hiperactivación hacia una profunda paz parasimpática.",
            ],
          },
          {
            heading: "Cuatro métodos validados",
            paras: [
              "Relajación Muscular Progresiva (RMP): tensas sistemáticamente grupos musulares concretos durante 5 segundos y los liberas por completo durante 10. Este contraste físico rompe la tensión somática y desvía tu atención hacia sensaciones físicas reconfortantes, anclando una mente ocupada.",
              "Respiración diafragmática (respiración abdominal): llevar respiraciones lentas y profundas al abdomen en lugar de cortas al pecho estimula directamente el nervio vago. Esto indica a tu cerebro que reduzca la producción de cortisol y baje la presión arterial.",
              "Imaginería guiada: construyes en tu mente un paisaje sensorial muy detallado y profundamente reconfortante (p. ej., un sendero forestal apartado o una playa soleada). Al comprometer la vista, el oído y el tacto, no dejas espacio para pensamientos ansiosos.",
              "Meditación mindfulness: reposas tu atención en el momento presente — como el subir y bajar de tu respiración — mientras observas los pensamientos y preocupaciones que pasan con neutralidad amable, sin quedarte atrapado en ellos.",
            ],
          },
          {
            heading: "Crear un espacio suave",
            paras: [
              'Recuerda: estas prácticas no pretenden "forzar" el sueño mágicamente. Están diseñadas para crear un espacio físico suave y calmado donde el sueño se sienta invitado a entrar de forma natural.',
            ],
          },
        ],
        actionStepTitle: "Paso de acción",
        actionStep:
          "Experimentemos esta semana. Prueba una técnica de relajación distinta de nuestra biblioteca de audio en cuatro noches separadas. Anota qué método te aporta mayor sensación de calma y conviértelo en tu práctica distintiva para el resto del módulo.",
        reflectionTitle: "Reflexión",
        reflection:
          "¿Cómo mantiene el estrés tu cuerpo físico durante el día? ¿Se te encogen los hombros o se te aprieta la mandíbula? Conectar con estas señales diurnas te ayuda a liberar la tensión con más eficacia por la noche.",
        faqs: [
          {
            q: "¿Cuánto tiempo debo dedicar a practicar estas técnicas de relajación?",
            a: "Solo 5 a 10 minutos de práctica dedicada pueden crear un cambio profundo en tu sistema nervioso. La constancia es mucho más valiosa que la duración.",
          },
          {
            q: "¿Y si practicar estas técnicas me hace sentir más ansioso?",
            a: "Es un fenómeno común llamado ansiedad inducida por la relajación. Ocurre cuando concentrarte intensamente en el cuerpo te hace sentir hipersensible a tu inquietud. Si sucede, cambia a un foco externo como un paisaje sonoro ambiental o un audiolibro absorbente.",
          },
        ],
        ctaLabel: "Acceder a la biblioteca de audio de Somna",
        seoTitle: "Técnicas de relajación respaldadas por la ciencia | Somna CBT-I",
        seoDescription:
          "Explora cuatro técnicas de relajación basadas en evidencia — RMP, respiración diafragmática, imaginería guiada y mindfulness — para calmar la hiperactivación antes de dormir.",
        keywords: [
          "técnicas de relajación sueño",
          "relajación muscular progresiva",
          "respiración diafragmática",
          "imaginería guiada",
          "meditación mindfulness CBT-I",
        ],
      },
      pt: {
        title: "Técnicas de relaxamento respaldadas pela ciência",
        eyebrow: "SEMANA 4 · LIÇÃO 11",
        subtitle:
          "Quatro métodos baseados em evidência para levar o sistema nervoso à paz parassimpática.",
        difficulty: "Intermediário",
        readingTime: "7 min de leitura",
        content: [
          {
            heading: "Reverter a resposta ao estresse",
            paras: [
              "As técnicas de relaxamento dentro da TCC-I não são sugestões casuais — são ferramentas precisas e baseadas em evidência, desenhadas para reverter a resposta fisiológica ao estresse do seu corpo. O objetivo é baixar os batimentos cardíacos, reduzir a tensão muscular e guiar o sistema nervoso da hiperativação para uma paz parassimpática profunda.",
            ],
          },
          {
            heading: "Quatro métodos validados",
            paras: [
              "Relaxamento Muscular Progressivo (RMP): você contrai sistematicamente grupos musculares específicos por 5 segundos e os solta completamente por 10 segundos. Esse contraste físico rompe a tensão somática e desvia sua atenção para sensações físicas reconfortantes, ancorando uma mente ocupada.",
              "Respiração diafragmática (respiração na barriga): levar respirações lentas e fundas para o abdômen, em vez de curtas para o peito, estimula diretamente o nervo vago. Isso sinaliza ao cérebro para reduzir a produção de cortisol e baixar a pressão arterial.",
              "Imagética guiada: você constrói na mente uma paisagem sensorial bem detalhada e profundamente reconfortante (ex.: uma trilha na floresta isolada ou uma praia aquecida pelo sol). Ao engajar visão, audição e tato, não sobra espaço para pensamentos ansiosos.",
              "Meditação mindfulness: você repousa a atenção no momento presente — como a subida e descida da respiração — enquanto observa os pensamentos e preocupações que passam com neutralidade gentil, sem se prender a eles.",
            ],
          },
          {
            heading: "Criar um espaço suave",
            paras: [
              'Lembre-se: essas práticas não servem para "forçar" o sono magicamente. Elas são desenhadas para criar um espaço físico suave e calmo onde o sono se sinta convidado a entrar de forma natural.',
            ],
          },
        ],
        actionStepTitle: "Passo de ação",
        actionStep:
          "Vamos experimentar esta semana. Teste uma técnica de relaxamento diferente da nossa biblioteca de áudio em quatro noites separadas. Anote qual método te traz mais sensação de calma e transforme-o na sua prática de destaque para o resto do módulo.",
        reflectionTitle: "Reflexão",
        reflection:
          "Como o estresse se mantém no seu corpo físico durante o dia? Seus ombros sobem ou sua mandíbula aperta? Conectar-se com esses sinais diurnos ajuda a liberar a tensão com mais eficácia à noite.",
        faqs: [
          {
            q: "Quanto tempo devo dedicar a praticar essas técnicas de relaxamento?",
            a: "Só 5 a 10 minutos de prática focada já podem criar uma mudança profunda no seu sistema nervoso. A constância é muito mais valiosa do que a duração.",
          },
          {
            q: "E se praticar essas técnicas me deixar mais ansioso?",
            a: "É um fenômeno comum chamado ansiedade induzida pelo relaxamento. Acontece quando focar intensamente no corpo te deixa hipersensível à sua inquietação. Se ocorrer, mude para um foco externo, como uma paisagem sonora ambiental ou um audiolivro envolvente.",
          },
        ],
        ctaLabel: "Acessar a biblioteca de áudio do Somna",
        seoTitle: "Técnicas de relaxamento respaldadas pela ciência | Somna TCC-I",
        seoDescription:
          "Explore quatro técnicas de relaxamento baseadas em evidência — RMP, respiração diafragmática, imagética guiada e mindfulness — para acalmar a hiperativação antes de dormir.",
        keywords: [
          "técnicas de relaxamento sono",
          "relaxamento muscular progressivo",
          "respiração diafragmática",
          "imagética guiada",
          "meditação mindfulness TCC-I",
        ],
      },
    },
  },

  // ───────────────────────── Lesson 12: Breathing Exercises for Sleep ─────────────────────────
  {
    slug: "breathing-exercises-for-sleep",
    weekNumber: 4,
    weekSlug: "week-4",
    lessonNumber: 12,
    estimatedMinutes: 6,
    relatedLessonSlugs: ["relaxation-techniques", "racing-thoughts-at-night", "how-sleep-works"],
    i18n: {
      en: {
        title: "Breathing Exercises for Sleep",
        eyebrow: "WEEK 4 · LESSON 12",
        subtitle: "Three breathing structures — 4-7-8, box, and coherent — to soothe hyperarousal.",
        difficulty: "Beginner",
        readingTime: "6 min read",
        content: [
          {
            heading: "The bridge to your nervous system",
            paras: [
              "Your breath is the most accessible, immediate bridge between your conscious mind and your autonomic nervous system. When sleep anxiety takes over, your breathing naturally becomes rapid and shallow, keeping your brain in a state of high alert. By intentionally shifting your breathing patterns, you can instantly tell your nervous system that you are completely safe.",
            ],
          },
          {
            heading: "Three effective structures",
            paras: [
              "1. The 4-7-8 Technique (developed by Dr. Andrew Weil): inhale quietly through your nose for 4 seconds; hold your breath gently for a count of 7 seconds; exhale completely through your mouth with a soft whoosh sound for 8 seconds. The extended exhale directly activates the vagus nerve, naturally slowing your heart rate.",
              "2. Box Breathing (Square Breathing): employed by high-stress professionals and elite athletes — inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds, hold for 4 seconds. The perfectly equal structure balances oxygen levels and gives your mind a steady rhythm to focus on.",
              "3. Coherent Breathing (Resonant Breathing): breathe in for 5 seconds and breathe out for 5 seconds, maintaining a smooth, continuous loop without holding. This optimizes Heart Rate Variability (HRV), bringing your heart, lungs, and mind into perfect harmony.",
            ],
          },
        ],
        actionStepTitle: "Action Step",
        actionStep:
          "Tonight, spend 5 minutes practicing one of these breathing techniques right before your bedtime window opens. Pay close attention to how the physical sensations of your body shift as you complete each cycle.",
        reflectionTitle: "Reflection",
        reflection:
          "Notice the natural rhythm of your breath throughout your day. When you feel stressed or rushed, how does it change? How can you use these micro-sessions to steady your day?",
        faqs: [
          {
            q: "Can breathing practices completely replace my sleeping medication?",
            a: "While breathwork is an incredibly powerful tool, it delivers its best results when woven into a complete CBT-I program that addresses your underlying behaviors and thought patterns.",
          },
          {
            q: "I find it difficult to hold my breath for 7 seconds. Is that okay?",
            a: "Absolutely. The absolute duration matters less than the relative ratio. You can speed up the count (e.g., 2-3.5-4) as long as your out-breath remains twice as long as your in-breath.",
          },
        ],
        ctaLabel: "Begin My Breathing Practice",
        seoTitle: "Breathing Exercises for Sleep: 4-7-8, Box & Coherent | Somna",
        seoDescription:
          "Learn three evidence-based breathing exercises for sleep — 4-7-8, box breathing, and coherent breathing — to soothe hyperarousal and invite rest.",
        keywords: [
          "breathing exercises for sleep",
          "4-7-8 breathing",
          "box breathing",
          "coherent breathing",
          "sleep breathing techniques",
        ],
      },
      zh: {
        title: "助眠呼吸练习",
        eyebrow: "第4周 · 第12课",
        subtitle: "三种呼吸结构——4-7-8、方块与共振——平息过度觉醒。",
        difficulty: "入门",
        readingTime: "6 分钟阅读",
        content: [
          {
            heading: "通往神经系统的桥梁",
            paras: [
              "呼吸是意识与自主神经系统之间最易得、最即时的桥梁。当睡眠焦虑袭来,呼吸自然变得急促浅短,让大脑保持高度警觉。通过有意识地改变呼吸模式,你能瞬间告诉神经系统:你完全安全。",
            ],
          },
          {
            heading: "三种有效结构",
            paras: [
              "1. 4-7-8 呼吸法(Andrew Weil 博士创立):用鼻子安静吸气 4 秒;轻柔屏息 7 秒;用嘴完全呼气 8 秒,发出轻柔的「呼」声。延长的呼气直接激活迷走神经,自然减缓心率。",
              "2. 方块呼吸(正方形呼吸):高压专业人士与精英运动员常用——吸气 4 秒、屏息 4 秒、呼气 4 秒、屏息 4 秒。完全等长的结构平衡氧气水平,给心智一个稳定的节奏聚焦。",
              "3. 共振呼吸(谐振呼吸):吸气 5 秒、呼气 5 秒,保持平滑连续的循环不屏息。这优化心率变异性(HRV),让心、肺、心智完美协调。",
            ],
          },
        ],
        actionStepTitle: "行动步骤",
        actionStep:
          "今晚,在睡眠窗口开启前,花 5 分钟练习其中一种呼吸法。仔细留意每完成一个循环,身体感受如何变化。",
        reflectionTitle: "反思练习",
        reflection:
          "留意一天中呼吸的自然节奏。感到压力或匆忙时,它如何变化?你如何用这些微练习稳住一天?",
        faqs: [
          {
            q: "呼吸练习能完全替代安眠药吗?",
            a: "虽然呼吸法是极为有力的工具,但最佳效果出现在它融入完整的 CBT-I 方案、同时处理潜在行为与思维模式时。",
          },
          {
            q: "我屏息 7 秒有困难,可以吗?",
            a: "完全可以。绝对时长不如相对比例重要。你可以加快计数(如 2-3.5-4),只要呼气时长是吸气的两倍。",
          },
        ],
        ctaLabel: "开始我的呼吸练习",
        seoTitle: "助眠呼吸练习:4-7-8、方块与共振｜Somna",
        seoDescription:
          "学习三种循证助眠呼吸练习——4-7-8、方块呼吸与共振呼吸——平息过度觉醒,邀请休息。",
        keywords: ["助眠呼吸练习", "4-7-8 呼吸", "方块呼吸", "共振呼吸", "睡眠呼吸技巧"],
      },
      es: {
        title: "Ejercicios de respiración para el sueño",
        eyebrow: "SEMANA 4 · LECCIÓN 12",
        subtitle:
          "Tres estructuras de respiración — 4-7-8, cuadrada y coherente — para calmar la hiperactivación.",
        difficulty: "Inicial",
        readingTime: "6 min de lectura",
        content: [
          {
            heading: "El puente hacia tu sistema nervioso",
            paras: [
              "Tu respiración es el puente más accesible e inmediato entre tu mente consciente y tu sistema nervioso autónomo. Cuando se apodera la ansiedad del sueño, tu respiración se vuelve rápida y superficial, manteniendo al cerebro en estado de máxima alerta. Al cambiar intencionadamente tus patrones de respiración, puedes decirle al instante a tu sistema nervioso que estás completamente a salvo.",
            ],
          },
          {
            heading: "Tres estructuras eficaces",
            paras: [
              "1. Técnica 4-7-8 (desarrollada por el Dr. Andrew Weil): inhala silenciosamente por la nariz durante 4 segundos; contiene la respiración suavemente contando hasta 7; exhala por completo por la boca con un suave sonido durante 8 segundos. La exhalación prolongada activa directamente el nervio vago y ralentiza el ritmo cardíaco.",
              "2. Respiración cuadrada (box breathing): usada por profesionales de alto estrés y atletas de élite — inhala 4 segundos, mantén 4, exhala 4, mantén 4. La estructura perfectamente igualada equilibra los niveles de oxígeno y da a tu mente un ritmo estable en el que concentrarse.",
              "3. Respiración coherente (resonante): inhala 5 segundos y exhala 5 segundos, manteniendo un bucle suave y continuo sin retener. Esto optimiza la Variabilidad de la Frecuencia Cardíaca (VFC), llevando al corazón, los pulmones y la mente a una armonía perfecta.",
            ],
          },
        ],
        actionStepTitle: "Paso de acción",
        actionStep:
          "Esta noche, dedica 5 minutos a practicar una de estas técnicas de respiración justo antes de que se abra tu ventana de sueño. Presta mucha atención a cómo cambian las sensaciones físicas de tu cuerpo al completar cada ciclo.",
        reflectionTitle: "Reflexión",
        reflection:
          "Observa el ritmo natural de tu respiración a lo largo del día. Cuando te sientes estresado o apresurado, ¿cómo cambia? ¿Cómo puedes usar estas micro-sesiones para estabilizar tu día?",
        faqs: [
          {
            q: "¿Pueden las prácticas de respiración reemplazar por completo mi medicación para dormir?",
            a: "Aunque el trabajo respiratorio es una herramienta increíblemente potente, ofrece sus mejores resultados cuando se integra en un programa completo de CBT-I que aborde tus conductas y patrones de pensamiento subyacentes.",
          },
          {
            q: "Me cuesta contener la respiración 7 segundos. ¿Está bien?",
            a: "Por supuesto. La duración absoluta importa menos que la proporción relativa. Puedes acelerar el conteo (p. ej., 2-3,5-4) siempre que tu exhalación siga siendo el doble de larga que la inhalación.",
          },
        ],
        ctaLabel: "Comenzar mi práctica de respiración",
        seoTitle: "Ejercicios de respiración para el sueño: 4-7-8, cuadrada y coherente | Somna",
        seoDescription:
          "Aprende tres ejercicios de respiración basados en evidencia para el sueño — 4-7-8, respiración cuadrada y coherente — para calmar la hiperactivación e invitar al descanso.",
        keywords: [
          "ejercicios de respiración para dormir",
          "respiración 4-7-8",
          "respiración cuadrada",
          "respiración coherente",
          "técnicas de respiración para el sueño",
        ],
      },
      pt: {
        title: "Exercícios de respiração para o sono",
        eyebrow: "SEMANA 4 · LIÇÃO 12",
        subtitle:
          "Três estruturas de respiração — 4-7-8, quadrada e coerente — para acalmar a hiperativação.",
        difficulty: "Iniciante",
        readingTime: "6 min de leitura",
        content: [
          {
            heading: "A ponte para o sistema nervoso",
            paras: [
              "Sua respiração é a ponte mais acessível e imediata entre a mente consciente e o sistema nervoso autônomo. Quando a ansiedade com o sono toma conta, sua respiração fica naturalmente rápida e rasa, mantendo o cérebro em estado de alerta máximo. Ao mudar intencionalmente os padrões de respiração, você pode dizer instantaneamente ao sistema nervoso que está totalmente seguro.",
            ],
          },
          {
            heading: "Três estruturas eficazes",
            paras: [
              "1. A técnica 4-7-8 (desenvolvida pelo Dr. Andrew Weil): inspire suavemente pelo nariz por 4 segundos; segure a respiração de leve contando até 7 segundos; expire completamente pela boca com um som suave de sopro por 8 segundos. A expiração mais longa ativa diretamente o nervo vago, desacelerando naturalmente os batimentos cardíacos.",
              "2. Respiração quadrada (caixa): usada por profissionais de alto estresse e atletas de elite — inspire por 4 segundos, segure por 4 segundos, expire por 4 segundos, segure por 4 segundos. A estrutura perfeitamente igual equilibra os níveis de oxigênio e dá à mente um ritmo estável para focar.",
              "3. Respiração coerente (ressonante): inspire por 5 segundos e expire por 5 segundos, mantendo um ciclo suave e contínuo, sem pausas. Isso otimiza a Variabilidade da Frequência Cardíaca (VFC), colocando coração, pulmões e mente em harmonia perfeita.",
            ],
          },
        ],
        actionStepTitle: "Passo de ação",
        actionStep:
          "Esta noite, escolha uma das três estruturas de respiração. Pratique por 5 ciclos completos antes de se deitar. Se a mente acelerada retornar à noite, volte gentilmente ao padrão escolhido — sem se julgar, apenas respirando.",
        reflectionTitle: "Reflexão",
        reflection:
          "Qual das três estruturas de respiração parece mais natural para você? Por quê? Confiar no seu instinto ajuda a construir uma prática que você vai manter a longo prazo.",
        faqs: [
          {
            q: "Preciso fazer as três técnicas todas as noites?",
            a: "Não. Escolha uma que se sinta bem para você e pratique com constância. A regularidade é muito mais importante do que a quantidade de técnicas diferentes.",
          },
          {
            q: "Tenho dificuldade em segurar a respiração por 7 segundos. Tudo bem?",
            a: "Com certeza. A duração absoluta importa menos do que a proporção relativa. Você pode acelerar a contagem (ex.: 2-3,5-4), desde que a expiração continue sendo o dobro da inspiração.",
          },
        ],
        ctaLabel: "Começar minha prática de respiração",
        seoTitle: "Exercícios de respiração para o sono: 4-7-8, quadrada e coerente | Somna",
        seoDescription:
          "Aprenda três exercícios de respiração baseados em evidência para o sono — 4-7-8, respiração quadrada e coerente — para acalmar a hiperativação e convidar o descanso.",
        keywords: [
          "exercícios de respiração para dormir",
          "respiração 4-7-8",
          "respiração quadrada",
          "respiração coerente",
          "técnicas de respiração para o sono",
        ],
      },
    },
  },
];
