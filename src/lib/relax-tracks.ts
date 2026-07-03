export type RelaxCategory = "guided" | "nature" | "noise";

export interface RelaxTrack {
  id: string;
  audioUrl: string;
  category: RelaxCategory;
  duration?: string;
  title: { en: string; zh: string; es: string; pt: string };
  description: { en: string; zh: string; es: string; pt: string };
}

export const relaxTracks: RelaxTrack[] = [
  {
    id: "body-scan",
    audioUrl: "/audio/body-scan.mp3",
    category: "guided",
    duration: "8 min",
    title: { en: "Body Scan", zh: "身体扫描", es: "Escaneo corporal", pt: "Escaneamento corporal" },
    description: {
      en: "A gentle head-to-toe relaxation to release tension before sleep.",
      zh: "由头到脚的温柔放松,帮助入睡前释放紧张。",
      es: "Una relajación suave de la cabeza a los pies para liberar tensión antes de dormir.",
      pt: "Um relaxamento suave da cabeça aos pés para liberar a tensão antes de dormir.",
    },
  },
  {
    id: "letting-go",
    audioUrl: "/audio/letting-go.mp3",
    category: "guided",
    duration: "10 min",
    title: { en: "Letting Go of the Day", zh: "放下白天", es: "Soltar el día", pt: "Soltar o dia" },
    description: {
      en: "Soften the weight of the day with a guided reflection and breath.",
      zh: "在引导反思与呼吸中,轻轻放下一天的重量。",
      es: "Aligera el peso del día con una reflexión guiada y la respiración.",
      pt: "Alivie o peso do dia com uma reflexão guiada e a respiração.",
    },
  },
  {
    id: "rain-on-leaves",
    audioUrl: "/audio/rain-on-leaves.mp3",
    category: "nature",
    duration: "30 min",
    title: { en: "Rain on Leaves", zh: "雨打树叶", es: "Lluvia sobre las hojas", pt: "Chuva nas folhas" },
    description: {
      en: "Soft rainfall on a quiet canopy — calming background for sleep.",
      zh: "雨水轻落在树叶上,宁静的睡眠背景音。",
      es: "Lluvia suave sobre el follaje, un fondo tranquilo para dormir.",
      pt: "Chuva suave sobre as folhas, um fundo tranquilo para dormir.",
    },
  },
  {
    id: "soft-ocean",
    audioUrl: "/audio/soft-ocean.mp3",
    category: "nature",
    duration: "45 min",
    title: { en: "Soft Ocean", zh: "海浪轻拍", es: "Océano suave", pt: "Oceano suave" },
    description: {
      en: "Slow waves rolling onto shore for deep, steady rest.",
      zh: "缓慢的海浪拍岸,带来深沉而平稳的休息。",
      es: "Olas lentas rompiendo en la orilla para un descanso profundo y constante.",
      pt: "Ondas lentas quebrando na praia para um descanso profundo e constante.",
    },
  },
  {
    id: "anxiety-relief",
    audioUrl: "/audio/anxiety-relief.mp3",
    category: "guided",
    duration: "12 min",
    title: { en: "Anxiety Relief", zh: "缓解焦虑", es: "Alivio de la ansiedad", pt: "Alívio da ansiedade" },
    description: {
      en: "A grounding session to quiet a racing mind at bedtime.",
      zh: "一段安定的练习,在睡前平息思绪奔涌。",
      es: "Una sesión de anclaje para calmar una mente acelerada al acostarse.",
      pt: "Uma sessão de ancoragem para acalmar uma mente acelerada ao deitar.",
    },
  },
  {
    id: "pink-noise",
    audioUrl: "/audio/pink-noise.mp3",
    category: "noise",
    duration: "Loop",
    title: { en: "Pink Noise", zh: "粉红噪音", es: "Ruido rosa", pt: "Ruído rosa" },
    description: {
      en: "A steady, soothing spectrum shown to support deeper sleep.",
      zh: "平稳柔和的频谱噪音,有助于更深的睡眠。",
      es: "Un espectro constante y reconfortante que favorece un sueño más profundo.",
      pt: "Um espectro constante e reconfortante que favorece um sono mais profundo.",
    },
  },
];
