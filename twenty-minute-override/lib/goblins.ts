export interface Goblin {
  id: string;
  name: string;
  lie: string;
  reality: string;
  action: string;
  color: string;
}

export const GOBLINS: Goblin[] = [
  {
    id: 'just-one-imp',
    name: 'The Just-One Imp',
    lie: 'Just one won\'t count.',
    reality: 'The first drink is the trap door.',
    action: 'Start the 20-minute timer and make a replacement drink.',
    color: '#a78bfa',
  },
  {
    id: 'gary',
    name: 'Gary the Goblin',
    lie: 'You deserve it after today.',
    reality: 'You deserve relief that does not hurt your liver.',
    action: 'Take a hot shower or hold ice for 30 seconds.',
    color: '#34d399',
  },
  {
    id: 'liver-gremlin',
    name: 'Liver Gremlin',
    lie: 'You\'re not that sick.',
    reality: 'Cirrhosis changes the stakes. This is not low-consequence anymore.',
    action: 'Text someone and drink something that is not that.',
    color: '#fb923c',
  },
  {
    id: 'grief-goblin',
    name: 'Grief Goblin',
    lie: 'This will make the grief quieter.',
    reality: 'It may numb tonight and punish tomorrow.',
    action: 'Play one song, write one sentence to the person you miss, then restart the timer.',
    color: '#818cf8',
  },
  {
    id: 'captain-bad-idea',
    name: 'Captain Bad Idea',
    lie: 'You can stop tomorrow.',
    reality: 'Tomorrow gets easier if you interrupt tonight.',
    action: 'Eat something with protein or salt. Drink water.',
    color: '#f87171',
  },
  {
    id: 'sleep-liar',
    name: 'The Sleep Liar',
    lie: 'You need it to sleep.',
    reality: 'Alcohol knocks you out but wrecks sleep quality.',
    action: 'Tea, shower, blanket, phone down.',
    color: '#38bdf8',
  },
  {
    id: 'bargaining-rat',
    name: 'The Bargaining Rat',
    lie: 'Nobody will know.',
    reality: 'Your body will know.',
    action: 'Brush your teeth and avoid the store route.',
    color: '#94a3b8',
  },
  {
    id: 'drama-goblin',
    name: 'Drama Goblin',
    lie: 'You already messed up, so who cares?',
    reality: 'A slip does not require a spiral.',
    action: 'Reset the next 20 minutes. No self-destruction tax.',
    color: '#fb7185',
  },
];

export function getRandomGoblin(exclude?: string): Goblin {
  const pool = exclude ? GOBLINS.filter(g => g.id !== exclude) : GOBLINS;
  return pool[Math.floor(Math.random() * pool.length)];
}
