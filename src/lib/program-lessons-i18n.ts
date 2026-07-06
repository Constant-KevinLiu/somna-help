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
  difficulty: { beginner: "Początkujący", intermediate: "Średniozaawansowany", advanced: "Zaawansowany" },
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
};

const dicts: Partial<Record<Lang, ProgramLessonUI>> = { en, zh, es, pt, pl };

export function getProgramLessonUI(lang: Lang): ProgramLessonUI {
  return dicts[lang] ?? en;
}
