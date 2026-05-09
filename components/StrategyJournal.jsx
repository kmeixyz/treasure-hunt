'use client';

export default function StrategyJournal({ entries, onClose }) {
  return (
    <div className="journal-overlay" role="dialog" aria-modal="true" aria-label="Strategy Journal">
      <div className="journal-modal">
        <div className="journal-modal__header">
          <div className="journal-modal__title">📓 Strategy Journal</div>
          <button className="journal-modal__close" onClick={onClose} aria-label="Close journal">✕</button>
        </div>

        {entries.length === 0 ? (
          <div className="journal-modal__empty">
            <p>No entries yet.</p>
            <p>Complete a level and fill in your Strategy Log to start your journal!</p>
          </div>
        ) : (
          <ol className="journal-modal__list">
            {entries.map((e, i) => (
              <li key={i} className="journal-modal__entry">
                <span className="journal-modal__entry-meta">
                  {e.levelName} · Entry {i + 1}
                </span>
                <span className="journal-modal__entry-text">"{e.text}"</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
