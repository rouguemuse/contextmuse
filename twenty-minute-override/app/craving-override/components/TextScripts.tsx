'use client';

import { useState } from 'react';
import { TEXT_SCRIPTS } from '@/lib/content';

export default function TextScripts() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyText = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 3000);
    } catch {
      // Fallback for older mobile browsers
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(id);
      setTimeout(() => setCopied(null), 3000);
    }
  };

  return (
    <div>
      <p className="muted text-sm" style={{ marginBottom: 14, lineHeight: 1.7 }}>
        You do not have to explain yourself. Just copy and send.
      </p>
      {TEXT_SCRIPTS.map(script => (
        <div key={script.id} className="script-card">
          <p className="script-text">"{script.text}"</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              className={`copy-btn ${copied === script.id ? 'copied' : ''}`}
              onClick={() => copyText(script.id, script.text)}
              aria-label={`Copy: ${script.label}`}
            >
              {copied === script.id ? '✓ Copied' : `📋 ${script.label}`}
            </button>
            {copied === script.id && (
              <span className="copy-confirm animate-in">Send it now.</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
