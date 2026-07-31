/**
 * Phase F — Analytics & Insight English Dictionary (Canonical Source)
 *
 * All translation keys for the analytics layer.
 * This is the canonical English source — all other locales derive from this.
 */
import type { Dict } from "@/lib/i18n";

export const analyticsEn: Dict = {
  // ============================================
  // Windows / Time Ranges
  // ============================================
  "analytics.window.7d": "Last 7 days",
  "analytics.window.14d": "Last 14 days",
  "analytics.window.30d": "Last 30 days",
  "analytics.window.90d": "Last 90 days",
  "analytics.window.thisWeek": "This week",
  "analytics.window.lastWeek": "Last week",
  "analytics.window.thisMonth": "This month",
  "analytics.window.lastMonth": "Last month",

  // ============================================
  // Data Sufficiency
  // ============================================
  "analytics.sufficiency.none":
    "Start recording your sleep to see your patterns.",
  "analytics.sufficiency.insufficient":
    "Keep recording for a few more days to see a clearer pattern.",
  "analytics.sufficiency.limited":
    "Here's what we're seeing so far — keep recording for a fuller picture.",
  "analytics.sufficiency.sufficient": "", // no banner needed for sufficient

  // ============================================
  // Metric Labels
  // ============================================
  "analytics.metric.timeInBed": "Time in Bed",
  "analytics.metric.totalSleepTime": "Total Sleep Time",
  "analytics.metric.sleepEfficiency": "Sleep Efficiency",
  "analytics.metric.sleepOnsetLatency": "Sleep Onset Latency",
  "analytics.metric.wakeAfterSleepOnset": "Wake After Sleep Onset",
  "analytics.metric.numberOfAwakenings": "Night Awakenings",
  "analytics.metric.avgBedtime": "Average Bedtime",
  "analytics.metric.avgWakeTime": "Average Wake Time",
  "analytics.metric.bedtimeVariability": "Bedtime Variability",
  "analytics.metric.wakeTimeVariability": "Wake Time Variability",
  "analytics.metric.sleepRegularity": "Sleep Regularity",
  "analytics.metric.diaryCompletionRate": "Diary Completion",
  "analytics.metric.sleepQuality": "Sleep Quality",
  "analytics.metric.mood": "Morning Mood",
  "analytics.metric.recordedNights": "Recorded Nights",

  // ============================================
  // Units & Formatting
  // ============================================
  "analytics.unit.minutes": "min",
  "analytics.unit.hours": "h",
  "analytics.unit.percent": "%",
  "analytics.unit.nights": "nights",
  "analytics.unit.days": "days",

  // ============================================
  // Trend Directions
  // ============================================
  "analytics.trend.improving": "Improving",
  "analytics.trend.declining": "Declining",
  "analytics.trend.stable": "Stable",
  "analytics.trend.insufficient_data": "Not enough data yet",
  "analytics.trend.later": "Later",
  "analytics.trend.earlier": "Earlier",

  // ============================================
  // Pattern Descriptions
  // ============================================
  "analytics.pattern.weekend_bedtime_later":
    "On the days recorded, your bedtime was later on weekends.",
  "analytics.pattern.weekend_bedtime_earlier":
    "On the days recorded, your bedtime was earlier on weekends.",
  "analytics.pattern.weekend_waketime_later":
    "On the days recorded, you woke up later on weekends.",
  "analytics.pattern.weekend_waketime_earlier":
    "On the days recorded, you woke up earlier on weekends.",
  "analytics.pattern.consistent_wake_time":
    "Your wake time has been very consistent this period.",
  "analytics.pattern.variable_bedtime":
    "Your bedtime varied quite a bit during this period.",
  "analytics.pattern.reminder_stronger":
    "You've been keeping up with your reminders more consistently than your diary.",
  "analytics.pattern.diary_stronger":
    "Your diary recording has been more consistent than your reminder completion.",
  "analytics.pattern.stable_wake_streak":
    "You've maintained a consistent wake time for several days in a row.",

  // ============================================
  // Insight Cards — Trends
  // ============================================
  "analytics.insight.trend.improving.sleepEfficiency.title":
    "Your sleep efficiency is improving",
  "analytics.insight.trend.improving.sleepEfficiency.body":
    "Your sleep efficiency has trended upward recently. This suggests your sleep is becoming more restful. Keep up what's working.",
  "analytics.insight.trend.declining.sleepEfficiency.title":
    "Your sleep efficiency has dipped",
  "analytics.insight.trend.declining.sleepEfficiency.body":
    "Your sleep efficiency has been lower recently. This is a gentle observation, not a diagnosis — many factors affect how we sleep from week to week.",

  "analytics.insight.trend.improving.totalSleepTime.title":
    "You're getting more sleep",
  "analytics.insight.trend.improving.totalSleepTime.body":
    "Your total sleep time has increased. More restful hours can make a noticeable difference in how you feel during the day.",
  "analytics.insight.trend.declining.totalSleepTime.title":
    "Your total sleep has decreased",
  "analytics.insight.trend.declining.totalSleepTime.body":
    "Your total sleep time has been shorter recently. This is worth observing — changes in routine, stress, or schedule can all play a role.",

  "analytics.insight.trend.improving.sleepOnsetLatency.title":
    "You're falling asleep faster",
  "analytics.insight.trend.improving.sleepOnsetLatency.body":
    "It's taking you less time to fall asleep. This is a good sign — your wind-down routine may be helping.",
  "analytics.insight.trend.declining.sleepOnsetLatency.title":
    "It's taking longer to fall asleep",
  "analytics.insight.trend.declining.sleepOnsetLatency.body":
    "You've been taking longer to fall asleep recently. Racing thoughts, screen time before bed, or changes in routine can all contribute.",

  "analytics.insight.trend.improving.sleepRegularity.title":
    "Your sleep schedule is getting more regular",
  "analytics.insight.trend.improving.sleepRegularity.body":
    "Your bedtime and wake time have been more consistent. A regular schedule is one of the foundations of healthy sleep.",
  "analytics.insight.trend.declining.sleepRegularity.title":
    "Your sleep schedule has been more variable",
  "analytics.insight.trend.declining.sleepRegularity.body":
    "Your bedtime and wake time have varied more recently. This is normal during busy weeks — small adjustments can help bring back consistency.",

  // ============================================
  // Insight Cards — Patterns
  // ============================================
  "analytics.insight.pattern.weekend_bedtime_later.title":
    "Later bedtimes on weekends",
  "analytics.insight.pattern.weekend_bedtime_later.body":
    "Your bedtime shifts later on weekends. Social jet lag — even a small shift — can affect how you feel at the start of the week.",
  "analytics.insight.pattern.weekend_waketime_later.title":
    "Sleeping in on weekends",
  "analytics.insight.pattern.weekend_waketime_later.body":
    "You tend to wake up later on weekends. Sleeping in by more than an hour can shift your body clock and make Monday mornings harder.",

  "analytics.insight.pattern.consistent_wake_time.title":
    "Consistent wake time",
  "analytics.insight.pattern.consistent_wake_time.body":
    "Your wake time has been very steady. A consistent wake time is one of the most effective ways to strengthen your circadian rhythm — great job.",

  "analytics.insight.pattern.variable_bedtime.title":
    "Your bedtime varies a lot",
  "analytics.insight.pattern.variable_bedtime.body":
    "Your bedtime has been quite different from night to night. Try observing your bedtime without trying to force it earlier — awareness is the first step.",

  "analytics.insight.pattern.stable_wake_streak.title":
    "Consistent wake streak",
  "analytics.insight.pattern.stable_wake_streak.body":
    "You've been waking up at a similar time for several days in a row. This builds a strong circadian anchor — keep it going.",

  "analytics.insight.pattern.reminder_habit_stronger_than_diary.title":
    "Reminders are sticking well",
  "analytics.insight.pattern.reminder_habit_stronger_than_diary.body":
    "You've been more consistent with your reminders than with your diary. The reminders are building a routine — can you bring the diary along too?",

  // ============================================
  // Insight Cards — Encouragement
  // ============================================
  "analytics.insight.encouragement.start_recording.title":
    "Your sleep story starts here",
  "analytics.insight.encouragement.start_recording.body":
    "Every journey begins with a single night. Recording your sleep for just one week can reveal patterns you might not have noticed.",

  "analytics.insight.encouragement.keep_going.title":
    "You're getting started",
  "analytics.insight.encouragement.keep_going.body":
    "Great — you've begun recording. Keep going for a few more days and you'll start to see your sleep pattern take shape.",

  "analytics.insight.encouragement.first_week.title":
    "You've built a foundation",
  "analytics.insight.encouragement.first_week.body":
    "You've recorded several nights this week. That alone is an achievement. The first week is about observation — not perfection.",

  "analytics.insight.encouragement.streak.title":
    "You're on a roll",
  "analytics.insight.encouragement.streak.body":
    "Recording your sleep day after day builds awareness, and awareness is the first step toward change. Keep the streak going.",

  // ============================================
  // Insight Actions
  // ============================================
  "analytics.insight.action.learn_more": "Learn more",
  "analytics.insight.action.observe": "Keep observing",
  "analytics.insight.action.start_diary": "Start your diary",
  "analytics.insight.action.continue_recording": "Keep recording",

  // ============================================
  // Weekly Summary
  // ============================================
  "analytics.weekly.title": "Weekly Summary",
  "analytics.weekly.recordedNights": "Recorded Nights",
  "analytics.weekly.completion": "Completion",
  "analytics.weekly.avgSleep": "Avg. Sleep Time",
  "analytics.weekly.avgEfficiency": "Avg. Efficiency",
  "analytics.weekly.avgLatency": "Avg. Onset Latency",
  "analytics.weekly.bedtime": "Bedtime",
  "analytics.weekly.wakeTime": "Wake Time",
  "analytics.weekly.bedtimeVar": "Bedtime Variability",
  "analytics.weekly.wakeTimeVar": "Wake Time Variability",
  "analytics.weekly.regularity": "Sleep Regularity",
  "analytics.weekly.reminderCompletion": "Reminder Consistency",
  "analytics.weekly.strongestPattern": "What went well",
  "analytics.weekly.areaToObserve": "What to observe next",
  "analytics.weekly.previousWeek": "Previous week",
  "analytics.weekly.nextWeek": "Next week",
  "analytics.weekly.thisWeek": "This week",
  "analytics.weekly.empty":
    "No recorded nights this week. Your weekly summary will appear here as you record.",

  // ============================================
  // Monthly Summary
  // ============================================
  "analytics.monthly.title": "Monthly Overview",
  "analytics.monthly.recordedNights": "Recorded nights this month",
  "analytics.monthly.completion": "Diary consistency",
  "analytics.monthly.avgEfficiency": "Avg. efficiency",
  "analytics.monthly.avgSleep": "Avg. sleep time",
  "analytics.monthly.regularity": "Sleep regularity",
  "analytics.monthly.bestStreak": "Best streak",
  "analytics.monthly.habitConsistency": "Habit consistency",
  "analytics.monthly.weeklyTrend": "Weekly trend",
  "analytics.monthly.notableChanges": "Notable changes",
  "analytics.monthly.previousMonth": "Previous month",
  "analytics.monthly.nextMonth": "Next month",
  "analytics.monthly.empty":
    "Keep recording — your monthly overview will appear here.",

  // ============================================
  // Weekly Focus
  // ============================================
  "analytics.focus.title": "This Week's Focus",
  "analytics.focus.subtitle": "A gentle suggestion for the week ahead",
  "analytics.focus.baseline_building.reason":
    "You're still building your sleep record.",
  "analytics.focus.baseline_building.action":
    "Focus on recording each morning — just one entry per day.",
  "analytics.focus.recording_consistency.reason":
    "Your diary has gaps this week.",
  "analytics.focus.recording_consistency.action":
    "Try to fill in the missing days. Even a quick entry helps you see the full picture.",
  "analytics.focus.wake_time_consistency.reason":
    "Your wake time varies and your efficiency is lower than it could be.",
  "analytics.focus.wake_time_consistency.action":
    "Try waking within a 30-minute range every day, including weekends.",
  "analytics.focus.bedtime_observation.reason":
    "Your bedtime varies quite a bit from night to night.",
  "analytics.focus.bedtime_observation.action":
    "Observe your bedtime this week without trying to force it earlier. Awareness comes first.",
  "analytics.focus.reminder_routine.reason":
    "Your reminders aren't quite sticking yet.",
  "analytics.focus.reminder_routine.action":
    "Try completing at least one reminder per day this week to build the habit.",
  "analytics.focus.maintenance.reason":
    "Your sleep is looking consistent and efficient.",
  "analytics.focus.maintenance.action":
    "Keep up the great routine. This week, focus on maintaining what's working.",
  "analytics.focus.default.reason":
    "Here's a gentle focus for the week.",
  "analytics.focus.default.action":
    "Observe your sleep patterns with curiosity — there's nothing to fix.",
  "analytics.focus.accept": "Accept focus",
  "analytics.focus.dismiss": "Dismiss",
  "analytics.focus.save": "Save for later",
  "analytics.focus.accepted": "Focus set for this week",
  "analytics.focus.dismissed": "Dismissed for this week",

  // ============================================
  // Reflection (Weekly)
  // ============================================
  "reflection.weekly.title": "Weekly Reflection",
  "reflection.weekly.subtitle":
    "A guided check-in to look back at your week and look ahead.",
  "reflection.weekly.intro":
    "Take a few minutes to reflect on your sleep and your routine this week. There are no right or wrong answers — this is for you.",
  "reflection.weekly.skip": "Skip",
  "reflection.weekly.save": "Save reflection",
  "reflection.weekly.saved": "Saved",
  "reflection.weekly.edit": "Edit",
  "reflection.weekly.delete": "Delete",
  "reflection.weekly.words": "words",
  "reflection.weekly.empty":
    "No reflection saved for this week yet.",
  "reflection.weekly.start": "Start reflection",

  // Prompts
  "reflection.weekly.prompt.routine_consistency.1":
    "What helped you keep a more consistent sleep routine this week?",
  "reflection.weekly.prompt.routine_consistency.2":
    "Which nights felt easier to stick to your schedule, and why?",
  "reflection.weekly.prompt.recording_ease.1":
    "What made sleep recording easier or harder this week?",
  "reflection.weekly.prompt.manageable_parts.1":
    "Which part of your sleep routine felt most manageable this week?",
  "reflection.weekly.prompt.next_week_observation.1":
    "What would you like to observe about your sleep next week?",
  "reflection.weekly.prompt.wins.1":
    "What's one thing that went well with your sleep this week?",
  "reflection.weekly.prompt.wins.2":
    "When did you feel most rested this week, and what was different?",
  "reflection.weekly.prompt.challenges.1":
    "What was challenging about your sleep this week?",
  "reflection.weekly.prompt.gratitude.1":
    "What are you grateful for about your rest this week?",
  "reflection.weekly.prompt.sleep_confidence.1":
    "How confident do you feel in your ability to sleep well right now?",

  // Placeholders
  "reflection.weekly.placeholder.routine_consistency":
    "Write about what helped or what got in the way...",
  "reflection.weekly.placeholder.recording_ease":
    "Share what made it easier or harder to record...",
  "reflection.weekly.placeholder.manageable_parts":
    "Describe what felt doable and why...",
  "reflection.weekly.placeholder.next_week_observation":
    "What do you want to notice next week?",
  "reflection.weekly.placeholder.wins":
    "Celebrate something — big or small...",
  "reflection.weekly.placeholder.challenges":
    "Write about what was difficult...",
  "reflection.weekly.placeholder.gratitude":
    "What are you thankful for?",
  "reflection.weekly.placeholder.sleep_confidence":
    "How do you feel about your sleep right now?",

  // ============================================
  // Dashboard Section Titles
  // ============================================
  "dashboard.analytics.keyMetrics": "Key Metrics",
  "dashboard.analytics.trends": "Trends",
  "dashboard.analytics.insights": "Insights",
  "dashboard.analytics.weeklySummary": "Weekly Summary",
  "dashboard.analytics.monthlyOverview": "Monthly Overview",
  "dashboard.analytics.reflection": "Weekly Reflection",
  "dashboard.analytics.focus": "Your Focus",

  // ============================================
  // Chart Labels
  // ============================================
  "chart.efficiency": "Sleep Efficiency",
  "chart.sleepTime": "Sleep Time",
  "chart.latency": "Onset Latency",
  "chart.bedtime": "Bedtime",
  "chart.wakeTime": "Wake Time",
  "chart.noData": "Not enough data for this view",
};
