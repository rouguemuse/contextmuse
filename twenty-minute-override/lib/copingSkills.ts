// ============================================================
// 100 Coping Skills — all categories, blunt tone, no fluff
// ============================================================

export interface CopingSkill {
  id: number;
  category: Category;
  skill: string;
}

export type Category =
  | 'grounding'
  | 'intrusive-thought'
  | 'body'
  | 'distraction'
  | 'self-talk'
  | 'environment'
  | 'sensory'
  | 'crisis';

export const CATEGORY_LABELS: Record<Category, string> = {
  'grounding':         '🪨 Grounding',
  'intrusive-thought': '🧠 Intrusive Thought',
  'body':              '💪 Body',
  'distraction':       '🎯 Distraction',
  'self-talk':         '🗣️ Self-Talk',
  'environment':       '🚪 Environment',
  'sensory':           '👁️ Sensory',
  'crisis':            '🚨 Crisis',
};

export const CATEGORY_COLORS: Record<Category, string> = {
  'grounding':         '#2dd4bf',
  'intrusive-thought': '#a855f7',
  'body':              '#f97316',
  'distraction':       '#60a5fa',
  'self-talk':         '#f472b6',
  'environment':       '#84cc16',
  'sensory':           '#fbbf24',
  'crisis':            '#ef4444',
};

