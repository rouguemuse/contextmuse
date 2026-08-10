'use client';

import { REPLACEMENT_DRINKS } from '@/lib/content';

export default function ReplacementDrinks() {
  return (
    <div>
      <p className="muted text-sm" style={{ marginBottom: 16, lineHeight: 1.7 }}>
        You are replacing the ritual, not just the liquid. The cold glass, the pour, the first sip — that&apos;s the behavior. Give it something.
      </p>
      <div className="drink-grid">
        {REPLACEMENT_DRINKS.map(d => (
          <div key={d.name} className="drink-card">
            <span className="drink-emoji">{d.emoji}</span>
            <span>{d.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
