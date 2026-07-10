import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Bell, Moon, CheckCircle2, BookOpen, ArrowLeft, Mail, Sparkles } from "lucide-react";
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
  const [status, setStatus] = useState<{ enabled: boolean; email: string; time: string; timezone: string; language: string; nextRun: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);

  // Load settings on mount (SSR-safe).
  useEffect(() => {
    setSettings(loadReminderSettings());
    setHydrated(true);
  }, []);

  const update = <K extends keyof ReminderSettings>(key: K, value: ReminderSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    if (key === "email") setEmailError(null);
  };

  const handleSave = async () => {
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
      reminderTime: settings.reminderTime || settings.eveningTime,
      timezone: settings.timezone || "UTC",
      language: settings.language || "en",
    };

    saveReminderSettings(toSave);
    setSaving(true);
    try {
      const response = await fetch("/api/reminders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: toSave.email,
          enabled: toSave.enabled,
          time: toSave.reminderTime || toSave.eveningTime,
          timezone: toSave.timezone,
          language: toSave.language,
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload?.message || "Failed to save reminder settings");
      }
      setStatus({
        enabled: Boolean(payload?.enabled),
        email: payload?.email || toSave.email,
        time: payload?.time || toSave.reminderTime || toSave.eveningTime,
        timezone: payload?.timezone || toSave.timezone,
        language: payload?.language || toSave.language,
        nextRun: payload?.nextRun || "Pending",
      });
      toast.success(t("reminder.saved"));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save reminder settings");
    } finally {
      setSaving(false);
    }
  };

  const handleTestEmail = async () => {
    if (!settings.email) {
      toast.error(t("reminder.error.emailEmpty"));
      return;
    }

    setTesting(true);
    try {
      const response = await fetch("/api/reminders/test", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: normalizeEmail(settings.email), language: settings.language || "en" }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload?.message || "Test email failed");
      }
      toast.success(payload?.message || "Test email sent");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to send test email");
    } finally {
      setTesting(false);
    }
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

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-medium text-foreground">{t("reminder.timezone.label")}</div>
                <Select
                  value={settings.timezone}
                  onValueChange={(v) => update("timezone", v)}
                >
                  <SelectTrigger className="mt-3" aria-label={t("reminder.timezone.label")}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="America/New_York">America/New_York</SelectItem>
                    <SelectItem value="Europe/Madrid">Europe/Madrid</SelectItem>
                    <SelectItem value="Asia/Shanghai">Asia/Shanghai</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-medium text-foreground">{t("reminder.language.label")}</div>
                <Select
                  value={settings.language}
                  onValueChange={(v) => update("language", v)}
                >
                  <SelectTrigger className="mt-3" aria-label={t("reminder.language.label")}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">{t("reminder.language.en")}</SelectItem>
                    <SelectItem value="es">{t("reminder.language.es")}</SelectItem>
                    <SelectItem value="pt-BR">{t("reminder.language.pt")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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

            {/* Status card */}
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-muted-foreground">
              <div className="font-medium text-foreground">{t("reminder.status.title")}</div>
              <div className="mt-2 space-y-1">
                <div>{status?.enabled ? `✓ ${t("reminder.status.active")}` : `○ ${t("reminder.status.inactive")}`}</div>
                <div>{t("reminder.status.email")}: {status?.email || settings.email || "—"}</div>
                <div>{t("reminder.status.time")}: {status?.time || settings.reminderTime || settings.eveningTime}</div>
                <div>{t("reminder.status.timezone")}: {status?.timezone || settings.timezone || "UTC"}</div>
                <div>{t("reminder.status.nextRun")}: {status?.nextRun || "Pending"}</div>
              </div>
            </div>

            {/* Save button */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="w-full rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground"
              >
                {saving ? "Saving…" : t("reminder.save")}
              </Button>
              <Button
                onClick={handleTestEmail}
                variant="outline"
                disabled={testing || !settings.email}
                className="w-full rounded-full"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                {testing ? "Sending…" : t("reminder.testButton")}
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
