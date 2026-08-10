'use client';

import { useState, useRef } from 'react';
import { WITHDRAWAL_WARNING } from '@/lib/content';
import Timer from './components/Timer';
import PunchGame from './components/PunchGame';
import CopingGenerator from './components/CopingGenerator';
import CravingNamer from './components/CravingNamer';
import TruthCards from './components/TruthCards';
import CravingReceipt from './components/CravingReceipt';
import TextScripts from './components/TextScripts';
import ReplacementDrinks from './components/ReplacementDrinks';
import GriefSection from './components/GriefSection';
import CravingTypeSelector from './components/CravingTypeSelector';

// ─── Activity deck ────────────────────────────────────────────────────────────
const DECK_CARDS = [
  { id: 'punch',   title: 'Punch the Assholes',    tagline: 'Nervous system needs to discharge? Start here.',      color: '#f87171', emoji: '🥊' },
  { id: 'coping',  title: 'Random Coping Skill',   tagline: '100 options. Filter by what you need right now.',     color: '#2dd4bf', emoji: '🎲' },
  { id: 'namer',   title: 'Name Your Craving',     tagline: 'Give the monster a name. Watch it shrink.',           color: '#fb923c', emoji: '👹' },
  { id: 'truth',   title: 'Truth Cards',           tagline: 'The craving is a liar. Read the truth.',              color: '#818cf8', emoji: '🃏' },
  { id: 'receipt', title: 'Craving Receipt',       tagline: 'What the craving is actually selling you.',           color: '#94a3b8', emoji: '🧾' },
  { id: 'text',    title: 'Text Help',             tagline: 'You do not have to explain. Just send it.',           color: '#60a5fa', emoji: '📱' },
  { id: 'ritual',  title: 'Replacement Ritual',   tagline: 'Replace the ritual, not just the drink.',             color: '#34d399', emoji: '🍵' },
  { id: 'grief',   title: 'Grief Protocol',        tagline: 'For when it is more than a craving.',                 color: '#818cf8', emoji: '💔' },
  { id: 'type',    title: 'What Kind of Craving?', tagline: 'Name what you are actually feeling right now.',       color: '#fbbf24', emoji: '🔍' },
];

function ActivityDeck() {
  const [idx, setIdx] = useState(0);
  const [key, setKey] = useState(0);
  const [cravingType, setCravingType] = useState<string | null>(null);

  const goTo = (i: number) => {
    setIdx(((i % DECK_CARDS.length) + DECK_CARDS.length) % DECK_CARDS.length);
    setKey(k => k + 1);
  };

  const card = DECK_CARDS[idx];

  const renderActivity = () => {
    switch (card.id) {
      case 'punch':   return <PunchGame />;
      case 'coping':  return <CopingGenerator />;
      case 'namer':   return <CravingNamer />;
      case 'truth':   return <TruthCards />;
      case 'receipt': return <CravingReceipt />;
      case 'text':    return <TextScripts />;
      case 'ritual':  return <ReplacementDrinks />;
      case 'grief':   return <GriefSection />;
      case 'type':    return <CravingTypeSelector onSelect={setCravingType} selected={cravingType} />;
      default:        return null;
    }
  };

  return (
    <div>
      {/* Card wrapper */}
      <div style={{
        background: 'var(--navy-card)',
        border: '1px solid var(--navy-border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: `0 0 0 1px ${card.color}22, 0 4px 24px rgba(0,0,0,0.4)`,
      }}>
        {/* Accent bar */}
        <div style={{ height: 4, background: card.color }} />

        {/* Card header */}
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--navy-border)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: '1.4rem' }}>{card.emoji}</span>
          <div>
            <h3 style={{ color: card.color, fontSize: '1rem', fontWeight: 700, lineHeight: 1.3 }}>{card.title}</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: 2 }}>{card.tagline}</p>
          </div>
        </div>

        {/* Activity content — key forces remount on card change */}
        <div style={{ padding: '20px' }} key={key}>
          {renderActivity()}
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', gap: 8, marginTop: 10, alignItems: 'center' }}>
        <button className="btn btn-secondary" onClick={() => goTo(idx - 1)} style={{ flex: 1, padding: '10px', fontSize: '0.85rem' }}>
          ← Prev
        </button>
        <button className="btn btn-secondary" onClick={() => goTo(Math.floor(Math.random() * DECK_CARDS.length))} style={{ flex: 1, padding: '10px', fontSize: '0.85rem' }}>
          🔀
        </button>
        <span style={{ fontSize: '0.72rem', color: 'var(--muted-dim)', flex: 1, textAlign: 'center' }}>
          {idx + 1} / {DECK_CARDS.length}
        </span>
        <button className="btn btn-secondary" onClick={() => goTo(idx + 1)} style={{ flex: 1, padding: '10px', fontSize: '0.85rem' }}>
          Next →
        </button>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
type Screen = 'landing' | 'withdrawal' | 'override';

