'use client';

import { useState, useCallback } from 'react';

// ─── Creature Types ────────────────────────────────────────────────────────────
const CREATURE_TYPES = [
  {
    type: 'goblin',
    label: 'Goblin',
    emoji: '👺',
    specialty: 'Habit cravings. Shows up at the same time every day. Very punctual.',
    color: '#84cc16',
    draw: (c: string) => (
      <svg width="80" height="110" viewBox="0 0 100 130">
        {/* Pointy ears */}
        <polygon points="22,42 14,22 30,38" fill={c} />
        <polygon points="78,42 86,22 70,38" fill={c} />
        {/* Head */}
        <ellipse cx="50" cy="48" rx="26" ry="24" fill="none" stroke={c} strokeWidth="3" />
        {/* Big nose */}
        <ellipse cx="50" cy="52" rx="7" ry="5" fill="none" stroke={c} strokeWidth="2" />
        <circle cx="47" cy="51" r="1.5" fill={c} />
        <circle cx="53" cy="51" r="1.5" fill={c} />
        {/* Wide grin with teeth */}
        <path d="M 37 62 Q 50 72 63 62" stroke={c} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <line x1="43" y1="63" x2="43" y2="68" stroke={c} strokeWidth="1.5" />
        <line x1="50" y1="65" x2="50" y2="70" stroke={c} strokeWidth="1.5" />
        <line x1="57" y1="63" x2="57" y2="68" stroke={c} strokeWidth="1.5" />
        {/* Beady eyes */}
        <circle cx="40" cy="44" r="5" fill="none" stroke={c} strokeWidth="2" />
        <circle cx="60" cy="44" r="5" fill="none" stroke={c} strokeWidth="2" />
        <circle cx="41" cy="44" r="2" fill={c} />
        <circle cx="61" cy="44" r="2" fill={c} />
        {/* Body */}
        <line x1="50" y1="72" x2="50" y2="100" stroke={c} strokeWidth="3" strokeLinecap="round" />
        {/* Arms reaching out */}
        <path d="M 50 80 L 24 70 M 50 80 L 76 70" stroke={c} strokeWidth="2.5" strokeLinecap="round" fill="none" />
        {/* Little clawed hands */}
        <path d="M 24 70 L 20 66 M 24 70 L 18 70 M 24 70 L 20 74" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 76 70 L 80 66 M 76 70 L 82 70 M 76 70 L 80 74" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
        {/* Legs */}
        <path d="M 50 100 L 36 118 M 50 100 L 64 118" stroke={c} strokeWidth="2.5" strokeLinecap="round" fill="none" />
        {/* Shadow */}
        <ellipse cx="50" cy="122" rx="16" ry="3" fill={c} opacity="0.15" />
      </svg>
    ),
  },
  {
    type: 'gremlin',
    label: 'Gremlin',
    emoji: '🦇',
    specialty: 'Night cravings. Activates at sundown. Hates when you go to bed sober.',
    color: '#a855f7',
    draw: (c: string) => (
      <svg width="80" height="110" viewBox="0 0 100 130">
        {/* Bat ears */}
        <path d="M 28 38 L 18 12 L 38 30 Z" fill="none" stroke={c} strokeWidth="2.5" />
        <path d="M 72 38 L 82 12 L 62 30 Z" fill="none" stroke={c} strokeWidth="2.5" />
        {/* Head - rounder */}
        <circle cx="50" cy="50" r="24" fill="none" stroke={c} strokeWidth="3" />
        {/* Huge eyes */}
        <circle cx="40" cy="46" r="8" fill="none" stroke={c} strokeWidth="2.5" />
        <circle cx="60" cy="46" r="8" fill="none" stroke={c} strokeWidth="2.5" />
        <circle cx="40" cy="47" r="4" fill={c} />
        <circle cx="60" cy="47" r="4" fill={c} />
        {/* Shine dots */}
        <circle cx="37" cy="44" r="1.5" fill="#1a2d42" />
        <circle cx="57" cy="44" r="1.5" fill="#1a2d42" />
        {/* Tiny nose */}
        <path d="M 47 54 L 50 58 L 53 54" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
        {/* Grin */}
        <path d="M 38 63 Q 50 70 62 63" stroke={c} strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* Spiky hair */}
        <path d="M 30 34 L 34 22 L 40 34" stroke={c} strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M 42 30 L 46 16 L 52 30" stroke={c} strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M 58 30 L 64 18 L 68 32" stroke={c} strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* Tiny body */}
        <line x1="50" y1="74" x2="50" y2="96" stroke={c} strokeWidth="3" strokeLinecap="round" />
        {/* Wing-arms */}
        <path d="M 50 80 Q 30 72 20 82 Q 30 75 50 82" stroke={c} strokeWidth="2" fill="none" />
        <path d="M 50 80 Q 70 72 80 82 Q 70 75 50 82" stroke={c} strokeWidth="2" fill="none" />
        {/* Legs */}
        <path d="M 50 96 L 40 114 M 50 96 L 60 114" stroke={c} strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <ellipse cx="50" cy="118" rx="14" ry="3" fill={c} opacity="0.12" />
      </svg>
    ),
  },
  {
    type: 'ghost',
    label: 'Disappointment Specter',
    emoji: '👻',
    specialty: 'Grief cravings. Not actually a craving. Just a feeling that got very large.',
    color: '#94a3b8',
    draw: (c: string) => (
      <svg width="80" height="110" viewBox="0 0 100 130">
        {/* Wispy body */}
        <path
          d="M 26 50 Q 26 20 50 18 Q 74 20 74 50 L 74 100 Q 68 94 62 100 Q 56 94 50 100 Q 44 94 38 100 Q 32 94 26 100 Z"
          fill="none" stroke={c} strokeWidth="2.5" opacity="0.7"
        />
        {/* Sad eyes */}
        <ellipse cx="40" cy="48" rx="6" ry="7" fill="none" stroke={c} strokeWidth="2" />
        <ellipse cx="60" cy="48" rx="6" ry="7" fill="none" stroke={c} strokeWidth="2" />
        <ellipse cx="40" cy="50" rx="3" ry="4" fill={c} opacity="0.8" />
        <ellipse cx="60" cy="50" rx="3" ry="4" fill={c} opacity="0.8" />
        {/* Downturned mouth */}
        <path d="M 40 66 Q 50 62 60 66" stroke={c} strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* Wavy bottom */}
        <path d="M 26 100 Q 30 108 34 100 Q 38 108 42 100 Q 46 108 50 100"
          stroke={c} strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* Tear drops */}
        <ellipse cx="37" cy="58" rx="2" ry="3" fill={c} opacity="0.5" />
        <ellipse cx="63" cy="58" rx="2" ry="3" fill={c} opacity="0.5" />
        {/* Little floaty hands */}
        <circle cx="18" cy="72" r="6" fill="none" stroke={c} strokeWidth="2" opacity="0.6" />
        <circle cx="82" cy="72" r="6" fill="none" stroke={c} strokeWidth="2" opacity="0.6" />
        <ellipse cx="50" cy="118" rx="14" ry="2.5" fill={c} opacity="0.08" />
      </svg>
    ),
  },
  {
    type: 'raccoon',
    label: 'Raccoon in a Trenchcoat',
    emoji: '🦝',
    specialty: 'Boredom cravings. Has a plan. The plan is bad. It is confident anyway.',
    color: '#64748b',
    draw: (c: string) => (
      <svg width="80" height="110" viewBox="0 0 100 130">
        {/* Trenchcoat */}
        <path d="M 28 72 L 22 115 L 35 115 L 40 90 L 50 92 L 60 90 L 65 115 L 78 115 L 72 72 Z"
          fill="none" stroke={c} strokeWidth="2.5" />
        {/* Coat lapels */}
        <path d="M 40 72 L 44 84 L 50 80 L 56 84 L 60 72" stroke={c} strokeWidth="2" fill="none" />
        {/* Head */}
        <ellipse cx="50" cy="50" rx="22" ry="20" fill="none" stroke={c} strokeWidth="3" />
        {/* Mask markings */}
        <ellipse cx="40" cy="48" rx="9" ry="7" fill="none" stroke={c} strokeWidth="2.5" />
        <ellipse cx="60" cy="48" rx="9" ry="7" fill="none" stroke={c} strokeWidth="2.5" />
        {/* Eyes */}
        <circle cx="40" cy="48" r="4" fill={c} opacity="0.9" />
        <circle cx="60" cy="48" r="4" fill={c} opacity="0.9" />
        <circle cx="38" cy="46" r="1.5" fill="#1a2d42" />
        <circle cx="58" cy="46" r="1.5" fill="#1a2d42" />
        {/* Nose */}
        <ellipse cx="50" cy="56" rx="4" ry="3" fill={c} />
        {/* Whiskers */}
        <line x1="26" y1="54" x2="42" y2="56" stroke={c} strokeWidth="1.5" opacity="0.7" />
        <line x1="26" y1="58" x2="42" y2="58" stroke={c} strokeWidth="1.5" opacity="0.7" />
        <line x1="58" y1="56" x2="74" y2="54" stroke={c} strokeWidth="1.5" opacity="0.7" />
        <line x1="58" y1="58" x2="74" y2="58" stroke={c} strokeWidth="1.5" opacity="0.7" />
        {/* Smirk */}
        <path d="M 42 62 Q 50 68 60 63" stroke={c} strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* Pointy ears */}
        <polygon points="34,34 28,18 42,30" fill="none" stroke={c} strokeWidth="2.5" />
        <polygon points="66,34 72,18 58,30" fill="none" stroke={c} strokeWidth="2.5" />
        {/* Arms/paws out of coat */}
        <path d="M 28 82 L 14 76" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="12" cy="75" r="5" fill="none" stroke={c} strokeWidth="2" />
        <path d="M 72 82 L 86 76" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="88" cy="75" r="5" fill="none" stroke={c} strokeWidth="2" />
        {/* Striped tail suggestion */}
        <path d="M 64 110 Q 78 102 80 90 Q 82 78 74 74" stroke={c} strokeWidth="2" fill="none" strokeLinecap="round" />
        <ellipse cx="50" cy="120" rx="16" ry="3" fill={c} opacity="0.12" />
      </svg>
    ),
  },
  {
    type: 'troll',
    label: 'Stress Troll',
    emoji: '👹',
    specialty: 'Anger cravings. Very loud. Very short. Takes up enormous psychological space.',
    color: '#ef4444',
    draw: (c: string) => (
      <svg width="80" height="110" viewBox="0 0 100 130">
        {/* Horns */}
        <path d="M 34 30 L 28 8 L 42 26" fill="none" stroke={c} strokeWidth="3" strokeLinejoin="round" />
        <path d="M 66 30 L 72 8 L 58 26" fill="none" stroke={c} strokeWidth="3" strokeLinejoin="round" />
        {/* Big chunky head */}
        <ellipse cx="50" cy="50" rx="28" ry="26" fill="none" stroke={c} strokeWidth="3" />
        {/* Thick brow furrowed */}
        <path d="M 30 40 L 44 44" stroke={c} strokeWidth="4" strokeLinecap="round" />
        <path d="M 56 44 L 70 40" stroke={c} strokeWidth="4" strokeLinecap="round" />
        {/* Angry eyes */}
        <circle cx="40" cy="49" r="6" fill="none" stroke={c} strokeWidth="2.5" />
        <circle cx="60" cy="49" r="6" fill="none" stroke={c} strokeWidth="2.5" />
        <circle cx="40" cy="50" r="3" fill={c} />
        <circle cx="60" cy="50" r="3" fill={c} />
        {/* Flared nostrils */}
        <ellipse cx="45" cy="58" rx="4" ry="3" fill="none" stroke={c} strokeWidth="2" />
        <ellipse cx="55" cy="58" rx="4" ry="3" fill="none" stroke={c} strokeWidth="2" />
        {/* Snarl */}
        <path d="M 34 66 L 38 70 L 44 65 L 50 70 L 56 65 L 62 70 L 66 66" stroke={c} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        {/* Squat body */}
        <line x1="50" y1="76" x2="50" y2="98" stroke={c} strokeWidth="4" strokeLinecap="round" />
        {/* Big arms */}
        <path d="M 50 82 L 20 68 M 50 82 L 80 68" stroke={c} strokeWidth="3.5" strokeLinecap="round" fill="none" />
        {/* Fists */}
        <rect x="12" y="62" width="12" height="10" rx="3" fill="none" stroke={c} strokeWidth="2.5" />
        <rect x="76" y="62" width="12" height="10" rx="3" fill="none" stroke={c} strokeWidth="2.5" />
        {/* Short stumpy legs */}
        <path d="M 50 98 L 38 116 M 50 98 L 62 116" stroke={c} strokeWidth="3" strokeLinecap="round" fill="none" />
        {/* Rage lines */}
        <line x1="20" y1="36" x2="28" y2="42" stroke={c} strokeWidth="1.5" opacity="0.5" />
        <line x1="80" y1="36" x2="72" y2="42" stroke={c} strokeWidth="1.5" opacity="0.5" />
        <line x1="18" y1="42" x2="27" y2="46" stroke={c} strokeWidth="1" opacity="0.3" />
        <ellipse cx="50" cy="120" rx="16" ry="3" fill={c} opacity="0.12" />
      </svg>
    ),
  },
  {
    type: 'blob',
    label: 'Sentient Wet Sock',
    emoji: '🧦',
    specialty: 'Numbness cravings. Not even ambitious. Just wants to exist differently.',
    color: '#2dd4bf',
    draw: (c: string) => (
      <svg width="80" height="110" viewBox="0 0 100 130">
        {/* Amorphous blob body */}
        <path
          d="M 22 70 Q 18 45 30 35 Q 40 24 50 26 Q 62 24 70 35 Q 84 46 78 70 Q 82 90 72 105 Q 62 118 50 116 Q 38 118 28 105 Q 18 90 22 70 Z"
          fill="none" stroke={c} strokeWidth="2.5" opacity="0.8"
        />
        {/* Droopy sad eyes */}
        <circle cx="40" cy="58" r="7" fill="none" stroke={c} strokeWidth="2" />
        <circle cx="60" cy="58" r="7" fill="none" stroke={c} strokeWidth="2" />
        {/* Half-closed lids */}
        <path d="M 33 55 Q 40 52 47 55" stroke={c} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M 53 55 Q 60 52 67 55" stroke={c} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <circle cx="40" cy="60" r="3.5" fill={c} opacity="0.9" />
        <circle cx="60" cy="60" r="3.5" fill={c} opacity="0.9" />
        {/* Flat line mouth */}
        <line x1="40" y1="74" x2="60" y2="74" stroke={c} strokeWidth="2" strokeLinecap="round" />
        {/* Tiny nub arms */}
        <path d="M 22 75 Q 14 72 16 80 Q 18 86 24 82" stroke={c} strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M 78 75 Q 86 72 84 80 Q 82 86 76 82" stroke={c} strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* Drip */}
        <path d="M 50 116 Q 50 122 50 126" stroke={c} strokeWidth="2" opacity="0.4" strokeLinecap="round" />
        <circle cx="50" cy="127" r="2.5" fill={c} opacity="0.3" />
        <ellipse cx="50" cy="120" rx="14" ry="2.5" fill={c} opacity="0.12" />
      </svg>
    ),
  },
  {
    type: 'cryptid',
    label: 'Cryptid of Self-Doubt',
    emoji: '🔮',
    specialty: 'Shame spirals dressed as cravings. Three eyes because it watches everything you do.',
    color: '#6366f1',
    draw: (c: string) => (
      <svg width="80" height="110" viewBox="0 0 100 130">
        {/* Tentacle suggestions */}
        <path d="M 20 90 Q 10 80 14 68 Q 18 56 24 62" stroke={c} strokeWidth="2" fill="none" opacity="0.5" strokeLinecap="round" />
        <path d="M 80 90 Q 90 80 86 68 Q 82 56 76 62" stroke={c} strokeWidth="2" fill="none" opacity="0.5" strokeLinecap="round" />
        <path d="M 26 104 Q 16 100 16 110 Q 16 118 24 114" stroke={c} strokeWidth="2" fill="none" opacity="0.4" />
        <path d="M 74 104 Q 84 100 84 110 Q 84 118 76 114" stroke={c} strokeWidth="2" fill="none" opacity="0.4" />
        {/* Head - slightly wrong oval */}
        <ellipse cx="50" cy="52" rx="26" ry="28" fill="none" stroke={c} strokeWidth="2.5" />
        {/* Three eyes */}
        <circle cx="36" cy="48" r="7" fill="none" stroke={c} strokeWidth="2" />
        <circle cx="64" cy="48" r="7" fill="none" stroke={c} strokeWidth="2" />
        <circle cx="50" cy="36" r="6" fill="none" stroke={c} strokeWidth="2" />
        {/* Pupils */}
        <ellipse cx="36" cy="49" rx="3" ry="4" fill={c} />
        <ellipse cx="64" cy="49" rx="3" ry="4" fill={c} />
        <ellipse cx="50" cy="37" rx="2.5" ry="3.5" fill={c} />
        {/* Bioluminescent shine */}
        <circle cx="34" cy="46" r="1.5" fill="#1a2d42" />
        <circle cx="62" cy="46" r="1.5" fill="#1a2d42" />
        <circle cx="48" cy="34" r="1.2" fill="#1a2d42" />
        {/* Strange mouth - sideways? */}
        <path d="M 38 66 Q 44 62 50 66 Q 56 70 62 66" stroke={c} strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* Body - amorphous */}
        <path d="M 30 80 Q 20 88 24 100 Q 28 112 50 116 Q 72 112 76 100 Q 80 88 70 80 L 70 78 L 30 78 Z"
          fill="none" stroke={c} strokeWidth="2.5" opacity="0.75" />
        <ellipse cx="50" cy="120" rx="15" ry="3" fill={c} opacity="0.12" />
      </svg>
    ),
  },
  {
    type: 'rat',
    label: 'Corporate Rat',
    emoji: '🐀',
    specialty: 'Work stress cravings. Wears a tie. Has quarterly goals. They are not about you.',
    color: '#f59e0b',
    draw: (c: string) => (
      <svg width="80" height="110" viewBox="0 0 100 130">
        {/* Round ears */}
        <circle cx="32" cy="28" r="12" fill="none" stroke={c} strokeWidth="2.5" />
        <circle cx="68" cy="28" r="12" fill="none" stroke={c} strokeWidth="2.5" />
        <circle cx="32" cy="28" r="7" fill="none" stroke={c} strokeWidth="1.5" opacity="0.5" />
        <circle cx="68" cy="28" r="7" fill="none" stroke={c} strokeWidth="1.5" opacity="0.5" />
        {/* Round rat head */}
        <circle cx="50" cy="52" r="24" fill="none" stroke={c} strokeWidth="3" />
        {/* Whiskers */}
        <line x1="20" y1="52" x2="38" y2="54" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="20" y1="56" x2="38" y2="56" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="20" y1="60" x2="38" y2="58" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="62" y1="54" x2="80" y2="52" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="62" y1="56" x2="80" y2="56" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="62" y1="58" x2="80" y2="60" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
        {/* Eyes - shifty */}
        <circle cx="40" cy="48" r="5" fill="none" stroke={c} strokeWidth="2" />
        <circle cx="60" cy="48" r="5" fill="none" stroke={c} strokeWidth="2" />
        <circle cx="41" cy="48" r="2.5" fill={c} />
        <circle cx="61" cy="48" r="2.5" fill={c} />
        {/* Pointed snout */}
        <ellipse cx="50" cy="60" rx="6" ry="4" fill="none" stroke={c} strokeWidth="2" />
        <circle cx="48" cy="59" r="1.5" fill={c} />
        <circle cx="52" cy="59" r="1.5" fill={c} />
        {/* Smile */}
        <path d="M 42 65 Q 50 70 58 65" stroke={c} strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* Suit body */}
        <path d="M 30 76 L 24 112 L 40 112 L 44 92 L 50 94 L 56 92 L 60 112 L 76 112 L 70 76 Z"
          fill="none" stroke={c} strokeWidth="2.5" />
        {/* Tie */}
        <path d="M 46 76 L 48 82 L 50 80 L 52 82 L 54 76" stroke={c} strokeWidth="1.5" fill="none" />
        <path d="M 48 82 L 47 94 L 50 98 L 53 94 L 52 82 Z" fill="none" stroke={c} strokeWidth="1.5" />
        {/* Briefcase */}
        <rect x="62" y="86" width="14" height="10" rx="2" fill="none" stroke={c} strokeWidth="2" />
        <path d="M 65 86 L 65 83 L 73 83 L 73 86" stroke={c} strokeWidth="1.5" fill="none" />
        {/* Tail */}
        <path d="M 50 112 Q 40 118 36 126" stroke={c} strokeWidth="2" fill="none" opacity="0.5" strokeLinecap="round" />
        <ellipse cx="50" cy="116" rx="16" ry="3" fill={c} opacity="0.12" />
      </svg>
    ),
  },
];

