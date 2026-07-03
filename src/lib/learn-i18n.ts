import type { Lang } from "./i18n";
import type { FAQ } from "./calc-i18n";
import type { CbtiSlug } from "./cbti-i18n";
import { ptLearnDict } from "./learn-pt-i18n";

export type LearnSlug =
  | "what-is-cbti"
  | "90-minute-sleep-cycle"
  | "4-7-8-breathing"
  | "racing-thoughts-at-night"
  | "circadian-rhythm"
  | "stimulus-control";

export const LEARN_SLUGS: LearnSlug[] = [
  "what-is-cbti",
  "90-minute-sleep-cycle",
  "4-7-8-breathing",
  "racing-thoughts-at-night",
  "circadian-rhythm",
  "stimulus-control",
];

export function learnPath(slug: LearnSlug, lang?: "en" | "zh" | "es" | "pt"): string {
  const prefix = lang === "es" ? "/es" : lang === "pt" ? "/pt" : "";
  return `${prefix}/learn/${slug}`;
}

export type LearnSection = { heading: string; paras: string[] };

export type LearnLesson = {
  meta: { title: string; desc: string };
  eyebrow: string;
  title: string;
  subtitle: string;
  readingTime: string;
  keyTakeaways: string[];
  sections: LearnSection[];
  scienceNote: string;
  practicalTip: string;
  cta: { label: string; to: string };
  relatedGuide: { slug: CbtiSlug };
  relatedTool: { to: string; label: string; desc: string };
  faqs: FAQ[];
  nextLesson: LearnSlug;
};

export type LearnDict = {
  ui: {
    learn: string;
    quickLessons: string;
    cbtiGuides: string;
    readBadge: string;
    takeawaysTitle: string;
    scienceNoteTitle: string;
    practicalTipTitle: string;
    relatedToolTitle: string;
    relatedGuideTitle: string;
    relatedGuideCta: string;
    nextLessonTitle: string;
    nextLessonCta: string;
    hubTitle: string;
    hubSub: string;
    hubQuickLessonsLabel: string;
    hubGuidesLabel: string;
    minRead: string;
  };
  titles: Record<LearnSlug, string>;
  summaries: Record<LearnSlug, string>;
  lessons: Record<LearnSlug, LearnLesson>;
};

/* =====================================================================
 * ENGLISH
 * ===================================================================== */
const enTitles: Record<LearnSlug, string> = {
  "what-is-cbti": "What Is CBT-I, Really?",
  "90-minute-sleep-cycle": "The 90-Minute Sleep Cycle",
  "4-7-8-breathing": "The 4-7-8 Breath, Explained",
  "racing-thoughts-at-night": "When the Mind Won't Quiet Down",
  "circadian-rhythm": "Light, Caffeine, and Your Inner Clock",
  "stimulus-control": "Stimulus Control in Plain Language",
};

const enSummaries: Record<LearnSlug, string> = {
  "what-is-cbti": "A beginner-friendly intro to CBT-I and why it works long-term.",
  "90-minute-sleep-cycle": "How sleep cycles shape how rested you feel.",
  "4-7-8-breathing": "A simple breath pattern that calms the nervous system.",
  "racing-thoughts-at-night": "Why thoughts get loud at night — and what CBT-I does about it.",
  "circadian-rhythm": "How light and caffeine quietly steer your body clock.",
  "stimulus-control": "Rebuilding the bed–sleep connection, one night at a time.",
};

