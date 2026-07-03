/**
 * Reminder Center — i18n strings (en / zh / es).
 *
 * Uses the same flat-dict + `{var}` interpolation pattern as `sleep-i18n.ts`.
 * Keys are namespaced under `reminder.*` to avoid collisions.
 */
import { useI18n, type Lang } from "@/lib/i18n";

type Strings = Record<string, string>;

const en: Strings = {
  "reminder.title": "Reminder Center",
  "reminder.subtitle": "Stay on track with your CBT-I program.",
  "reminder.description": "Receive gentle reminders to complete your daily sleep routine.",
  "reminder.email.label": "Email Address",
  "reminder.email.placeholder": "you@example.com",
  "reminder.enable.label": "Enable Email Reminders",
  "reminder.enable.desc": "Get a gentle nudge at your chosen times.",
  "reminder.morning.label": "Morning Reminder",
  "reminder.morning.desc": "Start your day with your sleep window.",
  "reminder.evening.label": "Evening Reminder",
  "reminder.evening.desc": "Wind down and complete your diary.",
  "reminder.weekly.label": "Weekly Summary",
  "reminder.weekly.desc": "Review your progress once a week.",
  "reminder.save": "Save Settings",
  "reminder.saved": "Reminder settings saved.",
  "reminder.error.emailEmpty": "Please enter an email address.",
  "reminder.error.emailInvalid": "Please enter a valid email address.",
  "reminder.preview.title": "Preview",
  "reminder.preview.greeting": "Good evening 🌙",
  "reminder.preview.window": "Tonight's Sleep Window",
  "reminder.preview.task": "Today's CBT-I Task",
  "reminder.preview.taskDone": "Complete Sleep Diary",
  "reminder.preview.nextLesson": "Next Lesson",
  "reminder.preview.week2": "Week 2",
  "reminder.preview.stimulus": "Stimulus Control",
  "reminder.channel.email": "Email",
  "reminder.weekday.Monday": "Monday",
  "reminder.weekday.Tuesday": "Tuesday",
  "reminder.weekday.Wednesday": "Wednesday",
  "reminder.weekday.Thursday": "Thursday",
  "reminder.weekday.Friday": "Friday",
  "reminder.weekday.Saturday": "Saturday",
  "reminder.weekday.Sunday": "Sunday",
  "reminder.back": "Back to Dashboard",
  "reminder.noindex": "Personal settings page — not indexed.",
};

const zh: Strings = {
  "reminder.title": "提醒中心",
  "reminder.subtitle": "坚持你的 CBT-I 课程。",
  "reminder.description": "接收温和的提醒，完成你的日常睡眠流程。",
  "reminder.email.label": "邮箱地址",
  "reminder.email.placeholder": "you@example.com",
  "reminder.enable.label": "启用邮件提醒",
  "reminder.enable.desc": "在设定的时间收到温和的提醒。",
  "reminder.morning.label": "晨间提醒",
  "reminder.morning.desc": "以你的睡眠窗口开启新的一天。",
  "reminder.evening.label": "晚间提醒",
  "reminder.evening.desc": "放松身心，完成睡眠日记。",
  "reminder.weekly.label": "每周总结",
  "reminder.weekly.desc": "每周回顾一次你的进展。",
  "reminder.save": "保存设置",
  "reminder.saved": "提醒设置已保存。",
  "reminder.error.emailEmpty": "请输入邮箱地址。",
  "reminder.error.emailInvalid": "请输入有效的邮箱地址。",
  "reminder.preview.title": "预览",
  "reminder.preview.greeting": "晚上好 🌙",
  "reminder.preview.window": "今晚的睡眠窗口",
  "reminder.preview.task": "今日 CBT-I 任务",
  "reminder.preview.taskDone": "完成睡眠日记",
  "reminder.preview.nextLesson": "下一课",
  "reminder.preview.week2": "第 2 周",
  "reminder.preview.stimulus": "刺激控制",
  "reminder.channel.email": "邮件",
  "reminder.weekday.Monday": "周一",
  "reminder.weekday.Tuesday": "周二",
  "reminder.weekday.Wednesday": "周三",
  "reminder.weekday.Thursday": "周四",
  "reminder.weekday.Friday": "周五",
  "reminder.weekday.Saturday": "周六",
  "reminder.weekday.Sunday": "周日",
  "reminder.back": "返回仪表盘",
  "reminder.noindex": "个人设置页面 — 不被索引。",
};

const es: Strings = {
  "reminder.title": "Centro de recordatorios",
  "reminder.subtitle": "Mantente al día con tu programa CBT-I.",
  "reminder.description": "Recibe recordatorios suaves para completar tu rutina diaria de sueño.",
  "reminder.email.label": "Correo electrónico",
  "reminder.email.placeholder": "you@example.com",
  "reminder.enable.label": "Activar recordatorios por correo",
  "reminder.enable.desc": "Recibe un recordatorio suave en tus horarios elegidos.",
  "reminder.morning.label": "Recordatorio matutino",
  "reminder.morning.desc": "Comienza el día con tu ventana de sueño.",
  "reminder.evening.label": "Recordatorio nocturno",
  "reminder.evening.desc": "Relájate y completa tu diario.",
  "reminder.weekly.label": "Resumen semanal",
  "reminder.weekly.desc": "Revisa tu progreso una vez por semana.",
  "reminder.save": "Guardar configuración",
  "reminder.saved": "Configuración de recordatorios guardada.",
  "reminder.error.emailEmpty": "Por favor, introduce un correo electrónico.",
  "reminder.error.emailInvalid": "Por favor, introduce un correo electrónico válido.",
  "reminder.preview.title": "Vista previa",
  "reminder.preview.greeting": "Buenas noches 🌙",
  "reminder.preview.window": "Ventana de sueño de esta noche",
  "reminder.preview.task": "Tarea CBT-I de hoy",
  "reminder.preview.taskDone": "Completar diario de sueño",
  "reminder.preview.nextLesson": "Próxima lección",
  "reminder.preview.week2": "Semana 2",
  "reminder.preview.stimulus": "Control de estímulos",
  "reminder.channel.email": "Correo",
  "reminder.weekday.Monday": "Lunes",
  "reminder.weekday.Tuesday": "Martes",
  "reminder.weekday.Wednesday": "Miércoles",
  "reminder.weekday.Thursday": "Jueves",
  "reminder.weekday.Friday": "Viernes",
  "reminder.weekday.Saturday": "Sábado",
  "reminder.weekday.Sunday": "Domingo",
  "reminder.back": "Volver al panel",
  "reminder.noindex": "Página de configuración personal — no indexada.",
};

const dicts: Partial<Record<Lang, Strings>> = { en, zh, es, pt: en };

/** Hook returning the reminder i18n translator with {var} interpolation. */
export function useReminderI18n() {
  const { lang } = useI18n();
  const t = (k: string, vars?: Record<string, string | number>) => {
    const raw = (dicts[lang] ?? dicts.en!)[k] ?? dicts.en![k] ?? k;
    if (!vars) return raw;
    return raw.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? ""));
  };
  return { t, lang };
}
