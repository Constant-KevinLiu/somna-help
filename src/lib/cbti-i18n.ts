import type { Lang } from "./i18n";
import type { FAQ } from "./calc-i18n";
import { ptCbtiDict } from "./cbti-pt-i18n";

export type CbtiSlug =
  | "cbt-i-guide"
  | "sleep-anxiety"
  | "how-to-fall-asleep-fast"
  | "wake-up-at-3am"
  | "insomnia-treatment";

export type CbtiSection = { heading: string; paras?: string[]; bullets?: string[] };
export type CbtiStrategyItem = { title: string; desc: string };

export type FlowNode = { q?: string; yes?: string; no?: string; action?: string };
export type ArticleFlow = { heading: string; yes: string; no: string; nodes: FlowNode[] };

export type CbtiArticle = {
  meta: { title: string; desc: string };
  eyebrow: string;
  title: string;
  intro: string;
  readTime: string;
  takeaways: string[];
  sections: CbtiSection[];
  strategyIntro?: string;
  strategyItems: CbtiStrategyItem[];
  flow?: ArticleFlow;
  faqs: FAQ[];
  cta: { label: string; to: string };
};

export type CbtiDict = {
  ui: {
    guides: string;
    section: string;
    readTime: string;
    badge: string;
    takeawaysTitle: string;
    strategyTitle: string;
    relatedArticlesTitle: string;
    faqTitle: string;
    sleepDiary: string;
    sleepDiaryDesc: string;
  };
  summaries: Record<CbtiSlug, string>;
  titles: Record<CbtiSlug, string>;
  articles: Record<CbtiSlug, CbtiArticle>;
};

const enTitles: Record<CbtiSlug, string> = {
  "cbt-i-guide": "CBT-I Guide",
  "sleep-anxiety": "Sleep Anxiety",
  "how-to-fall-asleep-fast": "How to Fall Asleep Fast",
  "wake-up-at-3am": "Waking Up at 3 AM",
  "insomnia-treatment": "Insomnia Treatment",
};

const enSummaries: Record<CbtiSlug, string> = {
  "cbt-i-guide": "A complete introduction to Cognitive Behavioral Therapy for Insomnia.",
  "sleep-anxiety": "Why worrying about sleep makes sleep worse — and how to break the cycle.",
  "how-to-fall-asleep-fast": "Evidence-based techniques to fall asleep faster, drug-free.",
  "wake-up-at-3am": "Causes of middle-of-the-night awakenings and what to do about them.",
  "insomnia-treatment": "CBT-I vs medication — what the research really says.",
};