// ─── Name pools ────────────────────────────────────────────────────────────────
const NAMES = [
  'Gerald', 'Brenda', 'Todd', 'Karen', 'Craig', 'Tammy',
  'Steve', 'Denise', 'Biff', 'Ronda', 'Dale', 'Sheri',
  'Norm', 'Vicky', 'Earl', 'Pam', 'Clint', 'Debra',
  'Randy', 'Joyce', 'Gary', 'Janet', 'Doug', 'Linda',
  'Marv', 'Wanda', 'Skip', 'Cheryl', 'Dwayne', 'Phyllis',
];

const SMELLS = [
  'gas station hot dog and low expectations',
  'broken promises and CVS brand cologne',
  'a vending machine at 2am',
  'the carpet of a regional casino',
  'regret and Cool Ranch Doritos',
  'a rental car that has seen things',
  'a waiting room in a bad building',
  'a Tuesday in November',
  'mild defeat and microwave popcorn',
  'whatever "desperation" smells like',
  'the inside of an old gym bag',
  'stale birthday cake and unresolved trauma',
];

const VEHICLES = [
  'your nervous system (unauthorized use)',
  'a grocery cart with one broken wheel',
  'your 3am thought spiral',
  'an old emotional flashback',
  'your kitchen, after dark',
  `the gap between "I'm fine" and actually being fine`,
  'a 2003 Pontiac with one working window',
  'that specific part of your brain that tracks anniversaries',
];

