'use client';

import { LEVELS } from '@/lib/levels';

export default function GameComplete({ progress, onMenu }) {
  const total = LEVELS.reduce((s, l) => s + (progress[l.id] || 0), 0);
  const max = LEVELS.length * 3;

  return (
    <div className="finish">
      <div className="finish__chest" aria-hidden="true">🏆</div>
      <h2 className="finish__title">You did it!</h2>
      <p className="finish__msg">
        You started by guessing... and ended by using BINARY SEARCH to crush
        a 20-door maze in just 5 moves. That&apos;s how real algorithms work — they
        cut the problem in half, again and again.
      </p>
      <div className="summary" style={{ marginTop: 8 }}>
        <div className="summary__row">
          <span>Total stars</span>
          <strong>{total} / {max}</strong>
        </div>
        {LEVELS.map((l) => (
          <div className="summary__row" key={l.id}>
            <span>Level {l.id} — {l.name}</span>
            <strong>{'★'.repeat(progress[l.id] || 0)}{'☆'.repeat(3 - (progress[l.id] || 0))}</strong>
          </div>
        ))}
      </div>
      <button className="btn" onClick={onMenu}>Back to Menu</button>
    </div>
  );
}
