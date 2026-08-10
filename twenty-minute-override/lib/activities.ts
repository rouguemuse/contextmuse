// ────────────────────────────────────────────────────────────────────
// Activity registry — pure metadata, no React imports.
// Add a new entry here + a matching component to extend the deck.
// ────────────────────────────────────────────────────────────────────

export type Category = 'fast' | 'grief-anger' | 'funny' | 'ritual' | 'text' | 'medical';

export interface ActivityMeta {
  id:       string;
  title:    string;
  tagline:  string;
  category: Category;
  color:    string;   // per-card accent color
  emoji:    string;
}

export const CATEGORY_LABELS: Record<Category, string> = {
  'fast':        '⚡ Fast Reset',
  'grief-anger': '🔥 Grief / Anger',
  'funny':       '💀 Dark Humor',
  'ritual':      '🍵 Ritual',
  'text':        '📱 Text Someone',
  'medical':     '⚕ Medical',
};

export const CATEGORY_COLORS: Record<Category, string> = {
  'fast':        '#2dd4bf',
  'grief-anger': '#ef4444',
  'funny':       '#a78bfa',
  'ritual':      '#34d399',
  'text':        '#60a5fa',
  'medical':     '#fbbf24',
};

export const ACTIVITIES: ActivityMeta[] = [
  {
    id: 'goblin',
    title: 'Explode a Goblin',
    tagline: 'The craving is lying. Blow up the lie.',
    category: 'funny',
    color: '#a78bfa',
    emoji: '💀',
  },
  {
    id: 'punch-banker',
    title: 'Punch the Banker',
    tagline: 'Do not pay interest on old pain.',
    category: 'grief-anger',
    color: '#c4e538',
    emoji: '💥',
  },
  {
    id: 'defuse-bomb',
    title: 'Defuse the Craving Bomb',
    tagline: 'Urgency is not truth. Defuse it in 3 steps.',
    category: 'fast',
    color: '#f97316',
    emoji: '💣',
  },
  {
    id: 'feed-shark',
    title: 'Feed the Shark',
    tagline: 'Give the craving something that is not alcohol.',
    category: 'ritual',
    color: '#06b6d4',
    emoji: '🦈',
  },
  {
    id: 'rage-converter',
    title: 'Rage-to-Task',
    tagline: 'Pick your state. Get one real task.',
    category: 'grief-anger',
    color: '#ef4444',
    emoji: '🔥',
  },
  {
    id: 'mad-lib',
    title: 'The Craving Is Full of Shit',
    tagline: 'Fill this out badly. Rage counts as grammar.',
    category: 'funny',
    color: '#ec4899',
    emoji: '📝',
  },
  {
    id: 'coping',
    title: 'Random Coping Skill',
    tagline: '100 options. Filter by what you need.',
    category: 'fast',
    color: '#2dd4bf',
    emoji: '🎲',
  },
  {
    id: 'truth-cards',
    title: 'Truth Cards',
    tagline: 'The craving is a liar. Read the truth.',
    category: 'fast',
    color: '#818cf8',
    emoji: '🃏',
  },
  {
    id: 'craving-namer',
    title: 'Name Your Craving',
    tagline: 'Give the monster a name. Watch it shrink.',
    category: 'funny',
    color: '#fb923c',
    emoji: '👹',
  },
  {
    id: 'ritual',
    title: 'Replacement Ritual',
    tagline: 'Replace the ritual, not just the liquid.',
    category: 'ritual',
    color: '#34d399',
    emoji: '🍵',
  },
  {
    id: 'text-help',
    title: 'Text Help',
    tagline: 'You do not have to explain. Just send it.',
    category: 'text',
    color: '#60a5fa',
    emoji: '📱',
  },
  {
    id: 'receipt',
    title: 'Craving Receipt',
    tagline: 'What the craving is actually selling you.',
    category: 'funny',
    color: '#94a3b8',
    emoji: '🧾',
  },
  {
    id: 'grief',
    title: 'Grief Protocol',
    tagline: 'For when it is more than a craving.',
    category: 'grief-anger',
    color: '#818cf8',
    emoji: '💔',
  },
  {
    id: 'punch-game',
    title: 'Punch the Assholes',
    tagline: 'Nervous system needs to discharge something.',
    category: 'grief-anger',
    color: '#f87171',
    emoji: '🥊',
  },
];
