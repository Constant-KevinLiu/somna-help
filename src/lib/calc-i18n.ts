import type { Lang } from "./i18n";

export type FAQ = { q: string; a: string };

type NavBlock = {
  tools: string;
  section: string;
  cycle: string;
  sleep: string;
  bedtime: string;
  nap: string;
  melatonin: string;
};

type RelatedBlock = {
  title: string;
  cycleDesc: string;
  sleepDesc: string;
  bedtimeDesc: string;
  napDesc: string;
  melatoninDesc: string;
  guide: string;
  guideDesc: string;
};

type CommonBlock = {
  faqTitle: string;
  bestBadge: string;
  cyclesWord: string;
  hoursShort: string;
  minShort: string;
};

type SleepCalc = {
  meta: { title: string; desc: string };
  eyebrow: string;
  title: string;
  sub: string;
  ageLabel: string;
  ages: { teen: string; young: string; adult: string; older: string };
  ageNotes: { teen: string; young: string; adult: string; older: string };
  wakeLabel: string;
  recommended: string;
  hoursWord: string;
  suggestedBedtime: string;
  toWake: (time: string) => string;
  cta: string;
  whyTitle: string;
  whyParas: [string, string, string];
  faqs: FAQ[];
};

type BedtimeCalc = {
  meta: { title: string; desc: string };
  eyebrow: string;
  title: string;
  sub: string;
  wakeLabel: string;
  suggested: string;
  cyclesSuffix: (h: number, c: number) => string;
  bestLabel: string;
  note: string;
  cta: string;
  faqs: FAQ[];
};

type NapCalc = {
  meta: { title: string; desc: string };
  eyebrow: string;
  title: string;
  sub: string;
  currentTime: string;
  napLength: string;
  wakeSuggestions: string;
  benefits: Record<number, { label: string; desc: string }>;
  minUnit: string;
  cta: string;
  quickCards: Array<{ len: string; desc: string }>;
  faqs: FAQ[];
};

type MelatoninCalc = {
  meta: { title: string; desc: string };
  eyebrow: string;
  title: string;
  sub: string;
  disclaimer: string;
  bedtimeLabel: string;
  onsetLabel: string;
  onset: { fast: string; average: string; slow: string };
  recommendedWindow: string;
  windowNote: (bedtime: string, onsetMin: number) => string;
  cta: string;
  infoCards: Array<{ title: string; desc: string }>;
  faqs: FAQ[];
};

type CycleCalc = {
  meta: { title: string; desc: string };
};

export type CalcDict = {
  nav: NavBlock;
  related: RelatedBlock;
  common: CommonBlock;
  cycle: CycleCalc;
  sleep: SleepCalc;
  bedtime: BedtimeCalc;
  nap: NapCalc;
  melatonin: MelatoninCalc;
};