const en: CbtiDict = {
  ui: {
    guides: "Guides",
    section: "CBT-I Library",
    readTime: "min read",
    badge: "Science-backed",
    takeawaysTitle: "Key Takeaways",
    strategyTitle: "What CBT-I Recommends",
    relatedArticlesTitle: "Related Articles",
    faqTitle: "Frequently asked questions",
    sleepDiary: "Sleep Diary",
    sleepDiaryDesc: "Track your nights without judgment.",
  },
  titles: enTitles,
  summaries: enSummaries,
  articles: {
    "cbt-i-guide": {
      meta: {
        title: "CBT-I Guide: A Science-Based Approach to Better Sleep | Somna",
        desc: "Learn how Cognitive Behavioral Therapy for Insomnia (CBT-I) works and why it is considered the first-line treatment for chronic insomnia.",
      },
      eyebrow: "CBT-I LIBRARY",
      title: "CBT-I Guide: A Science-Based Approach to Better Sleep",
      intro:
        "Cognitive Behavioral Therapy for Insomnia (CBT-I) is the gold-standard, non-drug treatment for chronic insomnia. This guide explains how it works, what to expect, and how to begin.",
      readTime: "8",
      takeaways: [
        "CBT-I is recommended as the first-line treatment for chronic insomnia by major medical organizations.",
        "It works by retraining the brain's relationship with sleep — not by sedating you.",
        "Most people see meaningful improvement within 4–8 weeks.",
        "It has no side effects and the benefits persist long after the program ends.",
      ],
      sections: [
        {
          heading: "What is CBT-I?",
          paras: [
            "CBT-I is a structured, time-limited program that targets the thoughts and behaviors that keep insomnia going. Unlike sleeping pills, it addresses the underlying causes rather than masking symptoms.",
            "A typical course runs 4–8 weeks, with weekly steps that gently rebuild your natural sleep drive and confidence in sleep.",
          ],
        },
        {
          heading: "Why CBT-I works",
          paras: [
            "Chronic insomnia is usually maintained by a self-reinforcing loop: poor nights create anxiety about sleep, which increases arousal, which makes the next night worse. CBT-I interrupts that loop from multiple angles at once.",
          ],
        },
        {
          heading: "The five core components",
          bullets: [
            "Sleep Restriction — temporarily compressing time in bed to rebuild sleep pressure.",
            "Stimulus Control — re-associating bed with sleep, not wakefulness.",
            "Cognitive Restructuring — softening anxious thoughts about sleep.",
            "Sleep Hygiene — small environmental and lifestyle adjustments.",
            "Relaxation Training — calming the body's stress response at night.",
          ],
        },
        {
          heading: "What results can you expect?",
          paras: [
            "Research shows 70–80% of people with chronic insomnia respond to CBT-I. Most see shorter time to fall asleep, fewer awakenings, and better daytime energy.",
          ],
        },
        {
          heading: "How long does CBT-I take?",
          paras: [
            "Most programs run 4–8 weeks. Some improvements appear within the first 1–2 weeks, but the deepest gains come from consistency.",
          ],
        },
        {
          heading: "Is CBT-I better than sleeping pills?",
          paras: [
            "Both can help short-term, but only CBT-I shows durable benefit after treatment ends. Major sleep guidelines (AASM, ACP) recommend CBT-I as first-line care.",
          ],
        },
      ],
      strategyIntro: "If you only remember a few things from CBT-I, let these be it.",
      strategyItems: [
        {
          title: "Keep a consistent wake time",
          desc: "Every day, even weekends. This is the single strongest lever for your circadian rhythm.",
        },
        {
          title: "Get out of bed if you can't sleep",
          desc: "After ~20 minutes awake, leave the bedroom and do something calm in dim light. Return only when sleepy.",
        },
        {
          title: "Limit time in bed to actual sleep",
          desc: "Spending hours in bed hoping for sleep weakens the bed–sleep association.",
        },
        {
          title: "Treat thoughts as thoughts",
          desc: "You don't have to argue with anxious thoughts about sleep. Acknowledge, then let them pass.",
        },
      ],
      cta: { label: "Start Tracking Your Sleep", to: "/diary" },
      faqs: [
        {
          q: "Is CBT-I right for me?",
          a: "CBT-I helps most adults with chronic insomnia (difficulty sleeping 3+ nights a week for 3+ months). If you have untreated sleep apnea, restless legs, or a mood disorder, talk to a clinician first.",
        },
        {
          q: "Do I need a therapist?",
          a: "Working with a CBT-I trained clinician produces the strongest results, but self-guided digital CBT-I programs are also evidence-based and effective.",
        },
        {
          q: "Will I have to give up naps?",
          a: "Often yes, at least during the active phase. Naps reduce sleep pressure, which is the fuel CBT-I uses.",
        },
        {
          q: "How is CBT-I different from sleep hygiene?",
          a: "Sleep hygiene is one small piece of CBT-I. On its own, it rarely fixes chronic insomnia — the behavioral and cognitive components do most of the heavy lifting.",
        },
        {
          q: "Will CBT-I make my insomnia worse at first?",
          a: "Sleep restriction can feel tougher in week 1–2 because it builds sleep pressure on purpose. This is temporary, by design, and usually improves quickly.",
        },
        {
          q: "Does CBT-I work for older adults?",
          a: "Yes. Studies show strong results in older adults, often better than medication and with no side effects.",
        },
        {
          q: "Can I do CBT-I while taking sleep medication?",
          a: "Often yes, with clinician guidance. Many people taper medication during or after CBT-I.",
        },
        {
          q: "How long do the benefits last?",
          a: "Follow-up studies show benefits maintained 1–3 years after a CBT-I program, which is unusual for any insomnia treatment.",
        },
      ],
    },
    "sleep-anxiety": {
      meta: {
        title: "Sleep Anxiety: Why Worrying About Sleep Makes Sleep Worse | Somna",
        desc: "Learn how sleep anxiety develops and discover CBT-I techniques to break the cycle of worry and insomnia.",
      },
      eyebrow: "CBT-I LIBRARY",
      title: "Sleep Anxiety: Why Worrying About Sleep Makes Sleep Worse",
      intro:
        "Worrying about sleep is one of the most common drivers of insomnia. Understanding the cycle is the first step to softening it.",
      readTime: "7",
      takeaways: [
        "Sleep anxiety is a learned response — your brain is trying to protect you.",
        "The harder you try to sleep, the more your nervous system stays on alert.",
        "Acceptance, not control, is what CBT-I uses to break the loop.",
        "Small daytime shifts can change how the next night feels.",
      ],
      sections: [
        {
          heading: "What is sleep anxiety?",
          paras: [
            "Sleep anxiety is the worry, dread, or hyperarousal that builds around bedtime and during the night. It's not a personal flaw — it's a conditioned response from a brain that has linked the bed with stress.",
          ],
        },
        {
          heading: "The sleep-anxiety cycle",
          paras: [
            "A few bad nights trigger worry about future bad nights. Worry raises cortisol and heart rate. That arousal makes the next night harder, which confirms the worry. Round and round.",
          ],
        },
        {
          heading: "Common anxious thoughts",
          bullets: [
            '"What if I don\'t sleep tonight?"',
            "\"I'll be exhausted tomorrow and won't be able to function.\"",
            '"Everyone else falls asleep — what\'s wrong with me?"',
            '"I have to fall asleep right now or the night is ruined."',
          ],
        },
        {
          heading: "Why the brain becomes hyper-alert",
          paras: [
            "Your brain learns. After enough nights where the bed equals struggle, the simple act of getting into bed can trigger an alarm response — fast heart, racing thoughts, hot skin. This is conditioning, not weakness.",
          ],
        },
        {
          heading: "CBT-I strategies for sleep anxiety",
          bullets: [
            "Stimulus control — leave the bed when wakefulness drags on.",
            "Cognitive defusion — let thoughts pass without engaging.",
            "Paradoxical intention — gently try to stay calmly awake, removing the pressure to sleep.",
            "Daytime worry windows — process tomorrow's concerns earlier, not at midnight.",
          ],
        },
        {
          heading: "Acceptance versus control",
          paras: [
            "Sleep can't be forced. The more you push, the more your system pushes back. CBT-I asks something counterintuitive: let go of the fight. The body sleeps when it feels safe.",
          ],
        },
      ],
      strategyIntro: "When sleep anxiety spikes, lean on these.",
      strategyItems: [
        {
          title: "Drop the goal of sleep",
          desc: "Aim to rest, not to sleep. Sleep arrives as a byproduct of feeling safe and unbothered.",
        },
        {
          title: "Get out of bed if you're spinning",
          desc: "Leave for a low-light, low-stimulation activity. Return when truly sleepy.",
        },
        {
          title: "Schedule worry earlier",
          desc: "Spend 10 minutes in the early evening writing concerns down. Close the notebook.",
        },
        {
          title: "Slow your exhale",
          desc: "A long, soft exhale lowers heart rate and signals safety to the nervous system.",
        },
      ],
      cta: { label: "Read the CBT-I Guide", to: "/cbt-i-guide" },
      faqs: [
        {
          q: "Why does sleep anxiety usually start?",
          a: "A stressful life event, illness, or a stretch of poor sleep often plants the first seeds. The brain then learns to associate bed with struggle.",
        },
        {
          q: "Is sleep anxiety the same as insomnia?",
          a: "They overlap heavily. Sleep anxiety is one of the most common drivers and maintainers of chronic insomnia.",
        },
        {
          q: "Can I just take something to relax?",
          a: "Sedatives may help short-term but tend not to address the underlying conditioning. CBT-I retrains the response itself.",
        },
        {
          q: "Why do I feel anxious only at bedtime?",
          a: "Because that's the cue your brain has learned. Outside the bedroom, the alarm response doesn't fire.",
        },
        {
          q: "Will checking the clock help?",
          a: "No. Clock-watching reliably increases anxiety. Turn the clock away or out of sight.",
        },
        {
          q: "How long does it take to feel calmer at bedtime?",
          a: "Most people notice some softening within 2–4 weeks of consistent CBT-I practice.",
        },
        {
          q: "Does breathing actually help?",
          a: "Yes — slow, extended exhales (e.g. 4-7-8 or box breathing) reliably lower physiological arousal.",
        },
        {
          q: "When should I see a clinician?",
          a: "If sleep anxiety is paired with daytime panic, persistent low mood, or significant daily impairment, please reach out for support.",
        },
      ],
    },
    "how-to-fall-asleep-fast": {
      meta: {
        title: "How to Fall Asleep Fast: Evidence-Based Sleep Strategies | Somna",
        desc: "Discover science-backed techniques that help you fall asleep faster without relying on sleeping pills.",
      },
      eyebrow: "CBT-I LIBRARY",
      title: "How to Fall Asleep Fast: Evidence-Based Sleep Strategies",
      intro:
        "Falling asleep can't be forced — but you can create the conditions where sleep arrives more easily. Here's what the research actually supports.",
      readTime: "6",
      takeaways: [
        "Most adults take 10–20 minutes to fall asleep — that's normal, not slow.",
        "Trying harder to sleep almost always backfires.",
        "Light, temperature, and timing matter more than any single technique.",
        "If you're awake after ~20 minutes, get out of bed.",
      ],
      sections: [
        {
          heading: "Why falling asleep can be difficult",
          paras: [
            "Sleep onset depends on two systems: sleep pressure (built up by hours awake) and circadian timing (your body clock). When either is off, falling asleep takes longer.",
            "Stress, screens, late caffeine, and irregular schedules all delay onset.",
          ],
        },
        {
          heading: "Common mistakes",
          bullets: [
            "Going to bed before you're actually sleepy.",
            "Using your phone in bed.",
            "Watching the clock when you can't sleep.",
            "Trying to force sleep with sheer effort.",
            "Drinking alcohol to relax — it fragments sleep later in the night.",
          ],
        },
        {
          heading: "CBT-I recommendations",
          bullets: [
            "Only go to bed when sleepy, not just tired.",
            "Keep a steady wake time, even after rough nights.",
            "Dim lights 60–90 minutes before bed.",
            "Keep the bedroom cool (~18°C / 65°F).",
          ],
        },
        {
          heading: "Relaxation methods that actually help",
          bullets: [
            "Progressive muscle relaxation — tense and release muscle groups, head to toe.",
            "Body scan meditation — moving attention slowly through the body.",
            "Cognitive shuffle — picturing random unrelated images to disengage thinking.",
          ],
        },
        {
          heading: "Breathing exercises",
          paras: [
            "Slow nasal breathing with a long exhale is the most evidence-supported technique. Try 4-7-8 (inhale 4, hold 7, exhale 8) for 4 cycles, or simple 4-6 breathing.",
          ],
        },
        {
          heading: "What to do if you can't sleep",
          paras: [
            "If 20 minutes pass and you're wide awake, get up. Sit somewhere quiet in low light. Read something gentle. Return when sleepy. This rebuilds the bed–sleep link.",
          ],
        },
      ],
      strategyIntro: "Tonight, try these — in order.",
      strategyItems: [
        {
          title: "Dim everything 60 min before bed",
          desc: "Light suppresses melatonin. Lower lights are the easiest melatonin booster you have.",
        },
        {
          title: "Move screens out of the bedroom",
          desc: "Or at minimum, no scrolling once you're in bed.",
        },
        {
          title: "Wait for sleepiness",
          desc: "Tired isn't the same as sleepy. Sleepy = heavy eyes, head nodding. Go to bed then.",
        },
        {
          title: "If awake 20 min, leave the bed",
          desc: "Quiet, dim activity until sleepy. This is the most powerful CBT-I tool for sleep onset.",
        },
      ],
      cta: { label: "Use the Bedtime Calculator", to: "/bedtime-calculator" },
      faqs: [
        {
          q: "How long should it take to fall asleep?",
          a: "Around 10–20 minutes is healthy. Less than 5 minutes can suggest sleep deprivation; more than 30 minutes regularly suggests insomnia.",
        },
        {
          q: "Does counting sheep work?",
          a: "Mildly. The cognitive shuffle — random unrelated images — works better for most people.",
        },
        {
          q: "Are sleep apps and white noise effective?",
          a: "Steady ambient sound helps some people by masking sudden noises. Effectiveness varies.",
        },
        {
          q: "Should I read in bed?",
          a: "If reading reliably makes you sleepy, yes. If you stay alert, do it elsewhere and return to bed when sleepy.",
        },
        {
          q: "Does melatonin help me fall asleep faster?",
          a: "It can shift timing, especially for jet lag or delayed sleep phase. It's not a sedative.",
        },
        {
          q: "What about exercise?",
          a: "Regular exercise improves sleep onset. Avoid intense workouts within 2 hours of bedtime.",
        },
        {
          q: "What's the best room temperature?",
          a: "Cool — around 16–19°C (60–67°F) for most adults.",
        },
        {
          q: "Is it okay to fall asleep with the TV on?",
          a: "Generally not — light and changing audio fragment sleep, even if you don't notice.",
        },
      ],
    },
    "wake-up-at-3am": {
      meta: {
        title: "Why Do I Wake Up at 3 AM Every Night? | Somna",
        desc: "Understand the common causes of waking up at 3 AM and what CBT-I recommends to improve sleep continuity.",
      },
      eyebrow: "CBT-I LIBRARY",
      title: "Why Do I Wake Up at 3 AM Every Night?",
      intro:
        "Waking in the middle of the night is one of the most common — and most frustrating — patterns in insomnia. Here's why it happens and what helps.",
      readTime: "6",
      takeaways: [
        "Brief awakenings between sleep cycles are completely normal.",
        "The problem is rarely waking up — it's struggling to fall back asleep.",
        "Stress and hyperarousal often peak in the second half of the night.",
        "What you do in those 20 minutes matters more than why you woke.",
      ],
      sections: [
        {
          heading: "Is waking up at 3 AM normal?",
          paras: [
            "Yes. Healthy sleepers wake briefly between sleep cycles many times a night and fall right back asleep. The issue isn't the awakening — it's getting stuck.",
          ],
        },
        {
          heading: "Stress and hyperarousal",
          paras: [
            "Cortisol naturally starts climbing in the second half of the night to prepare you for waking. When stress is high, that climb starts earlier and harder — pulling you out of sleep around 2–4 AM.",
          ],
        },
        {
          heading: "Sleep cycles and awakenings",
          paras: [
            "By 3 AM, most adults have completed several sleep cycles and are spending more time in lighter REM sleep, which is easier to wake from. A small noise or temperature shift can cross the threshold.",
          ],
        },
        {
          heading: "Other common causes",
          bullets: [
            "Alcohol — relaxing initially, but it fragments sleep 4–6 hours later.",
            "Late meals or low blood sugar.",
            "Bedroom too warm.",
            "Untreated sleep apnea or restless legs.",
            "Bladder filling (especially with evening fluids).",
          ],
        },
        {
          heading: "What NOT to do",
          bullets: [
            "Check the clock.",
            "Reach for your phone.",
            "Lie in bed forcing sleep for 30+ minutes.",
            "Start mentally planning the next day.",
          ],
        },
        {
          heading: "CBT-I recommendations",
          paras: [
            "After ~20 minutes awake, leave the bed. Sit somewhere quiet in dim light. Do something gently absorbing. Return only when sleepy. Over weeks, the awakenings shorten and often disappear.",
          ],
        },
        {
          heading: "When to seek medical help",
          paras: [
            "If awakenings come with gasping, choking, loud snoring, leg twitching, or daytime exhaustion despite enough hours in bed, talk to a clinician — these can signal sleep apnea or another treatable disorder.",
          ],
        },
      ],
      strategyIntro: "Next time you wake at 3 AM, try this sequence.",
      strategyItems: [
        {
          title: "Don't check the time",
          desc: "Knowing it's 3 AM activates the worry loop instantly.",
        },
        {
          title: "Stay still and breathe slowly",
          desc: "Long exhales. No effort to fall asleep — just rest.",
        },
        {
          title: "After ~20 min, get up",
          desc: "Dim light, quiet activity. Return when sleepy, not before.",
        },
        {
          title: "Wake at your normal time",
          desc: "Don't sleep in. Protecting wake time protects tomorrow night's sleep pressure.",
        },
      ],
      flow: {
        heading: "Nighttime Awakening Flowchart",
        yes: "Yes",
        no: "No",
        nodes: [
          { q: "Did you wake up?", yes: "Stay still, breathe slowly.", no: "Keep resting." },
          {
            q: "Still awake after ~20 minutes?",
            yes: "Leave the bed. Dim light. Calm activity.",
            no: "Drift back to sleep.",
          },
          { q: "Feeling sleepy again?", yes: "Return to bed.", no: "Stay up until sleepy." },
          { action: "Wake at your usual time — don't sleep in." },
        ],
      },
      cta: { label: "Track Your Sleep Patterns", to: "/diary" },
      faqs: [
        {
          q: "Why specifically 3 AM?",
          a: "Cortisol naturally rises in the second half of the night, and sleep is lighter by then. 2–4 AM is the most common awakening window.",
        },
        {
          q: "Does it mean something is medically wrong?",
          a: "Usually no. But persistent middle-of-the-night awakenings with daytime symptoms deserve a clinical check.",
        },
        {
          q: "Why can't I fall back asleep?",
          a: "Often because the mind activates the moment it notices being awake — and worry blocks the return to sleep.",
        },
        {
          q: "Should I eat something?",
          a: "Only if hunger is clearly the trigger. Otherwise, eating reinforces middle-of-the-night wakefulness.",
        },
        {
          q: "Is alcohol making it worse?",
          a: "Very likely. Alcohol fragments sleep especially in the second half of the night.",
        },
        {
          q: "Does this mean I have insomnia?",
          a: "Frequent middle-of-the-night awakenings with difficulty returning to sleep, 3+ nights a week for 3+ months, meets the definition of insomnia.",
        },
        {
          q: "Can melatonin help with 3 AM waking?",
          a: "Not typically — melatonin affects sleep timing, not sleep maintenance.",
        },
        {
          q: "Will CBT-I help?",
          a: "Yes — CBT-I is highly effective for both sleep onset and middle-of-the-night awakenings.",
        },
      ],
    },
    "insomnia-treatment": {
      meta: {
        title: "Insomnia Treatment: CBT-I vs Medication | Somna",
        desc: "Compare CBT-I and sleeping medications and learn which treatment options are supported by research.",
      },
      eyebrow: "CBT-I LIBRARY",
      title: "Insomnia Treatment: CBT-I vs Medication",
      intro:
        "Pills work fast. CBT-I works deeper. Here's an honest, evidence-based comparison so you can choose well.",
      readTime: "7",
      takeaways: [
        "CBT-I is recommended as first-line treatment by major sleep guidelines.",
        "Medication can help short-term but rarely solves chronic insomnia.",
        "CBT-I has lasting benefits and no side effects.",
        "The two can be combined under clinical guidance.",
      ],
      sections: [
        {
          heading: "What is insomnia?",
          paras: [
            "Insomnia is difficulty falling asleep, staying asleep, or waking too early — at least 3 nights a week, for 3+ months, with daytime impact. It's a clinical condition, not a personality trait.",
          ],
        },
        {
          heading: "Treatment option 1 — CBT-I",
          paras: [
            "A structured, evidence-based program that targets the thoughts and behaviors maintaining insomnia. 4–8 weeks. No medication. Effects persist long after the program ends.",
          ],
        },
        {
          heading: "Treatment option 2 — Sleep medication",
          paras: [
            "Includes prescription hypnotics (z-drugs, benzodiazepines), sedating antidepressants, and over-the-counter aids. They can reduce time to fall asleep but often lose effectiveness, may cause dependence, and don't address root causes.",
          ],
        },
        {
          heading: "Pros and cons",
          bullets: [
            "CBT-I — durable, no side effects, requires effort and patience.",
            "Medication — fast relief, side effects possible, often rebound insomnia when stopped.",
          ],
        },
        {
          heading: "Which approach works long term?",
          paras: [
            "Research is clear: CBT-I outperforms medication at 6–12 month follow-up. Medication's benefit fades when stopped; CBT-I's benefit usually holds.",
          ],
        },
        {
          heading: "Can they be combined?",
          paras: [
            "Yes. Many clinicians use short-term medication alongside CBT-I, then taper. Always coordinate with your prescriber.",
          ],
        },
      ],
      strategyIntro: "If you're choosing where to start, consider this.",
      strategyItems: [
        {
          title: "Try CBT-I first when possible",
          desc: "Recommended by AASM and ACP as first-line care for chronic insomnia.",
        },
        {
          title: "Use medication as a bridge, not a destination",
          desc: "Short-term, lowest effective dose, with a taper plan.",
        },
        {
          title: "Address daytime habits",
          desc: "Caffeine timing, alcohol, light exposure, and exercise all shape your nights.",
        },
        {
          title: "Track your sleep",
          desc: "A simple sleep diary reveals patterns no app can guess.",
        },
      ],
      cta: { label: "Explore the CBT-I Guide", to: "/cbt-i-guide" },
      faqs: [
        {
          q: "Is CBT-I really better than sleeping pills?",
          a: "For chronic insomnia, yes — at long-term follow-up. For one-off acute insomnia, short-term medication may be appropriate.",
        },
        {
          q: "Are sleeping pills safe?",
          a: "When used short-term and as prescribed, often yes. Risks include dependence, next-day grogginess, falls (especially in older adults), and rebound insomnia.",
        },
        {
          q: "What about over-the-counter sleep aids?",
          a: "Most use sedating antihistamines. They can cause next-day grogginess and tolerance builds quickly. Not recommended long term.",
        },
        {
          q: "Is melatonin a sleeping pill?",
          a: "No — it adjusts circadian timing rather than sedating. Most useful for jet lag and delayed sleep phase.",
        },
        {
          q: "How much does CBT-I cost?",
          a: "It varies. In-person therapy is the most expensive, group programs are mid-range, and digital CBT-I (including self-guided) is often the most affordable.",
        },
        {
          q: "What if I've already been on medication for years?",
          a: "Many people successfully taper while doing CBT-I, with their prescriber's support. Don't stop suddenly.",
        },
        {
          q: "Does insurance cover CBT-I?",
          a: "In many regions, yes, especially when delivered by a licensed clinician. Coverage for digital programs varies.",
        },
        {
          q: "How do I know if my treatment is working?",
          a: "Better sleep onset, fewer awakenings, more consistent timing, and better daytime energy. A sleep diary helps you see progress objectively.",
        },
      ],
    },
  },
};

