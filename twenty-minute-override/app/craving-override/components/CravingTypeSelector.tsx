'use client';

import { useState } from 'react';
import { CRAVING_TYPES, WITHDRAWAL_WARNING } from '@/lib/content';

interface Props {
  onSelect: (type: string) => void;
  selected: string | null;
}

export default function CravingTypeSelector({ onSelect, selected }: Props) {
  return (
    <div>
      <div className="btn-grid">
        {CRAVING_TYPES.map(ct => (
          <button
            key={ct.id}
            className={`btn ${selected === ct.id ? 'btn-ghost' : 'btn-secondary'} ${ct.id === 'withdrawal' ? 'full-width btn-danger' : ''}`}
            onClick={() => onSelect(ct.id)}
            style={selected === ct.id ? { borderColor: 'var(--teal)', color: 'var(--teal)' } : {}}
          >
            {ct.label}
          </button>
        ))}
      </div>

      {selected === 'withdrawal' && (
        <div className="card-warning animate-in" style={{ marginTop: 16 }}>
          <h3 style={{ color: 'var(--warning)', marginBottom: 8, fontSize: '1rem' }}>
            ⚠️ {WITHDRAWAL_WARNING.title}
          </h3>
          <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--off-white)' }}>
            {WITHDRAWAL_WARNING.body}
          </p>
          <div style={{ marginTop: 12 }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>{WITHDRAWAL_WARNING.action}</p>
            <a href={`tel:18006624357`} className="emergency-phone">
              {WITHDRAWAL_WARNING.phone}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