const en: CalcDict = {
  nav: {
    tools: "Tools",
    section: "Sleep Calculators",
    cycle: "Sleep Cycle Calculator",
    sleep: "Sleep Calculator",
    bedtime: "Bedtime Calculator",
    nap: "Nap Calculator",
    melatonin: "Melatonin Calculator",
  },
  related: {
    title: "Related Tools",
    cycleDesc: "Plan around 90-minute sleep cycles.",
    sleepDesc: "How much sleep you need by age.",
    bedtimeDesc: "Best time to go to bed.",
    napDesc: "Perfect nap length for energy.",
    melatoninDesc: "When to take melatonin.",
    guide: "CBT-I Guide",
    guideDesc: "Drug-free, science-backed program.",
  },
  common: {
    faqTitle: "Frequently asked questions",
    bestBadge: "Best",
    cyclesWord: "cycles",
    hoursShort: "h sleep",
    minShort: "min",
  },
  cycle: {
    meta: {
      title: "Sleep Cycle Calculator — Somna",
      desc: "Find your ideal bedtime and wake time using natural 90-minute sleep cycles.",
    },
  },
  sleep: {
    meta: {
      title: "Sleep Calculator – Find Your Ideal Sleep Duration | Somna",
      desc: "Calculate how much sleep you need based on your age and wake-up time.",
    },
    eyebrow: "SLEEP CALCULATOR",
    title: "Find Your Ideal Sleep Duration",
    sub: "Science-backed recommendations based on your age and desired wake-up time.",
    ageLabel: "Age group",
    ages: {
      teen: "Teen (13–17)",
      young: "Young Adult (18–25)",
      adult: "Adult (26–64)",
      older: "Older Adult (65+)",
    },
    ageNotes: {
      teen: "Teens need more sleep to support growth and brain development.",
      young: "Most young adults perform best with 7–9 hours of sleep.",
      adult: "Adults typically thrive on 7–9 hours of consistent sleep.",
      older: "Sleep tends to be lighter with age — aim for 7–8 hours.",
    },
    wakeLabel: "Desired wake-up time",
    recommended: "Recommended sleep",
    hoursWord: "hours",
    suggestedBedtime: "Suggested bedtime",
    toWake: (t) => `To wake up at ${t} feeling rested.`,
    cta: "Learn About Sleep Cycles",
    whyTitle: "Why age-based sleep matters",
    whyParas: [
      "Sleep needs shift across the lifespan. Hormonal changes, brain development, and circadian rhythm all influence how much rest your body requires.",
      "Consistency is often more important than the exact number of hours. Going to bed and waking at the same time daily helps your internal clock stay stable.",
      "If you regularly feel unrested even within these ranges, consider tracking your sleep for a few weeks to spot patterns.",
    ],
    faqs: [
      {
        q: "How much sleep do I actually need?",
        a: "Most adults need 7–9 hours of sleep per night. Teens need 8–10, and older adults often do best with 7–8 hours. Quality matters as much as quantity.",
      },
      {
        q: "What happens if I sleep less than recommended?",
        a: "Short-term, you may feel groggy, irritable, or unfocused. Chronic sleep loss is linked to mood, metabolic, and cardiovascular issues.",
      },
      {
        q: "Can I make up for lost sleep on weekends?",
        a: "Partially — but the most reliable path is a consistent schedule. Large weekend shifts can disrupt your circadian rhythm.",
      },
      {
        q: "Is more sleep always better?",
        a: "No. Routinely sleeping more than 9–10 hours can correlate with health issues. Aim for the range that leaves you feeling rested.",
      },
    ],
  },
  bedtime: {
    meta: {
      title: "Bedtime Calculator – Find the Best Time to Go to Bed | Somna",
      desc: "Calculate your ideal bedtime based on sleep cycles and desired wake-up time.",
    },
    eyebrow: "BEDTIME CALCULATOR",
    title: "Find the Best Time to Go to Bed",
    sub: "Wake between sleep cycles — feel clearer, calmer, and more refreshed.",
    wakeLabel: "I want to wake up at",
    suggested: "Suggested bedtimes",
    cyclesSuffix: (h, c) => `${h}h sleep · ${c} cycles`,
    bestLabel: "Best",
    note: "Each option allows you to wake up between sleep cycles. Assumes ~15 min to fall asleep.",
    cta: "Try Sleep Cycle Calculator",
    faqs: [
      {
        q: "Why does a 90-minute sleep cycle matter?",
        a: "Each cycle moves through light, deep, and REM sleep. Waking at the end of a cycle (rather than mid-deep-sleep) helps you feel less groggy.",
      },
      {
        q: "How many cycles should I aim for?",
        a: "Most adults feel best with 5–6 cycles (about 7.5–9 hours). Athletes or those recovering from sleep debt may benefit from 7.",
      },
      {
        q: "Is the 90-minute cycle exact?",
        a: "It's an average. Real cycles range 70–120 minutes and vary by age and individual. Use the bedtime ranges as guidance, not a rigid rule.",
      },
      {
        q: "What if I can't fall asleep in 15 minutes?",
        a: "That's normal occasionally. If it happens nightly, CBT-I techniques can help recalibrate your sleep onset.",
      },
    ],
  },
  nap: {
    meta: {
      title: "Nap Calculator – Find the Perfect Nap Length | Somna",
      desc: "Calculate the ideal nap duration for energy, alertness, and recovery.",
    },
    eyebrow: "NAP CALCULATOR",
    title: "Find the Perfect Nap Length",
    sub: "Short, intentional naps can restore energy, focus, and mood — without disrupting your night.",
    currentTime: "Current time",
    napLength: "Nap length",
    wakeSuggestions: "Wake-up suggestions",
    minUnit: "min",
    benefits: {
      10: { label: "Quick reset", desc: "A short pause to ease mental fatigue." },
      20: { label: "Power nap", desc: "Boost alertness without grogginess." },
      30: { label: "Memory boost", desc: "Improves recall and learning." },
      60: { label: "Cognitive lift", desc: "Helpful, but may cause some sleep inertia." },
      90: { label: "Full sleep cycle", desc: "Restores creativity and emotional balance." },
    },
    cta: "Read Sleep Hygiene Guide",
    quickCards: [
      { len: "20 min", desc: "Boost alertness without grogginess." },
      { len: "30 min", desc: "Improve memory consolidation." },
      { len: "90 min", desc: "A full sleep cycle — wake refreshed." },
    ],
    faqs: [
      {
        q: "When is the best time to nap?",
        a: "Most people benefit from napping between 1:00 PM and 3:00 PM, aligned with the natural afternoon dip in alertness.",
      },
      {
        q: "How long should a nap be?",
        a: "10–20 minutes for a quick energy boost. 90 minutes for a full sleep cycle. Avoid 30–60 minutes if you wake easily groggy.",
      },
      {
        q: "Will napping hurt my nighttime sleep?",
        a: "Short naps usually don't. Long or late-afternoon naps can reduce sleep pressure and delay bedtime, especially if you have insomnia.",
      },
      {
        q: "Are naps a sign of poor sleep?",
        a: "Not necessarily. Many cultures nap by design. But if you need long naps daily to function, it may signal insufficient nighttime sleep.",
      },
    ],
  },
  melatonin: {
    meta: {
      title: "Melatonin Calculator – When Should I Take Melatonin? | Somna",
      desc: "Estimate the best time to take melatonin based on your bedtime and sleep schedule.",
    },
    eyebrow: "MELATONIN CALCULATOR",
    title: "When Should I Take Melatonin?",
    sub: "Educational guidance to estimate timing — not medical advice.",
    disclaimer:
      "This tool is for educational purposes and is not medical advice. Consult a healthcare professional before using melatonin supplements.",
    bedtimeLabel: "Target bedtime",
    onsetLabel: "Typical sleep onset delay",
    onset: { fast: "Fast (~15 min)", average: "Average (~30 min)", slow: "Slow (~60 min)" },
    recommendedWindow: "Recommended window",
    windowNote: (bedtime, onsetMin) =>
      `Take melatonin roughly 1–2 hours before your target bedtime of ${bedtime}. Your typical sleep onset (~${onsetMin} min) suggests starting your wind-down routine even earlier.`,
    cta: "Explore CBT-I Instead of Sleep Aids",
    infoCards: [
      {
        title: "What is melatonin?",
        desc: "A natural hormone that signals nighttime to your body. Supplements aim to nudge your circadian rhythm earlier.",
      },
      {
        title: "When should you take it?",
        desc: "Typically 1–2 hours before bedtime, in low doses (0.3–1 mg). Larger doses are not necessarily more effective.",
      },
      {
        title: "Who should avoid it?",
        desc: "Pregnant or nursing individuals, children, and people on certain medications should consult a clinician first.",
      },
    ],
    faqs: [
      {
        q: "What is melatonin?",
        a: "Melatonin is a hormone your brain produces in response to darkness. It signals your body that it's time to sleep, helping regulate the circadian rhythm.",
      },
      {
        q: "When should I take melatonin?",
        a: "Generally 1–2 hours before your target bedtime. Lower doses (0.3–1 mg) timed correctly are often more effective than larger doses taken at bedtime.",
      },
      {
        q: "Who should avoid melatonin?",
        a: "People who are pregnant, nursing, taking certain medications (blood thinners, immunosuppressants), or managing autoimmune or seizure disorders should consult a clinician first.",
      },
      {
        q: "Is melatonin a sleeping pill?",
        a: "No. It doesn't sedate you — it signals timing. For chronic insomnia, behavioral approaches like CBT-I are considered first-line treatment.",
      },
    ],
  },
};

