import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Bell, Moon, CheckCircle2, BookOpen, ArrowLeft, Mail } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { TimeWheelPicker } from "@/components/ui/TimeWheelPicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useReminderI18n } from "@/services/reminder/reminder-i18n";
import {
  DEFAULT_REMINDER_SETTINGS,
  WEEKDAYS,
  type ReminderSettings,
  type Weekday,
} from "@/services/reminder/reminder-types";
import { loadReminderSettings, saveReminderSettings } from "@/services/reminder/reminder-storage";
import { validateEmailForUI, normalizeEmail } from "@/services/reminder/reminder-validation";

export const Route = createFileRoute("/reminder")({
  component: ReminderCenter,
  head: () => ({
    meta: [
      { title: "Reminder Center — somna" },
      { name: "description", content: "Manage your CBT-I reminder preferences." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

function ReminderCenter() {
  const { t } = useReminderI18n();
  const [settings, setSettings] = useState<ReminderSettings>(DEFAULT_REMINDER_SETTINGS);
  const [hydrated, setHydrated] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  // Load settings on mount (SSR-safe).
  useEffect(() => {
    setSettings(loadReminderSettings());
    setHydrated(true);
  }, []);

  const update = <K extends keyof ReminderSettings>(key: K, value: ReminderSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    if (key === "email") setEmailError(null);
  };

  const handleSave = () => {
    // Validate email if reminders are enabled.
    if (settings.enabled) {
      const error = validateEmailForUI(settings.email);
      if (error) {
        setEmailError(error);
        return;
      }
    }
    const toSave: ReminderSettings = {
      ...settings,
      email: normalizeEmail(settings.email),
    };
    saveReminderSettings(toSave);
    toast.success(t("reminder.saved"));
  };

  if (!hydrated) {
    return <PageHero eyebrow="SETTINGS" title={t("reminder.title")} />;
  }

  return (
    <>
      <PageHero eyebrow="SETTINGS" title={t("reminder.title")} sub={t("reminder.subtitle")} />

      <section className="px-5 pb-20">
        <div className="mx-auto max-w-2xl space-y-6">
          {/* Back to Dashboard */}
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {t("reminder.back")}
          </Link>

          {/* Main settings card */}
          <div className="glass-strong rounded-3xl p-6 md:p-8 animate-fade-up">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <Bell className="h-3.5 w-3.5 text-accent" />
              {t("reminder.title")}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{t("reminder.description")}</p>

            {/* Email address */}
            <div className="mt-6 space-y-2">
              <label htmlFor="reminder-email" className="text-sm font-medium text-foreground">
                {t("reminder.email.label")}
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="reminder-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder={t("reminder.email.placeholder")}
                  value={settings.email}
                  onChange={(e) => update("email", e.target.value)}
                  aria-invalid={!!emailError}
                  aria-describedby={emailError ? "reminder-email-error" : undefined}
                  className="pl-9"
                />
              </div>
              {emailError && (
                <p id="reminder-email-error" className="text-xs text-red-400" role="alert">
                  {t(emailError)}
                </p>
              )}
            </div>

            {/* Enable toggle */}
            <div className="mt-6 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="pr-4">
                <div className="text-sm font-medium text-foreground">
                  {t("reminder.enable.label")}
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {t("reminder.enable.desc")}
                </div>
              </div>
              <Switch
                checked={settings.enabled}
                onCheckedChange={(v) => update("enabled", v)}
                aria-label={t("reminder.enable.label")}
              />
            </div>

            {/* Morning reminder */}
            <ReminderTimeRow
              icon={<Moon className="h-4 w-4 text-accent" />}
              label={t("reminder.morning.label")}
              desc={t("reminder.morning.desc")}
              value={settings.morningTime}
              onChange={(v) => update("morningTime", v)}
            />

            {/* Evening reminder */}
            <ReminderTimeRow
              icon={<Moon className="h-4 w-4 text-accent" />}
              label={t("reminder.evening.label")}
              desc={t("reminder.evening.desc")}
              value={settings.eveningTime}
              onChange={(v) => update("eveningTime", v)}
            />

            {/* Weekly summary */}
            <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="pr-4">
                <div className="text-sm font-medium text-foreground">
                  {t("reminder.weekly.label")}
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {t("reminder.weekly.desc")}
                </div>
              </div>
              <Select
                value={settings.weeklyDay}
                onValueChange={(v) => update("weeklyDay", v as Weekday)}
              >
                <SelectTrigger className="w-32" aria-label={t("reminder.weekly.label")}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {WEEKDAYS.map((day) => (
                    <SelectItem key={day} value={day}>
                      {t(`reminder.weekday.${day}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Save button */}
            <div className="mt-6">
              <Button
                onClick={handleSave}
                className="w-full rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground"
              >
                {t("reminder.save")}
              </Button>
            </div>
          </div>

          {/* Static preview card */}
          <div className="glass-strong rounded-3xl p-6 md:p-8 animate-fade-up">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <Bell className="h-3.5 w-3.5 text-accent" />
              {t("reminder.preview.title")}
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="font-display text-lg text-foreground">
                {t("reminder.preview.greeting")}
              </div>

              <div className="mt-4 space-y-3">
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    {t("reminder.preview.window")}
                  </div>
                  <div className="mt-1 font-display text-base text-foreground">23:30 – 07:00</div>
                </div>

                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    {t("reminder.preview.task")}
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-sm text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    {t("reminder.preview.taskDone")}
                  </div>
                </div>

                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    {t("reminder.preview.nextLesson")}
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-sm text-foreground">
                    <BookOpen className="h-4 w-4 text-accent" />
                    <span className="font-medium">{t("reminder.preview.week2")}</span>
                    <span className="text-muted-foreground">·</span>
                    {t("reminder.preview.stimulus")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/** Reusable row for a time-based reminder setting. */
function ReminderTimeRow({
  icon,
  label,
  desc,
  value,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  desc: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="pr-4">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          {icon}
          {label}
        </div>
        <div className="mt-0.5 text-xs text-muted-foreground">{desc}</div>
      </div>
      <TimeWheelPicker
        value={value}
        onChange={onChange}
        label={label}
        className="w-28 rounded-xl px-3 text-xl"
      />
    </div>
  );
}