const zhTitles: Record<CbtiSlug, string> = {
  "cbt-i-guide": "CBT-I 指南",
  "sleep-anxiety": "睡眠焦虑",
  "how-to-fall-asleep-fast": "如何快速入睡",
  "wake-up-at-3am": "凌晨 3 点醒来",
  "insomnia-treatment": "失眠治疗",
};

const zhSummaries: Record<CbtiSlug, string> = {
  "cbt-i-guide": "失眠认知行为治疗(CBT-I)的完整入门指南。",
  "sleep-anxiety": "为什么担心睡不着反而让睡眠更糟 —— 以及如何打破这个循环。",
  "how-to-fall-asleep-fast": "不依赖药物、有科学依据的快速入睡方法。",
  "wake-up-at-3am": "深夜醒来的常见原因,以及该怎么办。",
  "insomnia-treatment": "CBT-I 与药物的对比 —— 研究真正告诉我们的事。",
};

const zh: CbtiDict = {
  ui: {
    guides: "指南",
    section: "CBT-I 知识库",
    readTime: "分钟阅读",
    badge: "科学支持",
    takeawaysTitle: "核心要点",
    strategyTitle: "CBT-I 的建议",
    relatedArticlesTitle: "相关文章",
    faqTitle: "常见问题",
    sleepDiary: "睡眠日记",
    sleepDiaryDesc: "温柔地记录每一晚,不带评判。",
  },
  titles: zhTitles,
  summaries: zhSummaries,
  articles: {
    "cbt-i-guide": {
      meta: {
        title: "CBT-I 指南:以科学为基础改善睡眠 | Somna",
        desc: "了解失眠认知行为治疗(CBT-I)的原理,以及为什么它被认为是慢性失眠的一线治疗方法。",
      },
      eyebrow: "CBT-I 知识库",
      title: "CBT-I 指南:以科学为基础改善睡眠",
      intro:
        "失眠认知行为治疗(CBT-I)是公认的、非药物的慢性失眠首选疗法。本指南将解释它的原理、预期效果以及如何开始。",
      readTime: "8",
      takeaways: [
        "CBT-I 被各大医学组织推荐为慢性失眠的一线治疗方法。",
        "它通过重塑大脑与睡眠的关系来发挥作用 —— 不是通过镇静。",
        "大多数人在 4–8 周内就能感受到明显改善。",
        "无副作用,而且效果会在课程结束后长期保持。",
      ],
      sections: [
        {
          heading: "什么是 CBT-I?",
          paras: [
            "CBT-I 是一种结构化、有时限的项目,针对维持失眠的思维和行为。与安眠药不同,它关注的是潜在原因,而不是掩盖症状。",
            "典型的课程持续 4–8 周,每周一个温柔的步骤,逐步重建你自然的睡眠驱动力和对睡眠的信任。",
          ],
        },
        {
          heading: "为什么 CBT-I 有效",
          paras: [
            "慢性失眠通常由一个自我强化的循环维持:糟糕的夜晚带来对睡眠的焦虑,焦虑提高警觉度,使下一晚更糟。CBT-I 从多个角度同时打断这个循环。",
          ],
        },
        {
          heading: "五个核心组成部分",
          bullets: [
            "睡眠限制 —— 暂时压缩在床上的时间,以重建睡眠压力。",
            "刺激控制 —— 让床重新与睡眠、而非清醒相关联。",
            "认知重构 —— 软化对睡眠的焦虑思维。",
            "睡眠卫生 —— 微小的环境和生活方式调整。",
            "放松训练 —— 在夜间平复身体的应激反应。",
          ],
        },
        {
          heading: "可以期待什么样的效果?",
          paras: [
            "研究显示,70–80% 的慢性失眠者对 CBT-I 有响应。大多数人入睡更快、夜间醒来更少、白天精力更好。",
          ],
        },
        {
          heading: "CBT-I 需要多长时间?",
          paras: ["大多数项目持续 4–8 周。1–2 周内可能出现一些改善,但最深层的进步来自持之以恒。"],
        },
        {
          heading: "CBT-I 比安眠药更好吗?",
          paras: [
            "两者短期都有效,但只有 CBT-I 在治疗结束后仍有持久效果。主要睡眠指南(AASM、ACP)推荐 CBT-I 作为一线治疗。",
          ],
        },
      ],
      strategyIntro: "如果只能记住几条 CBT-I 的建议,请记住这些。",
      strategyItems: [
        { title: "保持固定的起床时间", desc: "每天都一样,包括周末。这是调节昼夜节律最强的工具。" },
        {
          title: "睡不着就离开床",
          desc: "清醒约 20 分钟后,离开卧室,在昏暗灯光下做些平静的事。只在感到困倦时再回床。",
        },
        {
          title: "把在床上的时间控制在实际睡眠时间",
          desc: "在床上躺几小时盼着入睡,会削弱床与睡眠的联结。",
        },
        { title: "把想法当作想法", desc: "无需与焦虑的想法争论。承认它们的存在,然后让它们流过。" },
      ],
      cta: { label: "开始记录你的睡眠", to: "/diary" },
      faqs: [
        {
          q: "CBT-I 适合我吗?",
          a: "CBT-I 适用于大多数患有慢性失眠的成年人(每周 3 晚以上、持续 3 个月以上的入睡困难)。如有未治疗的睡眠呼吸暂停、不安腿综合征或情绪障碍,请先咨询医生。",
        },
        {
          q: "我需要治疗师吗?",
          a: "与受过 CBT-I 培训的临床医生合作效果最强,但自助式数字 CBT-I 项目同样有循证依据,也很有效。",
        },
        {
          q: "我需要戒掉午睡吗?",
          a: "通常需要,至少在主动阶段如此。午睡会削弱睡眠压力,而 CBT-I 正是依赖睡眠压力的。",
        },
        {
          q: "CBT-I 与睡眠卫生有什么不同?",
          a: "睡眠卫生只是 CBT-I 的一小部分。单靠睡眠卫生很少能解决慢性失眠 —— 行为和认知部分才是主力。",
        },
        {
          q: "CBT-I 会让失眠一开始变得更糟吗?",
          a: "睡眠限制在第 1–2 周可能更具挑战,因为它有意建立睡眠压力。这是暂时的、设计如此,通常很快会改善。",
        },
        {
          q: "CBT-I 对老年人有效吗?",
          a: "有效。研究显示在老年人群中效果显著,往往优于药物且无副作用。",
        },
        {
          q: "可以在服用睡眠药物时进行 CBT-I 吗?",
          a: "通常可以,需在临床指导下进行。许多人会在 CBT-I 期间或之后逐步减药。",
        },
        {
          q: "效果能持续多久?",
          a: "随访研究显示,CBT-I 项目结束后 1–3 年内效果仍能保持,这在失眠治疗中相当少见。",
        },
      ],
    },
    "sleep-anxiety": {
      meta: {
        title: "睡眠焦虑:为什么担心睡不着会让睡眠更糟 | Somna",
        desc: "了解睡眠焦虑的形成,并学习打破忧虑与失眠循环的 CBT-I 技巧。",
      },
      eyebrow: "CBT-I 知识库",
      title: "睡眠焦虑:为什么担心睡不着会让睡眠更糟",
      intro: "对睡眠的担忧是失眠最常见的驱动因素之一。理解这个循环,是软化它的第一步。",
      readTime: "7",
      takeaways: [
        "睡眠焦虑是一种习得反应 —— 你的大脑在试图保护你。",
        "越努力想入睡,神经系统就越保持警觉。",
        "CBT-I 用接纳而非控制来打破这个循环。",
        "白天的小调整可以改变下一晚的感受。",
      ],
      sections: [
        {
          heading: "什么是睡眠焦虑?",
          paras: [
            "睡眠焦虑是临近睡前和夜间不断积累的担忧、恐惧或过度警觉。这不是你的缺陷 —— 而是大脑把床与压力联系在一起后形成的条件反应。",
          ],
        },
        {
          heading: "睡眠–焦虑循环",
          paras: [
            "几个糟糕的夜晚引发对未来夜晚的担忧。担忧提升皮质醇和心率。这种警觉让下一晚更难,从而印证了担忧。如此循环。",
          ],
        },
        {
          heading: "常见的焦虑思维",
          bullets: [
            "「如果今晚又睡不着怎么办?」",
            "「我明天会累垮,什么都做不了。」",
            "「别人都能入睡,我到底怎么了?」",
            "「我必须现在就睡着,否则这一晚就毁了。」",
          ],
        },
        {
          heading: "为什么大脑会变得过度警觉",
          paras: [
            "你的大脑会学习。在足够多的夜晚里,床等于挣扎之后,仅仅是上床的动作就可能触发警报反应 —— 心跳加速、思绪奔涌、皮肤发烫。这是条件反应,不是软弱。",
          ],
        },
        {
          heading: "应对睡眠焦虑的 CBT-I 策略",
          bullets: [
            "刺激控制 —— 清醒时间过长就离开床。",
            "认知解离 —— 让想法流过,不与之纠缠。",
            "悖论意图 —— 温柔地试着「保持平静地清醒」,移除入睡的压力。",
            "白天忧虑时段 —— 把明天的担忧提前处理,而不是在半夜。",
          ],
        },
        {
          heading: "接纳与控制",
          paras: [
            "睡眠无法被强迫。你越用力,系统反弹得越厉害。CBT-I 提出一个反直觉的建议:放下这场较量。当身体感到安全,睡眠自然会来。",
          ],
        },
      ],
      strategyIntro: "当睡眠焦虑加剧时,可以依靠这些。",
      strategyItems: [
        {
          title: "放下「必须入睡」的目标",
          desc: "目标是休息,不是入睡。睡眠是安全感和放松的副产品。",
        },
        { title: "如果思绪打转就离开床", desc: "去做一些低光线、低刺激的事。真正困倦时再回来。" },
        { title: "把忧虑安排在更早的时段", desc: "傍晚花 10 分钟把担忧写下来,然后合上笔记本。" },
        { title: "放慢呼气", desc: "长而柔和的呼气可以降低心率,向神经系统发出安全的信号。" },
      ],
      cta: { label: "阅读 CBT-I 指南", to: "/cbt-i-guide" },
      faqs: [
        {
          q: "睡眠焦虑通常如何开始?",
          a: "一段压力事件、生病或一段时间的糟糕睡眠常常埋下种子。大脑随后学会把床与挣扎联系起来。",
        },
        {
          q: "睡眠焦虑和失眠是同一件事吗?",
          a: "二者高度重叠。睡眠焦虑是慢性失眠最常见的驱动和维持因素之一。",
        },
        {
          q: "我能吃点东西放松一下吗?",
          a: "镇静药物短期或许有用,但通常不解决潜在的条件反应。CBT-I 重塑反应本身。",
        },
        {
          q: "为什么我只在睡前感到焦虑?",
          a: "因为那是大脑学到的提示。在卧室之外,警报反应不会触发。",
        },
        { q: "看时间会有帮助吗?", a: "不会。看钟会可靠地增加焦虑。请把钟翻过去或移出视线。" },
        {
          q: "睡前感到更平静需要多久?",
          a: "大多数人在坚持练习 CBT-I 后的 2–4 周内会感到些许缓和。",
        },
        {
          q: "呼吸真的有用吗?",
          a: "有用 —— 缓慢、延长的呼气(如 4-7-8 或方块呼吸)可可靠地降低生理唤醒。",
        },
        {
          q: "什么时候该看医生?",
          a: "如果睡眠焦虑伴随白天惊恐、持续低落情绪或显著日常影响,请寻求专业帮助。",
        },
      ],
    },
    "how-to-fall-asleep-fast": {
      meta: {
        title: "如何快速入睡:有循证依据的睡眠策略 | Somna",
        desc: "了解有科学支持的入睡技巧,不依赖安眠药,也能更快入睡。",
      },
      eyebrow: "CBT-I 知识库",
      title: "如何快速入睡:有循证依据的睡眠策略",
      intro: "入睡无法被强迫 —— 但你可以创造让睡眠更容易到来的条件。以下是研究真正支持的方法。",
      readTime: "6",
      takeaways: [
        "大多数成年人需要 10–20 分钟入睡 —— 这是正常的,不是「慢」。",
        "越努力想入睡,几乎总是适得其反。",
        "光线、温度和时间比任何单一技巧都更重要。",
        "清醒超过约 20 分钟,就离开床。",
      ],
      sections: [
        {
          heading: "为什么入睡可能很难",
          paras: [
            "入睡依赖两个系统:睡眠压力(由清醒时长积累)和昼夜节律(你的生物钟)。任一系统出问题,入睡都会变慢。",
            "压力、屏幕、深夜咖啡因和不规律的作息都会延迟入睡。",
          ],
        },
        {
          heading: "常见错误",
          bullets: [
            "还没真正困倦就上床。",
            "在床上玩手机。",
            "睡不着时盯着时钟。",
            "用意志力强行入睡。",
            "用酒精放松 —— 后半夜会破坏睡眠。",
          ],
        },
        {
          heading: "CBT-I 的建议",
          bullets: [
            "只在感到困倦(不仅是疲倦)时上床。",
            "保持稳定的起床时间,即使昨晚很糟。",
            "睡前 60–90 分钟调暗灯光。",
            "保持卧室凉爽(约 18°C / 65°F)。",
          ],
        },
        {
          heading: "真正有效的放松方法",
          bullets: [
            "渐进性肌肉放松 —— 从头到脚依次紧绷和放松肌群。",
            "身体扫描冥想 —— 把注意力缓慢移过身体各部位。",
            "认知洗牌 —— 想象一系列无关的随机图像,以让思维脱钩。",
          ],
        },
        {
          heading: "呼吸练习",
          paras: [
            "缓慢的鼻呼吸配合长呼气是最有循证支持的方法。试试 4-7-8(吸气 4、屏息 7、呼气 8)四个循环,或简单的 4-6 呼吸。",
          ],
        },
        {
          heading: "如果睡不着怎么办",
          paras: [
            "如果过了 20 分钟仍然清醒,就起床。在昏暗光线下安静地坐着,看些温和的内容。感到困倦再回床。这能重建床与睡眠的联结。",
          ],
        },
      ],
      strategyIntro: "今晚试试这些 —— 按顺序来。",
      strategyItems: [
        {
          title: "睡前 60 分钟调暗一切",
          desc: "光线抑制褪黑素。降低光线是最简单的褪黑素「增强剂」。",
        },
        { title: "把屏幕移出卧室", desc: "最少:在床上不再刷手机。" },
        {
          title: "等待真正的困倦",
          desc: "疲倦不等于困倦。困倦 = 眼皮沉重、点头打盹。那时再上床。",
        },
        {
          title: "清醒 20 分钟就离开床",
          desc: "在昏暗、安静处活动直到困倦。这是 CBT-I 对入睡最有力的工具。",
        },
      ],
      cta: { label: "使用最佳入睡时间计算器", to: "/bedtime-calculator" },
      faqs: [
        {
          q: "入睡应该花多长时间?",
          a: "10–20 分钟是健康的。少于 5 分钟可能提示睡眠不足;经常超过 30 分钟提示失眠。",
        },
        { q: "数羊有用吗?", a: "效果一般。「认知洗牌」(随机无关图像)对大多数人更有效。" },
        {
          q: "睡眠应用和白噪音有效吗?",
          a: "稳定的环境音对一些人有用,可掩盖突发噪音。效果因人而异。",
        },
        {
          q: "可以在床上看书吗?",
          a: "如果看书可靠地让你困倦,可以。如果反而清醒,请到别处看,困倦时再回床。",
        },
        {
          q: "褪黑素能帮我更快入睡吗?",
          a: "它可以调整时间节律,尤其对时差或睡眠相位延迟有用。它不是镇静剂。",
        },
        { q: "运动呢?", a: "规律运动可改善入睡。睡前 2 小时内避免高强度训练。" },
        { q: "卧室温度多少合适?", a: "凉爽 —— 大多数成年人 16–19°C(60–67°F)。" },
        { q: "开着电视入睡可以吗?", a: "通常不建议 —— 光线和变化的声音会破坏睡眠,即使你没察觉。" },
      ],
    },
    "wake-up-at-3am": {
      meta: {
        title: "为什么我每晚都在凌晨 3 点醒来? | Somna",
        desc: "了解凌晨 3 点醒来的常见原因,以及 CBT-I 改善睡眠连续性的建议。",
      },
      eyebrow: "CBT-I 知识库",
      title: "为什么我每晚都在凌晨 3 点醒来?",
      intro: "半夜醒来是失眠中最常见、也最令人沮丧的模式之一。这里讲讲为什么会发生,以及该怎么办。",
      readTime: "6",
      takeaways: [
        "在睡眠周期之间短暂醒来是完全正常的。",
        "问题很少是「醒来」 —— 而是「难以再次入睡」。",
        "压力和过度警觉常在后半夜达到高峰。",
        "醒来后那 20 分钟你做了什么,比为什么醒来更重要。",
      ],
      sections: [
        {
          heading: "凌晨 3 点醒来正常吗?",
          paras: [
            "正常。健康的睡眠者一夜之间会在睡眠周期之间短暂醒来多次,然后立刻再入睡。问题不是醒来 —— 而是被卡住。",
          ],
        },
        {
          heading: "压力与过度警觉",
          paras: [
            "皮质醇本来会在后半夜自然上升,为清醒做准备。当压力很高时,这一上升会更早更剧烈 —— 把你在 2–4 点之间从睡眠中拉出。",
          ],
        },
        {
          heading: "睡眠周期与醒来",
          paras: [
            "到凌晨 3 点,大多数成年人已经完成几个睡眠周期,正在更多地经历较浅的 REM 睡眠,更容易被唤醒。一点声响或温度变化就可能跨过阈值。",
          ],
        },
        {
          heading: "其他常见原因",
          bullets: [
            "酒精 —— 起初放松,4–6 小时后会破坏睡眠。",
            "深夜进食或低血糖。",
            "卧室太热。",
            "未治疗的睡眠呼吸暂停或不安腿综合征。",
            "膀胱充盈(尤其晚上喝太多水)。",
          ],
        },
        {
          heading: "不要做的事",
          bullets: [
            "看时间。",
            "拿起手机。",
            "在床上躺 30 分钟以上强行入睡。",
            "开始在脑中规划明天。",
          ],
        },
        {
          heading: "CBT-I 的建议",
          paras: [
            "清醒约 20 分钟后,离开床。在昏暗光线下安静坐着,做些温和能吸引注意的事。困倦时再回来。坚持几周,醒来时间会变短,常常消失。",
          ],
        },
        {
          heading: "什么时候该就医",
          paras: [
            "如果醒来时伴随喘息、呛咳、响亮鼾声、腿部抽动,或在床上时间充足却仍白天疲惫,请咨询医生 —— 这些可能是睡眠呼吸暂停或其他可治疗疾病的信号。",
          ],
        },
      ],
      strategyIntro: "下次凌晨 3 点醒来,试试这个顺序。",
      strategyItems: [
        { title: "不要看时间", desc: "知道是 3 点会立刻激活担忧循环。" },
        { title: "保持安静、缓慢呼吸", desc: "拉长呼气。不要努力入睡 —— 只是休息。" },
        { title: "约 20 分钟后起床", desc: "昏暗光线、安静活动。困倦再回床,不要更早。" },
        { title: "按正常时间起床", desc: "不要赖床。保护起床时间就是保护明晚的睡眠压力。" },
      ],
      cta: { label: "记录你的睡眠模式", to: "/diary" },
      faqs: [
        {
          q: "为什么偏偏是 3 点?",
          a: "皮质醇在后半夜自然上升,而睡眠也在此时变浅。2–4 点是最常见的醒来时段。",
        },
        {
          q: "这意味着我身体有问题吗?",
          a: "通常没有。但若长期半夜醒来并伴随白天症状,值得做一次临床检查。",
        },
        {
          q: "为什么我再也睡不着?",
          a: "通常是因为大脑一注意到清醒就立刻活跃起来 —— 担忧又阻碍了重新入睡。",
        },
        { q: "需要吃点东西吗?", a: "只在饥饿显然是诱因时才吃。否则,进食会强化半夜清醒。" },
        { q: "酒精会让情况更糟吗?", a: "很可能。酒精尤其会破坏后半夜的睡眠。" },
        {
          q: "这意味着我有失眠症吗?",
          a: "若每周 3 晚以上、持续 3 个月以上出现半夜醒来且难以再入睡,符合失眠的定义。",
        },
        { q: "褪黑素对 3 点醒来有用吗?", a: "通常没有 —— 褪黑素影响睡眠时间节律,而不是睡眠维持。" },
        { q: "CBT-I 有用吗?", a: "有用 —— CBT-I 对入睡困难和半夜醒来都很有效。" },
      ],
    },
    "insomnia-treatment": {
      meta: {
        title: "失眠治疗:CBT-I 与药物对比 | Somna",
        desc: "对比 CBT-I 与安眠药,了解哪些治疗方案有研究支持。",
      },
      eyebrow: "CBT-I 知识库",
      title: "失眠治疗:CBT-I 与药物对比",
      intro: "药物起效快,CBT-I 作用更深。以下是基于证据的诚实对比,帮你做出更好的选择。",
      readTime: "7",
      takeaways: [
        "CBT-I 被主要睡眠指南推荐为一线治疗。",
        "药物短期可能有效,但很少能解决慢性失眠。",
        "CBT-I 效果持久且无副作用。",
        "在临床指导下,两者可以结合使用。",
      ],
      sections: [
        {
          heading: "什么是失眠?",
          paras: [
            "失眠是入睡困难、难以维持睡眠或过早醒来 —— 每周至少 3 晚、持续 3 个月以上,并影响白天表现。这是一种临床状况,不是性格特征。",
          ],
        },
        {
          heading: "治疗方案一 —— CBT-I",
          paras: [
            "一种结构化、有循证依据的项目,针对维持失眠的思维和行为。4–8 周。无需药物。治疗结束后效果仍能保持。",
          ],
        },
        {
          heading: "治疗方案二 —— 睡眠药物",
          paras: [
            "包括处方安眠药(z 类药物、苯二氮卓类)、镇静类抗抑郁药和非处方助眠药。它们可以缩短入睡时间,但常常逐渐失效、可能产生依赖,也不解决根本原因。",
          ],
        },
        {
          heading: "利与弊",
          bullets: [
            "CBT-I —— 持久、无副作用,需要付出努力和耐心。",
            "药物 —— 快速缓解、可能有副作用,停药后常出现反弹失眠。",
          ],
        },
        {
          heading: "长期来看哪种更有效?",
          paras: [
            "研究很明确:在 6–12 个月的随访中,CBT-I 优于药物。药物的益处在停药后消退;CBT-I 的益处通常保持。",
          ],
        },
        {
          heading: "可以结合使用吗?",
          paras: [
            "可以。许多临床医生会在 CBT-I 期间短期使用药物,然后逐步减量。请始终与开药医生协调。",
          ],
        },
      ],
      strategyIntro: "如果不知道从哪开始,可以参考这些。",
      strategyItems: [
        { title: "尽可能先尝试 CBT-I", desc: "AASM 和 ACP 推荐其为慢性失眠的一线治疗。" },
        { title: "把药物当作桥梁,而非终点", desc: "短期、最低有效剂量,并有减药计划。" },
        { title: "调整白天习惯", desc: "咖啡因时间、酒精、光照和运动都会影响夜间。" },
        { title: "记录睡眠", desc: "简单的睡眠日记能揭示任何应用都猜不到的规律。" },
      ],
      cta: { label: "阅读 CBT-I 指南", to: "/cbt-i-guide" },
      faqs: [
        {
          q: "CBT-I 真的比安眠药更好吗?",
          a: "对慢性失眠而言,长期随访结果是肯定的。对一次性急性失眠,短期药物可能合适。",
        },
        {
          q: "安眠药安全吗?",
          a: "短期遵医嘱使用通常安全。风险包括依赖、次日嗜睡、跌倒(尤其老年人)和反弹失眠。",
        },
        {
          q: "非处方助眠药呢?",
          a: "大多含镇静类抗组胺药。会引起次日嗜睡,耐受性也很快产生。不建议长期使用。",
        },
        {
          q: "褪黑素算安眠药吗?",
          a: "不算 —— 它调节昼夜节律,而非镇静。对时差和睡眠相位延迟最有用。",
        },
        {
          q: "CBT-I 花费多少?",
          a: "因情况而异。面对面治疗最贵,团体项目居中,数字 CBT-I(包括自助)通常最实惠。",
        },
        {
          q: "如果我已经吃药多年怎么办?",
          a: "许多人能在 CBT-I 期间,在开药医生支持下成功减药。不要突然停药。",
        },
        {
          q: "医保覆盖 CBT-I 吗?",
          a: "在许多地区是的,尤其由持证临床医生提供时。数字项目的报销范围因地而异。",
        },
        {
          q: "如何知道治疗有效?",
          a: "更快入睡、夜间醒来更少、作息更稳定、白天精力更好。睡眠日记可以客观看到进步。",
        },
      ],
    },
  },
};

