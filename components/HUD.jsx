'use client';

export default function HUD({ level, moves, onBack }) {
  const remaining = level.moveLimit ? level.moveLimit - moves : null;
  const warn = remaining !== null && remaining <= 2;

  return (
    <div className="hud">
      <button className="hud__back" onClick={onBack} aria-label="Back to menu">← Menu</button>

      <div className="hud__title">
        <span>LEVEL {level.id}</span>{level.name}
      </div>

      <div className="hud__stats">
        <div className="hud__stat">
          <div className="hud__stat-label">Moves</div>
          <div className="hud__stat-value">{moves}</div>
        </div>
        {level.moveLimit && (
          <div className={'hud__stat' + (warn ? ' hud__stat--warn' : '')}>
            <div className="hud__stat-label">Left</div>
            <div className="hud__stat-value">{Math.max(0, remaining)}</div>
          </div>
        )}
      </div>
    </div>
  );
}
