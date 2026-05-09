'use client';

import { computeStarsAdvanced } from '@/lib/gameLogic';
import StrategyBuilder from './StrategyBuilder';

function CriteriaStars({ criteria, maxStars, earned }) {
  return (
    <div className="criteria">
      <div className="criteria__total">
        {Array.from({ length: maxStars }).map((_, i) => (
          <span key={i} className={'criteria__star' + (i < earned ? '' : ' criteria__star--off')}>★</span>
        ))}
      </div>
      <div className="criteria__rows">
        {criteria.map((c, i) => (
          <div key={i} className={'criteria__row' + (c.earned ? ' criteria__row--earned' : ' criteria__row--missed')}>
            <span className="criteria__icon" aria-hidden="true">{c.earned ? '⭐' : '☆'}</span>
            <div className="criteria__text">
              <span className="criteria__label">{c.label}</span>
              {c.note && <span className="criteria__note">{c.note}</span>}
            </div>
          </div>
        ))}
      </div>
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

export default function LevelComplete({ result, hasNext, isCustom, onNext, onReplay, onMenu, onJournalAdd, onJournalOpen, journalCount }) {
  const { level, attempts, treasureIndex, status } = result;
  const { stars, maxStars, criteria } = computeStarsAdvanced(attempts, level, status);
  const won = status === 'won';

  return (
    <div className="complete">
      <div className="complete__banner">{won ? '~ level complete ~' : '~ out of moves ~'}</div>
      <h2 className="complete__title">{won ? 'You found it!' : 'So close!'}</h2>

      <CriteriaStars criteria={criteria} maxStars={maxStars} earned={stars} />

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
      </div>

      <Path attempts={attempts} treasureIndex={treasureIndex} doorCount={level.doorCount} />

      {won && !isCustom && (
        <StrategyBuilder
          levelId={level.id}
          levelName={level.name}
          onSave={onJournalAdd}
        />
      )}

      {journalCount > 0 && (
        <button className="btn btn--ghost complete__journal-btn" onClick={onJournalOpen}>
          📓 View Strategy Journal ({journalCount} {journalCount === 1 ? 'entry' : 'entries'})
        </button>
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
