export interface Article {
  slug: string
  title: string
  category: 'Foundations' | 'The Brain' | 'Practice' | 'Relapse'
  minutes: number
  dek: string
  body: string[]
}

export const ARTICLES: Article[] = [
  {
    slug: 'what-changes',
    title: 'What Changes, Week by Week',
    category: 'Foundations',
    minutes: 4,
    dek: 'A rough map of the road ahead, so the hard stretches don’t catch you off guard.',
    body: [
      'Everyone’s timeline is different, but most people who quit a compulsive habit describe a similar arc. Knowing the shape of it makes the difficult parts feel expected rather than alarming.',
      '## Days 1–7',
      'The first week is usually the loudest. Urges arrive often and without warning, especially at the times and places the habit used to live: late at night, alone, bored, stressed. This is the old pattern asking to be fed. It is not a sign you are failing.',
      '## Weeks 2–4',
      'Many people report a “flatline” — low energy, low motivation, a strange emotional quiet. It can feel like nothing is working. It is often the opposite: your reward system is recalibrating away from an unusually intense source of stimulation.',
      '## Months 2–3',
      'Focus tends to sharpen. Ordinary pleasures — a good meal, a conversation, a workout — start to register again. Confidence builds because you now have evidence that you can hold a line.',
      '## Beyond 90 days',
      'The habit stops being the center of your attention. Urges still appear, but they are quieter and shorter, and you know exactly what to do with them.',
    ],
  },
  {
    slug: 'dopamine',
    title: 'Dopamine Is About Wanting, Not Liking',
    category: 'The Brain',
    minutes: 5,
    dek: 'Why the pull feels so strong even when the payoff feels so empty.',
    body: [
      'Dopamine is often called the pleasure chemical, but that is misleading. It is closer to a motivation signal — the feeling of wanting, anticipating, reaching for something.',
      'Highly novel, endlessly available stimulation is extremely good at triggering that wanting signal. Over time, the brain learns to associate specific cues — a device, a mood, a time of day — with the promise of reward.',
      '## Cues, not cravings',
      'This is why urges often feel like they come from nowhere. They are usually responses to cues you have stopped noticing. Tracking when urges arrive (the journal is built for this) makes those cues visible again.',
      '## The good news',
      'Pathways that are used get stronger; pathways that go unused get weaker. Every urge you outlast is a small vote against the old association.',
    ],
  },
  {
    slug: 'urge-surfing',
    title: 'Urge Surfing',
    category: 'Practice',
    minutes: 3,
    dek: 'Urges rise, peak, and fall. You only need to stay on the board.',
    body: [
      'An urge behaves like a wave. It builds, crests, and passes — usually within fifteen to twenty minutes if you don’t act on it or fight it hard.',
      '## How to surf',
      '1. Notice it. Name it plainly: “This is an urge.”',
      '2. Locate it in your body. Chest, stomach, hands, jaw? Describe it without judgment.',
      '3. Breathe into that place. Slow exhales are the anchor.',
      '4. Watch it change. It will shift in size and texture. Let it.',
      'The goal is not to make the urge disappear. The goal is to prove to yourself that you can feel it without obeying it.',
    ],
  },
  {
    slug: 'environment',
    title: 'Design Your Environment',
    category: 'Practice',
    minutes: 4,
    dek: 'Willpower is a backup plan. Friction is the real plan.',
    body: [
      'You make most decisions before the moment of temptation — by deciding what is within reach. Add friction to the old behavior and remove friction from the new ones.',
      '## Practical moves',
      '• Keep devices out of the bedroom. Buy a plain alarm clock.',
      '• Install content filters and give someone else the password.',
      '• Identify your highest-risk hour and schedule something in it: a walk, a call, the gym.',
      '• Replace, don’t just remove. Boredom is a cue; have a default action ready.',
      'Small structural changes outperform heroic effort because they work even on the days you are tired.',
    ],
  },
  {
    slug: 'after-a-relapse',
    title: 'After a Relapse',
    category: 'Relapse',
    minutes: 3,
    dek: 'A reset is not a return to zero. Here’s how to get back up well.',
    body: [
      'A relapse resets your counter, not your progress. The days you stacked still rewired habits, taught you your triggers, and proved what you can do.',
      '## The first hour',
      'Shame is the most dangerous part of a relapse, because shame drives the next one. Treat yourself the way you would treat a friend: firmly, but kindly.',
      '## Then, get curious',
      'What was the cue? What time was it? What were you feeling before? Write it down in the relapse note or your journal. Every relapse is data.',
      '## Then, change one thing',
      'Not everything. One thing — the one that would have made the biggest difference this time.',
    ],
  },
  {
    slug: 'why-streaks-work',
    title: 'Why Streaks Work',
    category: 'Foundations',
    minutes: 2,
    dek: 'A visible record turns an abstract goal into something you can protect.',
    body: [
      'A streak converts a vague intention (“I want to stop”) into a concrete, growing asset. Every day you add makes the next day more valuable to protect.',
      'Use it, but don’t worship it. The number is a tool for motivation, not a measure of your worth. The person you are becoming is the real score.',
    ],
  },
]

export const TACTICS = [
  'Stand up and leave the room you are in. Change of place, change of state.',
  'Do twenty push-ups or squats. Right now, before you think about it.',
  'Take a cold shower, or splash cold water on your face and wrists.',
  'Text someone — anyone — and start a conversation.',
  'Step outside and walk for ten minutes without your phone.',
  'Write down exactly what you are feeling in the journal.',
  'Put your phone in another room and set a 15-minute timer.',
  'Read your reasons out loud, slowly.',
]

export const LINES = [
  'The urge is a wave. You are the shore.',
  'You have survived every urge you have ever had.',
  'Discipline is choosing what you want most over what you want now.',
  'This moment passes. The person you become does not.',
  'Quiet the noise. Keep the promise.',
  'You are not your impulses. You are the one who notices them.',
]

export const TRIGGERS = ['Boredom', 'Stress', 'Loneliness', 'Late night', 'Fatigue', 'Social media', 'Other']