const zh: CalcDict = {
  nav: {
    tools: "工具",
    section: "睡眠计算工具",
    cycle: "睡眠周期计算器",
    sleep: "睡眠时长计算器",
    bedtime: "最佳入睡时间计算器",
    nap: "小睡计算器",
    melatonin: "褪黑素时间计算器",
  },
  related: {
    title: "相关工具",
    cycleDesc: "围绕 90 分钟睡眠周期进行规划。",
    sleepDesc: "根据年龄了解所需的睡眠时长。",
    bedtimeDesc: "找到最适合的上床时间。",
    napDesc: "恢复能量的理想小睡时长。",
    melatoninDesc: "服用褪黑素的合适时机。",
    guide: "CBT-I 指南",
    guideDesc: "无需药物、以科学为基础的课程。",
  },
  common: {
    faqTitle: "常见问题",
    bestBadge: "推荐",
    cyclesWord: "个周期",
    hoursShort: " 小时睡眠",
    minShort: "分钟",
  },
  cycle: {
    meta: {
      title: "睡眠周期计算器 — Somna",
      desc: "依据自然的 90 分钟睡眠周期,找到最适合你的入睡与起床时间。",
    },
  },
  sleep: {
    meta: {
      title: "睡眠时长计算器 — 找到你的理想睡眠时长 | Somna",
      desc: "根据你的年龄和起床时间,计算所需的睡眠时长。",
    },
    eyebrow: "睡眠时长计算器",
    title: "找到你的理想睡眠时长",
    sub: "依据你的年龄和理想起床时间,提供有科学支持的睡眠建议。",
    ageLabel: "年龄组",
    ages: {
      teen: "青少年 (13–17 岁)",
      young: "青年 (18–25 岁)",
      adult: "成年人 (26–64 岁)",
      older: "老年人 (65 岁以上)",
    },
    ageNotes: {
      teen: "青少年需要更多睡眠以支持身体发育和大脑成长。",
      young: "大多数青年人在 7–9 小时睡眠下状态最佳。",
      adult: "成年人通常在 7–9 小时规律睡眠中表现最好。",
      older: "随着年龄增长睡眠会变浅,建议保持 7–8 小时。",
    },
    wakeLabel: "理想起床时间",
    recommended: "推荐睡眠时长",
    hoursWord: "小时",
    suggestedBedtime: "建议入睡时间",
    toWake: (t) => `以便在 ${t} 醒来时感到充分休息。`,
    cta: "了解睡眠周期",
    whyTitle: "为什么按年龄考虑睡眠很重要",
    whyParas: [
      "睡眠需求会随着年龄变化。荷尔蒙、大脑发育以及昼夜节律,都会影响身体所需的休息量。",
      "相比于精确的小时数,规律往往更为重要。每天在相同的时间入睡和起床,有助于稳定生物钟。",
      "如果你在建议的范围内仍感到疲惫,可以连续记录几周睡眠,以观察规律。",
    ],
    faqs: [
      {
        q: "我到底需要多少睡眠?",
        a: "大多数成年人每晚需要 7–9 小时睡眠。青少年需要 8–10 小时,老年人通常 7–8 小时为宜。睡眠质量与时长同样重要。",
      },
      {
        q: "如果睡眠少于推荐时长会怎样?",
        a: "短期内你可能会感到困倦、易怒或注意力不集中。长期睡眠不足与情绪、代谢和心血管问题相关。",
      },
      {
        q: "可以在周末补觉吗?",
        a: "部分可以,但最可靠的方法是保持规律作息。周末作息差异过大会扰乱昼夜节律。",
      },
      {
        q: "睡得越多越好吗?",
        a: "不一定。长期睡眠超过 9–10 小时也可能与某些健康问题相关。请以让自己感到充分休息的时长为目标。",
      },
    ],
  },
  bedtime: {
    meta: {
      title: "最佳入睡时间计算器 — 何时上床最合适 | Somna",
      desc: "根据睡眠周期和理想起床时间,计算最佳的入睡时间。",
    },
    eyebrow: "最佳入睡时间计算器",
    title: "找到最适合上床的时间",
    sub: "在睡眠周期之间醒来,让你感到更清醒、更平静、更精神。",
    wakeLabel: "我希望在以下时间醒来",
    suggested: "推荐的入睡时间",
    cyclesSuffix: (h, c) => `${h} 小时睡眠 · ${c} 个周期`,
    bestLabel: "推荐",
    note: "每个选项都能让你在睡眠周期之间醒来。已包含约 15 分钟入睡时间。",
    cta: "试试睡眠周期计算器",
    faqs: [
      {
        q: "为什么 90 分钟的睡眠周期很重要?",
        a: "每个周期会经历浅睡、深睡和快速眼动睡眠。在周期末尾醒来(而非深睡中)能减少昏沉感。",
      },
      {
        q: "我应该追求几个睡眠周期?",
        a: "大多数成年人 5–6 个周期(约 7.5–9 小时)感觉最佳。运动员或需要补眠的人可能受益于 7 个周期。",
      },
      {
        q: "90 分钟的周期是精确的吗?",
        a: "这是一个平均值。实际周期为 70–120 分钟,因人因龄而异。请将建议作为参考,而非严格的规则。",
      },
      {
        q: "如果我无法在 15 分钟内入睡怎么办?",
        a: "偶尔出现是正常的。如果每晚都如此,CBT-I 的方法可以帮助调整入睡节奏。",
      },
    ],
  },
  nap: {
    meta: {
      title: "小睡计算器 — 找到完美的小睡时长 | Somna",
      desc: "计算能恢复能量、专注力和情绪的理想小睡时长。",
    },
    eyebrow: "小睡计算器",
    title: "找到完美的小睡时长",
    sub: "短暂、有节制的小睡可以恢复能量、专注力和情绪 —— 又不影响夜间睡眠。",
    currentTime: "当前时间",
    napLength: "小睡时长",
    wakeSuggestions: "建议起床时间",
    minUnit: "分钟",
    benefits: {
      10: { label: "快速调整", desc: "短暂休息,缓解疲劳。" },
      20: { label: "能量补充", desc: "提升警觉度而不昏沉。" },
      30: { label: "记忆增强", desc: "改善记忆与学习能力。" },
      60: { label: "认知提升", desc: "有益,但可能略感醒后倦怠。" },
      90: { label: "完整睡眠周期", desc: "恢复创造力与情绪平衡。" },
    },
    cta: "阅读睡眠卫生指南",
    quickCards: [
      { len: "20 分钟", desc: "提升警觉度而不昏沉。" },
      { len: "30 分钟", desc: "增强记忆巩固。" },
      { len: "90 分钟", desc: "一个完整的睡眠周期 —— 醒来更清爽。" },
    ],
    faqs: [
      {
        q: "什么时候小睡最好?",
        a: "大多数人在下午 1 点到 3 点之间小睡效果最好,正好契合自然的午后警觉度下降。",
      },
      {
        q: "小睡多长时间合适?",
        a: "10–20 分钟可快速补充能量;90 分钟为完整的睡眠周期。若容易醒后昏沉,请避免 30–60 分钟的小睡。",
      },
      {
        q: "小睡会影响夜间睡眠吗?",
        a: "短暂小睡通常不会。过长或下午晚些时候的小睡可能降低睡眠压力,延迟入睡时间,失眠者尤其需要注意。",
      },
      {
        q: "经常小睡是睡眠不好的表现吗?",
        a: "不一定。许多文化都有小睡的传统。但如果每天都需要长时间小睡才能维持状态,可能意味着夜间睡眠不足。",
      },
    ],
  },
  melatonin: {
    meta: {
      title: "褪黑素时间计算器 — 什么时候服用褪黑素? | Somna",
      desc: "根据你的入睡时间和作息,估算服用褪黑素的最佳时机。",
    },
    eyebrow: "褪黑素时间计算器",
    title: "什么时候服用褪黑素?",
    sub: "用于估算时间的教育性参考 —— 并非医疗建议。",
    disclaimer: "本工具仅供教育参考,不构成医疗建议。在使用褪黑素补充剂前,请咨询专业医生。",
    bedtimeLabel: "目标入睡时间",
    onsetLabel: "通常入睡所需时间",
    onset: { fast: "较快 (~15 分钟)", average: "一般 (~30 分钟)", slow: "较慢 (~60 分钟)" },
    recommendedWindow: "建议服用窗口",
    windowNote: (bedtime, onsetMin) =>
      `建议在目标入睡时间 ${bedtime} 之前约 1–2 小时服用褪黑素。你通常需要约 ${onsetMin} 分钟才能入睡,可以更早开始放松仪式。`,
    cta: "尝试 CBT-I 替代助眠药物",
    infoCards: [
      {
        title: "褪黑素是什么?",
        desc: "一种自然分泌的激素,向身体传递夜晚来临的信号。补充剂的目的是温和地提前昼夜节律。",
      },
      {
        title: "什么时候服用?",
        desc: "通常在入睡前 1–2 小时服用,低剂量(0.3–1 毫克)即可,剂量更高未必更有效。",
      },
      {
        title: "哪些人应避免?",
        desc: "孕妇、哺乳期女性、儿童以及正在服用某些药物的人,应先咨询专业医生。",
      },
    ],
    faqs: [
      {
        q: "褪黑素是什么?",
        a: "褪黑素是大脑在黑暗环境下分泌的一种激素,向身体传递入睡的信号,帮助调节昼夜节律。",
      },
      {
        q: "什么时候服用褪黑素?",
        a: "通常在目标入睡时间前 1–2 小时。低剂量(0.3–1 毫克)在正确的时机往往比临睡前的大剂量更有效。",
      },
      {
        q: "哪些人应避免使用褪黑素?",
        a: "孕妇、哺乳期女性、正在服用某些药物(如抗凝药、免疫抑制剂),或患有自身免疫或癫痫疾病的人,应先咨询专业医生。",
      },
      {
        q: "褪黑素是安眠药吗?",
        a: "不是。它不会让你昏睡,而是传递时间信号。对于慢性失眠,CBT-I 等行为方法被视为一线疗法。",
      },
    ],
  },
};