const en: LearnDict = {
  ui: {
    learn: "Learn",
    quickLessons: "Quick Lessons",
    cbtiGuides: "CBT-I Guides",
    readBadge: "5-minute read",
    takeawaysTitle: "Key Takeaways",
    scienceNoteTitle: "Science Note",
    practicalTipTitle: "Try This Tonight",
    relatedToolTitle: "Try a related tool",
    relatedGuideTitle: "Go deeper",
    relatedGuideCta: "Read the full guide",
    nextLessonTitle: "Up next",
    nextLessonCta: "Continue learning",
    hubTitle: "Learn",
    hubSub: "A library of long-form CBT-I guides and short, evidence-based lessons.",
    hubQuickLessonsLabel: "Quick Lessons",
    hubGuidesLabel: "CBT-I Guides",
    minRead: "min read",
  },
  titles: enTitles,
  summaries: enSummaries,
  lessons: {
    "what-is-cbti": {
      meta: {
        title: "What Is CBT-I, Really? | Somna",
        desc: "A beginner-friendly explanation of Cognitive Behavioral Therapy for Insomnia (CBT-I) and why it is considered the most effective long-term insomnia treatment.",
      },
      eyebrow: "QUICK LESSON",
      title: "What Is CBT-I, Really?",
      subtitle:
        "Cognitive Behavioral Therapy for Insomnia is not a sleeping pill — it's a structured way to retrain how your brain relates to sleep.",
      readingTime: "5",
      keyTakeaways: [
        "CBT-I is not medication — it changes behaviors and thoughts around sleep.",
        "It is recommended by sleep specialists worldwide as first-line care for chronic insomnia.",
        "Results often last much longer than sleeping pills.",
        "Most people see meaningful improvement within 4–8 weeks.",
      ],
      sections: [
        {
          heading: "What Does CBT-I Mean?",
          paras: [
            "CBT-I stands for Cognitive Behavioral Therapy for Insomnia. It's a structured, time-limited program that targets the specific thoughts and behaviors keeping insomnia in place.",
            "Unlike sleeping pills, CBT-I doesn't sedate you. Instead, it teaches your brain and body how to recover their natural sleep rhythm — gently, and without side effects.",
          ],
        },
        {
          heading: "Why Sleep Problems Become Learned",
          paras: [
            "A few stressful nights are normal. They become chronic when the brain starts to associate the bed with frustration or alertness instead of rest.",
            "Over weeks or months, this association strengthens. Your nervous system learns: 'bedtime = stay alert.' CBT-I works because it directly addresses this learning.",
          ],
        },
        {
          heading: "The Five Core Components",
          paras: [
            "CBT-I combines five evidence-based tools: sleep restriction (compressing time in bed to rebuild sleep pressure), stimulus control (re-linking the bed with sleep), cognitive restructuring (softening anxious thoughts), sleep hygiene (small environmental shifts), and relaxation training.",
            "Used together, they target the loop of insomnia from multiple angles at once.",
          ],
        },
        {
          heading: "Why CBT-I Works Long-Term",
          paras: [
            "Medication can mask symptoms while you take it. CBT-I changes the underlying patterns, so the improvements remain after the program ends.",
            "Follow-up studies show benefits maintained one to three years later — which is unusual for any insomnia treatment.",
          ],
        },
        {
          heading: "Who Can Benefit from CBT-I?",
          paras: [
            "Most adults with chronic insomnia respond well, including older adults and people who have struggled for years. CBT-I is also effective alongside treatment for anxiety or depression.",
            "If you have untreated sleep apnea, restless legs, or another sleep disorder, talk to a clinician first so CBT-I can be tailored safely.",
          ],
        },
      ],
      scienceNote:
        "Major sleep medicine organizations — including the American Academy of Sleep Medicine and the American College of Physicians — recommend CBT-I as the first-line treatment for chronic insomnia in adults.",
      practicalTip:
        "Tonight, use your bed only for sleep and intimacy — no scrolling, no work, no worrying. This single rule is the heart of stimulus control.",
      cta: { label: "Read the Complete CBT-I Guide", to: "/cbt-i-guide" },
      relatedGuide: { slug: "cbt-i-guide" },
      relatedTool: {
        to: "/calculator",
        label: "Sleep Cycle Calculator",
        desc: "Plan around natural 90-minute cycles.",
      },
      faqs: [
        {
          q: "Is CBT-I a type of medication?",
          a: "No. CBT-I is a behavioral and cognitive program. It uses structured techniques, not drugs, to address the root causes of insomnia.",
        },
        {
          q: "How long does CBT-I take to work?",
          a: "Most people notice some change within 1–2 weeks and meaningful improvement within 4–8 weeks of consistent practice.",
        },
        {
          q: "Is CBT-I better than sleeping pills?",
          a: "For chronic insomnia, yes — in long-term follow-up. Pills can help short-term but the gains rarely persist after stopping.",
        },
        {
          q: "Do I need a therapist for CBT-I?",
          a: "A trained clinician produces the strongest results, but self-guided and digital CBT-I programs are also evidence-based and effective.",
        },
        {
          q: "Will CBT-I help if I've had insomnia for years?",
          a: "Yes. Even long-standing insomnia responds well, because CBT-I targets the patterns currently maintaining it, not just the original trigger.",
        },
        {
          q: "Are there side effects?",
          a: "The main 'side effect' is temporary tiredness during sleep restriction in week 1–2. There are no medication-related risks.",
        },
        {
          q: "Can I do CBT-I while taking sleep medication?",
          a: "Often yes, with clinician guidance. Many people gradually taper medication during or after CBT-I.",
        },
      ],
      nextLesson: "stimulus-control",
    },
    "90-minute-sleep-cycle": {
      meta: {
        title: "The 90-Minute Sleep Cycle | Somna",
        desc: "Understand how sleep cycles work and why waking at the right time may improve how rested you feel.",
      },
      eyebrow: "QUICK LESSON",
      title: "The 90-Minute Sleep Cycle",
      subtitle:
        "Sleep doesn't happen in one long block — it moves through repeating cycles, each shaping how you feel in the morning.",
      readingTime: "5",
      keyTakeaways: [
        "Sleep occurs in repeating cycles, not as a single flat state.",
        "One cycle lasts about 90 minutes on average.",
        "Deep sleep and REM serve very different purposes.",
        "Timing matters: waking between cycles tends to feel easier.",
      ],
      sections: [
        {
          heading: "What Happens During Sleep?",
          paras: [
            "Sleep isn't a single state. Your brain cycles through different stages, each with its own pattern of brain waves, heart rate, and muscle tone.",
            "These cycles repeat across the night, gently shifting from deeper, restorative sleep early on to longer REM periods toward morning.",
          ],
        },
        {
          heading: "The Four Sleep Stages",
          paras: [
            "Stage 1 is a brief, light entry into sleep. Stage 2 is slightly deeper and where most of the night is spent. Stage 3 is deep, slow-wave sleep — vital for physical recovery. REM (rapid eye movement) is where most vivid dreaming occurs and is essential for memory and emotional processing.",
            "Each cycle moves through these stages in roughly the same order.",
          ],
        },
        {
          heading: "Why 90 Minutes Matters",
          paras: [
            "On average, one full sleep cycle takes about 90 minutes. Waking at the end of a cycle — rather than mid-deep-sleep — usually feels lighter and clearer.",
            "This is why bedtime calculators often suggest options spaced 90 minutes apart.",
          ],
        },
        {
          heading: "Why You Feel Groggy Sometimes",
          paras: [
            "If your alarm interrupts deep sleep, you may wake up confused or heavy-headed. That fog is called 'sleep inertia' and can last 15–30 minutes.",
            "Adjusting your bedtime by even 15–30 minutes can land your wake time on a friendlier point in the cycle.",
          ],
        },
        {
          heading: "How Sleep Calculators Use Sleep Cycles",
          paras: [
            "A sleep cycle calculator works backward from your desired wake time, subtracting full 90-minute cycles and a short buffer to fall asleep.",
            "It's a guideline, not a guarantee — but for many people it's a helpful starting point for steadier mornings.",
          ],
        },
      ],
      scienceNote:
        "Sleep cycle length is an average — real cycles vary from about 70 to 120 minutes and change across the night and across individuals.",
      practicalTip:
        "Aim for five or six complete cycles when you can. For most adults, that's 7.5–9 hours of sleep — well within the science-backed range.",
      cta: { label: "Use the Sleep Cycle Calculator", to: "/calculator" },
      relatedGuide: { slug: "how-to-fall-asleep-fast" },
      relatedTool: {
        to: "/calculator",
        label: "Sleep Cycle Calculator",
        desc: "Plan bedtime around full cycles.",
      },
      faqs: [
        {
          q: "Is every sleep cycle exactly 90 minutes?",
          a: "No — 90 minutes is an average. Cycles range roughly 70–120 minutes and shift across the night and between people.",
        },
        {
          q: "How many cycles should I aim for?",
          a: "Most adults feel best with 5–6 cycles per night, which is about 7.5–9 hours of sleep.",
        },
        {
          q: "Why do I sometimes wake up groggy even after enough sleep?",
          a: "You may have been woken in deep sleep. Adjusting bedtime by 15–30 minutes can land your wake time more gently.",
        },
        {
          q: "Is deep sleep more important than REM?",
          a: "Both matter. Deep sleep supports physical recovery; REM supports memory and emotional regulation. A healthy night includes both.",
        },
        {
          q: "Can I track my sleep cycles?",
          a: "Consumer wearables estimate stages but aren't medically precise. Patterns over weeks are more meaningful than any single night.",
        },
        {
          q: "Why do cycles change across the night?",
          a: "Early cycles contain more deep sleep; later cycles contain more REM. Both halves of the night matter.",
        },
        {
          q: "Does napping use sleep cycles too?",
          a: "Yes. A 90-minute nap can include a full cycle, while a 20-minute nap stays in lighter stages and avoids grogginess.",
        },
      ],
      nextLesson: "4-7-8-breathing",
    },
    "4-7-8-breathing": {
      meta: {
        title: "The 4-7-8 Breath, Explained | Somna",
        desc: "Learn how the 4-7-8 breathing method may help reduce physiological arousal before bedtime.",
      },
      eyebrow: "QUICK LESSON",
      title: "The 4-7-8 Breath, Explained",
      subtitle:
        "A simple breathing pattern that gently lowers physiological arousal — a practical pre-sleep ritual backed by basic physiology.",
      readingTime: "5",
      keyTakeaways: [
        "Slow breathing affects the autonomic nervous system.",
        "Long, soft exhales promote a relaxation response.",
        "Consistency matters more than intensity.",
        "It works best as part of a wider bedtime routine.",
      ],
      sections: [
        {
          heading: "What Is 4-7-8 Breathing?",
          paras: [
            "4-7-8 breathing is a structured breath pattern: inhale through the nose for 4 seconds, hold for 7 seconds, and exhale slowly through the mouth for 8 seconds.",
            "It was popularized as a calming technique, but its effect is rooted in something older — slow breathing's influence on the body's stress response.",
          ],
        },
        {
          heading: "How To Practice It",
          paras: [
            "Sit or lie comfortably. Place the tip of your tongue behind your upper front teeth. Exhale fully through your mouth.",
            "Inhale quietly through your nose for 4 seconds. Hold your breath for 7. Exhale through pursed lips for 8. Repeat for 4 cycles. Build up slowly — it can feel intense at first.",
          ],
        },
        {
          heading: "Why It May Feel Calming",
          paras: [
            "Long exhales activate the parasympathetic branch of the nervous system, which slows heart rate and softens stress signals.",
            "Counting also gently occupies the mind, drawing attention away from racing thoughts.",
          ],
        },
        {
          heading: "Common Mistakes",
          paras: [
            "Forcing the breath too hard, holding too tight, or doing too many cycles at once can feel uncomfortable.",
            "If you feel dizzy or lightheaded, return to natural breathing. The goal is calm, not effort.",
          ],
        },
        {
          heading: "How To Build It Into Your Night Routine",
          paras: [
            "Pair the technique with another cue — dimming lights, washing your face, getting into bed — so it becomes an automatic signal that the day is closing.",
            "Most people see the biggest benefit after one to two weeks of consistent practice.",
          ],
        },
      ],
      scienceNote:
        "Slow, paced breathing has been shown in research to reduce heart rate, blood pressure, and self-reported stress in healthy adults.",
      practicalTip:
        "Try just 2–4 cycles of 4-7-8 breathing right before lights-out tonight. You're not chasing sleep — you're signaling safety.",
      cta: { label: "How To Fall Asleep Fast", to: "/how-to-fall-asleep-fast" },
      relatedGuide: { slug: "how-to-fall-asleep-fast" },
      relatedTool: {
        to: "/relax",
        label: "Guided 4-7-8 Session",
        desc: "Practice with a calm visual cue.",
      },
      faqs: [
        {
          q: "Does 4-7-8 breathing put you to sleep?",
          a: "Not directly. It reduces arousal and supports falling asleep, but it is not a sedative.",
        },
        {
          q: "How many cycles should I do?",
          a: "Start with 4 cycles. Some practitioners build up over weeks. More isn't always better.",
        },
        {
          q: "Is it safe for everyone?",
          a: "It is generally considered safe for healthy adults. If you have lung conditions, low blood pressure, or feel lightheaded, breathe naturally instead.",
        },
        {
          q: "Can children practice it?",
          a: "A simpler version (shorter holds) can work for older children, but check with a pediatrician first.",
        },
        {
          q: "Why exhale longer than inhale?",
          a: "Long exhales activate the parasympathetic 'rest and digest' branch of the nervous system.",
        },
        {
          q: "What if counting makes me more anxious?",
          a: "Skip the count. Just breathe slowly through the nose with a long, soft exhale. The pattern matters more than the numbers.",
        },
        {
          q: "How often should I practice?",
          a: "Daily is ideal — even outside of bedtime — to train the response. Most people notice benefits within 1–2 weeks.",
        },
      ],
      nextLesson: "racing-thoughts-at-night",
    },
    "racing-thoughts-at-night": {
      meta: {
        title: "When the Mind Won't Quiet Down | Somna",
        desc: "Understand why thoughts become louder at night and how CBT-I approaches racing thoughts.",
      },
      eyebrow: "QUICK LESSON",
      title: "When the Mind Won't Quiet Down",
      subtitle:
        "Racing thoughts at bedtime aren't a character flaw — they're a predictable feature of an aroused nervous system. CBT-I has practical tools for them.",
      readingTime: "5",
      keyTakeaways: [
        "Racing thoughts at night are common, not unusual.",
        "Hyperarousal — physical and mental — plays a major role.",
        "Trying to suppress thoughts usually backfires.",
        "CBT-I provides specific tools that work better than 'just relax'.",
      ],
      sections: [
        {
          heading: "Why Thoughts Feel Louder at Night",
          paras: [
            "During the day, your attention is pulled outward by tasks, conversations, and movement. At night, those distractions fall away and inner thoughts get the stage to themselves.",
            "If you're also tired and your prefrontal cortex (the calm planner) is less active, worries can feel more urgent than they really are.",
          ],
        },
        {
          heading: "The Hyperarousal Model",
          paras: [
            "Researchers describe chronic insomnia as a state of hyperarousal — the body and mind stay too activated for sleep to take over.",
            "Stress hormones, fast heart rate, and a busy mind reinforce each other. Once this loop starts, ordinary 'try to relax' advice often isn't enough.",
          ],
        },
        {
          heading: "Why Trying Not To Think Doesn't Work",
          paras: [
            "Telling yourself 'stop thinking' usually makes thoughts louder. This is the 'white bear' effect: the more you try to suppress something, the more it returns.",
            "CBT-I shifts the goal — instead of stopping thoughts, you learn to let them pass without engaging.",
          ],
        },
        {
          heading: "Helpful CBT-I Strategies",
          paras: [
            "Use a daytime 'worry window': spend 10 minutes earlier in the evening writing concerns and possible next steps. Close the notebook when time is up.",
            "If you're stuck spinning in bed for 20 minutes, get up. Sit somewhere with low light. Read something gentle. Return only when sleepy. This is stimulus control — the strongest tool in the CBT-I toolkit.",
          ],
        },
        {
          heading: "When To Seek Professional Help",
          paras: [
            "If racing thoughts come with persistent low mood, daytime panic, or significant impact on daily life, please reach out to a clinician.",
            "Anxiety and insomnia often travel together and respond well to coordinated treatment.",
          ],
        },
      ],
      scienceNote:
        "Insomnia is increasingly understood as a disorder of hyperarousal — involving both cognitive (mental) and physiological (bodily) activation.",
      practicalTip:
        "Tonight, write tomorrow's task list before you brush your teeth. Externalizing tomorrow's load tells your brain it doesn't have to rehearse it in bed.",
      cta: { label: "Read the Sleep Anxiety Guide", to: "/sleep-anxiety" },
      relatedGuide: { slug: "sleep-anxiety" },
      relatedTool: {
        to: "/relax",
        label: "Wind-down Breathing",
        desc: "Quiet the body to quiet the mind.",
      },
      faqs: [
        {
          q: "Why do racing thoughts always hit at bedtime?",
          a: "Without daytime distractions, inner thoughts have nothing to compete with. A tired prefrontal cortex also makes worries feel more urgent.",
        },
        {
          q: "Should I try to push thoughts away?",
          a: "No — that usually amplifies them. The goal is to notice thoughts and let them pass, like clouds moving across the sky.",
        },
        {
          q: "Is journaling really helpful?",
          a: "Yes, especially when done earlier in the evening. A 'worry window' externalizes concerns so they don't surge in bed.",
        },
        {
          q: "Are racing thoughts the same as anxiety?",
          a: "They overlap heavily. If thoughts come with persistent worry, low mood, or panic, consider speaking with a clinician.",
        },
        {
          q: "Can meditation help?",
          a: "For many people, yes — especially mindfulness-based approaches that focus on noticing thoughts without engaging.",
        },
        {
          q: "What about listening to a podcast in bed?",
          a: "Mixed evidence. Light audio works for some people, while engaging content keeps the brain too active.",
        },
        {
          q: "Do racing thoughts mean I have insomnia?",
          a: "Not alone. Insomnia is defined by trouble sleeping that occurs at least 3 nights a week for 3+ months and impacts daytime functioning.",
        },
      ],
      nextLesson: "circadian-rhythm",
    },
    "circadian-rhythm": {
      meta: {
        title: "Light, Caffeine, and Your Inner Clock | Somna",
        desc: "Learn how light exposure and caffeine affect circadian rhythm and sleep timing.",
      },
      eyebrow: "QUICK LESSON",
      title: "Light, Caffeine, and Your Inner Clock",
      subtitle:
        "Your body has an internal 24-hour clock. Light and caffeine are two of the strongest signals shaping when sleep comes easily.",
      readingTime: "5",
      keyTakeaways: [
        "Circadian rhythm regulates when you feel sleepy and alert.",
        "Morning light strengthens and stabilizes the body clock.",
        "Evening light can delay sleep onset.",
        "Caffeine can affect sleep for many hours after the last sip.",
      ],
      sections: [
        {
          heading: "What Is Circadian Rhythm?",
          paras: [
            "Your circadian rhythm is a roughly 24-hour internal cycle that governs sleep, alertness, hormones, body temperature, and more.",
            "It runs whether you're paying attention to it or not — but external signals, especially light, keep it aligned with the world.",
          ],
        },
        {
          heading: "Morning Light and Sleep Timing",
          paras: [
            "Bright light in the first hour or two after waking sends a clear 'daytime' signal to your brain. This anchors your clock and makes it easier to fall asleep the following night.",
            "Outdoor light, even on a cloudy day, is far brighter than indoor lighting — and a short walk outside is one of the simplest sleep upgrades.",
          ],
        },
        {
          heading: "Evening Light Exposure",
          paras: [
            "Bright light in the late evening — including from screens — can suppress melatonin and shift your body clock later.",
            "Dim lights for the last 60–90 minutes before bed and your nervous system gets the message that night has begun.",
          ],
        },
        {
          heading: "How Caffeine Affects Sleep",
          paras: [
            "Caffeine blocks adenosine, the molecule that builds 'sleep pressure' across the day. It has a half-life of roughly 5 hours, which means a 2 PM coffee can still be in your system at bedtime.",
            "Even when you fall asleep, evening caffeine can reduce deep sleep — so you wake up feeling less rested without knowing why.",
          ],
        },
        {
          heading: "Building Better Timing Habits",
          paras: [
            "Aim for a consistent wake time, daily morning light, and a caffeine cutoff in the early afternoon. These three small shifts can change how the entire week feels.",
            "Consistency is more important than perfection. Small, sustainable changes outperform dramatic overhauls.",
          ],
        },
      ],
      scienceNote:
        "Light is among the strongest signals shaping the circadian clock — particularly bright light in the morning and dim conditions in the evening.",
      practicalTip:
        "Get outdoor light within an hour of waking — even a 5–10 minute walk counts. And set a personal 'no caffeine after 2 PM' rule for two weeks to see how your nights respond.",
      cta: { label: "Use the Bedtime Calculator", to: "/bedtime-calculator" },
      relatedGuide: { slug: "how-to-fall-asleep-fast" },
      relatedTool: {
        to: "/bedtime-calculator",
        label: "Bedtime Calculator",
        desc: "Find the best time to go to bed.",
      },
      faqs: [
        {
          q: "How long does caffeine stay in your system?",
          a: "Caffeine has a half-life of about 5 hours, so half of a 2 PM coffee is still active at 7 PM and a quarter is still active at midnight.",
        },
        {
          q: "Does morning light really matter?",
          a: "Yes — it's one of the strongest signals to anchor your circadian rhythm. Even 5–10 minutes outdoors helps.",
        },
        {
          q: "Are blue-light glasses worth it?",
          a: "Lowering overall light intensity in the evening tends to matter more than filtering blue light specifically.",
        },
        {
          q: "Is decaf truly caffeine-free?",
          a: "Not entirely — decaf still contains a small amount of caffeine, usually 2–15 mg per cup.",
        },
        {
          q: "What if I work night shifts?",
          a: "Aim for strategic bright-light exposure during your 'day' and darkness during your 'night.' Shift work disrupts circadian rhythm and benefits from a tailored plan.",
        },
        {
          q: "Does alcohol affect my body clock?",
          a: "Alcohol fragments sleep and can shift sleep architecture even when it helps you fall asleep faster.",
        },
        {
          q: "How quickly can I reset my rhythm?",
          a: "Most adults shift by about 1 hour per day with consistent light, meal, and wake-time cues.",
        },
      ],
      nextLesson: "stimulus-control",
    },
    "stimulus-control": {
      meta: {
        title: "Stimulus Control in Plain Language | Somna",
        desc: "Learn one of the most effective CBT-I strategies for rebuilding a healthy connection between bed and sleep.",
      },
      eyebrow: "QUICK LESSON",
      title: "Stimulus Control in Plain Language",
      subtitle:
        "Stimulus control retrains the simple, learned link between bed and sleep — and it's one of the most powerful tools in CBT-I.",
      readingTime: "5",
      keyTakeaways: [
        "Bed should be associated with sleep — not wakefulness.",
        "Staying awake in bed quietly reinforces insomnia.",
        "Consistency matters more than perfection.",
        "Improvement takes practice; the first nights are the hardest.",
      ],
      sections: [
        {
          heading: "What Is Stimulus Control?",
          paras: [
            "Stimulus control is the practice of using your bed and bedroom only for sleep and intimacy.",
            "The goal is simple: when your body crosses the threshold of the bedroom, it knows what's about to happen.",
          ],
        },
        {
          heading: "How Insomnia Changes Bed Associations",
          paras: [
            "After enough nights of lying awake, the bed becomes paired with frustration, alertness, or anxiety.",
            "This is conditioning — the same kind of learning that makes you salivate when you hear a familiar dinner sound. Your brain doesn't argue with it; it just reacts.",
          ],
        },
        {
          heading: "The 20-Minute Rule",
          paras: [
            "If you're not asleep after roughly 20 minutes (no clock-watching — estimate), get out of bed. Go to another low-light space and do something calm: a few pages of a gentle book, slow stretching, a quiet seated breath.",
            "Return to bed only when you feel sleepy — heavy eyes, head nodding. Repeat as needed. This sounds counter-intuitive, but it's the heart of stimulus control.",
          ],
        },
        {
          heading: "Common Mistakes",
          paras: [
            "Using your phone in bed, working in bed, watching TV in bed, or lying there 'trying harder' all reinforce the wrong association.",
            "Inconsistent application also slows results. The method works best when applied every night for several weeks.",
          ],
        },
        {
          heading: "What Results To Expect",
          paras: [
            "Most people find the first 3–5 nights are tough — you may sleep less initially because you're spending less time lying awake.",
            "By week 2, sleep often consolidates: you fall asleep faster, wake less, and feel the bed becoming a sleep cue again.",
          ],
        },
      ],
      scienceNote:
        "Stimulus control is among the most well-studied CBT-I techniques and is recommended as a standalone evidence-based treatment for chronic insomnia.",
      practicalTip:
        "Move screens, work materials, and your laptop out of the bedroom tonight. Even a small physical change reshapes the cue.",
      cta: { label: "Read the Complete CBT-I Guide", to: "/cbt-i-guide" },
      relatedGuide: { slug: "cbt-i-guide" },
      relatedTool: {
        to: "/calculator",
        label: "Sleep Cycle Calculator",
        desc: "Match bedtime to natural cycles.",
      },
      faqs: [
        {
          q: "What is stimulus control in CBT-I?",
          a: "Stimulus control is the practice of using your bed only for sleep, leaving the bed if you're not sleeping, and keeping a consistent wake time — so the bed becomes a cue for sleep again.",
        },
        {
          q: "How long until stimulus control works?",
          a: "Many people see improvement within 1–3 weeks of consistent practice.",
        },
        {
          q: "Is the 20-minute rule strict?",
          a: "It's a guideline. Don't watch the clock — estimate. If you feel clearly awake and frustrated, leave the bed.",
        },
        {
          q: "What should I do when I leave the bed?",
          a: "Something calm and low-light: read a gentle book, do slow stretches, sit quietly. Avoid screens, work, and anything stimulating.",
        },
        {
          q: "Does stimulus control work for middle-of-the-night awakenings?",
          a: "Yes — the same 20-minute rule applies. If you wake and can't fall back asleep, leave the bed and return only when sleepy.",
        },
        {
          q: "What if leaving the bed wakes me up more?",
          a: "Keep lights dim, activity calm, and your body relaxed. The goal isn't full alertness — it's allowing sleepiness to return naturally.",
        },
        {
          q: "Can I do stimulus control without other CBT-I tools?",
          a: "It can be effective on its own, but combining it with sleep restriction and consistent wake times produces the strongest results.",
        },
      ],
      nextLesson: "what-is-cbti",
    },
  },
};

