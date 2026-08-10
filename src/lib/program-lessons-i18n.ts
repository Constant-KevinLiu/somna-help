// Shared UI labels for the CBT-I Program lessons (en/zh/es).
// Lesson *content* lives in program-lessons-content/*.ts; this file holds
// only the chrome (buttons, badges, section titles, dashboard strings).

import type { Lang } from "./i18n";
import type { DifficultyKey } from "./program-lessons";

export type ProgramLessonUI = {
  readingTimeLabel: string; // "Reading Time"
  difficultyLabel: string; // "Difficulty"
  progressLabel: string; // "Progress"
  lessonLabel: string; // "Lesson"
  weekLabel: string; // "Week"
  lessonsLabel: string; // "Lessons"
  ofLabel: string; // "of" (as in "2 of 3")
  completeLabel: string; // "Complete"
  completedLabel: string; // "Completed"
  markCompleted: string; // "Mark as Completed"
  markIncomplete: string; // "Mark as not completed"
  lessonCompleted: string; // "✓ Lesson completed"
  continue: string; // "Continue"
  nextLesson: string; // "Next Lesson"
  previousLesson: string; // "Previous Lesson"
  backToWeek: string; // "Back to Week"
  backToProgram: string; // "Back to Program"
  relatedLessons: string; // "Related Lessons"
  actionStepTitle: string; // "Action Step"
  reflectionTitle: string; // "Reflection"
  faqTitle: string; // "FAQ"
  lessonContentTitle: string; // "The Lesson"
  startWeek: string; // "Start Week"
  reviewWeek: string; // "Review Week"
  lockedWeek: string; // "Locked"
  availableWeek: string; // "Available"
  completedWeek: string; // "Completed"
  statusLabel: string; // "Status"
  completionLabel: string; // "Completion"
  difficulty: Record<DifficultyKey, string>;
  // Dashboard integration
  dashProgramTitle: string; // "CBT-I Program"
  dashCurrentWeek: string; // "Current Program Week"
  dashCurrentLesson: string; // "Current Lesson"
  dashCompletion: string; // "Completion"
  dashRecommended: string; // "Recommended Next Lesson"
  dashContinueLearning: string; // "Continue Learning"
  dashNotStarted: string; // "Not started"
  dashProgramComplete: string; // "Program complete"
  // Badges
  badgesTitle: string; // "Milestones"
  badgeSleepBasics: string; // "Sleep Basics Badge"
  badgeSleepBasicsDesc: string;
  badgeSleepConsistency: string; // "Sleep Consistency Badge"
  badgeSleepConsistencyDesc: string;
  badgeCbtiGraduate: string; // "CBT-I Graduate Badge"
  badgeCbtiGraduateDesc: string;
  badgeLocked: string; // "Locked"
  badgeEarned: string; // "Earned"
  // Program homepage
  programHubSub: string;
  programHubLessonsCount: string; // "{n} Lessons"
  programHubComplete: string; // "{done} / {total} Complete"
  // Unsupported / future schema warning
  unsupportedTitle: string; // "Program data from a newer version"
  unsupportedBody: string; // long message
  unsupportedRefresh: string; // "Refresh or update the app"
  unsupportedDashLabel: string; // "Program data unavailable"
  // Lifecycle states
  statusNotStarted: string;
  statusActive: string;
  statusPaused: string;
  statusCompleted: string;
  statusCorrupted: string;
  // Start / introduction
  startProgramTitle: string;
  startProgramSubtitle: string;
  startProgramCta: string;
  programStructureInfo: string;
  programPrivacyNote: string;
  programWhatItDoes: string;
  programWhatItDoesNot: string;
  // Pause
  pauseProgram: string;
  pauseConfirmTitle: string;
  pauseConfirmBody: string;
  pauseConfirmCancel: string;
  pauseConfirmPause: string;
  pausedBannerTitle: string;
  pausedBannerBody: string;
  pausedProgressPreserved: string;
  resumeProgram: string;
  resumeCta: string;
  lessonPausedNote: string;
  // Completion
  completionTitle: string;
  completionSubtitle: string;
  completionDateLabel: string;
  completionLessonsCount: string;
  completionMilestone: string;
  reviewLessons: string;
  completionDisclaimer: string;
  // Progress labels
  currentWeek: string;
  overallProgress: string;
  lessonsCompletedLabel: string; // "X of Y lessons completed"
  // Week states
  weekCurrent: string;
  weekInProgress: string;
  // Weekly Focus
  weeklyFocusTitle: string;
  weeklyFocusWhy: string;
  weeklyFocusDataWindow: string;
  weeklyFocusRelatedLesson: string;
  weeklyFocusInsufficient: string;
  weeklyFocusDefer: string;
  weeklyFocusBasedOn: string;
  // Dashboard
  dashStartProgram: string;
  dashPausedStatus: string;
  dashResumeCta: string;
  dashReviewCta: string;
  dashLearnMore: string;
};