const es: CalcDict = {
  nav: {
    tools: "Herramientas",
    section: "Calculadoras del Sueño",
    cycle: "Calculadora de Ciclos de Sueño",
    sleep: "Calculadora de Sueño",
    bedtime: "Calculadora de Hora de Dormir",
    nap: "Calculadora de Siestas",
    melatonin: "Calculadora de Melatonina",
  },
  related: {
    title: "Herramientas relacionadas",
    cycleDesc: "Planifica en torno a ciclos de 90 minutos.",
    sleepDesc: "Cuánto sueño necesitas según tu edad.",
    bedtimeDesc: "El mejor momento para acostarte.",
    napDesc: "Duración ideal de la siesta para tener energía.",
    melatoninDesc: "Cuándo tomar melatonina.",
    guide: "Guía CBT-I",
    guideDesc: "Programa sin medicamentos, basado en la ciencia.",
  },
  common: {
    faqTitle: "Preguntas frecuentes",
    bestBadge: "Recomendado",
    cyclesWord: "ciclos",
    hoursShort: " h de sueño",
    minShort: "min",
  },
  cycle: {
    meta: {
      title: "Calculadora de Ciclos de Sueño — Somna",
      desc: "Encuentra tu hora ideal para dormir y despertar usando ciclos naturales de 90 minutos.",
    },
  },
  sleep: {
    meta: {
      title: "Calculadora de Sueño – Encuentra tu duración ideal | Somna",
      desc: "Calcula cuánto sueño necesitas según tu edad y hora de despertar.",
    },
    eyebrow: "CALCULADORA DE SUEÑO",
    title: "Encuentra tu duración ideal de sueño",
    sub: "Recomendaciones basadas en la ciencia según tu edad y hora deseada para despertar.",
    ageLabel: "Grupo de edad",
    ages: {
      teen: "Adolescente (13–17)",
      young: "Adulto joven (18–25)",
      adult: "Adulto (26–64)",
      older: "Adulto mayor (65+)",
    },
    ageNotes: {
      teen: "Los adolescentes necesitan más sueño para el desarrollo físico y cerebral.",
      young: "La mayoría de los adultos jóvenes rinden mejor con 7–9 horas de sueño.",
      adult: "Los adultos suelen funcionar mejor con 7–9 horas de sueño constantes.",
      older: "El sueño suele ser más ligero con la edad — apunta a 7–8 horas.",
    },
    wakeLabel: "Hora deseada para despertar",
    recommended: "Sueño recomendado",
    hoursWord: "horas",
    suggestedBedtime: "Hora recomendada para acostarse",
    toWake: (t) => `Para despertarte a las ${t} sintiéndote descansado.`,
    cta: "Aprende sobre los ciclos de sueño",
    whyTitle: "Por qué importa el sueño según la edad",
    whyParas: [
      "Las necesidades de sueño cambian a lo largo de la vida. Las hormonas, el desarrollo cerebral y el ritmo circadiano influyen en cuánto descanso necesita tu cuerpo.",
      "La constancia suele ser más importante que la cantidad exacta de horas. Acostarte y levantarte a la misma hora ayuda a estabilizar tu reloj interno.",
      "Si te sientes cansado incluso dentro de estos rangos, considera registrar tu sueño durante unas semanas para detectar patrones.",
    ],
    faqs: [
      {
        q: "¿Cuánto sueño necesito realmente?",
        a: "La mayoría de los adultos necesitan 7–9 horas por noche. Los adolescentes 8–10 y los adultos mayores suelen estar bien con 7–8 horas. La calidad importa tanto como la cantidad.",
      },
      {
        q: "¿Qué pasa si duermo menos de lo recomendado?",
        a: "A corto plazo puedes sentirte aturdido, irritable o desconcentrado. La falta crónica de sueño se asocia a problemas de ánimo, metabólicos y cardiovasculares.",
      },
      {
        q: "¿Puedo recuperar el sueño los fines de semana?",
        a: "Parcialmente, pero lo más fiable es un horario constante. Grandes cambios el fin de semana pueden alterar tu ritmo circadiano.",
      },
      {
        q: "¿Dormir más siempre es mejor?",
        a: "No. Dormir habitualmente más de 9–10 horas también puede asociarse a problemas de salud. Busca el rango que te haga sentir descansado.",
      },
    ],
  },
  bedtime: {
    meta: {
      title: "Calculadora de Hora de Dormir – Mejor hora para acostarte | Somna",
      desc: "Calcula tu hora ideal para acostarte según los ciclos de sueño y tu hora de despertar.",
    },
    eyebrow: "CALCULADORA DE HORA DE DORMIR",
    title: "Encuentra la mejor hora para acostarte",
    sub: "Despertar entre ciclos de sueño te ayuda a sentirte más claro, calmado y descansado.",
    wakeLabel: "Quiero despertar a las",
    suggested: "Horas sugeridas para acostarse",
    cyclesSuffix: (h, c) => `${h} h de sueño · ${c} ciclos`,
    bestLabel: "Recomendado",
    note: "Cada opción te permite despertar entre ciclos de sueño. Asume ~15 min para conciliar el sueño.",
    cta: "Probar Calculadora de Ciclos",
    faqs: [
      {
        q: "¿Por qué importa el ciclo de 90 minutos?",
        a: "Cada ciclo recorre sueño ligero, profundo y REM. Despertar al final de un ciclo (en vez de en sueño profundo) reduce el aturdimiento.",
      },
      {
        q: "¿Cuántos ciclos debería buscar?",
        a: "La mayoría de los adultos se sienten mejor con 5–6 ciclos (7,5–9 horas). Los deportistas o quienes recuperan sueño pueden necesitar 7.",
      },
      {
        q: "¿El ciclo de 90 minutos es exacto?",
        a: "Es un promedio. Los ciclos reales duran 70–120 minutos y varían por edad y persona. Úsalos como guía, no como regla rígida.",
      },
      {
        q: "¿Y si no puedo dormirme en 15 minutos?",
        a: "Es normal ocasionalmente. Si ocurre cada noche, las técnicas de CBT-I pueden ayudar a recalibrar tu inicio del sueño.",
      },
    ],
  },
  nap: {
    meta: {
      title: "Calculadora de Siestas – Duración perfecta | Somna",
      desc: "Calcula la duración ideal de la siesta para energía, atención y recuperación.",
    },
    eyebrow: "CALCULADORA DE SIESTAS",
    title: "Encuentra la duración perfecta de la siesta",
    sub: "Siestas cortas e intencionales pueden restaurar la energía, el foco y el ánimo — sin afectar tu noche.",
    currentTime: "Hora actual",
    napLength: "Duración de la siesta",
    wakeSuggestions: "Sugerencias para despertar",
    minUnit: "min",
    benefits: {
      10: { label: "Reinicio rápido", desc: "Una pausa breve para aliviar la fatiga mental." },
      20: { label: "Siesta energizante", desc: "Mejora el estado de alerta sin aturdimiento." },
      30: { label: "Refuerzo de memoria", desc: "Mejora la memoria y el aprendizaje." },
      60: {
        label: "Impulso cognitivo",
        desc: "Útil, pero puede causar algo de inercia al despertar.",
      },
      90: { label: "Ciclo completo", desc: "Restaura la creatividad y el equilibrio emocional." },
    },
    cta: "Leer la guía de higiene del sueño",
    quickCards: [
      { len: "20 min", desc: "Mejora el estado de alerta sin aturdimiento." },
      { len: "30 min", desc: "Favorece la consolidación de la memoria." },
      { len: "90 min", desc: "Un ciclo completo de sueño — despierta renovado." },
    ],
    faqs: [
      {
        q: "¿Cuándo es el mejor momento para una siesta?",
        a: "La mayoría se beneficia entre las 13:00 y las 15:00, coincidiendo con la bajada natural de alerta de la tarde.",
      },
      {
        q: "¿Cuánto debería durar una siesta?",
        a: "10–20 minutos para un impulso rápido. 90 minutos para un ciclo completo. Evita 30–60 minutos si te despiertas aturdido fácilmente.",
      },
      {
        q: "¿La siesta afecta mi sueño nocturno?",
        a: "Las siestas cortas suelen no afectarlo. Las largas o a última hora pueden reducir la presión de sueño y retrasar la hora de acostarse, sobre todo con insomnio.",
      },
      {
        q: "¿Las siestas son señal de mal sueño?",
        a: "No necesariamente. Muchas culturas las practican. Pero si necesitas siestas largas a diario para funcionar, puede indicar sueño nocturno insuficiente.",
      },
    ],
  },
  melatonin: {
    meta: {
      title: "Calculadora de Melatonina – ¿Cuándo tomar melatonina? | Somna",
      desc: "Estima el mejor momento para tomar melatonina según tu hora de dormir y tus hábitos.",
    },
    eyebrow: "CALCULADORA DE MELATONINA",
    title: "¿Cuándo debo tomar melatonina?",
    sub: "Guía educativa para estimar el momento — no es consejo médico.",
    disclaimer:
      "Esta herramienta tiene fines educativos y no constituye consejo médico. Consulta a un profesional de la salud antes de usar suplementos de melatonina.",
    bedtimeLabel: "Hora objetivo para acostarte",
    onsetLabel: "Tiempo habitual para conciliar el sueño",
    onset: { fast: "Rápido (~15 min)", average: "Promedio (~30 min)", slow: "Lento (~60 min)" },
    recommendedWindow: "Ventana recomendada",
    windowNote: (bedtime, onsetMin) =>
      `Toma melatonina aproximadamente 1–2 horas antes de tu hora objetivo de ${bedtime}. Tu tiempo habitual para dormir (~${onsetMin} min) sugiere comenzar tu rutina de relajación aún antes.`,
    cta: "Explora CBT-I en lugar de somníferos",
    infoCards: [
      {
        title: "¿Qué es la melatonina?",
        desc: "Una hormona natural que señala la noche a tu cuerpo. Los suplementos buscan adelantar suavemente tu ritmo circadiano.",
      },
      {
        title: "¿Cuándo tomarla?",
        desc: "Normalmente 1–2 horas antes de acostarte, en dosis bajas (0,3–1 mg). Dosis mayores no necesariamente son más efectivas.",
      },
      {
        title: "¿Quién debe evitarla?",
        desc: "Personas embarazadas o en lactancia, niños y quienes toman ciertos medicamentos deben consultar primero a un profesional.",
      },
    ],
    faqs: [
      {
        q: "¿Qué es la melatonina?",
        a: "Es una hormona que tu cerebro produce en respuesta a la oscuridad. Le indica al cuerpo que es hora de dormir y ayuda a regular el ritmo circadiano.",
      },
      {
        q: "¿Cuándo debo tomar melatonina?",
        a: "Generalmente 1–2 horas antes de tu hora objetivo para acostarte. Dosis bajas (0,3–1 mg) bien sincronizadas suelen ser más eficaces que dosis altas al acostarte.",
      },
      {
        q: "¿Quién debe evitar la melatonina?",
        a: "Personas embarazadas, en lactancia, que toman ciertos medicamentos (anticoagulantes, inmunosupresores) o con trastornos autoinmunes o convulsivos deben consultar a un médico primero.",
      },
      {
        q: "¿La melatonina es un somnífero?",
        a: "No. No te seda — señala el momento. Para el insomnio crónico, enfoques conductuales como CBT-I son la primera línea de tratamiento.",
      },
    ],
  },
};

