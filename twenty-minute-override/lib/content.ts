// ============================================================
// 20-Minute Override — All content lives here. Edit freely.
// ============================================================

export const CRAVING_TYPES = [
  { id: "relief",     label: "I want relief" },
  { id: "numb",       label: "I want to numb out" },
  { id: "angry",      label: "I'm angry" },
  { id: "grief",      label: "I'm grieving" },
  { id: "bored",      label: "I'm bored" },
  { id: "unsafe",     label: "I feel unsafe / activated" },
  { id: "habit",      label: "It's habit time" },
  { id: "withdrawal", label: "I might be in withdrawal" },
];

export const WITHDRAWAL_WARNING = {
  title:  "This may be medical, not willpower.",
  body:   "If you have shakes, sweating, racing heart, confusion, hallucinations, seizures, severe vomiting, or you need alcohol to function — get medical help now.",
  action: "Call a doctor, urgent care, detox center, or SAMHSA:",
  phone:  "1-800-662-HELP",
};

export const TASKS = [
  "Drink water or electrolytes.",
  "Eat something with protein or salt.",
  "Take a hot shower.",
  "Hold ice for 30 seconds.",
  "Step outside for 3 minutes.",
  "Brush your teeth.",
  "Make a replacement drink.",
  "Put on one song and move.",
  'Text someone: "Distract me for 10 minutes."',
  "Sit down and put both feet on the floor.",
  "Name 5 things you see right now.",
  "Make tea, soup, or broth.",
  "Put your keys away and avoid the store.",
  "Change rooms immediately.",
  "Splash cold water on your face.",
];

// ── Agency cards shown in the rotating timer ──────────────────────────────────
// Edit freely. Order matters — card 0 shows first, card 4 shows last.
export interface AgencyCard {
  title: string;
  body:  string;
}

export const AGENCY_CARDS: AgencyCard[] = [
  {
    title: "Do not hand them tonight too.",
    body:  "Drinking will not undo what happened. Protect the next 20 minutes.",
  },
  {
    title: "The past already took enough.",
    body:  "Do not let a craving collect more from you tonight.",
  },
  {
    title: "What happened happened.",
    body:  "Drinking will not rewrite it. This next choice is still yours.",
  },
  {
    title: "Fall down seven times. Stand up eight.",
    body:  "A craving is not a command. It is a noisy little liar.",
  },
  {
    title: "Do not pay interest on old pain.",
    body:  "Alcohol borrows relief from tomorrow and charges extra.",
  },
];

// ── Truth cards for the Explore section deck ──────────────────────────────────
export interface TruthCard {
  title?: string;
  body:   string;
}

export const TRUTH_CARDS: TruthCard[] = [
  { body: "The first drink is the trap door." },
  { body: "Your trauma explains the craving. It does not make alcohol safe now." },
  { body: "You are not weak. You are in a loop. Interrupt the loop." },
  { body: "You can be skeptical and still make the next right move." },
  { body: "Alcohol may have helped you survive before. That does not mean it is safe to keep using now." },
  { body: "The craving will pass whether you obey it or not." },
  { body: "Bad deal: temporary relief, bigger consequences." },
  // Agency cards also live in the deck
  { title: "Do not hand them tonight too.",         body: "Drinking will not undo what happened. Protect the next 20 minutes." },
  { title: "The past already took enough.",         body: "Do not let a craving collect more from you tonight." },
  { title: "What happened happened.",               body: "Drinking will not rewrite it. This next choice is still yours." },
  { title: "Fall down seven times. Stand up eight.", body: "A craving is not a command. It is a noisy little liar." },
  { title: "Do not pay interest on old pain.",      body: "Alcohol borrows relief from tomorrow and charges extra." },
];

export const RECEIPT_PROMISES = [
  "relief", "sleep", "numbness", "reward", "silence", "confidence", "escape",
];

export const RECEIPT_OUTCOMES = [
  "more drinks", "bad sleep", "regret texting", "shame", "anxiety", "pain", "medical risk",
];

export const TEXT_SCRIPTS = [
  {
    id:    "distract",
    label: "Distract me",
    text:  "I'm having a craving. I don't need advice, just distract me for 10 minutes.",
  },
  {
    id:    "phone",
    label: "Stay on the phone",
    text:  "I'm trying not to drink tonight. Can you stay on the phone with me for a few?",
  },
  {
    id:    "grief",
    label: "Missing someone",
    text:  "I'm missing someone / thinking about old stuff and it's making me want to drink. Can you sit with me for a minute?",
  },
  {
    id:    "withdrawal",
    label: "Withdrawal help",
    text:  "I may be having withdrawal symptoms and need help getting medical advice.",
  },
];

export const REPLACEMENT_DRINKS = [
  { name: "Ginger beer + lime + ice",         emoji: "🫚" },
  { name: "Tart cherry juice + seltzer",       emoji: "🍒" },
  { name: "Iced tea + lemon",                  emoji: "🍋" },
  { name: "Hot tea + honey",                   emoji: "🍵" },
  { name: "Cucumber lime water",               emoji: "🥒" },
  { name: "Soup or broth",                     emoji: "🍲" },
  { name: "Sour candy / pickles / spicy snack", emoji: "🌶️" },
];

export const GRIEF_STEPS = [
  "Write one sentence to the person you miss.",
  "Play one song that feels right.",
  "Light a candle.",
  "Cry in the shower if you need to.",
  "Text someone safe.",
];

export const ASSHOLE_TRASH_TALK = [
  "Just one won't hurt ya, kid.",
  "You deserve it after today.",
  "C'mon, it's practically medicinal.",
  "Nobody has to know.",
  "You've been so good. Take a break.",
  "One drink ain't a relapse.",
  "You'll be fine. You always are.",
  "You can quit again tomorrow.",
  "It's just a few beers.",
];
