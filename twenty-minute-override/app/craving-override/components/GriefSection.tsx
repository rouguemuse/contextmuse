'use client';

import { useState } from 'react';
import { GRIEF_STEPS } from '@/lib/content';

export default function GriefSection() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button className="btn btn-warning" onClick={() => setOpen(o => !o)} style={{ marginBottom: open ? 16 : 0 }}>
        {open ? '▲ Close' : 'This is grief, not just craving'}
      </button>

      {open && (
        <div className="animate-in">
          <ul className="grief-steps">
            {GRIEF_STEPS.map((step, i) => (
              <li key={i} className="grief-step">{step}</li>
            ))}
          </ul>

          <div className="card" style={{ marginTop: 16 }}>
            <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--off-white)', lineHeight: 1.7 }}>
              Drinking cannot give them back.
            </p>
            <p style={{ marginTop: 6, fontSize: '0.9rem', color: 'var(--muted)', lineHeight: 1.7 }}>
              It can only take more from you.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