const en: ProgramLessonUI = {
  readingTimeLabel: "Reading Time",
  difficultyLabel: "Difficulty",
  progressLabel: "Progress",
  lessonLabel: "Lesson",
  weekLabel: "Week",
  lessonsLabel: "Lessons",
  ofLabel: "of",
  completeLabel: "Complete",
  completedLabel: "Completed",
  markCompleted: "Mark as Completed",
  markIncomplete: "Mark as not completed",
  lessonCompleted: "✓ Lesson completed",
  continue: "Continue",
  nextLesson: "Next Lesson",
  previousLesson: "Previous Lesson",
  backToWeek: "Back to Week",
  backToProgram: "Back to Program",
  relatedLessons: "Related Lessons",
  actionStepTitle: "Action Step",
  reflectionTitle: "Reflection",
  faqTitle: "FAQ",
  lessonContentTitle: "The Lesson",
  startWeek: "Start Week",
  reviewWeek: "Review Week",
  lockedWeek: "Locked",
  availableWeek: "Available",
  completedWeek: "Completed",
  statusLabel: "Status",
  completionLabel: "Completion",
  difficulty: { beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" },
  dashProgramTitle: "CBT-I Program",
  dashCurrentWeek: "Current Program Week",
  dashCurrentLesson: "Current Lesson",
  dashCompletion: "Completion",
  dashRecommended: "Recommended Next Lesson",
  dashContinueLearning: "Continue Learning",
  dashNotStarted: "Not started",
  dashProgramComplete: "Program complete",
  badgesTitle: "Milestones",
  badgeSleepBasics: "Sleep Basics Badge",
  badgeSleepBasicsDesc: "Completed Week 1 — Sleep Foundations.",
  badgeSleepConsistency: "Sleep Consistency Badge",
  badgeSleepConsistencyDesc: "Completed Week 3 — Sleep Restriction.",
  badgeCbtiGraduate: "CBT-I Graduate Badge",
  badgeCbtiGraduateDesc: "Completed the full 6-week CBT-I program.",
  badgeLocked: "Locked",
  badgeEarned: "Earned",
  programHubSub: "An 18-lesson, 6-week journey to rebuild your sleep — one gentle step at a time.",
  programHubLessonsCount: "Lessons",
  programHubComplete: "Complete",
  unsupportedTitle: "Program data from a newer version",
  unsupportedBody:
    "Your program data was created by a newer version of Somna. Your progress is safe, but it cannot be edited in this version. Refresh or update the application before continuing.",
  unsupportedRefresh: "Refresh to check for updates",
  unsupportedDashLabel: "Program data unavailable",
  // Lifecycle states
  statusNotStarted: "Not started",
  statusActive: "In progress",
  statusPaused: "Paused",
  statusCompleted: "Completed",
  statusCorrupted: "Data unavailable",
  // Start / introduction
  startProgramTitle: "Begin your CBT-I journey",
  startProgramSubtitle:
    "A structured, evidence-based learning program designed to help you build more consistent and sustainable sleep habits.",
  startProgramCta: "Start the program",
  programStructureInfo: "6 weeks · 18 lessons · self-paced",
  programPrivacyNote: "Your progress stays on your device. Nothing is shared without your choice.",
  programWhatItDoes: "Lessons, exercises, and progress stay connected across the program.",
  programWhatItDoesNot: "This is an educational tool, not medical diagnosis or treatment.",
  // Pause
  pauseProgram: "Pause program",
  pauseConfirmTitle: "Pause your program?",
  pauseConfirmBody:
    "Your progress will be preserved. You can return and resume whenever you are ready.",
  pauseConfirmCancel: "Keep going",
  pauseConfirmPause: "Pause for now",
  pausedBannerTitle: "Program paused",
  pausedBannerBody: "Your progress is saved. Resume whenever you're ready.",
  pausedProgressPreserved: "All progress preserved",
  resumeProgram: "Resume program",
  resumeCta: "Resume learning",
  lessonPausedNote: "Lesson completion is paused. You can still read and review.",
  // Completion
  completionTitle: "You completed the Somna CBT-I Program",
  completionSubtitle:
    "The goal is not perfect sleep every night. The skills you practiced can continue to support more consistent sleep over time.",
  completionDateLabel: "Completed",
  completionLessonsCount: "lessons completed",
  completionMilestone: "CBT-I Graduate milestone earned",
  reviewLessons: "Review lessons",
  completionDisclaimer:
    "This program is educational and not a substitute for professional medical care.",
  // Progress labels
  currentWeek: "Current week",
  overallProgress: "Overall progress",
  lessonsCompletedLabel: "lessons completed",
  // Week states
  weekCurrent: "Current",
  weekInProgress: "In progress",
  // Weekly Focus
  weeklyFocusTitle: "This week's focus",
  weeklyFocusWhy: "Why this appears",
  weeklyFocusDataWindow: "Based on your last 7 days",
  weeklyFocusRelatedLesson: "Suggested lesson",
  weeklyFocusInsufficient:
    "Complete a few more sleep diary entries to receive a more data-informed weekly focus.",
  weeklyFocusDefer: "Not now",
  weeklyFocusBasedOn: "Based on",
  // Dashboard
  dashStartProgram: "Start learning",
  dashPausedStatus: "Paused",
  dashResumeCta: "Resume",
  dashReviewCta: "Review",
  dashLearnMore: "Learn more",
};

const zh: ProgramLessonUI = {
  readingTimeLabel: "阅读时长",
  difficultyLabel: "难度",
  progressLabel: "进度",
  lessonLabel: "课程",
  weekLabel: "第",
  lessonsLabel: "节课",
  ofLabel: "/",
  completeLabel: "完成",
  completedLabel: "已完成",
  markCompleted: "标记为已完成",
  markIncomplete: "取消完成标记",
  lessonCompleted: "✓ 课程已完成",
  continue: "继续学习",
  nextLesson: "下一课",
  previousLesson: "上一课",
  backToWeek: "返回本周",
  backToProgram: "返回课程",
  relatedLessons: "相关课程",
  actionStepTitle: "行动步骤",
  reflectionTitle: "反思练习",
  faqTitle: "常见问题",
  lessonContentTitle: "课程内容",
  startWeek: "开始本周",
  reviewWeek: "复习本周",
  lockedWeek: "未解锁",
  availableWeek: "可学习",
  completedWeek: "已完成",
  statusLabel: "状态",
  completionLabel: "完成度",
  difficulty: { beginner: "入门", intermediate: "进阶", advanced: "高阶" },
  dashProgramTitle: "CBT-I 课程",
  dashCurrentWeek: "当前课程周",
  dashCurrentLesson: "当前课程",
  dashCompletion: "完成度",
  dashRecommended: "推荐下一课",
  dashContinueLearning: "继续学习",
  dashNotStarted: "尚未开始",
  dashProgramComplete: "课程已完成",
  badgesTitle: "里程碑",
  badgeSleepBasics: "睡眠基础徽章",
  badgeSleepBasicsDesc: "完成第 1 周 —— 睡眠基础。",
  badgeSleepConsistency: "睡眠一致性徽章",
  badgeSleepConsistencyDesc: "完成第 3 周 —— 睡眠限制疗法。",
  badgeCbtiGraduate: "CBT-I 毕业徽章",
  badgeCbtiGraduateDesc: "完成完整的 6 周 CBT-I 课程。",
  badgeLocked: "未解锁",
  badgeEarned: "已获得",
  programHubSub: "一段 18 节课、6 周的旅程,温柔地一步步重建你的睡眠。",
  programHubLessonsCount: "节课",
  programHubComplete: "已完成",
  unsupportedTitle: "程序数据来自更新的版本",
  unsupportedBody:
    "你的课程数据是由更新版本的 Somna 创建的。你的进度是安全的,但无法在此版本中编辑。请刷新或更新应用后再继续。",
  unsupportedRefresh: "刷新检查更新",
  unsupportedDashLabel: "课程数据不可用",
  // Lifecycle states
  statusNotStarted: "尚未开始",
  statusActive: "进行中",
  statusPaused: "已暂停",
  statusCompleted: "已完成",
  statusCorrupted: "数据不可用",
  // Start / introduction
  startProgramTitle: "开启你的 CBT-I 之旅",
  startProgramSubtitle: "一套结构化、循证的学习课程,帮助你建立更一致、更可持续的睡眠习惯。",
  startProgramCta: "开始课程",
  programStructureInfo: "6 周 · 18 节课 · 自主进度",
  programPrivacyNote: "你的进度保存在你的设备上。未经你的选择,不会分享任何内容。",
  programWhatItDoes: "课程、练习和进度在整个程序中保持关联。",
  programWhatItDoesNot: "这是一个教育工具,不是医学诊断或治疗。",
  // Pause
  pauseProgram: "暂停课程",
  pauseConfirmTitle: "暂停你的课程?",
  pauseConfirmBody: "你的进度将被保存。你可以随时回来继续。",
  pauseConfirmCancel: "继续学习",
  pauseConfirmPause: "先暂停一下",
  pausedBannerTitle: "课程已暂停",
  pausedBannerBody: "你的进度已保存。准备好后继续即可。",
  pausedProgressPreserved: "所有进度已保存",
  resumeProgram: "继续课程",
  resumeCta: "继续学习",
  lessonPausedNote: "课程完成功能已暂停。你仍可以阅读和复习。",
  // Completion
  completionTitle: "你完成了 Somna CBT-I 课程",
  completionSubtitle: "目标不是每晚都睡得完美。你练习过的技能可以在长期内持续支持更稳定的睡眠。",
  completionDateLabel: "完成于",
  completionLessonsCount: "节课已完成",
  completionMilestone: "已获得 CBT-I 毕业里程碑",
  reviewLessons: "复习课程",
  completionDisclaimer: "本课程为教育性质,不能替代专业医疗服务。",
  // Progress labels
  currentWeek: "当前周",
  overallProgress: "总体进度",
  lessonsCompletedLabel: "节课已完成",
  // Week states
  weekCurrent: "当前",
  weekInProgress: "进行中",
  // Weekly Focus
  weeklyFocusTitle: "本周重点",
  weeklyFocusWhy: "为什么会显示这个",
  weeklyFocusDataWindow: "基于你过去 7 天的数据",
  weeklyFocusRelatedLesson: "推荐课程",
  weeklyFocusInsufficient: "请完成更多睡眠日记记录,以获得更基于数据的每周重点。",
  weeklyFocusDefer: "稍后再说",
  weeklyFocusBasedOn: "基于",
  // Dashboard
  dashStartProgram: "开始学习",
  dashPausedStatus: "已暂停",
  dashResumeCta: "继续",
  dashReviewCta: "复习",
  dashLearnMore: "了解更多",
};

const es: ProgramLessonUI = {
  readingTimeLabel: "Tiempo de lectura",
  difficultyLabel: "Dificultad",
  progressLabel: "Progreso",
  lessonLabel: "Lección",
  weekLabel: "Semana",
  lessonsLabel: "Lecciones",
  ofLabel: "de",
  completeLabel: "Completar",
  completedLabel: "Completado",
  markCompleted: "Marcar como completado",
  markIncomplete: "Desmarcar como completado",
  lessonCompleted: "✓ Lección completada",
  continue: "Continuar",
  nextLesson: "Lección siguiente",
  previousLesson: "Lección anterior",
  backToWeek: "Volver a la semana",
  backToProgram: "Volver al programa",
  relatedLessons: "Lecciones relacionadas",
  actionStepTitle: "Paso de acción",
  reflectionTitle: "Reflexión",
  faqTitle: "Preguntas frecuentes",
  lessonContentTitle: "La lección",
  startWeek: "Comenzar semana",
  reviewWeek: "Repasar semana",
  lockedWeek: "Bloqueada",
  availableWeek: "Disponible",
  completedWeek: "Completada",
  statusLabel: "Estado",
  completionLabel: "Progreso",
  difficulty: { beginner: "Inicial", intermediate: "Intermedio", advanced: "Avanzado" },
  dashProgramTitle: "Programa CBT-I",
  dashCurrentWeek: "Semana actual del programa",
  dashCurrentLesson: "Lección actual",
  dashCompletion: "Progreso",
  dashRecommended: "Próxima lección recomendada",
  dashContinueLearning: "Continuar aprendiendo",
  dashNotStarted: "Sin comenzar",
  dashProgramComplete: "Programa completado",
  badgesTitle: "Hitos",
  badgeSleepBasics: "Insignia Fundamentos del Sueño",
  badgeSleepBasicsDesc: "Completaste la Semana 1 — Fundamentos del Sueño.",
  badgeSleepConsistency: "Insignia Consistencia del Sueño",
  badgeSleepConsistencyDesc: "Completaste la Semana 3 — Restricción del Sueño.",
  badgeCbtiGraduate: "Insignia Graduado en CBT-I",
  badgeCbtiGraduateDesc: "Completaste el programa completo de 6 semanas de CBT-I.",
  badgeLocked: "Bloqueada",
  badgeEarned: "Obtenida",
  programHubSub: "Un viaje de 18 lecciones y 6 semanas para reconstruir tu sueño, paso a paso.",
  programHubLessonsCount: "Lecciones",
  programHubComplete: "Completado",
  unsupportedTitle: "Datos del programa de una versión más reciente",
  unsupportedBody:
    "Tus datos del programa fueron creados por una versión más reciente de Somna. Tu progreso está a salvo, pero no se puede editar en esta versión. Actualiza la aplicación antes de continuar.",
  unsupportedRefresh: "Actualizar para revisar novedades",
  unsupportedDashLabel: "Datos del programa no disponibles",
  // Lifecycle states
  statusNotStarted: "Sin comenzar",
  statusActive: "En progreso",
  statusPaused: "Pausado",
  statusCompleted: "Completado",
  statusCorrupted: "Datos no disponibles",
  // Start / introduction
  startProgramTitle: "Comienza tu camino con CBT-I",
  startProgramSubtitle:
    "Un programa de aprendizaje estructurado y basado en evidencia, diseñado para ayudarte a construir hábitos de sueño más consistentes y sostenibles.",
  startProgramCta: "Comenzar el programa",
  programStructureInfo: "6 semanas · 18 lecciones · a tu ritmo",
  programPrivacyNote:
    "Tu progreso se queda en tu dispositivo. No se comparte nada sin tu decisión.",
  programWhatItDoes:
    "Las lecciones, ejercicios y tu progreso permanecen conectados durante todo el programa.",
  programWhatItDoesNot: "Es una herramienta educativa, no un diagnóstico ni tratamiento médico.",
  // Pause
  pauseProgram: "Pausar programa",
  pauseConfirmTitle: "¿Pausar tu programa?",
  pauseConfirmBody: "Tu progreso se guardará. Puedes volver y continuar cuando lo desees.",
  pauseConfirmCancel: "Seguir adelante",
  pauseConfirmPause: "Pausar por ahora",
  pausedBannerTitle: "Programa pausado",
  pausedBannerBody: "Tu progreso está guardado. Continúa cuando estés listo.",
  pausedProgressPreserved: "Todo el progreso guardado",
  resumeProgram: "Reanudar programa",
  resumeCta: "Reanudar aprendizaje",
  lessonPausedNote: "La finalización de lecciones está en pausa. Aún puedes leer y repasar.",
  // Completion
  completionTitle: "Completaste el programa CBT-I de Somna",
  completionSubtitle:
    "El objetivo no es dormir perfectamente todas las noches. Las habilidades que practicaste pueden seguir apoyando un sueño más consistente con el tiempo.",
  completionDateLabel: "Completado el",
  completionLessonsCount: "lecciones completadas",
  completionMilestone: "Hito de Graduado en CBT-I obtenido",
  reviewLessons: "Repasar lecciones",
  completionDisclaimer: "Este programa es educativo y no sustituye la atención médica profesional.",
  // Progress labels
  currentWeek: "Semana actual",
  overallProgress: "Progreso general",
  lessonsCompletedLabel: "lecciones completadas",
  // Week states
  weekCurrent: "Actual",
  weekInProgress: "En progreso",
  // Weekly Focus
  weeklyFocusTitle: "Enfoque de esta semana",
  weeklyFocusWhy: "Por qué aparece esto",
  weeklyFocusDataWindow: "Basado en tus últimos 7 días",
  weeklyFocusRelatedLesson: "Lección sugerida",
  weeklyFocusInsufficient:
    "Completa algunas entradas más en el diario de sueño para recibir un enfoque semanal más basado en datos.",
  weeklyFocusDefer: "Ahora no",
  weeklyFocusBasedOn: "Basado en",
  // Dashboard
  dashStartProgram: "Comenzar a aprender",
  dashPausedStatus: "Pausado",
  dashResumeCta: "Reanudar",
  dashReviewCta: "Repasar",
  dashLearnMore: "Más información",
};

const pt: ProgramLessonUI = {
  readingTimeLabel: "Tempo de leitura",
  difficultyLabel: "Dificuldade",
  progressLabel: "Progresso",
  lessonLabel: "Lição",
  weekLabel: "Semana",
  lessonsLabel: "Lições",
  ofLabel: "de",
  completeLabel: "Concluir",
  completedLabel: "Concluída",
  markCompleted: "Marcar como concluída",
  markIncomplete: "Desmarcar como concluída",
  lessonCompleted: "✓ Lição concluída",
  continue: "Continuar",
  nextLesson: "Próxima lição",
  previousLesson: "Lição anterior",
  backToWeek: "Voltar à semana",
  backToProgram: "Voltar ao programa",
  relatedLessons: "Lições relacionadas",
  actionStepTitle: "Passo de ação",
  reflectionTitle: "Reflexão",
  faqTitle: "Perguntas frequentes",
  lessonContentTitle: "A lição",
  startWeek: "Começar semana",
  reviewWeek: "Revisar semana",
  lockedWeek: "Bloqueada",
  availableWeek: "Disponível",
  completedWeek: "Concluída",
  statusLabel: "Status",
  completionLabel: "Progresso",
  difficulty: { beginner: "Iniciante", intermediate: "Intermediário", advanced: "Avançado" },
  dashProgramTitle: "Programa TCC-I",
  dashCurrentWeek: "Semana atual do programa",
  dashCurrentLesson: "Lição atual",
  dashCompletion: "Progresso",
  dashRecommended: "Próxima lição recomendada",
  dashContinueLearning: "Continuar aprendendo",
  dashNotStarted: "Não iniciado",
  dashProgramComplete: "Programa concluído",
  badgesTitle: "Marcos",
  badgeSleepBasics: "Insígnia Fundamentos do Sono",
  badgeSleepBasicsDesc: "Você concluiu a Semana 1 — Fundamentos do Sono.",
  badgeSleepConsistency: "Insígnia Constância do Sono",
  badgeSleepConsistencyDesc: "Você concluiu a Semana 3 — Restrição do Sono.",
  badgeCbtiGraduate: "Insígnia Graduado em TCC-I",
  badgeCbtiGraduateDesc: "Você concluiu o programa completo de 6 semanas de TCC-I.",
  badgeLocked: "Bloqueada",
  badgeEarned: "Conquistada",
  programHubSub: "Uma jornada de 18 lições e 6 semanas para reconstruir seu sono, passo a passo.",
  programHubLessonsCount: "Lições",
  programHubComplete: "Concluído",
  unsupportedTitle: "Dados do programa de uma versão mais recente",
  unsupportedBody:
    "Seus dados do programa foram criados por uma versão mais nova do Somna. Seu progresso está seguro, mas não pode ser editado nesta versão. Atualize o aplicativo antes de continuar.",
  unsupportedRefresh: "Atualizar para verificar novidades",
  unsupportedDashLabel: "Dados do programa indisponíveis",
  // Lifecycle states
  statusNotStarted: "Não iniciado",
  statusActive: "Em andamento",
  statusPaused: "Pausado",
  statusCompleted: "Concluído",
  statusCorrupted: "Dados indisponíveis",
  // Start / introduction
  startProgramTitle: "Comece sua jornada com TCC-I",
  startProgramSubtitle:
    "Um programa de aprendizado estruturado e baseado em evidências, criado para ajudar você a construir hábitos de sono mais consistentes e sustentáveis.",
  startProgramCta: "Começar o programa",
  programStructureInfo: "6 semanas · 18 lições · no seu ritmo",
  programPrivacyNote:
    "Seu progresso fica no seu dispositivo. Nada é compartilhado sem sua escolha.",
  programWhatItDoes: "Lições, exercícios e progresso permanecem conectados ao longo do programa.",
  programWhatItDoesNot: "Esta é uma ferramenta educacional, não diagnóstico ou tratamento médico.",
  // Pause
  pauseProgram: "Pausar programa",
  pauseConfirmTitle: "Pausar seu programa?",
  pauseConfirmBody: "Seu progresso será preservado. Você pode voltar e continuar quando quiser.",
  pauseConfirmCancel: "Continuar",
  pauseConfirmPause: "Pausar por enquanto",
  pausedBannerTitle: "Programa pausado",
  pausedBannerBody: "Seu progresso está salvo. Continue quando estiver pronto.",
  pausedProgressPreserved: "Todo o progresso preservado",
  resumeProgram: "Retomar programa",
  resumeCta: "Retomar aprendizado",
  lessonPausedNote: "A conclusão de lições está pausada. Você ainda pode ler e revisar.",
  // Completion
  completionTitle: "Você concluiu o Programa TCC-I da Somna",
  completionSubtitle:
    "O objetivo não é dormir perfeitamente todas as noites. As habilidades que você praticou podem continuar apoiando um sono mais consistente ao longo do tempo.",
  completionDateLabel: "Concluído em",
  completionLessonsCount: "lições concluídas",
  completionMilestone: "Marco de Graduado em TCC-I conquistado",
  reviewLessons: "Revisar lições",
  completionDisclaimer:
    "Este programa é educacional e não substitui o acompanhamento médico profissional.",
  // Progress labels
  currentWeek: "Semana atual",
  overallProgress: "Progresso geral",
  lessonsCompletedLabel: "lições concluídas",
  // Week states
  weekCurrent: "Atual",
  weekInProgress: "Em andamento",
  // Weekly Focus
  weeklyFocusTitle: "Foco desta semana",
  weeklyFocusWhy: "Por que isso aparece",
  weeklyFocusDataWindow: "Baseado nos seus últimos 7 dias",
  weeklyFocusRelatedLesson: "Lição sugerida",
  weeklyFocusInsufficient:
    "Complete mais algumas entradas no diário do sono para receber um foco semanal mais informado por dados.",
  weeklyFocusDefer: "Agora não",
  weeklyFocusBasedOn: "Baseado em",
  // Dashboard
  dashStartProgram: "Começar a aprender",
  dashPausedStatus: "Pausado",
  dashResumeCta: "Retomar",
  dashReviewCta: "Revisar",
  dashLearnMore: "Saiba mais",
};

const pl: ProgramLessonUI = {
  readingTimeLabel: "Czas czytania",
  difficultyLabel: "Poziom trudności",
  progressLabel: "Postęp",
  lessonLabel: "Lekcja",
  weekLabel: "Tydzień",
  lessonsLabel: "Lekcje",
  ofLabel: "z",
  completeLabel: "Ukończ",
  completedLabel: "Ukończona",
  markCompleted: "Oznacz jako ukończoną",
  markIncomplete: "Oznacz jako nieukończoną",
  lessonCompleted: "✓ Lekcja ukończona",
  continue: "Kontynuuj",
  nextLesson: "Następna lekcja",
  previousLesson: "Poprzednia lekcja",
  backToWeek: "Powrót do tygodnia",
  backToProgram: "Powrót do programu",
  relatedLessons: "Powiązane lekcje",
  actionStepTitle: "Zadanie praktyczne",
  reflectionTitle: "Refleksja",
  faqTitle: "Najczęstsze pytania",
  lessonContentTitle: "Lekcja",
  startWeek: "Rozpocznij tydzień",
  reviewWeek: "Powtórz tydzień",
  lockedWeek: "Zablokowana",
  availableWeek: "Dostępna",
  completedWeek: "Ukończona",
  statusLabel: "Status",
  completionLabel: "Ukończenie",
  difficulty: {
    beginner: "Początkujący",
    intermediate: "Średniozaawansowany",
    advanced: "Zaawansowany",
  },
  dashProgramTitle: "Program CBT-I",
  dashCurrentWeek: "Aktualny tydzień programu",
  dashCurrentLesson: "Aktualna lekcja",
  dashCompletion: "Ukończenie",
  dashRecommended: "Polecana następna lekcja",
  dashContinueLearning: "Kontynuuj naukę",
  dashNotStarted: "Nie rozpoczęto",
  dashProgramComplete: "Program ukończony",
  badgesTitle: "Kamienie milowe",
  badgeSleepBasics: "Odznaka Podstawy snu",
  badgeSleepBasicsDesc: "Ukończono Tydzień 1 — Podstawy snu.",
  badgeSleepConsistency: "Odznaka Regularność snu",
  badgeSleepConsistencyDesc: "Ukończono Tydzień 3 — Ograniczenie snu.",
  badgeCbtiGraduate: "Odznaka Absolwent CBT-I",
  badgeCbtiGraduateDesc: "Ukończono cały sześciotygodniowy program CBT-I.",
  badgeLocked: "Zablokowana",
  badgeEarned: "Zdobyta",
  programHubSub: "Ośmnaście lekcji na sześć tygodni, które krok po kroku odbudowują Twój sen.",
  programHubLessonsCount: "Lekcji",
  programHubComplete: "Ukończono",
  unsupportedTitle: "Dane programu z nowszej wersji",
  unsupportedBody:
    "Twoje dane programu zostały utworzone przez nowszą wersję Somna. Twój postęp jest bezpieczny, ale nie może być edytowany w tej wersji. Odśwież lub zaktualizuj aplikację przed kontynuowaniem.",
  unsupportedRefresh: "Odśwież, aby sprawdzić aktualizacje",
  unsupportedDashLabel: "Dane programu niedostępne",
  // Lifecycle states
  statusNotStarted: "Nie rozpoczęto",
  statusActive: "W trakcie",
  statusPaused: "Wstrzymane",
  statusCompleted: "Ukończone",
  statusCorrupted: "Dane niedostępne",
  // Start / introduction
  startProgramTitle: "Rozpocznij swoją podróż z CBT-I",
  startProgramSubtitle:
    "Ustrukturyzowany, oparty na dowodach program edukacyjny, który pomoże Ci zbudować bardziej spójne i trwałe nawyki snu.",
  startProgramCta: "Rozpocznij program",
  programStructureInfo: "6 tygodni · 18 lekcji · we własnym tempie",
  programPrivacyNote:
    "Twój postęp pozostaje na Twoim urządzeniu. Nic nie jest udostępniane bez Twojej decyzji.",
  programWhatItDoes: "Lekcje, ćwiczenia i postęp pozostają ze sobą powiązane przez cały program.",
  programWhatItDoesNot: "To narzędzie edukacyjne, a nie diagnoza lub leczenie medyczne.",
  // Pause
  pauseProgram: "Wstrzymaj program",
  pauseConfirmTitle: "Wstrzymać program?",
  pauseConfirmBody:
    "Twój postęp zostanie zachowany. Możesz wrócić i kontynuować, kiedy będziesz gotowy.",
  pauseConfirmCancel: "Kontynuuj",
  pauseConfirmPause: "Wstrzymaj na razie",
  pausedBannerTitle: "Program wstrzymany",
  pausedBannerBody: "Twój postęp jest zapisany. Kontynuuj, kiedy będziesz gotowy.",
  pausedProgressPreserved: "Cały postęp zachowany",
  resumeProgram: "Wznów program",
  resumeCta: "Wznów naukę",
  lessonPausedNote: "Ukończenie lekcji jest wstrzymane. Nadal możesz czytać i powtarzać.",
  // Completion
  completionTitle: "Ukończyłeś/aś program CBT-I Somna",
  completionSubtitle:
    "Celem nie jest idealny sen co noc. Umiejętności, które ćwiczyłeś/aś, mogą nadal wspierać bardziej spójny sen z czasem.",
  completionDateLabel: "Ukończono",
  completionLessonsCount: "lekcji ukończonych",
  completionMilestone: "Kamień milowy Absolwenta CBT-I zdobyty",
  reviewLessons: "Powtórz lekcje",
  completionDisclaimer:
    "Ten program ma charakter edukacyjny i nie zastępuje profesjonalnej opieki medycznej.",
  // Progress labels
  currentWeek: "Aktualny tydzień",
  overallProgress: "Ogólny postęp",
  lessonsCompletedLabel: "lekcji ukończonych",
  // Week states
  weekCurrent: "Aktualny",
  weekInProgress: "W trakcie",
  // Weekly Focus
  weeklyFocusTitle: "Fokus tego tygodnia",
  weeklyFocusWhy: "Dlaczego się to pojawia",
  weeklyFocusDataWindow: "Na podstawie ostatnich 7 dni",
  weeklyFocusRelatedLesson: "Sugerowana lekcja",
  weeklyFocusInsufficient:
    "Uzupełnij kilka więcej wpisów w dzienniku snu, aby otrzymać bardziej oparty na danych tygodniowy fokus.",
  weeklyFocusDefer: "Nie teraz",
  weeklyFocusBasedOn: "Na podstawie",
  // Dashboard
  dashStartProgram: "Rozpocznij naukę",
  dashPausedStatus: "Wstrzymane",
  dashResumeCta: "Wznów",
  dashReviewCta: "Powtórz",
  dashLearnMore: "Dowiedz się więcej",
};

const de: ProgramLessonUI = {
  readingTimeLabel: "Lesezeit",
  difficultyLabel: "Schwierigkeit",
  progressLabel: "Fortschritt",
  lessonLabel: "Lektion",
  weekLabel: "Woche",
  lessonsLabel: "Lektionen",
  ofLabel: "von",
  completeLabel: "Abschließen",
  completedLabel: "Abgeschlossen",
  markCompleted: "Als abgeschlossen markieren",
  markIncomplete: "Als nicht abgeschlossen markieren",
  lessonCompleted: "✓ Lektion abgeschlossen",
  continue: "Weiter",
  nextLesson: "Nächste Lektion",
  previousLesson: "Vorherige Lektion",
  backToWeek: "Zurück zur Woche",
  backToProgram: "Zurück zum Programm",
  relatedLessons: "Verwandte Lektionen",
  actionStepTitle: "Praktische Aufgabe",
  reflectionTitle: "Reflexion",
  faqTitle: "Häufige Fragen",
  lessonContentTitle: "Die Lektion",
  startWeek: "Woche starten",
  reviewWeek: "Woche wiederholen",
  lockedWeek: "Gesperrt",
  availableWeek: "Verfügbar",
  completedWeek: "Abgeschlossen",
  statusLabel: "Status",
  completionLabel: "Abschluss",
  difficulty: { beginner: "Einsteiger", intermediate: "Mittel", advanced: "Fortgeschritten" },
  dashProgramTitle: "CBT-I-Programm",
  dashCurrentWeek: "Aktuelle Programmwoche",
  dashCurrentLesson: "Aktuelle Lektion",
  dashCompletion: "Abschluss",
  dashRecommended: "Empfohlene nächste Lektion",
  dashContinueLearning: "Weiterlernen",
  dashNotStarted: "Nicht begonnen",
  dashProgramComplete: "Programm abgeschlossen",
  badgesTitle: "Meilensteine",
  badgeSleepBasics: "Schlafgrundlagen-Abzeichen",
  badgeSleepBasicsDesc: "Woche 1 abgeschlossen — Schlafgrundlagen.",
  badgeSleepConsistency: "Schlafkonsistenz-Abzeichen",
  badgeSleepConsistencyDesc: "Woche 3 abgeschlossen — Schlafrestriktion.",
  badgeCbtiGraduate: "CBT-I-Absolventen-Abzeichen",
  badgeCbtiGraduateDesc: "Das vollständige 6-wöchige CBT-I-Programm abgeschlossen.",
  badgeLocked: "Gesperrt",
  badgeEarned: "Verdient",
  programHubSub:
    "Eine Reise mit 18 Lektionen über 6 Wochen, um deinen Schlaf Schritt für Schritt wieder aufzubauen.",
  programHubLessonsCount: "Lektionen",
  programHubComplete: "Abgeschlossen",
  unsupportedTitle: "Programmdaten aus einer neueren Version",
  unsupportedBody:
    "Deine Programmdaten wurden von einer neueren Version von Somna erstellt. Dein Fortschritt ist sicher, kann aber in dieser Version nicht bearbeitet werden. Aktualisiere die App, bevor du fortfährst.",
  unsupportedRefresh: "Aktualisieren, um nach Updates zu suchen",
  unsupportedDashLabel: "Programmdaten nicht verfügbar",
  // Lifecycle states
  statusNotStarted: "Nicht begonnen",
  statusActive: "In Bearbeitung",
  statusPaused: "Pausiert",
  statusCompleted: "Abgeschlossen",
  statusCorrupted: "Daten nicht verfügbar",
  // Start / introduction
  startProgramTitle: "Beginne deine CBT-I-Reise",
  startProgramSubtitle:
    "Ein strukturiertes, evidenzbasiertes Lernprogramm, das dir hilft, konsistentere und nachhaltigere Schlafgewohnheiten aufzubauen.",
  startProgramCta: "Programm starten",
  programStructureInfo: "6 Wochen · 18 Lektionen · in deinem Tempo",
  programPrivacyNote:
    "Dein Fortschritt bleibt auf deinem Gerät. Nichts wird ohne deine Entscheidung geteilt.",
  programWhatItDoes: "Lektionen, Übungen und Fortschritt bleiben während des Programms verbunden.",
  programWhatItDoesNot:
    "Dies ist ein pädagogisches Werkzeug, keine medizinische Diagnose oder Behandlung.",
  // Pause
  pauseProgram: "Programm pausieren",
  pauseConfirmTitle: "Programm pausieren?",
  pauseConfirmBody:
    "Dein Fortschritt wird erhalten bleiben. Du kannst zurückkehren und fortsetzen, wann immer du bereit bist.",
  pauseConfirmCancel: "Weiter machen",
  pauseConfirmPause: "Vorerst pausieren",
  pausedBannerTitle: "Programm pausiert",
  pausedBannerBody: "Dein Fortschritt ist gespeichert. Fahre fort, wenn du bereit bist.",
  pausedProgressPreserved: "Gesamter Fortschritt erhalten",
  resumeProgram: "Programm fortsetzen",
  resumeCta: "Lernen fortsetzen",
  lessonPausedNote: "Lektionsabschluss ist pausiert. Du kannst weiterhin lesen und wiederholen.",
  // Completion
  completionTitle: "Du hast das Somna CBT-I-Programm abgeschlossen",
  completionSubtitle:
    "Das Ziel ist nicht perfekter Schlaf jede Nacht. Die Fähigkeiten, die du geübt hast, können langfristig einen konsistenteren Schlaf unterstützen.",
  completionDateLabel: "Abgeschlossen am",
  completionLessonsCount: "Lektionen abgeschlossen",
  completionMilestone: "Meilenstein CBT-I-Absolvent erreicht",
  reviewLessons: "Lektionen wiederholen",
  completionDisclaimer:
    "Dieses Programm ist pädagogisch und kein Ersatz für professionelle medizinische Versorgung.",
  // Progress labels
  currentWeek: "Aktuelle Woche",
  overallProgress: "Gesamtfortschritt",
  lessonsCompletedLabel: "Lektionen abgeschlossen",
  // Week states
  weekCurrent: "Aktuell",
  weekInProgress: "In Bearbeitung",
  // Weekly Focus
  weeklyFocusTitle: "Fokus dieser Woche",
  weeklyFocusWhy: "Warum das erscheint",
  weeklyFocusDataWindow: "Basierend auf deinen letzten 7 Tagen",
  weeklyFocusRelatedLesson: "Vorgeschlagene Lektion",
  weeklyFocusInsufficient:
    "Vervollständige ein paar weitere Schlaftagebucheinträge, um einen datenbasierteren Wochenfokus zu erhalten.",
  weeklyFocusDefer: "Nicht jetzt",
  weeklyFocusBasedOn: "Basierend auf",
  // Dashboard
  dashStartProgram: "Lernen starten",
  dashPausedStatus: "Pausiert",
  dashResumeCta: "Fortsetzen",
  dashReviewCta: "Wiederholen",
  dashLearnMore: "Mehr erfahren",
};

const dicts: Partial<Record<Lang, ProgramLessonUI>> = { en, zh, es, pt, pl, de };

export function getProgramLessonUI(lang: Lang): ProgramLessonUI {
  return dicts[lang] ?? en;
}