const esTitles: Record<CbtiSlug, string> = {
  "cbt-i-guide": "Guía de TCC-I",
  "sleep-anxiety": "Ansiedad por dormir",
  "how-to-fall-asleep-fast": "Cómo dormirse rápido",
  "wake-up-at-3am": "Despertarse a las 3 AM",
  "insomnia-treatment": "Tratamiento del insomnio",
};

const esSummaries: Record<CbtiSlug, string> = {
  "cbt-i-guide": "Una introducción completa a la Terapia Cognitivo-Conductual para el Insomnio.",
  "sleep-anxiety": "Por qué preocuparse por dormir empeora el sueño — y cómo romper el ciclo.",
  "how-to-fall-asleep-fast": "Técnicas con evidencia para dormirse más rápido, sin medicamentos.",
  "wake-up-at-3am": "Causas de los despertares nocturnos y qué hacer al respecto.",
  "insomnia-treatment": "TCC-I frente a medicación — lo que dice realmente la investigación.",
};

const es: CbtiDict = {
  ui: {
    guides: "Guías",
    section: "Biblioteca TCC-I",
    readTime: "min de lectura",
    badge: "Respaldado por ciencia",
    takeawaysTitle: "Puntos clave",
    strategyTitle: "Lo que recomienda la TCC-I",
    relatedArticlesTitle: "Artículos relacionados",
    faqTitle: "Preguntas frecuentes",
    sleepDiary: "Diario de sueño",
    sleepDiaryDesc: "Registra tus noches sin juicio.",
  },
  titles: esTitles,
  summaries: esSummaries,
  articles: {
    "cbt-i-guide": {
      meta: {
        title: "Guía TCC-I: Un enfoque científico para dormir mejor | Somna",
        desc: "Aprende cómo funciona la Terapia Cognitivo-Conductual para el Insomnio (TCC-I) y por qué es el tratamiento de primera línea para el insomnio crónico.",
      },
      eyebrow: "BIBLIOTECA TCC-I",
      title: "Guía TCC-I: Un enfoque científico para dormir mejor",
      intro:
        "La Terapia Cognitivo-Conductual para el Insomnio (TCC-I) es el tratamiento estándar sin medicamentos para el insomnio crónico. Esta guía explica cómo funciona, qué esperar y cómo empezar.",
      readTime: "8",
      takeaways: [
        "La TCC-I es recomendada como tratamiento de primera línea por las principales organizaciones médicas.",
        "Funciona reentrenando la relación del cerebro con el sueño — no sedando.",
        "La mayoría observa mejoras significativas en 4–8 semanas.",
        "No tiene efectos secundarios y los beneficios se mantienen tras el programa.",
      ],
      sections: [
        {
          heading: "¿Qué es la TCC-I?",
          paras: [
            "La TCC-I es un programa estructurado y limitado en el tiempo que aborda los pensamientos y conductas que sostienen el insomnio. A diferencia de los somníferos, ataca las causas, no solo los síntomas.",
            "Un curso típico dura 4–8 semanas, con pasos semanales que reconstruyen tu impulso natural de sueño y tu confianza en él.",
          ],
        },
        {
          heading: "Por qué funciona la TCC-I",
          paras: [
            "El insomnio crónico suele mantenerse por un bucle auto-reforzado: malas noches generan ansiedad, la ansiedad eleva la activación, y la noche siguiente empeora. La TCC-I corta el bucle desde varios ángulos a la vez.",
          ],
        },
        {
          heading: "Los cinco componentes",
          bullets: [
            "Restricción del sueño — comprimir el tiempo en cama para reconstruir presión de sueño.",
            "Control de estímulos — reasociar la cama con dormir, no con estar despierto.",
            "Reestructuración cognitiva — suavizar los pensamientos ansiosos sobre el sueño.",
            "Higiene del sueño — pequeños ajustes ambientales y de estilo de vida.",
            "Entrenamiento en relajación — calmar la respuesta de estrés nocturna.",
          ],
        },
        {
          heading: "¿Qué resultados esperar?",
          paras: [
            "La investigación muestra que el 70–80% de las personas con insomnio crónico responden a la TCC-I. La mayoría se duerme antes, se despierta menos y tiene más energía durante el día.",
          ],
        },
        {
          heading: "¿Cuánto dura la TCC-I?",
          paras: [
            "La mayoría de los programas duran 4–8 semanas. Algunas mejoras aparecen en 1–2 semanas, pero los mayores avances vienen con la constancia.",
          ],
        },
        {
          heading: "¿Es mejor que los somníferos?",
          paras: [
            "Ambos ayudan a corto plazo, pero solo la TCC-I muestra beneficio duradero al terminar. Las principales guías (AASM, ACP) recomiendan TCC-I como primera línea.",
          ],
        },
      ],
      strategyIntro: "Si solo recuerdas algunas cosas de la TCC-I, que sean estas.",
      strategyItems: [
        {
          title: "Hora de despertar constante",
          desc: "Cada día, también los fines de semana. La palanca más poderosa para tu ritmo circadiano.",
        },
        {
          title: "Levántate si no duermes",
          desc: "Tras ~20 min despierto, sal de la habitación y haz algo tranquilo con luz tenue. Vuelve solo si tienes sueño.",
        },
        {
          title: "Limita el tiempo en cama",
          desc: "Pasar horas en la cama esperando dormir debilita la asociación cama–sueño.",
        },
        {
          title: "Trata los pensamientos como pensamientos",
          desc: "No tienes que discutir con los pensamientos ansiosos sobre el sueño. Reconócelos y déjalos pasar.",
        },
      ],
      cta: { label: "Comenzar a registrar tu sueño", to: "/diary" },
      faqs: [
        {
          q: "¿La TCC-I es adecuada para mí?",
          a: "Ayuda a la mayoría de los adultos con insomnio crónico (3+ noches por semana durante 3+ meses). Si tienes apnea no tratada, piernas inquietas o un trastorno del ánimo, consulta primero a un clínico.",
        },
        {
          q: "¿Necesito un terapeuta?",
          a: "Trabajar con un clínico formado en TCC-I produce los mejores resultados, pero los programas digitales autoguiados también tienen evidencia y son efectivos.",
        },
        {
          q: "¿Debo renunciar a las siestas?",
          a: "A menudo sí, al menos en la fase activa. Las siestas reducen la presión de sueño que la TCC-I aprovecha.",
        },
        {
          q: "¿En qué se diferencia de la higiene del sueño?",
          a: "La higiene es una parte pequeña de la TCC-I. Por sí sola rara vez resuelve el insomnio crónico — los componentes conductuales y cognitivos hacen el trabajo principal.",
        },
        {
          q: "¿Empeorará mi insomnio al principio?",
          a: "La restricción del sueño puede ser dura en las semanas 1–2 porque crea presión de sueño a propósito. Es temporal y suele mejorar pronto.",
        },
        {
          q: "¿Funciona en adultos mayores?",
          a: "Sí. Los estudios muestran resultados sólidos, a menudo mejores que la medicación y sin efectos secundarios.",
        },
        {
          q: "¿Puedo hacer TCC-I tomando medicación?",
          a: "A menudo sí, con guía clínica. Muchas personas reducen la medicación durante o después de la TCC-I.",
        },
        {
          q: "¿Cuánto duran los beneficios?",
          a: "Los estudios de seguimiento muestran beneficios mantenidos 1–3 años después, algo inusual en tratamientos de insomnio.",
        },
      ],
    },
    "sleep-anxiety": {
      meta: {
        title: "Ansiedad por dormir: por qué preocuparse empeora el sueño | Somna",
        desc: "Aprende cómo se desarrolla la ansiedad por dormir y descubre técnicas TCC-I para romper el ciclo.",
      },
      eyebrow: "BIBLIOTECA TCC-I",
      title: "Ansiedad por dormir: por qué preocuparse empeora el sueño",
      intro:
        "Preocuparse por el sueño es uno de los motores más comunes del insomnio. Entender el ciclo es el primer paso para suavizarlo.",
      readTime: "7",
      takeaways: [
        "La ansiedad por dormir es una respuesta aprendida — tu cerebro intenta protegerte.",
        "Cuanto más intentas dormir, más alerta queda tu sistema nervioso.",
        "La TCC-I usa la aceptación, no el control, para romper el bucle.",
        "Pequeños cambios diurnos pueden cambiar la noche siguiente.",
      ],
      sections: [
        {
          heading: "¿Qué es la ansiedad por dormir?",
          paras: [
            "Es la preocupación, miedo o hiperactivación que se acumula al acercarse la hora de dormir y durante la noche. No es un defecto personal — es una respuesta condicionada de un cerebro que aprendió a vincular la cama con el estrés.",
          ],
        },
        {
          heading: "El ciclo sueño-ansiedad",
          paras: [
            "Unas pocas malas noches provocan miedo a futuras malas noches. El miedo eleva cortisol y ritmo cardíaco. Esa activación dificulta la noche siguiente, lo que confirma el miedo. Y así sucesivamente.",
          ],
        },
        {
          heading: "Pensamientos ansiosos comunes",
          bullets: [
            "«¿Y si no duermo esta noche?»",
            "«Mañana estaré agotado y no podré funcionar.»",
            "«Los demás se duermen — ¿qué me pasa?»",
            "«Tengo que dormirme ya o la noche está arruinada.»",
          ],
        },
        {
          heading: "Por qué el cerebro se vuelve hiperalerta",
          paras: [
            "Tu cerebro aprende. Tras suficientes noches en las que la cama = lucha, el simple acto de acostarte puede disparar una respuesta de alarma — corazón rápido, pensamientos acelerados, piel caliente. Es condicionamiento, no debilidad.",
          ],
        },
        {
          heading: "Estrategias TCC-I para la ansiedad por dormir",
          bullets: [
            "Control de estímulos — sal de la cama si la vigilia se alarga.",
            "Defusión cognitiva — deja pasar los pensamientos sin engancharte.",
            "Intención paradójica — intenta calmadamente «mantenerte despierto», quitando la presión de dormir.",
            "Tiempo de preocupación diurno — procesa las preocupaciones del día siguiente antes, no a medianoche.",
          ],
        },
        {
          heading: "Aceptación vs control",
          paras: [
            "El sueño no se fuerza. Cuanto más empujas, más empuja tu sistema en contra. La TCC-I propone algo contraintuitivo: suelta la lucha. El cuerpo duerme cuando se siente seguro.",
          ],
        },
      ],
      strategyIntro: "Cuando la ansiedad por dormir aumente, apóyate en esto.",
      strategyItems: [
        {
          title: "Suelta el objetivo de dormir",
          desc: "Apunta a descansar, no a dormir. El sueño llega como subproducto de sentirte seguro.",
        },
        {
          title: "Sal de la cama si das vueltas",
          desc: "Actividad con poca luz y poco estímulo. Vuelve solo con sueño real.",
        },
        {
          title: "Programa la preocupación más temprano",
          desc: "10 minutos al inicio de la tarde escribiendo lo que te preocupa. Cierra el cuaderno.",
        },
        {
          title: "Alarga la espiración",
          desc: "Una espiración larga y suave baja el ritmo cardíaco y envía señal de seguridad.",
        },
      ],
      cta: { label: "Leer la guía TCC-I", to: "/cbt-i-guide" },
      faqs: [
        {
          q: "¿Por qué suele comenzar?",
          a: "Un evento estresante, una enfermedad o una etapa de mal sueño suelen sembrarla. El cerebro luego asocia la cama con la lucha.",
        },
        {
          q: "¿Es lo mismo que insomnio?",
          a: "Se solapan mucho. La ansiedad por dormir es uno de los principales motores y mantenedores del insomnio crónico.",
        },
        {
          q: "¿Puedo tomar algo para relajarme?",
          a: "Los sedantes pueden ayudar a corto plazo, pero no abordan el condicionamiento. La TCC-I reentrena la respuesta.",
        },
        {
          q: "¿Por qué me siento ansioso solo a la hora de dormir?",
          a: "Porque esa es la señal que tu cerebro aprendió. Fuera del dormitorio la alarma no se dispara.",
        },
        {
          q: "¿Ayuda mirar el reloj?",
          a: "No. Mirar la hora aumenta la ansiedad. Gira el reloj o quítalo de la vista.",
        },
        {
          q: "¿Cuánto tarda en notarse la calma?",
          a: "La mayoría nota cierta mejora en 2–4 semanas de práctica TCC-I constante.",
        },
        {
          q: "¿La respiración ayuda de verdad?",
          a: "Sí — espiraciones lentas y prolongadas (p. ej. 4-7-8) bajan la activación fisiológica de manera fiable.",
        },
        {
          q: "¿Cuándo ver a un clínico?",
          a: "Si la ansiedad por dormir se acompaña de pánico diurno, ánimo bajo persistente o gran impacto diario, busca apoyo profesional.",
        },
      ],
    },
    "how-to-fall-asleep-fast": {
      meta: {
        title: "Cómo dormirse rápido: estrategias con evidencia | Somna",
        desc: "Descubre técnicas con base científica para dormirse más rápido sin depender de somníferos.",
      },
      eyebrow: "BIBLIOTECA TCC-I",
      title: "Cómo dormirse rápido: estrategias con evidencia",
      intro:
        "No puedes forzar el sueño — pero puedes crear las condiciones donde llega más fácil. Esto es lo que realmente respalda la investigación.",
      readTime: "6",
      takeaways: [
        "La mayoría de adultos tarda 10–20 minutos en dormirse — es normal.",
        "Esforzarse más casi siempre es contraproducente.",
        "La luz, la temperatura y los horarios importan más que cualquier técnica única.",
        "Si llevas ~20 min despierto, sal de la cama.",
      ],
      sections: [
        {
          heading: "Por qué dormirse puede ser difícil",
          paras: [
            "Dormirse depende de dos sistemas: la presión de sueño (acumulada por horas despierto) y el reloj circadiano. Si alguno está alterado, dormirse tarda más.",
            "Estrés, pantallas, cafeína tardía y horarios irregulares retrasan el inicio del sueño.",
          ],
        },
        {
          heading: "Errores comunes",
          bullets: [
            "Acostarse antes de tener sueño real.",
            "Usar el móvil en la cama.",
            "Mirar el reloj cuando no duermes.",
            "Forzar el sueño con voluntad pura.",
            "Tomar alcohol para relajarse — fragmenta el sueño después.",
          ],
        },
        {
          heading: "Recomendaciones TCC-I",
          bullets: [
            "Acuéstate solo cuando tengas sueño, no solo cansancio.",
            "Mantén una hora de despertar constante, incluso tras malas noches.",
            "Baja las luces 60–90 min antes de dormir.",
            "Habitación fresca (~18°C / 65°F).",
          ],
        },
        {
          heading: "Métodos de relajación que funcionan",
          bullets: [
            "Relajación muscular progresiva — tensa y suelta grupos musculares de pies a cabeza.",
            "Body scan — atención lenta por el cuerpo.",
            "Cognitive shuffle — imágenes mentales aleatorias y sin relación para desenganchar el pensamiento.",
          ],
        },
        {
          heading: "Ejercicios de respiración",
          paras: [
            "La respiración nasal lenta con espiración larga es la técnica con más evidencia. Prueba 4-7-8 (inhala 4, sostén 7, exhala 8) durante 4 ciclos, o un simple 4-6.",
          ],
        },
        {
          heading: "Qué hacer si no logras dormir",
          paras: [
            "Si pasan 20 minutos y sigues despierto, levántate. Siéntate en silencio con luz tenue. Lee algo suave. Vuelve a la cama cuando tengas sueño. Esto reconstruye el vínculo cama–sueño.",
          ],
        },
      ],
      strategyIntro: "Esta noche, prueba esto — en orden.",
      strategyItems: [
        {
          title: "Atenúa todo 60 min antes",
          desc: "La luz suprime la melatonina. Bajar luces es el mayor «booster» natural.",
        },
        { title: "Pantallas fuera del dormitorio", desc: "Mínimo: nada de scroll en la cama." },
        {
          title: "Espera al sueño real",
          desc: "Cansado no es lo mismo que con sueño. Sueño = párpados pesados, cabeza que cae. Entonces acuéstate.",
        },
        {
          title: "Si llevas 20 min despierto, sal",
          desc: "Actividad tranquila con poca luz hasta tener sueño. La herramienta TCC-I más potente.",
        },
      ],
      cta: { label: "Usa la calculadora de hora de dormir", to: "/bedtime-calculator" },
      faqs: [
        {
          q: "¿Cuánto debería tardar en dormirme?",
          a: "10–20 minutos es saludable. Menos de 5 puede indicar privación de sueño; más de 30 de forma habitual sugiere insomnio.",
        },
        {
          q: "¿Contar ovejas funciona?",
          a: "Poco. El «cognitive shuffle» funciona mejor para la mayoría.",
        },
        {
          q: "¿Las apps y el ruido blanco ayudan?",
          a: "El sonido ambiental constante ayuda a algunos al enmascarar ruidos. La eficacia varía.",
        },
        {
          q: "¿Leer en la cama?",
          a: "Si te da sueño con fiabilidad, sí. Si te despierta, hazlo en otro sitio y vuelve cuando tengas sueño.",
        },
        {
          q: "¿La melatonina me dormirá más rápido?",
          a: "Puede ajustar el horario, sobre todo en jet lag o fase retrasada. No es un sedante.",
        },
        {
          q: "¿Y el ejercicio?",
          a: "El ejercicio regular mejora el inicio del sueño. Evita entrenos intensos en las 2 h previas a dormir.",
        },
        {
          q: "¿Temperatura ideal del cuarto?",
          a: "Fresca — entre 16–19°C (60–67°F) para la mayoría de los adultos.",
        },
        {
          q: "¿Está bien dormir con la TV encendida?",
          a: "Generalmente no — luz y audio cambiante fragmentan el sueño aunque no lo notes.",
        },
      ],
    },
    "wake-up-at-3am": {
      meta: {
        title: "¿Por qué me despierto a las 3 AM cada noche? | Somna",
        desc: "Entiende las causas comunes de despertarse a las 3 AM y qué recomienda la TCC-I para mejorar la continuidad del sueño.",
      },
      eyebrow: "BIBLIOTECA TCC-I",
      title: "¿Por qué me despierto a las 3 AM cada noche?",
      intro:
        "Despertar en mitad de la noche es uno de los patrones más comunes — y frustrantes — del insomnio. Esto es por qué ocurre y qué ayuda.",
      readTime: "6",
      takeaways: [
        "Despertares breves entre ciclos son totalmente normales.",
        "El problema rara vez es despertar — es no poder volver a dormir.",
        "El estrés y la hiperactivación suelen subir en la segunda mitad de la noche.",
        "Lo que haces en esos 20 minutos importa más que el motivo del despertar.",
      ],
      sections: [
        {
          heading: "¿Es normal despertarse a las 3 AM?",
          paras: [
            "Sí. Las personas sanas despiertan brevemente entre ciclos varias veces por noche y vuelven a dormir enseguida. El problema no es el despertar — es quedarse atascado.",
          ],
        },
        {
          heading: "Estrés e hiperactivación",
          paras: [
            "El cortisol sube de forma natural en la segunda mitad de la noche para prepararte. Con mucho estrés, ese ascenso empieza antes y más fuerte — sacándote del sueño hacia las 2–4 AM.",
          ],
        },
        {
          heading: "Ciclos de sueño y despertares",
          paras: [
            "A las 3 AM la mayoría ya ha completado varios ciclos y pasa más tiempo en REM ligero, del que es más fácil despertar. Un ruido o cambio de temperatura puede cruzar el umbral.",
          ],
        },
        {
          heading: "Otras causas frecuentes",
          bullets: [
            "Alcohol — relaja al inicio, fragmenta el sueño 4–6 h después.",
            "Cenas tardías o bajada de azúcar.",
            "Habitación demasiado caliente.",
            "Apnea del sueño o piernas inquietas no tratadas.",
            "Vejiga llena (sobre todo con líquidos por la noche).",
          ],
        },
        {
          heading: "Lo que NO debes hacer",
          bullets: [
            "Mirar el reloj.",
            "Coger el móvil.",
            "Quedarte 30+ min en la cama forzando el sueño.",
            "Empezar a planificar mentalmente mañana.",
          ],
        },
        {
          heading: "Recomendaciones TCC-I",
          paras: [
            "Tras ~20 min despierto, sal de la cama. Siéntate en silencio con luz tenue. Haz algo suave que capte la atención. Vuelve solo si tienes sueño. En semanas, los despertares se acortan y a menudo desaparecen.",
          ],
        },
        {
          heading: "Cuándo buscar ayuda médica",
          paras: [
            "Si los despertares van con jadeos, ahogos, ronquidos fuertes, movimientos de piernas o agotamiento diurno pese a dormir suficiente, consulta — pueden indicar apnea u otro trastorno tratable.",
          ],
        },
      ],
      strategyIntro: "La próxima vez que te despiertes a las 3 AM, prueba esta secuencia.",
      strategyItems: [
        {
          title: "No mires la hora",
          desc: "Saber que son las 3 AM activa el bucle de preocupación al instante.",
        },
        {
          title: "Quédate quieto y respira lento",
          desc: "Espiraciones largas. Sin esfuerzo por dormir — solo descansa.",
        },
        {
          title: "Tras ~20 min, levántate",
          desc: "Luz tenue, actividad tranquila. Vuelve cuando tengas sueño.",
        },
        {
          title: "Despierta a tu hora habitual",
          desc: "No duermas hasta tarde. Proteger la hora de despertar protege la presión de sueño de mañana.",
        },
      ],
      cta: { label: "Registra tus patrones de sueño", to: "/diary" },
      faqs: [
        {
          q: "¿Por qué precisamente a las 3 AM?",
          a: "El cortisol sube de forma natural en la segunda mitad de la noche y el sueño ya es más ligero. 2–4 AM es la franja más común.",
        },
        {
          q: "¿Significa que algo va mal médicamente?",
          a: "Normalmente no. Pero despertares persistentes con síntomas diurnos merecen una valoración clínica.",
        },
        {
          q: "¿Por qué no vuelvo a dormirme?",
          a: "Porque la mente se activa al notar la vigilia — y la preocupación bloquea el regreso al sueño.",
        },
        {
          q: "¿Debo comer algo?",
          a: "Solo si el hambre es claramente el detonante. Si no, comer refuerza la vigilia nocturna.",
        },
        {
          q: "¿El alcohol empeora esto?",
          a: "Muy probablemente. Fragmenta especialmente la segunda mitad de la noche.",
        },
        {
          q: "¿Esto significa que tengo insomnio?",
          a: "Despertares nocturnos frecuentes con dificultad para volver a dormir, 3+ noches/semana durante 3+ meses, cumple los criterios de insomnio.",
        },
        {
          q: "¿La melatonina ayuda con esto?",
          a: "No suele — la melatonina afecta al horario, no al mantenimiento del sueño.",
        },
        {
          q: "¿Ayuda la TCC-I?",
          a: "Sí — es muy efectiva tanto para conciliar como para mantener el sueño.",
        },
      ],
    },
    "insomnia-treatment": {
      meta: {
        title: "Tratamiento del insomnio: TCC-I frente a medicación | Somna",
        desc: "Compara TCC-I y somníferos y conoce qué opciones tienen mayor respaldo científico.",
      },
      eyebrow: "BIBLIOTECA TCC-I",
      title: "Tratamiento del insomnio: TCC-I frente a medicación",
      intro:
        "Las pastillas actúan rápido. La TCC-I actúa más profundo. Aquí tienes una comparación honesta y basada en evidencia para que elijas bien.",
      readTime: "7",
      takeaways: [
        "La TCC-I es la primera línea según las principales guías.",
        "La medicación ayuda a corto plazo pero rara vez resuelve el insomnio crónico.",
        "La TCC-I tiene beneficios duraderos y sin efectos secundarios.",
        "Pueden combinarse bajo guía clínica.",
      ],
      sections: [
        {
          heading: "¿Qué es el insomnio?",
          paras: [
            "Es dificultad para conciliar, mantener el sueño o despertar muy temprano — al menos 3 noches por semana durante 3+ meses, con impacto diurno. Es una condición clínica, no un rasgo de carácter.",
          ],
        },
        {
          heading: "Opción 1 — TCC-I",
          paras: [
            "Programa estructurado con evidencia que aborda pensamientos y conductas que mantienen el insomnio. 4–8 semanas. Sin medicación. Los efectos persisten tras el programa.",
          ],
        },
        {
          heading: "Opción 2 — Medicación",
          paras: [
            "Incluye hipnóticos con receta (fármacos Z, benzodiacepinas), antidepresivos sedantes y productos de venta libre. Pueden reducir el tiempo para dormirse, pero pierden eficacia, pueden generar dependencia y no atacan la raíz.",
          ],
        },
        {
          heading: "Pros y contras",
          bullets: [
            "TCC-I — duradera, sin efectos secundarios, requiere esfuerzo y paciencia.",
            "Medicación — alivio rápido, posibles efectos secundarios, insomnio de rebote al suspender.",
          ],
        },
        {
          heading: "¿Qué funciona a largo plazo?",
          paras: [
            "La investigación es clara: la TCC-I supera a la medicación a 6–12 meses. El efecto de los fármacos se desvanece al suspender; el de la TCC-I se mantiene.",
          ],
        },
        {
          heading: "¿Se pueden combinar?",
          paras: [
            "Sí. Muchos clínicos usan medicación a corto plazo junto a la TCC-I y luego la retiran. Coordina siempre con tu prescriptor.",
          ],
        },
      ],
      strategyIntro: "Si dudas por dónde empezar, ten esto en cuenta.",
      strategyItems: [
        {
          title: "Empieza por TCC-I si puedes",
          desc: "Recomendada por AASM y ACP como primera línea para el insomnio crónico.",
        },
        {
          title: "La medicación, puente y no destino",
          desc: "Corto plazo, dosis efectiva mínima, con plan de retirada.",
        },
        {
          title: "Cuida los hábitos diurnos",
          desc: "Cafeína, alcohol, luz y ejercicio configuran tus noches.",
        },
        {
          title: "Lleva un diario de sueño",
          desc: "Un registro simple revela patrones que ninguna app adivinará.",
        },
      ],
      cta: { label: "Explora la guía TCC-I", to: "/cbt-i-guide" },
      faqs: [
        {
          q: "¿La TCC-I es realmente mejor que los somníferos?",
          a: "Para el insomnio crónico, sí — en el seguimiento a largo plazo. Para insomnio agudo puntual, una medicación corta puede ser apropiada.",
        },
        {
          q: "¿Son seguros los somníferos?",
          a: "A corto plazo y con receta, suelen serlo. Riesgos: dependencia, somnolencia al día siguiente, caídas (sobre todo mayores) e insomnio de rebote.",
        },
        {
          q: "¿Y los productos de venta libre?",
          a: "La mayoría usan antihistamínicos sedantes. Causan somnolencia al día siguiente y se desarrolla tolerancia. No recomendados a largo plazo.",
        },
        {
          q: "¿La melatonina es un somnífero?",
          a: "No — ajusta el horario en lugar de sedar. Útil sobre todo en jet lag y fase retrasada.",
        },
        {
          q: "¿Cuánto cuesta la TCC-I?",
          a: "Varía. La terapia presencial es la más cara, los grupos están en el medio, la TCC-I digital (incluida autoguiada) suele ser la más accesible.",
        },
        {
          q: "¿Y si llevo años con medicación?",
          a: "Muchas personas la reducen mientras hacen TCC-I, con apoyo del prescriptor. Nunca suspendas bruscamente.",
        },
        {
          q: "¿Lo cubre el seguro?",
          a: "En muchas regiones sí, sobre todo si lo da un clínico licenciado. La cobertura de programas digitales varía.",
        },
        {
          q: "¿Cómo sé si el tratamiento funciona?",
          a: "Te duermes antes, despiertas menos, horarios más estables y más energía diurna. Un diario de sueño ayuda a verlo objetivamente.",
        },
      ],
    },
  },
};

const dicts: Partial<Record<Lang, CbtiDict>> = { en, zh, es, pt: ptCbtiDict };

export function getCbtiDict(lang: Lang): CbtiDict {
  return dicts[lang] ?? en;
}

export const CBTI_SLUGS: CbtiSlug[] = [
  "cbt-i-guide",
  "sleep-anxiety",
  "how-to-fall-asleep-fast",
  "wake-up-at-3am",
  "insomnia-treatment",
];

export function cbtiPath(slug: CbtiSlug, lang?: "en" | "zh" | "es" | "pt"): string {
  const prefix = lang === "es" ? "/es" : lang === "pt" ? "/pt" : "";
  return `${prefix}/${slug}`;
}