const pt: CalcDict = {
  nav: {
    tools: "Ferramentas",
    section: "Calculadoras de Sono",
    cycle: "Calculadora de Ciclos de Sono",
    sleep: "Calculadora de Sono",
    bedtime: "Calculadora de Hora de Dormir",
    nap: "Calculadora de Sonecas",
    melatonin: "Calculadora de Melatonina",
  },
  related: {
    title: "Ferramentas relacionadas",
    cycleDesc: "Planeje com base em ciclos de 90 minutos.",
    sleepDesc: "Quanto sono você precisa segundo a idade.",
    bedtimeDesc: "O melhor momento para se deitar.",
    napDesc: "Duração ideal da soneca para ter energia.",
    melatoninDesc: "Quando tomar melatonina.",
    guide: "Guia TCC-I",
    guideDesc: "Programa sem remédios, baseado em ciência.",
  },
  common: {
    faqTitle: "Perguntas frequentes",
    bestBadge: "Recomendado",
    cyclesWord: "ciclos",
    hoursShort: " h de sono",
    minShort: "min",
  },
  cycle: {
    meta: {
      title: "Calculadora de Ciclos de Sono — Somna",
      desc: "Encontre seu horário ideal para dormir e acordar usando os ciclos naturais de 90 minutos.",
    },
  },
  sleep: {
    meta: {
      title: "Calculadora de Sono — Encontre sua duração ideal | Somna",
      desc: "Calcule quanto sono você precisa conforme sua idade e horário de acordar.",
    },
    eyebrow: "CALCULADORA DE SONO",
    title: "Encontre sua duração ideal de sono",
    sub: "Recomendações baseadas em ciência, conforme sua idade e horário desejado para acordar.",
    ageLabel: "Faixa etária",
    ages: {
      teen: "Adolescente (13–17)",
      young: "Adulto jovem (18–25)",
      adult: "Adulto (26–64)",
      older: "Idoso (65+)",
    },
    ageNotes: {
      teen: "Adolescentes precisam de mais sono para o desenvolvimento físico e cerebral.",
      young: "A maioria dos adultos jovens rende melhor com 7–9 horas de sono.",
      adult: "Adultos costumam funcionar melhor com 7–9 horas de sono consistentes.",
      older: "O sono costuma ficar mais leve com a idade — mire 7–8 horas.",
    },
    wakeLabel: "Horário desejado para acordar",
    recommended: "Sono recomendado",
    hoursWord: "horas",
    suggestedBedtime: "Horário recomendado para deitar",
    toWake: (t) => `Para acordar às ${t} se sentindo descansado.`,
    cta: "Aprenda sobre os ciclos de sono",
    whyTitle: "Por que o sono importa conforme a idade",
    whyParas: [
      "As necessidades de sono mudam ao longo da vida. Hormônios, desenvolvimento cerebral e o ritmo circadiano influenciam quanto descanso seu corpo precisa.",
      "A constância costuma ser mais importante do que a quantidade exata de horas. Deitar e levantar no mesmo horário ajuda a estabilizar seu relógio interno.",
      "Se você se sente cansado mesmo dentro dessas faixas, considere registrar seu sono por algumas semanas para detectar padrões.",
    ],
    faqs: [
      {
        q: "Quanto sono eu realmente preciso?",
        a: "A maioria dos adultos precisa de 7–9 horas por noite. Adolescentes, 8–10, e idosos costumam ficar bem com 7–8 horas. A qualidade importa tanto quanto a quantidade.",
      },
      {
        q: "O que acontece se eu dormir menos do que o recomendado?",
        a: "A curto prazo, você pode se sentir grogue, irritado ou desconcentrado. A falta crônica de sono está associada a problemas de humor, metabólicos e cardiovasculares.",
      },
      {
        q: "Posso recuperar o sono nos fins de semana?",
        a: "Parcialmente, mas o mais confiável é um horário estável. Grandes mudanças no fim de semana podem bagunçar seu ritmo circadiano.",
      },
      {
        q: "Dormir mais é sempre melhor?",
        a: "Não. Dormir habitualmente mais de 9–10 horas também pode estar associado a problemas de saúde. Busque a faixa que te faça sentir descansado.",
      },
    ],
  },
  bedtime: {
    meta: {
      title: "Calculadora de Hora de Dormir — Melhor hora para se deitar | Somna",
      desc: "Calcule seu horário ideal para deitar com base nos ciclos de sono e no seu horário de acordar.",
    },
    eyebrow: "CALCULADORA DE HORA DE DORMIR",
    title: "Encontre o melhor horário para se deitar",
    sub: "Acordar entre os ciclos de sono ajuda você a se sentir mais lúcido, calmo e descansado.",
    wakeLabel: "Quero acordar às",
    suggested: "Horários sugeridos para deitar",
    cyclesSuffix: (h, c) => `${h} h de sono · ${c} ciclos`,
    bestLabel: "Recomendado",
    note: "Cada opção permite acordar entre os ciclos de sono. Considera ~15 min para adormecer.",
    cta: "Experimentar a Calculadora de Ciclos",
    faqs: [
      {
        q: "Por que o ciclo de 90 minutos importa?",
        a: "Cada ciclo percorre sono leve, profundo e REM. Acordar no fim de um ciclo (em vez de no sono profundo) reduz a grogue ao acordar.",
      },
      {
        q: "Quantos ciclos devo buscar?",
        a: "A maioria dos adultos se sente melhor com 5–6 ciclos (7,5–9 horas). Atletas ou quem está recuperando sono pode precisar de 7.",
      },
      {
        q: "O ciclo de 90 minutos é exato?",
        a: "É uma média. Os ciclos reais duram 70–120 minutos e variam por idade e pessoa. Use como guia, não como regra rígida.",
      },
      {
        q: "E se eu não conseguir adormecer em 15 minutos?",
        a: "É normal ocasionalmente. Se acontecer toda noite, as técnicas de TCC-I podem ajudar a recalibrar o início do seu sono.",
      },
    ],
  },
  nap: {
    meta: {
      title: "Calculadora de Sonecas — Duração perfeita | Somna",
      desc: "Calcule a duração ideal da soneca para energia, atenção e recuperação.",
    },
    eyebrow: "CALCULADORA DE SONECAS",
    title: "Encontre a duração perfeita de soneca",
    sub: "Sonecas curtas e intencionais podem restaurar energia, foco e humor — sem afetar sua noite.",
    currentTime: "Horário atual",
    napLength: "Duração da soneca",
    wakeSuggestions: "Sugestões para acordar",
    minUnit: "min",
    benefits: {
      10: { label: "Reinício rápido", desc: "Uma pausa breve para aliviar o cansaço mental." },
      20: { label: "Soneca energética", desc: "Melhora o estado de alerta sem grogue." },
      30: { label: "Reforço de memória", desc: "Melhora a memória e o aprendizado." },
      60: {
        label: "Impulso cognitivo",
        desc: "Útil, mas pode causar certa inércia ao acordar.",
      },
      90: { label: "Ciclo completo", desc: "Restaura a criatividade e o equilíbrio emocional." },
    },
    cta: "Ler o guia de higiene do sono",
    quickCards: [
      { len: "20 min", desc: "Melhora o estado de alerta sem grogue." },
      { len: "30 min", desc: "Favorece a consolidação da memória." },
      { len: "90 min", desc: "Um ciclo completo de sono — acorde renovado." },
    ],
    faqs: [
      {
        q: "Qual o melhor momento para uma soneca?",
        a: "A maioria se beneficia entre 13h e 15h, coincidindo com a queda natural de alerta da tarde.",
      },
      {
        q: "Quanto deve durar uma soneca?",
        a: "10–20 minutos para um impulso rápido. 90 minutos para um ciclo completo. Evite 30–60 minutos se você acorda grogue com facilidade.",
      },
      {
        q: "A soneca afeta meu sono noturno?",
        a: "Sonecas curtas costumam não afetar. As longas ou no fim do dia podem reduzir a pressão de sono e adiar a hora de deitar, sobretudo com insônia.",
      },
      {
        q: "Sonecas são sinal de mau sono?",
        a: "Não necessariamente. Muitas culturas as praticam. Mas se você precisa de sonecas longas todos os dias para funcionar, pode indicar sono noturno insuficiente.",
      },
    ],
  },
  melatonin: {
    meta: {
      title: "Calculadora de Melatonina — Quando tomar melatonina? | Somna",
      desc: "Estime o melhor momento para tomar melatonina conforme seu horário de dormir e seus hábitos.",
    },
    eyebrow: "CALCULADORA DE MELATONINA",
    title: "Quando devo tomar melatonina?",
    sub: "Guia educativo para estimar o momento — não é conselho médico.",
    disclaimer:
      "Esta ferramenta tem fins educativos e não constitui conselho médico. Consulte um profissional de saúde antes de usar suplementos de melatonina.",
    bedtimeLabel: "Horário-alvo para se deitar",
    onsetLabel: "Tempo habitual para adormecer",
    onset: { fast: "Rápido (~15 min)", average: "Médio (~30 min)", slow: "Lento (~60 min)" },
    recommendedWindow: "Janela recomendada",
    windowNote: (bedtime, onsetMin) =>
      `Tome melatonina cerca de 1–2 horas antes do seu horário-alvo de ${bedtime}. Seu tempo habitual para dormir (~${onsetMin} min) sugere começar a rotina de relaxamento ainda antes.`,
    cta: "Explore a TCC-I em vez de soníferos",
    infoCards: [
      {
        title: "O que é a melatonina?",
        desc: "Um hormônio natural que sinaliza a noite ao seu corpo. Os suplementos buscam adiantar suavemente seu ritmo circadiano.",
      },
      {
        title: "Quando tomar?",
        desc: "Normalmente 1–2 horas antes de deitar, em doses baixas (0,3–1 mg). Doses maiores não são necessariamente mais eficazes.",
      },
      {
        title: "Quem deve evitar?",
        desc: "Pessoas grávidas ou em amamentação, crianças e quem toma certos medicamentos devem consultar um profissional primeiro.",
      },
    ],
    faqs: [
      {
        q: "O que é a melatonina?",
        a: "É um hormônio que seu cérebro produz em resposta à escuridão. Indica ao corpo que é hora de dormir e ajuda a regular o ritmo circadiano.",
      },
      {
        q: "Quando devo tomar melatonina?",
        a: "Geralmente 1–2 horas antes do seu horário-alvo para deitar. Doses baixas (0,3–1 mg) bem sincronizadas costumam ser mais eficazes do que doses altas na hora de dormir.",
      },
      {
        q: "Quem deve evitar a melatonina?",
        a: "Pessoas grávidas, em amamentação, que tomam certos medicamentos (anticoagulantes, imunossupressores) ou com distúrbios autoimunes ou convulsivos devem consultar um médico primeiro.",
      },
      {
        q: "A melatonina é um sonífero?",
        a: "Não. Ela não seda — sinaliza o momento. Para a insônia crônica, abordagens comportamentais como a TCC-I são a primeira linha de tratamento.",
      },
    ],
  },
};