export const COPING_SKILLS: CopingSkill[] = [
  // ── GROUNDING (15) ──────────────────────────────────────────────────────────
  { id: 1,  category: 'grounding', skill: 'Name 5 things you can see right now. Say them out loud.' },
  { id: 2,  category: 'grounding', skill: 'Name 5 things you can physically touch — then touch each one.' },
  { id: 3,  category: 'grounding', skill: 'Name 5 sounds you can hear. Don\'t judge them. Just name them.' },
  { id: 4,  category: 'grounding', skill: 'Feel the floor under your feet. Press down. Name what it feels like.' },
  { id: 5,  category: 'grounding', skill: 'Pick up 5 objects. Describe each one like you\'re explaining it to someone who can\'t see it.' },
  { id: 6,  category: 'grounding', skill: 'Find the furthest thing you can see from where you are standing right now.' },
  { id: 7,  category: 'grounding', skill: 'Count ceiling tiles, floor tiles, or objects on a shelf. Pick a number and count to it.' },
  { id: 8,  category: 'grounding', skill: 'Trace the outline of something with your eyes — a window, a doorframe, a rug. Slow.' },
  { id: 9,  category: 'grounding', skill: 'Find something in your space for every color: red, orange, yellow, green, blue, purple.' },
  { id: 10, category: 'grounding', skill: 'Feel your own heartbeat. Put your hand on your chest. Count 10 beats.' },
  { id: 11, category: 'grounding', skill: 'Notice what your clothes feel like against your skin right now. Just describe it.' },
  { id: 12, category: 'grounding', skill: 'Name 3 things that are the same as yesterday. Continuity is real.' },
  { id: 13, category: 'grounding', skill: 'Look at your hands. Really look. Count your knuckles.' },
  { id: 14, category: 'grounding', skill: 'Name where your body is touching furniture or floor right now. Every contact point.' },
  { id: 15, category: 'grounding', skill: 'Say your full name, your location, and today\'s date out loud. You are here. You are now.' },

  // ── INTRUSIVE THOUGHT SKILLS (20) ───────────────────────────────────────────
  { id: 16, category: 'intrusive-thought', skill: 'Label it: say out loud, "I am having the thought that I need a drink." That\'s it. Just label it.' },
  { id: 17, category: 'intrusive-thought', skill: 'Add "I notice I\'m having the thought that..." before whatever your brain is saying. It creates distance.' },
  { id: 18, category: 'intrusive-thought', skill: 'Picture your thought as a leaf floating down a river. You are watching from the bank. Watch it go.' },
  { id: 19, category: 'intrusive-thought', skill: 'Thank your brain: "Thanks for the thought. I don\'t need it right now." Then move on.' },
  { id: 20, category: 'intrusive-thought', skill: 'Give the intrusive thought a ridiculous voice — a cartoon character, a tiny whining robot. Say it again in that voice.' },
  { id: 21, category: 'intrusive-thought', skill: 'Write the thought down word for word. Look at it on paper. It\'s smaller than it felt in your head.' },
  { id: 22, category: 'intrusive-thought', skill: 'Name the thought type: "That\'s a craving thought." "That\'s a catastrophe thought." Labeling reduces its grip.' },
  { id: 23, category: 'intrusive-thought', skill: 'Say: "My brain is trying to protect me. It\'s wrong right now, but I hear it."' },
  { id: 24, category: 'intrusive-thought', skill: 'Picture the thought as a wave. You are not the wave. You are the shore. Let it crash.' },
  { id: 25, category: 'intrusive-thought', skill: 'Set a 3-minute timer. Allow yourself to fully feel the urge without acting on it. Ride it. It will peak and drop.' },
  { id: 26, category: 'intrusive-thought', skill: 'Ask: "Is this thought a fact or a feeling?" Write down both sides.' },
  { id: 27, category: 'intrusive-thought', skill: 'Repeat the intrusive thought in a silly voice until it sounds absurd. It works. It sounds dumb. Do it anyway.' },
  { id: 28, category: 'intrusive-thought', skill: 'Tell the thought: "You can stay. But you don\'t get to drive."' },
  { id: 29, category: 'intrusive-thought', skill: 'Notice where in your body the thought lives. Chest? Throat? Stomach? Don\'t fix it. Just name the location.' },
  { id: 30, category: 'intrusive-thought', skill: 'Ask: "If my best friend had this exact thought right now, what would I say to them?" Say that to yourself.' },
  { id: 31, category: 'intrusive-thought', skill: 'Set a "worry window." Tell yourself: "I will think about this at 9pm. Right now is not the time."' },
  { id: 32, category: 'intrusive-thought', skill: 'Write the thought, then write the counter-evidence. One column vs. the other. Make it concrete.' },
  { id: 33, category: 'intrusive-thought', skill: 'Say "I\'m having a craving" instead of "I need a drink." The language changes what happens next.' },
  { id: 34, category: 'intrusive-thought', skill: 'Ask: "What would this look like in 20 minutes? An hour? Tomorrow morning?" Play the tape forward.' },
  { id: 35, category: 'intrusive-thought', skill: 'Notice if the thought has happened before and passed. It has. It will pass again.' },

  // ── BODY REGULATION (20) ────────────────────────────────────────────────────
  { id: 36, category: 'body', skill: 'Breathe in for 4 counts, hold for 4, out for 6. Repeat 4 times. The long exhale activates your parasympathetic nervous system.' },
  { id: 37, category: 'body', skill: 'Slow your exhale to twice as long as your inhale. 3 rounds. That\'s it.' },
  { id: 38, category: 'body', skill: 'Hum any song. The vibration in your chest activates the vagus nerve. It physically calms the nervous system.' },
  { id: 39, category: 'body', skill: 'Shake out your hands. Then your whole arms. Discharge the physical tension. It\'s not just in your head.' },
  { id: 40, category: 'body', skill: 'Roll your shoulders back 10 times. Forward 10 times. You\'re carrying the stress in there.' },
  { id: 41, category: 'body', skill: 'Clench both fists as tight as you can. Hold 5 seconds. Release completely. Repeat 5 times.' },
  { id: 42, category: 'body', skill: 'Press your feet hard into the floor for 10 seconds. Release. Repeat 3 times.' },
  { id: 43, category: 'body', skill: 'Put your hands on your stomach. Feel it rise and fall for 10 full breaths. Just watch.' },
  { id: 44, category: 'body', skill: 'Yawn on purpose. Fake it if you have to. It triggers a parasympathetic response — your body will follow.' },
  { id: 45, category: 'body', skill: 'Do 20 jumping jacks. Or 10. Or 5. The number doesn\'t matter. Move your body.' },
  { id: 46, category: 'body', skill: 'Do a wall push-up. Any physical resistance helps discharge cortisol.' },
  { id: 47, category: 'body', skill: 'Roll a hard ball under your foot for 2 minutes. Focus entirely on the sensation.' },
  { id: 48, category: 'body', skill: 'Tense every muscle in your body at once. Squeeze everything. Hold 5 seconds. Let go completely.' },
  { id: 49, category: 'body', skill: 'Massage your own scalp with your fingertips for 1 minute. Slow pressure. You deserve this.' },
  { id: 50, category: 'body', skill: 'Place one hand on your chest, one on your belly. Breathe until the belly hand moves more than the chest hand.' },
  { id: 51, category: 'body', skill: 'Take a hot shower. Stand in it longer than feels necessary. Let the heat do something.' },
  { id: 52, category: 'body', skill: 'Hug yourself. Actually cross your arms over your chest. Hold. Rock slightly if you want.' },
  { id: 53, category: 'body', skill: 'Lie flat on the floor. Let gravity hold you. You don\'t have to do anything for the next 3 minutes.' },
  { id: 54, category: 'body', skill: 'Walk to another room. Stand differently. Your nervous system responds to physical context change.' },
  { id: 55, category: 'body', skill: 'Step outside for 3 minutes. No goal. Just outside. Temperature and air pressure are grounding.' },

  // ── DISTRACTION (15) ────────────────────────────────────────────────────────
  { id: 56, category: 'distraction', skill: 'Count backwards from 100 by 7s. (100, 93, 86, 79...) It forces your prefrontal cortex online.' },
  { id: 57, category: 'distraction', skill: 'Set a timer for 5 minutes. Clean or tidy one small area. Just one.' },
  { id: 58, category: 'distraction', skill: 'Text someone random a meme, a song, or just "thinking of you." Connection interrupts craving.' },
  { id: 59, category: 'distraction', skill: 'Put on a show you\'ve already seen. You don\'t need to pay attention. Just let it run.' },
  { id: 60, category: 'distraction', skill: 'Read the first 3 pages of anything.' },
  { id: 61, category: 'distraction', skill: 'Look up one thing you\'ve always been curious about and read about it for 10 minutes.' },
  { id: 62, category: 'distraction', skill: 'Draw or doodle anything. Doesn\'t matter what. Doesn\'t need to be good.' },
  { id: 63, category: 'distraction', skill: 'Write a list of 10 things you know how to do. Anything. Actual skills you have.' },
  { id: 64, category: 'distraction', skill: 'Name 10 movies or shows you like. Then rank them. Argue with yourself.' },
  { id: 65, category: 'distraction', skill: 'Recite something you have memorized — a song, a prayer, a poem, anything. Let it fill your brain.' },
  { id: 66, category: 'distraction', skill: 'Make a very specific, very small plan for tomorrow morning. What you\'ll do first. Just that.' },
  { id: 67, category: 'distraction', skill: 'Open a recipe and read the whole thing even if you won\'t make it.' },
  { id: 68, category: 'distraction', skill: 'Name every job you\'ve ever had. Every one. Even the bad ones.' },
  { id: 69, category: 'distraction', skill: 'Pick a random Wikipedia article and read the whole thing.' },
  { id: 70, category: 'distraction', skill: 'Write down 3 things that were genuinely okay today. Tiny counts. "Made coffee" counts.' },

  // ── SELF-TALK (10) ──────────────────────────────────────────────────────────
  { id: 71, category: 'self-talk', skill: 'Say out loud: "I have done hard things before. This is a hard thing. I can do hard things."' },
  { id: 72, category: 'self-talk', skill: 'Say: "The craving is lying. I know this because I know what comes after drink one."' },
  { id: 73, category: 'self-talk', skill: 'Say: "I am not weak. I am in recovery from something that physically rewired my brain."' },
  { id: 74, category: 'self-talk', skill: 'Say: "I can feel this without acting on it. Feeling something is not the same as doing it."' },
  { id: 75, category: 'self-talk', skill: 'Say: "20 minutes. That\'s all. Not forever. Not tomorrow. 20 minutes."' },
  { id: 76, category: 'self-talk', skill: 'Write: "If I drink tonight, I will feel ___ tomorrow morning." Fill it in. Be specific and honest.' },
  { id: 77, category: 'self-talk', skill: 'Write: "The thing I actually need right now is ___." Not alcohol. The real thing underneath.' },
  { id: 78, category: 'self-talk', skill: 'Remind yourself of one specific time you got through a craving without drinking. One time. It happened.' },
  { id: 79, category: 'self-talk', skill: 'Say: "My liver cannot process this the way it used to. This isn\'t about willpower. It\'s about stakes."' },
  { id: 80, category: 'self-talk', skill: 'Say: "I am not a bad person having a craving. I am a person in pain making a hard choice."' },

  // ── ENVIRONMENT (10) ────────────────────────────────────────────────────────
  { id: 81, category: 'environment', skill: 'Put your car keys somewhere inconvenient right now. Make the first step toward drinking physically harder.' },
  { id: 82, category: 'environment', skill: 'Turn every light on in your home. Darkness and isolation feed cravings.' },
  { id: 83, category: 'environment', skill: 'Make a replacement drink. Right now. Not later. The ritual is part of what you\'re replacing.' },
  { id: 84, category: 'environment', skill: 'Eat something. Even crackers. Low blood sugar intensifies every craving you have.' },
  { id: 85, category: 'environment', skill: 'Drink a full glass of water before doing anything else. Dehydration amplifies craving signals.' },
  { id: 86, category: 'environment', skill: 'Call someone and stay on the phone while you move around. Don\'t be alone with it if you don\'t have to be.' },
  { id: 87, category: 'environment', skill: 'Go somewhere with other people in it — a coffee shop, a store, a lobby. You don\'t have to talk to anyone.' },
  { id: 88, category: 'environment', skill: 'Change rooms. Right now. Your nervous system responds to physical context.' },
  { id: 89, category: 'environment', skill: 'Put something large in front of your front door. Give yourself one more physical barrier.' },
  { id: 90, category: 'environment', skill: 'Make soup or broth. The warmth, the salt, the ritual — it hits some of the same wiring.' },

  // ── SENSORY INTERRUPTS (5) ──────────────────────────────────────────────────
  { id: 91, category: 'sensory', skill: 'Suck on something very sour — a lemon, sour candy, a splash of vinegar. The shock snaps the nervous system to attention.' },
  { id: 92, category: 'sensory', skill: 'Eat something spicy. Capsaicin redirects the nervous system\'s attention. It works.' },
  { id: 93, category: 'sensory', skill: 'Put something with a strong smell near your face — coffee grounds, citrus peel, peppermint. Smell is the most direct sense.' },
  { id: 94, category: 'sensory', skill: 'Listen to one song at full volume. Not a playlist. One song. Do nothing else while it plays.' },
  { id: 95, category: 'sensory', skill: 'Hold ice in your hand for 30 seconds. Cold physical sensation interrupts the craving signal in the brain.' },

  // ── CRISIS (5) ──────────────────────────────────────────────────────────────
  { id: 96, category: 'crisis', skill: 'Call SAMHSA right now: 1-800-662-4357. Free, confidential, 24/7. They are not there to judge you.' },
  { id: 97, category: 'crisis', skill: 'Text "HELLO" to 741741 (Crisis Text Line). No phone call. No voice. Just text.' },
  { id: 98, category: 'crisis', skill: 'Get in a cold shower. Not warm. Cold. It interrupts everything happening in your nervous system right now.' },
  { id: 99, category: 'crisis', skill: 'Drive to a parking lot. Sit in your car. Do not go inside anywhere. Give it 20 minutes. The lot is safer than the bar.' },
  { id: 100, category: 'crisis', skill: 'If you have shaking, sweating, racing heart, or confusion — that may be withdrawal. Go to urgent care now. This is medical, not moral.' },
];