/* =====================================================================
 * SIMPLIFIED CHINESE
 * ===================================================================== */
const zhTitles: Record<LearnSlug, string> = {
  "what-is-cbti": "CBT-I 究竟是什么?",
  "90-minute-sleep-cycle": "90 分钟睡眠周期",
  "4-7-8-breathing": "解读 4-7-8 呼吸法",
  "racing-thoughts-at-night": "当思绪无法安静",
  "circadian-rhythm": "光、咖啡因与你的生物钟",
  "stimulus-control": "通俗易懂的刺激控制法",
};

const zhSummaries: Record<LearnSlug, string> = {
  "what-is-cbti": "面向初学者的 CBT-I 介绍,以及为什么它的效果可以长期保持。",
  "90-minute-sleep-cycle": "睡眠周期如何影响你的清醒程度。",
  "4-7-8-breathing": "一种让神经系统平静下来的简单呼吸方法。",
  "racing-thoughts-at-night": "为什么思绪在夜里更喧闹,以及 CBT-I 如何应对。",
  "circadian-rhythm": "光照与咖啡因如何悄悄影响你的生物钟。",
  "stimulus-control": "一夜一夜地重建床与睡眠的连接。",
};

const zh: LearnDict = {
  ui: {
    learn: "知识",
    quickLessons: "微课",
    cbtiGuides: "CBT-I 指南",
    readBadge: "5 分钟阅读",
    takeawaysTitle: "本节要点",
    scienceNoteTitle: "科学小贴士",
    practicalTipTitle: "今晚就试一试",
    relatedToolTitle: "试试相关工具",
    relatedGuideTitle: "深入了解",
    relatedGuideCta: "阅读完整指南",
    nextLessonTitle: "下一课",
    nextLessonCta: "继续学习",
    hubTitle: "知识",
    hubSub: "长篇 CBT-I 指南与简短的循证微课。",
    hubQuickLessonsLabel: "微课",
    hubGuidesLabel: "CBT-I 指南",
    minRead: "分钟阅读",
  },
  titles: zhTitles,
  summaries: zhSummaries,
  lessons: {
    "what-is-cbti": {
      meta: {
        title: "CBT-I 究竟是什么? | Somna",
        desc: "对失眠认知行为治疗(CBT-I)的入门解读,以及为何它被视为最有效的长期失眠疗法。",
      },
      eyebrow: "微课",
      title: "CBT-I 究竟是什么?",
      subtitle: "失眠认知行为治疗不是安眠药,而是一种结构化的方式,帮助大脑重新建立与睡眠的关系。",
      readingTime: "5",
      keyTakeaways: [
        "CBT-I 不是药物,而是改变与睡眠相关的行为与想法。",
        "全球睡眠专家推荐它作为慢性失眠的一线疗法。",
        "效果通常比安眠药更持久。",
        "大多数人在 4–8 周内能感受到明显改善。",
      ],
      sections: [
        {
          heading: "CBT-I 是什么意思?",
          paras: [
            'CBT-I 是"失眠认知行为治疗"的英文缩写。它是一套结构化、限定时长的方案,针对维持失眠的具体想法和行为。',
            "与安眠药不同,CBT-I 不会让你昏沉,而是温柔地引导身体和大脑恢复自然的睡眠节律,没有副作用。",
          ],
        },
        {
          heading: '睡眠问题是如何被"学会"的',
          paras: [
            "偶尔几个不眠之夜很正常。但当大脑开始把床与挫败感或清醒联系起来,问题就会慢性化。",
            '几周或几个月后,这种联系会越来越牢固。神经系统学到:"上床 = 保持警觉。"CBT-I 之所以有效,就是因为它直接处理这种学习。',
          ],
        },
        {
          heading: "五大核心组成",
          paras: [
            "CBT-I 综合了五种循证工具:睡眠限制(压缩在床上的时间以恢复睡眠驱力)、刺激控制(重新把床和睡眠联系起来)、认知重构(松动焦虑想法)、睡眠卫生(微小的环境调整)和放松训练。",
            "组合使用,它们能从多个角度同时打破失眠的循环。",
          ],
        },
        {
          heading: "为什么 CBT-I 长期有效",
          paras: [
            "药物只能在服用期间掩盖症状。CBT-I 改变的是底层模式,因此停止后效果依然存在。",
            "随访研究显示,效果可维持 1 到 3 年,这在失眠疗法中相当少见。",
          ],
        },
        {
          heading: "谁适合 CBT-I?",
          paras: [
            "绝大多数慢性失眠的成年人都能从中受益,包括老年人和多年困扰者。CBT-I 也适合与焦虑或抑郁治疗同步进行。",
            "如果你有未治疗的睡眠呼吸暂停、不宁腿等问题,请先咨询医生,以便安全地定制 CBT-I 方案。",
          ],
        },
      ],
      scienceNote:
        "包括美国睡眠医学会(AASM)与美国内科医师学会(ACP)在内的主要睡眠医学组织,都把 CBT-I 列为成年慢性失眠的一线疗法。",
      practicalTip:
        '今晚开始,床只用于睡眠与亲密——不刷手机、不工作、不焦虑。这条简单的规则正是"刺激控制"的核心。',
      cta: { label: "阅读完整的 CBT-I 指南", to: "/cbt-i-guide" },
      relatedGuide: { slug: "cbt-i-guide" },
      relatedTool: {
        to: "/calculator",
        label: "睡眠周期计算器",
        desc: "围绕 90 分钟自然周期来安排作息。",
      },
      faqs: [
        {
          q: "CBT-I 是一种药物吗?",
          a: "不是。CBT-I 是一套行为与认知方案,通过结构化技巧而非药物,处理失眠的根本原因。",
        },
        {
          q: "CBT-I 多久能见效?",
          a: "大多数人在 1–2 周内会感到一些变化,持续练习 4–8 周后可见明显改善。",
        },
        {
          q: "CBT-I 比安眠药更好吗?",
          a: "对慢性失眠而言,长期随访来看是的。药物可短期帮助,但停药后效果通常无法保持。",
        },
        {
          q: "必须找治疗师吗?",
          a: "经过 CBT-I 培训的临床医生效果最佳,但自助式与数字 CBT-I 项目同样具有科学依据,也很有效。",
        },
        {
          q: "失眠很多年了还有效吗?",
          a: "有效。因为 CBT-I 针对的是当前仍在维持失眠的模式,而不仅是最初的诱因。",
        },
        {
          q: "有副作用吗?",
          a: "主要的'副作用'是在睡眠限制的第 1–2 周可能短暂感到疲劳,没有药物相关的风险。",
        },
        {
          q: "可以同时服用安眠药吗?",
          a: "通常可以,在医生指导下进行。许多人会在 CBT-I 期间或之后逐步减药。",
        },
      ],
      nextLesson: "stimulus-control",
    },
    "90-minute-sleep-cycle": {
      meta: {
        title: "90 分钟睡眠周期 | Somna",
        desc: "了解睡眠周期如何运作,以及在合适的时间醒来为何能让你更有精神。",
      },
      eyebrow: "微课",
      title: "90 分钟睡眠周期",
      subtitle:
        "睡眠并不是一整段同质的过程,而是由反复出现的周期组成,每个周期都会影响你的清晨感受。",
      readingTime: "5",
      keyTakeaways: [
        "睡眠以周期形式反复进行,而非一种单一状态。",
        "一个周期平均约 90 分钟。",
        "深睡和快速眼动睡眠承担不同功能。",
        "时机很重要:在周期之间醒来通常更轻松。",
      ],
      sections: [
        {
          heading: "睡眠期间发生了什么?",
          paras: [
            "睡眠不是单一状态,大脑会在不同阶段之间循环,每个阶段都有独特的脑波、心率和肌张力模式。",
            "这些周期贯穿整夜,从早期更深的恢复性睡眠,逐渐过渡到清晨更长的快速眼动期。",
          ],
        },
        {
          heading: "四个睡眠阶段",
          paras: [
            "第一阶段是短暂的入睡;第二阶段稍深,占据夜间大部分时间;第三阶段是深度慢波睡眠,对身体恢复至关重要;快速眼动睡眠(REM)是做梦最频繁的阶段,对记忆和情绪处理非常重要。",
            "每个周期会按相同顺序经过这些阶段。",
          ],
        },
        {
          heading: "为什么是 90 分钟",
          paras: [
            "平均来说,一个完整周期约 90 分钟。在周期末尾醒来——而不是深睡中——通常感觉更轻盈、更清晰。",
            "这也是为什么入睡计算器常常给出间隔 90 分钟的建议。",
          ],
        },
        {
          heading: "为什么有时会昏沉",
          paras: [
            "如果闹钟在深睡中把你叫醒,可能会感到迷糊或沉重,这种现象叫'睡眠惰性',通常持续 15–30 分钟。",
            "把就寝时间提前或推后 15–30 分钟,起床时刻就可能落在更舒服的周期点上。",
          ],
        },
        {
          heading: "睡眠计算器如何运用周期",
          paras: [
            "它会从你期望的起床时间倒推,减去若干完整 90 分钟周期,以及一段入睡缓冲时间。",
            "它是参考而非保证,但对许多人来说是平稳清晨的不错起点。",
          ],
        },
      ],
      scienceNote: "睡眠周期长度是一个平均值,实际可在约 70–120 分钟之间,因时间段和个体而异。",
      practicalTip:
        "尽量让自己完成 5–6 个完整周期。对大多数成年人来说,这相当于 7.5–9 小时,正好落在科学推荐范围内。",
      cta: { label: "使用睡眠周期计算器", to: "/calculator" },
      relatedGuide: { slug: "how-to-fall-asleep-fast" },
      relatedTool: { to: "/calculator", label: "睡眠周期计算器", desc: "按完整周期安排上床时间。" },
      faqs: [
        {
          q: "每个睡眠周期都正好 90 分钟吗?",
          a: "不是。90 分钟是平均值,实际范围约 70–120 分钟,会因时段和个人而异。",
        },
        { q: "应该追求几个周期?", a: "大多数成年人 5–6 个周期(约 7.5–9 小时)感觉最好。" },
        {
          q: "为什么有时睡够了还昏沉?",
          a: "可能是在深睡中被叫醒。把就寝时间提前或推后 15–30 分钟可以改善。",
        },
        { q: "深睡比 REM 更重要吗?", a: "都重要。深睡支持身体恢复,REM 支持记忆与情绪调节。" },
        {
          q: "可以跟踪睡眠周期吗?",
          a: "消费级可穿戴设备能估算阶段,但并不医学精准。看数周趋势比看单晚更有意义。",
        },
        { q: "为什么不同时段周期不同?", a: "前半夜深睡更多,后半夜 REM 更多。两半都重要。" },
        {
          q: "小睡也有周期吗?",
          a: "有。90 分钟小睡可包含一个完整周期;20 分钟小睡则停留在较浅阶段,避免醒后昏沉。",
        },
      ],
      nextLesson: "4-7-8-breathing",
    },
    "4-7-8-breathing": {
      meta: {
        title: "解读 4-7-8 呼吸法 | Somna",
        desc: "了解 4-7-8 呼吸法如何在睡前降低身体的生理唤醒水平。",
      },
      eyebrow: "微课",
      title: "解读 4-7-8 呼吸法",
      subtitle: "一个简单的呼吸节奏,温柔地降低生理唤醒——一种有基础生理学支持的睡前小仪式。",
      readingTime: "5",
      keyTakeaways: [
        "缓慢呼吸会影响自主神经系统。",
        "长而柔的呼气有助于触发放松反应。",
        "持续比强度更重要。",
        "作为整体睡前流程的一部分效果最好。",
      ],
      sections: [
        {
          heading: "什么是 4-7-8 呼吸法?",
          paras: [
            "4-7-8 是一种结构化的呼吸节奏:用鼻吸气 4 秒,屏息 7 秒,然后用嘴缓慢呼气 8 秒。",
            "它被推广为放松技巧,但其效果实际上来自更古老的原理——缓慢呼吸对身体压力反应的影响。",
          ],
        },
        {
          heading: "如何练习",
          paras: [
            "舒适地坐着或躺下。舌尖轻抵上门齿后方,先彻底呼气。",
            "用鼻安静吸气 4 秒,屏息 7 秒,撅唇呼气 8 秒。完成 4 个循环。开始时不要勉强,逐步建立。",
          ],
        },
        {
          heading: "为什么会感到平静",
          paras: [
            "长呼气会激活副交感神经系统,降低心率,缓和压力信号。",
            "数数也会温和地占据思维,让注意力从纷乱的想法上转移开。",
          ],
        },
        {
          heading: "常见误区",
          paras: [
            "用力过猛、憋得太紧、一次做太多,反而会让人不适。",
            "如果感到头晕,请回到自然呼吸。目标是平静,不是努力。",
          ],
        },
        {
          heading: "融入夜间作息",
          paras: [
            "把它和另一个动作搭配——调暗灯光、洗脸、上床——让它成为'今天结束'的自动信号。",
            "大多数人在持续练习 1–2 周后,会感到最明显的好处。",
          ],
        },
      ],
      scienceNote: "节律性缓慢呼吸已被研究证实可降低健康成年人的心率、血压和自我报告的压力水平。",
      practicalTip:
        "今晚熄灯前尝试 2–4 个 4-7-8 循环。你不是在追求入睡,而是在向身体发出'安全'的信号。",
      cta: { label: "如何更快入睡", to: "/how-to-fall-asleep-fast" },
      relatedGuide: { slug: "how-to-fall-asleep-fast" },
      relatedTool: {
        to: "/relax",
        label: "引导式 4-7-8 练习",
        desc: "跟随平静的视觉提示进行练习。",
      },
      faqs: [
        {
          q: "4-7-8 呼吸能直接让人入睡吗?",
          a: "不能。它能降低唤醒水平,辅助入睡,但本身不是镇静剂。",
        },
        {
          q: "应该做几个循环?",
          a: "从 4 个开始。一些练习者会在几周内逐步增加,但更多并不一定更好。",
        },
        {
          q: "所有人都安全吗?",
          a: "对健康成年人通常安全。如有肺部疾病、低血压或感到头晕,请改用自然呼吸。",
        },
        { q: "儿童可以练习吗?", a: "可适当缩短屏息时间用于较大儿童,但请先咨询儿科医生。" },
        { q: "为什么呼气比吸气长?", a: "长呼气会激活副交感神经系统,即所谓的'休息与消化'模式。" },
        {
          q: "数数让我更焦虑怎么办?",
          a: "可以不数数,只用鼻缓慢吸气,然后柔长地呼气。模式比数字更重要。",
        },
        {
          q: "需要多久练习一次?",
          a: "理想情况是每天练习——不限于睡前。大多数人 1–2 周内能看到效果。",
        },
      ],
      nextLesson: "racing-thoughts-at-night",
    },
    "racing-thoughts-at-night": {
      meta: {
        title: "当思绪无法安静 | Somna",
        desc: "了解为什么思绪在夜里更喧闹,以及 CBT-I 如何应对赛跑的想法。",
      },
      eyebrow: "微课",
      title: "当思绪无法安静",
      subtitle:
        "睡前思绪奔涌不是性格缺陷,而是神经系统被过度激活后的可预期表现。CBT-I 提供了实用工具。",
      readingTime: "5",
      keyTakeaways: [
        "夜间思绪奔涌很常见,并非异常。",
        "身体与心理的过度唤醒都起重要作用。",
        "试图压制想法往往适得其反。",
        "CBT-I 提供的具体工具比'放松点'更有效。",
      ],
      sections: [
        {
          heading: "为什么夜里思绪更响",
          paras: [
            "白天注意力被任务、对话、运动牵引到外部。夜里这些干扰消失,内在的想法独占舞台。",
            "再加上疲惫时大脑的'冷静规划区'变得不那么活跃,担忧就显得格外紧迫。",
          ],
        },
        {
          heading: "高唤醒模型",
          paras: [
            "研究者把慢性失眠描述为'高唤醒'状态——身心都处于难以入睡的高度激活。",
            "压力激素、加快的心率和忙碌的思维互相强化。一旦循环形成,普通的'放松点'已经不够。",
          ],
        },
        {
          heading: "为什么'不要想'没用",
          paras: [
            "告诉自己'不要想',通常会让想法更响,这就是'白熊效应':越想压住,它越冒头。",
            "CBT-I 改变目标——不是停止想法,而是学习让它们经过,不去回应。",
          ],
        },
        {
          heading: "有用的 CBT-I 策略",
          paras: [
            "设一个白天的'担忧时段':傍晚花 10 分钟写下担心和下一步行动,时间到了就合上本子。",
            "如果在床上空转了约 20 分钟,起来,坐到光线柔和的地方,做点平静的事,直到再次困倦才回到床。这是 CBT-I 工具中最有力的'刺激控制'。",
          ],
        },
        {
          heading: "何时寻求专业帮助",
          paras: [
            "如果思绪奔涌伴随持续的情绪低落、白天惊恐或显著影响生活,请联系专业人士。",
            "焦虑与失眠常常同行,协同治疗往往效果更佳。",
          ],
        },
      ],
      scienceNote:
        "现代研究越来越把失眠理解为一种'高唤醒'障碍——同时涉及认知(心理)与生理(身体)的激活。",
      practicalTip:
        "今晚刷牙前先把明天的任务清单写下来。把负担'外化',就告诉大脑不必在床上反复演练。",
      cta: { label: "阅读《睡眠焦虑》指南", to: "/sleep-anxiety" },
      relatedGuide: { slug: "sleep-anxiety" },
      relatedTool: { to: "/relax", label: "睡前呼吸", desc: "先让身体平静,心也会随之平静。" },
      faqs: [
        {
          q: "为什么思绪总在临睡前涌现?",
          a: "白天的干扰消失,内在思绪无人竞争。疲惫的'冷静规划区'又让担忧显得更紧迫。",
        },
        {
          q: "应该努力把想法推开吗?",
          a: "不。这通常会放大它们。目标是注意到想法,让它们像云一样飘过。",
        },
        {
          q: "写日记真的有帮助吗?",
          a: "有,尤其是在傍晚提早进行。'担忧时段'让担心外化,不在床上爆发。",
        },
        {
          q: "思绪奔涌等于焦虑吗?",
          a: "高度重叠。如伴随持续担忧、低落或惊恐,请考虑寻求专业帮助。",
        },
        { q: "冥想有帮助吗?", a: "对许多人有帮助,尤其是关注'觉察想法但不参与'的正念取向。" },
        { q: "睡前听播客行吗?", a: "证据不一。轻量音频对部分人有用,内容过强则可能让大脑更活跃。" },
        {
          q: "思绪奔涌就等于失眠吗?",
          a: "不必然。失眠的临床定义是每周至少 3 晚、持续 3 个月以上的睡眠困难并影响白天功能。",
        },
      ],
      nextLesson: "circadian-rhythm",
    },
    "circadian-rhythm": {
      meta: {
        title: "光、咖啡因与你的生物钟 | Somna",
        desc: "了解光照与咖啡因如何影响生物钟与入睡时间。",
      },
      eyebrow: "微课",
      title: "光、咖啡因与你的生物钟",
      subtitle: "身体有一个 24 小时的内部时钟。光与咖啡因是塑造你何时容易入睡的两个最强信号。",
      readingTime: "5",
      keyTakeaways: [
        "生物钟决定你何时困倦、何时清醒。",
        "晨间光照增强并稳定生物钟。",
        "夜间强光会延后入睡。",
        "咖啡因可能在最后一口之后还作用数小时。",
      ],
      sections: [
        {
          heading: "什么是昼夜节律?",
          paras: [
            "昼夜节律是身体大约 24 小时的内部循环,调节睡眠、清醒、激素、体温等。",
            "无论你是否关注,它都在运行——但外部信号,尤其是光,能让它与现实世界保持同步。",
          ],
        },
        {
          heading: "晨间光照与睡眠时机",
          paras: [
            "起床后第一两小时的明亮光线,会向大脑发出清晰的'白天'信号,稳定生物钟,让当晚更容易入睡。",
            "即便是阴天,户外光也远比室内灯亮——一段简短的散步可能是最简单的睡眠升级。",
          ],
        },
        {
          heading: "夜间光照",
          paras: [
            "夜间强光——包括屏幕光——会抑制褪黑素,让生物钟后移。",
            "睡前 60–90 分钟开始调暗灯光,神经系统就会接收到'夜晚开始了'的信号。",
          ],
        },
        {
          heading: "咖啡因如何影响睡眠",
          paras: [
            "咖啡因阻断腺苷——一种白天积累'睡眠压力'的分子。它的半衰期约 5 小时,所以下午 2 点的咖啡到睡前仍在体内活跃。",
            "即便能入睡,夜间咖啡因也可能减少深睡,让你在不自知的情况下醒来仍感疲倦。",
          ],
        },
        {
          heading: "建立更好的时机习惯",
          paras: [
            "目标:固定起床时间、每日晨间光照、下午稍早的咖啡因截止时间。三个小改变可能改变整周感觉。",
            "持续比完美更重要。可持续的小调整往往胜过激进的大改造。",
          ],
        },
      ],
      scienceNote: "光是塑造生物钟的最强信号之一——尤其是早晨的明亮光照与傍晚的低光环境。",
      practicalTip:
        "起床一小时内到户外晒光,即使只是 5–10 分钟。再尝试为期两周的'下午 2 点之后不喝咖啡',看夜晚是否改善。",
      cta: { label: "使用最佳入睡时间计算器", to: "/bedtime-calculator" },
      relatedGuide: { slug: "how-to-fall-asleep-fast" },
      relatedTool: {
        to: "/bedtime-calculator",
        label: "最佳入睡时间计算器",
        desc: "找到最适合上床的时间。",
      },
      faqs: [
        {
          q: "咖啡因在体内停留多久?",
          a: "半衰期约 5 小时:下午 2 点的咖啡,到晚上 7 点仍剩一半,午夜还有四分之一。",
        },
        {
          q: "晨间光照真的重要吗?",
          a: "重要。它是稳定生物钟最强的信号之一,哪怕只是 5–10 分钟户外光。",
        },
        { q: "防蓝光眼镜值得买吗?", a: "傍晚降低整体光强,比单独过滤蓝光更重要。" },
        { q: "脱因咖啡完全没有咖啡因吗?", a: "不是。脱因咖啡每杯通常仍含 2–15 毫克咖啡因。" },
        {
          q: "上夜班怎么办?",
          a: "在'白天'增加亮光暴露,在'夜晚'保持黑暗。轮班工作会扰乱生物钟,需要定制化方案。",
        },
        {
          q: "酒精会影响生物钟吗?",
          a: "酒精会打碎睡眠结构,即便让你更快入睡,也会改变睡眠的整体质量。",
        },
        {
          q: "多久能调整生物钟?",
          a: "在稳定的光照、用餐与起床信号下,大多数成年人每天可调整约 1 小时。",
        },
      ],
      nextLesson: "stimulus-control",
    },
    "stimulus-control": {
      meta: {
        title: "通俗易懂的刺激控制法 | Somna",
        desc: "学习 CBT-I 中最有效的策略之一,重建床与睡眠之间的健康联系。",
      },
      eyebrow: "微课",
      title: "通俗易懂的刺激控制法",
      subtitle: "刺激控制重新训练床与睡眠之间的简单学习关系——它是 CBT-I 中最有力的工具之一。",
      readingTime: "5",
      keyTakeaways: [
        "床应当与睡眠相关——而不是清醒。",
        "在床上保持清醒,会悄悄强化失眠。",
        "坚持比完美更重要。",
        "改善需要练习,前几晚最难。",
      ],
      sections: [
        {
          heading: "什么是刺激控制?",
          paras: [
            "刺激控制就是把卧室和床只用于睡眠与亲密。",
            "目标很简单:当身体跨过卧室门槛,它就知道即将发生什么。",
          ],
        },
        {
          heading: "失眠如何改变床的联想",
          paras: [
            "在床上反复辗转后,床被与挫败、警觉、焦虑配对在一起。",
            "这是一种条件反射——和听到某种声音就分泌口水的学习方式相同。大脑不会跟它讲道理,它只会反应。",
          ],
        },
        {
          heading: "20 分钟法则",
          paras: [
            "若约 20 分钟仍未入睡(不要盯着时钟,估算就好),离开床。换个光线柔和的地方,做点平静的事:翻几页温和的书、缓慢拉伸、安静坐着深呼吸。",
            "只在感到困倦——眼皮沉重、头部点头——时再回到床。如有需要可重复。这听起来反直觉,却是刺激控制的核心。",
          ],
        },
        {
          heading: "常见错误",
          paras: [
            "在床上用手机、工作、看电视,或'更努力'地试图入睡,都会强化错误的联想。",
            "断断续续地执行也会拖慢效果。每晚坚持几周,方法才能充分发挥作用。",
          ],
        },
        {
          heading: "可以期待的结果",
          paras: [
            "多数人前 3–5 晚会比较辛苦——因为在床上清醒的时间减少了,总睡眠也可能暂时变少。",
            "到第 2 周,睡眠常会变得更整齐:入睡更快、夜醒更少、床也再次成为睡眠的信号。",
          ],
        },
      ],
      scienceNote: "刺激控制是研究最充分的 CBT-I 技术之一,可作为慢性失眠的独立循证治疗推荐使用。",
      practicalTip:
        "今晚就把屏幕、工作材料和笔记本电脑搬出卧室。哪怕只是小小的物理改变,也能重新塑造信号。",
      cta: { label: "阅读完整的 CBT-I 指南", to: "/cbt-i-guide" },
      relatedGuide: { slug: "cbt-i-guide" },
      relatedTool: { to: "/calculator", label: "睡眠周期计算器", desc: "让上床时间匹配自然周期。" },
      faqs: [
        {
          q: "CBT-I 中的刺激控制是什么?",
          a: "就是只把床用于睡眠;睡不着就离开床;保持稳定的起床时间——让床再次成为睡眠的信号。",
        },
        { q: "多久能看到效果?", a: "持续练习 1–3 周内,大多数人会有所改善。" },
        {
          q: "20 分钟法则要严格遵守吗?",
          a: "这是参考。不要盯时钟,估算就好。如果明显清醒且烦躁,就离开床。",
        },
        {
          q: "离开床后该做什么?",
          a: "做平静、低刺激的事:读温和的书、慢拉伸、安静坐着。避免屏幕、工作或刺激性内容。",
        },
        {
          q: "对半夜醒来也有效吗?",
          a: "有效。半夜醒来如约 20 分钟无法再入睡,同样离开床,困了再回。",
        },
        {
          q: "离开床反而更清醒怎么办?",
          a: "保持灯光昏暗、动作轻缓、身体放松。目标不是完全清醒,而是让困意自然回来。",
        },
        { q: "可以只用刺激控制吗?", a: "可以单独有效,但与睡眠限制及固定起床时间合用效果最佳。" },
      ],
      nextLesson: "what-is-cbti",
    },
  },
};

