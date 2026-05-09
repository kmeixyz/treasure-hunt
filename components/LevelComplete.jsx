'use client';

import { useState } from 'react';

// Reflection prompt depends on the level so the question matches what
// they just learned. The "best" answer is gently highlighted *after* they
// pick, never before — we want them to think first.
const REFLECTIONS = {
  1: {
    q: 'Without clues, what was your strategy?',
    options: [
      { text: 'I just guessed randomly.',                   coach: "Yeah — without clues, every guess is a coin flip. Let's see what happens when the doors give us hints!" },
      { text: 'I went door by door from one end.',          coach: "Smart! That's called a LINEAR SEARCH. It always works — but it can take a lot of moves." },
      { text: 'I picked the middle and worked outward.',    coach: "Interesting! Position-based strategies become much more powerful when you have clues. Coming up next..." },
    ],
  },
  2: {
    q: 'When the door said COLD, what did you do?',
    options: [
      { text: 'I tried a door far away from that one.',     coach: "Exactly! Cold means 'far' — so jumping somewhere new is way faster than checking the next door." },
      { text: 'I tried the door right next to it.',         coach: 'Hmm — when a door is COLD, the treasure is FAR away. Skipping further next time will save moves!' },
      { text: 'I ignored the clue.',                        coach: 'The clues are everything! Each one cuts the maze in half. Try listening next round.' },
    ],
  },
  3: {
    q: 'When the ghost said "treasure is to the LEFT", you knew...',
    options: [
      { text: 'every door to the right could be ignored.',  coach: "💡 That's the BIG idea: one clue eliminates HALF the doors. That's BINARY SEARCH!" },
      { text: 'to try the door right next to it.',          coach: "You can do better. The clue tells you EVERY door on the wrong side is wrong — skip them all!" },
      { text: 'to check every door to the left in order.',  coach: 'Try this: pick the MIDDLE of the remaining doors. One clue, half eliminated. Repeat. That is binary search!' },
    ],
  },
  4: {
    q: 'How did you survive the move limit?',
    options: [
      { text: 'I always picked the middle of what was left.', coach: '🎯 You used BINARY SEARCH. Every guess cut the problem in half — that\'s why 5 moves can solve 20 (or 1000!) doors.' },
      { text: 'I tried doors near my last guess.',            coach: 'Close! The trick is to pick the MIDDLE of what\'s left, not just nearby. That doubles your speed.' },
      { text: 'I got lucky.',                                  coach: 'Try again! Aim for the middle of the remaining doors each time. With clues, you can ALWAYS finish in 5 or fewer.' },
    ],
  },
};

function Stars({ count }) {
  return (
    <div className="stars" aria-label={`${count} of 3 stars`}>
      {[0, 1, 2].map((i) => (
        <span key={i} className={'stars__one' + (i < count ? '' : ' stars__one--off')}>★</span>
      ))}
    </div>
  );
}

function Path({ attempts, treasureIndex, doorCount }) {
  return (
    <div className="path">
      <div className="path__title">Your path through the maze</div>
      <div className="path__row">
        {attempts.map((a, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span
              className={'path__step' + (a.feedback.kind === 'found' ? ' path__step--found' : '')}
              style={a.feedback.color && a.feedback.kind !== 'found'
                ? { background: a.feedback.color, color: '#FFF8EC', borderColor: 'rgba(0,0,0,0.2)' }
                : undefined}
            >
              #{a.doorIndex + 1}
            </span>
            {i < attempts.length - 1 && <span className="path__arrow">→</span>}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 10, fontFamily: 'Caveat, cursive', fontSize: '1.05rem', color: 'var(--ink-soft)' }}>
        Treasure was behind door <strong style={{ color: 'var(--gold-deep)' }}>#{treasureIndex + 1}</strong> · {doorCount} doors total
      </div>
    </div>
  );
}

export default function LevelComplete({ result, hasNext, isCustom, onNext, onReplay, onMenu }) {
  const { level, attempts, treasureIndex, status, stars } = result;
  const [picked, setPicked] = useState(null);
  // Custom levels have no reflection prompt.
  const reflection = isCustom ? null : REFLECTIONS[level.id];

  const won = status === 'won';

  return (
    <div className="complete">
      <div className="complete__banner">{won ? '~ level complete ~' : '~ out of moves ~'}</div>
      <h2 className="complete__title">{won ? 'You found it!' : 'So close!'}</h2>
      <Stars count={stars} />

      <div className="summary">
        {isCustom && level.code && (
          <div className="summary__row">
            <span>Room code</span>
            <strong style={{ fontFamily: 'Caveat, cursive', fontSize: '1.3rem', letterSpacing: 1 }}>{level.code}</strong>
          </div>
        )}
        <div className="summary__row">
          <span>Moves used</span>
          <strong>{attempts.length}</strong>
        </div>
        <div className="summary__row">
          <span>Doors in maze</span>
          <strong>{level.doorCount}</strong>
        </div>
        {level.moveLimit && (
          <div className="summary__row">
            <span>Move limit</span>
            <strong>{level.moveLimit}</strong>
          </div>
        )}
        <div className="summary__row">
          <span>Best possible</span>
          <strong>{level.perfectMoves} {level.perfectMoves === 1 ? 'move' : 'moves'}</strong>
        </div>
      </div>

      <Path attempts={attempts} treasureIndex={treasureIndex} doorCount={level.doorCount} />

      {reflection && (
        <div className="reflect">
          <div className="reflect__q">{reflection.q}</div>
          <div className="reflect__opts">
            {reflection.options.map((opt, i) => (
              <button
                key={i}
                className={'reflect__opt' + (picked === i ? ' reflect__opt--picked' : '')}
                onClick={() => setPicked(i)}
              >
                {opt.text}
              </button>
            ))}
          </div>
          {picked !== null && (
            <div className="reflect__hint">{reflection.options[picked].coach}</div>
          )}
        </div>
      )}

      <div className="complete__actions">
        <button className="btn btn--ghost" onClick={onMenu}>Menu</button>
        <button className="btn btn--ghost" onClick={onReplay}>Try Again</button>
        {!isCustom && won && hasNext && (
          <button className="btn btn--gold" onClick={onNext}>Next Level →</button>
        )}
        {!isCustom && won && !hasNext && (
          <button className="btn btn--gold" onClick={onNext}>See Final Screen →</button>
        )}
      </div>
    </div>
  );
}
