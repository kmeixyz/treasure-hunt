'use client';

import { LEVELS } from '@/lib/levels';

export default function GameComplete({ progress, onMenu, onMaker, onRetry }) {
  const total = LEVELS.reduce((s, l) => s + (progress[l.id] || 0), 0);
  const max = LEVELS.reduce((s, l) => s + l.maxStars, 0);

  return (
    <div className="finish">
      <div className="finish__chest" aria-hidden="true">🏆</div>
      <h2 className="finish__title">You did it!</h2>
      <p className="finish__msg">
        You started by opening doors randomly and ended by using BINARY SEARCH to beat
        a 100-door maze in just 7 moves. This is an example of how real algorithms work — they
        split the problem in half over and over until the answer is the only thing left.
      </p>
      <div className="summary" style={{ marginTop: 8 }}>
        <div className="summary__row">
          <span>Total stars</span>
          <strong>{total} / {max}</strong>
        </div>
        {LEVELS.map((l) => {
          const earned = progress[l.id] || 0;
          const isPerfect = earned >= l.maxStars;
          return (
            <div className="summary__row" key={l.id}>
              <span>Level {l.id} — {l.name}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {!isPerfect && (
                  <button
                    className="btn btn--ghost"
                    style={{ padding: '2px 10px', fontSize: '0.75rem' }}
                    onClick={() => onRetry(l.id)}
                  >
                    Retry
                  </button>
                )}
                <strong>{'★'.repeat(earned)}{'☆'.repeat(l.maxStars - earned)}</strong>
              </span>
            </div>
          );
        })}
      </div>
      <div className="finish__next" style={{ marginTop: 24, textAlign: 'center' }}>
        <p style={{ marginBottom: 8, fontWeight: 600 }}>Level 6 — Maker Mode</p>
        <p style={{ marginBottom: 12, fontSize: '0.9rem', color: '#64748b' }}>
          Now build your own maze and challenge a friend!
        </p>
        <button className="btn" onClick={onMaker}>Enter Maker Mode →</button>
      </div>
      <button className="btn btn--ghost" onClick={onMenu} style={{ marginTop: 10 }}>Back to Menu</button>
    </div>
  );
}