const KNOWN_ASSOCIATES = [
  ['Shame', 'Bad Sleep', '3am Regret'],
  ['Self-Doubt', 'Loud Thoughts', "Tomorrow's Headache"],
  ['The Spiral', 'Empty Promises', 'Morning Regret'],
  ['That One Memory', 'Catastrophizing', 'The Shakes'],
  ['Guilt', 'More Guilt', 'Bonus Guilt'],
  ["Yesterday's Argument", 'What-Ifs', 'Dehydration'],
  ['False Relief', 'Boredom', 'The Loop'],
  ['The Anniversary', 'The Couch', 'That Song'],
];

const WEAPONS = [
  '"You deserve it." — You deserve better.',
  '"Just this once." — It is never just this once.',
  '"Nobody will know." — You will know.',
  '"You\'ve had a hard day." — The liver hasn\'t.',
  '"One won\'t hurt." — Narrator: it did.',
  '"You already messed up today anyway." — False.',
  '"You can quit again tomorrow." — You can start again right now.',
  '"It\'s the only thing that helps." — It stopped helping a while ago.',
];

const DISMISSALS = [
  (name: string) => `${name} has logged off. ${name} will try again later. You have the rest of tonight.`,
  (name: string) => `${name} has been escorted from the premises. Security is your own prefrontal cortex.`,
  (name: string) => `${name} is now in the parking lot. ${name} can stay there.`,
  (name: string) => `${name} has been successfully ignored. This was not small. This was the whole thing.`,
  (name: string) => `HR has been notified about ${name}. ${name} is not your problem anymore tonight.`,
  (name: string) => `${name} has been voted off the island. The island is tonight. You win.`,
];

