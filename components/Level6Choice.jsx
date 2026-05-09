'use client';

export default function Level6Choice({ onMaker, onJoin, onBack }) {
  return (
    <div className="choice">
      <button className="hud__back" onClick={onBack} style={{ alignSelf: 'flex-start' }}>← Menu</button>

      <div className="choice__body">
        <div className="choice__eyebrow">~ level 6 ~</div>
        <h2 className="choice__title">Maker Mode</h2>
        <p className="choice__sub">
          You've mastered the maze. Now build one — or play one a friend made.
        </p>

        <div className="choice__cards">
          <button className="choice__card" onClick={onMaker}>
            <span className="choice__card-emoji">✏️</span>
            <span className="choice__card-label">Create a Level</span>
            <span className="choice__card-desc">
              Design your own maze. Set the doors, clues, and move limit — then share the code.
            </span>
          </button>

          <div className="choice__divider">or</div>

          <button className="choice__card" onClick={onJoin}>
            <span className="choice__card-emoji">🔑</span>
            <span className="choice__card-label">Enter a Code</span>
            <span className="choice__card-desc">
              Got a code from a friend? Type it in and take on their maze.
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
