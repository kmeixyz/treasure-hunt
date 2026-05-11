'use client';

import { LEVELS } from '@/lib/levels';

export default function GameComplete({ progress, onMenu }) {
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
        {LEVELS.map((l) => (
          <div className="summary__row" key={l.id}>
            <span>Level {l.id} — {l.name}</span>
            <strong>{'★'.repeat(progress[l.id] || 0)}{'☆'.repeat(l.maxStars - (progress[l.id] || 0))}</strong>
          </div>
        ))}
      </div>
      <button className="btn" onClick={onMenu}>Back to Menu</button>
    </div>
  );
}
