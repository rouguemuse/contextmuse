'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { TASKS, AGENCY_CARDS } from '@/lib/content';

// Map timeLeft → which card to show (based on 20-minute schedule)
function getScheduledIndex(timeLeft: number): number {
  if (timeLeft > 960) return 0; // 20:00 → 16:01
  if (timeLeft > 720) return 1; // 16:00 → 12:01
  if (timeLeft > 480) return 2; // 12:00 → 8:01
  if (timeLeft > 240) return 3; //  8:00 → 4:01
  return 4;                     //  4:00 → 0:00
}

export default function Timer() {
  const [timeLeft, setTimeLeft] = useState(20 * 60);
  const [running,  setRunning]  = useState(false);
  const [done,     setDone]     = useState(false);
  const [task,     setTask]     = useState<string | null>(null);

  // ── Agency card state ──────────────────────────────────────────────────────
  const [cardIndex, setCardIndex] = useState(0);
  const [pinned,    setPinned]    = useState(false);
  const [copied,    setCopied]    = useState(false);
  const [fading,    setFading]    = useState(false);

  const intervalRef        = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevScheduledRef   = useRef(0);

  // Detect reduced-motion preference once on mount
  const reducedMotion = useRef(
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  // ── Countdown ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (running && !done) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) { setRunning(false); setDone(true); return 0; }
          return t - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, done]);

  // ── Auto-rotate card based on time (skipped when pinned) ──────────────────
  useEffect(() => {
    if (!running || pinned) return;
    const scheduled = getScheduledIndex(timeLeft);
    if (scheduled !== prevScheduledRef.current) {
      prevScheduledRef.current = scheduled;
      animateToCard(scheduled);
    }
  }, [timeLeft, running, pinned]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Smooth card transition ─────────────────────────────────────────────────
  const animateToCard = useCallback((idx: number) => {
    if (reducedMotion.current) {
      setCardIndex(idx);
      return;
    }
    setFading(true);
    setTimeout(() => {
      setCardIndex(idx);
      setFading(false);
    }, 250);
  }, []);

  const prevCard = () =>
    animateToCard((cardIndex - 1 + AGENCY_CARDS.length) % AGENCY_CARDS.length);
  const nextCard = () =>
    animateToCard((cardIndex + 1) % AGENCY_CARDS.length);

  const togglePin = () => setPinned(p => !p);

  const copyCard = async () => {
    const card = AGENCY_CARDS[cardIndex];
    const text = `${card.title}\n${card.body}`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(ta);
      ta.focus(); ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // ── Timer controls ─────────────────────────────────────────────────────────
  const start = () => { setDone(false); setRunning(true); };
  const reset = () => {
    setRunning(false); setDone(false);
    setTimeLeft(20 * 60); setTask(null);
    setPinned(false); prevScheduledRef.current = 0;
    animateToCard(0);
  };
  const giveTask = useCallback(() => {
    setTask(TASKS[Math.floor(Math.random() * TASKS.length)]);
  }, []);

  const mins   = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const secs   = (timeLeft % 60).toString().padStart(2, '0');
  const urgent = timeLeft < 120 && !done;
  const card   = AGENCY_CARDS[cardIndex];

  return (
    <div>
      <p className="text-center muted" style={{ marginBottom: 16, fontSize: '0.9rem', lineHeight: 1.7 }}>
        You are not deciding forever.<br />
        You are delaying the first drink.
      </p>

      {/* ── Timer display ───────────────────────────────────────────────── */}
      <div className={`timer-display ${urgent ? 'urgent' : ''} ${done ? 'done' : ''}`}>
        {done ? 'DONE ✓' : `${mins}:${secs}`}
      </div>

      {done && (
        <div className="card-teal animate-in" style={{ marginTop: 16, textAlign: 'center' }}>
          <p style={{ fontWeight: 700, color: 'var(--teal)', fontSize: '1.05rem' }}>
            You made it 20 minutes.
          </p>
          <p style={{ marginTop: 6, fontSize: '0.9rem', color: 'var(--muted)' }}>
            That is the whole thing. Run it again if you need to.
          </p>
        </div>
      )}

      {/* ── Rotating agency card ────────────────────────────────────────── */}
      <div style={{ marginTop: 20, marginBottom: 4 }}>

        {/* Label row */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: 8,
        }}>
          <span style={{
            fontSize: '0.68rem', fontWeight: 700,
            color: 'var(--teal)', letterSpacing: '0.09em', textTransform: 'uppercase',
          }}>
            Reality check
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--muted-dim)' }}>
            Truth card {cardIndex + 1} of {AGENCY_CARDS.length}
          </span>
        </div>

        {/* Card */}
        <div style={{
          background: 'var(--navy-card)',
          border: '1px solid var(--navy-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '18px 20px',
          minHeight: 88,
          opacity: fading ? 0 : 1,
          transition: reducedMotion.current ? 'none' : 'opacity 0.25s ease',
        }}>
          <p style={{
            fontWeight: 700, color: 'var(--off-white)',
            fontSize: '1rem', lineHeight: 1.5, marginBottom: 6,
          }}>
            {card.title}
          </p>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.65 }}>
            {card.body}
          </p>
        </div>

        {/* Card controls */}
        <div style={{ display: 'flex', gap: 7, marginTop: 9, flexWrap: 'wrap' }}>
          <button
            className="btn btn-secondary"
            onClick={prevCard}
            style={{ flex: 1, padding: '8px 8px', fontSize: '0.8rem', minWidth: 52 }}
            aria-label="Previous card"
          >
            ← Prev
          </button>
          <button
            className="btn btn-secondary"
            onClick={nextCard}
            style={{ flex: 1, padding: '8px 8px', fontSize: '0.8rem' }}
            aria-label="Next card"
          >
            Next →
          </button>
          <button
            className="btn btn-secondary"
            onClick={togglePin}
            style={{
              flex: 1, padding: '8px 8px', fontSize: '0.8rem',
              borderColor: pinned ? 'var(--teal)' : undefined,
              color:       pinned ? 'var(--teal)' : undefined,
            }}
            aria-label={pinned ? 'Unpin card' : 'Pin this card'}
          >
            {pinned ? '📌 Pinned' : '📌 Pin'}
          </button>
          <button
            className="btn btn-secondary"
            onClick={copyCard}
            style={{
              flex: 1, padding: '8px 8px', fontSize: '0.8rem',
              borderColor: copied ? 'var(--teal)' : undefined,
              color:       copied ? 'var(--teal)' : undefined,
            }}
            aria-label="Copy card text"
          >
            {copied ? '✓ Copied' : '📋 Copy'}
          </button>
        </div>

        {/* Feedback microcopy */}
        {pinned && (
          <p style={{ fontSize: '0.74rem', color: 'var(--teal)', marginTop: 7, textAlign: 'center' }}>
            Pinned. This one stays.
          </p>
        )}
        {copied && (
          <p style={{ fontSize: '0.74rem', color: 'var(--teal)', marginTop: 7, textAlign: 'center' }}>
            Copied. Keep it where you can see it.
          </p>
        )}
        {!pinned && running && !copied && (
          <p style={{ fontSize: '0.7rem', color: 'var(--muted-dim)', marginTop: 5, textAlign: 'center' }}>
            Cards change as the timer runs. Pin to hold one.
          </p>
        )}
      </div>

      {/* ── Timer controls ──────────────────────────────────────────────── */}
      <div className="timer-row">
        {!running && !done && (
          <button className="btn btn-primary" onClick={start} style={{ fontSize: '1rem', padding: '14px' }}>
            Start 20 Minutes
          </button>
        )}
        {running && (
          <button className="btn btn-secondary" onClick={() => setRunning(false)} style={{ flex: 1 }}>
            Pause
          </button>
        )}
        {!running && timeLeft < 20 * 60 && !done && (
          <button className="btn btn-secondary" onClick={() => setRunning(true)} style={{ flex: 1 }}>
            Resume
          </button>
        )}
        <button className="btn btn-secondary" onClick={reset} style={{ flex: running ? 1 : 'none', minWidth: 90 }}>
          Reset
        </button>
        <button className="btn btn-ghost" onClick={giveTask} style={{ flex: 1 }}>
          One task
        </button>
      </div>

      {task && (
        <div className="task-pill">
          → {task}
        </div>
      )}
    </div>
  );
}
