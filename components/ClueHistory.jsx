'use client';

// Small strip of all attempts so far. Helps players see their own pattern
// while they're still inside the level.
export default function ClueHistory({ attempts }) {
  if (attempts.length === 0) return null;

  return (
    <div className="history">
      <div className="history__title">YOUR CLUES SO FAR</div>
      <div className="history__row">
        {attempts.map((a, i) => (
          <span
            key={i}
            className="history__chip"
            style={{ background: a.feedback.color ? withAlpha(a.feedback.color, 0.18) : undefined }}
          >
            <span className="history__chip-num">{a.doorIndex + 1}</span>
            {a.feedback.kind === 'direction' && a.feedback.key === 'left' && '← LEFT'}
            {a.feedback.kind === 'direction' && a.feedback.key === 'right' && 'RIGHT →'}
            {a.feedback.kind === 'distance' && a.feedback.label}
            {a.feedback.kind === 'empty' && 'empty'}
            {a.feedback.kind === 'found' && '💎 FOUND!'}
          </span>
        ))}
      </div>
    </div>
  );
}

function withAlpha(hex, alpha) {
  // Quick #RRGGBB → rgba helper.
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  const r = (n >> 16) & 0xff;
  const g = (n >> 8) & 0xff;
  const b = n & 0xff;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