export default function CravingOverridePage() {
  const [screen, setScreen]           = useState<Screen>('landing');
  const [withdrawalAns, setWithdrawal] = useState<'no' | 'notsure' | 'yes' | null>(null);
  const [showDeck, setShowDeck]       = useState(false);
  const timerRef = useRef<HTMLDivElement>(null);

  const answerWithdrawal = (ans: 'no' | 'notsure' | 'yes') => {
    setWithdrawal(ans);
    setScreen('override');
  };

  const scrollToTimer = () =>
    timerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <>
      {/* ── Sticky header ──────────────────────────────────────────────────── */}
      <header className="sticky-header">
        <div>
          <h1>20-Minute Override</h1>
          <p>Delay the first drink. Interrupt the loop.</p>
        </div>
        <a href="tel:18006624357" style={{ color: 'var(--danger)', fontSize: '0.75rem', fontWeight: 700, textDecoration: 'none', textAlign: 'right', lineHeight: 1.4 }}>
          🚨 SAMHSA<br />1-800-662-HELP
        </a>
      </header>

      <div className="page-wrapper">

        {/* ── Landing ────────────────────────────────────────────────────────── */}
        {screen === 'landing' && (
          <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '32px 0' }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 6vw, 2.4rem)', marginBottom: 12, lineHeight: 1.15 }}>
              Having a craving right now?
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.7, marginBottom: 32 }}>
              You do not have to solve the whole problem.<br />
              You only have to get through the next 20 minutes.
            </p>
            <button className="btn btn-primary" onClick={() => setScreen('withdrawal')}>
              I&apos;m having a craving
            </button>
            <button
              className="btn btn-ghost"
              style={{ marginTop: 14 }}
              onClick={() => { setScreen('override'); setShowDeck(true); }}
            >
              Browse activities →
            </button>
          </div>
        )}

        {/* ── Withdrawal gate ────────────────────────────────────────────────── */}
        {screen === 'withdrawal' && (
          <div style={{ padding: '40px 0' }}>
            <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 20 }}>
              Safety check first
            </p>
            <h2 style={{ fontSize: 'clamp(1.05rem, 4vw, 1.35rem)', marginBottom: 16, lineHeight: 1.5 }}>
              Are you having shaking, sweating, racing heart, confusion, hallucinations, severe vomiting, seizure risk, or needing alcohol to function?
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 28 }}>
              <button className="btn btn-secondary" onClick={() => answerWithdrawal('no')}      style={{ padding: '18px', fontSize: '1.05rem' }}>No</button>
              <button className="btn btn-warning"   onClick={() => answerWithdrawal('notsure')} style={{ padding: '18px', fontSize: '1.05rem' }}>Not sure</button>
              <button className="btn btn-danger"    onClick={() => answerWithdrawal('yes')}     style={{ padding: '18px', fontSize: '1.05rem' }}>Yes</button>
            </div>
          </div>
        )}

        {/* ── Override mode ──────────────────────────────────────────────────── */}
        {screen === 'override' && (
          <div style={{ paddingTop: 24 }}>

            {/* Withdrawal warning — stays visible if flagged */}
            {(withdrawalAns === 'yes' || withdrawalAns === 'notsure') && (
              <div className="card-warning animate-in" style={{ marginBottom: 20 }}>
                <h3 style={{ color: 'var(--warning)', marginBottom: 8 }}>⚕ {WITHDRAWAL_WARNING.title}</h3>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--off-white)' }}>
                  {WITHDRAWAL_WARNING.body}
                </p>
                <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginTop: 10 }}>
                  {WITHDRAWAL_WARNING.action}
                </p>
                <a href="tel:18006624357" className="emergency-phone">{WITHDRAWAL_WARNING.phone}</a>
              </div>
            )}

            {/* Timer */}
            <div className="section" ref={timerRef}>
              <Timer />
            </div>

            {/* Activity deck */}
            <div className="section" style={{ borderTop: '1px solid var(--navy-border)', paddingTop: 20 }}>
              {!showDeck ? (
                <button
                  className="btn btn-secondary"
                  style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
                  onClick={() => setShowDeck(true)}
                >
                  🎴 Pick an activity →
                </button>
              ) : (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h2 style={{ fontSize: '1.1rem' }}>Activities</h2>
                    <button
                      onClick={() => setShowDeck(false)}
                      style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'inherit' }}
                    >
                      Hide ▲
                    </button>
                  </div>
                  <ActivityDeck />
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Footer ─────────────────────────────────────────────────────────── */}
        <footer className="footer">
          <p>
            If withdrawal symptoms are present — shaking, sweating, confusion, racing heart — do not white-knuckle it.
            Alcohol withdrawal can be dangerous. Severe symptoms require urgent medical care.
          </p>
          <a href="tel:18006624357" className="emergency-phone">SAMHSA: 1-800-662-4357</a>
          <p style={{ marginTop: 16 }}>This app does not track you. No login. No data stored. No ads.</p>
          <p style={{ marginTop: 8 }}>
            <a href="https://brain-is-fos.vercel.app" style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>
              → Version for other substances
            </a>
          </p>
        </footer>
      </div>
    </>
  );
}