// ─── Helpers ───────────────────────────────────────────────────────────────────
const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

interface Profile {
  name: string;
  creature: typeof CREATURE_TYPES[0];
  smell: string;
  vehicle: string;
  associates: string[];
  weapon: string;
  dismissal: (name: string) => string;
  caseNum: number;
}

function generateProfile(): Profile {
  return {
    name: pick(NAMES),
    creature: pick(CREATURE_TYPES),
    smell: pick(SMELLS),
    vehicle: pick(VEHICLES),
    associates: pick(KNOWN_ASSOCIATES),
    weapon: pick(WEAPONS),
    dismissal: pick(DISMISSALS),
    caseNum: Math.floor(Math.random() * 90000) + 10000,
  };
}

function Row({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div style={{ display: 'flex', gap: 8, padding: '8px 0', borderBottom: '1px solid var(--navy-border)', alignItems: 'flex-start' }}>
      <span style={{ fontSize: '0.7rem', color: 'var(--muted-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', minWidth: 85, flexShrink: 0, paddingTop: 2 }}>
        {label}
      </span>
      <span style={{ fontSize: '0.87rem', color: color || 'var(--off-white)', lineHeight: 1.6 }}>
        {value}
      </span>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function CravingNamer() {
  const [profile, setProfile]     = useState<Profile | null>(null);
  const [ignored, setIgnored]     = useState(false);
  const [ignoreCount, setIgnoreCount] = useState(0);
  const [flying, setFlying]       = useState(false);
  const [showWhy, setShowWhy]     = useState(false);

  const generate = useCallback(() => {
    setProfile(generateProfile());
    setIgnored(false);
    setFlying(false);
    setShowWhy(false);
  }, []);

  const ignore = useCallback(() => {
    setFlying(true);
    setTimeout(() => {
      setIgnored(true);
      setIgnoreCount(c => c + 1);
    }, 500);
  }, []);

  const c = profile?.creature.color ?? 'var(--teal)';

  return (
    <div>
      <p className="muted text-sm" style={{ marginBottom: 6, lineHeight: 1.7 }}>
        Name it. Profile it. Make it ridiculous. A craving with a goblin face is harder to obey than an abstract feeling.
      </p>
      <p style={{ fontSize: '0.82rem', color: 'var(--teal)', fontWeight: 600, marginBottom: 18 }}>
        This is real therapy (ACT defusion). It just also happens to involve a raccoon in a trenchcoat.
      </p>

      <button className="btn btn-primary" onClick={generate} style={{ marginBottom: 20 }}>
        {profile ? '🎲 Different Craving' : '🎲 Meet Your Craving'}
      </button>

      {profile && (
        <div className="animate-in" style={{
          background: 'var(--navy-card)',
          border: `1px solid ${c}44`,
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
        }}>

          {/* Header */}
          <div style={{
            background: `${c}14`,
            borderBottom: `1px solid ${c}33`,
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 8,
          }}>
            <div>
              <div style={{ fontSize: '0.68rem', color: 'var(--muted-dim)', fontWeight: 700, letterSpacing: '0.08em' }}>
                CRAVING PROFILE · CASE #{profile.caseNum}
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: c, marginTop: 2, letterSpacing: '-0.02em' }}>
                {profile.name.toUpperCase()} {profile.creature.emoji}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: 2 }}>
                {profile.creature.label}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--muted-dim)', marginBottom: 2 }}>SPECIALTY</div>
              <div style={{ fontSize: '0.78rem', color: c, fontWeight: 600, maxWidth: 160, lineHeight: 1.4 }}>
                {profile.creature.specialty}
              </div>
            </div>
          </div>

          {/* Mugshot + stats */}
          <div style={{ padding: '16px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            {/* Mugshot box */}
            <div style={{
              background: '#0a1520',
              border: `2px solid ${c}55`,
              borderRadius: 8,
              padding: '8px 6px 4px',
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
              minWidth: 100,
            }}>
              <div style={{ fontSize: '0.6rem', color: c + '99', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 2 }}>
                MUGSHOT
              </div>
              <div style={{
                transition: 'transform 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55), opacity 0.4s ease',
                transform: flying ? 'translateY(-160px) rotate(25deg) scale(0.4)' : 'none',
                opacity: flying ? 0 : 1,
              }}>
                {profile.creature.draw(c)}
              </div>
              {flying && (
                <div style={{ fontSize: '2rem', position: 'absolute', top: '30%' }}>👋</div>
              )}
            </div>

            {/* Quick facts */}
            <div style={{ flex: 1 }}>
              <Row label="Smells Of"  value={profile.smell} color="var(--muted)" />
              <Row label="Arrived Via" value={profile.vehicle} />
              <Row label="Associates" value={profile.associates.join(' · ')} color="var(--muted)" />
            </div>
          </div>

          {/* Weapon + known tactic */}
          <div style={{ padding: '0 16px 16px' }}>
            <Row label="Weapon" value={profile.weapon} color="var(--warning)" />

            <div style={{
              marginTop: 14,
              padding: '12px',
              background: 'rgba(239, 68, 68, 0.07)',
              border: '1px solid rgba(239, 68, 68, 0.18)',
              borderRadius: 8,
              fontSize: '0.85rem',
              color: 'var(--text)',
              lineHeight: 1.65,
            }}>
              <span style={{ color: 'var(--danger)', fontWeight: 700 }}>Known tactic: </span>
              {profile.name} will tell you this situation is different from all the other times.{' '}
              {profile.name} has said this before.{' '}
              {profile.name} is not negotiating in good faith.
            </div>

            {/* Ignore button */}
            {!ignored && (
              <button
                className="btn btn-primary"
                onClick={ignore}
                disabled={flying}
                style={{ marginTop: 14, fontSize: '1.05rem', fontWeight: 900 }}
              >
                🖕 IGNORE {profile.name.toUpperCase()}
              </button>
            )}

            {/* Success state */}
            {ignored && (
              <div className="animate-in" style={{
                marginTop: 14,
                background: 'rgba(34, 197, 94, 0.09)',
                border: '1px solid rgba(34, 197, 94, 0.25)',
                borderRadius: 8,
                padding: '14px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '1.6rem', marginBottom: 6 }}>👋</div>
                <p style={{ fontWeight: 700, color: 'var(--success)', fontSize: '0.95rem', lineHeight: 1.5 }}>
                  {profile.dismissal(profile.name)}
                </p>
                {ignoreCount > 1 && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--teal)', marginTop: 8, fontWeight: 700 }}>
                    You have ignored {ignoreCount} of these. That is not nothing.
                  </p>
                )}
                <button className="btn btn-secondary" onClick={generate} style={{ width: '100%', marginTop: 12 }}>
                  Generate a new one
                </button>
              </div>
            )}

            {/* Why this works */}
            {!ignored && (
              <div style={{ marginTop: 14, borderTop: '1px solid var(--navy-border)', paddingTop: 10 }}>
                <button
                  onClick={() => setShowWhy(w => !w)}
                  style={{ background: 'none', border: 'none', color: 'var(--muted-dim)', fontSize: '0.75rem', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}
                >
                  {showWhy ? '▲' : '▼'} Why does naming a craving actually help?
                </button>
                {showWhy && (
                  <p className="animate-in" style={{ fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.7, marginTop: 8 }}>
                    This is <strong style={{ color: 'var(--teal)' }}>cognitive defusion</strong> from ACT therapy.
                    When you give a thought or urge a name and a ridiculous body, your brain stops treating it as a command
                    and starts treating it as noise. {profile.name} is not you.{' '}
                    {profile.name} is a {profile.creature.label.toLowerCase()} in your nervous system. Visitors can be ignored.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
