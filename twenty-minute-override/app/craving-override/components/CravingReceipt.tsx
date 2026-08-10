'use client';

import { useState } from 'react';
import { RECEIPT_PROMISES, RECEIPT_OUTCOMES } from '@/lib/content';

export default function CravingReceipt() {
  const [promise, setPromise] = useState('');
  const [outcome, setOutcome] = useState('');

  const ready = promise && outcome;

  return (
    <div>
      <p className="muted text-sm" style={{ marginBottom: 14, lineHeight: 1.7 }}>
        Name what alcohol is offering, then name what actually happens after drink one.
      </p>

      <label htmlFor="receipt-promise" style={{ display: 'block', fontSize: '0.85rem', color: 'var(--muted)', marginBottom: 4 }}>
        What is alcohol promising?
      </label>
      <select
        id="receipt-promise"
        className="receipt-select"
        value={promise}
        onChange={e => setPromise(e.target.value)}
      >
        <option value="">— pick one —</option>
        {RECEIPT_PROMISES.map(p => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>

      <div style={{ height: 14 }} />

      <label htmlFor="receipt-outcome" style={{ display: 'block', fontSize: '0.85rem', color: 'var(--muted)', marginBottom: 4 }}>
        What usually happens after drink one?
      </label>
      <select
        id="receipt-outcome"
        className="receipt-select"
        value={outcome}
        onChange={e => setOutcome(e.target.value)}
      >
        <option value="">— pick one —</option>
        {RECEIPT_OUTCOMES.map(o => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>

      {ready && (
        <div className="receipt-result animate-in">
          The deal being offered is <strong style={{ color: 'var(--teal)' }}>{promise}</strong>{' '}
          in exchange for <strong style={{ color: 'var(--warning)' }}>{outcome}</strong>.<br /><br />
          <span style={{ color: 'var(--off-white)', fontWeight: 600 }}>
            Delay 20 minutes before you accept that deal.
          </span>
        </div>
      )}
    </div>
  );
}