/* =====================================================================
 * SPANISH
 * ===================================================================== */
const esTitles: Record<LearnSlug, string> = {
  "what-is-cbti": "¿Qué es realmente la TCC-I?",
  "90-minute-sleep-cycle": "El ciclo de sueño de 90 minutos",
  "4-7-8-breathing": "La respiración 4-7-8, explicada",
  "racing-thoughts-at-night": "Cuando la mente no se calma",
  "circadian-rhythm": "Luz, cafeína y tu reloj interno",
  "stimulus-control": "Control de estímulos en palabras sencillas",
};

const esSummaries: Record<LearnSlug, string> = {
  "what-is-cbti": "Una introducción accesible a la TCC-I y por qué funciona a largo plazo.",
  "90-minute-sleep-cycle": "Cómo los ciclos de sueño influyen en cómo te sientes al despertar.",
  "4-7-8-breathing": "Un patrón de respiración simple que calma el sistema nervioso.",
  "racing-thoughts-at-night":
    "Por qué los pensamientos se hacen ruidosos de noche — y qué hace la TCC-I.",
  "circadian-rhythm": "Cómo la luz y la cafeína dirigen silenciosamente tu reloj interno.",
  "stimulus-control": "Reconstruir la conexión cama–sueño, una noche a la vez.",
};

