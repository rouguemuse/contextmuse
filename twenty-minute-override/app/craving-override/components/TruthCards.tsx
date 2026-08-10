'use client';

import { useState } from 'react';
import { TRUTH_CARDS } from '@/lib/content';

export default function TruthCards() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent(i => (i - 1 + TRUTH_CARDS.length) % TRUTH_CARDS.length);
  const next = () => setCurrent(i => (i + 1) % TRUTH_CARDS.length);

  const card = TRUTH_CARDS[current];

  return (
    <div>
      <div
        className="truth-deck"
        style={{ position: 'relative', height: 'auto', minHeight: 140, cursor: 'pointer' }}
      >
        <div
          className="truth-card"
          onClick={next}
          style={{
            position: 'relative',
            background: 'var(--navy-mid)',
            border: '1px solid var(--navy-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '22px 20px',
            minHeight: 140,
          }}
        >
          {card.title && (
            <p style={{ fontWeight: 800, color: 'var(--off-white)', fontSize: '1rem', lineHeight: 1.4, marginBottom: 8 }}>
              {card.title}
            </p>
          )}
          <p style={{
            fontSize: card.title ? '0.9rem' : '1.05rem',
            fontWeight: card.title ? 400 : 600,
            lineHeight: 1.65,
            color: card.title ? 'var(--muted)' : 'var(--off-white)',
          }}>
            {card.body}
          </p>
          <span style={{
            position: 'absolute', bottom: 12, right: 16,
            fontSize: '0.72rem', color: 'var(--muted-dim)',
          }}>
            tap →
          </span>
        </div>
      </div>

      {/* Dot navigation */}
      <div className="truth-nav" style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 12 }}>
        {TRUTH_CARDS.map((_, i) => (
          <button
            key={i}
            className={`truth-dot ${i === current ? 'active' : ''}`}
            onClick={() => setCurrent(i)}
            aria-label={`Truth card ${i + 1}`}
            style={{
              border: 'none', cursor: 'pointer', padding: 0,
              background: i === current ? 'var(--teal)' : 'var(--navy-border)',
              borderRadius: '50%', width: 6, height: 6,
            }}
          />
        ))}
      </div>

      <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--muted-dim)', marginTop: 6 }}>
        {current + 1} of {TRUTH_CARDS.length}
      </p>
    </div>
  );
}
