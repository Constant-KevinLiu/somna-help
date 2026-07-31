/**
 * English — Guided CBT-I Reflection Prompts
 *
 * Natively authored content package.
 * Written by a native sleep-health educator.
 * Therapeutic prompts — do not translate at runtime.
 */

import type { ContentPackage } from "@/content/content-types";
import type { ReflectionPrompt } from "@/lib/reflection/reflection-types";

const EN_REFLECTION_PROMPTS: ReflectionPrompt[] = [
  // Sleep Thoughts Category
  {
    id: "en-thoughts-001",
    category: "sleep-thoughts",
    text: "What was going through your mind as you tried to fall asleep last night? Write down the specific thoughts that felt the loudest.",
  },
  {
    id: "en-thoughts-002",
    category: "sleep-thoughts",
    text: "Did any particular worry or concern keep coming back to you while you were in bed? Describe it without judgment.",
  },
  {
    id: "en-thoughts-003",
    category: "sleep-thoughts",
    text: "What story did you tell yourself about your sleep last night? Was it helpful or did it add more pressure?",
  },
  {
    id: "en-thoughts-004",
    category: "sleep-thoughts",
    text: "When you woke up during the night, what was the first thought that appeared? How did it affect your ability to fall back asleep?",
  },

  // Sleep Anxiety Category
  {
    id: "en-anxiety-001",
    category: "sleep-anxiety",
    text: "On a scale of calm to racing, how would you describe your mindstate at bedtime? What contributed to this feeling?",
  },
  {
    id: "en-anxiety-002",
    category: "sleep-anxiety",
    text: "What physical sensations did you notice in your body as you tried to relax? Did any feel particularly difficult to release?",
  },
  {
    id: "en-anxiety-003",
    category: "sleep-anxiety",
    text: "Were you worried about the consequences of poor sleep before bed? What were those fears and how realistic are they?",
  },
  {
    id: "en-anxiety-004",
    category: "sleep-anxiety",
    text: "Did the thought 'I need to fall asleep NOW' cross your mind? How did that pressure make you feel?",
  },

  // Sleep Behaviors Category
  {
    id: "en-behaviors-001",
    category: "sleep-behaviors",
    text: "What did you do in the hour before bed last night? Which activities helped you wind down, and which kept you alert?",
  },
  {
    id: "en-behaviors-002",
    category: "sleep-behaviors",
    text: "How consistent was your bedtime compared to your usual pattern? What factors made it earlier or later than planned?",
  },
  {
    id: "en-behaviors-003",
    category: "sleep-behaviors",
    text: "Did you use any screens in bed? What content were you engaging with, and how did it affect your transition to sleep?",
  },
  {
    id: "en-behaviors-004",
    category: "sleep-behaviors",
    text: "What sleep-friendly routine did you follow? Is there one small change you could make to your pre-bed ritual?",
  },

  // Relaxation Category
  {
    id: "en-relax-001",
    category: "relaxation",
    text: "Describe a moment yesterday when you felt truly calm and relaxed. What made that feeling possible?",
  },
  {
    id: "en-relax-002",
    category: "relaxation",
    text: "What relaxation technique have you found most helpful? When was the last time you used it, and how did it work?",
  },
  {
    id: "en-relax-003",
    category: "relaxation",
    text: "What sounds or sensory experiences help you feel most at peace? Can you bring more of these into your bedroom?",
  },
  {
    id: "en-relax-004",
    category: "relaxation",
    text: "Think about your breath as you settled into bed last night. Was it shallow or deep, fast or slow? What would slower breathing feel like?",
  },

  // Gratitude Category
  {
    id: "en-gratitude-001",
    category: "gratitude",
    text: "Name three small, specific things from yesterday that you appreciated. They don't need to be big or impressive.",
  },
  {
    id: "en-gratitude-002",
    category: "gratitude",
    text: "What is one thing your body did for you yesterday that you might take for granted? Acknowledge it here.",
  },
  {
    id: "en-gratitude-003",
    category: "gratitude",
    text: "Who or what made you feel supported in the last day? Write a brief note of appreciation for that presence.",
  },
  {
    id: "en-gratitude-004",
    category: "gratitude",
    text: "What is something gentle that you did for yourself yesterday? Celebrate that act of self-care, no matter how small.",
  },

  // Sleep Confidence Category
  {
    id: "en-confidence-001",
    category: "sleep-confidence",
    text: "When have you slept well in the last month? What were the circumstances, and what did you do that contributed to it?",
  },
  {
    id: "en-confidence-002",
    category: "sleep-confidence",
    text: "What is one thing you know helps your sleep that you can trust will work for you? Remind yourself of this truth.",
  },
  {
    id: "en-confidence-003",
    category: "sleep-confidence",
    text: "Even on difficult nights, what small win did you have with your sleep recently? Acknowledge your effort.",
  },
  {
    id: "en-confidence-004",
    category: "sleep-confidence",
    text: "What would it feel like to trust your body's ability to sleep? Describe that feeling of confidence and safety.",
  },

  // Stimulus Control Category
  {
    id: "en-stimulus-001",
    category: "stimulus-control",
    text: "How do you currently use your bed besides sleeping? Could any of these activities be moved to another room?",
  },
  {
    id: "en-stimulus-002",
    category: "stimulus-control",
    text: "When you couldn't fall asleep last night, what did you do? Is there a different approach you could try next time?",
  },
  {
    id: "en-stimulus-003",
    category: "stimulus-control",
    text: "What does your bedroom environment look and feel like? Is there one adjustment that would make it more sleep-friendly?",
  },
  {
    id: "en-stimulus-004",
    category: "stimulus-control",
    text: "How quickly do you usually get out of bed when you can't sleep? What barrier — if any — prevents you from getting up sooner?",
  },

  // Sleep Restriction Category
  {
    id: "en-restriction-001",
    category: "sleep-restriction",
    text: "How much time did you actually spend sleeping last night versus how much time you spent in bed? Notice the difference.",
  },
  {
    id: "en-restriction-002",
    category: "sleep-restriction",
    text: "What does 'sleep efficiency' mean to you personally? How might building stronger sleep drive change your nights?",
  },
  {
    id: "en-restriction-003",
    category: "sleep-restriction",
    text: "Are you spending more time in bed trying to 'catch up' on sleep? How has that affected the quality of your rest?",
  },
  {
    id: "en-restriction-004",
    category: "sleep-restriction",
    text: "What would a consistent wake-up time — even on weekends — look like for you? What benefits might this bring?",
  },

  // Night Awakenings Category
  {
    id: "en-awakenings-001",
    category: "night-awakenings",
    text: "When you woke up last night, what was your immediate reaction? Did you get frustrated, or could you observe it calmly?",
  },
  {
    id: "en-awakenings-002",
    category: "night-awakenings",
    text: "What time did you wake up and not return to sleep quickly? What thoughts were spinning during that time?",
  },
  {
    id: "en-awakenings-003",
    category: "night-awakenings",
    text: "Night waking is normal. When has it felt most manageable for you? What was different in those moments?",
  },
  {
    id: "en-awakenings-004",
    category: "night-awakenings",
    text: "What is your go-to strategy when you can't fall back asleep? Is there a new technique you'd like to practice?",
  },

  // Cognitive Reframing Category
  {
    id: "en-reframing-001",
    category: "cognitive-reframing",
    text: "What negative thought about sleep did you have recently? Can you find a more balanced way to look at the same situation?",
  },
  {
    id: "en-reframing-002",
    category: "cognitive-reframing",
    text: "Instead of 'I must get 8 hours,' what's a more flexible and kind thought you could have about your sleep needs?",
  },
  {
    id: "en-reframing-003",
    category: "cognitive-reframing",
    text: "When you think about a 'bad night,' are you remembering the whole picture or just the difficult part? Write the full story.",
  },
  {
    id: "en-reframing-004",
    category: "cognitive-reframing",
    text: "What catastrophic thought about poor sleep have you had? What's the evidence that contradicts this fear?",
  },
];

export const EN_REFLECTION_PACKAGE: ContentPackage<ReflectionPrompt[]> = {
  metadata: {
    locale: "en",
    version: "1.0.0",
    reviewedAt: "2025-01-15",
    reviewedBy: "sleep-education-team",
    medicalReviewStatus: "approved",
    nativeReviewStatus: "approved",
    lastUpdated: "2025-01-15",
  },
  content: EN_REFLECTION_PROMPTS,
};
