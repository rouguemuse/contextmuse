'use client';

import { useState, useCallback } from 'react';
import {
  COPING_SKILLS,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  type Category,
} from '@/lib/copingSkills';

const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS) as Category[];

export default function CopingGenerator() {
  const [filter, setFilter]       = useState<Category | 'all'>('all');
  const [current, setCurrent]     = useState<typeof COPING_SKILLS[0] | null>(null);
  const [saved, setSaved]         = useState<typeof COPING_SKILLS>([]);
  const [showSaved, setShowSaved] = useState(false);
  const [history, setHistory]     = useState<number[]>([]);
  const [flipped, setFlipped]     = useState(false);

  const pool = filter === 'all'
    ? COPING_SKILLS
    : COPING_SKILLS.filter(s => s.category === filter);

  const getRandom = useCallback(() => {
    // Avoid repeating recent ones
    const avoidIds = history.slice(-5);
    const available = pool.filter(s => !avoidIds.includes(s.id));
    const source    = available.length > 0 ? available : pool;
    const pick      = source[Math.floor(Math.random() * source.length)];
    setCurrent(pick);
    setHistory(h => [...h.slice(-10), pick.id]);
    setFlipped(false);
    // Small animation re-trigger
    setTimeout(() => setFlipped(true), 10);
  }, [pool, history]);

  const saveSkill = useCallback(() => {
    if (!current) return;
    setSaved(s => s.find(x => x.id === current.id) ? s : [...s, current]);
  }, [current]);

  const removeSkill = useCallback((id: number) => {
    setSaved(s => s.filter(x => x.id !== id));
  }, []);

  const isSaved = current && saved.find(s => s.id === current.id);

  return (
    <div>
      {/* Filter pills */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 6,
        marginBottom: 16,
      }}>
        <button
          className="btn btn-secondary"
          style={{
            padding: '6px 12px',
            fontSize: '0.8rem',
            fontWeight: filter === 'all' ? 700 : 500,
            borderColor: filter === 'all' ? 'var(--teal)' : undefined,
            color: filter === 'all' ? 'var(--teal)' : undefined,
          }}
          onClick={() => setFilter('all')}
        >
          All (100)
        </button>
        {ALL_CATEGORIES.map(cat => (
          <button
            key={cat}
            className="btn btn-secondary"
            style={{
              padding: '6px 10px',
              fontSize: '0.78rem',
              fontWeight: filter === cat ? 700 : 500,
              borderColor: filter === cat ? CATEGORY_COLORS[cat] : undefined,
              color: filter === cat ? CATEGORY_COLORS[cat] : undefined,
            }}
            onClick={() => setFilter(cat)}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Count badge */}
      <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: 14 }}>
        {pool.length} skill{pool.length !== 1 ? 's' : ''} in pool
        {filter !== 'all' && ` · ${CATEGORY_LABELS[filter]}`}
      </p>

      {/* Card */}
      {current ? (
        <div
          style={{
            background: 'var(--navy-card)',
            border: `1px solid ${CATEGORY_COLORS[current.category]}44`,
            borderRadius: 'var(--radius-lg)',
            padding: '22px 20px',
            animation: flipped ? 'fadeIn 0.25s ease' : 'none',
            position: 'relative',
            minHeight: 130,
          }}
        >
          {/* Category badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            padding: '3px 10px',
            borderRadius: 20,
            background: `${CATEGORY_COLORS[current.category]}18`,
            border: `1px solid ${CATEGORY_COLORS[current.category]}44`,
            color: CATEGORY_COLORS[current.category],
            fontSize: '0.75rem',
            fontWeight: 700,
            marginBottom: 14,
          }}>
            {CATEGORY_LABELS[current.category]}
          </div>

          <p style={{
            fontSize: '1.02rem',
            lineHeight: 1.75,
            color: 'var(--off-white)',
            fontWeight: 500,
          }}>
            {current.skill}
          </p>

          {/* Skill number */}
          <div style={{
            position: 'absolute',
            top: 14,
            right: 16,
            fontSize: '0.72rem',
            color: 'var(--muted-dim)',
          }}>
            #{current.id}/100
          </div>

          {/* Crisis links inline */}
          {current.category === 'crisis' && current.id === 96 && (
            <a href="tel:18006624357" style={{
              display: 'inline-block',
              marginTop: 10,
              color: 'var(--danger)',
              fontWeight: 700,
              fontSize: '1rem',
              textDecoration: 'none',
            }}>
              📞 Call 1-800-662-4357
            </a>
          )}
          {current.category === 'crisis' && current.id === 97 && (
            <a href="sms:741741?body=HELLO" style={{
              display: 'inline-block',
              marginTop: 10,
              color: 'var(--danger)',
              fontWeight: 700,
              fontSize: '1rem',
              textDecoration: 'none',
            }}>
              💬 Text HELLO to 741741
            </a>
          )}
        </div>
      ) : (
        <div style={{
          background: 'var(--navy-card)',
          border: '1px solid var(--navy-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '32px 20px',
          textAlign: 'center',
          color: 'var(--muted)',
          fontSize: '0.95rem',
        }}>
          Hit the button. Get a skill. No lecture, just the next thing.
        </div>
      )}

      {/* Action row */}
      <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
        <button
          className="btn btn-primary"
          onClick={getRandom}
          style={{ flex: 2, minWidth: 160, fontSize: '1rem', padding: '14px' }}
        >
          {current ? '🎲 Give me another' : '🎲 Give me a skill'}
        </button>

        {current && (
          <button
            className="btn btn-secondary"
            onClick={saveSkill}
            disabled={!!isSaved}
            style={{
              flex: 1,
              minWidth: 80,
              borderColor: isSaved ? 'var(--teal)' : undefined,
              color: isSaved ? 'var(--teal)' : undefined,
            }}
          >
            {isSaved ? '✓ Saved' : '🔖 Save'}
          </button>
        )}
      </div>

      {/* Saved skills */}
      {saved.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <button
            className="btn btn-ghost"
            style={{ width: '100%', marginBottom: 12 }}
            onClick={() => setShowSaved(s => !s)}
          >
            {showSaved ? '▲ Hide' : '▼ Show'} saved skills ({saved.length})
          </button>

          {showSaved && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {saved.map(s => (
                <div
                  key={s.id}
                  style={{
                    background: 'var(--navy-mid)',
                    border: `1px solid ${CATEGORY_COLORS[s.category]}33`,
                    borderRadius: 'var(--radius)',
                    padding: '12px 14px',
                    display: 'flex',
                    gap: 10,
                    alignItems: 'flex-start',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '0.7rem',
                      color: CATEGORY_COLORS[s.category],
                      fontWeight: 700,
                      marginBottom: 4,
                    }}>
                      {CATEGORY_LABELS[s.category]} · #{s.id}
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text)', lineHeight: 1.6 }}>
                      {s.skill}
                    </p>
                  </div>
                  <button
                    onClick={() => removeSkill(s.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--muted-dim)',
                      cursor: 'pointer',
                      fontSize: '1.1rem',
                      flexShrink: 0,
                      paddingTop: 2,
                    }}
                    aria-label="Remove saved skill"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
