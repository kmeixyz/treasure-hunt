'use client';

import { LEVELS } from '@/lib/levels';

function Stars({ count, max = 3 }) {
  return (
    <div className="level-card__stars">
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={'level-card__star' + (i < count ? '' : ' level-card__star--off')}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function StartScreen({ onStart, progress, onLevel6 }) {
  const level5Done = (progress[5] || 0) > 0;

  return (
    <div className="start">
      <div className="start__eyebrow">~ a tiny adventure ~</div>
      <h1 className="start__title">Treasure Hunt</h1>

      <div className="start__map" aria-hidden="true">
        <div className="start__map-door" />
        <div className="start__map-door" />
        <div className="start__map-door" />
        <div className="start__map-door" />
        <div className="start__map-door" />
      </div>

      <p className="start__sub">
        Somewhere in this maze, a treasure is hidden. Pick a door, listen to the clues,
        and try to find it in as few moves as you can.
      </p>

      <div className="level-grid">
        {LEVELS.map((level, i) => {
          const earned = progress[level.id] || 0;
          const previous = i === 0 ? 3 : (progress[LEVELS[i - 1].id] || 0);
          const locked = i > 0 && previous === 0;
          return (
            <button
              key={level.id}
              className="level-card"
              disabled={locked}
              onClick={() => !locked && onStart(level.id)}
              aria-label={`Start level ${level.id}: ${level.name}`}
            >
              <div className="level-card__num">LEVEL {level.id}</div>
              <div className="level-card__name">{level.name}</div>
              <div className="level-card__sub">{level.subtitle}</div>
              {locked
                ? <div className="level-card__lock" aria-label="Locked">🔒</div>
                : <Stars count={earned} max={level.maxStars ?? 3} />}
            </button>
          );
        })}

        {/* Level 6 — Maker Mode, unlocked after Level 5 */}
        <button
          className={'level-card level-card--maker' + (level5Done ? '' : ' level-card--maker-locked')}
          disabled={!level5Done}
          onClick={() => level5Done && onLevel6()}
          aria-label="Level 6: Maker Mode"
        >
          <div className="level-card__num">LEVEL 6</div>
          <div className="level-card__name">Maker Mode</div>
          <div className="level-card__sub">Build your own maze or join a friend's.</div>
          {level5Done
            ? <div className="level-card__lock" aria-label="Unlocked" style={{ fontSize: '1.2rem' }}>✏️</div>
            : <div className="level-card__lock" aria-label="Locked">🔒</div>}
        </button>
      </div>
    </div>
  );
}