const es: LearnDict = {
  ui: {
    learn: "Aprender",
    quickLessons: "Microlecciones",
    cbtiGuides: "Guías TCC-I",
    readBadge: "Lectura de 5 minutos",
    takeawaysTitle: "Puntos clave",
    scienceNoteTitle: "Nota científica",
    practicalTipTitle: "Prueba esta noche",
    relatedToolTitle: "Prueba una herramienta relacionada",
    relatedGuideTitle: "Profundiza más",
    relatedGuideCta: "Leer la guía completa",
    nextLessonTitle: "Siguiente lección",
    nextLessonCta: "Continuar aprendiendo",
    hubTitle: "Aprender",
    hubSub: "Guías completas de TCC-I y microlecciones breves basadas en evidencia.",
    hubQuickLessonsLabel: "Microlecciones",
    hubGuidesLabel: "Guías TCC-I",
    minRead: "min de lectura",
  },
  titles: esTitles,
  summaries: esSummaries,
  lessons: {
    "what-is-cbti": {
      meta: {
        title: "¿Qué es realmente la TCC-I? | Somna",
        desc: "Una explicación accesible de la Terapia Cognitivo-Conductual para el Insomnio (TCC-I) y por qué se considera el tratamiento más efectivo a largo plazo.",
      },
      eyebrow: "MICROLECCIÓN",
      title: "¿Qué es realmente la TCC-I?",
      subtitle:
        "La Terapia Cognitivo-Conductual para el Insomnio no es una pastilla — es una forma estructurada de reentrenar la relación de tu cerebro con el sueño.",
      readingTime: "5",
      keyTakeaways: [
        "La TCC-I no es medicación — cambia conductas y pensamientos sobre el sueño.",
        "Los especialistas la recomiendan como primera línea para el insomnio crónico.",
        "Los resultados suelen durar mucho más que los somníferos.",
        "La mayoría nota mejoras significativas en 4–8 semanas.",
      ],
      sections: [
        {
          heading: "¿Qué significa TCC-I?",
          paras: [
            "TCC-I significa Terapia Cognitivo-Conductual para el Insomnio. Es un programa estructurado y limitado en el tiempo que aborda los pensamientos y conductas que mantienen el insomnio.",
            "A diferencia de los somníferos, la TCC-I no te seda. Enseña al cuerpo y al cerebro a recuperar su ritmo natural de sueño — suavemente y sin efectos secundarios.",
          ],
        },
        {
          heading: "Cómo se aprende el problema del sueño",
          paras: [
            "Unas noches difíciles son normales. Se vuelven crónicas cuando el cerebro empieza a asociar la cama con frustración o alerta.",
            "Con semanas o meses, esa asociación se fortalece. El sistema nervioso aprende: 'hora de dormir = mantenerme alerta'. La TCC-I actúa directamente sobre ese aprendizaje.",
          ],
        },
        {
          heading: "Los cinco componentes centrales",
          paras: [
            "La TCC-I combina cinco herramientas con evidencia: restricción del sueño (comprimir el tiempo en cama para reconstruir la presión de sueño), control de estímulos (volver a vincular cama y sueño), reestructuración cognitiva (suavizar pensamientos ansiosos), higiene del sueño (pequeños ajustes ambientales) y entrenamiento en relajación.",
            "Juntas, rompen el bucle del insomnio desde varios ángulos a la vez.",
          ],
        },
        {
          heading: "Por qué funciona a largo plazo",
          paras: [
            "La medicación enmascara síntomas mientras la tomas. La TCC-I cambia los patrones de fondo, así que los avances permanecen tras terminar el programa.",
            "Estudios de seguimiento muestran beneficios mantenidos 1–3 años después — algo inusual en cualquier tratamiento para el insomnio.",
          ],
        },
        {
          heading: "¿A quién puede ayudar?",
          paras: [
            "A la mayoría de adultos con insomnio crónico, incluidas personas mayores y quienes llevan años con problemas. También funciona junto al tratamiento para ansiedad o depresión.",
            "Si tienes apnea del sueño no tratada, piernas inquietas u otro trastorno del sueño, consulta a un clínico para adaptar la TCC-I con seguridad.",
          ],
        },
      ],
      scienceNote:
        "Las principales organizaciones de medicina del sueño — incluidas AASM y ACP — recomiendan la TCC-I como tratamiento de primera línea para el insomnio crónico en adultos.",
      practicalTip:
        "Esta noche, usa la cama solo para dormir e intimidad — sin scrollear, sin trabajar, sin rumiar. Esta regla es el corazón del control de estímulos.",
      cta: { label: "Lee la guía completa de TCC-I", to: "/cbt-i-guide" },
      relatedGuide: { slug: "cbt-i-guide" },
      relatedTool: {
        to: "/calculator",
        label: "Calculadora de ciclos",
        desc: "Planifica con ciclos naturales de 90 minutos.",
      },
      faqs: [
        {
          q: "¿La TCC-I es un tipo de medicación?",
          a: "No. La TCC-I es un programa conductual y cognitivo. Usa técnicas estructuradas, no fármacos, para atender las causas del insomnio.",
        },
        {
          q: "¿Cuánto tarda en funcionar?",
          a: "La mayoría nota algún cambio en 1–2 semanas y mejoras significativas en 4–8 semanas con práctica constante.",
        },
        {
          q: "¿Es mejor que los somníferos?",
          a: "Para el insomnio crónico, sí — en el seguimiento a largo plazo. Las pastillas ayudan a corto plazo, pero los beneficios rara vez persisten al dejarlas.",
        },
        {
          q: "¿Necesito un terapeuta?",
          a: "Un clínico entrenado da los mejores resultados, pero los programas digitales y autoguiados también tienen base científica y son eficaces.",
        },
        {
          q: "¿Funciona si llevo años con insomnio?",
          a: "Sí. Aborda los patrones que mantienen el insomnio ahora, no solo el desencadenante original.",
        },
        {
          q: "¿Tiene efectos secundarios?",
          a: "El principal 'efecto' es cansancio temporal durante la restricción del sueño en las primeras 1–2 semanas. No hay riesgos farmacológicos.",
        },
        {
          q: "¿Puedo hacer TCC-I mientras tomo medicación?",
          a: "Sí, con guía clínica. Muchas personas reducen la medicación durante o tras la TCC-I.",
        },
      ],
      nextLesson: "stimulus-control",
    },
    "90-minute-sleep-cycle": {
      meta: {
        title: "El ciclo de sueño de 90 minutos | Somna",
        desc: "Entiende cómo funcionan los ciclos de sueño y por qué despertar en el momento adecuado puede mejorar cómo te sientes.",
      },
      eyebrow: "MICROLECCIÓN",
      title: "El ciclo de sueño de 90 minutos",
      subtitle:
        "El sueño no ocurre en un único bloque — se mueve por ciclos repetidos que moldean cómo te sentirás por la mañana.",
      readingTime: "5",
      keyTakeaways: [
        "El sueño ocurre en ciclos que se repiten, no en un estado único.",
        "Un ciclo dura unos 90 minutos en promedio.",
        "El sueño profundo y el REM cumplen funciones distintas.",
        "El momento importa: despertar entre ciclos suele sentirse más fácil.",
      ],
      sections: [
        {
          heading: "¿Qué pasa mientras duermes?",
          paras: [
            "El sueño no es un estado único. Tu cerebro pasa por distintas etapas, cada una con su patrón de ondas, frecuencia cardíaca y tono muscular.",
            "Estos ciclos se repiten toda la noche, pasando de un sueño profundo y reparador al inicio, a periodos REM más largos hacia la mañana.",
          ],
        },
        {
          heading: "Las cuatro etapas del sueño",
          paras: [
            "La etapa 1 es la entrada ligera al sueño. La etapa 2 es algo más profunda y ocupa la mayor parte de la noche. La etapa 3 es el sueño profundo de ondas lentas — vital para la recuperación física. El REM (movimiento ocular rápido) es donde ocurren los sueños vívidos y es esencial para la memoria y la regulación emocional.",
            "Cada ciclo recorre estas etapas en un orden similar.",
          ],
        },
        {
          heading: "Por qué importan los 90 minutos",
          paras: [
            "En promedio, un ciclo completo dura unos 90 minutos. Despertar al final de un ciclo — y no en medio del sueño profundo — suele sentirse más liviano.",
            "Por eso las calculadoras de sueño suelen ofrecer opciones separadas en intervalos de 90 minutos.",
          ],
        },
        {
          heading: "Por qué a veces te sientes pesado",
          paras: [
            "Si tu alarma interrumpe el sueño profundo, puedes despertar confundido o pesado. Es la 'inercia del sueño' y puede durar 15–30 minutos.",
            "Ajustar la hora de dormir incluso 15–30 minutos puede dejarte despertar en un punto más amable del ciclo.",
          ],
        },
        {
          heading: "Cómo usan los ciclos las calculadoras",
          paras: [
            "La calculadora retrocede desde tu hora deseada de despertar, restando ciclos completos de 90 minutos y un margen para conciliar el sueño.",
            "Es una orientación, no una garantía — pero para muchas personas es un buen punto de partida.",
          ],
        },
      ],
      scienceNote:
        "La duración de los ciclos es un promedio — los reales varían entre 70 y 120 minutos y cambian a lo largo de la noche y entre personas.",
      practicalTip:
        "Apunta a 5 o 6 ciclos completos cuando puedas. Para la mayoría de adultos son 7,5–9 horas, justo dentro del rango recomendado.",
      cta: { label: "Usa la calculadora de ciclos", to: "/calculator" },
      relatedGuide: { slug: "how-to-fall-asleep-fast" },
      relatedTool: {
        to: "/calculator",
        label: "Calculadora de ciclos",
        desc: "Planifica la hora de dormir por ciclos completos.",
      },
      faqs: [
        {
          q: "¿Cada ciclo dura exactamente 90 minutos?",
          a: "No — 90 minutos es un promedio. Los ciclos varían entre 70 y 120 minutos y cambian a lo largo de la noche y entre personas.",
        },
        {
          q: "¿Cuántos ciclos debo intentar?",
          a: "La mayoría de adultos se siente mejor con 5–6 ciclos por noche, unas 7,5–9 horas.",
        },
        {
          q: "¿Por qué a veces despierto pesado aun con horas suficientes?",
          a: "Probablemente despertaste en sueño profundo. Ajustar la hora de dormir 15–30 minutos suele ayudar.",
        },
        {
          q: "¿Es el sueño profundo más importante que el REM?",
          a: "Ambos importan. El profundo apoya la recuperación física; el REM, la memoria y las emociones.",
        },
        {
          q: "¿Puedo medir mis ciclos?",
          a: "Los wearables estiman etapas pero no son médicamente precisos. Las tendencias a lo largo de semanas son más útiles.",
        },
        {
          q: "¿Por qué los ciclos cambian durante la noche?",
          a: "Los primeros ciclos contienen más sueño profundo; los últimos, más REM. Ambas mitades son importantes.",
        },
        {
          q: "¿Las siestas también usan ciclos?",
          a: "Sí. Una siesta de 90 minutos puede incluir un ciclo completo; una de 20 minutos se queda en etapas ligeras y evita la pesadez.",
        },
      ],
      nextLesson: "4-7-8-breathing",
    },
    "4-7-8-breathing": {
      meta: {
        title: "La respiración 4-7-8, explicada | Somna",
        desc: "Aprende cómo el método de respiración 4-7-8 puede reducir la activación fisiológica antes de dormir.",
      },
      eyebrow: "MICROLECCIÓN",
      title: "La respiración 4-7-8, explicada",
      subtitle:
        "Un patrón de respiración simple que baja suavemente la activación fisiológica — un ritual previo al sueño con base fisiológica.",
      readingTime: "5",
      keyTakeaways: [
        "La respiración lenta afecta al sistema nervioso autónomo.",
        "Las exhalaciones largas y suaves favorecen la relajación.",
        "La constancia importa más que la intensidad.",
        "Funciona mejor dentro de una rutina nocturna.",
      ],
      sections: [
        {
          heading: "¿Qué es la respiración 4-7-8?",
          paras: [
            "Es un patrón estructurado: inhala por la nariz durante 4 segundos, retén 7 segundos y exhala lentamente por la boca durante 8 segundos.",
            "Se popularizó como técnica calmante, pero su efecto se basa en algo más antiguo: la influencia de la respiración lenta sobre la respuesta al estrés.",
          ],
        },
        {
          heading: "Cómo practicarla",
          paras: [
            "Siéntate o recuéstate. Coloca la punta de la lengua detrás de los incisivos superiores. Exhala por completo.",
            "Inhala suavemente por la nariz 4 segundos. Retén 7. Exhala por los labios fruncidos 8. Repite 4 ciclos. Al principio puede sentirse intenso — ve sin forzar.",
          ],
        },
        {
          heading: "Por qué puede sentirse calmante",
          paras: [
            "Las exhalaciones largas activan la rama parasimpática del sistema nervioso, que baja el ritmo cardíaco y suaviza el estrés.",
            "Contar también ocupa la mente, alejándola del bucle de pensamientos.",
          ],
        },
        {
          heading: "Errores comunes",
          paras: [
            "Forzar demasiado, retener con tensión o hacer demasiados ciclos seguidos puede generar incomodidad.",
            "Si sientes mareo, vuelve a la respiración natural. El objetivo es calma, no esfuerzo.",
          ],
        },
        {
          heading: "Cómo integrarla en tu rutina",
          paras: [
            "Asóciala con otra señal — bajar luces, lavarte la cara, meterte en la cama — para que se vuelva un aviso automático de que el día se cierra.",
            "El mayor beneficio suele notarse tras 1–2 semanas de práctica constante.",
          ],
        },
      ],
      scienceNote:
        "La respiración pautada y lenta ha mostrado reducir la frecuencia cardíaca, la presión arterial y el estrés autoinformado en adultos sanos.",
      practicalTip:
        "Esta noche, antes de apagar la luz, intenta 2–4 ciclos de 4-7-8. No persigues el sueño — señalas seguridad.",
      cta: { label: "Cómo dormirte rápido", to: "/how-to-fall-asleep-fast" },
      relatedGuide: { slug: "how-to-fall-asleep-fast" },
      relatedTool: {
        to: "/relax",
        label: "Sesión 4-7-8 guiada",
        desc: "Practica con una guía visual tranquila.",
      },
      faqs: [
        {
          q: "¿La 4-7-8 te duerme directamente?",
          a: "No directamente. Reduce la activación y apoya el sueño, pero no es un sedante.",
        },
        {
          q: "¿Cuántos ciclos debo hacer?",
          a: "Empieza con 4. Algunos practicantes aumentan con el tiempo. Más no siempre es mejor.",
        },
        {
          q: "¿Es segura para todos?",
          a: "Suele serlo para adultos sanos. Con problemas pulmonares, presión baja o mareo, mejor respirar de forma natural.",
        },
        {
          q: "¿Pueden practicarla los niños?",
          a: "Una versión más corta funciona para niños mayores, pero consulta al pediatra.",
        },
        {
          q: "¿Por qué exhalar más largo?",
          a: "Las exhalaciones largas activan la rama parasimpática 'descansa y digiere'.",
        },
        {
          q: "¿Y si contar me pone más ansioso?",
          a: "Salta el conteo. Respira lento por la nariz con una exhalación larga y suave.",
        },
        {
          q: "¿Con qué frecuencia practicar?",
          a: "Lo ideal es a diario — incluso fuera de la hora de dormir — para entrenar la respuesta.",
        },
      ],
      nextLesson: "racing-thoughts-at-night",
    },
    "racing-thoughts-at-night": {
      meta: {
        title: "Cuando la mente no se calma | Somna",
        desc: "Entiende por qué los pensamientos se hacen más ruidosos de noche y cómo la TCC-I aborda los pensamientos acelerados.",
      },
      eyebrow: "MICROLECCIÓN",
      title: "Cuando la mente no se calma",
      subtitle:
        "Los pensamientos acelerados no son un defecto — son una respuesta predecible de un sistema nervioso activado. La TCC-I tiene herramientas concretas.",
      readingTime: "5",
      keyTakeaways: [
        "Los pensamientos acelerados de noche son comunes.",
        "La hiperactivación física y mental juega un papel central.",
        "Suprimir los pensamientos suele ser contraproducente.",
        "La TCC-I ofrece herramientas más eficaces que 'solo relájate'.",
      ],
      sections: [
        {
          heading: "Por qué los pensamientos suenan más fuerte",
          paras: [
            "De día la atención se va a tareas, conversaciones y movimiento. De noche desaparecen esas distracciones y los pensamientos internos ocupan el centro del escenario.",
            "Cansado, la corteza prefrontal (la planificadora calmada) baja su actividad, y las preocupaciones se sienten más urgentes de lo que son.",
          ],
        },
        {
          heading: "El modelo de hiperactivación",
          paras: [
            "Se entiende el insomnio crónico como un estado de hiperactivación — cuerpo y mente demasiado activos para que el sueño tome el control.",
            "Hormonas de estrés, frecuencia cardíaca alta y mente acelerada se refuerzan entre sí. Cuando arranca, 'intenta relajarte' no basta.",
          ],
        },
        {
          heading: "Por qué intentar no pensar no funciona",
          paras: [
            "Decirte 'deja de pensar' suele hacer que pienses más. Es el efecto 'oso blanco': cuanto más suprimes, más vuelve.",
            "La TCC-I cambia la meta — no detener pensamientos, sino dejarlos pasar sin engancharte.",
          ],
        },
        {
          heading: "Estrategias útiles de TCC-I",
          paras: [
            "Usa una 'ventana de preocupación' diurna: dedica 10 minutos al anochecer a anotar inquietudes y próximos pasos. Cierra el cuaderno cuando termine el tiempo.",
            "Si llevas 20 minutos dándole vueltas en la cama, levántate. Siéntate en un lugar con luz tenue. Lee algo suave. Vuelve solo cuando tengas sueño. Es control de estímulos — la herramienta más poderosa de la TCC-I.",
          ],
        },
        {
          heading: "Cuándo buscar ayuda profesional",
          paras: [
            "Si los pensamientos vienen con bajo ánimo persistente, pánico diurno o gran impacto en la vida, acude a un clínico.",
            "Ansiedad e insomnio suelen ir juntos y responden bien a un tratamiento coordinado.",
          ],
        },
      ],
      scienceNote:
        "El insomnio se entiende cada vez más como un trastorno de hiperactivación — tanto cognitiva (mental) como fisiológica (corporal).",
      practicalTip:
        "Esta noche, escribe la lista de tareas de mañana antes de lavarte los dientes. Externalizar la carga le dice al cerebro que no debe ensayarla en la cama.",
      cta: { label: "Lee la guía de ansiedad de sueño", to: "/sleep-anxiety" },
      relatedGuide: { slug: "sleep-anxiety" },
      relatedTool: {
        to: "/relax",
        label: "Respiración de cierre",
        desc: "Calma el cuerpo para calmar la mente.",
      },
      faqs: [
        {
          q: "¿Por qué los pensamientos acelerados aparecen a la hora de dormir?",
          a: "Sin distracciones diurnas, los pensamientos internos no tienen con qué competir. Una corteza prefrontal cansada también amplifica la sensación de urgencia.",
        },
        {
          q: "¿Debo intentar apartar los pensamientos?",
          a: "No — suele amplificarlos. La meta es notarlos y dejarlos pasar, como nubes en el cielo.",
        },
        {
          q: "¿Sirve escribir?",
          a: "Sí, sobre todo al anochecer. Una 'ventana de preocupación' externaliza inquietudes para que no aparezcan en la cama.",
        },
        {
          q: "¿Pensamientos acelerados es lo mismo que ansiedad?",
          a: "Se superponen mucho. Si vienen con preocupación persistente, bajo ánimo o pánico, considera hablar con un clínico.",
        },
        {
          q: "¿Ayuda la meditación?",
          a: "Para muchas personas, sí — especialmente las prácticas de mindfulness que enseñan a observar sin engancharse.",
        },
        {
          q: "¿Y escuchar un pódcast en la cama?",
          a: "Evidencia mixta. Audio ligero ayuda a algunas personas; contenido atractivo mantiene al cerebro activo.",
        },
        {
          q: "¿Los pensamientos acelerados son sinónimo de insomnio?",
          a: "No por sí solos. El insomnio se define por dificultades de sueño al menos 3 noches por semana durante 3+ meses, con impacto diurno.",
        },
      ],
      nextLesson: "circadian-rhythm",
    },
    "circadian-rhythm": {
      meta: {
        title: "Luz, cafeína y tu reloj interno | Somna",
        desc: "Aprende cómo la exposición a la luz y la cafeína afectan el ritmo circadiano y la hora de dormir.",
      },
      eyebrow: "MICROLECCIÓN",
      title: "Luz, cafeína y tu reloj interno",
      subtitle:
        "Tu cuerpo tiene un reloj interno de 24 horas. La luz y la cafeína son dos de las señales más fuertes que moldean cuándo te llega el sueño.",
      readingTime: "5",
      keyTakeaways: [
        "El ritmo circadiano regula cuándo sientes sueño y alerta.",
        "La luz matinal fortalece y estabiliza el reloj interno.",
        "La luz nocturna puede retrasar la conciliación del sueño.",
        "La cafeína puede afectar el sueño durante muchas horas.",
      ],
      sections: [
        {
          heading: "¿Qué es el ritmo circadiano?",
          paras: [
            "Es un ciclo interno de unas 24 horas que regula sueño, alerta, hormonas, temperatura corporal y más.",
            "Funciona estés o no atento — pero las señales externas, especialmente la luz, lo mantienen alineado con el mundo.",
          ],
        },
        {
          heading: "Luz matinal y horario de sueño",
          paras: [
            "La luz brillante en la primera hora o dos tras despertar envía una señal clara de 'día' al cerebro. Esto ancla tu reloj y facilita dormirse esa noche.",
            "La luz exterior, incluso en día nublado, es muchísimo más intensa que la luz interior — un paseo corto es una de las mejoras de sueño más simples.",
          ],
        },
        {
          heading: "Exposición a luz nocturna",
          paras: [
            "La luz brillante al final del día — incluidas pantallas — puede suprimir la melatonina y atrasar tu reloj.",
            "Atenúa las luces los últimos 60–90 minutos antes de dormir para que el sistema nervioso reciba el mensaje de que la noche empezó.",
          ],
        },
        {
          heading: "Cómo afecta la cafeína",
          paras: [
            "La cafeína bloquea la adenosina, molécula que acumula 'presión de sueño' durante el día. Tiene vida media de unas 5 horas — un café de las 14 sigue activo a la hora de dormir.",
            "Aun durmiéndote, la cafeína vespertina reduce el sueño profundo, dejándote menos descansado sin saber por qué.",
          ],
        },
        {
          heading: "Construir mejores hábitos de horarios",
          paras: [
            "Objetivo: hora fija de despertar, luz matinal diaria y corte de cafeína a primera hora de la tarde. Tres pequeños cambios que pueden transformar la semana.",
            "La constancia importa más que la perfección. Pequeños ajustes sostenibles superan a los cambios drásticos.",
          ],
        },
      ],
      scienceNote:
        "La luz es una de las señales más potentes que moldean el reloj circadiano — sobre todo luz brillante de mañana y luz tenue de noche.",
      practicalTip:
        "Recibe luz exterior en la primera hora tras despertar — incluso un paseo de 5–10 minutos cuenta. Prueba dos semanas sin cafeína después de las 14 y observa tus noches.",
      cta: { label: "Usa la calculadora de hora de dormir", to: "/bedtime-calculator" },
      relatedGuide: { slug: "how-to-fall-asleep-fast" },
      relatedTool: {
        to: "/bedtime-calculator",
        label: "Calculadora de hora de dormir",
        desc: "Encuentra la mejor hora para acostarte.",
      },
      faqs: [
        {
          q: "¿Cuánto dura la cafeína en el organismo?",
          a: "Vida media de unas 5 horas: la mitad de un café de las 14 sigue activa a las 19 y un cuarto a medianoche.",
        },
        {
          q: "¿De verdad importa la luz matinal?",
          a: "Sí — es una de las señales más fuertes para anclar el ritmo circadiano. Incluso 5–10 minutos al aire libre ayudan.",
        },
        {
          q: "¿Valen las gafas anti-luz azul?",
          a: "Bajar la intensidad general de luz por la noche suele importar más que filtrar específicamente el azul.",
        },
        {
          q: "¿El descafeinado no tiene cafeína?",
          a: "No del todo — suele contener 2–15 mg por taza.",
        },
        {
          q: "¿Y si trabajo de noche?",
          a: "Apunta a luz brillante en tu 'día' y oscuridad en tu 'noche'. Los turnos rotativos alteran el ritmo y requieren un plan a medida.",
        },
        {
          q: "¿El alcohol afecta el reloj?",
          a: "El alcohol fragmenta el sueño aun cuando te ayude a dormir más rápido.",
        },
        {
          q: "¿Qué tan rápido puedo reajustar mi ritmo?",
          a: "La mayoría de adultos se desplaza alrededor de 1 hora por día con señales constantes.",
        },
      ],
      nextLesson: "stimulus-control",
    },
    "stimulus-control": {
      meta: {
        title: "Control de estímulos en palabras sencillas | Somna",
        desc: "Aprende una de las estrategias más eficaces de TCC-I para reconstruir la conexión saludable entre cama y sueño.",
      },
      eyebrow: "MICROLECCIÓN",
      title: "Control de estímulos en palabras sencillas",
      subtitle:
        "El control de estímulos reentrena la simple asociación aprendida entre cama y sueño — y es una de las herramientas más poderosas de la TCC-I.",
      readingTime: "5",
      keyTakeaways: [
        "La cama debería asociarse con el sueño, no con la vigilia.",
        "Quedarte despierto en la cama refuerza el insomnio.",
        "La constancia importa más que la perfección.",
        "Mejorar lleva práctica; las primeras noches son las más duras.",
      ],
      sections: [
        {
          heading: "¿Qué es el control de estímulos?",
          paras: [
            "Es la práctica de usar la cama y el dormitorio solo para dormir e intimidad.",
            "El objetivo es simple: cuando tu cuerpo cruza el umbral del dormitorio, sabe qué va a pasar.",
          ],
        },
        {
          heading: "Cómo cambia el insomnio la asociación con la cama",
          paras: [
            "Tras noches dando vueltas, la cama queda emparejada con frustración, alerta o ansiedad.",
            "Es condicionamiento — el mismo aprendizaje que te hace salivar al oír un sonido familiar de comida. El cerebro no debate, reacciona.",
          ],
        },
        {
          heading: "La regla de los 20 minutos",
          paras: [
            "Si no te dormiste tras unos 20 minutos (no mires el reloj — estima), levántate. Ve a otro lugar con luz tenue y haz algo calmado: unas páginas de un libro suave, un estiramiento lento, una respiración sentada.",
            "Vuelve a la cama solo cuando sientas sueño — párpados pesados, cabeza que cae. Repite si hace falta. Suena contraintuitivo, pero es el corazón del control de estímulos.",
          ],
        },
        {
          heading: "Errores comunes",
          paras: [
            "Usar el móvil en la cama, trabajar en la cama, ver tele en la cama o 'esforzarse más' refuerzan la asociación equivocada.",
            "La aplicación inconsistente también frena resultados. Funciona mejor aplicada cada noche durante varias semanas.",
          ],
        },
        {
          heading: "Resultados que puedes esperar",
          paras: [
            "Las primeras 3–5 noches son duras — puedes dormir menos al principio porque pasas menos tiempo despierto en la cama.",
            "En la semana 2 el sueño suele consolidarse: te duermes antes, despiertas menos y la cama vuelve a ser señal de sueño.",
          ],
        },
      ],
      scienceNote:
        "El control de estímulos es de las técnicas de TCC-I más estudiadas y se recomienda como tratamiento basado en evidencia por sí mismo para el insomnio crónico.",
      practicalTip:
        "Esta noche, saca pantallas, materiales de trabajo y portátil del dormitorio. Incluso un cambio físico pequeño reescribe la señal.",
      cta: { label: "Lee la guía completa de TCC-I", to: "/cbt-i-guide" },
      relatedGuide: { slug: "cbt-i-guide" },
      relatedTool: {
        to: "/calculator",
        label: "Calculadora de ciclos",
        desc: "Ajusta la hora de dormir a los ciclos naturales.",
      },
      faqs: [
        {
          q: "¿Qué es el control de estímulos en TCC-I?",
          a: "Es usar la cama solo para dormir, dejarla si no estás durmiendo y mantener una hora fija de despertar — para que la cama vuelva a ser señal de sueño.",
        },
        {
          q: "¿Cuánto tarda en funcionar?",
          a: "Muchas personas notan mejora en 1–3 semanas de práctica constante.",
        },
        {
          q: "¿La regla de los 20 minutos es estricta?",
          a: "Es una guía. No mires el reloj — estima. Si estás claramente despierto y frustrado, sal de la cama.",
        },
        {
          q: "¿Qué hago cuando salgo de la cama?",
          a: "Algo calmado y con luz tenue: leer un libro suave, estiramientos lentos, sentarte en silencio. Evita pantallas, trabajo y estímulos.",
        },
        {
          q: "¿Sirve para los despertares de madrugada?",
          a: "Sí — aplica la misma regla. Si te despiertas y no vuelves a dormir, sal de la cama y regresa solo con sueño.",
        },
        {
          q: "¿Y si salir me despierta más?",
          a: "Mantén luces tenues, actividad suave y cuerpo relajado. La meta no es estar plenamente despierto, sino dejar que el sueño regrese.",
        },
        {
          q: "¿Puedo hacer control de estímulos solo?",
          a: "Puede ser eficaz por sí solo, pero combinado con restricción del sueño y horarios fijos produce los mejores resultados.",
        },
      ],
      nextLesson: "what-is-cbti",
    },
  },
};

const dicts: Partial<Record<Lang, LearnDict>> = { en, zh, es, pt: ptLearnDict };

export function getLearnDict(lang: Lang): LearnDict {
  return dicts[lang] ?? en;
}