const pl: CalcDict = {
  nav: {
    tools: "Narzędzia",
    section: "Kalkulatory snu",
    cycle: "Kalkulator cykli snu",
    sleep: "Kalkulator godzin snu",
    bedtime: "Kalkulator pory snu",
    nap: "Kalkulator drzemki",
    melatonin: "Kalkulator melatoniny",
  },
  related: {
    title: "Powiązane narzędzia",
    cycleDesc: "Planuj wokół 90-minutowych cykli snu.",
    sleepDesc: "Ile snu potrzebujesz w zależności od wieku.",
    bedtimeDesc: "Najlepsza pora, by położyć się spać.",
    napDesc: "Idealna długość drzemki dla energii.",
    melatoninDesc: "Kiedy przyjąć melatoninę.",
    guide: "Przewodnik CBT-I",
    guideDesc: "Program bez leków, oparty na nauce.",
  },
  common: {
    faqTitle: "Częste pytania",
    bestBadge: "Najlepsze",
    cyclesWord: "cykli",
    hoursShort: " h snu",
    minShort: "min",
  },
  cycle: {
    meta: {
      title: "Kalkulator cykli snu — Somna",
      desc: "Znajdź idealną porę zasypiania i budzenia, wykorzystując naturalne 90-minutowe cykle snu.",
    },
  },
  sleep: {
    meta: {
      title: "Kalkulator godzin snu – znajdź swoją idealną dawkę snu | Somna",
      desc: "Oblicz, ile godzin snu potrzebujesz w zależności od wieku i planowanej pory wstawania.",
    },
    eyebrow: "KALKULATOR GODZIN SNU",
    title: "Znajdź swoją idealną dawkę snu",
    sub: "Rekomendacje oparte na badaniach, dostosowane do Twojego wieku i planowanej pory wstawania.",
    ageLabel: "Grupa wiekowa",
    ages: {
      teen: "Nastolatek (13–17)",
      young: "Młody dorosły (18–25)",
      adult: "Dorosły (26–64)",
      older: "Starszy dorosły (65+)",
    },
    ageNotes: {
      teen: "Nastolatki potrzebują więcej snu, by wspierać rozwój fizyczny i mózgu.",
      young: "Większość młodych dorosłych funkcjonuje najlepiej po 7–9 godzinach snu.",
      adult: "Dorośli zazwyczaj dobrze funkcjonują przy 7–9 godzinach regularnego snu.",
      older: "Sen staje się z wiekiem płytszy — celuj w 7–8 godzin.",
    },
    wakeLabel: "Planowana pora wstawania",
    recommended: "Zalecany sen",
    hoursWord: "godziny",
    suggestedBedtime: "Sugerowana pora snu",
    toWake: (t) => `Aby obudzić się o ${t} i czuć się wypoczętym.`,
    cta: "Dowiedz się więcej o cyklach snu",
    whyTitle: "Dlaczego sen zależy od wieku?",
    whyParas: [
      "Zapotrzebowanie na sen zmienia się w ciągu życia. Zmiany hormonalne, rozwój mózgu i rytm dobowy wpływają na to, ile odpoczynku potrzebuje organizm.",
      "Regularność jest często ważniejsza niż dokładna liczba godzin. Chodzenie spać i wstawanie o stałych porach pomaga ustabilizować wewnętrzny zegar.",
      "Jeśli mimo mieścisz się w zalecanych zakresach czujesz się niewyspany, prowadź zapis snu przez kilka tygodni, by dostrzec wzorce.",
    ],
    faqs: [
      {
        q: "Ile snu naprawdę potrzebuję?",
        a: "Większość dorosłych potrzebuje 7–9 godzin snu na noc. Nastolatki 8–10 godzin, a osoby starsze zazwyczaj dobrze funkcjonują przy 7–8 godzinach. Jakość snu ma takie samo znaczenie jak jego długość.",
      },
      {
        q: "Co się dzieje, gdy śpię mniej niż zalecane?",
        a: "Krótkoterminowo możesz czuć się senny, drażliwy lub mieć trudności z koncentracją. Chroniczny deficyt snu wiąże się z problemami nastroju, metabolizmu i układu krążenia.",
      },
      {
        q: "Czy mogę nadrobić sen w weekendy?",
        a: "Częściowo tak, ale najbardziej wiarygodną metodą jest stały rytm dnia. Duże przesunięcia w weekend mogą zaburzyć rytm dobowy.",
      },
      {
        q: "Czy więcej snu zawsze oznacza lepiej?",
        a: "Nie. Regularne spanie powyżej 9–10 godzin może korelować z problemami zdrowotnymi. Celuj w zakres, w którym czujesz się wypoczęty.",
      },
    ],
  },
  bedtime: {
    meta: {
      title: "Kalkulator pory snu – znajdź najlepszą godzinę na sen | Somna",
      desc: "Oblicz idealną porę snu na podstawie cykli snu i planowanej pory wstawania.",
    },
    eyebrow: "KALKULATOR PORY SNU",
    title: "Znajdź najlepszą porę, by położyć się spać",
    sub: "Budzenie się pomiędzy cyklami snu pomaga czuć się bardziej wypoczętym, spokojniejszym i skupionym.",
    wakeLabel: "Chcę wstać o",
    suggested: "Sugerowane pory snu",
    cyclesSuffix: (h, c) => `${h} h snu · ${c} cykli`,
    bestLabel: "Zalecane",
    note: "Każda opcja pozwala obudzić się pomiędzy cyklami snu. Uwzględniono około 15 minut na zaśnięcie.",
    cta: "Wypróbuj kalkulator cykli snu",
    faqs: [
      {
        q: "Dlaczego 90-minutowy cykl snu ma znaczenie?",
        a: "Każdy cykl przechodzi przez sen lekki, głęboki i REM. Obudzenie się na końcu cyklu, a nie w fazie głębokiego snu, zmniejsza uczucie otępienia.",
      },
      {
        q: "Ile cykli powinienem celować?",
        a: "Większość dorosłych czuje się najlepiej przy 5–6 cyklach (ok. 7,5–9 godzin). Sportowcy lub osoby odrabiające deficyt snu mogą skorzystać z 7 cykli.",
      },
      {
        q: "Czy 90 minut to dokładna długość cyklu?",
        a: "To wartość średnia. Rzeczywiste cykle trwają 70–120 minut i zależą od wieku i osoby. Traktuj sugerowane godziny jako wskazówkę, nie sztywną regułę.",
      },
      {
        q: "Co jeśli nie zasypiam w 15 minut?",
        a: "Czasem się to zdarza. Jeśli dzieje się tak każdej nocy, techniki CBT-I mogą pomóc wyrównać rytm zasypiania.",
      },
    ],
  },
  nap: {
    meta: {
      title: "Kalkulator drzemki – znajdź idealną długość drzemki | Somna",
      desc: "Oblicz idealną długość drzemki dla energii, skupienia i regeneracji.",
    },
    eyebrow: "KALKULATOR DRZEMKI",
    title: "Znajdź idealną długość drzemki",
    sub: "Krótkie, celowe drzemki mogą przywrócić energię, skupienie i dobry nastrój — bez zakłócania nocnego snu.",
    currentTime: "Aktualna godzina",
    napLength: "Długość drzemki",
    wakeSuggestions: "Sugerowane godziny pobudki",
    minUnit: "min",
    benefits: {
      10: { label: "Szybki reset", desc: "Krótka przerwa, która łagodzi zmęczenie umysłowe." },
      20: { label: "Energiczna drzemka", desc: "Poprawia czujność bez otępienia." },
      30: { label: "Wsparcie pamięci", desc: "Poprawia zapamiętywanie i uczenie się." },
      60: {
        label: "Podniesienie poznawcze",
        desc: "Pomocne, ale może wiązać się z lekkim otępieniem.",
      },
      90: { label: "Pełny cykl snu", desc: "Przywraca kreatywność i równowagę emocjonalną." },
    },
    cta: "Przeczytaj przewodnik o higienie snu",
    quickCards: [
      { len: "20 min", desc: "Poprawia czujność bez otępienia." },
      { len: "30 min", desc: "Wspiera konsolidację pamięci." },
      { len: "90 min", desc: "Pełny cykl snu — obudź się odświeżony." },
    ],
    faqs: [
      {
        q: "Kiedy najlepiej zdrzemnąć się w ciągu dnia?",
        a: "Większość osób najlepiej reaguje na drzemkę między 13:00 a 15:00, gdy naturalnie spada czujność po południu.",
      },
      {
        q: "Jak długa powinna być drzemka?",
        a: "10–20 minut dla szybkiego zastrzyku energii. 90 minut dla pełnego cyklu snu. Unikaj 30–60 minut, jeśli łatwo budzisz się z otępieniem.",
      },
      {
        q: "Czy drzemka szkodzi nocnemu snowi?",
        a: "Krótkie drzemki zazwyczaj nie szkodzą. Długie lub późne popołudniowe mogą obniżyć presję snu i opóźnić pójście spać, szczególnie przy bezsenności.",
      },
      {
        q: "Czy regularne drzemki oznaczają zły sen?",
        a: "Niekoniecznie. Wiele kultur praktykuje drzemki. Jeśli jednak codziennie potrzebujesz długich drzemek, by funkcjonować, może to oznaczać niedobór nocnego snu.",
      },
    ],
  },
  melatonin: {
    meta: {
      title: "Kalkulator melatoniny – kiedy przyjąć melatoninę? | Somna",
      desc: "Oszacuj najlepszą porę przyjęcia melatoniny na podstawie planowanej pory snu i harmonogramu dnia.",
    },
    eyebrow: "KALKULATOR MELATONINY",
    title: "Kiedy przyjąć melatoninę?",
    sub: "Edukacyjna wskazówka dotycząca pory przyjęcia — nie jest to porada medyczna.",
    disclaimer:
      "To narzędzie ma charakter edukacyjny i nie stanowi porady medycznej. Przed użyciem suplementów z melatoniną skonsultuj się z lekarzem.",
    bedtimeLabel: "Planowana pora snu",
    onsetLabel: "Typowy czas zasypiania",
    onset: { fast: "Szybki (~15 min)", average: "Średni (~30 min)", slow: "Wolny (~60 min)" },
    recommendedWindow: "Zalecane okno",
    windowNote: (bedtime, onsetMin) =>
      `Weź melatoninę na około 1–2 godziny przed planowaną porą snu (${bedtime}). Twój typowy czas zasypiania (~${onsetMin} min) sugeruje rozpoczęcie rytuału relaksacyjnego jeszcze wcześniej.`,
    cta: "Odkryj CBT-I zamiast środków nasennych",
    infoCards: [
      {
        title: "Co to jest melatonina?",
        desc: "Naturalny hormon, który sygnalizuje organizmowi nadchodzenie nocy. Suplementy mają na celu delikatne przyspieszenie rytmu dobowego.",
      },
      {
        title: "Kiedy ją przyjąć?",
        desc: "Zazwyczaj 1–2 godziny przed snem, w niskich dawkach (0,3–1 mg). Większe dawki nie zawsze są skuteczniejsze.",
      },
      {
        title: "Kto powinien jej unikać?",
        desc: "Osoby w ciąży, karmiące piersią, dzieci oraz osoby przyjmujące niektóre leki powinny najpierw skonsultować się z lekarzem.",
      },
    ],
    faqs: [
      {
        q: "Co to jest melatonina?",
        a: "Melatonina to hormon wytwarzany przez mózg w odpowiedzi na ciemność. Sygnalizuje organizmowi, że czas spać, pomagając regulować rytm dobowy.",
      },
      {
        q: "Kiedy przyjąć melatoninę?",
        a: "Zazwyczaj 1–2 godziny przed planowaną porą snu. Niskie dawki (0,3–1 mg) w odpowiednim momencie są często skuteczniejsze niż większe dawki bezpośrednio przed snem.",
      },
      {
        q: "Kto powinien unikać melatoniny?",
        a: "Osoby w ciąży, karmiące piersią, przyjmujące niektóre leki (np. przeciwzakrzepowe, immunosupresyjne) lub z chorobami autoimmunologicznymi i padaczką powinny skonsultować się z lekarzem.",
      },
      {
        q: "Czy melatonina to środek nasenny?",
        a: "Nie. Nie wywołuje senności — daje sygnał czasowy. W przewlekłej bezsenności podejścia behawioralne, takie jak CBT-I, uznaje się za leczenie pierwszego wyboru.",
      },
    ],
  },
};

const dicts: Record<Lang, CalcDict> = { en, zh, es, pt, pl };

export function getCalcDict(lang: Lang): CalcDict {
  return dicts[lang];
}
